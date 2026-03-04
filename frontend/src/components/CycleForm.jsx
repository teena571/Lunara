import { useState, useEffect } from 'react'
import { useCycle } from '../context/CycleContext'

const CycleForm = ({ selectedDate, onClose }) => {
  const { addCycle } = useCycle()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    startDate: selectedDate 
      ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
      : '',
    endDate: '',
    periodLength: '',
    flow: 'medium',
    symptoms: [],
    notes: ''
  })

  const symptomOptions = [
    'cramps', 'headache', 'bloating', 'mood_swings', 'fatigue',
    'acne', 'breast_tenderness', 'back_pain', 'nausea'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSymptomToggle = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }))
  }

  const validateForm = () => {
    if (!formData.startDate) {
      setError('Start date is required')
      return false
    }

    if (formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('End date must be after start date')
      return false
    }

    if (formData.periodLength && (formData.periodLength < 1 || formData.periodLength > 10)) {
      setError('Period length must be between 1 and 10 days')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!validateForm()) return

    setLoading(true)

    // Clean up form data - remove empty strings
    const cleanedData = {
      startDate: formData.startDate,
      flow: formData.flow,
      symptoms: formData.symptoms,
    }

    // Only add optional fields if they have values
    if (formData.endDate) cleanedData.endDate = formData.endDate
    if (formData.periodLength) cleanedData.periodLength = parseInt(formData.periodLength)
    if (formData.notes) cleanedData.notes = formData.notes

    const result = await addCycle(cleanedData)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 1500)
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Log Cycle</h2>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4">
              Cycle logged successfully!
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-pink-50 border border-pink-200 text-pink-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                End Date (optional)
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Period Length */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Period Length (days)
              </label>
              <input
                type="number"
                name="periodLength"
                value={formData.periodLength}
                onChange={handleChange}
                min="1"
                max="10"
                className="input-field"
                placeholder="e.g., 5"
              />
            </div>

            {/* Flow */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Flow Intensity
              </label>
              <select
                name="flow"
                value={formData.flow}
                onChange={handleChange}
                className="input-field"
              >
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="heavy">Heavy</option>
              </select>
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Symptoms
              </label>
              <div className="flex flex-wrap gap-2">
                {symptomOptions.map((symptom) => (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => handleSymptomToggle(symptom)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      formData.symptoms.includes(symptom)
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {symptom.replace('_', ' ')}
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
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="input-field"
                rows="3"
                maxLength="500"
                placeholder="Any additional notes..."
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Cycle'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CycleForm
