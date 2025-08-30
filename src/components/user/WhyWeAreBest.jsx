import React from 'react';

export default function WhyWeAreBest() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="inline-block mb-4">
                <span className="text-blue-500 font-medium text-sm uppercase tracking-wider">
                  TRAVELLERS
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Why We Are Best?
              </h2>
              <p className="text-gray-600 text-base leading-relaxed max-w-md">
                We don't just plan trips — we craft experiences. With 
                handpicked destinations, exclusive events, and 
                personalized itineraries, we ensure every journey is 
                unique, seamless, and unforgettable. Your adventure, our 
                expertise.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-6">
              {/* Diverse Destinations */}
              <div className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Diverse Destinations
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    From serene beaches to bustling cities, our curated 
                    selection of destinations spans every corner of the 
                    globe. Whether you crave adventure, culture, or 
                    relaxation, we have the perfect place for you.
                  </p>
                </div>
              </div>

              {/* Adventure Time */}
              <div className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Adventure Time
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    From serene beaches to bustling cities, our curated 
                    selection of destinations spans every corner of the 
                    globe. Whether you crave adventure, culture, or 
                    relaxation, we have the perfect place for you.
                  </p>
                </div>
              </div>

              {/* Guide Tour */}
              <div className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Guide Tour
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    From serene beaches to bustling cities, our curated 
                    selection of destinations spans every corner of the 
                    globe. Whether you crave adventure, culture, or 
                    relaxation, we have the perfect place for you.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="lg:order-last">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Adventure traveler"
                  className="w-full h-[500px] lg:h-[600px] object-cover"
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500 rounded-full opacity-10"></div>
              <div className="absolute -bottom-15 -right-15 w-32 h-32 bg-orange-400 rounded-full opacity-10"></div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {/* <div className="mt-20 lg:mt-32">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-gray-600 text-sm font-medium">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">2K+</div>
              <div className="text-gray-600 text-sm font-medium">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-orange-600 mb-2">500+</div>
              <div className="text-gray-600 text-sm font-medium">Adventures</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">15+</div>
              <div className="text-gray-600 text-sm font-medium">Years Experience</div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}