import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Shield,
  Clock,
  Info,
  ArrowLeft,
  Send,
  PawPrint,
  PartyPopper,
  Camera,
  Languages,
  Edit3,
  X,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import PaymentSuccessModal from "../../components/user/PaymentSuccessModal";

/* Simple modal for existing request status */
const StatusModal = ({ open, onClose, status, message, enquiryId, isPaid, onGoToPlans, onProceedAnyway }) => {
  const [tripId, setTripId] = useState(""); 
  
  useEffect(() => {
    // Extract trip ID from URL path like /payment/TRIP-916258-OB12RS
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      // Split by '/' and get the last segment
      const segments = pathname.split('/');
      const lastSegment = segments[segments.length - 1];
      
      // Check if it matches trip ID pattern (starts with TRIP-)
      if (lastSegment && lastSegment.startsWith('TRIP-')) {
        setTripId(lastSegment);
      }
    }
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center sm:items-center justify-center p-3">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-base font-semibold text-lime-900">Request already submitted</h3>
        </div>

        <div className="px-4 py-4 space-y-2">
          <p className="text-sm text-gray-600">
            Status: <span className="font-medium">{status || "PENDING"}</span>
          </p>
          {enquiryId && (
            <p className="text-sm text-gray-600">
              Enquiry ID: <span className="font-mono">{enquiryId}</span>
            </p>
          )}
          <p className="text-sm text-gray-700">{message}</p>
          {isPaid && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
              Payment is marked as completed for this request.
            </p>
          )}
        </div>

        {status === "APPROVED" && tripId && (
          <div className="px-4 pb-4">
            <a 
              className="block text-center px-4 py-2 bg-lime-700 hover:bg-lime-800 text-white text-sm font-semibold rounded-lg" 
              href={`/custom-itinerary-payment?trip=${tripId}`}
            >
              Pay Now 
            </a>
          </div>
        )}
      </div>
    </div>
  );
};


const CustomTripRequest = ({
  tripId,
  bookingData,
  tripDetails,
  customItineraryData,
  user,
  navigate,
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const [selectedBatch, setSelectedBatch] = useState("scheduled"); // "scheduled" | "custom"
  const [showDetails, setShowDetails] = useState(false);

  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [passengers, setPassengers] = useState([]);
  const [passengerErrors, setPassengerErrors] = useState([]);

  // Custom date (only start date)
  const [customStartDate, setCustomStartDate] = useState("");
  const [dateError, setDateError] = useState("");

  // Add-ons — Initialize only once on mount to prevent resets from props
  const [selectedAddOns, setSelectedAddOns] = useState({
    pet: false,
    decoration: false,
    photographer: false,
    translator: false,
  });

  // Itinerary changes
  const [itineraryChanges, setItineraryChanges] = useState("");

  // Existing request modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusPayload, setStatusPayload] = useState({
    status: "",
    message: "",
    enquiryId: "",
    isPaid: false,
  });
  const [allowSubmitAfterStatus, setAllowSubmitAfterStatus] = useState(false);

  const {
    adults: initialAdults = 1,
    children: initialChildren = 0,
    email,
    phone,
    fullName,
    enquiryId,
    specialRequests = "",
    addOnServices = {},
    currentLocation = "",
  } = bookingData || {};

  const {
    title,
    images,
    duration,
    payment: originalPayment,
    startDate,
    endDate,
    pickupDropLocation,
    itinerary: originalItinerary,
    state: tripState,
    category,
  } = tripDetails || {};

  const effectivePayment = customItineraryData?.payment || originalPayment;
  const effectiveItinerary = customItineraryData?.itinerary || originalItinerary;

  // Initial adults/children (runs on deps)
  useEffect(() => {
    setAdultsCount(initialAdults);
    setChildrenCount(initialChildren);
  }, [initialAdults, initialChildren]);

  // Initialize add-ons ONLY ONCE on component mount (empty deps) to prevent toggles from being reset by prop changes
  useEffect(() => {
    // Initialize add-ons from bookingData only if state is default (first render)
    if (Object.values(selectedAddOns).every(val => !val)) {
      if (Array.isArray(addOnServices)) {
        setSelectedAddOns({
          pet: addOnServices.includes("pet"),
          decoration: addOnServices.includes("decoration"),
          photographer: addOnServices.includes("photographer"),
          translator: addOnServices.includes("translator"),
        });
      } else if (addOnServices && typeof addOnServices === "object") {
        setSelectedAddOns({
          pet: !!addOnServices.pet,
          decoration: !!addOnServices.decoration,
          photographer: !!addOnServices.photographer,
          translator: !!addOnServices.translator,
        });
      }
    }
  }, []); // Empty deps: runs only once

  const totalTravelers = Math.max(1, adultsCount + childrenCount);

  useEffect(() => {
    const newPassengers = Array.from({ length: totalTravelers }, (_, i) => ({
      name: i === 0 ? (user?.name || fullName || "") : passengers[i]?.name || "",
      age: passengers[i]?.age || "",
    }));
    setPassengers(newPassengers);
    setPassengerErrors(newPassengers.map(() => ({ name: "", age: "" })));
  }, [totalTravelers, user?.name, fullName]); // Added deps for name init

  const setPassengerField = (index, field, value) => {
    setPassengers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    setPassengerErrors((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: "" };
      return copy;
    });
  };

  const validatePassengers = () => {
    const errs = passengers.map(({ name, age }) => {
      const e = { name: "", age: "" };
      if (!String(name || "").trim() || String(name || "").trim().length < 2) {
        e.name = "Enter a valid name (min 2 chars)";
      }
      const ageNum = Number(age);
      if (!Number.isFinite(ageNum) || ageNum < 0 || ageNum > 120) {
        e.age = "Enter a valid age (0–120)";
      }
      return e;
    });
    setPassengerErrors(errs);
    return errs.every((x) => !x.name && !x.age);
  };

  const validateCustomDate = () => {
    if (!customStartDate) {
      setDateError("Please select your preferred start date");
      return false;
    }
    const start = new Date(customStartDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) {
      setDateError("Start date cannot be in the past");
      return false;
    }
    setDateError("");
    return true;
  };

  // Price math
  const calculatePrices = () => {
    const totalPersons = adultsCount + childrenCount;
    const perPersonBase = effectivePayment?.subTotal || 0;
    const perPersonTax = effectivePayment?.taxation || 0;
    const perPersonInsurance = effectivePayment?.insurance || 0;
    const perPersonActivities = effectivePayment?.activities || 0;
    return {
      base: Math.round(perPersonBase * totalPersons),
      taxes: Math.round(perPersonTax * totalPersons),
      insurance: Math.round(perPersonInsurance * totalPersons),
      activities: Math.round(perPersonActivities * totalPersons),
      total: Math.round((effectivePayment?.grandTotal || 0) * totalPersons),
      perPersonPrice: Math.round(effectivePayment?.subTotal || 0),
    };
  };
  const { base, taxes, insurance, activities, total, perPersonPrice } = calculatePrices();

  const addOnOptions = [
    { id: "pet", label: "Bringing a pet?", icon: PawPrint },
    { id: "decoration", label: "Custom Decoration?", icon: PartyPopper },
    { id: "photographer", label: "Personal Photographer?", icon: Camera },
    { id: "translator", label: "Need a Translator?", icon: Languages },
  ];

  // Toggle function with console.log for debugging (remove in production)
  const toggleAddOn = (addOnId) => {
    console.log("Toggling add-on:", addOnId, "Current state:", selectedAddOns); // Debug log
    setSelectedAddOns((prev) => {
      const newState = { ...prev, [addOnId]: !prev[addOnId] };
      console.log("New state:", newState); // Debug log
      return newState;
    });
  };

  // Check status only when user selects custom dates
  const handleSelectBatch = async (batch) => {
    setSelectedBatch(batch);
    if (batch !== "custom") return;

    try {
      const qEmail = (user?.email || email || "").trim();
      if (!qEmail) return;
      setLoading(true);
      const res = await axiosInstance.get("/api/custom-trip/check-request-status", {
        params: { email: qEmail, tripId: String(tripId || "").trim() },
      });
      const { status, message, enquiryId, isPaid } = res.data || {};
      if (status && status !== "NEW_USER") {
        setStatusPayload({
          status,
          message: message || "You have an existing request for this trip.",
          enquiryId: enquiryId || "",
          isPaid: !!isPaid,
        });
        setStatusModalOpen(true);
        setAllowSubmitAfterStatus(false); // Block until user chooses
      } else {
        // NEW_USER — allow submit
        setAllowSubmitAfterStatus(true);
      }
    } catch (err) {
      console.error("Status check error:", err); // Allow proceed on error
      setAllowSubmitAfterStatus(true);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedAnyway = () => {
    setAllowSubmitAfterStatus(true);
    setStatusModalOpen(false);
  };

  const handleGoToPlans = () => {
    setStatusModalOpen(false);
    navigate("/profile", { state: { page: "plans" } });
  };

  const handleCustomDateRequest = async () => {
    if (!validatePassengers()) {
      toast.error("Please fill in all passenger details correctly");
      return;
    }
    if (!validateCustomDate()) {
      toast.error(dateError || "Please select a valid start date");
      return;
    }
    // If user just switched to custom, ensure either NEW_USER or they chose to proceed
    if (!allowSubmitAfterStatus) {
      setStatusModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const pickupLocationValue = currentLocation || pickupDropLocation || "";
      const requestData = {
        // Required fields (backend expects these names)
        email: user?.email || email,
        phone: user?.phoneNumber || phone,
        tripId: tripId,
        startDate: customStartDate,
        adults: adultsCount,
        current_location: pickupLocationValue,
        persons: passengers,

        // Optional
        fullName: user?.name || fullName,
        childrens: childrenCount,

        // Trip details passthrough
        title: title,
        endDate: endDate,
        image: images?.[0],
        duration: duration,

        // Add-ons as booleans (!! ensures true/false, backend forces === true)
        travelWithPet: !!selectedAddOns.pet,
        decoration: !!selectedAddOns.decoration,
        photographer: !!selectedAddOns.photographer,
        translator: !!selectedAddOns.translator,

        // Notes
        specialRequests: specialRequests,
        iteneraryChanges: itineraryChanges,

        // Help backend fallback
        pickupLocation: pickupLocationValue,

        // Status
        isPaymentPending: true,
      };

      console.log("Submitting requestData:", requestData); // Debug log

      const response = await axiosInstance.post(
        "/api/custom-trip/submit-custom-request",
        requestData
      );

      if (response.data.success) {
        setPaymentSuccess(true);
        setBookingId(response.data.requestId);
        toast.success("Request submitted! We'll contact you with a customized itinerary and pricing.");
      } else {
        toast.error(response.data.message || "Failed to submit request");
      }
    } catch (error) {
      console.error("Custom date request error:", error);
      toast.error(error.response?.data?.message || "Failed to submit custom date request");
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: Handle Scheduled Batch Payment — Aligned with backend verifyPayment expectations
  const handleScheduledBatchPayment = async () => {
    if (!validatePassengers()) {
      toast.error("Please fill in all passenger details correctly");
      return;
    }
    setLoading(true);
    try {
      const orderResponse = await axiosInstance.post("/api/payment/create-order", {
        amount: total * 100,
        currency: "INR",
        receipt: `trip_${tripId}_${Date.now()}`,
      });

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;

      script.onload = () => {
        const options = {
          key: razorpayKey,
          amount: total * 100,
          currency: "INR",
          order_id: orderResponse.data.order_id,
          name: "Samsara Studio",
          description: `Booking for ${title}`,
          image: images?.[0] || "/logo.png",
          prefill: {
            name: user?.name || fullName,
            email: user?.email || email,
            contact: phone,
          },
          theme: { color: "#65a30d" },
          handler: async (paymentResponse) => {
            try {
              const verificationData = {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                bookingData: {
                  // Core booking info (backend expects email, phone, etc.)
                  email: user?.email || email,
                  phone: user?.phoneNumber || phone, // Backend uses bookingData.phone
                  fullName: user?.name || fullName, // Backend uses bookingData.fullName || bookingData.name
                  // Trip ID for seat check (backend: { tripId: bookingData.tripId })
                  tripId: tripId,

                  // Persons array (backend expects bookingData.persons)
                  persons: passengers,

                  // Passenger counts (backend calculates total_members from adults + children/childrens)
                  adults: adultsCount,
                  children: childrenCount, // Backend handles both 'children' and 'childrens'

                  // Location fields (backend expects: pickupAndDrop for pickupLocation, current_location from pickupLocation || current_location)
                  pickupAndDrop: pickupDropLocation, // Maps to backend's pickupLocation: bookingData.pickupAndDrop
                  current_location: currentLocation, // Already sent, backend falls back to this
                  pickupLocation: pickupDropLocation, // Additional fallback for backend's current_location

                  // Special requests
                  specialRequests,

                  // Trip details (backend pulls from tripDetails for title, duration, dates, image, etc.)
                  tripDetails: {
                    title,
                    duration,
                    startDate,
                    endDate,
                    images: images || [], // Backend: bookingData.tripDetails?.images?.[0]
                    payment: effectivePayment, // Backend pulls subTotal, taxation, etc. from here
                    tripType: "PACKAGE", // FIXED: Set to "PACKAGE" for scheduled (backend defaults to this if missing)
                    pickupDropLocation, // Available for backend reference
                    itinerary: effectiveItinerary,
                    state: tripState,
                    category,
                  },

                  // Total amount (backend uses bookingData.totalAmount for grandTotal)
                  totalAmount: total,

                  // Payment details (backend merges these with tripDetails.payment)
                  paymentDetails: {
                    subtotal: base,
                    taxation: taxes,
                    insurance,
                    activities,
                    grandTotal: total,
                    transactionId: paymentResponse.razorpay_payment_id,
                    orderId: paymentResponse.razorpay_order_id,
                    paymentMethod: "Razorpay",
                    paymentStatus: "SUCCESS",
                  },

                  // Status (backend sets requestStatus: "PAID", isPaymentPending: false)
                  selectedBatch: "scheduled",
                  bookingStatus: "CONFIRMED",
                  bookingDate: new Date().toISOString(),

                  enquiryId: null, // Explicitly null to ensure regular flow (no update, creates new Booking)
                },
              };

              const verification = await axiosInstance.post("/api/payment/verify", verificationData);

              if (verification.data.success) {
                setPaymentSuccess(true);
                setBookingId(verification.data.bookingId || paymentResponse.razorpay_payment_id);
                toast.success("Payment successful! Your trip is confirmed.");
              } else {
                toast.error(`Payment verified but booking failed: ${verification.data.message}`);
              }
            } catch (error) {
              console.error("Verification error:", error);
              toast.error(
                error.response?.data?.message ||
                  "Payment successful but booking failed. Contact support with Payment ID: " +
                    paymentResponse.razorpay_payment_id
              );
            } finally {
              setLoading(false);
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              toast.info("Payment cancelled");
            },
          },
        };
        new window.Razorpay(options).open();
      };

      script.onerror = () => {
        setLoading(false);
        toast.error("Failed to load payment gateway. Please try again.");
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error(error.response?.data?.message || "Failed to initialize payment");
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (selectedBatch === "scheduled") {
      handleScheduledBatchPayment();
    } else {
      handleCustomDateRequest();
    }
  };

  const handleNavigateHome = () => navigate("/");
  const handleNavigateToPlans = () => navigate("/profile", { state: { page: "plans" } });
  const handleCloseModal = () => {
    setPaymentSuccess(false);
    navigate("/profile", { state: { page: "plans" } });
  };

  const formatDMY = (d) => {
    if (!d) return "N/A";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(d));
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const isPaymentFlow = selectedBatch === "scheduled";

  return (
    <div className="min-h-screen bg-[#f0f2d9] md:pt-20 pb-20 md:pb-8">
      {/* Status popup: only for custom-date flow */}
      {!isPaymentFlow && (
        <StatusModal
          open={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          status={statusPayload.status}
          message={statusPayload.message}
          enquiryId={statusPayload.enquiryId}
          isPaid={statusPayload.isPaid}
          onGoToPlans={handleGoToPlans}
          onProceedAnyway={handleProceedAnyway}
        />
      )}

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-[#f0f2d9] border-b border-lime-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-lime-100 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5 text-lime-900" />
          </button>
          <h1 className="text-lg font-bold text-lime-900">Contact Info</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Desktop Header */}
        <div className="hidden md:block text-center mb-8">
          <h1 className="text-3xl font-bold text-lime-900 mb-2">
            {isPaymentFlow ? "Complete Your Booking" : "Submit Your Request"}
          </h1>
          <p className="text-lime-700">
            {isPaymentFlow ? "Plan Your Trip - Scheduled Batch" : "Plan Your Trip - Custom Dates"} • {title}
          </p>
        </div>

        {!isPaymentFlow && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Custom Date Request</h3>
                <p className="text-sm text-blue-700">
                  After submitting your details, our team will create a personalized itinerary for your preferred dates and contact you with pricing details.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4 md:space-y-6">
          {/* Trip Summary Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4">
              <div className="flex gap-4">
                <img
                  src={images?.[0]}
                  alt={title}
                  className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-lime-900 mb-1 truncate">{title}</h3>
                  <p className="text-sm text-lime-600 mb-2">{duration}</p>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-lime-600 flex-shrink-0" />
                      <span className="text-lime-800">
                        {formatDMY(startDate)} - {formatDMY(endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-lime-600 flex-shrink-0" />
                      <span className="text-lime-800 truncate">{pickupDropLocation}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Batch Selection */}
            <div className="px-4 pb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => handleSelectBatch("scheduled")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                    selectedBatch === "scheduled" ? "bg-lime-600 text-white" : "bg-lime-50 text-lime-700 border border-lime-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedBatch === "scheduled" ? "border-white" : "border-lime-600"
                      }`}
                    >
                      {selectedBatch === "scheduled" && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span>Join Scheduled Batch</span>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectBatch("custom")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                    selectedBatch === "custom" ? "bg-lime-600 text-white" : "bg-lime-50 text-lime-700 border border-lime-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedBatch === "custom" ? "border-white" : "border-lime-600"
                      }`}
                    >
                      {selectedBatch === "custom" && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span>Request custom dates</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Travelers Counter */}
            <div className="border-t border-gray-100 px-4 py-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-lime-900">Adults</p>
                    <p className="text-xs text-lime-600">Ages 18 or Above</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                      disabled={adultsCount <= 1}
                      className="w-8 h-8 rounded-full bg-lime-600 text-white flex items-center justify-center hover:bg-lime-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="font-semibold text-lime-900 w-8 text-center">{adultsCount}</span>
                    <button
                      onClick={() => setAdultsCount(adultsCount + 1)}
                      disabled={adultsCount >= 10}
                      className="w-8 h-8 rounded-full bg-lime-600 text-white flex items-center justify-center hover:bg-lime-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-lime-900">Children</p>
                    <p className="text-xs text-lime-600">Ages 12 - 17</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                      disabled={childrenCount <= 0}
                      className="w-8 h-8 rounded-full bg-lime-600 text-white flex items-center justify-center hover:bg-lime-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="font-semibold text-lime-900 w-8 text-center">{childrenCount}</span>
                    <button
                      onClick={() => setChildrenCount(childrenCount + 1)}
                      disabled={childrenCount >= 10}
                      className="w-8 h-8 rounded-full bg-lime-600 text-white flex items-center justify-center hover:bg-lime-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Badge */}
            <div className="bg-lime-50 border-t border-lime-100 px-4 py-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-lime-600 flex-shrink-0" />
              <span className="text-xs text-lime-700 font-medium">
                {isPaymentFlow
                  ? `Free cancellation before ${formatDMY(new Date(startDate).setDate(new Date(startDate).getDate() - 7))}`
                  : "Our team will contact you within 24-48 hours"}
              </span>
            </div>

            {/* Price Details (only scheduled) */}
            {isPaymentFlow && (
              <div className="border-t border-gray-100">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full px-4 py-3 flex items-center justify-between bg-lime-50 hover:bg-lime-100 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-lime-900">Subtotal</span>
                    <span className="font-bold text-lime-600">₹{perPersonPrice.toLocaleString("en-IN")}/person</span>
                  </div>
                  {showDetails ? <ChevronUp className="w-5 h-5 text-lime-600" /> : <ChevronDown className="w-5 h-5 text-lime-600" />}
                </button>

                {showDetails && (
                  <div className="px-4 py-3 bg-white space-y-2 text-sm">
                    <Row label="Base Price" value={`₹${base.toLocaleString("en-IN")}`} />
                    {activities > 0 && <Row label="Activities" value={`₹${activities.toLocaleString("en-IN")}`} muted />}
                    {taxes > 0 && <Row label="Taxes" value={`₹${taxes.toLocaleString("en-IN")}`} muted />}
                    {insurance > 0 && <Row label="Insurance" value={`₹${insurance.toLocaleString("en-IN")}`} muted />}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <h2 className="text-base font-semibold text-lime-900 mb-4">Contact Details</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-lime-700 mb-1.5 font-medium">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={user?.email || email}
                    readOnly
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-lime-700 mb-1.5 font-medium">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={user?.phoneNumber || phone}
                    readOnly
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {!isPaymentFlow && (
                <div>
                  <label className="block text-xs text-lime-700 mb-1.5 font-medium">Preferred Start Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => {
                        setCustomStartDate(e.target.value);
                        setDateError("");
                      }}
                      min={getTodayDate()}
                      className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-lime-500 focus:border-lime-500 ${
                        dateError ? "border-red-400 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="Select your preferred start date"
                    />
                  </div>
                  {dateError && <p className="mt-1 text-xs text-red-600">{dateError}</p>}
                  <p className="mt-1 text-xs text-gray-500">We'll create a customized itinerary starting from this date</p>
                </div>
              )}

              {currentLocation && (
                <div>
                  <label className="block text-xs text-lime-700 mb-1.5 font-medium">Current Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={currentLocation}
                      readOnly
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Add-ons + Itinerary Changes — Now toggles work reliably */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="space-y-3">
              {addOnOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = !!selectedAddOns[option.id]; // Force boolean for safety
                return (
                  <div key={option.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-lime-700" />
                      <span className="text-sm font-medium text-gray-900">{option.label}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleAddOn(option.id)}
                      className={`px-5 py-1.5 rounded-lg text-sm font-medium transition ${
                        isSelected
                          ? "bg-lime-700 text-white shadow-md hover:shadow-lg"
                          : "bg-white text-lime-700 border-2 border-lime-700 hover:bg-lime-50"
                      }`}
                    >
                      {isSelected ? "Added" : "Add"}
                    </button>
                  </div>
                );
              })}

              <div className="pt-3">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Any Changes</label>
                <div className="relative">
                  <Edit3 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={itineraryChanges}
                    onChange={(e) => setItineraryChanges(e.target.value)}
                    rows={3}
                    placeholder="Write changes you want..."
                    className="w-full pl-11 pr-3 py-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Travelers */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-4 py-3 bg-[#f0f2d9] border-b border-lime-200">
              <h2 className="text-base font-semibold text-lime-900">Travelers ({totalTravelers})</h2>
            </div>
            <div className="p-4 space-y-4">
              {passengers.map((p, idx) => (
                <div key={idx} className="bg-lime-50 rounded-xl p-4 border border-lime-100">
                  <h3 className="text-sm font-semibold text-lime-900 mb-3">Traveler {idx + 1}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-lime-700 mb-1.5 font-medium">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) => setPassengerField(idx, "name", e.target.value)}
                          placeholder="John Williams"
                          className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm ${
                            passengerErrors[idx]?.name ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
                          }`}
                        />
                      </div>
                      {passengerErrors[idx]?.name && (
                        <p className="mt-1 text-xs text-red-600">{passengerErrors[idx].name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs text-lime-700 mb-1.5 font-medium">Age *</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          min="0"
                          max="120"
                          value={p.age}
                          onChange={(e) => setPassengerField(idx, "age", e.target.value)}
                          placeholder="Ex. 26"
                          className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm ${
                            passengerErrors[idx]?.age ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
                          }`}
                        />
                      </div>
                      {passengerErrors[idx]?.age && (
                        <p className="mt-1 text-xs text-red-600">{passengerErrors[idx].age}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment/Submit Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-4 py-3 bg-[#f0f2d9] border-b border-lime-200">
              <h2 className="text-base font-semibold text-lime-900">
                {isPaymentFlow ? "Payment Details" : "Submit Request"}
              </h2>
            </div>

            <div className="p-4">
              {isPaymentFlow ? (
                <>
                  <div className="space-y-2.5 mb-4">
                    <Row label="Subtotal" value={`₹${base.toLocaleString("en-IN")}`} />
                    {taxes > 0 && <Row label="Taxation" value={`₹${taxes.toLocaleString("en-IN")}`} muted />}
                    {insurance > 0 && <Row label="Insurance" value={`₹${insurance.toLocaleString("en-IN")}`} muted />}
                    {activities > 0 && <Row label="Activities" value={`₹${activities.toLocaleString("en-IN")}`} muted />}
                  </div>
                  <div className="border-t border-gray-200 pt-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lime-900">Grand Total</span>
                      <span className="text-lg font-bold text-lime-600">₹{total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 mb-4 flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-700">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-700">
                      <Lock className="w-4 h-4 text-green-600" />
                      <span>SSL Encrypted</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-900 mb-2 text-sm">What happens next?</h4>
                  <ul className="space-y-2 text-xs text-blue-700">
                    <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>Our team will review your requirements</span></li>
                    <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>We'll create a customized itinerary starting from your preferred date</span></li>
                    <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>You'll receive pricing and itinerary details via email</span></li>
                    <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>Our team will contact you within 24-48 hours</span></li>
                  </ul>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || paymentSuccess}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                  loading
                    ? "bg-lime-400 cursor-not-allowed"
                    : paymentSuccess
                    ? "bg-green-600"
                    : "bg-lime-600 hover:bg-lime-700 shadow-lg hover:shadow-xl active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <Busy text={isPaymentFlow ? "Processing Payment..." : "Submitting Request..."} />
                ) : paymentSuccess ? (
                  isPaymentFlow ? "Payment Successful!" : "Request Submitted!"
                ) : isPaymentFlow ? (
                  `Pay ₹${total.toLocaleString("en-IN")}`
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    Send Request
                  </span>
                )}
              </button>

              <p className="text-[11px] text-gray-500 text-center mt-3">
                By {isPaymentFlow ? "completing this purchase" : "submitting"}, you agree to our{" "}
                <a href="/terms" className="text-lime-600 hover:underline">Terms of Service</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <PaymentSuccessModal
        isOpen={paymentSuccess}
        onClose={handleCloseModal}
        onNavigateHome={handleNavigateHome}
        onNavigateToPlans={handleNavigateToPlans}
        bookingId={bookingId}
        isCustomRequest={!isPaymentFlow}
      />
    </div>
  );
};

const Row = ({ label, value, muted }) => (
  <div className={`flex justify-between items-center ${muted ? "text-gray-600 text-sm" : "text-lime-900"}`}>
    <span>{label}</span>
    <span className={muted ? "font-medium" : "font-semibold"}>{value}</span>
  </div>
);

const Busy = ({ text }) => (
  <div className="flex items-center justify-center gap-2">
    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
    {text}
  </div>
);

const Lock = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default CustomTripRequest;
