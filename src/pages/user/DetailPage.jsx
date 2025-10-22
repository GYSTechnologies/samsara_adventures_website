import React, { useState, useEffect, useCallback, useMemo } from "react";
import { MapPin, Heart } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import Loader from "../../components/Loader.jsx";

// Split components (do not re-declare)
import ImageGallery from "./Detailspage/ImageGallery.jsx";
import TabNavigation from "./Detailspage/TabNavigation.jsx";
import ItinerarySection from "./Detailspage/ItinerarySection.jsx";
import ContactInfoForm from "./Detailspage/ContactInfoForm.jsx";
import InclusionsSection from "./Detailspage/InclusionsSection.jsx";

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

/* Validators */
const isEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || "").trim());

const isPhone = (v) =>
  /^[0-9]{7,15}$/.test(String(v || "").trim().replace(/\D/g, ""));

const validateForm = (data) => {
  const next = { fullName: "", email: "", phone: "" };

  if (!String(data.fullName || "").trim())
    next.fullName = "Full name is required";

  if (!String(data.email || "").trim()) next.email = "Email is required";
  else if (!isEmail(data.email)) next.email = "Enter a valid email";

  if (!String(data.phone || "").trim()) next.phone = "Phone is required";
  else if (!isPhone(data.phone))
    next.phone = "Enter a valid phone number (7-15 digits)";

  const totalGuests = (data.adults || 0) + (data.children || 0);
  if ((data.adults || 0) < 1) next.fullName ||= "At least 1 adult is required";
  if (totalGuests < 1) next.fullName ||= "Add at least one traveler";

  return {
    valid: !next.fullName && !next.email && !next.phone,
    errors: next,
  };
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

  // Hooks at top
  const [expandedDay, setExpandedDay] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // Form state
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

  // Tabs
  const tabs = useMemo(
    () => [
      { id: "description", label: "Description" },
      { id: "itinerary", label: "Itinerary" },
      { id: "inclusions", label: "Inclusions" },
      { id: "exclusions", label: "Exclusions" },
    ],
    []
  );

  // Fetch trip
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

      if (Array.isArray(trip.tags)) {
        trip.tags = trip.tags;
      } else if (
        typeof trip.tags === "string" &&
        trip.tags.trim().startsWith("[")
      ) {
        try {
          trip.tags = JSON.parse(trip.tags);
        } catch {
          trip.tags = [trip.tags];
        }
      } else {
        trip.tags = [];
      }

      setTripData(trip);
      setIsFavorite(!!trip.isFavorite);
      // Pre-fill form email/name when available
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

  // Handlers
  const toggleDay = (dayNumber) =>
    setExpandedDay((prev) => (prev === dayNumber ? null : dayNumber));

  const handleFormChange = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
    // live validation reset on typing
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const handleCounterChange = (type, op) =>
    setFormData((p) => ({
      ...p,
      [type]: Math.max(
        type === "adults" ? 1 : 0,
        op === "increment" ? p[type] + 1 : p[type] - 1
      ),
    }));

  const toggleFavorite = async () => {
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
  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    toast.info("Please login to continue booking");
    // Save current trip details to navigate back after login
    navigate("/login", {
      state: {
        from: `/details/${tripId}`,
        bookingData: { ...formData, tripId },
        tripDetails: tripData,
      },
    });
    return;
  }


  // Navigate to payment
  navigate(`/payment/${tripId}`, {
    state: { bookingData: { ...formData, tripId }, tripDetails: tripData },
  });
};

  // VALIDATED submit
  // const handleSubmit = () => {

  //   navigate(`/payment/${tripId}`, {
  //     state: { bookingData: { ...formData, tripId }, tripDetails: tripData },
  //   });
  // };

  // Derived
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchTripDetails} />;
  if (!tripData) return null;

  const price = formatINR(tripData?.payment?.grandTotal);
  const dateRange = formatRange(tripData?.startDate, tripData?.endDate);

  const ctaDisabled =
    !formData.fullName?.trim() ||
    !isEmail(formData.email) ||
    !isPhone(formData.phone) ||
    (formData.adults || 0) < 1;

  return (
    <div className="min-h-screen bg-[#f0f2d9]">
      {/* Desktop */}
      <div className="hidden md:block pt-20 max-w-6xl mx-auto pb-6">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-6">
          <div className="relative">
            <ImageGallery images={tripData.images} title={tripData.title} />
            {tripData?.duration ? (
              <div className="absolute top-6 left-6 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {tripData.duration}
              </div>
            ) : null}
            <div className="absolute top-6 right-6 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {price}
            </div>
          </div>
  
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {tripData.title}
                </h1>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">{tripData.state}</span>
                </div>
                {dateRange && (
                  <div className="text-sm text-gray-500">{dateRange}</div>
                )}
              </div>
              <button
                onClick={toggleFavorite}
                className="p-2 rounded-full bg-white hover:bg-gray-100 shadow-md"
              >
                <Heart
                  size={20}
                  className={
                    isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                  }
                />
              </button>
            </div>
          </div>
           <div className="flex justify-end items-end bg-white border-t border-gray-200 p-4">
          <button
            onClick={handleSubmit}
            className="w-[150px]  bg-lime-700 hover:bg-lime-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Book Now
          </button>
        </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={tabs}
            />

            {activeTab === "description" && (
              <div className="bg-white p-6">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
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

          {/* <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ContactInfoForm
                formData={formData}
                onFormChange={handleFormChange}
                onCounterChange={handleCounterChange}
                onSubmit={handleSubmit}
                loading={false}
                tripData={tripData}
                errors={errors}
              />
            </div>
          </div> */}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden max-w-6xl mx-auto pb-20">
        <div className="relative">
          <ImageGallery images={tripData.images} title={tripData.title} />
          <div className="absolute top-6 right-6 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {price} / {tripData.duration}
          </div>
       
        </div>

        <div className="bg-white mt-4 rounded-t-3xl">
          <div className="px-6 py-4">
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              {tripData.title}
            </h1>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-gray-600">{tripData.state}</span>
            </div>
            {dateRange && (
              <div className="text-xs text-gray-500">{dateRange}</div>
            )}
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

        {/* Fixed CTA with disabled guard */}
        <div className="fixed bottom-18 left-0 right-0 bg-white border-t border-gray-200 p-4 z-30">
          <button
            onClick={handleSubmit}
            className="w-full bg-lime-700 hover:bg-lime-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
