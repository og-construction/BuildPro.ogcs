import React from 'react';
import axios from 'axios';

const PaymentComponent = () => {
    const displayRazorpay = async (amount) => {
        try {
            // Request order creation from the backend
            const orderResponse = await axios.post('http://localhost:5000/api/payment/order', { amount });

            if (!orderResponse.data.success) {
                throw new Error(orderResponse.data.message || 'Failed to create order');
            }

            const { order, key } = orderResponse.data; // Extract order and Razorpay Key ID
            const { id: order_id, currency } = order;

            const options = {
                key, // Use the Razorpay Key ID from the backend response
                amount: amount * 100, // Convert to the smallest currency unit (paise)
                currency,
                name: 'Your Company Name', // Add your company name
                description: 'Test Transaction',
                image: 'https://example.com/your_logo', // Replace with your logo URL
                order_id,
                handler: async function (response) {
                    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
                    const data = {
                        orderCreationId: order_id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                        razorpaySignature: response.razorpay_signature,
                    };
                    // Optionally verify the payment
                    console.log('Payment Details:', data);
                    alert('Payment Successful!');
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
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Razorpay Payment Integration</h1>
            <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => displayRazorpay(500)}
            >
                Pay ₹500
            </button>
        </div>
    );
};

export default PaymentComponent;
