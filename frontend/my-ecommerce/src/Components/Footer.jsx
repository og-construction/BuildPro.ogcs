// src/Components/Footer/Footer.jsx
import React from 'react';
import './Footer.css'; // Ensure you create this CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>Get to Know Us</h3>
          <ul>
            <li><a href="https://google.com/">About Us</a></li>
            <li><a href="https://www.example.com">Vision</a></li>
            <li><a href="https://www.example.com">Mission</a></li>
            <li><a href="https://www.example.com">Join with US</a></li>
            <li><a href="https://google.com/">Feedback</a></li>
    
          </ul>
        </div>

        <div className="footer-column">
          <h3>Connect with Us</h3>
          <ul>
            <li><a href="https://www.facebook.com/ogcsprivatelimited?mibextid=ZbWKwL">Facebook</a></li>
            <li><a href="https://google.com/">Twitter</a></li>
            <li><a href="https://google.com/">Instagram</a></li>
            <li><a href="https://google.com/">YouTube</a></li>
            <li><a href="https://google.com/">LinkedIn</a></li>
            <li><a href="https://google.com/">Terms and Conditions</a> </li>
          </ul>
        </div>
        
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} BuildPro OGCS. All rights reserved.  </p>
        
     </div>
    </footer>
  );
};

export default Footer;
