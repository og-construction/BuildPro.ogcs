const Payment = require("../models/paymentModel");
const Seller = require("../models/sellerModel");
const { encrypt, decrypt } = require("../utils/crypto");
const asyncHandler = require("express-async-handler");
const Order = require('../models/OrderModel')
const mongoose = require('mongoose')
/*
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
    const registrationFee = 10000;// this is for seller registration fee 
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
const initiateOrderPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  // Fetch the order details
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Prepare payment details
  const totalAmount = order.totalAmount;

  // Simulate payment initiation (or use a payment gateway integration)
  const payment = new Payment({
    orderId,
    amount: totalAmount,
    paymentMode: "Online",
    paymentStatus: "Pending",
  });

  await payment.save();

  res.status(200).json({
    message: "Payment initiated successfully",
    paymentId: payment._id,
    orderId: order._id,
    totalAmount,
  });
});
const handleOrderPaymentResponse = asyncHandler(async (req, res) => {
  const { paymentId, status } = req.body;

  if (!paymentId || !status) {
    return res.status(400).json({ message: "Payment ID and status are required" });
  }

  // Update payment status
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  payment.paymentStatus = status;
  await payment.save();

  // Update the order status if the payment is successful
  if (status === "Completed") {
    const order = await Order.findById(payment.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "Confirmed"; // Update order status to confirmed
    order.payment = paymentId; // Link the payment ID to the order
    await order.save();
  }

  res.status(200).json({ message: "Payment processed successfully", payment });
});

module.exports = { initiateOrderPayment,handleOrderPaymentResponse}
*/

// Initiate Payment
exports.initiatePayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  // Fetch the order to ensure it exists
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Check if the order already has a linked payment
  if (order.payment) {
    return res.status(400).json({ message: "Payment already initiated for this order" });
  }

  // Create the payment record
  const payment = new Payment({
    paymentType: "Order",
    orderId,
    amount: order.totalAmount,
    paymentMode: "Online",
    paymentStatus: "Pending",
  });

  await payment.save();

  // Link the payment to the order
  order.payment = payment._id;
  await order.save();

  res.status(200).json({
    message: "Payment initiated successfully",
    paymentId: payment._id,
    amount: order.totalAmount,
  });
});
exports.handlePaymentResponse = asyncHandler(async (req, res) => {
  const { paymentId, status } = req.body;

  if (!paymentId || !status) {
    return res.status(400).json({ message: "Payment ID and status are required" });
  }

  // Fetch the payment record
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  // Update payment status
  payment.paymentStatus = status;
  await payment.save();

  // If payment is completed, update the order status to 'Confirmed'
  if (status === "Completed") {
    const order = await Order.findById(payment.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "Confirmed";
    await order.save();
  }

  res.status(200).json({ message: "Payment processed successfully", payment });
});
