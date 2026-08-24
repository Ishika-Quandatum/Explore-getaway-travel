import React from 'react';
import { Star, ArrowRight, Heart, Users } from 'lucide-react';
import { getImageUrl } from '../api/axios';

const PackageCard = ({ packageItem, onSelectPackage, isWishlisted, onWishlistToggle }) => {
  const getBadgeStyle = (badge) => {
    switch (badge?.toUpperCase()) {
      case 'BEST SELLER':
        return 'bg-amber-500 text-slate-900';
      case 'POPULAR':
        return 'bg-emerald-600 text-white';
      case 'TRENDING':
        return 'bg-sky-500 text-white';
      case 'GREAT DEAL':
        return 'bg-purple-500 text-white';
      case 'NEW ARRIVAL':
        return 'bg-indigo-600 text-white';
      case 'PREMIUM':
        return 'bg-slate-900 text-amber-400';
      case 'SEASONAL':
        return 'bg-teal-600 text-white';
      case 'MOST LOVED':
        return 'bg-rose-600 text-white';
      case 'ADVENTURE':
        return 'bg-orange-600 text-white';
      case 'HONEYMOON':
      case 'COUPLES':
        return 'bg-rose-600 text-white';
      case 'ISLAND':
        return 'bg-cyan-500 text-white';
      default:
        return 'bg-amber-500 text-slate-900';
    }
  };

  const badgeText = packageItem.badge_text || 'BEST SELLER';

  return (
    <div
      onClick={() => onSelectPackage(packageItem)}
      className="bg-white rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-xl cursor-pointer transition-all duration-300 flex flex-col group overflow-hidden border border-slate-100"
    >
      {/* Image Wrapper */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={getImageUrl(packageItem.image_url)}
          alt={packageItem.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* Badge Tag */}
        <div className="absolute top-4 left-4">
          <span className={`px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase rounded-sm shadow-sm ${getBadgeStyle(badgeText)}`}>
            {badgeText}
          </span>
        </div>

        {/* Heart Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onWishlistToggle) onWishlistToggle(packageItem);
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-white transition-colors z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted
                ? 'fill-rose-500 text-rose-500'
                : 'text-slate-500 hover:text-rose-500'
            }`}
          />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Duration */}
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>{packageItem.duration_nights} Nights / {packageItem.duration_days} Days</span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-[22px] font-medium text-slate-900 group-hover:text-amber-600 transition-colors leading-tight line-clamp-1">
            {packageItem.title}
          </h3>

          {/* Location Summary */}
          <p className="text-[13px] text-slate-500 truncate">
            {packageItem.location_summary}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-[13px]">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span className="font-medium text-slate-700">{packageItem.rating !== undefined && packageItem.rating !== null ? packageItem.rating : '4.5'}</span>
            <span className="text-slate-400">({packageItem.reviews_count || 50} reviews)</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1 truncate">
            <span className="text-[17px] sm:text-lg font-extrabold text-slate-900">
              ₹{Number(packageItem.price_per_person).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">/ person</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectPackage(packageItem);
            }}
            className="px-3 py-1.5 rounded-sm bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1 shadow-sm whitespace-nowrap shrink-0"
          >
            VIEW DETAILS
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
