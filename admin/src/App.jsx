import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Admin from './Screens/Admin/Admin';
import UploadProduct from './Components/UploadProduct/UploadProduct';
import ViewProduct from './Components/ViewProduct/ViewProduct';
import AdminLogin from './Screens/Admin/AdminLogin'; // Admin login screen

const App = () => {
  const location = useLocation();

  // ✅ Check login state from localStorage to persist session on refresh
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });

  // ✅ Show navbar only when logged in and not on the login page
  const shouldShowNavbar = isAuthenticated && location.pathname !== '/adminlogin';

  return (
    <div>
      {shouldShowNavbar && <Navbar />}

      <Routes>
        {/* Public Route: Admin Login Page */}
        <Route path="/adminlogin" element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />} />

        {/* Protected Admin Routes */}
        {isAuthenticated && (
          <Route path="/" element={<Admin />}>
            <Route index element={<UploadProduct />} />
            <Route path="uploadproduct" element={<UploadProduct />} />
            <Route path="viewproduct" element={<ViewProduct />} />
            <Route path="/test" element={<h1>Test Page</h1>} />

          </Route>
        )}

        {/* Redirect all other routes to login if not authenticated */}
        {!isAuthenticated && (
          <Route path="*" element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />} />
        )}
      </Routes>
    </div>
  );
};

export default App;