// server/src/routes/users.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, authorize, ownerOrAdmin } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const router = express.Router();

// @route   GET /api/users/profile/:userId?
// @desc    Get user profile (own or public)
// @access  Private
router.get('/profile/:userId?', auth, asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user._id;
  const isOwnProfile = userId === req.user._id.toString();

  const user = await User.findById(userId)
    .populate('followers', 'name avatar verified')
    .populate('following', 'name avatar verified');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check privacy settings
  if (!isOwnProfile && user.preferences.privacy.profile === 'private') {
    throw new AppError('This profile is private', 403);
  }

  // Filter data based on privacy settings and relationship
  const isFollowing = user.followers.some(follower => 
    follower._id.toString() === req.user._id.toString()
  );

  let profileData = {
    id: user._id,
    name: user.name,
    avatar: user.avatar,
    bio: user.bio,
    location: user.location,
    verified: user.verified,
    role: user.role,
    subscription: user.subscription,
    followerCount: user.followerCount,
    followingCount: user.followingCount,
    createdAt: user.createdAt
  };

  // Add stats based on privacy settings
  if (isOwnProfile || user.preferences.privacy.profile === 'public' || 
      (user.preferences.privacy.profile === 'friends' && isFollowing)) {
    profileData.stats = user.stats;
    profileData.goals = user.goals;
    profileData.fitnessLevel = user.fitnessLevel;
  }

  // Add sensitive data only for own profile
  if (isOwnProfile) {
    profileData.email = user.email;
    profileData.preferences = user.preferences;
    profileData.lastLogin = user.lastLogin;
  }

  res.json({
    success: true,
    data: { user: profileData }
  });
}));

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', 
  auth,
  [
    body('name').optional().trim().isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('bio').optional().isLength({ max: 500 })
      .withMessage('Bio cannot exceed 500 characters'),
    body('location').optional().isLength({ max: 100 })
      .withMessage('Location cannot exceed 100 characters'),
    body('fitnessLevel').optional().isIn(['beginner', 'intermediate', 'advanced', 'elite'])
      .withMessage('Invalid fitness level'),
    body('goals').optional().isArray()
      .withMessage('Goals must be an array')
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

    const allowedUpdates = [
      'name', 'bio', 'location', 'dateOfBirth', 'gender', 
      'fitnessLevel', 'goals', 'preferredWorkoutTime'
    ];
    
    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Update avatar if name changed
    if (updates.name) {
      updates.avatar = updates.name.charAt(0).toUpperCase();
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          avatar: user.avatar,
          bio: user.bio,
          location: user.location,
          fitnessLevel: user.fitnessLevel,
          goals: user.goals
        }
      }
    });
  })
);

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', 
  auth,
  asyncHandler(async (req, res) => {
    const { notifications, privacy, units } = req.body;
    
    const updates = {};
    if (notifications) updates['preferences.notifications'] = notifications;
    if (privacy) updates['preferences.privacy'] = privacy;
    if (units) updates['preferences.units'] = units;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: user.preferences
      }
    });
  })
);

// @route   POST /api/users/follow/:userId
// @desc    Follow/unfollow a user
// @access  Private
router.post('/follow/:userId', auth, asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;

  if (userId === currentUserId.toString()) {
    throw new AppError('You cannot follow yourself', 400);
  }

  const userToFollow = await User.findById(userId);
  if (!userToFollow) {
    throw new AppError('User not found', 404);
  }

  const currentUser = await User.findById(currentUserId);
  
  const isFollowing = currentUser.following.includes(userId);
  
  if (isFollowing) {
    // Unfollow
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== userId
    );
    userToFollow.followers = userToFollow.followers.filter(
      id => id.toString() !== currentUserId.toString()
    );
    
    await Promise.all([currentUser.save(), userToFollow.save()]);
    
    res.json({
      success: true,
      message: 'User unfollowed successfully',
      data: { following: false }
    });
  } else {
    // Follow
    currentUser.following.push(userId);
    userToFollow.followers.push(currentUserId);
    
    await Promise.all([currentUser.save(), userToFollow.save()]);
    
    res.json({
      success: true,
      message: 'User followed successfully',
      data: { following: true }
    });
  }
}));

// @route   GET /api/users/followers/:userId?
// @desc    Get user followers
// @access  Private
router.get('/followers/:userId?', auth, asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user._id;
  
  const user = await User.findById(userId)
    .populate('followers', 'name avatar verified subscription stats.campusPoints')
    .select('followers preferences');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check privacy
  const isOwnProfile = userId === req.user._id.toString();
  if (!isOwnProfile && user.preferences.privacy.profile === 'private') {
    throw new AppError('This profile is private', 403);
  }

  res.json({
    success: true,
    data: {
      followers: user.followers,
      count: user.followers.length
    }
  });
}));

// @route   GET /api/users/following/:userId?
// @desc    Get users that user is following
// @access  Private
router.get('/following/:userId?', auth, asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user._id;
  
  const user = await User.findById(userId)
    .populate('following', 'name avatar verified subscription stats.campusPoints')
    .select('following preferences');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check privacy
  const isOwnProfile = userId === req.user._id.toString();
  if (!isOwnProfile && user.preferences.privacy.profile === 'private') {
    throw new AppError('This profile is private', 403);
  }

  res.json({
    success: true,
    data: {
      following: user.following,
      count: user.following.length
    }
  });
}));

// @route   GET /api/users/search
// @desc    Search users
// @access  Private
router.get('/search', auth, asyncHandler(async (req, res) => {
  const { q, limit = 10, page = 1 } = req.query;
  
  if (!q || q.trim().length < 2) {
    throw new AppError('Search query must be at least 2 characters', 400);
  }

  const skip = (page - 1) * limit;
  
  const users = await User.find({
    $and: [
      {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } }
        ]
      },
      { 'preferences.privacy.profile': { $ne: 'private' } }
    ]
  })
  .select('name avatar bio verified subscription stats.campusPoints')
  .skip(skip)
  .limit(parseInt(limit))
  .sort({ 'stats.campusPoints': -1 });

  res.json({
    success: true,
    data: {
      users,
      total: users.length,
      page: parseInt(page),
      limit: parseInt(limit)
    }
  });
}));

// @route   GET /api/users/leaderboard
// @desc    Get community leaderboard
// @access  Private
router.get('/leaderboard', auth, asyncHandler(async (req, res) => {
  const { limit = 20, type = 'points' } = req.query;

  let sortField;
  switch (type) {
    case 'workouts':
      sortField = { 'stats.totalWorkouts': -1 };
      break;
    case 'volume':
      sortField = { 'stats.totalVolume': -1 };
      break;
    case 'streak':
      sortField = { 'stats.currentStreak': -1 };
      break;
    case 'points':
    default:
      sortField = { 'stats.campusPoints': -1 };
  }

  const users = await User.find({
    'preferences.privacy.profile': { $ne: 'private' },
    [`stats.${type === 'points' ? 'campusPoints' : type === 'workouts' ? 'totalWorkouts' : type === 'volume' ? 'totalVolume' : 'currentStreak'}`]: { $gt: 0 }
  })
  .select('name avatar verified subscription stats')
  .sort(sortField)
  .limit(parseInt(limit));

  // Add rank to each user
  const leaderboard = users.map((user, index) => ({
    ...user.toObject(),
    rank: index + 1
  }));

  res.json({
    success: true,
    data: {
      leaderboard,
      type,
      total: leaderboard.length
    }
  });
}));

// @route   GET /api/users/suggestions
// @desc    Get user suggestions for following
// @access  Private
router.get('/suggestions', auth, asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;
  
  // Find users with similar goals or fitness level
  const suggestions = await User.find({
    _id: { $ne: req.user._id },
    $and: [
      { _id: { $nin: req.user.following } },
      { 'preferences.privacy.profile': { $ne: 'private' } },
      {
        $or: [
          { goals: { $in: req.user.goals } },
          { fitnessLevel: req.user.fitnessLevel },
          { subscription: req.user.subscription }
        ]
      }
    ]
  })
  .select('name avatar bio verified subscription stats.campusPoints')
  .sort({ 'stats.campusPoints': -1 })
  .limit(parseInt(limit));

  res.json({
    success: true,
    data: {
      suggestions
    }
  });
}));

// @route   PUT /api/users/stats
// @desc    Update user stats (for admin/system use)
// @access  Private (Admin only)
router.put('/stats/:userId', 
  auth, 
  authorize('admin', 'moderator'),
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { stats } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { stats } },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      message: 'User stats updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          stats: user.stats
        }
      }
    });
  })
);

// ADMIN ROUTES

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin/Moderator only)
router.get('/', 
  auth, 
  authorize('admin', 'moderator'),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const { search, role, subscription, verified } = req.query;

    // Build filter object
    let filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) filter.role = role;
    if (subscription) filter.subscription = subscription;
    if (verified !== undefined) filter.verified = verified === 'true';

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('name email role subscription verified createdAt lastLogin stats')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  })
);

// @route   PUT /api/users/:id
// @desc    Update user by ID (Admin only)
// @access  Private (Admin only)
router.put('/:id',
  auth,
  authorize('admin'),
  [
    body('name').optional().trim().isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email').optional().isEmail()
      .withMessage('Please provide a valid email'),
    body('role').optional().isIn(['member', 'coach', 'moderator', 'admin'])
      .withMessage('Invalid role'),
    body('subscription').optional().isIn(['free', 'academy', 'coach-lab', 'leadership', 'business-builder'])
      .withMessage('Invalid subscription type'),
    body('verified').optional().isBoolean()
      .withMessage('Verified must be a boolean')
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

    const { id } = req.params;
    const updates = req.body;

    // Prevent admin from demoting themselves
    if (id === req.user._id.toString() && updates.role && updates.role !== 'admin') {
      throw new AppError('You cannot change your own role', 400);
    }

    const user = await User.findByIdAndUpdate(id, updates, { 
      new: true,
      runValidators: true 
    }).select('name email role subscription verified createdAt lastLogin stats');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: user
    });
  })
);

// @route   DELETE /api/users/:id
// @desc    Delete user by ID (Admin only)
// @access  Private (Admin only)
router.delete('/:id',
  auth,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user._id.toString()) {
      throw new AppError('You cannot delete your own account', 400);
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  })
);

module.exports = router;
