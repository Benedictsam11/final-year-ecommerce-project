// src/Components/Navbar/Navbar.jsx
import React from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import navLogo from '../../assets/download.png';

const Navbar = () => {
  const navigate = useNavigate();

  // ✅ Logs out admin by clearing localStorage and reloading app state
  const handleLogout = () => {
    localStorage.removeItem('isAdmin');      // Clear login session
    navigate('/adminlogin');                // Redirect to login page
    window.location.reload();               // Force app state reset (not ideal in large apps, but simple here)
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={navLogo} alt="Logo" className="nav-logo" />
        <h1 className="navbar-title">Admin Panel</h1>
      </div>

      <div className="navbar-links">
        <Link to="/uploadproduct" className="navbar-link">Upload Product</Link>
        <Link to="/viewproduct" className="navbar-link">View Listings</Link>
        <button onClick={handleLogout} className="navbar-link logout-button">Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
