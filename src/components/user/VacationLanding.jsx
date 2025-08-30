// import React from 'react';
// import { MapPin, Brain, Home, Camera } from 'lucide-react';

// export default function VacationLanding() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Top Section */}
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid md:grid-cols-2 gap-8 items-center">
//           {/* Left Content */}
//           <div className="space-y-6">
//             {/* Badge */}
//             <div className="inline-block">
//               <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
//                 Easy on Holidays
//               </span>
//             </div>
            
//             {/* Main Heading */}
//             <div>
//               <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
//                 Anytime is Goodtime
//               </h1>
//               <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight underline decoration-blue-500">
//                 Vacation Everywhere
//               </h2>
//             </div>
            
//             {/* Feature List */}
//             <div className="space-y-4">
//               <div className="flex items-start space-x-4">
//                 <div className="bg-blue-500 p-2 rounded-lg flex-shrink-0">
//                   <Brain className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-1">Enjoy Local Specialities</h3>
//                   <p className="text-gray-600 text-sm">
//                     Savor the authentic flavors of local cuisines, crafted with traditional recipes passed down through generations.
//                   </p>
//                 </div>
//               </div>
              
//               <div className="flex items-start space-x-4">
//                 <div className="bg-blue-500 p-2 rounded-lg flex-shrink-0">
//                   <MapPin className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-1">Good location destination</h3>
//                   <p className="text-gray-600 text-sm">
//                     Savor the authentic flavors of local cuisines, crafted with traditional recipes passed down through generations.
//                   </p>
//                 </div>
//               </div>
              
//               <div className="flex items-start space-x-4">
//                 <div className="bg-blue-500 p-2 rounded-lg flex-shrink-0">
//                   <Camera className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-1">Can enjoy all vacation</h3>
//                   <p className="text-gray-600 text-sm">
//                     Savor the authentic flavors of local cuisines, crafted with traditional recipes passed down through generations.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Right Image */}
//           <div className="relative">
//             <div className="bg-gradient-to-br from-blue-200 to-gray-300 rounded-3xl p-8 h-96 flex items-center justify-center">
//               <div className="bg-white rounded-2xl p-6 shadow-lg">
//                 <div className="w-48 h-48 bg-gradient-to-br from-orange-200 to-pink-200 rounded-xl flex items-center justify-center">
//                   <div className="text-center">
//                     <div className="w-16 h-16 bg-orange-300 rounded-full mx-auto mb-2"></div>
//                     <div className="w-20 h-16 bg-pink-300 rounded-full mx-auto"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Bottom Section */}
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid md:grid-cols-2 gap-8 items-center">
//           {/* Left Image */}
//           <div className="relative">
//             <div className="bg-gradient-to-br from-green-200 to-yellow-200 rounded-3xl p-8 h-96 flex items-center justify-center">
//               <div className="bg-white rounded-2xl p-6 shadow-lg">
//                 <div className="w-48 h-48 bg-gradient-to-br from-green-300 to-brown-300 rounded-xl flex items-center justify-center relative overflow-hidden">
//                   <div className="absolute inset-0 bg-gradient-to-b from-green-400 via-green-500 to-brown-400"></div>
//                   <div className="relative z-10">
//                     <div className="w-8 h-8 bg-orange-400 rounded-full mb-4 ml-8"></div>
//                     <div className="w-6 h-6 bg-red-400 rounded-full ml-16"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Right Content */}
//           <div className="space-y-6">
//             {/* Badge */}
//             <div className="inline-block">
//               <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
//                 Easy on Relaxation
//               </span>
//             </div>
            
//             {/* Heading */}
//             <div>
//               <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight text-center md:text-left">
//                 Discover Destination for Every New Journey
//               </h2>
//             </div>
            
//             {/* Feature List */}
//             <div className="space-y-4">
//               <div className="flex items-start space-x-4">
//                 <div className="bg-blue-500 p-2 rounded-lg flex-shrink-0">
//                   <Camera className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-1">Many Selfie Spot</h3>
//                   <p className="text-gray-600 text-sm">
//                     Savor the authentic flavors of local cuisines, crafted with traditional recipes passed down through generations.
//                   </p>
//                 </div>
//               </div>
              
//               <div className="flex items-start space-x-4">
//                 <div className="bg-blue-500 p-2 rounded-lg flex-shrink-0">
//                   <Brain className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-1">Enjoy Local Specialities</h3>
//                   <p className="text-gray-600 text-sm">
//                     Savor the authentic flavors of local cuisines, crafted with traditional recipes passed down through generations.
//                   </p>
//                 </div>
//               </div>
              
//               <div className="flex items-start space-x-4">
//                 <div className="bg-blue-500 p-2 rounded-lg flex-shrink-0">
//                   <Home className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-1">Comfortable residence</h3>
//                   <p className="text-gray-600 text-sm">
//                     Savor the authentic flavors of local cuisines, crafted with traditional recipes passed down through generations.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import React from 'react';
import { MapPin, Brain, Home, Camera } from 'lucide-react';

export default function VacationLanding() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-block">
              <span className="bg-blue-400 text-white px-4 py-2  text-sm font-medium">
                Easy on Holidays
              </span>
            </div>
            
            {/* Main Heading */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Anytime is Goodtime
              </h1>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight underline decoration-blue-500">
                Vacation Everywhere
              </h2>
            </div>
            
            {/* Feature List */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 p-2 rounded-lg flex-shrink-0">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Enjoy Local Specialities</h3>
                  <p className="text-gray-600 text-sm">
                    Savor the authentic flavors of local cuisines, crafted with traditional recipes passed down through generations.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 p-2 rounded-lg flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Good location destination</h3>
                  <p className="text-gray-600 text-sm">
                    Discover breathtaking locations with stunning views and perfect accessibility for memorable experiences.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 p-2 rounded-lg flex-shrink-0">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Can enjoy all vacation</h3>
                  <p className="text-gray-600 text-sm">
                    Experience the full spectrum of vacation activities, from adventure sports to peaceful relaxation.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative">
            <div className="group rounded-3xl h-96 overflow-hidden shadow-xl relative">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Mountain vacation destination"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-gray-800">
                  Mountain Paradise
                </span>
              </div>
  
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Image */}
          <div className="relative order-2 md:order-1">
            <div className="group rounded-3xl h-96 overflow-hidden shadow-xl relative">
              <img 
                src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Beach vacation destination"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-gray-800">
                  Beach Paradise
                </span>
              </div>
              
            </div>
          </div>
          
          {/* Right Content */}
          <div className="space-y-6 order-1 md:order-2">
            {/* Badge */}
            <div className="inline-block">
              <span className="bg-green-500 text-white px-4 py-2 text-sm font-medium">
                Easy on Relaxation
              </span>
            </div>
            
            {/* Heading */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight text-center md:text-left">
                Discover Destination for Every New Journey
              </h2>
            </div>
            
            {/* Feature List */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-green-500 p-2 rounded-lg flex-shrink-0">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Many Selfie Spot</h3>
                  <p className="text-gray-600 text-sm">
                    Capture stunning moments at Instagram-worthy locations with perfect lighting and breathtaking backdrops.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-green-500 p-2 rounded-lg flex-shrink-0">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Enjoy Local Specialities</h3>
                  <p className="text-gray-600 text-sm">
                    Immerse yourself in authentic cultural experiences and taste traditional delicacies unique to each region.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-green-500 p-2 rounded-lg flex-shrink-0">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Comfortable residence</h3>
                  <p className="text-gray-600 text-sm">
                    Stay in premium accommodations with modern amenities and exceptional service for ultimate comfort.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional Image Cards Section */}
      {/* <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Popular Destinations</h3>
          <p className="text-gray-600">Explore our most loved vacation spots</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">

          <div className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Kerala Backwaters"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h4 className="text-white font-bold text-lg">Kerala Backwaters</h4>
                <p className="text-white/80 text-sm">Serene waterways & lush landscapes</p>
              </div>
            </div>
          </div>
          
       
          <div className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Rajasthan Desert"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h4 className="text-white font-bold text-lg">Rajasthan Desert</h4>
                <p className="text-white/80 text-sm">Golden dunes & royal heritage</p>
              </div>
            </div>
          </div>
          
         
          <div className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1605640840605-14ac1855827b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Kashmir Valley"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h4 className="text-white font-bold text-lg">Kashmir Valley</h4>
                <p className="text-white/80 text-sm">Paradise on earth experience</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}