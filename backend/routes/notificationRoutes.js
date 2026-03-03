const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { manualTriggers } = require('../services/schedulerService');

/**
 * @route   POST /api/v1/notifications/test/period-reminders
 * @desc    Manually trigger period reminder check (for testing)
 * @access  Private
 */
router.post('/test/period-reminders', protect, async (req, res) => {
  try {
    await manualTriggers.periodReminders();
    res.status(200).json({
      success: true,
      message: 'Period reminder check triggered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to trigger period reminders',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/v1/notifications/test/ovulation-reminders
 * @desc    Manually trigger ovulation reminder check (for testing)
 * @access  Private
 */
router.post('/test/ovulation-reminders', protect, async (req, res) => {
  try {
    await manualTriggers.ovulationReminders();
    res.status(200).json({
      success: true,
      message: 'Ovulation reminder check triggered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to trigger ovulation reminders',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/v1/notifications/test/weekly-summary
 * @desc    Manually trigger weekly health summary (for testing)
 * @access  Private
 */
router.post('/test/weekly-summary', protect, async (req, res) => {
  try {
    await manualTriggers.weeklySummary();
    res.status(200).json({
      success: true,
      message: 'Weekly health summary triggered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to trigger weekly summary',
      error: error.message
    });
  }
});

module.exports = router;
