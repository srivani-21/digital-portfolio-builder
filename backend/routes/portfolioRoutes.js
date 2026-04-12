const express = require('express');
const router = express.Router();
const {
  createPortfolio,
  getMyPortfolios,    // ← changed (plural)
  updatePortfolio,
  submitForApproval,
  getApprovedPortfolios,
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

router.get('/public', getApprovedPortfolios);
router.post('/create', protect, createPortfolio);
router.get('/my-portfolios', protect, getMyPortfolios);     // ← new route
router.put('/update/:id', protect, updatePortfolio);        // ← now uses :id
router.put('/submit/:id', protect, submitForApproval);      // ← now uses :id

module.exports = router;