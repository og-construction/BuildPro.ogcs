const DeliveryCharge = require('../models/deliveryCharge');
const Seller = require("../models/sellerModel")
const asyncHandler = require('express-async-handler');

// Create a new delivery charge
const createDeliveryCharge = asyncHandler(async (req, res) => {
  const { seller, baseCharge, perKmCharge, weightCharge, maxDistance } = req.body;

  if (!seller || !baseCharge) {
    return res.status(400).json({ message: 'Seller and base charge are required' });
  }

  const newDeliveryCharge = new DeliveryCharge({
    seller,
    baseCharge,
    perKmCharge,
    weightCharge,
    maxDistance,
  });

  await newDeliveryCharge.save();

  res.status(201).json({ message: 'Delivery charge created successfully', deliveryCharge: newDeliveryCharge });
});

// Get all delivery charges for a seller
const getSellerDeliveryCharges = asyncHandler(async (req, res) => {
  const { sellerId } = req.params;

  const deliveryCharges = await DeliveryCharge.find({ seller: sellerId });

  if (!deliveryCharges.length) {
    return res.status(404).json({ message: 'No delivery charges found for this seller' });
  }

  res.status(200).json(deliveryCharges);
});

// Update a delivery charge
const updateDeliveryCharge = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const updatedDeliveryCharge = await DeliveryCharge.findByIdAndUpdate(id, updates, { new: true });

  if (!updatedDeliveryCharge) {
    return res.status(404).json({ message: 'Delivery charge not found' });
  }

  res.status(200).json({ message: 'Delivery charge updated successfully', deliveryCharge: updatedDeliveryCharge });
});

// Delete a delivery charge
const deleteDeliveryCharge = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedDeliveryCharge = await DeliveryCharge.findByIdAndDelete(id);

  if (!deletedDeliveryCharge) {
    return res.status(404).json({ message: 'Delivery charge not found' });
  }

  res.status(200).json({ message: 'Delivery charge deleted successfully' });
});

// Calculate delivery charge for an order
const calculateDeliveryCharge = asyncHandler(async (req, res) => {
    const { sellerId, userAddress } = req.body;
  
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
  
    const deliveryCharge = await DeliveryCharge.findOne({ seller: sellerId });
    if (!deliveryCharge) {
      return res.status(404).json({ message: 'Delivery charge not defined for this seller' });
    }
  
    // Calculate distance between seller's and user's address
    const distance = calculateDistance(
      seller.address.latitude,
      seller.address.longitude,
      userAddress.latitude,
      userAddress.longitude
    );
  
    if (deliveryCharge.maxDistance && distance > deliveryCharge.maxDistance) {
      return res.status(400).json({ message: `Distance exceeds the maximum allowed limit of ${deliveryCharge.maxDistance} km` });
    }
  
    let totalCharge = deliveryCharge.baseCharge;
  
    if (distance && deliveryCharge.perKmCharge) {
      totalCharge += distance * deliveryCharge.perKmCharge;
    }
  
    if (userAddress.weight && deliveryCharge.weightCharge) {
      totalCharge += userAddress.weight * deliveryCharge.weightCharge;
    }
  
    res.status(200).json({ totalCharge });
  });
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => degrees * (Math.PI / 180);
  
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };
   
module.exports = {
  createDeliveryCharge,
  getSellerDeliveryCharges,
  updateDeliveryCharge,
  deleteDeliveryCharge,
  calculateDeliveryCharge,
};
