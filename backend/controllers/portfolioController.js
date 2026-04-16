// controllers/portfolioController.js

const Portfolio = require('../models/Portfolio');

const createPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      fullName, tagline, about, email, phone,
      linkedin, github, skills, experience,
      projects, achievements, username,
      profession, template
    } = req.body;

    if (!fullName) {
      return res.status(400).json({ message: 'Full name is required' });
    }

    // Check if username already taken (only if username provided)
    if (username) {
      const existingUsername = await Portfolio.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken. Choose another.' });
      }
    }

    const portfolio = await Portfolio.create({
      user:       userId,
      fullName,
      tagline:    tagline    || '',
      about:      about      || '',
      email:      email      || '',
      phone:      phone      || '',
      linkedin:   linkedin   || '',
      github:     github     || '',
      skills:     Array.isArray(skills) ? skills : [],
      achievements: Array.isArray(achievements) ? achievements : [],
      experience: experience || '',
      projects:   projects   || '',
      username:   username   || undefined,
      profession: profession || 'other',
      template:   template   || 'modern',
      views:      0,
      status:     'draft',
    });

    res.status(201).json({
      message: 'Portfolio created successfully',
      portfolio,
    });

  } catch (error) {
    console.error('Create portfolio error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.status(200).json({ portfolios });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    if (portfolio.status === 'pending' || portfolio.status === 'approved') {
      return res.status(400).json({
        message: `Cannot edit a ${portfolio.status} portfolio`,
      });
    }

    const fields = [
      'fullName', 'tagline', 'about', 'email', 'phone',
      'linkedin', 'github', 'skills', 'achievements',
      'experience', 'projects', 'profession', 'template',
    ];
    fields.forEach(f => {
      if (req.body[f] !== undefined) portfolio[f] = req.body[f];
    });

    await portfolio.save();
    res.status(200).json({ message: 'Portfolio updated', portfolio });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const submitForApproval = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    if (portfolio.status === 'pending')  return res.status(400).json({ message: 'Already pending review' });
    if (portfolio.status === 'approved') return res.status(400).json({ message: 'Already approved' });

    portfolio.status = 'pending';
    portfolio.adminComment = '';
    await portfolio.save();

    res.status(200).json({ message: 'Submitted for approval', status: portfolio.status });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getApprovedPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ status: 'approved' })
      .populate('user', 'name email');
    res.status(200).json({ count: portfolios.length, portfolios });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const viewByUsername = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      username: req.params.username,
      status: 'approved',
    }).populate('user', 'name email');

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    portfolio.views = (portfolio.views || 0) + 1;
    await portfolio.save();

    res.status(200).json({ portfolio });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.status(200).json({ message: 'Portfolio deleted' });
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
  viewByUsername,
  deletePortfolio,
};