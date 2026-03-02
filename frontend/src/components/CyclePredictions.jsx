const CyclePredictions = ({ predictions }) => {
  if (!predictions) {
    return (
      <div className="card mb-8 bg-gradient-to-r from-wellness-lavender/20 to-wellness-peach/20">
        <div className="text-center py-8">
          <p className="text-neutral-600 text-lg">
            📊 Log at least one cycle to see predictions
          </p>
        </div>
      </div>
    )
  }

  const { nextPeriodDate, avgCycleLength, fertileWindow, daysUntilPeriod } = predictions

  return (
    <div className="card mb-8 bg-gradient-to-r from-wellness-lavender/20 to-wellness-peach/20">
      <h2 className="text-2xl font-semibold mb-6 text-neutral-800">
        Your Predictions 🔮
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Next Period */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📅</span>
            <h3 className="font-semibold text-neutral-700">Next Period</h3>
          </div>
          <p className="text-2xl font-bold text-primary-600">
            {nextPeriodDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </p>
          <p className="text-sm text-neutral-600 mt-1">
            {daysUntilPeriod > 0 
              ? `in ${daysUntilPeriod} days`
              : daysUntilPeriod === 0
              ? 'Today!'
              : `${Math.abs(daysUntilPeriod)} days overdue`
            }
          </p>
        </div>

        {/* Days Until Period */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⏰</span>
            <h3 className="font-semibold text-neutral-700">Countdown</h3>
          </div>
          <p className="text-2xl font-bold text-wellness-rose">
            {daysUntilPeriod > 0 ? daysUntilPeriod : 0}
          </p>
          <p className="text-sm text-neutral-600 mt-1">days remaining</p>
          {/* Progress bar */}
          <div className="mt-3 bg-neutral-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-wellness-lavender to-wellness-rose h-full transition-all duration-500"
              style={{
                width: `${Math.max(0, Math.min(100, ((avgCycleLength - daysUntilPeriod) / avgCycleLength) * 100))}%`
              }}
            />
          </div>
        </div>

        {/* Average Cycle Length */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📊</span>
            <h3 className="font-semibold text-neutral-700">Avg Cycle</h3>
          </div>
          <p className="text-2xl font-bold text-wellness-mint">
            {avgCycleLength}
          </p>
          <p className="text-sm text-neutral-600 mt-1">days</p>
        </div>

        {/* Fertile Window */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🌱</span>
            <h3 className="font-semibold text-neutral-700">Fertile Window</h3>
          </div>
          <p className="text-sm font-semibold text-wellness-mint">
            {fertileWindow.start.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </p>
          <p className="text-xs text-neutral-600">to</p>
          <p className="text-sm font-semibold text-wellness-mint">
            {fertileWindow.end.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Alert if period is approaching */}
      {daysUntilPeriod <= 3 && daysUntilPeriod > 0 && (
        <div className="mt-4 p-4 bg-wellness-peach/30 rounded-xl border border-wellness-peach">
          <p className="text-sm text-neutral-700">
            ⚠️ Your period is approaching soon! Make sure you're prepared.
          </p>
        </div>
      )}
    </div>
  )
}

export default CyclePredictions
