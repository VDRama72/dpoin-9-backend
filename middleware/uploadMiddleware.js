// ✅ FILE: backend/middleware/uploadMiddleware.js (FIXED)

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Buat folder upload jika belum ada
const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Konfigurasi storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, fileName);
  }
});

// ✅ FIX: File filter tidak error saat file kosong
const fileFilter = (req, file, cb) => {
  if (!file) return cb(null, false); // Tidak ada file, tidak error

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Tipe file tidak didukung'), false);
  }
  cb(null, true);
};

// Inisialisasi upload
const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // Maksimum 1MB
  fileFilter
});

module.exports = upload;
