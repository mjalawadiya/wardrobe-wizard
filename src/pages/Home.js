import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Carousel from '../components/Carousel.js';
import ProductCard from '../components/ProductCard.js';
import WeatherRecommendations from '../components/WeatherRecommendations.js';
import { FaArrowRight, FaTshirt, FaStar, FaSearch } from 'react-icons/fa';
import { generateRandomTshirts } from '../services/productService.js';
import ImageLoader from '../components/ImageLoader.js';
import './Home.css';
import { useUser } from '../contexts/UserContext.js';

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
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
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
  height: 300px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const CategoryImage = styled(ImageLoader)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
  
  ${CategoryCard}:hover & {
    transform: scale(1.05);
  }
`;

const CategoryOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
`;

const CategoryName = styled.h3`
  color: white;
  font-size: 1.4rem;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const CategoryLink = styled(Link)`
  position: absolute;
  inset: 0;
  z-index: 1;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #7f8c8d;
`;

const Newsletter = styled.div`
  margin: 5rem 0;
  padding: 3rem;
  background-color: #f8f9fa;
  border-radius: 10px;
  text-align: center;
`;

const NewsletterTitle = styled.h2`
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const NewsletterText = styled.p`
  font-size: 1.1rem;
  color: #7f8c8d;
  max-width: 600px;
  margin: 0 auto 2rem;
`;

const NewsletterForm = styled.form`
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 1rem;
  border: 2px solid #ddd;
  border-right: 0;
  border-radius: 5px 0 0 5px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #f39c12;
  }
  
  @media (max-width: 600px) {
    border-right: 2px solid #ddd;
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
  transition: all 0.3s;
  
  &:hover {
    background-color: #e67e22;
  }
  
  @media (max-width: 600px) {
    border-radius: 5px;
  }
`;

const SearchContainer = styled.div`
  max-width: 800px;
  margin: 0 auto 3rem;
`;

const SearchForm = styled.form`
  display: flex;
  border: 2px solid #ddd;
  border-radius: 50px;
  overflow: hidden;
  transition: all 0.3s;
  
  &:focus-within {
    border-color: #f39c12;
    box-shadow: 0 0 10px rgba(243, 156, 18, 0.2);
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  font-size: 1.1rem;
  
  &:focus {
    outline: none;
  }
`;

const SearchButton = styled.button`
  background-color: #f39c12;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #e67e22;
  }
`;

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const { user: userContextData } = useUser();

  // Predefined categories for the UI
  const categories = [
    { id: 1, name: 'Regular Fit' },
    { id: 2, name: 'Slim Fit' },
    { id: 3, name: 'Oversized' },
    { id: 4, name: 'Relaxed Fit' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Generate sample products for demonstration
        const tshirts = await generateRandomTshirts(6);
        
        // Split into featured and top rated - limit to 3 each
        const featured = tshirts.slice(0, 3);
        const topRated = tshirts.slice(3, 6);
        
        setFeaturedProducts(featured);
        setTopRatedProducts(topRated);
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
    alert(`Thank you for subscribing with: ${email}`);
    setEmail('');
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Helper function to create image path for category visualization
  const getCategoryImagePath = (id) => {
    try {
      // Ensure the ID is a number between 1 and 20
      const numId = typeof id === 'number' ? id : parseInt(id);
      if (isNaN(numId)) return '/images/image1.jpeg';
      
      const normalizedId = ((numId - 1) % 20) + 1;
      return `/res/tshirt/${normalizedId}.jpg`;
    } catch (error) {
      console.error('Error creating category image path:', error);
      return '/images/image1.jpeg';
    }
  };

  // Add to cart (This would be implemented with context or global state management in a real app)
  const addToCart = (product) => {
    alert(`${product['Product Name']} added to cart!`);
  };

  // Add to wishlist
  const addToWishlist = (product) => {
    alert(`${product['Product Name']} added to wishlist!`);
  };

  return (
    <div className="home-container">
      <HomeContainer>
        <HomeTitle>Welcome to Wardrobe Wizard</HomeTitle>
        <HomeSubtitle>
          Discover the perfect outfit for every occasion. Quality clothing, curated just for you.
        </HomeSubtitle>

        {/* Search bar */}
        <SearchContainer>
          <SearchForm onSubmit={handleSearch}>
            <SearchButton type="submit">
              <FaSearch />
            </SearchButton>
            <SearchInput
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchForm>
        </SearchContainer>

        {/* Weather recommendations section */}
        <WeatherRecommendations />
        
        <Carousel />
        
        {/* Featured Products Section */}
        <FeaturedSection>
          <SectionHeader>
            <SectionTitle>
              <FaStar /> Featured Products
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
                <ProductCard key={product.id} product={product} />
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
                <CategoryImage 
                  src={getCategoryImagePath(category.id)} 
                  alt={category.name} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                  fallbackSrc="/images/image1.jpeg"
                  onError={() => {
                    console.error('Category image failed to load:', category.id);
                  }}
                />
                <CategoryOverlay>
                  <CategoryName>{category.name}</CategoryName>
                </CategoryOverlay>
                <CategoryLink to={`/products?fit=${category.name.toLowerCase()}`} />
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
                <ProductCard key={product.id} product={product} />
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
    </div>
  );
};

export default Home; 