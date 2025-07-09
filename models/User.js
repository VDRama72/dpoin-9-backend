// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['ceo', 'admin', 'keuangan', 'cs', 'driver', 'pembeli', 'penjual']
  },
  namaWarung: String,
  token: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  balance: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('User', userSchema);
