// controllers/transactionController.js

const Transaction = require('../models/Transaction');

exports.getAllTransactions = async (req, res) => {
  try {
    const txs = await Transaction.find().sort({ createdAt: -1 });
    res.json(txs);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil transaksi', error: err });
  }
};
