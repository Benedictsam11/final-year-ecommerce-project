import React, { useState } from 'react';
import './UploadProduct.css';
import upload_img from '../../assets/upload.png';

const UploadProduct = () => {
  // State to store the image file selected by the admin
  const [image, setImage] = useState(null);

  // State to store the product details
  const [productDetails, setProductDetails] = useState({
    name: '',
    image: '',
    category: 'women',
    new_price: '',
    old_price: ''
  });

  // Handles change for all product input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails(prev => ({ ...prev, [name]: value }));
  };

  // Handles image file selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Function to upload image and product to the backend
  const handleAddProduct = async () => {
    if (!image || !productDetails.name || !productDetails.old_price || !productDetails.new_price) {
      alert("Please fill all fields and select an image.");
      return;
    }

    try {
      // Step 1: Upload the image
      const formData = new FormData();
      formData.append('product', image);

      const uploadRes = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      });

      const uploadData = await uploadRes.json();

      if (!uploadData.success) {
        return alert("Image upload failed.");
      }

      // Step 2: Add product with the uploaded image URL
      const productPayload = {
        ...productDetails,
        image: uploadData.image_url
      };

      const addRes = await fetch('http://localhost:4000/addproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productPayload)
      });

      const addData = await addRes.json();
      if (addData.success) {
        alert("✅ Product added successfully!");
        // Optionally reset the form here
      } else {
        alert("❌ Failed to add product.");
      }

    } catch (err) {
      console.error("Error uploading product:", err);
      alert("An error occurred while uploading.");
    }
  };

  return (
    <div className="upload-product">
      {/* Product Title Input */}
      <div className="uploadproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={handleInputChange}
          type="text"
          name="name"
          placeholder="Type here"
        />
      </div>

      {/* Price Inputs */}
      <div className="uploadproduct-price">
        <div className="uploadproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={handleInputChange}
            type="number"
            name="old_price"
            placeholder="Old Price"
          />
        </div>

        <div className="uploadproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={handleInputChange}
            type="number"
            name="new_price"
            placeholder="New Price"
          />
        </div>
      </div>

      {/* Category Selector */}
      <div className="uploadproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={handleInputChange}
          name="category"
          className="upload-product-selector"
        >
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      {/* Thumbnail Upload */}
      <div className="uploadproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_img}
            className="uploadproduct-thumbnail-img"
            alt="Upload Preview"
          />
        </label>
        <input
          type="file"
          name="image"
          id="file-input"
          hidden
          onChange={handleImageChange}
        />
      </div>

      {/* Submit Button */}
      <button onClick={handleAddProduct} className="uploadproduct-btn">
        ADD
      </button>
    </div>
  );
};

export default UploadProduct;
