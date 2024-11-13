import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './OgcsSale.css'; // Import your CSS file

const OgcsSale = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    companyName: '',
    registerFees: ''
  });

  const toggleContentVisibility = () => {
    setIsExpanded(!isExpanded);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    // Navigate to Deposit page after form submission
    navigate('/deposit');

    // Reset the form after navigation (this will not happen if navigate is called)
    setFormData({
      name: '',
      lastName: '',
      companyName: '',
      registerFees: ''
    });
  };

  const initialContent = (
    <div className="content-card">
      <h3>Sales Information</h3>
      <p>Buyers acknowledge that they are bound by these terms upon using the BuildPro OGCS platform. The terms apply to all procurement, browsing, or interactions initiated through the platform.</p>
       
    </div>
  );

  const expandedContent = (
    <div className="expanded-content">
      <h4>Terms and Conditions for BuildPro OGCS with Buyers</h4>
      <p>This platform is designed to streamline your procurement of construction materials and equipment, offering numerous advantages:</p>
      <ul>
        <li>Data Verification: Connect with a wide range of suppliers and manufacturers for building materials, equipment, tools, and tackles.</li>
        <li>BuildPro OGCS does not guarantee the accuracy or completeness of the data provided by suppliers.</li>
      </ul>
      <h4>Mode of Operation</h4>
      <ol>
        <li>Connecting Suppliers with Buyers/Construction Organizations.</li>
        <li>Supplier Registration: Suppliers must register on the BuildPro OGCS portal.</li>
      </ol>

      <h4>Comparative Statements and Product Selection</h4>
      <ol>
        <li>Buyers can request comparative statements for selected products. These statements include specifications, delivery times, and pricing (if available).</li>
        <li>Comparative statements are meant for informational purposes only and do not guarantee product availability or fixed pricing</li>
      </ol>

      <h4>Product Selection and Purchase</h4>
      <ol>
        <li>BuildPro OGCS is not involved in the actual procurement process between buyers and suppliers. All contract terms, including delivery, payment, and product warranty, must be negotiated directly between the two parties.</li>
      </ol>

      <h4>Dispute Resolution </h4>
      <ol>
        <li>Buyers are solely responsible for resolving disputes with suppliers regarding product quality, delivery timelines, or payment terms.  </li>
        <li>BuildPro OGCS will not mediate or intervene in disputes between buyers and suppliers unless additional verification services are engaged.</li>
      </ol>

      <h4>Responsibility of Suppliers </h4>
      <ol>
        <li>Suppliers listed on the BuildPro OGCS platform are responsible for ensuring the quality and accuracy of the products they offer. Buyers must engage with suppliers at their own risk.</li>
         
      </ol>

      <h4>Product Warranty and Returns</h4>
      <ol>
        <li>Buyers must negotiate product warranty and return policies directly with the suppliers. BuildPro OGCS is not liable for ensuring that suppliers meet their warranty commitments.</li>
        <li>Buyers may request assistance from BuildPro OGCS in verifying product documentation or conducting sample checks, subject to additional charges.</li>
      </ol>
    </div>
  );

  return (
    <div className="ogcs-sale-container">
      <h1>OGCS Sale Page</h1>
      {initialContent}
      <button onClick={toggleContentVisibility} className="know-more-button">
        {isExpanded ? 'Show Less' : 'Know More'}
      </button>
      {isExpanded && expandedContent}
      <div className="registration-form">
        <h3>Register and Payment</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">First Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="companyName">Company Name:</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="registerFees">Register Fees:</label>
            <input
              type="number"
              id="registerFees"
              name="registerFees"
              value={formData.registerFees}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">Pay and Next</button>
        </form>
      </div>
    </div>
  );
};

export default OgcsSale;
