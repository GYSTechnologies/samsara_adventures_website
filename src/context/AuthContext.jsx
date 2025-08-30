// import { createContext, useContext, useState, useEffect } from "react";
// import axiosInstance from "../api/axiosInstance";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Load user from localStorage on mount
//   useEffect(() => {
//     const initializeAuth = () => {
//       try {
//         const storedUser = localStorage.getItem("user");
//         const storedToken = localStorage.getItem("token");

//         if (storedUser && storedToken) {
//           setUser(JSON.parse(storedUser));
//           axiosInstance.defaults.headers.common[
//             "Authorization"
//           ] = `Bearer ${storedToken}`;
//         }
//       } catch {
//         logout();
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeAuth();
//   }, []);

//   // Login
//   const login = async (email, password) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const { data } = await axiosInstance.post("/api/auth/loginUser", {
//         email,
//         password,
//       });

//       setUser(data.user);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       localStorage.setItem("token", data.token);
//       axiosInstance.defaults.headers.common[
//         "Authorization"
//       ] = `Bearer ${data.token}`;

//       return { success: true };
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed");
//       return { success: false, error: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Signup - Step 1 (Send OTP)
//   // const signup = async (userData) => {
//   //   try {
//   //     setLoading(true);
//   //     setError(null);

//   //     let payload;

//   //     // If image exists, send FormData
//   //     if (userData.profileImage) {
//   //       payload = new FormData();
//   //       Object.entries(userData).forEach(([key, value]) => {
//   //         payload.append(key, value);
//   //       });
//   //     } else {
//   //       payload = userData;
//   //     }

//   //     const { data } = await axiosInstance.post("/api/auth/signupUser", payload, {
//   //       headers: userData.profileImage
//   //         ? { "Content-Type": "multipart/form-data" }
//   //         : {},
//   //     });

//   //     return { success: true, data };
//   //   } catch (err) {
//   //     setError(err.response?.data?.message || "Signup failed");
//   //     return { success: false, error: err.message };
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   // inside AuthProvider

// const signup = async (userData) => {
//   try {
//     setLoading(true);
//     setError(null);

//     // If caller passed a FormData directly (frontend does), use it as-is.
//     const isFormData = userData instanceof FormData;

//     const payload = isFormData ? userData : userData;

//     // Build config per-request
//     const config = {};

//     // If backend needs credentials (cookies) enable this:
//     // config.withCredentials = true;

//     // IMPORTANT: do NOT set Content-Type header for FormData.
//     if (!isFormData) {
//       // only for JSON payloads set content-type
//       config.headers = { "Content-Type": "application/json" };
//     } else {
//       config.headers = {}; // leave empty so browser sets boundary
//     }

//     const { data } = await axiosInstance.post("/api/auth/signupUser", payload, config);

//     return { success: true, data };
//   } catch (err) {
//     console.error("Signup error:", err?.response?.data || err.message || err);
//     setError(err.response?.data?.message || "Signup failed");
//     return { success: false, error: err.message || "Signup failed" };
//   } finally {
//     setLoading(false);
//   }
// };


//   // Verify OTP - Step 2 (Create account & login)
//   const verifyEmail = async (email, otp) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const { data } = await axiosInstance.post("/api/auth/verifyEmail", {
//         email,
//         otp,
//       });

//       setUser(data.user);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       localStorage.setItem("token", data.token);
//       axiosInstance.defaults.headers.common[
//         "Authorization"
//       ] = `Bearer ${data.token}`;

//       return { success: true, data };
//     } catch (err) {
//       setError(err.response?.data?.message || "Verification failed");
//       return { success: false, error: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // AuthContext में
// const googleAuth = async (token) => {
//   try {
//     const response = await axios.post("/api/auth/google", { token });
//     if (response.data.success) {
//       localStorage.setItem("token", response.data.token);
//       setUser(response.data.user);
//       return { success: true };
//     }
//   } catch (error) {
//     setError(error.response?.data?.message || "Google authentication failed");
//     return { success: false };
//   }
// };
//   // Logout
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     delete axiosInstance.defaults.headers.common["Authorization"];
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         error,
//         login,
//         logout,
//         signup,
//         verifyEmail,
//         setError,
//         googleAuth,
//         isAuthenticated: !!user,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };


// src/context/AuthContext.jsx (or .js) - full provider (only copy if you want full replacement)
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        }
      } catch {
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
      const { data } = await axiosInstance.post("/api/auth/loginUser", { email, password });
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };



  // inside AuthContext - replace existing signup with this
const signup = async (userData) => {
  try {
    setLoading(true);
    setError(null);

    const isFormData = typeof FormData !== "undefined" && userData instanceof FormData;
    const url = "/api/auth/signupUser"; // relative URL - axiosInstance has baseURL

    // DEBUG: list FormData entries (client-side confirmation)
    // if (isFormData) {
    //   console.log(">>> signup: Detected FormData. Entries:");
    //   for (const pair of userData.entries()) {
    //     // file objects will print as File in console
    //     console.log("   ", pair[0], pair[1]);
    //   }
    // } else {
    //   console.log(">>> signup: Sending JSON payload:", userData);
    // }

    // Normal path: try axios first (keeps existing behavior)
    try {
      const config = {};
      if (!isFormData) {
        config.headers = { "Content-Type": "application/json" };
      } else {
        config.headers = {}; // important: don't set Content-Type for FormData
      }

      const { data } = await axiosInstance.post(url, userData, config);
      return { success: true, data };
    } catch (axiosErr) {

      // Fallback: use fetch to send raw FormData (this will always send proper multipart)
      if (isFormData) {
        try {
          // build absolute URL for fetch (use same base as axiosInstance if available)
          const base = axiosInstance.defaults.baseURL || import.meta.env.VITE_API_BASE_URL || "";
          const absoluteUrl = base ? base.replace(/\/$/, "") + url : url;

          const resp = await fetch(absoluteUrl, {
            method: "POST",
            body: userData,
            // credentials: 'include' // uncomment if your server requires cookies
          });

          const respText = await resp.text(); // try parse as text first
          try {
            const json = JSON.parse(respText);
            return { success: resp.ok, data: json };
          } catch {
            // not JSON — return raw text response
            return { success: resp.ok, data: respText };
          }
        } catch (fetchErr) {
          setError("Signup failed (network).");
          return { success: false, error: fetchErr.message };
        }
      }

      // If not FormData and axios failed, return failure
      setError("Signup failed (server).");
      return { success: false, error: axiosErr.message || "axios error" };
    }
  } catch (err) {
    console.error("signup unexpected error:", err);
    setError("Signup failed.");
    return { success: false, error: err.message || "Signup failed" };
  } finally {
    setLoading(false);
  }
};


  const verifyEmail = async (email, otp) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axiosInstance.post("/api/auth/verifyEmail", { email, otp });
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      return { success: true, data };
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const googleAuth = async (token) => {
    try {
      const response = await axiosInstance.post("/api/auth/google", { token });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      setError(error.response?.data?.message || "Google authentication failed");
      return { success: false };
    }
  };

  const logout = () => {
    setUser(null);
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
        login,
        logout,
        signup,
        verifyEmail,
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
