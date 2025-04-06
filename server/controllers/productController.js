import Product from '../models/Product.js';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to read CSV data
const readTshirtData = () => {
  try {
    const csvPath = path.resolve(__dirname, '../../src/res/tshit_dataset.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.error('CSV file not found:', csvPath);
      return [];
    }
    
    const data = fs.readFileSync(csvPath, 'utf8');
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).filter(line => line.trim() !== '').map(line => {
      const values = line.split(',');
      const product = {};
      
      headers.forEach((header, index) => {
        product[header.trim()] = values[index] ? values[index].trim() : '';
      });
      
      return product;
    });
  } catch (error) {
    console.error('Error reading CSV:', error);
    return [];
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    // Read products from CSV
    const products = readTshirtData();
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const products = readTshirtData();
    
    const product = products.find(p => p['Product ID'] === productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;
    
    if (!userId || !productId) {
      return res.status(400).json({ message: 'User ID and Product ID are required' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if product already in cart
    const existingCartItem = user.cart.find(item => item.productId === productId);
    
    if (existingCartItem) {
      // Update quantity
      existingCartItem.quantity += quantity;
    } else {
      // Add new item
      user.cart.push({ productId, quantity });
    }
    
    await user.save();
    
    res.status(200).json({ message: 'Product added to cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Remove product from cart
export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    
    if (!userId || !productId) {
      return res.status(400).json({ message: 'User ID and Product ID are required' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove product from cart
    user.cart = user.cart.filter(item => item.productId !== productId);
    
    await user.save();
    
    res.status(200).json({ message: 'Product removed from cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    
    if (!userId || !productId || !quantity) {
      return res.status(400).json({ message: 'User ID, Product ID, and quantity are required' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const cartItem = user.cart.find(item => item.productId === productId);
    
    if (!cartItem) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }
    
    // Update quantity
    cartItem.quantity = quantity;
    
    // If quantity is 0 or less, remove item from cart
    if (quantity <= 0) {
      user.cart = user.cart.filter(item => item.productId !== productId);
    }
    
    await user.save();
    
    res.status(200).json({ message: 'Cart updated', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    
    if (!userId || !productId) {
      return res.status(400).json({ message: 'User ID and Product ID are required' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if product already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }
    
    // Add to wishlist
    user.wishlist.push(productId);
    
    await user.save();
    
    res.status(200).json({ message: 'Product added to wishlist', wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    
    if (!userId || !productId) {
      return res.status(400).json({ message: 'User ID and Product ID are required' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove from wishlist
    user.wishlist = user.wishlist.filter(id => id !== productId);
    
    await user.save();
    
    res.status(200).json({ message: 'Product removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get user cart
export const getUserCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get all products from CSV
    const allProducts = readTshirtData();
    
    // Map cart items with product details
    const cartWithDetails = user.cart.map(cartItem => {
      const productDetails = allProducts.find(p => p['Product ID'] === cartItem.productId);
      return {
        ...cartItem.toObject(),
        productDetails: productDetails || { message: 'Product details not found' }
      };
    });
    
    res.json(cartWithDetails);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get user wishlist
export const getUserWishlist = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get all products from CSV
    const allProducts = readTshirtData();
    
    // Map wishlist items with product details
    const wishlistWithDetails = user.wishlist.map(productId => {
      const productDetails = allProducts.find(p => p['Product ID'] === productId);
      return productDetails || { message: 'Product details not found', productId };
    });
    
    res.json(wishlistWithDetails);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
