import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CycleProvider } from './context/CycleContext'
import { MoodProvider } from './context/MoodContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CycleTracking from './pages/CycleTracking'
import MoodTracking from './pages/MoodTracking'
import Insights from './pages/Insights'
import Analytics from './pages/Analytics'
import UpdatePassword from './pages/UpdatePassword'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import NotFound from './pages/NotFound'

function App() {
  return (
    <AuthProvider>
      <CycleProvider>
        <MoodProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password/:token" element={<ResetPassword />} />
                
                {/* Protected Routes */}
                <Route path="dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="cycle" element={
                  <ProtectedRoute>
                    <CycleTracking />
                  </ProtectedRoute>
                } />
                
                <Route path="mood" element={
                  <ProtectedRoute>
                    <MoodTracking />
                  </ProtectedRoute>
                } />
                
                <Route path="insights" element={
                  <ProtectedRoute>
                    <Insights />
                  </ProtectedRoute>
                } />
                
                <Route path="analytics" element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                } />
                
                <Route path="update-password" element={
                  <ProtectedRoute>
                    <UpdatePassword />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </MoodProvider>
      </CycleProvider>
    </AuthProvider>
  )
}

export default App
