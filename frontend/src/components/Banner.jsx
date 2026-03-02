import { useState } from 'react'
import bannerImage from '../assets/img1.webp'

const Banner = () => {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="relative w-full overflow-hidden">
      {/* Banner Container - Full width, maintains aspect ratio */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh]">
        
        {/* Loading Placeholder - Shows while image loads */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        {/* Banner Image - WebP from assets folder */}
        <img
          src={bannerImage}
          alt="Welcome Banner"
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Subtle Gradient Overlay - For text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40" />

        {/* Heading on top of banner */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white text-center drop-shadow-lg">
            Welcome to Our Site
          </h1>
        </div>
      </div>
    </div>
  )
}

export default Banner
