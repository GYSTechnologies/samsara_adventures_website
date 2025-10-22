// src/pages/CustomItineraryPayment.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  X,
  ChevronUp,
  ChevronDown,
  User,
  CreditCard,
  FileText,
  Map,
  CheckSquare,
  XSquare,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import PaymentSuccessModal from "./PaymentSuccessModal";

const CustomItineraryPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tripId = searchParams.get("trip");

  // Remote/data state
  const [fetchLoading, setFetchLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  // Domain state
  const [enquiryId, setEnquiryId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [itineraryData, setItineraryData] = useState(null);

  // UI state
  const [cardOpen, setCardOpen] = useState(true);
  const [policyChecked, setPolicyChecked] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [openDays, setOpenDays] = useState({});

  const getUserFromLocalStorage = () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("user");
      if (raw) return JSON.parse(raw);
    }
    return null;
  };

  const fetchEnquiryId = async (email, tripIdParam) => {
    try {
      const res = await axiosInstance.get("/api/booking/getApprovedBookingIds", {
        params: { email, tripId: tripIdParam },
        headers: {
          Authorization: `Bearer ${getUserFromLocalStorage()?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data?.id) {
        setEnquiryId(res.data.id);
        return res.data.id;
      }
      throw new Error("Enquiry ID not found in response");
    } catch (err) {
      console.error("Error fetching enquiryId:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch booking details. Please go back."
      );
      navigate("/profile", { state: { page: "plans" } });
      return null;
    }
  };

  const fetchItineraryDetails = async (enqId, email) => {
    try {
      const res = await axiosInstance.get(
        `/api/admin/payment/custom-itinerary/${enqId}/${email}`,
        {
          headers: {
            Authorization: `Bearer ${getUserFromLocalStorage()?.token}`,
          },
        }
      );
      if (res.data?.success) {
        setItineraryData(res.data.customItinerary);
        const init = {};
        (res.data.customItinerary?.itinerary || []).forEach((d) => {
          init[d.dayNumber] = false;
        });
        setOpenDays(init);
      } else {
        throw new Error("Failed to load itinerary details");
      }
    } catch (err) {
      console.error("Error fetching itinerary:", err);
      toast.error("Failed to load itinerary details.");
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      const u = getUserFromLocalStorage();
      if (!u) {
        toast.error("No user data found. Please login.");
        navigate("/profile");
        return;
      }
      if (!tripId) {
        toast.error("Trip ID not provided in URL.");
        navigate("/profile", { state: { page: "plans" } });
        return;
      }
      setUserEmail(u.email);

      setFetchLoading(true);
      const enq = await fetchEnquiryId(u.email, tripId);
      if (enq) {
        await fetchItineraryDetails(enq, u.email);
      }
      setFetchLoading(false);
    };
    bootstrap();
  }, [tripId, navigate]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const {
    title,
    description,
    duration,
    startDate,
    endDate,
    pickupDropLocation,
    state: tripState,
    payment,
    itinerary: dailyItinerary,
    inclusions,
    exclusions,
  } = itineraryData || {};

  const grandTotal = payment?.grandTotal || 0;
  const subtotal = payment?.subTotal || 0;
  const taxes = payment?.taxation || 0;
  const insurance = payment?.insurance || 0;
  const activitiesCost = payment?.activities || 0;

  const toggleDay = (dayNumber) =>
    setOpenDays((prev) => ({ ...prev, [dayNumber]: !prev[dayNumber] }));

  const handlePayment = async () => {
    if (!enquiryId) {
      toast.error("Booking details not loaded. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const orderResponse = await axiosInstance.post("/api/payment/create-order", {
        amount: grandTotal * 100,
        currency: "INR",
        receipt: `custom_${enquiryId}_${Date.now()}`,
      });

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;

      script.onload = () => {
        const options = {
          key: razorpayKey,
          amount: grandTotal * 100,
          currency: "INR",
          order_id: orderResponse.data.order_id,
          name: "Samsara Studio",
          description: `Custom Trip: ${title}`,
          image: "/logo.png",
          prefill: {
            name: userEmail?.split("@")[0] || "",
            email: userEmail || "",
            contact: "",
          },
          theme: { color: "#65a30d" },
          handler: async (paymentResponse) => {
            try {
              const verificationData = {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                bookingData: {
                  enquiryId,
                  email: userEmail,
                  totalAmount: grandTotal,
                  tripDetails: itineraryData,
                  paymentDetails: {
                    subtotal,
                    taxation: taxes,
                    insurance,
                    activities: activitiesCost,
                    grandTotal,
                    transactionId: paymentResponse.razorpay_payment_id,
                    orderId: paymentResponse.razorpay_order_id,
                    paymentMethod: "Razorpay",
                    paymentStatus: "SUCCESS",
                  },
                  bookingStatus: "PAID",
                },
              };

              const verification = await axiosInstance.post(
                "/api/payment/verify",
                verificationData
              );

              if (verification.data?.success) {
                setPaymentSuccess(true);
                setBookingId(verification.data?.bookingId);
                toast.success("Payment successful! Your custom trip is confirmed.");
              } else {
                toast.error(
                  `Payment verified but booking update failed: ${verification.data?.message}`
                );
              }
            } catch (e) {
              console.error("Verification error:", e);
              toast.error(
                e.response?.data?.message ||
                  "Payment successful but update failed. Contact support."
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

      document.body.appendChild(script);
    } catch (e) {
      console.error("Payment initialization error:", e);
      toast.error(e.response?.data?.message || "Failed to initialize payment");
      setLoading(false);
    }
  };

  const handleBack = () => navigate("/profile", { state: { page: "plans" } });
  const handleCloseSuccess = () => {
    setPaymentSuccess(false);
    navigate("/profile", { state: { page: "plans" } });
  };

  if (fetchLoading || !itineraryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-lime-500 border-t-transparent mx-auto mb-6"></div>
          <p className="text-lime-700 font-semibold text-lg">Loading your trip details...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "description", label: "Description", icon: FileText },
    { key: "itinerary", label: "Itinerary", icon: Map },
    { key: "inclusions", label: "What's Included", icon: CheckSquare },
    { key: "exclusions", label: "Not Included", icon: XSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50 pb-24 lg:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-lime-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-4"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Confirm Your Trip</h1>
            <p className="text-sm text-gray-600 mt-1">{title}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Trip Overview Card */}
        <section className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <span className="px-3 py-1 bg-lime-100 text-lime-700 rounded-full text-sm font-medium w-fit">
                {duration}
              </span>
            </div>

            {cardOpen && (
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Travel Dates</p>
                    <p className="text-gray-900 font-semibold">
                      {formatDate(startDate)} - {formatDate(endDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Pickup Location</p>
                    <p className="text-gray-900">{pickupDropLocation}</p>
                  </div>
                </div>

                
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <span className="text-xl sm:text-2xl font-bold text-gray-900">Subtotal</span>
              <span className="text-xl sm:text-2xl font-bold text-lime-600">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <button
            onClick={() => setCardOpen(!cardOpen)}
            className="mx-auto my-4 flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
          >
            {cardOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </section>

        {/* Navigation Tabs */}
        <nav className="flex overflow-x-auto pb-2 -mx-4 px-4 hide-scrollbar lg:-mx-0 lg:px-0">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-all mx-1 sm:mx-2 flex-shrink-0 ${
                  activeTab === tab.key
                    ? "bg-lime-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Tab Content */}
        <section className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          {activeTab === "description" && (
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Trip Description
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{description}</p>
            </div>
          )}

          {activeTab === "itinerary" && (
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                <Map className="w-5 h-5 mr-2" />
                Detailed Itinerary
              </h3>
              <div className="space-y-3">
                {dailyItinerary?.map((day) => {
                  const isOpen = openDays[day.dayNumber];
                  return (
                    <div key={day.dayNumber} className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                      <button
                        onClick={() => toggleDay(day.dayNumber)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-white transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                            <span className="text-lime-600 font-bold text-sm">
                              D{day.dayNumber}
                            </span>
                          </div>
                          <div className="text-left">
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{day.title}</h4>
                            {!isOpen && (
                              <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-md line-clamp-2">
                                {day.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <ChevronUp
                          className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                          <p className="text-gray-700 mb-4 mt-2 text-sm sm:text-base">{day.description}</p>
                          <ul className="space-y-2">
                            {day.points?.map((point, idx) => (
                              <li key={idx} className="flex items-start space-x-3 text-gray-700">
                                <div className="w-2 h-2 bg-lime-600 rounded-full mt-2.5 flex-shrink-0"></div>
                                <span className="text-xs sm:text-sm">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "inclusions" && (
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                <CheckSquare className="w-5 h-5 mr-2" />
                What's Included
              </h3>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                {inclusions?.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-lime-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "exclusions" && (
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                <XSquare className="w-5 h-5 mr-2" />
                What's Not Included
              </h3>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                {exclusions?.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Payment Summary */}
        <section className="bg-white rounded-2xl shadow-lg p-4 mb-12 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center">
            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-lime-600" />
            Payment Summary
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between py-2 sm:py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm sm:text-base">Subtotal</span>
              <span className="font-semibold text-sm sm:text-base">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-2 sm:py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm sm:text-base">Taxes & Fees</span>
              <span className="font-semibold text-sm sm:text-base">₹{taxes.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-2 sm:py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm sm:text-base">Travel Insurance</span>
              <span className="font-semibold text-sm sm:text-base">₹{insurance.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-2 sm:py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm sm:text-base">Activities & Extras</span>
              <span className="font-semibold text-sm sm:text-base">₹{activitiesCost.toLocaleString("en-IN")}</span>
            </div>
            <div className="pt-3 sm:pt-4 border-t border-lime-200 flex justify-between items-center">
              <span className="text-lg sm:text-2xl font-bold text-gray-900">Total Amount</span>
              <div className="text-right">
                <span className="text-xl sm:text-3xl font-extrabold text-lime-600">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
                <p className="text-xs sm:text-sm text-gray-500">per person</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Fixed Bottom Action Bar - Only for mobile */}
      <footer className="fixed bottom-10 left-0 right-0 bg-white border-t border-lime-100 shadow-2xl z-50 p-4 lg:hidden">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={handlePayment}
            disabled={loading || !policyChecked || !enquiryId}
            className={`w-full py-3 px-6 rounded-xl font-bold text-base transition-all shadow-lg transform flex items-center justify-center space-x-3 ${
              loading || !policyChecked || !enquiryId
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-lime-600 to-lime-700 text-white hover:from-lime-700 hover:to-lime-800 active:scale-95"
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Pay ₹{grandTotal.toLocaleString("en-IN")}</span>
              </>
            )}
          </button>
          <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-start space-x-3 space-y-2">
                    <input
                      type="checkbox"
                      id="policy-checkbox"
                      checked={policyChecked}
                      onChange={(e) => setPolicyChecked(e.target.checked)}
                      className="mt-0.5 w-5 h-5 accent-lime-600 rounded focus:ring-lime-500"
                    />
                    <label
                      htmlFor="policy-checkbox"
                      className="text-sm text-gray-700 cursor-pointer flex-1"
                    >
                      I agree to the <span className="text-lime-600 font-medium">Refund & Cancellation Policies</span>
                    </label>
                  </div>
                </div>
          {!policyChecked && (
            <p className="text-center text-xs text-red-600 mt-2">
              Please agree to the policies to proceed
            </p>
          )}
        </div>
      </footer>

      {/* Static Action Bar - For desktop */}
      <footer className="hidden lg:block bg-white border-t border-lime-100 shadow-lg z-40 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-lime-600">₹{grandTotal.toLocaleString("en-IN")}</p>
              </div>
              {!policyChecked && (
                <p className="text-sm text-red-600">
                  Please agree to the policies to proceed
                </p>
              )}
            </div>
            <button
              onClick={handlePayment}
              disabled={loading || !policyChecked || !enquiryId}
              className={`px-8 py-3 rounded-xl font-bold text-base transition-all shadow-lg transform flex items-center justify-center space-x-3 min-w-[200px] ${
                loading || !policyChecked || !enquiryId
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-lime-600 to-lime-700 text-white hover:from-lime-700 hover:to-lime-800 active:scale-95"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Pay Now</span>
                </>
              )}
            </button>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="policy-checkbox"
                      checked={policyChecked}
                      onChange={(e) => setPolicyChecked(e.target.checked)}
                      className="mt-0.5 w-5 h-5 accent-lime-600 rounded focus:ring-lime-500"
                    />
                    <label
                      htmlFor="policy-checkbox"
                      className="text-sm text-gray-700 cursor-pointer flex-1"
                    >
                      I agree to the <span className="text-lime-600 font-medium">Refund & Cancellation Policies</span>
                    </label>
                  </div>
                </div>
        </div>
      </footer>

      {/* Success Modal */}
      <PaymentSuccessModal
        isOpen={paymentSuccess}
        onClose={handleCloseSuccess}
        bookingId={bookingId}
        isCustomRequest={true}
      />

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CustomItineraryPayment;