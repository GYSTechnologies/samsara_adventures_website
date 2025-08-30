
import React from 'react';
import WhyWeAreBest from '../../components/user/WhyWeAreBest';
import TeamStatsSection from '../../components/user/TeamStatsSection';

export default function TravelAboutSection() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <div 
        className="relative h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1274&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
        }}
      >
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            About Us
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl font-light leading-relaxed max-w-3xl mx-auto">
            We create journeys that turn destinations into lifelong memories. Every trip we 
            design is a blend of adventure, comfort, and unforgettable moments
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column - Main Content */}
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Our tours are designed to match every traveler's style — from adventurous 
                backpacking and scenic road trips to relaxed beach getaways.
              </h2>
            </div>

            {/* Right Column - Description */}
            <div className="space-y-6">
              {/* About us label */}
              <div className="inline-block">
                <span className="text-blue-500 font-medium text-sm uppercase tracking-wider border-b-2 border-blue-500 pb-1">
                  About us
                </span>
              </div>

              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Whether you're a nature lover, hiking enthusiast, or 
                  passionate birdwatcher, we have the perfect 
                  experience waiting for you.
                </p>
                
                <p>
                  Discover the wonders of the wild on our wildlife tours, 
                  where you can observe majestic animals in their 
                  natural habitat, or join our birdwatching journeys to 
                  spot rare and exotic species.
                </p>

                <p>
                  From soaring mountain peaks to serene coastlines, our 
                  destinations are as diverse as the adventures we 
                  create — ensuring every trip is unique, unforgettable, 
                  and tailored to your interests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group hover:transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Adventure Tours</h3>
              <p className="text-gray-600">Thrilling expeditions for the bold explorers</p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Wildlife Watching</h3>
              <p className="text-gray-600">Connect with nature's magnificent creatures</p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Relaxing Getaways</h3>
              <p className="text-gray-600">Peaceful escapes to recharge your soul</p>
            </div>
          </div>
        </div>
      </div>
      <WhyWeAreBest/>
      <TeamStatsSection/>
    </div>
  );
}