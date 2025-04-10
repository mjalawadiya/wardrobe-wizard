import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
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
      return total + (parseFloat(price) * 75 * item.quantity);
    }, 0);
    
    // Shipping cost based on method
    let shipping = 0;
    if (shippingMethod === 'express') {
      shipping = 999;
    } else if (shippingMethod === 'standard') {
      shipping = subtotal > 3750 ? 0 : 449;
    }
    
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax;
    
    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  };

  // Initialize RazorPay payment
  const initializeRazorpayPayment = async (orderAmount) => {
    const options = {
      key: 'rzp_test_l3iiBr281IE9vB',
      amount: Math.round(orderAmount * 100), // RazorPay expects amount in paise
      currency: 'INR',
      name: 'Wardrobe Wizard',
      description: 'Purchase from Wardrobe Wizard',
      image: '/logo192.png',
      prefill: {
        name: formData.fullName,
        email: formData.email,
        contact: userData?.phone || ''
      },
      notes: {
        address: `${formData.address}, ${formData.city}, ${formData.zipCode}, ${formData.country}`,
        shipping_method: shippingMethod
      },
      theme: {
        color: '#f39c12'
      },
      handler: async function (response) {
        console.log('Payment successful:', response);
        try {
          // Store order details for confirmation page
          const orderDetails = {
            orderId: 'WW-' + Math.floor(100000 + Math.random() * 900000),
            email: formData.email,
            amount: orderAmount,
            paymentId: response.razorpay_payment_id
          };
          localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
          
          // Try to clear cart, but don't let it block the success flow
          try {
            const response = await axios.delete('http://localhost:5001/api/users/cart/clear', {
              data: { userId: userData._id },
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
            console.log('Cart cleared successfully:', response.data);
          } catch (cartError) {
            console.warn('Failed to clear server cart:', cartError);
            // Continue with the success flow even if cart clearing fails
          }
          
          // Clear local cart
          localStorage.setItem('cart', JSON.stringify([]));
          
          // Trigger storage event to update cart count in navbar
          window.dispatchEvent(new Event('storage'));
          
          // Set order placed state
          setOrderPlaced(true);
          setLoading(false);
          
          // Navigate to order confirmation page
          navigate('/order-confirmed');
        } catch (err) {
          console.error('Error processing order:', err);
          setError('Failed to process your order. Please try again.');
          setLoading(false);
          navigate('/unable-to-place-order');
        }
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal dismissed');
          setLoading(false);
          navigate('/unable-to-place-order');
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      console.error('Payment failed:', response);
      setLoading(false);
      navigate('/unable-to-place-order');
    });
    rzp.open();
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
      setLoading(true);
      const summary = calculateSummary();
      await initializeRazorpayPayment(parseFloat(summary.total));
    } catch (err) {
      console.error('Error initializing payment:', err);
      
      // Enhanced error handling for international payment issues
      if (err.message && err.message.includes('international')) {
        setError('International transaction error: Please ensure you are using the test card provided (4111 1111 1111 1111) and USD currency.');
      } else if (err.error && err.error.description) {
        setError(`Payment error: ${err.error.description}`);
      } else {
        setError('Failed to initialize payment. Please try again.');
      }
      
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
  
  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h2 className="checkout-title">Checkout</h2>
        <Link to="/cart" className="back-button">
          <FaArrowLeft /> Back to Cart
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="checkout-form">
        {/* Shipping Information */}
        <div className="form-section">
          <h3><FaMapMarkerAlt /> Shipping Information</h3>
          <div className="form-group">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Street Address"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="ZIP Code"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Country"
              required
            />
          </div>
        </div>
        
        {/* Shipping Method */}
        <div className="form-section">
          <h3><FaTruck /> Shipping Method</h3>
          <div className="shipping-options">
            <div 
              className={`shipping-option ${shippingMethod === 'standard' ? 'selected' : ''}`}
              onClick={() => handleShippingChange('standard')}
            >
              <div className="option-details">
                <h4>Standard Shipping</h4>
                <p>5-7 business days</p>
                <p className="shipping-price">
                  {calculateSummary().subtotal > 3750 ? 'FREE' : '₹449'}
                </p>
              </div>
            </div>
            <div 
              className={`shipping-option ${shippingMethod === 'express' ? 'selected' : ''}`}
              onClick={() => handleShippingChange('express')}
            >
              <div className="option-details">
                <h4>Express Shipping</h4>
                <p>2-3 business days</p>
                <p className="shipping-price">₹999</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Test Payment Information */}
        <div className="form-section">
          <h3>Test Payment Information</h3>
          <div className="test-payment-info">
            <p>For testing international payments, use these card details:</p>
            <ul className="test-card-list">
              <li><strong>Card Number:</strong> 4111 1111 1111 1111</li>
              <li><strong>Expiry:</strong> Any future date (e.g., 12/25)</li>
              <li><strong>CVV:</strong> Any 3 digits (e.g., 123)</li>
              <li><strong>Name:</strong> Any name</li>
            </ul>
            <p className="test-note">Note: All transactions are processed in USD currency for international compatibility.</p>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="order-summary">
          <h3><FaShoppingCart /> Order Summary</h3>
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR'
              }).format(parseFloat(calculateSummary().subtotal))}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR'
              }).format(parseFloat(calculateSummary().shipping))}</span>
            </div>
            <div className="summary-row">
              <span>GST (18%)</span>
              <span>{new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR'
              }).format(parseFloat(calculateSummary().tax))}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR'
              }).format(parseFloat(calculateSummary().total))}</span>
            </div>
          </div>
        </div>
        
        <button type="submit" className="checkout-button" disabled={loading}>
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage; 