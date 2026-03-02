import { useState, useEffect } from 'react'
import { useCycle } from '../context/CycleContext'
import Calendar from '../components/Calendar'
import CycleForm from '../components/CycleForm'
import CyclePredictions from '../components/CyclePredictions'

const CycleTracking = () => {
  const { cycles, loading, predictions } = useCycle()
  const [showForm, setShowForm] = useState(false)
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

      {/* Action Buttons */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          + Log New Cycle
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
    </div>
  )
}

export default CycleTracking
