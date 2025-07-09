// ✅ File: backend/middleware/protectDriver.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protectDriver = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'driver') {
      return res.status(403).json({ message: 'Akses ditolak, bukan driver' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token tidak valid', error: err });
  }
};

module.exports = protectDriver;
