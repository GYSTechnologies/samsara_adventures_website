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
      month: 'short'
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



  const EventCard = ({ event, isMobile = false }) => {
    const eventDate = formatDate(event.date);
    
    return (
      <div
        className={`group  relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
          isMobile ? "min-w-[280px] mx-1 h-64" : "flex-none w-70 h-64"
        }`}
        onClick={() => handleViewDetails(event._id || event.id)}
      >
        {/* Background Image */}
        <img
          src={event.coverImage || event.image}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Date Badge - Bottom Left */}
        <div className="absolute top-4 left-4 bg-black/50 rounded-full text-white px-3 py-1  text-sm font-medium z-10">
          {eventDate}
        </div>

        {/* Price Badge - Top Left */}
        {event.price && (
          <div className="absolute bottom-4 right-4  bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
            Rs.{event.price.toLocaleString()}
          </div>
        )}

        {/* Content Overlay - Bottom */}
        <div className="absolute inset-0 p-4 flex flex-col justify-end text-white z-10">
          <h3 className="text-xl font-bold mb-1 leading-tight line-clamp-2">
            {event.title}
          </h3>
          <p className="text-gray-200 text-sm leading-relaxed line-clamp-1">
            {event.location}
          </p>
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
    <div className="bg-[#eff5d2] ">
      <div className="max-w-6xl mx-auto px-4  ">
        
        {/* Popular Events Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 pb-8">
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
