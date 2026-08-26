import React from 'react';
import PackageCard from './PackageCard';
import { ChevronRight } from 'lucide-react';

const FeaturedPackages = ({
  packages,
  onSelectPackage,
  wishlist = [],
  onWishlistToggle,
  onViewAllPackages,
}) => {
  // Let's just show top 8 packages to match a "Featured" section look.
  const featuredPackages = packages.slice(0, 8);

  const handleViewAll = () => {
    if (onViewAllPackages) {
      onViewAllPackages();
    } else {
      const el = document.getElementById('packages-section') || document.getElementById('packages');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="packages-section" className="scroll-mt-28 mx-auto max-w-7xl px-6 pt-16">
      
      {/* Section Title & View All */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-slate-900 tracking-tight">
            Featured Tour Packages
          </h2>
          <div className="w-12 h-0.5 bg-amber-500 mt-2"></div>
        </div>
        
        <button 
          onClick={handleViewAll}
          className="flex items-center gap-2 text-xs font-semibold text-slate-900 uppercase tracking-wider hover:text-amber-500 transition-colors group cursor-pointer"
        >
          VIEW ALL PACKAGES
          <span className="grid h-6 w-6 place-items-center rounded-full border border-amber-500 text-amber-500 group-hover:bg-amber-50 transition-colors shrink-0">
            <ChevronRight className="w-3 h-3" />
          </span>
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
