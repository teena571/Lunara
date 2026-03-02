const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

// Test database connection
beforeAll(async () => {
  // Use test database
  const testDbUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/lunara_test';
  await mongoose.connect(testDbUri);
});

// Clean up after each test
afterEach(async () => {
  await User.deleteMany({});
});

// Close database connection
afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /api/v1/auth/log