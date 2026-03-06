import { useState, useEffect } from 'react'
import { useCycle } from '../context/CycleContext'
import { useMood } from '../context/MoodContext'
import Calendar from '../components/Calendar'
import CycleForm from '../components/CycleForm'
import CyclePredictions from '../components/CyclePredictions'
import CycleDetection from '../components/CycleDetection'
import { analyzePMSPatterns, predictNextPMSWindow, shouldShowPMSNotification, getPMSNotificationMessage } from '../utils/pmsPrediction'

const CycleTracking = () => {
  const { cycles, loading, predictions, deleteCycle } = useCycle()
  const { moodEntries } = useMood()
  const [showForm, setShowForm] = useState(false)
  const [showCycleDetection, setShowCycleDetection] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleting, setDeleting] = useState(false)

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

  // Handle delete cycle
  const handleDeleteCycle = async (cycleId) => {
    setDeleting(true)
    const result = await deleteCycle(cycleId)
    setDeleting(false)
    setDeleteConfirm(null)
    
    if (result.success) {
      // Success - cycles will be refetched automatically
    } else {
      alert(result.error || 'Failed to delete cycle')
    }
  }

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
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    cycle.flow === 'light' ? 'bg-blue-100 text-blue-700' :
                    cycle.flow === 'medium' ? 'bg-purple-100 text-purple-700' :
                    'bg-pink-100 text-pink-700'
                  }`}>
                    {cycle.flow || 'N/A'}
                  </span>
                  <button
                    onClick={() => setDeleteConfirm(cycle._id)}
                    className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete cycle"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                Delete Cycle Entry?
              </h3>
              <p className="text-neutral-600">
                Are you sure you want to delete this cycle entry? This action cannot be undone and will recalculate your predictions.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border-2 border-neutral-300 text-neutral-700 rounded-xl font-medium hover:bg-neutral-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCycle(deleteConfirm)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  'Yes, Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CycleTracking
