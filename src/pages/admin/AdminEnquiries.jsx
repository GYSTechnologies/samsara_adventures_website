import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  Search,
  Filter,
  Edit,
  Eye,
  Phone,
  Mail,
  Calendar,
  X,
  Users,
  MapPin,
  Clock,
} from "lucide-react";
import CreateTripForm from "./CreateTripForm";

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showItineraryForm, setShowItineraryForm] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    page: 1,
    limit: 10,
  });

  // Fetch enquiries
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/admin/enquiries", {
        params: filters,
      });
      setEnquiries(response.data.enquiries);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      alert("Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [filters]);

  // Handle status change
  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      await axiosInstance.patch(`/api/admin/enquiries/${enquiryId}/status`, {
        status: newStatus,
      });
      fetchEnquiries(); // Refresh list
      alert("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  // View enquiry details
  const viewEnquiryDetails = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowDetailModal(true);
  };

  // Edit itinerary
  const editItinerary = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowItineraryForm(true);
  };

  // const getStatusBadge = (status) => {
  //   const statusConfig = {
  //     PENDING: {
  //       bg: "bg-amber-100",
  //       text: "text-amber-800",
  //       border: "border-amber-200",
  //     },
  //     APPROVED: {
  //       bg: "bg-emerald-100",
  //       text: "text-emerald-800",
  //       border: "border-emerald-200",
  //     },
  //     REJECTED: {
  //       bg: "bg-red-100",
  //       text: "text-red-800",
  //       border: "border-red-200",
  //     },
  //     COMPLETED: {
  //       bg: "bg-blue-100",
  //       text: "text-blue-800",
  //       border: "border-blue-200",
  //     },
  //   };
  //   return statusConfig[status] || statusConfig.PENDING;
  // };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: {
        bg: "bg-amber-100",
        text: "text-amber-800",
        border: "border-amber-200",
      },
      APPROVED: {
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        border: "border-emerald-200",
      },
      PAID: {
        // ✅ Add this
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
      },
      REJECTED: {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200",
      },
      COMPLETED: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-200",
      },
    };
    return statusConfig[status] || statusConfig.PENDING;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-2 py-2 sm:p-6 overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto min-w-0">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-3 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                Custom Trip Enquiries
              </h1>
              <p className="text-slate-600 mt-1 text-xs sm:text-base">
                Manage and track all customer trip requests
              </p>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto min-w-0">
              {/* Search Input */}
              <div className="relative flex-1 lg:flex-none min-w-0">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 z-10" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value, page: 1 })
                  }
                  className="w-full lg:w-60 pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm min-w-0"
                />
              </div>

              {/* Status Filter */}
              {/* <div className="relative min-w-0">
                <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none z-10" />
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value, page: 1 })
                  }
                  className="w-full sm:w-auto pl-8 pr-6 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm appearance-none cursor-pointer min-w-[100px]"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div> */}
              {/* Status Filter */}
              <div className="relative min-w-0">
                <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none z-10" />
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value, page: 1 })
                  }
                  className="w-full sm:w-auto pl-8 pr-6 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm appearance-none cursor-pointer min-w-[100px]"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="PAID">Paid</option> {/* ✅ Add this option */}
                  <option value="REJECTED">Rejected</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Enquiries Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-4">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 sm:border-3 border-blue-600 border-t-transparent"></div>
              </div>
              <p className="text-slate-600 font-medium text-sm sm:text-base">
                Loading enquiries...
              </p>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium text-sm sm:text-base">
                No enquiries found
              </p>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Trip Details
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Travel Dates
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {enquiries.map((enquiry, index) => {
                        const statusStyle = getStatusBadge(
                          enquiry.requestStatus
                        );
                        return (
                          <tr
                            key={enquiry._id}
                            className="hover:bg-slate-50 transition-colors duration-150"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                  {(enquiry.name || "U")
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-semibold text-slate-900">
                                    {enquiry.name || "N/A"}
                                  </div>
                                  <div className="text-sm text-slate-500 flex items-center mt-1">
                                    <Mail className="w-3 h-3 mr-1" />
                                    {enquiry.email}
                                  </div>
                                  <div className="text-sm text-slate-500 flex items-center">
                                    <Phone className="w-3 h-3 mr-1" />
                                    {enquiry.phone}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-900">
                                {enquiry.title}
                              </div>
                              <div className="text-sm text-slate-500 flex items-center mt-1">
                                <Users className="w-3 h-3 mr-1" />
                                {enquiry.adults} Adults, {enquiry.childrens}{" "}
                                Children
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-slate-900 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {enquiry.startDate
                                  ? new Date(
                                      enquiry.startDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </div>
                              <div className="text-sm text-slate-500 flex items-center mt-1">
                                <Clock className="w-3 h-3 mr-1" />
                                {enquiry.duration || "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {/* <select
                                value={enquiry.requestStatus}
                                onChange={(e) =>
                                  handleStatusChange(
                                    enquiry._id,
                                    e.target.value
                                  )
                                }
                                className={`px-3 py-2 rounded-lg text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer`}
                              >
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="PAID">Paid</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="COMPLETED">Completed</option>
                              </select> */}
                              <select
                                value={enquiry.requestStatus}
                                onChange={(e) =>
                                  handleStatusChange(
                                    enquiry._id,
                                    e.target.value
                                  )
                                }
                                className={`px-3 py-2 rounded-lg text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer`}
                                // ✅ ADD THIS - Disable if status is PAID
                                disabled={enquiry.requestStatus === "PAID"}
                              >
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="PAID">Paid</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="COMPLETED">Completed</option>
                              </select>
                            </td>
                            {/* <td className="px-6 py-4">
                              <div className="flex justify-center space-x-2">
                                <button
                                  onClick={() => viewEnquiryDetails(enquiry)}
                                  className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                                  title="View Details"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => editItinerary(enquiry)}
                                  className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors duration-200"
                                  title="Edit Itinerary"
                                >
                                  <Edit size={16} />
                                </button>
                                <a
                                  href={`tel:${enquiry.phone}`}
                                  className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                                  title="Call Customer"
                                >
                                  <Phone size={16} />
                                </a>
                                <a
                                  href={`mailto:${enquiry.email}`}
                                  className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                                  title="Email Customer"
                                >
                                  <Mail size={16} />
                                </a>
                              </div>
                            </td> */}
                            <td className="px-6 py-4">
                              <div className="flex justify-center space-x-2">
                                <button
                                  onClick={() => viewEnquiryDetails(enquiry)}
                                  className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                                  title="View Details"
                                >
                                  <Eye size={16} />
                                </button>

                                {/* ✅ ADD THIS CONDITION - Hide Edit for PAID status */}
                                {enquiry.requestStatus !== "PAID" && (
                                  <button
                                    onClick={() => editItinerary(enquiry)}
                                    className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors duration-200"
                                    title="Edit Itinerary"
                                  >
                                    <Edit size={16} />
                                  </button>
                                )}

                                <a
                                  href={`tel:${enquiry.phone}`}
                                  className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                                  title="Call Customer"
                                >
                                  <Phone size={16} />
                                </a>
                                <a
                                  href={`mailto:${enquiry.email}`}
                                  className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                                  title="Email Customer"
                                >
                                  <Mail size={16} />
                                </a>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden px-2 py-3 space-y-3 overflow-x-hidden">
                {enquiries.map((enquiry, index) => {
                  const statusStyle = getStatusBadge(enquiry.requestStatus);
                  return (
                    <div
                      key={enquiry._id}
                      className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-3 w-full min-w-0"
                    >
                      {/* Header - Customer Info & Status */}
                      <div className="flex items-start justify-between mb-3 min-w-0">
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            {(enquiry.name || "U").charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-slate-900 text-sm truncate">
                              {enquiry.name || "N/A"}
                            </h3>
                            <p className="text-xs text-slate-600 truncate">
                              {enquiry.email}
                            </p>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          <select
                            value={enquiry.requestStatus}
                            onChange={(e) =>
                              handleStatusChange(enquiry._id, e.target.value)
                            }
                            className={`px-1.5 py-1 rounded-lg text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} focus:ring-2 focus:ring-blue-500 transition-all min-w-0`}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="PAID">Paid</option>

                            <option value="REJECTED">Rejected</option>
                            <option value="COMPLETED">Completed</option>
                          </select>
                        </div>
                      </div>

                      {/* Trip Title */}
                      <div className="mb-3 p-2 bg-white rounded-lg border border-slate-100 min-w-0">
                        <h4 className="font-medium text-slate-900 text-xs leading-relaxed break-words">
                          {enquiry.title}
                        </h4>
                      </div>

                      {/* Trip Details Grid */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center p-2 bg-white rounded-lg border border-slate-100 min-w-0">
                          <Users className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                          <span className="text-xs text-slate-700 font-medium truncate">
                            {enquiry.adults} Adults, {enquiry.childrens}{" "}
                            Children
                          </span>
                        </div>

                        <div className="flex items-center p-2 bg-white rounded-lg border border-slate-100 min-w-0">
                          <Calendar className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
                          <span className="text-xs text-slate-700 truncate">
                            {enquiry.startDate
                              ? new Date(enquiry.startDate).toLocaleDateString()
                              : "Date not specified"}
                          </span>
                        </div>

                        <div className="flex items-center p-2 bg-white rounded-lg border border-slate-100 min-w-0">
                          <Phone className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" />
                          <span className="text-xs text-slate-700 truncate">
                            {enquiry.phone}
                          </span>
                        </div>

                        {enquiry.duration && (
                          <div className="flex items-center p-2 bg-white rounded-lg border border-slate-100 min-w-0">
                            <Clock className="w-4 h-4 mr-2 text-orange-600 flex-shrink-0" />
                            <span className="text-xs text-slate-700 truncate">
                              {enquiry.duration}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {/* <div className="flex gap-1 min-w-0">
                        <button
                          onClick={() => viewEnquiryDetails(enquiry)}
                          className="flex-1 px-2 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center justify-center shadow-sm min-w-0"
                        >
                          <Eye size={12} className="mr-1 flex-shrink-0" />
                          <span className="truncate">View</span>
                        </button>
                        <button
                          onClick={() => editItinerary(enquiry)}
                          className="flex-1 px-2 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center justify-center shadow-sm min-w-0"
                        >
                          <Edit size={12} className="mr-1 flex-shrink-0" />
                          <span className="truncate">Edit</span>
                        </button>
                      </div> */}
                      {/* Action Buttons */}
                      <div className="flex gap-1 min-w-0">
                        <button
                          onClick={() => viewEnquiryDetails(enquiry)}
                          className="flex-1 px-2 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center justify-center shadow-sm min-w-0"
                        >
                          <Eye size={12} className="mr-1 flex-shrink-0" />
                          <span className="truncate">View</span>
                        </button>

                        {/* ✅ ADD THIS CONDITION - Hide Edit for PAID status */}
                        {enquiry.requestStatus !== "PAID" && (
                          <button
                            onClick={() => editItinerary(enquiry)}
                            className="flex-1 px-2 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center justify-center shadow-sm min-w-0"
                          >
                            <Edit size={12} className="mr-1 flex-shrink-0" />
                            <span className="truncate">Edit</span>
                          </button>
                        )}
                      </div>

                      {/* Contact Actions */}
                      <div className="flex gap-1 mt-2 min-w-0">
                        <a
                          href={`tel:${enquiry.phone}`}
                          className="flex-1 px-2 py-1.5 bg-white text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center justify-center border border-slate-200 min-w-0"
                        >
                          <Phone size={12} className="mr-1 flex-shrink-0" />
                          <span className="truncate">Call</span>
                        </a>
                        <a
                          href={`mailto:${enquiry.email}`}
                          className="flex-1 px-2 py-1.5 bg-white text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center justify-center border border-slate-200 min-w-0"
                        >
                          <Mail size={12} className="mr-1 flex-shrink-0" />
                          <span className="truncate">Email</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Enquiry Detail Modal */}
      {showDetailModal && selectedEnquiry && (
        <EnquiryDetailModal
          enquiry={selectedEnquiry}
          onClose={() => setShowDetailModal(false)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Itinerary Form Drawer */}
      {showItineraryForm && selectedEnquiry && (
        <ItineraryFormDrawer
          enquiry={selectedEnquiry}
          onClose={() => setShowItineraryForm(false)}
          onSave={fetchEnquiries}
        />
      )}
    </div>
  );
}

// Enhanced Enquiry Detail Modal Component
function EnquiryDetailModal({ enquiry, onClose, onStatusChange }) {
  const statusStyle = {
    PENDING: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      border: "border-amber-200",
    },
    APPROVED: {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      border: "border-emerald-200",
    },
    PAID: {
      // ✅ Add this
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200",
    },
    REJECTED: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200",
    },
    COMPLETED: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-200",
    },
  }[enquiry.requestStatus] || {
    bg: "bg-slate-100",
    text: "text-slate-800",
    border: "border-slate-200",
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-2 py-2 overflow-hidden">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col min-w-0">
        {/* Header */}
        <div className="flex-shrink-0 bg-white border-b border-slate-200 px-3 sm:px-6 py-3 rounded-t-2xl">
          <div className="flex items-center justify-between min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-2xl font-bold text-slate-900 truncate">
                Enquiry Details
              </h2>
              <p className="text-slate-600 mt-1 text-xs sm:text-base">
                Trip request information
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200 flex-shrink-0 ml-2"
            >
              <X size={20} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 min-w-0">
          {/* Status Badge */}
          <div className="mb-6">
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} border`}
            >
              {enquiry.requestStatus}
            </span>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Customer Information */}
            <div className="bg-slate-50 rounded-xl p-3 sm:p-5 min-w-0">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {(enquiry.name || "U").charAt(0).toUpperCase()}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 ml-3 truncate">
                  Customer Information
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start min-w-0">
                  <span className="font-medium text-slate-600 w-12 sm:w-16 text-sm flex-shrink-0">
                    Name:
                  </span>
                  <span className="text-slate-900 text-sm break-words">
                    {enquiry.name || "N/A"}
                  </span>
                </div>
                <div className="flex items-start min-w-0">
                  <Mail className="w-4 h-4 text-slate-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="font-medium text-slate-600 w-10 sm:w-14 text-sm flex-shrink-0">
                    Email:
                  </span>
                  <a
                    href={`mailto:${enquiry.email}`}
                    className="text-blue-600 hover:text-blue-700 text-sm break-all min-w-0"
                  >
                    {enquiry.email}
                  </a>
                </div>
                <div className="flex items-start min-w-0">
                  <Phone className="w-4 h-4 text-slate-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="font-medium text-slate-600 w-10 sm:w-14 text-sm flex-shrink-0">
                    Phone:
                  </span>
                  <a
                    href={`tel:${enquiry.phone}`}
                    className="text-blue-600 hover:text-blue-700 text-sm break-all"
                  >
                    {enquiry.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Trip Information */}
            <div className="bg-slate-50 rounded-xl p-3 sm:p-5 min-w-0">
              <div className="flex items-center mb-4">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 mr-2 sm:mr-3 flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 truncate">
                  Trip Information
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start min-w-0">
                  <span className="font-medium text-slate-600 w-16 sm:w-20 text-sm flex-shrink-0">
                    Trip ID:
                  </span>
                  <span className="text-slate-900 font-mono text-xs sm:text-sm bg-white px-2 py-1 rounded border break-all min-w-0">
                    {enquiry.tripId}
                  </span>
                </div>
                <div className="flex items-start min-w-0">
                  <span className="font-medium text-slate-600 w-16 sm:w-20 text-sm flex-shrink-0 mt-1">
                    Title:
                  </span>
                  <span className="text-slate-900 font-medium text-sm break-words min-w-0">
                    {enquiry.title}
                  </span>
                </div>
                {/* <div className="flex items-start min-w-0">
                  <span className="font-medium text-slate-600 w-16 sm:w-20 text-sm flex-shrink-0 mt-1">
                    Pet:
                  </span>
                  <span className="text-slate-900 font-medium text-sm break-words min-w-0">
                    {enquiry.travelWithPet === false ? "No" : "Yes"}
                  </span>
                </div>
                 <div className="flex items-start min-w-0">
                  <span className="font-medium text-slate-600 w-16 sm:w-20 text-sm flex-shrink-0 mt-1">
                    Translator:
                  </span>
                  <span className="text-slate-900 font-medium text-sm break-words min-w-0">
                    {enquiry.travelWithPet === false ? "No" : "Yes"}
                  </span>
                </div>
              <div className="flex items-start min-w-0">
                  <span className="font-medium text-slate-600 w-16 sm:w-20 text-sm flex-shrink-0 mt-1">
                    Photographer:
                  </span>
                  <span className="text-slate-900 font-medium text-sm break-words min-w-0">
                    {enquiry.photographer === false ? "No" : "Yes"}
                  </span>
                </div> */}
                {/* Pet */}
                {enquiry?.travelWithPet && (
                  <div className="flex items-start min-w-0">
                    <span className="font-medium text-slate-600 w-16 sm:w-20 text-sm flex-shrink-0 mt-1">
                      Pet:
                    </span>
                    <span className="text-slate-900 font-medium text-sm break-words min-w-0">
                      Yes
                   
                    </span>
                  </div>
                )}

                {/* Translator */}
                {(enquiry?.translator || enquiry?.translator === true) && (
                  <div className="flex items-start min-w-0">
                    <span className="font-medium text-slate-600 w-16 sm:w-20 text-sm flex-shrink-0 mt-1">
                      Translator:
                    </span>
                    <span className="text-slate-900 font-medium text-sm break-words min-w-0">
                      Yes
                    </span>
                  </div>
                )}

                {/* Photographer */}
                {(enquiry?.photographer || enquiry?.photographer === true) && (
                  <div className="flex items-start min-w-0">
                    <span className="font-medium text-slate-600 w-16 sm:w-20 text-sm flex-shrink-0 mt-1">
                      Photographer:
                    </span>
                    <span className="text-slate-900 font-medium text-sm break-words min-w-0">
                      Yes
                    
                    </span>
                  </div>
                )}

                <div className="flex items-start min-w-0">
                  <span className="font-medium text-slate-600 w-16 sm:w-20 text-sm flex-shrink-0 mt-1">
                    Message:
                  </span>
                  <span className="text-slate-900 font-medium text-sm break-words min-w-0">
                    {enquiry.changes}
                  </span>
                </div>
                <div className="flex items-start min-w-0">
                  <Users className="w-4 h-4 text-slate-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="font-medium text-slate-600 w-14 sm:w-18 text-sm flex-shrink-0">
                    Travelers:
                  </span>
                  <span className="text-slate-900 text-sm">
                    {enquiry.adults} Adults, {enquiry.childrens} Children
                  </span>
                </div>
                <div className="flex items-start min-w-0">
                  <Calendar className="w-4 h-4 text-slate-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="font-medium text-slate-600 w-14 sm:w-18 text-sm flex-shrink-0">
                    Date:
                  </span>
                  <span className="text-slate-900 text-sm">
                    {enquiry.startDate
                      ? new Date(enquiry.startDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-start min-w-0">
                  <Clock className="w-4 h-4 text-slate-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="font-medium text-slate-600 w-14 sm:w-18 text-sm flex-shrink-0">
                    Duration:
                  </span>
                  <span className="text-slate-900 text-sm">
                    {enquiry.duration || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {enquiry.specialRequests && (
            <div className="mt-4 sm:mt-6 bg-slate-50 rounded-xl p-3 sm:p-5 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">
                Special Requests
              </h3>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base break-words">
                {enquiry.specialRequests}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-white border-t border-slate-200 px-3 sm:px-6 py-3 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end min-w-0">
            <a
              href={`tel:${enquiry.phone}`}
              className="px-4 sm:px-6 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center text-sm sm:text-base min-w-0"
            >
              <Phone size={16} className="mr-2 flex-shrink-0" />
              <span className="truncate">Call Customer</span>
            </a>
            <a
              href={`mailto:${enquiry.email}`}
              className="px-4 sm:px-6 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center text-sm sm:text-base min-w-0"
            >
              <Mail size={16} className="mr-2 flex-shrink-0" />
              <span className="truncate">Send Email</span>
            </a>
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Itinerary Form Drawer Component
function ItineraryFormDrawer({ enquiry, onClose, onSave }) {
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(false); // ✅ ADD THIS STATE

  useEffect(() => {
    // ✅ CHECK IF ENQUIRY IS PAID - SET READONLY MODE
    if (enquiry.requestStatus === "PAID") {
      setIsReadOnly(true);
    }

    const fetchTripData = async () => {
      try {
        // ✅ PEHLE CHECK KARO CUSTOM ITINERARY HAI YA NAHI
        if (enquiry.hasCustomItinerary && enquiry.customItinerary) {
          // ✅ AGAR CUSTOM ITINERARY HAI TOH WOHI DATA USE KARO
          const customItinerary = enquiry.customItinerary;

          const formattedData = {
            ...customItinerary,
            // Ensure proper array formats
            overview:
              Array.isArray(customItinerary.overview) &&
              customItinerary.overview.length > 0
                ? customItinerary.overview
                : [""],
            inclusions:
              Array.isArray(customItinerary.inclusions) &&
              customItinerary.inclusions.length > 0
                ? customItinerary.inclusions
                : [""],
            exclusions:
              Array.isArray(customItinerary.exclusions) &&
              customItinerary.exclusions.length > 0
                ? customItinerary.exclusions
                : [""],
            activities:
              Array.isArray(customItinerary.activities) &&
              customItinerary.activities.length > 0
                ? customItinerary.activities
                : [""],
            tags:
              Array.isArray(customItinerary.tags) &&
              customItinerary.tags.length > 0
                ? customItinerary.tags
                : [""],
            itinerary:
              Array.isArray(customItinerary.itinerary) &&
              customItinerary.itinerary.length > 0
                ? customItinerary.itinerary.map((item) => ({
                    dayNumber: item.dayNumber || "",
                    title: item.title || "",
                    description: item.description || "",
                    points:
                      Array.isArray(item.points) && item.points.length > 0
                        ? item.points
                        : [""],
                  }))
                : [{ dayNumber: "", title: "", description: "", points: [""] }],
            // Format dates
            startDate: customItinerary.startDate
              ? new Date(customItinerary.startDate).toISOString().split("T")[0]
              : "",
            endDate: customItinerary.endDate
              ? new Date(customItinerary.endDate).toISOString().split("T")[0]
              : "",
            // Reset images for form
            images: [],
            existingImages: Array.isArray(customItinerary.images)
              ? customItinerary.images
              : [],
          };

          setTripData(formattedData);
        } else {
          // ✅ AGAR CUSTOM ITINERARY NAHI HAI, TOH ORIGINAL TRIP DATA FETCH KARO
          const response = await axiosInstance.get(
            `/api/admin/trip-detail/${enquiry.tripId}`
          );

          const trip = response.data.trip;
          const formattedData = {
            ...trip,
            overview:
              Array.isArray(trip.overview) && trip.overview.length > 0
                ? trip.overview
                : [""],
            inclusions:
              Array.isArray(trip.inclusions) && trip.inclusions.length > 0
                ? trip.inclusions
                : [""],
            exclusions:
              Array.isArray(trip.exclusions) && trip.exclusions.length > 0
                ? trip.exclusions
                : [""],
            activities:
              Array.isArray(trip.activities) && trip.activities.length > 0
                ? trip.activities
                : [""],
            tags:
              Array.isArray(trip.tags) && trip.tags.length > 0
                ? trip.tags
                : [""],
            itinerary:
              Array.isArray(trip.itinerary) && trip.itinerary.length > 0
                ? trip.itinerary.map((item) => ({
                    dayNumber: item.dayNumber || "",
                    title: item.title || "",
                    description: item.description || "",
                    points:
                      Array.isArray(item.points) && item.points.length > 0
                        ? item.points
                        : [""],
                  }))
                : [{ dayNumber: "", title: "", description: "", points: [""] }],
            startDate: trip.startDate
              ? new Date(trip.startDate).toISOString().split("T")[0]
              : "",
            endDate: trip.endDate
              ? new Date(trip.endDate).toISOString().split("T")[0]
              : "",
            images: [],
            existingImages: Array.isArray(trip.images) ? trip.images : [],
          };

          setTripData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching trip details:", error);
        alert("Failed to load trip details");
      } finally {
        setLoading(false);
      }
    };

    if (enquiry.tripId || enquiry.hasCustomItinerary) {
      fetchTripData();
    }
  }, [enquiry]);

  const handleSubmit = async (formData) => {
    if (isReadOnly) {
      alert("Cannot modify itinerary after payment has been made");
      return;
    }
    try {
      const response = await axiosInstance.post(
        `/api/admin/enquiries/${enquiry._id}/create-itinerary`,
        formData
      );

      if (response.status === 200) {
        alert("Itinerary updated successfully!");
      } else if (response.status === 201) {
        alert("Itinerary created successfully!");
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving itinerary:", error);
      alert("Failed to save itinerary");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center px-2 py-2 overflow-hidden">
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-sm min-w-0">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-4">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 sm:border-3 border-blue-600 border-t-transparent"></div>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
              Loading Trip Details
            </h3>
            <p className="text-slate-600 text-sm sm:text-base">
              Please wait while we fetch the trip information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if tripData is available
  if (!tripData) {
    return (
      <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center px-2 py-2 overflow-hidden">
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-sm min-w-0">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
              No Trip Data Found
            </h3>
            <p className="text-slate-600 mb-4 text-sm sm:text-base">
              Unable to load trip information for this enquiry.
            </p>
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm z-50 overflow-hidden">
      <div className="flex h-full min-w-0">
        {/* Backdrop click area - hidden on mobile */}
        <div
          className="hidden lg:block flex-1 lg:w-1/3"
          onClick={onClose}
        ></div>

        {/* Drawer */}
        <div className="w-full lg:w-2/3 bg-white shadow-2xl flex flex-col min-w-0">
          {/* Header */}
          <div className="flex-shrink-0 bg-white border-b border-slate-200 px-3 sm:px-6 py-3 z-10">
            <div className="flex items-center justify-between min-w-0">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                  Create Custom Itinerary
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 truncate">
                  Creating itinerary for{" "}
                  <span className="font-medium text-slate-900">
                    {enquiry.name}
                  </span>{" "}
                  ({enquiry.email})
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 min-w-0">
            <CreateTripForm
              editTripData={tripData}
              enquiryData={enquiry}
              onSubmit={handleSubmit}
              onCancel={onClose}
              isCustomItinerary={true}
              refreshTrips={onSave}
              closeDrawer={onClose}
              isReadOnly={isReadOnly}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
