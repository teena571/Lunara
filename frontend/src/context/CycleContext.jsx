import { createContext, useState, useContext, useEffect } from 'react'
import api from '../utils/axios'

const CycleContext = createContext()

export const useCycle = () => {
  const context = useContext(CycleContext)
  if (!context) {
    throw new Error('useCycle must be used within a CycleProvider')
  }
  return context
}

export const CycleProvider = ({ children }) => {
  const [cycles, setCycles] = useState([])
  const [loading, setLoading] = useState(false)
  const [predictions, setPredictions] = useState(null)

  // Fetch cycles from API
  const fetchCycles = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/cycles')
      setCycles(data.data || [])
      calculatePredictions(data.data || [])
    } catch (error) {
      // Don't log error if it's 401 (unauthorized) or 400 (validation) - user not logged in
      if (error.response?.status !== 401 && error.response?.status !== 400) {
        console.error('Error fetching cycles:', error)
      }
      setCycles([])
      setPredictions(null)
    } finally {
      setLoading(false)
    }
  }

  // Calculate predictions based on historical data
  const calculatePredictions = (cycleData) => {
    if (cycleData.length === 0) {
      setPredictions(null)
      return
    }

    // Sort cycles by start date (most recent first)
    const sortedCycles = [...cycleData].sort((a, b) => 
      new Date(b.startDate) - new Date(a.startDate)
    )

    // Calculate dynamic cycle length from actual data
    let avgCycleLength = 28 // Default fallback

    if (sortedCycles.length >= 2) {
      // Calculate differences between consecutive cycles
      const cycleLengths = []
      
      for (let i = 0; i < sortedCycles.length - 1; i++) {
        const currentStart = new Date(sortedCycles[i].startDate)
        const previousStart = new Date(sortedCycles[i + 1].startDate)
        
        // Calculate days between periods
        const diffTime = currentStart - previousStart
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays > 0 && diffDays <= 45) { // Valid cycle length
          cycleLengths.push(diffDays)
        }
      }

      // Use average of last 2-3 cycles for better accuracy
      if (cycleLengths.length > 0) {
        const recentCycles = cycleLengths.slice(0, 3) // Last 3 cycles
        avgCycleLength = Math.round(
          recentCycles.reduce((a, b) => a + b, 0) / recentCycles.length
        )
      }
    } else if (sortedCycles.length === 1 && sortedCycles[0].cycleLength) {
      // If only one cycle, use its cycle length if available
      avgCycleLength = sortedCycles[0].cycleLength
    }

    // Get last cycle
    const lastCycle = sortedCycles[0]
    const lastStartDate = new Date(lastCycle.startDate)
    
    // Predict next period: Last period + calculated cycle length
    const nextStartDate = new Date(lastStartDate)
    nextStartDate.setDate(nextStartDate.getDate() + avgCycleLength)

    // Calculate ovulation (14 days before next period)
    const ovulationDate = new Date(nextStartDate)
    ovulationDate.setDate(ovulationDate.getDate() - 14)

    // Calculate fertile window (5 days before ovulation to 1 day after)
    const fertileStart = new Date(ovulationDate)
    fertileStart.setDate(fertileStart.getDate() - 5)
    const fertileEnd = new Date(ovulationDate)
    fertileEnd.setDate(fertileEnd.getDate() + 1)

    // Calculate days until period
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const nextPeriod = new Date(nextStartDate)
    nextPeriod.setHours(0, 0, 0, 0)
    const daysUntilPeriod = Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24))

    setPredictions({
      nextPeriodDate: nextStartDate,
      avgCycleLength,
      ovulationDate,
      fertileWindow: {
        start: fertileStart,
        end: fertileEnd
      },
      daysUntilPeriod,
      calculationMethod: sortedCycles.length >= 2 ? 'dynamic' : 'default'
    })
  }

  // Add new cycle
  const addCycle = async (cycleData) => {
    try {
      const { data } = await api.post('/cycles', cycleData)
      await fetchCycles()
      return { success: true, data: data.data }
    } catch (error) {
      console.error('Add cycle error:', error.response?.data)
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Failed to add cycle'
      }
    }
  }

  // Update cycle
  const updateCycle = async (id, cycleData) => {
    try {
      const { data } = await api.put(`/cycles/${id}`, cycleData)
      await fetchCycles()
      return { success: true, data: data.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update cycle'
      }
    }
  }

  // Delete cycle
  const deleteCycle = async (id) => {
    try {
      await api.delete(`/cycles/${id}`)
      await fetchCycles()
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete cycle'
      }
    }
  }

  useEffect(() => {
    // Only fetch cycles if user has a token
    const token = localStorage.getItem('token')
    if (token) {
      fetchCycles()
    } else {
      setLoading(false)
    }
  }, [])

  const value = {
    cycles,
    loading,
    predictions,
    fetchCycles,
    addCycle,
    updateCycle,
    deleteCycle
  }

  return <CycleContext.Provider value={value}>{children}</CycleContext.Provider>
}
