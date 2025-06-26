// server/src/simple-server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3005', 'http://localhost:3009'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Mock user data
const mockUsers = [
  {
    id: 1,
    email: 'admin@prometheuscommunity.com',
    password: '$2a$12$Hn8C2CjukVrKDtHyP.yDyOUS84CfpMyRXShY5X5C2qPzH.o52kvBi', // admin123
    firstName: 'Admin',
    lastName: 'User',
    username: 'admin',
    role: 'admin'
  }
];

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '30d' }
    );

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, username } = req.body;

    // Check if user exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      username,
      role: 'user'
    };

    mockUsers.push(newUser);

    // Create JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '30d' }
    );

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Auth middleware
const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    
    const user = mockUsers.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

app.get('/api/auth/me', auth, (req, res) => {
  const { password: _, ...userWithoutPassword } = req.user;
  res.json({
    success: true,
    user: userWithoutPassword
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Simple server is working!',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api`);
  console.log(`🔐 Demo login: admin@prometheuscommunity.com / admin123`);
});

module.exports = app;
