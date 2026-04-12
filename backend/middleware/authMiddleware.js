// authMiddleware.js
// This runs BEFORE protected routes to check if user is logged in
// Think of it as a "security guard at the door"

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // Step 1: Get the token from the request header
  // Frontend sends: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, access denied' });
  }

  // Step 2: Extract just the token part (remove "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // Step 3: Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 4: Attach the user info to the request object
    // Now any controller can access req.user to know WHO is making the request
    req.user = decoded; // { id: '...', role: 'user' }

    // Step 5: Move on to the actual route handler
    next();

  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { protect };