// src/layouts/Layout.jsx
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/admin/AdminSidebar";

export default function Layout() {
  const isLoggedIn = localStorage.getItem("adminToken"); 

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1  bg-gray-50 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
