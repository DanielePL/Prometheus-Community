// Test MongoDB connection
const mongoose = require('mongoose');

const uri = 'mongodb+srv://Prometheuscommunity:k6D4ctK8E097pb25@db-mongodb-sgp1-73815-ccd0650d.mongo.ondigitalocean.com/Prometheus_Community?tls=true&authSource=admin&retryWrites=true&w=majority';

console.log('Testing MongoDB connection...');
console.log('URI:', uri.replace(/:[^:@]*@/, ':***@'));

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 15000,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully!');
  return mongoose.connection.db.admin().ping();
})
.then(() => {
  console.log('✅ MongoDB ping successful!');
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB connection failed:');
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  if (err.reason) {
    console.error('Error reason:', err.reason);
  }
  process.exit(1);
});

// Set a timeout to exit if connection takes too long
setTimeout(() => {
  console.error('❌ Connection test timed out after 20 seconds');
  process.exit(1);
}, 20000);
