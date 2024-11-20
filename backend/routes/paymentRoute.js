const express = require("express");
const { initiatePayment, handlePaymentResponse } = require("../controller/paymentCtrl");
const router = express.Router();

router.post("/initiate", initiatePayment);
router.post("/response", handlePaymentResponse);

module.exports = router;
