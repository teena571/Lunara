import { createContext, useState, useEffect, useContext } from 'react'
import api from '../utils/axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }

  const login = async (email, password) => {
    try {
      console.log('Attempting login...', { email }) // Debug log
      const { data } = await api.post('/auth/login', { email, password })
      
      console.log('Login successful:', data) // Debug log
      
      // Clear any old user data from localStorage
      clearOldUserData()
      
      // Store token and user in localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Update state
      setUser(data.user)
      
      return { 
        success: true,
        message: data.message 
      }
    } catch (error) {
      console.error('Login error:', error) // Debug log
      console.error('Error response:', error.response) // Debug log
      
      const errorData = error.response?.data
      
      // Network error
      if (!error.response) {
        return {
          success: false,
          message: 'Network error. Please check your internet connection.',
          code: 'NETWORK_ERROR'
        }
      }
      
      return {
        success: false,
        message: errorData?.message || errorData?.error || 'Login failed',
        code: errorData?.code
      }
    }
  }

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password })
      
      // Clear any old user data from localStorage
      clearOldUserData()
      
      // Store token and user in localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Update state
      setUser(data.user)
      
      return { 
        success: true,
        message: data.message 
      }
    } catch (error) {
      const errorData = error.response?.data
      
      // Handle validation errors
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        const errorMessages = errorData.errors.map(err => err.message).join(', ')
        return {
          success: false,
          message: errorMessages,
          error: errorMessages,
          code: errorData.code
        }
      }
      
      return {
        success: false,
        message: errorData?.message || errorData?.error || 'Registration failed',
        error: errorData?.error || 'Registration failed',
        code: errorData?.code
      }
    }
  }

  const clearOldUserData = () => {
    // Remove all user-specific data from localStorage
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.startsWith('moodEntries_') || key === 'moodEntries')) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key))
  }

  const logout = () => {
    // Clear all user-specific data from localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('moodEntries') // Clear mood data
    
    // Clear state
    setUser(null)
    
    // Force page reload to clear all contexts
    window.location.href = '/login'
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
