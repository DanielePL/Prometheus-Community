// server/src/routes/posts.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const User = require('../models/User');
const { auth, authorize, ownerOrAdmin } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const router = express.Router();

// @route   GET /api/posts/feed
// @desc    Get user feed
// @access  Private
router.get('/feed', auth, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const user = await User.findById(req.user._id).select('following');
  const posts = await Post.getFeedPosts(req.user._id, user.following, page, limit);

  res.json({
    success: true,
    data: {
      posts,
      page: parseInt(page),
      limit: parseInt(limit)
    }
  });
}));

// @route   GET /api/posts/trending
// @desc    Get trending posts
// @access  Private
router.get('/trending', auth, asyncHandler(async (req, res) => {
  const { timeframe = 24, limit = 10 } = req.query;
  
  const posts = await Post.getTrendingPosts(timeframe, limit);

  res.json({
    success: true,
    data: {
      posts,
      timeframe: parseInt(timeframe),
      limit: parseInt(limit)
    }
  });
}));

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', 
  auth,
  [
    body('content')
      .trim()
      .isLength({ min: 1, max: 2000 })
      .withMessage('Content must be between 1 and 2000 characters'),
    body('type')
      .optional()
      .isIn(['workout', 'tip', 'progress', 'general', 'live'])
      .withMessage('Invalid post type'),
    body('visibility')
      .optional()
      .isIn(['public', 'followers', 'private'])
      .withMessage('Invalid visibility setting')
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

    const postData = {
      author: req.user._id,
      content: req.body.content,
      type: req.body.type || 'general',
      visibility: req.body.visibility || 'public'
    };

    // Add optional fields
    if (req.body.location) postData.location = req.body.location;
    if (req.body.workoutData) postData.workoutData = req.body.workoutData;
    if (req.body.progressData) postData.progressData = req.body.progressData;
    if (req.body.images) postData.images = req.body.images;
    if (req.body.videos) postData.videos = req.body.videos;

    const post = new Post(postData);
    await post.save();

    // Populate author info
    await post.populate('author', 'name avatar verified subscription');

    // Update user stats if it's a workout post
    if (post.type === 'workout' && post.workoutData) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { 
          'stats.totalWorkouts': 1,
          'stats.totalVolume': post.workoutData.volume || 0,
          'stats.campusPoints': 10 // Points for posting workout
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post }
    });
  })
);

// @route   GET /api/posts/:postId
// @desc    Get a specific post
// @access  Private
router.get('/:postId', auth, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId)
    .populate('author', 'name avatar verified subscription')
    .populate('comments.user', 'name avatar verified');

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Check visibility
  if (post.visibility === 'private' && post.author._id.toString() !== req.user._id.toString()) {
    throw new AppError('Post not found', 404);
  }

  if (post.visibility === 'followers') {
    const author = await User.findById(post.author._id).select('followers');
    const isFollower = author.followers.includes(req.user._id);
    
    if (!isFollower && post.author._id.toString() !== req.user._id.toString()) {
      throw new AppError('Post not found', 404);
    }
  }

  // Add view
  await post.addView(req.user._id);

  res.json({
    success: true,
    data: { post }
  });
}));

// @route   PUT /api/posts/:postId
// @desc    Update a post
// @access  Private (Author only)
router.put('/:postId', auth, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Check ownership
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to update this post', 403);
  }

  const allowedUpdates = ['content', 'visibility', 'location'];
  const updates = {};
  
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.postId,
    updates,
    { new: true, runValidators: true }
  ).populate('author', 'name avatar verified subscription');

  res.json({
    success: true,
    message: 'Post updated successfully',
    data: { post: updatedPost }
  });
}));

// @route   DELETE /api/posts/:postId
// @desc    Delete a post
// @access  Private (Author only)
router.delete('/:postId', auth, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Check ownership
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this post', 403);
  }

  await Post.findByIdAndDelete(req.params.postId);

  res.json({
    success: true,
    message: 'Post deleted successfully'
  });
}));

// @route   POST /api/posts/:postId/like
// @desc    Like/unlike a post
// @access  Private
router.post('/:postId/like', auth, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  const isLiked = post.isLikedBy(req.user._id);

  if (isLiked) {
    // Unlike
    post.likes = post.likes.filter(
      like => like.user.toString() !== req.user._id.toString()
    );
  } else {
    // Like
    post.likes.push({ user: req.user._id });
    
    // Award points to post author
    if (post.author.toString() !== req.user._id.toString()) {
      await User.findByIdAndUpdate(post.author, {
        $inc: { 'stats.campusPoints': 2 }
      });
    }
  }

  await post.save();

  res.json({
    success: true,
    data: {
      liked: !isLiked,
      likeCount: post.likeCount
    }
  });
}));

// @route   POST /api/posts/:postId/comment
// @desc    Add a comment to a post
// @access  Private
router.post('/:postId/comment', 
  auth,
  [
    body('content')
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('Comment must be between 1 and 500 characters')
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

    const post = await Post.findById(req.params.postId);

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    const comment = {
      user: req.user._id,
      content: req.body.content
    };

    post.comments.push(comment);
    await post.save();

    // Populate the new comment
    await post.populate('comments.user', 'name avatar verified');

    // Award points to post author for engagement
    if (post.author.toString() !== req.user._id.toString()) {
      await User.findByIdAndUpdate(post.author, {
        $inc: { 'stats.campusPoints': 1 }
      });
    }

    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment: newComment }
    });
  })
);

// @route   DELETE /api/posts/:postId/comment/:commentId
// @desc    Delete a comment
// @access  Private (Comment author or post author or admin)
router.delete('/:postId/comment/:commentId', auth, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  const comment = post.comments.id(req.params.commentId);

  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  // Check permissions
  const canDelete = comment.user.toString() === req.user._id.toString() ||
                   post.author.toString() === req.user._id.toString() ||
                   req.user.role === 'admin' ||
                   req.user.role === 'moderator';

  if (!canDelete) {
    throw new AppError('Not authorized to delete this comment', 403);
  }

  comment.remove();
  await post.save();

  res.json({
    success: true,
    message: 'Comment deleted successfully'
  });
}));

// @route   POST /api/posts/:postId/save
// @desc    Save/unsave a post
// @access  Private
router.post('/:postId/save', auth, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  const isSaved = post.isSavedBy(req.user._id);

  if (isSaved) {
    // Unsave
    post.analytics.saves = post.analytics.saves.filter(
      save => save.user.toString() !== req.user._id.toString()
    );
  } else {
    // Save
    post.analytics.saves.push({ user: req.user._id });
  }

  await post.save();

  res.json({
    success: true,
    data: {
      saved: !isSaved,
      saveCount: post.saveCount
    }
  });
}));

// @route   GET /api/posts/user/:userId
// @desc    Get user's posts
// @access  Private
router.get('/user/:userId', auth, asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  // Check if viewing own profile or if profile is public
  const targetUser = await User.findById(userId).select('preferences followers');
  
  if (!targetUser) {
    throw new AppError('User not found', 404);
  }

  const isOwnProfile = userId === req.user._id.toString();
  const isFollowing = targetUser.followers.includes(req.user._id);

  let visibilityFilter = { author: userId };

  if (!isOwnProfile) {
    if (targetUser.preferences.privacy.profile === 'private') {
      throw new AppError('This profile is private', 403);
    } else if (targetUser.preferences.privacy.profile === 'friends' && !isFollowing) {
      visibilityFilter.visibility = 'public';
    } else {
      visibilityFilter.visibility = { $in: ['public', 'followers'] };
    }
  }

  const posts = await Post.find(visibilityFilter)
    .populate('author', 'name avatar verified subscription')
    .populate('comments.user', 'name avatar verified')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: {
      posts,
      page: parseInt(page),
      limit: parseInt(limit)
    }
  });
}));

// ADMIN ROUTES

// @route   GET /api/posts
// @desc    Get all posts (Admin only)
// @access  Private (Admin/Moderator only)
router.get('/', 
  auth, 
  authorize('admin', 'moderator'),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { search, type, author, isVisible } = req.query;

    // Build filter object
    let filter = {};
    
    if (search) {
      filter.content = { $regex: search, $options: 'i' };
    }
    
    if (type) filter.type = type;
    if (author) filter.author = author;
    if (isVisible !== undefined) filter.isVisible = isVisible === 'true';

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('author', 'name avatar verified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  })
);

// @route   PUT /api/posts/:id/visibility
// @desc    Toggle post visibility (Admin/Moderator only)
// @access  Private (Admin/Moderator only)
router.put('/:id/visibility',
  auth,
  authorize('admin', 'moderator'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { isVisible } = req.body;

    const post = await Post.findByIdAndUpdate(
      id, 
      { isVisible },
      { new: true, runValidators: true }
    ).populate('author', 'name avatar verified');

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    res.json({
      success: true,
      data: post
    });
  })
);

// @route   DELETE /api/posts/:id/admin
// @desc    Delete post as admin (Admin/Moderator only)
// @access  Private (Admin/Moderator only)
router.delete('/:id/admin',
  auth,
  authorize('admin', 'moderator'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  })
);

module.exports = router;
