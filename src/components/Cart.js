import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaTrash, FaArrowLeft, FaCreditCard, FaPlus, FaMinus } from 'react-icons/fa';
import axios from 'axios';

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
`;

const CartTitle = styled.h2`
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
`;

const EmptyCartMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f8f9fa;
  border-radius: 10px;
  color: #7f8c8d;
  margin: 2rem 0;
`;

const CartItems = styled.div`
  margin-bottom: 2rem;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 1.5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 0.5rem;
  color: #2c3e50;
`;

const ItemMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
  
  span {
    margin-right: 1rem;
  }
`;

const ItemPrice = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #f39c12;
`;

const ItemActions = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  
  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 1rem;
    width: 100%;
    justify-content: space-between;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  margin-right: 2rem;
  
  @media (max-width: 768px) {
    margin-right: 1rem;
  }
`;

const QuantityButton = styled.button`
  background-color: #f8f9fa;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f39c12;
    color: white;
  }
  
  &:disabled {
    background-color: #eee;
    color: #ccc;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 40px;
  text-align: center;
  font-size: 1rem;
  border: none;
  padding: 0.5rem;
  margin: 0 0.5rem;
`;

const RemoveButton = styled.button`
  background-color: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: #e74c3c;
    color: white;
  }
`;

const CartSummary = styled.div`
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const SummaryTitle = styled.h3`
  font-size: 1.2rem;
  color: #2c3e50;
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 0;
  font-size: 1rem;
  color: ${props => props.total ? '#2c3e50' : '#7f8c8d'};
  font-weight: ${props => props.total ? '600' : '400'};
  border-top: ${props => props.total ? '1px solid #eee' : 'none'};
  margin-top: ${props => props.total ? '0.5rem' : '0'};
`;

const CheckoutButton = styled.button`
  background-color: #f39c12;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 5px;
  width: 100%;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: #e67e22;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
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

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Get user data and cart items
  useEffect(() => {
    const fetchCart = async () => {
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
        
        // Fetch cart items for this user
        const { data } = await axios.get(`/api/users/${userData._id}/cart`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setCartItems(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError('Failed to load cart. Please try again.');
        setLoading(false);
      }
    };
    
    fetchCart();
  }, []);

  // Update cart item quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      if (!user) return;
      
      await axios.put('/api/cart', {
        userId: user._id,
        productId,
        quantity
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update local state
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.productId === productId 
            ? { ...item, quantity } 
            : item
        )
      );
    } catch (err) {
      console.error('Error updating cart:', err);
      setError('Failed to update cart. Please try again.');
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      if (!user) return;
      
      await axios.delete('/api/cart', {
        data: {
          userId: user._id,
          productId
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update local state
      setCartItems(prevItems => 
        prevItems.filter(item => item.productId !== productId)
      );
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError('Failed to remove item. Please try again.');
    }
  };

  // Calculate cart summary
  const calculateSummary = () => {
    if (!cartItems.length) return { subtotal: 0, tax: 0, total: 0 };
    
    const subtotal = cartItems.reduce((acc, item) => {
      return acc + (parseFloat(item.productDetails['Price']) * item.quantity);
    }, 0);
    
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const summary = calculateSummary();

  // Handle checkout 
  const handleCheckout = () => {
    alert('Checkout functionality will be implemented soon!');
  };

  if (loading) {
    return (
      <CartContainer>
        <CartHeader>
          <CartTitle>Your Cart</CartTitle>
          <BackButton to="/products">
            <FaArrowLeft /> Continue Shopping
          </BackButton>
        </CartHeader>
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading your cart...</div>
      </CartContainer>
    );
  }

  if (error) {
    return (
      <CartContainer>
        <CartHeader>
          <CartTitle>Your Cart</CartTitle>
          <BackButton to="/products">
            <FaArrowLeft /> Continue Shopping
          </BackButton>
        </CartHeader>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#e74c3c' }}>{error}</div>
      </CartContainer>
    );
  }

  if (!user) {
    return (
      <CartContainer>
        <CartHeader>
          <CartTitle>Your Cart</CartTitle>
          <BackButton to="/products">
            <FaArrowLeft /> Continue Shopping
          </BackButton>
        </CartHeader>
        <EmptyCartMessage>
          Please <Link to="/login" style={{ color: '#f39c12' }}>login</Link> to view your cart.
        </EmptyCartMessage>
      </CartContainer>
    );
  }

  if (cartItems.length === 0) {
    return (
      <CartContainer>
        <CartHeader>
          <CartTitle>Your Cart</CartTitle>
          <BackButton to="/products">
            <FaArrowLeft /> Continue Shopping
          </BackButton>
        </CartHeader>
        <EmptyCartMessage>
          Your cart is empty. <Link to="/products" style={{ color: '#f39c12' }}>Continue shopping</Link>.
        </EmptyCartMessage>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <CartHeader>
        <CartTitle>Your Cart ({cartItems.length} items)</CartTitle>
        <BackButton to="/products">
          <FaArrowLeft /> Continue Shopping
        </BackButton>
      </CartHeader>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <CartItems>
          {cartItems.map(item => (
            <CartItem key={item.productId}>
              <ItemImage 
                src={`/images/tshirts/${item.productId}.jpg`}
                alt={item.productDetails['Product Name']}
              />
              
              <ItemDetails>
                <ItemName>{item.productDetails['Product Name']}</ItemName>
                <ItemMeta>
                  <span>Size: {item.productDetails['Size']}</span>
                  <span>Color: {item.productDetails['Color']}</span>
                  <span>Fabric: {item.productDetails['Fabric']}</span>
                </ItemMeta>
                <ItemPrice>${parseFloat(item.productDetails['Price']).toFixed(2)}</ItemPrice>
              </ItemDetails>
              
              <ItemActions>
                <QuantityControl>
                  <QuantityButton 
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <FaMinus size={12} />
                  </QuantityButton>
                  
                  <QuantityInput 
                    value={item.quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val > 0) {
                        updateQuantity(item.productId, val);
                      }
                    }}
                    min="1"
                  />
                  
                  <QuantityButton 
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >
                    <FaPlus size={12} />
                  </QuantityButton>
                </QuantityControl>
                
                <RemoveButton onClick={() => removeFromCart(item.productId)}>
                  <FaTrash /> Remove
                </RemoveButton>
              </ItemActions>
            </CartItem>
          ))}
        </CartItems>
        
        <CartSummary>
          <SummaryTitle>Order Summary</SummaryTitle>
          
          <SummaryRow>
            <span>Subtotal</span>
            <span>${summary.subtotal}</span>
          </SummaryRow>
          
          <SummaryRow>
            <span>Tax (10%)</span>
            <span>${summary.tax}</span>
          </SummaryRow>
          
          <SummaryRow>
            <span>Shipping</span>
            <span>Free</span>
          </SummaryRow>
          
          <SummaryRow total>
            <span>Total</span>
            <span>${summary.total}</span>
          </SummaryRow>
          
          <CheckoutButton onClick={handleCheckout}>
            <FaCreditCard /> Proceed to Checkout
          </CheckoutButton>
        </CartSummary>
      </div>
    </CartContainer>
  );
};

export default Cart;
