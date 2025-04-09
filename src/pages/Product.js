import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ProductCard from '../components/ProductCard.js';
import { FaFilter, FaSort, FaTimes, FaCloudSun, FaSearch } from 'react-icons/fa';
import { generateRandomTshirts, getProductsByWeatherCondition } from '../services/productService.js';

const ProductsContainer = styled.div`
  max-width: 1400px;
  width: 95%;
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
  padding-left: 2.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
  position: relative;
  appearance: none;
`;

const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
  
  svg {
    position: absolute;
    left: 0.8rem;
    top: 50%;
    transform: translateY(-50%);
    color: #f39c12;
    font-size: 1rem;
    pointer-events: none;
  }
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
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  grid-column: 1 / -1;
`;

const SearchContainer = styled.div`
  width: 100%;
  margin-bottom: 1.5rem;
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
  
  &:focus {
    border-color: #f39c12;
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

const Product = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('');
  const [filterOption, setFilterOption] = useState('');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  const filterParam = queryParams.get('filter');
  const weatherParam = queryParams.get('weather');
  const searchParam = queryParams.get('search');

  // Initialize local search query from URL params
  useEffect(() => {
    if (searchParam) {
      setLocalSearchQuery(searchParam);
    }
  }, [searchParam]);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      
      try {
        // Check if we're filtering by weather condition
        if (weatherParam) {
          // Get products suitable for the weather condition
          const weatherProducts = await getProductsByWeatherCondition(weatherParam, 20);
          setProducts(weatherProducts);
        } else {
          // Use our product service
          const productData = await generateRandomTshirts(50);
          setProducts(productData);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [weatherParam]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];
    
    // Apply search filter from URL parameter
    if (searchParam && searchParam.trim() !== '') {
      const query = searchParam.toLowerCase();
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
  }, [products, searchParam, categoryParam, filterParam, sortOption, filterOption]);

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

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      // Create new URL with updated search param
      const params = new URLSearchParams(location.search);
      params.set('search', localSearchQuery);
      navigate(`/products?${params.toString()}`);
    }
  };

  return (
    <ProductsContainer>
      <ProductsTitle>{getPageTitle()}</ProductsTitle>
      
      {weatherParam && (
        <WeatherBadge>
          <FaCloudSun /> Showing items suitable for {getPageTitle()}
        </WeatherBadge>
      )}
      
      {/* Search bar */}
      <SearchContainer>
        <SearchForm onSubmit={handleSearch}>
          <SearchButton type="submit">
            <FaSearch />
          </SearchButton>
          <SearchInput
            type="text"
            placeholder="Search products..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
          />
        </SearchForm>
      </SearchContainer>
      
      <FiltersContainer>
        <SelectWrapper>
          <FaSort />
          <FilterSelect 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating</option>
            <option value="name">Name</option>
          </FilterSelect>
        </SelectWrapper>
        
        <SelectWrapper>
          <FaFilter />
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
        </SelectWrapper>
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
              product={product}
            />
          ))}
        </ProductGrid>
      )}
    </ProductsContainer>
  );
};

export default Product;
