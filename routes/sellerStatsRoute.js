// backend/routes/sellerStatsRoute.js

const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const {
  getTotalProducts,
  getTodayOrders,
  getMonthlyEarnings,
} = require('../controllers/sellerStatsController');

router.get('/products/count', auth(['penjual']), getTotalProducts);
router.get('/orders/today', auth(['penjual']), getTodayOrders);
router.get('/earnings/monthly', auth(['penjual']), getMonthlyEarnings);

module.exports = router;
