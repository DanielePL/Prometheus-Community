# Digital Ocean MongoDB Setup Guide

This guide will help you set up the Prometheus Community Dashboard with Digital Ocean's managed MongoDB database.

## Prerequisites

- Digital Ocean account
- Node.js 18+ installed locally
- npm or yarn package manager

## 1. Create Digital Ocean MongoDB Database

1. Log into your Digital Ocean account
2. Navigate to "Databases" in the left sidebar
3. Click "Create Database Cluster"
4. Select "MongoDB" as the database engine
5. Choose your preferred:
   - Version (latest stable recommended)
   - Datacenter region (closest to your users)
   - Plan size (start with Basic plan for development)
6. Name your cluster (e.g., "prometheus-community-db")
7. Click "Create Database Cluster"

## 2. Configure Database Access

1. Wait for the database cluster to be created (usually 5-10 minutes)
2. Once ready, click on your database cluster
3. Go to the "Users" tab and create a new user:
   - Username: `prometheus_user` (or your preferred name)
   - Password: Generate a strong password
   - Role: `readWrite` on the database
4. Go to the "Settings" tab and note down:
   - Connection string
   - Database name (default: `defaultdb`)

## 3. Setup Environment Variables

Create a `.env` file in the `server/` directory with your MongoDB credentials:

```bash
# MongoDB Configuration (Digital Ocean)
MONGODB_URI=mongodb+srv://prometheus_user:YOUR_PASSWORD@prometheus-community-db-xxxxx.mongo.ondigitalocean.com/prometheus_community?retryWrites=true&w=majority
MONGODB_TEST_URI=mongodb+srv://prometheus_user:YOUR_PASSWORD@prometheus-community-db-xxxxx.mongo.ondigitalocean.com/prometheus_community_test?retryWrites=true&w=majority

# Other required environment variables
NODE_ENV=development
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key_minimum_32_characters_long
JWT_REFRESH_EXPIRES_IN=30d

# Redis Configuration (if using)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email Configuration
EMAIL_FROM=noreply@prometheuscommunity.com
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Frontend URLs
CLIENT_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Security
BCRYPT_SALT_ROUNDS=12
SESSION_SECRET=your_session_secret_here

# Feature Flags
ENABLE_WEBSOCKETS=true
ENABLE_FILE_UPLOADS=true
ENABLE_EMAIL_NOTIFICATIONS=true
```

**Important Notes:**
- Replace `YOUR_PASSWORD` with your actual database password
- Replace `prometheus-community-db-xxxxx` with your actual cluster hostname
- Update the database name if you chose a different name

## 4. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## 5. Test Database Connection

```bash
# Test MongoDB connection
cd server
npm run db:test
```

You should see a success message if the connection works.

## 6. Seed the Database

```bash
# Seed the database with sample data
npm run db:seed
```

This will create:
- Sample users (including an admin user)
- Sample posts
- Sample events

## 7. Start the Application

```bash
# Start both client and server in development mode
npm run dev

# Or start them separately:
# Terminal 1 - Start the backend
cd server
npm run dev

# Terminal 2 - Start the frontend
cd client
npm start
```

## 8. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api/docs (if implemented)

## 9. Sample Login Credentials

After seeding, you can use these credentials:

**Admin User:**
- Email: `admin@prometheuscommunity.com`
- Password: `admin123`

**Regular User:**
- Email: `john@example.com`
- Password: `password123`

## Production Deployment

For production deployment on Digital Ocean:

1. **Create a Droplet** or use **App Platform**
2. **Set production environment variables** in your deployment environment
3. **Update MongoDB connection** to use production credentials
4. **Configure SSL/TLS** for secure connections
5. **Set up domain and DNS** if needed
6. **Configure monitoring and logging**

## Security Checklist

- [ ] Use strong, unique passwords for database users
- [ ] Enable database firewall rules (restrict access to your app's IP)
- [ ] Use environment variables for all secrets
- [ ] Enable SSL/TLS for database connections
- [ ] Regularly backup your database
- [ ] Monitor database performance and usage
- [ ] Keep dependencies updated

## Troubleshooting

### Connection Issues
- Verify your MongoDB URI is correct
- Check if your IP is whitelisted in Digital Ocean firewall
- Ensure the database cluster is running
- Verify username and password

### Performance Issues
- Monitor database metrics in Digital Ocean dashboard
- Consider upgrading your database plan if needed
- Implement proper indexing for frequently queried fields
- Use connection pooling (already configured in the app)

### Common Errors
- `MongooseServerSelectionError`: Usually network/authentication issue
- `MongoParseError`: Check your connection string format
- `Authentication failed`: Verify username/password

## Support

For issues specific to:
- Digital Ocean MongoDB: Check Digital Ocean documentation
- Application code: Create an issue in the project repository
- Database design: Review the MongoDB schema in `server/src/models/`
