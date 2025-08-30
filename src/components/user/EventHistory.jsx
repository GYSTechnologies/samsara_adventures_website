// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import axiosInstance from "../../api/axiosInstance";
// import { useAuth } from "../../context/AuthContext";
// import { CancelBookingModal } from "./CancelBookingModal"; // Import the modal component

// export default function EventHistoryPage() {
//   const { user, loading: authLoading, isAuthenticated } = useAuth();

//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("all");
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
  
//   // States for cancellation
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [cancellationReason, setCancellationReason] = useState("");
//   const [cancelLoading, setCancelLoading] = useState(false);
//   const [selectedBookingId, setSelectedBookingId] = useState(null);

//   useEffect(() => {
//     if (!authLoading && isAuthenticated) {
//       fetchBookings();
//     } else if (!authLoading && !isAuthenticated) {
//       setBookings([]);
//       setLoading(false);
//     }
//   }, [authLoading, isAuthenticated]);

//   const fetchBookings = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const res = await axiosInstance.get("/api/events/user/bookings");

//       const bookingsData = Array.isArray(res.data)
//         ? res.data
//         : Array.isArray(res.data.bookings)
//         ? res.data.bookings
//         : [];

//       setBookings(bookingsData);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching bookings:", err, err.response?.data);
//       setError("Failed to fetch bookings. Please try again later.");
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-IN", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString("en-IN", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "confirmed":
//         return "bg-green-100 text-green-800";
//       case "completed":
//         return "bg-blue-100 text-blue-800";
//       case "cancelled":
//         return "bg-red-100 text-red-800";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "cancellation_requested":
//         return "bg-orange-100 text-orange-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const filterBookings = (allBookings, tab) => {
//     const now = new Date();
//     return allBookings.filter((booking) => {
//       const event = booking.event || booking.eventId || {};
//       const eventDateRaw = event.date || event.eventDate || event.startDate;
//       const eventDate = eventDateRaw ? new Date(eventDateRaw) : null;

//       if (tab === "upcoming") {
//         return eventDate && eventDate > now && booking.status !== "cancelled";
//       }
//       if (tab === "past") {
//         return (
//           (eventDate && eventDate <= now) || booking.status === "completed"
//         );
//       }
//       if (tab === "cancelled") {
//         return booking.status === "cancelled";
//       }
//       return true;
//     });
//   };

//   const filteredBookings = filterBookings(bookings, activeTab);

//   const handleViewDetails = (booking) => {
//     setSelectedBooking(booking);
//     setShowDetailsModal(true);
//   };

//   const handleCancelRequest = (bookingId) => {
//     setSelectedBookingId(bookingId);
//     setShowCancelModal(true);
//   };

//   const handleCancelBooking = async () => {
//     if (!cancellationReason || cancellationReason.length < 10) return;
    
//     try {
//       setCancelLoading(true);
//       await axiosInstance.post("/api/events/request-cancellation", {
//         bookingId: selectedBookingId,
//         reason: cancellationReason
//       });
      
//       // Refresh bookings
//       await fetchBookings();
//       setShowCancelModal(false);
//       setCancellationReason("");
//       setSelectedBookingId(null);
//       alert("Cancellation request submitted successfully!");
//     } catch (error) {
//       console.error("Cancellation request failed:", error);
//       alert("Failed to submit cancellation request. Please try again.");
//     } finally {
//       setCancelLoading(false);
//     }
//   };

//   const calculateDaysRemaining = (startDate) => {
//     if (!startDate) return 0;
//     const today = new Date();
//     const eventDate = new Date(startDate);
//     const diffTime = eventDate - today;
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   };

//   const calculateRefundPercentage = (startDate) => {
//     const daysRemaining = calculateDaysRemaining(startDate);
//     if (daysRemaining >= 7) return 100;
//     if (daysRemaining === 6) return 75;
//     if (daysRemaining === 5) return 50;
//     if (daysRemaining === 4) return 25;
//     return 0;
//   };


//    const calculateRefundAmount = (startDate, totalAmount) => {
//     const percentage = calculateRefundPercentage(startDate);
//     return (totalAmount * percentage) / 100;
//   };

//     // Create a function to get the booking details in the format expected by the modal
//   const getBookingDetailsForModal = (booking) => {
//     return {
//       ...booking,
//       startDate: booking.event?.date || booking.event?.eventDate || booking.event?.startDate,
//       payment: {
//         grandTotal: booking.totalAmount
//       }
//     };
//   };


//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <div className="text-xl text-gray-600">Loading your bookings...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//         <div className="text-center">
//           <div className="text-red-500 text-lg font-semibold mb-2">{error}</div>
//           <button
//             onClick={fetchBookings}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }


//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               Event History
//             </h1>
//             <p className="text-gray-600 mt-1">Track all your event bookings</p>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
//         {/* Tabs */}
//         <div className="mb-6 sm:mb-8">
//           <div className="border-b border-gray-200">
//             <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
//               {[
//                 { id: "all", label: "All Bookings", count: bookings.length },
//                 {
//                   id: "upcoming",
//                   label: "Upcoming",
//                   count: filterBookings(bookings, "upcoming").length,
//                 },
//                 {
//                   id: "past",
//                   label: "Past Events",
//                   count: filterBookings(bookings, "past").length,
//                 },
//                 {
//                   id: "cancelled",
//                   label: "Cancelled",
//                   count: filterBookings(bookings, "cancelled").length,
//                 },
//               ].map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex-shrink-0 ${
//                     activeTab === tab.id
//                       ? "border-blue-500 text-blue-600"
//                       : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                   }`}
//                 >
//                   <span className="hidden sm:inline">{tab.label}</span>
//                   <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
//                   <span
//                     className={`ml-2 px-2 py-1 text-xs rounded-full ${
//                       activeTab === tab.id
//                         ? "bg-blue-100 text-blue-600"
//                         : "bg-gray-100 text-gray-600"
//                     }`}
//                   >
//                     {tab.count}
//                   </span>
//                 </button>
//               ))}
//             </nav>
//           </div>
//         </div>

//         {/* Bookings List */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
//           {filteredBookings.length === 0 ? (
//             <div className="text-center py-8 sm:py-12">
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 No bookings found
//               </h3>
//               <p className="text-gray-500 mb-4 px-4">
//                 {activeTab === "all"
//                   ? "You haven't made any bookings yet."
//                   : `No ${activeTab} bookings found.`}
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-4 sm:space-y-6">
//               {filteredBookings.map((booking) => {
//                 const event = booking.event || booking.eventId || {};
//                 const eventDate = event.date ? new Date(event.date) : null;
//                 const isUpcoming = eventDate && eventDate > new Date();
//                 const canCancel = isUpcoming && booking.status === "confirmed";
                
//                 return (
//                   <div
//                     key={booking._id}
//                     className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100"
//                   >
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                       <div className="flex-1">
//                         <div className="font-semibold text-lg text-gray-900 mb-1">
//                           {event.title || "Untitled event"}
//                         </div>
//                         <div className="text-sm text-gray-500 mb-2">
//                           {event.location}
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
//                             {booking.status.replace("_", " ")}
//                           </span>
//                           {eventDate && (
//                             <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
//                               {formatDate(event.date)}
//                             </span>
//                           )}
//                         </div>
//                       </div>
                      
//                       <div className="text-right">
//                         <div className="text-lg font-bold text-gray-900 mb-1">
//                           ₹{booking.totalAmount?.toLocaleString() || "-"}
//                         </div>
//                         <div className="text-xs text-gray-400">
//                           ID: {booking.razorpayOrderId || booking._id.slice(-8)}
//                         </div>
                        
//                         {canCancel && (
//                           <button
//                             onClick={() => handleCancelRequest(booking._id)}
//                             className="mt-3 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-medium transition"
//                           >
//                             Request Cancellation
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

   

//        {/* Cancel Booking Modal */}
//   {showCancelModal && (
//     <CancelBookingModal
//       bookingDetails={getBookingDetailsForModal(bookings.find(b => b._id === selectedBookingId))}
//       cancellationReason={cancellationReason}
//       setCancellationReason={setCancellationReason}
//       handleCancelBooking={handleCancelBooking}
//       loading={cancelLoading}
//       calculateDaysRemaining={calculateDaysRemaining}
//       calculateRefundPercentage={calculateRefundPercentage}
//       calculateRefundAmount={calculateRefundAmount}
//       setShowCancelModal={setShowCancelModal}
//       setCancelTripId={setSelectedBookingId}
//     />
//   )}
//     </div>
//   );

// }



import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { CancelBookingModal } from "./CancelBookingModal"; // Import the modal component

export default function EventHistoryPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // States for cancellation
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

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
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookings:", err, err.response?.data);
      setError("Failed to fetch bookings. Please try again later.");
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  const filterBookings = (allBookings, tab) => {
    const now = new Date();
    return allBookings.filter((booking) => {
      const event = booking.event || booking.eventId || {};
      const eventDateRaw = event.date || event.eventDate || event.startDate;
      const eventDate = eventDateRaw ? new Date(eventDateRaw) : null;

      if (tab === "upcoming") {
        return eventDate && eventDate > now && booking.status !== "cancelled";
      }
      if (tab === "past") {
        return (
          (eventDate && eventDate <= now) || booking.status === "completed"
        );
      }
      if (tab === "cancelled") {
        return booking.status === "cancelled";
      }
      return true;
    });
  };

  const filteredBookings = filterBookings(bookings, activeTab);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

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
        reason: cancellationReason
      });
      
      // Refresh bookings
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
    const daysRemaining = calculateDaysRemaining(startDate);
    if (daysRemaining >= 7) return 100;
    if (daysRemaining === 6) return 75;
    if (daysRemaining === 5) return 50;
    if (daysRemaining === 4) return 25;
    return 0;
  };

  const calculateRefundAmount = (startDate, totalAmount) => {
    const percentage = calculateRefundPercentage(startDate);
    return (totalAmount * percentage) / 100;
  };

  // Create a function to get the booking details in the format expected by the modal
  const getBookingDetailsForModal = (booking) => {
    return {
      ...booking,
      startDate: booking.event?.date || booking.event?.eventDate || booking.event?.startDate,
      payment: {
        grandTotal: booking.totalAmount
      }
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-white/20 backdrop-blur-sm">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-2 border-blue-200 opacity-25 mx-auto animate-pulse"></div>
          </div>
          <div className="text-xl font-semibold text-gray-700 mb-2">Loading your bookings...</div>
          <div className="text-sm text-gray-500">Please wait while we fetch your event history</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-white/20 backdrop-blur-sm max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="text-red-600 text-lg font-semibold mb-2">{error}</div>
          <p className="text-gray-600 mb-6">Something went wrong while loading your bookings</p>
          <button
            onClick={fetchBookings}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
              Event History
            </h1>
            <p className="text-gray-600 text-lg">Track and manage all your event bookings</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 border border-white/20 shadow-lg">
            <nav className="flex space-x-1 overflow-x-auto scrollbar-hide">
              {[
                { id: "all", label: "All Bookings", count: bookings.length, icon: "📅" },
                {
                  id: "upcoming",
                  label: "Upcoming",
                  count: filterBookings(bookings, "upcoming").length,
                  icon: "🎉"
                },
                {
                  id: "past",
                  label: "Past Events",
                  count: filterBookings(bookings, "past").length,
                  icon: "📝"
                },
                {
                  id: "cancelled",
                  label: "Cancelled",
                  count: filterBookings(bookings, "cancelled").length,
                  icon: "❌"
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative py-3 px-4 sm:px-6 font-semibold text-sm whitespace-nowrap flex-shrink-0 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-bold ${
                        activeTab === tab.id
                          ? "bg-white/20 text-white"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-lg max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                No bookings found
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === "all"
                  ? "You haven't made any bookings yet. Start exploring events!"
                  : `No ${activeTab} bookings found.`}
              </p>
              <div className="inline-flex px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium">
                Explore Events
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const event = booking.event || booking.eventId || {};
              const eventDate = event.date ? new Date(event.date) : null;
              const isUpcoming = eventDate && eventDate > new Date();
              const canCancel = isUpcoming && booking.status === "confirmed";
              
              return (
                <div
                  key={booking._id}
                  className="group bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-6 sm:p-8 hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-[1.02] overflow-hidden relative"
                >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Event Image */}
                      <div className="lg:w-80 flex-shrink-0">
                        {event.coverImage ? (
                          <div className="relative overflow-hidden rounded-2xl shadow-lg">
                            <img 
                              src={event.coverImage} 
                              alt={event.title} 
                              className="w-full h-48 lg:h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          </div>
                        ) : (
                          <div className="w-full h-48 lg:h-56 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-6xl">🎪</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Event Details */}
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors">
                              {event.title || "Untitled event"}
                            </h3>
                            
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(booking.status)}`}>
                                {booking.status.replace("_", " ").toUpperCase()}
                              </span>
                              {eventDate && (
                                <>
                                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold border border-blue-200">
                                    📅 {formatDate(event.date)}
                                  </span>
                                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold border border-purple-200">
                                    🕐 {formatTime(event.date)}
                                  </span>
                                </>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-gray-700">
                                <span className="text-lg">📍</span>
                                <span className="text-sm font-medium">{event.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <span className="text-lg">👤</span>
                                <span className="text-sm font-medium">{event.organizer}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Price and Actions */}
                          <div className="text-right sm:text-left lg:text-right space-y-3">
                            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                              ₹{booking.totalAmount?.toLocaleString() || "-"}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {booking.razorpayOrderId || booking._id.slice(-8)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Booked: {formatDate(booking.bookingDate)}
                            </div>
                            
                            {canCancel && (
                              <button
                                onClick={() => handleCancelRequest(booking._id)}
                                className="px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 hover:from-red-200 hover:to-pink-200 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg border border-red-200"
                              >
                                Request Cancellation
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Expandable Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Contact Information */}
                          <div className="bg-gradient-to-br from-gray-50 to-slate-100 p-4 rounded-2xl border border-gray-200/50">
                            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                              <span className="text-lg">📞</span>
                              Contact
                            </h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p className="font-medium">{booking.contactInfo?.name}</p>
                              <p>{booking.contactInfo?.email}</p>
                              <p>{booking.contactInfo?.phone}</p>
                            </div>
                          </div>
                          
                          {/* Tickets Information */}
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-2xl border border-blue-200/50">
                            <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                              <span className="text-lg">🎫</span>
                              Tickets
                            </h4>
                            <div className="flex justify-between text-sm text-blue-700">
                              <div>
                                <span className="font-semibold">Adults:</span> {booking.tickets?.adults || 0}
                              </div>
                              <div>
                                <span className="font-semibold">Children:</span> {booking.tickets?.children || 0}
                              </div>
                            </div>
                          </div>
                          
                          {/* Payment Information */}
                          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-2xl border border-green-200/50">
                            <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                              <span className="text-lg">💳</span>
                              Payment
                            </h4>
                            <div className="space-y-1 text-sm text-green-700">
                              <p><span className="font-semibold">Status:</span> <span className="capitalize">{booking.paymentStatus}</span></p>
                              <p className="text-xs opacity-75">Order: {booking.razorpayOrderId}</p>
                              <p className="text-xs opacity-75">Payment: {booking.razorpayPaymentId}</p>
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
          bookingDetails={bookings.find(b => b._id === selectedBookingId)}
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

