import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes, FaSignOutAlt, FaTshirt, FaUserPlus } from 'react-icons/fa';
import '../styles/components/navbar.css';
import styled from 'styled-components';

// Define styled components
const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const NavItem = styled.li`
  margin-bottom: 0.5rem;
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
        <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
          <button className="close-button" onClick={toggleMenu}>
            <FaTimes />
          </button>
          
          <div className="nav-menu-header">
            {isLoggedIn && userData && (
              <div className="user-greeting">
                Hello, {userData.username || userData.name || 'User'}
              </div>
            )}
          </div>
          
          {/* Navigation Links */}
          <NavMenu>
            <NavItem>
              <NavLink to="/products">
                <FaTshirt />
                Products
              </NavLink>
            </NavItem>
            
            {isLoggedIn ? (
              <>
                <NavItem>
                  <NavLink to="/cart">
                    <CartIcon>
                      <FaShoppingCart />
                      {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
                    </CartIcon>
                    Cart
                  </NavLink>
                </NavItem>
                
                <NavItem>
                  <NavLink to="/wishlist">
                    <FaHeart />
                    Wishlist
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink to="/profile">
                    <FaUser />
                    Profile
                  </NavLink>
                </NavItem>
                
                <NavItem>
                  <LogoutButton onClick={handleLogout}>
                    <FaSignOutAlt />
                    Logout
                  </LogoutButton>
                </NavItem>
              </>
            ) : (
              <>
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
              </>
            )}
          </NavMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;