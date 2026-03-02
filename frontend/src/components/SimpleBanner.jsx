import { useState } from 'react'
import bannerImage from '../assets/img1.webp'

const SimpleBanner = () => {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="relative w-full overflow-hidden">
      {/* Banner Container with Aspect Ratio */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9] lg:aspect-[32/9]">
        
        {/* Loading Placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-wellness-peach via-wellness-lavender to-wellness-mint animate-pulse" />
        )}

        {/* Banner Image */}
        <img
          src={bannerImage}
          alt="Welcome Banner"
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="eager"
        />

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

        {/* Text Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white text-center px-4 drop-shadow-2xl">
            Welcome to Our Site
          </h1>
        </div>
      </div>
    </div>
  )
}

export default SimpleBanner
