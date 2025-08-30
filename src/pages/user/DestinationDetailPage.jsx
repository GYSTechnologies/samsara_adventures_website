import React, { useState, useEffect } from "react";
import {
  Heart,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Clock,
  Filter,
  Grid,
  List,
  ShoppingCart 
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import Loader from "../../components/Loader.jsx";

const DestinationDetailPage = () => {
  const [likedPackages, setLikedPackages] = useState(new Set());
  const [tourPackages, setTourPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [destinationInfo, setDestinationInfo] = useState(null);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const { state } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch packages data
  const fetchDestinationData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        limit: 10,
        ...(state && state !== "all" && { state }),
        ...(user?.email && { email: user.email }),
      };

      const response = await axiosInstance.get("/api/trip/getTripsByState", {
        params,
      });

      if (response.data?.trips) {
        const transformedPackages = response.data.trips.map((trip) => ({
          id: trip.tripId,
          title: trip.title,
          duration: trip.duration || "Custom duration",
          price: trip.subTotal || trip.actualPrice || 0,
          image:
            trip.image ||
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          tag: trip.tripType === "CUSTOMIZED" ? "Plan Your trip" : "Group Trip",
          activities: trip.activities || [],
          highlights: trip.activities || [],
          isFavorite: trip.isFavorite || false,
        }));

        setTourPackages(transformedPackages);

        const initialLiked = new Set();
        transformedPackages.forEach((pkg) => {
          if (pkg.isFavorite) initialLiked.add(pkg.id);
        });
        setLikedPackages(initialLiked);

        setDestinationInfo({
          title: `Explore ${state}`,
          subtitle: `Discover amazing destinations and create unforgettable memories in ${state} with our carefully curated tour packages.`,
          location: `${state}, India`,
          packagesCount: transformedPackages.length,
        });
      } else {
        setError("No packages found.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load packages. Try again later.");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinationData();
  }, [state, user]);

  const toggleLike = async (id) => {
    if (!user) {
      toast.info("Please login to save favorites");
      navigate("/login");
      return;
    }

    try {
      const newLikedPackages = new Set(likedPackages);
      const isLiked = newLikedPackages.has(id);

      if (isLiked) newLikedPackages.delete(id);
      else newLikedPackages.add(id);
      setLikedPackages(newLikedPackages);

      await axiosInstance.post("/api/user/toggleFavorite", {
        tripId: id,
        email: user.email,
        isFavorite: !isLiked,
      });

      await fetchDestinationData();

      toast.success(isLiked ? "Removed from favorites" : "Added to favorites!");
    } catch (err) {
      console.error("Error toggling favorite:", err);
      setLikedPackages(new Set(likedPackages));
      toast.error("Failed to update favorite");
    }
  };

  const getTagColors = (tag) =>
    ({
      "Group Trip": "bg-gradient-to-r from-emerald-500 to-teal-500",
      "Plan Your trip": "bg-gradient-to-r from-blue-500 to-indigo-500",
    }[tag] || "bg-gradient-to-r from-gray-500 to-gray-600");

  // Enhanced Loading Component
  if (loading) {
    return (
      // <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      //   <div className="text-center">
      //     <div className="relative">
      //       <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
      //       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0 left-0"></div>
      //     </div>
      //     <p className="mt-4 text-gray-600 font-medium">
      //       Loading amazing destinations...
      //     </p>
      //   </div>
      // </div>
      <Loader/>
    );
  }

  // Enhanced Error Component
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="text-red-500" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={fetchDestinationData}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 mt-15">
      {/* Enhanced Header with Background Images */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80"
            alt="Kerala Backwaters"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        {/* Secondary Background Image - Floating */}
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full overflow-hidden opacity-20 blur-sm hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
            alt="Kerala Hills"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Additional floating image */}
        <div className="absolute bottom-10 left-10 w-48 h-32 rounded-2xl overflow-hidden opacity-15 blur-sm hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Kerala Beach"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Gradient overlays for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Location Badge */}
          <div className="flex items-center gap-2 mb-6 lg:mb-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20">
              <MapPin size={16} className="text-blue-300" />
              <span className="text-sm font-semibold">
                {destinationInfo?.location}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="flex-1 space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                {destinationInfo?.title}
              </h1>

              {/* Description - Hidden on mobile */}
              <p className="hidden lg:block text-blue-100 text-lg xl:text-xl max-w-4xl leading-relaxed drop-shadow-sm">
                {destinationInfo?.subtitle}
              </p>

              {/* Package Count Badge */}
              <div className="flex items-center pt-2">
                <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-md border border-white/20 px-5 py-3 rounded-full">
                  <Calendar className="text-blue-300" size={18} />
                  <span className="text-sm font-bold text-white">
                    {destinationInfo?.packagesCount} Packages Available
                  </span>
                </div>
              </div>
            </div>

            {/* View Toggle - Enhanced with glassmorphism */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/20">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-white text-blue-600 shadow-lg transform scale-110"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-lg transform scale-110"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/5 to-transparent"></div>
      </div>

      {/* Enhanced Packages Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {tourPackages.length > 0 ? (
          <>
            {/* Results Count */}
            <div className="mb-8">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {tourPackages.length}
                </span>{" "}
                amazing packages
              </p>
            </div>

            {/* Grid/List View */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "space-y-6"
              }
            >
              {tourPackages.map((pkg, index) => (
                <div
                  key={pkg.id}
                  className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                    viewMode === "list" ? "flex flex-col md:flex-row" : ""
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Enhanced Image Section */}
                  <div
                    className={`relative ${
                      viewMode === "list" ? "md:w-80 h-64 md:h-auto" : "h-56"
                    } overflow-hidden`}
                  >
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>

                    {/* Enhanced Tag */}
                    <div
                      className={`absolute top-4 left-4 ${getTagColors(
                        pkg.tag
                      )} text-white px-3 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg backdrop-blur-sm`}
                    >
                      {pkg.tag === "Group Trip" ? (
                        <Users size={14} />
                      ) : (
                        <Calendar size={14} />
                      )}
                      {pkg.tag}
                    </div>

                    {/* Enhanced Heart Button */}
                    <button
                      onClick={() => toggleLike(pkg.id)}
                      className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 transform hover:scale-110 shadow-lg"
                    >
                      <Heart
                        size={18}
                        className={
                          likedPackages.has(pkg.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-600 hover:text-red-400"
                        }
                      />
                    </button>

                    {/* Enhanced Price Badge */}
                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                      <span className="font-bold text-lg text-gray-900">
                        ₹{pkg.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Content */}
                  <div
                    className={`p-6 ${
                      viewMode === "list"
                        ? "flex-1 flex flex-col justify-between"
                        : ""
                    }`}
                  >
                    <div>
                      <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {pkg.title}
                      </h3>

                      <div className="flex items-center gap-3 text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-blue-500" />
                          <span className="text-sm font-medium">
                            {pkg.duration}
                          </span>
                        </div>
                      </div>

                      {/* Enhanced Activities */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock size={16} className="text-indigo-500" />
                          <span className="text-sm font-semibold text-gray-700">
                            Top Activities
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {pkg.activities.slice(0, 4).map((activity, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm rounded-full font-medium border border-blue-100 hover:from-blue-100 hover:to-indigo-100 transition-all"
                            >
                              {activity}
                            </span>
                          ))}
                          {pkg.activities.length > 4 && (
                            <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full font-medium">
                              +{pkg.activities.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Book Button */}
                    <button
                      onClick={() => navigate(`/detail-page/${pkg.id}`)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl flex items-center justify-center gap-3 font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    >
                      <span>Book This Adventure</span>
                      <ArrowRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Enhanced Empty State
          <div className="text-center py-20">
            <div className="bg-white p-10 rounded-3xl shadow-xl inline-block max-w-md mx-auto border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="text-blue-500" size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                No Packages Found
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We couldn't find any travel packages for{" "}
                <span className="font-semibold">{state}</span>.
                <br />
                Don't worry, we're constantly adding new destinations!
              </p>
              <button
                onClick={() => navigate(-1)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
              >
                Explore Other Destinations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationDetailPage;
