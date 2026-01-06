import React from 'react';
import { Facebook, YouTube, Instagram, GitHub, Twitter, ChevronRight } from '@mui/icons-material';
import '../../assets/css/Footer.css';

const FooterView = (props) => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-cta">
          <h2>Lets Connect there</h2>
          <button className="hire-btn">
            Hire me
            <ChevronRight />
          </button>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div className="footer-info">
            <div className="footer-logo">
              <span className="logo-icon">PM</span>
              <span className="footer-name">PARVEJ MALIK</span>
            </div>
            <p className="footer-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed congue 
              interdum ligula a dignissim. Lorem ipsum dolor sit amet, consectetur 
              adipiscing elit. Sed lobortis orci elementum egestas lobortis.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon"><Facebook /></a>
              <a href="#" className="social-icon"><YouTube /></a>
              <a href="#" className="social-icon"><Instagram /></a>
              <a href="#" className="social-icon"><GitHub /></a>
              <a href="#" className="social-icon"><Twitter /></a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Navigation</h4>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/projects">Project</a></li>
                <li><a href="/resume">Resume</a></li>
                <li><a href="/blog">Blog</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Contact</h4>
              <ul>
                <li><a href="tel:+917738443636">+91 7738443636</a></li>
                <li><a href="mailto:Jaycrad36@gmail.com">Jaycrad36@gmail.com</a></li>
                <li><a href="#">Portfolio_jcrag.com</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Get the latest information</h4>
              <div className="newsletter">
                <input type="email" placeholder="Email Address" />
                <button type="submit">
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-copyright">
          <p>Copyright© 2026 Parvej. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterView;