const Portfolio = require('../models/Portfolio');

// CREATE — now allows multiple portfolios per user
const createPortfolio = async (req, res) => {
  try {
    const { fullName, tagline, about, email, phone,
            linkedin, github, skills, experience,
            projects, achievements } = req.body;

    if (!fullName) return res.status(400).json({ message: 'Full name is required' });

    // ✅ No duplicate check — multiple portfolios allowed
    const portfolio = await Portfolio.create({
      user: req.user.id,
      fullName, tagline, about, email, phone,
      linkedin, github, skills, experience,
      projects, achievements,
      status: 'draft',
    });

    res.status(201).json({ message: 'Portfolio created', portfolio });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET ALL — returns all portfolios for logged-in user
const getMyPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ user: req.user.id })
      .sort({ createdAt: -1 }); // newest first
    res.status(200).json({ portfolios });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE — now uses portfolio ID in URL
const updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user.id,   // ensures user can only edit their own
    });

    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    if (portfolio.status === 'pending' || portfolio.status === 'approved') {
      return res.status(400).json({ message: `Cannot edit a ${portfolio.status} portfolio` });
    }

    const fields = ['fullName','tagline','about','email','phone',
                    'linkedin','github','skills','experience','projects','achievements'];
    fields.forEach(f => { if (req.body[f] !== undefined) portfolio[f] = req.body[f]; });

    await portfolio.save();
    res.status(200).json({ message: 'Portfolio updated', portfolio });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// SUBMIT — now uses portfolio ID in URL
const submitForApproval = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    if (portfolio.status === 'pending') return res.status(400).json({ message: 'Already pending review' });
    if (portfolio.status === 'approved') return res.status(400).json({ message: 'Already approved' });

    portfolio.status = 'pending';
    portfolio.adminComment = '';
    await portfolio.save();

    res.status(200).json({ message: 'Submitted for approval', status: portfolio.status });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUBLIC — unchanged
const getApprovedPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ status: 'approved' })
      .populate('user', 'name email');
    res.status(200).json({ count: portfolios.length, portfolios });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createPortfolio,
  getMyPortfolios,
  updatePortfolio,
  submitForApproval,
  getApprovedPortfolios,
};