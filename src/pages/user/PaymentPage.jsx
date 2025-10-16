import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import PackageBooking from "./PackageBooking";
import CustomTripRequest from "./CustomTripRequest";

const PaymentPage = () => {
  const { tripId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [customItineraryData, setCustomItineraryData] = useState(null);

  // Determine trip type
  const isCustomTrip =
    state?.isCustomTrip || state?.tripDetails?.tripType === "CUSTOMIZED";

  const { bookingData, tripDetails } = state || {};
  const { enquiryId } = bookingData || {};

  // Fetch custom itinerary if needed
  useEffect(() => {
    const fetchCustomItinerary = async () => {
      if (isCustomTrip && enquiryId && user?.email) {
        try {
          setFetchLoading(true);
          const response = await axiosInstance.get(
            `/api/admin/payment/custom-itinerary/${enquiryId}/${user.email}`
          );
          if (response.data.success) {
            setCustomItineraryData(response.data.customItinerary);
          }
        } catch (error) {
          console.error("Error fetching custom itinerary:", error);
          toast.error("Failed to load custom itinerary");
        } finally {
          setFetchLoading(false);
        }
      }
    };
    fetchCustomItinerary();
  }, [isCustomTrip, enquiryId, user?.email]);

  // Redirect if no state
  useEffect(() => {
    if (!state || !tripDetails) {
      toast.error("Invalid booking data. Redirecting...");
      navigate(`/trip/${tripId || ""}`);
    }
  }, [state, tripDetails, navigate, tripId]);

  // Loading state
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-[#f0f2d9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-lime-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lime-900 font-medium">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // Render appropriate component based on trip type
  return isCustomTrip ? (
    <CustomTripRequest
      tripId={tripId}
      bookingData={bookingData}
      tripDetails={tripDetails}
      customItineraryData={customItineraryData}
      user={user}
      navigate={navigate}
    />
  ) : (
    <PackageBooking
      tripId={tripId}
      bookingData={bookingData}
      tripDetails={tripDetails}
      user={user}
      navigate={navigate}
    />
  );
};

export default PaymentPage;
