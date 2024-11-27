const mongoose = require('mongoose');

const OrderTrackingSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  statusUpdates: [
    {
      status: { type: String, enum: ['Pending','Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'], required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  dispatchDetails: {
    dispatchDate: { type: Date },
    expectedDeliveryDate: { type: Date },
    referenceNumber: { type: String },
  },
}, { timestamps: true });

module.exports = mongoose.model('OrderTracking', OrderTrackingSchema);
