import React, { useState, useEffect } from "react";
import {
  Heart,
  Users,
  ArrowRight,
  Clock,
  Calendar,
  LayoutGrid as Grid,
  List,
  MapPin
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

const FavoritePage = () => {
  const [likedPackages, setLikedPackages] = useState(new Set());
  const [favoritePackages, setFavoritePackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const { user } = useAuth();
  const navigate = useNavigate();

  const limeBg = "bg-[#f0f2d9]"; // page bg
  const limePrimary = "bg-lime-700 hover:bg-lime-800";
  const limeBadge = "bg-lime-100 text-lime-800 border-lime-200";

  const fetchFavoriteData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        setError("Please login to view favorites");
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get("/api/user/getFavoriteTrips", {
        params: { email: user.email },
      });

      const trips = response.data?.trips || [];

      const transformed = trips.map((trip) => ({
        id: trip.tripId,
        title: trip.title,
        duration: trip.duration || "Custom duration",
        price:
          trip.price ??
          trip.payment?.subTotal ??
          trip.payment?.grandTotal ??
          trip.payment?.actualPrice ??
          0,
        image:
          trip.image ||
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=60",
        tag: (trip.tripType || "CUSTOMIZED") === "CUSTOMIZED" ? "Plan Your trip" : "Group Trip",
        activities: trip.activities || [],
        state: trip.state || "Unknown",
      }));

      setFavoritePackages(transformed);
      setLikedPackages(new Set(transformed.map((p) => p.id)));
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError("Failed to load favorites. Try again later.");
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const toggleLike = async (id) => {
    if (!user) {
      toast.info("Please login to manage favorites");
      navigate("/login");
      return;
    }

    try {
      const next = new Set(likedPackages);
      const isLiked = next.has(id);

      if (isLiked) {
        next.delete(id);
        setFavoritePackages((prev) => prev.filter((p) => p.id !== id));
      } else {
        next.add(id);
      }
      setLikedPackages(next);

      await axiosInstance.post("/api/user/toggleFavorite", {
        tripId: id,
        email: user.email,
        isFavorite: !isLiked,
      });

      toast.success(isLiked ? "Removed from favorites" : "Added to favorites!");
    } catch (err) {
      console.error("Error toggling favorite:", err);
      setLikedPackages(new Set(likedPackages));
      toast.error("Failed to update favorite");
      fetchFavoriteData();
    }
  };

  const getTagColors = (tag) =>
    ({
      "Group Trip": "bg-gradient-to-r from-lime-600 to-emerald-600",
      "Plan Your trip": "bg-gradient-to-r from-lime-500 to-lime-700",
    }[tag] || "bg-gradient-to-r from-gray-500 to-gray-600");

  if (loading) {
    return (
      <div className={`min-h-screen ${limeBg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-lime-200"></div>
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-lime-600 absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 text-lime-700 font-medium">Loading your favorite trips...</p>
        </div>
      </div>
    );
    }

  if (error) {
    return (
      <div className={`min-h-screen ${limeBg} flex items-center justify-center p-4`}>
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md border border-lime-200">
          <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-lime-700" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-lime-800 mb-6">{error}</p>
          {error === "Please login to view favorites" ? (
            <button
              onClick={() => navigate("/login")}
              className={`${limePrimary} text-white px-6 py-3 rounded-xl transition-all shadow-md`}
            >
              Login Now
            </button>
          ) : (
            <button
              onClick={fetchFavoriteData}
              className={`${limePrimary} text-white px-6 py-3 rounded-xl transition-all shadow-md`}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen mb-20 ${limeBg}`}>
      {/* Header */}
      <div className="border-b border-lime-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-22 sm:pt-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex-1 space-y-3">
              {/* <h1 className="text-3xl sm:text-4xl font-extrabold text-lime-900">Your Favorite Trips</h1> */}

              <div className="inline-flex items-center gap-3 bg-white border border-lime-200 px-4 py-2 rounded-full">
                <Heart className="text-lime-700" size={18} />
                <span className="text-sm font-bold text-lime-800">
                  {favoritePackages.length} Saved Packages
                </span>
              </div>
            </div>

            {/* View toggle */}
            {/* <div className="flex items-center justify-start lg:justify-end">
              <div className="flex items-center gap-2 bg-white border border-lime-200 p-2 rounded-2xl shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-xl transition-all ${
                    viewMode === "grid"
                      ? "bg-lime-700 text-white shadow"
                      : "text-lime-800 hover:bg-lime-100"
                  }`}
                >
                  <Grid size={18} />
                </button>
              <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-xl transition-all ${
                    viewMode === "list"
                      ? "bg-lime-700 text-white shadow"
                      : "text-lime-800 hover:bg-lime-100"
                  }`}
                >
                  <List size={18} />
                </button> 
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Packages */}
      <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {favoritePackages.length > 0 ? (
          <>
            {/* <div className="mb-6">
              <p className="text-lime-900">
                Showing <span className="font-semibold">{favoritePackages.length}</span> saved packages
              </p>
            </div> */}

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
                  : "space-y-6"
              }
            >
              {favoritePackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`group bg-white rounded-2xl shadow-md border border-lime-200 overflow-hidden hover:shadow-lg transition-all ${
                    viewMode === "list" ? "flex flex-col md:flex-row" : ""
                  }`}
                >
                  <div
                    className={`relative ${
                      viewMode === "list" ? "md:w-80 h-56 md:h-auto" : "h-52"
                    } overflow-hidden`}
                  >
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"></div>

                    <div
                      className={`absolute top-4 left-4 ${getTagColors(
                        pkg.tag
                      )} text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow`}
                    >
                      {pkg.tag === "Group Trip" ? <Users size={14} /> : <Calendar size={14} />}
                      {pkg.tag}
                    </div>

                    <button
                      onClick={() => toggleLike(pkg.id)}
                      className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-all shadow"
                      title="Remove favorite"
                    >
                      <Heart size={16} className="fill-lime-600 text-lime-700" />
                    </button>

                    <div className="absolute bottom-4 right-4 bg-white px-3 py-1.5 rounded-lg shadow text-lime-900 font-bold">
                      ₹{pkg.price.toLocaleString("en-IN")}
                    </div>

                    <div className="absolute bottom-4 left-4 bg-lime-700 text-white px-2.5 py-1 rounded-full text-xs font-medium">
                      {pkg.state}
                    </div>
                  </div>

                  <div
                    className={`p-5 ${
                      viewMode === "list" ? "flex-1 flex flex-col justify-between" : ""
                    }`}
                  >
                    <div>
                      <h3 className="font-bold text-lg mb-2 text-lime-900 group-hover:text-lime-700 transition-colors line-clamp-2">
                        {pkg.title}
                      </h3>

                      <div className="flex items-center gap-3 text-lime-900/80 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-lime-700" />
                          <span className="text-sm font-medium">{pkg.duration}</span>
                        </div>
                      </div>

                      {pkg.activities?.length > 0 && (
                        <div className="mb-5">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock size={16} className="text-lime-700" />
                            <span className="text-sm font-semibold text-lime-900">
                              Top Activities
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {pkg.activities.slice(0, 2).map((activity, i) => (
                              <span
                                key={i}
                                className="px-3 py-1.5 bg-lime-50 text-lime-800 text-xs rounded-full font-medium border border-lime-200"
                              >
                                {activity}
                              </span>
                            ))}
                            {pkg.activities.length > 2 && (
                              <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                                +{pkg.activities.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => navigate(`/detail-page/${pkg.id}`)}
                      className={`${limePrimary} text-white w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all`}
                    >
                      <span>Book This Adventure</span>
                      <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Empty state
          <div className="text-center py-20">
            <div className="bg-white p-10 rounded-3xl shadow-md inline-block max-w-md mx-auto border border-lime-200">
              <div className="w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-lime-700" size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-lime-900">No Favorites Yet</h3>
              <p className="text-lime-800/90 mb-8 leading-relaxed">
                You haven't saved any trips to your favorites.
                <br />
                Tap the heart on a trip to save it here!
              </p>
              <button
                onClick={() => navigate("/destinations")}
                className={`${limePrimary} text-white px-8 py-3 rounded-xl transition-all shadow`}
              >
                Explore Destinations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritePage;
