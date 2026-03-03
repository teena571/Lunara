import { useState, useMemo } from 'react'
import { useCycle } from '../context/CycleContext'
import { useMood } from '../context/MoodContext'
import CycleInsights from '../components/insights/CycleInsights'
import MoodInsights from '../components/insights/MoodInsights'
import CorrelationInsights from '../components/insights/CorrelationInsights'
import WellnessRecommendations from '../components/insights/WellnessRecommendations'

const Insights = () => {
  const { cycles } = useCycle()
  const { moodEntries } = useMood()
  const [dateRange, setDateRange] = useState('30') // days
  const [filterType, setFilterType] = useState('all') // all, cycle, mood, correlation

  // Filter data by date range
  const filteredData = useMemo(() => {
    const daysAgo = parseInt(dateRange)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo)

    return {
      cycles: cycles.filter(c => new Date(c.startDate) >= cutoffDate),
      moods: moodEntries.filter(m => new Date(m.date) >= cutoffDate)
    }
  }, [cycles, moodEntries, dateRange])

  const hasData = cycles.length > 0 || moodEntries.length > 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-neutral-800 mb-2">
          Smart Insights 💡
        </h1>
        <p className="text-neutral-600">
          Personalized wellness insights based on your cycle and mood data
        </p>
      </div>

      {!hasData ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-semibold text-neutral-800 mb-2">
            No Data Yet
          </h2>
          <p className="text-neutral-600 mb-6">
            Start tracking your cycle and mood to see personalized insights
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
          {/* Filters */}
          <div className="card mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex flex-wrap gap-4">
                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Date Range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="input-field"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="60">Last 60 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Insight Type
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">All Insights</option>
                    <option value="cycle">Cycle Only</option>
                    <option value="mood">Mood Only</option>
                    <option value="correlation">Correlations</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Insights Sections */}
          <div className="space-y-8">
            {/* Cycle Insights */}
            {(filterType === 'all' || filterType === 'cycle') && filteredData.cycles.length > 0 && (
              <CycleInsights cycles={filteredData.cycles} />
            )}

            {/* Mood Insights */}
            {(filterType === 'all' || filterType === 'mood') && filteredData.moods.length > 0 && (
              <MoodInsights moods={filteredData.moods} />
            )}

            {/* Correlation Insights */}
            {(filterType === 'all' || filterType === 'correlation') && 
             filteredData.cycles.length > 0 && 
             filteredData.moods.length > 0 && (
              <CorrelationInsights 
                cycles={filteredData.cycles} 
                moods={filteredData.moods} 
              />
            )}

            {/* Wellness Recommendations */}
            {filterType === 'all' && (
              <WellnessRecommendations 
                cycles={filteredData.cycles} 
                moods={filteredData.moods} 
              />
            )}
          </div>

          {/* Privacy Notice */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Your Privacy is Protected
                </p>
                <p className="text-sm text-blue-700">
                  All insights are calculated locally on your device. Your data never leaves your browser and is not shared with any third parties.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Insights
