// adminMiddleware.js
// Runs AFTER authMiddleware — checks if the logged-in user is an admin

const isAdmin = (req, res, next) => {
  // req.user was set by authMiddleware (protect)
  if (req.user && req.user.role === 'admin') {
    next(); // They're an admin, let them through
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

module.exports = { isAdmin };