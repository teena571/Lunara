const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  downloadHealthReport,
  previewHealthReport
} = require('../controllers/reportController');

/**
 * @route   GET /api/v1/reports/health-report
 * @desc    Download PDF health report
 * @access  Private
 */
router.get('/health-report', protect, downloadHealthReport);

/**
 * @route   GET /api/v1/reports/health-report/preview
 * @desc    Preview PDF health report in browser
 * @access  Private
 */
router.get('/health-report/preview', protect, previewHealthReport);

module.exports = router;
