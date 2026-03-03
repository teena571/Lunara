const HealthSummaryCard = ({ data }) => {
  if (!data) return null

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

  return (
    <div className="card mb-8 bg-gradient-to-br from-wellness-lavender/10 via-wellness-peach/10 to-wellness-mint/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
          💪
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-neutral-800">Health Summary</h2>
          <p className="text-sm text-neutral-600">Your wellness at a glance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Cycles */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📅</span>
            <h3 className="font-semibold text-neutral-700">Total Cycles</h3>
          </div>
          <p className="text-3xl font-bold text-wellness-lavender">
            {data.totalCycles}
          </p>
          <p className="text-xs text-neutral-500 mt-1">cycles tracked</p>
        </div>

        {/* Average Cycle Length */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⏱️</span>
            <h3 className="font-semibold text-neutral-700">Avg Cycle</h3>
          </div>
          <p className="text-3xl font-bold text-wellness-mint">
            {data.avgCycleLength}
          </p>
          <p className="text-xs text-neutral-500 mt-1">days</p>
        </div>

        {/* Regularity */}
        <div className={`rounded-xl p-4 shadow-sm ${
          data.cycleRegularity === 'Regular' 
            ? 'bg-green-50' 
            : 'bg-orange-50'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">
              {data.cycleRegularity === 'Regular' ? '✅' : '⚠️'}
            </span>
            <h3 className="font-semibold text-neutral-700">Regularity</h3>
          </div>
          <p className={`text-3xl font-bold ${
            data.cycleRegularity === 'Regular' 
              ? 'text-green-600' 
              : 'text-orange-600'
          }`}>
            {data.cycleRegularity}
          </p>
          <p className="text-xs text-neutral-500 mt-1">±{data.stdDev} days</p>
        </div>

        {/* Positive Mood */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">😊</span>
            <h3 className="font-semibold text-neutral-700">Positive Mood</h3>
          </div>
          <p className="text-3xl font-bold text-wellness-rose">
            {data.positivePercentage}%
          </p>
          <p className="text-xs text-neutral-500 mt-1">of entries</p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Most Common Mood */}
        {data.mostCommonMood && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="font-semibold text-neutral-700 mb-3 flex items-center gap-2">
              <span className="text-xl">🎭</span>
              Most Common Mood
            </h4>
            <div className="flex items-center gap-3">
              <span className="text-4xl">
                {MOOD_EMOJIS[data.mostCommonMood.mood]}
              </span>
              <div>
                <p className="text-xl font-bold text-neutral-800 capitalize">
                  {data.mostCommonMood.mood}
                </p>
                <p className="text-sm text-neutral-600">
                  {data.mostCommonMood.count} times ({Math.round((data.mostCommonMood.count / data.totalMoodEntries) * 100)}%)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top Symptoms */}
        {data.topSymptoms.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="font-semibold text-neutral-700 mb-3 flex items-center gap-2">
              <span className="text-xl">🩺</span>
              Top Symptoms
            </h4>
            <div className="space-y-2">
              {data.topSymptoms.map((item, index) => (
                <div key={item.symptom} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700 capitalize">
                    {index + 1}. {item.symptom.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm font-semibold text-neutral-800">
                    {item.count}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Period Length */}
      {data.avgPeriodLength > 0 && (
        <div className="mt-4 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🩸</span>
              <div>
                <h4 className="font-semibold text-neutral-700">Average Period Length</h4>
                <p className="text-xs text-neutral-500">Duration of menstruation</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-wellness-rose">
                {data.avgPeriodLength}
              </p>
              <p className="text-xs text-neutral-500">days</p>
            </div>
          </div>
        </div>
      )}

      {/* Data Quality Indicator */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-xl">📊</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-800 mb-1">
              Data Quality: {data.totalCycles >= 6 ? 'Excellent' : data.totalCycles >= 3 ? 'Good' : 'Fair'}
            </p>
            <p className="text-xs text-blue-700">
              {data.totalCycles >= 6 
                ? 'You have enough data for highly accurate predictions and insights.'
                : data.totalCycles >= 3
                ? 'Continue tracking for more accurate predictions.'
                : 'Track at least 3 cycles for reliable insights.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthSummaryCard
