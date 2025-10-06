import React, { useState } from "react";
import "./CSS/LoginRegister.css";

// LoginRegister component handles both login and signup forms
const LoginRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [state, setState] = useState("Login"); // "Login" or "Sign Up"

  // Handle input changes and update state
  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Password strength validator (used for visual feedback)
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
      met: c.test.test(password),
    }));
  };

  // Password strength validation (used in signup validation)
  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  const passwordFeedback = getPasswordStrengthMessage(formData.password);

  // Sync guest cart and wishlist data into user account after login/signup
  const syncGuestData = async (token, email) => {
    const guestCart = JSON.parse(localStorage.getItem("guest-cart") || "{}");
    const guestWishlist = JSON.parse(localStorage.getItem("guest-wishlist") || "[]");

    localStorage.setItem("auth-token", token);
    localStorage.setItem("user-email", email);

    try {
      const res = await fetch("http://localhost:4000/sync-guest-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ guestCart, guestWishlist }),
      });

      const result = await res.json();

      if (result.success) {
        localStorage.removeItem("guest-cart");
        localStorage.removeItem("guest-wishlist");
        window.location.href = "/";
      } else {
        alert(result.message || "Failed to sync guest cart and wishlist.");
      }
    } catch (err) {
      console.error("❌ Error syncing guest data:", err);
      alert("An error occurred while syncing guest data.");
    }
  };

  // Login request handler
  const login = async () => {
    if (!formData.email || !formData.password) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await res.json();

      if (responseData.success) {
        await syncGuestData(responseData.token, formData.email);
      } else {
        alert(responseData.errors || "Login failed");
      }
    } catch (err) {
      alert("Server error. Please try again later.");
    }
  };

  // Signup request handler
  const signup = async () => {
    if (!formData.email || !formData.password || !formData.username) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!isStrongPassword(formData.password)) {
      alert("Password must be strong and contain a mix of characters.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/signup", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await res.json();

      if (responseData.success) {
        await syncGuestData(responseData.token, formData.email);
      } else {
        alert(responseData.error || "Signup failed");
      }
    } catch (err) {
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-register">
      <div className="form-container">
        <h1>{state}</h1>

        <div className="form-fields">
          {/* Show username field only in signup */}
          {state === "Sign Up" && (
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder="Full Name"
            />
          )}

          {/* Email and password inputs */}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email Address"
          />
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
          />

          {/* Forgot password link for login */}
          {state === "Login" && (
            <p
              className="forgot-password-link"
              onClick={() => window.location.replace("/forgot-password")}
            >
              Forgot Password?
            </p>
          )}

          {/* Show password strength feedback on signup */}
          {state === "Sign Up" && formData.password && (
            <div className="password-feedback">
              <ul>
                {passwordFeedback.map((item, idx) => (
                  <li key={idx} style={{ color: item.met ? "green" : "red" }}>
                    {item.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Submit button triggers login or signup */}
        <button
          onClick={() => {
            state === "Login" ? login() : signup();
          }}
          className="submit-btn"
        >
          Continue
        </button>

        {/* Toggle between Login and Sign Up */}
        {state === "Sign Up" ? (
          <p className="login-redirect">
            Already have an account?{" "}
            <span onClick={() => setState("Login")}>Log in here</span>
          </p>
        ) : (
          <p className="login-redirect">
            Create an Account?{" "}
            <span onClick={() => setState("Sign Up")}>Click here</span>
          </p>
        )}

        {/* Terms and agreement note */}
        <div className="terms-agreement">
          <input type="checkbox" />
          <p>By continuing, you agree to our terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
