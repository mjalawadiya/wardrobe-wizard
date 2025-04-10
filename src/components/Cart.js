import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaCreditCard, FaPlus, FaMinus } from 'react-icons/fa';
import axios from 'axios';
import '../styles/components/cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();

  // Get user data and cart items
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        // Check if user is logged in
        const userDataString = localStorage.getItem('userData');
        if (!userDataString) {
          setLoading(false);
          setError('Please log in to view your cart');
          return;
        }
        
        const userData = JSON.parse(userDataString);
        setUserData(userData);
        
        // Fetch cart items for this user
        const { data } = await axios.get(`/api/users/${userData._id}/cart`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setCartItems(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError('Failed to load cart. Please try again.');
        setLoading(false);
      }
    };
    
    fetchCart();
  }, []);

  // Update cart item quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      if (!userData) {
        setError('Please log in to update your cart');
        return;
      }
      
      await axios.put('/api/cart', {
        userId: userData._id,
        productId,
        quantity
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update local cart state
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.productId === productId 
            ? { ...item, quantity } 
            : item
        )
      );
    } catch (err) {
      console.error('Error updating cart:', err);
      setError('Failed to update item. Please try again.');
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      if (!userData) {
        setError('Please log in to manage your cart');
        return;
      }
      
      await axios.delete('/api/cart', {
        data: {
          userId: userData._id,
          productId
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update local cart state
      setCartItems(prevItems => 
        prevItems.filter(item => item.productId !== productId)
      );
      
      // Also update local cart storage for navbar display
      const currentCartCount = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCart = currentCartCount.filter(item => item.productId !== productId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      // Trigger storage event
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError('Failed to remove item. Please try again.');
    }
  };

  // Calculate cart summary
  const calculateSummary = () => {
    const subtotal = cartItems.reduce((total, item) => {
      const price = item.productDetails && 
        (item.productDetails['Discount Price'] || item.productDetails['Price']);
      return total + (parseFloat(price) * 75 * item.quantity);
    }, 0);
    
    const shipping = subtotal > 3750 ? 0 : 449; // Free shipping over ₹3,750
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax;
    
    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!userData) {
      setError('Please log in to proceed to checkout');
      return;
    }
    
    if (cartItems.length === 0) {
      alert('Your cart is empty. Add some products before checking out.');
      return;
    }
    
    // Navigate to checkout page
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <h2 className="cart-title">Your Cart</h2>
          <Link to="/products" className="back-button">
            <FaArrowLeft /> Continue Shopping
          </Link>
        </div>
        <div className="loading-container">
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <h2 className="cart-title">Your Cart</h2>
          <Link to="/products" className="back-button">
            <FaArrowLeft /> Continue Shopping
          </Link>
        </div>
        <div className="error-message">{error}</div>
        <Link to="/login" className="checkout-button">
          Login to View Your Cart
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <h2 className="cart-title">Your Cart</h2>
          <Link to="/products" className="back-button">
            <FaArrowLeft /> Continue Shopping
          </Link>
        </div>
        <div className="empty-cart-message">
          <p>Your cart is empty. Add some products to get started!</p>
          <Link to="/products" className="checkout-button">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const summary = calculateSummary();

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2 className="cart-title">Your Cart</h2>
        <Link to="/products" className="back-button">
          <FaArrowLeft /> Continue Shopping
        </Link>
      </div>
      
      <div className="cart-items">
        {cartItems.map(item => (
          <div className="cart-item" key={item.productId}>
            <img 
              className="item-image"
              src={`/images/products/${item.productId}.jpg`}
              alt={item.productDetails['Product Name']}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/res/tshirt/placeholder.jpg';
              }}
            />
            
            <div className="item-details">
              <h3 className="item-name">{item.productDetails['Product Name']}</h3>
              <div className="item-meta">
                <span>Size: {item.productDetails['Size']}</span>
                <span>Color: {item.productDetails['Color']}</span>
                <span>Fit: {item.productDetails['Fit Type']}</span>
              </div>
              <div className="item-price">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(parseFloat(item.productDetails['Discount Price'] || item.productDetails['Price']))}
              </div>
            </div>
            
            <div className="item-actions">
              <div className="quantity-control">
                <button 
                  className="quantity-button"
                  onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                >
                  <FaMinus />
                </button>
                <input
                  type="text"
                  className="quantity-input"
                  value={item.quantity}
                  readOnly
                />
                <button 
                  className="quantity-button"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                >
                  <FaPlus />
                </button>
              </div>
              
              <button 
                className="remove-button"
                onClick={() => removeFromCart(item.productId)}
              >
                <FaTrash /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <h3 className="summary-title">Order Summary</h3>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${summary.subtotal}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span>${summary.shipping}</span>
        </div>
        <div className="summary-row">
          <span>Tax</span>
          <span>${summary.tax}</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>${summary.total}</span>
        </div>
        
        <button 
          className="checkout-button"
          onClick={handleCheckout}
        >
          <FaCreditCard /> Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
