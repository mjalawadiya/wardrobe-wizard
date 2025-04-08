import React, { useState, useRef } from 'react';
import './UploadSection.css';

const UploadSection = ({ onImageUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Check if the file is an image
    if (!file.type.match('image.*')) {
      alert('Please upload an image file (jpg, jpeg, png)');
      return;
    }

    // Create a preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
      onImageUpload(e.target.result); // Pass the image data to parent
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleReset = () => {
    setPreviewImage(null);
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="upload-section">
      <h3>Upload Your Photo</h3>
      <p className="upload-instructions">
        Please upload a clear full-body photo for the best virtual try-on experience.
      </p>
      
      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${previewImage ? 'has-preview' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {previewImage ? (
          <div className="preview-container">
            <img src={previewImage} alt="Preview" className="preview-image" />
            <button className="reset-btn" onClick={handleReset}>
              <span className="icon">×</span>
            </button>
          </div>
        ) : (
          <>
            <div className="upload-icon">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="drag-text">Drag and drop your image here</p>
            <p className="or-text">or</p>
            <button className="browse-btn" onClick={handleButtonClick}>Browse Files</button>
          </>
        )}
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="file-input" 
        />
      </div>
      
      <div className="upload-tips">
        <h4>Tips for best results:</h4>
        <ul>
          <li>Use a photo with a neutral background</li>
          <li>Ensure good lighting for clear visibility</li>
          <li>Stand in a neutral pose with your arms visible</li>
          <li>Face the camera directly for accurate measurements</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadSection; 