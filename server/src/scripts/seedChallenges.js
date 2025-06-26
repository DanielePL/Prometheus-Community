// server/src/scripts/seedChallenges.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/database');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const logger = require('../config/logger');

const sampleChallenges = [
  {
    title: "30-Day Squat Challenge",
    description: "Complete 100 squats every day for 30 days and build incredible lower body strength. Track your progress and compete with others!",
    type: "endurance",
    difficulty: "intermediate",
    duration: "30 days",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    reward: "Endurance Master Badge",
    badgeIcon: "🏆",
    status: "active",
    isPublic: true,
    rules: [
      "Complete 100 squats daily",
      "Use proper form",
      "Track your progress daily",
      "No rest days allowed"
    ],
    tags: ["squats", "endurance", "30-day", "lower-body"]
  },
  {
    title: "Deadlift PR Challenge",
    description: "Achieve a new personal record in deadlift within 8 weeks using progressive overload and velocity-based training principles.",
    type: "strength",
    difficulty: "advanced",
    duration: "8 weeks",
    startDate: new Date(),
    endDate: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000), // 8 weeks from now
    reward: "Strength Beast Badge",
    badgeIcon: "💪",
    status: "active",
    isPublic: true,
    maxParticipants: 50,
    rules: [
      "Must have 6+ months deadlifting experience",
      "Weekly PR attempts required",
      "Use VBT feedback for training",
      "Submit video proof of PR"
    ],
    tags: ["deadlift", "strength", "pr", "vbt", "powerlifting"]
  },
  {
    title: "Perfect Push-up Form",
    description: "Master the perfect push-up technique. Focus on form over quantity. Learn proper breathing, body alignment, and muscle activation.",
    type: "technique",
    difficulty: "beginner",
    duration: "2 weeks",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
    reward: "Form Master Badge",
    badgeIcon: "🎯",
    status: "active",
    isPublic: true,
    rules: [
      "Quality over quantity",
      "Daily form check videos",
      "Follow provided tutorial",
      "Get feedback from coaches"
    ],
    tags: ["push-ups", "technique", "form", "beginner", "bodyweight"]
  },
  {
    title: "Community Workout Streak",
    description: "Work out for 21 consecutive days to build a lasting habit. Any workout counts - strength, cardio, yoga, or sports!",
    type: "consistency",
    difficulty: "beginner",
    duration: "21 days",
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    endDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000), // 24 days from now
    reward: "Consistency Champion Badge",
    badgeIcon: "🔥",
    status: "active",
    isPublic: true,
    rules: [
      "Minimum 20 minutes per workout",
      "Any type of exercise counts",
      "Log workout daily",
      "No makeup days for missed sessions"
    ],
    tags: ["consistency", "habit", "21-day", "community", "streak"]
  },
  {
    title: "Team Lifting Competition",
    description: "Form teams of 4 and compete in a month-long lifting competition. Combined team total wins the challenge!",
    type: "community",
    difficulty: "intermediate",
    duration: "4 weeks",
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    endDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000), // 6 weeks from now
    reward: "Team Victory Trophy",
    badgeIcon: "👥",
    status: "active",
    isPublic: true,
    maxParticipants: 40,
    rules: [
      "Teams of exactly 4 members",
      "Combined squat, bench, deadlift total",
      "All lifts must be verified",
      "Team communication encouraged"
    ],
    tags: ["team", "competition", "powerlifting", "community", "trophy"]
  }
];

async function seedChallenges() {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('Connected to MongoDB for challenge seeding');

    // Find the admin user to be the creator
    const adminUser = await User.findOne({ email: 'admin@prometheuscommunity.com' });
    
    if (!adminUser) {
      logger.error('Admin user not found. Please run the main seeding script first.');
      process.exit(1);
    }

    // Clear existing challenges
    await Challenge.deleteMany({});
    logger.info('Cleared existing challenges');

    // Create challenges
    const challenges = [];
    for (const challengeData of sampleChallenges) {
      const challenge = new Challenge({
        ...challengeData,
        createdBy: adminUser._id
      });
      
      await challenge.save();
      challenges.push(challenge);
      logger.info(`Created challenge: ${challenge.title}`);
    }

    logger.info(`Challenge seeding completed successfully!`);
    logger.info(`Created ${challenges.length} challenges`);
    
    // Close connection
    await mongoose.connection.close();
    logger.info('Database connection closed');
    
  } catch (error) {
    logger.error('Error during challenge seeding:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedChallenges();
}

module.exports = seedChallenges;
