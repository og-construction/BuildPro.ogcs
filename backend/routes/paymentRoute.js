const express = require('express');
const { createPayment } = require('../controller/paymentCtrl');
const router = express.Router();


router.post('/create-payment',createPayment)


module.exports = router;