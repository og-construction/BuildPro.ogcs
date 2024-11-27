const Order = require('../models/OrderModel');
const Product = require('../models/productModel');
const Payment = require('../models/paymentModel');
const asyncHandler = require('express-async-handler');

// Create an order
const createOrder = asyncHandler(async (req, res) => {
  const { items, paymentId, deliveryCharges = 0 } = req.body;
  const userId = req.user._id;

  if (!items || !paymentId) {
    return res.status(400).json({ message: 'Items and payment details are required' });
  }

  // Validate Payment
  const payment = await Payment.findById(paymentId);
  if (!payment || payment.paymentStatus !== 'Completed') {
    return res.status(400).json({ message: 'Invalid or incomplete payment' });
  }

  // Calculate total amount
  let totalAmount = 0;
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || product.quantity < item.quantity) {
      return res.status(400).json({ message: `Product not available or insufficient quantity: ${item.product}` });
    }
    totalAmount += product.price * item.quantity;

    // Update product stock
    product.quantity -= item.quantity;
    await product.save();
  }

  // Add delivery charges to total amount
  totalAmount += deliveryCharges;

  const newOrder = new Order({
    user: userId,
    items: items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price
    })),
    totalAmount,
    deliveryCharges,
    payment: paymentId
  });

  await newOrder.save();

  res.status(201).json({ message: 'Order created successfully', order: newOrder });
});

// Get all orders for a user
const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const orders = await Order.find({ user: userId })
    .populate('items.product', 'name price')
    .populate('payment');
  res.status(200).json(orders);
});

// Get a single order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id)
    .populate('items.product', 'name price')
    .populate('payment');
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.status(200).json(order);
});

// Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  order.status = status;
  await order.save();

  res.status(200).json({ message: 'Order status updated successfully', order });
});

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus
};
