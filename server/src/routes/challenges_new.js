// server/src/routes/challenges.js
const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const authMiddleware = require('../middleware/auth');
const logger = require('../config/logger');

const { auth } = authMiddleware;

// GET /api/challenges - Get all challenges
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

// POST /api/challenges - Create new challenge (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const challengeData = {
      ...req.body,
      createdBy: req.user.id
    };
    
    const challenge = new Challenge(challengeData);
    await challenge.save();
    
    await challenge.populate('createdBy', 'name avatar');
    
    logger.info(`Challenge created: ${challenge.title} by ${req.user.email}`);
    
    res.status(201).json({
      success: true,
      data: challenge,
      message: 'Challenge created successfully'
    });
  } catch (error) {
    logger.error('Error creating challenge:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating challenge',
      error: error.message
    });
  }
});

// POST /api/challenges/:id/join - Join a challenge (auth required)
router.post('/:id/join', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }
    
    // Check if user already joined
    const alreadyJoined = challenge.participants.some(
      p => p.user.toString() === req.user.id
    );
    
    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        message: 'You have already joined this challenge'
      });
    }
    
    // Check max participants limit
    if (challenge.maxParticipants && 
        challenge.participants.length >= challenge.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Challenge is full'
      });
    }
    
    challenge.participants.push({
      user: req.user.id,
      joinedAt: new Date()
    });
    
    await challenge.save();
    
    logger.info(`User ${req.user.email} joined challenge: ${challenge.title}`);
    
    res.json({
      success: true,
      message: 'Successfully joined challenge'
    });
  } catch (error) {
    logger.error('Error joining challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Error joining challenge',
      error: error.message
    });
  }
});

// PUT /api/challenges/:id/progress - Update challenge progress (auth required)
router.put('/:id/progress', auth, async (req, res) => {
  try {
    const { progress } = req.body;
    
    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be between 0 and 100'
      });
    }
    
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }
    
    const participant = challenge.participants.find(
      p => p.user.toString() === req.user.id
    );
    
    if (!participant) {
      return res.status(400).json({
        success: false,
        message: 'You are not participating in this challenge'
      });
    }
    
    participant.progress = progress;
    participant.completed = progress === 100;
    
    await challenge.save();
    
    logger.info(`Progress updated for ${req.user.email} in challenge: ${challenge.title} - ${progress}%`);
    
    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: { progress, completed: participant.completed }
    });
  } catch (error) {
    logger.error('Error updating progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating progress',
      error: error.message
    });
  }
});

// DELETE /api/challenges/:id/leave - Leave a challenge (auth required)
router.delete('/:id/leave', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }
    
    const participantIndex = challenge.participants.findIndex(
      p => p.user.toString() === req.user.id
    );
    
    if (participantIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You are not participating in this challenge'
      });
    }
    
    challenge.participants.splice(participantIndex, 1);
    await challenge.save();
    
    logger.info(`User ${req.user.email} left challenge: ${challenge.title}`);
    
    res.json({
      success: true,
      message: 'Successfully left challenge'
    });
  } catch (error) {
    logger.error('Error leaving challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Error leaving challenge',
      error: error.message
    });
  }
});

module.exports = router;
