// server/src/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post must have an author']
  },
  
  // Content
  content: {
    type: String,
    required: [true, 'Post content is required'],
    maxlength: [2000, 'Post content cannot exceed 2000 characters']
  },
  type: {
    type: String,
    enum: ['workout', 'tip', 'progress', 'general', 'live'],
    default: 'general'
  },
  
  // Media
  images: [{
    url: String,
    publicId: String, // For Cloudinary
    alt: String
  }],
  videos: [{
    url: String,
    publicId: String,
    thumbnail: String,
    duration: Number
  }],
  
  // Workout specific data
  workoutData: {
    exercises: [{
      name: String,
      sets: [{
        reps: Number,
        weight: Number,
        rpe: Number, // Rate of Perceived Exertion
        rest: Number // Rest time in seconds
      }]
    }],
    duration: Number, // Total workout duration in minutes
    volume: Number, // Total volume in kg
    notes: String
  },
  
  // Progress specific data
  progressData: {
    measurement: String, // e.g., 'weight', 'body_fat', 'max_bench'
    value: Number,
    unit: String,
    previousValue: Number,
    change: Number,
    changePercent: Number
  },
  
  // Location
  location: {
    name: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Interaction
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  
  // Hashtags and mentions
  hashtags: [String],
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Live features
  isLive: {
    type: Boolean,
    default: false
  },
  liveData: {
    startedAt: Date,
    endedAt: Date,
    viewers: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      joinedAt: {
        type: Date,
        default: Date.now
      }
    }],
    maxViewers: {
      type: Number,
      default: 0
    }
  },
  
  // Moderation
  reported: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  hidden: {
    type: Boolean,
    default: false
  },
  
  // Visibility
  visibility: {
    type: String,
    enum: ['public', 'followers', 'private'],
    default: 'public'
  },
  
  // Analytics
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    uniqueViews: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      viewedAt: {
        type: Date,
        default: Date.now
      }
    }],
    shares: {
      type: Number,
      default: 0
    },
    saves: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      savedAt: {
        type: Date,
        default: Date.now
      }
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ type: 1, createdAt: -1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ 'likes.user': 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ visibility: 1, createdAt: -1 });

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments ? this.comments.length : 0;
});

// Virtual for save count
postSchema.virtual('saveCount').get(function() {
  return this.analytics && this.analytics.saves ? this.analytics.saves.length : 0;
});

// Pre-save middleware to extract hashtags and mentions
postSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    // Extract hashtags
    const hashtagRegex = /#(\w+)/g;
    const hashtags = [];
    let match;
    while ((match = hashtagRegex.exec(this.content)) !== null) {
      hashtags.push(match[1].toLowerCase());
    }
    this.hashtags = [...new Set(hashtags)]; // Remove duplicates
  }
  next();
});

// Method to check if user liked the post
postSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(like => like.user.toString() === userId.toString());
};

// Method to check if user saved the post
postSchema.methods.isSavedBy = function(userId) {
  return this.analytics.saves.some(save => save.user.toString() === userId.toString());
};

// Method to add view
postSchema.methods.addView = function(userId) {
  this.analytics.views += 1;
  
  // Add unique view if not already viewed by this user
  const alreadyViewed = this.analytics.uniqueViews.some(
    view => view.user.toString() === userId.toString()
  );
  
  if (!alreadyViewed) {
    this.analytics.uniqueViews.push({ user: userId });
  }
  
  return this.save({ validateBeforeSave: false });
};

// Static method to get feed posts
postSchema.statics.getFeedPosts = function(userId, following = [], page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  return this.find({
    $or: [
      { author: userId },
      { author: { $in: following } },
      { visibility: 'public' }
    ],
    hidden: false
  })
  .populate('author', 'name avatar verified subscription')
  .populate('comments.user', 'name avatar verified')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
};

// Static method to get trending posts
postSchema.statics.getTrendingPosts = function(timeframe = 24, limit = 10) {
  const since = new Date(Date.now() - timeframe * 60 * 60 * 1000);
  
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: since },
        visibility: 'public',
        hidden: false
      }
    },
    {
      $addFields: {
        score: {
          $add: [
            { $multiply: [{ $size: '$likes' }, 3] },
            { $multiply: [{ $size: '$comments' }, 2] },
            { $multiply: ['$analytics.views', 1] },
            { $multiply: [{ $size: '$analytics.saves' }, 5] }
          ]
        }
      }
    },
    { $sort: { score: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    },
    { $unwind: '$author' }
  ]);
};

module.exports = mongoose.model('Post', postSchema);
