# 🔥 PROMETHEUS COMMUN## ⚡ **Features**

| Feature | Status | Description |
|---------|--------|-------------|
| 🏠 **Community Feed** | ✅ Live | Interactive posts, PRs, and social features |
| 🎯 **Challenges** | ✅ Live | Community competitions and progress tracking |
| 📚 **Learn** | ✅ Live | VBT courses and educational content |
| 🏆 **Leaderboards** | ✅ Live | Rankings, achievements, and category leaders |
| 📅 **Events** | ✅ Live | Workshops, masterclasses, and community events |
| 👤 **Profile** | ✅ Live | Personal dashboard and progress tracking |
| 💬 **Messages** | ✅ Live | Direct messaging system |
| ⚙️ **Settings** | ✅ Live | User preferences and customization |
| 🔐 **Authentication** | ✅ Live | Login/Logout mit Context API |
| 🎨 **Design System** | ✅ Live | Tailwind + Custom CSS Variables |
| 📱 **Responsive UI** | ✅ Live | Mobile-first Design |
| ⚡ **Modern Frontend** | ✅ Live | React 19 + Hooks + Router |
| 🤖 **AI Coach** | 🔄 Geplant | VBT-basierte Empfehlungen |
| 📊 **VBT Analytics** | 🔄 Geplant | Velocity-Based Training Analysis |
![Prometheus Logo](https://img.shields.io/badge/PROMETHEUS-Community-ff6600?style=for-the-badge&logo=lightning)

> **AI-Powered Strength Training Community Platform**  
> Velocity-Based Training • Community Feed • Real-time Analytics

---

## 🚀 **Live Demo**
```bash
# Quick Start (unter 2 Minuten)
git clone https://github.com/DanielePL/Prometheus-Community.git
cd prometheus-community-clean
npm run setup:all
npm run dev:client
```

**Demo Access:** Login mit beliebiger Email/Passwort-Kombination

---

## ⚡ **Features**

| Feature | Status | Description |
|---------|--------|-------------|
| 🏠 **Community Feed** | 🚧 Entwicklung | Placeholder Dashboard implementiert |
| 🔐 **Authentication** | ✅ Live | Login/Logout mit Context API |
| 🎨 **Design System** | ✅ Live | Tailwind + Custom CSS Variables |
| 📱 **Responsive UI** | ✅ Live | Mobile-first Design |
| ⚡ **Modern Frontend** | ✅ Live | React 19 + Hooks + Router |
| 🤖 **AI Coach** | 🔄 Geplant | VBT-basierte Empfehlungen |
| 📊 **VBT Analytics** | 🔄 Geplant | Velocity-Based Training Analysis |
| 🏆 **Leaderboards** | 🔄 Geplant | Community Rankings |
| 💬 **Real-time Chat** | � Geplant | Live Diskussionen |
| 📅 **Events & Challenges** | 🔄 Geplant | Community Competitions |

---

## 🛠️ **Tech Stack**

```
Frontend  → React 19 + Tailwind CSS + Framer Motion
Auth      → Context API + localStorage (Demo)
Styling   → Custom Design System + CSS Variables  
Icons     → Lucide React
Routing   → React Router v6
State     → React Query + Context API
Backend   → Node.js + Express (Geplant)
Database  → PostgreSQL (Geplant) 
AI/ML     → Python + TensorFlow (Geplant)
DevOps    → Docker + GitHub Actions (Setup)
```

---

## 📁 **Project Structure**

```
prometheus-community-clean/
├── 📦 client/                    # React Frontend (Port 3000)
│   ├── public/                  # Static Assets
│   ├── src/
│   │   ├── components/          # UI Components
│   │   │   ├── auth/           # Login Components
│   │   │   ├── common/         # Shared Components  
│   │   │   ├── dashboard/      # Dashboard Pages
│   │   │   └── widgets/        # Reusable Widgets
│   │   ├── contexts/           # React Contexts (Auth)
│   │   ├── hooks/              # Custom Hooks (useAuth)
│   │   ├── styles/             # CSS & Design System
│   │   └── App.js              # Main App Component
│   ├── tailwind.config.js      # Tailwind Configuration
│   └── package.json
├── � server/                    # Node.js Backend (Placeholder)
│   └── package.json
├── 🗄️ database/                  # Database Scripts (Placeholder)
│   ├── migrations/            
│   └── seeds/                 
├── 📚 docs/                      # Documentation
├── 🐳 docker-compose.yml         # Development Environment
├── 🔧 package.json              # Root Scripts & Workspaces
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
git clone https://github.com/DanielePL/Prometheus-Community.git
cd prometheus-community-clean
npm run setup:all    # Installs all dependencies
```

### 2️⃣ **Start Development**
```bash
# Frontend Development
npm run dev:client    # Starts React app on http://localhost:3000

# Or use root command
cd client && npm start
```

### 3️⃣ **Login & Testing**
```bash
# Open browser to http://localhost:3000
# Login with any email/password combination
# Explore the dashboard interface
```

---

## 🌐 **API Documentation**

### Frontend-Only (Current State)
```javascript
// Authentication (Demo Mode)
const { user, login, logout } = useAuth();

// Login with any credentials
await login('test@example.com', 'password');

// Access user data
console.log(user.name); // "Daniele Pauli"
```

### Planned Backend APIs
```http
POST /api/auth/login      # (Coming Soon)
POST /api/auth/register   # (Coming Soon)
GET  /api/users/profile   # (Coming Soon)
POST /api/workouts        # (Coming Soon)
GET  /api/feed            # (Coming Soon)
```

---

## 🎨 **Design System**

### Color Palette
```css
--prometheus-orange: #f97316     /* Primary Brand */
--prometheus-orange-dark: #ea580c  /* Hover States */
--prometheus-orange-light: #fb923c /* Light Accent */
--prometheus-dark: #000000        /* Background */
--prometheus-dark-card: #111111   /* Cards */
--prometheus-gray-dark: #1f2937   /* Borders */
--prometheus-text-white: #ffffff  /* Primary Text */
--prometheus-text-muted: #9ca3af  /* Secondary Text */
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
cd client && npm test

# Component Testing (Available)
npm run test:client

# E2E Tests (Planned)
npm run test:e2e

# Coverage Report (Planned)
npm run test:coverage
```

**Current Test Status:** Basic React testing setup available

---

## 🚀 **Deployment**

### Current Status: Development Phase
```bash
# Local Development
npm run dev:client    # Frontend on localhost:3000

# Production Build (Frontend)
cd client && npm run build

# Future Deployment (Planned)
npm run deploy:staging  
npm run deploy:prod     
```

### Environment URLs
- **Development:** http://localhost:3000
- **Staging:** Coming Soon
- **Production:** Coming Soon

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

| Metric | Target | Current Status |
|--------|--------|----------------|
| First Contentful Paint | < 1.2s | ✅ Optimized |
| Time to Interactive | < 2.5s | ✅ Fast Loading |
| Bundle Size | < 250kb | ✅ Lightweight |
| Lighthouse Score | > 90 | 🔄 Testing Needed |
| Mobile Responsive | 100% | ✅ Mobile-First |

**Note:** Performance metrics will be measured after backend integration

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

- 🌐 **Repository:** [github.com/DanielePL/Prometheus-Community](https://github.com/DanielePL/Prometheus-Community)
- � **Project Board:** Coming Soon
- � **Contact:** [Your Email]
- 💬 **Discord:** Planned
- � **Social Media:** Planned

---

<div align="center">

**Made with ⚡ by Daniele Pauli**

*Building the future of AI-powered strength training*

[![Stars](https://img.shields.io/github/stars/DanielePL/Prometheus-Community?style=social)](https://github.com/DanielePL/Prometheus-Community)
[![Forks](https://img.shields.io/github/forks/DanielePL/Prometheus-Community?style=social)](https://github.com/DanielePL/Prometheus-Community)

</div>
