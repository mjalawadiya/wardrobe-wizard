import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import '../styles/components/navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Check if user is logged in on component mount and whenever localStorage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const userData = localStorage.getItem('userData');
      if (userData) {
        setIsLoggedIn(true);
        
        // Get cart count from localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(cart.length);
      } else {
        setIsLoggedIn(false);
      }
    };

    // Check on initial render
    checkLoginStatus();
    
    // Set up event listener for storage changes
    window.addEventListener('storage', checkLoginStatus);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
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
    
    // Force a re-render of other components listening for storage events
    window.dispatchEvent(new Event('storage'));
    
    navigate('/');
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
        <Link to="/" className="logo">
          Wardrobe<span>Wizard</span>
        </Link>
        
        <button className="mobile-menu-button" onClick={toggleMenu}>
          <FaBars />
        </button>
        
        <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
          <button className="close-button" onClick={toggleMenu}>
            <FaTimes />
          </button>
          
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
            
            <Link to="/wishlist" className="nav-link" onClick={closeMenu}>
              <FaHeart />
              Wishlist
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link to="/account" className="nav-link" onClick={closeMenu}>
                  <FaUser />
                  Account
                </Link>
                <Link to="/" className="nav-link" onClick={() => { handleLogout(); closeMenu(); }}>
                  Logout
                </Link>
              </>
            ) : (
              <Link to="/login" className="nav-link" onClick={closeMenu}>
                <FaUser />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;