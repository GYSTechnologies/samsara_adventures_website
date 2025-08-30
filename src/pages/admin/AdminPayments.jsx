import { useState, useEffect, useMemo } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  TrendingUp,
  BarChart3,
  Package,
  CreditCard,
  CheckCircle,
  XCircle,
  Download,
  Search,
  Filter,
  Eye,
  User,
  Calendar,
  IndianRupee,
  Receipt,
  XCircle as XCircleIcon,
  Loader2,
  Phone,
  Mail,
  X,
} from "lucide-react";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import Loader from "../../components/Loader";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    packageRevenue: 0,
    customRevenue: 0,
    successfulPayments: 0,
    failedPayments: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [refundData, setRefundData] = useState([]);
  const [failedPayments, setFailedPayments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [chartPeriod, setChartPeriod] = useState("monthly");

  const [error , setError] = useState();
  // In your AdminPayments component
  const [cancellationRequests, setCancellationRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  // Add this to your fetchAllData function
  const fetchCancellationRequests = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/admin/cancellation-requests"
      );
      setCancellationRequests(response.data.requests);
    } catch (error) {
      console.error("Error fetching cancellation requests:", error);
    }
  };

  // Fetch all data
  useEffect(() => {  
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [
          paymentsRes,
          statsRes,
          revenueRes,
          refundsRes,
          failedRes,
          cancellationRes,
        ] = await Promise.all([
          axiosInstance.get("/api/admin/getPayments"),
          axiosInstance.get("/api/admin/payment-stats"),
          axiosInstance.get(
            `/api/admin/revenue-analytics?period=${chartPeriod}`
          ),
          axiosInstance.get("/api/admin/refunds"),
          axiosInstance.get("/api/admin/failed-payments"),
          axiosInstance.get("/api/admin/cancellation-requests"),
        ]);

        setPayments(paymentsRes.data);
        setFilteredPayments(paymentsRes.data);
        setStats(statsRes.data);
        setRevenueData(revenueRes.data);
        setRefundData(refundsRes.data);
        setFailedPayments(failedRes.data);
        setCancellationRequests(cancellationRes.data.requests);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [chartPeriod]);

  // Filter payments
  useEffect(() => {
    let filtered = [...payments];

    if (activeTab === "failed") {
      filtered = failedPayments;
    } else if (activeTab === "refunds") {
      filtered = refundData;
    } else {
      if (filter !== "all") {
        filtered = filtered.filter((p) => p.tripType === filter);
      }

      if (search) {
        const searchTerm = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            (p.name && p.name.toLowerCase().includes(searchTerm)) ||
            (p.email && p.email.toLowerCase().includes(searchTerm)) ||
            (p.transactionId &&
              p.transactionId.toLowerCase().includes(searchTerm)) ||
            (p.tripId && p.tripId.toLowerCase().includes(searchTerm))
        );
      }
    }

    setFilteredPayments(filtered);
  }, [filter, search, payments, activeTab, failedPayments, refundData]);

  // Generate unique keys for payment rows
  const getPaymentKey = (payment, index) => {
    return `${payment.tripId || "no-trip"}-${
      payment.transactionId || "no-tx"
    }-${payment._id || index}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleApproveCancellation = async (request) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `/api/admin/cancellation-requests/${request._id}/approve`
      );

      setSuccess(response.data.message);

      // Refresh data
      await fetchAllData();
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to approve cancellation"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRejectCancellation = async (request) => {
    const rejectionReason = prompt("Please enter rejection reason:");
    if (!rejectionReason) return;

    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `/api/admin/cancellation-requests/${request._id}/reject`,
        { rejectionReason }
      );

      setSuccess(response.data.message);

      // Refresh data
      await fetchAllData();
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to reject cancellation"
      );
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Trip ID",
      "Trip Type",
      "Amount",
      "Transaction ID",
      "Payment Date",
      "Status",
    ];
    const csvData = filteredPayments.map((payment) => [
      payment.name || "",
      payment.email || "",
      payment.phone || "",
      payment.tripId || "",
      payment.tripType || "",
      payment.grandTotal || 0,
      payment.transactionId || "",
      payment.paymentDate
        ? new Date(payment.paymentDate).toLocaleDateString()
        : "",
      payment.status || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((field) => `"${field}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payments-export-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pie chart data
  const pieData = [
    { name: "Package Trips", value: stats.packageRevenue, color: "#3B82F6" },
    { name: "Custom Trips", value: stats.customRevenue, color: "#10B981" },
  ];

  // Prepare revenue chart data
  const chartData = useMemo(() => {
    if (!revenueData || !Array.isArray(revenueData)) return [];

    return revenueData.slice(-6).map((item) => ({
      name:
        chartPeriod === "daily"
          ? new Date(item._id).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            })
          : chartPeriod === "weekly"
          ? `Week ${item._id.split("-")[1]}`
          : item._id.split("-")[1],
      revenue: item.totalRevenue || 0,
    }));
  }, [revenueData, chartPeriod]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen lg:h-screen bg-gray-50 flex flex-col">
      {/* Enhanced Custom Scrollbar Styles */}
      <style>{`
        /* Main scrollbar styles */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(90deg, #f1f5f9, #e2e8f0);
          border-radius: 12px;
          box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.1);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8, #1e40af);
          border-radius: 12px;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4),
                      0 1px 2px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #2563eb, #1e40af, #1e3a8a);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5),
                      0 2px 4px rgba(0, 0, 0, 0.2);
          transform: scale(1.05);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: linear-gradient(135deg, #1d4ed8, #1e3a8a, #1e3a8a);
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: #f1f5f9;
        }

        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 #f1f5f9;
        }

        /* Page-level scrollbar */
        .page-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        
        .page-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(180deg, #f8fafc, #f1f5f9);
          border-radius: 0;
        }
        
        .page-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #6366f1, #4f46e5, #4338ca);
          border-radius: 5px;
          border: 2px solid #f8fafc;
          box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
        }
        
        .page-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #5b21b6, #7c3aed, #6d28d9);
          box-shadow: 0 3px 6px rgba(139, 92, 246, 0.4);
          border: 2px solid #fefefe;
        }

        /* Smooth scrolling */
        .page-scrollbar {
          scroll-behavior: smooth;
          scrollbar-width: thin;
          scrollbar-color: #6366f1 #f8fafc;
        }

        /* Hide scrollbar for mobile */
        @media (max-width: 1024px) {
          .page-scrollbar::-webkit-scrollbar {
            width: 0px;
            background: transparent;
          }
        }
      `}</style>

      {/* Main Container with 100vh height for laptop view */}
      <div className="flex-1 lg:h-full lg:overflow-hidden">
        <div className="h-full lg:overflow-y-auto page-scrollbar">
          <div className="p-2 sm:p-4 lg:p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Header */}
              <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
                <div className="flex flex-col space-y-3 sm:space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                  <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                      Payment Dashboard
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">
                      Monitor and manage all payment transactions
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={exportToCSV}
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-colors text-sm"
                    >
                      <Download size={16} />
                      <span className="hidden xs:inline">Export CSV</span>
                      <span className="xs:hidden">Export</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
                <StatCard
                  title="Total Revenue"
                  value={formatCurrency(stats.totalRevenue)}
                  icon={<TrendingUp className="w-4 h-4" />}
                  color="blue"
                />
                <StatCard
                  title="Transactions"
                  value={stats.totalTransactions?.toLocaleString()}
                  icon={<BarChart3 className="w-4 h-4" />}
                  color="green"
                />
                <StatCard
                  title="Package Revenue"
                  value={formatCurrency(stats.packageRevenue)}
                  icon={<Package className="w-4 h-4" />}
                  color="purple"
                />
                <StatCard
                  title="Custom Revenue"
                  value={formatCurrency(stats.customRevenue)}
                  icon={<CreditCard className="w-4 h-4" />}
                  color="orange"
                />
                <StatCard
                  title="Successful"
                  value={stats.successfulPayments?.toLocaleString()}
                  icon={<CheckCircle className="w-4 h-4" />}
                  color="green"
                />
                <StatCard
                  title="Failed"
                  value={stats.failedPayments?.toLocaleString()}
                  icon={<XCircle className="w-4 h-4" />}
                  color="red"
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {/* Revenue Trend Chart */}
                <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                          Revenue Trend
                        </h2>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          Performance by period
                        </p>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <select
                        value={chartPeriod}
                        onChange={(e) => setChartPeriod(e.target.value)}
                        className="w-full sm:w-auto pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm min-w-[100px]"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>

                  <div className="h-48 sm:h-56 lg:h-64">
                    {chartData && chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis
                            dataKey="name"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) =>
                              `₹${(value / 1000).toFixed(0)}K`
                            }
                          />
                          <Tooltip
                            formatter={(value) => [
                              `₹${value.toLocaleString()}`,
                              "Revenue",
                            ]}
                            contentStyle={{
                              borderRadius: "8px",
                              fontSize: "12px",
                            }}
                          />
                          <Bar
                            dataKey="revenue"
                            fill="#3B82F6"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            No revenue data available
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Revenue Distribution */}
                <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4">
                    <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
                      <RechartsPie className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                        Revenue Distribution
                      </h2>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        Package vs Custom trips
                      </p>
                    </div>
                  </div>

                  <div className="h-48 sm:h-56 lg:h-64">
                    {pieData.some((d) => d.value > 0) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={60}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => formatCurrency(value)}
                          />
                        </RechartsPie>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <RechartsPie className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            No data to display
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payments Table */}
              <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200 flex-1 lg:min-h-0">
                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-3 sm:gap-3 mb-2">
                  {[
                    {
                      key: "all",
                      label: "All Payments",
                      count: payments.length,
                    },
                    {
                      key: "failed",
                      label: "Failed",
                      count: failedPayments.length,
                    },
                    {
                      key: "refunds",
                      label: "Refunds",
                      count: refundData.length,
                    },
                    {
                      key: "cancellations",
                      label: "Cancellations",
                      count: cancellationRequests.length,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setActiveTab(tab.key);
                        setFilter("all");
                        setSearch("");
                      }}
                      className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                        activeTab === tab.key
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <span className="hidden xs:inline">{tab.label}</span>
                        <span className="xs:hidden">
                          {tab.key === "all"
                            ? "All"
                            : tab.key === "failed"
                            ? "Failed"
                            : tab.key === "refunds"
                            ? "Refunds"
                            : "Cancel"}
                        </span>
                        <span
                          className={`px-1 py-0.5 text-xs rounded-full ${
                            activeTab === tab.key
                              ? "bg-white/20 text-white"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {tab.count}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
                {/* Mobile Card View / Desktop Table View */}
                <div className="block lg:hidden">
                  {/* Mobile Card View */}
                  <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                    {activeTab === "cancellations" ? (
                      // Mobile view for cancellation requests
                      cancellationRequests.length > 0 ? (
                        cancellationRequests.map((request) => (
                          <MobileCancellationRequestCard
                            key={request._id}
                            request={request}
                            onApprove={() => handleApproveCancellation(request)}
                            onReject={() => handleRejectCancellation(request)}
                            formatCurrency={formatCurrency}
                          />
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <div className="space-y-2">
                            <div className="text-3xl">✅</div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              No cancellation requests
                            </h3>
                            <p className="text-gray-600 text-sm">
                              All cancellation requests have been processed
                            </p>
                          </div>
                        </div>
                      )
                    ) : Array.isArray(filteredPayments) &&
                      filteredPayments.length > 0 ? (
                      filteredPayments.map((payment, index) => (
                        <MobilePaymentCard
                          key={getPaymentKey(payment, index)}
                          payment={payment}
                          onView={() => setSelectedPayment(payment)}
                          formatCurrency={formatCurrency}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="space-y-2">
                          <div className="text-3xl">💳</div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            No payments found
                          </h3>
                          <p className="text-gray-600 text-sm px-4">
                            {search || filter !== "all"
                              ? "Try adjusting your search criteria or filters."
                              : "Payment data will appear here once transactions are processed."}
                          </p>
                          {(search || filter !== "all") && (
                            <button
                              onClick={() => {
                                setSearch("");
                                setFilter("all");
                              }}
                              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              Clear Filters
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block lg:flex-1 lg:min-h-0">
                  <div className="lg:h-full lg:overflow-auto custom-scrollbar">
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            Customer
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            Trip Details
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            Transaction
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      {/* Add the cancellation logic here */}
                      {activeTab === "cancellations" ? (
                        <tbody className="divide-y divide-gray-200">
                          {cancellationRequests.length > 0 ? (
                            cancellationRequests.map((request) => (
                              <CancellationRequestRow
                                key={request._id}
                                request={request}
                                onApprove={handleApproveCancellation}
                                onReject={handleRejectCancellation}
                                formatCurrency={formatCurrency}
                              />
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="6"
                                className="px-4 py-12 text-center"
                              >
                                <div className="space-y-3">
                                  <div className="text-4xl">✅</div>
                                  <h3 className="text-xl font-semibold text-gray-900">
                                    No cancellation requests
                                  </h3>
                                  <p className="text-gray-600 text-sm">
                                    All cancellation requests have been
                                    processed
                                  </p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      ) : (
                        // Your existing payment rows
                        <tbody className="divide-y divide-gray-200">
                          {Array.isArray(filteredPayments) &&
                          filteredPayments.length > 0 ? (
                            filteredPayments.map((payment, index) => (
                              <PaymentRow
                                key={getPaymentKey(payment, index)}
                                payment={payment}
                                onView={() => setSelectedPayment(payment)}
                                formatCurrency={formatCurrency}
                              />
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="6"
                                className="px-4 py-12 text-center"
                              >
                                <div className="space-y-3">
                                  <div className="text-4xl">💳</div>
                                  <h3 className="text-xl font-semibold text-gray-900">
                                    No payments found
                                  </h3>
                                  <p className="text-gray-600 text-sm px-4">
                                    {search || filter !== "all"
                                      ? "Try adjusting your search criteria or filters."
                                      : "Payment data will appear here once transactions are processed."}
                                  </p>
                                  {(search || filter !== "all") && (
                                    <button
                                      onClick={() => {
                                        setSearch("");
                                        setFilter("all");
                                      }}
                                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                    >
                                      Clear Filters
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide truncate">
            {title}
          </h3>
          <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 truncate">
            {value}
          </p>
        </div>
        <div className={`p-2 rounded-lg ${colorClasses[color]} flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Mobile Payment Card Component
// function MobilePaymentCard({ payment, onView, formatCurrency }) {
//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       completed: {
//         bg: "bg-green-100",
//         text: "text-green-800",
//         label: "Success",
//       },
//       failed: { bg: "bg-red-100", text: "text-red-800", label: "Failed" },
//       pending: {
//         bg: "bg-yellow-100",
//         text: "text-yellow-800",
//         label: "Pending",
//       },
//       refunded: { bg: "bg-blue-100", text: "text-blue-800", label: "Refunded" },
//     };

//     const config = statusConfig[status] || statusConfig.pending;

//     return (
//       <span
//         className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
//       >
//         {config.label}
//       </span>
//     );
//   };

//   return (
//     <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//       <div className="flex items-start justify-between mb-3">
//         <div className="flex items-center gap-2 min-w-0 flex-1">
//           <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
//             <User className="w-4 h-4 text-blue-600" />
//           </div>
//           <div className="min-w-0 flex-1">
//             <div className="font-medium text-gray-900 text-sm truncate">
//               {payment.name || "N/A"}
//             </div>
//             <div className="text-xs text-gray-500 truncate">
//               {payment.email || "N/A"}
//             </div>
//           </div>
//         </div>
//         <button
//           onClick={onView}
//           className="flex items-center gap-1 text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 px-2 py-1 rounded-md transition-colors text-xs font-medium flex-shrink-0"
//         >
//           <Eye className="w-3 h-3" />
//           View
//         </button>
//       </div>

//       <div className="space-y-2">
//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">Trip ID:</span>
//           <div className="flex items-center gap-2">
//             <span className="font-mono text-xs font-medium text-gray-900">
//               {payment.title || "N/A"}
//             </span>
//             <span
//               className={`px-1.5 py-0.5 rounded text-xs font-medium capitalize ${
//                 payment.tripType === "package"
//                   ? "bg-blue-100 text-blue-800"
//                   : "bg-purple-100 text-purple-800"
//               }`}
//             >
//               {payment.tripType || "N/A"}
//             </span>
//           </div>
//         </div>

//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">Amount:</span>
//           <div className="flex items-center gap-1 text-sm font-semibold text-green-700">
//             <IndianRupee className="w-3 h-3" />
//             <span>{payment.grandTotal?.toLocaleString() || "0"}</span>
//           </div>
//         </div>

//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">Transaction ID:</span>
//           <div className="font-mono text-xs bg-gray-200 px-2 py-1 rounded max-w-[120px] truncate">
//             {payment.transactionId || "N/A"}
//           </div>
//         </div>

//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">Date:</span>
//           <div className="flex items-center gap-1 text-xs text-gray-600">
//             <Calendar className="w-3 h-3" />
//             <span>
//               {payment.paymentDate
//                 ? new Date(payment.paymentDate).toLocaleDateString()
//                 : "-"}
//             </span>
//           </div>
//         </div>

//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-600">Status:</span>
//           {getStatusBadge(payment.status)}
//         </div>
//       </div>
//     </div>
//   );
// }
// Mobile Payment Card Component
function MobilePaymentCard({ payment, onView, formatCurrency }) {
  // prefer top-level fields, fall back to nested payment object
  const nested = payment.payment || {};
  const name = payment.name || payment.customerName || nested.name || "N/A";
  const email = payment.email || payment.customerEmail || nested.email || "N/A";
  const title = payment.title || payment.tripName || payment.tripId || nested.title || "";
  const tripType = (payment.tripType || nested.tripType || "").toLowerCase();
  const grandTotal = nested.grandTotal ?? payment.grandTotal ?? 0;
  const transactionId = nested.razorpay_payment_id || nested.transactionId || payment.transactionId || "";
  const paymentDate = nested.refundProcessedAt || nested.paymentDate || payment.paymentDate || nested.createdAt || null;

  const getStatusBadge = (status) => {
    const normalized = (status || "").toString().toLowerCase();
    const statusConfig = {
      completed: { bg: "bg-green-100", text: "text-green-800", label: "Success" },
      failed:    { bg: "bg-red-100",   text: "text-red-800",   label: "Failed" },
      pending:   { bg: "bg-yellow-100",text: "text-yellow-800",label: "Pending" },
      refunded:  { bg: "bg-blue-100",  text: "text-blue-800",   label: "Refunded" },
    };
    // Map refundStatus values like "PROCESSED" -> refunded
    const mapped =
      nested.refundStatus && nested.refundStatus.toString().toLowerCase() === "processed"
        ? "refunded"
        : normalized === "processed"
        ? "refunded"
        : normalized;

    const config = statusConfig[mapped] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 text-sm truncate">
              {name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {email}
            </div>
          </div>
        </div>
        <button
          onClick={onView}
          className="flex items-center gap-1 text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 px-2 py-1 rounded-md transition-colors text-xs font-medium flex-shrink-0"
        >
          <Eye className="w-3 h-3" />
          View
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Trip ID:</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-medium text-gray-900">
              {title || "N/A"}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-xs font-medium capitalize ${
                tripType === "package" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
              }`}
            >
              {tripType || "N/A"}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Amount:</span>
          <div className="flex items-center gap-1 text-sm font-semibold text-green-700">
            <IndianRupee className="w-3 h-3" />
            <span>{grandTotal?.toLocaleString() || "0"}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Transaction ID:</span>
          <div className="font-mono text-xs bg-gray-200 px-2 py-1 rounded max-w-[120px] truncate">
            {transactionId || "N/A"}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Date:</span>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>
              {paymentDate ? new Date(paymentDate).toLocaleDateString() : "-"}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Status:</span>
          {getStatusBadge(nested.refundStatus || payment.status || nested.status)}
        </div>
      </div>
    </div>
  );
}


// Payment Row Component (Desktop)
// function PaymentRow({ payment, onView, formatCurrency }) {
//   const getStatusBadge = (status) => {
//     // Normalize status to lowercase for consistent matching
//     const normalizedStatus = (status || "").toLowerCase();

//     const statusConfig = {
//       completed: {
//         bg: "bg-green-100",
//         text: "text-green-800",
//         label: "Success",
//       },
//       failed: { bg: "bg-red-100", text: "text-red-800", label: "Failed" },
//       pending: {
//         bg: "bg-yellow-100",
//         text: "text-yellow-800",
//         label: "Pending",
//       },
//       refunded: { bg: "bg-blue-100", text: "text-blue-800", label: "Refunded" },
//     };

//     // Use the normalized status, fallback to pending if not found
//     const config = statusConfig[normalizedStatus] || statusConfig.pending;

//     return (
//       <span
//         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
//       >
//         {config.label}
//       </span>
//     );
//   };

//   return (
//     <tr className="hover:bg-gray-50 transition-colors">
//       <td className="px-4 py-4">
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
//             <User className="w-4 h-4 text-blue-600" />
//           </div>
//           <div className="min-w-0 flex-1">
//             <div className="font-medium text-gray-900 truncate text-sm">
//               {payment.name || "N/A"}
//             </div>
//             <div className="text-sm text-gray-500 truncate">
//               {payment.email || "N/A"}
//             </div>
//           </div>
//         </div>
//       </td>

//       <td className="px-4 py-4">
//         <div className="space-y-1">
//           <div className="flex items-center gap-2">
//             <span className="font-mono text-sm font-medium text-gray-900">
//               {payment.title || "N/A"}
//             </span>
//             <span
//               className={`px-2 py-1 rounded text-xs font-medium capitalize ${
//                 (payment.tripType || "").toLowerCase() === "package"
//                   ? "bg-blue-100 text-blue-800"
//                   : "bg-purple-100 text-purple-800"
//               }`}
//             >
//               {payment.tripType || "N/A"}
//             </span>
//           </div>
//           {getStatusBadge(payment.status)}
//         </div>
//       </td>

//       <td className="px-4 py-4">
//         <div className="flex items-center gap-1 text-lg font-semibold text-green-700">
//           <IndianRupee className="w-4 h-4" />
//           <span>{payment.grandTotal?.toLocaleString() || "0"}</span>
//         </div>
//       </td>

//       <td className="px-4 py-4">
//         <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded max-w-[140px] truncate">
//           {payment.transactionId || "N/A"}
//         </div>
//       </td>

//       <td className="px-4 py-4">
//         <div className="flex items-center gap-2 text-sm text-gray-600">
//           <Calendar className="w-4 h-4" />
//           <span>
//             {payment.paymentDate
//               ? new Date(payment.paymentDate).toLocaleDateString()
//               : "-"}
//           </span>
//         </div>
//       </td>

//       <td className="px-4 py-4">
//         <button
//           onClick={onView}
//           className="flex items-center gap-2 text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 px-3 py-2 rounded-lg transition-colors font-medium text-sm"
//         >
//           <Eye className="w-4 h-4" />
//           <span>View</span>
//         </button>
//       </td>
//     </tr>
//   );
// }


// Payment Row Component (Desktop)
function PaymentRow({ payment, onView, formatCurrency }) {
  // unify top-level vs nested payment object
  const nested = payment.payment || {};
  const name = payment.name || payment.customerName || nested.name || "N/A";
  const email = payment.email || payment.customerEmail || nested.email || "N/A";
  const title = payment.title || payment.tripName || payment.tripId || nested.title || "";
  const tripType = (payment.tripType || nested.tripType || "").toLowerCase();
  const grandTotal = nested.grandTotal ?? payment.grandTotal ?? 0;
  const transactionId = nested.razorpay_payment_id || nested.transactionId || payment.transactionId || "";
  const paymentDate = nested.refundProcessedAt || nested.paymentDate || payment.paymentDate || nested.createdAt || null;

  const getStatusBadge = (status) => {
    const normalizedStatus = (status || "").toString().toLowerCase();
    const statusConfig = {
      completed: { bg: "bg-green-100", text: "text-green-800", label: "Success" },
      failed:    { bg: "bg-red-100",   text: "text-red-800",   label: "Failed" },
      pending:   { bg: "bg-yellow-100",text: "text-yellow-800",label: "Pending" },
      refunded:  { bg: "bg-green-100",  text: "text-gray",   label: "Refunded" },
    };

    const mapped =
      (nested.refundStatus && nested.refundStatus.toString().toLowerCase() === "processed")
        ? "refunded"
        : normalizedStatus === "processed"
        ? "refunded"
        : normalizedStatus;

    const config = statusConfig[mapped] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 truncate text-sm">
              {name}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {email}
            </div>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-medium text-gray-900">
              {title || "N/A"}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                tripType === "package" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
              }`}
            >
              {tripType || "N/A"}
            </span>
          </div>
          {getStatusBadge(nested.refundStatus || payment.status || nested.status)}
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-1 text-lg font-semibold text-green-700">
          <IndianRupee className="w-4 h-4" />
          <span>{grandTotal?.toLocaleString() || "0"}</span>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded max-w-[140px] truncate">
          {transactionId || "N/A"}
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>
            {paymentDate ? new Date(paymentDate).toLocaleDateString() : "-"}
          </span>
        </div>
      </td>

      <td className="px-4 py-4">
        <button
          onClick={onView}
          className="flex items-center gap-2 text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 px-3 py-2 rounded-lg transition-colors font-medium text-sm"
        >
          <Eye className="w-4 h-4" />
          <span>View</span>
        </button>
      </td>
    </tr>
  );
}



// Cancellation Request Row Component
function CancellationRequestRow({
  request,
  onApprove,
  onReject,
  formatCurrency,
}) {
  return (
    <tr className="hover:bg-yellow-50 transition-colors">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 truncate text-sm">
              {request.name || "N/A"}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {request.email || "N/A"}
            </div>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="space-y-1">
          <div className="font-mono text-sm font-medium text-gray-900">
            {request.tripId || "N/A"}
          </div>
          <div className="text-xs text-gray-600">{request.title || "N/A"}</div>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="text-sm text-gray-900">
          {request.cancellationReason || "No reason provided"}
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-1 text-lg font-semibold text-green-700">
          <IndianRupee className="w-4 h-4" />
          <span>
            {request.payment?.potentialRefundAmount?.toLocaleString() || "0"}
          </span>
        </div>
        <div className="text-xs text-gray-600">
          {request.payment?.potentialRefundPercentage || 0}% refund
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>
            {request.cancellationRequestDate
              ? new Date(request.cancellationRequestDate).toLocaleDateString()
              : "-"}
          </span>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onApprove(request)}
            className="flex items-center gap-2 text-green-600 hover:text-white bg-green-50 hover:bg-green-600 px-3 py-2 rounded-lg transition-colors font-medium text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Approve</span>
          </button>
          <button
            onClick={() => onReject(request)}
            className="flex items-center gap-2 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 px-3 py-2 rounded-lg transition-colors font-medium text-sm"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject</span>
          </button>
        </div>
      </td>
    </tr>
  );
}
const MobileCancellationRequestCard = ({ request, onApprove, onReject, formatCurrency }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">
              {request.customerName}
            </h3>
            <p className="text-xs text-gray-500">
              {request.customerEmail}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <p className="text-gray-500">Trip</p>
          <p className="font-medium text-gray-900">{request.tripName}</p>
        </div>
        <div>
          <p className="text-gray-500">Amount</p>
          <p className="font-medium text-gray-900">
            {formatCurrency(request.amount)}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Requested</p>
          <p className="font-medium text-gray-900">
            {new Date(request.requestDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Transaction ID</p>
          <p className="font-medium text-gray-900 truncate">
            {request.transactionId}
          </p>
        </div>
      </div>

      {request.reason && (
        <div className="mb-3">
          <p className="text-xs text-gray-500">Reason</p>
          <p className="text-sm text-gray-800">{request.reason}</p>
        </div>
      )}

      <div className="flex space-x-2">
        <button
          onClick={onApprove}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Approve
        </button>
        <button
          onClick={onReject}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
        >
          <XCircle className="h-4 w-4 mr-1" />
          Reject
        </button>
      </div>
    </div>
  );
};


function PaymentDetailsModal({ payment, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/admin/payment-details/${payment.tripId}`
        );
        setDetails(response.data);
      } catch (error) {
        console.error("Error fetching payment details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [payment.tripId]);

  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl w-full max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl min-h-screen sm:min-h-0 sm:max-h-[90vh] overflow-hidden shadow-xl my-2 sm:my-4">
        {/* Custom Scrollbar Styles */}
        <style>{`
          .modal-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 #f8fafc;
          }
          .modal-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .modal-scrollbar::-webkit-scrollbar-track {
            background: #f8fafc;
          }
          .modal-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }
          .modal-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
          @media (max-width: 640px) {
            .modal-scrollbar::-webkit-scrollbar {
              width: 2px;
            }
          }
        `}</style>

        {/* Header - Fixed and responsive */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-3 sm:p-4 lg:p-5 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Receipt className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-lg lg:text-2xl font-semibold leading-tight">
                  Payment Details
                </h3>
                <p className="text-blue-100 mt-0.5 sm:mt-1 text-xs sm:text-sm lg:text-base truncate">
                  Transaction #{payment.transactionId}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg sm:rounded-xl p-1.5 sm:p-2 transition-colors ml-2 flex-shrink-0"
            >
              <XCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-6 sm:p-8 lg:p-12 flex items-center justify-center min-h-[200px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <span className="text-sm sm:text-base lg:text-lg text-gray-600">
                Loading details...
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3 sm:p-4 lg:p-5 space-y-3 sm:space-y-4 lg:space-y-5 overflow-y-auto modal-scrollbar">
            {/* Customer Info */}
            <Section title="Customer Information">
              <DetailGrid>
                <DetailItem label="Name" value={details?.name} />
                <DetailItem label="Email" value={details?.email} />
                <DetailItem label="Phone" value={details?.phone || "N/A"} />
              </DetailGrid>
            </Section>

            {/* Trip Info */}
            <Section title="Trip Details">
              <DetailGrid>
                <DetailItem label="Trip ID" value={details?.tripId} />
                <DetailItem label="Trip Type" value={details?.tripType} />
                <DetailItem
                  label="Total Members"
                  value={details?.totalMembers}
                />
                <DetailItem label="Adults" value={details?.adults} />
                <DetailItem label="Children" value={details?.children} />
                <DetailItem
                  label="Pet Travel"
                  value={details?.travelWithPet ? "Yes" : "No"}
                />
              </DetailGrid>
            </Section>

            {/* Payment Info */}
            <Section title="Payment Information">
              <DetailGrid>
                <DetailItem
                  label="Amount"
                  value={`₹${details?.grandTotal?.toLocaleString("en-IN")}`}
                  highlight
                />
                <DetailItem
                  label="Transaction ID"
                  value={details?.transactionId || "N/A"}
                />
                <DetailItem
                  label="Razorpay ID"
                  value={details?.razorpayPaymentId || "N/A"}
                />
                <DetailItem
                  label="Payment Date"
                  value={
                    details?.paymentDate
                      ? new Date(details.paymentDate).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "-"
                  }
                />
                <DetailItem
                  label="Status"
                  value={details?.paymentStatus}
                  status={details?.paymentStatus}
                />
              </DetailGrid>
            </Section>

            {/* Additional Services */}
            <Section title="Additional Services">
              <DetailGrid>
                <DetailItem
                  label="Decoration"
                  value={details?.decoration ? "Yes" : "No"}
                  status={details?.decoration ? "active" : "inactive"}
                />
                <DetailItem
                  label="Photographer"
                  value={details?.photographer ? "Yes" : "No"}
                  status={details?.photographer ? "active" : "inactive"}
                />
                <DetailItem
                  label="Translator"
                  value={details?.translator || "No"}
                  status={details?.translator !== "No" ? "active" : "inactive"}
                />
              </DetailGrid>
            </Section>

            {/* Refund Info if applicable */}
            {details?.refundStatus &&
              details.refundStatus !== "NOT_APPLICABLE" && (
                <Section title="Refund Information">
                  <DetailGrid>
                    <DetailItem
                      label="Refund Status"
                      value={details?.refundStatus}
                      status={details?.refundStatus}
                    />
                    <DetailItem
                      label="Refund Amount"
                      value={`₹${details?.refundAmount?.toLocaleString(
                        "en-IN"
                      )}`}
                      highlight
                    />
                    <DetailItem
                      label="Refund Percentage"
                      value={`${details?.refundPercentage}%`}
                    />
                    <DetailItem
                      label="Refund ID"
                      value={details?.refundId || "N/A"}
                    />
                    <DetailItem
                      label="Processed At"
                      value={
                        details?.refundProcessedAt
                          ? new Date(
                              details.refundProcessedAt
                            ).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"
                      }
                    />
                  </DetailGrid>
                </Section>
              )}

            {/* Extra padding for mobile scroll */}
            <div className="h-4 sm:h-0 "></div>
          </div>
        )}
      </div>
    </div>
  );
}
// Helper Components

function Section({ title, children }) {
  return (
    <div className="bg-gray-50/70 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-gray-200/50">
      <h4 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900 mb-2 sm:mb-3 flex items-center">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
        {title}
      </h4>
      {children}
    </div>
  );
}

function DetailGrid({ children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-2.5 lg:gap-3">
      {children}
    </div>
  );
}

function DetailItem({ label, value, highlight, status }) {
  const getStatusColor = (status) => {
    if (!status) return "";

    const statusLower = status.toString().toLowerCase();

    if (
      statusLower.includes("success") ||
      statusLower.includes("completed") ||
      statusLower.includes("paid") ||
      status === "active"
    ) {
      return "text-green-700 bg-green-50 border-green-200";
    } else if (
      statusLower.includes("pending") ||
      statusLower.includes("processing")
    ) {
      return "text-yellow-700 bg-yellow-50 border-yellow-200";
    } else if (
      statusLower.includes("failed") ||
      statusLower.includes("cancelled")
    ) {
      return "text-red-700 bg-red-50 border-red-200";
    } else if (status === "inactive") {
      return "text-gray-600 bg-gray-50 border-gray-200";
    }

    return "";
  };

  return (
    <div
      className={`rounded-lg p-2.5 sm:p-3 lg:p-3.5 border transition-all duration-200 hover:shadow-sm ${
        highlight
          ? "bg-blue-50 border-blue-200 shadow-sm"
          : status
          ? getStatusColor(status) || "bg-white border-gray-200"
          : "bg-white border-gray-200"
      }`}
    >
      <span className="text-xs sm:text-sm font-medium text-gray-600 block mb-1 uppercase tracking-wide">
        {label}
      </span>
      <div
        className={`font-semibold text-sm sm:text-base break-all ${
          highlight ? "text-blue-900" : "text-gray-900"
        }`}
      >
        {value || "N/A"}
      </div>
    </div>
  );
}
