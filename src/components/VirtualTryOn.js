import React, { useState, useEffect } from 'react';
import './VirtualTryOn.css';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner.js';
import UploadSection from './VirtualTryOn/UploadSection.js';

const VirtualTryOn = () => {
    const [modelImage, setModelImage] = useState(null);
    const [clothImage, setClothImage] = useState(null);
    const [resultImage, setResultImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [completed, setCompleted] = useState(false);

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    // Reset state when images change
    useEffect(() => {
        // Only reset state when model/cloth images change
        if (modelImage || clothImage) {
            if (error) setError(null);
            if (completed) setCompleted(false);
            if (resultImage) setResultImage(null);
            console.log('Images changed, resetting state');
        }
    }, [modelImage, clothImage]);

    const handleModelImageUpload = (imageData) => {
        setModelImage(imageData);
        console.log("Model image updated:", imageData ? "✓" : "✗", imageData ? imageData.substring(0, 30) + "..." : "");
    };

    const handleClothImageUpload = (imageData) => {
        setClothImage(imageData);
        console.log("Cloth image updated:", imageData ? "✓" : "✗", imageData ? imageData.substring(0, 30) + "..." : "");
    };

    // Get the full image URL including the data prefix if needed
    const getFullImageUrl = () => {
        if (!resultImage) return '';
        return resultImage.startsWith('data:') ? resultImage : `data:image/jpeg;base64,${resultImage}`;
    };

    // Model upload tips
    const modelTips = (
        <div className="upload-tips">
            <h4>Tips for model photo:</h4>
            <ul>
                <li>Use a full-body photo with neutral background</li>
                <li>Stand in a neutral pose with your arms slightly away from your body</li>
                <li>Ensure good lighting for clear visibility</li>
                <li>Face the camera directly for best results</li>
            </ul>
        </div>
    );

    // Clothing upload tips
    const clothingTips = (
        <div className="upload-tips">
            <h4>Tips for clothing photo:</h4>
            <ul>
                <li>Use a flat, wrinkle-free garment</li>
                <li>Photograph against a contrasting background</li>
                <li>Ensure the entire garment is visible</li>
                <li>Avoid shadows or glare on the fabric</li>
                <li>Choose high-resolution images for best results</li>
            </ul>
        </div>
    );

    const handleTryOn = async () => {
        if (!modelImage || !clothImage) {
            setError("Please upload both a model and a clothing image");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Prepare the data - remove the data:image/jpeg;base64, part
            const modelData = modelImage.split(',')[1];
            const clothData = clothImage.split(',')[1];

            // First approach: Send JSON data
            try {
                const response = await axios.post(`${apiUrl}/api/try-on`, {
                    model_image: modelData,
                    cloth_image: clothData
                }, {
                    responseType: 'json',
                    timeout: 300000, // 5 minute timeout for processing
                });
                
                console.log('API Response:', response.data);
                
                if (response.data && response.data.result_image) {
                    console.log('Got base64 image from API');
                    setResultImage(response.data.result_image);
                    setCompleted(true);
                    console.log('Result image set and completed = true');
                } else if (response.data && response.data.image_url) {
                    // If we only got a URL, we need to display it
                    console.log('Got image URL from API:', response.data.image_url);
                    setResultImage(response.data.image_url);
                    setCompleted(true);
                    console.log('Result image URL set and completed = true');
                } else {
                    console.error('No image data in API response:', response.data);
                    throw new Error('No image data in response');
                }
            } catch (jsonError) {
                console.error('JSON approach failed:', jsonError);
                
                // Fallback to FormData approach
                const formData = new FormData();
                
                // Convert base64 to blob for the API
                const modelBlob = await fetch(modelImage).then(r => r.blob());
                const clothBlob = await fetch(clothImage).then(r => r.blob());
                
                formData.append('person_image', modelBlob);
                formData.append('cloth_image', clothBlob);
                
                console.log('Trying FormData approach...');
                const formResponse = await axios.post(`${apiUrl}/api/try-on`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    responseType: 'json',
                    timeout: 300000, // 5 minute timeout
                });
                
                console.log('FormData API Response:', formResponse.data);
                
                if (formResponse.data && formResponse.data.result_image) {
                    console.log('Got base64 image from FormData API');
                    setResultImage(formResponse.data.result_image);
                    setCompleted(true);
                    console.log('Result image set and completed = true (FormData)');
                } else if (formResponse.data && formResponse.data.image_url) {
                    console.log('Got image URL from FormData API:', formResponse.data.image_url);
                    setResultImage(formResponse.data.image_url);
                    setCompleted(true);
                    console.log('Result image URL set and completed = true (FormData)');
                } else {
                    console.error('No image data in FormData API response:', formResponse.data);
                    throw new Error('No image data in response');
                }
            }
        } catch (err) {
            console.error('Error in try-on process:', err);
            setError(err.response?.data?.message || "Failed to process images. Please try again.");
        } finally {
            setLoading(false);
            console.log('Loading set to false, current state:', { 
                loading: false, 
                completed, 
                hasResultImage: !!resultImage, 
                error 
            });
        }
    };

    // Handle download image
    const handleDownload = () => {
        if (!resultImage) return;
        
        const link = document.createElement('a');
        // Handle both URL and base64 image formats using our helper function
        link.href = getFullImageUrl();
        link.download = 'virtual-tryon-result.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="virtual-tryon-content">
            <div className="upload-container">
                <div className="upload-box">
                    <h3>Your Photo</h3>
                    <UploadSection 
                        onImageUpload={handleModelImageUpload}
                        customTips={modelTips}
                    />
                    {modelImage && <div className="upload-status success">✓ Image uploaded</div>}
                </div>
                
                <div className="upload-box">
                    <h3>Clothing Item</h3>
                    <UploadSection 
                        onImageUpload={handleClothImageUpload} 
                        customTips={clothingTips}
                    />
                    {clothImage && <div className="upload-status success">✓ Image uploaded</div>}
                </div>
            </div>
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            
            <button 
                className="try-on-button" 
                onClick={handleTryOn}
                disabled={!modelImage || !clothImage || loading}
            >
                {loading ? 'Processing...' : 'Try It On'}
            </button>
            
            {loading && (
                <div className="loading-container">
                    <LoadingSpinner />
                    <p>Processing images... This may take a minute.</p>
                </div>
            )}
            
            {completed && resultImage && (
                <div className="result-container">
                    <h3>Your Virtual Try-On Result is Ready!</h3>
                    <p>Your image has been successfully processed and is ready to download.</p>
                    <button 
                        className="download-button primary-button" 
                        onClick={handleDownload}
                    >
                        Download Result Image
                    </button>
                </div>
            )}
        </div>
    );
};

export default VirtualTryOn; 