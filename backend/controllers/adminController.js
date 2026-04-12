// adminController.js
// Only admins can access these functions
// Handles: view all pending, approve, reject portfolios

const Portfolio = require('../models/Portfolio');

// ─────────────────────────────────────────────────────────────
// FUNCTION 1: getAllPending
// Called when: GET /api/admin/pending
// Who can call: Admin only
// Job: Get all portfolios waiting for review
// ─────────────────────────────────────────────────────────────
const getAllPending = async (req, res) => {
  try {
    // Find portfolios with status = 'pending'
    // .populate() joins User data so admin can see who submitted
    const portfolios = await Portfolio.find({ status: 'pending' })
      .populate('user', 'name email');

    res.status(200).json({ count: portfolios.length, portfolios });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// FUNCTION 2: getAllPortfolios
// Called when: GET /api/admin/all
// Who can call: Admin only
// Job: Get ALL portfolios regardless of status (full dashboard view)
// ─────────────────────────────────────────────────────────────
const getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({ count: portfolios.length, portfolios });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// FUNCTION 3: approvePortfolio
// Called when: PUT /api/admin/approve/:id
// Who can call: Admin only
// Job: Approve a portfolio → makes it publicly visible
// ─────────────────────────────────────────────────────────────
const approvePortfolio = async (req, res) => {
  try {
    // :id in the URL = the portfolio's MongoDB _id
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    if (portfolio.status === 'approved') {
      return res.status(400).json({ message: 'Portfolio is already approved' });
    }

    // Update status to approved
    portfolio.status = 'approved';
    portfolio.adminComment = '';
    await portfolio.save();

    res.status(200).json({
      message: 'Portfolio approved successfully',
      portfolioId: portfolio._id,
      status: portfolio.status,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// FUNCTION 4: rejectPortfolio
// Called when: PUT /api/admin/reject/:id
// Who can call: Admin only
// Job: Reject a portfolio with a reason
// ─────────────────────────────────────────────────────────────
const rejectPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Admin must provide a reason for rejection
    const { comment } = req.body;
    if (!comment) {
      return res.status(400).json({ message: 'Please provide a rejection reason' });
    }

    // Update status to rejected + save admin's comment
    portfolio.status = 'rejected';
    portfolio.adminComment = comment;
    await portfolio.save();

    res.status(200).json({
      message: 'Portfolio rejected',
      portfolioId: portfolio._id,
      status: portfolio.status,
      adminComment: portfolio.adminComment,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllPending,
  getAllPortfolios,
  approvePortfolio,
  rejectPortfolio,
};