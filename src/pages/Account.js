import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaTimesCircle, FaEdit, FaSave, FaTimes, FaBoxOpen, FaHeart, FaHistory, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import '../styles/pages/account.css';

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state for profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    city: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Validation state
  const [validations, setValidations] = useState({
    username: true,
    email: true,
    passwordMatch: true,
    passwordLength: true
  });
  
  // Orders and wishlist placeholders
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  
  // Check if user is logged in and fetch profile data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userData = localStorage.getItem('userData');
        if (!userData) {
          navigate('/login');
          return;
        }
        
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
        
        // Initialize form data with user details
        setFormData(prev => ({
          ...prev,
          username: parsedUserData.username || '',
          email: parsedUserData.email || '',
          city: parsedUserData.city || ''
        }));
        
        // Fetch additional user data from API (orders, etc)
        if (parsedUserData._id) {
          try {
            const { data } = await axios.get(`/api/users/profile`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            // If we have any additional data, update the user state
            if (data) {
              setUser(prev => ({ ...prev, ...data }));
            }
            
            // Fetch orders if available
            try {
              const ordersResponse = await axios.get(`/api/users/${parsedUserData._id}/orders`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                }
              });
              
              if (ordersResponse.data) {
                setOrders(ordersResponse.data);
              }
            } catch (err) {
              console.log('No orders available or endpoint not implemented');
            }
            
            // Fetch wishlist if available
            try {
              const wishlistResponse = await axios.get(`/api/users/${parsedUserData._id}/wishlist`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                }
              });
              
              if (wishlistResponse.data) {
                setWishlist(wishlistResponse.data);
              }
            } catch (err) {
              console.log('No wishlist available or endpoint not implemented');
            }
          } catch (err) {
            console.error('Error fetching user profile:', err);
          }
        }
      } catch (err) {
        console.error('Error parsing user data:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);
  
  // Validate form when data changes
  useEffect(() => {
    if (isEditing) {
      // Update validation statuses
      setValidations({
        username: formData.username.length >= 3,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
        passwordMatch: !formData.newPassword || formData.newPassword === formData.confirmPassword,
        passwordLength: !formData.newPassword || formData.newPassword.length >= 6
      });
    }
  }, [formData, isEditing]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update the form data with the new value
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors/success when user makes changes
    if (error || success) {
      setError('');
      setSuccess('');
    }
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Revert changes if canceling edit
      console.log('Canceling edit, reverting form data to user data');
      setFormData({
        username: user.username || '',
        email: user.email || '',
        city: user.city || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      // Start editing - initialize form data from user data
      console.log('Starting edit mode, initializing form data from user data');
      setFormData({
        username: user.username || '',
        email: user.email || '',
        city: user.city || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    
    // Toggle editing state
    setIsEditing(!isEditing);
    setError('');
    setSuccess('');
  };
  
  // Check if form is valid for submission
  const isFormValid = () => {
    // Basic validation for required fields
    if (!formData.username || !formData.email) {
      return false;
    }
    
    // Check if there are validation errors
    if (!validations.username || !validations.email || !validations.passwordMatch || !validations.passwordLength) {
      return false;
    }
    
    // If changing password, current password is required
    if (formData.newPassword && !formData.currentPassword) {
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Log validation status for debugging
    console.log('Form validation status:', {
      isValid: isFormValid(),
      validations,
      formData
    });
    
    if (!isFormValid()) {
      setError('Please fill in all fields correctly.');
      return;
    }
    
    setError('');
    setSuccess('');
    
    try {
      // Create update data object with user details
      const updateData = {
        username: formData.username,
        email: formData.email,
        city: formData.city
      };
      
      // Include password data if provided
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.password = formData.newPassword;
      }
      
      console.log('Sending update to server:', updateData);
      
      // Send update request to API
      const response = await axios.put('/api/users/profile', updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Server response:', response.data);
      
      // Update user data in state and localStorage
      const updatedData = response.data;
      setUser(updatedData);
      localStorage.setItem('userData', JSON.stringify(updatedData));
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Dispatch event to update components like Navbar
      window.dispatchEvent(new Event('userLogin'));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Error updating profile:', err);
      // Extract error message from API response if available
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Failed to update profile. Please try again.');
      } else {
        setError('Failed to update profile. Please try again.');
      }
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="account-container">
        <div className="account-header">
          <h1 className="account-title">Account</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading your profile...</div>
      </div>
    );
  }
  
  // Render account page
  return (
    <div className="account-container">
      <div className="account-header">
        <h1 className="account-title">My Account</h1>
        <p className="account-subtitle">Manage your profile information and view your orders</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="account-sections">
        {/* Profile Information Section */}
        <div className="account-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaUser /> Profile Information
            </h2>
            <button className="edit-button" onClick={toggleEditMode}>
              {isEditing ? (
                <>
                  <FaTimes /> Cancel
                </>
              ) : (
                <>
                  <FaEdit /> Edit
                </>
              )}
            </button>
          </div>
          
          <div className="section-content">
            {isEditing ? (
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username" className="form-label">Username</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="form-input"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                  {formData.username && !validations.username && (
                    <span className="validation-message invalid">
                      Username must be at least 3 characters
                    </span>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-input"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  {formData.email && !validations.email && (
                    <span className="validation-message invalid">
                      Please enter a valid email address
                    </span>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="city" className="form-label">City (for weather recommendations)</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <FaMapMarkerAlt />
                    </span>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      className="form-input"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="currentPassword" className="form-label">Current Password (only if changing password)</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <FaLock />
                    </span>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      className="form-input"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Enter your current password"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">New Password (leave blank to keep current)</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <FaLock />
                    </span>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      className="form-input"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter a new password"
                    />
                  </div>
                  {formData.newPassword && !validations.passwordLength && (
                    <span className="validation-message invalid">
                      Password must be at least 6 characters
                    </span>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <FaLock />
                    </span>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-input"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your new password"
                      disabled={!formData.newPassword}
                    />
                  </div>
                  {formData.confirmPassword && !validations.passwordMatch && (
                    <span className="validation-message invalid">
                      Passwords do not match
                    </span>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={!isFormValid()}
                >
                  <FaSave /> Save Changes
                </button>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-row">
                  <div className="info-label">Username:</div>
                  <div className="info-value">{user.username}</div>
                </div>
                <div className="info-row">
                  <div className="info-label">Email:</div>
                  <div className="info-value">{user.email}</div>
                </div>
                <div className="info-row">
                  <div className="info-label">City:</div>
                  <div className="info-value">{user.city || 'Not set'}</div>
                </div>
                <div className="info-row">
                  <div className="info-label">Member since:</div>
                  <div className="info-value">
                    {user.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString() 
                      : 'Information not available'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Wishlist Section */}
        <div className="account-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaHeart /> My Wishlist
            </h2>
            <button 
              className="edit-button" 
              onClick={() => navigate('/wishlist')}
            >
              View All
            </button>
          </div>
          
          <div className="section-content">
            {wishlist.length > 0 ? (
              <div>
                <p>You have {wishlist.length} item(s) in your wishlist.</p>
                {/* We could show a preview of wishlist items here */}
              </div>
            ) : (
              <p>Your wishlist is empty. Browse our products and add items to your wishlist!</p>
            )}
          </div>
        </div>
        
        {/* Orders Section */}
        <div className="account-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaBoxOpen /> My Orders
            </h2>
            <button 
              className="edit-button" 
              onClick={() => navigate('/orders')}
              disabled={orders.length === 0}
            >
              View All
            </button>
          </div>
          
          <div className="section-content">
            {orders.length > 0 ? (
              <div>
                <p>You have placed {orders.length} order(s).</p>
                {/* We could show recent orders here */}
              </div>
            ) : (
              <p>You haven't placed any orders yet. Start shopping now!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account; 