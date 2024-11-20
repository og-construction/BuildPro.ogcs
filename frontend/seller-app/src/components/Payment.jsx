import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentPage = () => {
  const location = useLocation();
  const { sellerId } = location.state || {}; // Retrieve sellerId from state

  const [timeLeft, setTimeLeft] = useState(880);
  const [encRequest, setEncRequest] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [testUrl, setTestUrl] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    const initiatePayment = async () => {
      if (!sellerId) {
        console.error('Seller ID is missing');
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/api/payment/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: 'ORDER123',
            visibilityTier: 1,
            sellerId, // Use the sellerId passed from VerifyOtp
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setEncRequest(data.encRequest);
          setAccessCode(data.accessCode);
          setTestUrl(data.testUrl);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error initiating payment:', error);
      }
    };

    initiatePayment();
  }, [sellerId]); // Include sellerId as a dependency

  const handlePaymentRedirect = () => {
    if (!testUrl || !encRequest || !accessCode) {
      console.error('Missing payment details.');
      return;
    }

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = testUrl;

    const encRequestInput = document.createElement('input');
    encRequestInput.type = 'hidden';
    encRequestInput.name = 'encRequest';
    encRequestInput.value = encRequest;

    const accessCodeInput = document.createElement('input');
    accessCodeInput.type = 'hidden';
    accessCodeInput.name = 'access_code';
    accessCodeInput.value = accessCode;

    form.appendChild(encRequestInput);
    form.appendChild(accessCodeInput);
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div>
      <h1>OGCS Private Limited</h1>
      <p>Transaction timeout in: {formatTime(timeLeft)}</p>
      <button onClick={handlePaymentRedirect} disabled={!encRequest || !accessCode}>
        Proceed to Pay INR 10000
      </button>
    </div>
  );
};

export default PaymentPage;
