import React, { useState, useEffect } from 'react';
import './Navbar.css';
import cart_icon from '../../Modules/Assets/cart_icon.png';
import wishlist_icon from '../../Modules/Assets/wishlist_icon.png';
import download from '../../Modules/Assets/download.png';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../../Store/ShopStore'; // custom global state hook

const Navbar = () => {
  const { wishlist, setWishlist } = useStore(); // get wishlist and function to update it
  const { cartItems } = useStore();             // get cart data from global store

  const [menu, setMenu] = useState("shop");     // for tracking which tab is active
  const location = useLocation();               // gets the current route/path

  

  // ✅ Updates the active menu tab depending on the current page
  useEffect(() => {
    if (location.pathname === '/') {
      setMenu("shop");
    } else if (location.pathname.startsWith('/mens')) {
      setMenu("mens");
    } else if (location.pathname.startsWith('/womens')) {
      setMenu("womens");
    } else if (location.pathname.startsWith('/kids')) {
      setMenu("kids");
    }
  }, [location]);

  // ✅ Calculates total number of items in the cart
  const cartCount = Object.values(cartItems).reduce((acc, count) => acc + (Number(count) || 0), 0);

  // ✅ Number of items saved in wishlist
  const wishlistCount = wishlist.length;

  

  return (
    <div className='navbar'>
      {/* Logo Section */}
      <div className="nav-logo">
        <img src={download} alt="Logo" className="logo" />
      </div>

      {/* Navigation Links */}
      <ul className='navbar-links'>
        <li onClick={() => setMenu("shop")}>
          <Link to='/' style={{ textDecoration: 'none' }}>
            Shop {menu === "shop" && <hr />}
          </Link>
        </li>
        <li onClick={() => setMenu("mens")}>
          <Link to='/mens' style={{ textDecoration: 'none' }}>
            Men {menu === "mens" && <hr />}
          </Link>
        </li>
        <li onClick={() => setMenu("womens")}>
          <Link to='/womens' style={{ textDecoration: 'none' }}>
            Women {menu === "womens" && <hr />}
          </Link>
        </li>
        <li onClick={() => setMenu("kids")}>
          <Link to='/kids' style={{ textDecoration: 'none' }}>
            Kids {menu === "kids" && <hr />}
          </Link>
        </li>
      </ul>

      {/* Login/Logout, Wishlist, and Cart */}
      <div className="nav-login-cart">
        {/* ✅ Show logout if logged in, else show login */}
        {localStorage.getItem('auth-token') ? (
          <button
            onClick={() => {
              localStorage.removeItem('auth-token');
              localStorage.removeItem('user-email');
              setWishlist([]);  // ✅ clear wishlist from memory
              window.location.replace('/');
            }}
          >
            LogOut
          </button>
        ) : (
          <Link to='/login'>
            <button>Login</button>
          </Link>
        )}

        {/* Wishlist icon with counter */}
        <Link to='/wishlist'>
          <img src={wishlist_icon} alt="Wishlist" className="wishlist-icon" />
        </Link>
        <div className="nav-wishlist-count">{wishlistCount}</div>

        {/* Cart icon with counter */}
        <Link to='/cart'>
          <img src={cart_icon} alt="Cart" className="cart-icon" />
        </Link>
        <div className="nav-cart-count">{cartCount}</div>
      </div>
    </div>
  );
};

export default Navbar;
