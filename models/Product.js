// ✅ FILE: backend/models/Product.js (Updated with commissionRate)

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  description: String,
  storeName: { type: String, required: true },
  category: {
    type: String,
    enum: ['nasi', 'mie', 'minuman', 'camilan'],
    required: true
  },
  image: { type: String },
  commissionRate: { type: Number, default: 0.1 } // ✅ 10% default komisi marketplace
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);