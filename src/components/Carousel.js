import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ImageLoader from './ImageLoader.js';

const CarouselContainer = styled.div`
  position: relative;
  width: calc(100vw - 40px);
  max-width: 1200px;
  height: 500px;
  overflow: hidden;
  margin: 20px auto;
  padding: 0;
  box-sizing: border-box;
  background-color: #000;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    height: 300px;
    width: calc(100vw - 20px);
    margin: 10px auto;
    border-radius: 15px;
  }
`;

const SlideWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  transition: transform 0.5s ease;
  transform: translateX(-${props => props.currentSlide * 100}%);
`;

const Slide = styled.div`
  min-width: 100%;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
`;

const SlideImage = styled(ImageLoader)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 10%;
  margin: 0;
  padding: 0;
  display: block;
  transform: scale(1.3);
`;

const SlideContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0.1) 70%, rgba(0, 0, 0, 0) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 5rem;
  color: white;
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
  }
`;

const SlideTitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  max-width: 600px;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const SlideDescription = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 500px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
`;

const SlideButton = styled(Link)`
  display: inline-block;
  background-color: #f39c12;
  color: white;
  text-decoration: none;
  padding: 0.8rem 2rem;
  border-radius: 5px;
  font-weight: 600;
  transition: background-color 0.2s, transform 0.2s;
  
  &:hover {
    background-color: #e67e22;
    transform: translateY(-3px);
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 1.5rem;
    font-size: 0.9rem;
  }
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.3);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

const PrevButton = styled(CarouselButton)`
  left: 20px;
`;

const NextButton = styled(CarouselButton)`
  right: 20px;
`;

const Indicators = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Indicator = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#f39c12' : 'rgba(255, 255, 255, 0.5)'};
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: ${props => props.active ? '#f39c12' : 'rgba(255, 255, 255, 0.8)'};
  }
`;

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  // Carousel data
  const slides = [
    {
      id: 1,
      image: '/images/carousel/slide3.png',
      title: 'Summer Collection 2025',
      description: 'Beat the heat with our premium tees designed for maximum comfort and style.',
      buttonText: 'Shop Now',
      link: '/products?category=summer'
    },
    {
      id: 2,
      image: '/images/carousel/slide2.png',
      title: 'New Arrivals',
      description: 'Check out the latest additions to our collection, crafted with premium materials.',
      buttonText: 'Explore',
      link: '/products?filter=new'
    },
    {
      id: 3,
      image: '/images/carousel/slide1.png',
      title: 'Special Offers',
      description: 'Limited time discounts on selected items. Don\'t miss out!',
      buttonText: 'View Deals',
      link: '/products?filter=sale'
    }
  ];

  // Handle next and previous buttons
  const nextSlide = () => {
    setCurrentSlide(current => (current === slides.length - 1 ? 0 : current + 1));
  };

  const prevSlide = () => {
    setCurrentSlide(current => (current === 0 ? slides.length - 1 : current - 1));
  };

  // Handle indicator clicks
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-advance slides
  useEffect(() => {
    let interval;
    
    if (autoplay) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoplay, currentSlide]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  // For development/testing - use placeholder images if carousel images not available
  const getImageSrc = (path) => {
    // Return the path directly, the ImageLoader will handle fallbacks if needed
    return path;
  };

  return (
    <CarouselContainer onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <SlideWrapper currentSlide={currentSlide}>
        {slides.map((slide, index) => (
          <Slide key={slide.id}>
            <SlideImage 
              src={getImageSrc(slide.image)} 
              alt={slide.title}
              fallbackSrc={`https://via.placeholder.com/1600x800/3498db/ffffff?text=Wardrobe+Wizard+${index + 1}`}
            />
            <SlideContent>
              <SlideTitle>{slide.title}</SlideTitle>
              <SlideDescription>{slide.description}</SlideDescription>
              <SlideButton to={slide.link}>{slide.buttonText}</SlideButton>
            </SlideContent>
          </Slide>
        ))}
      </SlideWrapper>
      
      <PrevButton onClick={prevSlide}>
        <FaChevronLeft />
      </PrevButton>
      
      <NextButton onClick={nextSlide}>
        <FaChevronRight />
      </NextButton>
      
      <Indicators>
        {slides.map((_, index) => (
          <Indicator 
            key={index} 
            active={currentSlide === index} 
            onClick={() => goToSlide(index)}
          />
        ))}
      </Indicators>
    </CarouselContainer>
  );
};

export default Carousel;