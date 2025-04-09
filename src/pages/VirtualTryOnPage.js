import React from 'react';
import VirtualTryOn from '../components/VirtualTryOn.js';
import '../styles/pages/virtualTryOn.css';

const VirtualTryOnPage = () => {
    return (
        <div className="virtual-try-on-page">
            <div className="virtual-try-on-container">
                <h1>Virtual Try-On Experience</h1>
                <p className="try-on-description">
                    Upload your photos and see how our clothes look on you!
                </p>
                <VirtualTryOn />
            </div>
        </div>
    );
};

export default VirtualTryOnPage; 