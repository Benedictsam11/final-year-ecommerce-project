import React, { useEffect, useState } from 'react';
import './LatestWomen.css';
import Outfit from '../Outfit/Outfit';

const LatestWomen = () => {
  // States to hold product data, loading, and error states
  const [latestProducts, setLatestProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Show loading message initially
  const [error, setError] = useState(null); // Handle any errors from fetch

  // Fetch latest women's products when component mounts
  useEffect(() => {
    fetch('http://localhost:4000/latestinwomen')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch products'); // Handle HTTP errors
        }
        return response.json(); // Parse response as JSON
      })
      .then((data) => {
        setLatestProducts(data); // Set product data
        setIsLoading(false);     // Stop showing loader
      })
      .catch((err) => {
        setError(err.message);   // Store error message
        setIsLoading(false);     // Stop showing loader even on error
      });
  }, []);

  // Show loading message while fetching
  if (isLoading) {
    return <div>Loading latest women's products...</div>;
  }

  // Show error message if fetch fails
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="latest">
      <h1>LATEST IN WOMEN</h1>
      <hr />
      <div className="latest-outfit">
        {latestProducts
          .filter((product) => product.category === 'women') // ✅ Only show women’s products
          .slice(0, 4) // ✅ Limit to first 4 products
          .map((outfit) => (
            <Outfit
              key={outfit.id} // ✅ Unique key helps React with rendering
              id={outfit.id}
              name={outfit.name}
              image={outfit.image}
              new_price={outfit.new_price}
              old_price={outfit.old_price}
            />
          ))}
      </div>
    </div>
  );
};

export default LatestWomen;
