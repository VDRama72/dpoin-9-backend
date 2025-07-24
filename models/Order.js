// ✅ FILE: backend/models/Order.js (Perubahan MINIMALIS)

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  guestName: { type: String, default: null },
  guestPhone: { type: String, default: null },
  guestAddress: { type: String, default: null },
  items: [ // ✅ STRUKTUR INI TETAP SAMA DENGAN PUNYA ANDA
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: String,
      qty: Number,
      price: Number
    }
  ],
  totalAmount: Number, // Ini adalah total harga produk saja
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'on_delivery', 'delivered', 'paid_by_customer', 'completed', 'cancelled', 'returned'], // ✅ Tambahkan status baru
    default: 'pending' 
  }, 
  pickupAddress: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  
  // ✅ FIELD BARU YANG DITAMBAHKAN (ADDITIVE ONLY)
  driverName: { type: String }, // ✅ Tambahkan ini
  driverPhone: { type: String }, // ✅ Tambahkan ini (opsional, jika Anda ingin menyimpan nomor telepon driver)
  paymentMethod: { // ✅ Tambahkan ini
    type: String, 
    enum: ['cod', 'non-cash', 'paid_by_customer', 'completed_with_cash', 'completed_with_non_cash'], 
    default: 'cod' 
  },
  shippingCost: { type: Number, default: 0 }, // ✅ Tambahkan ini
  grandTotal: { type: Number }, // ✅ Tambahkan ini (akan dihitung di frontend/backend)

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);