import express from 'express';
import { getProducts, addToCart, addToWishlist } from './controllers/productController.js';

const router = express.Router();
router.get('/products', getProducts);
router.post('/cart', addToCart);
router.post('/wishlist', addToWishlist);

export default router;
