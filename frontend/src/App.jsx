import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import api from './api/axios';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import PopularDestinations from './components/PopularDestinations';
import OfferCoupons from './components/OfferCoupons';
import FeaturedPackages from './components/FeaturedPackages';
import PackageDetailsPage from './components/PackageDetailsPage';
import CuratedCollections from './components/CuratedCollections';
import WhyChooseUs from './components/WhyChooseUs';
import Blog from './components/Blog';
import BlogListingPage from './components/BlogListingPage';
import BlogDetailsPage from './components/BlogDetailsPage';
import AuthModal from './components/AuthModal';
import UserPanel from './components/UserPanel';
import AdminPanel from './components/AdminPanel';
import ContactPage from './components/ContactPage';
import DestinationsPage from './components/DestinationsPage';
import PackagesPage from './components/PackagesPage';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

const MainApp = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();

  // Navigation & View State
  const [currentView, setCurrentView] = useState('home'); // 'home', 'user', 'admin'
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('All destinations');
  const [packagesBackOrigin, setPackagesBackOrigin] = useState('destinations');

  // Data State
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals & Notifications
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogBackView, setBlogBackView] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [userPanelTab, setUserPanelTab] = useState('bookings');
  const [wishlist, setWishlist] = useState([]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [pkgsRes, catsRes, destsRes, blogsRes, couponsRes] = await Promise.all([
        api.get('packages/'),
        api.get('categories/'),
        api.get('destinations/'),
        api.get('blogs/'),
        api.get('coupons/'),
      ]);
      setPackages(pkgsRes.data);
      setCategories(catsRes.data);
      setDestinations(destsRes.data);
      setBlogs(blogsRes.data);
      setCoupons(couponsRes.data);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await api.get('wishlist/');
      setWishlist(res.data);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    }
  };

  const handleWishlistToggle = async (pkg) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      setToastMsg('Please sign in to wishlist packages.');
      setTimeout(() => setToastMsg(''), 4000);
      return;
    }
    try {
      const res = await api.post('wishlist/toggle/', { package_id: pkg.id });
      if (res.data.status === 'added') {
        const fullPkg = packages.find(p => p.id === pkg.id) || pkg;
        setWishlist(prev => [...prev, fullPkg]);
        setToastMsg('Added to wishlist.');
      } else {
        setWishlist(prev => prev.filter(item => item.id !== pkg.id));
        setToastMsg('Removed from wishlist.');
      }
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
      setToastMsg('Error toggling wishlist.');
      setTimeout(() => setToastMsg(''), 4000);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated]);

  const handleHeroSearch = ({ destination, duration, type, guests }) => {
    if (destination) setSearchQuery(destination);
    if (type) setActiveCategory(type);
    
    // Smooth scroll to packages section
    const el = document.getElementById('packages-section') || document.getElementById('packages');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectDestination = (destinationName) => {
    setSelectedDestination(destinationName);
    setActiveCategory('ALL');
    setPackagesBackOrigin('destinations');
    setCurrentView('packages');
    window.scrollTo(0, 0);
  };

  const handleFilterCategory = (catName) => {
    setActiveCategory(catName);
    setSearchQuery('');
    setPackagesBackOrigin('home');
    setCurrentView('packages');
    window.scrollTo(0, 0);
  };

  const handleBookingSuccess = (newBooking) => {
    setToastMsg('Booked successfully and added to My Bookings.');
    setTimeout(() => setToastMsg(''), 5000);
  };

  const handleAuthSuccessRedirect = (userRole) => {
    setCurrentView('home');
    if (userRole === 'admin') {
      setToastMsg('Signed in as Admin.');
    } else {
      setToastMsg('Signed in successfully!');
    }
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-24 right-4 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-sky-500/40 flex items-center gap-3 animate-fade-in max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <Header
        onOpenAuth={() => setShowAuthModal(true)}
        activeSection={activeCategory}
        setActiveSection={setActiveCategory}
        currentView={currentView}
        setCurrentView={setCurrentView}
        setUserPanelTab={setUserPanelTab}
      />

      {/* Main Body Router View */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <div className="space-y-4">
            <HeroSection onSearch={handleHeroSearch} onContactUs={() => setCurrentView('contact')} />

            <PopularDestinations
              destinations={destinations}
              onSelectDestination={handleSelectDestination}
              onViewAllDestinations={() => {
                setCurrentView('destinations');
                window.scrollTo(0, 0);
              }}
            />

            <OfferCoupons coupons={coupons} onFilterCategory={handleFilterCategory} />

            <FeaturedPackages
              packages={packages}
              categories={categories}
              selectedCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              onViewAllPackages={() => {
                setSelectedDestination('All destinations');
                setActiveCategory('ALL');
                setPackagesBackOrigin('featured');
                setCurrentView('packages');
                window.scrollTo(0, 0);
              }}
              onSelectPackage={(pkg) => {
                setSelectedPackage(pkg);
                setCurrentView('package-details');
              }}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              wishlist={wishlist.map(w => w.id)}
              onWishlistToggle={handleWishlistToggle}
            />

            <CuratedCollections categories={categories} onFilterCategory={handleFilterCategory} />

            <WhyChooseUs />

            <Blog
              blogs={blogs}
              onViewAllBlogs={() => {
                setCurrentView('blogs');
                window.scrollTo(0, 0);
              }}
              onSelectBlog={(blog) => {
                setSelectedBlog(blog);
                setBlogBackView('home');
                setCurrentView('blog-details');
                window.scrollTo(0, 0);
              }}
            />
          </div>
        )}

        {/* VIEW 2: USER PANEL */}
        {currentView === 'user' && (
          isAuthenticated ? (
            <UserPanel
              activeTab={userPanelTab}
              setActiveTab={setUserPanelTab}
              onGoHome={() => setCurrentView('home')}
              onBrowsePackages={() => {
                setCurrentView('home');
                const el = document.getElementById('packages-section') || document.getElementById('packages');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onSelectPackage={(pkg) => {
                setSelectedPackage(pkg);
                setCurrentView('package-details');
              }}
              wishlist={wishlist}
              onRemoveWishlist={handleWishlistToggle}
              onRefreshWishlist={fetchWishlist}
            />
          ) : (
            <div className="py-20 px-4 text-center max-w-md mx-auto space-y-4">
              <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
              <h2 className="text-2xl font-bold">Sign In Required</h2>
              <p className="text-sm text-slate-500">Please sign in to view your booked packages and user dashboard.</p>
              <button onClick={() => setShowAuthModal(true)} className="btn-primary">
                Sign In Now
              </button>
            </div>
          )
        )}

        {/* VIEW 3: ADMIN PANEL */}
        {currentView === 'admin' && (
          isAuthenticated && isAdmin ? (
            <AdminPanel onGoHome={() => setCurrentView('home')} onRefreshData={fetchInitialData} />
          ) : (
            <div className="py-20 px-4 text-center max-w-md mx-auto space-y-4">
              <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
              <h2 className="text-2xl font-bold text-slate-900">Admin Permission Required</h2>
              <p className="text-sm text-slate-500">You must be logged in as an Admin user to access the Admin Control Center.</p>
              <button onClick={() => setShowAuthModal(true)} className="btn-primary">
                Sign In as Admin
              </button>
            </div>
          )
        )}
        {/* VIEW 4: PACKAGE DETAILS */}
        {currentView === 'package-details' && selectedPackage && (
          <PackageDetailsPage
            packageItem={selectedPackage}
            onGoBack={() => {
              setCurrentView('home');
              setSelectedPackage(null);
            }}
            onBookingSuccess={handleBookingSuccess}
            onRequireAuth={() => setShowAuthModal(true)}
            isAuthenticated={isAuthenticated}
          />
        )}

        {/* VIEW 5: CONTACT PAGE */}
        {currentView === 'contact' && (
          <ContactPage onGoBack={() => setCurrentView('home')} />
        )}

        {/* VIEW 5.2: PACKAGES LISTING PAGE */}
        {currentView === 'packages' && (
          <PackagesPage
            packages={packages}
            categories={categories}
            destinations={destinations}
            selectedCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            initialDestination={selectedDestination}
            backButtonText={
              packagesBackOrigin === 'featured'
                ? 'Back to Featured Tour Packages'
                : packagesBackOrigin === 'destinations'
                ? 'Back to Destinations'
                : 'Back to Home'
            }
            onGoBack={() => {
              if (packagesBackOrigin === 'featured') {
                setCurrentView('home');
                setTimeout(() => {
                  const el = document.getElementById('packages-section') || document.getElementById('packages');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              } else if (packagesBackOrigin === 'destinations') {
                setCurrentView('destinations');
                window.scrollTo(0, 0);
              } else {
                setCurrentView('home');
                window.scrollTo(0, 0);
              }
            }}
            onSelectPackage={(pkg) => {
              setSelectedPackage(pkg);
              setCurrentView('package-details');
            }}
            wishlist={wishlist.map(w => w.id)}
            onWishlistToggle={handleWishlistToggle}
          />
        )}

        {/* VIEW 5.5: DESTINATIONS PAGE */}
        {currentView === 'destinations' && (
          <DestinationsPage
            destinations={destinations}
            onGoBack={(target = 'home') => {
              setCurrentView(target);
              window.scrollTo(0, 0);
            }}
            onSelectDestination={handleSelectDestination}
          />
        )}

        {/* VIEW 6: BLOG LISTING PAGE */}
        {currentView === 'blogs' && (
          <BlogListingPage
            blogs={blogs}
            onGoBack={(target = 'home') => {
              setCurrentView(target);
              window.scrollTo(0, 0);
            }}
            onSelectBlog={(blog) => {
              setSelectedBlog(blog);
              setBlogBackView('blogs');
              setCurrentView('blog-details');
              window.scrollTo(0, 0);
            }}
          />
        )}

        {/* VIEW 7: BLOG DETAILS PAGE */}
        {currentView === 'blog-details' && selectedBlog && (
          <BlogDetailsPage
            blog={selectedBlog}
            recentBlogs={blogs}
            onGoBack={(action, payload) => {
              if (action === 'home') {
                setCurrentView('home');
                window.scrollTo(0, 0);
              } else if (action === 'blogs') {
                setCurrentView('blogs');
                window.scrollTo(0, 0);
              } else if (action === 'contact') {
                setCurrentView('contact');
                window.scrollTo(0, 0);
              } else if (action === 'home-packages') {
                setCurrentView('home');
                setTimeout(() => {
                  const el = document.getElementById('packages-section') || document.getElementById('packages');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              } else if (action === 'switch' && payload) {
                setSelectedBlog(payload);
                window.scrollTo(0, 0);
              } else {
                setCurrentView(blogBackView);
                window.scrollTo(0, 0);
              }
            }}
          />
        )}

      </main>

      {/* Footer (hidden on Admin Panel) */}
      {currentView !== 'admin' && (
        <Footer
          destinations={destinations}
          onSelectDestination={handleSelectDestination}
          setCurrentView={setCurrentView}
          setActiveSection={setActiveCategory}
        />
      )}

      {/* Authentication Modal (Login / Register / Quick Demo) */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccessRedirect={handleAuthSuccessRedirect}
        />
      )}

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
