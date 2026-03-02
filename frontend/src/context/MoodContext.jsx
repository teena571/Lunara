import { createContext, useState, useContext, useEffect } from 'react'

const MoodContext = createContext()

export const useMood = () => {
  const context = useContext(MoodContext)
  if (!context) {
    throw new Error('useMood must be used within a MoodProvider')
  }
  return context
}

export const MoodProvider = ({ children }) => {
  const [moodEntries, setMoodEntries] = useState([])
  const [loading, setLoading] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('moodEntries')
    if (stored) {
      try {
        setMoodEntries(JSON.parse(stored))
      } catch (error) {
        console.error('Error loading mood entries:', error)
      }
    }
    setLoading(false)
  }, [])

  // Save to localStorage whenever entries change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('moodEntries', JSON.stringify(moodEntries))
    }
  }, [moodEntries, loading])

  // Add new mood entry
  const addMoodEntry = (entry) => {
    const newEntry = {
      id: Date.now().toString(),
      date: entry.date,
      mood: entry.mood,
      symptoms: entry.symptoms || [],
      notes: entry.notes || '',
      createdAt: new Date().toISOString()
    }
    setMoodEntries(prev => [newEntry, ...prev])
    return { success: true, data: newEntry }
  }

  // Update mood entry
  const updateMoodEntry = (id, updates) => {
    setMoodEntries(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, ...updates, updatedAt: new Date().toISOString() } : entry
      )
    )
    return { success: true }
  }

  // Delete mood entry
  const deleteMoodEntry = (id) => {
    setMoodEntries(prev => prev.filter(entry => entry.id !== id))
    return { success: true }
  }

  // Get entry by date
  const getEntryByDate = (date) => {
    const dateStr = new Date(date).toDateString()
    return moodEntries.find(entry => new Date(entry.date).toDateString() === dateStr)
  }

  // Get entries for date range
  const getEntriesInRange = (startDate, endDate) => {
    return moodEntries.filter(entry => {
      const entryDate = new Date(entry.date)
      return entryDate >= startDate && entryDate <= endDate
    })
  }

  // Analyze patterns
  const analyzePatterns = () => {
    if (moodEntries.length === 0) return null

    // Count mood occurrences
    const moodCounts = {}
    const symptomCounts = {}
    
    moodEntries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1
      entry.symptoms.forEach(symptom => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1
      })
    })

    // Find most common mood and symptoms
    const mostCommonMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]
    const topSymptoms = Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    return {
      totalEntries: moodEntries.length,
      moodCounts,
      symptomCounts,
      mostCommonMood: mostCommonMood ? { mood: mostCommonMood[0], count: mostCommonMood[1] } : null,
      topSymptoms: topSymptoms.map(([symptom, count]) => ({ symptom, count }))
    }
  }

  const value = {
    moodEntries,
    loading,
    addMoodEntry,
    updateMoodEntry,
    deleteMoodEntry,
    getEntryByDate,
    getEntriesInRange,
    analyzePatterns
  }

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>
}
