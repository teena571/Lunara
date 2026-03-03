/**
 * SCHEDULER TEST SCRIPT
 * 
 * Quick test to verify scheduler functionality without waiting for cron jobs
 * 
 * Usage: node test-scheduler.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { 
  checkPeriodReminders, 
  checkOvulationReminders 
} = require('./services/schedulerService');

// Connect to database
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    runTests();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

async function runTests() {
  console.log('\n🧪 Testing Scheduler Functions...\n');

  try {
    // Test period reminders
    console.log('1️⃣ Testing Period Reminders...');
    await checkPeriodReminders();
    console.log('');

    // Test ovulation reminders
    console.log('2️⃣ Testing Ovulation Reminders...');
    await checkOvulationReminders();
    console.log('');

    console.log('✅ All tests completed!');
    console.log('\nNote: If no reminders were sent, it means:');
    console.log('  - No users have cycles logged, OR');
    console.log('  - No users are exactly 2 days away from period/ovulation');
    console.log('\nTo test with real data:');
    console.log('  1. Create a user account');
    console.log('  2. Log cycles with dates that predict period in 2 days');
    console.log('  3. Run this script again');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  }
}
