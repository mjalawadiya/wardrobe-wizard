import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Carousel from '../components/Carousel.js';
import ProductCard from '../components/ProductCard.js';
import { FaArrowRight, FaTshirt, FaStar } from 'react-icons/fa';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const HomeTitle = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  text-align: center;
`;

const HomeSubtitle = styled.p`
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 3rem;
  text-align: center;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturedSection = styled.section`
  margin: 4rem 0;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #f39c12;
  }
`;

const ViewAllLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f39c12;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    color: #e67e22;
    transform: translateX(3px);
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const CategoriesSection = styled.section`
  margin: 4rem 0;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const CategoryCard = styled.div`
  position: relative;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    
    img {
      transform: scale(1.05);
    }
  }
`;

const CategoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
`;

const CategoryOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  display: flex;
  align-items: flex-end;
  padding: 1.5rem;
`;

const CategoryName = styled.h3`
  color: white;
  margin: 0;
  font-size: 1.3rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
`;

const Newsletter = styled.section`
  background-color: #f8f9fa;
  border-radius: 10px;
  margin: 4rem 0;
  text-align: center;
  padding: 3rem;
`;

const NewsletterTitle = styled.h2`
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const NewsletterText = styled.p`
  color: #7f8c8d;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const NewsletterForm = styled.form`
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px 0 0 5px;
  font-size: 1rem;
  outline: none;
  
  &:focus {
    border-color: #f39c12;
  }
  
  @media (max-width: 576px) {
    border-radius: 5px;
  }
`;

const NewsletterButton = styled.button`
  padding: 1rem 2rem;
  background-color: #f39c12;
  color: white;
  border: none;
  border-radius: 0 5px 5px 0;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e67e22;
  }
  
  @media (max-width: 576px) {
    border-radius: 5px;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
`;

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  // Sample tshirt data
  const tshirts = [
    { id: 101, name: 'Regular Fit T-Shirt', category: 'T-Shirt', color: 'White', fit: 'Regular', price: 28.92, image: '/images/tshirts/101.jpg', rating: 4.2 },
    { id: 102, name: 'Slim Fit T-Shirt', category: 'T-Shirt', color: 'Pink', fit: 'Slim', price: 26.09, image: '/images/tshirts/102.jpg', rating: 4.5 },
    { id: 103, name: 'Regular Fit Graphic Tee', category: 'T-Shirt', color: 'Pink', fit: 'Regular', price: 20.93, image: '/images/tshirts/103.jpg', rating: 4.2 },
    { id: 104, name: 'Regular Fit Solid Tee', category: 'T-Shirt', color: 'Orange', fit: 'Regular', price: 39.72, image: '/images/tshirts/104.jpg', rating: 3.7 },
    { id: 105, name: 'Loose Fit Plain Tee', category: 'T-Shirt', color: 'White', fit: 'Loose', price: 33.79, image: '/images/tshirts/105.jpg', rating: 4.7 },
    { id: 114, name: 'Regular Fit Graphic Tee', category: 'T-Shirt', color: 'White', fit: 'Regular', price: 35.72, image: '/images/tshirts/114.jpg', rating: 5.0 },
    { id: 115, name: 'Regular Fit Graphic Tee', category: 'T-Shirt', color: 'Beige', fit: 'Regular', price: 48.49, image: '/images/tshirts/115.jpg', rating: 4.7 },
    { id: 203, name: 'Loose Fit Solid Tee', category: 'T-Shirt', color: 'Black', fit: 'Loose', price: 22.50, image: '/images/tshirts/203.jpg', rating: 4.3 },
    { id: 305, name: 'Slim Fit Premium Tee', category: 'T-Shirt', color: 'Blue', fit: 'Slim', price: 29.99, image: '/images/tshirts/305.jpg', rating: 4.8 },
    { id: 407, name: 'Oversized Fit Tee', category: 'T-Shirt', color: 'Grey', fit: 'Oversized', price: 31.50, image: '/images/tshirts/407.jpg', rating: 4.6 }
  ];

  // Fetch products
  useEffect(() => {
    // Simulating API fetch with local data
    const fetchProducts = async () => {
      try {
        // Sort by random for featured products
        const shuffled = [...tshirts].sort(() => 0.5 - Math.random());
        setFeaturedProducts(shuffled.slice(0, 4));
        
        // Sort by rating for top rated products
        const sorted = [...tshirts].sort((a, b) => 
          parseFloat(b.rating) - parseFloat(a.rating)
        );
        setTopRatedProducts(sorted.slice(0, 4));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle newsletter submission
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with ${email}!`);
    setEmail('');
  };

  // Categories to display
  const categories = [
    { name: 'Regular Fit', image: '/images/tshirts/101.jpg', id: 101 },
    { name: 'Loose Fit', image: '/images/tshirts/203.jpg', id: 203 },
    { name: 'Slim Fit', image: '/images/tshirts/305.jpg', id: 305 },
    { name: 'Oversized Fit', image: '/images/tshirts/407.jpg', id: 407 }
  ];

  // Add to cart (This would be implemented with context or global state management in a real app)
  const addToCart = (product) => {
    alert(`${product['Product Name']} added to cart!`);
  };

  // Add to wishlist
  const addToWishlist = (product) => {
    alert(`${product['Product Name']} added to wishlist!`);
  };

  return (
    <>
      <Carousel />
      
      <HomeContainer>
        <HomeTitle>Welcome to Wardrobe Wizard</HomeTitle>
        <HomeSubtitle>
          Discover the perfect tees for every occasion. Our collection features premium quality
          t-shirts in various styles, colors, and fits.
        </HomeSubtitle>
        
        {/* Featured Products Section */}
        <FeaturedSection>
          <SectionHeader>
            <SectionTitle>
              <FaTshirt /> Featured Products
            </SectionTitle>
            <ViewAllLink to="/products">
              View All <FaArrowRight />
            </ViewAllLink>
          </SectionHeader>
          
          {loading ? (
            <LoadingMessage>Loading products...</LoadingMessage>
          ) : (
            <ProductGrid>
              {featuredProducts.map(product => (
                <ProductCard 
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  image={product.image}
                />
              ))}
            </ProductGrid>
          )}
        </FeaturedSection>
        
        {/* Shop By Category Section */}
        <CategoriesSection>
          <SectionHeader>
            <SectionTitle>Shop By Fit</SectionTitle>
            <ViewAllLink to="/products">
              View All <FaArrowRight />
            </ViewAllLink>
          </SectionHeader>
          
          <CategoryGrid>
            {categories.map((category, index) => (
              <CategoryCard key={index}>
                <CategoryImage src={category.image} alt={category.name} />
                <CategoryOverlay>
                  <CategoryName>{category.name}</CategoryName>
                </CategoryOverlay>
                <Link to={`/products?category=${category.name}`} />
              </CategoryCard>
            ))}
          </CategoryGrid>
        </CategoriesSection>
        
        {/* Top Rated Products Section */}
        <FeaturedSection>
          <SectionHeader>
            <SectionTitle>
              <FaStar /> Top Rated
            </SectionTitle>
            <ViewAllLink to="/products">
              View All <FaArrowRight />
            </ViewAllLink>
          </SectionHeader>
          
          {loading ? (
            <LoadingMessage>Loading products...</LoadingMessage>
          ) : (
            <ProductGrid>
              {topRatedProducts.map(product => (
                <ProductCard 
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  image={product.image}
                />
              ))}
            </ProductGrid>
          )}
        </FeaturedSection>
        
        {/* Newsletter Section */}
        <Newsletter>
          <NewsletterTitle>Join Our Newsletter</NewsletterTitle>
          <NewsletterText>
            Subscribe to our newsletter to receive updates on new arrivals, special offers and other discount information.
          </NewsletterText>
          <NewsletterForm onSubmit={handleNewsletterSubmit}>
            <NewsletterInput 
              type="email" 
              placeholder="Your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <NewsletterButton type="submit">Subscribe</NewsletterButton>
          </NewsletterForm>
        </Newsletter>
      </HomeContainer>
    </>
  );
};

export default Home;
