// server/src/config/database.js
const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    // MongoDB connection options
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    logger.info(`📦 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from MongoDB');
    });

    // Handle app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Mongoose connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
