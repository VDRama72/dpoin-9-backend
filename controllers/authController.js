// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// ✅ LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cek apakah user terdaftar
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Email tidak terdaftar" });
    }

    // Bandingkan password input dengan password hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Password salah" });
    }

    // Buat JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Simpan token di DB (opsional)
    user.token = token;
    await user.save();

    // Kirim token dan info user
    res.json({
      token,
      role: user.role,
      name: user.name,
      id: user._id
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ REGISTER
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email sudah digunakan' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      token: ''
    });

    await newUser.save();

    res.status(201).json({
      msg: 'User berhasil didaftarkan',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error('❌ Register error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
