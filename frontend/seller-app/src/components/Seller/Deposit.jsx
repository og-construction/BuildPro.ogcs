import React, { useState } from 'react';
import './Deposit.css'; // You can create this CSS file for custom styling

const Deposit = () => {
  const [depositData, setDepositData] = useState({
    paymentMethod: '',
    amount: '',
    transactionId: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false); // State to track form submission

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDepositData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Deposit form submitted:', depositData);
    
    // Set submission state to true
    setIsSubmitted(true);

    // Reset form after submission
    setDepositData({
      paymentMethod: '',
      amount: '',
      transactionId: ''
    });
  };

  return (
    <div className="deposit-container">
      <h1>Deposit Payment</h1>

      {isSubmitted ? ( // Conditional rendering based on submission state
        <div className="thank-you-message">
          <h2>Thank you for your payment!</h2>
          <p>Your deposit has been successfully submitted.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="deposit-form">
          <div className="form-group">
            <label htmlFor="paymentMethod">Payment Method:</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={depositData.paymentMethod}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Payment Method</option>
              <option value="creditCard">Credit Card</option>
              <option value="debitCard">Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bankTransfer">Bank Transfer</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={depositData.amount}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="transactionId">Transaction ID:</label>
            <input
              type="text"
              id="transactionId"
              name="transactionId"
              value={depositData.transactionId}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="submit-button">Submit Payment</button>
        </form>
      )}
    </div>
  );
};

export default Deposit;
