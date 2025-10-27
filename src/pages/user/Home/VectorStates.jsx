import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";

const fallbackImg =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80";

function normalizeName(n) {
  if (!n) return "NA";
  if (n.toLowerCase() === "india") return "India";
  const words = n.split(/\s*&\s*|\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

const VectorStates = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const fetchStates = async () => {
    try {
      setLoading(true);
      setErr(null);
      const res = await axiosInstance.get("/api/state/getAllStates");
      const data = res?.data?.data || [];
      const normalized = data.map((x, idx) => ({
        id: x._id || idx,
        state: x.state || "Unknown",
        image: x.image?.url || fallbackImg,
      }));
      setStates(normalized);
    } catch (e) {
      console.error(e);
      setErr("Failed to load states");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  const ordered = useMemo(() => {
    if (!states.length) return [];
    const idx = states.findIndex(s => s.state?.toLowerCase() === "india");
    if (idx === -1) return states;
    const out = [...states];
    const [india] = out.splice(idx, 1);
    out.splice(1, 0, india);
    return out;
  }, [states]);

  useEffect(() => {
    if (ordered.length) {
      const idx = ordered.findIndex(s => s.state?.toLowerCase() === "india");
      setActiveIndex(idx === -1 ? 0 : idx);
    }
  }, [ordered]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex gap-4 overflow-x-hidden">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-24 h-24 rounded-2xl bg-[#eef2d6] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-xl">
          {err}
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-6 lg:py-8 bg-[#eef5d2]">
      <div className="">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-lime-900 text-center  mb-2 sm:mb-4 lg:mb-6">
          State's
        </h2>
      </div>
      <div className="max-w-6xl mx-auto px-2">
        {/* Horizontal scroller with snap and hidden scrollbar */}
        <div
          className="flex gap-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-px-4 no-scrollbar"
          role="list"
        >
          {ordered.map((s, i) => {
            const isActive = i === activeIndex;
            const code = normalizeName(s.state);
            return (
              <a
                key={s.id}
                type="button"
                href={`/destination?state=${s.state}`}
                className={`group flex-shrink-0 snap-center flex flex-col items-center justify-center gap-2 py-3 px-1 rounded-2xl transition ${
                  isActive ? "scale-105" : "opacity-70"
                }`}
                role="listitem"
                aria-pressed={isActive}
              >
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full grid place-items-center overflow-hidden border border-transparent"
               
                >
                  <img
                    src={s.image}
                    alt={s.state}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImg;
                    }}
                    className={`w-12 h-12 sm:w-14 sm:h-14 object-contain transition ${
                      isActive ? "text-lime-900" : "grayscale-[85%] opacity-60"
                    }`}
                    // style={{ mixBlendMode: "multiply" }}
                  />
                </div>

                <div
                  className={`text-sm sm:text-base font-extrabold tracking-wide transition ${
                    isActive ? "text-lime-900" : "text-gray-400"
                  }`}
                >
                  {isActive ? s.state : code}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VectorStates;
