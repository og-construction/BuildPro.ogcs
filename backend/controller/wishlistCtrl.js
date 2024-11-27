const Wishlist = require('../models/Wishlist');
const { validateMongodbId } = require('./CategoryCtrl');

// Add to Wishlist
const addToWishlist = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // Validate MongoDB ID if necessary
    validateMongodbId(userId);

    // Check if the product is already in the wishlist
    const wishlist = await Wishlist.findOne({ userId });

    if (wishlist && wishlist.items.some((item) => item.productId.toString() === productId)) {
      return res.status(400).json({ message: "Product is already in the wishlist." });
    }

    // Add the product to the wishlist if not already present
    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $addToSet: { items: { productId } } }, // $addToSet ensures no duplicates
      { new: true, upsert: true }
    ).populate('items.productId');

    res.status(200).json(updatedWishlist);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Error adding to wishlist", error });
  }
};


// Get a user's Wishlist
const getWishlist = async (req, res) => {
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
// In your backend controller (e.g., `wishlistCtrl.js`)
const deleteWishlist = async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body; // Ensure this is being passed in the request body

  validateMongodbId(userId);

  try {
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    // Remove the product from the wishlist
    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } }, // This removes the product with the given productId
      { new: true }
    ).populate('items.productId');

    if (!updatedWishlist) {
      return res.status(404).json({ message: 'Failed to remove item from wishlist' });
    }

    res.status(200).json(updatedWishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item from wishlist', error });
  }
};


 // Remove from Wishlist
const removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  validateMongodbId(userId);

  try {
    // Remove product from the wishlist items array
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    ).populate('items.productId');

    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist', error });
  }
};

module.exports = { addToWishlist, getWishlist, deleteWishlist, removeFromWishlist };
