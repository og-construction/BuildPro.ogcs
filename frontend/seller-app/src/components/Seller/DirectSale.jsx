import React, { useState } from 'react';
import './DirectSale.css';  

const DirectSale = () => {
  // State to track whether content is expanded or collapsed
  const [isExpanded, setIsExpanded] = useState(false);

  // State to store form data
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    companyName: '',
    phoneNo: '',
    visibility: ''  
  });

 
  const [price, setPrice] = useState(0);

   
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Toggle function for "Show More" and "Show Less"
  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    // Update form data state
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'radio' ? value : type === 'number' ? parseFloat(value) : value
    }));

    // Update price based on visibility selection
    if (name === 'visibility') {
      switch (value) {
        case '1X Visibility':
          setPrice(500000);  
          break;
        case '2X Visibility':
          setPrice(900000); 
          break;
        case '3X Visibility':
          setPrice(1100000);           
          break;
        case '4X Visibility':
          setPrice(1500000);  
          break;
        default:
          setPrice(0);
      }
    }
  };

  // Handle form submission (simulated payment logic)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission logic here (e.g., payment integration)
    console.log('Form submitted:', formData);
    console.log('Payment amount:', price);

    setFormData({
      name: '',
      lastName: '',
      companyName: '',
      phoneNo: '',
      visibility: ''
    });
    setPrice(0);  
    setTermsAccepted(false);  
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const commonContent = (
    <div>
      <h3>Sales Information</h3>
      <p>Information about sales...</p>
      <h4>BuildPro</h4>
      <p>"Building Supplies at Your Fingertips"</p>

      <h4>Material and Equipment Platform:</h4>
      <p>This platform is designed to streamline your procurement of construction materials and equipment, offering numerous advantages:</p>
      <ul>
        <li>Comprehensive Access: Connect with a wide range of suppliers and manufacturers for building materials, equipment, tools, and tackles.</li>
        <li>One-Click Comparisons: Easily obtain comparative statements with specifications, quality standards, prices, and delivery times.</li>
        <li>Efficiency and Convenience: Access all necessary information in one place, eliminating the need for multiple visits or extensive research.</li>
        <li>Quality Assurance: Review product specifications and quality standards to ensure that materials meet your project's requirements.</li>
        <li>Timely Delivery: Compare delivery times to select suppliers that align with your project schedule.</li>
      </ul>

        <>
          <p>This platform saves time and effort by providing all the essential data at your fingertips, making procurement more efficient and informed.</p>
          <h4>Service Charges:</h4>
          <ul>
            <li>1X Visibility: ₹500,000</li>
            <li>2X Visibility: ₹900,000</li>
            <li>3X Visibility: ₹14,00,000</li>
            <li>4X Visibility: ₹1800,000</li>
          </ul>

          <h4>Visibility Tiers:</h4>
          <ol>
            <li><strong>1X Visibility:</strong> Basic module with standard visibility.</li>
            <li><strong>2X Visibility:</strong> Enhanced visibility.</li>
            <li><strong>3X Visibility:</strong> Further enhanced visibility.</li>
            <li><strong>4X Visibility:</strong> Maximum visibility, ensuring top placement in all search results.</li>
          </ol>
        </>
    </div>
  );

  return (
    <div className="direct-sale-container">
      <h1>Direct Sale Page</h1>
      <div className="content-box">
        {commonContent}
      </div>
    </div>
  );
};

export default DirectSale;
