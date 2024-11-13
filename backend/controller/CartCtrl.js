// controllers/cartController.js
const Cart = require('../models/CartModel');

exports.addToCart = async (req, res) => {
  const { userId, items } = req.body; // Use items from the request body
  try {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      // Update existing cart
      items.forEach(({ productId, quantity }) => {
        const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += quantity; // Update existing item quantity
        } else {
          cart.items.push({ productId, quantity }); // Add new item to cart
        }
      });
      await cart.save();
    } else {
      // Create new cart
      const newCart = new Cart({ userId, items });
      await newCart.save();
    }
    res.status(200).json({ message: 'Item(s) added to cart' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error });
  }
};

// Get cart for a specific user
exports.getCart = async (req, res) => {
  const { userId } = req.params; // Get userId from request parameters
  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId'); // Populate productId to get full product details
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
};
