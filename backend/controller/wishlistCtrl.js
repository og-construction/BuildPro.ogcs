const Wishlist = require('../models/Wishlist');
const { validateMongodbId } = require('./CategoryCtrl');

// Add to Wishlist
exports.addToWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  validateMongodbId(userId);

  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $addToSet: { items: { productId } } },
      { new: true, upsert: true }
    ).populate('items.productId');
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error });
  }
};

// Get a user's Wishlist
exports.getWishlist = async (req, res) => {
  const { userId } = req.params;
  validateMongodbId(userId);

  try {
    const wishlist = await Wishlist.findOne({ userId }).populate('items.productId');
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error });
  }
};

// Delete a user's Wishlist
exports.deleteWishlist = async (req, res) => {
  const { userId } = req.params;
  validateMongodbId(userId);

  try {
    const wishlist = await Wishlist.findOneAndDelete({ userId });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    res.status(200).json({ message: 'Wishlist deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting wishlist', error });
  }
};
