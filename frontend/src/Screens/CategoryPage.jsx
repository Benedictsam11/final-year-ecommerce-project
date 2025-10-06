import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './CSS/CategoryPage.css';
import axios from 'axios';

const CategoryPage = ({ banner, category }) => {

  // State hooks for filters, sorting, search, and results
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // ✅ Format prices as GBP currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(price);
  };

  // ✅ Fetch and filter products based on category, filter, and search
  const fetchFilteredProducts = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:4000/allproducts');
      let products = response.data;

      products = products.filter((item) => {
        const itemCategory = item.category?.toLowerCase() || '';
        const itemName = item.name?.toLowerCase() || '';

        const matchesCategory = itemCategory === category.toLowerCase();
        const matchesFilter = filter ? itemName.includes(filter.toLowerCase()) : true;
        const matchesSearch = itemName.includes(searchTerm.toLowerCase());

        return matchesCategory && matchesFilter && matchesSearch;
      });

      // ✅ Sorting based on user choice
      if (sortOrder === 'asc') {
        products.sort((a, b) => a.new_price - b.new_price);
      } else if (sortOrder === 'desc') {
        products.sort((a, b) => b.new_price - a.new_price);
      }

      setFilteredProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, [category, filter, sortOrder, searchTerm]);

  // ✅ Trigger data fetch whenever dependencies change
  useEffect(() => {
    fetchFilteredProducts();
  }, [fetchFilteredProducts]);

  // ✅ Reset all filters and search
  const resetFilters = () => {
    setFilter('');
    setSortOrder('');
    setSearchTerm('');
  };

  return (
    <div className="category-page">
      {/* ✅ Optional Banner */}
      {banner && (
        <div className="category-banner">
          <img src={banner} alt={`${category} banner`} />
        </div>
      )}

      {/* ✅ Product count, search, filter, sort UI */}
      <div className="categorypage-indexSort">
        <p><span>Showing {filteredProducts.length}</span> products</p>

        <div className="category-controls">
          {/* 🔍 Search bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          {/* ↕ Sort by price */}
          <div className="categorypage-sort">
            <label>Sort by:</label>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="">Default</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>

          {/* 🎯 Filter by product type */}
          <div className="filter-options">
            <label>Filter by type:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">All</option>
              <option value="topwear">Topwear</option>
              <option value="bottomwear">Bottomwear</option>
              <option value="tracksuit">Tracksuit</option>
            </select>
          </div>
        </div>
      </div>

      {/* ✅ Reset Button */}
      <button className="reset-button" onClick={resetFilters}>Reset Filters</button>

      {/* 🛍️ Product Cards */}
      <div className="categorypage-products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <Link to={`/product/${item.id}`} key={item.id} className="product-link">
              <div className="product-item">
                <img src={item.image || 'fallback-image.jpg'} alt={item.name} className="product-image" />
                <h2>{item.name}</h2>
                {item.description && <p>{item.description}</p>}
                <p className="product-price">
                  {item.old_price && (
                    <span className="old-price">{formatPrice(item.old_price)}</span>
                  )}
                  <span className="new-price">{formatPrice(item.new_price)}</span>
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>

      {/* 🔁 Refresh Button */}
      <div>
        <button
          className="explore-more-btn"
          style={{
            backgroundColor: '#ff4e50',
            color: 'white',
            padding: '12px 30px',
            fontSize: '16px',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onClick={fetchFilteredProducts}
        >
          Load More Products
        </button>
      </div>
    </div>
  );
};

export default CategoryPage;
