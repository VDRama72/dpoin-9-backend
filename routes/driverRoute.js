// ✅ FILE: backend/routes/driverRoute.js

const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { protect, isAdmin, isDriver } = require('../middleware/authMiddleware');

// Hanya admin yang bisa melihat semua data driver
router.get('/', protect, isAdmin, driverController.getAllDrivers);

// Driver bisa update statusnya sendiri
router.put('/:id', protect, isDriver, driverController.updateDriverStatus);

module.exports = router;
