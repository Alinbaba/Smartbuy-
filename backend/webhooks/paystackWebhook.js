const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');

router.post('/', async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET;
  const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');

  if(hash === req.headers['x-paystack-signature']){
    const event = req.body;
    if(event.event === 'charge.success'){
      const order = await Order.findById(event.data.metadata.orderId);
      if(order){
        order.paymentStatus = 'paid';
        await order.save();
        await Transaction.create({
          order: order._id,
          amount: event.data.amount / 100,
          paymentMethod: 'paystack',
          status: 'success'
        });
      }
    }
  }

  res.status(200).send('Webhook received');
});

module.exports = router;