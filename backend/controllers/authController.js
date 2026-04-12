// authController.js
// This file handles WHAT HAPPENS when someone hits /api/auth/register or /api/auth/login

const User = require('../models/User');       // Import User model (talks to MongoDB)
const bcrypt = require('bcryptjs');           // For hashing passwords
const jwt = require('jsonwebtoken');          // For creating login tokens

// ─────────────────────────────────────────────────────────────
// FUNCTION 1: registerUser
// Called when: POST /api/auth/register
// Job: Create a new user account
// ─────────────────────────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // If trying to register as admin, verify secret key
    if (role === 'admin') {
      const { adminKey } = req.body;
      if (adminKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json({ message: 'Invalid admin secret key' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'user', // only allow if key matched
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// ─────────────────────────────────────────────────────────────
// FUNCTION 2: loginUser
// Called when: POST /api/auth/login
// Job: Verify credentials and return a JWT token
// ─────────────────────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    // Step 1: Get email and password from request
    const { email, password } = req.body;

    // Step 2: Find user in DB by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Step 3: Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Step 4: Create a JWT token
    // This token proves "this person is logged in" — sent with every future request
    const token = jwt.sign(
      { id: user._id, role: user.role },  // Payload (data inside the token)
      process.env.JWT_SECRET,             // Secret key from .env
      { expiresIn: '7d' }                 // Token expires in 7 days
    );

    // Step 5: Send token back to client
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export so routes can use these functions
module.exports = { registerUser, loginUser };