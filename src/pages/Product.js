import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ProductCard from '../components/ProductCard.js';
import { FaFilter, FaSort, FaTimes } from 'react-icons/fa';

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

  // Sample tshirt data - same as in Home.js
  const tshirts = [
    { id: 101, name: 'Regular Fit T-Shirt', category: 'T-Shirt', color: 'White', fit: 'Regular Fit', price: 28.92, image: '/images/tshirts/101.jpg', rating: 4.2 },
    { id: 102, name: 'Slim Fit T-Shirt', category: 'T-Shirt', color: 'Pink', fit: 'Slim Fit', price: 26.09, image: '/images/tshirts/102.jpg', rating: 4.5 },
    { id: 103, name: 'Regular Fit Graphic Tee', category: 'T-Shirt', color: 'Pink', fit: 'Regular Fit', price: 20.93, image: '/images/tshirts/103.jpg', rating: 4.2 },
    { id: 104, name: 'Regular Fit Solid Tee', category: 'T-Shirt', color: 'Orange', fit: 'Regular Fit', price: 39.72, image: '/images/tshirts/104.jpg', rating: 3.7 },
    { id: 105, name: 'Loose Fit Plain Tee', category: 'T-Shirt', color: 'White', fit: 'Loose Fit', price: 33.79, image: '/images/tshirts/105.jpg', rating: 4.7 },
    { id: 114, name: 'Regular Fit Graphic Tee', category: 'T-Shirt', color: 'White', fit: 'Regular Fit', price: 35.72, image: '/images/tshirts/114.jpg', rating: 5.0 },
    { id: 115, name: 'Regular Fit Graphic Tee', category: 'T-Shirt', color: 'Beige', fit: 'Regular Fit', price: 48.49, image: '/images/tshirts/115.jpg', rating: 4.7 },
    { id: 203, name: 'Loose Fit Solid Tee', category: 'T-Shirt', color: 'Black', fit: 'Loose Fit', price: 22.50, image: '/images/tshirts/203.jpg', rating: 4.3 },
    { id: 305, name: 'Slim Fit Premium Tee', category: 'T-Shirt', color: 'Blue', fit: 'Slim Fit', price: 29.99, image: '/images/tshirts/305.jpg', rating: 4.8 },
    { id: 407, name: 'Oversized Fit Tee', category: 'T-Shirt', color: 'Grey', fit: 'Oversized Fit', price: 31.50, image: '/images/tshirts/407.jpg', rating: 4.6 },
    { id: 201, name: 'Loose Fit Comfy Tee', category: 'T-Shirt', color: 'Blue', fit: 'Loose Fit', price: 24.95, image: '/images/tshirts/201.jpg', rating: 4.4 },
    { id: 202, name: 'Loose Fit Casual Tee', category: 'T-Shirt', color: 'Red', fit: 'Loose Fit', price: 26.75, image: '/images/tshirts/202.jpg', rating: 4.1 },
    { id: 301, name: 'Slim Fit Fashion Tee', category: 'T-Shirt', color: 'Black', fit: 'Slim Fit', price: 34.99, image: '/images/tshirts/301.jpg', rating: 4.7 },
    { id: 302, name: 'Slim Fit Modern Tee', category: 'T-Shirt', color: 'White', fit: 'Slim Fit', price: 31.25, image: '/images/tshirts/302.jpg', rating: 4.6 },
    { id: 401, name: 'Oversized Street Tee', category: 'T-Shirt', color: 'Black', fit: 'Oversized Fit', price: 38.50, image: '/images/tshirts/401.jpg', rating: 4.9 },
    { id: 402, name: 'Oversized Trend Tee', category: 'T-Shirt', color: 'Grey', fit: 'Oversized Fit', price: 36.75, image: '/images/tshirts/402.jpg', rating: 4.8 }
  ];

  // Additional tshirts by adding more from the dataset
  for (let i = 106; i <= 120; i++) {
    if (i !== 114 && i !== 115) { // Skip already added ones
      tshirts.push({
        id: i,
        name: `T-Shirt ${i}`,
        category: 'T-Shirt',
        color: ['Black', 'White', 'Blue', 'Grey', 'Red'][Math.floor(Math.random() * 5)],
        fit: ['Regular Fit', 'Slim Fit', 'Loose Fit', 'Oversized Fit'][Math.floor(Math.random() * 4)],
        price: (Math.random() * 30 + 15).toFixed(2),
        image: `/images/tshirts/${i}.jpg`,
        rating: (Math.random() * 2 + 3).toFixed(1)
      });
    }
  }

  // Load products
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setProducts(tshirts);
      setLoading(false);
    }, 500);
  }, []);

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
      <ProductsTitle>
        {categoryParam ? `${categoryParam} T-Shirts` : 
         filterParam === 'new' ? 'New Arrivals' :
         filterParam === 'sale' ? 'Special Offers' :
         'All Products'}
      </ProductsTitle>
      
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
              image={product.image}
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
