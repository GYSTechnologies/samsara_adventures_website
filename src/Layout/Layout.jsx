// Layout.jsx
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/admin/AdminSidebar";

export default function Layout() {
  const isLoggedIn = localStorage.getItem("adminToken");

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Content Wrapper with padding for mobile menu button */}
        <div className="pt-16 lg:pt-0 px-4 md:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
