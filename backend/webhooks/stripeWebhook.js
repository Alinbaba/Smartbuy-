const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch(err) {
    console.log('Stripe webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if(event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    // Update order and create transaction
    const order = await Order.findById(paymentIntent.metadata.orderId);
    if(order){
      order.paymentStatus = 'paid';
      await order.save();
      await Transaction.create({
        order: order._id,
        amount: paymentIntent.amount_received / 100,
        paymentMethod: 'stripe',
        status: 'success'
      });
    }
  }

  res.json({ received: true });
});

module.exports = router;