// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import EventOverview from "../../components/admin/EventOverview.jsx";
// import EventManagement from "../../components/admin/EventManagement.jsx";
// import PaymentManagement from "../../components/admin/PaymentManagement.jsx";
// import EventForm from "../../components/admin/EventForm.jsx";
// import axiosInstance from "../../api/axiosInstance.js";

// const AdminEvents = () => {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [events, setEvents] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [showEventForm, setShowEventForm] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [stats, setStats] = useState({
//     totalEvents: 0,
//     totalBookings: 0,
//     totalRevenue: 0,
//     pendingCancellations: 0,
//   });

//   // Fetch all data
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [eventsRes, bookingsRes] = await Promise.all([
//         axiosInstance.get("/api/events/admin/events"),
//         axiosInstance.get("/api/events/admin/bookings"),
//       ]);

//       setEvents(eventsRes.data.events);
//       setBookings(bookingsRes.data.bookings);
//       calculateStats(eventsRes.data.events, bookingsRes.data.bookings);
//     } catch (error) {
//       toast.error("Failed to fetch data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = (eventsData, bookingsData) => {
//     const totalEvents = eventsData.length;
//     const totalBookings = bookingsData.length;
//     const totalRevenue = bookingsData
//       .filter((b) => b.paymentStatus === "paid")
//       .reduce((sum, booking) => sum + booking.totalAmount, 0);

//     const pendingCancellations = bookingsData.filter(
//       (b) => b.status === "cancellation_requested"
//     ).length;

//     setStats({
//       totalEvents,
//       totalBookings,
//       totalRevenue,
//       pendingCancellations,
//     });
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Event form handlers
//   const handleCreateEvent = () => {
//     setSelectedEvent(null);
//     setShowEventForm(true);
//   };

//   const handleEditEvent = (event) => {
//     setSelectedEvent(event);
//     setShowEventForm(true);
//   };

//   const handleCloseForm = () => {
//     setShowEventForm(false);
//     setSelectedEvent(null);
//   };

//   // const handleSaveEvent = async (eventData) => {
//   //   try {
//   //     // Create FormData object
//   //     const formData = new FormData();

//   //     // Extract image data from eventData
//   //     const { coverImage, scheduleItems, includedItems, ...restData } = eventData;

//   //     // Append all non-image fields
//   //     Object.keys(restData).forEach(key => {
//   //       if (key === 'highlights' || key === 'inclusions' || key === 'exclusions' || key === 'termsConditions') {
//   //         // For array fields, append each item individually
//   //         restData[key].forEach((item, index) => {
//   //           formData.append(`${key}[${index}]`, item);
//   //         });
//   //       } else {
//   //         formData.append(key, restData[key]);
//   //       }
//   //     });

//   //     // Append scheduleItems and includedItems as individual objects
//   //     scheduleItems.forEach((item, index) => {
//   //       formData.append(`scheduleItems[${index}][time]`, item.time);
//   //       formData.append(`scheduleItems[${index}][activity]`, item.activity);
//   //       if (item.image && item.image instanceof File) {
//   //         formData.append(`scheduleItems[${index}][image]`, item.image);
//   //       }
//   //     });

//   //     includedItems.forEach((item, index) => {
//   //       formData.append(`includedItems[${index}][description]`, item.description);
//   //       if (item.image && item.image instanceof File) {
//   //         formData.append(`includedItems[${index}][image]`, item.image);
//   //       }
//   //     });

//   //     // Convert base64 cover image to file if it's a new image
//   //     if (coverImage && coverImage.startsWith('data:image')) {
//   //       const coverFile = dataURLtoFile(coverImage, 'coverImage');
//   //       formData.append('coverImage', coverFile);
//   //     } else if (coverImage === null) {
//   //       // Handle case where cover image was removed
//   //       formData.append('removeCoverImage', 'true');
//   //     } else if (coverImage instanceof File) {
//   //       formData.append('coverImage', coverImage);
//   //     }

//   //     if (selectedEvent) {
//   //       await axiosInstance.put(`/api/events/${selectedEvent._id}`, formData, {
//   //         headers: {
//   //           'Content-Type': 'multipart/form-data'
//   //         }
//   //       });
//   //       toast.success('Event updated successfully');
//   //     } else {
//   //       await axiosInstance.post('/api/events', formData, {
//   //         headers: {
//   //           'Content-Type': 'multipart/form-data'
//   //         }
//   //       });
//   //       toast.success('Event created successfully');
//   //     }

//   //     setShowEventForm(false);
//   //     setSelectedEvent(null);
//   //     fetchData();
//   //   } catch (error) {
//   //     toast.error('Failed to save event');
//   //     console.error('Save error:', error);
//   //   }
//   // };

//   // const handleSaveEvent = async (eventData) => {
//   //   try {
//   //     const formData = new FormData();

//   //     // Append all simple fields
//   //     Object.keys(eventData).forEach((key) => {
//   //       if (
//   //         key !== "coverImage" &&
//   //         key !== "scheduleItems" &&
//   //         key !== "includedItems"
//   //       ) {
//   //         if (Array.isArray(eventData[key])) {
//   //           formData.append(key, JSON.stringify(eventData[key]));
//   //         } else {
//   //           formData.append(key, eventData[key]);
//   //         }
//   //       }
//   //     });

//   //     // Append cover image
//   //     if (eventData.coverImage && eventData.coverImage.file) {
//   //       formData.append("coverImage", eventData.coverImage.file);
//   //     }

//   //     // Append schedule items
//   //     eventData.scheduleItems.forEach((item, index) => {
//   //       formData.append(`scheduleItems[${index}][time]`, item.time);
//   //       formData.append(`scheduleItems[${index}][activity]`, item.activity);
//   //       if (item.image && item.image.file) {
//   //         formData.append(`scheduleItems[${index}][image]`, item.image.file);
//   //       }
//   //     });

//   //     // Append included items
//   //     eventData.includedItems.forEach((item, index) => {
//   //       formData.append(
//   //         `includedItems[${index}][description]`,
//   //         item.description
//   //       );
//   //       if (item.image && item.image.file) {
//   //         formData.append(`includedItems[${index}][image]`, item.image.file);
//   //       }
//   //     });

//   //     // Make API call
//   //     if (selectedEvent) {
//   //       await axiosInstance.put(`/api/events/${selectedEvent._id}`, formData, {
//   //         headers: {
//   //           "Content-Type": "multipart/form-data",
//   //         },
//   //       });
//   //       toast.success("Event updated successfully");
//   //     } else {
//   //       await axiosInstance.post("/api/events", formData, {
//   //         headers: {
//   //           "Content-Type": "multipart/form-data",
//   //         },
//   //       });
//   //       toast.success("Event created successfully");
//   //     }

//   //     setShowEventForm(false);
//   //     setSelectedEvent(null);
//   //     fetchData();
//   //   } catch (error) {
//   //     toast.error("Failed to save event");
//   //     console.error("Save error:", error);
//   //   }
//   // };

//   const handleSaveEvent = async (eventData) => {
//     try {
//       const formData = new FormData();

//       // Append all simple fields
//       Object.keys(eventData).forEach((key) => {
//         if (
//           key !== "coverImage" &&
//           key !== "scheduleItems" &&
//           key !== "includedItems"
//         ) {
//           if (Array.isArray(eventData[key])) {
//             formData.append(key, JSON.stringify(eventData[key]));
//           } else {
//             formData.append(key, eventData[key]);
//           }
//         }
//       });

//       // Append cover image as File
//       if (coverImageFile) {
//         formData.append("coverImage", coverImageFile);
//       }

//       // Append schedule items with images
//       eventData.scheduleItems.forEach((item, index) => {
//         formData.append(`scheduleItems[${index}][time]`, item.time);
//         formData.append(`scheduleItems[${index}][activity]`, item.activity);

//         // Append the actual File object, not the base64 preview
//         if (scheduleItemFiles[index]) {
//           formData.append(
//             `scheduleItems[${index}][image]`,
//             scheduleItemFiles[index]
//           );
//         } else if (
//           item.image &&
//           typeof item.image === "string" &&
//           !item.image.startsWith("data:")
//         ) {
//           // If it's an existing image URL (not base64), keep it
//           formData.append(`scheduleItems[${index}][image]`, item.image);
//         }
//       });

//       // Append included items with images
//       eventData.includedItems.forEach((item, index) => {
//         formData.append(
//           `includedItems[${index}][description]`,
//           item.description
//         );

//         // Append the actual File object
//         if (includedItemFiles[index]) {
//           formData.append(
//             `includedItems[${index}][image]`,
//             includedItemFiles[index]
//           );
//         } else if (
//           item.image &&
//           typeof item.image === "string" &&
//           !item.image.startsWith("data:")
//         ) {
//           // If it's an existing image URL, keep it
//           formData.append(`includedItems[${index}][image]`, item.image);
//         }
//       });

//       // Make API call
//       if (selectedEvent) {
//         await axiosInstance.put(`/api/events/${selectedEvent._id}`, formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
//         toast.success("Event updated successfully");
//       } else {
//         await axiosInstance.post("/api/events", formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
//         toast.success("Event created successfully");
//       }

//       setShowEventForm(false);
//       setSelectedEvent(null);
//       fetchData();
//     } catch (error) {
//       toast.error("Failed to save event");
//       console.error("Save error:", error.response?.data || error.message);
//     }
//   };

//   const handleApproveRefund = async (bookingId) => {
//     try {
//       await axiosInstance.post("/api/events/admin/approve-cancellation", {
//         bookingId,
//       });
//       toast.success("Refund processed successfully");
//       fetchData();
//     } catch (error) {
//       toast.error("Failed to process refund");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <ToastContainer position="top-right" autoClose={3000} />

//       {/* Header */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <h1 className="text-3xl font-bold text-gray-800">Event Management</h1>

//           <div className="flex flex-wrap gap-2">
//             <button
//               className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                 activeTab === "overview"
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//               onClick={() => setActiveTab("overview")}
//             >
//               Overview
//             </button>
//             <button
//               className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                 activeTab === "events"
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//               onClick={() => setActiveTab("events")}
//             >
//               Events
//             </button>
//             <button
//               className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                 activeTab === "payments"
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//               onClick={() => setActiveTab("payments")}
//             >
//               Payments & Refunds
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         {activeTab === "overview" && (
//           <EventOverview stats={stats} events={events} bookings={bookings} />
//         )}

//         {activeTab === "events" && (
//           <EventManagement
//             events={events}
//             onEditEvent={handleEditEvent}
//             onCreateEvent={handleCreateEvent}
//             loading={loading}
//             onRefresh={fetchData}
//           />
//         )}

//         {activeTab === "payments" && (
//           <PaymentManagement
//             bookings={bookings}
//             onApproveRefund={handleApproveRefund}
//             loading={loading}
//           />
//         )}
//       </div>

//       {/* Event Form Modal */}
//       {showEventForm && (
//         <EventForm
//           event={selectedEvent}
//           onClose={handleCloseForm}
//           onSave={handleSaveEvent}
//         />
//       )}
//     </div>
//   );
// };

// export default AdminEvents;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EventOverview from "../../components/admin/EventOverview.jsx";
import EventManagement from "../../components/admin/EventManagement.jsx";
import PaymentManagement from "../../components/admin/PaymentManagement.jsx";
import EventForm from "../../components/admin/EventForm.jsx";
import axiosInstance from "../../api/axiosInstance.js";

const AdminEvents = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingCancellations: 0,
  });

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsRes, bookingsRes] = await Promise.all([
        axiosInstance.get("/api/events/admin/events"),
        axiosInstance.get("/api/events/admin/bookings"),
      ]);

      setEvents(eventsRes.data.events);
      setBookings(bookingsRes.data.bookings);
      calculateStats(eventsRes.data.events, bookingsRes.data.bookings);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (eventsData, bookingsData) => {
    const totalEvents = eventsData.length;
    const totalBookings = bookingsData.length;
    const totalRevenue = bookingsData
      .filter((b) => b.paymentStatus === "paid")
      .reduce((sum, booking) => sum + booking.totalAmount, 0);

    const pendingCancellations = bookingsData.filter(
      (b) => b.status === "cancellation_requested"
    ).length;

    setStats({
      totalEvents,
      totalBookings,
      totalRevenue,
      pendingCancellations,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Event form handlers
  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowEventForm(true);
  };

  const handleCloseForm = () => {
    setShowEventForm(false);
    setSelectedEvent(null);
  };

  const handleSaveEvent = async (formDataToSend) => {
    try {
      // Make API call - directly use the FormData object from EventForm
      if (selectedEvent) {
        await axiosInstance.put(
          `/api/events/${selectedEvent._id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Event updated successfully");
      } else {
        await axiosInstance.post("/api/events", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Event created successfully");
      }

      setShowEventForm(false);
      setSelectedEvent(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to save event");
      console.error("Save error:", error);
    }
  };

  const handleApproveRefund = async (bookingId) => {
    try {
      await axiosInstance.post("/api/events/admin/approve-cancellation", {
        bookingId,
      });
      toast.success("Refund processed successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to process refund");
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header - Fixed */}
      <div className="bg-white shadow-md p-4 sm:p-6 flex-shrink-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Event Management
          </h1>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              className={`px-3 py-2 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base flex-1 sm:flex-none ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-3 py-2 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base flex-1 sm:flex-none ${
                activeTab === "events"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("events")}
            >
              Events
            </button>
            <button
              className={`px-3 py-2 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base flex-1 sm:flex-none ${
                activeTab === "payments"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("payments")}
            >
              <span className="hidden sm:inline">Payments & Refunds</span>
              <span className="sm:hidden">Payments</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
          <div className="p-4 sm:p-6">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 min-h-full">
              {activeTab === "overview" && (
                <EventOverview
                  stats={stats}
                  events={events}
                  bookings={bookings}
                />
              )}

              {activeTab === "events" && (
                <EventManagement
                  events={events}
                  onEditEvent={handleEditEvent}
                  onCreateEvent={handleCreateEvent}
                  loading={loading}
                  onRefresh={fetchData}
                />
              )}

              {activeTab === "payments" && (
                <PaymentManagement
                  bookings={bookings}
                  onApproveRefund={handleApproveRefund}
                  loading={loading}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <EventForm
          event={selectedEvent}
          onClose={handleCloseForm}
          onSave={handleSaveEvent}
        />
      )}
    </div>
  );
};

export default AdminEvents;
