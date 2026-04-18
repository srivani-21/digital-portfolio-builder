// routes/authRoutes.js

const express = require('express');
const router  = express.Router();

const { registerUser, loginUser, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login',    loginUser);

// Settings routes — protected
router.put('/update-profile',  protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;