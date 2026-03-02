import { useMemo } from 'react'

const CycleInsights = ({ cycles }) => {
  const insights = useMemo(() => {
    if (cycles.length === 0) return null

    // Calculate average cycle length
    const cycleLengths = cycles.filter(c => c.cycleLength).map(c => c.cycleLength)
    const avgCycleLength = cycleLengths.length > 0
      ? cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length
      : 0

    // Calculate average period length
    const periodLengths = cycles.filter(c => c.periodLength).map(c => c.periodLength)
    const avgPeriodLength = periodLengths.length > 0
      ? periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length
      : 0

    // Check for irregularities (cycle length variance)
    const variance = cycleLengths.length > 1
      ? cycleLengths.reduce((sum, len) => sum + Math.pow(len - avgCycleLength, 2), 0) / cycleLengths.length
      : 0
    const stdDev = Math.sqrt(variance)
    const isIrregular = stdDev > 7 // More than 7 days variation

    // Most common flow
    const flowCounts = {}
    cycles.forEach(c => {
      if (c.flow) flowCounts[c.flow] = (flowCounts[c.flow] || 0) + 1
    })
    const mostCommonFlow = Object.entries(flowCounts).sort((a, b) => b[1] - a[1])[0]

    // Most common symptoms
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
      topSymptoms,
      totalCycles: cycles.length
    }
  }, [cycles])

  if (!insights) return null

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-wellness-lavender/20 rounded-xl flex items-center justify-center text-2xl">
          📅
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-neutral-800">Cycle Insights</h2>
          <p className="text-sm text-neutral-600">Based on {insights.totalCycles} logged cycles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Average Cycle Length */}
        <div className="bg-gradient-to-br from-wellness-lavender/10 to-wellness-lavender/5 rounded-xl p-4">
          <p className="text-sm text-neutral-600 mb-1">Average Cycle Length</p>
          <p className="text-3xl font-bold text-wellness-lavender">
            {insights.avgCycleLength.toFixed(1)}
          </p>
          <p className="text-xs text-neutral-500 mt-1">days</p>
        </div>

        {/* Average Period Length */}
        <div className="bg-gradient-to-br from-wellness-rose/10 to-wellness-rose/5 rounded-xl p-4">
          <p className="text-sm text-neutral-600 mb-1">Average Period Length</p>
          <p className="text-3xl font-bold text-wellness-rose">
            {insights.avgPeriodLength.toFixed(1)}
          </p>
          <p className="text-xs text-neutral-500 mt-1">days</p>
        </div>

        {/* Cycle Regularity */}
        <div className={`bg-gradient-to-br rounded-xl p-4 ${
          insights.isIrregular 
            ? 'from-orange-100 to-orange-50' 
            : 'from-green-100 to-green-50'
        }`}>
          <p className="text-sm text-neutral-600 mb-1">Cycle Regularity</p>
          <p className={`text-3xl font-bold ${
            insights.isIrregular ? 'text-orange-600' : 'text-green-600'
          }`}>
            {insights.isIrregular ? 'Irregular' : 'Regular'}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            ±{insights.stdDev.toFixed(1)} days variation
          </p>
        </div>
      </div>

      {/* Insights Cards */}
      <div className="space-y-4">
        {/* Regularity Insight */}
        <div className={`p-4 rounded-xl border-l-4 ${
          insights.isIrregular
            ? 'bg-orange-50 border-orange-400'
            : 'bg-green-50 border-green-400'
        }`}>
          <h3 className="font-semibold text-neutral-800 mb-2">
            {insights.isIrregular ? '⚠️ Irregular Cycles Detected' : '✅ Regular Cycles'}
          </h3>
          <p className="text-sm text-neutral-700">
            {insights.isIrregular
              ? `Your cycle length varies by about ${insights.stdDev.toFixed(1)} days. This is common, but if you're concerned, consider consulting a healthcare provider.`
              : `Your cycles are consistent with an average length of ${insights.avgCycleLength.toFixed(1)} days. This regularity is a positive sign of hormonal balance.`
            }
          </p>
        </div>

        {/* Flow Pattern */}
        {insights.mostCommonFlow && (
          <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
            <h3 className="font-semibold text-neutral-800 mb-2">
              💧 Flow Pattern
            </h3>
            <p className="text-sm text-neutral-700">
              Your most common flow intensity is <span className="font-semibold capitalize">{insights.mostCommonFlow[0]}</span> ({insights.mostCommonFlow[1]} times). 
              {insights.mostCommonFlow[0] === 'heavy' && ' If heavy flow is causing discomfort, consider tracking iron levels and consulting your doctor.'}
              {insights.mostCommonFlow[0] === 'light' && ' Light flow is normal for many people, but sudden changes should be discussed with a healthcare provider.'}
            </p>
          </div>
        )}

        {/* Common Symptoms */}
        {insights.topSymptoms.length > 0 && (
          <div className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-400">
            <h3 className="font-semibold text-neutral-800 mb-2">
              🩺 Common Symptoms
            </h3>
            <p className="text-sm text-neutral-700 mb-2">
              Your most frequent symptoms are:
            </p>
            <div className="flex flex-wrap gap-2">
              {insights.topSymptoms.map(([symptom, count]) => (
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
  )
}

export default CycleInsights
