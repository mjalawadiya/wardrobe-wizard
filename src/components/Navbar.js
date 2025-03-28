import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ setSearchQuery }) => {
    return (
        <nav className="navbar">
            <div className="logo">Wardrobe Wizard</div>
            
            <input 
                type="text" 
                placeholder="Search for products..." 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="search-bar"
            />
            
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/product">Products</Link></li>
                <li><Link to="/cart">Cart</Link></li>
                <li><Link to="/wishlist">Wishlist</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;