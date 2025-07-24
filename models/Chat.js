// ✅ FILE: backend/models/Chat.js (Revisi untuk Konsistensi Field Chat)

const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  senderRole: { type: String, required: true, enum: ['customer', 'driver'] }, // ✅ Ubah 'sender' jadi 'senderRole'
  senderId: { type: mongoose.Schema.Types.ObjectId, refPath: 'senderModel' }, // ✅ Tambahkan jika Anda mengirim ID user/driver
  senderModel: { type: String, enum: ['User', 'Driver'], required: false }, // ✅ Tambahkan jika Anda mengirim ID user/driver
  senderName: { type: String }, // ✅ Tambahkan jika Anda mengirim nama user/driver
  text: { type: String, required: true },   // ✅ Ubah 'message' jadi 'text'
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);