// import { useState, useEffect } from "react";
// import {
//   Loader2,
//   Clock,
//   Calendar,
//   Users,
//   Eye,
//   MapPin,
// } from "lucide-react";
// import axiosInstance from "../../api/axiosInstance";

// const MyPlansPage = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch bookings from API
//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         setLoading(true);
//         const response = await axiosInstance.get("/api/users/bookings");
//         setBookings(response.data);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch bookings");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, []);

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const InfoCard = ({ icon, label, value }) => (
//     <div className="group relative bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200">
//       <div className="flex items-center space-x-3">
//         <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
//           {icon}
//         </div>
//         <div>
//           <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//             {label}
//           </p>
//           <p className="font-semibold text-gray-900 mt-1">{value}</p>
//         </div>
//       </div>
//     </div>
//   );

//   const ItinerarySection = ({ itinerary }) => {
//     if (Array.isArray(itinerary) && itinerary.length > 0) {
//       return (
//         <div className="mt-8 pt-8 border-t-2 border-gray-100">
//           <div className="flex items-center space-x-2 mb-6">
//             <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
//               <Calendar size={16} className="text-white" />
//             </div>
//             <h4 className="text-lg font-semibold text-gray-900">
//               Detailed Itinerary
//             </h4>
//           </div>

//           <div className="relative">
//             <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500 opacity-30"></div>

//             <div className="space-y-6">
//               {itinerary.map((day, index) => (
//                 <div key={index} className="relative">
//                   <div className="flex items-start space-x-4">
//                     <div className="relative z-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl w-12 h-12 flex items-center justify-center flex-shrink-0 shadow-lg">
//                       <span className="font-bold text-sm">
//                         {day.dayNumber || index + 1}
//                       </span>
//                     </div>

//                     <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
//                       <h5 className="font-semibold text-gray-900 text-lg mb-2">
//                         {day.title || `Day ${day.dayNumber || index + 1}`}
//                       </h5>

//                       {day.description && (
//                         <p className="text-gray-600 mb-4 leading-relaxed">
//                           {day.description}
//                         </p>
//                       )}

//                       {day.points && day.points.length > 0 && (
//                         <div className="bg-gray-50 rounded-lg p-4">
//                           <h6 className="text-sm font-medium text-gray-700 mb-3">
//                             Activities:
//                           </h6>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                             {day.points.map((point, pointIndex) => (
//                               <div
//                                 key={pointIndex}
//                                 className="flex items-center space-x-2"
//                               >
//                                 <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
//                                 <span className="text-sm text-gray-700">
//                                   {point}
//                                 </span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="mt-8 pt-8 border-t-2 border-gray-100">
//         <div className="text-center py-8">
//           <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
//             <Calendar size={24} className="text-gray-400" />
//           </div>
//           <h4 className="text-lg font-medium text-gray-900 mb-2">
//             No Itinerary Available
//           </h4>
//           <p className="text-gray-500">
//             Detailed itinerary will be available soon.
//           </p>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 mt-15">
//       {/* Header Section */}
//       <div className="bg-white shadow-sm border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="text-center">
//             <div className="inline-flex items-center space-x-3 mb-4">
//               <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
//                 <MapPin size={24} className="text-white" />
//               </div>
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
//                 My Travel Plans
//               </h1>
//             </div>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Discover your upcoming adventures and create unforgettable
//               memories with detailed travel experiences
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         {loading && !bookings.length ? (
//           <div className="flex flex-col justify-center items-center h-64">
//             <div className="relative">
//               <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
//               <div className="absolute inset-0 animate-ping">
//                 <div className="w-10 h-10 border-2 border-blue-300 rounded-full opacity-20"></div>
//               </div>
//             </div>
//             <p className="text-gray-500 font-medium">
//               Loading your travel plans...
//             </p>
//           </div>
//         ) : error ? (
//           <div className="text-center py-16">
//             <h3 className="text-xl font-semibold text-red-600 mb-3">
//               {error}
//             </h3>
//             <p className="text-gray-500">Please try again later.</p>
//           </div>
//         ) : bookings.length === 0 ? (
//           <div className="text-center py-16">
//             <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
//               <MapPin size={32} className="text-gray-400" />
//             </div>
//             <h3 className="text-2xl font-semibold text-gray-700 mb-3">
//               No Upcoming Adventures
//             </h3>
//             <p className="text-gray-500 max-w-md mx-auto">
//               Your travel journey starts here. Book your first trip and create
//               amazing memories!
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-12">
//             {bookings.map((booking) => {
//               const trip = booking.tripDetails || {};

//               return (
//                 <div
//                   key={booking._id}
//                   className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
//                 >
//                   <div className="lg:flex">
//                     {/* Image Section */}
//                     <div className="lg:w-2/5 relative lg:flex-shrink-0">
//                       <div className="relative overflow-hidden">
//                         <img
//                           src={
//                             booking.image ||
//                             trip.images?.[0] ||
//                             "/placeholder-trip.jpg"
//                           }
//                           alt={booking.title}
//                           className="w-full h-72 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

//                         <div className="absolute bottom-6 left-6 right-6 text-white">
//                           <h3 className="text-2xl font-bold mb-2">
//                             {booking.title || "Trip Title"}
//                           </h3>
//                           <div className="flex items-center space-x-2 text-sm opacity-90">
//                             <MapPin size={14} />
//                             <span className="font-medium">
//                               {trip.state || "Destination"}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Content Section */}
//                     <div className="lg:w-3/5 p-8 lg:max-h-96 lg:overflow-y-auto">
//                       {/* Main Info Cards Grid */}
//                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
//                         <InfoCard
//                           icon={<Clock size={18} className="text-blue-500" />}
//                           label="Duration"
//                           value={booking.duration || "N/A"}
//                         />
//                         <InfoCard
//                           icon={
//                             <Calendar size={18} className="text-blue-500" />
//                           }
//                           label="Travel Dates"
//                           value={`${formatDate(
//                             booking.startDate
//                           )} - ${formatDate(booking.endDate)}`}
//                         />
//                         <InfoCard
//                           icon={<Users size={18} className="text-blue-500" />}
//                           label="Travelers"
//                           value={`${booking.total_members || 0} ${
//                             booking.total_members === 1 ? "Person" : "People"
//                           }`}
//                         />
//                         <InfoCard
//                           icon={<Eye size={18} className="text-blue-500" />}
//                           label="Booking ID"
//                           value={booking.tripId || "N/A"}
//                         />
//                       </div>

//                       {/* Additional Detail Cards */}
//                       <div className="space-y-4 mb-8">
//                         {(booking.adults > 0 ||
//                           booking.childrens > 0 ||
//                           booking.travelWithPet ||
//                           booking.photographer) && (
//                           <InfoCard
//                             icon={<Users size={18} className="text-green-500" />}
//                             label="Travelers Details"
//                             value={[
//                               booking.adults > 0 && `Adults: ${booking.adults}`,
//                               booking.childrens > 0 &&
//                                 `Children: ${booking.childrens}`,
//                               booking.travelWithPet && "Pet: Yes",
//                               booking.photographer && "Photographer: Yes",
//                             ]
//                               .filter(Boolean)
//                               .join(" • ")}
//                           />
//                         )}

//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                           <InfoCard
//                             icon={
//                               <Calendar size={18} className="text-green-500" />
//                             }
//                             label="Payment Summary"
//                             value={`₹${booking?.payment?.grandTotal || "0"}`}
//                           />
//                           {booking.current_location && (
//                             <InfoCard
//                               icon={
//                                 <MapPin size={18} className="text-purple-500" />
//                               }
//                               label="Pickup Location"
//                               value={booking.current_location}
//                             />
//                           )}
//                         </div>
//                       </div>

//                       {/* Activities */}
//                       {trip.activities?.length > 0 && (
//                         <div className="mb-8">
//                           <h4 className="font-semibold text-gray-800 mb-4 text-lg">
//                             Included Activities
//                           </h4>
//                           <div className="flex flex-wrap gap-3">
//                             {trip.activities.map((activity, index) => (
//                               <span
//                                 key={index}
//                                 className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200 hover:shadow-md transition-shadow duration-300"
//                               >
//                                 {activity}
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {/* Itinerary */}
//                       <ItinerarySection itinerary={trip.itinerary} />
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyPlansPage;


import { useState, useEffect } from "react";
import {
  Loader2,
  Clock,
  Calendar,
  Users,
  Eye,
  MapPin,
  Package,
  Settings,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const MyPlansPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bookings from API
  // useEffect(() => {
  //   const fetchBookings = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axiosInstance.get("/api/users/bookings");
  //       setBookings(response.data);
  //     } catch (err) {
  //       setError(err.response?.data?.message || "Failed to fetch bookings");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchBookings();
  // }, []);

  useEffect(() => {
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/users/bookings");
      
      // Filter out bookings with payment amount 0 or no payment
      const filteredBookings = response.data.filter(booking => 
        booking.payment && booking.payment.grandTotal > 0
      );
      
      setBookings(filteredBookings);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  fetchBookings();
}, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const InfoCard = ({ icon, label, value }) => (
    <div className="group relative bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {label}
          </p>
          <p className="font-semibold text-gray-900 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );

  const ItinerarySection = ({ itinerary }) => {
    if (Array.isArray(itinerary) && itinerary.length > 0) {
      return (
        <div className="mt-8 pt-8 border-t-2 border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Calendar size={16} className="text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">
              Detailed Itinerary
            </h4>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500 opacity-30"></div>

            <div className="space-y-6">
              {itinerary.map((day, index) => (
                <div key={index} className="relative">
                  <div className="flex items-start space-x-4">
                    <div className="relative z-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl w-12 h-12 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="font-bold text-sm">
                        {day.dayNumber || index + 1}
                      </span>
                    </div>

                    <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                      <h5 className="font-semibold text-gray-900 text-lg mb-2">
                        {day.title || `Day ${day.dayNumber || index + 1}`}
                      </h5>

                      {day.description && (
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {day.description}
                        </p>
                      )}

                      {day.points && day.points.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h6 className="text-sm font-medium text-gray-700 mb-3">
                            Activities:
                          </h6>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {day.points.map((point, pointIndex) => (
                              <div
                                key={pointIndex}
                                className="flex items-center space-x-2"
                              >
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                <span className="text-sm text-gray-700">
                                  {point}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-8 pt-8 border-t-2 border-gray-100">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Calendar size={24} className="text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No Itinerary Available
          </h4>
          <p className="text-gray-500">
            Detailed itinerary will be available soon.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 mt-15">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 mb-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                My Travel Plans
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover your upcoming adventures and create unforgettable
              memories with detailed travel experiences
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && !bookings.length ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="relative">
              <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
              <div className="absolute inset-0 animate-ping">
                <div className="w-10 h-10 border-2 border-blue-300 rounded-full opacity-20"></div>
              </div>
            </div>
            <p className="text-gray-500 font-medium">
              Loading your travel plans...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-red-600 mb-3">
              {error}
            </h3>
            <p className="text-gray-500">Please try again later.</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <MapPin size={32} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              No Upcoming Adventures
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Your travel journey starts here. Book your first trip and create
              amazing memories!
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {bookings.map((booking) => {
              const trip = booking.tripDetails || {};
              const isCustomized = booking.tripType === "CUSTOMIZED";
              
              // Determine which itinerary to use
              const itineraryToUse = isCustomized && booking.customItinerary 
                ? booking.customItinerary.itinerary 
                : trip.itinerary;

              return (
                <div
                  key={booking._id}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
                >
                  <div className="lg:flex">
                    {/* Image Section */}
                    <div className="lg:w-2/5 relative lg:flex-shrink-0">
                      <div className="relative overflow-hidden">
                        <img
                          src={
                            booking.image ||
                            trip.images?.[0] ||
                            "/placeholder-trip.jpg"
                          }
                          alt={booking.title}
                          className="w-full h-72 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                        {/* Trip Type Badge */}
                        <div className="absolute top-4 left-4">
                          <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full ${isCustomized ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                            {isCustomized ? (
                              <>
                                <Settings size={14} />
                                <span className="text-xs font-medium">Customized Trip</span>
                              </>
                            ) : (
                              <>
                                <Package size={14} />
                                <span className="text-xs font-medium">Package Trip</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="absolute bottom-6 left-6 right-6 text-white">
                          <h3 className="text-2xl font-bold mb-2">
                            {booking.title || trip.title || "Trip Title"}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm opacity-90">
                            <MapPin size={14} />
                            <span className="font-medium">
                              {trip.state || "Destination"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-3/5 p-8 lg:max-h-96 lg:overflow-y-auto">
                      {/* Main Info Cards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
                        <InfoCard
                          icon={<Clock size={18} className="text-blue-500" />}
                          label="Duration"
                          value={booking.duration || "N/A"}
                        />
                        <InfoCard
                          icon={
                            <Calendar size={18} className="text-blue-500" />
                          }
                          label="Travel Dates"
                          value={`${formatDate(
                            booking.startDate
                          )} - ${formatDate(booking.endDate)}`}
                        />
                        <InfoCard
                          icon={<Users size={18} className="text-blue-500" />}
                          label="Travelers"
                          value={`${booking.total_members || 0} ${
                            booking.total_members === 1 ? "Person" : "People"
                          }`}
                        />
                        <InfoCard
                          icon={<Eye size={18} className="text-blue-500" />}
                          label="Booking ID"
                          value={booking.tripId || "N/A"}
                        />
                      </div>

                      {/* Additional Detail Cards */}
                      <div className="space-y-4 mb-8">
                        {(booking.adults > 0 ||
                          booking.childrens > 0 ||
                          booking.travelWithPet ||
                          booking.photographer) && (
                          <InfoCard
                            icon={<Users size={18} className="text-green-500" />}
                            label="Travelers Details"
                            value={[
                              booking.adults > 0 && `Adults: ${booking.adults}`,
                              booking.childrens > 0 &&
                                `Children: ${booking.childrens}`,
                              booking.travelWithPet && "Pet: Yes",
                              booking.photographer && "Photographer: Yes",
                            ]
                              .filter(Boolean)
                              .join(" • ")}
                          />
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <InfoCard
                            icon={
                              <Calendar size={18} className="text-green-500" />
                            }
                            label="Payment Summary"
                            value={`₹${booking?.payment?.grandTotal || "0"}`}
                          />
                          {booking.current_location && (
                            <InfoCard
                              icon={
                                <MapPin size={18} className="text-purple-500" />
                              }
                              label="Pickup Location"
                              value={booking.current_location}
                            />
                          )}
                        </div>
                      </div>

                      {/* Activities */}
                      {trip.activities?.length > 0 && (
                        <div className="mb-8">
                          <h4 className="font-semibold text-gray-800 mb-4 text-lg">
                            Included Activities
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {trip.activities.map((activity, index) => (
                              <span
                                key={index}
                                className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200 hover:shadow-md transition-shadow duration-300"
                              >
                                {activity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Itinerary */}
                      <ItinerarySection itinerary={itineraryToUse} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPlansPage;