import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  X,
  User,
  Mail,
  Calendar,
  IndianRupee,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

export function EnrollmentsModal({ tripId, onClose }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/api/admin/trips/${tripId}/enrollments`
        );
        setEnrollments(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch enrollments");
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchEnrollments();
    }
  }, [tripId]);

  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getBookingStatusStyle = (status) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":
        return "text-green-700 bg-green-50 border-green-200";
      case "PENDING":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "CANCELLED":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getPaymentIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={14} className="inline mr-1" />;
      case "pending":
        return <Clock size={14} className="inline mr-1" />;
      case "failed":
        return <XCircle size={14} className="inline mr-1" />;
      default:
        return <Clock size={14} className="inline mr-1" />;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50 p-4">
        {" "}
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Enrolled Users</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-200 border-t-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0  backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header - Sticky */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Enrolled Users</h2>
            <p className="text-sm text-gray-600 mt-1">
              {enrollments.length}{" "}
              {enrollments.length === 1 ? "enrollment" : "enrollments"} found
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  No enrollments found
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Check back later for new enrollments
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6">
              {enrollments.map((user, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300"
                >
                  {/* User Info Header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-full flex-shrink-0">
                        <User size={24} className="text-blue-700" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {user.name}
                        </h3>
                        <p className="text-gray-600 text-sm flex items-center break-all">
                          <Mail size={16} className="mr-2 flex-shrink-0" />
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Payment Status Badge */}
                    <div
                      className={`px-3 py-2 rounded-full text-xs font-semibold border flex items-center ${getPaymentStatusStyle(
                        user.paymentStatus
                      )} flex-shrink-0`}
                    >
                      {getPaymentIcon(user.paymentStatus)}
                      {user.paymentStatus.charAt(0).toUpperCase() +
                        user.paymentStatus.slice(1)}
                    </div>
                  </div>

                  {/* Payment and Date Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    <div className="flex items-center text-gray-700 bg-gray-50 rounded-lg p-3">
                      <IndianRupee size={20} className="mr-3 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Amount
                        </p>
                        <p className="font-semibold text-lg">
                          ₹{user.paymentAmount.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-700 bg-gray-50 rounded-lg p-3">
                      <Calendar size={20} className="mr-3 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Payment Date
                        </p>
                        <p className="font-semibold">
                          {new Date(user.paymentDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-1">
                      <div
                        className={`px-4 py-3 rounded-lg border ${getBookingStatusStyle(
                          user.bookingStatus
                        )} text-center`}
                      >
                        <p className="text-xs uppercase tracking-wide font-medium mb-1">
                          Booking Status
                        </p>
                        <p className="font-bold text-sm">
                          {user.bookingStatus}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
