# MongoDB Setup Checklist

Use this checklist to ensure your Prometheus Community Dashboard is properly configured for MongoDB on Digital Ocean.

## ✅ Pre-Setup Checklist

- [ ] Digital Ocean account created
- [ ] Node.js 18+ installed
- [ ] npm 8+ installed
- [ ] Git repository cloned

## ✅ Digital Ocean Database Setup

- [ ] MongoDB cluster created on Digital Ocean
- [ ] Database user created with readWrite permissions
- [ ] Connection string obtained from Digital Ocean dashboard
- [ ] Database cluster is running and accessible

## ✅ Environment Configuration

- [ ] `server/.env` file created
- [ ] `MONGODB_URI` set with correct connection string
- [ ] All required environment variables configured
- [ ] JWT secrets generated (32+ characters)

**Required .env variables:**
```bash
MONGODB_URI=mongodb+srv://...
NODE_ENV=development
PORT=5000
JWT_SECRET=your_32_char_secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_32_char_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d
CLIENT_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000
BCRYPT_SALT_ROUNDS=12
SESSION_SECRET=your_session_secret
```

## ✅ Dependencies Installation

- [ ] Root dependencies installed: `npm install`
- [ ] Server dependencies installed: `cd server && npm install`
- [ ] Client dependencies installed: `cd client && npm install`
- [ ] No PostgreSQL packages in package.json files

## ✅ Database Connection

- [ ] Connection test passed: `npm run db:test`
- [ ] Database seeding completed: `npm run db:seed`
- [ ] Sample users created successfully
- [ ] Sample data visible in MongoDB dashboard

## ✅ Application Testing

- [ ] Backend server starts: `npm run dev:server`
- [ ] Frontend client starts: `npm run dev:client`
- [ ] Login works with sample credentials
- [ ] Dashboard loads without errors
- [ ] API endpoints respond correctly

**Test with these credentials:**
- Admin: `admin@prometheuscommunity.com` / `admin123`
- User: `john@example.com` / `password123`

## ✅ Production Readiness

- [ ] Production MongoDB URI configured
- [ ] SSL/TLS enabled for database connections
- [ ] Environment variables secured
- [ ] Database backups configured
- [ ] Monitoring set up
- [ ] Error logging configured

## 🚨 Troubleshooting

If any checklist item fails:

### Connection Issues
1. Verify MongoDB URI format
2. Check Digital Ocean database status
3. Confirm user permissions
4. Test network connectivity

### Authentication Issues
1. Double-check username/password
2. Verify database user exists
3. Check user permissions in Digital Ocean
4. Ensure IP whitelist includes your address

### Application Issues
1. Check console for error messages
2. Verify all environment variables
3. Ensure dependencies are installed
4. Check port availability (3000, 5000)

### Commands for Quick Diagnosis
```bash
# Test database connection
cd server && npm run db:test

# Check server logs
cd server && npm run dev

# Verify environment variables
cd server && node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI ? 'MongoDB URI set' : 'MongoDB URI missing')"

# Test API endpoint
curl http://localhost:5000/api/health
```

## 📞 Support Resources

- **Digital Ocean MongoDB Docs**: https://docs.digitalocean.com/products/databases/mongodb/
- **Mongoose Documentation**: https://mongoosejs.com/docs/
- **Project Documentation**: `docs/DIGITAL_OCEAN_MONGODB_SETUP.md`
- **Migration Summary**: `docs/MONGODB_MIGRATION_SUMMARY.md`

## ✨ Success Indicators

You've successfully set up MongoDB when:

- ✅ Database connection test passes
- ✅ Sample data is seeded
- ✅ Frontend loads without errors  
- ✅ Login works with sample credentials
- ✅ API endpoints return data
- ✅ No PostgreSQL references remain

**Ready to code! 🚀**
