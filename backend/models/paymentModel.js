const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  paymentType: { type: String, enum: ['Registration', 'Order'], required: true }, // New field
  orderId: { type: String, required: function() { return this.paymentType === 'Order'; } }, // Required for orders
  amount: { type: Number, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: false }, // Optional for orders
  paymentStatus: { type: String, default: "Pending" },
  paymentMode: { type: String, enum: ['Online', 'Card', 'Net Banking'], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
