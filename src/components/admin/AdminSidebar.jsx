// AdminSidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  CreditCard,
  MessageCircle,
  Calendar,
  Image,
  LogOut,
  Menu,
  X,
  FolderTree, // Perfect icon for Categories
} from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      path: "/admin/trips",
      label: "Trips",
      icon: <Briefcase size={18} />,
    },
    { 
      path: "/admin/events", 
      label: "Events", 
      icon: <Calendar size={18} /> 
    },
    {
      path: "/admin/payments",
      label: "Payments",
      icon: <CreditCard size={18} />,
    },
    {
      path: "/admin/passengers",
      label: "Passengers",
      icon: <Users size={18} />,
    },
    {
      path: "/admin/vector-image",
      label: "Vector Images",
      icon: <Image size={18} />,
    },
    {
      path: "/admin/categories",
      label: "Categories",
      icon: <FolderTree size={18} />, // Changed to FolderTree icon
    },
    {
      path: "/admin/enquiries",
      label: "Enquiries",
      icon: <MessageCircle size={18} />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    sessionStorage.clear();
    navigate("/admin/login");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2.5 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          fixed
          left-0
          top-0
          w-64
          h-screen
          bg-gradient-to-b from-gray-900 to-gray-800
          text-white 
          flex 
          flex-col 
          transition-transform 
          duration-300 
          ease-in-out
          z-50
          shadow-2xl
          overflow-hidden
        `}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-700">
          <h1 className="font-bold text-xl text-white tracking-wide">
            Admin Panel
          </h1>
          <p className="text-xs text-gray-400 mt-1">Manage your platform</p>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <div className="px-3 py-4 space-y-1">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={`
                    flex items-center gap-3
                    px-4
                    py-2.5
                    rounded-lg
                    transition-all duration-200 
                    text-sm
                    font-medium
                    group
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }
                  `}
                >
                  <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                    {link.icon}
                  </span>
                  <span className="truncate">{link.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Section - Fixed at bottom */}
        <div className="p-3 border-t border-gray-700 bg-gray-900">
          <button
            onClick={handleLogout}
            className="
              w-full 
              flex items-center gap-3
              px-4
              py-2.5
              rounded-lg
              transition-all duration-200 
              hover:bg-red-600
              text-sm
              font-medium
              text-gray-300 
              hover:text-white
              border border-gray-600
              hover:border-red-500
              group
            "
          >
            <LogOut size={18} className="text-gray-400 group-hover:text-white" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
