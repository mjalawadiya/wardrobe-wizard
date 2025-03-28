import React from 'react';
const Product = ({ searchQuery, addToCart, addToWishlist }) => {

    const products = [
        { id: 1, name: 'Tshirt', price: 450, image: '/images/image1.jpeg' },
        { id: 2, name: 'Hoodie', price: 850, image: '/images/image2.jpeg' },
        { id: 3, name: 'Denim Jacket', price: 1000, image: '/images/image3.jpeg' },
        { id: 4, name: 'Jeans', price: 1200, image: '/images/image4.jpeg' },
    ];

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <div className="product-container">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="product-card">
                            <img src={product.image} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>₹{product.price}</p>
                            <button onClick={() => addToCart(product)}>Add to Cart</button>
                            <button onClick={() => addToWishlist(product)}>Add to Wishlist</button>
                        </div>
                    ))
                ) : (
                    <p className="no-results">No products found</p>
                )}
            </div>
        </div>
    );
};
export default Product;
