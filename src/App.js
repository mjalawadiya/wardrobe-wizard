import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import CheckoutPage from './pages/CheckoutPage.js';
import Account from './pages/Account.js';
import AuthGuard from './components/AuthGuard.js';
import UserProfile from './components/UserProfile.js';
import AboutPage from './pages/AboutPage.js';
import TermsPage from './pages/TermsPage.js';
import ScrollToTop from './components/ScrollToTop.js';
import OrderConfirmed from './pages/OrderConfirmed.js';
import UnableToPlaceOrder from './pages/UnableToPlaceOrder.js';
import VirtualTryOnPage from './pages/VirtualTryOnPage.js';
import './App.css';
import { UserProvider } from './contexts/UserContext.js';

// Custom route component to handle weather-based product routes
const WeatherProtectedRoute = ({ children }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const hasWeatherParam = searchParams.has('weather');
  
  // If this is a weather-based route, protect it with AuthGuard
  if (hasWeatherParam) {
    return <AuthGuard>{children}</AuthGuard>;
  }
  
  // Otherwise, render normally
  return children;
};

function App() {
  return (
    <UserProvider>
      <div className="App">
        <ScrollToTop />
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
            <Route path="/products" element={
              <WeatherProtectedRoute>
                <Product />
              </WeatherProtectedRoute>
            } />
            <Route path="/cart" element={<CartPage cart={[]} />} />
            <Route path="/checkout" element={
              <AuthGuard>
                <CheckoutPage />
              </AuthGuard>
            } />
            <Route path="/account" element={
              <AuthGuard>
                <Account />
              </AuthGuard>
            } />
            <Route path="/profile" element={
              <AuthGuard>
                <UserProfile />
              </AuthGuard>
            } />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/order-confirmed" element={<OrderConfirmed />} />
            <Route path="/unable-to-place-order" element={<UnableToPlaceOrder />} />
            <Route path="/virtual-tryon" element={
              <AuthGuard>
                <VirtualTryOnPage />
              </AuthGuard>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </UserProvider>
  );
}

export default App;
