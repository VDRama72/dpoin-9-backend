// backend/routes/userRoute.js

const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,        // ✅ Tambahan
  createUser,
  updateUser,
  deleteUser,
  resetPassword
} = require('../controllers/userController');

router.get('/', getAllUsers);
router.get('/:id', getUserById);     // ✅ Tambahan
router.post('/', createUser);
router.put('/:id', updateUser);
router.put('/:id/reset-password', resetPassword);
router.delete('/:id', deleteUser);

module.exports = router;
