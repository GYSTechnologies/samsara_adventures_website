import React, { useEffect } from "react";
import { CheckCircle, X, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentSuccessModal = ({ isOpen, onClose, bookingId, isCustomRequest = false }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      
      // Handle ESC key to close
      const handleEsc = (e) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleEsc);
      
      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleViewBooking = () => {
    onClose();
    navigate("/profile", { state: { page: "plans", tab: "upcoming" } });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 
              id="modal-title" 
              className="text-2xl font-bold text-lime-900 flex items-center gap-2"
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
              Payment Successful!
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Success Message */}
          <div className="text-center space-y-2">
            <p className="text-gray-700 text-lg">
              {isCustomRequest 
                ? "Your custom itinerary has been confirmed! We've processed your payment and your personalized trip is now ready." 
                : "Your booking is confirmed! Payment was successful and your trip details have been updated."
              }
            </p>
            <p className="text-sm text-green-600 font-medium">
              {isCustomRequest 
                ? "Check your upcoming plans for the full itinerary." 
                : "Check your booking details below."
              }
            </p>
          </div>

          {/* Booking Details */}
          {bookingId && (
            <div className="bg-lime-50 rounded-xl p-4 border border-lime-200">
              <h3 className="font-semibold text-lime-900 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Booking Confirmation
              </h3>
              <div className="space-y-1 text-sm text-gray-700">
                <p><span className="font-medium">Booking ID:</span> {bookingId}</p>
                <p className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Status:</span> Confirmed & Paid
                </p>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleViewBooking}
              className="flex-1 py-3 px-4 bg-lime-600 hover:bg-lime-700 text-white font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md"
            >
              View My Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;
