// server/src/routes/challenges.js
const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

// Mock challenges data
const mockChallenges = [
  {
    id: 1,
    title: "30-Day Squat Challenge",
    description: "Complete 100 squats every day for 30 days",
    type: "endurance",
    difficulty: "intermediate",
    duration: "30 days",
    participants: 245,
    reward: "Endurance Badge",
    status: "active",
    progress: 0
  },
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
