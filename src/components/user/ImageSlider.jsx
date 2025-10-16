import React, { useState, useEffect } from "react";

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80",
      title: "Explore the world with Samsara Adventures",
      desc: "Discover new destinations and create unforgettable memories with our travel experiences.",
    },
    // {
    //   image:
    //     "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //   title: "Mountains are calling!",
    //   desc: "Feel the thrill of trekking and adventure in the most breathtaking mountain ranges.",
    // },
    {
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2070&q=80",
      title: "Luxury stays at exotic locations",
      desc: "Relax and rejuvenate with world-class amenities at scenic resorts and hotels.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1656051395193-d0620dfdcb2c?q=80&w=1929&auto=format&fit=crop",
      title: "Unforgettable adventures await",
      desc: "From beaches to deserts, explore diverse landscapes and hidden gems with us.",
    },
  ];


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          {/* Slide Content */}
          <div className="relative z-10 flex flex-col h-full px-4 sm:px-6 pt-20">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-4xl">
                <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-white text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                  {slide.desc}
                </p>
                {/* <button
                  onClick={() => navigate("/destination/all")}
                  className="hidden sm:inline-block bg-gradient-to-r from-lime-900/80 to-lime-800/80 hover:from-lime-900/80 hover:to-lime-800 text-white px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border-2 border-white/20"  
                >
                  Start Planning
                </button> */}
              </div>
            </div>

            {/* Mobile Button */}
            <div className="sm:hidden pb-8">
              {/* <button
                onClick={() => navigate("/destination/all")}
                className="w-full bg-gradient-to-r from-lime-900/80 to-lime-800 hover:from-green-900 hover:to-green-700 text-white py-3 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-[1.02] shadow-xl active:scale-95 border-2 border-white/20"
              >
                Start Planning
              </button> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageSlider;
