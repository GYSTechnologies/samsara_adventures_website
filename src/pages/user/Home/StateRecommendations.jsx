import React, { useEffect, useRef, useState } from "react";
import { Heart, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/axiosInstance";
import { useAuth } from "../../../context/AuthContext";

const fallbackImg =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80";

const formatINR = (n) =>
  n == null
    ? null
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(Number(n));

export default function StateRecommendations({ state = "" }) {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const scrollerRef = useRef(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await axiosInstance.get("/api/trip/getHomeStateTrips", {
          params: {
            page: 1,
            limit: 10,
            state,
            email: user?.email || "",
          },
        });
        const raw = res?.data?.data ?? res?.data?.trips ?? [];
        const normalized = raw.map((t, i) => ({
          id: t.tripId ?? `trip-${i}`,
          title: t.title ?? "Recommended Trip",
          desc:
            t.description ||
            "Discover breathtaking views, curated stays, and unforgettable experiences.",
          image: t.image || fallbackImg,
          subTotal: t.subTotal ?? null,
          isFavorite: !!t.isFavorite,
          tripType: t.tripType === "CUSTOMIZED" ? "Customize" : "Group trip",
          duration: t.duration || null,
        }));
        setItems(normalized);
      } catch (e) {
        console.error(e);
        setErr("Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [state, user?.email]);

  const toggleFavorite = async (tripId, currentFavoriteStatus) => {
    if (!isAuthenticated || !user) {
      toast.info("Please login to add favorites");
      navigate("/login");
      return;
    }

    try {
      const newFavoriteStatus = !currentFavoriteStatus;

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === tripId ? { ...item, isFavorite: newFavoriteStatus } : item
        )
      );

      await axiosInstance.post("/api/user/toggleFavorite", {
        tripId,
        email: user.email,
        isFavorite: newFavoriteStatus,
      });

      toast.success(
        newFavoriteStatus ? "Added to favorites!" : "Removed from favorites"
      );
    } catch (error) {
      console.error("Favorite toggle error:", error);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === tripId ? { ...item, isFavorite: currentFavoriteStatus } : item
        )
      );
      toast.error("Failed to update favorite status");
    }
  };

  // Scroll detection
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollLeft, clientWidth } = el;
      const centerX = scrollLeft + clientWidth / 2;
      let bestIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < el.children.length; i++) {
        const child = el.children[i];
        const mid = child.offsetLeft + child.clientWidth / 2;
        const dist = Math.abs(mid - centerX);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      }
      setActive(bestIdx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    requestAnimationFrame(onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  const scrollLeft = () => {
    const el = scrollerRef.current;
    if (el) el.scrollBy({ left: -300, behavior: "smooth" });
  };
  const scrollRight = () => {
    const el = scrollerRef.current;
    if (el) el.scrollBy({ left: 300, behavior: "smooth" });
  };

  const onExplore = (it) => {
    window.location.href = `/detail-page/${encodeURIComponent(it.id)}`;
  };

  if (loading) {
    return (
      <section className="bg-[#eef5d2] py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
            Recommendations for You
          </h2>
          <div className="flex gap-4 sm:gap-5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-[clamp(300px,48vw,440px)] w-[clamp(220px,64vw,320px)] rounded-[24px] sm:rounded-[28px] bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (err) {
    return (
      <section className="bg-[#eef5d2] py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
            Recommendations for You
          </h2>
          <div className="text-red-600">{err}</div>
        </div>
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section className="bg-[#eef5d2] py-6 sm:py-8 md:py-10 relative">
      <div className="max-w-6xl mx-auto px-4 relative">
        {/* Left Scroll Button */}
        <button
          onClick={scrollLeft}
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full shadow-lg p-2 sm:p-3 hidden md:flex"
        >
          <ChevronLeft className="text-gray-700" />
        </button>

        {/* Right Scroll Button */}
        <button
          onClick={scrollRight}
          className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full shadow-lg p-2 sm:p-3 hidden md:flex"
        >
          <ChevronRight className="text-gray-700" />
        </button>

        <div
          ref={scrollerRef}
          className="
            grid grid-flow-col
            auto-cols-[minmax(220px,320px)]
            sm:auto-cols-[minmax(260px,340px)]
            md:auto-cols-[minmax(300px,360px)]
            overflow-x-auto overflow-y-hidden no-scrollbar
            gap-3 sm:gap-5 md:gap-6 px-1
            snap-x snap-mandatory scroll-smooth
            overscroll-x-contain w-full
          "
          style={{
            WebkitOverflowScrolling: "touch",
            scrollPaddingLeft: "16px",
            scrollPaddingRight: "16px",
          }}
        >
          {items.map((it, idx) => {
            const isActive = idx === active;
            const height = "clamp(300px, 60vw, 460px)";
            return (
              <article
                key={it.id}
                className={`
                  snap-center transition-all duration-300 ease-in-out
                  ${isActive ? "scale-100 z-10" : "scale-[0.95] opacity-90"}
                `}
                style={{ height }}
              >
                <div
                  className="
                    relative h-full rounded-[22px] sm:rounded-[26px] md:rounded-[28px]
                    overflow-hidden shadow-xl
                  "
                  style={{
                    boxShadow:
                      "0 10px 30px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.06)",
                  }}
                >
                  <img
                    src={it.image}
                    alt={it.title}
                    onError={(e) => (e.currentTarget.src = fallbackImg)}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20">
                    <button
                      type="button"
                      className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
                      aria-label={
                        it.isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(it.id, it.isFavorite);
                      }}
                    >
                      <Heart
                        size={18}
                        className={`${
                          it.isFavorite ? "text-rose-500" : "text-gray-700"
                        }`}
                        fill={it.isFavorite ? "#ef4444" : "none"}
                        strokeWidth={2}
                      />
                    </button>
                  </div>

                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-white/70 text-gray-800">
                      {it.tripType}
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6 text-white">
                    <h3 className="text-[clamp(16px,3.5vw,24px)] font-extrabold drop-shadow leading-snug">
                      {it.title}
                    </h3>
                    <p className="mt-2 text-[clamp(12px,2.8vw,14px)] text-white/90 line-clamp-3">
                      {it.desc}
                    </p>

                    <div className="mt-3 flex justify-between sm:mt-4">
                      <button
                        onClick={() => onExplore(it)}
                        className="inline-flex items-center justify-center px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full font-semibold bg-green-700 hover:bg-green-800 text-white shadow-lg shadow-green-700/30 transition text-[clamp(12px,2.8vw,14px)]"
                      >
                        Explore
                      </button>
                      <div className="mt-3 flex items-center gap-2 sm:gap-3 text-[clamp(11px,2.6vw,13px)] text-white/90">
                        {it.duration ? (
                          <span className="inline-flex items-center gap-1">
                            <Clock size={14} /> {it.duration}
                          </span>
                        ) : null}
                        {it.subTotal ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/20 border border-white/30">
                            {formatINR(it.subTotal)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <style>{`
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
