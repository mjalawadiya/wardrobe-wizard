import React from 'react';
import { Link } from 'react-router-dom';
import { FaCartPlus, FaHeart, FaStar } from 'react-icons/fa';
import ImageLoader from './ImageLoader.js';
import '../styles/components/productCard.css';

const ProductCard = (props) => {
  let { id, name, price, rating, image, discount, isNew, category, addToCart, addToWishlist, product } = props;
  
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

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart({ id, name, price, image });
    }
  };

  const handleAddToWishlist = () => {
    if (addToWishlist) {
      addToWishlist({ id, name, price, image });
    }
  };

  return (
    <div className="product-card">
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
