const express = require('express');
const { addStatusUpdate, getTrackingDetails, getAllTrackingRecords } = require('../controller/OrderTrackingCtrl');
const router = express.Router();

// Add a status update (Seller)
router.post('/update', addStatusUpdate);

// Get tracking details for an order (Buyer)
router.get('/:orderId', getTrackingDetails);

// Get all tracking records (Admin)
router.get('/', getAllTrackingRecords);

module.exports = router;
