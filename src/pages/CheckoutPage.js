import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaCreditCard, 
  FaMapMarkerAlt, 
  FaShoppingCart, 
  FaTruck,
  FaCheckCircle
} from 'react-icons/fa';
import axios from 'axios';
import '../styles/pages/checkout.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    cardName: '',
    expDate: '',
    cvv: '',
  });
  
  const [shippingMethod, setShippingMethod] = useState('standard');
  
  // Get user data and cart items
  useEffect(() => {
    const fetchCartAndUser = async () => {
      setLoading(true);
      try {
        // Check if user is logged in
        const userDataString = localStorage.getItem('userData');
        if (!userDataString) {
          setLoading(false);
          setError('Please log in to proceed to checkout');
          return;
        }
        
        const userData = JSON.parse(userDataString);
        setUserData(userData);
        
        // Prefill form data with user information
        setFormData(prev => ({
          ...prev,
          fullName: userData.fullName || userData.username || '',
          email: userData.email || '',
          address: userData.address || '',
          city: userData.city || '',
          zipCode: userData.zipCode || '',
          country: userData.country || '',
        }));
        
        // Fetch cart items for this user
        const { data } = await axios.get(`/api/users/${userData._id}/cart`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setCartItems(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching checkout data:', err);
        setError('Failed to load your checkout information. Please try again.');
        setLoading(false);
      }
    };
    
    fetchCartAndUser();
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle shipping method selection
  const handleShippingChange = (method) => {
    setShippingMethod(method);
  };
  
  // Calculate order summary
  const calculateSummary = () => {
    const subtotal = cartItems.reduce((total, item) => {
      const price = item.productDetails && 
        (item.productDetails['Discount Price'] || item.productDetails['Price']);
      return total + (parseFloat(price) * item.quantity);
    }, 0);
    
    // Shipping cost based on method
    let shipping = 0;
    if (shippingMethod === 'express') {
      shipping = 12.99;
    } else if (shippingMethod === 'standard') {
      shipping = subtotal > 50 ? 0 : 5.99;
    }
    
    const tax = subtotal * 0.07; // 7% tax
    const total = subtotal + shipping + tax;
    
    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    for (const field in formData) {
      if (!formData[field]) {
        setError(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
        return;
      }
    }
    
    try {
      // In a real app, you would process payment and create order here
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear cart after successful checkout
      await axios.delete('/api/users/cart/clear', {
        data: { userId: userData._id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Clear local cart
      localStorage.setItem('cart', JSON.stringify([]));
      
      // Update UI
      setOrderPlaced(true);
      setLoading(false);
      
      // Trigger storage event to update cart count in navbar
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to process your order. Please try again.');
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="checkout-container">
        <div className="checkout-header">
          <h2 className="checkout-title">Checkout</h2>
          <Link to="/cart" className="back-button">
            <FaArrowLeft /> Back to Cart
          </Link>
        </div>
        <div className="loading-container">
          <p>Loading checkout information...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="checkout-container">
        <div className="checkout-header">
          <h2 className="checkout-title">Checkout</h2>
          <Link to="/cart" className="back-button">
            <FaArrowLeft /> Back to Cart
          </Link>
        </div>
        <div className="error-message">{error}</div>
        <Link to="/login" className="checkout-button">
          Login to Proceed
        </Link>
      </div>
    );
  }
  
  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-container">
        <div className="checkout-header">
          <h2 className="checkout-title">Checkout</h2>
          <Link to="/cart" className="back-button">
            <FaArrowLeft /> Back to Cart
          </Link>
        </div>
        <div className="empty-cart-message">
          <p>Your cart is empty. Add some products before checking out.</p>
          <Link to="/products" className="checkout-button">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }
  
  if (orderPlaced) {
    return (
      <div className="checkout-container">
        <div className="checkout-header">
          <h2 className="checkout-title">Order Confirmation</h2>
        </div>
        <div className="order-success">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <h3>Thank you for your order!</h3>
          <p>Your order has been placed successfully.</p>
          <p>A confirmation email has been sent to {formData.email}</p>
          <p className="order-number">Order #: ORD-{Math.floor(100000 + Math.random() * 900000)}</p>
          <Link to="/products" className="checkout-button">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }
  
  const summary = calculateSummary();
  
  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h2 className="checkout-title">Checkout</h2>
        <Link to="/cart" className="back-button">
          <FaArrowLeft /> Back to Cart
        </Link>
      </div>
      
      <div className="checkout-content">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="section-title">
              <FaMapMarkerAlt /> Shipping Address
            </h3>
            <div className="input-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="input-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="section-title">
              <FaTruck /> Shipping Method
            </h3>
            <div className="shipping-options">
              <div 
                className={`shipping-option ${shippingMethod === 'standard' ? 'selected' : ''}`}
                onClick={() => handleShippingChange('standard')}
              >
                <div className="option-radio">
                  <div className={`radio-inner ${shippingMethod === 'standard' ? 'selected' : ''}`}></div>
                </div>
                <div className="option-details">
                  <span className="option-name">Standard Delivery</span>
                  <span className="option-price">{parseFloat(summary.subtotal) > 50 ? 'FREE' : '$5.99'}</span>
                  <span className="option-time">3-5 business days</span>
                </div>
              </div>
              
              <div 
                className={`shipping-option ${shippingMethod === 'express' ? 'selected' : ''}`}
                onClick={() => handleShippingChange('express')}
              >
                <div className="option-radio">
                  <div className={`radio-inner ${shippingMethod === 'express' ? 'selected' : ''}`}></div>
                </div>
                <div className="option-details">
                  <span className="option-name">Express Delivery</span>
                  <span className="option-price">$12.99</span>
                  <span className="option-time">1-2 business days</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="section-title">
              <FaCreditCard /> Payment Information
            </h3>
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="XXXX XXXX XXXX XXXX"
                required
              />
            </div>
            
            <div className="input-row">
              <div className="form-group">
                <label htmlFor="cardName">Name on Card</label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="expDate">Expiration Date</label>
                <input
                  type="text"
                  id="expDate"
                  name="expDate"
                  value={formData.expDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="XXX"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="order-summary">
            <h3 className="summary-title">
              <FaShoppingCart /> Order Summary
            </h3>
            <div className="summary-items">
              {cartItems.map(item => (
                <div className="summary-item" key={item.productId}>
                  <span className="item-name">
                    {item.productDetails['Product Name']} × {item.quantity}
                  </span>
                  <span className="item-price">
                    ${(parseFloat(item.productDetails['Discount Price'] || item.productDetails['Price']) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="summary-totals">
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
            </div>
          </div>
          
          <button type="submit" className="place-order-button">
            Place Order (${summary.total})
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage; 