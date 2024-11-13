// controllers/orderController.js
const Order = require('../models/OrderModel');

exports.createOrder = async (req, res) => {
    try {
      const { userId, products, totalAmount } = req.body;
      const newOrder = new Order({ userId, products, totalAmount });
      await newOrder.save();
      res.status(201).json(newOrder);
    } catch (error) {
      res.status(500).json({ message: 'Error creating order', error });
    }
  };
  
  exports.getOrder = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate('products.productId');
      if (!order) return res.status(404).json({ message: 'Order not found' });
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching order', error });
    }
  };
  
  exports.getUserOrders = async (req, res) => {
    try {
      const orders = await Order.find({ userId: req.params.userId });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user orders', error });
    }
  };

  exports.updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { orderStatus: status }, { new: true });
    res.json(order);
  };
  