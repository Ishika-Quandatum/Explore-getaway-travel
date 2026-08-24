import React, { useState, useEffect } from 'react';
import PackageCard from './PackageCard';
import { Filter } from 'lucide-react';

const PackagesPage = ({
  packages = [],
  categories = [],
  destinations = [],
  selectedCategory = 'ALL',
  onSelectCategory,
  onSelectPackage,
  wishlist = [],
  onWishlistToggle,
}) => {
  const [activeCategory, setActiveCategory] = useState(selectedCategory || 'ALL');
  const [selectedDestination, setSelectedDestination] = useState('All destinations');

  useEffect(() => {
    if (selectedCategory) {
      setActiveCategory(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeCategory]);

  // Dynamically build category pills based strictly on Admin categories
  const allCategoryPills = ['ALL'];
  if (Array.isArray(categories) && categories.length > 0) {
    categories.forEach(cat => {
      if (cat && cat.name) {
        const uppercaseName = String(cat.name).toUpperCase();
        if (!allCategoryPills.includes(uppercaseName)) {
          allCategoryPills.push(uppercaseName);
        }
      }
    });
  } else {
    // Fallback if categories are loading or empty
    const fallbackCategories = ['FAMILY', 'HONEYMOON', 'FRIENDS', 'ADVENTURE', 'GROUP TOURS'];
    fallbackCategories.forEach(name => {
      if (!allCategoryPills.includes(name)) {
        allCategoryPills.push(name);
      }
    });
  }

  // Dynamically build destination pills
  const allDestinations = ['All destinations'];
  if (Array.isArray(destinations) && destinations.length > 0) {
    destinations.forEach(dest => {
      if (dest && dest.name) {
        const dName = String(dest.name);
        if (!allDestinations.some(d => d.toLowerCase() === dName.toLowerCase())) {
          allDestinations.push(dName);
        }
      }
    });
  } else {
    const defaultDest = [
      'Leh Ladakh', 'Kashmir', 'Himachal Pradesh', 'Rajasthan',
      'Kerala', 'Uttarakhand', 'Andaman', 'Goa', 'Meghalaya', 'Sikkim'
    ];
    allDestinations.push(...defaultDest);
  }

  const handleCategoryClick = (catName) => {
    setActiveCategory(catName);
    if (onSelectCategory) {
      onSelectCategory(catName);
    }
  };

  const normalizeCat = (str) => String(str || '').replace(/\s+/g, '').toUpperCase();

  const getPackageCategoryName = (pkg, categoriesList = []) => {
    if (!pkg) return '';

    if (pkg.category_details && pkg.category_details.name) {
      return String(pkg.category_details.name).trim();
    }

    if (pkg.category && typeof pkg.category === 'object' && pkg.category.name) {
      return String(pkg.category.name).trim();
    }

    if (typeof pkg.category === 'string' && isNaN(Number(pkg.category))) {
      return pkg.category.trim();
    }

    if (pkg.category && (typeof pkg.category === 'number' || !isNaN(Number(pkg.category)))) {
      const catObj = categoriesList.find(c => String(c.id) === String(pkg.category));
      if (catObj && catObj.name) return String(catObj.name).trim();
    }

    return '';
  };

  // Filtering Logic
  const filteredPackages = packages.filter(pkg => {
    if (!pkg) return false;

    // 1. Category Matching
    let matchCat = true;
    if (activeCategory && activeCategory.trim().toUpperCase() !== 'ALL') {
      const activeNormalized = normalizeCat(activeCategory);
      const pkgCatName = getPackageCategoryName(pkg, categories);
      const pkgNormalized = normalizeCat(pkgCatName);

      matchCat = (pkgNormalized === activeNormalized);
    }

    // 2. Destination Matching
    let matchDest = true;
    if (selectedDestination && selectedDestination.toLowerCase() !== 'all destinations') {
      const targetDest = selectedDestination.toLowerCase();
      let destNameStr = '';
      if (pkg.destination) {
        if (typeof pkg.destination === 'object' && pkg.destination.name) {
          destNameStr = String(pkg.destination.name);
        } else if (typeof pkg.destination === 'string') {
          destNameStr = pkg.destination;
        }
      }
      if (!destNameStr && pkg.destination_details?.name) {
        destNameStr = String(pkg.destination_details.name);
      }

      const locSummary = pkg.location_summary ? String(pkg.location_summary) : '';
      const title = pkg.title ? String(pkg.title) : '';

      matchDest = destNameStr.toLowerCase().includes(targetDest) ||
                 locSummary.toLowerCase().includes(targetDest) ||
                 title.toLowerCase().includes(targetDest);
    }

    return matchCat && matchDest;
  });

  const getPageTitle = () => {
    if (!activeCategory || activeCategory.toUpperCase() === 'ALL') {
      return 'All Tour Packages';
    }
    if (activeCategory.toUpperCase() === 'BESTSELLER') {
      return 'Bestseller Packages';
    }
    
    const formatted = activeCategory
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return `${formatted} Packages`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* Dark Hero Banner */}
      <div className="bg-[#0B132B] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="text-amber-400 text-xs font-extrabold tracking-widest uppercase">
            EXPLORE
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white font-normal tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-light pt-1">
            {filteredPackages.length} handcrafted itineraries with day-wise plans, transparent inclusions and flexible sharing options.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Category Pills Bar */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {allCategoryPills.map((catName) => {
            const isActive = activeCategory.trim().toUpperCase() === catName.trim().toUpperCase();
            return (
              <button
                key={catName}
                onClick={() => handleCategoryClick(catName)}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold tracking-wider uppercase whitespace-nowrap transition-all shadow-sm ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {catName}
              </button>
            );
          })}
        </div>

        {/* Destination Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {allDestinations.map((destName) => {
            const isActive = selectedDestination.trim().toLowerCase() === destName.trim().toLowerCase();
            return (
              <button
                key={destName}
                onClick={() => setSelectedDestination(destName)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-600 border border-amber-500/50 font-bold'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {destName}
              </button>
            );
          })}
        </div>

        {/* Packages Grid */}
        {filteredPackages.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-2">
            {filteredPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                packageItem={pkg}
                onSelectPackage={onSelectPackage}
                isWishlisted={wishlist.includes(pkg.id)}
                onWishlistToggle={onWishlistToggle}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4 my-6">
            <Filter className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-xl font-bold text-slate-800">No Packages Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              No tour packages found matching your current category and destination filters.
            </p>
            <button
              onClick={() => {
                setActiveCategory('ALL');
                setSelectedDestination('All destinations');
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors"
            >
              Show All Packages
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default PackagesPage;
