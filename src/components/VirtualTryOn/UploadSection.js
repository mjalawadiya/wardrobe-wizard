import React, { useState, useRef } from 'react';
import './UploadSection.css';

const UploadSection = ({ onImageUpload, customTips }) => {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Process the selected file
  const processFile = (file) => {
    if (!file.type.match('image.*')) {
      alert('Please upload an image file (jpg, jpeg, png)');
      return;
    }

    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      console.log("Image processed successfully");
      setImagePreview(imageData);
      onImageUpload(imageData);
    };
    reader.readAsDataURL(file);
  };

  // Handle browse button click
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  // Handle reset/remove image
  const handleReset = () => {
    setImagePreview("");
    setFileName("");
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="upload-section">
      {!imagePreview ? (
        // Upload interface when no image is selected
        <div 
          className={`upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <div className="upload-icon">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="drag-text">Drag and drop your image here</p>
          <p className="or-text">or</p>
          <button type="button" className="browse-btn">Browse Files</button>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="file-input" 
            tabIndex="-1"
          />
        </div>
      ) : (
        // Preview interface when image is selected
        <div className="image-preview-wrapper">
          <div 
            className="image-preview-container"
            style={{ backgroundImage: `url(${imagePreview})` }}
          >
            <button 
              className="remove-image-btn"
              onClick={handleReset}
              type="button"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
          {fileName && <p className="file-name">{fileName}</p>}
        </div>
      )}
      
      {customTips || (
        <div className="upload-tips">
          <h4>Tips for best results:</h4>
          <ul>
            <li>Use a photo with a neutral background</li>
            <li>Ensure good lighting for clear visibility</li>
            <li>Stand in a neutral pose with your arms visible</li>
            <li>Face the camera directly for accurate measurements</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadSection; 