import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ProductCard from '../components/ProductCard.js';
import { FaFilter, FaSort, FaTimes, FaCloudSun } from 'react-icons/fa';
import { generateRandomTshirts, getProductsByWeatherCondition } from '../services/productService.js';

const ProductsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProductsTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
`;

const FiltersContainer = styled.div`
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
`;

const WeatherBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #e8f4fd;
  color: #3498db;
  border-radius: 5px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  
  svg {
    color: #f39c12;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  grid-column: 1 / -1;
`;

const Product = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('');
  const [filterOption, setFilterOption] = useState('');
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  const filterParam = queryParams.get('filter');
  const weatherParam = queryParams.get('weather');

  // Load products
  useEffect(() => {
    setLoading(true);
    
    // Check if we're filtering by weather condition
    if (weatherParam) {
      // Get products suitable for the weather condition
      const weatherProducts = getProductsByWeatherCondition(weatherParam, 20);
      setProducts(weatherProducts);
      setLoading(false);
    } else {
      // Use our product service instead of hardcoded data
      setTimeout(() => {
        // Generate a larger set of random products
        const productData = generateRandomTshirts(50);
        setProducts(productData);
        setLoading(false);
      }, 500);
    }
  }, [weatherParam]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];
    
    // Apply search filter
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.color.toLowerCase().includes(query) ||
        product.fit.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter from URL params
    if (categoryParam) {
      filtered = filtered.filter(product =>
        product.fit.toLowerCase() === categoryParam.toLowerCase()
      );
    }
    
    // Apply filter from URL params (new/sale)
    if (filterParam) {
      if (filterParam === 'new') {
        // Show newest products (using higher IDs as proxy for newer)
        filtered = filtered.sort((a, b) => b.id - a.id).slice(0, 8);
      } else if (filterParam === 'sale') {
        // Show random products as "on sale"
        filtered = filtered.sort(() => 0.5 - Math.random()).slice(0, 6);
      }
    }
    
    // Apply filter dropdown
    if (filterOption) {
      if (filterOption === 'color-black') {
        filtered = filtered.filter(product => product.color.toLowerCase() === 'black');
      } else if (filterOption === 'color-white') {
        filtered = filtered.filter(product => product.color.toLowerCase() === 'white');
      } else if (filterOption === 'fit-regular') {
        filtered = filtered.filter(product => product.fit.toLowerCase().includes('regular'));
      } else if (filterOption === 'fit-slim') {
        filtered = filtered.filter(product => product.fit.toLowerCase().includes('slim'));
      } else if (filterOption === 'fit-loose') {
        filtered = filtered.filter(product => product.fit.toLowerCase().includes('loose'));
      } else if (filterOption === 'fit-oversized') {
        filtered = filtered.filter(product => product.fit.toLowerCase().includes('oversized'));
      }
    }
    
    // Apply sort
    if (sortOption) {
      if (sortOption === 'price-asc') {
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (sortOption === 'price-desc') {
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      } else if (sortOption === 'rating') {
        filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      } else if (sortOption === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      }
    }
    
    setFilteredProducts(filtered);
  }, [products, searchQuery, categoryParam, filterParam, sortOption, filterOption]);

  // Get the right title based on parameters
  const getPageTitle = () => {
    if (weatherParam) {
      const weatherTitles = {
        'hot': 'Hot Weather',
        'moderate': 'Moderate Weather',
        'cold': 'Cold Weather',
        'rain': 'Rainy Weather',
        'snow': 'Snowy Weather',
        'windy': 'Windy Weather'
      };
      return `${weatherTitles[weatherParam] || 'Weather-Suitable'} Clothing`;
    } else if (categoryParam) {
      return `${categoryParam} T-Shirts`;
    } else if (filterParam === 'new') {
      return 'New Arrivals';
    } else if (filterParam === 'sale') {
      return 'Special Offers';
    } else {
      return 'All Products';
    }
  };

  const handleAddToCart = (product) => {
    console.log('Added to cart:', product);
    // Implement cart functionality
  };

  const handleAddToWishlist = (product) => {
    console.log('Added to wishlist:', product);
    // Implement wishlist functionality
  };

  return (
    <ProductsContainer>
      <ProductsTitle>{getPageTitle()}</ProductsTitle>
      
      {weatherParam && (
        <WeatherBadge>
          <FaCloudSun /> Showing items suitable for {getPageTitle()}
        </WeatherBadge>
      )}
      
      <FiltersContainer>
        <FilterSelect 
          value={sortOption} 
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="name">Name</option>
        </FilterSelect>
        
        <FilterSelect 
          value={filterOption} 
          onChange={(e) => setFilterOption(e.target.value)}
        >
          <option value="">Filter By</option>
          <option value="color-black">Color: Black</option>
          <option value="color-white">Color: White</option>
          <option value="fit-regular">Fit: Regular</option>
          <option value="fit-slim">Fit: Slim</option>
          <option value="fit-loose">Fit: Loose</option>
          <option value="fit-oversized">Fit: Oversized</option>
        </FilterSelect>
      </FiltersContainer>
      
      {loading ? (
        <NoResults>Loading products...</NoResults>
      ) : filteredProducts.length === 0 ? (
        <NoResults>No products found matching your criteria</NoResults>
      ) : (
        <ProductGrid>
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              rating={product.rating}
              category={product.fit}
              addToCart={handleAddToCart}
              addToWishlist={handleAddToWishlist}
            />
          ))}
        </ProductGrid>
      )}
    </ProductsContainer>
  );
};

export default Product;
