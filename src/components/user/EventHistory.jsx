import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { CancelBookingModal } from "./CancelBookingModal";

export default function EventHistoryPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchBookings();
    } else if (!authLoading && !isAuthenticated) {
      setBookings([]);
      setLoading(false);
    }
  }, [authLoading, isAuthenticated]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get("/api/events/user/bookings");
      const bookingsData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.bookings)
        ? res.data.bookings
        : [];
      setBookings(bookingsData);
    } catch (err) {
      console.error("Error fetching bookings:", err, err.response?.data);
      setError("Failed to fetch bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "cancellation_requested":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filterBookings = (all, tab) => {
    const now = new Date();
    return all.filter((booking) => {
      const event = booking.event || booking.eventId || {};
      const eventDateRaw = event.date || event.eventDate || event.startDate;
      const eventDate = eventDateRaw ? new Date(eventDateRaw) : null;

      if (tab === "upcoming") {
        return eventDate && eventDate > now && booking.status !== "cancelled";
      }
      if (tab === "past") {
        return (eventDate && eventDate <= now) || booking.status === "completed";
      }
      if (tab === "cancelled") {
        return booking.status === "cancelled";
      }
      return true;
    });
  };

  const filteredBookings = filterBookings(bookings, activeTab);

  const handleCancelRequest = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowCancelModal(true);
  };

  const handleCancelBooking = async () => {
    if (!cancellationReason || cancellationReason.length < 10) return;
    try {
      setCancelLoading(true);
      await axiosInstance.post("/api/events/request-cancellation", {
        bookingId: selectedBookingId,
        reason: cancellationReason,
      });
      await fetchBookings();
      setShowCancelModal(false);
      setCancellationReason("");
      setSelectedBookingId(null);
      alert("Cancellation request submitted successfully!");
    } catch (error) {
      console.error("Cancellation request failed:", error);
      alert("Failed to submit cancellation request. Please try again.");
    } finally {
      setCancelLoading(false);
    }
  };

  const calculateDaysRemaining = (startDate) => {
    if (!startDate) return 0;
    const today = new Date();
    const eventDate = new Date(startDate);
    const diffTime = eventDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateRefundPercentage = (startDate) => {
    const days = calculateDaysRemaining(startDate);
    if (days >= 7) return 100;
    if (days === 6) return 75;
    if (days === 5) return 50;
    if (days === 4) return 25;
    return 0;
  };

  const calculateRefundAmount = (startDate, totalAmount) =>
    (totalAmount * calculateRefundPercentage(startDate)) / 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-white/20 backdrop-blur-sm w-full max-w-sm sm:max-w-md">
          <div className="relative">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-100 border-t-blue-600 mx-auto mb-6" />
            <div className="absolute inset-0 rounded-full h-14 w-14 border-2 border-blue-200 opacity-25 mx-auto animate-pulse" />
          </div>
          <div className="text-lg font-semibold text-gray-700 mb-1">Loading bookings…</div>
          <div className="text-sm text-gray-500">Fetching event history</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-white/20 backdrop-blur-sm w-full max-w-sm sm:max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-600 font-bold text-xl">!</span>
          </div>
          <div className="text-red-600 text-lg font-semibold mb-2">{error}</div>
          <p className="text-gray-600 mb-6">Something went wrong while loading your bookings.</p>
          <button
            onClick={fetchBookings}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Tabs */}
      <div className="px-2 sm:px-4 lg:px-8 pt-6 sm:pt-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-white/20 shadow-lg">
          <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
            {[
              { id: "all", label: "All" },
              { id: "upcoming", label: "Upcoming" },
              { id: "past", label: "Past" },
              { id: "cancelled", label: "Cancelled" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2.5 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 flex-shrink-0 transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-gray-700 hover:text-gray-900 hover:bg-white/70"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 text-[10px] sm:text-xs rounded-full font-bold ${
                    activeTab === tab.id ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {filterBookings(bookings, tab.id).length}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* List */}
      <div className="px-2 sm:px-4 lg:px-8 py-6 sm:py-8">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-white/20 shadow-lg max-w-md mx-auto">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-5">
                {activeTab === "all" ? "No bookings yet. Start exploring events!" : `No ${activeTab} bookings found.`}
              </p>
              <div className="inline-flex px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium">
                Explore Events
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-6">
            {filteredBookings.map((booking) => {
              const event = booking.event || booking.eventId || {};
              const eventDate = event.date ? new Date(event.date) : null;
              const isUpcoming = eventDate && eventDate > new Date();
              const canCancel = isUpcoming && booking.status === "confirmed";

              return (
                <div
                  key={booking._id}
                  className="group bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-white/20 p-4 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-[1.01] sm:hover:scale-[1.02] overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                      {/* Image */}
                      <div className="lg:w-72 xl:w-80 flex-shrink-0">
                        {event.coverImage ? (
                          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-md">
                            <img
                              src={event.coverImage}
                              alt={event.title}
                              className="w-full h-40 sm:h-48 lg:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                          </div>
                        ) : (
                          <div className="w-full h-40 sm:h-48 lg:h-56 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md">
                            <span className="text-sm font-semibold text-blue-700">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 space-y-3 sm:space-y-4">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 line-clamp-2">
                              {event.title || "Untitled event"}
                            </h3>

                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold border ${getStatusColor(
                                  booking.status
                                )}`}
                              >
                                {booking.status.replace("_", " ").toUpperCase()}
                              </span>
                              {eventDate && (
                                <>
                                  <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-[11px] sm:text-xs font-semibold border border-blue-200">
                                    Date: {formatDate(event.date)}
                                  </span>
                                  <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-[11px] sm:text-xs font-semibold border border-purple-200">
                                    Time: {formatTime(event.date)}
                                  </span>
                                </>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="text-gray-700 text-sm">
                                <span className="text-gray-500">Location:</span>{" "}
                                <span className="font-medium break-words">{event.location || "-"}</span>
                              </div>
                              <div className="text-gray-700 text-sm">
                                <span className="text-gray-500">Organizer:</span>{" "}
                                <span className="font-medium break-words">{event.organizer || "-"}</span>
                              </div>
                            </div>
                          </div>

                          {/* Price + Actions */}
                          <div className="text-left md:text-right space-y-2 md:min-w-[160px]">
                            <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                              ₹{booking.totalAmount?.toLocaleString() || "-"}
                            </div>
                            <div className="text-[11px] sm:text-xs text-gray-500 break-all">
                              ID: {booking.razorpayOrderId || booking._id?.slice(-8)}
                            </div>
                            <div className="text-[11px] sm:text-xs text-gray-500">
                              Booked: {booking.bookingDate ? formatDate(booking.bookingDate) : "-"}
                            </div>

                            {canCancel && (
                              <button
                                onClick={() => handleCancelRequest(booking._id)}
                                className="mt-1 w-full md:w-auto px-3 py-1.5 sm:px-4 sm:py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm border border-red-200"
                              >
                                Request Cancellation
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Info blocks */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                          <div className="bg-gray-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-200">
                            <h4 className="font-bold text-gray-800 mb-2">Contact</h4>
                            <div className="space-y-0.5 text-sm text-gray-700">
                              <p className="font-medium break-words">{booking.contactInfo?.name || "-"}</p>
                              <p className="break-words">{booking.contactInfo?.email || "-"}</p>
                              <p className="break-words">{booking.contactInfo?.phone || "-"}</p>
                            </div>
                          </div>

                          <div className="bg-blue-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-blue-200">
                            <h4 className="font-bold text-blue-900 mb-2">Tickets</h4>
                            <div className="flex justify-between text-sm text-blue-900">
                              <div>
                                <span className="font-semibold">Adults:</span> {booking.tickets?.adults || 0}
                              </div>
                              <div>
                                <span className="font-semibold">Children:</span> {booking.tickets?.children || 0}
                              </div>
                            </div>
                          </div>

                          <div className="bg-green-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-green-200">
                            <h4 className="font-bold text-green-900 mb-2">Payment</h4>
                            <div className="space-y-1 text-sm text-green-900">
                              <p>
                                <span className="font-semibold">Status:</span>{" "}
                                <span className="capitalize">{booking.paymentStatus || "-"}</span>
                              </p>
                              <p className="text-xs opacity-75 break-all">
                                Order: {booking.razorpayOrderId || "-"}
                              </p>
                              <p className="text-xs opacity-75 break-all">
                                Payment: {booking.razorpayPaymentId || "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <CancelBookingModal
          bookingDetails={bookings.find((b) => b._id === selectedBookingId)}
          cancellationReason={cancellationReason}
          setCancellationReason={setCancellationReason}
          handleCancelBooking={handleCancelBooking}
          loading={cancelLoading}
          calculateDaysRemaining={calculateDaysRemaining}
          calculateRefundPercentage={calculateRefundPercentage}
          calculateRefundAmount={calculateRefundAmount}
          setShowCancelModal={setShowCancelModal}
          setCancelTripId={setSelectedBookingId}
        />
      )}
    </div>
  );
}
