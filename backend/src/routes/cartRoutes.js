const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', protect, cartController.addToCart);

// @route   GET /api/cart
// @desc    Get user's cart items
// @access  Private
router.get('/', protect, cartController.getCartItems);

// @route   PUT /api/cart/:productId
// @desc    Update cart item quantity
// @access  Private
router.put('/:productId', protect, cartController.updateCartItem);

// @route   DELETE /api/cart/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/:productId', protect, cartController.removeFromCart);

// @route   DELETE /api/cart
// @desc    Clear all items from cart
// @access  Private
router.delete('/', protect, cartController.clearCart);

module.exports = router; 