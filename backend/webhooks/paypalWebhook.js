const express = require('express');
const router = express.Router();
const axios = require('axios');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');

router.post('/', async (req, res) => {
  const eventBody = req.body;
  const orderId = eventBody.resource.invoice_id;

  // Optional: verify webhook signature via PayPal API here

  if(eventBody.event_type === 'PAYMENT.SALE.COMPLETED') {
    const order = await Order.findById(orderId);
    if(order){
      order.paymentStatus = 'paid';
      await order.save();
      await Transaction.create({
        order: order._id,
        amount: eventBody.resource.amount.total,
        paymentMethod: 'paypal',
        status: 'success'
      });
    }
  }

  res.status(200).send('Webhook received');
});

module.exports = router;