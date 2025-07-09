// ✅ FILE: backend/routes/productRoute.js (Fixed for seller update)

const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  createProductByAdmin,
  createProductBySeller,
  getMyProducts,
  deleteProduct,
  updateProductBySeller,
  updateProduct
} = require('../controllers/productController');
const { auth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllProducts);
router.post('/', auth(['admin']), upload.single('image'), createProductByAdmin);
router.put('/:id', auth(['admin']), upload.single('image'), updateProduct);
router.delete('/:id', auth(['admin']), deleteProduct);

router.get('/my-products', auth(['penjual']), getMyProducts);
router.post('/my-products', auth(['penjual']), upload.single('image'), createProductBySeller);
router.put('/my-products/:id', auth(['penjual']), upload.single('image'), updateProductBySeller);

module.exports = router;
