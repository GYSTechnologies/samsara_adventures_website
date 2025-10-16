// components/nav/BottomNav.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, CalendarDays, Heart, User, Search } from "lucide-react";
import SearchModal from "./SearchModal";

export default function BottomNav() {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/event", label: "Events", icon: CalendarDays },
    { to: "/favorites", label: "Saved", icon: Heart },
    { to: "/profile", label: "Profile", icon: User },
  ];

  return (
    <>
      <nav
        className="
          md:hidden fixed bottom-0 left-0 right-0 z-50
          bg-[#556B2F] backdrop-blur-md border-t rounded-t-3xl border-gray-200
          pt-1 pb-[max(12px,env(safe-area-inset-bottom))]
        "
        role="navigation"
        aria-label="Bottom navigation"
      >
        <div className="max-w-7xl mx-auto px-2">
          <div className="grid grid-cols-5 items-end h-14">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              className="col-span-1 mx-auto -mt-6 h-12 w-12 rounded-full bg-lime-600 text-white shadow-lg shadow-green-600/30 active:scale-95 transition grid place-items-center"
            >
              <Search size={20} />
            </button>

            <div className="col-span-4 grid grid-cols-4">
              {items.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `flex flex-col items-center justify-center text-xs py-1 ${
                      isActive ? "text-lime-400" : "text-gray-200"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={20}
                        className={isActive ? "text-lime-400" : "text-gray-200"}
                      />
                      <span className="mt-0.5">{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
