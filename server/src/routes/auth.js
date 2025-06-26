// server/src/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, actionRateLimit } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerValidation, asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { email, password, name, fitnessLevel, goals } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  // Create user
  const user = new User({
    email,
    password,
    name,
    fitnessLevel: fitnessLevel || 'beginner',
    goals: goals || [],
    avatar: name.charAt(0).toUpperCase()
  });

  await user.save();

  // Generate tokens
  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();

  // Save refresh token
  user.refreshTokens.push({
    token: refreshToken,
    createdAt: new Date()
  });
  await user.save();

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  logger.info(`New user registered: ${user.email}`);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        subscription: user.subscription,
        verified: user.verified,
        stats: user.stats
      },
      tokens: {
        accessToken,
        refreshToken
      }
    }
  });
}));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', 
  loginValidation, 
  actionRateLimit(5, 15 * 60 * 1000), // 5 attempts per 15 minutes
  asyncHandler(async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findByEmail(email).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if user is suspended
    if (user.status === 'suspended' || user.status === 'banned') {
      throw new AppError('Account has been suspended. Please contact support.', 403);
    }

    // Generate tokens
    const accessToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    // Clean up old refresh tokens (keep only last 5)
    user.refreshTokens = user.refreshTokens
      .filter(tokenObj => tokenObj.expiresAt > new Date())
      .slice(-4); // Keep last 4, add new one = 5 total

    // Save new refresh token
    user.refreshTokens.push({
      token: refreshToken,
      createdAt: new Date()
    });

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    logger.info(`User logged in: ${user.email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          subscription: user.subscription,
          verified: user.verified,
          stats: user.stats,
          preferences: user.preferences
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });
  })
);

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token is required', 401);
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find user and check if refresh token exists
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError('Invalid refresh token', 401);
    }

    const tokenExists = user.refreshTokens.some(tokenObj => 
      tokenObj.token === refreshToken && tokenObj.expiresAt > new Date()
    );

    if (!tokenExists) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    // Generate new access token
    const newAccessToken = user.generateAuthToken();

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw new AppError('Invalid or expired refresh token', 401);
    }
    throw error;
  }
}));

// @route   POST /api/auth/logout
// @desc    Logout user (invalidate refresh token)
// @access  Private
router.post('/logout', auth, asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    // Remove specific refresh token
    req.user.refreshTokens = req.user.refreshTokens.filter(
      tokenObj => tokenObj.token !== refreshToken
    );
  } else {
    // Remove all refresh tokens (logout from all devices)
    req.user.refreshTokens = [];
  }

  await req.user.save();

  logger.info(`User logged out: ${req.user.email}`);

  res.json({
    success: true,
    message: 'Logout successful'
  });
}));

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        avatar: req.user.avatar,
        bio: req.user.bio,
        location: req.user.location,
        role: req.user.role,
        subscription: req.user.subscription,
        verified: req.user.verified,
        stats: req.user.stats,
        preferences: req.user.preferences,
        followerCount: req.user.followerCount,
        followingCount: req.user.followingCount,
        createdAt: req.user.createdAt,
        lastLogin: req.user.lastLogin
      }
    }
  });
}));

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', 
  auth,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new AppError('Current password is incorrect', 400);
    }

    // Update password
    user.password = newPassword;
    
    // Invalidate all refresh tokens (force re-login on all devices)
    user.refreshTokens = [];
    
    await user.save();

    logger.info(`Password changed for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password changed successfully. Please login again.'
    });
  })
);

module.exports = router;
