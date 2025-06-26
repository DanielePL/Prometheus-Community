// server/src/models/Challenge.js
const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Challenge title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Challenge description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  // Challenge Details
  type: {
    type: String,
    enum: ['strength', 'endurance', 'technique', 'consistency', 'community'],
    required: [true, 'Challenge type is required']
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },
  
  // Duration and Timing
  duration: {
    type: String,
    required: [true, 'Challenge duration is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Challenge start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'Challenge end date is required']
  },
  
  // Participation
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],
  maxParticipants: {
    type: Number,
    min: 1
  },
  
  // Rewards and Recognition
  reward: {
    type: String,
    maxlength: [100, 'Reward description cannot exceed 100 characters']
  },
  badgeIcon: {
    type: String
  },
  
  // Status and Visibility
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  
  // Content and Media
  images: [{
    url: String,
    alt: String,
    caption: String
  }],
  rules: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Creator and Moderation
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Statistics
  stats: {
    totalParticipants: {
      type: Number,
      default: 0
    },
    completedParticipants: {
      type: Number,
      default: 0
    },
    averageProgress: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
challengeSchema.index({ status: 1, startDate: 1 });
challengeSchema.index({ type: 1, difficulty: 1 });
challengeSchema.index({ createdBy: 1 });
challengeSchema.index({ 'participants.user': 1 });

// Virtual for participant count
challengeSchema.virtual('participantCount').get(function() {
  return this.participants ? this.participants.length : 0;
});

// Virtual for completion rate
challengeSchema.virtual('completionRate').get(function() {
  if (!this.participants || this.participants.length === 0) return 0;
  const completed = this.participants.filter(p => p.completed).length;
  return Math.round((completed / this.participants.length) * 100);
});

// Virtual for time remaining
challengeSchema.virtual('timeRemaining').get(function() {
  if (this.endDate <= new Date()) return 'Completed';
  const diff = this.endDate - new Date();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days === 1) return '1 day';
  return `${days} days`;
});

// Pre-save hook to update stats
challengeSchema.pre('save', function(next) {
  if (this.participants) {
    this.stats.totalParticipants = this.participants.length;
    this.stats.completedParticipants = this.participants.filter(p => p.completed).length;
    
    if (this.participants.length > 0) {
      const totalProgress = this.participants.reduce((sum, p) => sum + p.progress, 0);
      this.stats.averageProgress = Math.round(totalProgress / this.participants.length);
    }
  }
  next();
});

// Static method to find active challenges
challengeSchema.statics.findActive = function() {
  return this.find({
    status: 'active',
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() }
  }).populate('createdBy', 'name avatar').sort({ createdAt: -1 });
};

module.exports = mongoose.model('Challenge', challengeSchema);
