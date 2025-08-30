import React, { useState } from "react";
import { Play, Eye, ArrowRight, MapPin, Calendar } from "lucide-react";

const PhotoGallery = () => {
  const [hoveredPhoto, setHoveredPhoto] = useState(null);

  const photos = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
      alt: "Beach Paradise",
      location: "Goa, India",

      className: "row-span-2",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
      alt: "Mountain Adventure",
      location: "Manali, HP",
      className: "",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
      alt: "Coastal Beauty",
      location: "Kerala Backwaters",

      className: "",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=800&fit=crop",
      alt: "Sky Journey",
      location: "Delhi to Leh",
     
      className: "row-span-2",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=400&fit=crop",
      alt: "Village Life",
      location: "Spiti Valley",

      className: "",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop",
      alt: "Island Paradise",
      location: "Andaman Islands",

      className: "",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop",
      alt: "Family Adventures",
      location: "Dharamshala",

      className: "col-span-2",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 md:py-20">
        {/* Enhanced Header Section */}
        <div className="text-center mb-8 md:mb-20">
          <div className="inline-block mb-6 md:mb-8">
            <span className="bg-blue-400  text-white px-6 py-3  text-sm font-bold tracking-wider uppercase shadow-lg">
              Photo Gallery
            </span>
          </div>
          <h2 className="text-3xl md:text-6xl lg:text-7xl font-black text-gray-800 mb-4 md:mb-8 leading-tight">
            Discover Our
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Epic Adventures
            </span>
          </h2>
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed font-medium">
            Breathtaking moments captured from our incredible journeys across
            India's most stunning destinations
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Mobile Grid - Enhanced Single Column */}
          <div className="grid grid-cols-1 gap-6 md:hidden">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer h-80"
                onMouseEnter={() => setHoveredPhoto(photo.id)}
                onMouseLeave={() => setHoveredPhoto(null)}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-500"></div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-xl font-bold mb-2">{photo.alt}</h3>
                  <div className="flex items-center space-x-4 text-sm opacity-90">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{photo.location}</span>
                    </div>
                    {/* <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{photo.date}</span>
                    </div> */}
                  </div>
                </div>
              </div>
            ))}

            {/* Mobile CTA Section */}
            <div className="mt-8 text-center">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                <h3 className="text-2xl font-black text-gray-800 mb-4">
                  Ready for Your
                  <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Next Adventure?
                  </span>
                </h3>
                <p className="text-gray-600 mb-6 text-base leading-relaxed font-medium">
                  Join thousands of travelers who have experienced the magic of
                  India's most breathtaking destinations with Samsara Adventures
                </p>
                <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-4 px-8 rounded-2xl font-bold text-base transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto">
                  <span>View All Photos</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tablet Grid - Enhanced 2 Columns */}
          <div className="hidden md:grid lg:hidden grid-cols-2 gap-8">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer h-80 md:h-96"
                onMouseEnter={() => setHoveredPhoto(photo.id)}
                onMouseLeave={() => setHoveredPhoto(null)}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-500"></div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-xl font-bold mb-2">{photo.alt}</h3>
                  <div className="flex items-center space-x-4 text-sm opacity-90">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{photo.location}</span>
                    </div>
                    {/* <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{photo.date}</span>
                    </div> */}
                  </div>
                </div>
              </div>
            ))}

            {/* Tablet CTA Section */}
            <div className="col-span-2 mt-8 text-center">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20">
                <h3 className="text-3xl font-black text-gray-800 mb-6">
                  Ready for Your
                  <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Next Adventure?
                  </span>
                </h3>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed font-medium max-w-2xl mx-auto">
                  Join thousands of travelers who have experienced the magic of
                  India's most breathtaking destinations with Samsara Adventures
                </p>
                <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-4 px-10 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto">
                  <span>View All Photos</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Grid - Advanced Masonry Layout */}
          <div className="hidden lg:grid grid-cols-4 gap-8 lg:gap-10">
            {/* Large Photo 1 */}
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer row-span-2 h-[500px] xl:h-[600px]"
              onMouseEnter={() => setHoveredPhoto(photos[0].id)}
              onMouseLeave={() => setHoveredPhoto(null)}
            >
              <img
                src={photos[0].src}
                alt={photos[0].alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-all duration-500"></div>

              {/* Enhanced Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl xl:text-3xl font-bold mb-3">
                  {photos[0].alt}
                </h3>
                <div className="flex items-center space-x-6 text-base opacity-90">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>{photos[0].location}</span>
                  </div>
                  {/* <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>{photos[0].date}</span>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Medium Photos */}
            {[photos[1], photos[2]].map((photo, index) => (
              <div
                key={photo.id}
                className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer h-72 xl:h-80"
                onMouseEnter={() => setHoveredPhoto(photo.id)}
                onMouseLeave={() => setHoveredPhoto(null)}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-500"></div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-lg xl:text-xl font-bold mb-2">
                    {photo.alt}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm opacity-90">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{photo.location}</span>
                    </div>
                    {/* <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{photo.date}</span>
                    </div> */}
                  </div>
                </div>
              </div>
            ))}

            {/* Large Photo 2 */}
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer row-span-2 h-[500px] xl:h-[600px]"
              onMouseEnter={() => setHoveredPhoto(photos[3].id)}
              onMouseLeave={() => setHoveredPhoto(null)}
            >
              <img
                src={photos[3].src}
                alt={photos[3].alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-all duration-500"></div>

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl xl:text-3xl font-bold mb-3">
                  {photos[3].alt}
                </h3>
                <div className="flex items-center space-x-6 text-base opacity-90">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>{photos[3].location}</span>
                  </div>
                  {/* <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>{photos[3].date}</span>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Row 2 Medium Photos */}
            {[photos[4], photos[5]].map((photo) => (
              <div
                key={photo.id}
                className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer h-72 xl:h-80"
                onMouseEnter={() => setHoveredPhoto(photo.id)}
                onMouseLeave={() => setHoveredPhoto(null)}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-500"></div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-lg xl:text-xl font-bold mb-2">
                    {photo.alt}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm opacity-90">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{photo.location}</span>
                    </div>
                    {/* <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{photo.date}</span>
                    </div> */}
                  </div>
                </div>
              </div>
            ))}

            {/* Last Row: Wide Photo + CTA Section Side by Side */}
            {/* Wide Photo - Family Adventures */}
            <div
              className="col-span-2 relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer h-72 xl:h-80"
              onMouseEnter={() => setHoveredPhoto(photos[6].id)}
              onMouseLeave={() => setHoveredPhoto(null)}
            >
              <img
                src={photos[6].src}
                alt={photos[6].alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-500"></div>

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl xl:text-3xl font-bold mb-3">
                  {photos[6].alt}
                </h3>
                <div className="flex items-center space-x-6 text-base opacity-90">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>{photos[6].location}</span>
                  </div>
                  {/* <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>{photos[6].date}</span>
                  </div> */}
                </div>
              </div>
            </div>

            {/* CTA Section - Side by Side with Wide Photo */}
            <div className="col-span-2 flex items-center">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 xl:p-12 shadow-2xl w-full border border-white/20 h-72 xl:h-80 flex flex-col justify-center ">
                <h3 className="text-2xl xl:text-3xl font-black text-gray-800 mb-4 xl:mb-6">
                  Ready for Your
                  <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Next Adventure?
                  </span>
                </h3>
                <p className="text-gray-600 mb-6 xl:mb-8 text-sm xl:text-base leading-relaxed font-medium">
                  Join thousands of travelers who have experienced the magic of
                  India's most breathtaking destinations with Samsara Adventures
                </p>
         
                {/* <div className="flex justify-center">
                  <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-3 xl:py-4 px-6 xl:px-8 rounded-2xl font-bold text-sm xl:text-base transition-all duration-300 transform hover:scale-105 flex space-x-2 w-fit items-center">
                    <span>View All Photos</span>
                    <ArrowRight className="w-4 h-4 xl:w-5 xl:h-5" />
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoGallery;
