import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Banner from '../components/Banner'
import FeatureCard from '../components/FeatureCard'

const Home = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Banner Section */}
      <Banner />
      
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
            <FeatureCard
              icon="📅"
              title="Cycle Tracking"
              description="Track your cycle with ease and get personalized predictions"
              path="/cycle"
              bgColor="bg-wellness-peach"
            />
            <FeatureCard
              icon="💭"
              title="Mood & Symptoms"
              description="Log your mood and symptoms to understand patterns"
              path="/mood"
              bgColor="bg-wellness-lavender"
            />
            <FeatureCard
              icon="📊"
              title="Smart Insights"
              description="Get AI-powered insights about your wellness journey"
              path="/insights"
              bgColor="bg-wellness-mint"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
