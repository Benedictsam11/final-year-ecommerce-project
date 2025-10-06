import React, { Suspense, useMemo } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Modules/Navbar/Navbar';
import VideoComponent from './Components/VideoComponent';
import Footer from './Modules/Footer/Footer';
import './App.css';
import ShopStoreProvider from './Store/ShopStore';

import menswearBanner from './Modules/Assets/menswear_banner.png';
import womenswearBanner from './Modules/Assets/womenwear_banner.png';
import kidswearBanner from './Modules/Assets/kidswear_banner.png';
import ForgotPassword from "./Screens/ForgotPassword";
import ResetPassword from "./Screens/ResetPassword";

// Lazy load screens for code splitting
const Shop = React.lazy(() => import('./Screens/Shop'));
const CartPage = React.lazy(() => import('./Screens/CartPage'));
const LoginRegister = React.lazy(() => import('./Screens/LoginRegister'));
const CategoryPage = React.lazy(() => import('./Screens/CategoryPage'));
const Product = React.lazy(() => import('./Screens/Product'));
const Checkout = React.lazy(() => import('./Screens/Checkout'));
const Wishlist = React.lazy(() => import('./Screens/Wishlist'));
const ThankYou = React.lazy(() => import('./Screens/ThankYou'));

function App() {
  return (
    <div className="App" role="main">
      <ToastContainer position="top-right" autoClose={2500} />

      <BrowserRouter>
        <ShopStoreProvider>
          <Navbar />
          <Content />

          <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Shop />} />
              <Route path="/mens" element={<CategoryPage key="men" banner={menswearBanner} category="men" />} />
              <Route path="/womens" element={<CategoryPage key="women" banner={womenswearBanner} category="women" />} />
              <Route path="/kids" element={<CategoryPage key="kids" banner={kidswearBanner} category="kid" />} />
              <Route path="/product/:productId" element={<Product />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginRegister />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path ="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword/>} /> 
              <Route path="*" element={<h2 style={{ textAlign: 'center', marginTop: '100px' }}>404 - Page Not Found</h2>} />
            </Routes>
          </Suspense>

          <Footer />
        </ShopStoreProvider>
      </BrowserRouter>
    </div>
  );
}

function Content() {
  const location = useLocation();


  const shouldHideVideo = useMemo(() => {
    const hidePaths = [
      '/mens', '/womens', '/kids', '/login', '/cart',
      '/wishlist', '/checkout', '/thank-you', '/forgot-password', '/reset-password'
    ];

    return (
      hidePaths.some(path => location.pathname === path || location.pathname.startsWith(path + '/')) ||
      location.pathname.startsWith('/product/')
    );
  }, [location.pathname]);

  return (
    <>
      {!shouldHideVideo && (
        <div className="video-container" role="region" aria-label="Promotional Video">
          <VideoComponent />
        </div>
      )}
    </>
  );
}

export default App;