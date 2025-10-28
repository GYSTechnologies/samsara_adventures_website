import React, { useState, useRef, useEffect } from "react";
import {
  Settings,
  Edit2,
  Camera,
  X,
  Check,
  Save,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import axiosInstance from "../../../api/axiosInstance";

// ========================================
// ProfileField Component
// ========================================
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
ProfileField.displayName = "ProfileField";

// ========================================
// PasswordModal Component
// ========================================
const PasswordModal = ({
  passwordData,
  setPasswordData,
  changePassword,
  loading,
  setShowPasswordModal,
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Change Password
          </h3>
          <p className="text-gray-600">Enter your current and new password</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            changePassword();
          }}
          className="space-y-4"
        >
          {/* Current Password */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter current password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password (min 6 characters)"
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Updating...</span>
                </>
              ) : (
                "Update Password"
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ========================================
// Main ProfilePageComponent - NOW ACCEPTS PROPS
// ========================================
const ProfilePageComponent = ({ user, onProfileUpdate }) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    profileUrl: "https://via.placeholder.com/150",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Initialize profile data from parent's user prop
  useEffect(() => {
    if (user) {
      console.log("Loading user data from parent:", user);
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phoneNumber?.toString() || "",
        profileUrl: user.profileUrl || "https://via.placeholder.com/150",
      });
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isLt5MB = file.size <= 5 * 1024 * 1024;

    if (!isImage) {
      setError("Please upload a valid image file (JPG, PNG, GIF)");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (!isLt5MB) {
      setError("Image must be less than 5 MB");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Validation
      if (!profileData.name || profileData.name.trim().length < 2) {
        setError("Name must be at least 2 characters");
        setTimeout(() => setError(""), 3000);
        setLoading(false);
        return;
      }

      // Create FormData
      const formData = new FormData();

      // Append file as 'profileUrl' (matches backend)
      if (selectedFile) {
        formData.append("profileUrl", selectedFile);
      }

      // Append other fields
      formData.append("email", profileData.email);
      formData.append("name", profileData.name.trim());
      formData.append("phoneNumber", profileData.phone || "");

      const response = await axiosInstance.put(
        "/api/auth/updateProfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update local state
      if (response.data.updatedUser) {
        setProfileData((prev) => ({
          ...prev,
          name: response.data.updatedUser.name || prev.name,
          phone: response.data.updatedUser.phoneNumber?.toString() || prev.phone,
          profileUrl: response.data.updatedUser.profileUrl || prev.profileUrl,
        }));

        // Notify parent component to refresh user data
        if (onProfileUpdate) {
          onProfileUpdate(response.data.updatedUser);
        }

        setSelectedFile(null);
        setImagePreview(null);
        setSuccess("Profile updated successfully!");
        setEditMode(false);
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.response?.data?.message || "Failed to update profile");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    try {
      setError("");

      // Validation
      if (!passwordData.currentPassword) {
        setError("Please enter your current password");
        setTimeout(() => setError(""), 3000);
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setError("New password must be at least 6 characters");
        setTimeout(() => setError(""), 3000);
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError("Passwords don't match");
        setTimeout(() => setError(""), 3000);
        return;
      }

      setLoading(true);

      await axiosInstance.put("/api/users/profile/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccess("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Password change error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to change password"
      );
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleCancelEdit = () => {
    setEditMode(false);
    setSelectedFile(null);
    setImagePreview(null);
    // Reset to user data from parent
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phoneNumber?.toString() || "",
        profileUrl: user.profileUrl || "https://via.placeholder.com/150",
      });
    }
  };

  // Show loading if no user data yet
  if (!user) {
    return (
      <div className="space-y-5 sm:space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-8 flex items-center justify-center">
          <Loader2 className="animate-spin mr-2" size={24} />
          <span className="text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Alerts */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <Check size={16} />
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <X size={16} />
          {error}
        </div>
      )}

      {/* Password modal */}
      {showPasswordModal && (
        <PasswordModal
          passwordData={passwordData}
          setPasswordData={setPasswordData}
          changePassword={changePassword}
          loading={loading}
          setShowPasswordModal={setShowPasswordModal}
        />
      )}

      {/* Header actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
        <div className="hidden lg:block">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Profile
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage personal information and preferences
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="bg-gradient-to-r from-lime-900 to-lime-800 text-white px-2 sm:px-3 py-2.5 rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-200 inline-flex items-center gap-2"
          >
            <Settings size={16} />
            <span>Change Password</span>
          </button>

          <button
            onClick={() => (editMode ? updateProfile() : setEditMode(true))}
            disabled={loading}
            className={`inline-flex items-center gap-2 px-2 sm:px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
              editMode
                ? "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300 hover:shadow-md"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : editMode ? (
              <Save size={16} />
            ) : (
              <Edit2 size={16} />
            )}
            <span className="whitespace-nowrap">
              {editMode ? "Save Changes" : "Edit Profile"}
            </span>
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Cover */}
        <div className="bg-gradient-to-r from-lime-900 via-lime-800 to-lime-700 h-28 sm:h-32 relative">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Profile header */}
        <div className="px-4 sm:px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 sm:-mt-16">
            <div className="relative">
              <img
                src={
                  imagePreview ||
                  profileData.profileUrl ||
                  "https://via.placeholder.com/150"
                }
                alt="Profile"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-xl"
              />
              {editMode && (
                <>
                  <button
                    onClick={triggerFileInput}
                    className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-full shadow-lg hover:bg-blue-700 transition-colors group"
                    aria-label="Change profile picture"
                  >
                    <Camera
                      size={16}
                      className="group-hover:scale-110 transition-transform"
                    />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </>
              )}
              {selectedFile && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg">
                  <Check size={14} className="stroke-[3]" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pt-2">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {profileData.name || "User Name"}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 break-words">
                {profileData.email}
              </p>
              {selectedFile && editMode && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <Check size={12} />
                  New image selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Fields */}
          <div className="mt-6 sm:mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              <ProfileField
                label="Name"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, name: e.target.value }))
                }
                editMode={editMode}
              />

              <ProfileField
                label="Email Address"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                editMode={false}
                type="email"
              />

              <ProfileField
                label="Phone Number"
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, phone: e.target.value }))
                }
                editMode={editMode}
                type="tel"
              />
            </div>

            {/* Inline action row for edit mode */}
            {editMode && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-50 rounded-xl">
                <button
                  onClick={updateProfile}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 sm:px-6 py-2.5 rounded-xl font-medium hover:bg-green-700 hover:shadow-lg transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={loading}
                  className="bg-gray-200 text-gray-800 px-4 sm:px-6 py-2.5 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageComponent;
