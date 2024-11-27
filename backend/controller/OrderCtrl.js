const Order = require('../models/OrderModel');
const Product = require('../models/productModel');
const Payment = require('../models/paymentModel');
const asyncHandler = require('express-async-handler');
const OrderTracking = require('../models/OrderTrackingModel');

// Create an order
const createOrder = asyncHandler(async (req, res) => {
  const { items, deliveryCharges = 0 } = req.body;
  const userId = req.user._id;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Items are required" });
  }

  // Calculate total amount
  let totalAmount = 0;
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || product.quantity < item.quantity) {
      return res.status(400).json({ message: `Product not available: ${item.product}` });
    }
    totalAmount += product.price * item.quantity;
  }

  // Add delivery charges to the total amount
  totalAmount += deliveryCharges;

  // Create the order with a 'Pending' status
  const newOrder = new Order({
    user: userId,
    items: items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
    })),
    totalAmount,
    deliveryCharges,
    status: "Pending", // Order status is pending until payment is confirmed
  });

  await newOrder.save();

  // Create tracking records for each seller
  for (const item of items) {
    await OrderTracking.create({
      orderId: newOrder._id,
      sellerId: item.seller, // Ensure `seller` is passed in `items`
      statusUpdates: [{ status: 'Pending', timestamp: new Date() }],
    });
  }

  res.status(201).json({ message: "Order created successfully", orderId: newOrder._id });
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
  updateOrderStatus,
};
