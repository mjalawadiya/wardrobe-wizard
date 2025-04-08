import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaUserPlus, FaEye, FaEyeSlash, FaExclamationTriangle, FaCheck, FaTimes } from 'react-icons/fa';
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
  
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false
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

  // Validate form input in real-time
  useEffect(() => {
    validateForm();
  }, [formData]);
  
  // Check password strength
  useEffect(() => {
    const password = formData.password;
    const strength = {
      score: 0,
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password)
    };
    
    // Calculate score based on criteria
    if (strength.hasMinLength) strength.score++;
    if (strength.hasUppercase) strength.score++;
    if (strength.hasLowercase) strength.score++;
    if (strength.hasNumber) strength.score++;
    if (strength.hasSpecialChar) strength.score++;
    
    setPasswordStrength(strength);
  }, [formData.password]);

  const validateForm = () => {
    const errors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    
    // Username validation
    if (formData.username) {
      if (formData.username.length < 3) {
        errors.username = 'Username must be at least 3 characters';
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        errors.username = 'Username can only contain letters, numbers, and underscores';
      }
    }
    
    // Email validation
    if (formData.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    
    // Password validation
    if (formData.password) {
      if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      } else if (passwordStrength.score < 3) {
        errors.password = 'Password is too weak';
      }
    }
    
    // Confirm password validation
    if (formData.confirmPassword) {
      if (formData.confirmPassword !== formData.password) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setFieldErrors(errors);
    
    // Update validation state
    setValidations({
      username: !errors.username,
      email: !errors.email,
      password: !errors.password,
      passwordMatch: !errors.confirmPassword
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
  
  const getPasswordStrengthLabel = () => {
    const { score } = passwordStrength;
    if (score === 0) return 'Very Weak';
    if (score === 1) return 'Weak';
    if (score === 2) return 'Fair';
    if (score === 3) return 'Good';
    if (score === 4) return 'Strong';
    if (score === 5) return 'Very Strong';
  };
  
  const getPasswordStrengthColor = () => {
    const { score } = passwordStrength;
    if (score <= 1) return '#ff4d4d'; // Red
    if (score === 2) return '#ffaa00'; // Orange
    if (score === 3) return '#ffff00'; // Yellow
    if (score === 4) return '#73e600'; // Light Green
    if (score === 5) return '#00cc44'; // Green
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true
    });
    
    if (!isFormValid()) {
      setError('Please fill in all fields correctly.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (passwordStrength.score < 3) {
      setError('Password is not strong enough. Please include a mix of uppercase, lowercase, numbers, and special characters.');
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
      
      {error && (
        <div className="error-message">
          <FaExclamationTriangle /> {error}
        </div>
      )}
      
      <form className="register-form" onSubmit={handleSubmit}>
        <div className={`form-group ${touched.username && !validations.username ? 'has-error' : ''}`}>
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-input"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Choose a username"
            required
            minLength="3"
          />
          {touched.username && fieldErrors.username && (
            <span className="validation-message invalid">
              {fieldErrors.username}
            </span>
          )}
        </div>
        
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
              type={showPassword.password ? "text" : "password"}
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Create a password"
              required
              minLength="8"
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
          
          {formData.password && (
            <div className="password-strength">
              <div className="strength-meter">
                <div 
                  className="strength-meter-fill" 
                  style={{ 
                    width: `${(passwordStrength.score / 5) * 100}%`,
                    backgroundColor: getPasswordStrengthColor()
                  }}
                ></div>
              </div>
              <div className="strength-text" style={{ color: getPasswordStrengthColor() }}>
                {getPasswordStrengthLabel()}
              </div>
            </div>
          )}
          
          {formData.password && (
            <div className="password-requirements">
              <div className={`requirement ${passwordStrength.hasMinLength ? 'met' : 'not-met'}`}>
                {passwordStrength.hasMinLength ? <FaCheck className="check" /> : <FaTimes className="times" />}
                At least 8 characters
              </div>
              <div className={`requirement ${passwordStrength.hasUppercase ? 'met' : 'not-met'}`}>
                {passwordStrength.hasUppercase ? <FaCheck className="check" /> : <FaTimes className="times" />}
                At least one uppercase letter
              </div>
              <div className={`requirement ${passwordStrength.hasLowercase ? 'met' : 'not-met'}`}>
                {passwordStrength.hasLowercase ? <FaCheck className="check" /> : <FaTimes className="times" />}
                At least one lowercase letter
              </div>
              <div className={`requirement ${passwordStrength.hasNumber ? 'met' : 'not-met'}`}>
                {passwordStrength.hasNumber ? <FaCheck className="check" /> : <FaTimes className="times" />}
                At least one number
              </div>
              <div className={`requirement ${passwordStrength.hasSpecialChar ? 'met' : 'not-met'}`}>
                {passwordStrength.hasSpecialChar ? <FaCheck className="check" /> : <FaTimes className="times" />}
                At least one special character
              </div>
            </div>
          )}
          
          {touched.password && fieldErrors.password && (
            <span className="validation-message invalid">
              {fieldErrors.password}
            </span>
          )}
        </div>
        
        <div className={`form-group ${touched.confirmPassword && !validations.passwordMatch ? 'has-error' : ''}`}>
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword.confirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
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
          {touched.confirmPassword && fieldErrors.confirmPassword && (
            <span className="validation-message invalid">
              {fieldErrors.confirmPassword}
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