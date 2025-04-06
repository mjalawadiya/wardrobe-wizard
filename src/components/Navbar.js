import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaUser, FaSearch, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import '../styles/components/navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in on component mount and whenever localStorage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        try {
          const parsedUserData = JSON.parse(userDataString);
          setIsLoggedIn(true);
          setUserData(parsedUserData);
          
          // Get cart count from localStorage
          const cart = JSON.parse(localStorage.getItem('cart') || '[]');
          setCartCount(cart.length);
        } catch (error) {
          console.error("Error parsing user data:", error);
          setIsLoggedIn(false);
          setUserData(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    // Check on initial render
    checkLoginStatus();
    
    // Set up event listener for storage changes
    window.addEventListener('storage', checkLoginStatus);
    
    // Additional event listener for custom login/logout events
    window.addEventListener('userLogin', checkLoginStatus);
    window.addEventListener('userLogout', checkLoginStatus);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('userLogin', checkLoginStatus);
      window.removeEventListener('userLogout', checkLoginStatus);
    };
  }, []);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData(null);
    
    // Fire custom logout event
    window.dispatchEvent(new Event('userLogout'));
    
    // Force a re-render of other components listening for storage events
    window.dispatchEvent(new Event('storage'));
    
    navigate('/');
    setIsMenuOpen(false);
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking anywhere outside on mobile
  const closeMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Left side - Hamburger Menu */}
        <div className="navbar-left">
          <button className="hamburger-menu-button" onClick={toggleMenu}>
            <FaBars />
          </button>
        </div>
        
        {/* Center - Website Title */}
        <div className="navbar-center">
          <Link to="/" className="logo">
            Wardrobe<span>Wizard</span>
          </Link>
        </div>
        
        {/* Right side - Logout Button */}
        <div className="navbar-right">
          {isLoggedIn ? (
            <button className="nav-link logout-button" onClick={handleLogout}>
              <FaSignOutAlt />
              Logout
            </button>
          ) : (
            <Link to="/login" className="nav-link">
              <FaUser />
              Login
            </Link>
          )}
        </div>
        
        {/* Overlay for when menu is open */}
        <div className={`nav-overlay ${isMenuOpen ? 'open' : ''}`} onClick={closeMenu}></div>
        
        {/* Sidebar Menu */}
        <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
          <button className="close-button" onClick={toggleMenu}>
            <FaTimes />
          </button>
          
          <div className="nav-menu-header">
            {isLoggedIn && userData && (
              <div className="user-greeting">
                Hello, {userData.username || 'User'}
              </div>
            )}
          </div>
          
          {/* Search inside sidebar */}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-container">
              <div className="search-icon">
                <FaSearch />
              </div>
              <input
                className="search-input"
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          
          <div className="nav-links">
            <Link to="/products" className="nav-link" onClick={closeMenu}>Products</Link>
            
            <Link to="/cart" className="nav-link" onClick={closeMenu}>
              <FaShoppingCart />
              Cart
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
            
            {isLoggedIn && (
              <>
                <Link to="/wishlist" className="nav-link" onClick={closeMenu}>
                  <FaHeart />
                  Wishlist
                </Link>
                
                <Link to="/account" className="nav-link" onClick={closeMenu}>
                  <FaUser />
                  Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;