const express = require('express');
const { createOrder,getUserOrders, getOrderById, updateOrderStatus } = require('../controller/OrderCtrl');
const router = express.Router();


router.post('/create-order', createOrder)
router.get('/get-user-order', getUserOrders);//get all orders for user
router.get('/:id', getOrderById)//get order by id
router.put('/:id/status', updateOrderStatus)//get order by id




module.exports = router;