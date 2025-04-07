import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';
import '../styles/pages/orderConfirmed.css';

const OrderConfirmed = () => {
  const orderDetails = JSON.parse(localStorage.getItem('lastOrder') || '{}');

  return (
    <div className="order-confirmed-container">
      <div className="success-icon">
        <FaCheckCircle />
      </div>
      
      <h1>Order Confirmed!</h1>
      <p className="success-message">Thank you for shopping with Wardrobe Wizard</p>
      
      <div className="order-info">
        <h2>Order Details</h2>
        <p className="order-number">Order #{orderDetails.orderId || Math.floor(100000 + Math.random() * 900000)}</p>
        <p className="order-email">Confirmation sent to: {orderDetails.email}</p>
        <p className="estimated-delivery">
          Estimated Delivery: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
        </p>
      </div>

      <div className="action-buttons">
        <Link to="/" className="home-button">
          <FaHome /> Back to Home
        </Link>
        <Link to="/products" className="shop-more-button">
          <FaShoppingBag /> Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmed; 