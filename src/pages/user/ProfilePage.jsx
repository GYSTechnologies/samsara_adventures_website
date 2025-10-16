import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  User,
  Calendar,
  Clock,
  Settings,
  HelpCircle,
  Trash2,
  Edit2,
  MapPin,
  Phone,
  Mail,
  Eye,
  ChevronDown,
  Camera,
  X,
  Check,
  Save,
  Download,
  Share2,
  Loader2,
  Calendar as Event,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import EventHistoryPage from "../../components/user/EventHistory";
import { CancelBookingModal } from "../../components/user/CancelBookingModal";
// Constants
const PROFILE_PLACEHOLDER =
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face";
const TRIP_PLACEHOLDER =
  "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

const ProfilePage = () => {
  // State management
  const [currentPage, setCurrentPage] = useState("profile");
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [cancellationRequests, setCancellationRequests] = useState();
  // User data
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    profileUrl: PROFILE_PLACEHOLDER,
  });

  // Trips data
  const [bookings, setBookings] = useState([]);

  // Password change
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Navigation
  const navItems = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "plans", label: "Plans", icon: <Calendar size={18} /> },
    { id: "history", label: "History", icon: <Clock size={18} /> },
    { id: "terms", label: "Terms", icon: <Settings size={18} /> },
    { id: "help", label: "Help", icon: <HelpCircle size={18} /> },
    { id: "event-history", label: "Event-History", icon: <Event size={18} /> },
  ];

  // FAQ data
  const faqData = [
    {
      question: "Time related issue?",
      answer:
        "For any time-related concerns regarding your bookings, please contact our support team.",
      category: "booking",
    },
    {
      question: "Payment related issue?",
      answer:
        "For payment issues, refunds, or billing questions, please provide your booking ID and transaction details.",
      category: "payment",
    },
    {
      question: "Booking modification?",
      answer:
        "You can modify your bookings up to 48 hours before travel. Additional charges may apply based on availability.",
      category: "booking",
    },
    {
      question: "Cancellation policy?",
      answer:
        "Cancellation charges depend on the time of cancellation. 48+ hours: 10% charge, 24-48 hours: 25% charge, Less than 24 hours: 50% charge.",
      category: "policy",
    },
    {
      question: "Travel insurance?",
      answer:
        "We highly recommend travel insurance for all bookings. Insurance can be purchased at the time of booking or up to 24 hours before travel.",
      category: "insurance",
    },
  ];

  // Data fetching
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/users/profile");
      const { name, email, phoneNumber, location, bio, profileUrl } =
        response.data;

      const nameParts = name.split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");

      setProfileData({
        firstName,
        lastName,
        email,
        phone: phoneNumber || "",
        location: location || "",
        bio: bio || "",
        profileUrl: profileUrl || PROFILE_PLACEHOLDER,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/users/bookings");
      setBookings(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  // Profile updates
  const updateProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { firstName, lastName, ...rest } = profileData;
      const name = `${firstName} ${lastName}`;

      await axiosInstance.put("/api/users/profile", {
        name,
        ...rest,
      });

      setSuccess("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }, [profileData]);

  const updateProfilePicture = useCallback(async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("profile", file);

      const response = await axiosInstance.put(
        "/api/users/profile/picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfileData((prev) => ({
        ...prev,
        profileUrl: response.data.profileUrl,
      }));
      setSuccess("Profile picture updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update profile picture"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error("Passwords don't match");
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
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  }, [passwordData]);



  const downloadItinerary = useCallback(async (bookingId) => {
    try {
      const response = await axiosInstance.get(
        `/api/users/bookings/${bookingId}/itinerary`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `itinerary-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError("Failed to download itinerary. Please try again.");
    }
  }, []);

  // Effects
  useEffect(() => {
    fetchProfile();
    fetchBookings();
  }, [fetchProfile, fetchBookings]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Components
  const SidebarItem = ({ icon, text, active, onClick, className = "" }) => (
    <div
      onClick={onClick}
      className={`flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-200 group ${
        active
          ? "bg-gradient-to-r from-lime-900 to-lime-800 text-white shadow-lg shadow-blue-200 scale-105"
          : "hover:bg-gray-50 text-gray-700 hover:scale-102 border border-transparent hover:border-gray-200"
      } ${className}`}
    >
      <div
        className={`${
          active ? "text-white" : "text-gray-500 group-hover:text-lime-500"
        } transition-colors`}
      >
        {icon}
      </div>
      <span className={`font-medium ${active ? "text-white" : ""}`}>
        {text}
      </span>
      {active && <div className="w-2 h-2 bg-white rounded-full ml-auto"></div>}
    </div>
  );

  const DesktopSidebar = () => (
    <div className="hidden lg:flex flex-col bg-white w-44 min-h-screen shadow-xl fixed left-0 top-0 z-40 border-r border-gray-100 mt-16">
      <div className="p-3 flex-1">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              text={item.label}
              active={currentPage === item.id}
              onClick={() => setCurrentPage(item.id)}
            />
          ))}
        </nav>
      </div>

      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Settings size={18} className="text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Settings</p>
            <p className="text-xs text-gray-500">App preferences</p>
          </div>
        </div>
      </div>
    </div>
  );

  const MobileTopNav = () => (
    <div className="lg:hidden bg-white  sticky top-0 z-30">
      <div className="px-1 py-2">
        <div className="flex space-x-3 overflow-x-auto p-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex items-center space-x-2 px-2 py-2 rounded-xl whitespace-nowrap font-medium text-sm transition-all duration-300 min-w-fit ${
                currentPage === item.id
                  ? "bg-gradient-to-r from-lime-700 to-lime-700 text-white shadow-lg shadow-green-200 "
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200 bg-white"
              }`}
            >
              <div
                className={
                  currentPage === item.id ? "text-white" : "text-gray-500"
                }
              >
                {item.icon}
              </div>
              <span>{item.label}</span>
              {currentPage === item.id && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

const ProfilePageComponent = () => {
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isLt5MB = file.size <= 5 * 1024 * 1024;
    if (!isImage) {
      // setError("Please upload a valid image file");
      return;
    }
    if (!isLt5MB) {
      // setError("Image must be less than 5 MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileData((prev) => ({
        ...prev,
        profileUrl: reader.result,
      }));
      updateProfilePicture(file);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Alerts */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
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
        <div className="bg-gradient-to-r from-lime-900 via-lime-800 to-lime-700 h-28 sm:h-28 relative">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Profile header */}
        <div className="px-4 sm:px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 sm:-mt-16">
            <div className="relative">
              <img
                src={profileData.profileUrl}
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
                    <Camera size={16} className="group-hover:scale-110 transition-transform" />
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
            </div>

            <div className="flex-1 min-w-0 pt-2">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {profileData.firstName} {profileData.lastName}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 break-words">
                {profileData.email}
              </p>
            </div>
          </div>

          {/* Fields */}
          <div className="mt-6 sm:mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              <ProfileField
                key="first-name"
                label="First Name"
                value={profileData.firstName}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, firstName: e.target.value }))
                }
                editMode={editMode}
              />

              <ProfileField
                key="last-name"
                label="Last Name"
                value={profileData.lastName}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                editMode={editMode}
              />

              <ProfileField
                key="email"
                label="Email Address"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, email: e.target.value }))
                }
                editMode={editMode}
                type="email"
              />

              <ProfileField
                key="phone"
                label="Phone Number"
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, phone: e.target.value }))
                }
                editMode={editMode}
                type="tel"
              />

              <ProfileField
                key="location"
                label="Location"
                value={profileData.location}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, location: e.target.value }))
                }
                editMode={editMode}
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
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-200 text-gray-800 px-4 sm:px-6 py-2.5 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-200 inline-flex items-center justify-center gap-2"
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


  const PasswordModal = ({
    passwordData,
    setPasswordData,
    changePassword,
    loading,
    setShowPasswordModal,
  }) => (
    <div className="fixed inset-0 bg-black/30 bg-opacity-20 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
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
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter current password"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm new password"
              required
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : (
                "Update Password"
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const ProfileField = ({ label, value, onChange, editMode, type = "text" }) => {
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
    onChange(e);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {editMode ? (
        <input
          type={type}
          value={inputValue}
          onChange={handleChange}
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
};



const PlansPage = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancelTripId, setCancelTripId] = useState(null);
  const [showItinerary, setShowItinerary] = useState({});
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: wire real cancelBooking + refund helpers if not in scope
  const cancelBooking = async () => {};
  const calculateDaysRemaining = (d) => {
    if (!d) return 0;
    const today = new Date();
    const date = new Date(d);
    return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
  };
  const calculateRefundPercentage = (d) => {
    const days = calculateDaysRemaining(d);
    if (days >= 7) return 100;
    if (days === 6) return 75;
    if (days === 5) return 50;
    if (days === 4) return 25;
    return 0;
  };
  const calculateRefundAmount = (d, total) =>
    Math.round(((total || 0) * calculateRefundPercentage(d)) / 100);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get("/api/users/bookings");
        const filtered =
          Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.bookings)
            ? res.data.bookings
            : [];
        const paidOnly = filtered.filter(
          (b) => b.payment && Number(b.payment.grandTotal) > 0
        );
        setBookings(paidOnly);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancelBooking = () => {
    if (!cancelTripId) {
      setError("No booking selected for cancellation");
      return;
    }
    if (!cancellationReason || cancellationReason.trim().length < 10) {
      setError(
        "Please provide a valid cancellation reason (minimum 10 characters)"
      );
      return;
    }
    cancelBooking(cancelTripId, cancellationReason);
    setShowCancelModal(false);
    setCancellationReason("");
    setCancelTripId(null);
  };

  const openCancelModal = (bookingId) => {
    setCancelTripId(bookingId);
    setShowCancelModal(true);
  };

  const toggleItinerary = (bookingId) =>
    setShowItinerary((p) => ({ ...p, [bookingId]: !p[bookingId] }));

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const bookingDetails = bookings?.find((b) => b._id === cancelTripId) || null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal */}
      {showCancelModal && (
        <CancelBookingModal
          bookingDetails={bookingDetails}
          cancellationReason={cancellationReason}
          setCancellationReason={setCancellationReason}
          handleCancelBooking={handleCancelBooking}
          loading={loading}
          calculateDaysRemaining={calculateDaysRemaining}
          calculateRefundPercentage={calculateRefundPercentage}
          calculateRefundAmount={calculateRefundAmount}
          setShowCancelModal={setShowCancelModal}
          setCancelTripId={setCancelTripId}
        />
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading && !bookings.length ? (
          <div className="flex justify-center items-center h-56 sm:h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              No upcoming trips
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mt-2">
              No trips found with successful payments.
            </p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {bookings.map((booking) => {
              const trip = booking.tripDetails || {};
              const isCustomized = booking.tripType === "CUSTOMIZED";
              const isCancelled = booking.requestStatus === "CANCELLED";
              const isCancellationRequested =
                booking.requestStatus === "CANCELLATION_REQUESTED" ||
                booking.requestStatus === "PENDING";

              const itineraryToUse =
                isCustomized && booking.customItinerary
                  ? booking.customItinerary.itinerary
                  : trip.itinerary;

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Header row */}
                  <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                        {booking.title || trip.title || "Trip Title"}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                        {trip.state || "Destination"}
                      </p>
                    </div>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium ${
                        isCustomized
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      <span className="whitespace-nowrap">
                        {isCustomized ? "Customized Trip" : "Package Trip"}
                      </span>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <p className="text-[11px] sm:text-xs text-gray-500">
                          Duration
                        </p>
                        <p className="text-sm sm:text-base font-semibold">
                          {booking.duration || "N/A"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <p className="text-[11px] sm:text-xs text-gray-500">
                          Travel Dates
                        </p>
                        <p className="text-sm sm:text-base font-semibold">
                          {booking.startDate ? formatDate(booking.startDate) : "-"}
                          {" - "}
                          {booking.endDate ? formatDate(booking.endDate) : "-"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <p className="text-[11px] sm:text-xs text-gray-500">
                          Travelers
                        </p>
                        <p className="text-sm sm:text-base font-semibold">
                          {booking.total_members || 0}{" "}
                          {(booking.total_members || 0) === 1 ? "Person" : "People"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <p className="text-[11px] sm:text-xs text-gray-500">
                          Booking ID
                        </p>
                        <p className="text-sm sm:text-base font-semibold break-all">
                          {booking.tripId || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Itinerary */}
                    {Array.isArray(itineraryToUse) && itineraryToUse.length > 0 && (
                      <div className="mt-4 sm:mt-6">
                        <button
                          onClick={() => toggleItinerary(booking._id)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base inline-flex items-center"
                        >
                          {showItinerary[booking._id] ? "Hide" : "View"} Detailed Itinerary
                          <svg
                            className={`ml-2 h-4 w-4 transition-transform ${
                              showItinerary[booking._id] ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {showItinerary[booking._id] && (
                          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-base sm:text-lg mb-3">
                              Itinerary Details
                            </h4>
                            <div className="space-y-3 sm:space-y-4">
                              {itineraryToUse.map((day, idx) => (
                                <div key={idx} className="p-3 sm:p-4 bg-white rounded-md shadow-sm">
                                  <h5 className="font-medium text-gray-900 text-sm sm:text-base">
                                    Day {day.dayNumber || idx + 1}:{" "}
                                    {day.title || `Day ${day.dayNumber || idx + 1}`}
                                  </h5>
                                  {day.description && (
                                    <p className="text-gray-600 mt-2 text-sm">{day.description}</p>
                                  )}
                                  {Array.isArray(day.points) && day.points.length > 0 && (
                                    <div className="mt-2 sm:mt-3">
                                      <h6 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                        Activities:
                                      </h6>
                                      <ul className="list-disc list-inside space-y-1">
                                        {day.points.map((p, i) => (
                                          <li key={i} className="text-xs sm:text-sm text-gray-600">
                                            {p}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-5 sm:mt-6 flex flex-wrap gap-3">
                      {!isCancelled && !isCancellationRequested && (
                        <button
                          onClick={() => openCancelModal(booking._id)}
                          className="px-3 sm:px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 text-sm font-semibold transition-colors"
                        >
                          Cancel Trip
                        </button>
                      )}
                      {isCancellationRequested && (
                        <span className="px-3 sm:px-4 py-2 bg-yellow-50 text-yellow-700 rounded-md text-sm font-semibold">
                          Cancellation Requested
                        </span>
                      )}
                      {isCancelled && (
                        <span className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-semibold">
                          Trip Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

  const HistoryPage = () => {
    // Filter completed bookings - they already include tripDetails
    const completedBookings = bookings.filter(
      (booking) =>
        booking?.status === "COMPLETED" ||
        new Date(booking?.endDate) < new Date()
    );

    return (
      <div className="p-4 lg:p-6">
        {/* Header - Only show on desktop */}
        <div className="hidden lg:block mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
            Trip History
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">
            View your completed travel experiences
          </p>
        </div>

        {/* Loading State */}
        {loading && !completedBookings.length ? (
          <div className="flex justify-center items-center h-48 lg:h-64">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : completedBookings.length === 0 ? (
          /* Empty State */
          <div className="text-center py-8 lg:py-12">
            <h3 className="text-lg lg:text-xl font-medium text-gray-700">
              No trip history
            </h3>
            <p className="text-gray-500 text-sm lg:text-base mt-1">
              You haven't completed any trips yet.
            </p>
          </div>
        ) : (
          /* Trip Cards */
          <div className="space-y-4">
            {completedBookings.map((booking) => {
              const trip = booking.tripDetails || {};
              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl lg:rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Image Section */}
                    <div className="lg:w-80 lg:flex-shrink-0">
                      <img
                        src={
                          trip.images?.[0] ||
                          "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                        }
                        alt={trip.title}
                        className="w-full h-40 lg:h-48 object-cover"
                      />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-4 lg:p-6">
                      <div className="flex flex-col lg:flex-row lg:justify-between">
                        {/* Left Content */}
                        <div className="flex-1 lg:pr-6">
                          {/* Title and Status */}
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg lg:text-xl font-bold text-gray-800 leading-tight">
                              {trip.title || "Trip Title"}
                            </h3>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium ml-2 whitespace-nowrap">
                              Completed
                            </span>
                          </div>

                          {/* Trip Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 lg:gap-4 text-xs lg:text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <MapPin size={12} className="lg:w-4 lg:h-4" />
                              <span className="truncate">
                                {trip.state || "Destination"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock size={12} className="lg:w-4 lg:h-4" />
                              <span>{trip.duration || "N/A"}</span>
                            </div>
                            <div className="flex items-center space-x-1 sm:col-span-1">
                              <Calendar size={12} className="lg:w-4 lg:h-4" />
                              <span className="truncate">
                                {new Date(booking.startDate).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                  }
                                )}{" "}
                                -{" "}
                                {new Date(booking.endDate).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                  }
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Booking ID */}
                          <div className="text-xs lg:text-sm text-gray-600 mb-3">
                            <span className="font-medium">
                              #{booking.tripId || "N/A"}
                            </span>
                          </div>

                          {/* Highlights */}
                          {trip.highlights?.length > 0 && (
                            <div className="flex flex-wrap gap-1 lg:gap-2">
                              {trip.highlights
                                .slice(0, 3)
                                .map((highlight, index) => (
                                  <span
                                    key={index}
                                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                                  >
                                    {highlight}
                                  </span>
                                ))}
                              {trip.highlights.length > 3 && (
                                <span className="text-xs text-gray-500 self-center">
                                  +{trip.highlights.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Right Content - Price & Actions */}
                        <div className="mt-4 lg:mt-0 lg:ml-4 lg:w-40 lg:flex-shrink-0">
                          {/* Price */}
                          <div className="flex lg:flex-col justify-between lg:justify-start items-center lg:items-end mb-3">
                            <div className="lg:text-right">
                              <div className="text-xs text-gray-500">
                                Total Paid
                              </div>
                              <div className="text-lg lg:text-xl font-bold text-green-600">
                                ₹{booking.payment?.grandTotal || "0"}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                            <button
                              onClick={() => downloadItinerary(booking._id)}
                              className="flex-1 lg:flex-none bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
                            >
                              <Download size={14} />
                              <span>Receipt</span>
                            </button>
                            <button className="flex-1 lg:flex-none bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1">
                              <Share2 size={14} />
                              <span>Share</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const TermsPage = () => (
    <div className="space-y-6">
      <div className="hidden lg:block">
        <h1 className="text-3xl font-bold text-gray-800">Terms & Conditions</h1>
        <p className="text-gray-600 mt-1">
          Read our terms of service and privacy policy
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Terms of Service
              </h2>
              <p className="text-gray-600 mb-6">Last updated: January 2025</p>

              <div className="space-y-6">
                <TermSection
                  title="1. Acceptance of Terms"
                  content="By accessing and using our travel booking platform, you accept and agree to be bound by the terms and provision of this agreement. These terms apply to all visitors, users, and others who access or use the service."
                />

                <TermSection
                  title="2. Booking and Payment"
                  content="All bookings are subject to availability and confirmation. Payment must be made in full at the time of booking unless otherwise specified."
                  listItems={[
                    "Advance booking payment: 25% of total amount",
                    "Balance payment: Due 15 days before travel",
                    "Full payment required for bookings made within 15 days",
                    "All payments are non-refundable except as specified in cancellation policy",
                  ]}
                />

                <TermSection
                  title="3. Cancellation Policy"
                  customContent={
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <ul className="space-y-2 text-gray-700">
                        <li>
                          <strong>48+ hours before travel:</strong> 10%
                          cancellation charge
                        </li>
                        <li>
                          <strong>24-48 hours before travel:</strong> 25%
                          cancellation charge
                        </li>
                        <li>
                          <strong>Less than 24 hours:</strong> 50% cancellation
                          charge
                        </li>
                        <li>
                          <strong>No show:</strong> 100% cancellation charge
                        </li>
                      </ul>
                    </div>
                  }
                />

                <TermSection
                  title="4. Travel Insurance"
                  content="We strongly recommend purchasing travel insurance to protect against unforeseen circumstances. Insurance must be purchased within 24 hours of booking to ensure full coverage."
                />
              </div>
            </div>

            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Privacy Policy
              </h2>

              <div className="space-y-6">
                <TermSection
                  title="Data Collection"
                  content="We collect information you provide directly to us, such as when you create an account, make a booking, or contact us for support. This includes personal information like your name, email, phone number, and payment details."
                />

                <TermSection
                  title="Use of Information"
                  content="We use your information to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about our services."
                />
              </div>
            </div>

            <div className="mt-12 p-6 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-blue-800 mb-2">
                Questions about our Terms?
              </h4>
              <p className="text-blue-700 mb-4">
                If you have any questions about these Terms & Conditions, please
                contact our support team.
              </p>
              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TermSection = ({ title, content, listItems, customContent }) => (
    <section>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      {content && <p className="text-gray-700 leading-relaxed">{content}</p>}
      {listItems?.length > 0 && (
        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
          {listItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
      {customContent && customContent}
    </section>
  );

  const HelpPage = () => (
    <div className="space-y-6">
      <div className="hidden lg:block">
        <h1 className="text-3xl font-bold text-gray-800">Get Help</h1>
        <p className="text-gray-600 mt-1">
          Find answers to common questions and get support
        </p>
      </div>

      <SupportContactSection />

      <FAQSection
        faqData={faqData}
        expandedFAQ={expandedFAQ}
        setExpandedFAQ={setExpandedFAQ}
      />

      <HelpTopicsSection />
    </div>
  );

  const SupportContactSection = () => (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Need Immediate Help?</h2>
        <p className="mb-6 opacity-90">
          Our support team is available 24/7 to assist you with any questions or
          concerns.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SupportButton
            icon={<Phone size={20} />}
            title="Call Us"
            subtitle="+91 8767654544"
            onClick={() => (window.location.href = "tel:+918767654544")}
          />

          <SupportButton
            icon={<Mail size={20} />}
            title="Email Us"
            subtitle="samsaraadventures@gmail.com"
            onClick={() => (window.location.href = "mailto:samsaraadventures@gmail.com")}
          />
        </div>
      </div>
    </div>
  );

  const SupportButton = ({ icon, title, subtitle, onClick }) => (
    <button
      onClick={onClick}
      className="bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white p-4 rounded-xl hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-3"
    >
      {icon}
      <div className="text-left">
        <div className="font-semibold">{title}</div>
        <div className="text-sm opacity-90">{subtitle}</div>
      </div>
    </button>
  );

  const FAQSection = ({ faqData, expandedFAQ, setExpandedFAQ }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              expandedFAQ={expandedFAQ}
              setExpandedFAQ={setExpandedFAQ}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const FAQItem = ({ faq, index, expandedFAQ, setExpandedFAQ }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-800">{faq.question}</span>
        <ChevronDown
          size={20}
          className={`text-gray-500 transition-transform ${
            expandedFAQ === index ? "rotate-180" : ""
          }`}
        />
      </button>

      {expandedFAQ === index && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-gray-700">{faq.answer}</p>
          <div className="mt-3">
            <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
              {faq.category}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  const HelpTopicsSection = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Popular Help Topics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <HelpTopicCard
          icon={<Calendar className="w-6 h-6 text-blue-500 mb-2" />}
          title="Booking Issues"
          description="Help with reservations"
          color="blue"
        />

        <HelpTopicCard
          icon={<Settings className="w-6 h-6 text-green-500 mb-2" />}
          title="Payment Problems"
          description="Billing and refunds"
          color="green"
        />

        <HelpTopicCard
          icon={<Clock className="w-6 h-6 text-orange-500 mb-2" />}
          title="Trip Changes"
          description="Modify your booking"
          color="orange"
        />

        <HelpTopicCard
          icon={<User className="w-6 h-6 text-purple-500 mb-2" />}
          title="Account Help"
          description="Profile and settings"
          color="purple"
        />
      </div>
    </div>
  );

  const HelpTopicCard = ({ icon, title, description, color = "blue" }) => {
    const colorClasses = {
      blue: "hover:border-blue-300 hover:bg-blue-50 text-blue-500",
      green: "hover:border-green-300 hover:bg-green-50 text-green-500",
      orange: "hover:border-orange-300 hover:bg-orange-50 text-orange-500",
      purple: "hover:border-purple-300 hover:bg-purple-50 text-purple-500",
    };

    return (
      <button
        className={`p-4 border border-gray-200 rounded-lg transition-all duration-200 text-left ${colorClasses[color]}`}
      >
        {icon}
        <div className="font-semibold text-gray-800">{title}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </button>
    );
  };

  const renderPage = () => {
    switch (currentPage) {
      case "profile":
        return <ProfilePageComponent />;
      case "plans":
        return <PlansPage />;
      case "history":
        return <HistoryPage />;
      case "event-history":
        return <EventHistoryPage />;
      case "terms":
        return <TermsPage />;
      case "help":
        return <HelpPage />;
      default:
        return <ProfilePageComponent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 mt-20">
      <DesktopSidebar />
      <MobileTopNav />

      <div className="lg:ml-72 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
              <Loader2 className="animate-spin text-white" size={48} />
            </div>
          )}

          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
