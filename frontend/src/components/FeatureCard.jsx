import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const FeatureCard = ({ icon, title, description, path, bgColor }) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleClick = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: path } })
    } else {
      // Navigate to feature page
      navigate(path)
    }
  }

  return (
    <div 
      onClick={handleClick}
      className="card text-center cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-wellness"
    >
      <div className={`w-16 h-16 ${bgColor} rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-neutral-600">{description}</p>
    </div>
  )
}

export default FeatureCard
