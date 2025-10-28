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
  ArrowLeft,
  AlertCircle,
  Users,
  Lock,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import PaymentSuccessModal from "../../components/user/PaymentSuccessModal";

const PackageBooking = ({ tripId, bookingData, tripDetails, user, navigate }) => {
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [passengers, setPassengers] = useState([]);
  const [passengerErrors, setPassengerErrors] = useState([]);

  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    fullName: "",
    currentLocation: ""
  });

  // Debug: Log incoming data
  useEffect(() => {
    console.log("🔍 PackageBooking - Props:", { tripId, bookingData, tripDetails, user });
  }, [tripId, bookingData, tripDetails, user]);

  // Extract trip details
  const {
    title,
    images,
    duration,
    payment,
    startDate,
    endDate,
    pickupDropLocation,
    itinerary,
    state: tripState,
    category,
    availableSeats = 0,
    totalSeats = 0,
  } = tripDetails || {};

  // Extract and set contact information properly
  useEffect(() => {
    if (bookingData || user) {
      const email = bookingData?.email || user?.email || "";
      const phone = bookingData?.phone || user?.phone || user?.phoneNumber || "";
      const fullName = bookingData?.fullName || user?.name || user?.fullName || "";
      const currentLocation = bookingData?.currentLocation || bookingData?.pickupLocation || "";

      setContactInfo({
        email,
        phone,
        fullName,
        currentLocation
      });

      console.log("📞 Contact Info Set:", { email, phone, fullName, currentLocation });
    }
  }, [bookingData, user]);

  // Initialize counts and add-ons
  useEffect(() => {
    if (bookingData) {
      setAdultsCount(bookingData.adults || 1);
      setChildrenCount(bookingData.children || bookingData.childrens || 0);
    }
  }, [bookingData]);

  const totalTravelers = Math.max(1, adultsCount + childrenCount);

  // NEW: Check if seats exceed available
  const seatsExceeded = totalTravelers > availableSeats;
  const remainingSeats = Math.max(0, availableSeats - totalTravelers);

  // Initialize passengers
  useEffect(() => {
    const newPassengers = Array.from({ length: totalTravelers }, (_, i) => {
      if (i === 0 && contactInfo.fullName) {
        return {
          name: contactInfo.fullName,
          age: passengers[i]?.age || "",
        };
      }
      return {
        name: passengers[i]?.name || "",
        age: passengers[i]?.age || "",
      };
    });
    setPassengers(newPassengers);
    setPassengerErrors(newPassengers.map(() => ({ name: "", age: "" })));
  }, [totalTravelers, contactInfo.fullName]);

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
      if (!age || !Number.isFinite(ageNum) || ageNum < 0 || ageNum > 120) {
        e.age = "Enter a valid age (0–120)";
      }
      return e;
    });
    setPassengerErrors(errs);
    return errs.every((x) => !x.name && !x.age);
  };

  const calculatePrices = () => {
    const totalPersons = adultsCount + childrenCount;
    const perPersonBase = payment?.subTotal || payment?.subtotal || 0;
    const perPersonTax = payment?.taxation || payment?.tax || 0;
    const perPersonInsurance = payment?.insurance || 0;
    const perPersonActivities = payment?.activities || 0;

    const base = Math.round(perPersonBase * totalPersons);
    const taxes = Math.round(perPersonTax * totalPersons);
    const insurance = Math.round(perPersonInsurance * totalPersons);
    const activities = Math.round(perPersonActivities * totalPersons);

    return {
      base,
      taxes,
      insurance,
      activities,
      total: base + taxes + insurance + activities,
      perPersonPrice: Math.round(perPersonBase || 0),
    };
  };

  const { base, taxes, insurance, activities, total, perPersonPrice } = calculatePrices();

  const handlePayment = async () => {
    // NEW: Check seats availability
    if (seatsExceeded) {
      toast.error(`Only ${availableSeats} seats available. You selected ${totalTravelers} travelers.`);
      return;
    }

    // Validation
    if (!contactInfo.phone || contactInfo.phone.length < 10) {
      toast.error("Valid phone number is required (min 10 digits)");
      return;
    }

    if (!contactInfo.email || !contactInfo.email.includes('@')) {
      toast.error("Valid email address is required");
      return;
    }

    if (!validatePassengers()) {
      toast.error("Please fill in all passenger details correctly");
      return;
    }

    console.log("💳 Initiating payment with data:", {
      contactInfo,
      passengers,
      adults: adultsCount,
      children: childrenCount,
      totalAmount: total
    });

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
            name: contactInfo.fullName,
            email: contactInfo.email,
            contact: contactInfo.phone,
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
                  email: contactInfo.email,
                  phone: contactInfo.phone,
                  name: contactInfo.fullName,
                  fullName: contactInfo.fullName,
                  adults: adultsCount,
                  children: childrenCount,
                  childrens: childrenCount,
                  total_members: adultsCount + childrenCount,
                  persons: passengers,
                  current_location: contactInfo.currentLocation,
                  pickupLocation: contactInfo.currentLocation,
                  pickupAndDrop: pickupDropLocation,
                  specialRequests: bookingData?.specialRequests || "",
                  title: title,
                  duration: duration,
                  startDate: startDate,
                  endDate: endDate,
                  image: images?.[0],
                  tripDetails: {
                    title,
                    duration,
                    startDate,
                    endDate,
                    images,
                    tripType: "PACKAGE",
                    pickupDropLocation,
                    itinerary,
                    state: tripState,
                    category,
                    payment: {
                      subTotal: payment?.subTotal || payment?.subtotal || 0,
                      taxation: payment?.taxation || payment?.tax || 0,
                      insurance: payment?.insurance || 0,
                      activities: payment?.activities || 0,
                    },
                  },
                  totalAmount: total,
                  payment: {
                    subtotal: base,
                    taxation: taxes,
                    insurance,
                    activities,
                    grandTotal: total,
                  },
                  tripType: "PACKAGE",
                  selectedBatch: "scheduled",
                  bookingStatus: "CONFIRMED",
                  requestStatus: "PAID",
                  isPaymentPending: false,
                  isPaymentUpdated: true,
                  bookingDate: new Date().toISOString(),
                },
              };

              console.log("📤 Sending verification data:", verificationData);

              const verification = await axiosInstance.post("/api/payment/verify", verificationData);

              if (verification.data.success) {
                setPaymentSuccess(true);
                setBookingId(verification.data.bookingId || paymentResponse.razorpay_payment_id);
                toast.success("Payment successful! Your trip is confirmed.");
              } else {
                toast.error(`Payment verified but booking failed: ${verification.data.message}`);
              }
            } catch (error) {
              console.error("❌ Verification error:", error);
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
      console.error("❌ Payment initialization error:", error);
      toast.error(error.response?.data?.message || "Failed to initialize payment");
      setLoading(false);
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

  const freeCancellationDate = startDate 
    ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() - 7))
    : null;

  // NEW: Determine if payment button should be disabled
  const isPaymentDisabled = 
    loading || 
    paymentSuccess || 
    !contactInfo.phone || 
    !contactInfo.email || 
    contactInfo.phone.length < 10 ||
    seatsExceeded ||
    availableSeats === 0;

  return (
    <div className="min-h-screen bg-[#f0f2d9] md:pt-20 pb-20 md:pb-8">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-[#f0f2d9] border-b border-lime-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-lime-100 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-lime-900" />
          </button>
          <h1 className="text-lg font-bold text-lime-900">Complete Booking</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Desktop Header */}
        <div className="hidden md:block text-center mb-8">
          <h1 className="text-3xl font-bold text-lime-900 mb-2">Complete Your Booking</h1>
          <p className="text-lime-700">Package Booking • {title}</p>
        </div>

        <div className="space-y-4 md:space-y-6">
          {/* Trip Summary Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4">
              <div className="flex gap-4">
                <img 
                  src={images?.[0]} 
                  alt={title} 
                  className="w-24 h-24 rounded-xl object-cover flex-shrink-0" 
                  onError={(e) => {
                    e.target.src = "/logo.png";
                    e.target.onerror = null;
                  }}
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

<div className={`border-t px-4 py-2 flex items-center justify-between ${
  availableSeats === 0 
    ? "bg-red-50 border-red-100" 
    : seatsExceeded 
    ? "bg-orange-50 border-orange-100"
    : availableSeats <= 5 
    ? "bg-yellow-50 border-yellow-100" 
    : "bg-green-50 border-green-100"
}`}>
  <div className="flex items-center gap-2">
    <Users className={`w-4 h-4 ${
      availableSeats === 0 
        ? "text-red-600" 
        : seatsExceeded 
        ? "text-orange-600"
        : availableSeats <= 5 
        ? "text-yellow-600" 
        : "text-green-600"
    }`} />
    <span className={`text-sm font-medium ${
      availableSeats === 0 
        ? "text-red-700" 
        : seatsExceeded 
        ? "text-orange-700"
        : availableSeats <= 5 
        ? "text-yellow-700" 
        : "text-green-700"
    }`}>
      {availableSeats === 0 
        ? "Booking Full for this Package" 
        : seatsExceeded
        ? `Only ${availableSeats} seats available`
        : `${availableSeats} seats available`}
    </span>
  </div>
  {seatsExceeded && availableSeats > 0 && (
    <span className="text-xs text-orange-600">
      You selected {totalTravelers}
    </span>
  )}
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
                      disabled={adultsCount >= 10 || (adultsCount + childrenCount) >= availableSeats}
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
                      disabled={childrenCount >= 10 || (adultsCount + childrenCount) >= availableSeats}
                      className="w-8 h-8 rounded-full bg-lime-600 text-white flex items-center justify-center hover:bg-lime-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* NEW: Seats Exceeded Warning */}
            {/* Seats Warning Messages */}
{availableSeats === 0 ? (
  // Show "Booking Full" message when no seats available
  <div className="bg-red-50 border-t border-red-100 px-4 py-3 flex items-start gap-2">
    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
    <div>
      <p className="text-sm font-medium text-red-700">Booking Full</p>
      <p className="text-xs text-red-600 mt-1">
        This package is fully booked. All seats have been reserved. 
        Please check other available packages or contact support for alternatives.
      </p>
    </div>
  </div>
) : seatsExceeded ? (
  // Show "Insufficient Seats" when selected travelers exceed available seats
  <div className="bg-orange-50 border-t border-orange-100 px-4 py-3 flex items-start gap-2">
    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
    <div>
      <p className="text-sm font-medium text-orange-700">Insufficient Seats</p>
      <p className="text-xs text-orange-600 mt-1">
        You've selected {totalTravelers} travelers but only {availableSeats} seats are available. 
        Please reduce the number of travelers.
      </p>
    </div>
  </div>
) : null}


            {/* Cancellation Policy */}
            {freeCancellationDate && (
              <div className="bg-lime-50 border-t border-lime-100 px-4 py-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-lime-600 flex-shrink-0" />
                <span className="text-xs text-lime-700 font-medium">
                  Free cancellation before {formatDMY(freeCancellationDate)}
                </span>
              </div>
            )}

            {/* Price Details */}
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
                    value={contactInfo.email}
                    readOnly
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50"
                  />
                </div>
                {!contactInfo.email && (
                  <p className="mt-1 text-xs text-red-600">Email is required</p>
                )}
              </div>

              <div>
                <label className="block text-xs text-lime-700 mb-1.5 font-medium">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    readOnly
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50"
                  />
                </div>
                {!contactInfo.phone && (
                  <p className="mt-1 text-xs text-red-600">Phone number is required</p>
                )}
                {contactInfo.phone && contactInfo.phone.length < 10 && (
                  <p className="mt-1 text-xs text-red-600">Phone number must be at least 10 digits</p>
                )}
              </div>

              {contactInfo.currentLocation && (
                <div>
                  <label className="block text-xs text-lime-700 mb-1.5 font-medium">Current Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={contactInfo.currentLocation}
                      readOnly
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Travelers - Keep existing code */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-4 py-3 bg-[#f0f2d9] border-b border-lime-200">
              <h2 className="text-base font-semibold text-lime-900">Travelers ({totalTravelers})</h2>
            </div>

            <div className="p-4 space-y-4">
              {passengers.map((p, idx) => (
                <div key={idx} className="bg-lime-50 rounded-xl p-4 border border-lime-100">
                  <h3 className="text-sm font-semibold text-lime-900 mb-3">
                    Traveler {idx + 1} {idx === 0 && "(Primary)"}
                  </h3>

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

          {/* Payment Details */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-4 py-3 bg-[#f0f2d9] border-b border-lime-200">
              <h2 className="text-base font-semibold text-lime-900">Payment Details</h2>
            </div>

            <div className="p-4">
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

              <button
                onClick={handlePayment}
                disabled={isPaymentDisabled}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                  isPaymentDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : paymentSuccess
                    ? "bg-green-600"
                    : "bg-lime-600 hover:bg-lime-700 shadow-lg hover:shadow-xl active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <Busy text="Processing Payment..." />
                ) : paymentSuccess ? (
                  "Payment Successful!"
                ) : availableSeats === 0 ? (
                  "No Seats Available"
                ) : seatsExceeded ? (
                  `Reduce to ${availableSeats} Travelers`
                ) : !contactInfo.phone || !contactInfo.email ? (
                  "Contact Details Required"
                ) : contactInfo.phone.length < 10 ? (
                  "Valid Phone Required"
                ) : (
                  `Pay ₹${total.toLocaleString("en-IN")}`
                )}
              </button>

              <p className="text-[11px] text-gray-500 text-center mt-3">
                By completing this purchase, you agree to our{" "}
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
        isCustomRequest={true}
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

export default PackageBooking;
