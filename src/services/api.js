import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const getProducts = async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
    };

    export const addToCart = async (product) => {
    await axios.post(`${API_URL}/cart`, product);
    };

    export const addToWishlist = async (product) => {
    await axios.post(`${API_URL}/wishlist`, product);
};
