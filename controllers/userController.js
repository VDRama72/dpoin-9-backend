// backend/controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ✅ GET semua pengguna
exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Gagal mengambil data pengguna", error: err.message });
  }
};

// ✅ GET satu user berdasarkan ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'Pengguna tidak ditemukan' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Gagal mengambil data pengguna', error: err.message });
  }
};

// ✅ CREATE pengguna baru
exports.createUser = async (req, res) => {
  const { name, email, password, role, namaWarung } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: 'Email sudah digunakan' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });

    if (role === 'penjual' && namaWarung) {
      newUser.namaWarung = namaWarung;
    }

    await newUser.save();

    res.status(201).json({
      msg: 'Pengguna berhasil ditambahkan',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        namaWarung: newUser.namaWarung || null
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Gagal menambah pengguna', error: err.message });
  }
};

// ✅ UPDATE pengguna
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, status, namaWarung } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: 'Pengguna tidak ditemukan' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof status !== 'undefined') user.status = status;

    if (role === 'penjual') {
      user.namaWarung = namaWarung || '';
    } else {
      user.namaWarung = undefined;
    }

    if (password && password.trim() !== '') {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({ msg: 'Pengguna berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ msg: 'Gagal memperbarui pengguna', error: err.message });
  }
};

// ✅ RESET password
exports.resetPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: 'Pengguna tidak ditemukan' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ msg: 'Password berhasil direset' });
  } catch (err) {
    res.status(500).json({ msg: 'Gagal mereset password', error: err.message });
  }
};

// ✅ DELETE pengguna
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: 'Pengguna tidak ditemukan' });
    res.json({ msg: 'Pengguna berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ msg: 'Gagal menghapus pengguna', error: err.message });
  }
};
