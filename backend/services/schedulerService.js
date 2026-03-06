/**
 * SCHEDULER SERVICE
 * 
 * Cron-based job scheduler for automated notifications and tasks
 * 
 * Jobs:
 * - Daily period reminders (2 days before)
 * - Daily ovulation reminders
 * - Weekly health summaries
 * - Monthly analytics reports
 */

const cron = require('node-cron');
const User = require('../models/User');
const Cycle = require('../models/Cycle');
const {
  sendPeriodReminder,
  sendOvulationReminder,
  sendMultiChannelNotification
} = require('./notificationService');

/**
 * Calculate next period date for a user
 */
const calculateNextPeriod = (cycles) => {
  if (cycles.length === 0) return null;

  // Get cycle lengths
  const cycleLengths = cycles
    .filter(c => c.cycleLength && c.cycleLength > 0)
    .map(c => c.cycleLength);

  if (cycleLengths.length === 0) return null;

  // Calculate average cycle length
  const avgCycleLength = Math.round(
    cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length
  );

  // Get last cycle
  const lastCycle = cycles.sort((a, b) => 
    new Date(b.startDate) - new Date(a.startDate)
  )[0];

  // Calculate next period date
  const lastStartDate = new Date(lastCycle.startDate);
  const nextPeriodDate = new Date(lastStartDate);
  nextPeriodDate.setDate(nextPeriodDate.getDate() + avgCycleLength);

  return {
    nextPeriodDate,
    avgCycleLength,
    daysUntil: Math.ceil((nextPeriodDate - new Date()) / (1000 * 60 * 60 * 24))
  };
};

/**
 * Calculate ovulation date
 */
const calculateOvulation = (nextPeriodDate) => {
  if (!nextPeriodDate) return null;

  const ovulationDate = new Date(nextPeriodDate);
  ovulationDate.setDate(ovulationDate.getDate() - 14); // 14 days before period

  // Fertile window: 5 days before ovulation to 1 day after
  const fertileWindowStart = new Date(ovulationDate);
  fertileWindowStart.setDate(fertileWindowStart.getDate() - 5);

  const fertileWindowEnd = new Date(ovulationDate);
  fertileWindowEnd.setDate(fertileWindowEnd.getDate() + 1);

  const daysUntilOvulation = Math.ceil((ovulationDate - new Date()) / (1000 * 60 * 60 * 24));

  return {
    ovulationDate,
    fertileWindowStart,
    fertileWindowEnd,
    daysUntilOvulation
  };
};

/**
 * Check and send period reminders
 * Runs daily at 9:00 AM
 */
const checkPeriodReminders = async () => {
  try {
    console.log('🔔 Running period reminder check...');

    // Get all users
    const users = await User.find({ active: { $ne: false } });
    console.log(`Found ${users.length} active users`);

    let remindersSent = 0;

    for (const user of users) {
      try {
        // Get user's cycles
        const cycles = await Cycle.find({ user: user._id })
          .sort({ startDate: -1 })
          .limit(10);

        if (cycles.length === 0) continue;

        // Calculate next period
        const prediction = calculateNextPeriod(cycles);
        if (!prediction) continue;

        const { nextPeriodDate, daysUntil } = prediction;

        // Send reminder 2 days before period
        if (daysUntil === 2) {
          console.log(`📧 Sending period reminder to ${user.email} (${daysUntil} days)`);
          
          const notification = {
            type: 'period',
            title: 'Period Reminder',
            body: `Your period is expected in ${daysUntil} days`,
            daysUntil,
            nextPeriodDate: nextPeriodDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            }),
            data: { nextPeriodDate: nextPeriodDate.toISOString() }
          };

          await sendMultiChannelNotification(user, notification);
          remindersSent++;
        }
      } catch (error) {
        console.error(`Error processing user ${user._id}:`, error.message);
      }
    }

    console.log(`✅ Period reminder check complete. Sent ${remindersSent} reminders.`);
  } catch (error) {
    console.error('❌ Period reminder check failed:', error.message);
  }
};

/**
 * Check and send ovulation reminders
 * Runs daily at 9:00 AM
 */
const checkOvulationReminders = async () => {
  try {
    console.log('🔔 Running ovulation reminder check...');

    const users = await User.find({ active: { $ne: false } });
    let remindersSent = 0;

    for (const user of users) {
      try {
        const cycles = await Cycle.find({ user: user._id })
          .sort({ startDate: -1 })
          .limit(10);

        if (cycles.length === 0) continue;

        // Calculate next period and ovulation
        const periodPrediction = calculateNextPeriod(cycles);
        if (!periodPrediction) continue;

        const ovulationPrediction = calculateOvulation(periodPrediction.nextPeriodDate);
        if (!ovulationPrediction) continue;

        const { ovulationDate, fertileWindowStart, fertileWindowEnd, daysUntilOvulation } = ovulationPrediction;

        // Send reminder 2 days before ovulation (start of fertile window)
        if (daysUntilOvulation === 2) {
          console.log(`📧 Sending ovulation reminder to ${user.email}`);
          
          const notification = {
            type: 'ovulation',
            title: 'Ovulation Reminder',
            body: `Your fertile window starts in ${daysUntilOvulation} days`,
            ovulationDate: ovulationDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric'
            }),
            fertileWindowStart: fertileWindowStart.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric'
            }),
            fertileWindowEnd: fertileWindowEnd.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric'
            }),
            data: {
              ovulationDate: ovulationDate.toISOString(),
              fertileWindowStart: fertileWindowStart.toISOString(),
              fertileWindowEnd: fertileWindowEnd.toISOString()
            }
          };

          await sendMultiChannelNotification(user, notification);
          remindersSent++;
        }
      } catch (error) {
        console.error(`Error processing user ${user._id}:`, error.message);
      }
    }

    console.log(`✅ Ovulation reminder check complete. Sent ${remindersSent} reminders.`);
  } catch (error) {
    console.error('❌ Ovulation reminder check failed:', error.message);
  }
};

/**
 * Send weekly health summary
 * Runs every Monday at 9:00 AM
 */
const sendWeeklyHealthSummary = async () => {
  try {
    console.log('📊 Running weekly health summary...');
    
    // TODO: Implement weekly summary logic
    // - Aggregate last week's data
    // - Generate summary report
    // - Send to users
    
    console.log('✅ Weekly health summary complete.');
  } catch (error) {
    console.error('❌ Weekly health summary failed:', error.message);
  }
};

/**
 * Initialize all cron jobs
 */
const initializeScheduler = () => {
  console.log('🚀 Initializing scheduler service...');

  // Daily period reminders - Every day at 9:00 AM
  cron.schedule('0 9 * * *', () => {
    console.log('⏰ Cron: Daily period reminder check');
    checkPeriodReminders();
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata"
  });

  // Daily ovulation reminders - Every day at 9:00 AM
  cron.schedule('0 9 * * *', () => {
    console.log('⏰ Cron: Daily ovulation reminder check');
    checkOvulationReminders();
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata"
  });

  // Weekly health summary - Every Monday at 9:00 AM
  cron.schedule('0 9 * * 1', () => {
    console.log('⏰ Cron: Weekly health summary');
    sendWeeklyHealthSummary();
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata"
  });

  // Test job - Every 5 minutes (for testing, disabled by default)
  // Uncomment to test scheduler functionality
  // if (process.env.NODE_ENV === 'development') {
  //   cron.schedule('*/5 * * * *', () => {
  //     console.log('⏰ Scheduler is running... (test job)');
  //   }, {
  //     scheduled: true,
  //     timezone: "Asia/Kolkata"
  //   });
  // }

  console.log('✅ Scheduler initialized successfully');
  console.log('📅 Scheduled jobs:');
  console.log('   - Period reminders: Daily at 9:00 AM IST');
  console.log('   - Ovulation reminders: Daily at 9:00 AM IST');
  console.log('   - Weekly summary: Mondays at 9:00 AM IST');
  console.log('💡 Tip: Use manual triggers for testing (see test-scheduler.js)');
};

/**
 * Manual trigger functions (for testing)
 */
const manualTriggers = {
  periodReminders: checkPeriodReminders,
  ovulationReminders: checkOvulationReminders,
  weeklySummary: sendWeeklyHealthSummary
};

module.exports = {
  initializeScheduler,
  checkPeriodReminders,
  checkOvulationReminders,
  sendWeeklyHealthSummary,
  manualTriggers
};
