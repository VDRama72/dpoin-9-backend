// backend/seed/seedTransactions.js
require('dotenv').config();
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

const dummyTransactions = [
  { amount: 50000, type: 'order', status: 'completed', createdAt: new Date('2024-01-15') },
  { amount: 75000, type: 'topup', status: 'completed', createdAt: new Date('2024-02-10') },
  { amount: 30000, type: 'order', status: 'completed', createdAt: new Date('2024-02-28') },
  { amount: 20000, type: 'withdraw', status: 'pending', createdAt: new Date('2024-03-05') },
  { amount: 100000, type: 'topup', status: 'completed', createdAt: new Date('2024-03-21') },
  { amount: 40000, type: 'order', status: 'completed', createdAt: new Date('2024-04-03') },
  { amount: 90000, type: 'payment', status: 'completed', createdAt: new Date('2024-05-18') },
  { amount: 20000, type: 'withdraw', status: 'completed', createdAt: new Date('2024-05-27') },
  { amount: 55000, type: 'order', status: 'completed', createdAt: new Date('2024-06-10') }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Transaction.deleteMany();
    await Transaction.insertMany(dummyTransactions);
    console.log('✅ Dummy transaksi berhasil ditambahkan!');
    process.exit();
  } catch (error) {
    console.error('❌ Gagal menambahkan dummy transaksi:', error);
    process.exit(1);
  }
}

seed();
