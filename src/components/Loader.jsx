import React from "react";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className="relative">
          {/* Outer Spinner */}
          <div className="h-16 w-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
          {/* Inner Spinner */}
          <div className="absolute top-4 left-4 h-8 w-8 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
        </div>
        <p className="mt-6 text-gray-600 font-medium animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

export default Loader;
