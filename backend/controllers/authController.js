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



// ─────────────────────────────────────────────────────────────
// FUNCTION 3: updateProfile
// Called when: PUT /api/auth/update-profile
// Job: Update user's name and email
// ─────────────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Check if new email is taken by another user
    const existing = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use by another account' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }   // returns updated user
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      message: 'Profile updated successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// FUNCTION 4: changePassword
// Called when: PUT /api/auth/change-password
// Job: Verify current password then set new password
// ─────────────────────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    // Get user WITH password (normally excluded)
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password and save
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export so routes can use these functions
module.exports = {
  registerUser,
  loginUser,
  updateProfile,
  changePassword,
};