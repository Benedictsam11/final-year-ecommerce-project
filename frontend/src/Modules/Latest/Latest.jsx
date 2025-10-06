import React, { useEffect, useState } from 'react';
import './Latest.css';
import Outfit from '../Outfit/Outfit'; // Import reusable product card

const Latest = () => {
  // Set up a state to store products fetched from the server
  const [latestProducts, setLatestProducts] = useState([]);

  // Use useEffect to fetch latest products when the component loads
  useEffect(() => {
    fetch('http://localhost:4000/latestinmen') // Get latest men's products from backend
      .then((response) => response.json()) // Convert to JSON
      .then((data) => setLatestProducts(data)); // Store in state
  }, []);

  return (
    <div className='latest'>
      <h1>LATEST IN MEN</h1>
      <hr />
      
      {/* Display the latest products */}
      <div className="latest-outfit">
        {latestProducts
          .filter((product) => product.category === 'men') // Only show men's products
          .slice(0, 4) // Show only the first 4
          .map((outfit) => (
            <Outfit
              key={outfit.id} // Unique key for each item (important for React)
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

export default Latest;
