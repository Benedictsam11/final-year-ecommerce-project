import React from 'react';
import './CSS/ThankYou.css'; // Import the CSS styling specific to this component
import { Link } from 'react-router-dom'; // Used for navigation without page reload

// ThankYou Component - Displayed after a successful order
const ThankYou = () => {
  return (
    <div className="thank-you"> {/* Main container with styling */}
      <h1>🎉 Thank You for Your Order!</h1> {/* Main heading message */}
      
      {/* Success confirmation messages */}
      <p>Your order has been successfully placed.</p>
      <p>A confirmation email has been sent to your inbox.</p>

      {/* Button that takes the user back to the home page to continue shopping */}
      <Link to="/" className="continue-shopping-btn">
        Continue Shopping →
      </Link>
    </div>
  );
};

export default ThankYou; // Export the component so it can be used in routes
