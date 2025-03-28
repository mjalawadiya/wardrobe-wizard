import React from 'react';

const WishlistPage = ({ wishlist }) => {
    return (
        <div>
        <h1>Wishlist</h1>
        {wishlist.length === 0 ? (
            <p>Your wishlist is empty.</p>
        ) : (
            <ul>
            {wishlist.map((item) => (
                <li key={item.id}>
                {item.name} - ₹{item.price}
                </li>
            ))}
            </ul>
        )}
        </div>
    );
};

export default WishlistPage;
