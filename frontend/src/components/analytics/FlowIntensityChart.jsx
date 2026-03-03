import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const FlowIntensityChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-neutral-200">
          <p className="font-semibold text-neutral-800 mb-1">
            {data.flow} Flow
          </p>
          <p className="text-sm text-neutral-600">
            Count: {data.count} cycles
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-neutral-800 mb-4">
        Flow Intensity Distribution
      </h3>
      <p className="text-sm text-neutral-600 mb-6">
        Track your menstrual flow patterns
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="flow" 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Info Cards */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {data.map((item) => (
          <div 
            key={item.flow}
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${item.fill}20` }}
          >
            <p className="text-xs text-neutral-600 mb-1">{item.flow}</p>
            <p className="text-2xl font-bold" style={{ color: item.fill }}>
              {item.count}
            </p>
          </div>
        ))}
      </div>

      {/* Medical Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
        <p className="font-semibold mb-1">💡 Flow Intensity Guide</p>
        <p>
          <strong>Light:</strong> Spotting or minimal flow • 
          <strong> Medium:</strong> Regular flow, changing pad/tampon every 3-4 hours • 
          <strong> Heavy:</strong> Soaking through protection in 1-2 hours
        </p>
      </div>
    </div>
  )
}

export default FlowIntensityChart
