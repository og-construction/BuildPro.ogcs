const Wishlist = require('../models/Wishlist');

exports.addToWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  const wishlist = await Wishlist.findOneAndUpdate(
    { userId },
    { $addToSet: { items: { productId } } },
    { new: true, upsert: true }
  );
  res.json(wishlist);
};

exports.getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.params.userId }).populate('items.productId');
  res.json(wishlist);
};
