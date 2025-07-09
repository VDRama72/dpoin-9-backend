// ✅ FILE: backend/controllers/orderController.js

const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const { notifyDriver } = require('../utils/notifier');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil semua pesanan', error: err });
  }
};

exports.getOrdersByGuestPhone = async (req, res) => {
  try {
    const orders = await Order.find({ guestPhone: req.params.phone }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil pesanan tamu', error: err });
  }
};

exports.getOrdersForDriver = async (req, res) => {
  try {
    const orders = await Order.find({ driverId: req.params.driverId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil pesanan driver', error: err });
  }
};

exports.getAvailableOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      status: 'pending',
      driverId: null
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil order baru', error: err });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const {
      userId, guestName, guestPhone, guestAddress,
      items, totalAmount, pickupAddress, deliveryAddress, paymentMethod
    } = req.body;

    if (!items || !pickupAddress || !deliveryAddress) {
      return res.status(400).json({ message: 'Data order tidak lengkap' });
    }

    const order = new Order({
      userId, guestName, guestPhone, guestAddress, items, totalAmount,
      pickupAddress, deliveryAddress, paymentMethod: paymentMethod || 'cod',
      status: 'pending', createdAt: new Date(), driverId: null
    });

    await order.save();
    notifyDriver('all', order);
    res.status(201).json({ message: 'Order berhasil dibuat', order });
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat order', error });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order tidak ditemukan' });
    }

    if (['selesai', 'completed'].includes(status)) {
      const existing = await Transaction.findOne({ orderId: order._id });
      if (!existing) {
        await Transaction.create({
          orderId: order._id,
          userId: order.userId || null,
          guestName: order.guestName || null,
          amount: order.totalAmount,
          type: 'order',
          status: 'completed'
        });
      }
    }

    res.json({ message: 'Status order diperbarui', order });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui status', error });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('driverId', 'name phone').lean();
    if (!order) {
      return res.status(404).json({ message: 'Order tidak ditemukan' });
    }

    const driverInfo = order.driverId ? {
      name: order.driverId.name,
      phone: order.driverId.phone
    } : null;

    res.json({ ...order, driverInfo });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil order' });
  }
};

exports.acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const driverId = req.user.id;

    const order = await Order.findOneAndUpdate(
      { _id: orderId, status: 'pending' },
      { status: 'accepted', driverId },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order tidak ditemukan atau sudah diambil' });
    }

    res.json({ message: 'Order berhasil diambil oleh driver', order });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menerima order', error });
  }
};

exports.repairTransactions = async (req, res) => {
  try {
    const orders = await Order.find({ status: { $in: ['selesai', 'completed'] } });
    let count = 0;

    for (const order of orders) {
      const exists = await Transaction.findOne({ orderId: order._id });
      if (!exists) {
        await Transaction.create({
          orderId: order._id,
          userId: order.userId || null,
          guestName: order.guestName || null,
          amount: order.totalAmount,
          type: 'order',
          status: 'completed'
        });
        count++;
      }
    }

    res.json({ message: `✅ ${count} transaksi berhasil diperbaiki.` });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbaiki transaksi', error });
  }
};
