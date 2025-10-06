import React, { useState } from "react";
import { toast } from 'react-toastify'; // For popup messages
import "./ProductCard.css";
import star_icon from "../Assets/star_icon.png";
import star_half_icon from "../Assets/star_half_icon.png";
import { useStore } from "../../Store/ShopStore"; // Access global store for cart/wishlist

const ProductCard = ({ product }) => {
  const { addToCart, wishlist, addToWishlist, removeFromWishlist } = useStore(); // Get actions and state
  const [selectedSize, setSelectedSize] = useState(""); // Track selected size
  const [openSection, setOpenSection] = useState("product"); // Accordion state

  // Check if product with selected size is already in wishlist
  const isInWishlist = wishlist.some((item) => item.id === product.id && item.size === selectedSize);

  // Size selection handler
  const handleSizeSelect = (size) => setSelectedSize(size);

  // Add item to cart if size is selected
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size!");
      return;
    }
    addToCart(product.id, selectedSize);
    toast.success("Item added to basket! 🛒"); // Show success message
  };

  // Toggle wishlist based on current state
  const handleAddToWishlist = () => {
    if (!selectedSize) return alert("Please select a size!");
    isInWishlist ? removeFromWishlist(product.id, selectedSize) : addToWishlist(product.id, selectedSize);
  };

  // Accordion section toggle
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="productcard">
      {/* Left - Extra preview thumbnails */}
      <div className="productcard-left">
        <div className="productcard-img-list">
          <img src={product.image} alt="Thumbnail" />
          <img src={product.image} alt="Thumbnail" />
          <img src={product.image} alt="Thumbnail" />
          <img src={product.image} alt="Thumbnail" />
        </div>
      </div>

      {/* Center - Main Product Image */}
      <div className="productcard-img">
        <img className="productcard-main-img" src={product.image} alt="Main Product" />
      </div>

      {/* Right - Product Info */}
      <div className="productcard-right">
        <h1>{product.name}</h1>

        {/* Star rating - static for now */}
        <div className="productcard-right-star">
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_half_icon} alt="half star" />
          <p>(66)</p>
        </div>

        {/* Price info */}
        <div className="productcard-right-prices">
          <span className="productcard-right-price-old">£{product.old_price}</span>
          <span className="productcard-right-price-new">£{product.new_price}</span>
        </div>

        {/* Size selection */}
        <div className="productcard-right-size">
          <h2>Select Size</h2>
          <div className="productcard-right-size-options">
            {["S", "M", "L", "XL"].map((size) => (
              <div
                key={size}
                className={selectedSize === size ? "active" : ""}
                onClick={() => handleSizeSelect(size)}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        {/* Add buttons */}
        <button onClick={handleAddToCart}>ADD TO CART</button>
        <button onClick={handleAddToWishlist} className={isInWishlist ? "in-wishlist" : ""}>
          {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        </button>

        {/* Collapsible sections */}
        <div className="accordion-section">
          <div className="accordion-header" onClick={() => toggleSection("product")}>
            <strong>PRODUCT DESCRIPTION</strong> {openSection === "product" ? "−" : "+"}
          </div>
          {openSection === "product" && (
            <div className="accordion-body">
              <p>This item is made with premium fabric, offering a soft feel and a stylish fit. Ideal for both casual and semi-formal wear. Breathable and designed for comfort throughout the day.</p>
            </div>
          )}

          <div className="accordion-header" onClick={() => toggleSection("delivery")}>
            <strong>DELIVERY INFORMATION</strong> {openSection === "delivery" ? "−" : "+"}
          </div>
          {openSection === "delivery" && (
            <div className="accordion-body">
              <p>We offer standard and express delivery options. Most orders are delivered within 3–5 working days.</p>
              <p>Free shipping on orders over £50.</p>
            </div>
          )}

          <div className="accordion-header" onClick={() => toggleSection("returns")}>
            <strong>RETURNS INFORMATION</strong> {openSection === "returns" ? "−" : "+"}
          </div>
          {openSection === "returns" && (
            <div className="accordion-body">
              <p>A £1.99 return fee will be deducted from your refund. You can return items within 28 days from delivery.</p>
              <p>No refunds on grooming products, face masks, or underwear if opened. Statutory rights remain unaffected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
