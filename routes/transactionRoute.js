// backend/routes/transactionRoute.js

const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

router.get('/', async (req, res) => {
  try {
    const tx = await Transaction.find().sort({ createdAt: -1 });
    res.json(tx);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil transaksi', error: err });
  }
});

module.exports = router;
