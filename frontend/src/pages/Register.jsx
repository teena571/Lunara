import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const [emailExists, setEmailExists] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  
  // Use refs to store timer IDs
  const fadeTimerRef = useRef(null)
  const clearTimerRef = useRef(null)

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear any existing timers
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current)
    
    // Clear previous errors
    setError('')
    setShowError(false)
    setIsFading(false)
    setEmailExists(false)
    setLoading(true)

    const result = await register(name, email, password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      // Set error and show it
      const errorMessage = result.message || result.error
      const isEmailExists = result.code === 'EMAIL_EXISTS'
      
      setError(errorMessage)
      setShowError(true)
      setEmailExists(isEmailExists)
      setIsFading(false)
      
      // Start fade after 4 seconds
      fadeTimerRef.current = setTimeout(() => {
        setIsFading(true)
      }, 4000)

      // Clear error completely after 5 seconds
      clearTimerRef.current = setTimeout(() => {
        setError('')
        setShowError(false)
        setIsFading(false)
        setEmailExists(false)
      }, 5000)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-neutral-800 mb-2">
              Start Your Journey
            </h2>
            <p className="text-neutral-600">Create your Lunara account</p>
          </div>

          {/* Error Message - Visible 4s, Fade 1s, Total 5s */}
          {showError && error && (
            <div 
              className={`border px-4 py-3 rounded-xl mb-4 transition-opacity duration-1000 ease-in-out ${
                isFading ? 'opacity-0' : 'opacity-100'
              } ${
                emailExists 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-pink-50 border-pink-200 text-pink-700'
              }`}
              style={{ willChange: 'opacity' }}
            >
              <p className="font-medium mb-1">{error}</p>
              {emailExists && (
                <Link 
                  to="/login" 
                  className="text-sm underline hover:no-underline font-medium transition-colors"
                >
                  Login instead →
                </Link>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                minLength={6}
                required
              />
              <p className="text-xs text-neutral-500 mt-1">
                Must be at least 6 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-neutral-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
