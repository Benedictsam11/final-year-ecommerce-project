import React from "react";
import "./PaymentIcon.css";

// Import the image that shows accepted payment method icons
import paymentIcons from "./payment-icons.png"; 

// Functional component to display the payment icons
const PaymentIcon = () => {
  return (
    <div className="payment-icons">
      {/* Displays the payment icons image */}
      <img src={paymentIcons} alt="Payment Methods" />
    </div>
  );
};

export default PaymentIcon;
