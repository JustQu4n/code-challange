import React from 'react'
import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3 className="footer-title">
              <span className="footer-icon">🚀</span>
              CRUDER Client
            </h3>
            <p className="footer-description">
              Building modern web applications with cutting-edge technologies.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="LinkedIn">💼</a>
              <a href="#" aria-label="GitHub">🐙</a>
            </div>
          </div>

          <div className="footer-column">
            <h4 className="footer-column-title">Product</h4>
            <ul className="footer-links">
              <li><a href="/features">Features</a></li>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="/security">Security</a></li>
              <li><a href="/roadmap">Roadmap</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-column-title">Company</h4>
            <ul className="footer-links">
              <li><a href="/about">About Us</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/press">Press</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-column-title">Support</h4>
            <ul className="footer-links">
              <li><a href="/help">Help Center</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/status">Status</a></li>
              <li><a href="/docs">Documentation</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} CRUDER Client. All rights reserved.
          </p>
          <div className="footer-legal">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
