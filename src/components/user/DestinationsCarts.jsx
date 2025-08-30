import React, { useState, useEffect } from "react";
import { Clock, Star } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const DestinationsCarts = () => {
  const [topDestinations, setTopDestinations] = useState([]);
  const [stateDestinations, setStateDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigate();

  // Fetch Popular Locations (Top Destinations)
  const fetchPopularLocations = async () => {
    try {
      const response = await axiosInstance.get("/api/trip/getHomeTripDetails");

      if (!response.data || !Array.isArray(response.data.trips)) {
        console.error("Invalid response structure:", response.data);
        return [];
      }

      //  Remove duplicates by title + state
      const uniqueTrips = [];
      const seen = new Set();

      for (const trip of response.data.trips) {
        const key = `${trip.title}-${trip.state}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueTrips.push(trip);
        }
      }

      return uniqueTrips.map((trip) => ({
        id: trip.tripId || Math.random().toString(36).substr(2, 9),
        title: trip.title || "Popular Destination",
        description: trip.description || "Experience this amazing destination",
        image:
          trip.image ||
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
        tag:
          Array.isArray(trip.tags) && trip.tags[0]
            ? trip.tags[0]
            : "Popular Destination",
        duration: trip.duration || "5 days trip",
        buttonText: "Explore More",
        location: trip.state || trip.title || "india",
        subTotal: trip.subTotal || null,
      }));
    } catch (err) {
      console.error("Error fetching top destinations:", err);
      setError("Failed to load top destinations");
      return [];
    }
  };

  // Fetch State Wise Destinations
  const fetchStateWiseDestinations = async () => {
    try {
      const response = await axiosInstance.get("/api/trip/getStateTrips", {
        params: { limit: 6 },
      });

      if (!response.data || !Array.isArray(response.data.trips)) {
        console.error("Invalid response structure:", response.data);
        return [];
      }

      // Step 1: Unique states filter
      const uniqueTrips = response.data.trips.filter(
        (trip, index, self) =>
          index === self.findIndex((t) => t.state === trip.state)
      );

      // Step 2: Map to required format - Use state name instead of title
      return uniqueTrips.map((trip) => ({
        id: trip.tripId || Math.random().toString(36).substr(2, 9),
        title: trip.state || "State Destination", // Changed from trip.title to trip.state
        description:
          trip.description || "Experience the beauty of this destination",
        image:
          trip.image ||
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
        tag: Array.isArray(trip.tags) && trip.tags[0] ? trip.tags[0] : "Travel",
        duration: trip.duration || "5 days trip",
        buttonText: "Explore More",
        location: trip.state || "india",
        subTotal: trip.subTotal || null,
      }));
    } catch (err) {
      console.error("Error fetching state destinations:", err);
      setError("Failed to load state destinations");
      return [];
    }
  };

  //  Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [topDest, stateDest] = await Promise.all([
          fetchPopularLocations(),
          fetchStateWiseDestinations(),
        ]);
        setTopDestinations(topDest);
        setStateDestinations(stateDest);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const DestinationCard = ({ destination, isMobile = false, sectionType }) => (
    <div
      className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white flex flex-col ${
        isMobile ? "min-w-[280px] mx-2" : "flex-none w-90"
      }`}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* 🔹 Price Tag (Top Right) */}

        <span
          className="absolute top-3 right-3 inline-flex items-center px-5 py-2 
          bg-blue-50 text-blue-700 rounded-full text-xs font-medium shadow-md"
        >
          ₹{destination?.subTotal}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight">
          {destination.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3 flex-grow">
          {destination.description}
        </p>

        {/* Tags */}
        <div className="flex items-center gap-3 mb-4">
          {sectionType === "top" ? (
            <span
              className="inline-flex items-center gap-1 px-3 py-1 
              bg-gray-100 text-gray-700 
              border border-orange-300 
              rounded-full text-xs font-medium"
            >
              <Star size={12} className="fill-current text-yellow-600" />
              {destination.tag}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              <Star size={12} className="fill-current" />
              {destination.tag}
            </span>
          )}

          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
            <Clock size={12} />
            {destination.duration}
          </span>
        </div>

        {/* Button */}
        <button
          onClick={() => navigation(`/destination/${destination.location}`)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 text-sm mt-auto cursor-pointer"
        >
          {destination.buttonText}
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading destinations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Top Destinations Section */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
            Top Destinations and Deals
          </h2>

          {/* Mobile View - Horizontal Scroll */}
          <div className="block md:hidden">
            <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
              {topDestinations.map((destination) => (
                <div key={destination.id} className="snap-center">
                  <DestinationCard
                    destination={destination}
                    isMobile={true}
                    sectionType="top"
                  />
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
                  width: `${Math.max(100, topDestinations.length * 22)}%`,
                }}
              >
                {topDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    sectionType="top"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* States Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
            Explore States, Cities & Hidden Gems
          </h2>

          {/* Mobile View - Horizontal Scroll */}
          <div className="block md:hidden">
            <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
              {stateDestinations.map((destination) => (
                <div key={destination.id} className="snap-center">
                  <DestinationCard
                    destination={destination}
                    isMobile={true}
                    sectionType="state"
                  />
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
                  width: `${Math.max(100, stateDestinations.length * 22)}%`,
                }}
              >
                {stateDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    sectionType="state"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Custom Scrollbar Hide Styles */}
      <style>{`
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .line-clamp-3 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
      }
    `}</style>
    </div>
  );
};

export default DestinationsCarts;
