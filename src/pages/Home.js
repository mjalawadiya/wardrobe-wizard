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

const CategoryImage = styled(ImageLoader)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  object-position: center;
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

const SearchContainer = styled.div`
  max-width: 600px;
  margin: 0 auto 2rem;
  position: relative;
`;

const SearchForm = styled.form`
  display: flex;
  width: 100%;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.8rem;
  padding-left: 3rem;
  border: 1px solid #ddd;
  border-radius: 30px;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  &:focus {
    border-color: #f39c12;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  }
`;

const SearchButton = styled.button`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #7f8c8d;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  transition: color 0.2s;
  
  &:hover {
    color: #f39c12;
  }
`;

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Get user data and set up event listeners for login/logout
  useEffect(() => {
    const checkUserData = () => {
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        try {
          const parsedUserData = JSON.parse(userDataString);
          setUserData(parsedUserData);
        } catch (error) {
          console.error("Error parsing user data:", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
    };

    // Check on initial render
    checkUserData();

    // Set up event listeners for login/logout
    window.addEventListener('userLogin', checkUserData);
    window.addEventListener('userLogout', checkUserData);
    window.addEventListener('storage', checkUserData);

    // Cleanup
    return () => {
      window.removeEventListener('userLogin', checkUserData);
      window.removeEventListener('userLogout', checkUserData);
      window.removeEventListener('storage', checkUserData);
    };
  }, []);

  // Fetch products
  useEffect(() => {
    // Using our product service to get random tshirts
    const fetchProducts = async () => {
      try {
        // Generate random tshirts using our service
        const allTshirts = generateRandomTshirts(30);
        
        // Use random tshirts for featured products
        const shuffled = [...allTshirts].sort(() => 0.5 - Math.random());
        setFeaturedProducts(shuffled.slice(0, 4));
        
        // Sort by rating for top rated products
        const sorted = [...allTshirts].sort((a, b) => 
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

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  // Categories to display - use sample product IDs from our tshirt data
  const categories = [
    { name: 'Regular Fit', id: 101 },
    { name: 'Loose Fit', id: 203 },
    { name: 'Slim Fit', id: 305 },
    { name: 'Oversized Fit', id: 407 }
  ];

  // Function to get image path for category
  const getCategoryImagePath = (categoryId) => {
    try {
      // Ensure categoryId is a number
      const numId = Number(categoryId);
      return `/res/tshirt/${numId}.jpg`;
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

      {/* Weather recommendations for logged-in users only */}
      {userData ? <WeatherRecommendations /> : null}
      
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
  );
};

export default Home;
