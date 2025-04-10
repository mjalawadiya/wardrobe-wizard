import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProductCard from './ProductCard.js';
import { FaFilter, FaSort, FaTimes } from 'react-icons/fa';

const ProductsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1.5rem 0;
`;

const FilterContainer = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const FilterTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2c3e50;
  
  svg {
    color: #f39c12;
  }
`;

const FilterBody = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  
  &:focus {
    border-color: #f39c12;
    box-shadow: 0 0 0 2px rgba(243, 156, 18, 0.2);
  }
`;

const FilterButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #f39c12;
  }
  
  svg {
    font-size: 0.9rem;
  }
`;

const AppliedFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const FilterTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background-color: rgba(243, 156, 18, 0.1);
  color: #f39c12;
  padding: 0.3rem 0.7rem;
  border-radius: 50px;
  font-size: 0.9rem;
  
  svg {
    cursor: pointer;
    &:hover {
      color: #e67e22;
    }
  }
`;

const NoProductsMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  grid-column: 1 / -1;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem;
  grid-column: 1 / -1;
`;

const ProductList = ({ products, searchQuery, addToCart, addToWishlist }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    color: '',
    size: '',
    fabric: '',
    priceRange: '',
    availability: ''
  });
  const [sortOption, setSortOption] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filter and sort products
  useEffect(() => {
    setLoading(true);
    if (!products || products.length === 0) {
      setFilteredProducts([]);
      setLoading(false);
      return;
    }

    let filtered = [...products];

    // Apply search
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => {
        return (
          product['Product Name'].toLowerCase().includes(query) ||
          product['Product Description'].toLowerCase().includes(query) ||
          product['Keywords for Search'].toLowerCase().includes(query)
        );
      });
    }

    // Apply filters
    if (filters.color) {
      filtered = filtered.filter(product => product['Color'] === filters.color);
    }

    if (filters.size) {
      filtered = filtered.filter(product => product['Size'] === filters.size);
    }

    if (filters.fabric) {
      filtered = filtered.filter(product => product['Fabric'] === filters.fabric);
    }

    if (filters.availability) {
      filtered = filtered.filter(product => product['Availability'] === filters.availability);
    }

    if (filters.priceRange) {
      switch (filters.priceRange) {
        case 'under20':
          filtered = filtered.filter(product => parseFloat(product['Price']) * 75 < 1500);
          break;
        case '20to30':
          filtered = filtered.filter(product => {
            const price = parseFloat(product['Price']) * 75;
            return price >= 1500 && price <= 2250;
          });
          break;
        case '30to40':
          filtered = filtered.filter(product => {
            const price = parseFloat(product['Price']) * 75;
            return price > 2250 && price <= 3000;
          });
          break;
        case 'over40':
          filtered = filtered.filter(product => parseFloat(product['Price']) * 75 > 3000);
          break;
        default:
          // No price filter
          break;
      }
    }

    // Apply sorting
    if (sortOption) {
      switch (sortOption) {
        case 'priceLow':
          filtered.sort((a, b) => parseFloat(a['Price']) - parseFloat(b['Price']));
          break;
        case 'priceHigh':
          filtered.sort((a, b) => parseFloat(b['Price']) - parseFloat(a['Price']));
          break;
        case 'rating':
          filtered.sort((a, b) => parseFloat(b['User Ratings']) - parseFloat(a['User Ratings']));
          break;
        default:
          // No sorting
          break;
      }
    }

    setFilteredProducts(filtered);
    setLoading(false);
  }, [products, searchQuery, filters, sortOption]);

  // Get unique filter options
  const getUniqueFilterOptions = (field) => {
    if (!products || products.length === 0) return [];
    
    const options = [...new Set(products.map(product => product[field]))];
    return options.filter(option => option && option !== '');
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Remove a filter
  const removeFilter = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: ''
    }));
  };

  // Get applied filters for display
  const getAppliedFilters = () => {
    const applied = [];
    
    if (filters.color) applied.push({ name: 'color', value: filters.color });
    if (filters.size) applied.push({ name: 'size', value: filters.size });
    if (filters.fabric) applied.push({ name: 'fabric', value: filters.fabric });
    if (filters.availability) applied.push({ name: 'availability', value: filters.availability });
    
    if (filters.priceRange) {
      let priceLabel = '';
      switch (filters.priceRange) {
        case 'under20': priceLabel = 'Under ₹1,500'; break;
        case '20to30': priceLabel = '₹1,500 - ₹2,250'; break;
        case '30to40': priceLabel = '₹2,250 - ₹3,000'; break;
        case 'over40': priceLabel = 'Over ₹3,000'; break;
        default: priceLabel = '';
      }
      applied.push({ name: 'priceRange', value: priceLabel });
    }
    
    return applied;
  };

  return (
    <div>
      <FilterContainer>
        <FilterHeader>
          <FilterTitle>
            <FaFilter /> Filters & Sorting
          </FilterTitle>
          <FilterButton onClick={() => setIsFilterOpen(!isFilterOpen)}>
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </FilterButton>
        </FilterHeader>

        <FilterBody isOpen={isFilterOpen}>
          <FilterRow>
            <FilterGroup>
              <FilterLabel>Color</FilterLabel>
              <FilterSelect 
                name="color" 
                value={filters.color} 
                onChange={handleFilterChange}
              >
                <option value="">All Colors</option>
                {getUniqueFilterOptions('Color').map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Size</FilterLabel>
              <FilterSelect 
                name="size" 
                value={filters.size} 
                onChange={handleFilterChange}
              >
                <option value="">All Sizes</option>
                {getUniqueFilterOptions('Size').map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Fabric</FilterLabel>
              <FilterSelect 
                name="fabric" 
                value={filters.fabric} 
                onChange={handleFilterChange}
              >
                <option value="">All Fabrics</option>
                {getUniqueFilterOptions('Fabric').map(fabric => (
                  <option key={fabric} value={fabric}>{fabric}</option>
                ))}
              </FilterSelect>
            </FilterGroup>
          </FilterRow>

          <FilterRow>
            <FilterGroup>
              <FilterLabel>Price Range</FilterLabel>
              <FilterSelect 
                name="priceRange" 
                value={filters.priceRange} 
                onChange={handleFilterChange}
              >
                <option value="">All Prices</option>
                <option value="under20">Under ₹1,500</option>
                <option value="20to30">₹1,500 - ₹2,250</option>
                <option value="30to40">₹2,250 - ₹3,000</option>
                <option value="over40">Over ₹3,000</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Availability</FilterLabel>
              <FilterSelect 
                name="availability" 
                value={filters.availability} 
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Sort By</FilterLabel>
              <FilterSelect 
                name="sortOption" 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Default</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </FilterSelect>
            </FilterGroup>
          </FilterRow>

          {getAppliedFilters().length > 0 && (
            <AppliedFilters>
              {getAppliedFilters().map(filter => (
                <FilterTag key={filter.name}>
                  {filter.name === 'color' ? 'Color: ' : 
                   filter.name === 'size' ? 'Size: ' : 
                   filter.name === 'fabric' ? 'Fabric: ' : 
                   filter.name === 'priceRange' ? 'Price: ' : 
                   filter.name === 'availability' ? 'Availability: ' : ''}
                  {filter.value}
                  <FaTimes onClick={() => removeFilter(filter.name)} />
                </FilterTag>
              ))}
              
              {getAppliedFilters().length > 1 && (
                <FilterButton 
                  onClick={() => setFilters({
                    color: '',
                    size: '',
                    fabric: '',
                    priceRange: '',
                    availability: ''
                  })}
                >
                  Clear All
                </FilterButton>
              )}
            </AppliedFilters>
          )}
        </FilterBody>
      </FilterContainer>

      {loading ? (
        <LoadingContainer>
          <div>Loading products...</div>
        </LoadingContainer>
      ) : filteredProducts.length > 0 ? (
        <ProductsContainer>
          {filteredProducts.map(product => (
            <ProductCard 
              key={product['Product ID']} 
              product={product}
              addToCart={addToCart}
              addToWishlist={addToWishlist}
            />
          ))}
        </ProductsContainer>
      ) : (
        <NoProductsMessage>
          No products found matching your criteria. Try changing your filters.
        </NoProductsMessage>
      )}
    </div>
  );
};

export default ProductList;
