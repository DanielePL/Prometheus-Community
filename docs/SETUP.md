# 🚀 Quick Start Guide

## Prerequisites
- Node.js 18+
- npm 8+
- Git

## 1. Clone & Install
```bash
git clone https://github.com/your-username/prometheus-community.git
cd prometheus-community
npm install
```

## 2. Setup Environment
```bash
# Copy environment files
cp server/.env.example server/.env

# Edit server/.env with your database credentials
```

## 3. Start Development
```bash
# Option A: Start everything
npm run dev

# Option B: Start individual services
npm run dev:client    # Frontend on http://localhost:3000
npm run dev:server    # Backend on http://localhost:5000
```

## 4. Demo Access
- **URL:** http://localhost:3000
- **Email:** demo@prometheus.com  
- **Password:** demo123

## Features Working
✅ Authentication System  
✅ Community Feed  
✅ User Profiles  
✅ Workout of the Day  
✅ Leaderboards  
✅ Responsive Design  
✅ Modern UI with Tailwind  

## Next Steps
1. Set up PostgreSQL database
2. Configure Redis for caching
3. Add backend API endpoints
4. Implement WebSocket for real-time features

---

**Need help?** Check the [API Documentation](./API.md) or [Component Guide](./COMPONENTS.md)
