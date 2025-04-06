import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaShoppingCart, FaHeart, FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa';

const Nav = styled.nav`
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  span {
    color: #f39c12;
  }
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
    width: 70%;
    height: 100vh;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 4rem;
    background-color: white;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease;
    z-index: 999;
  }
`;

const NavLink = styled(Link)`
  color: #2c3e50;
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  &:hover {
    color: #f39c12;
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    width: 100%;
    text-align: center;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-right: 1rem;
  
  @media (max-width: 768px) {
    width: 90%;
    margin: 1rem 0;
  }
`;

const SearchInput = styled.input`
  padding: 0.6rem;
  padding-left: 2.5rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  width: 200px;
  
  &:focus {
    border-color: #f39c12;
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
`;

const CartCount = styled.span`
  background-color: #f39c12;
  color: white;
  border-radius: 50%;
  padding: 0.1rem 0.4rem;
  font-size: 0.7rem;
  margin-left: 0.2rem;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #2c3e50;
  cursor: pointer;
  z-index: 1000;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #2c3e50;
  cursor: pointer;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const SearchForm = styled.form`
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 1rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Check if user is logged in on component mount
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setIsLoggedIn(true);
      
      // Get cart count from localStorage
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    }
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
    <Nav>
      <NavContainer>
        <Logo to="/">
          Wardrobe<span>Wizard</span>
        </Logo>
        
        <MobileMenuButton onClick={toggleMenu}>
          <FaBars />
        </MobileMenuButton>
        
        <NavMenu isOpen={isMenuOpen}>
          <CloseButton onClick={toggleMenu}>
            <FaTimes />
          </CloseButton>
          
          <SearchForm onSubmit={handleSearch}>
            <SearchContainer>
              <SearchIcon>
                <FaSearch />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchContainer>
          </SearchForm>
          
          <NavLinks>
            <NavLink to="/products" onClick={closeMenu}>Products</NavLink>
            
            <NavLink to="/cart" onClick={closeMenu}>
              <FaShoppingCart />
              Cart
              {cartCount > 0 && <CartCount>{cartCount}</CartCount>}
            </NavLink>
            
            <NavLink to="/wishlist" onClick={closeMenu}>
              <FaHeart />
              Wishlist
            </NavLink>
            
            {isLoggedIn ? (
              <>
                <NavLink to="/account" onClick={closeMenu}>
                  <FaUser />
                  Account
                </NavLink>
                <NavLink to="/" onClick={() => { handleLogout(); closeMenu(); }}>
                  Logout
                </NavLink>
              </>
            ) : (
              <NavLink to="/login" onClick={closeMenu}>
                <FaUser />
                Login
              </NavLink>
            )}
          </NavLinks>
        </NavMenu>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;