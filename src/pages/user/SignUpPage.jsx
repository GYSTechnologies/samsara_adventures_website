import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  Camera,
  ArrowLeft,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

// Constants for validation
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const PASSWORD_STRENGTH = {
  WEAK: { text: "Weak", color: "bg-red-500", level: 1 },
  MEDIUM: { text: "Medium", color: "bg-yellow-500", level: 2 },
  STRONG: { text: "Strong", color: "bg-green-500", level: 3 },
};

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, verifyEmail, loading, error, setError, googleAuth } = useAuth();
  const otpInputs = useRef([]);
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "user",
    phoneNumber: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  // Focus first OTP input when step changes
  useEffect(() => {
    if (step === 2 && otpInputs.current[0]) {
      otpInputs.current[0].focus();
    }
  }, [step]);

  // Check password strength
  useEffect(() => {
    if (formData.password.length === 0) {
      setPasswordStrength(null);
      return;
    }

    let strength = 0;
    if (formData.password.length >= 6) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++;

    if (strength <= 2) {
      setPasswordStrength(PASSWORD_STRENGTH.WEAK);
    } else if (strength === 3) {
      setPasswordStrength(PASSWORD_STRENGTH.MEDIUM);
    } else {
      setPasswordStrength(PASSWORD_STRENGTH.STRONG);
    }
  }, [formData.password]);

  // Create image preview when profileImage changes
  useEffect(() => {
    if (!profileImage) {
      setImagePreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(profileImage);
    setImagePreview(objectUrl);

    // Clean up
    return () => URL.revokeObjectURL(objectUrl);
  }, [profileImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific field errors when typing
    if (name === "phoneNumber" && phoneError) {
      setPhoneError("");
    }
    if (name === "name" && nameError) {
      setNameError("");
    }
    if (name === "email" && emailError) {
      setEmailError("");
    }
  };

  const handleImageChange = (e) => {
    setImageError("");
    const file = e.target.files[0];

    if (!file) return;

    // Validate image type
    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Only JPG, PNG, and WEBP formats are supported");
      return;
    }

    // Validate image size
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image size must be less than 2MB");
      return;
    }

    setProfileImage(file);
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // IMPROVED: Phone number validation
  const validatePhoneNumber = (phone) => {
    if (!phone || phone.trim() === "") {
      return true; // Optional field
    }
    if(phone.length > 10 || phone.length < 7){
      return false;
    }
    // Remove spaces, dashes, parentheses for validation
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

    // Must be 10-15 digits (with optional + prefix)
    const regex = /^\+?\d{10,15}$/;
    return regex.test(cleanPhone);
  };

  // NEW: Name validation
  const validateName = (name) => {
    if (!name || name.trim().length < 2) {
      return "Name must be at least 2 characters";
    }
    if (name.trim().length > 50) {
      return "Name must be less than 50 characters";
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return "Name can only contain letters and spaces";
    }
    return "";
  };

  // NEW: Email validation
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setImageError("");
    setPhoneError("");
    setNameError("");
    setEmailError("");

    // Validate all fields
    const nameValidation = validateName(formData.name);
    if (nameValidation) {
      setNameError(nameValidation);
      return;
    }

    const emailValidation = validateEmail(formData.email);
    if (emailValidation) {
      setEmailError(emailValidation);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Phone number validation
    if (formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)) {
      setPhoneError("Please enter a valid phone number (10-15 digits)");
      return;
    }

    // Create FormData
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name.trim());
    formDataToSend.append("email", formData.email.trim().toLowerCase());
    formDataToSend.append("password", formData.password);
    formDataToSend.append("userType", formData.userType);
    
    // Only append phone if it has a value
    if (formData.phoneNumber && formData.phoneNumber.trim()) {
      formDataToSend.append("phoneNumber", formData.phoneNumber.trim());
    }

    // Append profile image if exists
    let fileToAppend = profileImage;
    if (!fileToAppend && fileInputRef.current?.files?.length) {
      fileToAppend = fileInputRef.current.files[0];
    }

    if (fileToAppend) {
      formDataToSend.append("profileUrl", fileToAppend);
    }

    console.log("Submitting signup with data:");
    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, typeof value === 'object' && value instanceof File ? value.name : value);
    }

    // Call signup - pass the actual FormData
    const res = await signup(formDataToSend);
    if (res.success) {
      setStep(2);
    } else {
      setError(res.message || "Signup failed. Please try again.");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 4) {
      setError("Please enter a 4-digit verification code");
      return;
    }

    const res = await verifyEmail(formData.email, otp);
    if (res.success) {
      navigate("/", { state: { email: formData.email } });
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    // Update OTP value
    const newOtp = otp.split("");
    newOtp[index] = value;
    setOtp(newOtp.join(""));

    // Auto-focus next input
    if (value && index < 3) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    // Handle backspace/delete navigation
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleResendCode = async () => {
    setError("");
    // Call your resend OTP API here
    setError("Verification code resent successfully!");
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    setError("");

    try {
      const token = credentialResponse.credential;
      const res = await googleAuth(token);

      if (res.success) {
        localStorage.setItem("token", res.token);
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Google login failed", err);
      setError("Google authentication failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google authentication failed. Please try again.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400 to-indigo-600 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-5 blur-3xl"></div>
      </div>

      <div className="max-w-md w-full bg-white/85 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-6 relative z-10 mt-20">
        {step === 1 ? (
          <>
            {/* Header with Profile Image Section */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="relative group">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        className="w-20 h-20 rounded-full object-cover border-4 border-blue-200 shadow-lg group-hover:shadow-xl transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center border-2 border-dashed border-blue-300 hover:border-blue-400 transition-colors">
                        <Camera className="w-8 h-8 text-blue-500" />
                      </div>
                      <input
                        name="profileUrl"
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>
              {imageError && (
                <div className="text-red-500 text-sm mt-2 flex items-center justify-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {imageError}
                </div>
              )}

              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                Create Account
              </h2>
              <p className="text-gray-600 text-sm">
                Sign up to get started with your account
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                {error}
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Name Input */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 pl-10 border-2 ${
                      nameError ? "border-red-300" : "border-gray-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white hover:border-gray-300`}
                    placeholder="Enter your full name"
                    required
                    minLength="2"
                    maxLength="50"
                  />
                  <User className={`w-4 h-4 absolute left-3 top-3 transition-colors ${
                    nameError ? "text-red-400" : "text-gray-400 group-focus-within:text-blue-500"
                  }`} />
                </div>
                {nameError && (
                  <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {nameError}
                  </div>
                )}
              </div>

              {/* Email Input */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 pl-10 border-2 ${
                      emailError ? "border-red-300" : "border-gray-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white hover:border-gray-300`}
                    placeholder="Enter your email address"
                    required
                  />
                  <Mail className={`w-4 h-4 absolute left-3 top-3 transition-colors ${
                    emailError ? "text-red-400" : "text-gray-400 group-focus-within:text-blue-500"
                  }`} />
                </div>
                {emailError && (
                  <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {emailError}
                  </div>
                )}
              </div>

              {/* Password Input */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 pl-10 pr-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                    placeholder="Create a strong password"
                    required
                    minLength="6"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3 group-focus-within:text-blue-500 transition-colors" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordStrength && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span>Password strength:</span>
                      <span
                        className={`font-medium ${
                          passwordStrength.color === "bg-red-500"
                            ? "text-red-500"
                            : passwordStrength.color === "bg-yellow-500"
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full ${
                            level <= passwordStrength.level
                              ? passwordStrength.color
                              : "bg-gray-200"
                          }`}
                        ></div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.password.length < 6 ? (
                        <span className="text-red-500 flex items-center gap-1">
                          <X className="w-3 h-3" />
                          At least 6 characters
                        </span>
                      ) : (
                        <span className="text-green-500 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Minimum length met
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Phone Input - IMPROVED */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 pl-10 border-2 ${
                      phoneError ? "border-red-300" : "border-gray-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white hover:border-gray-300`}
                    placeholder="+1234567890 or 9876543210"
                    maxLength="20"
                  />
                  <Phone className={`w-4 h-4 absolute left-3 top-3 transition-colors ${
                    phoneError ? "text-red-400" : "text-gray-400 group-focus-within:text-blue-500"
                  }`} />
                </div>
                {phoneError && (
                  <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {phoneError}
                  </div>
                )}
                {formData.phoneNumber && !phoneError && validatePhoneNumber(formData.phoneNumber) && (
                  <div className="text-green-500 text-sm mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Valid phone number format
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 font-semibold shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            {/* OTP Verification Step - Keep existing code */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-blue-600 hover:text-indigo-600 transition-colors mb-4 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to signup</span>
              </button>

              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                Verify Email
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Enter the 4-digit verification code sent to
                <br />
                <span className="font-semibold text-blue-600">
                  {formData.email}
                </span>
              </p>
            </div>

            {error && (
              <div
                className={`mb-4 p-3 ${
                  error.includes("success")
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                } rounded-lg text-sm flex items-center gap-2`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    error.includes("success") ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                {error}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50 hover:bg-white transition-all duration-200"
                    value={otp[index] || ""}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    id={`otp-${index + 1}`}
                  />
                ))}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 4}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 font-semibold shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </div>
                  ) : (
                    "Verify Email"
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-blue-600 hover:text-indigo-600 font-medium hover:underline transition-all duration-200"
                  >
                    Resend Code
                  </button>
                </p>
              </div>
            </form>
          </>
        )}

        {/* Footer Navigation */}
        <div className="mt-6 text-center">
          <div className="relative mb-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <div className="mb-3 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_blue"
              size="medium"
              text="signup_with"
              shape="pill"
              width="280"
            />
          </div>

          <p className="text-sm text-gray-600">
            {step === 1 ? "Already have an account? " : "Remember your password? "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-indigo-600 font-semibold hover:underline transition-all duration-200"
            >
              {step === 1 ? "Sign in here" : "Sign In Instead"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
