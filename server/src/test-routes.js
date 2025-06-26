// server/src/test-routes.js
const express = require('express');

console.log('Testing route imports...');

try {
  console.log('Testing auth routes...');
  const authRoutes = require('./routes/auth');
  console.log('Auth routes OK:', typeof authRoutes);
} catch (e) {
  console.error('Auth routes error:', e.message);
}

try {
  console.log('Testing user routes...');
  const userRoutes = require('./routes/users');
  console.log('User routes OK:', typeof userRoutes);
} catch (e) {
  console.error('User routes error:', e.message);
}

try {
  console.log('Testing post routes...');
  const postRoutes = require('./routes/posts');
  console.log('Post routes OK:', typeof postRoutes);
} catch (e) {
  console.error('Post routes error:', e.message);
}

try {
  console.log('Testing event routes...');
  const eventRoutes = require('./routes/events');
  console.log('Event routes OK:', typeof eventRoutes);
} catch (e) {
  console.error('Event routes error:', e.message);
}

try {
  console.log('Testing challenge routes...');
  const challengeRoutes = require('./routes/challenges');
  console.log('Challenge routes OK:', typeof challengeRoutes);
} catch (e) {
  console.error('Challenge routes error:', e.message);
}

try {
  console.log('Testing message routes...');
  const messageRoutes = require('./routes/messages');
  console.log('Message routes OK:', typeof messageRoutes);
} catch (e) {
  console.error('Message routes error:', e.message);
}

console.log('Route testing complete.');
