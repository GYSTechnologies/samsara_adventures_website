import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentConfirmationModal = ({ 
  isOpen, 
  onClose, 
  eventTitle = "Event Name",
  bookingId = "BK123456789",
  totalAmount = 3500,
  attendees = { adults: 2, children: 1 }
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleHomeNavigation = () => {
    navigate('/');
    onClose();
  };

  const handleProfileNavigation = () => {
    // navigate('/profile');
    navigate("/profile", { state: { page: "event-history" } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto">
      {/* Backdrop */}
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-2xl transform transition-all">
          
          {/* Success Icon */}
          <div className="text-center pt-8 pb-4">
            <div className="mx-auto flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-green-100 mb-4">
              <svg
                className="h-8 w-8 sm:h-10 sm:w-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            
            {/* Success Message */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-sm sm:text-base text-gray-600 px-4">
              Your booking has been confirmed. We've sent the details to your email.
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="mx-4 sm:mx-6 mb-6 bg-gray-50 rounded-lg p-4 sm:p-5">
            <div className="space-y-3 sm:space-y-4">
              {/* Event Name */}
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-700">Event:</span>
                <span className="text-sm font-semibold text-gray-900 text-right ml-2">
                  {eventTitle}
                </span>
              </div>

              {/* Booking ID */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Booking ID:</span>
                <span className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {bookingId}
                </span>
              </div>

              {/* Attendees */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Attendees:</span>
                <span className="text-sm text-gray-900">
                  {attendees.adults} Adult{attendees.adults > 1 ? 's' : ''}
                  {attendees.children > 0 && `, ${attendees.children} Child${attendees.children > 1 ? 'ren' : ''}`}
                </span>
              </div>

              {/* Total Amount */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-700">Total Paid:</span>
                <span className="text-lg font-bold text-green-600">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-4 sm:px-6 pb-6 space-y-3">
            {/* Go to Event History Button */}
            <button
              onClick={handleProfileNavigation}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-3.5 px-4 rounded-lg font-semibold text-sm sm:text-base transition-colors duration-200 flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              View Event History
            </button>

            {/* Go to Home Button */}
            <button
              onClick={handleHomeNavigation}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 sm:py-3.5 px-4 rounded-lg font-semibold text-sm sm:text-base transition-colors duration-200 flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go to Home
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};



export default PaymentConfirmationModal;