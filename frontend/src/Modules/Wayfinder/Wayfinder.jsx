import React from 'react';
import './Wayfinder.css';
import arrow_icon from '../Assets/wayfinder_arrow.png';
import { Link } from 'react-router-dom';

const Wayfinder = ({ product }) => {
  // Fallbacks for missing product data
  const category = product?.category || "category";
  const name = product?.name || "Product";

  return (
    <nav className="wayfinder" aria-label="breadcrumb">
      <ul className="breadcrumb-list">
        <li>
          <Link to="/">HOME</Link>
          <img src={arrow_icon} alt=">" />
        </li>
        <li>
          <Link to="/">SHOP</Link>
          <img src={arrow_icon} alt=">" />
        </li>
        <li>
          <Link to={`/${category.toLowerCase()}s`}>{category}</Link>
          <img src={arrow_icon} alt=">" />
        </li>
        <li>{name}</li>
      </ul>
    </nav>
  );
};

export default Wayfinder;
