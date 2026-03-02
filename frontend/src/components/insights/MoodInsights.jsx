import { useMemo } from 'react'

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

const MoodInsights = ({ moods }) => {
  const insights = useMemo(() => {
    if (moods.length === 0) return null

    // Mood distribution
    const moodCounts = {}
    moods.forEach(m => {
      moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1
    })

    const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])
    const mostCommonMood = sortedMoods[0]
    const leastCommonMood = sortedMoods[sortedMoods.length - 1]

    // Positive vs negative moods
    const positiveMoods = ['happy', 'calm', 'energetic']
    const negativeMoods = ['sad', 'anxious', 'irritable', 'tired', 'stressed']
    
    const positiveCount = moods.filter(m => positiveMoods.includes(m.mood)).length
    const negativeCount = moods.filter(m => negativeMoods.includes(m.mood)).length
    const positivePercentage = (positiveCount / moods.length) * 100

    // Symptom analysis
    const symptomCounts = {}
    moods.forEach(m => {
      m.symptoms.forEach(s => {
        symptomCounts[s] = (symptomCounts[s] || 0) + 1
      })
    })
    const topSymptoms = Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    // Mood trends (last 7 days vs previous 7 days)
    const last7Days = moods.slice(0, Math.min(7, moods.length))
    const previous7Days = moods.slice(7, Math.min(14, moods.length))
    
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
      leastCommonMood,
      positivePercentage,
      topSymptoms,
      trend,
      totalEntries: moods.length
    }
  }, [moods])

  if (!insights) return null

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-wellness-mint/20 rounded-xl flex items-center justify-center text-2xl">
          💭
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-neutral-800">Mood Insights</h2>
          <p className="text-sm text-neutral-600">Based on {insights.totalEntries} mood entries</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Most Common Mood */}
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl p-4">
          <p className="text-sm text-neutral-600 mb-1">Most Common Mood</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{MOOD_EMOJIS[insights.mostCommonMood[0]]}</span>
            <div>
              <p className="text-xl font-bold text-yellow-700 capitalize">
                {insights.mostCommonMood[0]}
              </p>
              <p className="text-xs text-neutral-500">
                {insights.mostCommonMood[1]} times ({Math.round((insights.mostCommonMood[1] / insights.totalEntries) * 100)}%)
              </p>
            </div>
          </div>
        </div>

        {/* Positive Mood Ratio */}
        <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-4">
          <p className="text-sm text-neutral-600 mb-1">Positive Mood Ratio</p>
          <p className="text-3xl font-bold text-green-600">
            {insights.positivePercentage.toFixed(0)}%
          </p>
          <div className="mt-2 bg-neutral-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${insights.positivePercentage}%` }}
            />
          </div>
        </div>

        {/* Mood Trend */}
        <div className={`bg-gradient-to-br rounded-xl p-4 ${
          insights.trend === 'improving' ? 'from-blue-100 to-blue-50' :
          insights.trend === 'declining' ? 'from-orange-100 to-orange-50' :
          'from-gray-100 to-gray-50'
        }`}>
          <p className="text-sm text-neutral-600 mb-1">Recent Trend</p>
          <p className={`text-2xl font-bold ${
            insights.trend === 'improving' ? 'text-blue-600' :
            insights.trend === 'declining' ? 'text-orange-600' :
            'text-gray-600'
          }`}>
            {insights.trend === 'improving' ? '📈 Improving' :
             insights.trend === 'declining' ? '📉 Declining' :
             '➡️ Stable'}
          </p>
          <p className="text-xs text-neutral-500 mt-1">Last 7 days vs previous</p>
        </div>
      </div>

      {/* Mood Distribution Chart */}
      <div className="mb-6">
        <h3 className="font-semibold text-neutral-800 mb-3">Mood Distribution</h3>
        <div className="space-y-2">
          {Object.entries(insights.moodCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([mood, count]) => (
              <div key={mood} className="flex items-center gap-3">
                <span className="text-2xl">{MOOD_EMOJIS[mood]}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-neutral-700 capitalize">{mood}</span>
                    <span className="text-xs text-neutral-600">
                      {count} ({Math.round((count / insights.totalEntries) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-wellness-mint h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(count / insights.totalEntries) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Insights Cards */}
      <div className="space-y-4">
        {/* Trend Insight */}
        <div className={`p-4 rounded-xl border-l-4 ${
          insights.trend === 'improving' ? 'bg-blue-50 border-blue-400' :
          insights.trend === 'declining' ? 'bg-orange-50 border-orange-400' :
          'bg-gray-50 border-gray-400'
        }`}>
          <h3 className="font-semibold text-neutral-800 mb-2">
            {insights.trend === 'improving' ? '✨ Mood Improving' :
             insights.trend === 'declining' ? '💙 Need Extra Care' :
             '🌟 Mood Stable'}
          </h3>
          <p className="text-sm text-neutral-700">
            {insights.trend === 'improving' && 'Your mood has been trending positively over the past week. Keep up the good habits!'}
            {insights.trend === 'declining' && 'Your mood has been lower recently. Consider self-care activities, talking to someone, or consulting a professional if needed.'}
            {insights.trend === 'stable' && 'Your mood has been consistent. Continue monitoring to identify patterns and maintain balance.'}
          </p>
        </div>

        {/* Symptom Correlation */}
        {insights.topSymptoms.length > 0 && (
          <div className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-400">
            <h3 className="font-semibold text-neutral-800 mb-2">
              🩺 Common Physical Symptoms
            </h3>
            <p className="text-sm text-neutral-700 mb-2">
              Symptoms you experience most often:
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

export default MoodInsights
