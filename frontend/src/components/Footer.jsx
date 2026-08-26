import React, { useState } from 'react';
import { Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import footerBg from '../assets/Footer.jpg';

const Footer = ({ destinations = [], onSelectDestination, setCurrentView, setActiveSection }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const popularDests = destinations.filter(dest => dest.is_popular);

  return (
    <footer id="contact" className="relative isolate mt-16 overflow-hidden bg-slate-950 text-slate-300">
      {/* Background Image */}
      <img
        src={footerBg}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20"
      />

      <div className="mx-auto max-w-7xl px-6 py-14">

        {/* ── Newsletter Banner ── */}
        <div className="grid gap-8 border-b border-navy-foreground/15 pb-10 md:grid-cols-2">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
              Let's make your next journey<br />
              <span className="italic font-serif text-amber-400">extraordinary</span>
            </h3>
          </div>

          <div className="md:justify-self-end">
            <p className="text-xs text-slate-300 mb-2 font-medium">
              Subscribe to get exclusive travel deals &amp; latest updates
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-56 sm:w-64 px-4 py-2.5 rounded-l-lg bg-white/10 border border-white/20 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-amber-400 backdrop-blur-sm"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-r-lg bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs transition-all shrink-0 border border-amber-500"
              >
                {subscribed ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Done!
                  </span>
                ) : (
                  'SUBSCRIBE'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* ── Main 5‑Column Grid ── */}
        <div className="grid grid-cols-2 gap-8 pt-10 md:grid-cols-5 text-xs">

          {/* Col 1 — Brand / Logo */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">LOGO</h2>
            <p className="text-slate-300 leading-relaxed font-light text-[11px]">
              Curating journeys that<br />
              inspire and memories that<br />
              last a lifetime.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              {/* Facebook */}
              <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              {/* Instagram */}
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              {/* YouTube */}
              <a href="#" aria-label="YouTube" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              {/* Pinterest */}
              <a href="#" aria-label="Pinterest" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">Quick Links</h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button onClick={() => { setCurrentView('home'); setActiveSection('all'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('packages'); setActiveSection('ALL'); window.scrollTo(0, 0); }} className="hover:text-amber-400 transition-colors">
                  Packages
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentView('blogs'); window.scrollTo(0, 0); }} className="hover:text-amber-400 transition-colors">
                  Travel Guide
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('admin')} className="hover:text-amber-400 transition-colors">
                  Admin Panel
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 — Top Destinations */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">Top Destinations</h4>
            <ul className="space-y-2 text-slate-300">
              {(popularDests.length > 0
                ? popularDests
                : [
                    { id: 1, name: 'Leh Ladakh' },
                    { id: 2, name: 'Kashmir' },
                    { id: 3, name: 'Himachal Pradesh' },
                    { id: 4, name: 'Rajasthan' },
                    { id: 5, name: 'Kerala' },
                    { id: 6, name: 'Uttarakhand' },
                    { id: 7, name: 'Andaman' },
                    { id: 8, name: 'Goa' },
                    { id: 9, name: 'Meghalaya' },
                    { id: 10, name: 'Sikkim' }
                  ]
              ).slice(0, 10).map((dest) => (
                <li key={dest.id || dest.name}>
                  <button
                    onClick={() => onSelectDestination(dest.name)}
                    className="hover:text-amber-400 transition-colors text-left"
                  >
                    {dest.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Support */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">Support</h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#" className="hover:text-amber-400 transition-colors">FAQ's</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Payment Policy</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Terms &amp; Conditions</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Col 5 — Contact Us */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">Contact Us</h4>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>info@example.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>123, Travel Street, New Delhi, India – 110001</span>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Bottom Bar ── */}
        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-slate-400 font-light">
            © {new Date().getFullYear()} All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
