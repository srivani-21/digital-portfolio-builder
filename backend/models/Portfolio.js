const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    // ── Owner ──────────────────────────────────────────────────────
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },

    // ── Portfolio identity ─────────────────────────────────────────
    username:   { type: String, unique: true, sparse: true, trim: true },
    profession: {
      type:    String,
      enum:    ['developer', 'designer', 'teacher', 'marketer', 'other'],
      default: 'other',
    },
    template: {
      type:    String,
      enum:    ['modern', 'minimal', 'creative'],
      default: 'modern',
    },

    // ── Basic info ─────────────────────────────────────────────────
    fullName: { type: String, required: true, trim: true },
    tagline:  { type: String, default: '' },
    about:    { type: String, default: '' },
    email:    { type: String, default: '' },
    phone:    { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github:   { type: String, default: '' },

    // ── Common arrays ──────────────────────────────────────────────
    skills:       { type: [String], default: [] },
    achievements: { type: [String], default: [] },

    // ── Developer fields ───────────────────────────────────────────
    projects:   { type: String, default: '' },
    experience: { type: String, default: '' },

    // ── Designer fields ────────────────────────────────────────────
    tools:          { type: [String], default: [] },
    portfolio_url:  { type: String,   default: '' },
    specialization: { type: String,   default: '' },

    // ── Teacher fields ─────────────────────────────────────────────
    subjects:     { type: [String], default: [] },
    institution:  { type: String,   default: '' },
    teachingLevel:{ type: String,   default: '' },

    // ── Marketer fields ────────────────────────────────────────────
    campaigns: { type: String, default: '' },

    // ── Analytics ──────────────────────────────────────────────────
    views: { type: Number, default: 0 },

    // ── Admin approval ─────────────────────────────────────────────
    status: {
      type:    String,
      enum:    ['draft', 'pending', 'approved', 'rejected'],
      default: 'draft',
    },
    adminComment: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);