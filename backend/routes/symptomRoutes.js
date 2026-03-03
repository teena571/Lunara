const express = require('express');
const { body, query } = require('express-validator');
const {
  getSymptoms,
  getSymptom,
  createSymptom,
  updateSymptom,
  deleteSymptom
} = require('../controllers/symptomController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const { rateLimitStrict } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

router
  .route('/')
  .get(getSymptoms)  // Remove validation for simple GET request
  .post(
    rateLimitStrict,
    [
      body('date').optional().isISO8601().withMessage('Invalid date format'),
      body('mood').optional().isIn(['happy', 'sad', 'anxious', 'irritable', 'calm', 'energetic', 'tired', 'neutral']).withMessage('Invalid mood'),
      body('energy').optional().isInt({ min: 1, max: 10 }).withMessage('Energy must be between 1 and 10'),
      body('symptoms').optional().isArray().withMessage('Symptoms must be an array'),
      body('symptoms.*').optional().isIn(['cramps', 'headache', 'bloating', 'mood_swings', 'fatigue', 'acne', 'breast_tenderness', 'back_pain', 'nausea', 'insomnia', 'appetite_changes', 'other']).withMessage('Invalid symptom'),
      body('severity').optional().isIn(['mild', 'moderate', 'severe']).withMessage('Severity must be mild, moderate, or severe'),
      body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
      validate
    ],
    createSymptom
  );

router
  .route('/:id')
  .get(getSymptom)
  .put(
    rateLimitStrict,
    [
      body('date').optional().isISO8601().withMessage('Invalid date format'),
      body('mood').optional().isIn(['happy', 'sad', 'anxious', 'irritable', 'calm', 'energetic', 'tired', 'neutral']).withMessage('Invalid mood'),
      body('energy').optional().isInt({ min: 1, max: 10 }).withMessage('Energy must be between 1 and 10'),
      body('symptoms').optional().isArray().withMessage('Symptoms must be an array'),
      body('severity').optional().isIn(['mild', 'moderate', 'severe']).withMessage('Severity must be mild, moderate, or severe'),
      body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
      validate
    ],
    updateSymptom
  )
  .delete(rateLimitStrict, deleteSymptom);

module.exports = router;
