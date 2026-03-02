/**
 * CYCLE PREDICTION ENGINE
 * A statistical prediction engine for menstrual cycle tracking
 * 
 * Features:
 * - Average cycle length calculation
 * - Standard deviation calculation
 * - Irregularity detection (deviation > 8 days)
 * - Next period prediction
 * - Ovulation date prediction
 * - Fertile window calculation (5 days before ovulation)
 */

/**
 * STEP 1: Calculate Average Cycle Length
 * 
 * Logic:
 * - Extract all cycle lengths from historical data
 * - Sum all lengths and divide by count
 * - Return average (default to 28 if no data)
 * 
 * @param {Array} cycles - Array of cycle objects with cycleLength property
 * @returns {number} Average cycle length in days
 */
export const calculateAverageCycleLength = (cycles) => {
  const cycleLengths = cycles
    .filter(cycle => cycle.cycleLength && cycle.cycleLength > 0)
    .map(cycle => cycle.cycleLength)

  if (cycleLengths.length === 0) {
    return 28 // Default average cycle length
  }

  const sum = cycleLengths.reduce((total, length) => total + length, 0)
  const average = sum / cycleLengths.length

  return Math.round(average)
}

/**
 * STEP 2: Calculate Standard Deviation
 * 
 * Logic:
 * - Calculate mean (average)
 * - For each value, calculate (value - mean)²
 * - Sum all squared differences
 * - Divide by count to get variance
 * - Take square root of variance to get standard deviation
 * 
 * Formula: σ = √(Σ(x - μ)² / n)
 * Where: σ = standard deviation, x = each value, μ = mean, n = count
 * 
 * @param {Array} cycles - Array of cycle objects
 * @returns {number} Standard deviation in days
 */
export const calculateStandardDeviation = (cycles) => {
  const cycleLengths = cycles
    .filter(cycle => cycle.cycleLength && cycle.cycleLength > 0)
    .map(cycle => cycle.cycleLength)

  if (cycleLengths.length < 2) {
    return 0 // Need at least 2 data points for meaningful std dev
  }

  // Step 1: Calculate mean
  const mean = cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length

  // Step 2: Calculate squared differences from mean
  const squaredDifferences = cycleLengths.map(length => Math.pow(length - mean, 2))

  // Step 3: Calculate variance (average of squared differences)
  const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / cycleLengths.length

  // Step 4: Standard deviation is square root of variance
  const standardDeviation = Math.sqrt(variance)

  return standardDeviation
}

/**
 * STEP 3: Detect Irregularity
 * 
 * Logic:
 * - Calculate standard deviation
 * - If std dev > 8 days, cycles are irregular
 * - Regular cycles have consistent length (low variation)
 * - Irregular cycles have high variation
 * 
 * Medical Context:
 * - Normal variation: 2-7 days
 * - Borderline: 7-8 days
 * - Irregular: > 8 days
 * 
 * @param {Array} cycles - Array of cycle objects
 * @returns {Object} { isIrregular: boolean, stdDev: number, status: string }
 */
export const detectIrregularity = (cycles) => {
  const stdDev = calculateStandardDeviation(cycles)
  const isIrregular = stdDev > 8

  let status = 'regular'
  if (stdDev > 8) {
    status = 'irregular'
  } else if (stdDev > 7) {
    status = 'borderline'
  }

  return {
    isIrregular,
    stdDev: Math.round(stdDev * 10) / 10, // Round to 1 decimal
    status,
    message: isIrregular
      ? `Your cycles vary by ${stdDev.toFixed(1)} days on average. Consider tracking stress, diet, and sleep patterns.`
      : `Your cycles are consistent with ${stdDev.toFixed(1)} days variation. This is healthy!`
  }
}

/**
 * STEP 4: Predict Next Period Date
 * 
 * Logic:
 * - Get the most recent cycle start date
 * - Calculate average cycle length
 * - Add average length to last start date
 * - Result is predicted next period date
 * 
 * Formula: Next Period = Last Period Start + Average Cycle Length
 * 
 * @param {Array} cycles - Array of cycle objects with startDate
 * @returns {Date|null} Predicted next period date
 */
export const predictNextPeriod = (cycles) => {
  if (cycles.length === 0) {
    return null
  }

  // Sort cycles by start date (most recent first)
  const sortedCycles = [...cycles].sort((a, b) => 
    new Date(b.startDate) - new Date(a.startDate)
  )

  const lastCycle = sortedCycles[0]
  const avgCycleLength = calculateAverageCycleLength(cycles)

  const lastStartDate = new Date(lastCycle.startDate)
  const nextPeriodDate = new Date(lastStartDate)
  nextPeriodDate.setDate(nextPeriodDate.getDate() + avgCycleLength)

  return nextPeriodDate
}

/**
 * STEP 5: Predict Ovulation Date
 * 
 * Logic:
 * - Ovulation typically occurs 14 days BEFORE next period
 * - This is based on the luteal phase (always ~14 days)
 * - Formula: Ovulation = Next Period - 14 days
 * 
 * Medical Context:
 * - Luteal phase is consistent (~14 days)
 * - Follicular phase varies (causes cycle length variation)
 * - Ovulation = End of follicular phase
 * 
 * @param {Date} nextPeriodDate - Predicted next period date
 * @returns {Date|null} Predicted ovulation date
 */
export const predictOvulation = (nextPeriodDate) => {
  if (!nextPeriodDate) {
    return null
  }

  const ovulationDate = new Date(nextPeriodDate)
  ovulationDate.setDate(ovulationDate.getDate() - 14) // 14 days before period

  return ovulationDate
}

/**
 * STEP 6: Calculate Fertile Window
 * 
 * Logic:
 * - Sperm can survive up to 5 days in female reproductive tract
 * - Egg survives ~24 hours after ovulation
 * - Fertile window = 5 days before ovulation + ovulation day + 1 day after
 * - Total: 7-day fertile window
 * 
 * Formula:
 * - Fertile Start = Ovulation - 5 days
 * - Fertile End = Ovulation + 1 day
 * 
 * Medical Context:
 * - Peak fertility: 2-3 days before ovulation
 * - Pregnancy possible: 5 days before to 1 day after ovulation
 * 
 * @param {Date} ovulationDate - Predicted ovulation date
 * @returns {Object|null} { start: Date, end: Date, peakStart: Date, peakEnd: Date }
 */
export const calculateFertileWindow = (ovulationDate) => {
  if (!ovulationDate) {
    return null
  }

  // Fertile window: 5 days before ovulation to 1 day after
  const fertileStart = new Date(ovulationDate)
  fertileStart.setDate(fertileStart.getDate() - 5)

  const fertileEnd = new Date(ovulationDate)
  fertileEnd.setDate(fertileEnd.getDate() + 1)

  // Peak fertility: 2-3 days before ovulation
  const peakStart = new Date(ovulationDate)
  peakStart.setDate(peakStart.getDate() - 3)

  const peakEnd = new Date(ovulationDate)
  peakEnd.setDate(peakEnd.getDate() - 1)

  return {
    start: fertileStart,
    end: fertileEnd,
    peakStart,
    peakEnd,
    totalDays: 7,
    message: 'Highest chance of conception during this window'
  }
}

/**
 * STEP 7: Calculate Days Until Next Period
 * 
 * Logic:
 * - Get today's date
 * - Calculate difference between next period and today
 * - Convert milliseconds to days
 * 
 * @param {Date} nextPeriodDate - Predicted next period date
 * @returns {number} Days until next period (negative if overdue)
 */
export const calculateDaysUntilPeriod = (nextPeriodDate) => {
  if (!nextPeriodDate) {
    return null
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const nextPeriod = new Date(nextPeriodDate)
  nextPeriod.setHours(0, 0, 0, 0)

  const diffTime = nextPeriod - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

/**
 * STEP 8: Calculate Confidence Score
 * 
 * Logic:
 * - More data = higher confidence
 * - Lower standard deviation = higher confidence
 * - Score from 0-100
 * 
 * Factors:
 * - Number of cycles (more is better)
 * - Regularity (lower std dev is better)
 * 
 * @param {Array} cycles - Array of cycle objects
 * @returns {Object} { score: number, level: string, message: string }
 */
export const calculateConfidenceScore = (cycles) => {
  if (cycles.length === 0) {
    return { score: 0, level: 'none', message: 'No data available' }
  }

  const cycleLengths = cycles.filter(c => c.cycleLength).length
  const stdDev = calculateStandardDeviation(cycles)

  // Data quantity score (0-50 points)
  let dataScore = 0
  if (cycleLengths >= 6) dataScore = 50
  else if (cycleLengths >= 4) dataScore = 40
  else if (cycleLengths >= 3) dataScore = 30
  else if (cycleLengths >= 2) dataScore = 20
  else dataScore = 10

  // Regularity score (0-50 points)
  let regularityScore = 0
  if (stdDev <= 2) regularityScore = 50
  else if (stdDev <= 4) regularityScore = 40
  else if (stdDev <= 6) regularityScore = 30
  else if (stdDev <= 8) regularityScore = 20
  else regularityScore = 10

  const totalScore = dataScore + regularityScore

  let level = 'low'
  let message = 'Track more cycles for better predictions'

  if (totalScore >= 80) {
    level = 'high'
    message = 'Predictions are highly reliable'
  } else if (totalScore >= 60) {
    level = 'medium'
    message = 'Predictions are moderately reliable'
  } else if (totalScore >= 40) {
    level = 'fair'
    message = 'Predictions are somewhat reliable'
  }

  return {
    score: totalScore,
    level,
    message,
    dataPoints: cycleLengths,
    regularity: stdDev.toFixed(1)
  }
}

/**
 * MASTER FUNCTION: Generate Complete Predictions
 * 
 * This function combines all the above calculations into one comprehensive result
 * 
 * @param {Array} cycles - Array of cycle objects
 * @returns {Object} Complete prediction data
 */
export const generateCompletePredictions = (cycles) => {
  if (!cycles || cycles.length === 0) {
    return null
  }

  // Calculate all metrics
  const avgCycleLength = calculateAverageCycleLength(cycles)
  const irregularity = detectIrregularity(cycles)
  const nextPeriodDate = predictNextPeriod(cycles)
  const ovulationDate = predictOvulation(nextPeriodDate)
  const fertileWindow = calculateFertileWindow(ovulationDate)
  const daysUntilPeriod = calculateDaysUntilPeriod(nextPeriodDate)
  const confidence = calculateConfidenceScore(cycles)

  // Calculate average period length
  const periodLengths = cycles
    .filter(c => c.periodLength && c.periodLength > 0)
    .map(c => c.periodLength)
  const avgPeriodLength = periodLengths.length > 0
    ? Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length)
    : 5

  return {
    // Basic metrics
    avgCycleLength,
    avgPeriodLength,
    totalCyclesTracked: cycles.length,

    // Regularity
    isIrregular: irregularity.isIrregular,
    stdDev: irregularity.stdDev,
    regularityStatus: irregularity.status,
    regularityMessage: irregularity.message,

    // Predictions
    nextPeriodDate,
    ovulationDate,
    daysUntilPeriod,

    // Fertile window
    fertileWindow,

    // Confidence
    confidence,

    // Metadata
    calculatedAt: new Date(),
    dataQuality: confidence.level
  }
}

/**
 * UTILITY: Format prediction for display
 * 
 * @param {Object} predictions - Predictions object from generateCompletePredictions
 * @returns {Object} Formatted strings for UI display
 */
export const formatPredictionsForDisplay = (predictions) => {
  if (!predictions) {
    return null
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return {
    nextPeriod: formatDate(predictions.nextPeriodDate),
    ovulation: formatDate(predictions.ovulationDate),
    fertileStart: formatDate(predictions.fertileWindow.start),
    fertileEnd: formatDate(predictions.fertileWindow.end),
    daysUntil: predictions.daysUntilPeriod > 0
      ? `${predictions.daysUntilPeriod} days`
      : predictions.daysUntilPeriod === 0
      ? 'Today'
      : `${Math.abs(predictions.daysUntilPeriod)} days overdue`,
    avgCycle: `${predictions.avgCycleLength} days`,
    regularity: predictions.isIrregular ? 'Irregular' : 'Regular',
    confidence: `${predictions.confidence.score}% (${predictions.confidence.level})`
  }
}

/**
 * EXPORT ALL FUNCTIONS
 */
export default {
  calculateAverageCycleLength,
  calculateStandardDeviation,
  detectIrregularity,
  predictNextPeriod,
  predictOvulation,
  calculateFertileWindow,
  calculateDaysUntilPeriod,
  calculateConfidenceScore,
  generateCompletePredictions,
  formatPredictionsForDisplay
}
