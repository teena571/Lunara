const mongoose = require('mongoose');

const CycleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  cycleLength: {
    type: Number,
    min: [20, 'Cycle length must be at least 20 days'],
    max: [45, 'Cycle length cannot exceed 45 days']
  },
  periodLength: {
    type: Number,
    min: [1, 'Period length must be at least 1 day'],
    max: [10, 'Period length cannot exceed 10 days']
  },
  flow: {
    type: String,
    enum: ['light', 'medium', 'heavy'],
    default: 'medium'
  },
  symptoms: [{
    type: String,
    enum: ['cramps', 'headache', 'bloating', 'mood_swings', 'fatigue', 'acne', 'breast_tenderness', 'back_pain', 'nausea', 'other']
  }],
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
CycleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Prevent user from accessing other users' data
CycleSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Cycle', CycleSchema);
