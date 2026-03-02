const mongoose = require('mongoose');

const SymptomSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
    default: Date.now
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'anxious', 'irritable', 'calm', 'energetic', 'tired', 'neutral']
  },
  energy: {
    type: Number,
    min: [1, 'Energy level must be between 1 and 10'],
    max: [10, 'Energy level must be between 1 and 10']
  },
  symptoms: [{
    type: String,
    enum: ['cramps', 'headache', 'bloating', 'mood_swings', 'fatigue', 'acne', 'breast_tenderness', 'back_pain', 'nausea', 'insomnia', 'appetite_changes', 'other']
  }],
  severity: {
    type: String,
    enum: ['mild', 'moderate', 'severe'],
    default: 'mild'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
SymptomSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Symptom', SymptomSchema);
