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
                // Case 1: We have a base64 image
                if (data.result_image) {
                    console.log("Displaying base64 image");
                    setResultImage(`data:image/jpeg;base64,${data.result_image}`);
                } 
                // Case 2: We have a direct image URL
                else if (data.image_url) {
                    console.log("Displaying image URL:", data.image_url);
                    // For direct URLs, make sure it's treated as an image source
                    setResultImage(data.image_url);
                    
                    // Optional: If the URL directly triggers a download instead of displaying,
                    // we could try to fetch and convert it to a blob URL
                    try {
                        const imgResponse = await fetch(data.image_url);
                        if (imgResponse.ok) {
                            const blob = await imgResponse.blob();
                            const blobUrl = URL.createObjectURL(blob);
                            console.log("Created blob URL for display:", blobUrl);
                            setResultImage(blobUrl);
                        }
                    } catch (fetchErr) {
                        console.error("Error converting download URL to blob:", fetchErr);
                        // Fall back to original URL if fetch fails
                    }
                } 
                // Case 3: No image found
                else {
                    setError('No image was returned from the API');
                    setShowDebug(true);
                }
            } else {
                setError(data.error || 'Failed to process images');
                if (data.details) {
                    setError(prev => `${prev} - ${data.details}`);
                }
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

    const downloadImage = () => {
        if (resultImage) {
            try {
                // If we're using a blob URL that we created, we can get the original URL from debug info
                if (resultImage.startsWith('blob:') && debugInfo) {
                    const originalUrl = JSON.parse(debugInfo)?.image_url;
                    if (originalUrl) {
                        // Create an invisible anchor to trigger download from original URL
                        const downloadLink = document.createElement('a');
                        downloadLink.href = originalUrl;
                        downloadLink.download = 'try-on-result.jpg';
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                        return;
                    }
                }
                
                // For data URLs or as fallback, use the resultImage directly
                const downloadLink = document.createElement('a');
                downloadLink.href = resultImage;
                downloadLink.download = 'try-on-result.jpg';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            } catch (err) {
                console.error("Error downloading image:", err);
                setError("Failed to download image. Please try the 'View Original' link if available.");
            }
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
                    <div className="result-section">
                        <h3>Try-On Result</h3>
                        <div className="result-image-container">
                            <img 
                                src={resultImage} 
                                alt="Try-on result" 
                                className="result-image"
                                onError={(e) => {
                                    console.error("Error loading image:", e);
                                    console.log("Current image source:", resultImage);
                                    // Try to reload as link
                                    e.target.onerror = null;
                                    if (resultImage.startsWith('data:')) {
                                        console.log("Base64 image failed to load");
                                        setError("Failed to display base64 image");
                                    } else if (resultImage.startsWith('blob:')) {
                                        console.log("Blob URL failed to load");
                                        const originalUrl = JSON.parse(debugInfo)?.image_url;
                                        if (originalUrl) {
                                            console.log("Falling back to original URL:", originalUrl);
                                            e.target.src = originalUrl;
                                        }
                                    } else {
                                        console.log("Direct URL failed to load");
                                        setError("Failed to display image. Please try downloading it instead.");
                                    }
                                }}
                                onLoad={() => {
                                    console.log("Image loaded successfully");
                                    console.log("Image dimensions:", e.target.naturalWidth, "x", e.target.naturalHeight);
                                }}
                            />
                        </div>
                        <div className="result-actions">
                            <button 
                                onClick={downloadImage} 
                                className="download-button"
                            >
                                Download Image
                            </button>
                            {resultImage.startsWith('blob:') && (
                                <a 
                                    href={JSON.parse(debugInfo)?.image_url || resultImage} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="view-original-link"
                                >
                                    View Original
                                </a>
                            )}
                        </div>
                    </div>
                )}
                
                {debugInfo && (
                    <div className="debug-section">
                        <button 
                            onClick={toggleDebugInfo} 
                            className="debug-toggle"
                        >
                            {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
                        </button>
                        {showDebug && (
                            <div className="debug-info">
                                <h4>Debug Information</h4>
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