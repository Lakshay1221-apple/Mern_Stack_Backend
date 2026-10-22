
import React, { useState } from 'react';
import '../componentStyles/Navbar.css';

import {
  Search,
  ShoppingCart,
  Person,
  Menu,
  Close,
} from '@mui/icons-material';

import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ cartCount = 0, isLoggedIn = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (query) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/" onClick={closeMenu}>
            E-Commerce
          </Link>
        </div>

        {/* Navigation Links */}
        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <ul>
            <li>
              <Link to="/" onClick={closeMenu}>
                Home
              </Link>
            </li>

            <li>
              <Link to="/products" onClick={closeMenu}>
                Products
              </Link>
            </li>

            <li>
              <Link to="/about" onClick={closeMenu}>
                About
              </Link>
            </li>

            <li>
              <Link to="/contact" onClick={closeMenu}>
                Contact
              </Link>
            </li>

            {/* Search */}
            <li className="search-item">
              <form onSubmit={handleSearch}>
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search products"
                />

                <button type="submit" aria-label="Submit search">
                  <Search className="icon" />
                </button>
              </form>
            </li>
          </ul>
        </div>

        {/* Navbar Actions */}
        <div className="navbar-icons">

          {/* Search icon for quick navigation */}
          <Search
            className="icon"
            onClick={() => navigate('/products')}
            titleAccess="Browse products"
          />

          {/* Shopping Cart */}
          <div
            className="cart-container"
            onClick={() => navigate('/cart')}
            role="button"
            tabIndex={0}
            aria-label={`Shopping cart, ${cartCount} items`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/cart');
              }
            }}
          >
            <ShoppingCart className="icon" />

            <span className="cart-badge">
              {cartCount}
            </span>
          </div>

          {/* Register / Account */}
          <Link
            to={isLoggedIn ? '/profile' : '/register'}
            className="register-link"
          >
            {isLoggedIn ? (
              <Person className="icon" titleAccess="My profile" />
            ) : (
              <button className="register-btn" type="button">
                Register
              </button>
            )}
          </Link>

        </div>

        {/* Mobile Hamburger */}
        <div
          className="navbar-hamburger"
          onClick={() => setMenuOpen((prev) => !prev)}
          role="button"
          tabIndex={0}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setMenuOpen((prev) => !prev);
            }
          }}
        >
          {menuOpen ? <Close /> : <Menu />}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
