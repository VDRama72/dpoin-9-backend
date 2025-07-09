// backend/routes/reportRoute.js

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Route ambil data ringkasan grafik transaksi
router.get('/transactions/summary', reportController.getTransactionSummary);

// Route export laporan transaksi ke CSV
router.get('/transactions/export', reportController.exportTransactions);

module.exports = router;
