import React from 'react';
import VirtualTryOn from '../components/VirtualTryOn.js';
import '../styles/pages/VirtualTryOnPage.css';

const VirtualTryOnPage = () => {
    return (
        <div className="virtual-try-on-page">
            <div className="page-header">
                <h1>Virtual Try-On Experience</h1>
                <p>Upload your photos and see how our clothes look on you!</p>
            </div>
            <div className="virtual-try-on-wrapper">
                <VirtualTryOn />
            </div>
        </div>
    );
};

export default VirtualTryOnPage; 