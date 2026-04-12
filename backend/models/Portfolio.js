// Portfolio.js - Defines what a "Portfolio" looks like in the database

const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    // Links this portfolio to a user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Basic info
    fullName: { type: String, required: true },
    tagline: { type: String }, // e.g., "Full Stack Developer | B.Tech Student"
    about: { type: String },
    email: { type: String },
    phone: { type: String },
    linkedin: { type: String },
    github: { type: String },

    // Arrays of professional details
    skills: [String],           // e.g., ["React", "Node.js", "MongoDB"]
    experience: [
      {
        company: String,
        role: String,
        duration: String,
        description: String,
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        techStack: [String],
        link: String,
      },
    ],
    achievements: [String],

    // Admin approval status
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected'],
      default: 'draft',
    },
    adminComment: {
      type: String,  // Admin can leave a reason if rejected
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);