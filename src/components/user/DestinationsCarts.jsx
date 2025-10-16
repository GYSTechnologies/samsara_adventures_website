import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const DestinationsCarts = () => {
  const [topDestinations, setTopDestinations] = useState([]);
  const [stateDestinations, setStateDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPopularLocations = async () => {
    try {
      const res = await axiosInstance.get("/api/trip/getHomeTripDetails");
      if (!res.data || !Array.isArray(res.data.trips)) return [];
      const seen = new Set();
      const unique = [];
      for (const t of res.data.trips) {
        const k = `${t.title}-${t.state}`;
        if (!seen.has(k)) {
          seen.add(k);
          unique.push(t);
        }
      }
      return unique.map((t) => ({
        id: t.tripId || Math.random().toString(36).slice(2),
        title: t.title || "Popular Destination",
        description: t.description || "Experience this amazing destination",
        image:
          t.image ||
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
        tag: Array.isArray(t.tags) && t.tags[0] ? t.tags[0] : "Popular",
        duration: t.duration || "5 days trip",
        location: t.state || t.title || "india",
        subTotal: t.subTotal || null,
      }));
    } catch (e) {
      setError("Failed to load top destinations");
      return [];
    }
  };

  const fetchStateWiseDestinations = async () => {
    try {
      const res = await axiosInstance.get("/api/trip/getStateTrips", {
        params: { limit: 6 },
      });
      if (!res.data || !Array.isArray(res.data.trips)) return [];
      const unique = res.data.trips.filter(
        (t, i, a) => i === a.findIndex((x) => x.state === t.state)
      );
      return unique.map((t) => ({
        id: t.tripId || Math.random().toString(36).slice(2),
        title: t.state || "State Destination",
        description: t.description || "Experience this destination",
        image:
          t.image ||
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
        tag: Array.isArray(t.tags) && t.tags[0] ? t.tags[0] : "Travel",
        duration: t.duration || "5 days trip",
        location: t.state || "india",
        subTotal: t.subTotal || null,
      }));
    } catch (e) {
      setError("Failed to load state destinations");
      return [];
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [top, states] = await Promise.all([
          fetchPopularLocations(),
          fetchStateWiseDestinations(),
        ]);
        setTopDestinations(top);
        setStateDestinations(states);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const Card = ({ d }) => (
    <div className="snap-start flex-shrink-0  w-[260px] sm:w-[300px] md:w-[320px]">
      <a href={`/destination/${d.location}`} className="relative block h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition">  
        <img
          src={d.image}
          alt={d.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        {d?.subTotal && (
          <span className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-medium">
            ₹{d.subTotal}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-10 text-white">
          <h3 className="text-base sm:text-lg md:text-xl font-bold leading-tight line-clamp-2">
            {d.title}
          </h3>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="px-2 py-1 rounded-full bg-white/20 text-xs border border-white/30">
              {d.tag}
            </span>
            <span className="inline-flex items-center gap-1 text-xs opacity-90">
              <Clock size={12} />
              {d.duration}
            </span>
          </div>
        </div>
      </a>
    </div>
  );

  // Generic horizontal scroller (touch swipe, mouse drag, wheel/trackpad + arrows)
  const HorizontalScroller = ({ items, title }) => {
    const ref = useRef(null);
    const [showL, setShowL] = useState(false);
    const [showR, setShowR] = useState(false);

    const updateArrows = () => {
      const el = ref.current;
      if (!el) return;
      setShowL(el.scrollLeft > 0);
      setShowR(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    };

    useEffect(() => {
      updateArrows();
      const onResize = () => updateArrows();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, [items]);

    const scrollByAmount = (dir) => {
      const el = ref.current;
      if (!el) return;
      const cardWidth = el.querySelector("[data-card]")?.clientWidth || 320;
      el.scrollBy({ left: dir * (cardWidth + 16), behavior: "smooth" });
    };

    // Mouse drag-to-scroll for desktop
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      let isDown = false;
      let startX = 0;
      let startLeft = 0;

      const onDown = (e) => {
        isDown = true;
        startX = e.pageX || e.clientX;
        startLeft = el.scrollLeft;
        el.classList.add("dragging");
      };
      const onMove = (e) => {
        if (!isDown) return;
        const x = e.pageX || e.clientX;
        el.scrollLeft = startLeft - (x - startX);
      };
      const onUp = () => {
        isDown = false;
        el.classList.remove("dragging");
        updateArrows();
      };

      el.addEventListener("mousedown", onDown);
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      el.addEventListener("scroll", updateArrows);

      return () => {
        el.removeEventListener("mousedown", onDown);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        el.removeEventListener("scroll", updateArrows);
      };
    }, []);

    if (!items?.length) return null;

    return (
      <section className="mb-4">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            {title}
          </h2>
       
        </div>

        <div className="relative">
          <button
            aria-label="Scroll left"
            onClick={() => scrollByAmount(-1)}
            className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 hover:bg-white shadow transition p-2 sm:p-3 ${showL ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </button>

          <div
            ref={ref}
            className="flex overflow-x-auto gap-4 sm:gap-6 select-none pb-5 scroll-smooth snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {items.map((d) => (
              <div key={d.id} data-card>
                <Card d={d} />
              </div>
            ))}
          </div>

          <button
            aria-label="Scroll right"
            onClick={() => scrollByAmount(1)}
            className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 hover:bg-white shadow transition p-2 sm:p-3 ${showR ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </button>
        </div>
      </section>
    );
  };

  if (loading) {
    return (
      <div className=" flex items-center justify-center bg-[#eff5d2]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className=" flex items-center justify-center bg-[#eff5d2] text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className=" bg-[#eff5d2]  py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HorizontalScroller
          items={topDestinations}
          title="Top Destinations and Deals"
        />
        <HorizontalScroller
          items={stateDestinations}
          title="Explore States, Cities & Hidden Gems"
        />
      </div>

      {/* Vite-safe global styles (no styled-jsx) */}
      <style>{`
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .dragging { scroll-snap-type: none; }
      `}</style>
    </div>
  );
};

export default DestinationsCarts;
