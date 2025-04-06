import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const ImageLoader = ({ 
  src, 
  alt, 
  fallbackSrc = '/images/image1.jpeg', 
  style = {}, 
  className = '', 
  onLoad = () => {}, 
  onError = () => {} 
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const isMounted = useRef(true);

  // Function to preload image
  const preloadImage = (imageSrc) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => resolve(true);
      img.onerror = () => reject(new Error(`Failed to load image: ${imageSrc}`));
    });
  };

  useEffect(() => {
    // Initial mount effect
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Reset states when src changes
    if (src !== imgSrc) {
      setImgSrc(src);
      setIsLoading(true);
      setHasError(false);
    }

    // Attempt to preload the image
    let isImagePreloaded = false;
    
    preloadImage(src)
      .then(() => {
        // Only update if component is still mounted
        if (isMounted.current) {
          isImagePreloaded = true;
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        if (isMounted.current) {
          setHasError(true);
          setIsLoading(false);
          setImgSrc(fallbackSrc);
        }
      });

    // Check if image is already in browser cache
    if (imgRef.current && imgRef.current.complete) {
      setIsLoading(false);
    }

    return () => {
      // Cleanup in case the component unmounts during image loading
    };
  }, [src, fallbackSrc, imgSrc]);

  const handleLoad = (e) => {
    setIsLoading(false);
    onLoad(e);
  };

  const handleError = (e) => {
    console.error(`Failed to load image: ${src}`);
    setHasError(true);
    setIsLoading(false);
    setImgSrc(fallbackSrc);
    onError(e);
  };

  // Define keyframe animation in a style object
  const spinKeyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div className={`image-loader-container ${className}`} style={{ 
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      ...style 
    }}>
      {isLoading && (
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            backgroundColor: '#f8f8f8',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div 
            style={{
              width: '30px',
              height: '30px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #f39c12',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
        </div>
      )}
      <img
        ref={imgRef}
        src={imgSrc}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease',
          objectFit: 'contain',
          objectPosition: 'center',
          paddingLeft: 0,
          ...style
        }}
        onLoad={handleLoad}
        onError={handleError}
      />
      <style>{spinKeyframes}</style>
    </div>
  );
};

ImageLoader.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  fallbackSrc: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func
};

export default ImageLoader;