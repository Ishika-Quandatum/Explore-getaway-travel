import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { getImageUrl } from '../api/axios';

const OfferCoupons = ({ coupons = [], onFilterCategory }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Filter only active coupons
  const activeCoupons = coupons?.filter((c) => c.is_active) || [];

  // Auto-play carousel every 5 seconds if there are multiple active coupons
  useEffect(() => {
    if (activeCoupons.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activeCoupons.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeCoupons.length]);

  if (activeCoupons.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 pt-8">
        <div 
          className="relative rounded-lg overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 h-[260px] sm:h-[240px] shadow-md border border-slate-800/20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/75 to-slate-900/30" />

          <div className="relative z-10 h-full flex flex-col gap-6 p-8 text-white md:flex-row md:items-center md:justify-between md:p-12">
            <div className="max-w-xl text-left">
              <span className="text-[10px] tracking-widest uppercase font-bold text-slate-350 bg-white/10 px-2.5 py-1 rounded-md">
                STAY TUNED
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-medium mt-3 mb-2">
                Offers Coming Soon
              </h2>
              <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
                We are designing exclusive seasonal travel deals and flash sales just for you. Keep checking back or explore our curated packages to start planning today!
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-start md:items-end gap-4 shrink-0">
              <button
                onClick={() => {
                  const el = document.getElementById('packages-section') || document.getElementById('packages');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              >
                EXPLORE PACKAGES
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentCoupon = activeCoupons[activeIndex];
  const bgImage = currentCoupon.image_url ? getImageUrl(currentCoupon.image_url) : '';

  return (
    <section className="mx-auto max-w-7xl px-6 pt-8">
      <div 
        className="relative rounded-lg overflow-hidden bg-slate-900 bg-cover bg-center h-[260px] sm:h-[240px] shadow-md border border-slate-800/10 transition-all duration-700 ease-in-out"
        style={bgImage ? { backgroundImage: `url('${bgImage}')` } : {}}
      >
        {/* Dark Navy/Slate Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/70 to-slate-900/20" />

        <div className="relative z-10 h-full flex flex-col gap-6 p-8 text-white md:flex-row md:items-center md:justify-between md:p-12">
          
          {/* Left Column: Heading and Info */}
          <div className="max-w-xl text-left flex flex-col justify-center">
            <span className="text-[10px] tracking-widest uppercase font-bold text-amber-500">
              LIMITED TIME OFFER
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium mt-1 mb-2">
              {currentCoupon.heading}
            </h2>
            <p className="text-slate-200 text-sm sm:text-base font-light leading-relaxed">
              {currentCoupon.description}
            </p>
            
            {/* Promo Code Box with Dashed Border and rounded-md */}
            <div className="mt-4">
              <span className="inline-block border border-dashed border-amber-500/60 px-3 py-1.5 rounded-md text-xs uppercase tracking-wider bg-black/30 font-mono text-amber-400 font-semibold">
                CODE: {currentCoupon.offer_code}
              </span>
            </div>
          </div>

          {/* Right Column: Button & Carousel Indicator */}
          <div className="flex flex-col items-center sm:items-start md:items-end gap-4 shrink-0 justify-center">
            
            {/* Solid Amber Button with rounded-lg and dark text */}
            <button
              onClick={() => onFilterCategory('all')}
              className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 hover:scale-105"
            >
              GRAB THIS DEAL
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            {/* Carousel indicator line dots */}
            {activeCoupons.length > 1 && (
              <div className="flex gap-2.5 mt-2">
                {activeCoupons.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-1 transition-all duration-350 ${
                      idx === activeIndex 
                        ? 'w-6 bg-amber-500' 
                        : 'w-4 bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
};

export default OfferCoupons;
