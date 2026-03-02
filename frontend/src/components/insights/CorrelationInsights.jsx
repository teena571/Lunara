import { useMemo } from 'react'

const CorrelationInsights = ({ cycles, moods }) => {
  const correlations = useMemo(() => {
    if (cycles.length === 0 || moods.length === 0) return null

    // Map moods to cycle phases
    const moodsByCyclePhase = {
      menstrual: [], // Days 1-5
      follicular: [], // Days 6-13
      ovulation: [], // Days 14-16
      luteal: [] // Days 17-28
    }

    moods.forEach(mood => {
      const moodDate = new Date(mood.date)
      
      // Find the cycle this mood belongs to
      const cycle = cycles.find(c => {
        const cycleStart = new Date(c.startDate)
        const cycleEnd = c.endDate ? new Date(c.endDate) : new Date(cycleStart.getTime() + (c.cycleLength || 28) * 24 * 60 * 60 * 1000)
        return moodDate >= cycleStart && moodDate <= cycleEnd
      })

      if (cycle) {
        const cycleStart = new Date(cycle.startDate)
        const dayOfCycle = Math.floor((moodDate - cycleStart) / (1000 * 60 * 60 * 24)) + 1

        if (dayOfCycle <= 5) moodsByCyclePhase.menstrual.push(mood)
        else if (dayOfCycle <= 13) moodsByCyclePhase.follicular.push(mood)
        else if (dayOfCycle <= 16) moodsByCyclePhase.ovulation.push(mood)
        else moodsByCyclePhase.luteal.push(mood)
      }
    })

    // Analyze mood patterns by phase
    const phaseAnalysis = {}
    const positiveMoods = ['happy', 'calm', 'energetic']

    Object.entries(moodsByCyclePhase).forEach(([phase, phaseMoods]) => {
      if (phaseMoods.length > 0) {
        const positiveCount = phaseMoods.filter(m => positiveMoods.includes(m.mood)).length
        const positivePercentage = (positiveCount / phaseMoods.length) * 100

        // Most common mood in this phase
        const moodCounts = {}
        phaseMoods.forEach(m => {
          moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1
        })
        const mostCommon = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]

        // Most common symptoms in this phase
        const symptomCounts = {}
        phaseMoods.forEach(m => {
          m.symptoms.forEach(s => {
            symptomCounts[s] = (symptomCounts[s] || 0) + 1
          })
        })
        const topSymptom = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1])[0]

        phaseAnalysis[phase] = {
          count: phaseMoods.length,
          positivePercentage,
          mostCommonMood: mostCommon,
          topSymptom
        }
      }
    })

    // Find best and worst phases
    const phasesWithData = Object.entries(phaseAnalysis)
      .filter(([_, data]) => data.count >= 2) // Need at least 2 entries
      .sort((a, b) => b[1].positivePercentage - a[1].positivePercentage)

    const bestPhase = phasesWithData[0]
    const worstPhase = phasesWithData[phasesWithData.length - 1]

    return {
      phaseAnalysis,
      bestPhase,
      worstPhase,
      hasSufficientData: phasesWithData.length >= 2
    }
  }, [cycles, moods])

  if (!correlations || !correlations.hasSufficientData) {
    return (
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-wellness-peach/20 rounded-xl flex items-center justify-center text-2xl">
            🔗
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-neutral-800">Cycle-Mood Correlations</h2>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-neutral-600">
            Keep tracking to see how your mood correlates with your cycle phases
          </p>
        </div>
      </div>
    )
  }

  const phaseNames = {
    menstrual: 'Menstrual Phase',
    follicular: 'Follicular Phase',
    ovulation: 'Ovulation Phase',
    luteal: 'Luteal Phase'
  }

  const phaseDescriptions = {
    menstrual: 'Days 1-5: Period days',
    follicular: 'Days 6-13: Post-period, pre-ovulation',
    ovulation: 'Days 14-16: Peak fertility',
    luteal: 'Days 17-28: Pre-menstrual phase'
  }

  const phaseEmojis = {
    menstrual: '🩸',
    follicular: '🌱',
    ovulation: '🌸',
    luteal: '🌙'
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-wellness-peach/20 rounded-xl flex items-center justify-center text-2xl">
          🔗
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-neutral-800">Cycle-Mood Correlations</h2>
          <p className="text-sm text-neutral-600">How your mood changes throughout your cycle</p>
        </div>
      </div>

      {/* Phase Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.entries(correlations.phaseAnalysis).map(([phase, data]) => (
          <div
            key={phase}
            className="bg-gradient-to-br from-neutral-50 to-white rounded-xl p-4 border border-neutral-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{phaseEmojis[phase]}</span>
              <div>
                <p className="text-sm font-semibold text-neutral-800">{phaseNames[phase]}</p>
                <p className="text-xs text-neutral-500">{phaseDescriptions[phase]}</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-neutral-600 mb-1">Positive Mood</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-wellness-mint h-2 rounded-full transition-all duration-500"
                    style={{ width: `${data.positivePercentage}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-neutral-700">
                  {data.positivePercentage.toFixed(0)}%
                </span>
              </div>
              {data.mostCommonMood && (
                <p className="text-xs text-neutral-600 mt-2">
                  Most common: <span className="font-medium capitalize">{data.mostCommonMood[0]}</span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Key Insights */}
      <div className="space-y-4">
        {/* Best Phase */}
        {correlations.bestPhase && (
          <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-400">
            <h3 className="font-semibold text-neutral-800 mb-2">
              ✨ Your Best Phase: {phaseNames[correlations.bestPhase[0]]}
            </h3>
            <p className="text-sm text-neutral-700">
              You feel most positive during your {phaseNames[correlations.bestPhase[0]].toLowerCase()} 
              ({correlations.bestPhase[1].positivePercentage.toFixed(0)}% positive moods). 
              This is a great time for important tasks, social activities, and challenging workouts.
            </p>
            {correlations.bestPhase[1].mostCommonMood && (
              <p className="text-sm text-neutral-700 mt-2">
                Most common mood: <span className="font-semibold capitalize">{correlations.bestPhase[1].mostCommonMood[0]}</span>
              </p>
            )}
          </div>
        )}

        {/* Challenging Phase */}
        {correlations.worstPhase && correlations.worstPhase[0] !== correlations.bestPhase?.[0] && (
          <div className="p-4 bg-orange-50 rounded-xl border-l-4 border-orange-400">
            <h3 className="font-semibold text-neutral-800 mb-2">
              💙 Your Challenging Phase: {phaseNames[correlations.worstPhase[0]]}
            </h3>
            <p className="text-sm text-neutral-700">
              You tend to experience more challenging moods during your {phaseNames[correlations.worstPhase[0]].toLowerCase()} 
              ({correlations.worstPhase[1].positivePercentage.toFixed(0)}% positive moods). 
              Plan extra self-care, lighter schedules, and be gentle with yourself during this time.
            </p>
            {correlations.worstPhase[1].topSymptom && (
              <p className="text-sm text-neutral-700 mt-2">
                Common symptom: <span className="font-semibold">{correlations.worstPhase[1].topSymptom[0].replace(/_/g, ' ')}</span>
              </p>
            )}
          </div>
        )}

        {/* General Pattern */}
        <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
          <h3 className="font-semibold text-neutral-800 mb-2">
            📊 Pattern Recognition
          </h3>
          <p className="text-sm text-neutral-700">
            Understanding how your mood fluctuates with your cycle can help you plan activities, 
            set realistic expectations, and practice self-compassion. These patterns are normal 
            and influenced by hormonal changes throughout your cycle.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CorrelationInsights
