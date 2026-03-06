import { useState, useMemo } from 'react'
import { useCycle } from '../context/CycleContext'
import { useMood } from '../context/MoodContext'
import CycleTrendChart from '../components/analytics/CycleTrendChart'
import MoodDistributionChart from '../components/analytics/MoodDistributionChart'
import FlowIntensityChart from '../components/analytics/FlowIntensityChart'
import IrregularityVisualization from '../components/analytics/IrregularityVisualization'
import { generateAnalyticsData } from '../utils/analyticsEngine'

const MOOD_EMOJIS = {
  happy: '😊',
  calm: '😌',
  energetic: '⚡',
  sad: '😢',
  anxious: '😰',
  irritable: '😠',
  tired: '😴',
  stressed: '😫'
}

const WellnessAnalytics = () => {
  const { cycles } = useCycle()
  const { moodEntries } = useMood()
  const [timeRange, setTimeRange] = useState('6months')

  // Generate analytics data
  const analyticsData = useMemo(() => {
    return generateAnalyticsData(cycles, moodEntries, timeRange)
  }, [cycles, moodEntries, timeRange])

  // Calculate cycle insights
  const cycleInsights = useMemo(() => {
    if (cycles.length === 0) return null

    const cycleLengths = cycles.filter(c => c.cycleLength).map(c => c.cycleLength)
    const avgCycleLength = cycleLengths.length > 0
      ? cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length
      : 0

    const periodLengths = cycles.filter(c => c.periodLength).map(c => c.periodLength)
    const avgPeriodLength = periodLengths.length > 0
      ? periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length
      : 0

    const variance = cycleLengths.length > 1
      ? cycleLengths.reduce((sum, len) => sum + Math.pow(len - avgCycleLength, 2), 0) / cycleLengths.length
      : 0
    const stdDev = Math.sqrt(variance)
    const isIrregular = stdDev >= 8

    const flowCounts = {}
    cycles.forEach(c => {
      if (c.flow) flowCounts[c.flow] = (flowCounts[c.flow] || 0) + 1
    })
    const mostCommonFlow = Object.entries(flowCounts).sort((a, b) => b[1] - a[1])[0]

    const symptomCounts = {}
    cycles.forEach(c => {
      if (c.symptoms) {
        c.symptoms.forEach(s => {
          symptomCounts[s] = (symptomCounts[s] || 0) + 1
        })
      }
    })
    const topSymptoms = Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    return {
      avgCycleLength,
      avgPeriodLength,
      isIrregular,
      stdDev,
      mostCommonFlow,
      topSymptoms
    }
  }, [cycles])

  // Calculate mood insights
  const moodInsights = useMemo(() => {
    if (moodEntries.length === 0) return null

    const moodCounts = {}
    moodEntries.forEach(m => {
      moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1
    })

    const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])
    const mostCommonMood = sortedMoods[0]

    const positiveMoods = ['happy', 'calm', 'energetic']
    const positiveCount = moodEntries.filter(m => positiveMoods.includes(m.mood)).length
    const positivePercentage = Math.min(100, Math.round((positiveCount / moodEntries.length) * 100))

    const symptomCounts = {}
    moodEntries.forEach(m => {
      m.symptoms.forEach(s => {
        symptomCounts[s] = (symptomCounts[s] || 0) + 1
      })
    })
    const topSymptoms = Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    const last7Days = moodEntries.slice(0, Math.min(7, moodEntries.length))
    const previous7Days = moodEntries.slice(7, Math.min(14, moodEntries.length))
    
    let trend = 'stable'
    if (previous7Days.length > 0) {
      const recentPositive = last7Days.filter(m => positiveMoods.includes(m.mood)).length / last7Days.length
      const previousPositive = previous7Days.filter(m => positiveMoods.includes(m.mood)).length / previous7Days.length
      
      if (recentPositive > previousPositive + 0.2) trend = 'improving'
      else if (recentPositive < previousPositive - 0.2) trend = 'declining'
    }

    return {
      moodCounts,
      mostCommonMood,
      positivePercentage,
      topSymptoms,
      trend
    }
  }, [moodEntries])

  // Generate wellness recommendations
  const recommendations = useMemo(() => {
    const recs = []

    if (cycleInsights && cycleInsights.isIrregular) {
      recs.push({
        icon: '📅',
        title: 'Track Stress Levels',
        description: 'Irregular cycles can be influenced by stress. Consider stress-reduction techniques like meditation, yoga, or regular exercise.',
        priority: 'medium'
      })
    }

    if (cycles.filter(c => c.flow === 'heavy').length > cycles.length * 0.5) {
      recs.push({
        icon: '🥗',
        title: 'Boost Iron Intake',
        description: 'With frequent heavy flow, ensure adequate iron intake through leafy greens, lean meats, or supplements.',
        priority: 'high'
      })
    }

    if (moodInsights && moodInsights.positivePercentage < 40) {
      recs.push({
        icon: '🧠',
        title: 'Prioritize Mental Wellness',
        description: 'Consider talking to a therapist, practicing mindfulness, or reaching out to loved ones for support.',
        priority: 'high'
      })
    }

    recs.push({
      icon: '🏃‍♀️',
      title: 'Regular Exercise',
      description: 'Physical activity helps regulate hormones, improve mood, and reduce cycle-related symptoms. Aim for 30 minutes most days.',
      priority: 'low'
    })

    recs.push({
      icon: '🧘‍♀️',
      title: 'Practice Mindfulness',
      description: 'Regular meditation or mindfulness can help manage stress, improve mood, and increase body awareness.',
      priority: 'low'
    })

    return recs
  }, [cycles, cycleInsights, moodInsights])

  const hasData = cycles.length > 0 || moodEntries.length > 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-neutral-800 mb-2">
          Wellness Analytics 📊
        </h1>
        <p className="text-neutral-600">
          Comprehensive insights and personalized recommendations for your wellness journey
        </p>
      </div>

      {!hasData ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📈</div>
          <h2 className="text-2xl font-semibold text-neutral-800 mb-2">
            No Data Yet
          </h2>
          <p className="text-neutral-600 mb-6">
            Start tracking your cycle and mood to see comprehensive analytics
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/cycle" className="btn-primary">
              Track Cycle
            </a>
            <a href="/mood" className="btn-secondary">
              Log Mood
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Time Range Filter */}
          <div className="card mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-lg font-semibold text-neutral-800">Time Range</h3>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: '3months', label: '3 Months' },
                  { value: '6months', label: '6 Months' },
                  { value: '1year', label: '1 Year' },
                  { value: 'all', label: 'All Time' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTimeRange(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      timeRange === option.value
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 1: Overview Summary Cards */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Overview Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {/* Total Cycles */}
              <div className="card bg-gradient-to-br from-wellness-lavender/20 to-wellness-lavender/10">
                <p className="text-xs text-neutral-600 mb-1">Total Cycles</p>
                <p className="text-2xl font-bold text-wellness-lavender">
                  {analyticsData.summary.totalCycles}
                </p>
              </div>

              {/* Average Cycle Length */}
              <div className="card bg-gradient-to-br from-wellness-peach/20 to-wellness-peach/10">
                <p className="text-xs text-neutral-600 mb-1">Avg Cycle</p>
                <p className="text-2xl font-bold text-wellness-peach">
                  {analyticsData.summary.avgCycleLength}d
                </p>
              </div>

              {/* Average Period Length */}
              <div className="card bg-gradient-to-br from-wellness-rose/20 to-wellness-rose/10">
                <p className="text-xs text-neutral-600 mb-1">Avg Period</p>
                <p className="text-2xl font-bold text-wellness-rose">
                  {analyticsData.summary.avgPeriodLength}d
                </p>
              </div>

              {/* Cycle Regularity */}
              <div className={`card bg-gradient-to-br ${
                analyticsData.summary.cycleRegularity === 'Regular'
                  ? 'from-green-100 to-green-50'
                  : 'from-orange-100 to-orange-50'
              }`}>
                <p className="text-xs text-neutral-600 mb-1">Regularity</p>
                <p className={`text-lg font-bold ${
                  analyticsData.summary.cycleRegularity === 'Regular'
                    ? 'text-green-600'
                    : 'text-orange-600'
                }`}>
                  {analyticsData.summary.cycleRegularity}
                </p>
              </div>

              {/* Positive Mood % */}
              <div className="card bg-gradient-to-br from-yellow-100 to-yellow-50">
                <p className="text-xs text-neutral-600 mb-1">Positive Mood</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {analyticsData.summary.positivePercentage}%
                </p>
              </div>

              {/* Most Common Mood */}
              <div className="card bg-gradient-to-br from-wellness-mint/20 to-wellness-mint/10">
                <p className="text-xs text-neutral-600 mb-1">Top Mood</p>
                <p className="text-xl font-bold text-wellness-mint capitalize">
                  {analyticsData.summary.mostCommonMood?.mood || 'N/A'}
                </p>
              </div>

              {/* Data Quality Score */}
              <div className="card bg-gradient-to-br from-blue-100 to-blue-50">
                <p className="text-xs text-neutral-600 mb-1">Data Quality</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.min(100, Math.round((analyticsData.summary.totalCycles + analyticsData.summary.totalMoodEntries) / 2))}%
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: Visual Analytics */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Visual Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analyticsData.cycleTrend.length > 0 && (
                <CycleTrendChart data={analyticsData.cycleTrend} />
              )}
              {analyticsData.moodDistribution.length > 0 && (
                <MoodDistributionChart data={analyticsData.moodDistribution} />
              )}
              {analyticsData.flowIntensity.length > 0 && (
                <FlowIntensityChart data={analyticsData.flowIntensity} />
              )}
              {analyticsData.irregularityTrend.length > 0 && (
                <IrregularityVisualization data={analyticsData.irregularityTrend} />
              )}
            </div>
          </div>

          {/* SECTION 3: Cycle Insights */}
          {cycleInsights && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Cycle Insights</h2>
              <div className="card">
                <div className="space-y-4">
                  {/* Regularity Explanation */}
                  <div className={`p-4 rounded-xl border-l-4 ${
                    cycleInsights.isIrregular
                      ? 'bg-orange-50 border-orange-400'
                      : 'bg-green-50 border-green-400'
                  }`}>
                    <h3 className="font-semibold text-neutral-800 mb-2">
                      {cycleInsights.isIrregular ? '⚠️ Irregular Cycles Detected' : '✅ Regular Cycles'}
                    </h3>
                    <p className="text-sm text-neutral-700">
                      {cycleInsights.isIrregular
                        ? `Your cycle length varies by about ${cycleInsights.stdDev.toFixed(1)} days. This is common, but if you're concerned, consider consulting a healthcare provider.`
                        : `Your cycles are consistent with an average length of ${cycleInsights.avgCycleLength.toFixed(1)} days. This regularity is a positive sign of hormonal balance.`
                      }
                    </p>
                  </div>

                  {/* Flow Pattern Summary */}
                  {cycleInsights.mostCommonFlow && (
                    <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                      <h3 className="font-semibold text-neutral-800 mb-2">💧 Flow Pattern</h3>
                      <p className="text-sm text-neutral-700">
                        Your most common flow intensity is <span className="font-semibold capitalize">{cycleInsights.mostCommonFlow[0]}</span> ({cycleInsights.mostCommonFlow[1]} times).
                        {cycleInsights.mostCommonFlow[0] === 'heavy' && ' If heavy flow is causing discomfort, consider tracking iron levels and consulting your doctor.'}
                        {cycleInsights.mostCommonFlow[0] === 'light' && ' Light flow is normal for many people, but sudden changes should be discussed with a healthcare provider.'}
                      </p>
                    </div>
                  )}

                  {/* Common Symptoms Summary */}
                  {cycleInsights.topSymptoms.length > 0 && (
                    <div className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-400">
                      <h3 className="font-semibold text-neutral-800 mb-2">🩺 Common Symptoms</h3>
                      <p className="text-sm text-neutral-700 mb-2">Your most frequent symptoms are:</p>
                      <div className="flex flex-wrap gap-2">
                        {cycleInsights.topSymptoms.map(([symptom, count]) => (
                          <span
                            key={symptom}
                            className="px-3 py-1 bg-white rounded-full text-sm font-medium text-purple-700"
                          >
                            {symptom.replace(/_/g, ' ')} ({count}x)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: Mood Insights */}
          {moodInsights && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Mood Insights</h2>
              <div className="card">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Mood Stability */}
                  <div className={`bg-gradient-to-br rounded-xl p-4 ${
                    moodInsights.trend === 'improving' ? 'from-blue-100 to-blue-50' :
                    moodInsights.trend === 'declining' ? 'from-orange-100 to-orange-50' :
                    'from-gray-100 to-gray-50'
                  }`}>
                    <p className="text-sm text-neutral-600 mb-1">Mood Stability</p>
                    <p className={`text-2xl font-bold ${
                      moodInsights.trend === 'improving' ? 'text-blue-600' :
                      moodInsights.trend === 'declining' ? 'text-orange-600' :
                      'text-gray-600'
                    }`}>
                      {moodInsights.trend === 'improving' ? '📈 Improving' :
                       moodInsights.trend === 'declining' ? '📉 Declining' :
                       '➡️ Stable'}
                    </p>
                  </div>

                  {/* Positive Mood Ratio */}
                  <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-4">
                    <p className="text-sm text-neutral-600 mb-1">Positive Mood Ratio</p>
                    <p className="text-3xl font-bold text-green-600">
                      {moodInsights.positivePercentage}%
                    </p>
                    <div className="mt-2 bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${moodInsights.positivePercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Recent Trend */}
                  <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl p-4">
                    <p className="text-sm text-neutral-600 mb-1">Most Common Mood</p>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{MOOD_EMOJIS[moodInsights.mostCommonMood[0]]}</span>
                      <p className="text-xl font-bold text-yellow-700 capitalize">
                        {moodInsights.mostCommonMood[0]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mood Breakdown Bars */}
                <div>
                  <h3 className="font-semibold text-neutral-800 mb-3">Mood Distribution</h3>
                  <div className="space-y-2">
                    {Object.entries(moodInsights.moodCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([mood, count]) => {
                        const percentage = Math.min(100, Math.round((count / moodEntries.length) * 100))
                        return (
                          <div key={mood} className="flex items-center gap-3">
                            <span className="text-2xl">{MOOD_EMOJIS[mood]}</span>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-neutral-700 capitalize">{mood}</span>
                                <span className="text-xs text-neutral-600">
                                  {count} ({percentage}%)
                                </span>
                              </div>
                              <div className="w-full bg-neutral-200 rounded-full h-2">
                                <div
                                  className="bg-wellness-mint h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: Wellness Recommendations */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Wellness Recommendations</h2>
            <div className="card">
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border ${
                      rec.priority === 'high' ? 'bg-red-50 border-red-200' :
                      rec.priority === 'medium' ? 'bg-orange-50 border-orange-200' :
                      'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{rec.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-neutral-800">{rec.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                            rec.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-700">{rec.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="mt-6 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <p className="text-xs text-neutral-600">
                  <span className="font-semibold">Disclaimer:</span> These recommendations are based on general wellness principles and your tracked data. 
                  They are not medical advice. Always consult with healthcare professionals for personalized medical guidance.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 6: Export */}
          <div className="card">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-1">
                  Export Analytics
                </h3>
                <p className="text-sm text-neutral-600">
                  Download your complete analytics data for personal records
                </p>
              </div>
              <button
                onClick={() => {
                  const exportData = {
                    ...analyticsData,
                    cycleInsights,
                    moodInsights,
                    recommendations,
                    exportedAt: new Date().toISOString()
                  }
                  const dataStr = JSON.stringify(exportData, null, 2)
                  const blob = new Blob([dataStr], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `lunara-wellness-analytics-${new Date().toISOString().split('T')[0]}.json`
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                }}
                className="btn-secondary flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export JSON
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default WellnessAnalytics
