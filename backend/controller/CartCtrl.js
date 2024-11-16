const Cart = require('../models/CartModel');
const validateMongodbId = require('../utils/validateMongodbId');

// Add items to cart
const addToCart = async (req, res) => {
  console.log("Request Body:", req.body); // Debug request body

  const { userId, items } = req.body;

  if (!userId || !items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Invalid input: userId and items are required' });
  }

  validateMongodbId(userId);

  try {
      const cart = await Cart.findOne({ userId });
      if (cart) {
          // Update existing cart
          items.forEach(({ productId, quantity }) => {
              const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
              if (itemIndex > -1) {
                  cart.items[itemIndex].quantity += quantity;
              } else {
                  cart.items.push({ productId, quantity });
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
      console.error('Error adding to cart:', error);
      res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};

// Get cart for a specific user
const getCart = async (req, res) => {
  const { userId } = req.params;
  validateMongodbId(userId);

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};
// Get all carts
const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate('items.productId');
    if (!carts || carts.length === 0) {
      return res.status(404).json({ message: 'No carts found' });
    }
    res.status(200).json(carts);
  } catch (error) {
    console.error('Error fetching all carts:', error);
    res.status(500).json({ message: 'Error fetching all carts', error: error.message });
  }
};
// Delete a user's cart
const deleteCart = async (req, res) => {
  const { userId } = req.params; // Extract userId from request params
  validateMongodbId(userId); // Validate MongoDB ID

  try {
    const cart = await Cart.findOneAndDelete({ userId }); // Delete cart for the user
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' }); // Handle cart not found
    }
    res.status(200).json({ message: 'Cart deleted successfully' }); // Success response
  } catch (error) {
    console.error('Error deleting cart:', error); // Log errors
    res.status(500).json({ message: 'Error deleting cart', error: error.message }); // Send error response
  }
};


module.exports = {addToCart,deleteCart,getCart,getAllCarts}