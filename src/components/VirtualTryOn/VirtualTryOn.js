import React, { useState } from 'react';
import UploadSection from './UploadSection';
import './VirtualTryOn.css';

const VirtualTryOn = () => {
  const [userImage, setUserImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageUpload = (image) => {
    setUserImage(image);
    setResult(null); // Reset any previous results
  };

  const processImage = () => {
    if (!userImage) return;
    
    setIsProcessing(true);
    
    // Simulating processing time with setTimeout
    // In a real app, this would be an API call to your backend
    setTimeout(() => {
      // For now we'll just use the same image as the result
      // In a real implementation, this would be the processed image from the backend
      setResult(userImage);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="virtual-try-on">
      <h2>Virtual Try-On</h2>
      <p className="description">
        Upload your photo and see how our clothing items look on you using AI technology.
      </p>
      
      <div className="try-on-container">
        <div className="upload-container">
          <UploadSection 
            onImageUpload={handleImageUpload} 
            userImage={userImage}
          />
        </div>
        
        <div className="result-container">
          {userImage && (
            <div className="action-section">
              <button 
                className="process-btn"
                onClick={processImage}
                disabled={isProcessing || !userImage}
              >
                {isProcessing ? 'Processing...' : 'Generate Try-On'}
              </button>
              
              {isProcessing && (
                <div className="processing-indicator">
                  <div className="spinner"></div>
                  <p>Processing your image with AI...</p>
                </div>
              )}
              
              {result && (
                <div className="result-display">
                  <h3>Your Virtual Try-On</h3>
                  <div className="result-image">
                    <img src={result} alt="Virtual try-on result" />
                  </div>
                  <div className="result-actions">
                    <button className="save-btn">Save Image</button>
                    <button className="share-btn">Share</button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {!userImage && (
            <div className="placeholder-message">
              <p>Upload your photo to see the virtual try-on result here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn; 