const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// @route   GET /api/users/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', protect, userController.getMe);

module.exports = router; 