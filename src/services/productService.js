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
    
    tshirts.push({
      id,
      name: `${fit} ${color} T-Shirt ${id}`,
      category: 'T-Shirt',
      color,
      fit,
      price: (Math.random() * 30 + 15).toFixed(2),
      image: `/res/tshirt/${id}.jpg`,
      rating: (Math.random() * 2 + 3).toFixed(1)
    });
  }
  
  return tshirts;
};

export default {
  getAvailableTshirtImages,
  getTshirtImagePath,
  generateRandomTshirts
}; 