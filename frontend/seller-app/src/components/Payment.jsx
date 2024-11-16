import React, { useState ,useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Payment.css"; 

const PaymentPage = () => {
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    address: "",
    postalCode: "",
    city: "",
    state: "",
    country: "",
    email: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [showModal, setShowModal] = useState(false); 

  const [timeLeft, setTimeLeft] = useState(880);  
  const navigate = useNavigate();

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          // You can add logic here to handle the timeout, like redirecting to another page
          alert("Transaction time has expired. Please try again.");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  //timeout end 

  const handleBillingChange = (e) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/sign-in"); // Redirect to login page
  };

  return (
    <div className="payment-page">
      <div className="header">
        <h1>OGCS Private Limited</h1>
        <p>Transaction times out in <strong>{formatTime(timeLeft)} mins</strong></p>
      </div>

      <div className="content">
        {/* Billing Information */}
        <div className="billing-section">
          <h2>Billing Information</h2>
          <form>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={billingInfo.name}
              onChange={handleBillingChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={billingInfo.address}
              onChange={handleBillingChange}
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={billingInfo.postalCode}
              onChange={handleBillingChange}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={billingInfo.city}
              onChange={handleBillingChange}
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={billingInfo.state}
              onChange={handleBillingChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={billingInfo.email}
              onChange={handleBillingChange}
            />
          </form>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Register Details</h3>
          <p><strong>Order #:</strong> ORD123456789</p>
          <p><strong>Register Amount:</strong> INR 10000.00</p>
          <input type="text" placeholder="Coupon Code" />
          <button>Apply</button>
        </div>
      </div>

      {/* Payment Information */}
      <div className="payment-section">
        <h2>Payment Information</h2>

        <div className="payment-methods">
          <button
            className={paymentMethod === "Credit Card" ? "active" : ""}
            onClick={() => handlePaymentMethodChange("Credit Card")}
          >
            Credit Card
          </button>
          <button
            className={paymentMethod === "Debit Card" ? "active" : ""}
            onClick={() => handlePaymentMethodChange("Debit Card")}
          >
            Debit Card
          </button>
          <button
            className={paymentMethod === "Net Banking" ? "active" : ""}
            onClick={() => handlePaymentMethodChange("Net Banking")}
          >
            Net Banking
          </button>
          <button
            className={paymentMethod === "Wallet" ? "active" : ""}
            onClick={() => handlePaymentMethodChange("Wallet")}
          >
            Wallet
          </button>
          <button
            className={paymentMethod === "UPI" ? "active" : ""}
            onClick={() => handlePaymentMethodChange("UPI")}
          >
            UPI
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Conditional payment fields */}
          {paymentMethod === "Credit Card" && (
            <div className="card-details">
              <input type="text" placeholder="Card Number" />
              <div className="expiry-cvv">
                <input type="text" placeholder="MM" />
                <input type="text" placeholder="YY" />
                <input type="text" placeholder="CVV" />
              </div>
            </div>
          )}
          {paymentMethod === "Debit Card" && (
            <div className="card-details">
              <input type="text" placeholder="Card Number" />
              <div className="expiry-cvv">
                <input type="text" placeholder="MM" />
                <input type="text" placeholder="YY" />
                <input type="text" placeholder="CVV" />
              </div>
            </div>
          )}
          {paymentMethod === "Net Banking" && (
            <div className="net-banking">
              <input type="text" placeholder="Bank Name" />
              <input type="text" placeholder="Account Number" />
            </div>
          )}
          {paymentMethod === "Wallet" && (
            <div className="wallet">
              <input type="text" placeholder="Wallet ID" />
            </div>
          )}
          {paymentMethod === "UPI" && (
            <div className="upi">
              <input type="text" placeholder="UPI ID" />
            </div>
          )}

          <p>Total Amount Payable: INR 10000.00</p>
          <button type="submit" className="payment-btn">Make Payment</button>
        </form>
      </div>
           {/* Modal for Thank You Message */}
           {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>OGCS PRIVATE LIMITED</h2>
            <p>Thank you for your payment!</p>
            <p>Thank you for connecting with BuildPro.</p>
            <button onClick={handleModalClose}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;