import express from 'express';
import { 
  getProducts, 
  getProductById,
  addToCart, 
  removeFromCart,
  updateCartItemQuantity,
  addToWishlist,
  removeFromWishlist,
  getUserCart,
  getUserWishlist 
} from './controllers/productController.js';
import {
  register,
  login,
  getUserProfile,
  updateUserProfile
} from './controllers/authController.js';
import { protect } from './middleware/authMiddleware.js';

const router = express.Router();

// Product routes
router.get('/products', getProducts);
router.get('/products/:id', getProductById);

// Auth routes
router.post('/users/register', register);
router.post('/users/login', login);
router.get('/users/profile', protect, getUserProfile);
router.put('/users/profile', protect, updateUserProfile);

// Cart routes
router.post('/cart', addToCart);
router.put('/cart', updateCartItemQuantity);
router.delete('/cart', removeFromCart);
router.get('/users/:userId/cart', getUserCart);

// Wishlist routes
router.post('/wishlist', addToWishlist);
router.delete('/wishlist', removeFromWishlist);
router.get('/users/:userId/wishlist', getUserWishlist);

export default router;
