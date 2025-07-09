// backend/controllers/sellerStatsController.js

const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getTotalProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments({ sellerId: req.user.id });
    res.json({ count });
  } catch (error) {
    console.error('Error getTotalProducts:', error);
    res.status(500).json({ error: 'Gagal mengambil total produk' });
  }
};

exports.getTodayOrders = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const count = await Order.countDocuments({
      sellerId: req.user.id,
      createdAt: { $gte: start, $lte: end },
    });

    res.json({ count });
  } catch (error) {
    console.error('Error getTodayOrders:', error);
    res.status(500).json({ error: 'Gagal mengambil pesanan hari ini' });
  }
};

exports.getMonthlyEarnings = async (req, res) => {
  try {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const orders = await Order.find({
      sellerId: req.user.id,
      status: 'selesai', // pastikan status valid
      createdAt: { $gte: firstDay, $lte: lastDay },
    });

    const total = orders.reduce((sum, order) => sum + order.totalHarga, 0);
    res.json({ total });
  } catch (error) {
    console.error('Error getMonthlyEarnings:', error);
    res.status(500).json({ error: 'Gagal mengambil pendapatan bulan ini' });
  }
};
