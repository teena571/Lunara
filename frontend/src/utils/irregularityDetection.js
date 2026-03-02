/**
 * MENSTRUAL IRREGULARITY DETECTION ALGORITHM
 * 
 * Medical-grade algorithm for detecting cycle irregularities and assessing risk levels
 * 
 * Features:
 * - Prolonged cycle detection (> 35 days)
 * - Variation analysis (> 8 days = irregular)
 * - Skipped cycle detection
 * - Irregularity score (0-100)
 * - Risk level assessment (Low, Moderate, High)
 * - Medical consultation recommendations
 */

/**
 * STEP 1: Detect Prolonged Cycles
 * 
 * Medical Context:
 * - Normal cycle: 21-35 days
 * - Prolonged cycle: > 35 days
 * - Oligomenorrhea: Cycles > 35 days consistently
 * 
 * @param {Array} cycles - Array of cycle objects with cycleLength
 * @returns {Object} { hasProlonged, count, percentage, cycles: [] }
 */
export const detectProlongedCycles = (cycles) => {
  const validCycles = cycles.filter(c => c.cycleLength && c.cycleLength > 0)
  
  if (validCycles.length === 0) {
    return { hasProlonged: false, count: 0, percentage: 0, cycles: [] }
  }

  const prolongedCycles = validCycles.filter(c => c.cycleLength > 35)
  const count = prolongedCycles.length
  const percentage = (count / validCycles.length) * 100

  return {
    hasProlonged: count > 0,
    count,
    percentage: Math.round(percentage),
    cycles: prolongedCycles,
    message: count > 0 
      ? `${count} of ${validCycles.length} cycles are prolonged (> 35 days)`
      : 'No prolonged cycles detected'
  }
}

/**
 * STEP 2: Calculate Cycle Variation
 * 
 * Medical Context:
 * - Normal variation: < 8 days
 * - Irregular: ≥ 8 days variation
 * - Uses standard deviation as measure
 * 
 * @param {Array} cycles - Array of cycle objects
 * @returns {Object} { isIrregular, stdDev, variation }
 */
export const calculateCycleVariation = (cycles) => {
  const cycleLengths = cycles
    .filter(c => c.cycleLength && c.cycleLength > 0)
    .map(c => c.cycleLength)

  if (cycleLengths.length < 2) {
    return { 
      isIrregular: false, 
      stdDev: 0, 
      variation: 0,
      message: 'Need at least 2 cycles to assess variation'
    }
  }

  // Calculate mean
  const mean = cycleLengths.reduce((sum, len) => sum + len, 0) / cycleLengths.length

  // Calculate standard deviation
  const squaredDiffs = cycleLengths.map(len => Math.pow(len - mean, 2))
  const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / cycleLengths.length
  const stdDev = Math.sqrt(variance)

  // Calculate min-max variation
  const minLength = Math.min(...cycleLengths)
  const maxLength = Math.max(...cycleLengths)
  const variation = maxLength - minLength

  const isIrregular = stdDev >= 8

  return {
    isIrregular,
    stdDev: Math.round(stdDev * 10) / 10,
    variation,
    minLength,
    maxLength,
    message: isIrregular
      ? `High variation detected: ${stdDev.toFixed(1)} days standard deviation`
      : `Normal variation: ${stdDev.toFixed(1)} days standard deviation`
  }
}

/**
 * STEP 3: Detect Skipped Cycles
 * 
 * Medical Context:
 * - Skipped cycle: Gap > 60 days between periods
 * - Amenorrhea: No period for 3+ months (90 days)
 * - Can indicate hormonal issues, pregnancy, or other conditions
 * 
 * @param {Array} cycles - Array of cycle objects with startDate
 * @returns {Object} { hasSkipped, count, gaps: [], longestGap }
 */
export const detectSkippedCycles = (cycles) => {
  if (cycles.length < 2) {
    return { 
      hasSkipped: false, 
      count: 0, 
      gaps: [], 
      longestGap: 0,
      message: 'Need at least 2 cycles to detect skipped cycles'
    }
  }

  // Sort cycles by start date
  const sortedCycles = [...cycles].sort((a, b) => 
    new Date(a.startDate) - new Date(b.startDate)
  )

  const gaps = []
  let skippedCount = 0

  // Check gaps between consecutive cycles
  for (let i = 0; i < sortedCycles.length - 1; i++) {
    const currentStart = new Date(sortedCycles[i].startDate)
    const nextStart = new Date(sortedCycles[i + 1].startDate)
    
    const gapDays = Math.floor((nextStart - currentStart) / (1000 * 60 * 60 * 24))

    if (gapDays > 60) {
      skippedCount++
      gaps.push({
        from: currentStart,
        to: nextStart,
        days: gapDays,
        severity: gapDays > 90 ? 'severe' : 'moderate'
      })
    }
  }

  const longestGap = gaps.length > 0 
    ? Math.max(...gaps.map(g => g.days))
    : 0

  return {
    hasSkipped: skippedCount > 0,
    count: skippedCount,
    gaps,
    longestGap,
    message: skippedCount > 0
      ? `${skippedCount} skipped cycle(s) detected (gaps > 60 days)`
      : 'No skipped cycles detected'
  }
}

/**
 * STEP 4: Detect Short Cycles
 * 
 * Medical Context:
 * - Normal cycle: 21-35 days
 * - Short cycle: < 21 days
 * - Polymenorrhea: Consistently short cycles
 * 
 * @param {Array} cycles - Array of cycle objects
 * @returns {Object} { hasShort, count, percentage, cycles: [] }
 */
export const detectShortCycles = (cycles) => {
  const validCycles = cycles.filter(c => c.cycleLength && c.cycleLength > 0)
  
  if (validCycles.length === 0) {
    return { hasShort: false, count: 0, percentage: 0, cycles: [] }
  }

  const shortCycles = validCycles.filter(c => c.cycleLength < 21)
  const count = shortCycles.length
  const percentage = (count / validCycles.length) * 100

  return {
    hasShort: count > 0,
    count,
    percentage: Math.round(percentage),
    cycles: shortCycles,
    message: count > 0
      ? `${count} of ${validCycles.length} cycles are short (< 21 days)`
      : 'No short cycles detected'
  }
}

/**
 * STEP 5: Calculate Irregularity Score (0-100)
 * 
 * Scoring System:
 * - Prolonged cycles: +30 points (if > 50% of cycles)
 * - Short cycles: +25 points (if > 50% of cycles)
 * - High variation: +25 points (stdDev > 8)
 * - Skipped cycles: +20 points (per skipped cycle, max 20)
 * 
 * Score Interpretation:
 * - 0-30: Low risk (normal variation)
 * - 31-60: Moderate risk (some irregularities)
 * - 61-100: High risk (significant irregularities)
 * 
 * @param {Object} prolonged - Result from detectProlongedCycles
 * @param {Object} variation - Result from calculateCycleVariation
 * @param {Object} skipped - Result from detectSkippedCycles
 * @param {Object} short - Result from detectShortCycles
 * @returns {number} Score from 0-100
 */
export const calculateIrregularityScore = (prolonged, variation, skipped, short) => {
  let score = 0

  // Prolonged cycles (0-30 points)
  if (prolonged.hasProlonged) {
    if (prolonged.percentage >= 75) score += 30
    else if (prolonged.percentage >= 50) score += 25
    else if (prolonged.percentage >= 25) score += 15
    else score += 10
  }

  // Short cycles (0-25 points)
  if (short.hasShort) {
    if (short.percentage >= 75) score += 25
    else if (short.percentage >= 50) score += 20
    else if (short.percentage >= 25) score += 12
    else score += 8
  }

  // High variation (0-25 points)
  if (variation.isIrregular) {
    const stdDev = variation.stdDev
    if (stdDev >= 15) score += 25
    else if (stdDev >= 12) score += 20
    else if (stdDev >= 10) score += 15
    else score += 10
  }

  // Skipped cycles (0-20 points)
  if (skipped.hasSkipped) {
    score += Math.min(skipped.count * 10, 20)
    
    // Extra points for severe gaps (> 90 days)
    const severeGaps = skipped.gaps.filter(g => g.severity === 'severe').length
    if (severeGaps > 0) score += 10
  }

  return Math.min(score, 100) // Cap at 100
}

/**
 * STEP 6: Determine Risk Level
 * 
 * Risk Levels:
 * - Low (0-30): Normal variation, no action needed
 * - Moderate (31-60): Some irregularities, monitor closely
 * - High (61-100): Significant irregularities, consult doctor
 * 
 * @param {number} score - Irregularity score (0-100)
 * @returns {string} 'Low', 'Moderate', or 'High'
 */
export const determineRiskLevel = (score) => {
  if (score <= 30) return 'Low'
  if (score <= 60) return 'Moderate'
  return 'High'
}

/**
 * STEP 7: Generate Explanation Message
 * 
 * Provides detailed, actionable explanation based on findings
 * 
 * @param {Object} analysis - Complete irregularity analysis
 * @returns {string} Detailed explanation message
 */
export const generateExplanationMessage = (analysis) => {
  const { score, riskLevel, prolonged, variation, skipped, short } = analysis
  
  let message = ''

  // Risk level summary
  if (riskLevel === 'Low') {
    message = '✅ Your cycles show normal variation. '
  } else if (riskLevel === 'Moderate') {
    message = '⚠️ Your cycles show some irregularities. '
  } else {
    message = '🚨 Your cycles show significant irregularities. '
  }

  // Specific findings
  const findings = []

  if (prolonged.hasProlonged) {
    findings.push(`${prolonged.count} prolonged cycle(s) detected (> 35 days)`)
  }

  if (short.hasShort) {
    findings.push(`${short.count} short cycle(s) detected (< 21 days)`)
  }

  if (variation.isIrregular) {
    findings.push(`high variation (${variation.stdDev} days standard deviation)`)
  }

  if (skipped.hasSkipped) {
    findings.push(`${skipped.count} skipped cycle(s) with gaps > 60 days`)
  }

  if (findings.length > 0) {
    message += 'Issues found: ' + findings.join(', ') + '. '
  }

  // Recommendations
  if (riskLevel === 'High') {
    message += '\n\n🏥 RECOMMENDATION: Consult a healthcare provider. Significant irregularities may indicate hormonal imbalances, PCOS, thyroid issues, or other conditions requiring medical attention.'
  } else if (riskLevel === 'Moderate') {
    message += '\n\n💡 RECOMMENDATION: Monitor your cycles closely. Track stress, diet, exercise, and sleep. If irregularities persist or worsen, consult a healthcare provider.'
  } else {
    message += '\n\n✨ Your cycles are within normal range. Continue tracking to maintain awareness of your patterns.'
  }

  return message
}

/**
 * STEP 8: Generate Medical Consultation Recommendation
 * 
 * Determines if medical consultation is needed based on severity
 * 
 * @param {Object} analysis - Complete irregularity analysis
 * @returns {Object} { needed: boolean, urgency: string, reasons: [] }
 */
export const generateMedicalRecommendation = (analysis) => {
  const { score, riskLevel, prolonged, skipped, short, variation } = analysis
  
  const reasons = []
  let urgency = 'none'

  // High risk factors
  if (skipped.longestGap > 90) {
    reasons.push('Missed period for more than 3 months (amenorrhea)')
    urgency = 'urgent'
  }

  if (prolonged.percentage > 75) {
    reasons.push('Consistently prolonged cycles (possible oligomenorrhea)')
    urgency = urgency === 'urgent' ? 'urgent' : 'soon'
  }

  if (short.percentage > 75) {
    reasons.push('Consistently short cycles (possible polymenorrhea)')
    urgency = urgency === 'urgent' ? 'urgent' : 'soon'
  }

  if (variation.stdDev > 15) {
    reasons.push('Extremely high cycle variation')
    urgency = urgency === 'urgent' ? 'urgent' : 'soon'
  }

  // Moderate risk factors
  if (riskLevel === 'Moderate' && reasons.length === 0) {
    reasons.push('Moderate irregularities detected')
    urgency = 'monitor'
  }

  const needed = riskLevel === 'High' || urgency === 'urgent'

  return {
    needed,
    urgency, // 'none', 'monitor', 'soon', 'urgent'
    reasons,
    message: needed
      ? `Medical consultation recommended. ${reasons.join('. ')}.`
      : 'Continue monitoring. Consult if symptoms worsen.'
  }
}

/**
 * MASTER FUNCTION: Analyze Menstrual Irregularities
 * 
 * Comprehensive analysis combining all detection methods
 * 
 * @param {Array} cycles - Array of cycle objects
 * @returns {Object} Complete irregularity analysis
 */
export const analyzeIrregularities = (cycles) => {
  if (!cycles || cycles.length === 0) {
    return {
      hasData: false,
      message: 'No cycle data available. Start tracking to analyze irregularities.'
    }
  }

  // Run all detection algorithms
  const prolonged = detectProlongedCycles(cycles)
  const variation = calculateCycleVariation(cycles)
  const skipped = detectSkippedCycles(cycles)
  const short = detectShortCycles(cycles)

  // Calculate score and risk
  const score = calculateIrregularityScore(prolonged, variation, skipped, short)
  const riskLevel = determineRiskLevel(score)

  // Build complete analysis
  const analysis = {
    hasData: true,
    score,
    riskLevel,
    prolonged,
    variation,
    skipped,
    short,
    totalCycles: cycles.length
  }

  // Generate messages
  analysis.explanation = generateExplanationMessage(analysis)
  analysis.medicalRecommendation = generateMedicalRecommendation(analysis)

  // Summary flags
  analysis.flags = {
    hasProlongedCycles: prolonged.hasProlonged,
    hasShortCycles: short.hasShort,
    hasHighVariation: variation.isIrregular,
    hasSkippedCycles: skipped.hasSkipped,
    needsMedicalAttention: analysis.medicalRecommendation.needed
  }

  return analysis
}

/**
 * UTILITY: Format Analysis for Display
 * 
 * @param {Object} analysis - Result from analyzeIrregularities
 * @returns {Object} Formatted data for UI
 */
export const formatIrregularityAnalysis = (analysis) => {
  if (!analysis.hasData) {
    return {
      title: 'No Data',
      message: analysis.message,
      color: 'gray'
    }
  }

  const colors = {
    Low: 'green',
    Moderate: 'orange',
    High: 'red'
  }

  return {
    title: `${analysis.riskLevel} Risk`,
    score: `${analysis.score}/100`,
    color: colors[analysis.riskLevel],
    explanation: analysis.explanation,
    medicalAdvice: analysis.medicalRecommendation.message,
    needsAttention: analysis.medicalRecommendation.needed,
    urgency: analysis.medicalRecommendation.urgency,
    details: {
      prolongedCycles: analysis.prolonged.count,
      shortCycles: analysis.short.count,
      skippedCycles: analysis.skipped.count,
      variation: `${analysis.variation.stdDev} days`
    }
  }
}

/**
 * EXPORT ALL FUNCTIONS
 */
export default {
  detectProlongedCycles,
  calculateCycleVariation,
  detectSkippedCycles,
  detectShortCycles,
  calculateIrregularityScore,
  determineRiskLevel,
  generateExplanationMessage,
  generateMedicalRecommendation,
  analyzeIrregularities,
  formatIrregularityAnalysis
}
