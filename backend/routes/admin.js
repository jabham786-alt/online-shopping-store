const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      totalProducts: await Product.countDocuments(),
      totalOrders: await Order.countDocuments(),
    };
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/orders', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
