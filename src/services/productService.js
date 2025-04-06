/**
 * Product Service
 * Manages product data and operations
 */

// List of available tshirt images (IDs from 1-999 that exist in src/res/tshirt)
const availableTshirtIds = [
  91, 92, 93, 94, 95, 96, 97, 98, 99,
  101, 102, 103, 104, 105, 106, 107, 108, 109, 110,
  111, 112, 113, 114, 115, 116, 117, 118, 119, 120,
  201, 202, 203, 301, 302, 305, 401, 402, 407,
  910, 911, 912, 913, 914, 915, 916, 917, 918, 919,
  920, 921, 922, 923, 924, 925, 926, 927, 928, 929,
  930, 931, 932, 933, 934, 935, 936, 937, 938, 939,
  940, 941, 942, 943, 944, 945, 946, 947, 948, 949,
  950, 951, 952, 953, 954, 955, 956, 957, 958, 959,
  960, 961, 962, 963, 964, 965, 966, 967, 968, 969,
  970, 971, 972, 973, 974, 975, 976, 977, 978, 979,
  980, 981, 982, 983, 984, 985, 986, 987, 988, 989,
  990, 991, 992, 993, 994, 995, 996, 997, 998, 999
];

// Weather suitability mappings based on product IDs
const weatherSuitability = {
  hot: [91, 92, 93, 94, 95, 96, 97, 106, 107, 108, 401, 402, 910, 911, 920, 921, 932, 941, 950, 961],
  moderate: [98, 99, 101, 102, 103, 109, 110, 111, 112, 407, 912, 922, 933, 942, 951, 962, 970, 971],
  cold: [104, 105, 113, 114, 115, 116, 117, 118, 201, 202, 913, 914, 923, 934, 943, 952, 963, 972],
  rain: [119, 120, 203, 301, 302, 915, 916, 924, 925, 935, 944, 953, 964, 973, 974],
  snow: [305, 917, 918, 919, 926, 927, 936, 945, 954, 965, 975, 976],
  windy: [928, 929, 930, 937, 938, 946, 955, 966, 977, 978]
};

// Reverse mapping to quickly find weather suitability for a product
const productWeatherMap = {};
Object.keys(weatherSuitability).forEach(condition => {
  weatherSuitability[condition].forEach(id => {
    if (!productWeatherMap[id]) {
      productWeatherMap[id] = [];
    }
    productWeatherMap[id].push(condition);
  });
});

/**
 * Gets a list of all available tshirt images
 * @returns {Array} List of tshirt IDs that have images
 */
export const getAvailableTshirtImages = () => {
  return availableTshirtIds;
};

/**
 * Gets the full image path for a tshirt ID
 * @param {number} id Tshirt ID
 * @returns {string} Full image path
 */
export const getTshirtImagePath = (id) => {
  try {
    // Ensure id is a number and exists in the available ids
    const numId = Number(id);
    return `/res/tshirt/${numId}.jpg`;
  } catch (error) {
    console.error('Error generating image path for ID:', id, error);
    return '/images/image1.jpeg';
  }
};

/**
 * Generates random tshirt product data
 * @param {number} count Number of products to generate
 * @returns {Array} Array of tshirt product data
 */
export const generateRandomTshirts = (count = 20) => {
  const tshirts = [];
  const fitTypes = ['Regular Fit', 'Slim Fit', 'Loose Fit', 'Oversized Fit'];
  const colors = ['Black', 'White', 'Blue', 'Grey', 'Red', 'Green', 'Yellow', 'Brown', 'Pink', 'Purple'];
  
  // Use random images from available IDs
  const randomIds = [...availableTshirtIds].sort(() => 0.5 - Math.random()).slice(0, count);
  
  for (let i = 0; i < count; i++) {
    const id = randomIds[i];
    const fit = fitTypes[Math.floor(Math.random() * fitTypes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const weatherConditions = productWeatherMap[id] || ['moderate'];
    
    tshirts.push({
      id,
      name: `${fit} ${color} T-Shirt ${id}`,
      category: 'T-Shirt',
      color,
      fit,
      price: (Math.random() * 30 + 15).toFixed(2),
      image: `/res/tshirt/${id}.jpg`,
      rating: (Math.random() * 2 + 3).toFixed(1),
      weatherSuitability: weatherConditions
    });
  }
  
  return tshirts;
};

/**
 * Gets all products suitable for a specific weather condition
 * @param {string} weatherCondition Weather condition to filter by (hot, moderate, cold, rain, snow, windy)
 * @param {number} limit Maximum number of products to return (default: all)
 * @returns {Array} Array of products suitable for the given weather
 */
export const getProductsByWeatherCondition = (weatherCondition, limit = null) => {
  // Generate a pool of products
  const allProducts = generateRandomTshirts(100);
  
  // Filter products by weather suitability
  let filteredProducts = allProducts.filter(product => 
    product.weatherSuitability.includes(weatherCondition)
  );
  
  // Randomize the order
  filteredProducts = filteredProducts.sort(() => 0.5 - Math.random());
  
  // Limit the number of results if specified
  if (limit && filteredProducts.length > limit) {
    filteredProducts = filteredProducts.slice(0, limit);
  }
  
  return filteredProducts;
};

/**
 * Maps OpenWeather conditions to our weather categories
 * @param {Object} weatherData Weather data from OpenWeather API
 * @returns {string} Mapped weather condition (hot, moderate, cold, rain, snow, windy)
 */
export const mapWeatherToCondition = (weatherData) => {
  const temp = weatherData.main.temp;
  const conditions = weatherData.weather[0].main.toLowerCase();
  const windSpeed = weatherData.wind.speed;
  
  // Check for specific weather conditions first
  if (conditions.includes('rain') || conditions.includes('drizzle') || conditions.includes('thunderstorm')) {
    return 'rain';
  }
  
  if (conditions.includes('snow')) {
    return 'snow';
  }
  
  if (windSpeed > 8) {
    return 'windy';
  }
  
  // Then check temperature ranges
  if (temp >= 25) {
    return 'hot';
  } else if (temp <= 10) {
    return 'cold';
  } else {
    return 'moderate';
  }
};

export default {
  getAvailableTshirtImages,
  getTshirtImagePath,
  generateRandomTshirts,
  getProductsByWeatherCondition,
  mapWeatherToCondition
}; 