import React, { useEffect, useState } from 'react';
import './LatestKids.css';
import Outfit from '../Outfit/Outfit';

const LatestKid = () => {
  // State to hold the list of latest kid products
  const [latestProducts, setLatestProducts] = useState([]);

  // Fetch data when the component loads
  useEffect(() => {
    fetch('http://localhost:4000/latestinkid') // Backend route to get latest kid items
      .then((response) => response.json()) // Convert response to JSON
      .then((data) => setLatestProducts(data)); // Save data to state
  }, []); // Empty dependency array means this runs only once when the component mounts

  return (
    <div className='latest'>
      <h1>LATEST IN KIDS</h1>
      <hr />

      {/* Display each product using the Outfit component */}
      <div className="latest-outfit">
        {latestProducts
          .filter((product) => product.category === 'kid') // ✅ Only show products in the 'kid' category
          .map((outfit) => (
            <Outfit
              key={outfit.id} // Use unique product ID as key
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

export default LatestKid;
