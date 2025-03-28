import React from "react";

const SearchBar = ({ setSearchQuery }) => {
    return (
        <input
            type="text"
            placeholder="Search for products..."
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
        />
    );
};

export default SearchBar;
