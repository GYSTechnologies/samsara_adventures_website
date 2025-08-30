import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Users,
  Plane,
  Car,
  Camera,
  Utensils,
  X,
  Heart,
  Star,
  Home,
  Wifi,
  Coffee,
  Sun,
  Umbrella,
  Activity,
  Mail,
  User,
  Clock,
  CalendarDays,
  Check,
} from "lucide-react";
import {
  useParams,
  useNavigate,
  useLocation,
  useNavigation,
} from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import AddOnServices from "../../components/user/AddOnServices.jsx";
import Loader from "../../components/Loader.jsx";
const LoadingState = () => <Loader />;

const ErrorState = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto">
      <div className="text-red-500 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
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

// const navigate = useNavigation();

const LoginModal = ({ onClose, onLogin, onSignup }) => (
  <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Sign In Required
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          You need to sign in to continue with your booking.
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={onLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onSignup}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  </div>
  // navigate('/login')
);

const RequestStatusCart = ({ status, onContinue, loading, onViewPlans }) => (
  <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm mb-6">
    <div className="flex flex-col items-center text-center">
      {status === "PENDING" ? (
        <>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Request Submitted!
          </h3>
          <p className="text-gray-600 mb-4">
            Our team will contact you within 24 hours
          </p>
        </>
      ) : status === "APPROVED" ? (
        <>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Your Trip Is Ready!
          </h3>
          <p className="text-gray-600 mb-4">
            Continue to complete your booking
          </p>
          <button
            onClick={onContinue}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {loading ? "Processing..." : "Continue to Payment"}
          </button>
        </>
      ) : (
        // PAID/CONFIRMED status
        <>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Payment Completed!
          </h3>
          <p className="text-gray-600 mb-4">
            Your trip is confirmed. View your plans or continue browsing.
          </p>
          <button
            onClick={onViewPlans}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            View My Plans
          </button>
        </>
      )}
    </div>
  </div>
);

const DetailPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [expandedDay, setExpandedDay] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [apiStatus, setApiStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const [formData, setFormData] = useState({
    travelOption: "scheduled",
    startDate: "",
    phone: "",
    adults: 2,
    children: 0,
    pickupLocation: "",
    specialRequests: "",
    fullName: "",
    email: "",
  });

  const [selectedServices, setSelectedServices] = useState([]);

  const [selectedAddons, setSelectedAddons] = useState([]);
  const [requestStatus, setRequestStatus] = useState(null);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [showRequestCart, setShowRequestCart] = useState(false);

  const fetchTripDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/api/trip/getTripDetailsById`, {
        params: { tripId, email: user?.email },
      });

      if (response.data?.trip) {
        const trip = response.data.trip;
        setTripData(trip);
        setIsFavorite(trip.isFavorite || false);

        setFormData((prev) => ({
          ...prev,
          pickupLocation: trip.pickupDropLocation || "",
          email: user?.email || "",
          fullName: user?.name || "",
          startDate: trip.startDate || "",
        }));
      } else {
        setError("Trip not found");
      }
    } catch (err) {
      console.error("Error fetching trip details:", err);
      setError(err.response?.data?.message || "Failed to load trip details");
    } finally {
      setLoading(false);
    }
  }, [tripId, user]);

  useEffect(() => {
    fetchTripDetails();
  }, [fetchTripDetails]);

  const toggleDay = (dayNumber) => {
    setExpandedDay(expandedDay === dayNumber ? null : dayNumber);
  };

  const checkRequestStatus = useCallback(
    async (email) => {
      if (!isAuthenticated || tripData?.tripType !== "CUSTOMIZED") return;

      try {
        setApiStatus({ loading: true, error: null, success: false });
        const response = await axiosInstance.get(
          "/api/custom-trip/check-request-status",
          { params: { email, tripId } }
        );

        setRequestStatus(response.data.status);
        setIsFormDisabled(response.data.status !== "NEW_USER");
        setShowRequestCart(response.data.status !== "NEW_USER");

        if (response.data.status === "APPROVED") {
          setTripData((prev) => ({
            ...prev,
            enquiryId: response.data.enquiryId,
          }));
        }

        setApiStatus({ loading: false, error: null, success: true });
      } catch (error) {
        console.error("Error checking request status:", error);
        setApiStatus({
          loading: false,
          error: error.response?.data?.message || "Failed to check status",
          success: false,
        });
      }
    },
    [tripId, isAuthenticated, tripData?.tripType, user]
  );

  // Add this function for viewing plans
  const handleViewPlans = () => {
    navigate("/profile");
  };
  useEffect(() => {
    if (tripData?.tripType !== "CUSTOMIZED") return;

    const timer = setTimeout(() => {
      checkRequestStatus(formData.email);
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.email, tripData?.tripType]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(
        "tripFormData",
        JSON.stringify({
          formData,
          selectedAddons,
          tripId,
        })
      );
    }
  }, [formData, selectedAddons, isAuthenticated, tripId]);

  useEffect(() => {
    if (isAuthenticated && location.state?.preserveForm) {
      const savedData = localStorage.getItem("tripFormData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);

        if (parsedData.tripId === tripId) {
          setFormData(parsedData.formData);
          setSelectedAddons(parsedData.selectedAddons);
          toast.success("Your form data has been restored");
        }

        localStorage.removeItem("tripFormData");

        navigate(location.pathname, {
          replace: true,
          state: { ...location.state, preserveForm: undefined },
        });
      }
    }
  }, [isAuthenticated, tripId, location, navigate]);

  const handleAuthAction = useCallback(
    (action) => {
      if (!isAuthenticated) {
        localStorage.setItem(
          "tripFormData",
          JSON.stringify({
            formData,
            selectedAddons,
            tripId,
          })
        );

        setShowLoginModal(true);
        return false;
      }
      return true;
    },
    [formData, selectedAddons, tripId, isAuthenticated]
  );

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCounterChange = (type, operation) => {
    setFormData((prev) => ({
      ...prev,
      [type]: Math.max(
        0,
        operation === "increment" ? prev[type] + 1 : prev[type] - 1
      ),
    }));
  };

  const toggleFavorite = async () => {
    if (!handleAuthAction()) return;

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
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setIsFavorite(!isFavorite);
      toast.error("Failed to update favorite status");
    }
  };

  const handleSubmit = async () => {
    if (!handleAuthAction()) return;

    const bookingData = {
      tripId,
      userId: user._id,
      ...formData,
      selectedAddons: selectedServices,
      itinerary: tripData.itinerary || [],
      paymentDetails: tripData.payment,
      timestamp: new Date().toISOString(),
      startDate: formData.startDate || tripData.startDate,
      endDate: tripData.endDate,
      pickupLocation: tripData.pickupDropLocation,
      tripType: tripData.tripType,
      duration: tripData.duration,
      image: tripData.images[0],
      title: tripData.title,

      // ✅ CUSTOM TRIP SPECIFIC FIELDS
      ...(tripData.tripType === "CUSTOMIZED" && {
        isCustomTrip: true,
        customItinerary: tripData.itinerary,
        originalTripId: tripData.originalTripId || tripId,
        specialRequests: formData.specialRequests,
        enquiryId: tripData.enquiryId, // ✅ Pass enquiryId
        addOnServices: selectedServices.map((service) => service.title),
        travelWithPet: selectedServices.some(
          (s) => s.title === "Pet Allowance"
        ),
        photographer: selectedServices.some((s) => s.title === "Photographer"),
        translator: selectedServices.some((s) => s.title === "Translator"),
      }),
    };

    navigate(`/payment/${tripId}`, {
      state: {
        bookingData,
        tripDetails: tripData,
        isCustomTrip: tripData.tripType === "CUSTOMIZED",
      },
    });
  };

  const submitCustomRequest = async () => {
    if (!handleAuthAction()) return;

    setApiStatus({ loading: true, error: null, success: false });

    try {
      // Prepare payload according to backend expectations
      const payload = {
        tripId,
        email: formData.email,
        phone: formData.phone,
        adults: formData.adults,
        childrens: formData.children, // Note: backend expects "childrens" (with 's')
        current_location: formData.pickupLocation,
        specialRequests: formData.specialRequests,

        // Boolean fields (must be true/false, not strings)
        travelWithPet: selectedServices.some(
          (s) => s.title === "Pet Allowance"
        ),
        decoration: selectedServices.some((s) => s.title === "Decoration"),
        photographer: selectedServices.some((s) => s.title === "Photographer"),
        translator: selectedServices.some((s) => s.title === "Translator"),

        // Additional required fields for backend
        fullName: user?.name || "",
        startDate: formData.startDate || tripData.startDate,
        tripType: "CUSTOMIZED",

        // Optional fields with defaults
        iteneraryChanges: formData.specialRequests || "Not provided",
        title: tripData.title || "",
        endDate: tripData.endDate || "",
        image: tripData.images?.[0] || "",
        duration: tripData.duration || "",
      };

      // For custom dates, calculate end date
      if (formData.travelOption === "custom" && formData.startDate) {
        payload.startDate = formData.startDate;
        payload.endDate = calculateEndDate(
          formData.startDate,
          tripData.duration
        );
      }

      // Send request to correct endpoint
      await axiosInstance.post(
        "/api/custom-trip/submit-custom-request",
        payload
      );

      setIsFormDisabled(true);
      setShowRequestCart(true);
      setRequestStatus("PENDING");
      setApiStatus({ loading: false, error: null, success: true });
      toast.success("Trip request submitted successfully!");
    } catch (error) {
      console.error("Error submitting custom request:", error);
      setApiStatus({
        loading: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to submit request",
        success: false,
      });
      toast.error(
        error.response?.data?.error || "Failed to submit trip request"
      );
    }
  };

  const totalTravelers = formData.adults + formData.children;
  const maxReached = tripData
    ? totalTravelers >= tripData.availableSeats
    : false;

  // Helper function to calculate end date based on duration
  const calculateEndDate = (startDate, duration) => {
    const days = parseInt(duration.split(" ")[0]); // Extract "7" from "7 Days 6 Nights"
    const result = new Date(startDate);
    result.setDate(result.getDate() + days - 1); // Subtract 1 to include start day
    return result.toISOString().split("T")[0];
  };
  const getInclusionIcon = (inclusion) => {
    const iconMap = {
      Accommodation: <Home size={18} className="text-green-600" />,
      Breakfast: <Coffee size={18} className="text-green-600" />,
      "Houseboat Stay": <Umbrella size={18} className="text-green-600" />,
      Driver: <Car size={18} className="text-green-600" />,
      Wifi: <Wifi size={18} className="text-green-600" />,
      Activities: <Activity size={18} className="text-green-600" />,
    };
    return iconMap[inclusion] || <Star size={18} className="text-green-600" />;
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchTripDetails} />;
  if (!tripData) return null;
  if (showLoginModal) {
    return (
      <LoginModal
        onClose={() => setShowLoginModal(false)}
        onLogin={() => {
          setShowLoginModal(false);
          navigate("/login", {
            state: {
              from: {
                pathname: `/trip/${tripId}`,
                state: { preserveForm: true },
              },
            },
          });
        }}
        onSignup={() => {
          setShowLoginModal(false);
          navigate("/signup", {
            state: {
              from: {
                pathname: `/trip/${tripId}`,
                state: { preserveForm: true },
              },
            },
          });
        }}
      />
    );
  }
  const renderBookingForm = () => {
    if (tripData.tripType === "CUSTOMIZED") {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Let's get you set up
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            It should take a couple of minutes to plan your dream trip
          </p>

          {showRequestCart || isFormDisabled ? (
            <RequestStatusCart
              status={requestStatus}
              onContinue={handleSubmit}
              loading={apiStatus.loading}
              onViewPlans={handleViewPlans}
            />
          ) : (
            <div className="space-y-5">
              {/* Travel Options Section */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Travel Options
                </label>
                <div className="space-y-2">
                  {[
                    { value: "scheduled", label: "Join Scheduled Tour" },
                    { value: "custom", label: "Request Custom Dates" },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="batch"
                        value={option.value}
                        checked={formData.travelOption === option.value}
                        onChange={(e) =>
                          handleFormChange("travelOption", e.target.value)
                        }
                        className="w-4 h-4 text-blue-600"
                        disabled={isFormDisabled}
                      />
                      <span className="text-sm text-gray-700">
                        {option.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conditionally render Start Date ONLY for Custom Dates */}
              {formData.travelOption === "custom" && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Preferred Start Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.startDate}
                    onChange={(e) =>
                      handleFormChange("startDate", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    disabled={isFormDisabled}
                    required={formData.travelOption === "custom"} // Only required for custom
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  value={formData.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                  disabled={isFormDisabled || apiStatus.loading}
                />
                {apiStatus.loading && (
                  <p className="text-xs text-gray-500 mt-1">
                    Checking request status...
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                  disabled={isFormDisabled}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Travelers
                </label>
                <div className="space-y-3">
                  {[
                    { type: "adults", label: "Adults", subLabel: "Age 12+" },
                    {
                      type: "children",
                      label: "Children",
                      subLabel: "Age 2-11",
                    },
                  ].map(({ type, label, subLabel }) => (
                    <div
                      key={type}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <span className="text-sm text-gray-700 font-medium">
                          {label}
                        </span>
                        <span className="block text-xs text-gray-500">
                          {subLabel}
                        </span>
                      </div>
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          type="button"
                          onClick={() => handleCounterChange(type, "decrement")}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                          disabled={isFormDisabled || formData[type] <= 0}
                        >
                          -
                        </button>
                        <span className="px-4 py-2 text-sm font-medium">
                          {formData[type]}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCounterChange(type, "increment")}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                          disabled={isFormDisabled}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Pickup Location
                </label>
                <input
                  type="text"
                  value={tripData.pickupDropLocation || "Not specified"}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Special Requests
                </label>
                <textarea
                  placeholder="Any dietary restrictions, accessibility needs, etc."
                  rows={3}
                  value={formData.specialRequests}
                  onChange={(e) =>
                    handleFormChange("specialRequests", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  disabled={isFormDisabled}
                />
              </div>

              <button
                onClick={submitCustomRequest}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md mt-6 transition-colors disabled:opacity-70"
                disabled={
                  isFormDisabled ||
                  apiStatus.loading ||
                  !formData.email ||
                  !formData.phone
                }
              >
                {apiStatus.loading
                  ? "Processing..."
                  : isFormDisabled
                  ? "Request Submitted"
                  : "Plan My Trip"}
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Contact Information
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            We'll use this to contact you about your booking
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleFormChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Pickup Location
              </label>
              <input
                type="text"
                value={tripData.pickupDropLocation || "Not specified"}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Travelers
              </label>
              <div className="flex justify-between">
                {[
                  { type: "adults", label: "Adults", subLabel: "Age 13+" },
                  {
                    type: "children",
                    label: "Children",
                    subLabel: "Ages 2-12",
                  },
                ].map(({ type, label, subLabel }) => (
                  <div key={type} className="text-center">
                    <p className="font-semibold text-sm">{label}</p>
                    <p className="text-xs text-gray-500 mb-2">{subLabel}</p>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => handleCounterChange(type, "decrement")}
                        className="w-8 h-8 bg-gray-200 rounded-full text-lg flex items-center justify-center disabled:opacity-50"
                        disabled={formData[type] <= 0}
                      >
                        −
                      </button>
                      <span className="mx-3">{formData[type]}</span>
                      <button
                        type="button"
                        onClick={() => handleCounterChange(type, "increment")}
                        className="w-8 h-8 bg-gray-200 rounded-full text-lg flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Show Available Seats Info */}
          {tripData.availableSeats <= 5 && tripData.availableSeats > 0 && (
            <p className="text-sm text-red-600 font-medium mb-2">
              Hurry! Only {tripData.availableSeats} seats left
            </p>
          )}
          {tripData.availableSeats === 0 && (
            <p className="text-sm text-gray-500 font-medium mb-2">
              Sold Out — No seats available
            </p>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md mt-2 transition-colors disabled:opacity-70"
            disabled={
              !formData.email ||
              !formData.phone ||
              tripData.availableSeats === 0 ||
              maxReached
            }
          >
            {tripData.availableSeats === 0 ? "Sold Out" : "Book Now"}
          </button>

          {/* 
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md mt-6 transition-colors disabled:opacity-70"
            disabled={!formData.email || !formData.phone}
          >
            Book Now
          </button> */}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="max-w-7xl mx-auto ">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Image Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1 p-2">
            {tripData.images?.map((image, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-lg ${
                  index === 0
                    ? "col-span-2 md:row-span-2" // First image bada
                    : "col-span-1"
                }`}
              >
                <img
                  src={image}
                  alt={`${tripData.title} ${index + 1}`}
                  className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${
                    index === 0 ? "h-48 md:h-[23rem]" : "h-24 md:h-45"
                  }`}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>

          {/* Details Section */}
          <div className="px-4 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight flex items-center gap-2">
                  {tripData.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">
                      {tripData.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">
                      {tripData.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">
                      {new Date(tripData.startDate).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}{" "}
                      -{" "}
                      {new Date(tripData.endDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trip Type + Favorite Icon */}
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={toggleFavorite}
                  className="p-2 rounded-full bg-white hover:bg-gray-100 shadow-md transition-all duration-200"
                  aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
                >
                  <Heart
                    size={20}
                    className={
                      isFavorite
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600 hover:text-red-500"
                    }
                  />
                </button>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1 rounded-full shadow-md">
                  <span className="text-white font-medium text-sm">
                    {tripData.tripType}
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="mt-4 flex items-center gap-4">
              <div className="text-2xl font-bold text-gray-900">
                ₹{tripData.payment?.grandTotal?.toLocaleString()}
              </div>
              {tripData.payment?.actualPrice && (
                <>
                  <div className="text-lg text-gray-500 line-through">
                    ₹{tripData.payment.actualPrice.toLocaleString()}
                  </div>
                  <div className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    {Math.round(
                      100 -
                        (tripData.payment.grandTotal /
                          tripData.payment.actualPrice) *
                          100
                    )}
                    % OFF
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 py-5">
          {/* Left Side - Content */}
          <div className="flex-1 space-y-6">
            {/* About Tour */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                About This Tour
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {tripData.description}
              </p>
            </div>

            {/* Activities */}
            {tripData.activities?.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Activities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tripData.activities.map((activity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {tripData.itinerary?.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Detailed Itinerary
                </h3>
                <div className="space-y-3">
                  {tripData.itinerary.map((day) => (
                    <div
                      key={day.dayNumber}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleDay(day.dayNumber)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                        aria-expanded={expandedDay === day.dayNumber}
                        aria-controls={`day-${day.dayNumber}-content`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {day.dayNumber}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">
                              Day {day.dayNumber}
                            </span>
                            <p className="text-sm text-gray-600">{day.title}</p>
                          </div>
                        </div>
                        {expandedDay === day.dayNumber ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>

                      {expandedDay === day.dayNumber && (
                        <div
                          id={`day-${day.dayNumber}-content`}
                          className="px-4 pb-4 border-t border-gray-100 bg-gray-50"
                        >
                          <h4 className="font-medium text-gray-900 mb-2 mt-3">
                            {day.title}
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed mb-3">
                            {day.description}
                          </p>
                          {day.points?.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium text-gray-700">
                                Highlights:
                              </h5>
                              <ul className="space-y-1">
                                {day.points.map((point, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2"
                                  >
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-600 text-sm">
                                      {point}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Inclusions & Exclusions - Side by Side */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* What's Included */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">
                    What's Included
                  </h4>
                  <div className="space-y-3">
                    {tripData.inclusions?.map((inclusion, index) => (
                      <div key={index} className="flex items-center gap-3">
                        {getInclusionIcon(inclusion)}
                        <span className="text-sm text-gray-700">
                          {inclusion}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What's Not Included */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">
                    What's Not Included
                  </h4>
                  <div className="space-y-3">
                    {tripData.exclusions?.map((exclusion, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <X className="w-5 h-5 text-red-600" />
                        <span className="text-sm text-gray-700">
                          {exclusion}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Notes */}
              <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-4 rounded-md mt-6">
                <p>• Confirmation will be received at time of booking</p>
                <p>• Most travelers can participate</p>
                <p>
                  • Cancellation policy: Full refund if canceled at least 7 days
                  in advance
                </p>
              </div>
            </div>

            {/* Add this conditional rendering */}
            {tripData?.tripType === "CUSTOMIZED" && (
              <AddOnServices onAddOnSelect={setSelectedServices} />
            )}
          </div>

          {/* Right Side - Only Booking Card remains */}
          <div className="lg:w-100">
            <div className="sticky top-20 space-y-6">{renderBookingForm()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
