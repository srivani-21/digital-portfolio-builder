const Portfolio = require('../models/Portfolio');

// ── createPortfolio ───────────────────────────────────────────────
// POST /api/portfolio/create
// Creates a new portfolio — multiple allowed per user
const createPortfolio = async (req, res) => {
  try {
    const {
      // Basic
      fullName, tagline, about, email, phone, linkedin,
      // Identity
      username, profession, template,
      // Developer
      github, projects, experience, skills, achievements,
      // Designer
      tools, portfolio_url, specialization,
      // Teacher
      subjects, institution, teachingLevel,
      // Marketer
      campaigns,
    } = req.body;

    // fullName is required
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ message: 'Full name is required' });
    }

    // If username provided, check it is not taken
    if (username && username.trim()) {
      const existingUsername = await Portfolio.findOne({
        username: username.trim(),
      });
      if (existingUsername) {
        return res.status(400).json({
          message: 'Username already taken. Please choose a different one.',
        });
      }
    }

    // Helper: ensure field is array
    const toArray = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val.filter(Boolean);
      return val.split(',').map(s => s.trim()).filter(Boolean);
    };

    const portfolio = await Portfolio.create({
      user: req.user.id, // from JWT middleware

      // Identity
      username:   username?.trim() || undefined,
      profession: profession || 'other',
      template:   template   || 'modern',

      // Basic
      fullName: fullName.trim(),
      tagline:  tagline   || '',
      about:    about     || '',
      email:    email     || '',
      phone:    phone     || '',
      linkedin: linkedin  || '',

      // Arrays
      skills:       toArray(skills),
      achievements: toArray(achievements),

      // Developer
      github:     github     || '',
      projects:   projects   || '',
      experience: experience || '',

      // Designer
      tools:          toArray(tools),
      portfolio_url:  portfolio_url  || '',
      specialization: specialization || '',

      // Teacher
      subjects:      toArray(subjects),
      institution:   institution   || '',
      teachingLevel: teachingLevel || '',

      // Marketer
      campaigns: campaigns || '',

      // Defaults
      views:  0,
      status: 'draft',
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

// ── getMyPortfolios ───────────────────────────────────────────────
// GET /api/portfolio/my-portfolios
// Returns all portfolios for the logged-in user
const getMyPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ user: req.user.id })
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({ portfolios });

  } catch (error) {
    console.error('Get portfolios error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── updatePortfolio ───────────────────────────────────────────────
// PUT /api/portfolio/update/:id
// Updates an existing portfolio (only if draft or rejected)
const updatePortfolio = async (req, res) => {
  try {
    // Find portfolio that belongs to this user
    const portfolio = await Portfolio.findOne({
      _id:  req.params.id,
      user: req.user.id,
    });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Cannot edit pending or approved portfolios
    if (portfolio.status === 'pending') {
      return res.status(400).json({
        message: 'Cannot edit a portfolio that is pending review',
      });
    }
    if (portfolio.status === 'approved') {
      return res.status(400).json({
        message: 'Cannot edit an approved portfolio',
      });
    }

    // If username is being changed, check uniqueness
    if (req.body.username && req.body.username !== portfolio.username) {
      const taken = await Portfolio.findOne({
        username: req.body.username,
        _id: { $ne: portfolio._id },
      });
      if (taken) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    const toArray = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val.filter(Boolean);
      return val.split(',').map(s => s.trim()).filter(Boolean);
    };

    // Update all allowed fields
    const textFields = [
      'fullName', 'tagline', 'about', 'email', 'phone',
      'linkedin', 'github', 'projects', 'experience',
      'portfolio_url', 'specialization', 'institution',
      'teachingLevel', 'campaigns', 'username',
      'profession', 'template',
    ];
    textFields.forEach(f => {
      if (req.body[f] !== undefined) portfolio[f] = req.body[f];
    });

    // Array fields need special handling
    const arrayFields = ['skills', 'achievements', 'tools', 'subjects'];
    arrayFields.forEach(f => {
      if (req.body[f] !== undefined) portfolio[f] = toArray(req.body[f]);
    });

    await portfolio.save();
    res.status(200).json({ message: 'Portfolio updated', portfolio });

  } catch (error) {
    console.error('Update portfolio error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── submitForApproval ─────────────────────────────────────────────
// PUT /api/portfolio/submit/:id
// Changes status from draft/rejected to pending
const submitForApproval = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id:  req.params.id,
      user: req.user.id,
    });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    if (portfolio.status === 'pending') {
      return res.status(400).json({
        message: 'Already submitted. Waiting for admin review.',
      });
    }
    if (portfolio.status === 'approved') {
      return res.status(400).json({
        message: 'Portfolio is already approved',
      });
    }

    portfolio.status       = 'pending';
    portfolio.adminComment = ''; // clear old rejection comment
    await portfolio.save();

    res.status(200).json({
      message: 'Portfolio submitted for admin approval',
      status:  portfolio.status,
    });

  } catch (error) {
    console.error('Submit error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── deletePortfolio ───────────────────────────────────────────────
// DELETE /api/portfolio/delete/:id
// Permanently deletes a portfolio
const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({
      _id:  req.params.id,
      user: req.user.id,
    });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    res.status(200).json({ message: 'Portfolio deleted successfully' });

  } catch (error) {
    console.error('Delete error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── getApprovedPortfolios ─────────────────────────────────────────
// GET /api/portfolio/public
// Returns all approved portfolios for public browsing
const getApprovedPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ status: 'approved' })
      .populate('user', 'name email') // join user name+email
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: portfolios.length,
      portfolios,
    });

  } catch (error) {
    console.error('Get public portfolios error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── viewByUsername ────────────────────────────────────────────────
// GET /api/portfolio/view/:username
// Returns one approved portfolio by username + increments view count
const viewByUsername = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      username: req.params.username,
      status:   'approved',
    }).populate('user', 'name email');

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found or not approved yet' });
    }

    // Increment view count — this is the analytics feature
    portfolio.views = (portfolio.views || 0) + 1;
    await portfolio.save();

    res.status(200).json({ portfolio });

  } catch (error) {
    console.error('View portfolio error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createPortfolio,
  getMyPortfolios,
  updatePortfolio,
  submitForApproval,
  deletePortfolio,
  getApprovedPortfolios,
  viewByUsername,
};