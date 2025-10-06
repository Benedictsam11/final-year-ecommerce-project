// Import necessary tools from React and styling
import React, { useState } from "react";
import "./Brief.css";

// Functional component for the subscription section
const Brief = () => {
  // State to keep track of the email input field
  const [email, setEmail] = useState("");

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page reload on form submit

    if (email) {
      // If email is not empty, show success message and clear the input
      alert("Subscription successful! Check your inbox.");
      setEmail("");
    } else {
      // If email is empty, show error message
      alert("Please enter a valid email address.");
    }
  };

  return (
    <div className="brief">
      {/* Title and message to encourage subscription */}
      <h1>
        Become a Swift Store Insider. No junk, just exclusive offers and the inside info.
      </h1>
      <p>SUBSCRIBE! GET AN EXTRA 15% OFF & INSIDE INFO!*</p>

      {/* Form for capturing email address */}
      <form onSubmit={handleSubmit} className="brief-form">
        <div className="brief-input-container">
          {/* Email input field */}
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* Submit button */}
          <button type="submit">Subscribe</button>
        </div>
      </form>
    </div>
  );
};

// Export the component so it can be used elsewhere
export default Brief;
