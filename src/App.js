import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import ProductDetail from './pages/ProductDetail.js';
import Wishlist from './components/Wishlist.js';
import NotFound from './pages/NotFound.js';
import Navbar from './components/Navbar.js';
import Footer from './components/Footer.js';
import Product from './pages/Product.js';
import CartPage from './pages/CartPage.js';
import Account from './pages/Account.js';
import AuthGuard from './components/AuthGuard.js';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/wishlist" element={
            <AuthGuard>
              <Wishlist />
            </AuthGuard>
          } />
          <Route path="/products" element={<Product searchQuery="" />} />
          <Route path="/cart" element={<CartPage cart={[]} />} />
          <Route path="/account" element={
            <AuthGuard>
              <Account />
            </AuthGuard>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
