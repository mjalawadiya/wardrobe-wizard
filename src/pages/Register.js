import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import '../styles/pages/register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });

  const [validations, setValidations] = useState({
    username: true,
    email: true,
    password: true,
    passwordMatch: true
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the return path if redirected from a protected route
  const from = location.state?.from || '/';

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem('userData');
    if (userData) {
      navigate(from, { replace: true });
    }
  }, [navigate, from]);

  // Validate form input
  useEffect(() => {
    const validateForm = () => {
      setValidations({
        username: formData.username.length >= 3,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
        password: formData.password.length >= 6,
        passwordMatch: formData.password === formData.confirmPassword
      });
    };
    
    validateForm();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const isFormValid = () => {
    return Object.values(validations).every(val => val === true) &&
           formData.username.trim() !== '' &&
           formData.email.trim() !== '' &&
           formData.password.trim() !== '' &&
           formData.confirmPassword.trim() !== '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setError('Please fill in all fields correctly.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Use relative URL now that we have proxy set up in package.json
      const response = await axios.post('/api/users/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      const data = response.data;
      
      // Save user data and token to localStorage
      localStorage.setItem('userData', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      
      // Dispatch custom login event
      window.dispatchEvent(new Event('userLogin'));
      
      // Trigger storage event for components listening for changes
      window.dispatchEvent(new Event('storage'));
      
      // Clear form after successful registration
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      console.log('Registration successful:', data);
      
      // Redirect to the page they were trying to access, or home
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Registration failed. Please try again.');
      } else if (err.request) {
        // Request was made but no response
        setError('Server not responding. Please try again later.');
      } else {
        // Something else happened while setting up the request
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Create Account</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-input"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            required
            minLength="3"
          />
          {formData.username && !validations.username && (
            <span className="validation-message invalid">
              Username must be at least 3 characters
            </span>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
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
          {formData.email && !validations.email && (
            <span className="validation-message invalid">
              Please enter a valid email address
            </span>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword.password ? "text" : "password"}
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              minLength="6"
            />
            <button 
              type="button" 
              className="password-toggle-btn"
              onClick={() => togglePasswordVisibility('password')}
              aria-label={showPassword.password ? "Hide password" : "Show password"}
            >
              {showPassword.password ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {formData.password && !validations.password && (
            <span className="validation-message invalid">
              Password must be at least 6 characters
            </span>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword.confirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
            <button 
              type="button" 
              className="password-toggle-btn"
              onClick={() => togglePasswordVisibility('confirmPassword')}
              aria-label={showPassword.confirmPassword ? "Hide password" : "Show password"}
            >
              {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {formData.confirmPassword && !validations.passwordMatch && (
            <span className="validation-message invalid">
              Passwords do not match
            </span>
          )}
        </div>
        
        <button type="submit" className="submit-button" disabled={isLoading || !isFormValid()}>
          <FaUserPlus />
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <div className="login-link">
        Already have an account?
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Register; 