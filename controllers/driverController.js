// ✅ FILE: backend/controllers/driverController.js

const Driver = require('../models/Driver'); // pastikan model Driver sudah ada

exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data driver', error });
  }
};

exports.updateDriverStatus = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!driver) return res.status(404).json({ message: 'Driver tidak ditemukan' });

    res.status(200).json({ message: 'Status driver diperbarui', driver });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui status driver', error });
  }
};
