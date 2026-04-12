// User.js - Defines what a "User" looks like in the database

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // This field is mandatory
      trim: true,     // Removes extra spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,   // No two users can have the same email
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'], // Only these two values are allowed
      default: 'user',         // New accounts are regular users by default
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('User', userSchema);