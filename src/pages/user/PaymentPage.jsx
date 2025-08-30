// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import {
//   MapPin,
//   Calendar,
//   Users,
//   Check,
//   User,
//   Mail,
//   Phone,
//   ChevronDown,
//   ChevronUp,
// } from "lucide-react";
// import axiosInstance from "../../api/axiosInstance";
// import { useAuth } from "../../context/AuthContext";
// import { toast } from "react-toastify";

// const PaymentPage = () => {
//   const { tripId } = useParams();
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   // State
//   const [loading, setLoading] = useState(false);
//   const [paymentSuccess, setPaymentSuccess] = useState(false);
//   const [customItineraryData, setCustomItineraryData] = useState(null);
//   const [fetchLoading, setFetchLoading] = useState(false);
//   const [expandedDay, setExpandedDay] = useState(null);

//   // Check if custom trip
//   const isCustomTrip = state?.isCustomTrip || state?.tripDetails?.tripType === "CUSTOMIZED";

//   // Data from booking
//   const { bookingData, tripDetails } = state || {};

//   const {
//     adults = 1,
//     children = 0,
//     email,
//     phone,
//     fullName,
//     enquiryId,
//   } = bookingData || {};

//   const {
//     title,
//     images,
//     duration,
//     inclusions,
//     payment: originalPayment,
//     startDate,
//     endDate,
//     pickupDropLocation,
//     itinerary: originalItinerary,
//   } = tripDetails || {};

//   // Toggle day expansion
//   const toggleDay = (dayNumber) => {
//     setExpandedDay(expandedDay === dayNumber ? null : dayNumber);
//   };

//   // ✅ FETCH LATEST CUSTOM ITINERARY FOR PAYMENT PAGE
//   useEffect(() => {
//     const fetchLatestCustomItinerary = async () => {
//       if (isCustomTrip && enquiryId && user?.email) {

//         try {
//           setFetchLoading(true);
//           const response = await axiosInstance.get(
//             `/api/admin/payment/custom-itinerary/${enquiryId}/${user.email}`
//           );

//           if (response.data.success) {
//             setCustomItineraryData(response.data.customItinerary);
//           }
//         } catch (error) {
//           console.error('Error fetching latest custom itinerary:', error);
//           // Fallback to original data if custom fetch fails
//           toast.error('Failed to load updated itinerary. Showing original details.');
//         } finally {
//           setFetchLoading(false);
//         }
//       } else {
//         setFetchLoading(false);
//       }
//     };

//     fetchLatestCustomItinerary();
//   }, [isCustomTrip, enquiryId, user?.email]);

//   // ✅ USE LATEST CUSTOM DATA OR FALLBACK TO ORIGINAL
//   const effectivePayment = customItineraryData?.payment || tripDetails?.payment;
//   const effectiveItinerary = customItineraryData?.itinerary || tripDetails?.itinerary;

//   // Price Calculation
//   const calculatePrices = () => {
//     const totalPersons = adults + children;
//     return {
//       base: Math.round((effectivePayment?.subTotal || 0) * totalPersons),
//       taxes: Math.round((effectivePayment?.taxation || 0) * totalPersons),
//       insurance: Math.round((effectivePayment?.insurance || 0) * totalPersons),
//       total: Math.round((effectivePayment?.grandTotal || 0) * totalPersons),
//       discount: Math.round(
//         ((effectivePayment?.actualPrice || 0) - (effectivePayment?.subTotal || 0)) * totalPersons
//       ),
//     };
//   };

//   const { base, taxes, insurance, total, discount } = calculatePrices();

//   const handlePayment = async () => {
//     setLoading(true);
//     try {
//       const orderResponse = await axiosInstance.post(
//         "/api/payment/create-order",
//         {
//           amount: total * 100,
//           currency: "INR",
//           receipt: `trip_${tripId}_${Date.now()}`,
//         }
//       );

//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";

//       script.onload = () => {
//         const options = {
//           key: "rzp_test_iRgVqBj04lX5vr",
//           amount: total * 100,
//           currency: "INR",
//           order_id: orderResponse.data.order_id,
//           name: "Booking",
//           description: `Booking for ${title}`,
//           prefill: {
//             name: user?.name || fullName,
//             email: user?.email || email,
//             contact: phone,
//           },
//           handler: async (paymentResponse) => {
//             try {
//               const verificationData = {
//                 ...paymentResponse,
//                 bookingData: {
//                   ...bookingData,
//                   tripId,
//                   userId: user?._id,
//                   tripDetails: {
//                     title,
//                     duration,
//                     startDate,
//                     endDate,
//                     images,
//                     payment: effectivePayment,
//                     tripType: tripDetails?.tripType,
//                     pickupDropLocation,
//                     itinerary: effectiveItinerary,
//                   },
//                   totalAmount: total,
//                   paymentDetails: {
//                     subtotal: effectivePayment?.subTotal,
//                     taxation: effectivePayment?.taxation,
//                     insurance: effectivePayment?.insurance,
//                     activities: effectivePayment?.activities,
//                     grandTotal: total,
//                     transactionId: paymentResponse.razorpay_payment_id,
//                   },
//                 },
//               };
//               const verification = await axiosInstance.post(
//                 "/api/payment/verify",
//                 verificationData
//               );
//               if (verification.data.success) setPaymentSuccess(true);
//               else
//                 alert(
//                   `Payment verified but booking failed: ${verification.data.message}`
//                 );
//             } catch (error) {
//               console.error("Verification error:", error);
//               alert(
//                 `Payment successful! Booking ID: ${paymentResponse.razorpay_payment_id}. Contact support if needed.`
//               );
//             }
//           },
//           theme: { color: "#3399cc" },
//           modal: {
//             ondismiss: () =>
//               alert("Payment window closed. Your order is still pending."),
//           },
//         };

//         new window.Razorpay(options).open();
//       };

//       script.onerror = () => {
//         throw new Error("Failed to load Razorpay SDK");
//       };
//       document.body.appendChild(script);
//     } catch (error) {
//       alert(error.response?.data?.message || "Payment initialization failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!state) navigate(`/trip/${tripId}`);
//   }, [state, navigate, tripId]);

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-15">
//       <div className="max-w-7xl mx-auto">
//         {/* Success Message */}
//         {paymentSuccess && (
//           <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
//             <div className="flex items-center">
//               <Check className="h-5 w-5 text-green-500 mr-2" />
//               <p className="font-medium text-green-800">
//                 Payment Successful! Booking confirmed.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Loading State for Custom Itinerary */}
//         {fetchLoading && (
//           <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6 rounded-lg">
//             <div className="flex items-center">
//               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
//               <p className="font-medium text-blue-800">Loading your customized itinerary...</p>
//             </div>
//           </div>
//         )}

//         <h1 className="text-2xl font-bold text-gray-900 mb-6">
//           Complete Your Payment
//         </h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Trip Summary */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-lg font-semibold mb-4">Trip Details</h2>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <img
//                   src={images?.[0]}
//                   alt={title}
//                   className="w-full sm:w-32 h-32 object-cover rounded-lg"
//                 />
//                 <div className="space-y-2">
//                   <h3 className="font-medium">{title}</h3>
//                   {isCustomTrip && (
//                     <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
//                       Customized
//                     </span>
//                   )}
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <Calendar size={14} />
//                     <span>Duration: {duration}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <Calendar size={14} />
//                     <span>
//                       {new Date(startDate).toLocaleDateString("en-GB", {
//                         day: "2-digit",
//                         month: "short",
//                         year: "numeric",
//                       })}{" "}
//                       -{" "}
//                       {new Date(endDate).toLocaleDateString("en-GB", {
//                         day: "2-digit",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <Users size={14} />
//                     <span>
//                       {adults} Adult{adults !== 1 ? "s" : ""}
//                       {children > 0 &&
//                         `, ${children} Child${children !== 1 ? "ren" : ""}`}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <MapPin size={14} />
//                     <span>Pickup: {pickupDropLocation}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* CUSTOM ITINERARY SECTION - SAME UI AS DETAIL PAGE */}
//             {isCustomTrip && effectiveItinerary?.length > 0 && (
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-lg font-semibold mb-4">Your Custom Itinerary</h2>
//                 <div className="space-y-3">
//                   {effectiveItinerary.map((day) => (
//                     <div
//                       key={day.dayNumber}
//                       className="border border-gray-200 rounded-lg overflow-hidden"
//                     >
//                       <button
//                         onClick={() => toggleDay(day.dayNumber)}
//                         className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
//                         aria-expanded={expandedDay === day.dayNumber}
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
//                             {day.dayNumber}
//                           </div>
//                           <div>
//                             <span className="font-medium text-gray-900">
//                               Day {day.dayNumber}
//                             </span>
//                             <p className="text-sm text-gray-600">{day.title}</p>
//                           </div>
//                         </div>
//                         {expandedDay === day.dayNumber ? (
//                           <ChevronUp className="w-5 h-5 text-gray-400" />
//                         ) : (
//                           <ChevronDown className="w-5 h-5 text-gray-400" />
//                         )}
//                       </button>

//                       {expandedDay === day.dayNumber && (
//                         <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
//                           <h4 className="font-medium text-gray-900 mb-2 mt-3">
//                             {day.title}
//                           </h4>
//                           <p className="text-gray-600 text-sm leading-relaxed mb-3">
//                             {day.description}
//                           </p>
//                           {day.points?.length > 0 && (
//                             <div className="space-y-2">
//                               <h5 className="text-sm font-medium text-gray-700">
//                                 Highlights:
//                               </h5>
//                               <ul className="space-y-1">
//                                 {day.points.map((point, idx) => (
//                                   <li key={idx} className="flex items-start gap-2">
//                                     <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
//                                     <span className="text-gray-600 text-sm">
//                                       {point}
//                                     </span>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* User Information */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-lg font-semibold mb-4">Booking Information</h2>
//               <div className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <User className="h-5 w-5 text-gray-500" />
//                   <span>{user?.name || fullName}</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <Mail className="h-5 w-5 text-gray-500" />
//                   <span>{user?.email || email}</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <Phone className="h-5 w-5 text-gray-500" />
//                   <span>{phone}</span>
//                 </div>

//                 {isCustomTrip && bookingData?.specialRequests && (
//                   <div className="mt-4 pt-4 border-t border-gray-200">
//                     <h3 className="font-medium text-gray-700 mb-2">Special Requests</h3>
//                     <p className="text-sm text-gray-600">{bookingData.specialRequests}</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Price Breakdown */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-lg font-semibold mb-4">Price Breakdown</h2>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span>Base Price</span>
//                   <span>₹{base.toLocaleString("en-IN")}</span>
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-600">
//                   <span>Taxes & Fees</span>
//                   <span>₹{taxes.toLocaleString("en-IN")}</span>
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-600">
//                   <span>Insurance</span>
//                   <span>₹{insurance.toLocaleString("en-IN")}</span>
//                 </div>
//                 {discount > 0 && (
//                   <div className="flex justify-between text-green-600">
//                     <span>Discount</span>
//                     <span>-₹{discount.toLocaleString("en-IN")}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Right Column */}
//           <div className="space-y-6">
//             {/* Inclusions */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-lg font-semibold mb-3">What's Included</h2>
//               <ul className="space-y-2">
//                 {inclusions?.map((item, index) => (
//                   <li key={index} className="flex items-center gap-2">
//                     <Check className="h-4 w-4 text-green-500" />
//                     <span className="text-sm">{item}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {isCustomTrip && bookingData?.addOnServices && bookingData.addOnServices.length > 0 && (
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-lg font-semibold mb-4">Additional Services</h2>
//                 <ul className="space-y-2">
//                   {bookingData.addOnServices.map((service, index) => (
//                     <li key={index} className="flex items-center gap-2">
//                       <Check className="h-4 w-4 text-green-500" />
//                       <span className="text-sm">{service}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {/* Payment Summary */}
//             <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
//               <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span>Total Persons</span>
//                   <span>{adults + children}</span>
//                 </div>
//                 <div className="pt-3 border-t border-gray-200">
//                   <div className="flex justify-between font-medium">
//                     <span>Total Amount</span>
//                     <span>₹{total.toLocaleString("en-IN")}</span>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={handlePayment}
//                 disabled={loading || paymentSuccess || fetchLoading}
//                 className={`w-full mt-6 py-3 px-4 rounded-md font-medium text-white ${
//                   loading || fetchLoading
//                     ? "bg-blue-400"
//                     : paymentSuccess
//                     ? "bg-green-500"
//                     : "bg-blue-600 hover:bg-blue-700"
//                 }`}
//               >
//                 {fetchLoading
//                   ? "Loading..."
//                   : loading
//                   ? "Processing..."
//                   : paymentSuccess
//                   ? "Paid Successfully"
//                   : `Pay ₹${total.toLocaleString("en-IN")}`}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;

// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import {
//   MapPin,
//   Calendar,
//   Users,
//   Check,
//   User,
//   Mail,
//   Phone,
//   ChevronDown,
//   ChevronUp,
//   CreditCard,
//   Shield,
//   Clock,
//   Star,
//   Heart,
//   Package,
//   Gift,
//   AlertCircle,
//   Info,
//   Banknote,
//   Receipt,
// } from "lucide-react";
// import axiosInstance from "../../api/axiosInstance";
// import { useAuth } from "../../context/AuthContext";
// import { toast } from "react-toastify";
// // Add this import with your other imports
// import PaymentSuccessModal from "../../components/user/PaymentSuccessModal";

// const PaymentPage = () => {
//   const { tripId } = useParams();
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   // State
//   const [loading, setLoading] = useState(false);
//   const [paymentSuccess, setPaymentSuccess] = useState(false);
//   const [customItineraryData, setCustomItineraryData] = useState(null);
//   const [fetchLoading, setFetchLoading] = useState(false);
//   const [expandedDay, setExpandedDay] = useState(null);
//   const [selectedPaymentMethod, setSelectedPaymentMethod] =
//     useState("razorpay");

//   // Add this state with your other useState declarations
//   const [bookingId, setBookingId] = useState(null);
//   // Check if custom trip
//   const isCustomTrip =
//     state?.isCustomTrip || state?.tripDetails?.tripType === "CUSTOMIZED";

//   // Data from booking
//   const { bookingData, tripDetails } = state || {};
//   const {
//     adults = 1,
//     children = 0,
//     email,
//     phone,
//     fullName,
//     enquiryId,
//     specialRequests,
//     addOnServices = [],
//   } = bookingData || {};

//   const {
//     title,
//     images,
//     duration,
//     inclusions,
//     payment: originalPayment,
//     startDate,
//     endDate,
//     pickupDropLocation,
//     itinerary: originalItinerary,
//     state: tripState,
//     category,
//   } = tripDetails || {};

//   // Toggle day expansion
//   const toggleDay = (dayNumber) => {
//     setExpandedDay(expandedDay === dayNumber ? null : dayNumber);
//   };

//   // Fetch custom itinerary
//   useEffect(() => {
//     const fetchCustomItinerary = async () => {
//       if (isCustomTrip && enquiryId && user?.email) {
//         try {
//           setFetchLoading(true);
//           const response = await axiosInstance.get(
//             `/api/admin/payment/custom-itinerary/${enquiryId}/${user.email}`
//           );

//           if (response.data.success) {
//             setCustomItineraryData(response.data.customItinerary);
//           }
//         } catch (error) {
//           console.error("Error fetching custom itinerary:", error);
//           // Fallback to original data if custom fetch fails
//         } finally {
//           setFetchLoading(false);
//         }
//       } else {
//         setFetchLoading(false);
//       }
//     };

//     fetchCustomItinerary();
//   }, [isCustomTrip, enquiryId, user?.email]);

//   // Use custom data if available, otherwise use original
//   const effectivePayment = customItineraryData?.payment || originalPayment;
//   const effectiveItinerary =
//     customItineraryData?.itinerary || originalItinerary;

//   // Price Calculation
//   const calculatePrices = () => {
//     const totalPersons = adults + children;
//     return {
//       base: Math.round((effectivePayment?.subTotal || 0) * totalPersons),
//       taxes: Math.round((effectivePayment?.taxation || 0) * totalPersons),
//       insurance: Math.round((effectivePayment?.insurance || 0) * totalPersons),
//       activities: Math.round(
//         (effectivePayment?.activities || 0) * totalPersons
//       ),
//       total: Math.round((effectivePayment?.grandTotal || 0) * totalPersons),
//       discount: Math.round(
//         ((effectivePayment?.actualPrice || 0) -
//           (effectivePayment?.subTotal || 0)) *
//           totalPersons
//       ),
//       actualTotal: Math.round(
//         (effectivePayment?.actualPrice || 0) * totalPersons
//       ),
//     };
//   };

//   const { base, taxes, insurance, activities, total, discount, actualTotal } =
//     calculatePrices();

//   const handlePayment = async () => {
//     setLoading(true);
//     try {
//       const orderResponse = await axiosInstance.post(
//         "/api/payment/create-order",
//         {
//           amount: total * 100,
//           currency: "INR",
//           receipt: `trip_${tripId}_${Date.now()}`,
//         }
//       );

//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";

//       const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;

//       script.onload = () => {
//         const options = {
//           key: razorpayKey,
//           amount: total * 100,
//           currency: "INR",
//           order_id: orderResponse.data.order_id,
//           name: "Travel Booking",
//           description: `Booking for ${title}`,
//           image: images?.[0] || "/logo.png",
//           prefill: {
//             name: user?.name || fullName,
//             email: user?.email || email,
//             contact: phone,
//           },
//           theme: {
//             color: "#2563eb",
//           },
//           handler: async (paymentResponse) => {
//             try {
//               const verificationData = {
//                 ...paymentResponse,
//                 bookingData: {
//                   ...bookingData,
//                   tripId,
//                   userId: user?._id,
//                   tripDetails: {
//                     title,
//                     duration,
//                     startDate,
//                     endDate,
//                     images,
//                     payment: effectivePayment,
//                     tripType: tripDetails?.tripType,
//                     pickupDropLocation,
//                     itinerary: effectiveItinerary,
//                   },
//                   totalAmount: total,
//                   paymentDetails: {
//                     subtotal: effectivePayment?.subTotal,
//                     taxation: effectivePayment?.taxation,
//                     insurance: effectivePayment?.insurance,
//                     activities: effectivePayment?.activities,
//                     grandTotal: total,
//                     transactionId: paymentResponse.razorpay_payment_id,
//                   },
//                 },
//               };
//               const verification = await axiosInstance.post(
//                 "/api/payment/verify",
//                 verificationData
//               );
//               // if (verification.data.success) setPaymentSuccess(true);
//               if (verification.data.success) {
//                 setPaymentSuccess(true);
//                 setLoading(false);
//                 setBookingId(paymentResponse.razorpay_payment_id);
//               } else
//                 alert(
//                   `Payment verified but booking failed: ${verification.data.message}`
//                 );
//             } catch (error) {
//               console.error("Verification error:", error);
//               alert(
//                 `Payment successful! Booking ID: ${paymentResponse.razorpay_payment_id}. Contact support if needed.`
//               );
//             }
//           },
//           modal: {
//             ondismiss: () => {
//               setLoading(false);
//               toast.info("Payment cancelled. You can try again later.");
//             },
//           },
//         };

//         new window.Razorpay(options).open();
//       };

//       script.onerror = () => {
//         throw new Error("Failed to load Razorpay SDK");
//       };
//       document.body.appendChild(script);
//     } catch (error) {
//       alert(error.response?.data?.message || "Payment initialization failed");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!state) navigate(`/trip/${tripId}`);
//   }, [state, navigate, tripId]);

//   // Add these functions before your return statement
//   const handleNavigateHome = () => {
//     navigate("/");
//   };

//   const handleNavigateToPlans = () => {
//     navigate("/profile"); // Adjust route as per your routing setup
//   };

//   const handleCloseModal = () => {
//     setPaymentSuccess(false);
//     // Optionally navigate somewhere after closing
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8 mt-18">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Complete Your Booking
//           </h1>
//           <p className="text-gray-600">
//             Review your trip details and proceed to payment
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Trip Details */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Trip Summary Card */}
//             <div className="bg-white rounded-2xl shadow-lg p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-semibold text-gray-900">
//                   Trip Summary
//                 </h2>
//                 {isCustomTrip && (
//                   <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
//                     Custom Package
//                   </span>
//                 )}
//               </div>

//               <div className="flex flex-col sm:flex-row gap-6">
//                 <img
//                   src={images?.[0]}
//                   alt={title}
//                   className="w-full sm:w-40 h-40 object-cover rounded-xl shadow-md"
//                 />
//                 <div className="flex-1 space-y-4">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">
//                       {title}
//                     </h3>
//                     <p className="text-gray-600 text-sm">
//                       {tripState} • {category}
//                     </p>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div className="flex items-center gap-2">
//                       <Calendar className="w-4 h-4 text-blue-600" />
//                       <span>{duration}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Users className="w-4 h-4 text-green-600" />
//                       <span>{adults + children} Travelers</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <MapPin className="w-4 h-4 text-red-600" />
//                       <span className="truncate">{pickupDropLocation}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Clock className="w-4 h-4 text-purple-600" />
//                       <span>
//                         {new Date(startDate).toLocaleDateString()} -{" "}
//                         {new Date(endDate).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Itinerary Section */}
//             {effectiveItinerary?.length > 0 && (
//               <div className="bg-white rounded-2xl shadow-lg p-6">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-6">
//                   {isCustomTrip ? "Your Custom Itinerary" : "Trip Itinerary"}
//                 </h2>
//                 <div className="space-y-4">
//                   {effectiveItinerary.map((day) => (
//                     <div
//                       key={day.dayNumber}
//                       className="border border-gray-200 rounded-xl overflow-hidden"
//                     >
//                       <button
//                         onClick={() => toggleDay(day.dayNumber)}
//                         className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
//                       >
//                         <div className="flex items-center gap-4">
//                           <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
//                             {day.dayNumber}
//                           </div>
//                           <div className="text-left">
//                             <h4 className="font-medium text-gray-900">
//                               Day {day.dayNumber}
//                             </h4>
//                             <p className="text-sm text-gray-600">{day.title}</p>
//                           </div>
//                         </div>
//                         {expandedDay === day.dayNumber ? (
//                           <ChevronUp className="w-5 h-5 text-gray-400" />
//                         ) : (
//                           <ChevronDown className="w-5 h-5 text-gray-400" />
//                         )}
//                       </button>

//                       {expandedDay === day.dayNumber && (
//                         <div className="p-4 bg-white">
//                           <h5 className="font-medium text-gray-900 mb-3">
//                             {day.title}
//                           </h5>
//                           <p className="text-gray-600 text-sm mb-4">
//                             {day.description}
//                           </p>
//                           {day.points?.length > 0 && (
//                             <div className="space-y-2">
//                               <h6 className="font-medium text-gray-700 text-sm">
//                                 Highlights:
//                               </h6>
//                               <ul className="space-y-1">
//                                 {day.points.map((point, idx) => (
//                                   <li
//                                     key={idx}
//                                     className="flex items-start gap-2 text-sm text-gray-600"
//                                   >
//                                     <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
//                                     <span>{point}</span>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Traveler Information */}
//             <div className="bg-white rounded-2xl shadow-lg p-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-6">
//                 Traveler Information
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3">
//                     <User className="w-5 h-5 text-blue-600" />
//                     <div>
//                       <p className="text-sm text-gray-600">Full Name</p>
//                       <p className="font-medium text-gray-900">
//                         {user?.name || fullName}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <Mail className="w-5 h-5 text-blue-600" />
//                     <div>
//                       <p className="text-sm text-gray-600">Email Address</p>
//                       <p className="font-medium text-gray-900">
//                         {user?.email || email}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3">
//                     <Phone className="w-5 h-5 text-blue-600" />
//                     <div>
//                       <p className="text-sm text-gray-600">Phone Number</p>
//                       <p className="font-medium text-gray-900">{phone}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <Users className="w-5 h-5 text-blue-600" />
//                     <div>
//                       <p className="text-sm text-gray-600">Travelers</p>
//                       <p className="font-medium text-gray-900">
//                         {adults} Adult{adults !== 1 ? "s" : ""}
//                         {children > 0 &&
//                           `, ${children} Child${children !== 1 ? "ren" : ""}`}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {specialRequests && (
//                 <div className="mt-6 pt-6 border-t border-gray-200">
//                   <h3 className="font-medium text-gray-900 mb-3">
//                     Special Requests
//                   </h3>
//                   <p className="text-gray-600 text-sm bg-gray-50 p-4 rounded-lg">
//                     {specialRequests}
//                   </p>
//                 </div>
//               )}

//               {addOnServices.length > 0 && (
//                 <div className="mt-6 pt-6 border-t border-gray-200">
//                   <h3 className="font-medium text-gray-900 mb-3">
//                     Additional Services
//                   </h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                     {addOnServices.map((service, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center gap-2 text-sm text-gray-600"
//                       >
//                         <Check className="w-4 h-4 text-green-500" />
//                         <span>{service}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Inclusions */}
//             {inclusions?.length > 0 && (
//               <div className="bg-white rounded-2xl shadow-lg p-6">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-6">
//                   What's Included
//                 </h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {inclusions.map((item, index) => (
//                     <div key={index} className="flex items-center gap-3">
//                       <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
//                       <span className="text-gray-700">{item}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Column - Payment Summary */}
//           <div className="space-y-6">
//             {/* Support Card */}
//             <div className="bg-white rounded-2xl shadow-lg p-6">
//               <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
//               <div className="space-y-3 text-sm">
//                 <div className="flex items-center gap-2 text-gray-600">
//                   <Phone className="w-4 h-4" />
//                   <span>+91-9876543210</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-600">
//                   <Mail className="w-4 h-4" />
//                   <span>support@travelcompany.com</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-600">
//                   <Clock className="w-4 h-4" />
//                   <span>24/7 Customer Support</span>
//                 </div>
//               </div>
//             </div>
//             {/* Payment Summary Card */}
//             <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-6">
//                 Payment Summary
//               </h2>

//               {/* Price Breakdown */}
//               <div className="space-y-3 mb-6">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Base Price</span>
//                   <span className="font-medium">
//                     ₹{base.toLocaleString("en-IN")}
//                   </span>
//                 </div>

//                 {activities > 0 && (
//                   <div className="flex justify-between items-center text-sm text-gray-600">
//                     <span>Activities & Experiences</span>
//                     <span>₹{activities.toLocaleString("en-IN")}</span>
//                   </div>
//                 )}

//                 {taxes > 0 && (
//                   <div className="flex justify-between items-center text-sm text-gray-600">
//                     <span>Taxes & Fees</span>
//                     <span>₹{taxes.toLocaleString("en-IN")}</span>
//                   </div>
//                 )}

//                 {insurance > 0 && (
//                   <div className="flex justify-between items-center text-sm text-gray-600">
//                     <span>Travel Insurance</span>
//                     <span>₹{insurance.toLocaleString("en-IN")}</span>
//                   </div>
//                 )}

//                 {discount > 0 && (
//                   <div className="flex justify-between items-center text-green-600">
//                     <span>Discount</span>
//                     <span>-₹{discount.toLocaleString("en-IN")}</span>
//                   </div>
//                 )}
//               </div>

//               {/* Total */}
//               <div className="border-t border-gray-200 pt-4 mb-6">
//                 <div className="flex justify-between items-center text-lg font-semibold">
//                   <span>Total Amount</span>
//                   <span className="text-blue-600">
//                     ₹{total.toLocaleString("en-IN")}
//                   </span>
//                 </div>
//                 {discount > 0 && (
//                   <div className="text-sm text-gray-500 text-right mt-1">
//                     <s>₹{actualTotal.toLocaleString("en-IN")}</s>
//                   </div>
//                 )}
//               </div>

//               {/* Security Features */}
//               <div className="bg-gray-50 rounded-lg p-4 mb-6">
//                 <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
//                   <Shield className="w-4 h-4 text-green-600" />
//                   <span>Secure Payment</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <Lock className="w-4 h-4 text-green-600" />
//                   <span>SSL Encrypted</span>
//                 </div>
//               </div>

//               {/* Payment Button */}
//               <button
//                 onClick={handlePayment}
//                 disabled={loading || paymentSuccess || fetchLoading}
//                 className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
//                   loading || fetchLoading
//                     ? "bg-blue-400 cursor-not-allowed"
//                     : paymentSuccess
//                     ? "bg-green-500"
//                     : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
//                 }`}
//               >
//                 {fetchLoading ? (
//                   <div className="flex items-center justify-center gap-2">
//                     <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
//                     Loading...
//                   </div>
//                 ) : loading ? (
//                   <div className="flex items-center justify-center gap-2">
//                     <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
//                     Processing...
//                   </div>
//                 ) : paymentSuccess ? (
//                   "Payment Successful!"
//                 ) : (
//                   `Pay ₹${total.toLocaleString("en-IN")}`
//                 )}
//               </button>

//               {/* Additional Info */}
//               <div className="text-center mt-4">
//                 <p className="text-xs text-gray-500">
//                   By completing this purchase, you agree to our{" "}
//                   <a href="/terms" className="text-blue-600 hover:underline">
//                     Terms of Service
//                   </a>{" "}
//                   and{" "}
//                   <a href="/privacy" className="text-blue-600 hover:underline">
//                     Privacy Policy
//                   </a>
//                 </p>
//               </div>
//             </div>

//             {/* Cancellation Policy */}
//             <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
//               <div className="flex items-start gap-3">
//                 <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
//                 <div>
//                   <h4 className="font-medium text-yellow-800 mb-2">
//                     Cancellation Policy
//                   </h4>
//                   <p className="text-yellow-700 text-sm">
//                     Free cancellation up to 7 days before travel. 50% refund for
//                     cancellations within 3-7 days. No refund for cancellations
//                     within 48 hours of travel.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Payment Success Modal */}
//       <PaymentSuccessModal
//         isOpen={paymentSuccess}
//         onClose={handleCloseModal}
//         onNavigateHome={handleNavigateHome}
//         onNavigateToPlans={handleNavigateToPlans}
//         bookingId={bookingId}
//       />
//     </div>
//   );
// };

// // Add the Lock icon component
// const Lock = ({ className }) => (
//   <svg
//     className={className}
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//   >
//     <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
//     <path d="M7 11V7a5 5 0 0 1 10 0v4" />
//   </svg>
// );

// export default PaymentPage;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Users,
  Check,
  User,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Shield,
  Clock,
  Star,
  Heart,
  Package,
  Gift,
  AlertCircle,
  Info,
  Banknote,
  Receipt,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
// Add this import with your other imports
import PaymentSuccessModal from "../../components/user/PaymentSuccessModal";

const PaymentPage = () => {
  const { tripId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [customItineraryData, setCustomItineraryData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [expandedDay, setExpandedDay] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("razorpay");

  // Add this state with your other useState declarations
  const [bookingId, setBookingId] = useState(null);

  // Check if custom trip
  const isCustomTrip =
    state?.isCustomTrip || state?.tripDetails?.tripType === "CUSTOMIZED";

  // Data from booking
  const { bookingData, tripDetails } = state || {};
  const {
    adults = 1,
    children = 0,
    email,
    phone,
    fullName,
    enquiryId,
    specialRequests,
    addOnServices = [],
  } = bookingData || {};

  const {
    title,
    images,
    duration,
    inclusions,
    payment: originalPayment,
    startDate,
    endDate,
    pickupDropLocation,
    itinerary: originalItinerary,
    state: tripState,
    category,
  } = tripDetails || {};

  // Toggle day expansion
  const toggleDay = (dayNumber) => {
    setExpandedDay(expandedDay === dayNumber ? null : dayNumber);
  };

  // Fetch custom itinerary
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
          // Fallback to original data if custom fetch fails
        } finally {
          setFetchLoading(false);
        }
      } else {
        setFetchLoading(false);
      }
    };

    fetchCustomItinerary();
  }, [isCustomTrip, enquiryId, user?.email]);

  // Use custom data if available, otherwise use original
  const effectivePayment = customItineraryData?.payment || originalPayment;
  const effectiveItinerary =
    customItineraryData?.itinerary || originalItinerary;

  // Price Calculation
  const calculatePrices = () => {
    const totalPersons = adults + children;
    return {
      base: Math.round((effectivePayment?.subTotal || 0) * totalPersons),
      taxes: Math.round((effectivePayment?.taxation || 0) * totalPersons),
      insurance: Math.round((effectivePayment?.insurance || 0) * totalPersons),
      activities: Math.round(
        (effectivePayment?.activities || 0) * totalPersons
      ),
      total: Math.round((effectivePayment?.grandTotal || 0) * totalPersons),
      discount: Math.round(
        ((effectivePayment?.actualPrice || 0) -
          (effectivePayment?.subTotal || 0)) *
          totalPersons
      ),
      actualTotal: Math.round(
        (effectivePayment?.actualPrice || 0) * totalPersons
      ),
    };
  };

  const { base, taxes, insurance, activities, total, discount, actualTotal } =
    calculatePrices();

  const handlePayment = async () => {
    setLoading(true);
    try {
      const orderResponse = await axiosInstance.post(
        "/api/payment/create-order",
        {
          amount: total * 100,
          currency: "INR",
          receipt: `trip_${tripId}_${Date.now()}`,
        }
      );

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;

      script.onload = () => {
        const options = {
          key: razorpayKey,
          amount: total * 100,
          currency: "INR",
          order_id: orderResponse.data.order_id,
          name: "Travel Booking",
          description: `Booking for ${title}`,
          image: images?.[0] || "/logo.png",
          prefill: {
            name: user?.name || fullName,
            email: user?.email || email,
            contact: phone,
          },
          theme: {
            color: "#2563eb",
          },
          handler: async (paymentResponse) => {
            try {
              const verificationData = {
                ...paymentResponse,
                bookingData: {
                  ...bookingData,
                  tripId,
                  userId: user?._id,
                  tripDetails: {
                    title,
                    duration,
                    startDate,
                    endDate,
                    images,
                    payment: effectivePayment,
                    tripType: tripDetails?.tripType,
                    pickupDropLocation,
                    itinerary: effectiveItinerary,
                  },
                  totalAmount: total,
                  paymentDetails: {
                    subtotal: effectivePayment?.subTotal,
                    taxation: effectivePayment?.taxation,
                    insurance: effectivePayment?.insurance,
                    activities: effectivePayment?.activities,
                    grandTotal: total,
                    transactionId: paymentResponse.razorpay_payment_id,
                  },
                },
              };
              const verification = await axiosInstance.post(
                "/api/payment/verify",
                verificationData
              );
              // if (verification.data.success) setPaymentSuccess(true);
              if (verification.data.success) {
                setPaymentSuccess(true);
                setLoading(false);
                setBookingId(paymentResponse.razorpay_payment_id);
              } else
                alert(
                  `Payment verified but booking failed: ${verification.data.message}`
                );
            } catch (error) {
              console.error("Verification error:", error);
              alert(
                `Payment successful! Booking ID: ${paymentResponse.razorpay_payment_id}. Contact support if needed.`
              );
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              toast.info("Payment cancelled. You can try again later.");
            },
          },
        };

        new window.Razorpay(options).open();
      };

      script.onerror = () => {
        throw new Error("Failed to load Razorpay SDK");
      };
      document.body.appendChild(script);
    } catch (error) {
      alert(error.response?.data?.message || "Payment initialization failed");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!state) navigate(`/trip/${tripId}`);
  }, [state, navigate, tripId]);

  // Add these functions before your return statement
  const handleNavigateHome = () => {
    navigate("/");
  };

  const handleNavigateToPlans = () => {
    // navigate("/profile"); // Adjust route as per your routing setup
    navigate("/profile", { state: { page: "plans" } });
  };

  

  const handleCloseModal = () => {
    setPaymentSuccess(false);
    // Optionally navigate somewhere after closing
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8 mt-18">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Booking
          </h1>
          <p className="text-gray-600">
            Review your trip details and proceed to payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Trip Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Trip Summary
                </h2>
                {isCustomTrip && (
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    Custom Package
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={images?.[0]}
                  alt={title}
                  className="w-full sm:w-40 h-40 object-cover rounded-xl shadow-md"
                />
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {tripState} • {category}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>{duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-600" />
                      <span>{adults + children} Travelers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span className="truncate">{pickupDropLocation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span>
                        {new Date(startDate).toLocaleDateString()} -{" "}
                        {new Date(endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* IMPORTANT: Notice for Customized Trips (visible only for custom packages) */}
            {/* {isCustomTrip && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-yellow-800 font-medium">ध्यान दें — कस्टम पैकेज</p>
                    <p className="text-sm text-yellow-700">अगर एक बार यूज़र ने पेमेंट कर दिया तो फिर itinerary change नहीं होगी।</p>
                  </div>
                </div>
              </div>
            )} */}
            {isCustomTrip && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-yellow-800 font-medium">
                      Note — Custom Package
                    </p>
                    <p className="text-sm text-yellow-700">
                      Once the payment is completed, the itinerary cannot be
                      changed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Itinerary Section */}
            {effectiveItinerary?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {isCustomTrip ? "Your Custom Itinerary" : "Trip Itinerary"}
                </h2>
                <div className="space-y-4">
                  {effectiveItinerary.map((day) => (
                    <div
                      key={day.dayNumber}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleDay(day.dayNumber)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {day.dayNumber}
                          </div>
                          <div className="text-left">
                            <h4 className="font-medium text-gray-900">
                              Day {day.dayNumber}
                            </h4>
                            <p className="text-sm text-gray-600">{day.title}</p>
                          </div>
                        </div>
                        {expandedDay === day.dayNumber ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>

                      {expandedDay === day.dayNumber && (
                        <div className="p-4 bg-white">
                          <h5 className="font-medium text-gray-900 mb-3">
                            {day.title}
                          </h5>
                          <p className="text-gray-600 text-sm mb-4">
                            {day.description}
                          </p>
                          {day.points?.length > 0 && (
                            <div className="space-y-2">
                              <h6 className="font-medium text-gray-700 text-sm">
                                Highlights:
                              </h6>
                              <ul className="space-y-1">
                                {day.points.map((point, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 text-sm text-gray-600"
                                  >
                                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Traveler Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Traveler Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-medium text-gray-900">
                        {user?.name || fullName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email Address</p>
                      <p className="font-medium text-gray-900">
                        {user?.email || email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-medium text-gray-900">{phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Travelers</p>
                      <p className="font-medium text-gray-900">
                        {adults} Adult{adults !== 1 ? "s" : ""}
                        {children > 0 &&
                          `, ${children} Child${children !== 1 ? "ren" : ""}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {specialRequests && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Special Requests
                  </h3>
                  <p className="text-gray-600 text-sm bg-gray-50 p-4 rounded-lg">
                    {specialRequests}
                  </p>
                </div>
              )}

              {addOnServices.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Additional Services
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {addOnServices.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <Check className="w-4 h-4 text-green-500" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Inclusions */}
            {inclusions?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  What's Included
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {inclusions.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Payment Summary */}
          <div className="space-y-6">
            {/* Support Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>+91-9876543210</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>support@travelcompany.com</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>24/7 Customer Support</span>
                </div>
              </div>
            </div>

            {/* Payment Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Payment Summary
              </h2>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Base Price</span>
                  <span className="font-medium">
                    ₹{base.toLocaleString("en-IN")}
                  </span>
                </div>

                {activities > 0 && (
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Activities & Experiences</span>
                    <span>₹{activities.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {taxes > 0 && (
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Taxes & Fees</span>
                    <span>₹{taxes.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {insurance > 0 && (
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Travel Insurance</span>
                    <span>₹{insurance.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {discount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount</span>
                  <span className="text-blue-600">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="text-sm text-gray-500 text-right mt-1">
                    <s>₹{actualTotal.toLocaleString("en-IN")}</s>
                  </div>
                )}
              </div>

              {/* Security Features */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span>SSL Encrypted</span>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={loading || paymentSuccess || fetchLoading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                  loading || fetchLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : paymentSuccess
                    ? "bg-green-500"
                    : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {fetchLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Loading...
                  </div>
                ) : loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Processing...
                  </div>
                ) : paymentSuccess ? (
                  "Payment Successful!"
                ) : (
                  `Pay ₹${total.toLocaleString("en-IN")}`
                )}
              </button>

              {/* Additional Info */}
              <div className="text-center mt-4">
                <p className="text-xs text-gray-500">
                  By completing this purchase, you agree to our{" "}
                  <a href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-2">
                    Cancellation Policy
                  </h4>
                  <p className="text-yellow-700 text-sm">
                    Free cancellation up to 7 days before travel. 50% refund for
                    cancellations within 3-7 days. No refund for cancellations
                    within 48 hours of travel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Success Modal */}
      <PaymentSuccessModal
        isOpen={paymentSuccess}
        onClose={handleCloseModal}
        onNavigateHome={handleNavigateHome}
        onNavigateToPlans={handleNavigateToPlans}
        bookingId={bookingId}
      />
    </div>
  );
};

// Add the Lock icon component
const Lock = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default PaymentPage;
