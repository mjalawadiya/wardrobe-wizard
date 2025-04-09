import React, { useState, useEffect } from 'react';
import { FaCloudSun, FaTshirt, FaSnowflake, FaSun, FaUmbrella, FaWind, FaLocationArrow, FaSearch, FaArrowRight, FaLock } from 'react-icons/fa';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getProductsByWeatherCondition, mapWeatherToCondition } from '../services/productService.js';
import ProductCard from './ProductCard.js';
import '../styles/components/weatherRecommendations.css';

const API_KEY = '2f6077e18a2d264f483dbacbf2026c93';

const WeatherRecommendations = () => {
  const [userData, setUserData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('');
  const [newCity, setNewCity] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [weatherCondition, setWeatherCondition] = useState('moderate');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in and get user data from localStorage
  useEffect(() => {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        const parsedUserData = JSON.parse(userDataString);
        setUserData(parsedUserData);
        setIsLoggedIn(true);
        setCity(parsedUserData.city || 'London');
      } catch (error) {
        console.error("Error parsing user data:", error);
        setIsLoggedIn(false);
        setCity('London');
      }
    } else {
      setIsLoggedIn(false);
      setCity('London');
    }
  }, []);

  // Fetch weather data when city changes - only if logged in
  useEffect(() => {
    if (city && isLoggedIn) {
      fetchWeatherData(city);
    } else if (!isLoggedIn) {
      setLoading(false);
    }
  }, [city, isLoggedIn]);

  // Get product recommendations when weather data or condition changes
  useEffect(() => {
    if (weather) {
      const mappedCondition = mapWeatherToCondition(weather);
      setWeatherCondition(mappedCondition);
      
      // Updated to handle async function
      const fetchProducts = async () => {
        try {
          const products = await getProductsByWeatherCondition(mappedCondition, 6);
          setRecommendations(products);
        } catch (error) {
          console.error('Error fetching product recommendations:', error);
          setRecommendations([]);
        }
      };
      
      fetchProducts();
    }
  }, [weather]);

  // Fetch weather data from OpenWeather API
  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      console.log('Weather data:', response.data);
      setWeather(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(`Could not fetch weather for ${cityName}. Please try another city.`);
      setLoading(false);
    }
  };

  // Update user's city
  const updateUserCity = async () => {
    if (!userData || !userData._id) {
      setCity(newCity);
      setNewCity('');
      return;
    }

    try {
      // Update city without accessing API - just update local storage and state
      // This approach works even if the API endpoint is not available
      const updatedUserData = { ...userData, city: newCity };
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      setUserData(updatedUserData);
      
      // Update current city and trigger a weather fetch
      setCity(newCity);
      setNewCity('');
      
      // Attempt to update server-side if endpoint is available
      try {
        await axios.put('/api/users/city', 
          { city: newCity },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        console.log('City updated in server successfully');
      } catch (apiErr) {
        console.warn('City updated locally only, server update failed:', apiErr);
        // Don't show error to user since we've updated locally
      }
      
    } catch (err) {
      console.error('Error updating city:', err);
      setError('Failed to update city. Please try again.');
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newCity.trim()) {
      updateUserCity();
    }
  };

  // Helper function to get weather condition title
  const getWeatherTitle = (condition) => {
    switch(condition) {
      case 'hot':
        return 'Hot Weather';
      case 'moderate':
        return 'Moderate Weather';
      case 'cold':
        return 'Cold Weather';
      case 'rain':
        return 'Rainy Weather';
      case 'snow':
        return 'Snowy Weather';
      case 'windy':
        return 'Windy Weather';
      default:
        return 'Current Weather';
    }
  };

  // Helper function to get weather condition icon
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
        return <FaTshirt />;
    }
  };

  // Redirect to login
  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: '/' } });
  };

  // If not logged in, show auth required message
  if (!isLoggedIn) {
    return (
      <div className="weather-recommendations">
        <div className="weather-recommendations-header">
          <h2 className="weather-recommendations-title">
            <FaCloudSun /> Weather-based Clothing Recommendations
          </h2>
        </div>
        <div className="auth-message">
          <FaLock className="auth-icon" />
          <h3>Login Required</h3>
          <p>You need to be logged in to access personalized weather-based clothing recommendations.</p>
          <button className="auth-button" onClick={handleLoginRedirect}>
            Login Now
          </button>
        </div>
      </div>
    );
  }

  // If logged in but still loading
  if (!weather && loading) {
    return (
      <div className="weather-recommendations">
        <h2 className="weather-recommendations-title">
          <FaCloudSun /> Loading Weather Recommendations...
        </h2>
      </div>
    );
  }

  return (
    <div className="weather-recommendations">
      <div className="weather-recommendations-header">
        <h2 className="weather-recommendations-title">
          <FaCloudSun /> Weather-based Clothing Recommendations
        </h2>
        <div className="weather-location">
          <FaLocationArrow /> {city}
          <form className="city-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="city-input"
              placeholder="Change city..."
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
            />
            <button type="submit" className="city-button">
              <FaSearch />
            </button>
          </form>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading-spinner">Loading weather data...</div>
      ) : weather && (
        <>
          <div className="weather-info">
            <img 
              className="weather-icon" 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
              alt={weather.weather[0].description} 
            />
            <div className="weather-details">
              <p className="weather-temp">{Math.round(weather.main.temp)}°C</p>
              <p className="weather-desc">{weather.weather[0].description}</p>
            </div>
            <div className="weather-condition">
              <p>Showing items for: <strong>{getWeatherTitle(weatherCondition)}</strong></p>
            </div>
          </div>
          
          <div className="product-recommendations">
            {recommendations.map((product) => (
              <div key={product.id} className="product-card-container">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          <div className="view-more-container">
            <Link to={`/products?weather=${weatherCondition}`} className="view-more-link">
              View more {getWeatherTitle(weatherCondition)} items <FaArrowRight />
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherRecommendations; 