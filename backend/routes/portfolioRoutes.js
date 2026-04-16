// routes/portfolioRoutes.js

const express = require('express');
const router  = express.Router();

const {
  createPortfolio,
  getMyPortfolios,
  updatePortfolio,
  submitForApproval,
  getApprovedPortfolios,
  viewByUsername,
  deletePortfolio,
} = require('../controllers/portfolioController');

const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/public',           getApprovedPortfolios);
router.get('/view/:username',   viewByUsername);

// Protected routes
router.post('/create',          protect, createPortfolio);
router.get('/my-portfolios',    protect, getMyPortfolios);
router.put('/update/:id',       protect, updatePortfolio);
router.put('/submit/:id',       protect, submitForApproval);
router.delete('/delete/:id',    protect, deletePortfolio);

module.exports = router;