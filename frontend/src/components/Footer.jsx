
import React from 'react';
import '../componentStyles/Footer.css';

import {
  Mail,
  Phone,
  Facebook,
  Instagram,
  X,
  YouTube,
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Contact Section */}
        <div className="footer-section">
          <h3>Contact Us</h3>

          <p>
            <Mail fontSize="small" />{' '}
            <a href="mailto:info@ecommerce.com">
              info@ecommerce.com
            </a>
          </p>

          <p>
            <Phone fontSize="small" />{' '}
            <a href="tel:+911234567890">
              +91 12345 67890
            </a>
          </p>
        </div>

        {/* About Section */}
        <div className="footer-section">
          <h3>About Us</h3>

          <p>
            Your one-stop destination for quality products
            at affordable prices.
          </p>

          <p>
            Shop smarter and discover products you'll love.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>

          <p><a href="/">Home</a></p>
          <p><a href="/products">Shop</a></p>
          <p><a href="/about">About</a></p>
          <p><a href="/contact">Support</a></p>
        </div>

        {/* Social Media */}
        <div className="footer-section social">
          <h3>Follow Us</h3>

          <div className="social-links">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook className="social-icon" />
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram className="social-icon" />
            </a>

            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
            >
              <X className="social-icon" />
            </a>

            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <YouTube className="social-icon" />
            </a>
          </div>
        </div>

      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>
          &copy; {currentYear} E-Commerce. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
