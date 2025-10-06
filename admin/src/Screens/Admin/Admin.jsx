// src/Screens/Admin/Admin.jsx

import React from 'react';
import './Admin.css';
import { Outlet } from 'react-router-dom';

/**
 * Admin Layout Component
 * Acts as a wrapper for all admin-related pages.
 * Uses <Outlet /> to render nested routes like UploadProduct or ViewProduct.
 */
const Admin = () => {
  return (
    <div className="admin-container">
      {/* Main admin area where child routes are displayed */}
      <div className="admin-main">
        <Outlet /> {/* Renders the nested route (e.g., UploadProduct, ViewProduct) */}
      </div>
    </div>
  );
};

export default Admin;
