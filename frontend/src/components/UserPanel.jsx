import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { getImageUrl } from '../api/axios';
import { ShoppingBag, Calendar, Users, MapPin, CheckCircle, Clock, XCircle, User, ArrowLeft, RefreshCw, Heart } from 'lucide-react';

const UserPanel = ({ onGoHome, onBrowsePackages, activeTab, setActiveTab, onSelectPackage, wishlist = [], onRemoveWishlist, onRefreshWishlist }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const [wishlistLoading, setWishlistLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('bookings/');
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to fetch user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    setWishlistLoading(true);
    try {
      if (onRefreshWishlist) {
        await onRefreshWishlist();
      }
    } catch (err) {
      console.error('Failed to fetch user wishlist:', err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (packageId) => {
    try {
      if (onRemoveWishlist) {
        await onRemoveWishlist({ id: packageId });
      }
    } catch (err) {
      alert('Failed to remove package from wishlist.');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (activeTab === 'wishlist') {
      fetchWishlist();
    }
  }, [activeTab]);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this trip booking?')) return;
    setCancellingId(id);
    try {
      await api.post(`bookings/${id}/cancel/`);
      fetchBookings();
    } catch (err) {
      alert('Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-extrabold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            CONFIRMED
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-extrabold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            PENDING
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-[11px] font-extrabold flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            CANCELLED
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-extrabold uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onGoHome}
            className="p-3 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            title="Return to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {user?.first_name || user?.username}!
              </h1>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              Manage your active tour bookings and travel profile details.
            </p>
          </div>
        </div>

        <button
          onClick={onBrowsePackages}
          className="btn-primary text-xs shrink-0"
        >
          <ShoppingBag className="w-4 h-4" />
          Explore & Book New Packages
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-6">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            My Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'wishlist'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            My Wishlist
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            My Profile
          </button>
        </div>

        {/* Tab 1: My Bookings */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Booked Tour Packages</h2>
              <button
                onClick={fetchBookings}
                className="text-xs text-slate-500 hover:text-sky-600 font-semibold flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                <p className="text-slate-500 text-sm font-medium">Loading your bookings...</p>
              </div>
            ) : bookings.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
                  >
                    {/* Left: Package details */}
                    <div className="flex items-start gap-4">
                      {booking.package_details?.image_url && (
                        <img
                          src={getImageUrl(booking.package_details.image_url)}
                          alt={booking.package_details.title}
                          className="w-24 h-24 rounded-2xl object-cover shrink-0 hidden sm:block"
                        />
                      )}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-sky-600 tracking-wider">
                            {booking.booking_code}
                          </span>
                          {getStatusBadge(booking.status)}
                        </div>

                        <h3 className="text-lg font-bold text-slate-900">
                          {booking.package_details?.title || 'Tour Package'}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-sky-500" />
                            Travel Date: {booking.travel_date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-amber-500" />
                            {booking.guests_count} Guests
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                            {booking.package_details?.location_summary}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Pricing & Actions */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 gap-3">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Total Paid / Due</span>
                        <span className="text-xl font-extrabold text-slate-900">
                          ₹{Number(booking.total_price).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs border border-rose-200 transition-colors"
                        >
                          {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-4">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">No active bookings found</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  You haven't booked any tour package yet. Browse our curated itineraries to start your journey!
                </p>
                <button onClick={onBrowsePackages} className="btn-primary text-xs">
                  Browse Packages
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">First Name</label>
                  <input
                    type="text"
                    readOnly
                    value={user?.first_name || ''}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Last Name</label>
                  <input
                    type="text"
                    readOnly
                    value={user?.last_name || ''}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Username</label>
                <input
                  type="text"
                  readOnly
                  value={user?.username || ''}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  readOnly
                  value={user?.email || ''}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Account Role</label>
                <span className="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-extrabold uppercase text-[10px]">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Saved Wishlist Packages</h2>
              <button
                onClick={fetchWishlist}
                className="text-xs text-slate-500 hover:text-sky-600 font-semibold flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>

            {wishlistLoading ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                <p className="text-slate-500 text-sm font-medium">Loading your wishlist...</p>
              </div>
            ) : wishlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative h-48 w-full bg-slate-100">
                        <img
                          src={getImageUrl(pkg.image_url)}
                          alt={pkg.title}
                          className="w-full h-full object-cover"
                        />
                        {pkg.badge_text && (
                          <div className="absolute top-4 left-4">
                            <span className="px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase rounded-sm shadow-sm bg-amber-500 text-slate-900">
                              {pkg.badge_text}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-5 space-y-2">
                        <div className="text-xs font-semibold text-sky-600">
                          {pkg.duration_nights} Nights / {pkg.duration_days} Days
                        </div>
                        <h3 className="text-base font-bold text-slate-950 line-clamp-1">
                          {pkg.title}
                        </h3>
                        <p className="text-xs text-slate-500 truncate">
                          {pkg.location_summary}
                        </p>
                        <div className="text-sm font-extrabold text-slate-950 pt-2">
                          ₹{Number(pkg.price_per_person).toLocaleString('en-IN')} <span className="text-[10px] text-slate-400 font-normal">/ person</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-5 pb-5 pt-2 flex gap-2 border-t border-slate-50 mt-auto">
                      <button
                        onClick={() => {
                          onSelectPackage(pkg);
                        }}
                        className="flex-1 py-2 text-center rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(pkg.id)}
                        className="px-3 py-2 text-center rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs border border-rose-100 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-4">
                <Heart className="w-12 h-12 text-slate-350 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">Your wishlist is empty</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  You haven't saved any tour packages yet. Start exploring and click the heart icon on packages to save them!
                </p>
                <button onClick={onBrowsePackages} className="btn-primary text-xs">
                  Browse Packages
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default UserPanel;
