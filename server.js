// ✅ FILE: backend/server.js (Revisi untuk Izinkan Banyak Origin CORS)

require('dotenv').config(); // Pastikan dotenv dimuat di awal
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// 🧠 Custom Utilities & Config
const { initSocketIO, getIo } = require('./utils/notifier'); 
const { MONGO_URI } = require('./config/db'); 

// ✅ Tentukan URL Frontend dari Environment Variables atau Hardcode untuk Testing
// Di lingkungan produksi Render, Anda HARUS menset environment variable FRONTEND_URL
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'; // Default untuk lokal

// ⚙️ Init Express & HTTP Server
const app = express();
const server = http.createServer(app);

// ✅ KOREKSI DI SINI: Gunakan ARRAY untuk origin CORS Express
app.use(cors({
    origin: [
        'http://localhost:5173', // Untuk pengembangan lokal
        'http://192.168.58.216:5173', // Jika Anda juga menguji via IP lokal di HP
        'https://my-admin-panel-brown.vercel.app', // ✅ Untuk deployment Vercel Anda
        FRONTEND_URL // Gunakan environment variable jika diset di Render/Vercel
    ], 
    credentials: true // Penting jika Anda menggunakan cookie/sesi
}));

// Inisialisasi Socket.IO Server
const io = new Server(server, {
  cors: {
    origin: [
        'http://localhost:5173', // Untuk pengembangan lokal
        'http://192.168.58.216:5173', // Jika Anda juga menguji via IP lokal di HP
        'https://my-admin-panel-brown.vercel.app', // ✅ Untuk deployment Vercel Anda
        FRONTEND_URL // Gunakan environment variable jika diset di Render/Vercel
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// 🧩 Inisialisasi Socket.IO: Pasang listener utama
initSocketIO(io); 

// 🔧 Middlewares
app.use(express.json()); // Ini harus setelah cors() jika Anda menggunakan body parser
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
app.use('/api/seller/stats', require('./routes/sellerStatsRoute'));

// 🏠 Root Endpoint
app.get('/', (req, res) => {
  res.send("✅ D'PoIN Backend API is Running...");
});

// 🚀 Connect MongoDB and Start Server
// Pastikan process.env.MONGO_URI sudah diset di Render/Vercel
mongoose.connect(process.env.MONGO_URI || MONGO_URI) 
  .then(() => {
    console.log('✅ Connected to MongoDB');
    // PORT juga diambil dari environment variable di Render
    const PORT = process.env.PORT || 4000; 
    server.listen(PORT, () => {
      console.log(`🚀 Server running at: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });