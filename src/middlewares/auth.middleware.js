const { verifyToken } = require('../utils/jwt.utils');

/**
 * Middleware to authenticate JWT tokens
 */
const authenticate = (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    // Add the user data to the request object
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

/**
 * Middleware to check if user has admin role
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
};

/**
 * Middleware to check if user has tutor role
 */
const isTutor = (req, res, next) => {
  if (req.user && (req.user.role === 'tutor' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Tutor role required.'
    });
  }
};

/**
 * Middleware to check if user is accessing their own resource or is an admin
 */
const isOwnerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.id === parseInt(req.params.userId) || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.'
    });
  }
};

module.exports = {
  authenticate,
  isAdmin,
  isTutor,
  isOwnerOrAdmin
};
