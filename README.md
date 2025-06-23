# 🔥 PROMETHEUS COMMUNITY DASHBOARD

![Prometheus Logo](https://img.shields.io/badge/PROMETHEUS-Community-ff6600?style=for-the-badge&logo=lightning)

> **AI-Powered Strength Training Community Platform**  
> Velocity-Based Training • Community Feed • Real-time Analytics

---

## 🚀 **Live Demo**
```bash
# Quick Start (unter 2 Minuten)
git clone https://github.com/your-username/prometheus-community.git
cd prometheus-community
npm run setup:all
npm run dev
```

**Demo Access:** `demo@prometheus.com` / `demo123`

---

## ⚡ **Features**

| Feature | Status | Description |
|---------|--------|-------------|
| 🏠 **Community Feed** | ✅ Live | Share PRs, workouts & achievements |
| 🤖 **AI Coach** | ✅ Live | Personalized VBT recommendations |
| 📊 **VBT Analytics** | ✅ Live | Real-time velocity analysis |
| 🏆 **Leaderboards** | ✅ Live | Weekly community rankings |
| 💬 **Real-time Chat** | 🚧 Beta | Live community discussions |
| 📅 **Events & Challenges** | ✅ Live | Monthly competitions |
| 📱 **Mobile App** | 🔄 Coming | iOS & Android companion |

---

## 🛠️ **Tech Stack**

```
Frontend  → React 18 + Tailwind CSS + Framer Motion
Backend   → Node.js + Express + Socket.IO  
Database  → PostgreSQL + Redis Cache
Auth      → JWT + bcrypt + OAuth2
AI/ML     → Python + TensorFlow (VBT Analysis)
DevOps    → Docker + GitHub Actions + Vercel
```

---

## 📁 **Project Structure**

```
prometheus-community/
├── 📦 client/                    # React Frontend (Port 3000)
│   ├── public/
│   ├── src/
│   │   ├── components/          # UI Components
│   │   ├── pages/              # Route Pages  
│   │   ├── hooks/              # Custom Hooks
│   │   ├── services/           # API Services
│   │   └── utils/              # Helper Functions
│   └── package.json
├── 🚀 server/                    # Node.js Backend (Port 5000)
│   ├── src/
│   │   ├── controllers/        # Route Controllers
│   │   ├── middleware/         # Auth & Validation
│   │   ├── models/            # Database Models
│   │   ├── routes/            # API Routes
│   │   └── services/          # Business Logic
│   └── package.json
├── 🗄️ database/                  # Database Scripts
│   ├── migrations/            # Schema Changes
│   ├── seeds/                 # Test Data
│   └── schema.sql            # Initial Schema
├── 🤖 ai-engine/                 # Python VBT Analysis
│   ├── models/               # ML Models
│   ├── api/                  # FastAPI Server
│   └── requirements.txt
├── 📚 docs/                      # Documentation
├── 🐳 docker-compose.yml         # Development Environment
├── 🔧 package.json              # Root Scripts
└── 📋 README.md                 # This File
```

---

## ⚙️ **Installation**

### Prerequisites
```bash
node --version    # v18+ required
npm --version     # v8+ required  
docker --version  # v20+ recommended
```

### 1️⃣ **Clone & Setup**
```bash
git clone https://github.com/your-username/prometheus-community.git
cd prometheus-community
npm run setup:all    # Installs all dependencies
```

### 2️⃣ **Environment Setup**
```bash
cp server/.env.example server/.env
cp ai-engine/.env.example ai-engine/.env
# Edit .env files with your credentials
```

### 3️⃣ **Database Setup**
```bash
# With Docker (Recommended)
docker-compose up -d postgres redis

# Or Manual Setup
createdb prometheus_community
npm run db:migrate
npm run db:seed
```

### 4️⃣ **Start Development**
```bash
# All services in one command
npm run dev

# Or individual services
npm run dev:client    # Frontend only
npm run dev:server    # Backend only  
npm run dev:ai        # AI Engine only
```

---

## 🌐 **API Documentation**

### Authentication
```http
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
```

### User Management
```http
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users/stats
```

### Workouts & VBT
```http
POST   /api/workouts
GET    /api/workouts/history
POST   /api/vbt/analyze
GET    /api/vbt/recommendations
```

### Community
```http
GET    /api/feed
POST   /api/posts
GET    /api/leaderboard
GET    /api/challenges
```

**📖 Full API Docs:** [docs/API.md](./docs/API.md)

---

## 🎨 **Design System**

### Color Palette
```css
--prometheus-orange: #ff6600     /* Primary Brand */
--prometheus-orange-dark: #e55a00  /* Hover States */
--prometheus-dark: #0a0a0a        /* Background */
--prometheus-card: #111111        /* Cards */
--prometheus-border: #333333      /* Borders */
```

### Typography
```css
font-family: 'Inter', 'SF Pro Display', system-ui;
font-weights: 400, 500, 600, 700, 800
```

**🎨 Design Tokens:** [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md)

---

## 🧪 **Testing**

```bash
# Frontend Tests
npm run test:client

# Backend Tests  
npm run test:server

# E2E Tests
npm run test:e2e

# Coverage Report
npm run test:coverage
```

---

## 🚀 **Deployment**

### Production Build
```bash
npm run build           # Build all services
npm run deploy:staging  # Deploy to staging
npm run deploy:prod     # Deploy to production
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment URLs
- **Development:** http://localhost:3000
- **Staging:** https://staging.prometheuscommunity.com  
- **Production:** https://prometheuscommunity.com

---

## 🤝 **Contributing**

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/awesome-feature`)
3. **Commit** changes (`git commit -m 'Add awesome feature'`)
4. **Push** to branch (`git push origin feature/awesome-feature`)
5. **Open** Pull Request

**📋 Contribution Guide:** [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📊 **Performance**

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.2s | ✅ 0.8s |
| Time to Interactive | < 2.5s | ✅ 1.9s |
| Lighthouse Score | > 90 | ✅ 96/100 |
| Bundle Size | < 250kb | ✅ 180kb |

---

## 🏆 **Team**

| Role | Name | GitHub |
|------|------|--------|
| **Lead Developer** | Daniele Pauli | [@danielepauli](https://github.com/danielepauli) |
| **AI Engineer** | Coming Soon | - |
| **Designer** | Coming Soon | - |

---

## 📄 **License**

This project is licensed under the **MIT License** - see [LICENSE](./LICENSE) file.

---

## 🔗 **Links**

- 🌐 **Website:** [prometheuscommunity.com](https://prometheuscommunity.com)
- 📱 **App Store:** Coming Soon
- 🐦 **Twitter:** [@PrometheusAI](https://twitter.com/PrometheusAI)
- 💬 **Discord:** [Join Community](https://discord.gg/prometheus)
- 📧 **Email:** hello@prometheuscommunity.com

---

<div align="center">

**Made with ⚡ by the Prometheus Team**

*Empowering athletes through AI-driven strength training*

[![Stars](https://img.shields.io/github/stars/danielepauli/prometheus-community?style=social)](https://github.com/danielepauli/prometheus-community)
[![Forks](https://img.shields.io/github/forks/danielepauli/prometheus-community?style=social)](https://github.com/danielepauli/prometheus-community)

</div>
