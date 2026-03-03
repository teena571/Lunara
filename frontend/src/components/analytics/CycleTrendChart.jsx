import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const CycleTrendChart = ({ data }) => {
  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-neutral-800 mb-4">
        Cycle Length Trend
      </h3>
      <p className="text-sm text-neutral-600 mb-6">
        Track how your cycle length changes over time
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '8px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="cycleLength" 
            stroke="#9b87f5" 
            strokeWidth={2}
            name="Cycle Length"
            dot={{ fill: '#9b87f5', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="periodLength" 
            stroke="#f97583" 
            strokeWidth={2}
            name="Period Length"
            dot={{ fill: '#f97583', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Reference Lines */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-neutral-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-100 border border-green-400 rounded"></div>
          <span>Normal range: 21-35 days</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-100 border border-orange-400 rounded"></div>
          <span>Irregular: &lt;21 or &gt;35 days</span>
        </div>
      </div>
    </div>
  )
}

export default CycleTrendChart
