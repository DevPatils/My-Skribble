const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  // Get the token from the 'auth-token' header
  const token = req.header('auth-token');

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    // Verify the token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach userId to request object for further use in route handlers
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;
