// backend/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  guestName: {
    type: String,
    default: null,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['topup', 'withdraw', 'order', 'payment'],
    default: 'order',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Transaction', transactionSchema);
