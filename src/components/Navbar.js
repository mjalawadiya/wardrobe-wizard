import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaHeart, 
  FaUser, 
  FaBars, 
  FaTimes, 
  FaSignOutAlt, 
  FaTshirt, 
  FaUserPlus, 
  FaHome,
  FaStore,
  FaClipboardList,
  FaMagic,
  FaLock
} from 'react-icons/fa';
import '../styles/components/navbar.css';
import styled from 'styled-components';

// Define styled components
const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const NavItem = styled.li`
  margin-bottom: 0.2rem;
  width: 100%;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  color: #2c3e50;
  text-decoration: none;
  border-radius: 5px;
  transition: all 0.2s;
  width: 100%;
  
  &:hover {
    background-color: #f8f9fa;
    color: #f39c12;
  }
`;

// Create a styled div for disabled links
const DisabledNavLink = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  color: #bdc3c7;
  text-decoration: none;
  border-radius: 5px;
  width: 100%;
  cursor: not-allowed;
  opacity: 0.7;
  position: relative;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &:hover::after {
    content: "Please log in to access the Virtual Try-On feature";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #34495e;
    color: white;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    white-space: nowrap;
    z-index: 1000;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }
`;

const CartIcon = styled.div`
  position: relative;
  display: flex;
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #f39c12;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  color: #e74c3c;
  background: none;
  border: none;
  border-radius: 5px;
  width: 100%;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

// Additional styled components for the top-right navigation
const TopNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2c3e50;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 5px;
  transition: all 0.2s;
  
  &:hover {
    color: #f39c12;
  }
`;

const TopLogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2c3e50;
  background: none;
  border: none;
  padding: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #f39c12;
  }
`;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [userData, setUserData] = useState(null);
  const [cartBadgeNew, setCartBadgeNew] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Listen for cart item added event
  useEffect(() => {
    const handleCartItemAdded = () => {
      setCartBadgeNew(true);
      
      // Remove the "new" class after animation completes
      setTimeout(() => {
        setCartBadgeNew(false);
      }, 1800); // 3 iterations of the 0.6s animation
    };
    
    window.addEventListener('cartItemAdded', handleCartItemAdded);
    
    return () => {
      window.removeEventListener('cartItemAdded', handleCartItemAdded);
    };
  }, []);

  // Handle scroll event to close menu
  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isMenuOpen) {
        // Check if the clicked element is not the hamburger button
        if (!event.target.closest('.hamburger-menu-button')) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Add useEffect to manage body class
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    
    // Cleanup
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

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
          <button className="hamburger-menu-button" onClick={toggleMenu} aria-label="Menu">
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
            <TopLogoutButton onClick={handleLogout}>
              <FaSignOutAlt />
              Logout
            </TopLogoutButton>
          ) : (
            <TopNavLink to="/login">
              <FaUser />
              Login
            </TopNavLink>
          )}
        </div>
        
        {/* Overlay for when menu is open */}
        <div className={`nav-overlay ${isMenuOpen ? 'open' : ''}`} onClick={closeMenu}></div>
        
        {/* Sidebar Menu */}
        <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`} ref={menuRef}>
          <button className="close-button" onClick={toggleMenu} aria-label="Close menu">
            <FaTimes />
          </button>
          
          <div className="nav-menu-header">
            {isLoggedIn && userData ? (
              <div className="user-greeting">
                Hello, {userData.username || userData.name || 'User'}
              </div>
            ) : (
              <div className="user-greeting">
                Welcome, Guest
              </div>
            )}
          </div>
          
          {/* Navigation Links */}
          <div className="nav-category">Navigation</div>
          <NavMenu>
            <NavItem>
              <NavLink to="/">
                <FaHome />
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/products">
                <FaTshirt />
                Products
              </NavLink>
            </NavItem>
            <NavItem>
              {isLoggedIn ? (
                <NavLink to="/virtual-tryon">
                  <FaMagic />
                  Virtual Try-On
                </NavLink>
              ) : (
                <DisabledNavLink>
                  <FaLock />
                  Virtual Try-On (Login Required)
                </DisabledNavLink>
              )}
            </NavItem>
          </NavMenu>
          
          <div className="nav-section-divider"></div>
          
          {isLoggedIn ? (
            <>
              <div className="nav-category">Account</div>
              <NavMenu>
                <NavItem>
                  <NavLink to="/profile">
                    <FaUser />
                    Profile
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/wishlist">
                    <FaHeart />
                    Wishlist
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/cart">
                    <CartIcon>
                      <FaShoppingCart />
                      {cartCount > 0 && (
                        <CartBadge className={cartBadgeNew ? 'new' : ''}>
                          {cartCount}
                        </CartBadge>
                      )}
                    </CartIcon>
                    Cart
                  </NavLink>
                </NavItem>
                <NavItem>
                  <LogoutButton onClick={handleLogout}>
                    <FaSignOutAlt />
                    Logout
                  </LogoutButton>
                </NavItem>
              </NavMenu>
            </>
          ) : (
            <>
              <div className="nav-category">Account</div>
              <NavMenu>
                <NavItem>
                  <NavLink to="/login">
                    <FaUser />
                    Login
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/register">
                    <FaUserPlus />
                    Register
                  </NavLink>
                </NavItem>
              </NavMenu>
            </>
          )}
          
          <div className="nav-section-divider"></div>
          
          <div className="nav-category">Help & Info</div>
          <NavMenu>
            <NavItem>
              <NavLink to="/about">
                <FaStore />
                About Us
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/terms">
                <FaClipboardList />
                Terms & Conditions
              </NavLink>
            </NavItem>
          </NavMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;