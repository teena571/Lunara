const express = require('express');
const { body, query } = require('express-validator');
const {
  getCycles,
  getCycle,
  createCycle,
  updateCycle,
  deleteCycle,
  getCycleStats
} = require('../controllers/cycleController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const { rateLimitStrict } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Stats route (before /:id to avoid conflict)
router.get('/stats', getCycleStats);

// Main routes
router
  .route('/')
  .get(
    [
      query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
      query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
      query('startDate').optional().isISO8601().withMessage('Invalid start date format'),
      query('endDate').optional().isISO8601().withMessage('Invalid end date format'),
      validate
    ],
    getCycles
  )
  .post(
    rateLimitStrict,
    [
      body('startDate').isISO8601().withMessage('Valid start date is required'),
      body('endDate').optional().isISO8601().withMessage('Invalid end date format'),
      body('cycleLength').optional().isInt({ min: 20, max: 45 }).withMessage('Cycle length must be between 20 and 45 days'),
      body('periodLength').optional().isInt({ min: 1, max: 10 }).withMessage('Period length must be between 1 and 10 days'),
      body('flow').optional().isIn(['light', 'medium', 'heavy']).withMessage('Flow must be light, medium, or heavy'),
      body('symptoms').optional().isArray().withMessage('Symptoms must be an array'),
      body('symptoms.*').optional().isIn(['cramps', 'headache', 'bloating', 'mood_swings', 'fatigue', 'acne', 'breast_tenderness', 'back_pain', 'nausea', 'other']).withMessage('Invalid symptom'),
      body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
      validate
    ],
    createCycle
  );

router
  .route('/:id')
  .get(getCycle)
  .put(
    rateLimitStrict,
    [
      body('startDate').optional().isISO8601().withMessage('Invalid start date format'),
      body('endDate').optional().isISO8601().withMessage('Invalid end date format'),
      body('cycleLength').optional().isInt({ min: 20, max: 45 }).withMessage('Cycle length must be between 20 and 45 days'),
      body('periodLength').optional().isInt({ min: 1, max: 10 }).withMessage('Period length must be between 1 and 10 days'),
      body('flow').optional().isIn(['light', 'medium', 'heavy']).withMessage('Flow must be light, medium, or heavy'),
      body('symptoms').optional().isArray().withMessage('Symptoms must be an array'),
      body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
      validate
    ],
    updateCycle
  )
  .delete(rateLimitStrict, deleteCycle);

module.exports = router;
