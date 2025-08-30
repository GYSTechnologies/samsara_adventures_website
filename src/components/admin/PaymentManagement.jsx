import React, { useState } from "react";

const PaymentManagement = ({ bookings, onApproveRefund, loading }) => {
  const [filter, setFilter] = useState("all");

  // Filtering bookings based on filter
  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    if (filter === "cancellation_requested")
      return booking.status === "cancellation_requested";
    return booking.paymentStatus === filter;
  });

  // Badge for booking status
  const getStatusBadge = (status) => {
    const statusClasses = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancellation_requested: "bg-orange-100 text-orange-800",
      cancelled: "bg-red-100 text-red-800",
      refunded: "bg-blue-100 text-blue-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium capitalize ${
          statusClasses[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status?.replace("_", " ")}
      </span>
    );
  };

  // Badge for payment status
  const getPaymentBadge = (status) => {
    const statusClasses = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-blue-100 text-blue-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium capitalize ${
          statusClasses[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Payments & Refunds</h2>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Bookings</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="cancellation_requested">Cancellation Requests</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Empty State */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No bookings found</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
          <div className="min-w-full">
            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 p-4 bg-gray-50 font-semibold text-gray-700">
              <div>Booking ID</div>
              <div>Event</div>
              <div>Customer</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Payment</div>
              <div className="text-center">Actions</div>
            </div>

            {/* Table Rows */}
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="grid grid-cols-7 gap-4 p-4 border-t border-gray-200 hover:bg-gray-50 items-center"
              >
                {/* Booking ID */}
                <div className="font-mono text-sm text-gray-600">
                  #{booking._id?.slice(-6)}
                </div>

                {/* Event */}
                <div className="text-sm text-gray-800 font-medium">
                  {booking.event?.title || "N/A"}
                </div>

                {/* Customer */}
                <div className="text-sm text-gray-600">
                  {booking.user?.name || "N/A"}
                </div>

                {/* Amount */}
                <div className="font-medium text-gray-800">
                  ₹
                  {booking.amount ||
                    booking.totalAmount ||
                    booking.payment?.amount / 100 ||
                    0}
                </div>

                {/* Status */}
                <div>{getStatusBadge(booking.status)}</div>

                {/* Payment */}
                <div>{getPaymentBadge(booking.paymentStatus)}</div>

                {/* Actions */}
                <div className="text-center">
                  {booking.status === "cancellation_requested" ? (
                    <button
                      onClick={() => onApproveRefund(booking._id)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Approve Refund
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
