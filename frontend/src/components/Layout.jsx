import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const Layout = () => {
  return (
    <div className="min-h-screen bg-wellness-cream">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
