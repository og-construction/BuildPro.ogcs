const OrderTracking = require('../models/OrderTrackingModel');
const asyncHandler = require('express-async-handler');

// Add a status update
const addStatusUpdate = asyncHandler(async (req, res) => {
  const { orderId, sellerId, status, dispatchDetails } = req.body;

  if (!orderId || !sellerId || !status) {
    return res.status(400).json({ message: 'Order ID, Seller ID, and Status are required.' });
  }

  const validStatuses = ['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }

  let tracking = await OrderTracking.findOne({ orderId, sellerId });
  if (!tracking) {
    tracking = new OrderTracking({ orderId, sellerId, statusUpdates: [] });
  }

  tracking.statusUpdates.push({ status, timestamp: new Date() });

  if (dispatchDetails) {
    tracking.dispatchDetails = {
      dispatchDate: dispatchDetails.dispatchDate || tracking.dispatchDetails.dispatchDate,
      expectedDeliveryDate: dispatchDetails.expectedDeliveryDate || tracking.dispatchDetails.expectedDeliveryDate,
      referenceNumber: dispatchDetails.referenceNumber || tracking.dispatchDetails.referenceNumber,
    };
  }

  await tracking.save();

  res.status(200).json({ message: 'Status updated successfully.', tracking });
});
// Get tracking details for an order
const getTrackingDetails = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
  
    const trackingDetails = await OrderTracking.find({ orderId }).populate('sellerId', 'name');
    if (!trackingDetails || trackingDetails.length === 0) {
      return res.status(404).json({ message: 'No tracking details found for this order.' });
    }
  
    res.status(200).json({ orderId, trackingDetails });
  });
  // Get all tracking records (Admin View)
const getAllTrackingRecords = asyncHandler(async (req, res) => {
    const trackingRecords = await OrderTracking.find().populate('orderId', 'user').populate('sellerId', 'name');
    res.status(200).json(trackingRecords);
  });
  
  module.exports = {
    addStatusUpdate,
    getTrackingDetails,
    getAllTrackingRecords
  }