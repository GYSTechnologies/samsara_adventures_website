import React from 'react';
import { CheckCircle, Send, Home, Calendar } from 'lucide-react';

const PaymentSuccessModal = ({
  isOpen,
  onClose,
  onNavigateHome,
  onNavigateToPlans,
  bookingId,
  isCustomRequest = false
}) => {
  if (!isOpen) return null;

  // Determine if this is a paid booking or just a request
  const isPaid = !isCustomRequest;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header with dynamic color */}
        <div 
          className={`p-6 text-center ${
            isPaid 
              ? 'bg-gradient-to-br from-green-500 to-green-600' 
              : 'bg-gradient-to-br from-purple-500 to-purple-600'
          }`}
        >
          <div className="flex justify-center mb-4">
            {isPaid ? (
              <CheckCircle className="w-16 h-16 text-white animate-bounce" />
            ) : (
              <Send className="w-16 h-16 text-white animate-pulse" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isPaid ? 'Payment Successful!' : 'Request Submitted!'}
          </h2>
          <p className="text-white/90 text-sm">
            {isPaid 
              ? 'Your booking has been confirmed' 
              : 'We\'ll contact you with a customized itinerary'}
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Booking ID Card */}
          <div 
            className={`p-4 rounded-lg mb-6 border-2 ${
              isPaid 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                : 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800'
            }`}
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {isPaid ? 'Booking ID' : 'Request ID'}
            </p>
            <p className={`text-lg font-bold font-mono ${
              isPaid ? 'text-green-700 dark:text-green-400' : 'text-purple-700 dark:text-purple-400'
            }`}>
              {bookingId}
            </p>
          </div>

          {/* Status Message */}
          <div className="space-y-3 mb-6">
            {isPaid ? (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Confirmation email sent
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Check your inbox for trip details
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Trip confirmed
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Get ready for an amazing experience!
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mt-0.5">
                    <Send className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Request received
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Our team will review your requirements
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mt-0.5">
                    <Calendar className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      We'll contact you soon
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Expect a call within 24 hours
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {isPaid && (
              <button
                onClick={onNavigateToPlans}
                className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                View My Bookings
              </button>
            )}
            <button
              onClick={onNavigateHome}
              className={`w-full px-4 py-3 font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
                isPaid
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;
