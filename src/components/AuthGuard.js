import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * AuthGuard component to protect routes that require authentication
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {React.ReactElement} Protected route or redirect to login
 */
const AuthGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      setChecking(true);
      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          // User is authenticated
          setIsAuthenticated(true);
        } else {
          // User is not authenticated
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsAuthenticated(false);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();

    // Listen for storage changes for real-time auth updates
    window.addEventListener('storage', checkAuth);
    window.addEventListener('userLogin', checkAuth);
    window.addEventListener('userLogout', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('userLogin', checkAuth);
      window.removeEventListener('userLogout', checkAuth);
    };
  }, []);

  // Show nothing while checking authentication
  if (checking) {
    return null;
  }

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the protected content
  return children;
};

export default AuthGuard; 