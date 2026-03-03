/**
 * PMS PREDICTION ENGINE
 * 
 * Analyzes past cycles and mood patterns to predict PMS symptoms
 * Uses historical data to identify recurring mood patterns before periods
 */

/**
 * Analyze PMS patterns from historical data
 * @param {Array} cycles - User's cycle history (last 3-4 cycles)
 * @param {Array} moodEntries - User's mood log entries
 * @returns {Object} PMS prediction data
 */
export const analyzePMSPatterns = (cycles, moodEntries) => {
  if (!cycles || cycles.length < 2 || !moodEntries || moodEntries.length === 0) {
    return {
      hasSufficientData: false,
      message: 'Need at least 2 cycles and mood data for PMS prediction'
    };
  }

  // Get last 3-4 cycles for analysis
  const recentCycles = cycles
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    .slice(0, 4);

  // Analyze mood patterns 3-5 days before each period
  const pmsWindow = 5; // days before period
  const pmsPatterns = [];

  recentCycles.forEach(cycle => {
    const periodStart = new Date(cycle.startDate);
    const pmsStart = new Date(periodStart);
    pmsStart.setDate(pmsStart.getDate() - pmsWindow);
    const pmsEnd = new Date(periodStart);
    pmsEnd.setDate(pmsEnd.getDate() - 1); // Day before period

    // Find moods logged during PMS window
    const pmsModds = moodEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= pmsStart && entryDate <= pmsEnd;
    });

    if (pmsModds.length > 0) {
      pmsPatterns.push({
        cycleDate: cycle.startDate,
        moods: pmsModds.map(m => m.mood),
        symptoms: pmsModds.flatMap(m => m.symptoms || [])
      });
    }
  });

  if (pmsPatterns.length < 2) {
    return {
      hasSufficientData: false,
      message: 'Need mood data from at least 2 PMS windows'
    };
  }

  // Count mood frequency across PMS windows
  const moodFrequency = {};
  const symptomFrequency = {};
  
  pmsPatterns.forEach(pattern => {
    pattern.moods.forEach(mood => {
      moodFrequency[mood] = (moodFrequency[mood] || 0) + 1;
    });
    pattern.symptoms.forEach(symptom => {
      symptomFrequency[symptom] = (symptomFrequency[symptom] || 0) + 1;
    });
  });

  // Calculate consistency (60% threshold)
  const totalCycles = pmsPatterns.length;
  const consistencyThreshold = 0.6;

  const recurringMoods = Object.entries(moodFrequency)
    .filter(([_, count]) => count / totalCycles >= consistencyThreshold)
    .map(([mood, count]) => ({
      mood,
      frequency: count,
      percentage: Math.round((count / totalCycles) * 100)
    }))
    .sort((a, b) => b.frequency - a.frequency);

  const recurringSymptoms = Object.entries(symptomFrequency)
    .filter(([_, count]) => count / totalCycles >= consistencyThreshold)
    .map(([symptom, count]) => ({
      symptom,
      frequency: count,
      percentage: Math.round((count / totalCycles) * 100)
    }))
    .sort((a, b) => b.frequency - a.frequency);

  return {
    hasSufficientData: true,
    cyclesAnalyzed: totalCycles,
    recurringMoods,
    recurringSymptoms,
    pmsWindow,
    hasRecurringPatterns: recurringMoods.length > 0 || recurringSymptoms.length > 0
  };
};

/**
 * Predict next PMS window based on cycle predictions
 * @param {Object} predictions - Cycle predictions (from cyclePredictionEngine)
 * @returns {Object} PMS window prediction
 */
export const predictNextPMSWindow = (predictions) => {
  if (!predictions || !predictions.nextPeriodDate) {
    return null;
  }

  const nextPeriod = new Date(predictions.nextPeriodDate);
  const pmsStart = new Date(nextPeriod);
  pmsStart.setDate(pmsStart.getDate() - 5);
  
  const pmsEnd = new Date(nextPeriod);
  pmsEnd.setDate(pmsEnd.getDate() - 1);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const daysUntilPMS = Math.ceil((pmsStart - today) / (1000 * 60 * 60 * 24));
  const isInPMSWindow = today >= pmsStart && today <= pmsEnd;

  return {
    pmsStartDate: pmsStart,
    pmsEndDate: pmsEnd,
    daysUntilPMS,
    isInPMSWindow,
    shouldNotify: daysUntilPMS >= 0 && daysUntilPMS <= 2 // Notify 1-2 days before
  };
};

/**
 * Generate PMS prediction summary
 * @param {Object} pmsAnalysis - Result from analyzePMSPatterns
 * @param {Object} pmsWindow - Result from predictNextPMSWindow
 * @returns {Object} Complete PMS prediction
 */
export const generatePMSPrediction = (pmsAnalysis, pmsWindow) => {
  if (!pmsAnalysis.hasSufficientData) {
    return {
      available: false,
      message: pmsAnalysis.message
    };
  }

  const prediction = {
    available: true,
    hasPatterns: pmsAnalysis.hasRecurringPatterns,
    cyclesAnalyzed: pmsAnalysis.cyclesAnalyzed,
    recurringMoods: pmsAnalysis.recurringMoods,
    recurringSymptoms: pmsAnalysis.recurringSymptoms,
    nextPMSWindow: pmsWindow,
    recommendations: []
  };

  // Generate personalized recommendations
  if (pmsAnalysis.recurringMoods.length > 0) {
    const topMood = pmsAnalysis.recurringMoods[0].mood;
    
    if (topMood === 'anxious' || topMood === 'irritable') {
      prediction.recommendations.push({
        icon: '🧘‍♀️',
        title: 'Practice Relaxation',
        text: 'Try meditation, deep breathing, or yoga to manage anxiety and irritability.'
      });
    }
    
    if (topMood === 'sad' || topMood === 'tired') {
      prediction.recommendations.push({
        icon: '💤',
        title: 'Prioritize Rest',
        text: 'Ensure 7-9 hours of sleep and take breaks when needed.'
      });
    }
  }

  if (pmsAnalysis.recurringSymptoms.some(s => s.symptom === 'cramps')) {
    prediction.recommendations.push({
      icon: '🌡️',
      title: 'Prepare for Cramps',
      text: 'Have heating pads and pain relief ready. Stay hydrated.'
    });
  }

  // General recommendations
  prediction.recommendations.push(
    {
      icon: '🥗',
      title: 'Balanced Diet',
      text: 'Eat iron-rich foods, reduce caffeine and salt intake.'
    },
    {
      icon: '💧',
      title: 'Stay Hydrated',
      text: 'Drink plenty of water to reduce bloating and fatigue.'
    }
  );

  return prediction;
};

/**
 * Check if PMS notification should be triggered
 * @param {Object} pmsPrediction - Complete PMS prediction
 * @returns {Boolean} Whether to show notification
 */
export const shouldShowPMSNotification = (pmsPrediction) => {
  if (!pmsPrediction.available || !pmsPrediction.hasPatterns) {
    return false;
  }

  const { nextPMSWindow } = pmsPrediction;
  return nextPMSWindow && nextPMSWindow.shouldNotify;
};

/**
 * Get PMS notification message
 * @param {Object} pmsPrediction - Complete PMS prediction
 * @returns {String} Notification message
 */
export const getPMSNotificationMessage = (pmsPrediction) => {
  if (!pmsPrediction.available || !pmsPrediction.recurringMoods.length) {
    return 'Your PMS window is approaching. Take care of yourself!';
  }

  const topMood = pmsPrediction.recurringMoods[0].mood;
  const daysUntil = pmsPrediction.nextPMSWindow.daysUntilPMS;

  return `PMS Alert: You typically feel ${topMood} around this time. Your PMS window starts in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}.`;
};
