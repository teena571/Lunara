import { useState, useEffect } from 'react'
import { useMood } from '../context/MoodContext'

const MOODS = [
  { value: 'happy', label: 'Happy', emoji: '😊', color: 'bg-yellow-100 border-yellow-300 text-yellow-700' },
  { value: 'calm', label: 'Calm', emoji: '😌', color: 'bg-blue-100 border-blue-300 text-blue-700' },
  { value: 'energetic', label: 'Energetic', emoji: '⚡', color: 'bg-green-100 border-green-300 text-green-700' },
  { value: 'sad', label: 'Sad', emoji: '😢', color: 'bg-indigo-100 border-indigo-300 text-indigo-700' },
  { value: 'anxious', label: 'Anxious', emoji: '😰', color: 'bg-purple-100 border-purple-300 text-purple-700' },
  { value: 'irritable', label: 'Irritable', emoji: '😠', color: 'bg-red-100 border-red-300 text-red-700' },
  { value: 'tired', label: 'Tired', emoji: '😴', color: 'bg-gray-100 border-gray-300 text-gray-700' },
  { value: 'stressed', label: 'Stressed', emoji: '😫', color: 'bg-orange-100 border-orange-300 text-orange-700' }
]

const SYMPTOMS = [
  'cramps',
  'headache',
  'bloating',
  'fatigue',
  'acne',
  'breast_tenderness',
  'back_pain',
  'nausea',
  'mood_swings',
  'insomnia',
  'food_cravings',
  'hot_flashes'
]

const MoodForm = ({ selectedDate, existingEntry, onClose }) => {
  const { addMoodEntry, updateMoodEntry } = useMood()
  const [date, setDate] = useState('')
  const [mood, setMood] = useState('')
  const [symptoms, setSymptoms] = useState([])
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (existingEntry) {
      setDate(new Date(existingEntry.date).toISOString().split('T')[0])
      setMood(existingEntry.mood)
      setSymptoms(existingEntry.symptoms || [])
      setNotes(existingEntry.notes || '')
    } else if (selectedDate) {
      setDate(new Date(selectedDate).toISOString().split('T')[0])
    } else {
      setDate(new Date().toISOString().split('T')[0])
    }
  }, [selectedDate, existingEntry])

  const handleSymptomToggle = (symptom) => {
    setSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!mood) {
      setError('Please select a mood')
      return
    }

    const entryData = {
      date: new Date(date),
      mood,
      symptoms,
      notes: notes.trim()
    }

    if (existingEntry) {
      updateMoodEntry(existingEntry.id, entryData)
    } else {
      addMoodEntry(entryData)
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-neutral-800">
              {existingEntry ? 'Edit Entry' : 'Log Mood & Symptoms'}
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="input-field"
                required
              />
            </div>

            {/* Mood Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                How are you feeling? *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {MOODS.map((moodOption) => (
                  <button
                    key={moodOption.value}
                    type="button"
                    onClick={() => setMood(moodOption.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      mood === moodOption.value
                        ? moodOption.color + ' scale-105'
                        : 'bg-white border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="text-3xl mb-1">{moodOption.emoji}</div>
                    <div className="text-sm font-medium">{moodOption.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Physical Symptoms (optional)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SYMPTOMS.map((symptom) => (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => handleSymptomToggle(symptom)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      symptoms.includes(symptom)
                        ? 'bg-wellness-lavender text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {symptom.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-field resize-none"
                rows="3"
                maxLength="500"
                placeholder="Any additional thoughts or observations..."
              />
              <p className="text-xs text-neutral-500 mt-1">
                {notes.length}/500 characters
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary"
              >
                {existingEntry ? 'Update Entry' : 'Save Entry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default MoodForm
