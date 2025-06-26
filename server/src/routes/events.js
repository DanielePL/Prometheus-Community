// server/src/routes/events.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const User = require('../models/User');
const { auth, authorize, requireSubscription } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events (with filters)
// @access  Private
router.get('/', auth, asyncHandler(async (req, res) => {
  const { 
    category, 
    track, 
    status = 'published',
    upcoming = true,
    page = 1, 
    limit = 20 
  } = req.query;

  const filters = { status };
  
  if (category) filters.category = category;
  if (track && track !== 'all') filters.track = track;
  if (upcoming === 'true') filters.startDate = { $gte: new Date() };

  const events = await Event.getUpcomingEvents(filters, page, limit);

  res.json({
    success: true,
    data: {
      events,
      page: parseInt(page),
      limit: parseInt(limit)
    }
  });
}));

// @route   GET /api/events/:eventId
// @desc    Get a specific event
// @access  Private
router.get('/:eventId', auth, asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId)
    .populate('organizer', 'name avatar verified')
    .populate('speakers.user', 'name avatar verified')
    .populate('attendees.user', 'name avatar verified')
    .populate('comments.user', 'name avatar verified');

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  // Check if user has access based on track/subscription
  if (event.track !== 'all') {
    const hasAccess = req.user.subscription === event.track || 
                     req.user.role === 'admin' || 
                     req.user.role === 'moderator';
    
    if (!hasAccess) {
      // Return limited info for non-subscribers
      return res.json({
        success: true,
        data: {
          event: {
            id: event._id,
            title: event.title,
            description: event.description,
            track: event.track,
            category: event.category,
            startDate: event.startDate,
            endDate: event.endDate,
            requiresSubscription: true
          }
        }
      });
    }
  }

  res.json({
    success: true,
    data: { event }
  });
}));

// @route   POST /api/events
// @desc    Create a new event
// @access  Private (Admin/Moderator only)
router.post('/', 
  auth,
  authorize('admin', 'moderator'),
  [
    body('title')
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be between 3 and 200 characters'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Description must be between 10 and 2000 characters'),
    body('type')
      .isIn(['town-hall', 'masterclass', 'workshop', 'seminar', 'competition', 'social', 'special'])
      .withMessage('Invalid event type'),
    body('category')
      .isIn(['Core', 'Academy', 'Coach Lab', 'Leadership', 'Business Builder', 'Special Event'])
      .withMessage('Invalid event category'),
    body('startDate')
      .isISO8601()
      .withMessage('Invalid start date'),
    body('endDate')
      .isISO8601()
      .withMessage('Invalid end date')
      .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.startDate)) {
          throw new Error('End date must be after start date');
        }
        return true;
      })
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

    const eventData = {
      ...req.body,
      organizer: req.user._id
    };

    const event = new Event(eventData);
    await event.save();

    await event.populate('organizer', 'name avatar verified');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event }
    });
  })
);

// @route   PUT /api/events/:eventId
// @desc    Update an event
// @access  Private (Admin/Moderator/Organizer only)
router.put('/:eventId', auth, asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  // Check permissions
  const canEdit = event.organizer.toString() === req.user._id.toString() ||
                 req.user.role === 'admin' ||
                 req.user.role === 'moderator';

  if (!canEdit) {
    throw new AppError('Not authorized to update this event', 403);
  }

  const allowedUpdates = [
    'title', 'description', 'startDate', 'endDate', 'location',
    'maxAttendees', 'registrationDeadline', 'agenda', 'materials', 'settings'
  ];
  
  const updates = {};
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.eventId,
    updates,
    { new: true, runValidators: true }
  ).populate('organizer', 'name avatar verified');

  res.json({
    success: true,
    message: 'Event updated successfully',
    data: { event: updatedEvent }
  });
}));

// @route   DELETE /api/events/:eventId
// @desc    Delete an event
// @access  Private (Admin only)
router.delete('/:eventId', 
  auth, 
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    await Event.findByIdAndDelete(req.params.eventId);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  })
);

// @route   POST /api/events/:eventId/register
// @desc    Register for an event
// @access  Private
router.post('/:eventId/register', auth, asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  // Check if registration is open
  if (!event.isRegistrationOpen) {
    throw new AppError('Registration is not open for this event', 400);
  }

  // Check track access
  if (event.track !== 'all') {
    const hasAccess = req.user.subscription === event.track || 
                     req.user.role === 'admin' || 
                     req.user.role === 'moderator';
    
    if (!hasAccess) {
      throw new AppError(`This event requires ${event.track} subscription`, 403);
    }
  }

  try {
    const result = await event.registerUser(req.user._id);
    await event.save();

    // Award points for registration
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.campusPoints': 5 }
    });

    res.json({
      success: true,
      message: result.status === 'waitlisted' ? 
        'Added to waitlist successfully' : 
        'Registered successfully',
      data: result
    });

  } catch (error) {
    throw new AppError(error.message, 400);
  }
}));

// @route   POST /api/events/:eventId/cancel
// @desc    Cancel event registration
// @access  Private
router.post('/:eventId/cancel', auth, asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  const result = await event.cancelRegistration(req.user._id);
  await event.save();

  res.json({
    success: true,
    message: 'Registration cancelled successfully',
    data: result
  });
}));

// @route   POST /api/events/:eventId/checkin
// @desc    Check in to an event
// @access  Private
router.post('/:eventId/checkin', auth, asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  const attendee = event.attendees.find(
    a => a.user.toString() === req.user._id.toString()
  );

  if (!attendee) {
    throw new AppError('You are not registered for this event', 400);
  }

  if (attendee.status === 'attended') {
    throw new AppError('You have already checked in', 400);
  }

  // Check if event is happening now (within 30 minutes of start time)
  const now = new Date();
  const eventStart = new Date(event.startDate);
  const timeDiff = Math.abs(now - eventStart) / (1000 * 60); // minutes

  if (timeDiff > 30 && now < eventStart) {
    throw new AppError('Check-in is not available yet', 400);
  }

  attendee.status = 'attended';
  attendee.checkedInAt = new Date();
  await event.save();

  // Award points for attendance
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { 'stats.campusPoints': 20 }
  });

  res.json({
    success: true,
    message: 'Checked in successfully'
  });
}));

// @route   POST /api/events/:eventId/comment
// @desc    Add a comment to an event
// @access  Private
router.post('/:eventId/comment', 
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

    const event = await Event.findById(req.params.eventId);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Check if comments are allowed
    if (!event.settings.allowComments) {
      throw new AppError('Comments are not allowed for this event', 403);
    }

    const comment = {
      user: req.user._id,
      content: req.body.content,
      isLiveChat: req.body.isLiveChat || false
    };

    event.comments.push(comment);
    await event.save();

    await event.populate('comments.user', 'name avatar verified');

    const newComment = event.comments[event.comments.length - 1];

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment: newComment }
    });
  })
);

// @route   POST /api/events/:eventId/question
// @desc    Ask a question during an event
// @access  Private
router.post('/:eventId/question', 
  auth,
  [
    body('question')
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('Question must be between 1 and 500 characters')
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

    const event = await Event.findById(req.params.eventId);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    if (!event.settings.allowQuestions) {
      throw new AppError('Questions are not allowed for this event', 403);
    }

    const question = {
      user: req.user._id,
      question: req.body.question
    };

    event.questions.push(question);
    await event.save();

    await event.populate('questions.user', 'name avatar verified');

    const newQuestion = event.questions[event.questions.length - 1];

    res.status(201).json({
      success: true,
      message: 'Question submitted successfully',
      data: { question: newQuestion }
    });
  })
);

// @route   GET /api/events/category/:category
// @desc    Get events by category
// @access  Private
router.get('/category/:category', auth, asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { limit = 10 } = req.query;

  const events = await Event.getEventsByCategory(category, limit);

  res.json({
    success: true,
    data: {
      events,
      category,
      total: events.length
    }
  });
}));

// @route   GET /api/events/my/registered
// @desc    Get user's registered events
// @access  Private
router.get('/my/registered', auth, asyncHandler(async (req, res) => {
  const { upcoming = true } = req.query;

  const query = {
    'attendees.user': req.user._id,
    ...(upcoming === 'true' && { startDate: { $gte: new Date() } })
  };

  const events = await Event.find(query)
    .populate('organizer', 'name avatar verified')
    .sort({ startDate: 1 });

  // Add user's registration status to each event
  const eventsWithStatus = events.map(event => {
    const userRegistration = event.attendees.find(
      attendee => attendee.user.toString() === req.user._id.toString()
    );
    
    return {
      ...event.toObject(),
      userStatus: userRegistration ? userRegistration.status : null,
      registeredAt: userRegistration ? userRegistration.registeredAt : null
    };
  });

  res.json({
    success: true,
    data: {
      events: eventsWithStatus,
      total: eventsWithStatus.length
    }
  });
}));

// ADMIN ROUTES

// @route   POST /api/events
// @desc    Create a new event (Admin/Coach only)
// @access  Private (Admin/Coach only)
router.post('/',
  auth,
  authorize('admin', 'moderator', 'coach'),
  [
    body('title').notEmpty().trim().isLength({ min: 5, max: 100 })
      .withMessage('Title must be between 5 and 100 characters'),
    body('description').notEmpty().trim().isLength({ min: 10, max: 2000 })
      .withMessage('Description must be between 10 and 2000 characters'),
    body('startDate').isISO8601()
      .withMessage('Please provide a valid start date'),
    body('endDate').isISO8601()
      .withMessage('Please provide a valid end date'),
    body('category').isIn(['workshop', 'seminar', 'training', 'competition', 'social'])
      .withMessage('Invalid category'),
    body('maxAttendees').optional().isInt({ min: 1 })
      .withMessage('Max attendees must be a positive number'),
    body('price').optional().isFloat({ min: 0 })
      .withMessage('Price must be a positive number')
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

    const eventData = {
      ...req.body,
      organizer: req.user._id,
      status: 'published'
    };

    const event = new Event(eventData);
    await event.save();

    await event.populate('organizer', 'name avatar verified');

    res.status(201).json({
      success: true,
      data: event
    });
  })
);

// @route   PUT /api/events/:id
// @desc    Update an event (Admin/Coach only)
// @access  Private (Admin/Coach only)
router.put('/:id',
  auth,
  authorize('admin', 'moderator', 'coach'),
  [
    body('title').optional().trim().isLength({ min: 5, max: 100 })
      .withMessage('Title must be between 5 and 100 characters'),
    body('description').optional().trim().isLength({ min: 10, max: 2000 })
      .withMessage('Description must be between 10 and 2000 characters'),
    body('startDate').optional().isISO8601()
      .withMessage('Please provide a valid start date'),
    body('endDate').optional().isISO8601()
      .withMessage('Please provide a valid end date'),
    body('category').optional().isIn(['workshop', 'seminar', 'training', 'competition', 'social'])
      .withMessage('Invalid category'),
    body('maxAttendees').optional().isInt({ min: 1 })
      .withMessage('Max attendees must be a positive number'),
    body('price').optional().isFloat({ min: 0 })
      .withMessage('Price must be a positive number')
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

    const event = await Event.findById(id);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Check if user can edit this event
    if (req.user.role !== 'admin' && req.user.role !== 'moderator' && 
        event.organizer.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized to edit this event', 403);
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).populate('organizer', 'name avatar verified');

    res.json({
      success: true,
      data: updatedEvent
    });
  })
);

// @route   DELETE /api/events/:id
// @desc    Delete an event (Admin only)
// @access  Private (Admin only)
router.delete('/:id',
  auth,
  authorize('admin', 'moderator'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Check if event has attendees
    if (event.attendees && event.attendees.length > 0) {
      throw new AppError('Cannot delete event with registered attendees', 400);
    }

    await Event.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  })
);

module.exports = router;
