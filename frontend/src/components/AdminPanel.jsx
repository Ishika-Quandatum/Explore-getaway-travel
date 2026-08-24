import React, { useState, useEffect } from 'react';
import api, { getImageUrl } from '../api/axios';
import { ShieldCheck, Package, ShoppingBag, Tag, Layers, DollarSign, Plus, Trash2, Edit, CheckCircle, Clock, XCircle, ArrowLeft, RefreshCw, BookOpen, X, ToggleLeft, ToggleRight, ChevronDown, Calendar, ArrowRight, Activity, CreditCard, AlignLeft, Percent } from 'lucide-react';

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
};

const AdminPanel = ({ onGoHome, onRefreshData }) => {
  const [stats, setStats] = useState(null);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [blogs, setBlogs] = useState([]);

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // New Package Modal Form State
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgSlug, setPkgSlug] = useState('');
  const [pkgDest, setPkgDest] = useState('');
  const [pkgCat, setPkgCat] = useState('');
  const [pkgNights, setPkgNights] = useState('');
  const [pkgDays, setPkgDays] = useState('');
  const [pkgLocation, setPkgLocation] = useState('');
  const [pkgPrice, setPkgPrice] = useState('');
  const [pkgOldPrice, setPkgOldPrice] = useState('');
  const [pkgDoubleSharing, setPkgDoubleSharing] = useState('');
  const [pkgTripleSharing, setPkgTripleSharing] = useState('');
  const [pkgBadge, setPkgBadge] = useState('BEST SELLER');
  const [pkgRating, setPkgRating] = useState('');
  const [pkgImg, setPkgImg] = useState('');
  const [pkgFileName, setPkgFileName] = useState('');
  const [galleryFileNames, setGalleryFileNames] = useState('');
  const [cpnFileName, setCpnFileName] = useState('');
  const [catFileName, setCatFileName] = useState('');
  const [destFileName, setDestFileName] = useState('');
  const [blogFileName, setBlogFileName] = useState('');
  const [pkgOverview, setPkgOverview] = useState('');
  const [pkgCancellation, setPkgCancellation] = useState('');
  const [pkgDepartures, setPkgDepartures] = useState('');
  const [pkgInclusions, setPkgInclusions] = useState('');
  const [pkgExclusions, setPkgExclusions] = useState('');
  const [pkgItinerary, setPkgItinerary] = useState([{ day_number: 1, title: '', description: '' }]);
  const [pkgGallery, setPkgGallery] = useState([]);

  // Coupon Modal Form State
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState(null);
  const [cpnHeading, setCpnHeading] = useState('');
  const [cpnDesc, setCpnDesc] = useState('');
  const [cpnCode, setCpnCode] = useState('');
  const [cpnImg, setCpnImg] = useState('');
  const [cpnActive, setCpnActive] = useState(true);

  // Category Modal Form State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catImg, setCatImg] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catDisplayLabel, setCatDisplayLabel] = useState('for_everyone');

  // Destination Modal Form State
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [editingDestinationId, setEditingDestinationId] = useState(null);
  const [destName, setDestName] = useState('');
  const [destSlug, setDestSlug] = useState('');
  const [destSubtitle, setDestSubtitle] = useState('');
  const [destImg, setDestImg] = useState('');
  const [destDesc, setDestDesc] = useState('');
  const [destIsPopular, setDestIsPopular] = useState(true);

  // Blog Modal Form State
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogImg, setBlogImg] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('Admin');

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e, setUrlCallback) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const response = await api.post('admin/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUrlCallback(response.data.image_url);
    } catch (err) {
      console.error('Image upload failed:', err);
      alert(err.response?.data?.error || 'Failed to upload image. Please check type/size.');
    } finally {
      setUploading(false);
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, pkgsRes, bookingsRes, destsRes, catsRes, couponsRes, blogsRes] = await Promise.all([
        api.get('admin/stats/'),
        api.get('packages/'),
        api.get('bookings/'),
        api.get('destinations/'),
        api.get('categories/'),
        api.get('coupons/'),
        api.get('blogs/'),
      ]);

      setStats(statsRes.data);
      setPackages(pkgsRes.data);
      setBookings(bookingsRes.data);
      setDestinations(destsRes.data);
      setCategories(catsRes.data);
      setCoupons(couponsRes.data);
      setBlogs(blogsRes.data);

      if (destsRes.data.length > 0) setPkgDest(destsRes.data[0].id);
      if (catsRes.data.length > 0) setPkgCat(catsRes.data[0].id);

      if (onRefreshData) {
        onRefreshData();
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await api.patch(`bookings/${bookingId}/`, { status: newStatus });
      fetchAdminData();
    } catch (err) {
      alert('Failed to update booking status.');
    }
  };

  const handleSavePackage = async (e) => {
    e.preventDefault();
    
    // Ensure day numbers are sequential and valid
    const formattedItinerary = pkgItinerary.map((day, i) => ({
      ...day,
      day_number: i + 1
    }));

    const payload = {
      title: pkgTitle,
      slug: pkgSlug || pkgTitle.toLowerCase().replace(/\s+/g, '-'),
      destination: pkgDest ? Number(pkgDest) : null,
      category: pkgCat ? Number(pkgCat) : null,
      duration_nights: Number(pkgNights),
      duration_days: Number(pkgDays),
      location_summary: pkgLocation,
      price_per_person: Number(pkgPrice),
      old_price: pkgOldPrice !== '' && pkgOldPrice !== null ? Number(pkgOldPrice) : null,
      double_sharing: pkgDoubleSharing !== '' && pkgDoubleSharing !== null ? Number(pkgDoubleSharing) : null,
      triple_sharing: pkgTripleSharing !== '' && pkgTripleSharing !== null ? Number(pkgTripleSharing) : null,
      badge_text: pkgBadge,
      image_url: pkgImg,
      tour_overview: pkgOverview,
      cancellation_policy: pkgCancellation,
      upcoming_departures: typeof pkgDepartures === 'string' ? pkgDepartures.split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(pkgDepartures) ? pkgDepartures : []),
      gallery: pkgGallery.map(item => ({ url: item.url, description: item.description || '' })),
      day_wise_itinerary: formattedItinerary,
      rating: pkgRating !== '' && pkgRating !== null ? Number(pkgRating) : 4.5,
      reviews_count: 50,
      highlights: ['Curated sightseeing', 'Comfortable stays', 'Dedicated driver'],
      inclusions: typeof pkgInclusions === 'string' ? pkgInclusions.split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(pkgInclusions) ? pkgInclusions : ['Hotels', 'Breakfast', 'Transfers']),
      exclusions: typeof pkgExclusions === 'string' ? pkgExclusions.split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(pkgExclusions) ? pkgExclusions : ['Personal expenses']),
    };

    try {
      if (editingPackageId) {
        await api.put(`packages/${editingPackageId}/`, payload);
      } else {
        await api.post('packages/', payload);
      }
      setShowPackageModal(false);
      resetPackageForm();
      await fetchAdminData();
      if (onRefreshData) {
        onRefreshData();
      }
    } catch (err) {
      console.error('Failed to save package:', err);
      alert('Failed to save package. Ensure all fields are valid.');
    }
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Delete this tour package permanently?')) return;
    try {
      await api.delete(`packages/${id}/`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to delete package.');
    }
  };

  const resetPackageForm = () => {
    setEditingPackageId(null);
    setPkgTitle('');
    setPkgSlug('');
    setPkgDest(destinations.length > 0 ? destinations[0].id : '');
    setPkgCat(categories.length > 0 ? categories[0].id : '');
    setPkgNights('');
    setPkgDays('');
    setPkgLocation('');
    setPkgPrice('');
    setPkgOldPrice('');
    setPkgDoubleSharing('');
    setPkgTripleSharing('');
    setPkgBadge('POPULAR');
    setPkgRating('');
    setPkgFileName('');
    setGalleryFileNames('');
    setPkgOverview('');
    setPkgCancellation('');
    setPkgDepartures('');
    setPkgInclusions('');
    setPkgExclusions('');
    setPkgGallery([]);
    setPkgItinerary([{ day_number: 1, title: '', description: '' }]);
  };

  const openEditPackage = (pkg) => {
    setEditingPackageId(pkg.id);
    setPkgTitle(pkg.title || '');
    setPkgSlug(pkg.slug || '');

    const destVal = typeof pkg.destination === 'object'
      ? pkg.destination?.id
      : (pkg.destination || pkg.destination_details?.id || (destinations.length > 0 ? destinations[0].id : ''));
    setPkgDest(destVal);

    const catVal = typeof pkg.category === 'object'
      ? pkg.category?.id
      : (pkg.category || pkg.category_details?.id || (categories.length > 0 ? categories[0].id : ''));
    setPkgCat(catVal);

    setPkgNights(pkg.duration_nights || 1);
    setPkgDays(pkg.duration_days || 2);
    setPkgLocation(pkg.location_summary || '');
    setPkgPrice(pkg.price_per_person || '');
    setPkgOldPrice(pkg.old_price !== undefined && pkg.old_price !== null ? pkg.old_price : '');
    setPkgDoubleSharing(pkg.double_sharing !== undefined && pkg.double_sharing !== null ? pkg.double_sharing : '');
    setPkgTripleSharing(pkg.triple_sharing !== undefined && pkg.triple_sharing !== null ? pkg.triple_sharing : '');
    setPkgBadge(pkg.badge_text || 'POPULAR');
    setPkgRating(pkg.rating !== undefined && pkg.rating !== null ? pkg.rating : '');
    setPkgImg(pkg.image_url || '');
    setPkgOverview(pkg.tour_overview || '');
    setPkgCancellation(pkg.cancellation_policy || '');
    setPkgDepartures(Array.isArray(pkg.upcoming_departures) ? pkg.upcoming_departures.join(', ') : (pkg.upcoming_departures || ''));
    setPkgInclusions(Array.isArray(pkg.inclusions) ? pkg.inclusions.join(', ') : (pkg.inclusions || ''));
    setPkgExclusions(Array.isArray(pkg.exclusions) ? pkg.exclusions.join(', ') : (pkg.exclusions || ''));
    setPkgGallery((pkg.gallery || []).map(item => typeof item === 'string' ? { url: item, description: '' } : { url: item.url, description: item.description || '' }));
    setPkgItinerary(Array.isArray(pkg.day_wise_itinerary) && pkg.day_wise_itinerary.length > 0 ? pkg.day_wise_itinerary : [{ day_number: 1, title: '', description: '' }]);
    setShowPackageModal(true);
  };

  const handleAddItineraryDay = () => {
    setPkgItinerary(prev => [
      ...prev,
      { day_number: prev.length + 1, title: '', description: '' }
    ]);
  };

  const handleRemoveItineraryDay = (index) => {
    setPkgItinerary(prev =>
      prev
        .filter((_, idx) => idx !== index)
        .map((day, idx) => ({ ...day, day_number: idx + 1 }))
    );
  };

  const handleItineraryChange = (index, field, value) => {
    setPkgItinerary(prev =>
      prev.map((day, idx) => (idx === index ? { ...day, [field]: value } : day))
    );
  };

  const handleMultipleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('image', files[i]);
      try {
        const response = await api.post('admin/upload/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setPkgGallery(prev => [...prev, { url: response.data.image_url, description: '' }]);
      } catch (err) {
        console.error('Gallery image upload failed:', err);
      }
    }
    // Reset the file input so the same files can be re-selected
    e.target.value = null;
  };

  const handleGalleryDescriptionChange = (index, value) => {
    setPkgGallery(prev =>
      prev.map((item, idx) => (idx === index ? { ...item, description: value } : item))
    );
  };

  // ---- COUPON CRUD ----
  const resetCouponForm = () => {
    setEditingCouponId(null);
    setCpnHeading('');
    setCpnDesc('');
    setCpnCode('');
    setCpnImg('');
    setCpnActive(true);
    setCpnFileName('');
  };

  const openEditCoupon = (c) => {
    setEditingCouponId(c.id);
    setCpnHeading(c.heading);
    setCpnDesc(c.description || '');
    setCpnCode(c.offer_code);
    setCpnImg(c.image_url || '');
    setCpnActive(c.is_active);
    setShowCouponModal(true);
  };

  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    const payload = {
      heading: cpnHeading,
      description: cpnDesc,
      offer_code: cpnCode,
      image_url: cpnImg,
      is_active: cpnActive,
    };
    try {
      if (editingCouponId) {
        await api.put(`coupons/${editingCouponId}/`, payload);
      } else {
        await api.post('coupons/', payload);
      }
      setShowCouponModal(false);
      resetCouponForm();
      fetchAdminData();
    } catch (err) {
      console.error('Failed to save coupon:', err);
      alert('Failed to save coupon. Ensure all fields are valid.');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon permanently?')) return;
    try {
      await api.delete(`coupons/${id}/`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to delete coupon.');
    }
  };

  // ---- CATEGORY CRUD ----
  const resetCategoryForm = () => {
    setEditingCategoryId(null);
    setCatName('');
    setCatSlug('');
    setCatImg('');
    setCatDesc('');
    setCatDisplayLabel('for_everyone');
    setCatFileName('');
  };

  const openEditCategory = (c) => {
    setEditingCategoryId(c.id);
    setCatName(c.name);
    setCatSlug(c.slug);
    setCatImg(c.image_url || '');
    setCatDesc(c.description || '');
    setCatDisplayLabel(c.display_label || 'for_everyone');
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    const payload = {
      name: catName,
      slug: slugify(catName),
      image_url: catImg,
      description: catDesc,
      display_label: catDisplayLabel,
    };
    try {
      if (editingCategoryId) {
        await api.put(`categories/${editingCategoryId}/`, payload);
      } else {
        await api.post('categories/', payload);
      }
      setShowCategoryModal(false);
      resetCategoryForm();
      fetchAdminData();
    } catch (err) {
      console.error('Failed to save category:', err);
      alert('Failed to save category. Ensure all fields are valid.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category permanently?')) return;
    try {
      await api.delete(`categories/${id}/`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to delete category.');
    }
  };

  // ---- DESTINATION CRUD ----
  const resetDestinationForm = () => {
    setEditingDestinationId(null);
    setDestName('');
    setDestSlug('');
    setDestSubtitle('');
    setDestImg('');
    setDestDesc('');
    setDestIsPopular(true);
    setDestFileName('');
  };

  const openEditDestination = (d) => {
    setEditingDestinationId(d.id);
    setDestName(d.name);
    setDestSlug(d.slug);
    setDestSubtitle(d.subtitle || '');
    setDestImg(d.image_url || '');
    setDestDesc(d.description || '');
    setDestIsPopular(d.is_popular);
    setShowDestinationModal(true);
  };

  const handleSaveDestination = async (e) => {
    e.preventDefault();
    const payload = {
      name: destName,
      slug: slugify(destName),
      subtitle: destSubtitle,
      image_url: destImg,
      description: destDesc,
      is_popular: destIsPopular,
    };
    try {
      if (editingDestinationId) {
        await api.put(`destinations/${editingDestinationId}/`, payload);
      } else {
        await api.post('destinations/', payload);
      }
      setShowDestinationModal(false);
      resetDestinationForm();
      fetchAdminData();
    } catch (err) {
      console.error('Failed to save destination:', err);
      alert('Failed to save destination. Ensure all fields are valid.');
    }
  };

  const handleDeleteDestination = async (id) => {
    if (!window.confirm('Delete this destination permanently?')) return;
    try {
      await api.delete(`destinations/${id}/`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to delete destination.');
    }
  };

  // ---- BLOG CRUD ----
  const resetBlogForm = () => {
    setEditingBlogId(null);
    setBlogTitle('');
    setBlogSlug('');
    setBlogSummary('');
    setBlogContent('');
    setBlogImg('');
    setBlogAuthor('Admin');
    setBlogFileName('');
  };

  const openEditBlog = (b) => {
    setEditingBlogId(b.id);
    setBlogTitle(b.title);
    setBlogSlug(b.slug);
    setBlogSummary(b.summary || '');
    setBlogContent(b.content || '');
    setBlogImg(b.image_url || '');
    setBlogAuthor(b.author || 'Admin');
    setShowBlogModal(true);
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    const payload = {
      title: blogTitle,
      slug: slugify(blogTitle),
      summary: blogSummary,
      content: blogContent,
      image_url: blogImg,
      author: blogAuthor,
    };
    try {
      if (editingBlogId) {
        await api.put(`blogs/${editingBlogId}/`, payload);
      } else {
        await api.post('blogs/', payload);
      }
      setShowBlogModal(false);
      resetBlogForm();
      fetchAdminData();
    } catch (err) {
      console.error('Failed to save blog:', err);
      alert('Failed to save blog. Ensure all fields are valid.');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Delete this blog post permanently?')) return;
    try {
      await api.delete(`blogs/${id}/`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to delete blog.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5FB] text-slate-800 py-8 px-4 sm:px-6 lg:px-10 max-w-[1600px] mx-auto space-y-10 animate-fade-in font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <button
            onClick={onGoHome}
            className="mt-1 p-2.5 rounded-full bg-white text-slate-400 hover:text-slate-700 shadow-sm transition-colors"
            title="Return to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Welcome back, Admin. Manage your travel booking platform here.
            </p>
          </div>
        </div>
        <div className="flex items-center bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm gap-2 text-sm text-slate-600 cursor-pointer hover:bg-slate-50">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span className="font-medium text-slate-500">Filter:</span>
          <span className="font-medium text-slate-800">All Time</span>
          <ChevronDown className="w-4 h-4 ml-2" />
        </div>
      </div>

      {/* Overview Stat Widgets */}
      {activeTab === 'overview' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-6 rounded-2xl bg-white shadow-sm flex items-center justify-between">
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{stats.total_packages}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Total Packages</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white shadow-sm flex items-center justify-between">
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{stats.total_bookings}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Total Bookings</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white shadow-sm flex items-center justify-between">
            <div>
              <div className="text-2xl font-extrabold text-slate-900">₹{Number(stats.total_revenue).toLocaleString('en-IN')}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Total Revenue</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white shadow-sm flex items-center justify-between">
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{stats.confirmed_bookings}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Transactions</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

        </div>
      )}

      {/* Quick Actions Grid */}
      {activeTab === 'overview' && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            <button onClick={() => setActiveTab('categories')} className="group flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center group-hover:bg-teal-700 transition-colors">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Categories</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage site categories</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-bold">{categories.length}</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            </button>

            <button onClick={() => setActiveTab('packages')} className="group flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500 text-white flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Tour Packages</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Create & manage packages</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-bold">{packages.length}</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            </button>

            <button onClick={() => setActiveTab('destinations')} className="group flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:bg-emerald-700 transition-colors">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Destinations</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage travel locations</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-bold">{destinations.length}</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            </button>

            <button onClick={() => setActiveTab('bookings')} className="group flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Bookings</h3>
                  <p className="text-xs text-slate-400 mt-0.5">View & manage all bookings</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-bold">{bookings.length}</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            </button>

            <button onClick={() => setActiveTab('coupons')} className="group flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-500 text-white flex items-center justify-center group-hover:bg-pink-600 transition-colors">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Discounts & Offers</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage promotional coupons</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-bold">{coupons.length}</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            </button>

            <button onClick={() => setActiveTab('blogs')} className="group flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <AlignLeft className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Travel Blogs</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage blog articles</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-bold">{blogs.length}</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            </button>
            
          </div>
        </div>
      )}

      {/* Back to Dashboard Button */}
      {activeTab !== 'overview' && (
        <button
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      )}

      {/* TAB 1: MANAGE PACKAGES */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Tour Packages Directory</h2>
            <button
              onClick={() => { resetPackageForm(); setShowPackageModal(true); }}
              className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add New Package
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Package</th>
                    <th className="p-4">Destination</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Price / Person</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                        <img src={getImageUrl(pkg.image_url)} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                        <div>
                          <div className="text-sm">{pkg.title}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{pkg.location_summary}</div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-slate-700">
                        {pkg.destination_details?.name || (typeof pkg.destination === 'object' ? pkg.destination?.name : '') || (destinations.find(d => String(d.id) === String(pkg.destination))?.name) || 'N/A'}
                      </td>
                      <td className="p-4 font-medium">
                        <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-100 text-[10px] font-semibold">
                          {pkg.category_details?.name || (typeof pkg.category === 'object' ? pkg.category?.name : '') || (categories.find(c => String(c.id) === String(pkg.category))?.name) || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-700">{pkg.duration_nights}N / {pkg.duration_days}D</td>
                      <td className="p-4 font-bold text-amber-600">₹{Number(pkg.price_per_person).toLocaleString('en-IN')}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openEditPackage(pkg)}
                          className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-100 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-800">Customer Bookings Overview</h2>
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Code</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Package</th>
                    <th className="p-4">Travel Date</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-extrabold text-amber-600">{booking.booking_code}</td>
                      <td className="p-4 font-bold text-slate-900">
                        <div>{booking.customer_name}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{booking.customer_phone} • {booking.customer_email}</div>
                      </td>
                      <td className="p-4 font-medium text-slate-700">{booking.package_details?.title}</td>
                      <td className="p-4 text-slate-700">{booking.travel_date} ({booking.guests_count} Guests)</td>
                      <td className="p-4 font-bold text-emerald-600">₹{Number(booking.total_price).toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <select
                          value={booking.status}
                          onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                          className="px-3 py-1 rounded-xl bg-white text-slate-800 font-bold text-xs border border-slate-300 focus:outline-none cursor-pointer focus:border-amber-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE COUPONS */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Coupons Directory</h2>
            <button
              onClick={() => { resetCouponForm(); setShowCouponModal(true); }}
              className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add New Coupon
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Heading</th>
                    <th className="p-4">Offer Code</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {coupons.length === 0 ? (
                    <tr><td colSpan="6" className="p-8 text-center text-slate-500">No coupons added yet.</td></tr>
                  ) : coupons.map((cpn) => (
                    <tr key={cpn.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        {cpn.image_url ? (
                          <img src={getImageUrl(cpn.image_url)} alt={cpn.heading} className="w-14 h-10 object-cover rounded-lg border border-slate-200" />
                        ) : (
                          <div className="w-14 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                            <Tag className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-bold text-slate-900">{cpn.heading}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold text-[10px] uppercase tracking-wider">
                          {cpn.offer_code}
                        </span>
                      </td>
                      <td className="p-4 max-w-[200px] truncate text-slate-500">{cpn.description || '—'}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full font-extrabold text-[10px] uppercase ${
                          cpn.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-750 bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          {cpn.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => openEditCoupon(cpn)} className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-100 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteCoupon(cpn.id)} className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MANAGE DESTINATIONS */}
      {activeTab === 'destinations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Destinations Directory</h2>
            <button
              onClick={() => { resetDestinationForm(); setShowDestinationModal(true); }}
              className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add New Destination
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Subtitle</th>
                    <th className="p-4">Description</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {destinations.length === 0 ? (
                    <tr><td colSpan="5" className="p-8 text-center text-slate-500">No destinations added yet.</td></tr>
                  ) : destinations.map((dest) => (
                    <tr key={dest.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        {dest.image_url ? (
                          <img src={getImageUrl(dest.image_url)} alt={dest.name} className="w-14 h-10 object-cover rounded-lg border border-slate-200" />
                        ) : (
                          <div className="w-14 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                            <Layers className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          {dest.name}
                          {dest.is_popular && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-extrabold uppercase tracking-wider">
                              Popular
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-slate-700 font-medium">{dest.subtitle || '—'}</td>
                      <td className="p-4 max-w-[250px] truncate text-slate-500">{dest.description || '—'}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => openEditDestination(dest)} className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-100 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteDestination(dest.id)} className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MANAGE CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Categories Directory</h2>
            <button
              onClick={() => { resetCategoryForm(); setShowCategoryModal(true); }}
              className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add New Category
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Description</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {categories.length === 0 ? (
                    <tr><td colSpan="4" className="p-8 text-center text-slate-500">No categories added yet.</td></tr>
                  ) : categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        {cat.image_url ? (
                          <img src={getImageUrl(cat.image_url)} alt={cat.name} className="w-14 h-10 object-cover rounded-lg border border-slate-200" />
                        ) : (
                          <div className="w-14 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                            <Layers className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        {cat.name}
                      </td>
                      <td className="p-4 max-w-[250px] truncate text-slate-500">{cat.description || '—'}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => openEditCategory(cat)} className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-100 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: MANAGE BLOGS */}
      {activeTab === 'blogs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Blogs Directory</h2>
            <button
              onClick={() => { resetBlogForm(); setShowBlogModal(true); }}
              className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add New Blog Article
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Author</th>
                    <th className="p-4">Published At</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {blogs.length === 0 ? (
                    <tr><td colSpan="5" className="p-8 text-center text-slate-500">No blogs added yet.</td></tr>
                  ) : blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        {blog.image_url ? (
                          <img src={getImageUrl(blog.image_url)} alt={blog.title} className="w-14 h-10 object-cover rounded-lg border border-slate-200" />
                        ) : (
                          <div className="w-14 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                            <BookOpen className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-bold text-slate-900 max-w-[200px] truncate">{blog.title}</td>
                      <td className="p-4 text-slate-700">{blog.author}</td>
                      <td className="p-4 text-slate-500">{blog.published_at}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => openEditBlog(blog)} className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-100 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteBlog(blog.id)} className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Package Form Modal (Add / Edit) */}
      {showPackageModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPackageModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900">
              {editingPackageId ? 'Edit Tour Package' : 'Create New Tour Package'}
            </h3>

            <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Package Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spiti Valley Offbeat Trail"
                  value={pkgTitle}
                  onChange={(e) => setPkgTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Destination</label>
                  <select
                    value={pkgDest}
                    onChange={(e) => setPkgDest(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white cursor-pointer"
                  >
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Category</label>
                  <select
                    value={pkgCat}
                    onChange={(e) => setPkgCat(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

               <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Nights</label>
                    <input
                      type="number"
                      min="1"
                      value={pkgNights}
                      onChange={(e) => setPkgNights(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Days</label>
                    <input
                      type="number"
                      min="1"
                      value={pkgDays}
                      onChange={(e) => setPkgDays(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Price / Person (₹)</label>
                    <input
                      type="number"
                      required
                      value={pkgPrice}
                      onChange={(e) => setPkgPrice(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Old Price (Optional)</label>
                    <input
                      type="number"
                      placeholder="e.g. 23999"
                      value={pkgOldPrice}
                      onChange={(e) => setPkgOldPrice(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-2">Sharing Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Double Sharing (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 16999"
                      value={pkgDoubleSharing}
                      onChange={(e) => setPkgDoubleSharing(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Triple Sharing (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 15299"
                      value={pkgTripleSharing}
                      onChange={(e) => setPkgTripleSharing(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Location Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kaza, Tabo, Chandratal Lake"
                  value={pkgLocation}
                  onChange={(e) => setPkgLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Label</label>
                  <select
                    value={pkgBadge}
                    onChange={(e) => setPkgBadge(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white cursor-pointer"
                  >
                    <option value="BEST SELLER">BEST SELLER</option>
                    <option value="POPULAR">POPULAR</option>
                    <option value="TRENDING">TRENDING</option>
                    <option value="GREAT DEAL">GREAT DEAL</option>
                    <option value="NEW ARRIVAL">NEW ARRIVAL</option>
                    <option value="PREMIUM">PREMIUM</option>
                    <option value="SEASONAL">SEASONAL</option>
                    <option value="MOST LOVED">MOST LOVED</option>
                    <option value="ADVENTURE">ADVENTURE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Rating (Optional)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder="e.g. 4.8"
                    value={pkgRating}
                    onChange={(e) => setPkgRating(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Upload Package Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    id="pkgImageUpload"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files[0]) setPkgFileName(e.target.files[0].name);
                      handleImageUpload(e, setPkgImg);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('pkgImageUpload').click()}
                    className="py-2 px-4 rounded-xl border-0 text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 cursor-pointer shrink-0"
                  >
                    Choose File
                  </button>
                  <span className="text-xs text-slate-500 truncate select-none pointer-events-none">{pkgFileName || 'No file chosen'}</span>
                  {uploading && <span className="text-amber-600 font-bold text-[10px] animate-pulse">Uploading...</span>}
                </div>
                {pkgImg && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={getImageUrl(pkgImg)} alt="Preview" className="w-16 h-12 object-cover rounded-xl border border-slate-200" />
                    <button
                      type="button"
                      onClick={() => { setPkgImg(''); setPkgFileName(''); }}
                      className="p-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 text-[10px] font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Tour Overview</label>
                <textarea rows="3" placeholder="Detailed overview..." value={pkgOverview} onChange={(e) => setPkgOverview(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-amber-500 focus:outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Inclusions (Comma separated)</label>
                  <textarea rows="2" placeholder="Hotels, Breakfast..." value={pkgInclusions} onChange={(e) => setPkgInclusions(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-amber-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Exclusions (Comma separated)</label>
                  <textarea rows="2" placeholder="Flights, Personal expenses..." value={pkgExclusions} onChange={(e) => setPkgExclusions(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-amber-500 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Cancellation Policy</label>
                <textarea rows="2" placeholder="Free cancellation up to 15 days before departure..." value={pkgCancellation} onChange={(e) => setPkgCancellation(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-amber-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Upcoming Departure Dates (Comma separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 05 Sep 2026, 12 Sep 2026, 19 Sep 2026" 
                  value={pkgDepartures} 
                  onChange={(e) => setPkgDepartures(e.target.value)} 
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-amber-500 focus:outline-none text-slate-800" 
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Upload Gallery Images</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    id="pkgGalleryUpload"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files.length > 0) {
                        const names = Array.from(e.target.files).map(f => f.name).join(', ');
                        setGalleryFileNames(names);
                      }
                      handleMultipleImageUpload(e);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('pkgGalleryUpload').click()}
                    className="py-2 px-4 rounded-xl border-0 text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 cursor-pointer shrink-0"
                  >
                    Choose Files
                  </button>
                  <span className="text-xs text-slate-500 truncate select-none pointer-events-none">{galleryFileNames || 'No file chosen'}</span>
                  <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">{pkgGallery.length} file{pkgGallery.length !== 1 ? 's' : ''}</span>
                </div>
                {pkgGallery.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {pkgGallery.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <img src={getImageUrl(item.url)} alt={`Gallery ${idx + 1}`} className="w-20 h-16 object-cover rounded-lg border border-slate-200 shrink-0" />
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Short description for this image..."
                            value={item.description}
                            onChange={(e) => handleGalleryDescriptionChange(idx, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setPkgGallery(prev => prev.filter((_, i) => i !== idx))}
                          className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors shadow-sm shrink-0 mt-1"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>


              <div className="space-y-3">
                <label className="block text-slate-700 font-bold">Day-wise Itinerary</label>
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                  {pkgItinerary.length === 0 ? (
                    <div className="text-center py-6 bg-white border border-slate-200 rounded-xl">
                      <p className="text-xs text-slate-400 font-semibold">No itinerary days added yet. Click Add Day below to start.</p>
                    </div>
                  ) : (
                    pkgItinerary.map((day, index) => (
                      <div key={index} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 relative shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="font-bold text-slate-800 text-sm">Day {index + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItineraryDay(index)}
                            className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Remove this day"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="block text-xs font-semibold text-slate-500">Activity Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Arrival in Port Blair & cellular jail tour"
                            value={day.title || ''}
                            onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
                            required
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="block text-xs font-semibold text-slate-500">Activity Description</label>
                          <textarea
                            rows="3"
                            placeholder="e.g. On arrival, meet our representative at the airport and transfer to hotel..."
                            value={day.description || ''}
                            onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
                            required
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={handleAddItineraryDay}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-300 hover:border-amber-500 hover:text-amber-500 transition-colors text-xs font-bold text-slate-600 bg-white shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Day
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-all shadow-lg shadow-amber-500/20 mt-4"
              >
                {editingPackageId ? 'Save Package Changes' : 'Publish New Package'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Form Modal (Add / Edit) */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCouponModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900">
              {editingCouponId ? 'Edit Coupon' : 'Create New Coupon'}
            </h3>

            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Heading</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Special Discount"
                  value={cpnHeading}
                  onChange={(e) => setCpnHeading(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Brief description of the offer..."
                  value={cpnDesc}
                  onChange={(e) => setCpnDesc(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Offer Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER25"
                  value={cpnCode}
                  onChange={(e) => setCpnCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white uppercase tracking-wider font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Upload Coupon Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    id="cpnImageUpload"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files[0]) setCpnFileName(e.target.files[0].name);
                      handleImageUpload(e, setCpnImg);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('cpnImageUpload').click()}
                    className="py-2 px-4 rounded-xl border-0 text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 cursor-pointer shrink-0"
                  >
                    Choose File
                  </button>
                  <span className="text-xs text-slate-500 truncate select-none pointer-events-none">{cpnFileName || 'No file chosen'}</span>
                  {uploading && <span className="text-amber-600 font-bold text-[10px] animate-pulse">Uploading...</span>}
                </div>
                {cpnImg && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={getImageUrl(cpnImg)} alt="Preview" className="w-16 h-12 object-cover rounded-xl border border-slate-200" />
                    <button
                      type="button"
                      onClick={() => { setCpnImg(''); setCpnFileName(''); }}
                      className="p-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 text-[10px] font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-2">Status</label>
                <button
                  type="button"
                  onClick={() => setCpnActive(!cpnActive)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-colors ${
                    cpnActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {cpnActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  {cpnActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-all shadow-lg shadow-amber-500/20 mt-4"
              >
                {editingCouponId ? 'Save Coupon Changes' : 'Create Coupon'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Category Form Modal (Add / Edit) */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCategoryModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900">
              {editingCategoryId ? 'Edit Category' : 'Create New Category'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Honeymoon"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Upload Category Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    id="catImageUpload"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files[0]) setCatFileName(e.target.files[0].name);
                      handleImageUpload(e, setCatImg);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('catImageUpload').click()}
                    className="py-2 px-4 rounded-xl border-0 text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 cursor-pointer shrink-0"
                  >
                    Choose File
                  </button>
                  <span className="text-xs text-slate-500 truncate select-none pointer-events-none">{catFileName || 'No file chosen'}</span>
                  {uploading && <span className="text-amber-600 font-bold text-[10px] animate-pulse">Uploading...</span>}
                </div>
                {catImg && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={getImageUrl(catImg)} alt="Preview" className="w-16 h-12 object-cover rounded-xl border border-slate-200" />
                    <button
                      type="button"
                      onClick={() => { setCatImg(''); setCatFileName(''); }}
                      className="p-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 text-[10px] font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Category description..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Display Label</label>
                <select
                  value={catDisplayLabel}
                  onChange={(e) => setCatDisplayLabel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white cursor-pointer"
                >
                  <option value="for_everyone">For Everyone</option>
                  <option value="for_solo_travelers">For Solo Travelers</option>
                  <option value="for_families">For Families</option>
                  <option value="for_groups">For Groups</option>
                  <option value="for_friends">For Friends</option>
                  <option value="for_couples">For Couples</option>
                  <option value="for_relaxation">For Relaxation</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-all shadow-lg shadow-amber-500/20 mt-4"
              >
                {editingCategoryId ? 'Save Category Changes' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Destination Form Modal (Add / Edit) */}
      {showDestinationModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowDestinationModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900">
              {editingDestinationId ? 'Edit Destination' : 'Create New Destination'}
            </h3>

            <form onSubmit={handleSaveDestination} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Destination Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spiti Valley"
                  value={destName}
                  onChange={(e) => setDestName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. Adventure & Cold Desert"
                  value={destSubtitle}
                  onChange={(e) => setDestSubtitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Upload Destination Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    id="destImageUpload"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files[0]) setDestFileName(e.target.files[0].name);
                      handleImageUpload(e, setDestImg);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('destImageUpload').click()}
                    className="py-2 px-4 rounded-xl border-0 text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 cursor-pointer shrink-0"
                  >
                    Choose File
                  </button>
                  <span className="text-xs text-slate-500 truncate select-none pointer-events-none">{destFileName || 'No file chosen'}</span>
                  {uploading && <span className="text-amber-600 font-bold text-[10px] animate-pulse">Uploading...</span>}
                </div>
                {destImg && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={getImageUrl(destImg)} alt="Preview" className="w-16 h-12 object-cover rounded-xl border border-slate-200" />
                    <button
                      type="button"
                      onClick={() => { setDestImg(''); setDestFileName(''); }}
                      className="p-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 text-[10px] font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Destination details..."
                  value={destDesc}
                  onChange={(e) => setDestDesc(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="destIsPopular"
                  checked={destIsPopular}
                  onChange={(e) => setDestIsPopular(e.target.checked)}
                  className="w-4 h-4 rounded bg-white border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="destIsPopular" className="text-slate-700 font-bold cursor-pointer">
                  Mark as Popular Destination
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-all shadow-lg shadow-amber-500/20 mt-4"
              >
                {editingDestinationId ? 'Save Destination Changes' : 'Create Destination'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Blog Form Modal (Add / Edit) */}
      {showBlogModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowBlogModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900">
              {editingBlogId ? 'Edit Blog Article' : 'Create New Blog Article'}
            </h3>

            <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Blog Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10 Secret Places in Ladakh"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Author</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Admin"
                  value={blogAuthor}
                  onChange={(e) => setBlogAuthor(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Upload Blog Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    id="blogImageUpload"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files[0]) setBlogFileName(e.target.files[0].name);
                      handleImageUpload(e, setBlogImg);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('blogImageUpload').click()}
                    className="py-2 px-4 rounded-xl border-0 text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 cursor-pointer shrink-0"
                  >
                    Choose File
                  </button>
                  <span className="text-xs text-slate-500 truncate select-none pointer-events-none">{blogFileName || 'No file chosen'}</span>
                  {uploading && <span className="text-amber-600 font-bold text-[10px] animate-pulse">Uploading...</span>}
                </div>
                {blogImg && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={getImageUrl(blogImg)} alt="Preview" className="w-16 h-12 object-cover rounded-xl border border-slate-200" />
                    <button
                      type="button"
                      onClick={() => { setBlogImg(''); setBlogFileName(''); }}
                      className="p-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 text-[10px] font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Summary (Excerpt)</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Short introduction excerpt..."
                  value={blogSummary}
                  onChange={(e) => setBlogSummary(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Blog Content</label>
                <textarea
                  rows="5"
                  required
                  placeholder="Full article content (markdown or plain text)..."
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-all shadow-lg shadow-amber-500/20 mt-4"
              >
                {editingBlogId ? 'Save Blog Changes' : 'Create Blog Article'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
