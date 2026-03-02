import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../utils/axios'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showError, setShowError] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const [loading, setLoading] = useState(false)
  const { token } = useParams()
  const navigate = useNavigate()

  // Message display: visible 4s, fade 1s, total 5s
  useEffect(() => {
    if ((error && showError) || (success && showSuccess)) {
      const fadeTimer = setTimeout(() => {
        setIsFading(true)
      }, 4000)

      const clearTimer = setTimeout(() => {
        setError('')
        setSuccess('')
        setShowError(false)
        setShowSuccess(false)
        setIsFading(false)
      }, 5000)

      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(clearTimer)
      }
    }
  }, [error, success, showError, showSuccess])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setError('')
    setSuccess('')
    setShowError(false)
    setShowSuccess(false)
    setIsFading(false)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setShowError(true)
      return
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setShowError(true)
      return
    }

    setLoading(true)

    try {
      const { data } = await api.post('/auth/reset-password', {
        token,
        newPassword: password
      })

      if (data.success) {
        setSuccess('Password reset successful! Redirecting to login...')
        setShowSuccess(true)
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }
    } catch (err) {
      const errorData = err.response?.data
      setError(errorData?.message || 'Failed to reset password. Token may be invalid or expired.')
      setShowError(true)
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
              Reset Password
            </h2>
            <p className="text-neutral-600">
              Enter your new password below
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && success && (
            <div 
              className={`bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 transition-opacity duration-1000 ${
                isFading ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <p className="font-medium">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {showError && error && (
            <div 
              className={`bg-pink-50 border border-pink-200 text-pink-700 px-4 py-3 rounded-xl mb-4 transition-opacity duration-1000 ${
                isFading ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter new password"
                minLength={6}
                required
              />
              <p className="text-xs text-neutral-500 mt-1">
                Must be at least 6 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="Confirm new password"
                minLength={6}
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
                  Resetting...
                </span>
              ) : (
                'Reset Password'
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

export default ResetPassword
