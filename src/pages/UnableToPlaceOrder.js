import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaShoppingCart } from 'react-icons/fa';
import '../styles/pages/unableToPlaceOrder.css';

const UnableToPlaceOrder = () => {
  return (
    <div className="unable-to-order-container">
      <div className="error-icon">
        <FaExclamationTriangle />
      </div>
      
      <h1>Payment Failed</h1>
      <p className="error-message">We were unable to process your payment</p>
      
      <div className="error-details">
        <h2>What happened?</h2>
        <ul>
          <li>Your payment was declined by your bank</li>
          <li>There might be an issue with your payment method</li>
          <li>The payment session might have timed out</li>
        </ul>
        <p>Please try again or use a different payment method</p>
      </div>

      <div className="action-buttons">
        <Link to="/" className="home-button">
          <FaHome /> Back to Home
        </Link>
        <Link to="/cart" className="retry-button">
          <FaShoppingCart /> Return to Cart
        </Link>
      </div>
    </div>
  );
};

export default UnableToPlaceOrder; 