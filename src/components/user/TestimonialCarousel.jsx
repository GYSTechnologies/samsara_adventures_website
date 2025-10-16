// import React, { useState, useEffect } from "react";
// import { Quote, Star } from "lucide-react";

// const TestimonialCarousel = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const testimonials = [
//     {
//       id: 1,
//       text: "Our trip to Manali with Samsara Adventures was beyond amazing! From the scenic Solang Valley to the cozy stays, everything was perfectly planned. The team made our holiday completely stress-free.",
//       name: "Rohini Sharma",
//       title: "Himachal Explorer",
//       image:
//         "https://images.unsplash.com/photo-1605369572399-05d8d64a0f6e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       rating: 5,
//     },
//     {
//       id: 2,
//       text: "Before the trip, I just wanted a peaceful getaway. During the journey, I found myself trekking in Solang Valley and watching the sunrise in Manali. I returned not just relaxed but inspired. Thank you, Samsara Adventures!",
//       name: "Rohan Sharma",
//       title: "Himachal Explorer",
//       image:
//         "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
//       rating: 5,
//     },
//     {
//       id: 3,
//       text: "Before booking with Samsara Adventures, I was nervous about planning my first solo trip. During the trip, I discovered hidden cafes in Manali, met amazing people, and felt completely safe.",
//       name: "Siddharath Sharma",
//       title: "Himachal Explorer",
//       image:
//         "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
//       rating: 5,
//     },
//   ];

//   // Auto-play functionality
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) =>
//         prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
//       );
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [currentIndex, testimonials.length]);

//   const goToSlide = (index) => {
//     setCurrentIndex(index);
//   };

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       <div className="container mx-auto px-4 py-8 md:py-20">
//         {/* Header Section */}
//         <div className="text-center mb-8 md:mb-20">
//           <div className="inline-block mb-6 md:mb-8">
//             <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium tracking-wide uppercase">
//               Testimonials
//             </span>
//           </div>
//           <h2 className="text-2xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-2 md:mb-8 leading-tight">
//             What Our Travelers
//             <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//               Say About Us
//             </span>
//           </h2>
//           <p className="text-sm md:text-xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
//             Real stories from adventurers who explored the breathtaking
//             landscapes of Himachal Pradesh with us
//           </p>
//         </div>

//         {/* Mobile Layout */}
//         <div className="block md:hidden">
//           <div className="max-w-sm mx-auto">
//             <div className="relative bg-white rounded-3xl shadow-2xl p-6 overflow-hidden">
//               <Quote className="absolute top-6 left-6 text-blue-200 w-8 h-8" />

//               <div className="relative min-h-[150px] flex items-center">
//                 <div
//                   className="flex transition-transform duration-700 ease-in-out w-full"
//                   style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//                 >
//                   {testimonials.map((testimonial) => (
//                     <div
//                       key={testimonial.id}
//                       className="w-full flex-shrink-0 px-2"
//                     >
//                       <div className="text-center">
//                         <p className="text-base text-gray-700 leading-relaxed mb-6 italic px-4 font-light">
//                           "{testimonial.text}"
//                         </p>

//                         <div className="flex flex-col items-center space-y-3">
//                           <img
//                             src={testimonial.image}
//                             alt={testimonial.name}
//                             className="w-12 h-12 rounded-full object-cover border-4 border-blue-200 shadow-lg"
//                           />
//                           <div className="text-center">
//                             <h4 className="font-semibold text-gray-800 text-base mb-1">
//                               {testimonial.name}
//                             </h4>
//                             <p className="text-blue-600 text-xs font-medium">
//                               {testimonial.title}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="flex justify-center space-x-2 mt-6">
//                 {testimonials.map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => goToSlide(index)}
//                     className={`w-2 h-2 rounded-full transition-all duration-300 ${
//                       index === currentIndex
//                         ? "bg-blue-600 scale-125 shadow-lg"
//                         : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
//                     }`}
//                   />
//                 ))}
//               </div>

//               <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
//                 <div
//                   className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700 ease-out"
//                   style={{
//                     width: `${
//                       ((currentIndex + 1) / testimonials.length) * 100
//                     }%`,
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Desktop Layout - Completely Redesigned */}
//         <div className="hidden md:block">
//           <div className="max-w-7xl mx-auto">
//             {/* Main Testimonial Card */}
//             <div className="relative">
//               <div className="grid grid-cols-12 gap-8 items-center min-h-[500px]">
//                 {/* Left side - Testimonial Content */}
//                 <div className="col-span-7">
//                   <div className="bg-white rounded-2xl shadow-xl p-12 relative overflow-hidden">
//                     {/* Background decoration */}
//                     <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full"></div>
//                     <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-100 to-transparent rounded-tr-full"></div>

//                     <Quote className="text-blue-500 w-12 h-12 mb-8 opacity-80" />

//                     <div className="relative z-10">
//                       <p className="text-2xl text-gray-700 leading-relaxed mb-8 font-light italic">
//                         "{testimonials[currentIndex].text}"
//                       </p>

//                       {/* Rating Stars */}
//                       <div className="flex space-x-1 mb-6">
//                         {[...Array(testimonials[currentIndex].rating)].map(
//                           (_, i) => (
//                             <Star
//                               key={i}
//                               className="w-5 h-5 text-yellow-400 fill-current"
//                             />
//                           )
//                         )}
//                       </div>

//                       <div className="flex items-center space-x-4">
//                         <img
//                           src={testimonials[currentIndex].image}
//                           alt={testimonials[currentIndex].name}
//                           className="w-16 h-16 rounded-full object-cover border-3 border-blue-200 shadow-lg"
//                         />
//                         <div>
//                           <h4 className="font-bold text-gray-800 text-xl mb-1">
//                             {testimonials[currentIndex].name}
//                           </h4>
//                           <p className="text-blue-600 font-medium">
//                             {testimonials[currentIndex].title}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right side - Navigation & Preview */}
//                 <div className="col-span-5">
//                   <div className="space-y-6">
//                     {/* Navigation Arrows */}
//                     <div className="flex justify-center space-x-4 mb-8">
//                       <button
//                         onClick={prevSlide}
//                         className="w-14 h-14 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300 hover:scale-110"
//                       >
//                         <svg
//                           className="w-6 h-6"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M15 19l-7-7 7-7"
//                           />
//                         </svg>
//                       </button>
//                       <button
//                         onClick={nextSlide}
//                         className="w-14 h-14 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300 hover:scale-110"
//                       >
//                         <svg
//                           className="w-6 h-6"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M9 5l7 7-7 7"
//                           />
//                         </svg>
//                       </button>
//                     </div>

//                     {/* Testimonial Preview Cards */}
//                     <div className="space-y-4">
//                       {testimonials.map((testimonial, index) => (
//                         <div
//                           key={testimonial.id}
//                           onClick={() => goToSlide(index)}
//                           className={`cursor-pointer transition-all duration-300 ${
//                             index === currentIndex
//                               ? "opacity-100 transform scale-105"
//                               : "opacity-60 hover:opacity-80"
//                           }`}
//                         >
//                           <div
//                             className={`bg-white rounded-xl p-6 shadow-lg border-2 transition-all duration-300 ${
//                               index === currentIndex
//                                 ? "border-blue-500 shadow-xl"
//                                 : "border-transparent hover:border-blue-200"
//                             }`}
//                           >
//                             <div className="flex items-center space-x-4">
//                               <img
//                                 src={testimonial.image}
//                                 alt={testimonial.name}
//                                 className="w-12 h-12 rounded-full object-cover"
//                               />
//                               <div className="flex-1">
//                                 <h5 className="font-semibold text-gray-800 text-sm">
//                                   {testimonial.name}
//                                 </h5>
//                                 <p className="text-blue-600 text-xs">
//                                   {testimonial.title}
//                                 </p>
//                                 <p className="text-gray-600 text-xs mt-1 line-clamp-2">
//                                   {testimonial.text.substring(0, 60)}...
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Progress Indicator */}
//               <div className="mt-12 flex justify-center">
//                 <div className="bg-white rounded-full p-2 shadow-lg">
//                   <div className="flex space-x-3">
//                     {testimonials.map((_, index) => (
//                       <div
//                         key={index}
//                         className={`h-2 rounded-full transition-all duration-500 ${
//                           index === currentIndex
//                             ? "w-8 bg-blue-600"
//                             : "w-2 bg-gray-300"
//                         }`}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TestimonialCarousel;

import React, { useState, useEffect } from "react";
import { Quote, Star } from "lucide-react";

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      text: "Our trip to Manali with Samsara Adventures was beyond amazing! From the scenic Solang Valley to the cozy stays, everything was perfectly planned. The team made our holiday completely stress-free.",
      name: "Rohini Sharma",
      title: "Himachal Explorer",
      image:
        "https://images.unsplash.com/photo-1605369572399-05d8d64a0f6e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 5,
    },
    {
      id: 2,
      text: "Before the trip, I just wanted a peaceful getaway. During the journey, I found myself trekking in Solang Valley and watching the sunrise in Manali. I returned not just relaxed but inspired. Thank you, Samsara Adventures!",
      name: "Rohan Sharma",
      title: "Himachal Explorer",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      rating: 5,
    },
    {
      id: 3,
      text: "Before booking with Samsara Adventures, I was nervous about planning my first solo trip. During the trip, I discovered hidden cafes in Manali, met amazing people, and felt completely safe.",
      name: "Siddharath Sharma",
      title: "Himachal Explorer",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      rating: 5,
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, testimonials.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="min-h-screen bg-[#eff5d2] flex flex-col">
      <div className="container mx-auto px-4 py-6 lg:py-12 flex-1 flex flex-col">
        {/* Header Section - Compact for laptop */}
        <div className="text-center mb-6 lg:mb-12">
          <div className="inline-block mb-3 lg:mb-4">
            <span className="bg-blue-400 text-white px-4 py-2  text-sm font-medium tracking-wide uppercase">
              Testimonials
            </span>
          </div>
          <h2 className="text-2xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-2 lg:mb-4 leading-tight">
            What Our Travelers
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Say About Us
            </span>
          </h2>
          <p className="text-sm lg:text-lg text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
            Real stories from adventurers who explored the breathtaking
            landscapes of Himachal Pradesh with us
          </p>
        </div>

        {/* Mobile Layout */}
        <div className="block lg:hidden flex-1">
          <div className="max-w-sm mx-auto">
            <div className="relative bg-white rounded-3xl shadow-2xl p-6 overflow-hidden">
              <Quote className="absolute top-6 left-6 text-blue-200 w-8 h-8" />

              <div className="relative min-h-[150px] flex items-center">
                <div
                  className="flex transition-transform duration-700 ease-in-out w-full"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {testimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="w-full flex-shrink-0 px-2"
                    >
                      <div className="text-center">
                        <p className="text-base text-gray-700 leading-relaxed mb-6 italic px-4 font-light">
                          "{testimonial.text}"
                        </p>

                        <div className="flex flex-col items-center space-y-3">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                          />
                          <div className="text-center">
                            <h4 className="font-semibold text-gray-800 text-base mb-1">
                              {testimonial.name}
                            </h4>
                            <p className="text-blue-600 text-xs font-medium">
                              {testimonial.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center space-x-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-blue-600 scale-125 shadow-lg"
                        : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
                    }`}
                  />
                ))}
              </div>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700 ease-out"
                  style={{
                    width: `${
                      ((currentIndex + 1) / testimonials.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop/Laptop Layout - Optimized Height */}
        <div className="hidden lg:block flex-1">
          <div className="max-w-6xl mx-auto h-full">
            {/* Main Testimonial Card */}
            <div className="relative h-full flex flex-col">
              <div className="grid grid-cols-12 gap-6 xl:gap-8 items-center flex-1 max-h-[400px]">
                {/* Left side - Testimonial Content */}
                <div className="col-span-8">
                  <div className="bg-white rounded-2xl shadow-xl p-6 xl:p-8 relative overflow-hidden h-full">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-indigo-100 to-transparent rounded-tr-full"></div>

                    <Quote className="text-blue-500 w-8 h-8 xl:w-10 xl:h-10 mb-4 xl:mb-6 opacity-80" />

                    <div className="relative z-10 h-full flex flex-col justify-center">
                      <p className="text-lg xl:text-xl text-gray-700 leading-relaxed mb-4 xl:mb-6 font-light italic">
                        "{testimonials[currentIndex].text}"
                      </p>

                      {/* Rating Stars */}
                      <div className="flex space-x-1 mb-4 xl:mb-6">
                        {[...Array(testimonials[currentIndex].rating)].map(
                          (_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 xl:w-5 xl:h-5 text-yellow-400 fill-current"
                            />
                          )
                        )}
                      </div>

                      <div className="flex items-center space-x-4">
                        <img
                          src={testimonials[currentIndex].image}
                          alt={testimonials[currentIndex].name}
                          className="w-12 h-12 xl:w-14 xl:h-14 rounded-full object-cover border-3 border-blue-200 shadow-lg"
                        />
                        <div>
                          <h4 className="font-bold text-gray-800 text-lg xl:text-xl mb-1">
                            {testimonials[currentIndex].name}
                          </h4>
                          <p className="text-blue-600 font-medium text-sm xl:text-base">
                            {testimonials[currentIndex].title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Navigation & Preview */}
                <div className="col-span-4">
                  <div className="space-y-4 h-full flex flex-col">
                    {/* Navigation Arrows */}
                    <div className="flex justify-center space-x-3 mb-4">
                      <button
                        onClick={prevSlide}
                        className="w-10 h-10 xl:w-12 xl:h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300 hover:scale-110"
                      >
                        <svg
                          className="w-4 h-4 xl:w-5 xl:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={nextSlide}
                        className="w-10 h-10 xl:w-12 xl:h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300 hover:scale-110"
                      >
                        <svg
                          className="w-4 h-4 xl:w-5 xl:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Testimonial Preview Cards */}
                    <div className="space-y-3 flex-1">
                      {testimonials.map((testimonial, index) => (
                        <div
                          key={testimonial.id}
                          onClick={() => goToSlide(index)}
                          className={`cursor-pointer transition-all duration-300 ${
                            index === currentIndex
                              ? "opacity-100 transform scale-105"
                              : "opacity-60 hover:opacity-80"
                          }`}
                        >
                          <div
                            className={`bg-white rounded-lg p-3 xl:p-4 shadow-lg border-2 transition-all duration-300 ${
                              index === currentIndex
                                ? "border-blue-500 shadow-xl"
                                : "border-transparent hover:border-blue-200"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-8 h-8 xl:w-10 xl:h-10 rounded-full object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-semibold text-gray-800 text-xs xl:text-sm truncate">
                                  {testimonial.name}
                                </h5>
                                <p className="text-blue-600 text-xs">
                                  {testimonial.title}
                                </p>
                                <p className="text-gray-600 text-xs mt-1 line-clamp-1">
                                  {testimonial.text.substring(0, 40)}...
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-6 flex justify-center">
                <div className="bg-white rounded-full p-2 shadow-lg">
                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          index === currentIndex
                            ? "w-6 bg-blue-600"
                            : "w-1.5 bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;

// import React, { useState, useEffect } from 'react';
// import { Quote, Star } from 'lucide-react';

// const TestimonialCarousel = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const testimonials = [
//     {
//       id: 1,
//       text: "Our trip to Manali with Samsara Adventures was beyond amazing! From the scenic Solang Valley to the cozy stays, everything was perfectly planned. The team made our holiday completely stress-free.",
//       name: "Rohini Sharma",
//       title: "Himachal Explorer",
//       image: "https://images.unsplash.com/photo-1494790108755-2616c2d3b39a?w=80&h=80&fit=crop&crop=face",
//       rating: 5
//     },
//     {
//       id: 2,
//       text: "Before the trip, I just wanted a peaceful getaway. During the journey, I found myself trekking in Solang Valley and watching the sunrise in Manali. I returned not just relaxed but inspired. Thank you, Samsara Adventures!",
//       name: "Rohan Sharma",
//       title: "Himachal Explorer",
//       image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
//       rating: 5
//     },
//     {
//       id: 3,
//       text: "Before booking with Samsara Adventures, I was nervous about planning my first solo trip. During the trip, I discovered hidden cafes in Manali, met amazing people, and felt completely safe.",
//       name: "Siddharath Sharma",
//       title: "Himachal Explorer",
//       image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
//       rating: 5
//     },
//     {
//       id: 4,
//       text: "The Spiti Valley expedition was a life-changing experience! The landscapes were breathtaking, and the local culture immersion was incredible. Samsara Adventures made every moment unforgettable.",
//       name: "Priya Patel",
//       title: "Adventure Enthusiast",
//       image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
//       rating: 5
//     },
//     {
//       id: 5,
//       text: "Dharamshala and McLeod Ganj tour exceeded all expectations. The spiritual vibes, mountain views, and perfectly curated itinerary made it a perfect retreat for mind and soul.",
//       name: "Amit Kumar",
//       title: "Spiritual Traveler",
//       image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
//       rating: 5
//     },
//     {
//       id: 6,
//       text: "Kasol and Tosh village experience was magical! From riverside camping to mountain trekking, every detail was perfectly planned. The team's hospitality was exceptional throughout the journey.",
//       name: "Neha Singh",
//       title: "Nature Lover",
//       image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
//       rating: 5
//     }
//   ];

//   // Auto-play functionality
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => 
//         prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
//       );
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [currentIndex, testimonials.length]);

//   const goToSlide = (index) => {
//     setCurrentIndex(index);
//   };

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) => 
//       prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prevIndex) => 
//       prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       <div className="container mx-auto px-4 py-8 md:py-20">
//         {/* Header Section */}
//         <div className="text-center mb-8 md:mb-20">
//           <div className="inline-block mb-6 md:mb-8">
//             <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium tracking-wide uppercase">
//               Testimonials
//             </span>
//           </div>
//           <h2 className="text-2xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-2 md:mb-8 leading-tight">
//             What Our Travelers
//             <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//               Say About Us
//             </span>
//           </h2>
//           <p className="text-sm md:text-xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
//             Real stories from adventurers who explored the breathtaking landscapes of Himachal Pradesh with us
//           </p>
//         </div>

//         {/* Mobile Layout */}
//         <div className="block md:hidden">
//           <div className="max-w-sm mx-auto">
//             <div className="relative bg-white rounded-3xl shadow-2xl p-6 overflow-hidden">
//               <Quote className="absolute top-6 left-6 text-blue-200 w-8 h-8" />
              
//               <div className="relative min-h-[150px] flex items-center">
//                 <div 
//                   className="flex transition-transform duration-700 ease-in-out w-full"
//                   style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//                 >
//                   {testimonials.map((testimonial) => (
//                     <div key={testimonial.id} className="w-full flex-shrink-0 px-2">
//                       <div className="text-center">
//                         <p className="text-base text-gray-700 leading-relaxed mb-6 italic px-4 font-light">
//                           "{testimonial.text}"
//                         </p>
                        
//                         <div className="flex flex-col items-center space-y-3">
//                           <img
//                             src={testimonial.image}
//                             alt={testimonial.name}
//                             className="w-12 h-12 rounded-full object-cover border-4 border-blue-200 shadow-lg"
//                           />
//                           <div className="text-center">
//                             <h4 className="font-semibold text-gray-800 text-base mb-1">
//                               {testimonial.name}
//                             </h4>
//                             <p className="text-blue-600 text-xs font-medium">
//                               {testimonial.title}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="flex justify-center space-x-2 mt-6">
//                 {testimonials.map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => goToSlide(index)}
//                     className={`w-2 h-2 rounded-full transition-all duration-300 ${
//                       index === currentIndex
//                         ? 'bg-blue-600 scale-125 shadow-lg'
//                         : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
//                     }`}
//                   />
//                 ))}
//               </div>

//               <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
//                 <div
//                   className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700 ease-out"
//                   style={{
//                     width: `${((currentIndex + 1) / testimonials.length) * 100}%`
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Desktop Layout - Completely Redesigned */}
//         <div className="hidden md:block">
//           <div className="max-w-7xl mx-auto">
//             {/* Main Testimonial Card */}
//             <div className="relative">
//               <div className="grid grid-cols-12 gap-8 items-center min-h-[500px]">
//                 {/* Left side - Testimonial Content */}
//                 <div className="col-span-7">
//                   <div className="bg-white rounded-2xl shadow-xl p-12 relative overflow-hidden">
//                     {/* Background decoration */}
//                     <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full"></div>
//                     <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-100 to-transparent rounded-tr-full"></div>
                    
//                     <Quote className="text-blue-500 w-12 h-12 mb-8 opacity-80" />
                    
//                     <div className="relative z-10">
//                       <p className="text-2xl text-gray-700 leading-relaxed mb-8 font-light italic">
//                         "{testimonials[currentIndex].text}"
//                       </p>
                      
//                       {/* Rating Stars */}
//                       <div className="flex space-x-1 mb-6">
//                         {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
//                           <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
//                         ))}
//                       </div>
                      
//                       <div className="flex items-center space-x-4">
//                         <img
//                           src={testimonials[currentIndex].image}
//                           alt={testimonials[currentIndex].name}
//                           className="w-16 h-16 rounded-full object-cover border-3 border-blue-200 shadow-lg"
//                         />
//                         <div>
//                           <h4 className="font-bold text-gray-800 text-xl mb-1">
//                             {testimonials[currentIndex].name}
//                           </h4>
//                           <p className="text-blue-600 font-medium">
//                             {testimonials[currentIndex].title}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Right side - Navigation & Preview */}
//                 <div className="col-span-5">
//                   <div className="space-y-6">
//                     {/* Navigation Arrows */}
//                     <div className="flex justify-center space-x-4 mb-8">
//                       <button
//                         onClick={prevSlide}
//                         className="w-14 h-14 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300 hover:scale-110"
//                       >
//                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                         </svg>
//                       </button>
//                       <button
//                         onClick={nextSlide}
//                         className="w-14 h-14 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300 hover:scale-110"
//                       >
//                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                         </svg>
//                       </button>
//                     </div>
                    
//                     {/* Testimonial Preview Cards */}
//                     <div className="relative">
//                       {/* Header */}
//                       <div className="flex items-center justify-between mb-6">
//                         <h3 className="text-lg font-semibold text-gray-800">All Reviews</h3>
//                         <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs px-3 py-1 rounded-full font-medium">
//                           {testimonials.length} reviews
//                         </span>
//                       </div>
                      
//                       <div className={`space-y-3 ${testimonials.length > 3 ? 'max-h-96 overflow-y-auto pr-2' : ''} relative`}
//                            style={testimonials.length > 3 ? {
//                              scrollbarWidth: 'thin',
//                              scrollbarColor: '#93c5fd #dbeafe'
//                            } : {}}>
                        
//                         {testimonials.map((testimonial, index) => (
//                           <div
//                             key={testimonial.id}
//                             onClick={() => goToSlide(index)}
//                             className={`group cursor-pointer transition-all duration-300 ${
//                               index === currentIndex
//                                 ? 'opacity-100 transform translate-x-2'
//                                 : 'opacity-70 hover:opacity-90 hover:translate-x-1'
//                             }`}
//                           >
//                             <div className={`relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 shadow-md border transition-all duration-300 overflow-hidden ${
//                               index === currentIndex
//                                 ? 'border-blue-400 shadow-xl shadow-blue-100/50 bg-gradient-to-br from-blue-50 to-white'
//                                 : 'border-gray-200 hover:border-blue-200 hover:shadow-lg'
//                             }`}>
                              
//                               {/* Active indicator line */}
//                               <div className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600 transition-all duration-300 ${
//                                 index === currentIndex ? 'opacity-100' : 'opacity-0'
//                               }`}></div>
                              
//                               {/* Subtle background pattern */}
//                               <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
//                                 <Quote className="w-full h-full text-blue-600" />
//                               </div>
                              
//                               <div className="flex items-start space-x-4 relative z-10">
//                                 <div className="relative flex-shrink-0">
//                                   <img
//                                     src={testimonial.image}
//                                     alt={testimonial.name}
//                                     className={`w-14 h-14 rounded-full object-cover transition-all duration-300 ${
//                                       index === currentIndex 
//                                         ? 'ring-4 ring-blue-200 shadow-lg' 
//                                         : 'ring-2 ring-gray-200 group-hover:ring-blue-200'
//                                     }`}
//                                   />
//                                   {/* Active dot indicator */}
//                                   <div className={`absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center transition-all duration-300 ${
//                                     index === currentIndex ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
//                                   }`}>
//                                     <div className="w-2 h-2 bg-white rounded-full"></div>
//                                   </div>
//                                 </div>
                                
//                                 <div className="flex-1 min-w-0">
//                                   <div className="flex items-center justify-between mb-1">
//                                     <h5 className={`font-semibold text-sm transition-colors duration-300 ${
//                                       index === currentIndex ? 'text-blue-800' : 'text-gray-800'
//                                     }`}>
//                                       {testimonial.name}
//                                     </h5>
//                                     {/* Rating stars */}
//                                     <div className="flex items-center space-x-1">
//                                       {[...Array(testimonial.rating)].map((_, i) => (
//                                         <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
//                                       ))}
//                                     </div>
//                                   </div>
                                  
//                                   <p className={`text-xs font-medium mb-2 transition-colors duration-300 ${
//                                     index === currentIndex ? 'text-blue-600' : 'text-blue-500'
//                                   }`}>
//                                     {testimonial.title}
//                                   </p>
                                  
//                                   <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
//                                     {testimonial.text.substring(0, 80)}...
//                                   </p>
//                                 </div>
//                               </div>
                              
//                               {/* Hover effect overlay */}
//                               <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl transition-opacity duration-300 ${
//                                 index === currentIndex ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
//                               }`}></div>
//                             </div>
//                           </div>
//                         ))}
                        
//                         {/* Scroll fade gradients */}
//                         {testimonials.length > 3 && (
//                           <>
//                             <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-slate-50 via-blue-50/50 to-transparent pointer-events-none z-10"></div>
//                             <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-50 via-blue-50/50 to-transparent pointer-events-none z-10"></div>
//                           </>
//                         )}
//                       </div>
                      
//                       {/* Enhanced scrollbar styles */}
//                       {testimonials.length > 3 && (
//                         <style jsx>{`
//                           div::-webkit-scrollbar {
//                             width: 8px;
//                           }
//                           div::-webkit-scrollbar-track {
//                             background: linear-gradient(to bottom, #f1f5f9, #e2e8f0);
//                             border-radius: 10px;
//                             margin: 10px 0;
//                           }
//                           div::-webkit-scrollbar-thumb {
//                             background: linear-gradient(to bottom, #3b82f6, #6366f1);
//                             border-radius: 10px;
//                             border: 1px solid rgba(255,255,255,0.2);
//                           }
//                           div::-webkit-scrollbar-thumb:hover {
//                             background: linear-gradient(to bottom, #2563eb, #4f46e5);
//                             box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//                           }
//                         `}</style>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Progress Indicator */}
//               <div className="mt-12 flex justify-center">
//                 <div className="bg-white rounded-full p-2 shadow-lg">
//                   <div className="flex space-x-3">
//                     {testimonials.map((_, index) => (
//                       <div
//                         key={index}
//                         className={`h-2 rounded-full transition-all duration-500 ${
//                           index === currentIndex
//                             ? 'w-8 bg-blue-600'
//                             : 'w-2 bg-gray-300'
//                         }`}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TestimonialCarousel;

