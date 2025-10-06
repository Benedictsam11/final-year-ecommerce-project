import React from "react";
import "./Footer.css";
// Importing icons for social media
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

// Footer component
const Footer = () => {
  return (
    <div className="footer">
      {/* Links section in the footer */}
      <div className="footer-links">

        {/* Column 1: Company info links */}
        <div className="footer-column">
          <h4>Company</h4>
          <a href="/">About Us</a>
          <a href="/">Careers</a>
          <a href="/">Our Stores</a>
          <a href="/">Blog</a>
        </div>

        {/* Column 2: Customer support links */}
        <div className="footer-column">
          <h4>Support</h4>
          <a href="/">Contact Us</a>
          <a href="/">FAQs</a>
          <a href="/">Shipping & Returns</a>
          <a href="/">Order Tracking</a>
        </div>

        {/* Column 3: Social media icons */}
        <div className="footer-column">
          <h4>Follow Us</h4>
          <div className="footer-socials">
            <FaFacebookF />
            <FaInstagram />
            <FaTwitter />
            <FaYoutube />
          </div>
        </div>
      </div>

      {/* Bottom copyright message */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Your Brand. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
