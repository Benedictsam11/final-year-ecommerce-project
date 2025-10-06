import React, { useEffect, useState } from 'react';
import './ViewProduct.css';
import remove_icon from '../../assets/remove_icon.png';

const ViewProduct = () => {
  // Store all product data from backend
  const [allProducts, setAllProducts] = useState([]);

  // Fetch all products from the backend
  const fetchInfo = async () => {
    try {
      const res = await fetch('http://localhost:4000/allproducts');
      const data = await res.json();
      setAllProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Load products on component mount
  useEffect(() => {
    fetchInfo();
  }, []);

  // Remove product by ID and refresh the list
  const removeProduct = async (id) => {
    try {
      await fetch('http://localhost:4000/removeproduct', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      await fetchInfo(); // Refresh list after deletion
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  return (
    <div className='view-product'>
      <h1>📦 List of All Products</h1>

      {/* Header row for table */}
      <div className="viewproduct-format-main viewproduct-header">
        <p>Preview</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Action</p>
      </div>

      <div className="viewproduct-allproducts">
        <hr />

        {/* List each product */}
        {allProducts.map((product) => (
          <React.Fragment key={product.id}>
            <div className="viewproduct-format-main viewproduct-row">
              <img src={product.image} alt={product.name} className="viewproduct-product-icon" />
              <p>{product.name}</p>
              <p>£{product.old_price}</p>
              <p>£{product.new_price}</p>
              <p>{product.category}</p>
              <img
                onClick={() => removeProduct(product.id)}
                className='viewproduct-remove-icon'
                src={remove_icon}
                alt="Remove"
                title="Remove Product"
              />
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ViewProduct;
