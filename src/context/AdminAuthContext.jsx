import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // load from localStorage
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    const storedToken = localStorage.getItem("adminToken");

    if (storedAdmin && storedToken) {
      setAdmin(JSON.parse(storedAdmin));
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  // Admin Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axiosInstance.post("/api/admin/login", {
        email,
        password,
      });

      setAdmin({ ...data.user, role: "admin" });
      localStorage.setItem("admin", JSON.stringify({ ...data.user, role: "admin" }));
      localStorage.setItem("adminToken", data.token);

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.token}`;

      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || "Admin login failed");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Admin Signup (agar ek hi admin allowed hai to optional)
  const signup = async (adminData) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axiosInstance.post("/api/admin/signup", adminData);

      return { success: true, data };
    } catch (err) {
      setError(err.response?.data?.message || "Admin signup failed");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loading,
        error,
        login,
        signup,
        logout,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

// custom hook
export const useAdminAuth = () => useContext(AdminAuthContext);
