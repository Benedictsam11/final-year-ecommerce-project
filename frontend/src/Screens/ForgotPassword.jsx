import React, { useState } from "react";
import "./CSS/ForgotPassword.css";

// ForgotPassword component allows users to request a password reset link
const ForgotPassword = () => {
  const [email, setEmail] = useState(""); // Stores user email input
  const [isLoading, setIsLoading] = useState(false); // Indicates whether the request is in progress

  // Function to send reset link to the entered email
  const sendResetLink = async () => {
    // Simple validation to check if the email is not empty
    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    try {
      setIsLoading(true); // Start loading state

      // Send POST request to backend with email
      const res = await fetch("http://localhost:4000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json(); // Parse response JSON

      alert(data.message); // Show success or failure message from server
    } catch (error) {
      console.error("Error sending reset link:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  return (
    <div className="forgot-password-wrapper">
      <div className="forgot-password-form">
        <h2>Forgot Password</h2>

        {/* Email input field */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading} // Disable input while loading
        />

        {/* Send Reset Link button */}
        <button onClick={sendResetLink} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
