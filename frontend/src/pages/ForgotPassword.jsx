import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/axios'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const [loading, setLoading] = useState(false)

  // Message display: visible 4s, fade 1s, total 5s
  useEffect(() => {
    if (message && showMessage) {
      const fadeTimer = setTimeout(() => {
        setIsFading(true)
      }, 4000)

      const clearTimer = setTimeout(() => {
        setMessage('')
        setShowMessage(false)
        setIsFading(false)
      }, 5000)

      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(clearTimer)
      }
    }
  }, [message, showMessage])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setMessage('')
    setShowMessage(false)
    setIsFading(false)
    setLoading(true)

    try {
      const { data } = await api.post('/auth/request-reset', { email })
      
      setMessage(data.message || 'If this email exists, a reset link has been sent.')
      setShowMessage(true)
      setEmail('')
    } catch (error) {
      setMessage('If this email exists, a reset link has been sent.')
      setShowMessage(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-neutral-800 mb-2">
              Forgot Password?
            </h2>
            <p className="text-neutral-600">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {/* Success Message */}
          {showMessage && message && (
            <div 
              className={`bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl mb-4 transition-opacity duration-1000 ${
                isFading ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <p className="font-medium">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
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
                  Sending...
                </span>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link 
              to="/login" 
              className="text-sm text-secondary-600 hover:text-secondary-700 transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
