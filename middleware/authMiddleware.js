// ✅ FILE: backend/middleware/authMiddleware.js

require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Fungsi middleware utama, bisa untuk semua role
function auth(allowedRoles = []) {
  return async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

    if (!token) {
      return res.status(401).json({ msg: "Token tidak ditemukan" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ msg: 'User tidak ditemukan' });
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ msg: "Akses ditolak (tidak punya izin)" });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ msg: "Token tidak valid", error: err.message });
    }
  };
}

// Shortcut middleware untuk role-role umum
const protect = auth(); // Untuk semua user login
const isAdmin = auth(['admin']);
const isDriver = auth(['driver']);
const isFinance = auth(['finance']);
const isSeller = auth(['seller']);
const isCs = auth(['cs']);
const isCeo = auth(['ceo']);

module.exports = {
  auth,
  protect,
  isAdmin,
  isDriver,
  isFinance,
  isSeller,
  isCs,
  isCeo
};
