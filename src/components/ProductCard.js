import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaCartPlus, FaHeart, FaStar } from 'react-icons/fa';

const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 250px;
  overflow: hidden;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${Card}:hover & {
    transform: scale(1.1);
  }
`;

const ProductBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${props => props.type === 'sale' ? '#e74c3c' : '#3498db'};
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 1;
`;

const ProductInfo = styled.div`
  padding: 1.2rem;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 0.4rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductCategory = styled.span`
  color: #7f8c8d;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.8rem;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 0.8rem;
`;

const ProductPrice = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
`;

const OldPrice = styled.span`
  text-decoration: line-through;
  color: #95a5a6;
  font-size: 0.9rem;
  margin-left: 0.8rem;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const RatingStars = styled.div`
  color: #f39c12;
  display: flex;
  margin-right: 0.5rem;
`;

const RatingText = styled.span`
  font-size: 0.9rem;
  color: #7f8c8d;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 500;
  gap: 0.4rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const CartButton = styled(ActionButton)`
  background-color: #f39c12;
  color: white;
  
  &:hover {
    background-color: #e67e22;
  }
`;

const WishlistButton = styled(ActionButton)`
  background-color: #f8f9fa;
  color: #e74c3c;
  
  &:hover {
    background-color: #f1f1f1;
  }
`;

const ProductCard = ({ id, name, price, rating, image, discount, isNew, category, addToCart, addToWishlist }) => {
  // Calculate discount percentage
  const hasDiscount = discount && discount < price;
  const discountPercentage = hasDiscount 
    ? Math.round(((price - discount) / price) * 100) 
    : 0;
  
  // Generate rating stars
  const ratingValue = parseFloat(rating) || 0;
  const ratingStars = [...Array(5)].map((_, i) => (
    <FaStar key={i} style={{ opacity: i < Math.floor(ratingValue) ? 1 : 0.3 }} />
  ));

  // Handle the case where the component receives a product object instead of individual props
  if (!name && arguments[0].product) {
    const productObj = arguments[0].product;
    id = productObj['Product ID'] || productObj.id;
    name = productObj['Product Name'] || productObj.name;
    price = productObj['Price'] || productObj.price;
    rating = productObj['User Ratings'] || productObj.rating;
    image = productObj['Image'] || productObj.image;
    discount = productObj['Discount Price'];
    isNew = productObj['New Arrival'];
    category = productObj['Fit Type'] || productObj.category;
    addToCart = arguments[0].addToCart;
    addToWishlist = arguments[0].addToWishlist;
  }

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart({ id, name, price, image });
    }
  };

  const handleAddToWishlist = () => {
    if (addToWishlist) {
      addToWishlist({ id, name, price, image });
    }
  };

  return (
    <Card>
      <Link to={`/product/${id}`}>
        <ImageContainer>
          <ProductImage src={image} alt={name} />
          {hasDiscount && (
            <ProductBadge type="sale">{discountPercentage}% OFF</ProductBadge>
          )}
          {isNew && (
            <ProductBadge type="new">NEW</ProductBadge>
          )}
        </ImageContainer>
      </Link>
      
      <ProductInfo>
        <Link to={`/product/${id}`} style={{ textDecoration: 'none' }}>
          <ProductName>{name}</ProductName>
        </Link>
        <ProductCategory>{category || "T-Shirt"}</ProductCategory>
        
        <PriceContainer>
          <ProductPrice>
            ${hasDiscount ? discount : price}
          </ProductPrice>
          {hasDiscount && <OldPrice>${price}</OldPrice>}
        </PriceContainer>
        
        <RatingContainer>
          <RatingStars>{ratingStars}</RatingStars>
          <RatingText>({ratingValue})</RatingText>
        </RatingContainer>
        
        <ButtonsContainer>
          <CartButton onClick={handleAddToCart}>
            <FaCartPlus /> Add
          </CartButton>
          <WishlistButton onClick={handleAddToWishlist}>
            <FaHeart />
          </WishlistButton>
        </ButtonsContainer>
      </ProductInfo>
    </Card>
  );
};

export default ProductCard;
