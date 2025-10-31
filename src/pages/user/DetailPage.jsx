import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { MapPin, Heart, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import Loader from "../../components/Loader.jsx";

// Split components
import TabNavigation from "./Detailspage/TabNavigation.jsx";
import ItinerarySection from "./Detailspage/ItinerarySection.jsx";
import ContactInfoForm from "./Detailspage/ContactInfoForm.jsx";
import InclusionsSection from "./Detailspage/InclusionsSection.jsx";

/* Professional Image Gallery Component */
const ImageGallery = ({ images, title, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const autoPlayRef = useRef(null);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1 || isFullScreen) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, images.length, isFullScreen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isFullScreen) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") toggleFullScreen();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreen]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      goToNext();
    }
    if (touchStart - touchEnd < -50) {
      goToPrevious();
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  };

  const handleThumbnailClick = (index) => {
    goToSlide(index);
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-64 md:h-96 bg-gray-200 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const currentImage = images[currentIndex]?.url || images[currentIndex];

  return (
    <>
      {/* Main Gallery */}
      <div className="relative w-full mt-16 md:mt-0 group">
        {/* Main Image Container */}
        <div 
          className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden rounded-xl bg-black cursor-zoom-in"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={toggleFullScreen}
        >
          {/* Images with Fade Transition */}
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={image.url || image}
                alt={`${title} - ${index + 1}`}
                className="w-full h-full object-cover cursor-zoom-in"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-20 pointer-events-none"></div>

          {/* Navigation Arrows - Desktop */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Mobile Navigation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/80 text-gray-800 p-2 rounded-full shadow-lg"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/80 text-gray-800 p-2 rounded-full shadow-lg"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Image Counter & Zoom */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullScreen();
              }}
              className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg backdrop-blur-sm transition-all hover:scale-110"
              aria-label="View fullscreen"
            >
              <ZoomIn className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <div className="bg-black/60 text-white px-3 py-1.5 rounded-lg backdrop-blur-sm text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {/* Auto-play indicator */}
          {isAutoPlaying && (
            <div className="absolute top-4 left-4 z-30 bg-green-500/80 text-white px-2 py-1 rounded-lg backdrop-blur-sm text-xs font-medium flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Auto
            </div>
          )}

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
            ></div>
          </div>

          {/* Click to Expand Hint */}
          <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm text-sm font-medium flex items-center gap-2">
              <ZoomIn className="w-4 h-4" />
              Click to expand
            </div>
          </div>
        </div>

        {/* Thumbnail Navigation - Desktop */}
        <div className="hidden md:flex mt-4 px-4 pt-2 gap-2 overflow-x-auto scrollbar-hide pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                index === currentIndex
                  ? 'ring-4 ring-blue-500 scale-105'
                  : 'ring-2 ring-gray-300 hover:ring-blue-300 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={image.url || image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover cursor-pointer"
              />
              {index === currentIndex && (
                <div className="absolute inset-0 bg-blue-500/20"></div>
              )}
            </button>
          ))}
        </div>

        {/* Dot Indicators - Mobile */}
        <div className="md:hidden flex justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 h-2 bg-blue-500'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to image ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>

      {/* Fullscreen Gallery Modal */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-black/98 flex flex-col">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
            <div className="text-white font-semibold flex items-center gap-2">
              <span className="text-sm md:text-base">{title}</span>
              <span className="text-gray-400">•</span>
              <span className="text-sm md:text-base">{currentIndex + 1} / {images.length}</span>
            </div>
            <button
              onClick={toggleFullScreen}
              className="bg-white/10 hover:bg-white/20 text-white p-2 md:p-3 rounded-lg transition-all hover:scale-110"
              aria-label="Close fullscreen"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          {/* Main Content */}
          <div 
            className="flex-1 flex items-center justify-center px-4 py-20 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Main Image */}
            <img
              src={currentImage}
              alt={`${title} - ${currentIndex + 1}`}
              className="max-h-full max-w-full object-contain animate-fade-in"
            />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 md:p-4 rounded-full transition-all hover:scale-110 z-40"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 md:p-4 rounded-full transition-all hover:scale-110 z-40"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Bottom Thumbnail Strip */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`relative flex-shrink-0 w-16 h-12 md:w-20 md:h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                    index === currentIndex
                      ? 'ring-4 ring-blue-500 scale-105'
                      : 'ring-2 ring-gray-500 hover:ring-gray-400 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image.url || image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-blue-500/20"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Keyboard Hint */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/70 text-gray-300 px-4 py-2 rounded-lg text-xs md:text-sm text-center pointer-events-none">
            Use ← → arrows or Swipe | Press Esc to close
          </div>
        </div>
      )}

      {/* Add animation to global styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

/* Helpers */
const formatINR = (n) => {
  const num = Number(n);
  if (!isFinite(num)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

const formatRange = (start, end) => {
  try {
    const s = new Date(start);
    const e = new Date(end);
    const fmt = new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return `${fmt.format(s)} - ${fmt.format(e)}`;
  } catch {
    return "";
  }
};

const LoadingState = () => <Loader />;

const ErrorState = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto">
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
      >
        Try Again
      </button>
    </div>
  </div>
);

const DetailPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [expandedDay, setExpandedDay] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const [formData, setFormData] = useState({
    adults: 2,
    children: 1,
    infants: 0,
    fullName: "",
    email: user?.email || "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const tabs = useMemo(
    () => [
      { id: "description", label: "Description" },
      { id: "itinerary", label: "Itinerary" },
      { id: "inclusions", label: "Inclusions" },
      { id: "exclusions", label: "Exclusions" },
    ],
    []
  );

  const fetchTripDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(
        `/api/trip/getTripDetailsById`,
        { params: { tripId, email: user?.email } }
      );

      let trip = response?.data?.trip;

      if (!trip && window?.history?.state?.usr?.trip) {
        trip = window.history.state.usr.trip;
      }

      if (!trip) throw new Error("Trip not found");

      trip.images = Array.isArray(trip.images) ? trip.images : [];
      trip.inclusions = Array.isArray(trip.inclusions) ? trip.inclusions : [];
      trip.exclusions = Array.isArray(trip.exclusions) ? trip.exclusions : [];
      trip.itinerary = Array.isArray(trip.itinerary) ? trip.itinerary : [];

      setTripData(trip);
      setIsFavorite(!!trip.isFavorite);
      setFormData((p) => ({
        ...p,
        email: p.email || user?.email || "",
        fullName: p.fullName || user?.name || "",
      }));
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Failed to load trip details"
      );
    } finally {
      setLoading(false);
    }
  }, [tripId, user]);

  useEffect(() => {
    fetchTripDetails();
  }, [fetchTripDetails]);

  const toggleDay = (dayNumber) =>
    setExpandedDay((prev) => (prev === dayNumber ? null : dayNumber));

  const toggleFavorite = async (tripId, email, isFavorite) => {
    if (!isAuthenticated) return navigate("/login");
    try {
      const newFavoriteStatus = !isFavorite;
      setIsFavorite(newFavoriteStatus);
      await axiosInstance.post("/api/user/toggleFavorite", {
        tripId,
        email: user.email,
        isFavorite: newFavoriteStatus,
      });
      toast.success(
        newFavoriteStatus ? "Added to favorites!" : "Removed from favorites"
      );
    } catch {
      setIsFavorite((prev) => !prev);
      toast.error("Failed to update favorite status");
    }
  };

  const handleSubmit = () => {
    if (!isAuthenticated || !user) {
      toast.info("Please login to continue booking");
      navigate("/login", {
        state: {
          from: `/details/${tripId}`,
          bookingData: { ...formData, tripId },
          tripDetails: tripData,
        },
      });
      return;
    }

    navigate(`/payment/${tripId}`, {
      state: { bookingData: { ...formData, tripId }, tripDetails: tripData },
    });
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchTripDetails} />;
  if (!tripData) return null;

  const price = formatINR(tripData?.payment?.grandTotal);
  const dateRange = formatRange(tripData?.startDate, tripData?.endDate);

  return (
    <div className="min-h-screen bg-[#f0f2d9]">
      {/* Desktop */}
      <div className="hidden md:block pt-20 max-w-6xl mx-auto pb-6 px-4">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-6">
          <div className="relative">
            <ImageGallery 
              images={tripData.images} 
              title={tripData.title}
            />
            {tripData?.duration && (
              <div className="absolute top-6 left-6 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm z-20">
                 {tripData.duration}
              </div>
            )}
          </div>
  
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {tripData.title}
                </h1>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-medium">{tripData.state}</span>
                </div>
                {dateRange && (
                  <div className="text-sm text-gray-600 bg-gray-100 inline-block px-3 py-1 rounded-lg">
                     {dateRange}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(tripId, user?.email, isFavorite);
                }}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 shadow-md transition-all hover:scale-110"
              >
                <Heart
                  size={24}
                  className={
                    isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                  }
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-3xl font-bold text-green-600">
                {price}
              </div>
              <button
                onClick={handleSubmit}
                className="bg-lime-700 hover:bg-lime-800 text-white font-semibold px-8 py-3 rounded-xl transition-all hover:scale-105 shadow-lg"
              >
                Book Now →
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 ">
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />

          {activeTab === "description" && (
            <div className="bg-white p-4 rounded-b-xl shadow">
              <h3 className="text-xl font-semibold mb-4">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {tripData.description}
              </p>
            </div>
          )}

          {activeTab === "itinerary" && (
            <ItinerarySection
              itinerary={tripData.itinerary}
              expandedDay={expandedDay}
              toggleDay={toggleDay}
            />
          )}

          {activeTab === "inclusions" && (
            <InclusionsSection
              inclusions={tripData.inclusions}
              exclusions={[]}
            />
          )}

          {activeTab === "exclusions" && (
            <InclusionsSection
              inclusions={[]}
              exclusions={tripData.exclusions}
            />
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden pb-20">
        <div className="relative">
          <ImageGallery 
            images={tripData.images} 
            title={tripData.title}
          />
        </div>

        <div className="bg-white mt-4 rounded-t-3xl shadow-lg">
          <div className="px-4 py-5">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {tripData.title}
            </h1>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-gray-600 text-sm">{tripData.state}</span>
            </div>
            {dateRange && (
              <div className="text-xs text-gray-500 bg-gray-100 inline-block px-2 py-1 rounded">
                 {dateRange}
              </div>
            )}
            <div className="mt-4 text-2xl font-bold text-green-600">
              {price}
            </div>
          </div>

          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />

          {activeTab === "description" && (
            <div className="p-4">
              <p className="text-gray-600 text-sm leading-relaxed">
                {tripData.description}
              </p>
            </div>
          )}

          {activeTab === "itinerary" && (
            <ItinerarySection
              itinerary={tripData.itinerary}
              expandedDay={expandedDay}
              toggleDay={toggleDay}
            />
          )}

          {activeTab === "inclusions" && (
            <InclusionsSection
              inclusions={tripData.inclusions}
              exclusions={[]}
            />
          )}

          {activeTab === "exclusions" && (
            <InclusionsSection
              inclusions={[]}
              exclusions={tripData.exclusions}
            />
          )}
        </div>

        <div className="fixed bottom-18 left-0 right-0 bg-white border-t border-gray-200 p-2 z-30 shadow-lg">
          <button
            onClick={handleSubmit}
            className="w-full bg-lime-700 hover:bg-lime-800 text-white font-semibold py-2 rounded-xl transition-all shadow-lg"
          >
            Book Now →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
