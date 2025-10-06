// src/Screens/AdminLogin.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

// Props: setIsAuthenticated is passed down from App.jsx to update login state
const AdminLogin = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // ✅ Handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();

    // Hardcoded admin credentials (for development/testing only)
    const ADMIN_EMAIL = 'bamiseben949@gmail.com';
    const ADMIN_PASSWORD = 'Bamise2004.';

    // ✅ Check if credentials match
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('isAdmin', 'true');     // Store auth flag in localStorage
      setIsAuthenticated(true);                    // Update auth state in parent
      navigate('/');                               // Redirect to admin panel
    } else {
      alert('Invalid email or password');          // Show basic error (optional: show styled error msg)
    }
  };

  return (
    <div className="admin-login-container">
      <form className="admin-login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Submit Button */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
