import { useState } from 'react'
import { useMood } from '../context/MoodContext'
import MoodCalendar from '../components/MoodCalendar'
import MoodForm from '../components/MoodForm'
import MoodPatterns from '../components/MoodPatterns'

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

const MoodTracking = () => {
  const { moodEntries, deleteMoodEntry, getEntryByDate } = useMood()
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [editingEntry, setEditingEntry] = useState(null)
  const [viewMode, setViewMode] = useState('calendar') // 'calendar' or 'list'

  const handleDateClick = (date) => {
    const existingEntry = getEntryByDate(date)
    if (existingEntry) {
      setEditingEntry(existingEntry)
    } else {
      setSelectedDate(date)
      setEditingEntry(null)
    }
    setShowForm(true)
  }

  const handleEdit = (entry) => {
    setEditingEntry(entry)
    setSelectedDate(null)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteMoodEntry(id)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedDate(null)
    setEditingEntry(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-neutral-800 mb-2">
          Mood & Symptoms 💭
        </h1>
        <p className="text-neutral-600">
          Track your daily mood and physical symptoms to identify patterns
        </p>
      </div>

      {/* Patterns Card */}
      <div className="mb-8">
        <MoodPatterns />
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-4">
        <button
          onClick={() => {
            setSelectedDate(new Date())
            setEditingEntry(null)
            setShowForm(true)
          }}
          className="btn-primary"
        >
          + Log Today's Mood
        </button>

        {/* View Toggle */}
        <div className="flex bg-neutral-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'calendar'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-800'
            }`}
          >
            📅 Calendar
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-800'
            }`}
          >
            📋 List
          </button>
        </div>
      </div>

      {/* Calendar or List View */}
      {viewMode === 'calendar' ? (
        <div className="card mb-8">
          <h2 className="text-2xl font-semibold mb-4">Calendar View</h2>
          <MoodCalendar onDateClick={handleDateClick} />
        </div>
      ) : (
        <div className="card mb-8">
          <h2 className="text-2xl font-semibold mb-4">Entry History</h2>
          {moodEntries.length === 0 ? (
            <p className="text-neutral-600 text-center py-8">
              No entries yet. Start tracking your mood to see patterns!
            </p>
          ) : (
            <div className="space-y-4">
              {moodEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-wellness-cream rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-3 sm:mb-0">
                    <div className="text-4xl">{MOOD_EMOJIS[entry.mood]}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-lg capitalize">{entry.mood}</p>
                        <span className="text-sm text-neutral-500">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      {entry.symptoms.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {entry.symptoms.map((symptom) => (
                            <span
                              key={symptom}
                              className="px-2 py-1 bg-wellness-lavender/20 text-wellness-lavender text-xs rounded-full"
                            >
                              {symptom.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {entry.notes && (
                        <p className="text-sm text-neutral-600 mt-2 line-clamp-2">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 sm:ml-4">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="px-3 py-2 text-sm bg-white border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="px-3 py-2 text-sm bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mood Form Modal */}
      {showForm && (
        <MoodForm
          selectedDate={selectedDate}
          existingEntry={editingEntry}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}

export default MoodTracking
