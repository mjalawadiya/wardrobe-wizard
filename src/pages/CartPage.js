import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaTrash, FaArrowLeft, FaCreditCard } from 'react-icons/fa';

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const CartTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
`;

const CartEmpty = styled.div`
  text-align: center;
  padding: 3rem 0;
  
  p {
    margin-bottom: 1.5rem;
    color: #7f8c8d;
  }
`;

const CartTable = styled.div`
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const CartHeader = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr 120px 120px 80px;
  background-color: #f8f9fa;
  padding: 1rem;
  font-weight: 600;
  color: #2c3e50;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr 120px 120px 80px;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 80px 1fr;
    grid-template-rows: auto auto auto;
    gap: 0.5rem;
    position: relative;
    padding-bottom: 2rem;
  }
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
`;

const ProductInfo = styled.div`
  h3 {
    font-size: 1.1rem;
    margin-bottom: 0.3rem;
    color: #2c3e50;
  }
  
  p {
    font-size: 0.9rem;
    color: #7f8c8d;
  }
`;

const PriceInfo = styled.div`
  font-weight: 600;
  color: #2c3e50;
  
  @media (max-width: 768px) {
    grid-column: 2;
    grid-row: 2;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-column: 2;
    grid-row: 3;
  }
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  color: #2c3e50;
`;

const QuantityInput = styled.input`
  width: 40px;
  height: 30px;
  text-align: center;
  border: 1px solid #ddd;
  border-left: none;
  border-right: none;
  font-size: 0.9rem;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #c0392b;
  }
  
  @media (max-width: 768px) {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
  }
`;

const CartSummary = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 400px;
  margin-left: auto;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  
  h3 {
    font-size: 1.1rem;
    color: #2c3e50;
    margin: 0;
  }
  
  p {
    font-size: 1rem;
    color: #7f8c8d;
    margin: 0;
  }
`;

const SummaryTotal = styled(SummaryRow)`
  border-top: 1px solid #eee;
  padding-top: 1rem;
  font-weight: 600;
  font-size: 1.2rem;
  color: #2c3e50;
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #f39c12;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e67e22;
  }
`;

const ShopLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #f39c12;
  text-decoration: none;
  margin-top: 1.5rem;
  font-weight: 500;
  
  &:hover {
    color: #e67e22;
  }
`;

const CartPage = () => {
  const [cart, setCart] = useState([
    {
      id: 101,
      name: 'Regular Fit T-Shirt',
      price: 28.92,
      image: '/images/tshirts/101.jpg',
      quantity: 1,
      color: 'White',
      size: 'M'
    },
    {
      id: 203,
      name: 'Loose Fit Solid Tee',
      price: 22.50,
      image: '/images/tshirts/203.jpg',
      quantity: 2,
      color: 'Black',
      size: 'L'
    }
  ]);
  
  const [subtotal, setSubtotal] = useState(0);
  const shipping = 5.99;
  const tax = 0;
  
  useEffect(() => {
    // Calculate subtotal
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(total);
  }, [cart]);
  
  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    
    const updatedCart = cart.map(item => 
      item.id === id ? { ...item, quantity } : item
    );
    setCart(updatedCart);
  };
  
  const handleRemoveItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
  };
  
  const formatPrice = (price) => {
    return price.toFixed(2);
  };
  
  if (cart.length === 0) {
    return (
      <CartContainer>
        <CartTitle>Your Cart</CartTitle>
        <CartEmpty>
          <p>Your cart is empty. Add some products to see them here!</p>
          <ShopLink to="/products">
            <FaArrowLeft /> Continue Shopping
          </ShopLink>
        </CartEmpty>
      </CartContainer>
    );
  }
  
  return (
    <CartContainer>
      <CartTitle>Your Cart</CartTitle>
      
      <CartTable>
        <CartHeader>
          <div>Product</div>
          <div>Details</div>
          <div>Price</div>
          <div>Quantity</div>
          <div></div>
        </CartHeader>
        
        {cart.map(item => (
          <CartItem key={item.id}>
            <ProductImage src={item.image} alt={item.name} />
            <ProductInfo>
              <h3>{item.name}</h3>
              <p>Color: {item.color} | Size: {item.size}</p>
            </ProductInfo>
            <PriceInfo>${formatPrice(item.price)}</PriceInfo>
            <QuantityControl>
              <QuantityButton onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</QuantityButton>
              <QuantityInput type="number" min="1" value={item.quantity} onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))} />
              <QuantityButton onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</QuantityButton>
            </QuantityControl>
            <DeleteButton onClick={() => handleRemoveItem(item.id)}>
              <FaTrash />
            </DeleteButton>
          </CartItem>
        ))}
      </CartTable>
      
      <CartSummary>
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Order Summary</h3>
        <SummaryRow>
          <p>Subtotal</p>
          <p>${formatPrice(subtotal)}</p>
        </SummaryRow>
        <SummaryRow>
          <p>Shipping</p>
          <p>${formatPrice(shipping)}</p>
        </SummaryRow>
        <SummaryRow>
          <p>Tax</p>
          <p>${formatPrice(tax)}</p>
        </SummaryRow>
        <SummaryTotal>
          <h3>Total</h3>
          <h3>${formatPrice(subtotal + shipping + tax)}</h3>
        </SummaryTotal>
        
        <CheckoutButton>
          <FaCreditCard /> Proceed to Checkout
        </CheckoutButton>
      </CartSummary>
      
      <ShopLink to="/products">
        <FaArrowLeft /> Continue Shopping
      </ShopLink>
    </CartContainer>
  );
};

export default CartPage;
