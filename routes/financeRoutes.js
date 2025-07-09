// ✅ FILE: backend/routes/financeRoutes.js

const express = require('express');
const router = express.Router();

const {
  getAllTransactions,
  getMyTransactions,
  getSummary,
  verifyTransaction
} = require('../controllers/financeController');

const { protect, isAdmin, isFinance } = require('../middleware/authMiddleware');

router.get('/', protect, isFinance, getAllTransactions);
router.get('/me', protect, getMyTransactions);
router.get('/summary', protect, isFinance, getSummary);
router.put('/:id/verify', protect, isFinance, verifyTransaction);

module.exports = router;
