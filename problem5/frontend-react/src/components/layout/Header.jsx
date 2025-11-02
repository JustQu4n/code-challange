import React, { useState } from 'react'
import './Header.css'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <a href="/">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">CRUDER Client</span>
          </a>
        </div>

        <nav className={`header-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <a href="/" className="nav-link active">Home</a>
          <a href="/products" className="nav-link">Products</a>
          <a href="/services" className="nav-link">Services</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/contact" className="nav-link">Contact</a>
        </nav>

        <div className="header-actions">
          <button className="btn btn-outline">Login</button>
          <button className="btn btn-primary">Sign Up</button>
        </div>

        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}
