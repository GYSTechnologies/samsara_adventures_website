import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, MapPin, Clock, Package, Shield, Filter, Search } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

const STATUSES = [
  'ALL',
  'PENDING',
  'APPROVED',
  'REJECTED',
  'PAID',
  'COMPLETED',
  'CANCELLED',
  'CANCELLATION_REQUESTED',
];

const TYPE_OPTIONS = ['ALL', 'PACKAGE', 'CUSTOMIZED'];

const CustomizedPlansPage = () => {
  // Data
  const [plans, setPlans] = useState([]); // unified array
  const [rawUpcoming, setRawUpcoming] = useState([]);
  const [rawCompleted, setRawCompleted] = useState([]);
  const [rawCancelled, setRawCancelled] = useState([]);

  // UI and query state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  // Tabs and filters
  const [activeStatus, setActiveStatus] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchTripHistory = async () => {
      try {
        if (typeof window !== 'undefined') {
          const userDataString = localStorage.getItem('user');
          if (!userDataString) {
            setError('No user data found. Please login.');
            setLoading(false);
            return;
          }

          const userData = JSON.parse(userDataString);
          const email = userData.email;
          setUserEmail(email);

          const response = await axiosInstance.get('/api/trip/getMyTripHistory', {
            params: { email },
            headers: { Authorization: `Bearer ${userData.token}` },
          });

          const upcoming = response.data.upcomingPlans || [];
          const completed = response.data.completedPlans || [];
          const cancelled = response.data.cancelledPlans || [];

          setRawUpcoming(upcoming);
          setRawCompleted(completed);
          setRawCancelled(cancelled);

          // Merge into one array for status-driven view
          const unified = [...upcoming, ...completed, ...cancelled].map(p => ({
            ...p,
            // Normalize fields if needed
            requestStatus: p.requestStatus || p.status || 'PENDING',
            tripType: p.tripType || 'CUSTOMIZED',
            startDate: p.startDate || p.dateStart || p.date,
            endDate: p.endDate || p.dateEnd || p.date,
            title: p.title || p.destination || 'Untitled Trip',
          }));
          setPlans(unified);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching trip history:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch trip history');
        setLoading(false);
      }
    };

    fetchTripHistory();
  }, []);

  // Colors
  const getStatusBadge = (status) => {
    const map = {
      PAID: 'bg-green-100 text-green-800 border-green-200',
      APPROVED: 'bg-blue-100 text-blue-800 border-blue-200',
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200',
      COMPLETED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      CANCELLED: 'bg-stone-100 text-stone-800 border-stone-300',
      CANCELLATION_REQUESTED: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return map[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTripTypeBadge = (type) =>
    type === 'PACKAGE'
      ? 'bg-purple-100 text-purple-800 border-purple-200'
      : 'bg-indigo-100 text-indigo-800 border-indigo-200';

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? 'Invalid date'
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const TripCard = ({ trip }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={trip.image}
          alt={trip.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTripTypeBadge(trip.tripType)}`}>
            {trip.tripType}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(trip.requestStatus)}`}>
            {trip.requestStatus}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-3 overflow-hidden">
          <span className="truncate block leading-tight" title={trip.title}>
            {trip.title || 'Untitled Trip'}
          </span>
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Shield className="w-4 h-4 mr-2 text-primaryColor flex-shrink-0" />
            <span className="text-sm font-medium truncate" title={trip.tripId}>
              {trip.tripId || 'ID not available'}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-primaryColor flex-shrink-0" />
            <span className="text-sm">Start: {formatDate(trip.startDate)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-primaryColor flex-shrink-0" />
            <span className="text-sm">End: {formatDate(trip.endDate)}</span>
          </div>
        </div>

        {trip.requestStatus === 'APPROVED' && (
          <a
            href={`/custom-itinerary-payment?trip=${trip.tripId}`}
            className="w-full block text-center bg-lime-950 hover:bg-lime-900 text-gray-100 font-semibold py-2.5 px-4 rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md"
          >
            Pay Now
          </a>
        )}
      </div>
    </div>
  );

  // Compute counts per status
  const statusCounts = useMemo(() => {
    const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
    counts.ALL = plans.length;
    plans.forEach((p) => {
      const s = (p.requestStatus || '').toUpperCase();
      if (counts[s] !== undefined) counts[s] += 1;
    });
    return counts;
  }, [plans]);

  // Filtering pipeline
  const filteredPlans = useMemo(() => {
    let list = [...plans];

    // Status filter
    if (activeStatus !== 'ALL') {
      list = list.filter(
        (p) => (p.requestStatus || '').toUpperCase() === activeStatus
      );
    }

    // Type filter
    if (typeFilter !== 'ALL') {
      list = list.filter((p) => (p.tripType || '').toUpperCase() === typeFilter);
    }

    // Date range filter
    const from = fromDate ? new Date(fromDate).getTime() : null;
    const to = toDate ? new Date(toDate).getTime() : null;
    if (from || to) {
      list = list.filter((p) => {
        const t = new Date(p.startDate || p.date).getTime();
        if (isNaN(t)) return false;
        if (from && t < from) return false;
        if (to && t > to) return false;
        return true;
      });
    }

    // Search filter
    const q = searchText.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const t = (p.title || '').toLowerCase();
        const id = (p.tripId || '').toLowerCase();
        return t.includes(q) || id.includes(q);
      });
    }

    return list;
  }, [plans, activeStatus, typeFilter, fromDate, toDate, searchText]);

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="bg-white rounded-lg shadow-md p-6 animate-pulse border border-gray-200">
          <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
        </div>
      ))}
    </div>
  );

  const StatusTab = ({ status }) => {
    const active = activeStatus === status;
    const label = status === 'ALL' ? 'All' : status.replace(/_/g, ' ');
    return (
      <button
        onClick={() => setActiveStatus(status)}
        className={[
          'px-4 py-2 rounded-full text-sm font-semibold transition-colors',
          active ? 'bg-lime-700 text-white' : 'bg-white text-lime-800 border border-lime-200',
        ].join(' ')}
      >
        {label} {statusCounts[status] ? `(${statusCounts[status]})` : ''}
      </button>
    );
  };

  return (
    <div className="min-h-screen mb-10 md:mb-5 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Customized Trip Plans</h1>

        </div>

        {/* Status Tabs */}
        {!loading && !error && (
          <div className="flex flex-wrap gap-3 mb-6">
            {STATUSES.map((s) => (
              <StatusTab key={s} status={s} />
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingSkeleton />}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-semibold mb-2">Error</p>
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPlans.length === 0 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No trips found</h3>
            <p className="text-gray-500">
              Try changing filters or check back later.
            </p>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && filteredPlans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((trip) => (
              <TripCard key={trip._id || trip.tripId} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomizedPlansPage;
