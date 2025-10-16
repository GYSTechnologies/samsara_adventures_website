// import React from "react";
// import TestimonialCarousel from "../../components/user/TestimonialCarousel";
// import EventsSections from "../../components/user/EventsSections";

// const Events = () => {
//   return (
//     <>
//       <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
//         {/* Beach Scene Background */}
//         <div className="absolute inset-0">
//           {/* Sky with sunset gradient */}
//           <div className="absolute inset-0 bg-gradient-to-b from-pink-300 via-purple-400 to-orange-300"></div>

//           {/* Ocean/Water */}
//           <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-blue-800 via-blue-600 to-blue-400 opacity-80"></div>

//           {/* Beach/Sand area */}
//           <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-yellow-600 via-yellow-500 to-transparent opacity-60"></div>

//           {/* Palm Trees */}
//           <div className="absolute bottom-20 left-8 lg:left-16">
//             {/* Palm tree trunk */}
//             <div className="w-3 lg:w-4 h-32 lg:h-40 bg-gradient-to-t from-amber-800 to-amber-700 rounded-full transform rotate-12 origin-bottom"></div>
//             {/* Palm leaves */}
//             <div className="absolute -top-4 -left-8">
//               <div className="w-16 lg:w-20 h-6 lg:h-8 bg-green-600 rounded-full transform -rotate-45 origin-right"></div>
//               <div className="w-14 lg:w-16 h-5 lg:h-6 bg-green-700 rounded-full transform -rotate-12 origin-right absolute top-2"></div>
//               <div className="w-12 lg:w-14 h-4 lg:h-5 bg-green-600 rounded-full transform rotate-45 origin-left absolute top-1 left-4"></div>
//               <div className="w-10 lg:w-12 h-3 lg:h-4 bg-green-700 rounded-full transform rotate-12 origin-left absolute top-3 left-6"></div>
//             </div>
//           </div>

//           <div className="absolute bottom-16 right-12 lg:right-20">
//             {/* Second palm tree */}
//             <div className="w-2 lg:w-3 h-28 lg:h-36 bg-gradient-to-t from-amber-800 to-amber-700 rounded-full transform -rotate-6 origin-bottom"></div>
//             <div className="absolute -top-3 -right-6">
//               <div className="w-12 lg:w-16 h-4 lg:h-6 bg-green-600 rounded-full transform -rotate-30 origin-right"></div>
//               <div className="w-10 lg:w-12 h-3 lg:h-4 bg-green-700 rounded-full transform rotate-30 origin-left absolute top-1 left-3"></div>
//               <div className="w-8 lg:w-10 h-2 lg:h-3 bg-green-600 rounded-full transform -rotate-60 origin-right absolute -top-1 right-1"></div>
//             </div>
//           </div>

//           {/* People silhouettes on beach */}
//           <div className="absolute bottom-8 left-1/4 lg:left-1/3">
//             {/* Group of people sitting */}
//             <div className="flex items-end space-x-1">
//               <div className="w-2 h-4 lg:w-3 lg:h-6 bg-black opacity-40 rounded-full"></div>
//               <div className="w-2 h-5 lg:w-3 lg:h-7 bg-black opacity-40 rounded-full"></div>
//               <div className="w-2 h-4 lg:w-3 lg:h-6 bg-black opacity-40 rounded-full"></div>
//             </div>
//           </div>

//           <div className="absolute bottom-12 right-1/3 lg:right-1/4">
//             {/* More people */}
//             <div className="flex items-end space-x-1">
//               <div className="w-1 h-3 lg:w-2 lg:h-5 bg-black opacity-30 rounded-full"></div>
//               <div className="w-1 h-4 lg:w-2 lg:h-6 bg-black opacity-30 rounded-full"></div>
//               <div className="w-1 h-3 lg:w-2 lg:h-5 bg-black opacity-30 rounded-full"></div>
//               <div className="w-1 h-2 lg:w-2 lg:h-4 bg-black opacity-30 rounded-full"></div>
//             </div>
//           </div>

//           {/* Beach umbrellas/structures */}
//           <div className="absolute bottom-16 left-20 lg:left-32">
//             <div className="w-8 lg:w-12 h-3 lg:h-4 bg-white opacity-60 rounded-full"></div>
//             <div className="w-1 h-8 lg:h-12 bg-gray-600 opacity-40 mx-auto"></div>
//           </div>

//           <div className="absolute bottom-20 right-1/2">
//             <div className="w-6 lg:w-10 h-2 lg:h-3 bg-white opacity-50 rounded-full"></div>
//             <div className="w-0.5 h-6 lg:h-10 bg-gray-600 opacity-40 mx-auto"></div>
//           </div>

//           {/* Water reflections */}
//           <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white/10 via-transparent to-transparent opacity-50"></div>

//           {/* Rocks/stones in water */}
//           <div className="absolute bottom-6 left-16 lg:left-24 w-4 lg:w-6 h-2 lg:h-3 bg-gray-600 rounded-full opacity-60"></div>
//           <div className="absolute bottom-4 right-20 lg:right-28 w-3 lg:w-5 h-1 lg:h-2 bg-gray-700 rounded-full opacity-50"></div>
//           <div className="absolute bottom-8 left-1/2 w-2 lg:w-4 h-1 lg:h-2 bg-gray-600 rounded-full opacity-40"></div>

//           {/* Dark overlay for better text readability */}
//           <div className="absolute inset-0 bg-black/30"></div>
//         </div>

//         {/* Main Content */}
//         <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
//           {/* Events Badge */}
//           <div className="inline-flex items-center px-3 py-1.5 lg:px-4 lg:py-2 bg-black/20 backdrop-blur-sm rounded-full border border-white/30 mb-6 lg:mb-8">
//             <span className="text-white text-xs lg:text-sm font-medium tracking-wider uppercase">
//               Events
//             </span>
//           </div>

//           {/* Main Heading */}
//           <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 lg:mb-6 leading-tight">
//             <span className="block mb-1 lg:mb-2">Discover Experiences</span>
//             <span className="block">You'll Never Forget</span>
//           </h1>

//           {/* Subtitle */}
//           <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-white/90 mb-8 lg:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
//             Join exclusive events, workshops, and adventures hosted by our
//             travel community.
//           </p>

//           {/* CTA Button */}
//           <button className="inline-flex items-center px-6 py-3 lg:px-8 lg:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg lg:rounded-xl text-sm lg:text-lg shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 space-x-2">
//             <span>View Upcoming Events</span>
//             <svg
//               className="w-4 h-4 lg:w-5 lg:h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M17 8l4 4m0 0l-4 4m4-4H3"
//               />
//             </svg>
//           </button>
//         </div>

//         {/* Floating animation elements */}
//         <div className="absolute top-20 left-10 w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"></div>
//         <div className="absolute top-32 right-16 w-1 h-1 bg-white rounded-full opacity-40 animate-pulse delay-1000"></div>
//         <div className="absolute top-40 left-1/3 w-0.5 h-0.5 bg-white rounded-full opacity-50 animate-pulse delay-500"></div>
//       </div>
//       <EventsSections />
//       <TestimonialCarousel />
//     </>
//   );
// };

// export default Events;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TestimonialCarousel from "../../components/user/TestimonialCarousel";
import EventsSections from "../../components/user/EventsSections";

const Events = () => {
  const navigate = useNavigate();
  
  const handleViewEvents = () => {
    // Scroll to events section
    const eventsSection = document.getElementById('events-section');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
     
      <div id="events-section" className="bg-[#eff5d2]  h-full pt-20 ">
        <EventsSections />
      </div>
    </>
  );
};

export default Events;
