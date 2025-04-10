import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { FaHeart, FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar, FaArrowLeft, FaTshirt, FaCloudSun, FaSnowflake, FaSun, FaUmbrella, FaWind } from 'react-icons/fa';
import { getTshirtImagePath } from '../services/productService.js';
import '../styles/components/productDetail.css';
import ImageLoader from '../components/ImageLoader.js';

const ProductDetailContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProductHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #f39c12;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  
  &:hover {
    color: #e67e22;
  }
`;

const ProductContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  height: 500px;
  background-color: #f8f8f8;
`;

const ProductImage = styled(ImageLoader)`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductTitle = styled.h1`
  font-size: 2rem;
  color: #2c3e50;
  margin: 0 0 1rem;
`;

const ProductBadge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
  background-color: ${props => props.outOfStock ? '#e74c3c' : '#2ecc71'};
  color: white;
`;

const ProductPrice = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #f39c12;
  margin-bottom: 1.5rem;
`;

const ProductDescription = styled.p`
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ProductMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MetaGroup = styled.div`
  margin-bottom: 2rem;
`;

const MetaTitle = styled.h3`
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const WeatherSuitability = styled.div`
  margin-top: 2rem;
`;

const WeatherTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${props => props.active ? '#e8f4fd' : '#f8f9fa'};
  color: ${props => props.active ? '#3498db' : '#95a5a6'};
  border-radius: 20px;
  margin-right: 0.8rem;
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
  
  svg {
    color: ${props => props.active ? props.iconColor || '#f39c12' : '#95a5a6'};
  }
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetaLabel = styled.span`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 0.3rem;
`;

const MetaValue = styled.span`
  font-weight: 600;
  color: #2c3e50;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const RatingStars = styled.div`
  display: flex;
  color: #f39c12;
  gap: 2px;
`;

const RatingText = styled.span`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const SizeSelector = styled.div`
  margin-bottom: 1.5rem;
`;

const SizeLabel = styled.span`
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const SizeOptions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SizeOption = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: 1px solid #ddd;
  background-color: ${props => props.active ? '#f39c12' : 'white'};
  color: ${props => props.active ? 'white' : '#2c3e50'};
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.disabled ? 'white' : props.active ? '#e67e22' : '#f8f9fa'};
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const QuantityLabel = styled.span`
  font-weight: 600;
  color: #2c3e50;
  margin-right: 1rem;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  background-color: #f8f9fa;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: #f39c12;
    color: white;
  }
  
  &:disabled {
    background-color: #f8f9fa;
    color: #ccc;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  height: 40px;
  border: none;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  
  &:focus {
    outline: none;
  }
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  background-color: ${props => props.primary ? '#f39c12' : 'rgba(243, 156, 18, 0.1)'};
  color: ${props => props.primary ? 'white' : '#f39c12'};
  
  &:hover {
    background-color: ${props => props.primary ? '#e67e22' : 'rgba(243, 156, 18, 0.2)'};
  }
  
  &:disabled {
    background-color: #ccc;
    color: white;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1.5rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%;
`;

// Function to render star ratings
const renderRatingStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const totalStars = 5;
  
  const stars = [];
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} />);
  }
  
  // Add half star if needed
  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" />);
  }
  
  // Add empty stars
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaRegStar key={`empty-${i}`} />);
  }
  
  return stars;
};

// Helper function to preload an image
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(true);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
  });
};

const ProductDetail = () => {
  const { id } = useParams();
  const productId = parseInt(id);
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('M');  // Default size
  const [user, setUser] = useState(null);
  const [imageSrc, setImageSrc] = useState('');

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Set image source and preload when product ID changes
  useEffect(() => {
    if (productId) {
      setImageLoading(true);
      // Ensure ID is properly converted to a number
      const productIdNum = Number(productId);
      const path = `/res/tshirt/${productIdNum}.jpg`;
      setImageSrc(path);
      console.log('Setting image path:', path);
      
      // Attempt to preload the image
      preloadImage(path)
        .then(() => {
          console.log('Image preloaded successfully:', path);
          setImageLoading(false);
        })
        .catch((error) => {
          console.error('Error preloading image:', error);
          setImageLoading(false);
        });
    }
  }, [productId]);

  // Handle image load event
  const handleImageLoad = () => {
    console.log('Image loaded successfully');
    setImageLoading(false);
  };

  // Fetch or create product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Try to fetch from API
        const { data } = await axios.get(`/api/products/${productId}`);
        console.log('Fetched product data:', data);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        
        // If API fails, create a mock product
        console.log('Creating fallback product for ID:', productId);
        const mockProduct = {
          id: productId,
          'Product ID': productId,
          'Product Name': `T-Shirt ${productId}`,
          'Price': '29.99',
          'User Ratings': '4.5',
          'Product Description': 'A comfortable and stylish t-shirt for everyday wear.',
          'Category': 'T-Shirt',
          'Color': 'Mixed',
          'Fabric': 'Cotton',
          'Pattern': 'Solid',
          'Fit Type': 'Regular Fit',
          'Occasion': 'Casual'
        };
        
        setProduct(mockProduct);
        setError('Using sample product data.');
      } finally {
        setLoading(false);
      }
    };
    
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Handle add to cart
  const handleAddToCart = async () => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }
      
      const productIdToUse = (product['Product ID'] || product.id).toString();
      console.log('Adding to cart from detail page:', {
        userId: user._id,
        productId: productIdToUse,
        quantity: quantity
      });
      
      const response = await axios.post('/api/cart', {
        userId: user._id,
        productId: productIdToUse,
        quantity: quantity
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Cart API response:', response.data);
      
      // Also update local cart storage for navbar display
      const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = currentCart.findIndex(item => item.productId === productIdToUse);
      
      if (existingItemIndex !== -1) {
        // If item already in cart, update quantity
        currentCart[existingItemIndex].quantity += quantity;
      } else {
        // Otherwise add new item
        currentCart.push({ productId: productIdToUse, quantity });
      }
      
      localStorage.setItem('cart', JSON.stringify(currentCart));
      
      // Trigger storage event
      window.dispatchEvent(new Event('storage'));
      
      alert(`Added ${product['Product Name'] || product.name} to cart!`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
      }
      setError('Failed to add to cart. Please try again.');
    }
  };

  // Handle add to wishlist
  const handleAddToWishlist = async () => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }
      
      const productIdToUse = (product['Product ID'] || product.id).toString();
      console.log('Adding to wishlist from detail page:', {
        userId: user._id,
        productId: productIdToUse
      });
      
      const response = await axios.post('/api/wishlist', {
        userId: user._id,
        productId: productIdToUse
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Wishlist API response:', response.data);
      
      alert(`Added ${product['Product Name'] || product.name} to wishlist!`);
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data.message.includes('already in wishlist')) {
        alert('This product is already in your wishlist!');
      } else {
        console.error('Error adding to wishlist:', err);
        if (err.response) {
          console.error('Error response:', err.response.data);
        }
        setError('Failed to add to wishlist. Please try again.');
      }
    }
  };

  // Define weather suitability for the product
  const getWeatherSuitability = (product) => {
    // Default suitability if product doesn't have it defined
    if (!product || !product.weatherSuitability) {
      // Example default assignment based on product properties
      const defaultSuitability = {
        hot: product.fabric?.toLowerCase().includes('cotton') || false,
        moderate: true, // Most clothing is suitable for moderate weather
        cold: product.fabric?.toLowerCase().includes('wool') || product.category?.toLowerCase().includes('winter') || false,
        rain: product.waterproof || false,
        snow: product.category?.toLowerCase().includes('winter') || false,
        windy: !product.category?.toLowerCase().includes('loose') || true
      };
      return defaultSuitability;
    }
    return product.weatherSuitability;
  };

  // Get weather condition icon
  const getWeatherIcon = (condition) => {
    switch(condition) {
      case 'hot':
        return <FaSun />;
      case 'cold':
        return <FaSnowflake />;
      case 'rain':
        return <FaUmbrella />;
      case 'snow':
        return <FaSnowflake />;
      case 'windy':
        return <FaWind />;
      default:
        return <FaCloudSun />;
    }
  };

  // Get icon color for weather condition
  const getIconColor = (condition) => {
    switch(condition) {
      case 'hot':
        return '#e74c3c';
      case 'cold':
        return '#3498db';
      case 'rain':
        return '#2980b9';
      case 'snow':
        return '#7f8c8d';
      case 'windy':
        return '#95a5a6';
      default:
        return '#f39c12';
    }
  };

  // Loading state
  if (loading) {
    return (
      <ProductDetailContainer>
        <LoadingContainer>
          <div>Loading product details...</div>
        </LoadingContainer>
      </ProductDetailContainer>
    );
  }

  // Error state with no product
  if (!product) {
    return (
      <ProductDetailContainer>
        <ErrorMessage>
          Product not found.
        </ErrorMessage>
        <BackButton to="/products">
          <FaArrowLeft /> Back to Products
        </BackButton>
      </ProductDetailContainer>
    );
  }

  // Default values and flags
  const isOutOfStock = product['Availability'] === 'Out of Stock';
  const productName = product['Product Name'] || product.name;
  const productPrice = parseFloat(product['Price'] || product.price);
  const productRating = parseFloat(product['User Ratings'] || product.rating);
  const productDesc = product['Product Description'] || product.description || 'A high-quality t-shirt for everyday wear.';
  
  return (
    <ProductDetailContainer>
      <ProductHeader>
        <BackButton to="/products">
          <FaArrowLeft /> Back to Products
        </BackButton>
      </ProductHeader>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {/* Only show loading if the entire product is loading, not just the image */}
      {loading ? (
        <LoadingContainer>
          <div>Loading product details...</div>
        </LoadingContainer>
      ) : (
        <ProductContent>
          <ProductImageContainer className="product-image-container">
            {imageSrc && (
              <ProductImage 
                src={imageSrc} 
                alt={productName || `T-Shirt ${productId}`}
                className="image-fix"
                style={{
                  border: '1px solid #eee',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  backgroundColor: '#f8f8f8',
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center'
                }}
                fallbackSrc="/images/image1.jpeg"
                onLoad={handleImageLoad}
                onError={(e) => {
                  console.error('Image failed to load:', imageSrc);
                  setImageLoading(false);
                }}
              />
            )}
          </ProductImageContainer>
          
          <ProductInfo>
            <ProductTitle>{productName}</ProductTitle>
            
            <ProductBadge outOfStock={isOutOfStock}>
              {isOutOfStock ? 'Out of Stock' : 'In Stock'}
            </ProductBadge>
            
            <RatingContainer>
              <RatingStars>
                {renderRatingStars(productRating)}
              </RatingStars>
              <RatingText>({productRating} out of 5)</RatingText>
            </RatingContainer>
            
            <ProductPrice>
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR'
              }).format(productPrice * 75)}
            </ProductPrice>
            
            <ProductDescription>
              {productDesc}
            </ProductDescription>
            
            <ProductMeta>
              <MetaGroup>
                <MetaTitle>Product Details</MetaTitle>
                <MetaItem>
                  <MetaLabel>Category</MetaLabel>
                  <MetaValue>{product['Category'] || 'T-Shirt'}</MetaValue>
                </MetaItem>
                
                <MetaItem>
                  <MetaLabel>Color</MetaLabel>
                  <MetaValue>{product['Color'] || 'Mixed'}</MetaValue>
                </MetaItem>
                
                <MetaItem>
                  <MetaLabel>Fabric</MetaLabel>
                  <MetaValue>{product['Fabric'] || 'Cotton'}</MetaValue>
                </MetaItem>
                
                <MetaItem>
                  <MetaLabel>Pattern</MetaLabel>
                  <MetaValue>{product['Pattern'] || 'Solid'}</MetaValue>
                </MetaItem>
                
                <MetaItem>
                  <MetaLabel>Fit Type</MetaLabel>
                  <MetaValue>{product['Fit Type'] || 'Regular Fit'}</MetaValue>
                </MetaItem>
                
                <MetaItem>
                  <MetaLabel>Occasion</MetaLabel>
                  <MetaValue>{product['Occasion'] || 'Casual'}</MetaValue>
                </MetaItem>
              </MetaGroup>
              
              <WeatherSuitability>
                <MetaTitle>
                  <FaCloudSun style={{ marginRight: '8px', color: '#f39c12' }} />
                  Weather Suitability
                </MetaTitle>
                <div>
                  {Object.entries(getWeatherSuitability(product)).map(([condition, suitable]) => (
                    <WeatherTag 
                      key={condition} 
                      active={suitable}
                      iconColor={getIconColor(condition)}
                    >
                      {getWeatherIcon(condition)}
                      {condition.charAt(0).toUpperCase() + condition.slice(1)} Weather
                    </WeatherTag>
                  ))}
                </div>
              </WeatherSuitability>
            </ProductMeta>
            
            <SizeSelector>
              <SizeLabel>Size</SizeLabel>
              <SizeOptions>
                {['S', 'M', 'L', 'XL'].map(sizeOption => (
                  <SizeOption 
                    key={sizeOption}
                    active={size === sizeOption}
                    onClick={() => setSize(sizeOption)}
                    disabled={isOutOfStock}
                  >
                    {sizeOption}
                  </SizeOption>
                ))}
              </SizeOptions>
            </SizeSelector>
            
            <QuantitySelector>
              <QuantityLabel>Quantity</QuantityLabel>
              <QuantityControls>
                <QuantityButton 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                >
                  -
                </QuantityButton>
                
                <QuantityInput 
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 1) {
                      setQuantity(val);
                    }
                  }}
                  disabled={isOutOfStock}
                />
                
                <QuantityButton 
                  onClick={() => setQuantity(prev => prev + 1)}
                  disabled={isOutOfStock}
                >
                  +
                </QuantityButton>
              </QuantityControls>
            </QuantitySelector>
            
            <ActionButtons>
              <ActionButton 
                primary 
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                <FaShoppingCart />
                Add to Cart
              </ActionButton>
              
              <ActionButton onClick={handleAddToWishlist}>
                <FaHeart />
                Add to Wishlist
              </ActionButton>
            </ActionButtons>
          </ProductInfo>
        </ProductContent>
      )}
    </ProductDetailContainer>
  );
};

export default ProductDetail; 