import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  Plus,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Search,
  Filter,
} from "lucide-react";
import CreateTripForm from "./CreateTripForm";
import { Calendar, Users, IndianRupee, Clock, MapPin } from "lucide-react";
import Loader from "../../components/Loader";
import { EnrollmentsModal } from "../../components/admin/EnrollmentsModal";

export default function AdminTrips() {
  const [packagesTrips, setPackagesTrips] = useState([]);
  const [customTrips, setCustomTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [viewingTrip, setViewingTrip] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dropdownCategory, setDropdownCategory] = useState([]);
  const [enrollmentModal, setEnrollmentModal] = useState({
    show: false,
    tripId: null,
  });

  //  Fetch all trips
  const fetchTrips = async () => {
    try {
      setLoading(true);
      const [packagesRes, customRes] = await Promise.all([
        axiosInstance.get("/api/admin/getPackagesTrips"),
        axiosInstance.get("/api/admin/getPlanOwnTrips"),
      ]);
      setPackagesTrips(packagesRes.data);
      setCustomTrips(customRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch trips");
    } finally {
      setLoading(false);
    }
  };
  const getDropdownCategory = async() => {
    try {
      const res = await axiosInstance.get("api/category/getCategoriesNames");
      setDropdownCategory(res.data.categories);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dropdown category");
    }
  }
  useEffect(() => {
    fetchTrips();
    getDropdownCategory();
  }, []);

  // Toggle trip status (Active/Inactive)
  const toggleTripStatus = async (tripId, isCurrentlyActive, tripType) => {
    try {
      const newStatus = !isCurrentlyActive;

      // Use tripId instead of _id in the URL
      await axiosInstance.patch(`/api/admin/trips/${tripId}/status`, {
        isActive: newStatus,
      });

      // Update local state - use tripId for comparison
      if (tripType === "PACKAGE") {
        setPackagesTrips((prev) =>
          prev.map((trip) =>
            trip.tripId === tripId || trip._id === tripId
              ? { ...trip, isActive: newStatus }
              : trip
          )
        );
      } else {
        setCustomTrips((prev) =>
          prev.map((trip) =>
            trip.tripId === tripId || trip._id === tripId
              ? { ...trip, isActive: newStatus }
              : trip
          )
        );
      }
    } catch (err) {
      console.error("Failed to update trip status:", err);
      alert("Failed to update trip status");
    }
  };

  //  Handle edit trip - FIXED to ensure we have proper trip data
  const handleEditTrip = (trip) => {
    setEditingTrip(trip);
    setViewingTrip(null);
    setShowDrawer(true);
  };

  //  Handle view trip details - FIXED to ensure we have proper trip data
  const handleViewTrip = (trip) => {
    setViewingTrip(trip);
    setEditingTrip(null);
    setShowDrawer(true);
  };

  //  Close drawer and reset states
  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setEditingTrip(null);
    setViewingTrip(null);
  };

  // Function to show enrollments
  const showEnrollments = (tripId) => {
    setEnrollmentModal({ show: true, tripId });
  };

  // Function to hide enrollments
  const hideEnrollments = () => {
    setEnrollmentModal({ show: false, tripId: null });
  };

  // Filter trips based on search and status
  const filterTrips = (trips) => {
    return trips.filter((trip) => {
      const matchesSearch =
        trip.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.destination?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && trip.isActive) ||
        (filterStatus === "inactive" && !trip.isActive);
      return matchesSearch && matchesStatus;
    });
  };

  const filteredPackageTrips = filterTrips(packagesTrips);
  const filteredCustomTrips = filterTrips(customTrips);

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="fixed inset-0 bg-red-50 flex items-center justify-center z-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <div className="text-lg font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );

  return (
    <>
      <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex flex-col overflow-hidden">
        {/* Header Section */}

        <div className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Trips Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your package and custom trips
                </p>
              </div>

              <button
                className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                onClick={() => {
                  setEditingTrip(null);
                  setViewingTrip(null);
                  setShowDrawer(true);
                }}
              >
                <Plus size={20} className="mr-2" /> Create New Trip
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 lg:p-6 space-y-8">
            {/* Search and Filter Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search adventures by title or destination..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                {/* Filter */}
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
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {packagesTrips.length}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Package Adventures
                </div>
              </div>
              <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow">
                <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {customTrips.length}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Custom Adventures
                </div>
              </div>
              <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
                <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {packagesTrips.filter((t) => t.isActive).length +
                    customTrips.filter((t) => t.isActive).length}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Active Adventures
                </div>
              </div>
              <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border-l-4 border-red-500 hover:shadow-md transition-shadow">
                <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {packagesTrips.filter((t) => !t.isActive).length +
                    customTrips.filter((t) => !t.isActive).length}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Inactive Adventures
                </div>
              </div>
            </div>

            {/* Slide-over drawer */}
            <div
              className={`fixed top-0 right-0 h-full w-full sm:w-3/4 md:w-2/3 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
                showDrawer ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {showDrawer && (
                <CreateTripForm
                  closeDrawer={handleCloseDrawer}
                  refreshTrips={fetchTrips}
                  editTripData={editingTrip}
                  viewTripData={viewingTrip}
                  categoryDropdown={dropdownCategory}
                />
              )}
            </div>

            <div className="space-y-10">
              {/* Package Trips */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                      Package Adventures
                    </h2>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                    {filteredPackageTrips.length} adventures
                  </div>
                </div>

                {filteredPackageTrips.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {filteredPackageTrips.map((trip, idx) => (
                      <TripCard
                        key={trip._id || trip.tripId || idx}
                        trip={trip}
                        tripType="PACKAGE"
                        onEdit={handleEditTrip}
                        onView={handleViewTrip}
                        onToggleStatus={toggleTripStatus}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <div className="text-gray-400 text-6xl mb-4">🏖️</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No package adventures found
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Try adjusting your search or filters to find more
                      adventures
                    </p>
                  </div>
                )}
              </div>

              {/* Custom Trips */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                      Custom Adventures
                    </h2>
                  </div>
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                    {filteredCustomTrips.length} adventures
                  </div>
                </div>

                {filteredCustomTrips.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {filteredCustomTrips.map((trip, idx) => (
                      <TripCard
                        key={trip._id || trip.tripId || idx}
                        trip={trip}
                        tripType="CUSTOMIZED"
                        onEdit={handleEditTrip}
                        onView={handleViewTrip}
                        onToggleStatus={toggleTripStatus}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <div className="text-gray-400 text-6xl mb-4">✈️</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No custom adventures found
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Try adjusting your search or filters to find more
                      adventures
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enrollment Modal */}
        {enrollmentModal.show && (
          <EnrollmentsModal
            tripId={enrollmentModal.tripId}
            onClose={hideEnrollments}
          />
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db #f3f4f6;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
          border: 2px solid #f3f4f6;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: #f3f4f6;
        }
      `}</style>
    </>
  );
}

function TripCard({ trip, tripType, onEdit, onView, onToggleStatus }) {
  const tripId = trip.tripId || trip._id;
  const [showEnrollments, setShowEnrollments] = useState(false);

  return (
    <>
      <div className="bg-white shadow-md hover:shadow-xl rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
        {/* Image with overlay */}
        <div className="relative h-48 lg:h-52 w-full overflow-hidden">
          <img
            src={trip.images?.[0] || trip.image?.[0] || "/placeholder.jpg"}
            alt={trip.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${
                tripType === "PACKAGE"
                  ? "bg-blue-100/90 text-blue-800"
                  : "bg-purple-100/90 text-purple-800"
              }`}
            >
              {tripType === "PACKAGE" ? "Package" : "Custom"}
            </span>
          </div>
          <div className="absolute top-3 right-3 flex space-x-1">            
            {/* Status toggle button */}
            <button
              onClick={() => onToggleStatus(tripId, trip.isActive, tripType)}
              className="p-1 rounded-full bg-white/90 backdrop-blur-sm transition-all hover:bg-white shadow-sm"
            >
              {trip.isActive ? (
                <ToggleRight className="w-5 h-5 text-green-600" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 line-clamp-2 mb-2">
              {trip.title}
            </h3>

            {trip.destination && (
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                {trip.destination}
              </div>
            )}
          </div>

          {/* Trip Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              <span className="font-medium">{trip.duration} Days</span>
            </div>

            {/* Enrollment count with click handler */}
            <div
              className="flex items-center text-gray-600 cursor-pointer hover:text-blue-600"
              onClick={() => setShowEnrollments(true)}
            >
              <Users className="w-4 h-4 mr-2 text-gray-400" />
              <span className="font-medium">
                {trip.enrolledCount || trip.total_members || 0} Enrolled
              </span>
              {/* <span className="ml-2 text-xs text-blue-500">(View all)</span> */}
            </div>
             <div
              className="flex items-center text-gray-600 cursor-pointer hover:text-blue-600"
              onClick={() => setShowEnrollments(true)}
            >
              <Users className="w-4 h-4 mr-2 text-gray-400" />
              <span className="font-medium">
                {trip.totalSeats|| 0} Total Seats
              </span>
              {/* <span className="ml-2 text-xs text-blue-500">(View all)</span> */}
            </div>

            <div className="col-span-2 flex items-center text-gray-800 font-bold text-lg">
              <IndianRupee className="w-5 h-5 mr-1 text-green-600" />₹
              {(
                trip.payment?.grandTotal ||
                trip.grandTotal ||
                0
              ).toLocaleString()}
            </div>
          </div>

          {/* Dates */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span>
                {trip.startDate
                  ? new Date(trip.startDate).toLocaleDateString()
                  : "N/A"}{" "}
                -{" "}
                {trip.endDate
                  ? new Date(trip.endDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                trip.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  trip.isActive ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              {trip.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onView(trip)}
              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm"
            >
              View Details
            </button>
            <button
              onClick={() => onEdit(trip)}
              className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm"
            >
              Edit Adventure
            </button>
          </div>
        </div>
      </div>

      {/* Enrollment Modal - Rendered outside the card */}
      {showEnrollments && (
        <EnrollmentsModal
          tripId={tripId}
          onClose={() => setShowEnrollments(false)}
        />
      )}
    </>
  );
}