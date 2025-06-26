# Digital Ocean Deployment Guide

## Overview
This application is configured for deployment on Digital Ocean App Platform.

## Files Required for Deployment

### 1. Root Entry Point (`index.js`)
- Main entry point that Digital Ocean will use to start the application
- Loads environment variables and starts the server

### 2. Root `package.json`
- Contains all necessary dependencies and start script
- Configured with `"main": "index.js"` and `"start": "node index.js"`

### 3. Environment Variables (`.env`)
- Production environment configuration
- MongoDB connection string for Digital Ocean cluster
- JWT secrets and other configuration

## Deployment Steps

### 1. Digital Ocean App Platform Setup
1. Connect your GitHub repository to Digital Ocean
2. Select the root directory as the source
3. Digital Ocean will automatically detect the Node.js application

### 2. Environment Variables
Set these environment variables in Digital Ocean App Platform:

**Required:**
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - JWT signing secret (min 32 characters)
- `NODE_ENV` - Set to `production`
- `PORT` - Usually handled automatically by Digital Ocean

**Optional but Recommended:**
- `CLIENT_URL` - Your frontend URL for CORS
- `SENDGRID_API_KEY` - For email functionality
- `CLOUDINARY_*` - For file uploads
- `REDIS_*` - For caching (if using Redis)

### 3. Build Configuration
Digital Ocean will automatically:
1. Run `npm install` to install dependencies
2. Execute `npm start` which runs `node index.js`
3. The application will start on the assigned port

### 4. Database
- MongoDB cluster is already configured on Digital Ocean
- Connection string is set in environment variables
- Database will be automatically connected when the app starts

## Project Structure
```
/
├── index.js                 # Digital Ocean entry point
├── package.json            # Root package.json with dependencies
├── .env                    # Environment variables
├── server/                 # Backend application
│   ├── src/
│   │   ├── server.js      # Express server
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   └── config/        # Configuration files
│   └── package.json       # Server-specific package.json
└── client/                # Frontend React app (if needed)
```

## Verification
After deployment, the application should:
1. Start successfully on Digital Ocean
2. Connect to the MongoDB database
3. Serve API endpoints at `/api/*`
4. Handle authentication and user management

## Troubleshooting

### Common Issues:
1. **Module not found**: Ensure all dependencies are in root `package.json`
2. **Database connection**: Verify `MONGODB_URI` environment variable
3. **Port issues**: Digital Ocean handles port assignment automatically
4. **Environment variables**: Check that all required env vars are set

### Logs:
- Use Digital Ocean's built-in logging to monitor application startup
- Check for MongoDB connection success messages
- Verify API routes are being registered correctly
