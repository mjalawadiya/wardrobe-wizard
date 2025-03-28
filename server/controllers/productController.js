import Product from '../models/productModel.js';

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addToCart = (req, res) => {
    res.json({ message: 'Product added to cart' });
};

export const addToWishlist = (req, res) => {
    res.json({ message: 'Product added to wishlist' });
};
