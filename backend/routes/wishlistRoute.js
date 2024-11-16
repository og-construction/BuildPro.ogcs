const express = require('express');
const { addToWishlist, getWishlist, deleteWishlist } = require('../controller/wishlistCtrl');

const router = express.Router();

router.post('/add',addToWishlist);
router.get('/get-wishlist/:userId',getWishlist);
router.delete('/delete/:userId',deleteWishlist)

module.exports = router;