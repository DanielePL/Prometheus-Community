// Production Database Seeding Script - Real Data Only
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../models/User');
const Post = require('../models/Post');
const Event = require('../models/Event');
const Challenge = require('../models/Challenge');
const Message = require('../models/Message');

// Import database connection
const connectDB = require('../config/database');
const logger = require('../config/logger');

// Production admin users only (no demo users)
const adminUsers = [
  {
    username: 'admin',
    email: 'admin@prometheuscommunity.com',
    password: 'PrometheusAdmin2024!',
    name: 'Prometheus Admin',
    role: 'admin',
    verified: true,
    profile: {
      bio: 'Community administrator',
      location: 'Global',
      fitnessGoals: ['community_management'],
      experienceLevel: 'expert'
    }
  },
  {
    username: 'moderator',
    email: 'moderator@prometheuscommunity.com',
    password: 'PrometheusMod2024!',
    name: 'Community Moderator',
    role: 'moderator',
    verified: true,
    profile: {
      bio: 'Community moderator and fitness coach',
      location: 'Global',
      fitnessGoals: ['coaching', 'community_support'],
      experienceLevel: 'expert'
    }
  }
];

// Production-ready initial content (minimal, professional)
const initialPosts = [
  {
    title: 'Welcome to Prometheus Community',
    content: 'Welcome to the Prometheus Community! This is your space to connect with fellow athletes, share your VBT journey, and access world-class training resources. Let\'s build something amazing together! 🚀',
    type: 'general',
    hashtags: ['#welcome', '#prometheus', '#community'],
    pinned: true
  }
];

const initialEvents = [
  {
    title: 'Community Launch Event',
    description: 'Join us for the official launch of the Prometheus Community platform. Meet the team, learn about VBT, and connect with fellow athletes.',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours duration
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    time: '19:00',
    location: 'Online - Virtual Event',
    type: 'seminar',
    category: 'Core',
    maxParticipants: 100,
    registrationDeadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    tags: ['launch', 'virtual', 'introduction']
  }
];

const initialChallenges = [
  {
    title: 'VBT Fundamentals Challenge',
    description: 'Learn the basics of Velocity-Based Training over 7 days. Perfect for newcomers to VBT methodology.',
    category: 'education',
    difficulty: 'beginner',
    duration: 7,
    requirements: ['commitment', 'willingness_to_learn'],
    rewards: ['VBT Fundamentals Badge', 'Community Recognition']
  },
  {
    title: '30-Day Consistency Challenge',
    description: 'Build consistency in your training routine. Track your sessions for 30 consecutive days.',
    category: 'consistency',
    difficulty: 'intermediate',
    duration: 30,
    requirements: ['training_log', 'daily_commitment'],
    rewards: ['Consistency Badge', 'Training Plan Template']
  }
];

async function clearDatabase() {
  try {
    logger.info('Clearing existing data...');
    
    await User.deleteMany({});
    await Post.deleteMany({});
    await Event.deleteMany({});
    await Challenge.deleteMany({});
    await Message.deleteMany({});
    
    logger.info('Database cleared successfully');
  } catch (error) {
    logger.error('Error clearing database:', error);
    throw error;
  }
}

async function seedAdminUsers() {
  try {
    logger.info('Creating admin users...');
    
    const users = [];
    for (const userData of adminUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const user = new User({
        ...userData,
        password: hashedPassword,
        emailVerified: true,
        status: 'active'
      });
      
      users.push(user);
    }
    
    await User.insertMany(users);
    logger.info(`Created ${users.length} admin users`);
    
    return users;
  } catch (error) {
    logger.error('Error seeding admin users:', error);
    throw error;
  }
}

async function seedInitialContent(users) {
  try {
    logger.info('Creating initial content...');
    
    const adminUser = users.find(u => u.role === 'admin');
    
    // Create initial posts
    const posts = [];
    for (const postData of initialPosts) {
      const post = new Post({
        ...postData,
        author: adminUser._id,
        status: 'published'
      });
      posts.push(post);
    }
    
    await Post.insertMany(posts);
    logger.info(`Created ${posts.length} initial posts`);
    
    // Create initial events
    const events = [];
    for (const eventData of initialEvents) {
      const event = new Event({
        ...eventData,
        organizer: adminUser._id,
        status: 'published'
      });
      events.push(event);
    }
    
    await Event.insertMany(events);
    logger.info(`Created ${events.length} initial events`);
    
    // Create initial challenges
    const challenges = [];
    for (const challengeData of initialChallenges) {
      const challenge = new Challenge({
        ...challengeData,
        creator: adminUser._id,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + challengeData.duration * 24 * 60 * 60 * 1000)
      });
      challenges.push(challenge);
    }
    
    await Challenge.insertMany(challenges);
    logger.info(`Created ${challenges.length} initial challenges`);
    
  } catch (error) {
    logger.error('Error seeding initial content:', error);
    throw error;
  }
}

async function seedDatabase() {
  try {
    logger.info('Starting production database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await clearDatabase();
    
    // Seed admin users
    const users = await seedAdminUsers();
    
    // Seed initial content
    await seedInitialContent(users);
    
    logger.info(' ✅ Production database seeding completed successfully!');
    logger.info(' 📋 Summary:');
    logger.info(`   - Admin Users: ${adminUsers.length}`);
    logger.info(`   - Initial Posts: ${initialPosts.length}`);
    logger.info(`   - Initial Events: ${initialEvents.length}`);
    logger.info(`   - Initial Challenges: ${initialChallenges.length}`);
    logger.info(' 🚀 Ready for production use!');
    
  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    logger.info('Database connection closed');
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
