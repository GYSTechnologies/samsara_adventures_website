import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";

export default function EventsSections() {
  const navigate = useNavigate();
  const [popularEvents, setPopularEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch published events with pagination
      const response = await axiosInstance.get(`/api/events`, {
        params: {
          page: 1,
          limit: 8, // Fetch 8 events total
          status: 'published'
        }
      });

      const events = response.data.events;

      if (events && events.length > 0) {
        // Filter popular events based on bookedSeats
        // const popular = events.filter(event => event.bookedSeats > 0);
        // setPopularEvents(popular.slice(0, 8));
        setPopularEvents(events.slice(0, 8));

      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (eventId) => {
    navigate(`/event-detail/${eventId}`);
  };

  const handleBookNow = (eventId) => {
    navigate(`/event-detail/${eventId}`);
  };

  const EventCard = ({ event, isMobile = false }) => {
    const eventDate = formatDate(event.date);
    const eventTime = formatTime(event.date);
    
    return (
      <div
        className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white ${
          isMobile ? "min-w-[280px] mx-2" : "flex-none w-84"
        }`}
      >
        {/* Image Section */}
        <div className="relative overflow-hidden">
          <img
            src={event.coverImage || event.image}
            alt={event.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
              {event.category}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight line-clamp-2">
            {event.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
            {event.shortDescription || event.description}
          </p>

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <svg
                className="w-4 h-4 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {eventDate} | {eventTime}
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <svg
                className="w-4 h-4 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>

          {/* Price and Button */}
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-gray-600">
              ₹{event.price}/person
            </div>

            <button 
              onClick={() => handleBookNow(event._id || event.id)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
            >
              BOOK NOW
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error && popularEvents.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchEvents}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        
        {/* Popular Events Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
            Popular Events
          </h2>

          {popularEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No popular events found.</p>
            </div>
          ) : (
            <>
              {/* Mobile View - Horizontal Scroll */}
              <div className="block md:hidden">
                <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
                  {popularEvents.map((event) => (
                    <div key={event._id || event.id} className="snap-center">
                      <EventCard event={event} isMobile={true} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop/Tablet View - Horizontal Scroll */}
              <div className="hidden md:block">
                <div className="overflow-x-auto scrollbar-hide">
                  <div 
                    className="flex gap-6 pb-4"
                    style={{
                      width: `${Math.max(100, popularEvents.length * 25)}%`
                    }}
                  >
                    {popularEvents.map((event) => (
                      <EventCard key={event._id || event.id} event={event} />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Custom Scrollbar Hide Styles */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </div>
  );
}