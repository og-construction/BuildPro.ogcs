 // src/components/VerifyOtp.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp } from '../api';  
import './VerifyOtp.css';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {}; // Get email from state
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await verifyOtp({ email, otp });
      navigate('/sign-in');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'OTP verification failed');
      setOtp(''); // Reset OTP field after an error
    }
  };

  const handlePaymentSubmit = () => {
    navigate('/payment')
  }
  
  return (
    <div className="verify-otp-container">
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="otp">Enter OTP</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={handleChange}
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" onClick={handlePaymentSubmit}>Verify OTP</button>
      </form>
    </div>
  );
};

export default VerifyOtp;