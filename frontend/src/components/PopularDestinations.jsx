import React from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../api/axios';

const PopularDestinations = ({ destinations, onSelectDestination, onViewAllDestinations }) => {
  // If there are more than 14 destinations in the backend, show only the first 14.
  // If there are 14 or fewer destinations, display all available destinations.
  const popularDestinations = destinations.slice(0, 14);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      {/* Centered Heading with Decorative Line and Right Aligned View All */}
      <div className="relative text-center">
        <h2 className="text-2xl sm:text-3xl font-serif text-slate-800 tracking-wide font-medium">
          Popular Destinations
        </h2>
        <div className="w-16 h-[2px] bg-amber-500 mx-auto mt-4"></div>
        <div className="absolute right-0 bottom-[-40px] sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 z-10">
          <button
            onClick={onViewAllDestinations}
            className="flex items-center gap-2 text-xs font-semibold text-slate-900 uppercase tracking-wider hover:text-amber-500 transition-colors group cursor-pointer"
          >
            VIEW ALL DESTINATIONS
            <span className="grid h-6 w-6 place-items-center rounded-full border border-amber-500 text-amber-500 group-hover:bg-amber-50 transition-colors shrink-0">
              <ChevronRight className="w-3 h-3" />
            </span>
          </button>
        </div>
      </div>

      {/* Grid of Dynamic Destination Cards */}
      {popularDestinations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400 mt-8">
          No destinations marked as popular yet.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {popularDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => onSelectDestination(dest.name)}
              className="group relative block h-44 overflow-hidden rounded-sm shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer"
            >
              {dest.image_url ? (
                <img
                  src={getImageUrl(dest.image_url)}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <MapPin className="w-8 h-8" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
                </div>
              )}
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent group-hover:from-black/95 transition-all duration-300" />

              {/* Bottom Content */}
              <div className="absolute bottom-0 inset-x-0 p-4 text-white text-left">
                <h3 className="text-sm font-bold text-white mb-0.5">
                  {dest.name}
                </h3>
                <p className="text-[10px] text-white/80 line-clamp-2 leading-relaxed">
                  {dest.subtitle || dest.description || 'Explore Destination'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PopularDestinations;
