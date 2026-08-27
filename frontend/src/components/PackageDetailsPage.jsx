import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Clock, Star, ChevronDown, ChevronUp, 
  Check, X, PhoneCall, ArrowLeft, ChevronRight,
  Calendar, AlertCircle
} from 'lucide-react';
import api, { getImageUrl } from '../api/axios';

export default function PackageDetailsPage({ 
  packageItem, 
  onGoBack, 
  onGoHome,
  onGoToPackages,
  onBookingSuccess, 
  onRequireAuth, 
  isAuthenticated 
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedDays, setExpandedDays] = useState([1]); // Day 1 expanded by default
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [sharingType, setSharingType] = useState('single'); // single, double, triple
  const [selectedDate, setSelectedDate] = useState('');
  
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [inclusionsOpen, setInclusionsOpen] = useState(true);
  const [cancellationOpen, setCancellationOpen] = useState(true);
  const [exclusionsOpen, setExclusionsOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const dateRef = useRef(null);
  const nameRef = useRef(null);
  const mobileRef = useRef(null);

  const getGalleryItems = () => {
    const raw = packageItem.gallery || [];
    return raw.map((item, index) => {
      if (typeof item === 'string') {
        return { url: item, description: '' };
      }
      return { url: item.url, description: item.description || '' };
    });
  };

  
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleDay = (dayNum) => {
    if (expandedDays.includes(dayNum)) {
      setExpandedDays(expandedDays.filter(d => d !== dayNum));
    } else {
      setExpandedDays([...expandedDays, dayNum]);
    }
  };

  const expandAll = () => {
    if (packageItem.day_wise_itinerary) {
      setExpandedDays(packageItem.day_wise_itinerary.map(day => day.day_number));
    }
  };

  const collapseAll = () => setExpandedDays([]);

  const isValidPrice = (val) => {
    if (val === undefined || val === null || val === '') return false;
    const num = Number(val);
    return !isNaN(num) && num > 0;
  };

  const singlePriceRaw = packageItem.price_per_person ?? packageItem.single_price ?? packageItem.single;
  const doublePriceRaw = packageItem.double_sharing ?? packageItem.double_price ?? packageItem.double;
  const triplePriceRaw = packageItem.triple_sharing ?? packageItem.triple_price ?? packageItem.triple;

  const isSingleAvailable = isValidPrice(singlePriceRaw);
  const isDoubleAvailable = isValidPrice(doublePriceRaw);
  const isTripleAvailable = isValidPrice(triplePriceRaw);

  const singlePrice = isSingleAvailable ? Number(singlePriceRaw) : null;
  const doublePrice = isDoubleAvailable ? Number(doublePriceRaw) : null;
  const triplePrice = isTripleAvailable ? Number(triplePriceRaw) : null;

  const getFirstAvailableSharingType = (item) => {
    if (!item) return 'single';
    if (isValidPrice(item.price_per_person ?? item.single_price ?? item.single)) return 'single';
    if (isValidPrice(item.double_sharing ?? item.double_price ?? item.double)) return 'double';
    if (isValidPrice(item.triple_sharing ?? item.triple_price ?? item.triple)) return 'triple';
    return 'single';
  };

  useEffect(() => {
    setSharingType(getFirstAvailableSharingType(packageItem));
  }, [packageItem]);

  // Dynamic Starting From price calculation based on priority:
  // 1. Triple price -> 2. Double price -> 3. Single price -> 4. Fallback (0)
  const getStartingFromPrice = (pkg) => {
    if (!pkg) return 0;
    const tripleVal = pkg.triple_price ?? pkg.triple_sharing ?? pkg.triple;
    if (isValidPrice(tripleVal)) return Number(tripleVal);

    const doubleVal = pkg.double_price ?? pkg.double_sharing ?? pkg.double;
    if (isValidPrice(doubleVal)) return Number(doubleVal);

    const singleVal = pkg.single_price ?? pkg.price_per_person ?? pkg.single ?? pkg.price;
    if (isValidPrice(singleVal)) return Number(singleVal);

    return 0;
  };

  const startingFromPrice = getStartingFromPrice(packageItem);
  
  const getPriceBySharing = () => {
    if (sharingType === 'single' && isSingleAvailable) return singlePrice;
    if (sharingType === 'double' && isDoubleAvailable) return doublePrice;
    if (sharingType === 'triple' && isTripleAvailable) return triplePrice;
    return 0;
  };

  const handleSelectSharingType = (type) => {
    let available = false;
    let label = '';
    if (type === 'single') {
      available = isSingleAvailable;
      label = 'Single';
    } else if (type === 'double') {
      available = isDoubleAvailable;
      label = 'Double';
    } else if (type === 'triple') {
      available = isTripleAvailable;
      label = 'Triple';
    }

    if (!available) {
      setFormErrors(prev => ({
        ...prev,
        sharing: `${label} sharing amount is not allocated for this package. Please select another sharing type`
      }));
      return;
    }

    setFormErrors(prev => {
      const copy = { ...prev };
      delete copy.sharing;
      return copy;
    });
    setSharingType(type);
  };
  
  const currentPrice = getPriceBySharing();
  const totalPrice = currentPrice * adults + (currentPrice * 0.7) * children;
  
  const originalPrice = packageItem.original_price ? Number(packageItem.original_price) : currentPrice * 1.25;

  const handleBook = async () => {
    setFormErrors({});
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }
    
    const errors = {};
    if (!selectedDate) errors.date = 'Please select a travel date to proceed.';
    if (!customerName) errors.name = 'Please provide your name.';
    if (!customerMobile || customerMobile.length < 10) errors.mobile = 'Please enter a valid phone number.';
    
    let sharingAvailable = false;
    let sharingLabel = '';
    if (sharingType === 'single') { sharingAvailable = isSingleAvailable; sharingLabel = 'Single'; }
    else if (sharingType === 'double') { sharingAvailable = isDoubleAvailable; sharingLabel = 'Double'; }
    else if (sharingType === 'triple') { sharingAvailable = isTripleAvailable; sharingLabel = 'Triple'; }

    if (!sharingAvailable) {
      errors.sharing = `${sharingLabel} sharing amount is not allocated for this package. Please select another sharing type`;
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      
      // Scroll to the first error
      setTimeout(() => {
        if (errors.date && dateRef.current) {
          dateRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (errors.name && nameRef.current) {
          nameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (errors.mobile && mobileRef.current) {
          mobileRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    if (bookingLoading) return; // Prevent duplicate submissions

    setBookingLoading(true);
    try {
      const payload = {
        package: packageItem.id,
        travel_date: selectedDate,
        guests_count: adults + children,
        customer_name: customerName,
        customer_phone: customerMobile,
        total_price: totalPrice,
      };
      const res = await api.post('bookings/', payload);
      onBookingSuccess(res.data);
      
      // Reset form fields
      setSelectedDate('');
      setCustomerName('');
      setCustomerMobile('');
      setAdults(2);
      setChildren(0);
      setSharingType('single');
    } catch (err) {
      console.error('Booking failed:', err);
      setFormErrors({ general: 'Booking failed. Please try again.' });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF7F5] min-h-screen pb-20">
      {/* Hero Banner Section */}
      <div className="relative h-[450px] md:h-[550px] w-full">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={getImageUrl(packageItem.image_url)} 
            alt={packageItem.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/20"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-12">
          {/* Breadcrumbs */}
          <div className="flex items-center text-slate-300 text-sm mb-4 space-x-2">
            <button 
              onClick={onGoHome || onGoBack} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3 h-3" />
            <button 
              onClick={onGoToPackages || onGoBack} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Packages
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-amber-400">{packageItem.title}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6">
            {packageItem.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-200">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>{packageItem.location_summary || packageItem.destination_details?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{packageItem.duration_nights} Nights / {packageItem.duration_days} Days</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{packageItem.rating !== undefined && packageItem.rating !== null ? packageItem.rating : '4.5'} ({packageItem.reviews_count !== undefined && packageItem.reviews_count !== null ? packageItem.reviews_count : 50} reviews)</span>
            </div>
          </div>
          
          {packageItem.badge_text && (
            <div className="mt-6">
              <span className="px-3 py-1 rounded bg-amber-500 text-slate-900 text-xs font-bold uppercase tracking-wider">
                {packageItem.badge_text}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column - Details */}
          <div className="flex-1 space-y-12">
            
            {/* Tour Overview */}
            <section>
              <h2 className="text-3xl font-serif text-slate-900 mb-6">Tour Overview</h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                {packageItem.tour_overview}
              </p>
              
              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Duration</p>
                  <p className="font-bold text-slate-900">{packageItem.duration_nights}N / {packageItem.duration_days}D</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Destination</p>
                  <p className="font-bold text-slate-900">{packageItem.destination_details?.name || 'Multiple Locations'}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Best For</p>
                  <p className="font-bold text-slate-900 truncate">
                    {packageItem.highlights?.join(', ') || packageItem.category_details?.display_label || 'Everyone'}
                  </p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Starting From</p>
                  <p className="font-bold text-slate-900">
                    ₹{startingFromPrice.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </section>

            {/* Day-wise Itinerary */}
            <section>
              <div className="flex items-end justify-between mb-6">
                <h2 className="text-3xl font-serif text-slate-900">Day-wise Itinerary</h2>
                <div className="flex gap-2">
                  <button onClick={expandAll} className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">EXPAND ALL</button>
                  <button onClick={collapseAll} className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">COLLAPSE ALL</button>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {packageItem.day_wise_itinerary?.length > 0 ? (
                  packageItem.day_wise_itinerary.map((day, index) => {
                    const isLast = index === packageItem.day_wise_itinerary.length - 1;
                    const isExpanded = expandedDays.includes(day.day_number);
                    return (
                      <div key={day.day_number} className="overflow-hidden rounded-xl bg-white border border-slate-200 shadow-sm">
                        <button
                          type="button"
                          onClick={() => toggleDay(day.day_number)}
                          className="flex w-full items-center gap-4 px-4 py-4 text-left cursor-pointer hover:bg-slate-50 transition-colors"
                          aria-expanded={isExpanded}
                        >
                          {/* Day number badge */}
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-50 text-[11px] font-bold text-amber-600">
                            D{day.day_number}
                          </span>

                          {/* Title + subtitle */}
                          <span className="flex-1">
                            <span className="block font-bold text-slate-900 sm:text-base">{day.title}</span>
                            <span className="block text-xs text-slate-400 mt-0.5">
                              Stay: {day.stay || 'Hotel'} in {packageItem.location_summary?.split(',')[0]?.trim() || 'Destination'} • Meals: {day.meals || 'Breakfast, Dinner'}
                            </span>
                          </span>

                          {/* Chevron */}
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-amber-500 shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-amber-500 shrink-0" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="border-t border-slate-100 px-4 pb-5 pt-3 pl-[4.5rem]">
                            <p className="text-sm leading-relaxed text-slate-500">
                              {day.description}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-slate-500 italic">Detailed itinerary will be shared shortly after booking.</p>
                )}
              </div>
            </section>

            {/* Inclusions & Exclusions */}
            <section>
              <h2 className="text-3xl font-serif text-slate-900 mb-2">Inclusions & Exclusions</h2>
              <div className="mt-2 h-px w-20 bg-amber-500 mb-1"></div>
              <p className="mt-3 text-xs text-muted-foreground">Tap a card to expand the full list.</p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Inclusions */}
                <div className="overflow-hidden bg-white shadow-sm rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setInclusionsOpen(!inclusionsOpen)}
                    className="flex w-full items-center justify-between gap-3 py-4 text-left px-6 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg">What's included</h3>
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold">
                        {packageItem.inclusions?.length || 0}
                      </span>
                    </div>
                    {inclusionsOpen ? (
                      <ChevronUp className="w-5 h-5 text-amber-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-amber-500 shrink-0" />
                    )}
                  </button>
                  {inclusionsOpen && (
                    <ul className="space-y-2.5 border-t border-slate-100 px-5 py-4">
                      {packageItem.inclusions?.map((item, idx) => (
                        <li key={idx} className="flex gap-2 text-xs leading-relaxed text-slate-500">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Exclusions */}
                <div className="overflow-hidden bg-white shadow-sm rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setExclusionsOpen(!exclusionsOpen)}
                    className="flex w-full items-center justify-between gap-3 py-4 text-left px-6 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <X className="w-5 h-5 text-rose-500 shrink-0" />
                      <h3 className="font-bold text-slate-900 text-lg">What's not included</h3>
                      <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-xs font-bold">
                        {packageItem.exclusions?.length || 0}
                      </span>
                    </div>
                    {exclusionsOpen ? (
                      <ChevronUp className="w-5 h-5 text-amber-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-amber-500 shrink-0" />
                    )}
                  </button>
                  {exclusionsOpen && (
                    <ul className="space-y-2.5 border-t border-slate-100 px-5 py-4">
                      {packageItem.exclusions?.map((item, idx) => (
                        <li key={idx} className="flex gap-2 text-xs leading-relaxed text-slate-500">
                          <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </section>

            {/* Cancellation Policy */}
            <section>
              <h2 className="text-3xl font-serif text-slate-900 mb-2">Cancellation Policy</h2>
              <div className="mt-2 h-px w-20 bg-amber-500 mb-6"></div>
              <div className="overflow-hidden bg-white shadow-sm rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setCancellationOpen(!cancellationOpen)}
                  className="flex w-full items-center justify-between gap-3 py-4 text-left px-6 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <h3 className="font-bold text-slate-900 text-lg">Refund slabs & terms</h3>
                  {cancellationOpen ? (
                    <ChevronUp className="w-5 h-5 text-amber-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-amber-500 shrink-0" />
                  )}
                </button>
                {cancellationOpen && (
                  <div className="border-t border-slate-100 px-6 py-5">
                    <ul className="space-y-4">
                      {(() => {
                        const policyText = packageItem.cancellation_policy || 'Standard cancellation policy applies. Free cancellation up to 15 days before departure. A 50% fee applies for cancellations within 7-14 days. No refund for cancellations within 7 days of departure.';
                        const lines = policyText.split(/[.\n]/).map(s => s.trim()).filter(Boolean);
                        return lines.map((line, idx) => (
                          <li key={idx} className="flex gap-3 text-sm leading-relaxed text-slate-500">
                            <span className="text-amber-500 mt-1 shrink-0">•</span>
                            <span>{line}.</span>
                          </li>
                        ));
                      })()}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            {/* Upcoming Departure Dates */}
            {packageItem.upcoming_departures?.length > 0 && (
              <section>
                <h2 className="text-3xl font-serif text-slate-900 mb-6">Upcoming Departure Dates</h2>
                <div className="flex flex-wrap gap-3">
                  {packageItem.upcoming_departures.map((date, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                      <Calendar className="w-4 h-4 text-amber-500" />
                      <span className="text-slate-700 font-medium text-sm">{date}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Destination Gallery */}
            {getGalleryItems().length > 0 && (
              <section>
                <h2 className="text-3xl font-serif text-slate-900 mb-6">Destination Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {getGalleryItems().map((item, idx) => (
                    <div key={idx} className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm group">
                      <div className="aspect-[4/3] w-full overflow-hidden">
                        <img 
                          src={getImageUrl(item.url)} 
                          alt={item.description || `Gallery image ${idx + 1}`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      {item.description && (
                        <div className="p-3 bg-white border-t border-slate-100 flex-1 flex items-center">
                          <span className="text-xs font-semibold text-slate-700 leading-snug">
                            {item.description}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Right Column - Sticky Booking Widget */}
          <div className="w-full lg:w-[400px] shrink-0 sticky top-24 pb-12">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6">
                
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Starting From</p>
                <div className="mb-6">
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-extrabold text-slate-900">
                      ₹{currentPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm font-medium text-slate-500 mb-1">/ adult</span>
                  </div>
                  {packageItem.old_price ? (
                    <div className="mt-0.5">
                      <span className="text-sm font-medium text-slate-400 line-through">
                        ₹{Number(packageItem.old_price).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ) : null}
                </div>

                {/* Departure Date */}
                <div className="mb-5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    CHOOSE YOUR TRAVEL DATE
                  </label>
                  <div className="relative flex items-center" ref={dateRef}>
                    <input
                      type="date"
                      min={todayStr}
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        if (formErrors.date) setFormErrors({ ...formErrors, date: '' });
                      }}
                      onClick={(e) => { try { e.target.showPicker && e.target.showPicker(); } catch (err) {} }}
                      className={`w-full bg-[#fdfbf7] border rounded-xl py-3 px-4 text-slate-700 font-medium focus:outline-none focus:border-amber-500 cursor-pointer text-sm pr-10 shadow-sm [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
                        formErrors.date ? 'border-rose-500 bg-rose-50' : 'border-amber-200/70'
                      }`}
                    />
                    <Calendar className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${formErrors.date ? 'text-rose-500' : 'text-slate-900'}`} />
                  </div>
                  {formErrors.date && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-rose-500">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">{formErrors.date}</span>
                    </div>
                  )}
                  <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-600 font-normal">
                    <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Private trip — start on any date you like.</span>
                  </div>
                </div>

                {/* Sharing Type */}
                <div className="mb-6">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Sharing Type
                  </label>
                  <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                    <button 
                      type="button"
                      onClick={() => handleSelectSharingType('single')}
                      className={`flex-1 py-2 flex flex-col items-center justify-center transition-colors border-r border-slate-200 ${
                        !isSingleAvailable
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                          : sharingType === 'single'
                            ? 'bg-amber-500 text-white cursor-pointer'
                            : 'bg-white text-slate-600 hover:bg-slate-50 cursor-pointer'
                      }`}
                    >
                      <span className="text-xs font-bold">Single</span>
                      <span className="text-[10px] opacity-80">
                        {isSingleAvailable ? `₹${singlePrice.toLocaleString('en-IN')}` : 'Unavailable'}
                      </span>
                    </button>

                    <button 
                      type="button"
                      onClick={() => handleSelectSharingType('double')}
                      className={`flex-1 py-2 flex flex-col items-center justify-center transition-colors border-r border-slate-200 ${
                        !isDoubleAvailable
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                          : sharingType === 'double'
                            ? 'bg-amber-500 text-white cursor-pointer'
                            : 'bg-white text-slate-600 hover:bg-slate-50 cursor-pointer'
                      }`}
                    >
                      <span className="text-xs font-bold">Double</span>
                      <span className="text-[10px] opacity-80">
                        {isDoubleAvailable ? `₹${doublePrice.toLocaleString('en-IN')}` : 'Unavailable'}
                      </span>
                    </button>

                    <button 
                      type="button"
                      onClick={() => handleSelectSharingType('triple')}
                      className={`flex-1 py-2 flex flex-col items-center justify-center transition-colors ${
                        !isTripleAvailable
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                          : sharingType === 'triple'
                            ? 'bg-amber-500 text-white cursor-pointer'
                            : 'bg-white text-slate-600 hover:bg-slate-50 cursor-pointer'
                      }`}
                    >
                      <span className="text-xs font-bold">Triple</span>
                      <span className="text-[10px] opacity-80">
                        {isTripleAvailable ? `₹${triplePrice.toLocaleString('en-IN')}` : 'Unavailable'}
                      </span>
                    </button>
                  </div>
                  {formErrors.sharing && (
                    <div className="mt-2 flex items-center gap-1.5 text-rose-500">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-xs font-medium leading-tight">{formErrors.sharing}</span>
                    </div>
                  )}
                </div>

                {/* Passenger Selection */}
                <div className="space-y-4 mb-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">Adults</p>
                      <p className="text-[10px] text-slate-400">Age 12+</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">-</button>
                      <span className="font-bold text-slate-800 w-4 text-center">{adults}</span>
                      <button onClick={() => setAdults(adults + 1)} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">+</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">Children</p>
                      <p className="text-[10px] text-slate-400">Age 2-11</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">-</button>
                      <span className="font-bold text-slate-800 w-4 text-center">{children}</span>
                      <button onClick={() => setChildren(children + 1)} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">+</button>
                    </div>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="pt-4 border-t border-slate-100 space-y-2 mb-6">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>{adults} adults x ₹{currentPrice.toLocaleString('en-IN')}</span>
                    <span className="font-medium">₹{(adults * currentPrice).toLocaleString('en-IN')}</span>
                  </div>
                  {children > 0 && (
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>{children} children x ₹{(currentPrice * 0.7).toLocaleString('en-IN')}</span>
                      <span className="font-medium">₹{(children * currentPrice * 0.7).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-slate-500 italic mt-2">
                    <span>Rooms required ({sharingType} sharing)</span>
                    <span>{Math.ceil((adults + children) / (sharingType === 'triple' ? 3 : sharingType === 'single' ? 1 : 2))}</span>
                  </div>
                </div>

                <div className="flex items-end justify-between mb-2">
                  <span className="font-bold text-slate-900">Total payable</span>
                  <span className="text-2xl font-extrabold text-slate-900">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-slate-500 mb-6">
                  Pay 25% (₹{(totalPrice * 0.25).toLocaleString('en-IN')}) now to block your seats. Balance 15 days before departure.
                </p>

                {/* Booking Form */}
                <div className="space-y-3 mb-6">
                  <div ref={nameRef}>
                    <input 
                      type="text" 
                      placeholder="Your name" 
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                      }}
                      className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:border-amber-500 text-sm ${
                        formErrors.name ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
                      }`}
                    />
                    {formErrors.name && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-rose-500">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{formErrors.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div ref={mobileRef}>
                    <input 
                      type="tel" 
                      placeholder="Mobile number" 
                      value={customerMobile}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) {
                          setCustomerMobile(val);
                          if (formErrors.mobile) setFormErrors({ ...formErrors, mobile: '' });
                        }
                      }}
                      className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:border-amber-500 text-sm ${
                        formErrors.mobile ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
                      }`}
                    />
                    {formErrors.mobile && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-rose-500">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{formErrors.mobile}</span>
                      </div>
                    )}
                  </div>
                </div>

                {formErrors.general && (
                  <div className="mb-4 p-3 bg-rose-50 text-rose-600 rounded-lg text-sm flex items-start gap-2 border border-rose-100">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{formErrors.general}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <button 
                    onClick={handleBook}
                    disabled={bookingLoading}
                    className={`w-full py-3.5 font-extrabold uppercase tracking-widest text-xs rounded-lg transition-colors shadow-lg ${
                      bookingLoading 
                        ? 'bg-amber-400 text-slate-700 cursor-not-allowed opacity-70' 
                        : 'bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-amber-500/30'
                    }`}
                  >
                    {bookingLoading ? 'BOOKING...' : 'BOOK THIS PACKAGE'}
                  </button>
                  <button 
                    className="w-full py-3.5 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-bold uppercase tracking-widest text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    TALK TO AN EXPERT
                  </button>
                </div>

                <p className="text-center text-[10px] text-slate-400 mt-4 flex items-center justify-center gap-1">
                  Free customisation for groups of 6 or more
                </p>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
