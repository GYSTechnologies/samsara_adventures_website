

import React from 'react';
import { Instagram, Phone, Facebook } from 'lucide-react';

const Footer = () => {
  return (
   <div className="min-h-screen px-4 sm:px-6 lg:px-8">

      {/* Hero Section */}
      <div 
className="relative h-[60vh] md:h-[65vh] bg-cover bg-center bg-no-repeat rounded-t-3xl"

        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`
        }}
      >
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="text-center max-w-4xl">
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8">
              Join Our Exclusive Trips and<br />
              Explore the World's Most Stunning<br />
              <span style={{ fontFamily: 'serif' }}>Destination Together</span>
            </h1>
            
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-8 rounded-full text-base transition-all duration-300">
              Join Now
            </button>
          </div>
        </div>
      </div>

      {/* Dark Section */}
      <div className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Contact Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Contact Us <span className="text-gray-400">Anytime -</span><br />
                <span className="text-gray-400">We're Ready to Assist</span>
              </h2>
            </div>
            
            <div className="flex flex-col justify-center space-y-4 lg:items-end lg:text-right">
              <div className="text-gray-300 text-lg">
                samsaraadventures@gmail.com
              </div>
              <div className="text-gray-300 text-lg">
                8767654544
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="border-t border-gray-700 pt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Navigation */}
              <nav className="flex flex-wrap gap-6 sm:gap-8">
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Home
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  About
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Our Packages
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Plan your own trip
                </a>
              </nav>

              {/* Right Navigation */}
              <nav className="flex flex-wrap gap-6 sm:gap-8 lg:justify-end">
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Gallery
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Contact
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Pricing
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Amount
                </a>
              </nav>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-400">
                <span>© Samsara Adventures Powered by Gys Technologies</span>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </div>

              {/* Social Icons */}
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <Instagram className="w-5 h-5 text-gray-800" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <Phone className="w-5 h-5 text-gray-800" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <Facebook className="w-5 h-5 text-gray-800" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;