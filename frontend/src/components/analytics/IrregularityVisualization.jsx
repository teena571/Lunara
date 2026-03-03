import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

const IrregularityVisualization = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-neutral-200">
          <p className="font-semibold text-neutral-800 mb-1">
            {data.date}
          </p>
          <p className="text-sm text-neutral-600">
            Variation: {data.stdDev} days
          </p>
          <p className={`text-sm font-semibold ${
            data.isIrregular ? 'text-orange-600' : 'text-green-600'
          }`}>
            {data.isIrregular ? '⚠️ Irregular' : '✅ Regular'}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-neutral-800 mb-4">
        Cycle Regularity Trend
      </h3>
      <p className="text-sm text-neutral-600 mb-6">
        Monitor cycle variation over time (lower is better)
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorStdDev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            label={{ value: 'Std Dev (days)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={8} 
            stroke="#F97316" 
            strokeDasharray="3 3"
            label={{ value: 'Irregular Threshold', position: 'right', fill: '#F97316', fontSize: 12 }}
          />
          <Area 
            type="monotone" 
            dataKey="stdDev" 
            stroke="#9b87f5" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorStdDev)" 
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Status Indicators */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-xs text-green-700 mb-1">Regular Cycles</p>
          <p className="text-2xl font-bold text-green-600">
            {data.filter(d => !d.isIrregular).length}
          </p>
          <p className="text-xs text-green-600">Variation &lt; 8 days</p>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg">
          <p className="text-xs text-orange-700 mb-1">Irregular Cycles</p>
          <p className="text-2xl font-bold text-orange-600">
            {data.filter(d => d.isIrregular).length}
          </p>
          <p className="text-xs text-orange-600">Variation ≥ 8 days</p>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
        <p className="font-semibold mb-1">📊 Understanding Regularity</p>
        <p>
          Standard deviation measures cycle variation. Lower values indicate more predictable cycles. 
          Values above 8 days suggest irregular patterns that may benefit from medical consultation.
        </p>
      </div>
    </div>
  )
}

export default IrregularityVisualization
