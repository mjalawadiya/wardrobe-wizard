import Product from '../models/Product.js';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
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
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if product exists - convert to string to ensure proper comparison
    const products = readTshirtData();
    const stringProductId = productId.toString();
    const product = products.find(p => p['Product ID'].toString() === stringProductId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if product already in cart
    let cartItem = await Cart.findOne({ userId, productId: stringProductId });
    
    if (cartItem) {
      // Update quantity
      cartItem.quantity += parseInt(quantity, 10);
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = new Cart({
        userId,
        productId: stringProductId,
        quantity: parseInt(quantity, 10)
      });
      await cartItem.save();
    }
    
    res.status(200).json({ 
      message: 'Product added to cart', 
      cartItem
    });
  } catch (error) {
    console.error('Cart Error:', error);
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
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove item from cart
    const result = await Cart.deleteOne({ userId, productId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    res.status(200).json({ message: 'Product removed from cart' });
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
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Convert quantity to integer
    const newQuantity = parseInt(quantity, 10);
    
    // If quantity is 0 or less, remove item from cart
    if (newQuantity <= 0) {
      await Cart.deleteOne({ userId, productId });
      return res.status(200).json({ message: 'Item removed from cart' });
    }
    
    // Update quantity
    const cartItem = await Cart.findOneAndUpdate(
      { userId, productId },
      { quantity: newQuantity },
      { new: true }
    );
    
    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    res.status(200).json({ 
      message: 'Cart updated', 
      cartItem 
    });
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
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if product exists - convert to string to ensure proper comparison
    const products = readTshirtData();
    const stringProductId = productId.toString();
    const product = products.find(p => p['Product ID'].toString() === stringProductId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if product already in wishlist
    const existingItem = await Wishlist.findOne({ userId, productId: stringProductId });
    
    if (existingItem) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }
    
    // Create new wishlist item
    const wishlistItem = new Wishlist({
      userId,
      productId: stringProductId
    });
    
    await wishlistItem.save();
    
    res.status(200).json({ 
      message: 'Product added to wishlist', 
      wishlistItem 
    });
  } catch (error) {
    console.error('Wishlist Error:', error);
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
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove from wishlist
    const result = await Wishlist.deleteOne({ userId, productId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }
    
    res.status(200).json({ message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get user cart
export const getUserCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's cart items
    const cartItems = await Cart.find({ userId }).sort({ dateAdded: -1 });
    
    // Get all products from CSV
    const allProducts = readTshirtData();
    
    // Map cart items with product details
    const cartWithDetails = cartItems.map(cartItem => {
      const productDetails = allProducts.find(p => p['Product ID'] === cartItem.productId);
      
      return {
        _id: cartItem._id,
        userId: cartItem.userId,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        dateAdded: cartItem.dateAdded,
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
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's wishlist items
    const wishlistItems = await Wishlist.find({ userId }).sort({ dateAdded: -1 });
    
    // Get all products from CSV
    const allProducts = readTshirtData();
    
    // Map wishlist items with product details
    const wishlistWithDetails = wishlistItems.map(item => {
      const productDetails = allProducts.find(p => p['Product ID'] === item.productId);
      
      return {
        _id: item._id,
        userId: item.userId,
        productId: item.productId,
        dateAdded: item.dateAdded,
        productDetails: productDetails || { message: 'Product details not found' }
      };
    });
    
    res.json(wishlistWithDetails);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Delete all cart items for this user
    const result = await Cart.deleteMany({ userId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No cart items found for this user' });
    }
    
    res.status(200).json({ 
      message: 'Cart cleared successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
};
