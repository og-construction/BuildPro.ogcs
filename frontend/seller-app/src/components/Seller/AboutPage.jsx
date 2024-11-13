import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutPage.css';

const AboutPage = () => {
  const navigate = useNavigate();

  // Function to handle visibility option clicks
  const handleVisibilityClick = (tierTitle) => {
    navigate('/visibility-details', { state: { tierTitle } });
  };

  return (
    <div className="about-page">
      <h1 className="about-page-header">About Our Company</h1>
      <p>
        We specialize in providing the best solutions for civil construction services. Our commitment to excellence and customer satisfaction is the foundation of our success.
      </p>

      {/* Service Charges Section */}
      <h4>Service Charges:</h4>
      <ul className="service-charges-list">
        <li>1X Visibility: $XX</li>
        <li>2X Visibility: $XX</li>
        <li>3X Visibility: $XX</li>
        <li>4X Visibility: $XX</li>
      </ul>

      {/* Visibility Tiers Section */}
      <h4>Visibility Tiers:</h4>
      <ol className="visibility-tiers-list">
        <li onClick={() => handleVisibilityClick('1X Visibility')}>
          <strong>1X Visibility:</strong> Basic module with standard visibility.
        </li>
        <li onClick={() => handleVisibilityClick('2X Visibility')}>
          <strong>2X Visibility:</strong> Enhanced visibility.
        </li>
        <li onClick={() => handleVisibilityClick('3X Visibility')}>
          <strong>3X Visibility:</strong> Further enhanced visibility.
        </li>
        <li onClick={() => handleVisibilityClick('4X Visibility')}>
          <strong>4X Visibility:</strong> Maximum visibility.
        </li>
      </ol>

      {/* Visibility Explanation Section */}
      <h4>Visibility Explanation:</h4>
      <ul className="visibility-explanation">
        <li><strong>1X Visibility:</strong> Appears in standard position.</li>
        <li><strong>2X Visibility:</strong> Elevated position in search results.</li>
        <li><strong>3X Visibility:</strong> Prominent position in search results.</li>
        <li><strong>4X Visibility:</strong> Highest level of visibility.</li>
      </ul>

 
       <h4>Operational Details:</h4>
      <div className="operational-details">
        <p><strong>Visibility Service:</strong> Determines product prominence to buyers.</p>
        <p><strong>Visibility Rotation:</strong> Listings may rotate for fairness.</p>
        <p><strong>Refund and Cancellation:</strong> No refunds post-payment.</p>
        <p><strong>Product and Service Data:</strong> Suppliers ensure accurate product info.</p>
        <p><strong>Supplier Responsibility:</strong> Ensure compliance with quality standards.</p>
        <p><strong>Service Termination:</strong> Services can be terminated for non-compliance.</p>
      </div>
    </div>
  );
};

export default AboutPage;
