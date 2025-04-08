import React, { useState, useRef, useEffect } from 'react';
import './VirtualTryOn.css';
import UploadSection from './VirtualTryOn/UploadSection.js';

const VirtualTryOn = () => {
    const [modelImage, setModelImage] = useState(null);
    const [clothImage, setClothImage] = useState(null);
    const [resultImage, setResultImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const iframeRef = useRef(null);

    const handleModelImageUpload = (imageData) => {
        setModelImage(imageData);
    };

    const handleClothImageUpload = (imageData) => {
        setClothImage(imageData);
    };

    const handleTryOn = async (e) => {
        e.preventDefault();
        if (!modelImage || !clothImage) {
            setError('Please upload both model and cloth images');
            return;
        }

        setLoading(true);
        setError(null);
        setResultImage(null);

        const formData = new FormData();
        
        // Convert base64 to blob for the API
        const modelBlob = await fetch(modelImage).then(r => r.blob());
        const clothBlob = await fetch(clothImage).then(r => r.blob());
        
        formData.append('person_image', modelBlob);
        formData.append('cloth_image', clothBlob);

        try {
            const response = await fetch('http://localhost:5000/api/try-on', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log("API Response:", data);

            if (response.ok) {
                if (data.result_image) {
                    console.log("Got base64 image");
                    setResultImage(data.result_image);
                } 
                else if (data.image_url) {
                    console.log("Got image URL:", data.image_url);
                    setResultImage(data.image_url);
                } 
                else {
                    setError('No image was returned from the API');
                }
            } else {
                setError(data.error || 'Failed to process images');
            }
        } catch (err) {
            console.error("API Error:", err);
            setError('Failed to connect to the server');
        } finally {
            setLoading(false);
        }
    };

    // Effect to update iframe content when resultImage changes
    useEffect(() => {
        if (resultImage && iframeRef.current) {
            const iframe = iframeRef.current;
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            
            iframeDoc.open();
            iframeDoc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            background-color: #ffffff;
                        }
                        img {
                            max-width: 100%;
                            max-height: 100vh;
                            object-fit: contain;
                        }
                    </style>
                </head>
                <body>
                    <img src="data:image/jpeg;charset=utf-8;base64,${resultImage}" alt="Try-on Result" />
                </body>
                </html>
            `);
            iframeDoc.close();
        }
    }, [resultImage]);

    // Handle download image
    const handleDownload = () => {
        if (resultImage) {
            const downloadLink = document.createElement('a');
            downloadLink.href = `data:image/jpeg;base64,${resultImage}`;
            downloadLink.download = 'try-on-result.jpg';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    return (
        <div className="virtual-try-on-container">
            <h2>Virtual Try-On</h2>

            <div className="main-content">
                <div className="try-on-form">
                    <div className="upload-sections">
                        <div className="upload-section-wrapper">
                            <h3>Your Photo</h3>
                            <UploadSection onImageUpload={handleModelImageUpload} />
                        </div>
                        
                        <div className="upload-section-wrapper">
                            <h3>Clothing Item</h3>
                            <UploadSection onImageUpload={handleClothImageUpload} />
                        </div>
                    </div>
                    
                    <button
                        onClick={handleTryOn}
                        disabled={loading || !modelImage || !clothImage}
                        className="try-on-button"
                    >
                        {loading ? 'Processing...' : 'Try On'}
                    </button>
                    {error && <div className="error-message">{error}</div>}
                </div>
                
                {loading && (
                    <div className="loading-message">
                        Processing... This may take a few moments.
                    </div>
                )}
                
                {resultImage && (
                    <div id="result" className="result-section">
                        <h2>Result:</h2>
                        <div className="iframe-container">
                            <iframe 
                                ref={iframeRef}
                                title="Try-on Result"
                                className="result-iframe"
                                sandbox="allow-same-origin"
                            />
                        </div>
                        <button 
                            className="download-button" 
                            onClick={handleDownload}
                        >
                            Download Image
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VirtualTryOn; 