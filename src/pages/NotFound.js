import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaSearch } from 'react-icons/fa';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 2rem;
  text-align: center;
`;

const StatusCode = styled.h1`
  font-size: 8rem;
  color: #f39c12;
  margin: 0;
  line-height: 1;
  
  @media (max-width: 576px) {
    font-size: 6rem;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 1rem 0;
  
  @media (max-width: 576px) {
    font-size: 1.8rem;
  }
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: #7f8c8d;
  max-width: 600px;
  margin-bottom: 2rem;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const StyledButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 600;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const HomeButton = styled(StyledButton)`
  background-color: #f39c12;
  
  &:hover {
    background-color: #e67e22;
  }
`;

const SearchButton = styled(StyledButton)`
  background-color: #3498db;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <StatusCode>404</StatusCode>
      <Title>Page Not Found</Title>
      <Message>
        We couldn't find the page you're looking for. The page might have been moved, 
        deleted, or maybe the URL was mistyped.
      </Message>
      
      <ButtonsContainer>
        <HomeButton to="/">
          <FaHome /> Go to Homepage
        </HomeButton>
        <SearchButton to="/products">
          <FaSearch /> Browse Products
        </SearchButton>
      </ButtonsContainer>
    </NotFoundContainer>
  );
};

export default NotFound; 