import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  Search,
  Filter,
  User,
  Eye,
  Calendar,
  MapPin,
  Users,
  X,
  Phone,
  Mail,
  IndianRupee,
  CreditCard,
  Loader2,
  Package,
  Sparkles,
  UserX,
  ChevronRight,
  EyeOff,
} from "lucide-react";



// export default function PassengerManagement() {
//   const [trips, setTrips] = useState([]);
//   const [filteredTrips, setFilteredTrips] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [selectedTrip, setSelectedTrip] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [userDetails, setUserDetails] = useState(null);
//   const [userDetailsLoading, setUserDetailsLoading] = useState(false);
//   const [passengersLoading, setPassengersLoading] = useState({});
//   const [searchResults, setSearchResults] = useState([]);
//   const [showSearchResults, setShowSearchResults] = useState(false);

//   // Fetch all trips
//   const fetchTrips = async () => {
//     try {
//       setLoading(true);
//       const [packagesRes, customRes] = await Promise.all([
//         axiosInstance.get("/api/admin/getPackagesTrips"),
//         axiosInstance.get("/api/admin/getPlanOwnTrips"),
//       ]);

//       const allTrips = [...packagesRes.data, ...customRes.data];

//       setTrips(allTrips);
//       setFilteredTrips(allTrips);
//     } catch (err) {
//       console.error("Failed to fetch trips:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Search passengers across all trips
//   const searchPassengers = async (searchTerm) => {
//     if (!searchTerm.trim()) {
//       setShowSearchResults(false);
//       setSearchResults([]);
//       return;
//     }

//     try {
//       const response = await axiosInstance.get(
//         `/api/admin/search-passengers?q=${encodeURIComponent(searchTerm)}`
//       );
//       setSearchResults(response.data);
//       setShowSearchResults(true);
//     } catch (err) {
//       console.error("Failed to search passengers:", err);
//       setSearchResults([]);
//     }
//   };

//   // Fetch passengers for a specific trip
//   const fetchPassengersForTrip = async (tripId) => {
//     try {
//       setPassengersLoading((prev) => ({ ...prev, [tripId]: true }));

//       const response = await axiosInstance.get(
//         `/api/admin/trip-passengers/${tripId}`
//       );

//       setTrips((prev) =>
//         prev.map((trip) =>
//           trip.tripId === tripId ? { ...trip, passengers: response.data } : trip
//         )
//       );
//     } catch (err) {
//       console.error(`Failed to fetch passengers for trip ${tripId}:`, err);
//     } finally {
//       setPassengersLoading((prev) => ({ ...prev, [tripId]: false }));
//     }
//   };

//   useEffect(() => {
//     fetchTrips();
//   }, []);

//   // Debounced search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (searchTerm) {
//         searchPassengers(searchTerm);
//       } else {
//         setShowSearchResults(false);
//         setSearchResults([]);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // Filter trips based on search term and status
//   useEffect(() => {
//     if (searchTerm && showSearchResults) return; // Don't filter trips when showing search results

//     let filtered = [...trips];

//     if (searchTerm && !showSearchResults) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(
//         (trip) =>
//           trip.title?.toLowerCase().includes(term) ||
//           (trip.destination && trip.destination.toLowerCase().includes(term))
//       );
//     }

//     if (filterStatus !== "all") {
//       filtered = filtered.filter((trip) =>
//         filterStatus === "active" ? trip.isActive : !trip.isActive
//       );
//     }

//     setFilteredTrips(filtered);
//   }, [searchTerm, filterStatus, trips, showSearchResults]);

//   // Fetch user details
//   const fetchUserDetails = async (tripId) => {
//     try {
//       setUserDetailsLoading(true);
//       const response = await axiosInstance.get(
//         `/api/admin/payment-details/${tripId}`
//       );
//       setUserDetails(response.data);
//     } catch (err) {
//       console.error("Failed to fetch user details:", err);
//     } finally {
//       setUserDetailsLoading(false);
//     }
//   };

//   const handleUserClick = (trip, user) => {
//     setSelectedTrip(trip);
//     setSelectedUser(user);
//     fetchUserDetails(trip.tripId);
//   };

//   const handleSearchResultClick = (result) => {
//     // Find the trip that this user belongs to
//     const userTrip = trips.find((trip) => trip.tripId === result.tripId);
//     if (userTrip) {
//       setSelectedTrip(userTrip);
//       setSelectedUser(result);
//       fetchUserDetails(result.tripId);
//     }
//   };

//   const closeUserModal = () => {
//     setSelectedUser(null);
//     setUserDetails(null);
//   };

//   const clearSearch = () => {
//     setSearchTerm("");
//     setShowSearchResults(false);
//     setSearchResults([]);
//   };

//   if (loading) {
//     return (
//       <div className="h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
//           <p className="text-gray-600">Loading trips...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen bg-gray-50 overflow-y-auto custom-scrollbar">
//       {/* <style>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 8px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f5f9;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: linear-gradient(180deg, #3b82f6, #2563eb);
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: linear-gradient(180deg, #2563eb, #1d4ed8);
//         }
//         .custom-scrollbar {
//           scrollbar-width: thin;
//           scrollbar-color: #3b82f6 #f1f5f9;
//         }
//       `}</style> */}

//       <style>{`
//   .custom-scrollbar::-webkit-scrollbar {
//     width: 8px;
//   }
//   .custom-scrollbar::-webkit-scrollbar-track {
//     background: #f1f5f9;
//     border-radius: 10px;
//   }
//   .custom-scrollbar::-webkit-scrollbar-thumb {
//     background: #d1d5db; /* light gray */
//     border-radius: 10px;
//   }
//   .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//     background: #9ca3af; /* darker gray on hover */
//   }
//   .custom-scrollbar {
//     scrollbar-width: thin;
//     scrollbar-color: #d1d5db #f1f5f9; /* thumb | track */
//   }
// `}</style>

//       <div className="p-4 md:p-6">
//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//                 Passenger Management
//               </h1>
//               <p className="text-gray-600 mt-1">
//                 Manage and view all passenger details
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Search and Filter Section */}
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Search Input */}
//             <div className="relative flex-1">
//               <Search
//                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                 size={20}
//               />
//               <input
//                 type="text"
//                 placeholder="Search by user name, email, phone, package title..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//               />
//               {searchTerm && (
//                 <button
//                   onClick={clearSearch}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   <X size={20} />
//                 </button>
//               )}
//             </div>

//             {/* Filter Dropdown */}
//             <div className="relative">
//               <Filter
//                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                 size={20}
//               />
//               <select
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//                 className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white min-w-[150px]"
//               >
//                 <option value="all">All Status</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>
//           </div>

//           {/* Search Results Dropdown */}
//           {showSearchResults && searchResults.length > 0 && (
//             <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//               <div className="p-2 bg-gray-50 border-b">
//                 <p className="text-sm font-medium text-gray-700">
//                   Search Results ({searchResults.length})
//                 </p>
//               </div>
//               {searchResults.map((result, index) => (
//                 <div
//                   key={index}
//                   className="p-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
//                   onClick={() => handleSearchResultClick(result)}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="font-medium text-gray-900">{result.name}</p>
//                       <p className="text-sm text-gray-600">{result.email}</p>
//                       <p className="text-xs text-gray-500">{result.phone}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
//                         {result.tripType === "PACKAGE" ? "Package" : "Custom"}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         Trip: {result.tripTitle}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {showSearchResults && searchResults.length === 0 && (
//             <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
//               <p className="text-gray-600 text-center">No passengers found</p>
//             </div>
//           )}
//         </div>

//         {/* Results Count */}
//         {!showSearchResults && (
//           <div className="mb-4">
//             <p className="text-gray-600">
//               Showing {filteredTrips.length} trip
//               {filteredTrips.length !== 1 ? "s" : ""}
//               {searchTerm && ` for "${searchTerm}"`}
//             </p>
//           </div>
//         )}

//         {/* Content */}
//         {showSearchResults ? (
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">
//               Search Results
//             </h2>
//             <p className="text-gray-600">
//               Click on any search result above to view passenger details
//             </p>
//           </div>
//         ) : (
//           <>
//             {/* Trips Grid */}
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {filteredTrips.map((trip) => (
//                 <TripCard
//                   key={trip.tripId}
//                   trip={trip}
//                   onUserClick={handleUserClick}
//                   onLoadPassengers={fetchPassengersForTrip}
//                   loading={passengersLoading[trip.tripId]}
//                 />
//               ))}
//             </div>

//             {filteredTrips.length === 0 && !loading && (
//               <div className="text-center py-12 bg-white rounded-xl shadow-sm">
//                 <div className="text-gray-400 text-6xl mb-4">🔍</div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                   No trips found
//                 </h3>
//                 <p className="text-gray-600">
//                   Try adjusting your search criteria or filters
//                 </p>
//               </div>
//             )}
//           </>
//         )}

//         {/* User Details Modal */}
//         {selectedUser && (
//           <UserDetailsModal
//             user={selectedUser}
//             userDetails={userDetails}
//             trip={selectedTrip}
//             loading={userDetailsLoading}
//             onClose={closeUserModal}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// function TripCard({ trip, onUserClick, onLoadPassengers, loading }) {
//   const hasPassengers = trip.passengers && trip.passengers.length > 0;
//   const shouldFetchPassengers = trip.enrolledCount > 0 && !hasPassengers;
//   const isPackageTrip = trip.tripType === "PACKAGE";

//   return (
//     <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 h-[520px] flex flex-col border border-gray-100">
//       {/* Trip Header with Image */}
//       <div className="mb-4 relative flex-shrink-0">
//         <div className="h-40 rounded-lg overflow-hidden mb-3 shadow-sm">
//           <img
//             src={
//               trip.images?.[0] ||
//               "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Trip+Image"
//             }
//             alt={trip.title}
//             className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
//             onError={(e) => {
//               e.target.src =
//                 "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Trip+Image";
//             }}
//           />
//         </div>

//         {/* Trip Type Badge */}
//         <div
//           className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
//             isPackageTrip
//               ? "bg-blue-100 text-blue-800 border border-blue-200"
//               : "bg-purple-100 text-purple-800 border border-purple-200"
//           }`}
//         >
//           {isPackageTrip ? (
//             <span className="flex items-center">
//               <Package size={12} className="mr-1" />
//               Package
//             </span>
//           ) : (
//             <span className="flex items-center">
//               <Sparkles size={12} className="mr-1" />
//               Customized
//             </span>
//           )}
//         </div>

//         <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
//           {trip.title}
//         </h3>
//         <div className="flex items-center text-sm text-gray-600">
//           <Calendar size={16} className="mr-2 text-blue-500" />
//           <span className="font-medium">
//             {trip.startDate
//               ? new Date(trip.startDate).toLocaleDateString()
//               : "N/A"}{" "}
//             -{" "}
//             {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : "N/A"}
//           </span>
//         </div>
//       </div>

//       {/* Passengers Section */}
//       <div className="border-t border-gray-100 pt-4 flex-1 flex flex-col overflow-hidden">
//         <div className="flex items-center justify-between mb-3 flex-shrink-0">
//           <h4 className="font-semibold text-gray-900 flex items-center">
//             <Users size={16} className="mr-2 text-blue-500" />
//             Passengers
//           </h4>
//           <span
//             className={`px-3 py-1 rounded-full text-sm font-medium ${
//               trip.enrolledCount > 0
//                 ? "bg-green-100 text-green-800 border border-green-200"
//                 : "bg-gray-100 text-gray-600 border border-gray-200"
//             }`}
//           >
//             {trip.enrolledCount} booked
//           </span>
//         </div>

//         {shouldFetchPassengers && !loading && (
//           <div className="mb-3 flex-shrink-0">
//             <button
//               onClick={() => onLoadPassengers(trip.tripId)}
//               className="w-full bg-white border-2 border-blue-200 text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 font-medium flex items-center justify-center space-x-2 group"
//             >
//               <Users
//                 size={16}
//                 className="group-hover:scale-110 transition-transform"
//               />
//               <span>Load Passengers</span>
//               <ChevronRight
//                 size={14}
//                 className="group-hover:translate-x-1 transition-transform"
//               />
//             </button>
//           </div>
//         )}

//         {loading && (
//           <div className="flex justify-center py-4 flex-shrink-0">
//             <div className="flex items-center space-x-2 text-blue-600">
//               <Loader2 className="animate-spin h-5 w-5" />
//               <span className="text-sm font-medium">Loading...</span>
//             </div>
//           </div>
//         )}

//         <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//           <div className="space-y-2 pr-1">
//             {hasPassengers ? (
//               trip.passengers.map((user, index) => (
//                 <div
//                   key={user._id}
//                   className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-blue-100 cursor-pointer transition-all duration-200 flex-shrink-0 border border-transparent hover:border-blue-200 group"
//                   onClick={() => onUserClick(trip, user)}
//                 >
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-shadow">
//                       <User size={16} className="text-blue-600" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900 group-hover:text-blue-900 transition-colors">
//                         {user.name}
//                       </p>
//                       <p className="text-sm text-gray-600 group-hover:text-blue-700 transition-colors">
//                         {user.email}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
//                       #{index + 1}
//                     </span>
//                     <Eye
//                       size={18}
//                       className="text-gray-400 group-hover:text-blue-500 transition-colors"
//                     />
//                   </div>
//                 </div>
//               ))
//             ) : trip.enrolledCount > 0 ? (
//               <div className="text-center py-6">
//                 <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
//                   <Users size={24} className="text-blue-500" />
//                 </div>
//                 <p className="text-gray-600 font-medium">
//                   Click to load passengers
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">
//                   View enrolled travelers
//                 </p>
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
//                   <UserX size={24} className="text-gray-400" />
//                 </div>
//                 <p className="text-gray-500 font-medium">No passengers yet</p>
//                 <p className="text-sm text-gray-400 mt-1">
//                   Waiting for bookings
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


export default function PassengerManagement() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [passengersLoading, setPassengersLoading] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Fetch all trips
  const fetchTrips = async () => {
    try {
      setLoading(true);
      const [packagesRes, customRes] = await Promise.all([
        axiosInstance.get("/api/admin/getPackagesTrips"),
        axiosInstance.get("/api/admin/getPlanOwnTrips"),
      ]);

      const allTrips = [...packagesRes.data, ...customRes.data];

      setTrips(allTrips);
      setFilteredTrips(allTrips);
    } catch (err) {
      console.error("Failed to fetch trips:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search passengers across all trips
  const searchPassengers = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }

    try {
      const response = await axiosInstance.get(
        `/api/admin/search-passengers?q=${encodeURIComponent(searchTerm)}`
      );
      setSearchResults(response.data);
      setShowSearchResults(true);
    } catch (err) {
      console.error("Failed to search passengers:", err);
      setSearchResults([]);
    }
  };

  // Fetch passengers for a specific trip
  const fetchPassengersForTrip = async (tripId) => {
    try {
      setPassengersLoading((prev) => ({ ...prev, [tripId]: true }));

      const response = await axiosInstance.get(
        `/api/admin/trip-passengers/${tripId}`
      );

      setTrips((prev) =>
        prev.map((trip) =>
          trip.tripId === tripId ? { ...trip, passengers: response.data } : trip
        )
      );
    } catch (err) {
      console.error(`Failed to fetch passengers for trip ${tripId}:`, err);
    } finally {
      setPassengersLoading((prev) => ({ ...prev, [tripId]: false }));
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchPassengers(searchTerm);
      } else {
        setShowSearchResults(false);
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter trips based on search term and status
  useEffect(() => {
    if (searchTerm && showSearchResults) return; // Don't filter trips when showing search results

    let filtered = [...trips];

    if (searchTerm && !showSearchResults) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (trip) =>
          trip.title?.toLowerCase().includes(term) ||
          (trip.destination && trip.destination.toLowerCase().includes(term))
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((trip) =>
        filterStatus === "active" ? trip.isActive : !trip.isActive
      );
    }

    setFilteredTrips(filtered);
  }, [searchTerm, filterStatus, trips, showSearchResults]);

  // Fetch user details
  const fetchUserDetails = async (tripId) => {
    try {
      setUserDetailsLoading(true);
      const response = await axiosInstance.get(
        `/api/admin/payment-details/${tripId}`
      );
      setUserDetails(response.data);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
    } finally {
      setUserDetailsLoading(false);
    }
  };

  const handleUserClick = (trip, user) => {
    setSelectedTrip(trip);
    setSelectedUser(user);
    fetchUserDetails(trip.tripId);
  };

  const handleSearchResultClick = (result) => {
    // Find the trip that this user belongs to
    const userTrip = trips.find((trip) => trip.tripId === result.tripId);
    if (userTrip) {
      setSelectedTrip(userTrip);
      setSelectedUser(result);
      fetchUserDetails(result.tripId);
    }
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setUserDetails(null);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowSearchResults(false);
    setSearchResults([]);
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 overflow-y-auto custom-scrollbar">
      <style>{`
  /* Desktop scrollbar styles */
  @media (min-width: 768px) {
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: #d1d5db #f1f5f9;
    }
  }
  
  /* Mobile - hide custom scrollbar to prevent UI breaking */
  @media (max-width: 767px) {
    .custom-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .custom-scrollbar {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
  }
  
  /* Card scrollbar styles for desktop only */
  @media (min-width: 768px) {
    .card-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .card-scrollbar::-webkit-scrollbar-track {
      background: #f3f4f6;
      border-radius: 4px;
    }
    .card-scrollbar::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 4px;
    }
    .card-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }
  }
  
  @media (max-width: 767px) {
    .card-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .card-scrollbar {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
  }
`}</style>

      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Passenger Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and view all passenger details
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by user name, email, phone, package title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white min-w-[150px]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div className="p-2 bg-gray-50 border-b">
                <p className="text-sm font-medium text-gray-700">
                  Search Results ({searchResults.length})
                </p>
              </div>
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="p-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => handleSearchResultClick(result)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{result.name}</p>
                      <p className="text-sm text-gray-600">{result.email}</p>
                      <p className="text-xs text-gray-500">{result.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {result.tripType === "PACKAGE" ? "Package" : "Custom"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Trip: {result.tripTitle}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showSearchResults && searchResults.length === 0 && (
            <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600 text-center">No passengers found</p>
            </div>
          )}
        </div>

        {/* Results Count */}
        {!showSearchResults && (
          <div className="mb-4">
            <p className="text-gray-600">
              Showing {filteredTrips.length} trip
              {filteredTrips.length !== 1 ? "s" : ""}
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        )}

        {/* Content */}
        {showSearchResults ? (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Search Results
            </h2>
            <p className="text-gray-600">
              Click on any search result above to view passenger details
            </p>
          </div>
        ) : (
          <>
            {/* Trips Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTrips.map((trip) => (
                <TripCard
                  key={trip.tripId}
                  trip={trip}
                  onUserClick={handleUserClick}
                  onLoadPassengers={fetchPassengersForTrip}
                  loading={passengersLoading[trip.tripId]}
                />
              ))}
            </div>

            {filteredTrips.length === 0 && !loading && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No trips found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            )}
          </>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <UserDetailsModal
            user={selectedUser}
            userDetails={userDetails}
            trip={selectedTrip}
            loading={userDetailsLoading}
            onClose={closeUserModal}
          />
        )}
      </div>
    </div>
  );
}

function TripCard({ trip, onUserClick, onLoadPassengers, loading }) {
  const hasPassengers = trip.passengers && trip.passengers.length > 0;
  const shouldFetchPassengers = trip.enrolledCount > 0 && !hasPassengers;
  const isPackageTrip = trip.tripType === "PACKAGE";

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 h-[520px] flex flex-col border border-gray-100">
      {/* Trip Header with Image */}
      <div className="mb-4 relative flex-shrink-0">
        <div className="h-40 rounded-lg overflow-hidden mb-3 shadow-sm">
          <img
            src={
              trip.images?.[0] ||
              "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Trip+Image"
            }
            alt={trip.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Trip+Image";
            }}
          />
        </div>

        {/* Trip Type Badge */}
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
            isPackageTrip
              ? "bg-blue-100 text-blue-800 border border-blue-200"
              : "bg-purple-100 text-purple-800 border border-purple-200"
          }`}
        >
          {isPackageTrip ? (
            <span className="flex items-center">
              <Package size={12} className="mr-1" />
              Package
            </span>
          ) : (
            <span className="flex items-center">
              <Sparkles size={12} className="mr-1" />
              Customized
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {trip.title}
        </h3>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={16} className="mr-2 text-blue-500" />
          <span className="font-medium">
            {trip.startDate
              ? new Date(trip.startDate).toLocaleDateString()
              : "N/A"}{" "}
            -{" "}
            {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : "N/A"}
          </span>
        </div>
      </div>

      {/* Passengers Section */}
      <div className="border-t border-gray-100 pt-4 flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <Users size={16} className="mr-2 text-blue-500" />
            Passengers
          </h4>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              trip.enrolledCount > 0
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-gray-100 text-gray-600 border border-gray-200"
            }`}
          >
            {trip.enrolledCount} booked
          </span>
        </div>

        {shouldFetchPassengers && !loading && (
          <div className="mb-3 flex-shrink-0">
            <button
              onClick={() => onLoadPassengers(trip.tripId)}
              className="w-full bg-white border-2 border-blue-200 text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 font-medium flex items-center justify-center space-x-2 group"
            >
              <Users
                size={16}
                className="group-hover:scale-110 transition-transform"
              />
              <span>Load Passengers</span>
              <ChevronRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-4 flex-shrink-0">
            <div className="flex items-center space-x-2 text-blue-600">
              <Loader2 className="animate-spin h-5 w-5" />
              <span className="text-sm font-medium">Loading...</span>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto card-scrollbar">
          <div className="space-y-2 pr-1">
            {hasPassengers ? (
              trip.passengers.map((user, index) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-blue-100 cursor-pointer transition-all duration-200 flex-shrink-0 border border-transparent hover:border-blue-200 group"
                  onClick={() => onUserClick(trip, user)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-shadow">
                      <User size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-blue-900 transition-colors">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-600 group-hover:text-blue-700 transition-colors">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      #{index + 1}
                    </span>
                    <Eye
                      size={18}
                      className="text-gray-400 group-hover:text-blue-500 transition-colors"
                    />
                  </div>
                </div>
              ))
            ) : trip.enrolledCount > 0 ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Users size={24} className="text-blue-500" />
                </div>
                <p className="text-gray-600 font-medium">
                  Click to load passengers
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  View enrolled travelers
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <UserX size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No passengers yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Waiting for bookings
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function UserDetailsModal({ user, userDetails, trip, loading, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Passenger Details</h3>
                <p className="text-blue-100">Complete booking information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-xl p-2 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600 mr-3" />
              <span>Loading details...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* User Basic Info */}
              <Section title="Personal Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem
                    icon={<User size={18} />}
                    label="Full Name"
                    value={userDetails?.name || user.name}
                  />
                  <DetailItem
                    icon={<Mail size={18} />}
                    label="Email"
                    value={userDetails?.email || user.email}
                  />
                  <DetailItem
                    icon={<Phone size={18} />}
                    label="Phone"
                    value={userDetails?.phone || user.phone}
                  />
                </div>
              </Section>

              {/* Trip Information */}
              <Section title="Trip Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem
                    icon={<MapPin size={18} />}
                    label="Destination"
                    value={trip?.destination}
                  />
                  <DetailItem
                    icon={<Calendar size={18} />}
                    label="Trip Dates"
                    value={
                      trip?.startDate && trip?.endDate
                        ? `${new Date(
                            trip.startDate
                          ).toLocaleDateString()} - ${new Date(
                            trip.endDate
                          ).toLocaleDateString()}`
                        : "N/A"
                    }
                  />
                  <DetailItem
                    icon={<Users size={18} />}
                    label="Trip Title"
                    value={trip?.title}
                  />
                  <DetailItem
                    icon={<CreditCard size={18} />}
                    label="Trip Type"
                    value={
                      trip?.tripType === "PACKAGE"
                        ? "Package Trip"
                        : "Custom Trip"
                    }
                  />
                </div>
              </Section>

              {/* Payment Information */}
              {userDetails && (
                <Section title="Payment Details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem
                      icon={<IndianRupee size={18} />}
                      label="Amount Paid"
                      value={
                        userDetails?.grandTotal
                          ? `₹${userDetails.grandTotal.toLocaleString()}`
                          : "N/A"
                      }
                    />
                    <DetailItem
                      icon={<CreditCard size={18} />}
                      label="Payment Status"
                      value={userDetails?.paymentStatus || "N/A"}
                    />
                    <DetailItem
                      icon={<Calendar size={18} />}
                      label="Payment Date"
                      value={
                        userDetails?.paymentDate
                          ? new Date(
                              userDetails.paymentDate
                            ).toLocaleDateString()
                          : "N/A"
                      }
                    />
                    <DetailItem
                      icon={<CreditCard size={18} />}
                      label="Transaction ID"
                      value={userDetails?.transactionId || "N/A"}
                    />
                  </div>
                </Section>
              )}

              {/* Additional Information */}
              {userDetails && (
                <Section title="Additional Details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem
                      label="Adults"
                      value={userDetails.adults || "0"}
                    />
                    <DetailItem
                      label="Children"
                      value={userDetails.children || "0"}
                    />
                    <DetailItem
                      label="Total Members"
                      value={userDetails.totalMembers || "0"}
                    />
                    <DetailItem
                      label="Pet Travel"
                      value={userDetails.travelWithPet ? "Yes" : "No"}
                    />
                  </div>
                </Section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
      {children}
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      {icon && <div className="text-gray-400 mt-1">{icon}</div>}
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium text-gray-900">{value || "Not available"}</p>
      </div>
    </div>
  );
}
