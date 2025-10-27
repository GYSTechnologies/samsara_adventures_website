import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import axiosInstance from "../../../api/axiosInstance";

const Card = ({ d }) => (
  <div className="snap-start flex-shrink-0 w-[260px] sm:w-[300px] md:w-[320px]">
    <a
      href={`/destination?state=${d.location}`}
      className="relative block h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition"
    >
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
          <span className="inline-flex items-center gap-1 text-xs opacity-90">
            <Clock size={12} />
            {d.duration}
          </span>
        </div>
      </div>
    </a>
  </div>
);

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
    <section className="p-1 bg-[#eff5d2] max-w-6xl mx-auto px-4 ">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          {title}
        </h2>
      </div>

      <div className="relative">
        <button
          aria-label="Scroll left"
          onClick={() => scrollByAmount(-1)}
          className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 hover:bg-white shadow transition p-2 sm:p-3 ${
            showL ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
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
          className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 hover:bg-white shadow transition p-2 sm:p-3 ${
            showR ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        </button>
      </div>
    </section>
  );
};

export default function StateTripsCarousel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

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
      setErr("Failed to load state destinations");
      return [];
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const states = await fetchStateWiseDestinations();
        setItems(states);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="py-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
      </div>
    );
  }
  if (err) {
    return <div className="text-center text-red-600 py-6">{err}</div>;
  }

  return (
    <HorizontalScroller
      items={items}
      title="Explore States, Cities & Hidden Gems"
    />
  );
}
