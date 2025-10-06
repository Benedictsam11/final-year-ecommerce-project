import React, { useContext, useState } from 'react';
import './CartSection.css';
import { ShopStore } from '../../Store/ShopStore'; // import global store for cart & product data
import remove_icon from '../Assets/remove_icon.png'; // trash icon to remove items
import { toast } from 'react-toastify'; // popup notifications
import { useNavigate } from 'react-router-dom'; // to redirect user

const CartSection = () => {
  // useContext to get everything from global store
  const {
    getTotalCartAmount,
    data_products,
    cartItems,
    removeFromCart,
    addToCart,
    setCartItems,
    clearCart,
    promoCode,
    applyPromoCode,
    discount,
  } = useContext(ShopStore);

  const [inputCode, setInputCode] = useState(''); // promo code input state
  const navigate = useNavigate(); // for redirecting to checkout/login

  // Called when "Apply" promo code is clicked
  const handlePromoSubmit = () => {
    applyPromoCode(inputCode); // use promo code from input field
  };

  // Decrease quantity or remove if it's the last one
  const handleDecrease = (itemKey) => {
    if (cartItems[itemKey] > 1) {
      setCartItems(prev => ({ ...prev, [itemKey]: prev[itemKey] - 1 }));
    } else {
      removeFromCart(itemKey);
    }
  };

  // Handle user clicking "Proceed to Checkout"
  const handleCheckout = () => {
    const token = localStorage.getItem('auth-token'); // check if user is logged in
    if (!token) {
      toast.error("Please log in before proceeding to checkout.");
      navigate('/login');
      return;
    }
    toast.success("Proceeding to checkout 🚀");
    navigate('/checkout');
  };

  // Calculate subtotal (before discount)
  const totalBeforeDiscount = Object.entries(cartItems).reduce((acc, [itemKey, qty]) => {
    const [itemId] = itemKey.split('_'); // extract product ID
    const item = data_products.find(p => p.id === Number(itemId));
    return item ? acc + item.new_price * qty : acc;
  }, 0);

  // Get total after applying discount (from store)
  const finalAmount = getTotalCartAmount();

  return (
    <div className="cartsection">
      <h1 className="cartsection-title">Your Shopping Cart</h1>

      {/* Headers of the table */}
      <div className="cartsection-format cartsection-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Size</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {/* Show cart items or empty message */}
      {Object.entries(cartItems).filter(([_, qty]) => qty > 0).length === 0 ? (
        <div className="cart-empty">Your cart is currently empty.</div>
      ) : (
        Object.entries(cartItems).map(([itemKey, qty]) => {
          if (qty <= 0) return null;

          const [itemId, size] = itemKey.split('_'); // separate id and size
          const item = data_products.find(p => p.id === Number(itemId)); // find product by ID
          if (!item) return null;

          return (
            <div key={itemKey}>
              <div className="cartsection-format cartsection-format-main">
                <img src={item.image} alt={item.name} className="cart-product-icon" />
                <p>{item.name}</p>
                <p>£{item.new_price.toFixed(2)}</p>
                <p>{size}</p>
                <div className="cart-qty-controls">
                  <button onClick={() => handleDecrease(itemKey)}>-</button>
                  <span>{qty}</span>
                  <button onClick={() => addToCart(itemId, size)}>+</button>
                </div>
                <p>£{(item.new_price * qty).toFixed(2)}</p>
                <img
                  className="cartsection-remove-icon"
                  src={remove_icon}
                  onClick={() => removeFromCart(itemKey)}
                  alt="Remove"
                />
              </div>
              <hr />
            </div>
          );
        })
      )}

      {/* Section below cart list: Totals + promo code input */}
      <div className="cartsection-down">
        {/* Total cost breakdown */}
        <div className="cartsection-total">
          <h1>Cart Totals</h1>

          <div className="cartsection-total-item">
            <p>Subtotal</p>
            <p>£{totalBeforeDiscount.toFixed(2)}</p>
          </div>

          {/* Show promo discount if applied */}
          {discount > 0 && (
            <div className="cartsection-total-item promo-applied">
              <p>Promo Applied ({promoCode})</p>
              <p>-{(discount * 100).toFixed(0)}%</p>
            </div>
          )}

          <hr />

          <div className="cartsection-total-item">
            <p>Shipping</p>
            <p>Free</p>
          </div>

          <hr />

          <div className="cartsection-total-item grand-total">
            <h3>Total</h3>
            <h3>£{finalAmount.toFixed(2)}</h3>
          </div>

          {/* Buttons to go to checkout or clear cart */}
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
          <button className="clear-cart-button" onClick={clearCart}>CLEAR CART</button>
        </div>

        {/* Promo code section */}
        <div className="cartsection-promocode">
          <p>Have a promo code?</p>
          <div className="cartsection-promobox">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Enter code (e.g. SPRING20)"
            />
            <button onClick={handlePromoSubmit}>Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSection;
