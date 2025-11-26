const express = require('express');
const { login, register, getMe, updateProfile, changePassword } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', protect, authorize('admin'), register);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
