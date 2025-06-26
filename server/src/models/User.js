// server/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  // Basic Information
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  avatar: {
    type: String,
    default: function() {
      return this.name ? this.name.charAt(0).toUpperCase() : 'U';
    }
  },
  
  // Profile Information
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  location: {
    type: String,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  
  // Fitness Profile
  fitnessLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'elite'],
    default: 'beginner'
  },
  goals: [{
    type: String,
    enum: ['strength', 'muscle-gain', 'weight-loss', 'endurance', 'flexibility', 'performance']
  }],
  preferredWorkoutTime: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'late-night']
  },
  
  // Community Information
  role: {
    type: String,
    enum: ['member', 'coach', 'admin', 'moderator'],
    default: 'member'
  },
  verified: {
    type: Boolean,
    default: false
  },
  subscription: {
    type: String,
    enum: ['free', 'academy', 'coach-lab', 'leadership', 'business-builder'],
    default: 'free'
  },
  
  // Statistics
  stats: {
    totalWorkouts: {
      type: Number,
      default: 0
    },
    totalVolume: {
      type: Number,
      default: 0
    },
    personalRecords: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    campusPoints: {
      type: Number,
      default: 0
    }
  },
  
  // Preferences
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      training: { type: Boolean, default: true },
      social: { type: Boolean, default: true }
    },
    privacy: {
      profile: { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
      workouts: { type: String, enum: ['public', 'friends', 'private'], default: 'friends' },
      achievements: { type: String, enum: ['public', 'friends', 'private'], default: 'public' }
    },
    units: {
      weight: { type: String, enum: ['kg', 'lbs'], default: 'kg' },
      distance: { type: String, enum: ['metric', 'imperial'], default: 'metric' }
    }
  },
  
  // Social
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Authentication
  refreshTokens: [{
    token: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
  }],
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerified: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  lastLogin: {
    type: Date
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ 'stats.campusPoints': -1 });
userSchema.index({ lastActive: -1 });
userSchema.index({ subscription: 1 });

// Virtual for full follower/following counts
userSchema.virtual('followerCount').get(function() {
  return this.followers ? this.followers.length : 0;
});

userSchema.virtual('followingCount').get(function() {
  return this.following ? this.following.length : 0;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      email: this.email,
      role: this.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Method to generate refresh token
userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  );
};

// Method to update last active
userSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save({ validateBeforeSave: false });
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to get leaderboard
userSchema.statics.getLeaderboard = function(limit = 10) {
  return this.find({ 'stats.campusPoints': { $gt: 0 } })
    .sort({ 'stats.campusPoints': -1 })
    .limit(limit)
    .select('name avatar stats.campusPoints verified subscription');
};

module.exports = mongoose.model('User', userSchema);
