const mongoose = require('mongoose');

const CycleSchema = new mongoose.Schema({
  // User Reference
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    index: true
  },

  // Period Dates
  periodStartDate: {
    type: Date,
    required: [true, 'Period start date is required'],
    index: true
  },
  periodEndDate: {
    type: Date,
    validate: {
      validator: function(value) {
        if (!value) return true; // Optional field
        return value > this.periodStartDate;
      },
      message: 'Period end date must be after start date'
    }
  },

  // Flow Intensity
  flowIntensity: {
    type: String,
    enum: {
      values: ['light', 'medium', 'heavy'],
      message: '{VALUE} is not a valid flow intensity'
    },
    required: [true, 'Flow intensity is required'],
    default: 'medium'
  },

  // Daily Flow Tracking (optional detailed tracking)
  dailyFlow: [{
    date: {
      type: Date,
      required: true
    },
    intensity: {
      type: String,
      enum: ['spotting', 'light', 'medium', 'heavy', 'very_heavy']
    }
  }],

  // Mood Tracking
  mood: [{
    type: String,
    enum: [
      'happy',
      'sad',
      'anxious',
      'irritable',
      'calm',
      'energetic',
      'tired',
      'emotional',
      'stressed',
      'content',
      'angry',
      'neutral'
    ]
  }],

  // Symptoms
  symptoms: [{
    type: String,
    enum: [
      'cramps',
      'headache',
      'migraine',
      'bloating',
      'mood_swings',
      'fatigue',
      'acne',
      'breast_tenderness',
      'back_pain',
      'nausea',
      'diarrhea',
      'constipation',
      'insomnia',
      'appetite_changes',
      'hot_flashes',
      'dizziness',
      'joint_pain',
      'muscle_aches',
      'other'
    ]
  }],

  // Symptom Severity (optional detailed tracking)
  symptomDetails: [{
    symptom: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    },
    notes: String
  }],

  // Cycle Length (auto-calculated)
  cycleLength: {
    type: Number,
    min: [20, 'Cycle length must be at least 20 days'],
    max: [45, 'Cycle length cannot exceed 45 days']
  },

  // Period Length (auto-calculated)
  periodLength: {
    type: Number,
    min: [1, 'Period length must be at least 1 day'],
    max: [10, 'Period length cannot exceed 10 days']
  },

  // Additional Tracking
  energyLevel: {
    type: Number,
    min: 1,
    max: 10
  },

  sleepQuality: {
    type: String,
    enum: ['poor', 'fair', 'good', 'excellent']
  },

  exerciseLevel: {
    type: String,
    enum: ['none', 'light', 'moderate', 'intense']
  },

  // Notes
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    trim: true
  },

  // Predictions
  predictedNextPeriod: {
    type: Date
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==================== INDEXES ====================

// Compound index for user queries (most common)
CycleSchema.index({ user: 1, periodStartDate: -1 });

// Index for date range queries
CycleSchema.index({ user: 1, periodStartDate: 1, periodEndDate: 1 });

// Index for analytics queries
CycleSchema.index({ user: 1, createdAt: -1 });

// Index for active cycles
CycleSchema.index({ user: 1, isActive: 1 });

// ==================== VIRTUALS ====================

// Calculate period duration in days
CycleSchema.virtual('periodDuration').get(function() {
  if (this.periodEndDate && this.periodStartDate) {
    const diff = this.periodEndDate - this.periodStartDate;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Check if period is ongoing
CycleSchema.virtual('isOngoing').get(function() {
  return !this.periodEndDate || this.periodEndDate > new Date();
});

// ==================== MIDDLEWARE ====================

// Pre-save: Auto-calculate period length
CycleSchema.pre('save', function(next) {
  // Calculate period length if both dates exist
  if (this.periodStartDate && this.periodEndDate) {
    const diff = this.periodEndDate - this.periodStartDate;
    this.periodLength = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // Update timestamp
  this.updatedAt = Date.now();
  
  next();
});

// Pre-save: Validate mood array
CycleSchema.pre('save', function(next) {
  if (this.mood && this.mood.length > 10) {
    next(new Error('Cannot have more than 10 mood entries'));
  }
  next();
});

// Pre-save: Validate symptoms array
CycleSchema.pre('save', function(next) {
  if (this.symptoms && this.symptoms.length > 15) {
    next(new Error('Cannot have more than 15 symptom entries'));
  }
  next();
});

// ==================== STATIC METHODS ====================

// Get user's cycle history
CycleSchema.statics.getUserCycles = function(userId, limit = 10) {
  return this.find({ user: userId, isActive: true })
    .sort('-periodStartDate')
    .limit(limit)
    .select('-__v');
};

// Get cycles within date range
CycleSchema.statics.getCyclesByDateRange = function(userId, startDate, endDate) {
  return this.find({
    user: userId,
    periodStartDate: { $gte: startDate, $lte: endDate }
  }).sort('-periodStartDate');
};

// Calculate average cycle length
CycleSchema.statics.getAverageCycleLength = async function(userId) {
  const result = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId), cycleLength: { $exists: true } } },
    { $group: { _id: null, avgLength: { $avg: '$cycleLength' } } }
  ]);
  return result[0]?.avgLength || null;
};

// Calculate average period length
CycleSchema.statics.getAveragePeriodLength = async function(userId) {
  const result = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId), periodLength: { $exists: true } } },
    { $group: { _id: null, avgLength: { $avg: '$periodLength' } } }
  ]);
  return result[0]?.avgLength || null;
};

// Get most common symptoms
CycleSchema.statics.getCommonSymptoms = async function(userId, limit = 5) {
  const result = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    { $unwind: '$symptoms' },
    { $group: { _id: '$symptoms', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);
  return result;
};

// Get most common moods
CycleSchema.statics.getCommonMoods = async function(userId, limit = 5) {
  const result = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    { $unwind: '$mood' },
    { $group: { _id: '$mood', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);
  return result;
};

// ==================== INSTANCE METHODS ====================

// Calculate next predicted period
CycleSchema.methods.predictNextPeriod = async function() {
  const avgCycleLength = await this.constructor.getAverageCycleLength(this.user);
  if (avgCycleLength && this.periodStartDate) {
    const nextDate = new Date(this.periodStartDate);
    nextDate.setDate(nextDate.getDate() + Math.round(avgCycleLength));
    return nextDate;
  }
  return null;
};

// Check if cycle is regular
CycleSchema.methods.isRegular = async function() {
  const cycles = await this.constructor.find({ 
    user: this.user,
    cycleLength: { $exists: true }
  }).sort('-periodStartDate').limit(3);

  if (cycles.length < 3) return null;

  const lengths = cycles.map(c => c.cycleLength);
  const avg = lengths.reduce((a, b) => a + b) / lengths.length;
  const variance = lengths.every(l => Math.abs(l - avg) <= 3);

  return variance;
};

module.exports = mongoose.model('CycleEnhanced', CycleSchema);
