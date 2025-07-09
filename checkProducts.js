// backend/checkProducts.js

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product'); // pastikan path-nya benar

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const products = await Product.find({});
    console.log('📦 Daftar Produk:', products);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Gagal konek MongoDB:', err.message);
  });
