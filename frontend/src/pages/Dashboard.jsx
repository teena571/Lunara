import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-neutral-800 mb-2">
          Welcome back, {user?.name}! 🌸
        </h1>
        <p className="text-neutral-600">Here's your wellness overview</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-wellness-peach to-wellness-rose">
          <h3 className="text-lg font-semibold mb-2">Cycle Day</h3>
          <p className="text-3xl font-bold">-</p>
          <p className="text-sm text-neutral-600 mt-1">Track your cycle</p>
        </div>
        
        <div className="card bg-gradient-to-br from-wellness-lavender to-secondary-100">
          <h3 className="text-lg font-semibold mb-2">Mood Today</h3>
          <p className="text-3xl font-bold">😊</p>
          <p className="text-sm text-neutral-600 mt-1">Log your mood</p>
        </div>
        
        <div className="card bg-gradient-to-br from-wellness-mint to-wellness-sage">
          <h3 className="text-lg font-semibold mb-2">Insights</h3>
          <p className="text-3xl font-bold">0</p>
          <p className="text-sm text-neutral-600 mt-1">View patterns</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <button className="btn-primary text-left">
            📝 Log Today's Entry
          </button>
          <button className="btn-secondary text-left">
            📊 View Analytics
          </button>
          <button 
            onClick={() => window.location.href = '/update-password'}
            className="btn-secondary text-left"
          >
            🔒 Change Password
          </button>
          <button className="btn-secondary text-left">
            ⚙️ Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
