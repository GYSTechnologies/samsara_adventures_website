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
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import PaymentSuccessModal from "../../components/user/PaymentSuccessModal";

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
  const [selectedBatch, setSelectedBatch] = useState("scheduled");
  const [showDetails, setShowDetails] = useState(false);
  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [passengers, setPassengers] = useState([]);
  const [passengerErrors, setPassengerErrors] = useState([]);

  const {
    adults: initialAdults = 1,
    children: initialChildren = 0,
    email,
    phone,
    fullName,
    enquiryId,
    specialRequests = "",
    addOnServices = [],
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

  useEffect(() => {
    setAdultsCount(initialAdults);
    setChildrenCount(initialChildren);
  }, [initialAdults, initialChildren]);

  const totalTravelers = Math.max(1, adultsCount + childrenCount);

  useEffect(() => {
    const newPassengers = Array.from({ length: totalTravelers }, (_, i) => ({
      name: i === 0 ? (user?.name || fullName || "") : passengers[i]?.name || "",
      age: passengers[i]?.age || "",
    }));
    setPassengers(newPassengers);
    setPassengerErrors(newPassengers.map(() => ({ name: "", age: "" })));
  }, [totalTravelers]);

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

  // Price calculation
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

  // Handle custom date request (no payment)
  const handleCustomDateRequest = async () => {
    if (!validatePassengers()) {
      toast.error("Please fill in all passenger details correctly");
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        tripId,
        userId: user?._id,
        userEmail: user?.email || email,
        userName: user?.name || fullName,
        userPhone: phone,
        adults: adultsCount,
        children: childrenCount,
        passengers,
        currentLocation,
        specialRequests,
        tripDetails: {
          title,
          duration,
          startDate,
          endDate,
          images,
          tripType: "CUSTOMIZED",
          pickupDropLocation,
          itinerary: effectiveItinerary,
          state: tripState,
          category,
        },
        requestStatus: "PENDING",
        requestDate: new Date().toISOString(),
        enquiryId: enquiryId || null,
      };

      const response = await axiosInstance.post(
        "/api/booking/custom-request",
        requestData
      );

      if (response.data.success) {
        setPaymentSuccess(true);
        setBookingId(response.data.requestId);
        toast.success(
          "Request submitted! We'll contact you with a customized itinerary and pricing."
        );
      } else {
        toast.error(response.data.message || "Failed to submit request");
      }
    } catch (error) {
      console.error("Custom date request error:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit custom date request"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle scheduled batch payment
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
                  tripId,
                  userId: user?._id,
                  userEmail: user?.email || email,
                  userName: user?.name || fullName,
                  userPhone: phone,
                  adults: adultsCount,
                  children: childrenCount,
                  passengers,
                  currentLocation,
                  specialRequests,
                  selectedBatch: "scheduled",
                  tripDetails: {
                    title,
                    duration,
                    startDate,
                    endDate,
                    images,
                    payment: effectivePayment,
                    tripType: "CUSTOMIZED",
                    pickupDropLocation,
                    itinerary: effectiveItinerary,
                    state: tripState,
                    category,
                  },
                  totalAmount: total,
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
                  bookingStatus: "CONFIRMED",
                  bookingDate: new Date().toISOString(),
                  enquiryId: enquiryId || null,
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

  // Main submit handler
  const handleSubmit = () => {
    if (selectedBatch === "scheduled") {
      handleScheduledBatchPayment();
    } else {
      handleCustomDateRequest();
    }
  };

  const handleNavigateHome = () => navigate("/");
  const handleNavigateToPlans = () =>
    navigate("/profile", { state: { page: "plans" } });
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

  const addOnOptions = [
    { id: "pet", label: "Bringing a pet?", icon: PawPrint },
    { id: "decoration", label: "Custom Decoration?", icon: PartyPopper },
    { id: "photographer", label: "Personal Photographer?", icon: Camera },
    { id: "translator", label: "Need a Translator?", icon: Languages },
  ];

  // Show payment flow or request flow
  const isPaymentFlow = selectedBatch === "scheduled";

  return (
    <div className="min-h-screen bg-[#f0f2d9] md:pt-20 pb-20 md:pb-8">
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

        {/* Info Notice */}
        {!isPaymentFlow && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Custom Date Request
                </h3>
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
                  <h3 className="text-base font-semibold text-lime-900 mb-1 truncate">
                    {title}
                  </h3>
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
                  onClick={() => setSelectedBatch("scheduled")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                    selectedBatch === "scheduled"
                      ? "bg-lime-600 text-white"
                      : "bg-lime-50 text-lime-700 border border-lime-200"
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
                  onClick={() => setSelectedBatch("custom")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                    selectedBatch === "custom"
                      ? "bg-lime-600 text-white"
                      : "bg-lime-50 text-lime-700 border border-lime-200"
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

            {/* Price Details (only for scheduled batch) */}
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
                    value={phone}
                    readOnly
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

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

          {/* Special Requests */}
          {specialRequests && (
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="space-y-3">
                <div className="pt-2">
                  <label className="block text-xs text-lime-700 mb-1.5 font-medium">Any Changes</label>
                  <div className="relative">
                    <Edit3 className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      value={specialRequests}
                      readOnly
                      rows={3}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm resize-none bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

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
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Our team will review your requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>We'll create a customized itinerary for your preferred dates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>You'll receive pricing and itinerary details via email</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Our team will contact you within 24-48 hours</span>
                    </li>
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
                    Submit Request
                  </span>
                )}
              </button>

              <p className="text-[11px] text-gray-500 text-center mt-3">
                By {isPaymentFlow ? "completing this purchase" : "submitting"}, you agree to our{" "}
                <a href="/terms" className="text-lime-600 hover:underline">
                  Terms of Service
                </a>
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
