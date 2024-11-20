const Payment = require("../models/paymentModel");
const Seller = require("../models/sellerModel");
const { encrypt, decrypt } = require("../utils/crypto");
const mongoose = require('mongoose')

const workingKey = process.env.WORKING_KEY;
const accessCode = process.env.ACCESS_CODE;
const merchantId = process.env.MERCHANT_ID;
const redirectUrl = process.env.REDIRECT_URL;
const cancelUrl = process.env.CANCEL_URL;

// Initiate Payment
exports.initiatePayment = async (req, res) => {
  try {
    const { orderId, sellerId } = req.body;

    // Validate inputs
    if (!orderId  || !sellerId) {
      return res.status(400).json({ message: "Order ID, Visibility Tier, and Seller ID are required" });
    }

    // Check if seller exists
    const seller = await Seller.findById(sellerId);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    // Calculate Charges
    const registrationFee = 10000;
    //const tierCharges = { 1: 500000, 2: 900000, 3: 1400000, 4: 1800000 };
  //  const tierCharge = tierCharges[visibilityTier];
   // if (!tierCharge) {
     // return res.status(400).json({ message: "Invalid Visibility Tier selected" });
   // }
    const totalAmount = registrationFee 
    // Save Payment Record
    const payment = new Payment({
      orderId,
      amount: totalAmount,
      
      sellerId,
      paymentMode: "Online",
      paymentStatus: "Pending",
    });
    await payment.save();

    // Prepare Payment Gateway Data
    const merchantData = `merchant_id=${merchantId}&order_id=${orderId}&amount=${totalAmount}&currency=INR&redirect_url=${redirectUrl}&cancel_url=${cancelUrl}&language=EN`;
    const encryptedData = encrypt(merchantData, workingKey);

    res.status(200).json({
      testUrl: "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction",
      encRequest: encryptedData,
      accessCode,
    });
  } catch (error) {
    res.status(500).json({ message: "Error initiating payment", error: error.message });
  }
};

// Handle Payment Response
exports.handlePaymentResponse = async (req, res) => {
  try {
    const { encResp } = req.body;
    if (!encResp) {
      console.error('No encResp received');
      return res.status(400).json({ message: 'Response data is required' });
    }

    // Log raw response
    console.log('Raw encResp received:', encResp);

    const decryptedResponse = decrypt(encResp, workingKey);
    console.log('Decrypted Response:', decryptedResponse);

    const parsedResponse = new URLSearchParams(decryptedResponse);
    const orderId = parsedResponse.get('order_id');
    const status = parsedResponse.get('order_status');
    const amount = parsedResponse.get('amount');

    if (!status) {
      console.error('order_status is missing');
      return res.status(400).json({
        message: 'Invalid payment response: order_status is missing',
        decryptedResponse,
      });
    }

    // Update database and respond
    const payment = await Payment.findOneAndUpdate(
      { orderId },
      { paymentStatus: status, amount },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Payment response handled successfully', status, payment });
  } catch (error) {
    console.error('Error handling payment response:', error);
    res.status(500).json({ message: 'Error handling payment response', error: error.message });
  }
};

// Function to process encResp
const handleEncResp = (encResp) => {
  try {
    const decryptedData = decrypt(encResp, workingKey);
    console.log('Decrypted Response:', decryptedData);

    // Convert the decrypted data to an object for easier access
    const responseParams = new URLSearchParams(decryptedData);
    const orderId = responseParams.get('order_id');
    const status = responseParams.get('order_status');
    const amount = responseParams.get('amount');

    // Log key details
    console.log('Order ID:', orderId);
    console.log('Status:', status);
    console.log('Amount:', amount);

    return responseParams; // Return the parsed response for further use
  } catch (error) {
    console.error('Decryption failed:', error.message, { encResp, workingKey });
  }
};

// Main handler for the response
exports.handlePaymentResponse = async (req, res) => {
  try {
    const { encResp } = req.body; // Extract encResp from the request body
    if (!encResp) {
      return res.status(400).json({ message: 'Response data is required' });
    }

    // Decrypt and process encResp
    const responseParams = handleEncResp(encResp);

    // Extract order details
    const orderId = responseParams.get('order_id');
    const status = responseParams.get('order_status');
    const amount = responseParams.get('amount');

    // Update the payment status in your database
    const payment = await Payment.findOneAndUpdate(
      { orderId },
      { paymentStatus: status, amount },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Send success response
    res.status(200).json({
      message: 'Payment response handled successfully',
      status,
      payment,
    });
  } catch (error) {
    console.error('Error handling payment response:', error);
    res.status(500).json({ message: 'Error handling payment response', error: error.message });
  }
};