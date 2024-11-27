const express = require('express');
const {
  createDeliveryCharge,
  getSellerDeliveryCharges,
  updateDeliveryCharge,
  deleteDeliveryCharge,
  calculateDeliveryCharge,
} = require('../controller/deliveryCharge');

const router = express.Router();

// Routes for delivery charges
router.post('/', createDeliveryCharge); // Only admins can create charges
router.get('/:sellerId', getSellerDeliveryCharges); // Get all charges for a seller
router.put('/:id',updateDeliveryCharge); // Only admins can update charges
router.delete('/:id',deleteDeliveryCharge); // Only admins can delete charges
router.post('/calculate', calculateDeliveryCharge); // Calculate charge for an order

module.exports = router;
