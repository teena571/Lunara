import { useState } from 'react'

const Calendar = ({ cycles, predictions, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1).getDay()
  }

  const isDateInRange = (date, startDate, endDate) => {
    const d = new Date(date)
    const start = new Date(startDate)
    const end = new Date(endDate)
    d.setHours(0, 0, 0, 0)
    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)
    return d >= start && d <= end
  }

  const getDayType = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    date.setHours(0, 0, 0, 0)

    // Check if it's a period day
    for (const cycle of cycles) {
      const startDate = new Date(cycle.startDate)
      startDate.setHours(0, 0, 0, 0)
      
      if (cycle.endDate) {
        const endDate = new Date(cycle.endDate)
        endDate.setHours(0, 0, 0, 0)
        if (isDateInRange(date, startDate, endDate)) {
          return 'period'
        }
      } else if (cycle.periodLength) {
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + cycle.periodLength - 1)
        if (isDateInRange(date, startDate, endDate)) {
          return 'period'
        }
      }
    }

    // Check if it's predicted period
    if (predictions && predictions.nextPeriodDate) {
      const predictedStart = new Date(predictions.nextPeriodDate)
      predictedStart.setHours(0, 0, 0, 0)
      const predictedEnd = new Date(predictedStart)
      predictedEnd.setDate(predictedEnd.getDate() + 5) // Assume 5 days
      
      if (isDateInRange(date, predictedStart, predictedEnd)) {
        return 'predicted-period'
      }
    }

    // Check if it's fertile window
    if (predictions && predictions.fertileWindow) {
      const fertileStart = new Date(predictions.fertileWindow.start)
      const fertileEnd = new Date(predictions.fertileWindow.end)
      if (isDateInRange(date, fertileStart, fertileEnd)) {
        return 'fertile'
      }
    }

    return 'normal'
  }

  const getDayClass = (type) => {
    switch (type) {
      case 'period':
        return 'bg-pink-500 text-white hover:bg-pink-600'
      case 'predicted-period':
        return 'bg-pink-200 text-pink-800 hover:bg-pink-300 border-2 border-dashed border-pink-400'
      case 'fertile':
        return 'bg-green-100 text-green-800 hover:bg-green-200'
      default:
        return 'bg-white hover:bg-neutral-100'
    }
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = []

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>)
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayType = getDayType(day)
    const isToday = 
      day === new Date().getDate() &&
      currentDate.getMonth() === new Date().getMonth() &&
      currentDate.getFullYear() === new Date().getFullYear()

    days.push(
      <button
        key={day}
        onClick={() => onDateClick(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
        className={`p-2 rounded-lg text-center transition-all duration-200 ${getDayClass(dayType)} ${
          isToday ? 'ring-2 ring-primary-500' : ''
        }`}
      >
        <span className="text-sm font-medium">{day}</span>
      </button>
    )
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  return (
    <div>
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          ←
        </button>
        <h3 className="text-xl font-semibold">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          →
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-neutral-600 p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-pink-500 rounded"></div>
          <span>Period</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-pink-200 border-2 border-dashed border-pink-400 rounded"></div>
          <span>Predicted Period</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 rounded"></div>
          <span>Fertile Window</span>
        </div>
      </div>
    </div>
  )
}

export default Calendar
