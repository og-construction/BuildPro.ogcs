const express = require('express');
const { addToCart, getCart, deleteCart, getAllCarts } = require('../controller/CartCtrl');

const router = express.Router();


router.post('/add-to-cart', addToCart);
router.get('/get-cart/:userId', getCart)
router.delete('/delete/:userId', deleteCart); // Fix route to include ":userId"
router.get('/get-all-carts',getAllCarts)

module.exports = router;