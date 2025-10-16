// components/nav/Navbar.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { Search, User, Loader2, Heart, LogOut } from "lucide-react";
import { debounce } from "lodash";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

function cn(...a){return a.filter(Boolean).join(" ");}

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const suggestionsRef = useRef(null);

  const navItems = useMemo(() => [
    { name: "Home", path: "/" },
    { name: "Events", path: "/event" },
    { name: "My Plans", path: "/plan" },
    { name: "About Us", path: "/about" },
  ], []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDown = (e) => {
      if (suggestionsRef.current &&
          !suggestionsRef.current.contains(e.target) &&
          !e.target.closest('input[type="text"]')) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const fetchSuggestions = async (q) => {
    if (!q || q.trim().length < 2) { setSuggestions([]); return; }
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/api/trip/search?query=${encodeURIComponent(q)}`);
      setSuggestions(res?.data?.results ?? []);
    } catch {
      setSuggestions([]);
    } finally { setIsLoading(false); }
  };
  const debounced = useRef(debounce(fetchSuggestions, 300)).current;
  useEffect(() => { if (searchQuery.trim().length>=2) debounced(searchQuery); else setSuggestions([]); return ()=>debounced.cancel(); }, [searchQuery, debounced]);

  const goProfile = () => navigate(user ? "/profile" : "/login");
  const goFav = () => navigate(user ? "/favorites" : "/login");
  const doLogout = () => { logout?.(); navigate("/"); };

  const activeClass = (isActive) =>
    isActive
      ? scrolled ? "text-lime-600 bg-lime-50" : "text-gray-100 bg-white/20"
      : scrolled ? "text-gray-200 hover:text-lime-600 hover:bg-gray-100" : "text-gray-100 hover:text-gray-200 hover:bg-white/10";

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-[#556B2F]  backdrop-blur-md shadow-lg" : "bg-[#556B2F]"
      )}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 sm:h-18 px-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center">
              <img src="/samsaralogo.png" alt="Brand" className="h-8 w-auto sm:h-10 md:h-12 object-contain" />
            </Link>

            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navItems.map(it => (
                <NavLink key={it.name} to={it.path} end={it.path==="/"}
                  className={({isActive})=>cn("px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200", activeClass(isActive))}
                >{it.name}</NavLink>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <div className="relative">
                <form onSubmit={(e)=>{e.preventDefault(); const target=suggestions?.[0]?.state ?? searchQuery.trim(); if(target) navigate(`/destination/${encodeURIComponent(target)}`); setShowSuggestions(false);}}>
                  <div className={cn(
                    "flex items-center rounded-lg px-3 py-2 w-64 lg:w-72 xl:w-80 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200",
                    scrolled ? "bg-gray-50 focus-within:bg-white" : "bg-white/80 focus-within:bg-white"
                  )}>
                    <Search size={16} className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      placeholder="Search destinations..."
                      value={searchQuery}
                      onChange={(e)=>{setSearchQuery(e.target.value); setShowSuggestions(true);}}
                      onFocus={()=>setShowSuggestions(true)}
                      className="bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm w-full"
                    />
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin text-blue-500 ml-2" />}
                  </div>

                  {showSuggestions && (isLoading || suggestions.length>0) && (
                    <div ref={suggestionsRef} className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200/50 z-50 max-h-64 overflow-y-auto">
                      {isLoading ? (
                        <div className="px-4 py-3 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-500" /><span>Searching...</span>
                        </div>
                      ) : suggestions.map((r,i)=>(
                        <div key={i} className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center"
                          onClick={()=>{ setSearchQuery(r.state); setShowSuggestions(false); navigate(`/destination/${encodeURIComponent(r.state)}`); }}>
                          {r.images?.[0]
                            ? <img src={r.images[0]} alt={r.state} className="w-8 h-8 rounded-md object-cover mr-3" />
                            : <div className="w-8 h-8 rounded-md bg-blue-100 mr-3 grid place-items-center"><Search className="w-4 h-4 text-blue-500"/></div>}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-800 truncate">{r.state}</div>
                            <div className="text-xs text-gray-500 truncate">{r.title}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </form>
              </div>

              <div className="flex items-center space-x-2">
                {user && (
                  <button onClick={goFav}
                    className={cn("p-2 rounded-lg transition-all duration-200",
                      scrolled ? "bg-gray-50 border border-gray-200 hover:bg-white hover:border-gray-300"
                               : "bg-white/80 border border-gray-200/50 hover:bg-white hover:border-gray-300")}>
                    <Heart size={16} className="text-gray-600" fill={location.pathname.startsWith("/favorites") ? "#ef4444" : "none"} />
                  </button>
                )}
                <button onClick={goProfile} className="p-2 rounded-lg bg-lime-900 text-white hover:bg-lime-700 transition-all duration-200 shadow-sm hover:shadow-md">
                  <User size={16}/>
                </button>
                {user && (
                  <button onClick={doLogout}
                    className={cn("px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      scrolled ? "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300"
                               : "bg-white/80 border border-gray-200/50 text-gray-700 hover:bg-white hover:border-gray-300")}>
                    <LogOut size={14} className="inline mr-1"/> Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="hidden md:block h-16 sm:h-18" />
    </>
  );
}
