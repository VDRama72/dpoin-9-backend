// ✅ FILE: backend/server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const { initSocketIO } = require('./utils/notifier');
const { MONGO_URI } = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

initSocketIO(io);

// 🔧 Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔗 Routes
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/users', require('./routes/userRoute'));
app.use('/api/reports', require('./routes/reportRoute'));
app.use('/api/products', require('./routes/productRoute'));
app.use('/api/orders', require('./routes/orderRoute'));
app.use('/api/driver', require('./routes/driverRoute'));
app.use('/api/chats', require('./routes/chatRoute'));
app.use('/api/transactions', require('./routes/transactionRoute'));
app.use('/api/finance', require('./routes/financeRoutes'));

// ✅ Tambahan: Route untuk Statistik Seller
app.use('/api/seller/stats', require('./routes/sellerStatsRoute'));

// 🔘 Root Endpoint
app.get('/', (req, res) => {
  res.send("✅ D'PoIN Backend API is Running...");
});

// 🚀 Connect ke MongoDB lalu Jalankan Server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    server.listen(process.env.PORT || 4000, () => {
      console.log(`🚀 Server running at: http://localhost:${process.env.PORT || 4000}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
