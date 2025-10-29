import React, { useState, useEffect, useMemo } from "react";
import { Heart, MapPin, Calendar, Grid, List } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import Loader from "../../components/Loader.jsx";

/* ========== Helpers ========== */
const rupee = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

/* ========== In-file UI pieces ========== */
const TagPill = ({ label }) => (
  <div
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-sm ${
      label === "Group Trip"
        ? "bg-lime-50 text-lime-700 border border-lime-100"
        : "bg-yellow-50 text-yellow-700 border border-yellow-100"
    }`}
  >
    {label === "Group Trip" ? (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
        fill="currentColor" className="w-3.5 h-3.5">
        <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm-7 9a7 7 0 1 1 14 0Z" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
        fill="currentColor" className="w-3.5 h-3.5">
        <path d="M6 2a1 1 0 0 0-1 1v2h14V3a1 1 0 0 0-1-1Zm13 5H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1Z" />
      </svg>
    )}
    {label}
  </div>
);

const PackageCard = ({ pkg, liked, onLike, onOpen }) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden cursor-pointer"
      onClick={onOpen}
    >
      <div className="relative">
        <img src={pkg.image} alt={pkg.title} className="w-full h-48 sm:h-56 object-cover" />
        <div className="absolute top-3 left-3 mb-2">
          <TagPill label={pkg.tag} />
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onLike(pkg.id); }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-md"
          aria-label="Toggle favorite"
        >
          <Heart className={`w-4.5 h-4.5 ${liked ? "fill-rose-500 text-rose-500" : "text-gray-700"}`} />
        </button>
      </div>

      <div className="px-4 py-2">
        <h3 className="text-base sm:text-lg font-bold text-lime-900 leading-snug mb-1 line-clamp-2">
          {pkg.title}
        </h3>
        <p className="text-[14px] text-lime-900 mb-1">
          {pkg.highlights?.slice(0, 2).join(" • ") || "Includes curated experiences"}
        </p>
        <p className="text-[14px] text-lime-900 mb-2">{pkg.duration}</p>
      </div>

      <div className="text-[15px] px-4 py-1 bg-lime-800 text-gray-100">
        From <span className="font-semibold">{rupee(pkg.price)}</span>{" "}
        <span className="text-gray-100">per person</span>
      </div>
    </div>
  );
};

/* ========== Page Component ========== */
const DestinationDetailPage = () => {
  const [likedPackages, setLikedPackages] = useState(new Set());
  const [tourPackages, setTourPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [destinationInfo, setDestinationInfo] = useState(null);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  const { state, category } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Parse URL query params
  const urlParams = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    const get = (k) => {
      const v = sp.get(k);
      return v === null || v === "" ? undefined : v;
    };
    const parsed = {
      page: Number(get("page")) || 1,
      limit: Number(get("limit")) || 10,
      state: get("state"),
      email: get("email"),
      isSessional: (() => {
        const v = get("isSessional");
        if (!v) return undefined;
        const s = v.toLowerCase();
        return s === "true" ? true : s === "false" ? false : undefined;
      })(),
      tripType: get("tripType"),
      category: get("category"),
      minPrice: get("minPrice") ? Number(get("minPrice")) : undefined,
      maxPrice: get("maxPrice") ? Number(get("maxPrice")) : undefined,
    };
    return parsed;
  }, [location.search]);

  // Fetch packages data
  const fetchDestinationData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build effective params: URL first, then component overrides
      const params = {
        ...urlParams,
        ...(category && category !== "all" ? { category } : {}),
        ...(state && state !== "all" ? { state } : {}),
        ...(user?.email ? { email: user.email } : {}),
      };

      // Remove undefined/empty so they don't pollute the query string
      Object.keys(params).forEach((k) => {
        if (params[k] === undefined || params[k] === null || params[k] === "") {
          delete params[k];
        }
      });

      const response = await axiosInstance.get("/api/trip/getTripsByState", { params });

      if (response.data?.trips?.length) {
        const transformedPackages = response.data.trips.map((trip, idx) => ({
          id: trip.tripId ?? `${trip.title || "trip"}-${idx}`,
          title: trip.title,
          duration: trip.duration || "Custom duration",
          price: trip.subTotal || trip.actualPrice || 0,
          image:
            trip.image ||
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
          tag: trip.tripType === "CUSTOMIZED" ? "Plan Your trip" : "Group Trip",
          activities: trip.activities || [],
          highlights: trip.activities || [],
          isFavorite: trip.isFavorite || false,
        }));

        setTourPackages(transformedPackages);

        const initialLiked = new Set(
          transformedPackages.filter((p) => p.isFavorite).map((p) => p.id)
        );
        setLikedPackages(initialLiked);

        const resolvedState = params.state || state || "Destination";
        setDestinationInfo({
          title: `Explore ${resolvedState}`,
          subtitle: `Discover amazing destinations and create unforgettable memories in ${resolvedState} with our carefully curated tour packages.`,
          location: `${resolvedState}, India`,
          packagesCount: transformedPackages.length,
        });
      } else {
        setTourPackages([]);
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
    // re-fetch when URL params or user/state override changes
  }, [
    urlParams.page,
    urlParams.limit,
    urlParams.category,
    urlParams.state,
    urlParams.email,
    urlParams.isSessional,
    urlParams.tripType,
    urlParams.category,
    urlParams.minPrice,
    urlParams.maxPrice,
    state,
    user?.email,
  ]);

  const toggleLike = async (id) => {
    if (!user) {
      toast.info("Please login to save favorites");
      navigate("/login");
      return;
    }

    // optimistic update with revert on failure
    const prev = new Set(likedPackages);
    const next = new Set(prev);
    const wasLiked = next.has(id);
    if (wasLiked) next.delete(id);
    else next.add(id);
    setLikedPackages(next);

    try {
      await axiosInstance.post("/api/user/toggleFavorite", {
        tripId: id,
        email: user.email,
        isFavorite: !wasLiked,
      });
      // Optional: refresh to stay in sync with server
      await fetchDestinationData();
      toast.success(wasLiked ? "Removed from favorites" : "Added to favorites!");
    } catch (err) {
      console.error("Error toggling favorite:", err);
      setLikedPackages(prev); // revert
      toast.error("Failed to update favorite");
    }
  };

  const getHeaderBg = () =>
    "relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden";

  /* ========== Render ========== */
  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#eff5d2] flex items-center justify-center p-4">
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
    <div className="py-14 md:py-0   bg-[#eff5d2]">
      {/* Header */}
      <div className={getHeaderBg()}>
        {/* Backgrounds and header content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="flex items-center gap-2 mb-6 lg:mb-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20">
              <MapPin size={16} className="text-blue-300" />
              <span className="text-sm font-semibold">
                {destinationInfo?.location}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                {destinationInfo?.title}
              </h1>

              <p className="hidden lg:block text-blue-100 text-lg xl:text-xl max-w-4xl leading-relaxed drop-shadow-sm">
                {destinationInfo?.subtitle}
              </p>

              <div className="flex items-center pt-2">
                <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-md border border-white/20 px-5 py-3 rounded-full">
                  <Calendar className="text-blue-300" size={18} />
                  <span className="text-sm font-bold text-white">
                    {destinationInfo?.packagesCount} Packages Available
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center lg:justify-end">
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

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/5 to-transparent" />
      </div>

      {/* Packages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {tourPackages.length > 0 ? (
          <>
            <div className="mb-8">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {tourPackages.length}
                </span>{" "}
                amazing packages
              </p>
            </div>

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
                  : "space-y-6"
              }
            >
              {tourPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={viewMode === "list" ? "max-w-2xl mx-auto" : ""}
                >
                  <PackageCard
                    pkg={pkg}
                    liked={likedPackages.has(pkg.id)}
                    onLike={toggleLike}
                    onOpen={() => navigate(`/detail-page/${pkg.id}`)}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          // Empty state
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
