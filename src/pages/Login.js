import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSignInAlt, FaEye, FaEyeSlash, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import '../styles/pages/login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [validations, setValidations] = useState({
    email: true,
    password: true
  });
  
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: ''
  });
  
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(null);
  
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
    
    // Check if there's a lockout time in localStorage
    const storedLockout = localStorage.getItem('loginLockout');
    if (storedLockout) {
      const lockoutUntil = parseInt(storedLockout, 10);
      if (lockoutUntil > Date.now()) {
        setLockoutTime(lockoutUntil);
      } else {
        // Lockout period expired, clear it
        localStorage.removeItem('loginLockout');
      }
    }
    
    // Check stored login attempts
    const storedAttempts = localStorage.getItem('loginAttempts');
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts, 10));
    }
  }, [navigate, from]);
  
  // Handle lockout timer
  useEffect(() => {
    let timer;
    if (lockoutTime && lockoutTime > Date.now()) {
      timer = setInterval(() => {
        if (lockoutTime <= Date.now()) {
          setLockoutTime(null);
          localStorage.removeItem('loginLockout');
          setLoginAttempts(0);
          localStorage.removeItem('loginAttempts');
          clearInterval(timer);
        } else {
          // Force rerender to update countdown
          setLockoutTime(prev => prev);
        }
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [lockoutTime]);
  
  // Validate form input in real-time
  useEffect(() => {
    validateForm();
  }, [formData]);
  
  const validateForm = () => {
    const errors = {
      email: '',
      password: ''
    };
    
    // Email validation
    if (formData.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    
    // Password validation - just check if it exists for login
    if (formData.password) {
      if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
    }
    
    setFieldErrors(errors);
    setValidations({
      email: !errors.email,
      password: !errors.password
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const isFormValid = () => {
    return validations.email && validations.password &&
           formData.email.trim() !== '' &&
           formData.password.trim() !== '';
  };
  
  const getRemainingLockoutTime = () => {
    if (!lockoutTime) return null;
    
    const remainingMs = lockoutTime - Date.now();
    if (remainingMs <= 0) return null;
    
    const minutes = Math.floor(remainingMs / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);
    
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if account is locked out
    if (lockoutTime && lockoutTime > Date.now()) {
      return;
    }
    
    // Mark all fields as touched
    setTouched({
      email: true,
      password: true
    });
    
    if (!isFormValid()) {
      setError('Please enter your email and password correctly.');
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
      
      // Reset login attempts on successful login
      setLoginAttempts(0);
      localStorage.removeItem('loginAttempts');
      
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
      
      // Increment login attempts
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());
      
      // If too many failed attempts, lock the account temporarily
      if (newAttempts >= 5) {
        const lockoutUntil = Date.now() + 5 * 60 * 1000; // 5 minutes
        setLockoutTime(lockoutUntil);
        localStorage.setItem('loginLockout', lockoutUntil.toString());
        setError('Too many failed login attempts. Account locked for 5 minutes.');
      } else {
        if (err.response && err.response.data) {
          setError(err.response.data.message || 'Login failed. Please try again.');
        } else if (err.request) {
          // Request was made but no response
          setError('Server not responding. Please try again later.');
        } else {
          // Something else happened while setting up the request
          setError('Login failed. Please try again.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Welcome Back</h2>
      
      {error && (
        <div className="error-message">
          <FaExclamationTriangle /> {error}
        </div>
      )}
      
      {lockoutTime && lockoutTime > Date.now() && (
        <div className="error-message lockout-message">
          <FaExclamationTriangle /> Account temporarily locked. Try again in {getRemainingLockoutTime()}
        </div>
      )}
      
      <form className="login-form" onSubmit={handleSubmit}>
        <div className={`form-group ${touched.email && !validations.email ? 'has-error' : ''}`}>
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your email"
            required
            disabled={lockoutTime && lockoutTime > Date.now()}
          />
          {touched.email && fieldErrors.email && (
            <span className="validation-message invalid">
              {fieldErrors.email}
            </span>
          )}
        </div>
        
        <div className={`form-group ${touched.password && !validations.password ? 'has-error' : ''}`}>
          <label htmlFor="password" className="form-label">Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your password"
              required
              disabled={lockoutTime && lockoutTime > Date.now()}
            />
            <button 
              type="button" 
              className="password-toggle-btn"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={lockoutTime && lockoutTime > Date.now()}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {touched.password && fieldErrors.password && (
            <span className="validation-message invalid">
              {fieldErrors.password}
            </span>
          )}
        </div>
        
        <div className="forgot-password">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        
        <button 
          type="submit" 
          className="submit-button" 
          disabled={isLoading || (lockoutTime && lockoutTime > Date.now()) || !isFormValid()}
        >
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