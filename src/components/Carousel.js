import React, { useEffect, useState } from 'react';

const images = [
    '/images/carousel1.jpg',
    '/images/carousel2.jpg',
    '/images/carousel3.jpg'
    ];

    const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="carousel">
        {images.map((img, index) => (
            <img
            key={index}
            src={img}
            alt={`carousel-${index}`}
            className={index === currentIndex ? 'active' : ''}
            />
        ))}
        </div>
    );
};

export default Carousel;
