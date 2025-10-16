import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

// INR formatter
const formatINR = (n) => {
  if (n === null || n === undefined) return null;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(n));
  } catch {
    return `₹${n}`;
  }
};

// percent discount from actual vs sale
const computeDiscount = (actual, sale) => {
  const A = Number(actual);
  const S = Number(sale);
  if (!isFinite(A) || !isFinite(S) || A <= 0) return null;
  const pct = ((A - S) / A) * 100;
  const rounded = Math.round(Math.max(0, Math.min(100, pct)));
  return rounded > 0 ? rounded : null;
};

const Recommendations = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const fetchPopularLocations = async () => {
    try {
      const r = await axiosInstance.get(
        "api/trip/getHomeRecommendedTrips?page=1&limit=5"
      );
      const raw = (r?.data?.data ?? []);
      // Normalize to UI shape; add id/key, discount
      const normalized = raw.map((x, idx) => {
        const actual = x.actualPrice ?? null;
        const sale = x.subTotal ?? actual ?? null;
        return {
          id: x.id ?? `${x.title}-${idx}`,
          title: x.title ?? "Untitled",
          state: x.state ?? x.location ?? "",
          image:
            x.image ||
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
          actualPrice: actual,
          subTotal: sale,
          discount: computeDiscount(actual, sale),
        };
      });
      return normalized;
    } catch (e) {
      console.error(e);
      setErr("Failed to load top destinations");
      return [];
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchPopularLocations();
        setItems(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const ListItem = ({ d }) => (
    <a
      href={`/destination?state=${encodeURIComponent(d.state)}`}  
      className="block bg-[#eef6d9] hover:bg-[#e6f0cc] transition-colors duration-200 rounded-2xl border border-[#dfeac3] px-3 sm:px-4 lg:px-5 py-3 sm:py-4"
    >
      <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
        {/* Thumbnail */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 border border-[#dfeac3] bg-white">
          <img
            src={d.image}
            alt={d.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80";
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title + Discount */}
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 leading-tight truncate">
              {d.title}
            </h3>
            {d.discount ? (
              <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#d4edda] text-[#155724] text-[9px] sm:text-[10px] lg:text-xs font-medium border border-[#c3e6cb] whitespace-nowrap shrink-0">
                {Math.round(d.discount)}% off
              </span>
            ) : null}
          </div>

          {/* Location + Price */}
          <div className="mt-1.5 sm:mt-2 flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#6a8f3a] flex-shrink-0" />
              <span className="text-[10px] sm:text-xs lg:text-sm text-gray-600 truncate font-medium">
                {d.state}
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {d.actualPrice &&
              d.subTotal &&
              Number(d.actualPrice) !== Number(d.subTotal) ? (
                <>
                  <span className="text-[9px] sm:text-[10px] lg:text-xs line-through text-gray-400 font-medium">
                    {formatINR(d.actualPrice)}
                  </span>
                  <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#d9ecb8] text-[#2c7a37] text-[10px] sm:text-xs lg:text-sm font-semibold border border-[#cde2a9]">
                    {formatINR(d.subTotal)}
                  </span>
                </>
              ) : (
                <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#d9ecb8] text-[#2c7a37] text-[10px] sm:text-xs lg:text-sm font-semibold border border-[#cde2a9]">
                  {formatINR(d.subTotal ?? d.actualPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </a>
  );

  if (loading) {
    return (
      <div className="px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 bg-[#eff5d2]">
        <div className="h-8 sm:h-10 w-24 sm:w-32 bg-[#e4efd0] rounded-md mb-3 sm:mb-4" />
        <div className="space-y-2 sm:space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-16 sm:h-18 lg:h-20 bg-[#e9f2d6] rounded-xl sm:rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 bg-[#eff5d2]">
        <div className="text-center py-8">
          <p className="text-red-600 text-sm sm:text-base">{err}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#eff5d2] py-3 sm:py-4 lg:py-6">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-5">
          <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-extrabold text-gray-900">
            Recommended
          </h2>
        </div>

        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          {items.length > 0 ? (
            items.map((d) => <ListItem key={d.id} d={d} />)
          ) : (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-sm sm:text-base">
                No recommendations available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
