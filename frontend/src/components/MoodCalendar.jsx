import { useState } from 'react'
import { useMood } from '../context/MoodContext'

const MOOD_COLORS = {
  happy: 'bg-yellow-400',
  calm: 'bg-blue-400',
  energetic: 'bg-green-400',
  sad: 'bg-indigo-400',
  anxious: 'bg-purple-400',
  irritable: 'bg-red-400',
  tired: 'bg-gray-400',
  stressed: 'bg-orange-400'
}

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

const MoodCalendar = ({ onDateClick }) => {
  const { getEntryByDate } = useMood()
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  // Generate calendar days
  const calendarDays = []
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i)
    })
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      date: new Date(year, month, day)
    })
  }
  
  // Next month days to fill grid
  const remainingDays = 42 - calendarDays.length
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      date: new Date(year, month + 1, day)
    })
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1))
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className="text-lg font-semibold">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs sm:text-sm font-medium text-neutral-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {calendarDays.map((dayInfo, index) => {
          const entry = getEntryByDate(dayInfo.date)
          const isTodayDate = isToday(dayInfo.date)
          
          return (
            <button
              key={index}
              onClick={() => onDateClick(dayInfo.date)}
              disabled={!dayInfo.isCurrentMonth}
              className={`
                aspect-square p-1 sm:p-2 rounded-lg transition-all duration-200
                ${dayInfo.isCurrentMonth ? 'hover:bg-neutral-100' : 'opacity-30'}
                ${isTodayDate ? 'ring-2 ring-primary-500' : ''}
                relative
              `}
            >
              <div className="text-xs sm:text-sm font-medium text-neutral-700">
                {dayInfo.day}
              </div>
              
              {entry && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-2xl sm:text-3xl">
                    {MOOD_EMOJIS[entry.mood]}
                  </div>
                </div>
              )}
              
              {entry && entry.symptoms.length > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="flex gap-0.5">
                    {entry.symptoms.slice(0, 3).map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-wellness-rose" />
                    ))}
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-neutral-200">
        <p className="text-xs text-neutral-600 mb-2">Legend:</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-primary-500" />
            <span className="text-neutral-600">Today</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xl">😊</span>
            <span className="text-neutral-600">Mood logged</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-wellness-rose" />
            <span className="text-neutral-600">Has symptoms</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoodCalendar
