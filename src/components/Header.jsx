import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            Forum
          </Link>
        </h1>
        <nav className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
          <Link 
            to="/" 
            className="nav-link" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/create" 
            className="nav-link" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            New Thread
          </Link>
        </nav>
        <button 
          className="mobile-menu-toggle hidden-desktop"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;