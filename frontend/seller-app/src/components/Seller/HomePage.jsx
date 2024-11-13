import React, { useState } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import TermsModal from './TermsModal'; 
import logo from '../../Images/buillogo7.png';  
import Company_Logo from '../../Images/OGGS_Logo.png';  

const HomePage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  

  // Function to navigate to About Page
  const handleAboutClick = () => {
    navigate('/about');
  };

  // Function to open the Terms Modal
  const openTermsModal = () => {
    setModalOpen(true);
  };

  // Function to close the Terms Modal
  const closeTermsModal = () => {
    setModalOpen(false);
  };

    // Function to navigate to the Seller (Sign-in) page
    const handleSellerClick = () => {
      navigate('/sign-in'); // Redirect to the sign-in page
    };
  

  return (
    <div className="homepage">
      {/* Navigation Bar */}
      <nav className="navbar">
        <img src={logo} alt="First Company Logo" className="nav-logo-left" /> {/* First Logo on the left side */}
        <h2 className="company-name">BuildPro OGCS</h2>
        <div className="nav-right">
          <img src={Company_Logo} alt="Second Company Logo" className="nav-logo-right" /> {/* Second Logo on the right side */}
          <button className="nav-button" onClick={handleSellerClick}>Seller</button>
        </div>
      </nav>

      <header className="homepage-header">
        <h1>WELCOME</h1>
      </header>

      {/* About Section */}
      <section className="company-info">
        <h2 onClick={handleAboutClick} className="about-title">
          About Us  
        </h2>
        <p className="about-description">
          <span className="highlighted-text">"Building Supplies at Your Fingertips"</span><br/>
          Revolutionize construction procurement by connecting clients with a broad network of specialized agencies for informed decision-making and greater efficiency.<br/>
          We specialize in providing the best solutions for civil construction services. Our commitment to excellence and customer satisfaction is the foundation of our success.
        </p>
      </section>

      {/* Direct Sale and Sales with OGCS Buttons */}
      <div className="action-buttons">
        <button className="navigate-button" onClick={() => navigate('/sales-with-ogcs')}>
          Sale By BuildPro/OGCS
        </button>
        <button className="navigate-button" onClick={() => navigate('/direct-sale')}>
          Sale by Seller
        </button>
      </div>

      {/* Terms and Conditions Button */}
      <div className="terms-box-container">
        <div className="terms-box" onClick={openTermsModal}>
          <h2>Terms and Conditions</h2>
        </div>
      </div>

      {/* Modal for Terms and Conditions */}
      <TermsModal isOpen={isModalOpen} onClose={closeTermsModal} />
    </div>
  );
};

export default HomePage;