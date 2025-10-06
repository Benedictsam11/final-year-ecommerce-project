import React, { useContext, useState } from 'react';
import { ShopStore } from '../Store/ShopStore';
import './CSS/Checkout.css';
import { toast } from 'react-toastify';
import paypalLogo from '../Modules/Assets/paypal.png';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  // Access cart data, product list and clearCart method from global context
  const { clearCart, getTotalCartAmount, cartItems, data_products } = useContext(ShopStore);

  // Local state to store delivery address details
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  // Payment method selected by the user (default is credit card)
  const [paymentMethod, setPaymentMethod] = useState('creditCard');

  // For programmatic navigation after placing order
  const navigate = useNavigate();

  // Calculate final cart total with any applied discounts
  const finalAmount = getTotalCartAmount();

  // Handle form field changes for delivery inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({ ...prev, [name]: value }));
  };

  // Function to submit order to the backend API
  const placeOrderToBackend = async () => {
    const token = localStorage.getItem('auth-token');

    // Ensure user is logged in before placing order
    if (!token) {
      toast.error("You must be logged in to place an order.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/placeorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        },
        body: JSON.stringify({
          deliveryInfo,
          paymentMethod,
          cartItems
        })
      });

      const data = await res.json();

      // Handle server response
      if (data.success) {
        toast.success("Order placed successfully! 🎉");
        clearCart(); // Clear cart after placing order
        navigate("/thank-you"); // Navigate to thank-you page
      } else {
        toast.error("Failed to place order.");
      }
    } catch (err) {
      toast.error("Error placing order. Try again.");
      console.error(err);
    }
  };

  // Validate input before placing order
  const handlePlaceOrder = () => {
    const isComplete = Object.values(deliveryInfo).every(value => value.trim() !== '');
    if (!isComplete) {
      toast.error("Please fill in all delivery fields.");
      return;
    }
    placeOrderToBackend();
  };

  return (
    <PayPalScriptProvider options={{ "client-id": "Afa_3SfwFK7vflA4XDl8w5B5PgDqpOmN8ScRs_LHnu9ilsbEwTauwAyborET_Zk-hbirN39fBpVkGPe7" }}>
      <div className="checkout-page">
        <h1>Checkout</h1>

        {/* Delivery Section */}
        <h2>📦 Delivery Information</h2>
        <form className="checkout-form">
          <input type="text" name="fullName" placeholder="Full Name" value={deliveryInfo.fullName} onChange={handleInputChange} required />
          <input type="text" name="address" placeholder="Address" value={deliveryInfo.address} onChange={handleInputChange} required />
          <input type="text" name="city" placeholder="City" value={deliveryInfo.city} onChange={handleInputChange} required />
          <input type="text" name="postalCode" placeholder="Postal Code" value={deliveryInfo.postalCode} onChange={handleInputChange} required />
          <input type="text" name="country" placeholder="Country" value={deliveryInfo.country} onChange={handleInputChange} required />
        </form>

        <hr />

        {/* Payment Method Section */}
        <h2>💳 Payment Method</h2>
        <div className="checkout-payment">
          <label>
            <input type="radio" name="paymentMethod" value="creditCard" checked={paymentMethod === 'creditCard'} onChange={(e) => setPaymentMethod(e.target.value)} />
            Credit Card
          </label>
          <label>
            <input type="radio" name="paymentMethod" value="paypal" checked={paymentMethod === 'paypal'} onChange={(e) => setPaymentMethod(e.target.value)} />
            PayPal <img src={paypalLogo} alt="PayPal" style={{ height: '20px', marginLeft: '10px' }} />
          </label>
          <label>
            <input type="radio" name="paymentMethod" value="pod" checked={paymentMethod === 'pod'} onChange={(e) => setPaymentMethod(e.target.value)} />
            Pay on Delivery
          </label>
        </div>

        {/* Credit Card Payment Fields */}
        {paymentMethod === 'creditCard' && (
          <div className="checkout-card-details">
            <input type="text" placeholder="Card Number" required />
            <input type="text" placeholder="Cardholder Name" required />
            <input type="text" placeholder="MM/YY" required />
            <input type="text" placeholder="CVV" required />
            <button className="place-order-button" onClick={handlePlaceOrder}>Place Order</button>
          </div>
        )}

        {/* PayPal Integration */}
        {paymentMethod === 'paypal' && (
          <div className="paypal-checkout">
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: { value: finalAmount.toFixed(2) },
                  }],
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then(() => {
                  toast.success("Payment successful via PayPal! 🎉");
                  placeOrderToBackend();
                });
              }}
            />
          </div>
        )}

        {/* Pay on Delivery Section */}
        {paymentMethod === 'pod' && (
          <div className="pod-info">
            <p>You will pay in cash or by card when the product is delivered.</p>
            <button className="place-order-button" onClick={handlePlaceOrder}>
              Confirm Order
            </button>
          </div>
        )}

        <hr />

        {/* Order Summary */}
        <h2>🧾 Order Summary</h2>
        <p>Total: <strong>£{finalAmount.toFixed(2)}</strong></p>

        <h3>Items in Your Order:</h3>
        <ul className="checkout-items">
          {Object.entries(cartItems)
            .filter(([_, quantity]) => quantity > 0)
            .map(([key, quantity]) => {
              const [productId, size] = key.split('_');
              const product = data_products.find(p => p.id === Number(productId));
              if (!product) return null;
              return (
                <li key={key}>
                  {product.name} (Size: {size}) × {quantity} — £{(product.new_price * quantity).toFixed(2)}
                </li>
              );
            })}
        </ul>
      </div>
    </PayPalScriptProvider>
  );
};

export default Checkout;
