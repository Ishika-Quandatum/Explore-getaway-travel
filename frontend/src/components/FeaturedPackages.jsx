import React from 'react';
import PackageCard from './PackageCard';
import { ArrowRight } from 'lucide-react';

const FeaturedPackages = ({ packages, onSelectPackage, wishlist = [], onWishlistToggle }) => {
  // Let's just show top 8 packages to match a "Featured" section look.
  const featuredPackages = packages.slice(0, 8);

  return (
    <section id="packages" className="scroll-mt-28 mx-auto max-w-7xl px-6 pt-16">
      
      {/* Section Title & View All */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-3xl sm:text-4xl text-slate-900 font-serif">
          Featured Tour Packages
        </h2>
        
        <button 
          onClick={() => {
            const el = document.getElementById('packages');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex items-center gap-2 text-[11px] font-extrabold text-slate-900 uppercase tracking-widest hover:text-amber-500 transition-colors group"
        >
          VIEW ALL PACKAGES
          <div className="w-6 h-6 rounded-full border border-amber-500 flex items-center justify-center text-amber-500 group-hover:bg-amber-50 transition-colors">
            <ArrowRight className="w-3 h-3" />
          </div>
        </button>
      </div>

      {/* Packages Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featuredPackages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            packageItem={pkg}
            onSelectPackage={onSelectPackage}
            isWishlisted={wishlist.includes(pkg.id)}
            onWishlistToggle={onWishlistToggle}
          />
        ))}
      </div>

    </section>
  );
};

export default FeaturedPackages;
