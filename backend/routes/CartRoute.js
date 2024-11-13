const express = require('express');
const { addToCart, getCart } = require('../controller/CartCtrl');

const router = express.Router();


router.post('/add-to-cart', addToCart);
router.get('/get-cart/:id', getCart)


module.exports = router;