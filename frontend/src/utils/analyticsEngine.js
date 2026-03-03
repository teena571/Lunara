/**
 * ANALYTICS ENGINE
 * 
 * Generates comprehensive analytics data from cycle and mood tracking
 * Includes data processing for charts and visualizations
 */

/**
 * Filter data by time range
 */
const filterByTimeRange = (data, timeRange, dateField = 'startDate') => {
  if (timeRange === 'all') return data

  const now = new Date()
  const cutoffDate = new Date()

  switch (timeRange) {
    case '3months':
      cutoffDate.setMonth(now.getMonth() - 3)
      break
    case '6months':
      cutoffDate.setMonth(now.getMonth() - 6)
      break
    case '1year':
      cutoffDate.setFullYear(now.getFullYear() - 1)
      break
    default:
      return data
  }

  return data.filter(item => new Date(item[dateField]) >= cutoffDate)
}

/**
 * Generate Cycle Trend Data (Line Chart)
 * Shows cycle length over time
 */
export const generateCycleTrendData = (cycles, timeRange) => {
  const filtered = filterByTimeRange(cycles, timeRange)
    .filter(c => c.cycleLength && c.cycleLength > 0)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))

  return filtered.map(cycle => ({
    date: new Date(cycle.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    cycleLength: cycle.cycleLength,
    periodLength: cycle.periodLength || 0,
    timestamp: new Date(cycle.startDate).getTime()
  }))
}

/**
 * Generate Mood Distribution Data (Pie Chart)
 * Shows percentage of each mood
 */
export const generateMoodDistributionData = (moods, timeRange) => {
  const filtered = filterByTimeRange(moods, timeRange, 'date')

  const moodCounts = {}
  filtered.forEach(entry => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1
  })

  const total = filtered.length
  const colors = {
    happy: '#FCD34D',
    calm: '#60A5FA',
    energetic: '#34D399',
    sad: '#818CF8',
    anxious: '#A78BFA',
    irritable: '#F87171',
    tired: '#9CA3AF',
    stressed: '#FB923C'
  }

  return Object.entries(moodCounts).map(([mood, count]) => ({
    name: mood.charAt(0).toUpperCase() + mood.slice(1),
    value: count,
    percentage: Math.round((count / total) * 100),
    fill: colors[mood] || '#9CA3AF'
  }))
}

/**
 * Generate Flow Intensity Data (Bar Chart)
 * Shows distribution of flow intensities
 */
export const generateFlowIntensityData = (cycles, timeRange) => {
  const filtered = filterByTimeRange(cycles, timeRange)
    .filter(c => c.flow)

  const flowCounts = {
    light: 0,
    medium: 0,
    heavy: 0
  }

  filtered.forEach(cycle => {
    if (flowCounts.hasOwnProperty(cycle.flow)) {
      flowCounts[cycle.flow]++
    }
  })

  return [
    { flow: 'Light', count: flowCounts.light, fill: '#60A5FA' },
    { flow: 'Medium', count: flowCounts.medium, fill: '#A78BFA' },
    { flow: 'Heavy', count: flowCounts.heavy, fill: '#F87171' }
  ]
}

/**
 * Generate Irregularity Trend Data (Area Chart)
 * Shows standard deviation over time (rolling window)
 */
export const generateIrregularityTrendData = (cycles, timeRange) => {
  const filtered = filterByTimeRange(cycles, timeRange)
    .filter(c => c.cycleLength && c.cycleLength > 0)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))

  if (filtered.length < 3) return []

  const windowSize = 3 // Calculate std dev for every 3 cycles
  const trend = []

  for (let i = windowSize - 1; i < filtered.length; i++) {
    const window = filtered.slice(i - windowSize + 1, i + 1)
    const lengths = window.map(c => c.cycleLength)
    const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length
    const variance = lengths.reduce((sum, len) => sum + Math.pow(len - mean, 2), 0) / lengths.length
    const stdDev = Math.sqrt(variance)

    trend.push({
      date: new Date(filtered[i].startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      stdDev: Math.round(stdDev * 10) / 10,
      isIrregular: stdDev >= 8,
      timestamp: new Date(filtered[i].startDate).getTime()
    })
  }

  return trend
}

/**
 * Generate Health Summary Statistics
 */
export const generateHealthSummary = (cycles, moods, timeRange) => {
  const filteredCycles = filterByTimeRange(cycles, timeRange)
  const filteredMoods = filterByTimeRange(moods, timeRange, 'date')

  // Cycle statistics
  const cycleLengths = filteredCycles.filter(c => c.cycleLength).map(c => c.cycleLength)
  const avgCycleLength = cycleLengths.length > 0
    ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
    : 0

  const periodLengths = filteredCycles.filter(c => c.periodLength).map(c => c.periodLength)
  const avgPeriodLength = periodLengths.length > 0
    ? Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length)
    : 0

  // Calculate standard deviation
  const mean = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length
  const variance = cycleLengths.reduce((sum, len) => sum + Math.pow(len - mean, 2), 0) / cycleLengths.length
  const stdDev = Math.sqrt(variance)

  // Mood statistics
  const positiveMoods = ['happy', 'calm', 'energetic']
  const positiveCount = filteredMoods.filter(m => positiveMoods.includes(m.mood)).length
  const positivePercentage = filteredMoods.length > 0
    ? Math.round((positiveCount / filteredMoods.length) * 100)
    : 0

  // Most common mood
  const moodCounts = {}
  filteredMoods.forEach(m => {
    moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1
  })
  const mostCommonMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]

  // Most common symptoms
  const symptomCounts = {}
  filteredCycles.forEach(c => {
    if (c.symptoms) {
      c.symptoms.forEach(s => {
        symptomCounts[s] = (symptomCounts[s] || 0) + 1
      })
    }
  })
  const topSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([symptom, count]) => ({ symptom, count }))

  return {
    totalCycles: filteredCycles.length,
    totalMoodEntries: filteredMoods.length,
    avgCycleLength,
    avgPeriodLength,
    cycleRegularity: stdDev < 8 ? 'Regular' : 'Irregular',
    stdDev: Math.round(stdDev * 10) / 10,
    positivePercentage,
    mostCommonMood: mostCommonMood ? {
      mood: mostCommonMood[0],
      count: mostCommonMood[1]
    } : null,
    topSymptoms
  }
}

/**
 * MASTER FUNCTION: Generate Complete Analytics Data
 */
export const generateAnalyticsData = (cycles, moods, timeRange = '6months') => {
  return {
    cycleTrend: generateCycleTrendData(cycles, timeRange),
    moodDistribution: generateMoodDistributionData(moods, timeRange),
    flowIntensity: generateFlowIntensityData(cycles, timeRange),
    irregularityTrend: generateIrregularityTrendData(cycles, timeRange),
    summary: generateHealthSummary(cycles, moods, timeRange),
    metadata: {
      timeRange,
      generatedAt: new Date().toISOString(),
      totalCycles: cycles.length,
      totalMoods: moods.length
    }
  }
}

export default {
  generateCycleTrendData,
  generateMoodDistributionData,
  generateFlowIntensityData,
  generateIrregularityTrendData,
  generateHealthSummary,
  generateAnalyticsData
}
