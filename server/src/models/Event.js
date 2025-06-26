// server/src/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  // Event Details
  type: {
    type: String,
    enum: ['town-hall', 'masterclass', 'workshop', 'seminar', 'competition', 'social', 'special'],
    required: [true, 'Event type is required']
  },
  category: {
    type: String,
    enum: ['Core', 'Academy', 'Coach Lab', 'Leadership', 'Business Builder', 'Special Event'],
    required: [true, 'Event category is required']
  },
  track: {
    type: String,
    enum: ['all', 'academy', 'coachlab', 'leadership', 'builder'],
    default: 'all'
  },
  
  // Scheduling
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  allDay: {
    type: Boolean,
    default: false
  },
  
  // Location
  location: {
    type: {
      type: String,
      enum: ['online', 'physical', 'hybrid'],
      default: 'online'
    },
    venue: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    meetingLink: String,
    meetingId: String,
    password: String
  },
  
  // Organizer & Speakers
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Event must have an organizer']
  },
  speakers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String, // For external speakers
    title: String,
    bio: String,
    avatar: String,
    isExternal: {
      type: Boolean,
      default: false
    }
  }],
  
  // Registration
  registrationRequired: {
    type: Boolean,
    default: true
  },
  maxAttendees: {
    type: Number,
    min: [1, 'Max attendees must be at least 1']
  },
  registrationDeadline: Date,
  waitlistEnabled: {
    type: Boolean,
    default: true
  },
  
  // Attendees
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'no-show', 'cancelled'],
      default: 'registered'
    },
    checkedInAt: Date,
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String
    }
  }],
  waitlist: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Content
  agenda: [{
    time: String,
    title: String,
    description: String,
    speaker: String,
    duration: Number // in minutes
  }],
  materials: [{
    title: String,
    description: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'video', 'link', 'image', 'document']
    },
    accessLevel: {
      type: String,
      enum: ['all', 'registered', 'attended'],
      default: 'registered'
    }
  }],
  
  // Live Features
  isLive: {
    type: Boolean,
    default: false
  },
  liveData: {
    streamUrl: String,
    chatEnabled: {
      type: Boolean,
      default: true
    },
    recordingEnabled: {
      type: Boolean,
      default: true
    },
    recordingUrl: String,
    currentViewers: {
      type: Number,
      default: 0
    },
    maxViewers: {
      type: Number,
      default: 0
    },
    startedAt: Date,
    endedAt: Date
  },
  
  // Chat & Interaction
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
    timestamp: {
      type: Date,
      default: Date.now
    },
    isLiveChat: {
      type: Boolean,
      default: false
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
  
  // QA
  questions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    question: {
      type: String,
      required: true,
      maxlength: [500, 'Question cannot exceed 500 characters']
    },
    answer: String,
    answeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    answeredAt: Date,
    upvotes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    status: {
      type: String,
      enum: ['pending', 'answered', 'dismissed'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Settings
  settings: {
    allowComments: {
      type: Boolean,
      default: true
    },
    allowQuestions: {
      type: Boolean,
      default: true
    },
    requireModeration: {
      type: Boolean,
      default: false
    },
    sendReminders: {
      type: Boolean,
      default: true
    },
    recordSession: {
      type: Boolean,
      default: true
    }
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'published', 'live', 'completed', 'cancelled'],
    default: 'draft'
  },
  publishedAt: Date,
  
  // Analytics
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    registrations: {
      type: Number,
      default: 0
    },
    attendanceRate: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    engagementScore: {
      type: Number,
      default: 0
    }
  },
  
  // Styling
  color: {
    type: String,
    default: '#f97316'
  },
  backgroundColor: String,
  bannerImage: {
    url: String,
    publicId: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
eventSchema.index({ startDate: 1, status: 1 });
eventSchema.index({ category: 1, track: 1 });
eventSchema.index({ 'attendees.user': 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ status: 1, startDate: 1 });

// Virtual for attendee count
eventSchema.virtual('attendeeCount').get(function() {
  return this.attendees ? this.attendees.length : 0;
});

// Virtual for waitlist count
eventSchema.virtual('waitlistCount').get(function() {
  return this.waitlist ? this.waitlist.length : 0;
});

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function() {
  if (!this.maxAttendees) return null;
  return Math.max(0, this.maxAttendees - this.attendeeCount);
});

// Virtual to check if event is full
eventSchema.virtual('isFull').get(function() {
  if (!this.maxAttendees) return false;
  return this.attendeeCount >= this.maxAttendees;
});

// Virtual to check if registration is open
eventSchema.virtual('isRegistrationOpen').get(function() {
  if (!this.registrationRequired) return false;
  if (this.registrationDeadline && new Date() > this.registrationDeadline) return false;
  if (this.status !== 'published') return false;
  if (this.startDate && new Date() > this.startDate) return false;
  return true;
});

// Pre-save middleware
eventSchema.pre('save', function(next) {
  // Update analytics
  if (this.isModified('attendees')) {
    this.analytics.registrations = this.attendeeCount;
    
    // Calculate attendance rate if event is completed
    if (this.status === 'completed') {
      const attendedCount = this.attendees.filter(a => a.status === 'attended').length;
      this.analytics.attendanceRate = this.attendeeCount > 0 ? 
        (attendedCount / this.attendeeCount) * 100 : 0;
      
      // Calculate average rating
      const ratings = this.attendees
        .filter(a => a.feedback && a.feedback.rating)
        .map(a => a.feedback.rating);
      
      if (ratings.length > 0) {
        this.analytics.averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      }
    }
  }
  
  // Set published date
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Method to check if user is registered
eventSchema.methods.isUserRegistered = function(userId) {
  return this.attendees.some(attendee => attendee.user.toString() === userId.toString());
};

// Method to check if user is on waitlist
eventSchema.methods.isUserOnWaitlist = function(userId) {
  return this.waitlist.some(wait => wait.user.toString() === userId.toString());
};

// Method to register user
eventSchema.methods.registerUser = function(userId) {
  if (this.isUserRegistered(userId)) {
    throw new Error('User already registered for this event');
  }
  
  if (this.isFull) {
    if (this.waitlistEnabled) {
      if (!this.isUserOnWaitlist(userId)) {
        this.waitlist.push({ user: userId });
      }
      return { status: 'waitlisted' };
    } else {
      throw new Error('Event is full and waitlist is disabled');
    }
  }
  
  this.attendees.push({ user: userId });
  return { status: 'registered' };
};

// Method to cancel registration
eventSchema.methods.cancelRegistration = function(userId) {
  // Remove from attendees
  this.attendees = this.attendees.filter(
    attendee => attendee.user.toString() !== userId.toString()
  );
  
  // Remove from waitlist
  this.waitlist = this.waitlist.filter(
    wait => wait.user.toString() !== userId.toString()
  );
  
  // Promote waitlist user if there's space
  if (this.waitlist.length > 0 && !this.isFull) {
    const nextUser = this.waitlist.shift();
    this.attendees.push({ user: nextUser.user });
    return { promoted: nextUser.user };
  }
  
  return { status: 'cancelled' };
};

// Static method to get upcoming events
eventSchema.statics.getUpcomingEvents = function(filters = {}, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const query = {
    startDate: { $gte: new Date() },
    status: 'published',
    ...filters
  };
  
  return this.find(query)
    .populate('organizer', 'name avatar verified')
    .populate('speakers.user', 'name avatar verified')
    .sort({ startDate: 1 })
    .skip(skip)
    .limit(limit);
};

// Static method to get events by category
eventSchema.statics.getEventsByCategory = function(category, limit = 5) {
  return this.find({
    category,
    status: 'published',
    startDate: { $gte: new Date() }
  })
  .populate('organizer', 'name avatar')
  .sort({ startDate: 1 })
  .limit(limit);
};

module.exports = mongoose.model('Event', eventSchema);
