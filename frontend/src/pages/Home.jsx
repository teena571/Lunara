import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="wellness-gradient py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-neutral-800 mb-6">
            Your Wellness Journey,
            <br />
            <span className="text-primary-600">Beautifully Tracked</span>
          </h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Lunara helps you understand your cycle, track symptoms, and embrace your wellness with intelligence and care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary text-lg">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg">
                  Start Your Journey
                </Link>
                <Link to="/login" className="btn-secondary text-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Wellness Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-wellness-peach rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl">
                📅
              </div>
              <h3 className="text-xl font-semibold mb-2">Cycle Tracking</h3>
              <p className="text-neutral-600">
                Track your cycle with ease and get personalized predictions
              </p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-wellness-lavender rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl">
                💭
              </div>
              <h3 className="text-xl font-semibold mb-2">Mood & Symptoms</h3>
              <p className="text-neutral-600">
                Log your mood and symptoms to understand patterns
              </p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-wellness-mint rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl">
                📊
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Insights</h3>
              <p className="text-neutral-600">
                Get AI-powered insights about your wellness journey
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
