import { Clock, Loader2, Calendar as Event } from "lucide-react";

export const CancelBookingModal = ({
  bookingDetails,
  cancellationReason,
  setCancellationReason,
  handleCancelBooking,
  loading,
  calculateDaysRemaining,
  calculateRefundPercentage,
  calculateRefundAmount,
  setShowCancelModal,
  setCancelTripId,
}) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-2">
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-md w-full h-[96vh] sm:h-auto sm:max-h-[95vh] flex flex-col shadow-2xl border border-white/20">
      <div className="text-center mb-3 sm:mb-6 flex-shrink-0">
        <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 shadow-lg">
          <Clock size={16} className="text-yellow-600 sm:w-6 sm:h-6" />
        </div>

        <h3 className="text-base sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
          Request Cancellation
        </h3>
        <p className="text-xs sm:text-base text-gray-600 leading-relaxed">
          Submit your cancellation request for admin approval
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 min-h-0">
        <div className="p-2.5 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex justify-between items-center mb-1.5 sm:mb-2">
            <span className="text-xs sm:text-sm font-medium text-blue-800">
              Total Paid:
            </span>
            <span className="text-sm sm:text-base font-semibold text-gray-800">
              ₹
              {bookingDetails?.payment?.grandTotal?.toLocaleString("en-IN") ||
                "0"}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs mb-1.5 sm:mb-2">
            <span className="text-blue-700">Trip starts in:</span>
            <span className="font-medium text-gray-700">
              {calculateDaysRemaining(bookingDetails?.startDate)} days
            </span>
          </div>

          <div className="flex justify-between items-center text-xs mb-1.5 sm:mb-2">
            <span className="text-blue-700">Refund %:</span>
            <span className="font-medium text-emerald-600">
              {calculateRefundPercentage(bookingDetails?.startDate)}%
            </span>
          </div>

          <div className="flex justify-between items-center pt-1.5 sm:pt-2 border-t border-blue-200">
            <span className="text-sm sm:text-base font-semibold text-blue-800">
              You'll receive:
            </span>
            <span className="text-sm sm:text-lg font-bold text-emerald-600">
              ₹
              {calculateRefundAmount(
                bookingDetails?.startDate,
                bookingDetails?.payment?.grandTotal
              )?.toLocaleString("en-IN") || "0"}
            </span>
          </div>
        </div>

        {/* ... rest of the modal content remains the same ... */}
        <div className="p-2.5 sm:p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl text-left border border-amber-200 shadow-sm">
          <h4 className="text-xs sm:text-base font-semibold text-amber-800 mb-1.5 sm:mb-2 flex items-center">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full mr-1.5 sm:mr-2"></span>
            Refund Policy
          </h4>
          <div className="grid grid-cols-1 gap-0.5 sm:gap-1">
            <div className="flex justify-between text-xs text-amber-700">
              <span>7+ days:</span>
              <span className="font-medium text-green-600">100%</span>
            </div>
            <div className="flex justify-between text-xs text-amber-700">
              <span>6 days:</span>
              <span className="font-medium text-green-600">75%</span>
            </div>
            <div className="flex justify-between text-xs text-amber-700">
              <span>5 days:</span>
              <span className="font-medium text-yellow-600">50%</span>
            </div>
            <div className="flex justify-between text-xs text-amber-700">
              <span>4 days:</span>
              <span className="font-medium text-orange-600">25%</span>
            </div>
            <div className="flex justify-between text-xs text-amber-700">
              <span>≤3 days:</span>
              <span className="font-medium text-red-600">No refund</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <label className="block text-xs sm:text-sm font-semibold text-gray-700">
            Reason for Cancellation <span className="text-red-500">*</span>
          </label>
          <textarea
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            className="w-full p-2.5 sm:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-xs sm:text-base placeholder-gray-400 resize-none"
            placeholder="Please tell us why you're cancelling..."
            rows="2"
            required
            minLength={10}
          />
          {cancellationReason.length > 0 && cancellationReason.length < 10 && (
            <p className="text-red-500 text-xs flex items-center">
              <span className="w-1 h-1 bg-red-500 rounded-full mr-1.5"></span>
              Please enter at least 10 characters
            </p>
          )}
          <div className="text-right">
            <span className="text-xs text-gray-400">
              {cancellationReason.length}/10 min
            </span>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 pt-3 sm:pt-4 border-t border-gray-100 mt-3 sm:mt-0 sm:border-t-0">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleCancelBooking}
            disabled={
              loading || !cancellationReason || cancellationReason.length < 10
            }
            className={`w-full sm:flex-1 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center text-xs sm:text-base ${
              loading || !cancellationReason || cancellationReason.length < 10
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-1.5" size={14} />
                Processing...
              </>
            ) : (
              "Request Cancellation"
            )}
          </button>

          <button
            onClick={() => {
              setShowCancelModal(false);
              setCancelTripId(null);
              setCancellationReason("");
            }}
            className="w-full sm:flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-2.5 sm:py-3 rounded-xl font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-md hover:shadow-lg text-xs sm:text-base"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  </div>
);
