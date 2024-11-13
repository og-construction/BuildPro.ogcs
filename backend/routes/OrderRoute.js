const express = require('express');
const { createOrder, getOrder, getUserOrders } = require('../controller/OrderCtrl');
const router = express.Router();


router.post('/create-order', createOrder)
router.get('/get-order', getOrder);
router.get('/user/:Id', getUserOrders)



module.exports = router;