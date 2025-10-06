// Wishlist.jsx - Handles displaying wishlist items and moving them to cart

import React, { useContext } from "react";
import { ShopStore } from "../Store/ShopStore";
import { toast } from "react-toastify";
import './CSS/Wishlist.css';
import remove_icon from '../Modules/Assets/remove_icon.png';

const Wishlist = () => {
  const { wishlist, addToCart, removeFromWishlist } = useContext(ShopStore);

  // Move an item to cart and remove from wishlist
  const handleAddToBag = async (itemId, size) => {
    await addToCart(itemId, size);
    await removeFromWishlist(itemId, size);
    toast.success("Moved to cart.");
  };

  // Remove item from wishlist
  const handleRemoveFromWishlist = (itemId, size) => {
    removeFromWishlist(itemId, size);
    toast.info("Item removed from wishlist.");
  };

  return (
    <div className="wishlist-page">
      <h1>Your Wishlist</h1>

      {/* Table Headers */}
      <div className="wishlist-header">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Size</p>
        <p>Action</p>
      </div>
      <hr />

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">Your wishlist is empty.</div>
      ) : (
        wishlist.map((item) => (
          <div key={`${item.id}_${item.size}`} className="wishlist-item">
            <div className="wishlist-row">
              <img src={item.image} alt={item.name} className="wishlist-product-img" />
              <p>{item.name}</p>
              <p>£{item.new_price.toFixed(2)}</p>
              <p>{item.size}</p>
              <div className="wishlist-actions">
                <button onClick={() => handleAddToBag(item.id, item.size)}>
                  Add to Bag
                </button>
                <img
                  className="wishlist-remove-icon"
                  src={remove_icon}
                  onClick={() => handleRemoveFromWishlist(item.id, item.size)}
                  alt="Remove"
                />
              </div>
            </div>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default Wishlist;
