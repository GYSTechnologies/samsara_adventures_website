
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, setError, googleAuth } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(formData.email, formData.password);
    if (result.success) {
      // Get the redirect path from location state or default to home
      const from = location.state?.from?.pathname || "/";

      // Navigate back to the original page
      navigate(from, {
        state: {
          preserveForm: true,
          from: location.state?.from,
        },
        replace: true,
      });
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    setError("");
    
    try {
      const token = credentialResponse.credential;
      
      // Send token to backend for verification
      const result = await googleAuth(token);
      
      if (result.success) {
        // Get the redirect path from location state or default to home
        const from = location.state?.from?.pathname || "/";
        
        // Navigate back to the original page
        navigate(from, {
          state: {
            preserveForm: true,
            from: location.state?.from,
          },
          replace: true,
        });
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
        {/* Header Section */}
        <div className="text-center mb-6">
          {/* Welcome Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <LogIn className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-sm">
            Sign in to your account to continue
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="group">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 pl-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                placeholder="Enter your email"
                required
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3 group-focus-within:text-blue-500 transition-colors" />
            </div>
          </div>

          {/* Password Input */}
          <div className="group">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 pl-10 pr-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                placeholder="Enter your password"
                required
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
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-3.5 w-3.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-gray-700 font-medium"
              >
                Remember me
              </label>
            </div>
            <div>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-blue-600 hover:text-indigo-600 font-medium hover:underline transition-all duration-200"
              >
                Forgot password?
              </button>
            </div>
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
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

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
              text="signin_with"
              shape="pill"
              width="280"
            />
          </div>
          
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/sign-up")}
              className="text-blue-600 hover:text-indigo-600 font-semibold hover:underline transition-all duration-200"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}