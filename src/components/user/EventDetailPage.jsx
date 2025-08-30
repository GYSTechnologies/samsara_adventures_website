import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import PaymentConfirmationModal from "./PaymentConfirmationModal";

export default function EventDetailPage() {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Add state for modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const [cartEvents, setCartEvents] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();

  // Fallback images for different categories
  const fallbackImages = {
    Festival:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop&crop=entropy&auto=format",
    Adventure:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&crop=entropy&auto=format",
    Food: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&fit=crop&crop=entropy&auto=format",
    Cultural:
      "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=1200&h=800&fit=crop&crop=entropy&auto=format",
    Music:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop&crop=entropy&auto=format",
    Wellness:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=800&fit=crop&crop=entropy&auto=format",
    default:
      "https://images.unsplash.com/photo-1501281667305-0ddc81f4c5b7?w=1200&h=800&fit=crop&crop=entropy&auto=format",
  };

  const includedItemsImages = [
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=entropy&auto=format",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=entropy&auto=format",
    "https://t4.ftcdn.net/jpg/02/27/86/99/360_F_227869982_rSPakWYhk47NgGUELcyVLCFx1tPRizSP.jpg",
  ];

  useEffect(() => {
    fetchEventDetails();

    // Preload Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [id]);

  useEffect(() => {
    // Pre-fill user data if available
    if (user) {
      setEmail(user.email || "");
      setName(user.name || "");
    }
  }, [user]);

  useEffect(() => {
    const fetchCartEvents = async () => {
      try {
        const res = await axiosInstance.get("/api/events/short");
        setCartEvents(res.data);
      } catch (err) {
        console.error("Error fetching cart events", err);
      }
    };

    fetchCartEvents();
  }, []);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(`/api/events/${id}`);

      setEvent(response.data);
    } catch (err) {
      console.error("Error fetching event details:", err);
      setError("Failed to load event details. Please try again later.");

      // Fallback to mock data
      const mockEvents = getMockEventsData();
      setEvent(mockEvents[id] || mockEvents[1]);
    } finally {
      setLoading(false);
    }
  };

  const getMockEventsData = () => ({
    1: {
      _id: 1,
      coverImage:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop&crop=entropy&auto=format",
      title: "Goa Sunset Beach Festival",
      description:
        "An unforgettable evening of music, dance, and coastal beauty.",
      shortDescription:
        "Experience the ultimate dance and local theme park party with vibrant live music.",
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Goa, India",
      about:
        "The Goa Sunset Beach Festival blends the magic of golden sunsets with the energy of live music, vibrant beachside performances, and mouthwatering coastal delicacies.",
      price: 3500,
      category: "Festival",
      capacity: 200,
      bookedSeats: 75,
      scheduleItems: [
        { time: "5:00 PM", activity: "Gate opens & Welcome Drinks" },
        { time: "6:00 PM", activity: "Live Music Performance" },
        { time: "7:00 PM", activity: "Sunset Viewing & Photography" },
        { time: "8:00 PM", activity: "Beach Bonfire & Dinner" },
      ],
      includedItems: [
        { description: "Live performances by local and international artists" },
        { description: "Sunset viewing experience from the beach" },
        { description: "Fire dance performances and cultural showcases" },
      ],
    },
  });

  const getImageUrl = (image, category) => {
    if (image) return image;
    return fallbackImages[category] || fallbackImages.default;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const pricePerPerson = event ? event.price : 4000;
  const totalPrice = adults * pricePerPerson + children * pricePerPerson;

  const handleBack = () => {
    navigate(-1);
  };

  // calculate seats
  const availableSeats = event ? event.capacity - (event.bookedSeats || 0) : 0;
  const totalTravelers = adults + children;
  const maxReached = totalTravelers > availableSeats;

  const handleProceedToPayment = async () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: window.location.pathname,
          message: "Please login to book this event",
        },
      });
      return;
    }

    if (!mobileNo || !email || !name) {
      alert("Please fill in all required fields");
      return;
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobileNo)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      setProcessing(true);

      const response = await axiosInstance.post(`/api/events/create-order`, {
        eventId: event._id,
        tickets: { adults, children },
        contactInfo: {
          name: name,
          email: email,
          phone: mobileNo,
        },
      });

      // be defensive about shapes: support orderId or order_id
      const data = response.data || {};
      const orderId = data.orderId || data.order_id;
      const amount = data.amount || data.amount_in_paise || 0;
      const currency = data.currency || "INR";
      const bookingId = data.bookingId || data.booking_id;
      const key = data.key || process.env.REACT_APP_RAZORPAY_KEY;

      if (!orderId || !bookingId) {
        throw new Error("Server didn't return order or booking id.");
      }

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded");
      }

      const options = {
        key: key,
        amount: amount,
        currency,
        name: event.title,
        description: `Booking for ${event.title}`,
        order_id: orderId,
        handler: async function (razorResponse) {
          try {
            const verifyResponse = await axiosInstance.post(
              `/api/events/verify-payment`,
              {
                razorpayOrderId: razorResponse.razorpay_order_id,
                razorpayPaymentId: razorResponse.razorpay_payment_id,
                razorpaySignature: razorResponse.razorpay_signature,
                bookingId: bookingId,
              }
            );

            setBookingDetails({
              eventTitle: event.title,
              bookingId: bookingId,
              totalAmount: totalPrice,
              attendees: { adults, children },
            });
            setShowSuccessModal(true);
          } catch (err) {
            console.error("Payment verification error:", err);
            alert("Payment verification failed. Please contact support.");
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name,
          email,
          contact: mobileNo,
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            console.log("Payment modal dismissed");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
        setProcessing(false);
      });
    } catch (error) {
      console.error("Booking error:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to create booking. Please try again.";
      alert(msg);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading event details...</div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">Event not found</div>
          <button
            onClick={() => navigate("/events")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-22">
      {/* Hero Section */}
      <div
        className="relative h-64 sm:h-80 lg:h-96 xl:h-[500px] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('${getImageUrl(
            event.coverImage,
            event.category
          )}')`,
        }}
      >
        {/* Back button */}
        {/* <button
          onClick={handleBack}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 text-white hover:text-gray-300 transition-colors z-10"
        >
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button> */}

        {/* Hero Content */}
        <div className="relative text-center text-white px-4 sm:px-6 max-w-4xl z-10">
          <div className="mb-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {event.category}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {event.title}
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-6 sm:mb-8">
            {event.shortDescription || event.description}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Info */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 mr-3 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold">Date & Time</p>

                    <p className="font-bold">
                      {formatDate(event.date)} |{" "}
                      {event.scheduleItems?.[0]?.time || "TBA"}
                    </p>

                    {/* {event.endDate && (
                      <p className="text-sm text-gray-500">
                        to {formatDate(event.endDate)}
                      </p>
                    )} */}
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 mr-3 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-sm">
                      {event.location}
                      {event.venue && (
                        <span className="block text-gray-500">
                          {event.venue}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Capacity Info */}
              {event.capacity && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">
                      Seats Available
                    </span>
                    <span className="text-sm font-bold text-blue-800">
                      {event.capacity - (event.bookedSeats || 0)} of{" "}
                      {event.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          ((event.bookedSeats || 0) / event.capacity) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* About the Event */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                About the Event
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {event.about || event.description}
              </p>
            </div>

            {/* What's Included */}
            {event.includedItems && event.includedItems.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg
                    className="w-6 h-6 mr-2 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  What's Included
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {event.includedItems.map((item, index) => (
                    <div
                      key={index}
                      className="text-center group hover:transform hover:scale-105 transition-transform duration-200"
                    >
                      <div className="w-full h-32 rounded-lg mb-4 overflow-hidden shadow-md">
                        <img
                          src={
                            item.image ||
                            includedItemsImages[
                              index % includedItemsImages.length
                            ]
                          }
                          alt={item.description}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights */}
            {event.highlights && event.highlights.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Event Highlights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions */}
            {event.inclusions && event.inclusions.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg
                    className="w-6 h-6 mr-2 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Inclusions
                </h2>
                <ul className="space-y-2">
                  {event.inclusions.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Exclusions */}
            {event.exclusions && event.exclusions.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg
                    className="w-6 h-6 mr-2 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Exclusions
                </h2>
                <ul className="space-y-2">
                  {event.exclusions.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <svg
                        className="w-5 h-5 text-red-500 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Terms & Conditions */}
            {event.termsConditions && event.termsConditions.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg
                    className="w-6 h-6 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 
             012-2h6l6 6v12a2 2 0 01-2 2z"
                    />
                  </svg>
                  Terms & Conditions
                </h2>
                <ul className="space-y-2 list-disc list-inside text-gray-700">
                  {event.termsConditions.map((term, index) => (
                    <li key={index}>{term}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Event Schedule */}
            {/* {event.scheduleItems && event.scheduleItems.length > 0 && (
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
                  Event Schedule
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  {event.scheduleItems.map((schedule, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 text-center hover:shadow-md transition"
                    >
                      {schedule.image && (
                        <div className="w-full h-16 sm:h-20 rounded-lg mb-3 overflow-hidden">
                          <img
                            src={schedule.image}
                            alt={schedule.activity}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                        {schedule.time}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {schedule.activity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>

          {/* Right Sidebar - Booking */}
          <div className="lg:col-span-1 w-full lg:w-120">
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm sticky top-4 sm:top-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 text-center sm:text-left">
                Book Your Spot
              </h3>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Mobile Number */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="Enter your mobile number"
                  required
                />
              </div>

              {/* Total Members */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Total no of members
                </label>

                <div className="space-y-4">
                  {/* Adults */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-between">
                    <div className="mb-2 sm:mb-0">
                      <span className="text-sm sm:text-base font-medium text-gray-900">
                        Adults
                      </span>
                      <p className="text-xs text-gray-500">Age 13+</p>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                      <button
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">
                        {adults}
                      </span>
                      <button
                        onClick={() => setAdults(adults + 1)}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-between">
                    <div className="mb-2 sm:mb-0">
                      <span className="text-sm sm:text-base font-medium text-gray-900">
                        Children
                      </span>
                      <p className="text-xs text-gray-500">Age 2-12</p>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                      <button
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">
                        {children}
                      </span>
                      <button
                        onClick={() => setChildren(children + 1)}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Adults ({adults} x ₹{pricePerPerson})
                    </span>
                    <span className="text-sm font-medium">
                      ₹{(adults * pricePerPerson).toLocaleString()}
                    </span>
                  </div>
                  {children > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Children ({children} x ₹{Math.round(pricePerPerson * 1)}
                        )
                      </span>
                      <span className="text-sm font-medium">
                        ₹
                        {Math.round(
                          children * pricePerPerson * 1
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Total Price */}
              <div className="mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-lg font-semibold text-blue-900">
                    Total Amount:
                  </span>
                  <span className="text-sm sm:text-lg font-bold text-blue-900">
                    ₹{Math.round(totalPrice).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Seats Warning */}
              {availableSeats > 0 && availableSeats <= 5 && (
                <p className="text-sm text-red-600 font-medium mb-3">
                  Hurry! Only {availableSeats} seats left
                </p>
              )}
              {availableSeats <= 0 && (
                <p className="text-sm text-gray-600 font-medium mb-3">
                  This event is fully booked
                </p>
              )}

              {/* Book Button */}
              <button
                onClick={handleProceedToPayment}
                disabled={
                  !email ||
                  !mobileNo ||
                  !name ||
                  processing ||
                  availableSeats <= 0 ||
                  totalTravelers > availableSeats
                }
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base transition-colors duration-200 flex items-center justify-center"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : availableSeats <= 0 ? (
                  "Sold Out"
                ) : isAuthenticated ? (
                  "Proceed to Payment"
                ) : (
                  "Login to Book"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Event Schedule */}

        {cartEvents && cartEvents.length > 0 && (
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
              Event Schedule
            </h2>

            <div className="flex flex-row flex-wrap justify-center gap-4 max-w-5xl mx-auto">
              {cartEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition cursor-pointer w-80"
                  onClick={() => navigate(`/event-detail/${event._id}`)}
                >
                  {/* Cover Image */}
                  {event.coverImage && (
                    <div className="w-full h-32 sm:h-40 rounded-lg mb-3 overflow-hidden">
                      <img
                        src={event.coverImage}
                        alt={event.shortDescription || "Event cover"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Time */}
                  <div className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    {event.scheduleItems?.[0]?.time || "Time not available"}
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-gray-700 font-medium line-clamp-2 mb-2">
                    {event.shortDescription || "No description available"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <PaymentConfirmationModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        eventTitle={bookingDetails?.eventTitle}
        bookingId={bookingDetails?.bookingId}
        totalAmount={bookingDetails?.totalAmount}
        attendees={bookingDetails?.attendees}
        onNavigateHome={() => navigate("/")}
        onNavigateProfile={() => navigate("/profile")}
      />
    </div>
  );
}
