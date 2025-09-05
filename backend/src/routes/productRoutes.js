const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');

// @route   POST /api/products
// @desc    Create a new product
// @access  Private
router.post('/', protect, productController.createProduct);

// @route   GET /api/products
// @desc    Get all products with pagination
// @access  Public
router.get('/', productController.getProducts);

// @route   GET /api/products/:id
// @desc    Get a single product by ID
// @access  Public
router.get('/:id', productController.getProductById);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private
router.put('/:id', protect, productController.updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', protect, productController.deleteProduct);

module.exports = router; 