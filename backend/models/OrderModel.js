const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true }, // Total order amount (including delivery charges)
  deliveryCharges: { type: Number, default: 0 }, // Delivery charges (optional)
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
