// src/pages/Profile/MyPlans.jsx - Updated MyPlans component with new "Customized Plans" section
// Assumes existing structure with tabs/sections for "Upcoming Trips", etc. Add this as a new tab/section.
// Import axiosInstance and useNavigate, useParams where needed.

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext"; // Assuming auth context for user email
import { Calendar, MapPin, Clock, User } from "lucide-react";
import { toast } from "react-toastify";

// New sub-component for Customized Plans section
const CustomizedPlansSection = ({ userEmail }) => {
  const [customBookings, setCustomBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomBookings = async () => {
      if (!userEmail) {
        setError("User email not available. Please log in.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Step 1: Get approved booking IDs for custom trips
        const approvedResponse = await axiosInstance.get("/api/booking/getApprovedBookingIds", {
          params: { email: userEmail } // Assuming this API accepts email param; adjust if needed
        });

        const approvedIds = approvedResponse.data || []; // Expect array of enquiryIds

        if (!Array.isArray(approvedIds) || approvedIds.length === 0) {
          setCustomBookings([]);
          return;
        }

        // Step 2: For each ID, fetch custom itinerary details
        const itineraryPromises = approvedIds.map(async (enquiryId) => {
          try {
            const itineraryResponse = await axiosInstance.get(
              `/api/admin/payment/custom-itinerary/${enquiryId}/${userEmail}`
            );
            if (itineraryResponse.data.success) {
              return {
                enquiryId,
                ...itineraryResponse.data.customItinerary,
                bookingStatus: itineraryResponse.data.bookingStatus,
              };
            }
            return null;
          } catch (err) {
            console.error(`Error fetching itinerary for ${enquiryId}:`, err);
            return null;
          }
        });

        const itineraries = (await Promise.all(itineraryPromises)).filter(Boolean);
        setCustomBookings(itineraries);
      } catch (err) {
        console.error("Error fetching custom bookings:", err);
        setError(err.response?.data?.message || "Failed to load customized plans.");
        toast.error("Failed to load customized plans.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomBookings();
  }, [userEmail]);

  const handlePayNow = (enquiryId, itineraryData) => {
    // Navigate to custom payment page with enquiryId and itinerary details
    navigate("/custom-itinerary-payment", {
      state: {
        enquiryId,
        itinerary: itineraryData,
        userEmail,
      },
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-lime-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">Loading customized plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (customBookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Customized Plans Yet</h3>
        <p className="text-gray-600">Submit a custom request to get personalized itineraries.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-lime-900">Customized Plans</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customBookings.map((booking) => (
          <div key={booking.enquiryId} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Image - Use first image or placeholder */}
            <img
              src={booking.images?.[0] || "/placeholder-trip.jpg"}
              alt={booking.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lime-900 text-lg">{booking.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  booking.bookingStatus === "APPROVED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}>
                  {booking.bookingStatus}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{booking.description}</p>
              <div className="space-y-2 mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-lime-600" />
                  <span>{booking.state} - {booking.pickupDropLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-lime-600" />
                  <span>{booking.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-lime-600" />
                  <span>₹{booking.payment?.grandTotal?.toLocaleString("en-IN")}</span>
                </div>
              </div>
              {booking.bookingStatus === "APPROVED" && (
                <button
                  onClick={() => handlePayNow(booking.enquiryId, booking)}
                  className="w-full bg-lime-600 hover:bg-lime-700 text-white font-semibold py-2.5 rounded-lg transition"
                >
                  Pay Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// In your main MyPlans component, add the section:
// Assuming tabs like Upcoming, Past, etc. Add a new tab for "Customized"
const MyPlans = () => {
  const { user } = useAuth();
  const userEmail = user?.email;

  return (
    <div className="p-4 md:p-6">
      {/* Existing sections: Upcoming, Past Trips, etc. */}
      
      {/* New Customized Plans Section */}
      <div className="mt-8">
        <CustomizedPlansSection userEmail={userEmail} />
      </div>
    </div>
  );
};

export default MyPlans;
