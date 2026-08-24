import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { getImageUrl } from '../api/axios';

const CuratedCollections = ({ categories = [], onFilterCategory }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef(null);

  const cardsPerSlide = 2;
  const totalSlides = Math.ceil(categories.length / cardsPerSlide);
  const hasCarousel = totalSlides > 1;

  // Build slides: chunk categories into groups of 2
  const slides = [];
  for (let i = 0; i < categories.length; i += cardsPerSlide) {
    slides.push(categories.slice(i, i + cardsPerSlide));
  }

  const goTo = useCallback((idx) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(idx);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const goNext = useCallback(() => {
    goTo(currentSlide >= totalSlides - 1 ? 0 : currentSlide + 1);
  }, [currentSlide, totalSlides, goTo]);

  // Auto-play
  useEffect(() => {
    if (!hasCarousel) return;
    autoPlayRef.current = setInterval(goNext, 4500);
    return () => clearInterval(autoPlayRef.current);
  }, [hasCarousel, goNext]);

  const pauseAutoPlay = () => clearInterval(autoPlayRef.current);
  const resumeAutoPlay = () => {
    if (!hasCarousel) return;
    clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(goNext, 4500);
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 pt-16">
      <div
        className="relative"
        onMouseEnter={pauseAutoPlay}
        onMouseLeave={resumeAutoPlay}
      >
        {/* Slides Container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slideCards, slideIdx) => (
              <div
                key={slideIdx}
                className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {slideCards.map((cat) => (
                  <a
                    key={cat.id}
                    href={`/packages?category=${cat.name}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onFilterCategory(cat.name);
                    }}
                    className="group relative isolate block overflow-hidden rounded-sm"
                  >
                    {/* Image */}
                    <img
                      src={getImageUrl(cat.image_url)}
                      alt={cat.name}
                      loading="lazy"
                      className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />

                    {/* Text Content */}
                    <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
                      <p className="font-script text-2xl text-amber-500 tracking-wide mb-1">
                        {cat.display_label_text || 'For everyone'}
                      </p>
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
                        {cat.name} Packages
                      </h3>
                      {cat.description && (
                        <p className="text-slate-300 text-xs font-light leading-relaxed max-w-sm line-clamp-2">
                          {cat.description}
                        </p>
                      )}
                      <div className="pt-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white uppercase tracking-wider group-hover:text-amber-400 transition-colors">
                          EXPLORE NOW
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Dot Indicators — only when carousel is active */}
        {hasCarousel && (
          <div className="flex items-center justify-center gap-2 mt-5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? 'w-7 bg-amber-500'
                    : 'w-3 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CuratedCollections;
