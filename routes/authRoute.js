// backend/routes/authRoute.js
const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

// ✅ Endpoint Login
router.post('/login', login);

// ✅ Endpoint Register
router.post('/register', register);

module.exports = router;
