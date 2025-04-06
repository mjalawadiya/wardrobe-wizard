import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaTrash, FaArrowLeft, FaShoppingCart, FaHeart } from 'react-icons/fa';
import axios from 'axios';

const WishlistContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const WishlistHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
`;

const WishlistTitle = styled.h2`
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
`;

const EmptyWishlistMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f8f9fa;
  border-radius: 10px;
  color: #7f8c8d;
  margin: 2rem 0;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #f39c12;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  
  &:hover {
    color: #e67e22;
  }
`;

const WishlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const WishlistItem = styled.div`
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background-color: white;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ItemImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ItemContent = styled.div`
  padding: 1.5rem;
`;

const ItemName = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 0.5rem;
  color: #2c3e50;
`;

const ItemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 1rem;
`;

const ItemPrice = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #f39c12;
  margin-bottom: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.7rem;
  border: none;
  border-radius: 5px;
  background-color: ${props => props.primary ? '#f39c12' : 'rgba(231, 76, 60, 0.1)'};
  color: ${props => props.primary ? 'white' : props.danger ? '#e74c3c' : '#f39c12'};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.primary ? '#e67e22' : props.danger ? '#e74c3c' : 'rgba(243, 156, 18, 0.2)'};
    color: ${props => (props.danger && props.hoverWhite) ? 'white' : props.danger ? '#e74c3c' : props.primary ? 'white' : '#f39c12'};
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 10px;
  margin: 2rem 0;
`;

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        // Check if user is logged in
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          setLoading(false);
          return;
        }
        
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Fetch wishlist items for this user
        const { data } = await axios.get(`/api/users/${userData._id}/wishlist`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setWishlistItems(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError('Failed to load wishlist. Please try again.');
        setLoading(false);
      }
    };
    
    fetchWishlist();
  }, []);

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      if (!user) return;
      
      await axios.delete('/api/wishlist', {
        data: {
          userId: user._id,
          productId
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update local state
      setWishlistItems(prevItems => 
        prevItems.filter(item => item['Product ID'] !== productId)
      );
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      setError('Failed to remove item. Please try again.');
    }
  };

  // Add to cart
  const addToCart = async (productId) => {
    try {
      if (!user) return;
      
      await axios.post('/api/cart', {
        userId: user._id,
        productId,
        quantity: 1
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      alert('Product added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add to cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <WishlistContainer>
        <WishlistHeader>
          <WishlistTitle>Your Wishlist</WishlistTitle>
          <BackButton to="/products">
            <FaArrowLeft /> Continue Shopping
          </BackButton>
        </WishlistHeader>
        <LoadingMessage>Loading your wishlist...</LoadingMessage>
      </WishlistContainer>
    );
  }

  if (error) {
    return (
      <WishlistContainer>
        <WishlistHeader>
          <WishlistTitle>Your Wishlist</WishlistTitle>
          <BackButton to="/products">
            <FaArrowLeft /> Continue Shopping
          </BackButton>
        </WishlistHeader>
        <ErrorMessage>{error}</ErrorMessage>
      </WishlistContainer>
    );
  }

  if (!user) {
    return (
      <WishlistContainer>
        <WishlistHeader>
          <WishlistTitle>Your Wishlist</WishlistTitle>
          <BackButton to="/products">
            <FaArrowLeft /> Continue Shopping
          </BackButton>
        </WishlistHeader>
        <EmptyWishlistMessage>
          Please <Link to="/login" style={{ color: '#f39c12' }}>login</Link> to view your wishlist.
        </EmptyWishlistMessage>
      </WishlistContainer>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <WishlistContainer>
        <WishlistHeader>
          <WishlistTitle>Your Wishlist</WishlistTitle>
          <BackButton to="/products">
            <FaArrowLeft /> Continue Shopping
          </BackButton>
        </WishlistHeader>
        <EmptyWishlistMessage>
          Your wishlist is empty. <Link to="/products" style={{ color: '#f39c12' }}>Continue shopping</Link>.
        </EmptyWishlistMessage>
      </WishlistContainer>
    );
  }

  return (
    <WishlistContainer>
      <WishlistHeader>
        <WishlistTitle>Your Wishlist ({wishlistItems.length} items)</WishlistTitle>
        <BackButton to="/products">
          <FaArrowLeft /> Continue Shopping
        </BackButton>
      </WishlistHeader>
      
      <WishlistGrid>
        {wishlistItems.map(item => (
          <WishlistItem key={item['Product ID']}>
            <Link to={`/product/${item['Product ID']}`}>
              <ItemImage 
                src={`/images/tshirts/${item['Product ID']}.jpg`}
                alt={item['Product Name']}
              />
            </Link>
            
            <ItemContent>
              <ItemName>{item['Product Name']}</ItemName>
              
              <ItemMeta>
                <span>Size: {item['Size']}</span>
                <span>Color: {item['Color']}</span>
              </ItemMeta>
              
              <ItemPrice>${parseFloat(item['Price']).toFixed(2)}</ItemPrice>
              
              <ActionButtons>
                <ActionButton 
                  primary
                  onClick={() => addToCart(item['Product ID'])}
                  disabled={item['Availability'] === 'Out of Stock'}
                >
                  <FaShoppingCart /> 
                  {item['Availability'] === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}
                </ActionButton>
                
                <ActionButton 
                  danger
                  hoverWhite
                  onClick={() => removeFromWishlist(item['Product ID'])}
                >
                  <FaTrash /> Remove
                </ActionButton>
              </ActionButtons>
            </ItemContent>
          </WishlistItem>
        ))}
      </WishlistGrid>
    </WishlistContainer>
  );
};

export default Wishlist;
