import React, { useState } from "react";
import { useParams } from "react-router-dom"; // Used to access token from URL
import "./CSS/ResetPassword.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState(""); // State to store new password input
  const [isLoading, setIsLoading] = useState(false); // Loading state for button
  const { token } = useParams(); // Extract reset token from URL

  // Function to check password strength criteria
  const getPasswordStrengthMessage = (password) => {
    const criteria = [
      { test: /.{8,}/, message: "At least 8 characters" },
      { test: /[A-Z]/, message: "At least one uppercase letter" },
      { test: /[a-z]/, message: "At least one lowercase letter" },
      { test: /[0-9]/, message: "At least one number" },
      { test: /[^A-Za-z0-9]/, message: "At least one special character" },
    ];
    return criteria.map((c) => ({
      message: c.message,
      met: c.test.test(password), // Check if each criterion is met
    }));
  };

  const passwordFeedback = getPasswordStrengthMessage(newPassword); // Generate feedback based on input

  // Function to send password reset request
  const reset = async () => {
    // Check if all strength rules are met before submission
    const allValid = passwordFeedback.every((item) => item.met);
    if (!allValid) {
      alert("Password does not meet all the required criteria.");
      return;
    }

    try {
      setIsLoading(true); // Start loading state

      // Send request to backend with token and new password
      const res = await fetch("http://localhost:4000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json(); // Parse response

      alert(data.message); // Show feedback message

      if (data.success) {
        window.location.replace("/login"); // Redirect to login on success
      }
    } catch (err) {
      console.error("Reset password error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  return (
    <div className="reset-password-wrapper">
      <div className="reset-password-form">
        <h2>Reset Your Password</h2>

        {/* Password input field */}
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isLoading}
        />

        {/* Show password strength feedback only when there's input */}
        {newPassword && (
          <div className="password-feedback">
            <ul>
              {passwordFeedback.map((item, index) => (
                <li key={index} style={{ color: item.met ? "green" : "red" }}>
                  {item.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reset button with loading state */}
        <button onClick={reset} disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
