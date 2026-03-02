import { useMemo } from 'react'
import { analyzeIrregularities, formatIrregularityAnalysis } from '../utils/irregularityDetection'

/**
 * IrregularityAlert Component
 * 
 * Displays irregularity analysis with color-coded risk levels
 * and actionable recommendations
 */
const IrregularityAlert = ({ cycles }) => {
  const analysis = useMemo(() => {
    const raw = analyzeIrregularities(cycles)
    return formatIrregularityAnalysis(raw)
  }, [cycles])

  if (!analysis.hasData) {
    return null
  }

  // Color schemes by risk level
  const colorSchemes = {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-400',
      text: 'text-green-800',
      icon: '✅'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-400',
      text: 'text-orange-800',
      icon: '⚠️'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-400',
      text: 'text-red-800',
      icon: '🚨'
    }
  }

  const scheme = colorSchemes[analysis.color] || colorSchemes.green

  return (
    <div className={`${scheme.bg} border-l-4 ${scheme.border} p-6 rounded-xl mb-6`}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <span className="text-3xl">{scheme.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className={`text-xl font-bold ${scheme.text}`}>
              {analysis.title}
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${scheme.text} bg-white`}>
              Score: {analysis.score}
            </span>
          </div>
          <p className={`text-sm ${scheme.text} whitespace-pre-line`}>
            {analysis.explanation}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-white rounded-lg p-3">
          <p className="text-xs text-neutral-600 mb-1">Prolonged Cycles</p>
          <p className={`text-2xl font-bold ${scheme.text}`}>
            {analysis.details.prolongedCycles}
          </p>
        </div>
        <div className="bg-white rounded-lg p-3">
          <p className="text-xs text-neutral-600 mb-1">Short Cycles</p>
          <p className={`text-2xl font-bold ${scheme.text}`}>
            {analysis.details.shortCycles}
          </p>
        </div>
        <div className="bg-white rounded-lg p-3">
          <p className="text-xs text-neutral-600 mb-1">Skipped Cycles</p>
          <p className={`text-2xl font-bold ${scheme.text}`}>
            {analysis.details.skippedCycles}
          </p>
        </div>
        <div className="bg-white rounded-lg p-3">
          <p className="text-xs text-neutral-600 mb-1">Variation</p>
          <p className={`text-2xl font-bold ${scheme.text}`}>
            {analysis.details.variation}
          </p>
        </div>
      </div>

      {/* Medical Recommendation */}
      {analysis.needsAttention && (
        <div className="bg-white rounded-lg p-4 border-2 border-red-300">
          <div className="flex items-start gap-2">
            <span className="text-2xl">🏥</span>
            <div>
              <p className="font-semibold text-red-800 mb-1">
                Medical Consultation Recommended
              </p>
              <p className="text-sm text-red-700">
                {analysis.medicalAdvice}
              </p>
              {analysis.urgency === 'urgent' && (
                <p className="text-xs text-red-600 mt-2 font-semibold">
                  ⚠️ URGENT: Schedule an appointment as soon as possible
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default IrregularityAlert
