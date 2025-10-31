// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingEmail, setPendingEmail] = useState(null); // Store email for OTP verification

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axiosInstance.post("/api/auth/loginUser", { 
        email, 
        password 
      });

      // Backend returns: { token, user: { userId, name, email, userType, profileUrl, phoneNumber, token } }
      const userData = {
        userId: data.user.userId,
        name: data.user.name,
        email: data.user.email,
        userType: data.user.userType,
        profileUrl: data.user.profileUrl,
        phoneNumber: data.user.phoneNumber,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      // Check if userData is FormData (for file upload)
      const isFormData = userData instanceof FormData;
      
      let emailToStore;
      if (isFormData) {
        emailToStore = userData.get('email');
      } else {
        emailToStore = userData.email;
      }

      const config = {};
      if (!isFormData) {
        config.headers = { "Content-Type": "application/json" };
      }
      // For FormData, let axios set the Content-Type with boundary

      const { data } = await axiosInstance.post("/api/auth/signupUser", userData, config);

      // Backend returns: { message: "OTP sent on your email, verify now" }
      // Store email for OTP verification step
      setPendingEmail(emailToStore);
      
      return { 
        success: true, 
        message: data.message,
        email: emailToStore 
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Signup failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (email, otp) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axiosInstance.post("/api/auth/verifyEmail", { 
        email, 
        otp 
      });

      // Backend returns: { token, user: { userId, name, email, userType, profileUrl, phoneNumber, token } }
      const userData = {
        userId: data.user.userId,
        name: data.user.name,
        email: data.user.email,
        userType: data.user.userType,
        profileUrl: data.user.profileUrl,
        phoneNumber: data.user.phoneNumber,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      
      // Clear pending email
      setPendingEmail(null);
      
      return { success: true, data: userData };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Verification failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      // You'll need to create this endpoint in your backend
      const { data } = await axiosInstance.post("/api/auth/resendOTP", { email });
      
      return { success: true, message: data.message };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to resend OTP";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const googleAuth = async (token) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.post("/api/auth/google", { token });
      
      if (response.data.success) {
        const userData = {
          userId: response.data.user.userId,
          name: response.data.user.name,
          email: response.data.user.email,
          userType: response.data.user.userType,
          profileUrl: response.data.user.profileUrl,
          phoneNumber: response.data.user.phoneNumber,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", response.data.token);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        
        return { success: true };
      }
      
      return { success: false, error: "Google authentication failed" };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Google authentication failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setPendingEmail(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        pendingEmail,
        login,
        logout,
        signup,
        verifyEmail,
        resendOTP,
        setError,
        googleAuth,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
