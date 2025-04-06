import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaShoppingCart, FaHeart } from 'react-icons/fa';
import axios from 'axios';
import '../styles/components/wishlist.css';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        // Check if user is logged in
        const userDataString = localStorage.getItem('userData');
        if (!userDataString) {
          setLoading(false);
          setError('Please log in to view your wishlist');
          return;
        }
        
        const userData = JSON.parse(userDataString);
        setUserData(userData);
        
        // Fetch wishlist items for this user
        const { data } = await axios.get(`/api/users/${userData._id}/wishlist`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setWishlistItems(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError('Failed to load wishlist. Please try again.');
        setLoading(false);
      }
    };
    
    fetchWishlist();
  }, []);

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      if (!userData) {
        setError('Please log in to manage your wishlist');
        return;
      }
      
      await axios.delete('/api/wishlist', {
        data: {
          userId: userData._id,
          productId
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update local state
      setWishlistItems(prevItems => 
        prevItems.filter(item => item.productId !== productId)
      );
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      setError('Failed to remove item. Please try again.');
    }
  };

  // Add to cart
  const addToCart = async (productId) => {
    try {
      if (!userData) {
        setError('Please log in to add items to your cart');
        return;
      }
      
      await axios.post('/api/cart', {
        userId: userData._id,
        productId,
        quantity: 1
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Also update local cart storage for navbar display
      const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCart = [...currentCart, { productId, quantity: 1 }];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      // Trigger storage event
      window.dispatchEvent(new Event('storage'));
      
      alert('Product added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add to cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h2 className="wishlist-title">Your Wishlist</h2>
          <Link to="/products" className="back-button">
            <FaArrowLeft /> Continue Shopping
          </Link>
        </div>
        <div className="loading-message">Loading your wishlist...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h2 className="wishlist-title">Your Wishlist</h2>
          <Link to="/products" className="back-button">
            <FaArrowLeft /> Continue Shopping
          </Link>
        </div>
        <div className="error-message">{error}</div>
        <Link to="/login" className="checkout-button">
          Login to View Your Wishlist
        </Link>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h2 className="wishlist-title">Your Wishlist</h2>
          <Link to="/products" className="back-button">
            <FaArrowLeft /> Continue Shopping
          </Link>
        </div>
        <div className="empty-wishlist-message">
          <p>Your wishlist is empty. Add some products to get started!</p>
          <Link to="/products" className="action-button primary" style={{ width: '200px', margin: '1rem auto' }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h2 className="wishlist-title">Your Wishlist</h2>
        <Link to="/products" className="back-button">
          <FaArrowLeft /> Continue Shopping
        </Link>
      </div>
      
      <div className="wishlist-grid">
        {wishlistItems.map(item => (
          <div className="wishlist-item" key={item.productId}>
            <Link to={`/product/${item.productId}`}>
              <img 
                className="item-image"
                src={`/images/products/${item.productId}.jpg`}
                alt={item.productDetails['Product Name']}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/res/tshirt/placeholder.jpg';
                }}
              />
            </Link>
            
            <div className="item-content">
              <Link to={`/product/${item.productId}`} style={{ textDecoration: 'none' }}>
                <h3 className="item-name">{item.productDetails['Product Name']}</h3>
              </Link>
              
              <div className="item-meta">
                <span>{item.productDetails['Fit Type']}</span>
                <span>{item.productDetails['Color']}</span>
              </div>
              
              <div className="item-price">
                ${item.productDetails['Discount Price'] || item.productDetails['Price']}
              </div>
              
              <div className="action-buttons">
                <button 
                  className="action-button primary"
                  onClick={() => addToCart(item.productId)}
                >
                  <FaShoppingCart /> Add to Cart
                </button>
                
                <button 
                  className="action-button danger"
                  onClick={() => removeFromWishlist(item.productId)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
