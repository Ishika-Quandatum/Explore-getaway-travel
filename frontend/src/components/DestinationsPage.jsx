import React from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../api/axios';

const DestinationsPage = ({ destinations, onGoBack, onSelectDestination }) => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center text-slate-400 text-xs mb-4 space-x-2">
            <button onClick={() => onGoBack('home')} className="hover:text-slate-700 transition-colors font-medium">Home</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-amber-600 font-semibold">Destinations</span>
          </div>
          <h1 className="text-3xl font-serif text-slate-900 italic">
            Explore <span className="not-italic">Our</span> Destinations
          </h1>
          <div className="w-12 h-0.5 bg-amber-500 mt-2"></div>
          <p className="text-sm text-slate-500 mt-3 max-w-xl font-light">
            Discover breathtaking places, curated journeys, and stunning spots across India.
          </p>
        </div>
      </div>

      {/* Grid of Dynamic Destination Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {destinations.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-slate-500 text-sm">No destinations available. Check back soon!</p>
            <button onClick={() => onGoBack('home')} className="text-xs font-bold text-amber-600 hover:text-amber-700">
              ← Back to Home
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
            {destinations.map((dest) => (
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
      </div>
    </div>
  );
};

export default DestinationsPage;
