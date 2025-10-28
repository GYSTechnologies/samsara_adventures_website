import React from "react";

const ProfileField = React.memo(({ label, value, onChange, editMode, type = "text" }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {editMode ? (
        <input
          type={type}
          value={value || ""}
          onChange={onChange}
          className="w-full p-3 border-2 border-gray-200 rounded-xl 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                     transition-all duration-200 hover:border-blue-300"
          placeholder={`Enter your ${label.toLowerCase()}`}
        />
      ) : (
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
          <p className="font-medium text-gray-800">
            {value || <span className="text-gray-400">Not provided</span>}
          </p>
        </div>
      )}
    </div>
  );
});

ProfileField.displayName = 'ProfileField';

export default ProfileField;
