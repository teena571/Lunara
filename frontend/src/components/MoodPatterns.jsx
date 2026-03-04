import { useMood } from '../context/MoodContext'

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

const MOOD_COLORS = {
  happy: 'bg-yellow-400',
  calm: 'bg-blue-400',
  energetic: 'bg-green-400',
  sad: 'bg-indigo-400',
  anxious: 'bg-purple-400',
  irritable: 'bg-red-400',
  tired: 'bg-gray-400',
  stressed: 'bg-orange-400'
}

const MoodPatterns = () => {
  const { analyzePatterns } = useMood()
  const patterns = analyzePatterns()

  if (!patterns || patterns.totalEntries === 0) {
    return (
      <div className="card bg-gradient-to-r from-wellness-lavender/20 to-wellness-mint/20">
        <div className="text-center py-8">
          <p className="text-neutral-600 text-lg">
            📊 Log at least one entry to see patterns
          </p>
        </div>
      </div>
    )
  }

  const { totalEntries, moodCounts, mostCommonMood, topSymptoms } = patterns

  return (
    <div className="card bg-gradient-to-r from-wellness-lavender/20 to-wellness-mint/20">
      <h2 className="text-2xl font-semibold mb-6 text-neutral-800">
        Your Patterns & Insights 📈
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Entries */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📝</span>
            <h3 className="font-semibold text-neutral-700">Total Entries</h3>
          </div>
          <p className="text-3xl font-bold text-primary-600">{totalEntries}</p>
          <p className="text-sm text-neutral-600 mt-1">days logged</p>
        </div>

        {/* Most Common Mood */}
        {mostCommonMood && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎭</span>
              <h3 className="font-semibold text-neutral-700">Most Common Mood</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{MOOD_EMOJIS[mostCommonMood.mood]}</span>
              <div>
                <p className="text-xl font-bold text-neutral-800 capitalize">
                  {mostCommonMood.mood}
                </p>
                <p className="text-sm text-neutral-600">
                  {mostCommonMood.count} times ({Math.min(100, Math.round((mostCommonMood.count / totalEntries) * 100))}%)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top Symptoms */}
        <div className="bg-white rounded-xl p-4 shadow-sm md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">💊</span>
            <h3 className="font-semibold text-neutral-700">Top Symptoms</h3>
          </div>
          {topSymptoms.length > 0 ? (
            <div className="space-y-2">
              {topSymptoms.map(({ symptom, count }) => (
                <div key={symptom} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700 capitalize">
                    {symptom.replace(/_/g, ' ')}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-wellness-rose h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.round((count / totalEntries) * 100))}%` }}
                      />
                    </div>
                    <span className="text-xs text-neutral-600 w-8">{count}x</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-600">No symptoms logged yet</p>
          )}
        </div>
      </div>

      {/* Mood Distribution Chart */}
      <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-neutral-700 mb-4">Mood Distribution</h3>
        <div className="space-y-3">
          {Object.entries(moodCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([mood, count]) => (
              <div key={mood} className="flex items-center gap-3">
                <span className="text-2xl">{MOOD_EMOJIS[mood]}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-neutral-700 capitalize">
                      {mood}
                    </span>
                    <span className="text-xs text-neutral-600">
                      {count} ({Math.min(100, Math.round((count / totalEntries) * 100))}%)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className={`${MOOD_COLORS[mood]} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, Math.round((count / totalEntries) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default MoodPatterns
