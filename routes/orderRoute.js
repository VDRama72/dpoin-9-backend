// ✅ FILE: backend/routes/orderRoute.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isDriver } = require('../middleware/authMiddleware');

// Rute untuk order umum
router.post('/', orderController.createOrder);
router.put('/:orderId', orderController.updateOrderStatus);
router.get('/', orderController.getAllOrders);
router.get('/guest/:phone', orderController.getOrdersByGuestPhone);
router.get('/driver/:driverId', orderController.getOrdersForDriver);
router.get('/:id', orderController.getOrderById);

// Rute khusus driver
router.post('/accept/:orderId', isDriver, orderController.acceptOrder);

// Perbaiki transaksi lama
router.post('/repair-transactions', orderController.repairTransactions);

module.exports = router;
