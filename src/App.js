import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Product from './pages/Product';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';

function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Centralized search state

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const addToWishlist = (product) => {
    setWishlist([...wishlist, product]);
  };

  return (
    <div>
      {/* Pass setSearchQuery to Navbar so it updates searchQuery */}
      <Navbar setSearchQuery={setSearchQuery} />

      <Routes>
        <Route path="/" element={<Home />} />
        {/* Pass searchQuery to Product */}
        <Route 
          path="/product" 
          element={<Product searchQuery={searchQuery} addToCart={addToCart} addToWishlist={addToWishlist} />} 
        />
        <Route path="/cart" element={<CartPage cart={cart} />} />
        <Route path="/wishlist" element={<WishlistPage wishlist={wishlist} />} />
      </Routes>
    </div>
  );
}

export default App;
