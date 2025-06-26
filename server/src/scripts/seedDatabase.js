// MongoDB Database Seeding Script
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../models/User');
const Post = require('../models/Post');
const Event = require('../models/Event');

// Import database connection
const connectDB = require('../config/database');
const logger = require('../config/logger');

// Sample data
const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@prometheuscommunity.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    verified: true,
    profile: {
      bio: 'Community administrator and fitness enthusiast',
      location: 'Digital Ocean',
      fitnessGoals: ['strength', 'endurance'],
      experienceLevel: 'advanced'
    }
  },
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    name: 'John Doe',
    role: 'member',
    verified: true,
    profile: {
      bio: 'Powerlifter and VBT enthusiast',
      location: 'New York, USA',
      fitnessGoals: ['strength', 'powerlifting'],
      experienceLevel: 'intermediate'
    }
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password123',
    name: 'Jane Smith',
    name: 'Jane Smith',
    role: 'coach',
    verified: true,
    profile: {
      bio: 'Olympic weightlifter and coach',
      location: 'California, USA',
      fitnessGoals: ['olympic_lifting', 'coaching'],
      experienceLevel: 'advanced'
    }
  }
];

const samplePosts = [
  {
    title: 'Welcome to Prometheus Community!',
    content: 'Welcome to our strength training community! Share your workouts, connect with fellow athletes, and track your progress using velocity-based training.',
    type: 'general',
    tags: ['welcome', 'community', 'vbt'],
    isPublic: true
  },
  {
    title: 'VBT Training Tips for Beginners',
    content: 'Velocity-based training can seem intimidating at first, but here are some key tips to get started:\n\n1. Start with compound movements\n2. Focus on bar speed over weight\n3. Use autoregulation based on velocity feedback\n4. Track your progress consistently',
    type: 'tip',
    tags: ['vbt', 'beginners', 'tips'],
    isPublic: true
  }
];

const sampleEvents = [
  {
    title: 'Monthly Strength Challenge',
    description: 'Join our monthly strength challenge! Test your max lifts and compete with community members.',
    type: 'competition',
    category: 'Core',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000), // 1 month + 1 week from now
    location: 'Virtual',
    maxParticipants: 100,
    isPublic: true,
    tags: ['challenge', 'strength', 'competition']
  },
  {
    title: 'VBT Workshop: Advanced Techniques',
    description: 'Learn advanced velocity-based training techniques from industry experts.',
    type: 'workshop',
    category: 'Academy',
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
    location: 'Online Zoom Session',
    maxParticipants: 50,
    isPublic: true,
    tags: ['workshop', 'vbt', 'education']
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Event.deleteMany({});
    logger.info('Cleared existing data');

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      const savedUser = await user.save();
      users.push(savedUser);
      logger.info(`Created user: ${userData.username}`);
    }

    // Create posts
    const posts = [];
    for (let i = 0; i < samplePosts.length; i++) {
      const postData = samplePosts[i];
      const post = new Post({
        ...postData,
        author: users[i % users.length]._id // Rotate through users
      });
      const savedPost = await post.save();
      posts.push(savedPost);
      logger.info(`Created post: ${postData.title}`);
    }

    // Create events
    const events = [];
    for (let i = 0; i < sampleEvents.length; i++) {
      const eventData = sampleEvents[i];
      const event = new Event({
        ...eventData,
        organizer: users[0]._id // Admin user as organizer
      });
      const savedEvent = await event.save();
      events.push(savedEvent);
      logger.info(`Created event: ${eventData.title}`);
    }

    logger.info('Database seeding completed successfully!');
    logger.info(`Created ${users.length} users, ${posts.length} posts, and ${events.length} events`);

    // Display sample credentials
    console.log('\n=== SAMPLE LOGIN CREDENTIALS ===');
    console.log('Admin User:');
    console.log('  Email: admin@prometheuscommunity.com');
    console.log('  Password: admin123');
    console.log('\nRegular User:');
    console.log('  Email: john@example.com');
    console.log('  Password: password123');
    console.log('================================\n');

  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  } finally {
    // Close connection
    await mongoose.connection.close();
    logger.info('Database connection closed');
    process.exit(0);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase().catch((error) => {
    logger.error('Seeding failed:', error);
    process.exit(1);
  });
}

module.exports = seedDatabase;
