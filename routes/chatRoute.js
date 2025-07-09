// backend/routes/chatRoute.js

const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

router.get('/:orderId', async (req, res) => {
  try {
    const chats = await Chat.find({ orderId: req.params.orderId }).sort({ timestamp: 1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: 'Gagal ambil chat', error: err });
  }
});

module.exports = router;
