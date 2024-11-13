// controllers/paymentController.js
const stripe = require('stripe')('your-stripe-secret-key');

exports.createPayment = async (req, res) => {
  try {
    const { amount, currency, source } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: source,
      confirm: true,
    });
    res.status(200).json({ success: true, paymentIntent });
  } catch (error) {
    res.status(500).json({ message: 'Payment failed', error });
  }
};
