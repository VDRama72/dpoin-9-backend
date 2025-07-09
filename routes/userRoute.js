// backend/routes/userRoute.js
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPassword
} = require('../controllers/userController');

// ✅ Sudah diprefix /api/users di server.js, jadi path cukup '/'
router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.put('/:id/reset-password', resetPassword);
router.delete('/:id', deleteUser);

module.exports = router;
