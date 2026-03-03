import { useState, useMemo } from 'react'
import { useCycle } from '../context/CycleContext'
import { useMood } from '../context/MoodContext'
import CycleTrendChart from '../components/analytics/CycleTrendChart'
import MoodDistributionChart from '../components/analytics/MoodDistributionChart'
import FlowIntensityChart from '../components/analytics/FlowIntensityChart'
import IrregularityVisualization from '../components/analytics/IrregularityVisualization'
import HealthSummaryCard from '../components/analytics/HealthSummaryCard'
import { generateAnalyticsData } from '../utils/analyticsEngine'

const Analytics = () => {
  const { cycles } = useCycle()
  const { moodEntries } = useMood()
  const [timeRange, setTimeRange] = useState('6months') // 3months, 6months, 1year, all

  // Generate analytics data
  const analyticsData = useMemo(() => {
    return generateAnalyticsData(cycles, moodEntries, timeRange)
  }, [cycles, moodEntries, timeRange])

  const hasData = cycles.length > 0 || moodEntries.length > 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-neutral-800 mb-2">
          Analytics Dashboard 📊
        </h1>
        <p className="text-neutral-600">
          Comprehensive insights into your wellness patterns
        </p>
      </div>

      {!hasData ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📈</div>
          <h2 className="text-2xl font-semibold text-neutral-800 mb-2">
            No Data Yet
          </h2>
          <p className="text-neutral-600 mb-6">
            Start tracking your cycle and mood to see analytics
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
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-800">Time Range</h3>
              <div className="flex gap-2">
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

          {/* Health Summary Card */}
          <HealthSummaryCard data={analyticsData.summary} />

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Cycle Trend Chart */}
            {analyticsData.cycleTrend.length > 0 && (
              <CycleTrendChart data={analyticsData.cycleTrend} />
            )}

            {/* Mood Distribution Chart */}
            {analyticsData.moodDistribution.length > 0 && (
              <MoodDistributionChart data={analyticsData.moodDistribution} />
            )}

            {/* Flow Intensity Chart */}
            {analyticsData.flowIntensity.length > 0 && (
              <FlowIntensityChart data={analyticsData.flowIntensity} />
            )}

            {/* Irregularity Visualization */}
            {analyticsData.irregularityTrend.length > 0 && (
              <IrregularityVisualization data={analyticsData.irregularityTrend} />
            )}
          </div>

          {/* Data Export */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-1">
                  Export Analytics
                </h3>
                <p className="text-sm text-neutral-600">
                  Download your analytics data for personal records
                </p>
              </div>
              <button
                onClick={() => {
                  const dataStr = JSON.stringify(analyticsData, null, 2)
                  const blob = new Blob([dataStr], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `lunara-analytics-${new Date().toISOString().split('T')[0]}.json`
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

export default Analytics
