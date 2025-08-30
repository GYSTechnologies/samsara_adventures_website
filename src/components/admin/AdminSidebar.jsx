import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  CreditCard,
  MessageCircle,
  Calendar,
  User,
  LogOut,
  Menu,
  X,
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
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: "/admin/trips",
      label: "Trips",
      icon: <Briefcase size={20} />,
    },
    { path: "/admin/events", label: "Events", icon: <Calendar size={20} /> },
    {
      path: "/admin/payments",
      label: "Payments",
      icon: <CreditCard size={20} />,
    },
    {
      path: "/admin/passengers",
      label: "Passengers",
      icon: <Users size={20} />,
    },
    {
      path: "/admin/enquiries",
      label: "Enquiries",
      icon: <MessageCircle size={20} />,
    },
    // { path: "/admin/profile", label: "Profile", icon: <User size={20} /> },
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
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-gray-900 text-white rounded-md shadow-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
className="lg:hidden fixed inset-0  bg-opacity-50 backdrop-blur-sm z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          fixed lg:relative
          w-72 lg:w-80 xl:w-96
          h-screen
          bg-gray-900 
          text-white 
          flex 
          flex-col 
          transition-transform 
          duration-300 
          ease-in-out
          z-50
          shadow-xl lg:shadow-none
        `}
      >
        {/* Header */}
        <div className="p-6 lg:p-8">
          <h1 className="font-bold text-xl lg:text-2xl text-center lg:text-left">
            Admin Panel
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 lg:px-6">
          <div className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                className={`
                  flex items-center gap-3 lg:gap-4 
                  px-4 lg:px-6 
                  py-3 lg:py-4 
                  rounded-lg
                  transition-all duration-200 
                  hover:bg-gray-700 
                  hover:shadow-md
                  text-sm lg:text-base
                  font-medium
                  ${
                    location.pathname === link.path
                      ? "bg-gray-700 shadow-md border-l-4 border-blue-500"
                      : ""
                  }
                `}
              >
                <span className="flex-shrink-0">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Logout Section */}
        <div className="p-4 lg:p-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="
              w-full 
              flex items-center gap-3 lg:gap-4 
              px-4 lg:px-6 
              py-3 lg:py-4 
              rounded-lg
              transition-all duration-200 
              hover:bg-red-600 
              hover:shadow-md
              text-sm lg:text-base
              font-medium
              text-gray-300 
              hover:text-white
              border border-gray-600 
              hover:border-red-500
            "
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
