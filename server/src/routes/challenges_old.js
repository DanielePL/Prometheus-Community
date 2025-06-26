// server/src/routes/challenges.js
const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const authMiddleware = require('../middleware/auth');
const logger = require('../config/logger');

const { auth } = authMiddleware;

// GET /api/challenges - Get all active challenges
router.get('/', async (req, res) => {
  try {
    const { type, difficulty, status = 'active', page = 1, limit = 10 } = req.query;
    
    const query = { status };
    
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    
    const challenges = await Challenge.find(query)
      .populate('createdBy', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Challenge.countDocuments(query);
    
    res.json({
      success: true,
      data: challenges,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching challenges:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching challenges',
      error: error.message
    });
  }
});

// GET /api/challenges/:id - Get specific challenge
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('createdBy', 'name avatar email')
      .populate('participants.user', 'name avatar');
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }
    
    res.json({
      success: true,
      data: challenge
    });
  } catch (error) {
    logger.error('Error fetching challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching challenge',
      error: error.message
    });
  }
});
  {
    id: 2,
    title: "Deadlift PR Challenge",
    description: "Achieve a new personal record in deadlift",
    type: "strength",
    difficulty: "advanced",
    duration: "8 weeks",
    participants: 89,
    reward: "Strength Beast Badge",
    status: "active",
    progress: 0
  }
];

// GET /api/challenges
router.get('/', async (req, res) => {
  try {
    logger.info('Fetching challenges');
    res.json({
      success: true,
      data: mockChallenges
    });
  } catch (error) {
    logger.error('Error fetching challenges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch challenges'
    });
  }
});

module.exports = router;
