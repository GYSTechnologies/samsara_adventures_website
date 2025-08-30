import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  TrendingUp,
  Users,
  MapPin,
  DollarSign,
  Calendar,
  Eye,
  Star,
  Clock,
  IndianRupee,
} from "lucide-react";
import Loader from "../../components/Loader";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, t] = await Promise.all([
          axiosInstance.get("/api/admin/getDashboardTopStatics", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          axiosInstance.get("/api/admin/getDashBoardTrips", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
        ]);
        setStats(s.data);
        setTrips(t.data || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // dummy data for charts
  const userGrowth = [
    { month: "Jan", users: 120 },
    { month: "Feb", users: 200 },
    { month: "Mar", users: 320 },
    { month: "Apr", users: 500 },
    { month: "May", users: 650 },
    { month: "Jun", users: 820 },
    { month: "Jul", users: 1000 },
  ];

  const tripTrends = [
    { type: "Adventure", bookings: 150 },
    { type: "Romantic", bookings: 200 },
    { type: "Family", bookings: 180 },
    { type: "Solo", bookings: 120 },
    { type: "Cultural", bookings: 100 },
    { type: "Luxury", bookings: 90 },
  ];

  const formatINR = (n) =>
    typeof n === "number"
      ? n.toLocaleString("en-IN", { maximumFractionDigits: 0 })
      : n;

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b flex-shrink-0">
          <div className="p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Dashboard Overview
                </h1>
                <p className="text-gray-600 mt-1">
                  Welcome back! Here's what's happening with your trips.
                </p>
              </div>
              <div className="mt-4 lg:mt-0 flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date().toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 lg:p-6 space-y-8">
            {/* Top Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <StatCard
                title="Total Trips"
                value={stats?.totalTrips ?? 0}
                icon={<MapPin className="w-6 h-6" />}
                color="blue"

              />
              <StatCard
                title="Package Trips"
                value={stats?.ourPackagesCount ?? 0}
                icon={<Star className="w-6 h-6" />}
                color="green"
              />
              <StatCard
                title="Custom Trips"
                value={stats?.customizedTripsCount ?? 0}
                icon={<Users className="w-6 h-6" />}
                color="purple"
              />
              <StatCard
                title="Average Cost"
                value={`₹ ${formatINR(stats?.averageGrandTotal ?? 0)}`}
                icon={<IndianRupee className="w-6 h-6" />}
                color="orange"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* User Growth Chart */}
              <ChartCard
                title="User Growth Over Time"
                subtitle="Monthly user acquisition"
              >
                <div className="h-64 flex items-end justify-between px-2 py-4 gap-1">
                  {userGrowth.map((d, i) => {
                    const maxUsers = Math.max(
                      ...userGrowth.map((u) => u.users)
                    );
                    const heightPercentage = Math.max(
                      (d.users / maxUsers) * 100,
                      8
                    );

                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center h-full flex-1"
                      >
                        <div className="flex flex-col justify-end h-full w-full relative group">
                          <div
                            className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-700 hover:to-blue-500 mx-auto cursor-pointer shadow-sm hover:shadow-md"
                            style={{
                              height: `${heightPercentage}%`,
                              width: "100%",
                              maxWidth: "40px",
                            }}
                          />
                          {/* Tooltip */}
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {d.users} users
                          </div>
                        </div>
                        <span className="text-xs mt-2 font-medium text-gray-600">
                          {d.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </ChartCard>

              {/* Trip Trends Chart */}
              <ChartCard
                title="Trip Category Trends"
                subtitle="Bookings by trip type"
              >
                <div className="h-64 flex items-end justify-between px-2 py-4 gap-1">
                  {tripTrends.map((d, i) => {
                    const maxBookings = Math.max(
                      ...tripTrends.map((t) => t.bookings)
                    );
                    const heightPercentage = Math.max(
                      (d.bookings / maxBookings) * 100,
                      8
                    );
                    const colors = [
                      "from-purple-600 to-purple-400",
                      "from-pink-600 to-pink-400",
                      "from-indigo-600 to-indigo-400",
                      "from-cyan-600 to-cyan-400",
                      "from-teal-600 to-teal-400",
                      "from-emerald-600 to-emerald-400",
                    ];

                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center h-full flex-1"
                      >
                        <div className="flex flex-col justify-end h-full w-full relative group">
                          <div
                            className={`bg-gradient-to-t ${colors[i]} rounded-t-lg transition-all duration-500 hover:scale-105 mx-auto cursor-pointer shadow-sm hover:shadow-md`}
                            style={{
                              height: `${heightPercentage}%`,
                              width: "100%",
                              maxWidth: "35px",
                            }}
                          />
                          {/* Tooltip */}
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {d.bookings} bookings
                          </div>
                        </div>
                        <span className="text-xs mt-2 text-center font-medium text-gray-600 leading-tight">
                          {d.type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </ChartCard>
            </div>

            {/* Recent Trips Section */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                    Recent Trips
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Latest trips added to your platform
                  </p>
                </div>
                <div className="mt-3 sm:mt-0">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {trips.length} Total Trips
                  </span>
                </div>
              </div>

              {trips.length === 0 ? (
                <EmptyState message="No trips to display yet. Create your first trip to get started!" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                  {trips.map((t) => (
                    <TripCard key={t.tripId} trip={t} formatINR={formatINR} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db #f3f4f6;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
          border: 2px solid #f3f4f6;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: #f3f4f6;
        }
      `}</style>
    </>
  );
}

/* --------- Enhanced UI Components --------- */

function StatCard({ title, value, icon, color, trend }) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 shadow-blue-500/20",
    green: "from-green-500 to-green-600 shadow-green-500/20",
    purple: "from-purple-500 to-purple-600 shadow-purple-500/20",
    orange: "from-orange-500 to-orange-600 shadow-orange-500/20",
  };

  const bgColors = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    purple: "bg-purple-50",
    orange: "bg-orange-50",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="p-5 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-600 mb-1">
              {title}
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {value}
            </div>
            <div className="flex items-center text-xs text-green-600 font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              {trend} from last month
            </div>
          </div>
          <div
            className={`p-3 rounded-xl ${bgColors[color]} group-hover:scale-110 transition-transform duration-300`}
          >
            <div className="text-gray-700">{icon}</div>
          </div>
        </div>
      </div>
      <div className={`h-1 bg-gradient-to-r ${colorClasses[color]}`} />
    </div>
  );
}

function TripCard({ trip, formatINR }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={trip.image || "/placeholder.jpg"}
          alt={trip.title}
          className="h-40 lg:h-48 w-full object-cover bg-gray-100 group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3">
          <Badge variant={trip.tripType}>{trip.tripType}</Badge>
        </div>
      </div>

      <div className="p-4 lg:p-5 space-y-3">
        <div>
          <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {trip.title}
          </h3>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span className="font-medium">{trip.duration} days</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              <span className="font-medium">{trip.enrolledCount} enrolled</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="text-lg font-bold text-gray-900 flex items-center">
              <IndianRupee className="w-4 h-4 mr-1" />
              {formatINR(trip.grandTotal)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ children, variant = "default" }) {
  const variants = {
    PACKAGE: "bg-blue-100 text-blue-800",
    CUSTOMIZED: "bg-purple-100 text-purple-800",
    default: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
        variants[variant] || variants.default
      }`}
    >
      {children}
    </span>
  );
}

function EmptyState({ message }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div className="text-gray-400 text-6xl mb-4">🏖️</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Trips Yet</h3>
      <p className="text-gray-600 max-w-sm mx-auto">{message}</p>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 lg:p-8 hover:shadow-md transition-shadow duration-300">
      <div className="mb-6">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-1">
          {title}
        </h2>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
