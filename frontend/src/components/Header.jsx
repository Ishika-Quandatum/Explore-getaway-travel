import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Phone, Mail, User, LogOut, ShieldCheck, ShoppingBag, Menu, X, Heart } from 'lucide-react';

const Header = ({ onOpenAuth, activeSection, setActiveSection, currentView, setCurrentView, setUserPanelTab }) => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleNavClick = (section, view = 'home') => {
    setCurrentView(view);
    setActiveSection(section);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);

    if (view === 'home') {
      setTimeout(() => {
        if (section === 'packages') {
          const el = document.getElementById('packages-section') || document.getElementById('packages');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        } else if (section === 'blog') {
          const el = document.getElementById('blog-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        } else if (section === 'all') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B132B] text-white border-b border-slate-800">
      
      {/* Top Contact Sub-bar */}
      <div className="bg-[#070D1F] border-b border-slate-800/80 py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-end gap-6 text-[11px] font-medium text-slate-300">
          <a href="tel:+919876543210" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
            <Phone className="w-3 h-3 text-amber-400" />
            <span>+91 98765 43210</span>
          </a>
          <a href="mailto:info@example.com" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
            <Mail className="w-3 h-3 text-amber-400" />
            <span>info@example.com</span>
          </a>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-x-8 gap-y-4 pb-4 pt-2">
          
          {/* Logo Frame */}
          <div 
            className="cursor-pointer flex items-center gap-2 group"
            onClick={() => handleNavClick('all', 'home')}
          >
            <div className="px-4 py-2 border border-slate-600 rounded text-center tracking-widest font-serif font-bold text-lg text-white group-hover:border-amber-400 group-hover:text-amber-400 transition-all">
              LOGO
            </div>
          </div>

          {/* Desktop Links */}
          <ul className="flex flex-wrap items-center gap-x-7 gap-y-2 text-sm font-medium order-3 lg:order-2 w-full lg:w-auto pt-2 lg:pt-0">
            <li>
              <button
                onClick={() => handleNavClick('all', 'home')}
                className={`py-2 transition-all relative ${
                  currentView === 'home' && activeSection === 'all'
                    ? 'text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Home
                {currentView === 'home' && activeSection === 'all' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavClick('ALL', 'packages')}
                className={`py-2 transition-all relative ${
                  currentView === 'packages'
                    ? 'text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Packages
                {currentView === 'packages' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            </li>

            <li>
              <button
                onClick={() => {
                  setCurrentView('destinations');
                  setMobileMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
                className={`py-2 transition-all relative ${
                  currentView === 'destinations'
                    ? 'text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Destinations
                {currentView === 'destinations' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavClick('Honeymoon', 'packages')}
                className={`py-2 transition-all relative ${
                  currentView === 'packages' && activeSection.toUpperCase() === 'HONEYMOON'
                    ? 'text-amber-400 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Honeymoon
                {currentView === 'packages' && activeSection.toUpperCase() === 'HONEYMOON' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavClick('Group Tours', 'packages')}
                className={`py-2 transition-all relative ${
                  currentView === 'packages' && activeSection.toUpperCase() === 'GROUP TOURS'
                    ? 'text-amber-400 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Group Tours
                {currentView === 'packages' && activeSection.toUpperCase() === 'GROUP TOURS' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            </li>

            <li>
              <button
                onClick={() => handleNavClick('blog', 'home')}
                className={`py-2 transition-all relative ${
                  activeSection === 'blog'
                    ? 'text-white font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Travel Guide
                {activeSection === 'blog' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            </li>

            {isAuthenticated && isAdmin && (
              <li>
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`py-2 transition-all relative ${
                    currentView === 'admin'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-300 hover:text-amber-400'
                  }`}
                >
                  Admin
                  {currentView === 'admin' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                  )}
                </button>
              </li>
            )}
          </ul>

          {/* Right Action / Auth Buttons */}
          <div className="hidden md:flex items-center gap-3 relative ml-auto order-2 lg:order-3">
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center border border-slate-700 hover:border-amber-400 transition-all focus:outline-none overflow-hidden"
                title="Profile Menu"
              >
                {isAuthenticated ? (
                  <div className="w-full h-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-sm uppercase">
                    {user?.first_name ? user.first_name.trim()[0] : (user?.username ? user.username.trim()[0] : 'U')}
                  </div>
                ) : (
                  <User className="w-5 h-5 text-amber-400" />
                )}
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-64 bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl py-3 px-4 text-left z-50 animate-fade-in text-xs text-slate-300 space-y-3">
                  {isAuthenticated ? (
                    <>
                      {/* User Info Header */}
                      <div className="border-b border-slate-800 pb-2">
                        <div className="font-bold text-white text-sm truncate">
                          {user?.username || 'Traveler'}
                        </div>
                      </div>

                      {/* Dropdown Links */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setUserPanelTab('profile');
                            setCurrentView('user');
                            window.scrollTo(0, 0);
                          }}
                          className="w-full text-left py-2 px-2.5 rounded-lg hover:bg-slate-800 text-slate-200 font-semibold flex items-center gap-2 transition-colors"
                        >
                          <User className="w-4 h-4 text-amber-400" />
                          <span>My Profile</span>
                        </button>

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setUserPanelTab('bookings');
                            setCurrentView('user');
                            window.scrollTo(0, 0);
                          }}
                          className="w-full text-left py-2 px-2.5 rounded-lg hover:bg-slate-800 text-slate-200 font-semibold flex items-center gap-2 transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4 text-sky-400" />
                          <span>My Bookings</span>
                        </button>

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setUserPanelTab('wishlist');
                            setCurrentView('user');
                            window.scrollTo(0, 0);
                          }}
                          className="w-full text-left py-2 px-2.5 rounded-lg hover:bg-slate-800 text-slate-200 font-semibold flex items-center gap-2 transition-colors"
                        >
                          <Heart className="w-4 h-4 text-rose-400" />
                          <span>My Wishlist</span>
                        </button>
                        
                        {isAdmin && (
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              setCurrentView('admin');
                              window.scrollTo(0, 0);
                            }}
                            className="w-full text-left py-2 px-2.5 rounded-lg hover:bg-slate-800 text-slate-200 font-semibold flex items-center gap-2 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-400" />
                            <span>Admin Dashboard</span>
                          </button>
                        )}
                      </div>

                      {/* Logout Action */}
                      <div className="border-t border-slate-800 pt-2">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setShowLogoutConfirm(true);
                          }}
                          className="w-full text-left py-2 px-2.5 rounded-lg hover:bg-rose-500/10 text-rose-400 font-bold flex items-center gap-2 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-2 text-center">
                      <p className="text-slate-400 mb-3 text-[11px]">Sign in to manage your bookings and profile.</p>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenAuth();
                        }}
                        className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Sign In / Register</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center ml-auto">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md bg-slate-800 text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070D1F] border-b border-slate-800 px-4 py-4 space-y-2">
          {isAuthenticated && isAdmin && (
            <button
              onClick={() => { setCurrentView('admin'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-amber-400 text-sm font-bold"
            >
              Admin Panel
            </button>
          )}
          {isAuthenticated && (
            <>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setUserPanelTab('profile');
                  setCurrentView('user');
                  window.scrollTo(0, 0);
                }}
                className="w-full text-left px-3 py-2 text-slate-200 hover:text-amber-400 text-sm font-medium flex items-center gap-2"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setUserPanelTab('bookings');
                  setCurrentView('user');
                  window.scrollTo(0, 0);
                }}
                className="w-full text-left px-3 py-2 text-slate-200 hover:text-amber-400 text-sm font-medium flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-sky-400" />
                <span>My Bookings</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setUserPanelTab('wishlist');
                  setCurrentView('user');
                  window.scrollTo(0, 0);
                }}
                className="w-full text-left px-3 py-2 text-slate-200 hover:text-amber-400 text-sm font-medium flex items-center gap-2"
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span>My Wishlist</span>
              </button>
            </>
          )}
          {!isAuthenticated && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full text-left px-3 py-2 text-amber-400 hover:text-amber-300 text-sm font-bold flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}
          {isAuthenticated && (
            <button
              onClick={() => { setMobileMenuOpen(false); setShowLogoutConfirm(true); }}
              className="w-full text-left px-3 py-2 text-rose-400 hover:text-rose-300 text-sm font-bold flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      )}

      {/* Logout Confirmation Popup Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 text-center space-y-5 border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Confirm Sign Out</h3>
              <p className="text-xs text-slate-500 mt-1">Are you sure you want to log out of your session?</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                  setCurrentView('home');
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};

export default Header;
