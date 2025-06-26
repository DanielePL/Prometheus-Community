// Digital Ocean deployment entry point
// This file serves as the main entry point for the application when deployed to Digital Ocean

// Load environment variables
require('dotenv').config();

// Import and start the server
require('./server/src/server.js');
