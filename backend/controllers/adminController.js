const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getDashboard = async (req, res) => {
  const usersCount = await User.countDocuments();
  const productsCount = await Product.countDocuments();
  const ordersCount = await Order.countDocuments();
  res.json({ usersCount, productsCount, ordersCount });
}

// Manage sub-admins
exports.createSubAdmin = async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password, role: 'sub-admin' });
  res.status(201).json(user);
}