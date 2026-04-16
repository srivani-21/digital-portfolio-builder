// models/Portfolio.js

const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // New fields
    username:   { type: String, unique: true, sparse: true, trim: true },
    profession: { type: String, default: 'other' },
    template:   { type: String, enum: ['modern','minimal','creative'], default: 'modern' },
    views:      { type: Number, default: 0 },

    // Basic info
    fullName: { type: String, required: true, trim: true },
    tagline:  { type: String, default: '' },
    about:    { type: String, default: '' },
    email:    { type: String, default: '' },
    phone:    { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github:   { type: String, default: '' },

    // Arrays
    skills:       [String],
    achievements: [String],

    // Text fields
    experience: { type: String, default: '' },
    projects:   { type: String, default: '' },

    // Admin approval
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected'],
      default: 'draft',
    },
    adminComment: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);