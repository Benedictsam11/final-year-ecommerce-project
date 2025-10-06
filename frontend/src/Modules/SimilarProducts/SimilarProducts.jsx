import React, { useState, useEffect } from 'react';
import './SimilarProducts.css';
import Outfit from '../Outfit/Outfit';
import axios from 'axios';

const SimilarProducts = ({ category, excludeId }) => {
  // State to store all products
  const [products, setProducts] = useState([]);
  // State for loading feedback
  const [loading, setLoading] = useState(true);
  // State to hold error message (if any)
  const [error, setError] = useState(null);

  // Fetch all products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/allproducts');
        setProducts(response.data); // Save data to state
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false); // Stop loading after fetch (success or fail)
      }
    };

    fetchProducts();
  }, []);

  // Filter products to match the category and exclude the current product
  const filteredProducts = products
    .filter((item) => item.category === category && item.id !== excludeId)
    .slice(0, 4); // Show only 4 products

  // Show loading or error if needed
  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="similarproducts">
      <h1>YOU MIGHT ALSO LIKE</h1>
      <hr />
      <div className="similarproducts-item">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((outfit) => (
            <Outfit
              key={outfit.id}
              id={outfit.id}
              name={outfit.name}
              image={outfit.image}
              new_price={outfit.new_price}
              old_price={outfit.old_price}
            />
          ))
        ) : (
          <p>No similar products found.</p>
        )}
      </div>
    </div>
  );
};

export default SimilarProducts;
