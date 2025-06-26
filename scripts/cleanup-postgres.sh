#!/bin/bash

# Cleanup script for removing PostgreSQL dependencies and switching to MongoDB
# This script ensures a clean MongoDB-only setup

echo "🧹 Cleaning up PostgreSQL dependencies and setting up MongoDB..."

# Remove node_modules and package-lock.json to clean dependencies
echo "Removing old dependencies..."
rm -rf node_modules package-lock.json
rm -rf client/node_modules client/package-lock.json
rm -rf server/node_modules server/package-lock.json

# Remove any PostgreSQL-related files
echo "Removing PostgreSQL-related files..."
rm -rf database/migrations
rm -rf database/seeds
rm -f database/schema.sql

# Remove empty database directory if it's empty
if [ -d "database" ] && [ -z "$(ls -A database)" ]; then
    rmdir database
    echo "Removed empty database directory"
fi

# Reinstall dependencies
echo "Installing fresh dependencies..."
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies  
cd client
npm install
cd ..

echo "✅ Cleanup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your Digital Ocean MongoDB database"
echo "2. Update server/.env with your MongoDB connection string"
echo "3. Run 'npm run db:test' to test the connection"
echo "4. Run 'npm run db:seed' to add sample data"
echo "5. Run 'npm run dev' to start the application"
echo ""
echo "📖 See docs/DIGITAL_OCEAN_MONGODB_SETUP.md for detailed setup instructions"
