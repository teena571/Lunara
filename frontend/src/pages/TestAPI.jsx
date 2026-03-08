import { useState } from 'react'
import api from '../utils/axios'

const TestAPI = () => {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult('Testing...')
    
    try {
      // Test 1: Check if API is reachable
      const response = await api.get('/auth/me')
      setResult(`✅ API Connected!\nResponse: ${JSON.stringify(response.data, null, 2)}`)
    } catch (error) {
      let errorMsg = '❌ Connection Failed!\n\n'
      
      if (!error.response) {
        // Network error
        errorMsg += 'Error Type: Network Error\n'
        errorMsg += 'Message: Cannot reach backend server\n'
        errorMsg += `API URL: ${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}\n`
        errorMsg += '\nPossible causes:\n'
        errorMsg += '1. Backend server is not running\n'
        errorMsg += '2. Wrong API URL in .env file\n'
        errorMsg += '3. CORS issue\n'
        errorMsg += '4. Network/Internet issue'
      } else {
        // Server responded with error
        errorMsg += `Status: ${error.response.status}\n`
        errorMsg += `Message: ${JSON.stringify(error.response.data, null, 2)}`
      }
      
      setResult(errorMsg)
    }
    
    setLoading(false)
  }

  const testLogin = async () => {
    setLoading(true)
    setResult('Testing login...')
    
    try {
      const response = await api.post('/auth/login', {
        email: 'test@test.com',
        password: 'test123'
      })
      setResult(`✅ Login Test Successful!\nResponse: ${JSON.stringify(response.data, null, 2)}`)
    } catch (error) {
      let errorMsg = '❌ Login Test Failed!\n\n'
      
      if (!error.response) {
        errorMsg += 'Error Type: Network Error\n'
        errorMsg += 'Cannot reach backend server\n'
        errorMsg += `API URL: ${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}`
      } else {
        errorMsg += `Status: ${error.response.status}\n`
        errorMsg += `Error: ${JSON.stringify(error.response.data, null, 2)}\n\n`
        
        if (error.response.status === 401) {
          errorMsg += 'Note: 401 means wrong credentials (expected for test)'
        }
      }
      
      setResult(errorMsg)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <h1 className="text-2xl font-bold mb-4">🔧 API Connection Test</h1>
          
          <div className="space-y-3 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-900">Current API URL:</p>
              <p className="text-xs text-blue-700 font-mono break-all">
                {import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm font-medium text-green-900">Environment:</p>
              <p className="text-xs text-green-700">
                {import.meta.env.MODE}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={testConnection}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Testing...' : 'Test API Connection'}
            </button>

            <button
              onClick={testLogin}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Testing...' : 'Test Login Endpoint'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-gray-900 text-green-400 rounded-2xl shadow-lg p-6 font-mono text-sm">
            <pre className="whitespace-pre-wrap break-words">{result}</pre>
          </div>
        )}

        <div className="mt-4 text-center">
          <a href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}

export default TestAPI
