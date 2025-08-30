import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Lock, Eye, EyeOff, Send, CheckCircle, ArrowLeft, Shield } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const sendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post(`/api/auth/sendOtpForResetPassword/${formData.email}`);
      alert(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending OTP');
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post(`/api/auth/verifyEmailForResetPassword`, {
        email: formData.email,
        otp: formData.otp
      });
      alert(res.data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    }
    setLoading(false);
  };

  const resetPassword = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post(`/api/auth/resetPassword`, {
        email: formData.email,
        newPassword: formData.newPassword
      });
      alert(res.data.message);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password');
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) sendOtp();
    if (step === 2) verifyOtp();
    if (step === 3) resetPassword();
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 mt-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* Header with back button */}
        <div className="bg-indigo-600 px-8 py-6 relative">
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          <div className="text-center text-white">
            <div className="mx-auto mb-3 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              {step === 1 && <Mail className="w-6 h-6" />}
              {step === 2 && <Shield className="w-6 h-6" />}
              {step === 3 && <Lock className="w-6 h-6" />}
            </div>
            <h2 className="text-xl font-bold">
              {step === 1 && 'Forgot Password'}
              {step === 2 && 'Verify OTP'}
              {step === 3 && 'Set New Password'}
            </h2>
            <p className="text-indigo-100 text-sm mt-1">
              {step === 1 && 'Enter your email to receive OTP'}
              {step === 2 && 'Enter the code sent to your email'}
              {step === 3 && 'Create your new password'}
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="px-8 py-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  step >= i 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > i ? <CheckCircle className="w-4 h-4" /> : i}
                </div>
                {i < 3 && (
                  <div className={`w-16 h-0.5 mx-2 transition-all ${
                    step > i ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Email</span>
            <span>Verify</span>
            <span>Reset</span>
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">!</span>
              </div>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {step === 1 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50 transition-all"
                    placeholder="Enter your email"
                  />
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  We'll send a verification code to this email
                </p>
              </div>
            )}

            {step === 2 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  OTP Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50 transition-all text-center tracking-wider"
                    placeholder="Enter the OTP sent to your email"
                  />
                  <KeyRound className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Check your email for the 6-digit code
                </p>
              </div>
            )}

            {step === 3 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-11 pr-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50 transition-all"
                    placeholder="Enter your new password"
                  />
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Choose a strong password with at least 8 characters
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all font-semibold"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  {step === 1 && <Send className="w-4 h-4" />}
                  {step === 2 && <CheckCircle className="w-4 h-4" />}
                  {step === 3 && <Lock className="w-4 h-4" />}
                  <span>
                    {step === 1 ? 'Send OTP' : step === 2 ? 'Verify OTP' : 'Reset Password'}
                  </span>
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Remember your password?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
              >
                Back to Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}