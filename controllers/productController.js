// ✅ FILE: backend/controllers/productController.js

const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

// ✅ GET semua produk
exports.getAllProducts = async (req, res) => {
  try {
    const { seller } = req.query;
    const filter = seller ? { sellerId: seller } : {};

    const products = await Product.find(filter)
      .populate('sellerId', 'name email namaWarung role status balance address nohp');

    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Gagal mengambil produk', error: err.message });
  }
};

// ✅ GET satu produk by ID (lebih tahan error)
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log('📦 Mencari produk dengan ID:', productId);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ msg: 'ID produk tidak valid' });
    }

    const product = await Product.findOne({ _id: productId })
      .populate('sellerId', 'name email namaWarung role status balance address nohp');

    if (!product) return res.status(404).json({ msg: 'Produk tidak ditemukan' });

    // Ubah sellerId menjadi user untuk konsistensi frontend
    const productWithUser = {
      ...product.toObject(),
      user: product.sellerId,
    };
    delete productWithUser.sellerId;

    res.json(productWithUser);
  } catch (err) {
    console.error('❌ Gagal ambil detail produk:', err.message);
    res.status(500).json({ msg: 'Gagal mengambil detail produk', error: err.message });
  }
};

// ✅ CREATE oleh admin
exports.createProductByAdmin = async (req, res) => {
  const { name, description, price, sellerId, stock = 0, category } = req.body;
  try {
    const seller = await User.findById(sellerId);
    if (!seller || seller.role !== 'penjual') {
      return res.status(400).json({ msg: 'Penjual tidak valid' });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      sellerId,
      storeName: seller.namaWarung || seller.name || 'Tanpa Nama',
      category,
      image: imagePath,
      commissionRate: 0.1,
    });

    await newProduct.save();
    res.status(201).json({ msg: 'Produk berhasil ditambahkan', product: newProduct });
  } catch (err) {
    res.status(500).json({ msg: 'Gagal menambahkan produk', error: err.message });
  }
};

// ✅ CREATE oleh seller
exports.createProductBySeller = async (req, res) => {
  const { name, description, price, stock = 0, category } = req.body;
  const sellerId = req.user.id || req.user._id;

  try {
    const seller = await User.findById(sellerId);
    if (!seller || seller.role !== 'penjual') {
      return res.status(403).json({ msg: 'Akun tidak memiliki izin sebagai penjual' });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      sellerId,
      storeName: seller.namaWarung || seller.name || 'Tanpa Nama',
      category,
      image: imagePath,
      commissionRate: 0.1,
    });

    await newProduct.save();
    res.status(201).json({ msg: 'Produk berhasil ditambahkan oleh seller', product: newProduct });
  } catch (err) {
    res.status(500).json({ msg: 'Gagal menambahkan produk', error: err.message });
  }
};

// ✅ GET produk milik seller
exports.getMyProducts = async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.user.id || req.user._id);
    const products = await Product.find({ sellerId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Gagal mengambil produk seller', error: err.message });
  }
};

// ✅ DELETE produk
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Produk tidak ditemukan' });
    res.json({ msg: 'Produk berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ msg: 'Gagal menghapus produk', error: err.message });
  }
};

// ✅ UPDATE produk oleh admin
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    const updated = await Product.findByIdAndUpdate(
      id,
      { name, description, price, stock, category },
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: 'Produk tidak ditemukan' });

    res.json({ msg: 'Produk berhasil diperbarui', product: updated });
  } catch (err) {
    res.status(500).json({ msg: 'Gagal memperbarui produk', error: err.message });
  }
};

// ✅ UPDATE produk oleh seller
exports.updateProductBySeller = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    const product = await Product.findById(id);

    if (!product || product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Akses ditolak' });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : product.image;

    product.name = name;
    product.description = description;
    product.price = price;
    product.stock = stock;
    product.category = category;
    product.image = imagePath;

    await product.save();

    res.json({ msg: 'Produk berhasil diperbarui oleh seller', product });
  } catch (err) {
    res.status(500).json({ msg: 'Gagal memperbarui produk oleh seller', error: err.message });
  }
};
