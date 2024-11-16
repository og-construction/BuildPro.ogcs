 // src/components/VerifyOtp.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp } from '../api';  
import Style from "./Style/VerifyOtp.module.css";
//import './VerifyOtp.css';

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
    <div className={Style["verify-otp-container"]}>
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <div className={Style["form-group"]}>
          <label htmlFor="otp">Enter OTP</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={handleChange}
            required
          />
        </div>
        {errorMessage && <p className={Style["error-message"]}>{errorMessage}</p>}
     <button type="submit" className={Style["btn_submit"]} onClick={handlePaymentSubmit}>Verify OTP</button>
      </form>
    </div>
  );
};

export default VerifyOtp;