import { useState } from 'react'
import bannerImage from '../assets/img1.webp'

const HomeBanner = () => {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="relative w-full overflow-hidden">
      {/* Banner Container */}
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px]">
        
        {/* Placeholder/Loading State */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-wellness-peach via-wellness-lavender to-wellness-mint animate-pulse" />
        )}

        {/* Banner Image */}
        <img
          src={bannerImage}
          alt="Lunara Wellness Banner"
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-4 drop-shadow-lg animate-fade-in">
              Welcome to Lunara
            </h1>
            
            {/* Subheading */}
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light drop-shadow-md animate-fade-in-delay">
              Your Wellness Journey Starts Here
            </p>

            {/* Optional CTA Button */}
            <div className="mt-8 animate-fade-in-delay-2">
              <button className="btn-primary text-lg px-8 py-3 shadow-wellness hover:scale-105 transform transition-all duration-200">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeBanner
