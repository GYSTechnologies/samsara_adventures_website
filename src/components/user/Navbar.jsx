import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  User,
  Menu,
  X,
  Loader2,
  Heart,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { debounce } from "lodash";
import axiosInstance from "../../api/axiosInstance";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef();
  const suggestionsRef = useRef();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/event" },
    { name: "My Plans", path: "/plan" },
    { name: "About Us", path: "/about" },
  ];

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Handle clicks outside suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !event.target.closest('input[type="text"]')
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchSuggestions = async (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/trip/search?query=${encodeURIComponent(query)}`
      );
      setSuggestions(response.data.results);
    } catch (error) {
      console.error("Search error:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useRef(
    debounce((query) => fetchSuggestions(query), 300)
  ).current;

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      debouncedSearch(searchQuery);
    } else {
      setSuggestions([]);
    }
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (result) => {
    setSearchQuery(result.state);
    setShowSuggestions(false);
    navigate(`/destination/${encodeURIComponent(result.state)}`);
    setIsMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && suggestions.length > 0) {
      navigate(`/destination/${encodeURIComponent(suggestions[0].state)}`);
      setShowSuggestions(false);
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleMobileNavClick = () => setIsMenuOpen(false);

  const handleUserClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
    setIsMenuOpen(false);
  };

  const handleFavoriteClick = () => {
    if (user) {
      navigate("/favorites");
    } else {
      navigate("/login");
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  // Improved active path detection for nested routes
  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // utils/colors.js

  const themeColors = {
    primary: {
      from: "from-blue-600",
      to: "to-indigo-600",
    },
    primaryHover: {
      from: "from-blue-600 hover:from-blue-700",
      to: "to-indigo-600 hover:to-indigo-700",
    },
    primaryLight: {
      from: "from-blue-50/30",
      via: "via-white/30",
      to: "to-indigo-50/30",
    },
    hover: {
      from: "from-blue-500/10",
      via: "via-blue-500/15",
      to: "to-indigo-500/10",
    },
    hoverLight: {
      from: "from-blue-50/50",
      to: "to-indigo-50/50",
    },
    text: {
      from: "from-blue-600",
      via: "via-blue-500",
      to: "to-indigo-500",
    },
    pulse: {
      blue: "bg-blue-400",
      indigo: "bg-indigo-400",
    },
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-black/5"
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${themeColors.primaryLight.from} ${themeColors.primaryLight.via} ${themeColors.primaryLight.to}`}
      ></div>

      <div className="relative flex items-center justify-between py-4 px-6 md:px-12 lg:px-16">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center space-x-3 transform hover:scale-105 transition-all duration-300"
        >
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${themeColors.primary.from} ${themeColors.primary.to} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span
            className={`text-2xl font-bold bg-gradient-to-r ${themeColors.text.from} ${themeColors.text.via} ${themeColors.text.to} bg-clip-text text-transparent`}
          >
            Samsara Adventures
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-5">
          {navItems.map((item) => {
            const isActive = isActivePath(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-8 py-3 ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                } transition-all duration-300 font-semibold text-lg rounded-2xl group`}
              >
                <span
                  className={`tracking-wide ${
                    isActive
                      ? "scale-105 text-blue-600"
                      : "group-hover:scale-105"
                  } transition-transform duration-300`}
                >
                  {item.name}
                </span>

                {/* Underline on hover or active */}
                <span
                  className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full 
          ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"} 
          transition-opacity duration-300`}
                ></span>
              </Link>
            );
          })}
        </div>

        {/* Desktop Search and User */}
        <div className="hidden md:flex items-center space-x-4 -ml-40">
          {/* Search Input */}
          <div className="relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center bg-white/70 backdrop-blur-md rounded-2xl px-5 py-3 w-80 focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:bg-white/90 transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200/50">
                <Search className="text-gray-500 mr-3" size={18} />
                <input
                  type="text"
                  placeholder="Discover amazing destinations..."
                  className="bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm w-full font-medium"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                />
                {isLoading && (
                  <div className="ml-2 p-1 rounded-full bg-blue-50">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  </div>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && (suggestions?.length > 0 || isLoading) && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/10 z-50 max-h-80 overflow-hidden border border-gray-200/50 overflow-y-auto"
                >
                  {isLoading ? (
                    <div className="px-6 py-4 text-center text-gray-500 text-sm flex items-center justify-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                      <span>Finding destinations...</span>
                    </div>
                  ) : (
                    <>
                      <div className="px-4 py-3 text-xs font-semibold text-gray-500 bg-gray-50/50 border-b border-gray-100/50 tracking-wider">
                        POPULAR DESTINATIONS
                      </div>
                      {suggestions?.map((result, index) => (
                        <div
                          key={index}
                          className={`px-4 py-3 hover:bg-gradient-to-r ${themeColors.hoverLight.from} ${themeColors.hoverLight.to} cursor-pointer flex items-center group transition-all duration-200 border-b border-gray-50/50 last:border-b-0`}
                          onClick={() => handleSuggestionClick(result)}
                        >
                          {result.images?.[0] ? (
                            <img
                              src={result.images[0]}
                              alt={result.state}
                              className="w-10 h-10 rounded-xl object-cover mr-4 shadow-sm group-hover:shadow-md transition-shadow duration-200"
                            />
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 mr-4 flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors duration-200`}
                            >
                              <Search className="w-4 h-4 text-blue-500" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                              {result.state}
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                              {result.title}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Favorite Btn */}
          {user && (
            <button
              onClick={handleFavoriteClick}
              className="p-3 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200/50 hover:bg-blue-50/70 hover:border-blue-300/50 transition-all duration-300 hover:scale-110 group shadow-sm hover:shadow-md relative overflow-hidden"
            >
              <Heart
                className="relative z-10 text-gray-600 group-hover:text-blue-500 transition-colors duration-300"
                size={18}
                fill={location.pathname === "/favorites" ? "#3b82f6" : "none"}
              />
            </button>
          )}

          {/* User Btn */}
          <button
            onClick={handleUserClick}
            className={`p-3 rounded-2xl bg-gradient-to-br ${themeColors.primary.from} ${themeColors.primary.to} hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 group relative overflow-hidden`}
          >
            <User className="relative z-10 text-white" size={18} />
          </button>

          {/* Logout Btn */}
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white/70 backdrop-blur-md border border-blue-200/50 hover:bg-blue-50/70 text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-105 group shadow-sm hover:shadow-md relative overflow-hidden"
            >
              <LogOut className="relative z-10 w-4 h-4" />
              <span className="relative z-10 text-sm font-semibold">
                Logout
              </span>
            </button>
          )}
        </div>

        {/* Mobile Menu Btn */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-3 rounded-2xl hover:bg-gray-100/70 transition-all duration-300 hover:scale-110 relative overflow-hidden group"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl shadow-2xl border-t border-white/20 relative">
          <div
            className={`absolute inset-0 bg-gradient-to-b ${themeColors.primaryLight.from} ${themeColors.primaryLight.to}`}
          ></div>
          <div className="relative px-6 py-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <form onSubmit={handleSearchSubmit}>
                <div className="flex items-center bg-white/80 backdrop-blur-md rounded-2xl px-5 py-3 focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:bg-white/95 transition-all duration-300 shadow-sm border border-gray-200/50">
                  <Search className="text-gray-500 mr-3" size={18} />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    className="bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm w-full font-medium"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setShowSuggestions(true)}
                  />
                </div>
              </form>
            </div>

            {/* Nav Items */}
            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = isActivePath(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={handleMobileNavClick}
                    className={`block w-full text-left font-semibold py-3 px-4 rounded-xl transition-all duration-300 text-sm group relative overflow-hidden ${
                      isActive
                        ? "text-blue-600 bg-gradient-to-r from-blue-50/70 to-indigo-50/70"
                        : `text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r ${themeColors.hoverLight.from} ${themeColors.hoverLight.to}`
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* ✅ Mobile User Section */}
            <div className="flex items-center space-x-3 pt-4 border-t border-gray-200/50">
              {user && (
                <button
                  onClick={handleFavoriteClick}
                  className="p-3 rounded-xl bg-white/70 border border-gray-200/50 hover:bg-blue-50/70 transition-all duration-300 shadow-sm"
                >
                  <Heart
                    className="text-gray-600"
                    size={18}
                    fill={
                      location.pathname === "/favorites" ? "#3b82f6" : "none"
                    }
                  />
                </button>
              )}

              <button
                onClick={handleUserClick}
                className={`p-3 rounded-xl bg-gradient-to-br ${themeColors.primary.from} ${themeColors.primary.to} text-white transition-all duration-300 shadow-md`}
              >
                <User size={18} />
              </button>

              {user && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/70 border border-blue-200/50 text-blue-600 hover:bg-blue-50/70 transition-all duration-300 shadow-sm"
                >
                  <LogOut size={16} />
                  <span className="text-sm font-semibold">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
