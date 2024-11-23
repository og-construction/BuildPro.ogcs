import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { showErrorToast, showSuccessToast } from '../utils/toaster';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  let navigate=useNavigate()
  const location = useLocation();
  const { sellerId } = location.state || {}; // Retrieve sellerId from state

  const [timeLeft, setTimeLeft] = useState(880);
  const [orderDetails, setOrderDetails] = useState(null); // State to store Razorpay order details

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

  const updatePaymentStatus = async (data) => {
    const sellerId = JSON.parse(localStorage.getItem("sellerId") || "");
  
    if (!sellerId) {
      showErrorToast("Seller ID is required");
      return;
    }
  
    try {
      // First API call: Update payment status
      const paymentStatusRequest = axios.patch(
        `http://localhost:5000/api/seller/payment-status/${sellerId}`,
        { isPaymentDone: true }, // Request body
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      // Second API call: Save payment details
      const savePaymentRequest = axios.post(
        `http://localhost:5000/api/payment/save-payment`,
        {
          sellerId: sellerId,
          orderCreationId: data.orderCreationId, // Replace with actual data
          razorpayPaymentId: data.razorpayPaymentId, // Replace with actual data
          razorpayOrderId: data.razorpayOrderId, // Replace with actual data
          razorpaySignature: data.razorpaySignature, // Replace with actual data
          amount: 10000, // Example amount
          currency: "INR",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      // Execute both requests in parallel using Promise.all
      const [paymentStatusResponse, savePaymentResponse] = await Promise.all([
        paymentStatusRequest,
        savePaymentRequest,
      ]);
  
      // Navigate or show success message after both requests succeed
      navigate("/");
      showSuccessToast("Payment updated and details saved successfully!");
    } catch (error) {
      // Handle errors for either request
      console.error("Error:", error);
      showErrorToast(error.response?.data?.message || "Something went wrong");
    }
  };
  

  // Initiate Razorpay payment
  const displayRazorpay = async (amount) => {
    try {
      // Request order creation from the backend
      const response = await axios.post('http://localhost:5000/api/payment/order', { amount });

      if (!response.data.success) {
        showErrorToast(response.data.message || 'Failed to create order');
        return
      }

      const { order, key } = response.data; // Extract order and Razorpay Key ID
      const { id: order_id, currency } = order;

      const options = {
        key, // Use the Razorpay Key ID from the backend response
        amount: amount, // Convert to the smallest currency unit (paise)
        currency,
        name: 'Your Company Name', // Add your company name
        description: 'Seller Registration Payment',
        image: 'https://example.com/your_logo', // Replace with your logo URL
        order_id,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
          const data = {
            orderCreationId: order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpayOrderId: razorpay_order_id,
            razorpaySignature: razorpay_signature,
          };
          if (data.razorpayPaymentId) updatePaymentStatus(data)

          // Optionally verify the payment
          console.log('Payment Details:', data);
          showSuccessToast('Payment Successful!');
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        notes: {
          address: 'Customer Address',
        },
        theme: {
          color: '#F37254',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error in Razorpay payment:', error);
      alert('Payment failed. Please try again later.');
    }
  };



  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-10">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-semibold text-center text-indigo-600">OGCS Private Limited</h1>

        {/* Billing Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">Billing Details</h2>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="flex justify-between mb-4">
              <p className="text-lg font-medium text-gray-700">Seller Registration Fee</p>
              <p className="text-lg font-medium text-gray-900">INR 10000</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-lg font-medium text-gray-700">Transaction Timeout</p>
              <p className="text-lg font-medium text-gray-900">{formatTime(timeLeft)}</p>
            </div>
            <p className="text-md text-gray-600">Please complete the payment within the time limit to proceed with the registration.</p>
          </div>
        </div>

        {/* Payment Button */}
        <div className="mt-8">
          <button
            onClick={() => displayRazorpay(10000)} // INR 10000
            className="w-full py-3 text-white font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700"
          >
            Proceed to Pay INR 10000
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
