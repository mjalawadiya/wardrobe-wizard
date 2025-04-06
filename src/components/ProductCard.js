import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCartPlus, FaHeart, FaStar } from 'react-icons/fa';
import ImageLoader from './ImageLoader.js';
import axios from 'axios';
import '../styles/components/productCard.css';

// Helper function to preload an image
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(true);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
  });
};

const ProductCard = (props) => {
  let { id, name, price, rating, image, discount, isNew, category, product } = props;
  const [userData, setUserData] = useState(null);
  
  // State to track if we should preload the detail image
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    // Get user data from localStorage
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        const parsedUserData = JSON.parse(userDataString);
        setUserData(parsedUserData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
  
  // Calculate discount percentage
  const hasDiscount = discount && discount < price;
  const discountPercentage = hasDiscount 
    ? Math.round(((price - discount) / price) * 100) 
    : 0;
  
  // Generate rating stars
  const ratingValue = parseFloat(rating) || 0;
  const ratingStars = [...Array(5)].map((_, i) => (
    <FaStar key={i} style={{ opacity: i < Math.floor(ratingValue) ? 1 : 0.3 }} />
  ));

  // Handle the case where the component receives a product object instead of individual props
  if (!name && product) {
    const productObj = product;
    id = productObj['Product ID'] || productObj.id;
    name = productObj['Product Name'] || productObj.name;
    price = productObj['Price'] || productObj.price;
    rating = productObj['User Ratings'] || productObj.rating;
    image = productObj['Image'] || productObj.image;
    discount = productObj['Discount Price'];
    isNew = productObj['New Arrival'];
    category = productObj['Fit Type'] || productObj.category;
  }

  // Always use the ID-based path for tshirt images
  const getImagePath = () => {
    try {
      // Ensure id is properly converted to a number
      const productId = Number(id);
      return `/res/tshirt/${productId}.jpg`;
    } catch (error) {
      console.error('Error creating image path for product:', id, error);
      return '/images/image1.jpeg';
    }
  };

  // Handle mouse enter event to preload detail image
  const handleMouseEnter = () => {
    setIsHovered(true);
    const detailImagePath = getImagePath();
    // Preload the image to ensure it's cached when navigating to the detail page
    preloadImage(detailImagePath)
      .then(() => console.log('Detail image preloaded:', detailImagePath))
      .catch(error => console.error('Failed to preload detail image:', error));
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleAddToCart = async () => {
    try {
      if (!userData) {
        alert('Please log in to add items to your cart');
        return;
      }
      
      const productIdToUse = id ? id.toString() : '';
      console.log('Adding to cart:', {
        userId: userData._id,
        productId: productIdToUse,
        quantity: 1
      });
      
      const response = await axios.post('/api/cart', {
        userId: userData._id,
        productId: productIdToUse,
        quantity: 1
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Cart API response:', response.data);
      
      // Also update local cart storage for navbar display
      const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = currentCart.findIndex(item => item.productId === productIdToUse);
      
      if (existingItemIndex !== -1) {
        // If item already in cart, increment quantity
        currentCart[existingItemIndex].quantity += 1;
      } else {
        // Otherwise add new item
        currentCart.push({ productId: productIdToUse, quantity: 1 });
      }
      
      localStorage.setItem('cart', JSON.stringify(currentCart));
      
      // Trigger storage event
      window.dispatchEvent(new Event('storage'));
      
      alert('Product added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
      }
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const handleAddToWishlist = async () => {
    try {
      if (!userData) {
        alert('Please log in to add items to your wishlist');
        return;
      }
      
      const productIdToUse = id ? id.toString() : '';
      console.log('Adding to wishlist:', {
        userId: userData._id,
        productId: productIdToUse
      });
      
      const response = await axios.post('/api/wishlist', {
        userId: userData._id,
        productId: productIdToUse
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Wishlist API response:', response.data);
      
      alert('Product added to wishlist!');
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data.message.includes('already in wishlist')) {
        alert('This product is already in your wishlist!');
      } else {
        console.error('Error adding to wishlist:', err);
        if (err.response) {
          console.error('Error response:', err.response.data);
        }
        alert('Failed to add item to wishlist. Please try again.');
      }
    }
  };

  return (
    <div className="product-card" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link to={`/product/${id}`}>
        <div className="image-container">
          <ImageLoader 
            className="product-image"
            src={getImagePath()}
            alt={name}
            style={{ 
              objectFit: 'contain', 
              backgroundColor: '#f8f8f8',
              width: '100%',
              height: '100%'
            }}
            fallbackSrc="/images/image1.jpeg"
            onError={(e) => {
              console.error('Image failed to load for product:', id);
            }}
          />
          {hasDiscount && (
            <span className="product-badge sale">{discountPercentage}% OFF</span>
          )}
          {isNew && (
            <span className="product-badge new">NEW</span>
          )}
        </div>
      </Link>
      
      <div className="product-info">
        <Link to={`/product/${id}`} style={{ textDecoration: 'none' }}>
          <h3 className="product-name">{name}</h3>
        </Link>
        <span className="product-category">{category || "T-Shirt"}</span>
        
        <div className="price-container">
          <span className="product-price">
            ${hasDiscount ? discount : price}
          </span>
          {hasDiscount && <span className="old-price">${price}</span>}
        </div>
        
        <div className="rating-container">
          <div className="rating-stars">{ratingStars}</div>
          <span className="rating-text">({ratingValue})</span>
        </div>
        
        <div className="buttons-container">
          <button className="action-button cart-button" onClick={handleAddToCart}>
            <FaCartPlus /> Add
          </button>
          <button className="action-button wishlist-button" onClick={handleAddToWishlist}>
            <FaHeart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
