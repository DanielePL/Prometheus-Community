// MongoDB Connection Test Script
require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../config/logger');

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Successfully connected to MongoDB!');
    
    // Test database operations
    console.log('Testing database operations...');
    
    // Get database stats
    const db = mongoose.connection.db;
    const stats = await db.stats();
    
    console.log('Database Stats:');
    console.log(`- Database: ${db.databaseName}`);
    console.log(`- Collections: ${stats.collections}`);
    console.log(`- Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);

    // List collections
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name).join(', ') || 'None');

    console.log('✅ Database connection test completed successfully!');

  } catch (error) {
    console.error('❌ Database connection test failed:');
    console.error('Error:', error.message);
    
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\nPossible issues:');
      console.error('1. Check your MongoDB URI in .env file');
      console.error('2. Ensure your Digital Ocean database is running');
      console.error('3. Check your network connection');
      console.error('4. Verify database credentials');
    }
    
    throw error;
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testConnection().catch((error) => {
    console.error('Connection test failed:', error.message);
    process.exit(1);
  });
}

module.exports = testConnection;
