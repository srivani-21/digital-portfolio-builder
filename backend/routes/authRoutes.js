// authRoutes.js
// This file maps URLs → controller functions
// Think of it as a "traffic director"

const express = require('express');
const router = express.Router();

// Import the controller functions
const { registerUser, loginUser } = require('../controllers/authController');

// When someone sends POST to /api/auth/register → run registerUser()
router.post('/register', registerUser);

// When someone sends POST to /api/auth/login → run loginUser()
router.post('/login', loginUser);

module.exports = router;