// backend/controllers/reportController.js

const { Parser } = require('json2csv');
const moment = require('moment');
const Transaction = require('../models/Transaction');

// Ambil ringkasan total transaksi per tanggal
exports.getTransactionSummary = async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          total_transaksi: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const data = summary.map(item => ({
      tanggal: item._id,
      total_transaksi: item.total_transaksi
    }));

    res.json(data);
  } catch (error) {
    console.error('Error getTransactionSummary:', error);
    res.status(500).json({ message: 'Gagal mengambil data ringkasan transaksi' });
  }
};

// Export laporan transaksi ke CSV
exports.exportTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({}, { createdAt: 1, amount: 1, _id: 0 });

    const data = transactions.map(t => ({
      tanggal: moment(t.createdAt).format('YYYY-MM-DD'),
      total_transaksi: t.amount
    }));

    const fields = ['tanggal', 'total_transaksi'];
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('laporan_transaksi.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exportTransactions:', error);
    res.status(500).json({ message: 'Gagal mengekspor laporan transaksi' });
  }
};
