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
      console.error('Error fetching cycles:', error)
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

    // Calculate average cycle length
    const cycleLengths = cycleData
      .filter(c => c.cycleLength)
      .map(c => c.cycleLength)
    
    const avgCycleLength = cycleLengths.length > 0
      ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
      : 28

    // Get last cycle
    const lastCycle = cycleData.sort((a, b) => 
      new Date(b.startDate) - new Date(a.startDate)
    )[0]

    if (lastCycle) {
      const lastStartDate = new Date(lastCycle.startDate)
      const nextStartDate = new Date(lastStartDate)
      nextStartDate.setDate(nextStartDate.getDate() + avgCycleLength)

      // Calculate fertile window (typically days 10-17 of cycle)
      const fertileStart = new Date(nextStartDate)
      fertileStart.setDate(fertileStart.getDate() + 10)
      const fertileEnd = new Date(nextStartDate)
      fertileEnd.setDate(fertileEnd.getDate() + 17)

      setPredictions({
        nextPeriodDate: nextStartDate,
        avgCycleLength,
        fertileWindow: {
          start: fertileStart,
          end: fertileEnd
        },
        daysUntilPeriod: Math.ceil((nextStartDate - new Date()) / (1000 * 60 * 60 * 24))
      })
    }
  }

  // Add new cycle
  const addCycle = async (cycleData) => {
    try {
      const { data } = await api.post('/cycles', cycleData)
      await fetchCycles()
      return { success: true, data: data.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add cycle'
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
    fetchCycles()
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
