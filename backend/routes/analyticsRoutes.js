const express = require('express');
const {
  getMonthlyAverageCycleLength,
  getMoodDistribution,
  getFlowIntensityStats,
  getIrregularityTrend,
  getDashboardAnalytics,
  getSymptomCorrelation
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Analytics routes
router.get('/monthly-average', getMonthlyAverageCycleLength);
router.get('/mood-distribution', getMoodDistribution);
router.get('/flow-intensity', getFlowIntensityStats);
router.get('/irregularity-trend', getIrregularityTrend);
router.get('/dashboard', getDashboardAnalytics);
router.get('/symptom-correlation', getSymptomCorrelation);

module.exports = router;
