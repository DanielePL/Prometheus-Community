// server/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');

// Verify JWT token middleware
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided or invalid format.'
      });
    }
    
    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is valid but user no longer exists.'
      });
    }
    
    // Check if user is active
    if (user.status === 'suspended' || user.status === 'banned') {
      return res.status(403).json({
        success: false,
        message: 'Account has been suspended. Please contact support.'
      });
    }
    
    // Update last active
    await user.updateLastActive();
    
    // Add user to request object
    req.user = user;
    req.userId = user._id;
    
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Authentication error.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.status !== 'suspended' && user.status !== 'banned') {
        req.user = user;
        req.userId = user._id;
        await user.updateLastActive();
      }
    }
    
    next();
  } catch (error) {
    // Continue without auth if token is invalid
    next();
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please login first.'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }
    
    next();
  };
};

// Subscription-based authorization
const requireSubscription = (...subscriptions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please login first.'
      });
    }
    
    if (!subscriptions.includes(req.user.subscription)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required subscription: ${subscriptions.join(' or ')}`
      });
    }
    
    next();
  };
};

// Check if user owns resource or is admin
const ownerOrAdmin = (resourceUserField = 'user') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please login first.'
      });
    }
    
    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Check if user owns the resource
    const resourceUserId = req.resource && req.resource[resourceUserField] 
      ? req.resource[resourceUserField].toString() 
      : req.params.userId || req.body.userId;
    
    if (resourceUserId && resourceUserId === req.user._id.toString()) {
      return next();
    }
    
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.'
    });
  };
};

// Rate limiting for specific actions
const actionRateLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();
  
  return (req, res, next) => {
    const key = `${req.ip}-${req.user ? req.user._id : 'anonymous'}`;
    const now = Date.now();
    const userAttempts = attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = userAttempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return res.status(429).json({
        success: false,
        message: 'Too many attempts. Please try again later.',
        retryAfter: Math.ceil((validAttempts[0] + windowMs - now) / 1000)
      });
    }
    
    // Add current attempt
    validAttempts.push(now);
    attempts.set(key, validAttempts);
    
    next();
  };
};

module.exports = {
  auth,
  optionalAuth,
  authorize,
  requireSubscription,
  ownerOrAdmin,
  actionRateLimit
};
