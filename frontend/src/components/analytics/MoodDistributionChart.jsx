import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const MoodDistributionChart = ({ data }) => {
  const MOOD_EMOJIS = {
    Happy: '😊',
    Calm: '😌',
    Energetic: '⚡',
    Sad: '😢',
    Anxious: '😰',
    Irritable: '😠',
    Tired: '😴',
    Stressed: '😫'
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (percent < 0.05) return null // Don't show label if less than 5%

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: '14px', fontWeight: 'bold' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-neutral-200">
          <p className="font-semibold text-neutral-800 mb-1">
            {MOOD_EMOJIS[data.name]} {data.name}
          </p>
          <p className="text-sm text-neutral-600">
            Count: {data.value}
          </p>
          <p className="text-sm text-neutral-600">
            {data.percentage}% of total
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-neutral-800 mb-4">
        Mood Distribution
      </h3>
      <p className="text-sm text-neutral-600 mb-6">
        Breakdown of your emotional patterns
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.fill }}
            />
            <span className="text-neutral-700">
              {MOOD_EMOJIS[entry.name]} {entry.name} ({entry.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MoodDistributionChart
