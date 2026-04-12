// adminRoutes.js
// Both 'protect' AND 'isAdmin' run before every admin route
// protect  → checks if logged in
// isAdmin  → checks if role === 'admin'

const express = require('express');
const router = express.Router();

const {
  getAllPending,
  getAllPortfolios,
  approvePortfolio,
  rejectPortfolio,
} = require('../controllers/adminController');

const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

// GET  /api/admin/pending      → all pending portfolios
// GET  /api/admin/all          → all portfolios
// PUT  /api/admin/approve/:id  → approve one portfolio
// PUT  /api/admin/reject/:id   → reject one portfolio

router.get('/pending', protect, isAdmin, getAllPending);
router.get('/all', protect, isAdmin, getAllPortfolios);
router.put('/approve/:id', protect, isAdmin, approvePortfolio);
router.put('/reject/:id', protect, isAdmin, rejectPortfolio);

module.exports = router;