import React, { useState } from 'react';
import './VirtualTryOn.css';

const VirtualTryOn = () => {
    const [modelImage, setModelImage] = useState(null);
    const [clothImage, setClothImage] = useState(null);
    const [resultImage, setResultImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [debugInfo, setDebugInfo] = useState(null);
    const [showDebug, setShowDebug] = useState(false);

    const handleModelImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setModelImage(e.target.files[0]);
        }
    };

    const handleClothImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setClothImage(e.target.files[0]);
        }
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
        setDebugInfo(null);

        const formData = new FormData();
        formData.append('person_image', modelImage);
        formData.append('cloth_image', clothImage);

        try {
            const response = await fetch('http://localhost:5000/api/try-on', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setDebugInfo(JSON.stringify(data, null, 2));
            console.log("API Response:", data);

            if (response.ok) {
                if (data.result_image) {
                    console.log("Got base64 image");
                    
                    // Make sure the base64 data is clean (no whitespace)
                    const cleanBase64 = data.result_image.replace(/\s/g, '');
                    
                    // Create a complete data URL
                    const imageUrl = `data:image/jpeg;base64,${cleanBase64}`;
                    console.log("Image URL created with length:", imageUrl.length);
                    
                    // Update state with the image URL
                    setResultImage(imageUrl);
                    
                    // Automatically download the image
                    const downloadLink = document.createElement('a');
                    downloadLink.href = imageUrl;
                    downloadLink.download = 'try-on-result.jpg';
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                } 
                else if (data.image_url) {
                    console.log("Got image URL:", data.image_url);
                    setResultImage(data.image_url);
                } 
                else {
                    setError('No image was returned from the API');
                    setShowDebug(true);
                }
            } else {
                setError(data.error || 'Failed to process images');
                setShowDebug(true);
            }
        } catch (err) {
            console.error("API Error:", err);
            setError('Failed to connect to the server');
            setDebugInfo(err.message);
            setShowDebug(true);
        } finally {
            setLoading(false);
        }
    };

    const toggleDebugInfo = () => {
        setShowDebug(!showDebug);
    };

    return (
        <div className="virtual-try-on-container">
            <h2>Virtual Try-On</h2>

            <div className="main-content">
                <div className="try-on-form">
                    <div className="image-upload-section">
                        <div className="upload-group">
                            <label htmlFor="model-image">Model Image:</label>
                            <input
                                type="file"
                                id="model-image"
                                accept="image/jpeg,image/jpg,image/png"
                                onChange={handleModelImageChange}
                            />
                            {modelImage && (
                                <div className="preview-container">
                                    <img
                                        src={URL.createObjectURL(modelImage)}
                                        alt="Model preview"
                                        className="preview-image"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="upload-group">
                            <label htmlFor="cloth-image">Cloth Image:</label>
                            <input
                                type="file"
                                id="cloth-image"
                                accept="image/jpeg,image/jpg,image/png"
                                onChange={handleClothImageChange}
                            />
                            {clothImage && (
                                <div className="preview-container">
                                    <img
                                        src={URL.createObjectURL(clothImage)}
                                        alt="Cloth preview"
                                        className="preview-image"
                                    />
                                </div>
                            )}
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
                        
                        {/* Direct iframe embedding to ensure image display */}
                        <div style={{ 
                            width: '100%', 
                            height: '500px', 
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            backgroundColor: '#f8f8f8',
                            overflow: 'hidden' 
                        }}>
                            <iframe 
                                src={resultImage} 
                                title="Try-on Result"
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    border: 'none',
                                    display: 'block'
                                }}
                            />
                        </div>
                        
                        <p>
                            <a 
                                className="download-link" 
                                href={resultImage} 
                                download="try-on-result.jpg"
                            >
                                Download Image
                            </a>
                        </p>
                        
                        <span 
                            className="debug-toggle" 
                            onClick={toggleDebugInfo}
                        >
                            Toggle debug information
                        </span>
                        
                        {showDebug && (
                            <div className="debug-info">
                                <pre>{debugInfo}</pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VirtualTryOn; 