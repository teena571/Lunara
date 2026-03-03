import { useState, useEffect } from 'react'
import { useCycle } from '../context/CycleContext'
import { useMood } from '../context/MoodContext'
import Calendar from '../components/Calendar'
import CycleForm from '../components/CycleForm'
import CyclePredictions from '../components/CyclePredictions'
import CycleDetection from '../components/CycleDetection'
import { analyzePMSPatterns, predictNextPMSWindow, shouldShowPMSNotification, getPMSNotificationMessage } from '../utils/pmsPrediction'

const CycleTracking = () => {
  const { cycles, loading, predictions } = useCycle()
  const { moodEntries } = useMood()
  const [showForm, setShowForm] = useState(false)
  const [showCycleDetection, setShowCycleDetection] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  // Check if period is approaching (within 3 days)
  useEffect(() => {
    if (predictions && predictions.daysUntilPeriod <= 3 && predictions.daysUntilPeriod > 0) {
      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Period Reminder', {
          body: `Your period is expected in ${predictions.daysUntilPeriod} days`,
          icon: '/favicon.ico'
        })
      }
    }
  }, [predictions])

  // Check for PMS notification (1-2 days before PMS window)
  useEffect(() => {
    if (cycles.length >= 2 && moodEntries.length > 0 && predictions) {
      const pmsAnalysis = analyzePMSPatterns(cycles, moodEntries)
      const pmsWindow = predictNextPMSWindow(predictions)
      
      if (pmsWindow && pmsWindow.shouldNotify) {
        const pmsPrediction = {
          available: pmsAnalysis.hasSufficientData,
          hasPatterns: pmsAnalysis.hasRecurringPatterns,
          recurringMoods: pmsAnalysis.recurringMoods || [],
          nextPMSWindow: pmsWindow
        }

        if (shouldShowPMSNotification(pmsPrediction)) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('PMS Alert 🎯', {
              body: getPMSNotificationMessage(pmsPrediction),
              icon: '/favicon.ico'
            })
          }
        }
      }
    }
  }, [cycles, moodEntries, predictions])

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-neutral-800 mb-2">
          Cycle Tracking 📅
        </h1>
        <p className="text-neutral-600">
          Track your menstrual cycle and get personalized predictions
        </p>
      </div>

      {/* Predictions Card */}
      {predictions && <CyclePredictions predictions={predictions} />}

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Log New Cycle Card */}
        <button
          onClick={() => setShowForm(true)}
          className="card hover:shadow-lg transition-shadow text-left p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-2xl">
              ➕
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Log New Cycle</h3>
              <p className="text-sm text-gray-600">Track your period start date</p>
            </div>
          </div>
        </button>

        {/* Cycle Detection Card */}
        <button
          onClick={() => setShowCycleDetection(true)}
          className="card hover:shadow-lg transition-shadow text-left p-6 bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-2xl">
              🔍
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Cycle Detection</h3>
              <p className="text-sm text-gray-600">View insights & PMS prediction</p>
            </div>
          </div>
        </button>
      </div>

      {/* Calendar */}
      <div className="card mb-8">
        <h2 className="text-2xl font-semibold mb-4">Calendar View</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <Calendar
            cycles={cycles}
            predictions={predictions}
            onDateClick={(date) => {
              setSelectedDate(date)
              setShowForm(true)
            }}
          />
        )}
      </div>

      {/* Cycle History */}
      <div className="card">
        <h2 className="text-2xl font-semibold mb-4">Cycle History</h2>
        {cycles.length === 0 ? (
          <p className="text-neutral-600 text-center py-8">
            No cycles logged yet. Start tracking your cycle to see predictions!
          </p>
        ) : (
          <div className="space-y-4">
            {cycles.slice(0, 5).map((cycle) => (
              <div
                key={cycle._id}
                className="flex justify-between items-center p-4 bg-wellness-cream rounded-xl"
              >
                <div>
                  <p className="font-semibold">
                    {new Date(cycle.startDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {cycle.cycleLength ? `${cycle.cycleLength} days` : 'Ongoing'}
                    {cycle.periodLength && ` • ${cycle.periodLength} day period`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    cycle.flow === 'light' ? 'bg-blue-100 text-blue-700' :
                    cycle.flow === 'medium' ? 'bg-purple-100 text-purple-700' :
                    'bg-pink-100 text-pink-700'
                  }`}>
                    {cycle.flow || 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cycle Form Modal */}
      {showForm && (
        <CycleForm
          selectedDate={selectedDate}
          onClose={() => {
            setShowForm(false)
            setSelectedDate(null)
          }}
        />
      )}

      {/* Cycle Detection Modal */}
      {showCycleDetection && (
        <CycleDetection onClose={() => setShowCycleDetection(false)} />
      )}
    </div>
  )
}

export default CycleTracking
