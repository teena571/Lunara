import { useMemo } from 'react'

const WellnessRecommendations = ({ cycles, moods }) => {
  const recommendations = useMemo(() => {
    const recs = []

    // Analyze cycle data
    if (cycles.length > 0) {
      const cycleLengths = cycles.filter(c => c.cycleLength).map(c => c.cycleLength)
      const avgLength = cycleLengths.length > 0
        ? cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length
        : 0

      // Irregular cycles
      if (cycleLengths.length > 1) {
        const variance = cycleLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / cycleLengths.length
        const stdDev = Math.sqrt(variance)
        
        if (stdDev > 7) {
          recs.push({
            category: 'Cycle Health',
            icon: '📅',
            title: 'Track Stress Levels',
            description: 'Irregular cycles can be influenced by stress. Consider stress-reduction techniques like meditation, yoga, or regular exercise.',
            priority: 'medium'
          })
        }
      }

      // Heavy flow
      const heavyFlowCount = cycles.filter(c => c.flow === 'heavy').length
      if (heavyFlowCount > cycles.length * 0.5) {
        recs.push({
          category: 'Nutrition',
          icon: '🥗',
          title: 'Boost Iron Intake',
          description: 'With frequent heavy flow, ensure adequate iron intake through leafy greens, lean meats, or supplements. Consider consulting your doctor.',
          priority: 'high'
        })
      }

      // Common symptoms
      const symptomCounts = {}
      cycles.forEach(c => {
        if (c.symptoms) {
          c.symptoms.forEach(s => {
            symptomCounts[s] = (symptomCounts[s] || 0) + 1
          })
        }
      })

      if (symptomCounts.cramps > cycles.length * 0.6) {
        recs.push({
          category: 'Pain Management',
          icon: '💊',
          title: 'Manage Cramps Naturally',
          description: 'Try heat therapy, gentle exercise, magnesium supplements, or anti-inflammatory foods like ginger and turmeric.',
          priority: 'medium'
        })
      }

      if (symptomCounts.headache > cycles.length * 0.5) {
        recs.push({
          category: 'Wellness',
          icon: '💧',
          title: 'Stay Hydrated',
          description: 'Frequent headaches may be related to dehydration or hormonal changes. Aim for 8 glasses of water daily.',
          priority: 'medium'
        })
      }
    }

    // Analyze mood data
    if (moods.length > 0) {
      const negativeMoods = ['sad', 'anxious', 'irritable', 'stressed']
      const negativeCount = moods.filter(m => negativeMoods.includes(m.mood)).length
      const negativePercentage = (negativeCount / moods.length) * 100

      if (negativePercentage > 60) {
        recs.push({
          category: 'Mental Health',
          icon: '🧠',
          title: 'Prioritize Mental Wellness',
          description: 'You\'ve been experiencing challenging moods frequently. Consider talking to a therapist, practicing mindfulness, or reaching out to loved ones.',
          priority: 'high'
        })
      }

      // Symptom analysis
      const symptomCounts = {}
      moods.forEach(m => {
        m.symptoms.forEach(s => {
          symptomCounts[s] = (symptomCounts[s] || 0) + 1
        })
      })

      if (symptomCounts.fatigue > moods.length * 0.5) {
        recs.push({
          category: 'Sleep & Energy',
          icon: '😴',
          title: 'Improve Sleep Quality',
          description: 'Frequent fatigue suggests you may need better sleep. Aim for 7-9 hours, maintain a consistent schedule, and create a relaxing bedtime routine.',
          priority: 'high'
        })
      }

      if (symptomCounts.insomnia > moods.length * 0.3) {
        recs.push({
          category: 'Sleep & Energy',
          icon: '🌙',
          title: 'Address Sleep Issues',
          description: 'Try limiting screen time before bed, avoiding caffeine after 2pm, and creating a cool, dark sleeping environment.',
          priority: 'medium'
        })
      }

      if (symptomCounts.mood_swings > moods.length * 0.4) {
        recs.push({
          category: 'Emotional Balance',
          icon: '⚖️',
          title: 'Balance Blood Sugar',
          description: 'Mood swings can be influenced by blood sugar fluctuations. Eat regular, balanced meals with protein and complex carbs.',
          priority: 'medium'
        })
      }
    }

    // General recommendations
    if (cycles.length > 0 || moods.length > 0) {
      recs.push({
        category: 'General Wellness',
        icon: '🏃‍♀️',
        title: 'Regular Exercise',
        description: 'Physical activity helps regulate hormones, improve mood, and reduce cycle-related symptoms. Aim for 30 minutes most days.',
        priority: 'low'
      })

      recs.push({
        category: 'General Wellness',
        icon: '🧘‍♀️',
        title: 'Practice Mindfulness',
        description: 'Regular meditation or mindfulness can help manage stress, improve mood, and increase body awareness.',
        priority: 'low'
      })
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  }, [cycles, moods])

  if (recommendations.length === 0) {
    return null
  }

  const priorityColors = {
    high: 'bg-red-50 border-red-200',
    medium: 'bg-orange-50 border-orange-200',
    low: 'bg-blue-50 border-blue-200'
  }

  const priorityBadges = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-orange-100 text-orange-700',
    low: 'bg-blue-100 text-blue-700'
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-wellness-rose/20 rounded-xl flex items-center justify-center text-2xl">
          💪
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-neutral-800">Wellness Recommendations</h2>
          <p className="text-sm text-neutral-600">Personalized tips based on your data</p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border ${priorityColors[rec.priority]}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{rec.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-neutral-800">{rec.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityBadges[rec.priority]}`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-neutral-700 mb-2">{rec.description}</p>
                <p className="text-xs text-neutral-500 italic">{rec.category}</p>
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
  )
}

export default WellnessRecommendations
