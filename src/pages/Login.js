import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import '../styles/pages/login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Use relative URL now that we have proxy set up in package.json
      const response = await axios.post('/api/users/login', {
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
      
      // Clear form after successful login
      setFormData({
        email: '',
        password: ''
      });
      
      console.log('Login successful:', data);
      
      // Redirect to the page they were trying to access, or home
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Login failed. Please try again.');
      } else if (err.request) {
        // Request was made but no response
        setError('Server not responding. Please try again later.');
      } else {
        // Something else happened while setting up the request
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Welcome Back</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="login-form" onSubmit={handleSubmit}>
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
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            <button 
              type="button" 
              className="password-toggle-btn"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        
        <button type="submit" className="submit-button" disabled={isLoading}>
          <FaSignInAlt />
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div className="register-link">
        Don't have an account?
        <Link to="/register">Sign up</Link>
      </div>
    </div>
  );
};

export default Login; 