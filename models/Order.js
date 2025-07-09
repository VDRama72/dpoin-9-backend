// ✅ File: backend/models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  guestName: { type: String, default: null },
  guestPhone: { type: String, default: null },
  guestAddress: { type: String, default: null },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: String,
      qty: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  status: { type: String, default: 'pending' }, // pending, assigned, on_delivery, completed
  pickupAddress: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
