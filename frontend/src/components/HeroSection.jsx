import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import heroImg from '../assets/hero-BTX8PeM0.jpg';
import lehImg from '../assets/leh-CLKe-Tfd.jpg';
import kashmirImg from '../assets/kashmir-CbjWxP5w.jpg';
import andamanImg from '../assets/andaman-BILGAgE8.jpg';

const heroSlides = [
  {
    tagline: 'CURATED EXPERIENCES',
    titleLine1: 'Journeys that',
    highlight: 'Stay',
    titleLine2: 'with you',
    subtitle: 'Curated experiences. Authentic places. Memories to last a lifetime.',
    image: heroImg,
  },
  {
    tagline: 'LADAKH 2026',
    titleLine1: 'Ride the',
    highlight: 'Highest',
    titleLine2: 'passes on earth',
    subtitle: 'Pangong, Nubra and Khardung La with expert-led acclimatisation.',
    image: lehImg,
  },
  {
    tagline: 'VALLEY SEASON',
    titleLine1: 'Wake up on a',
    highlight: 'Houseboat',
    titleLine2: 'in Srinagar',
    subtitle: 'Shikara evenings, saffron fields and the meadows of Gulmarg.',
    image: kashmirImg,
  },
  {
    tagline: 'ISLAND ESCAPES',
    titleLine1: 'Swim in water',
    highlight: 'Bluer',
    titleLine2: 'than the sky',
    subtitle: 'Havelock, Neil and Port Blair with reef snorkelling included.',
    image: andamanImg,
  },
];

const HeroSection = ({ onSearch, onContactUs }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const slide = heroSlides[currentSlide];

  const handleExploreClick = () => {
    const el = document.getElementById('packages-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-start px-6 sm:px-12 lg:px-10 overflow-hidden bg-slate-950">
      
      {/* Background Image with Dark Vignette Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src={slide.image}
          alt="Explore Getaway Hero"
          className="w-full h-full object-cover transition-all duration-700 scale-100"
          style={{ objectPosition: slide.objectPosition || 'center center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/60 to-slate-950/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20" />
      </div>

      {/* Hero Text Content Container */}
      <div className="relative z-10 max-w-3xl space-y-5 pt-4 pb-16 text-left animate-fade-in">
        
        {/* Tracked Tagline */}
        <span className="text-amber-500 uppercase text-xs font-semibold tracking-[0.25em] block">
          {slide.tagline}
        </span>

        {/* Main Serif & Script Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white font-normal leading-tight tracking-tight">
          {slide.titleLine1} <br />
          <span className="text-amber-400 font-serif italic text-5xl sm:text-6xl lg:text-7xl pr-3">
            {slide.highlight}
          </span>
          <span className="font-serif text-white">{slide.titleLine2}</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 font-light max-w-xl leading-relaxed">
          {slide.subtitle}
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center gap-4">
          <button
            onClick={handleExploreClick}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-4 rounded-md transition-all text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-105"
          >
            <span>EXPLORE PACKAGES</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onContactUs}
            className="border border-slate-400/60 hover:border-white hover:bg-white/10 text-white font-bold px-8 py-4 rounded-md transition-all text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <span>CONTACT US</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Carousel Slider Controls (Bottom Left) */}
        <div className="pt-3 flex items-center gap-4">
          <button
            onClick={handlePrevSlide}
            className="w-10 h-10 rounded-full border border-slate-400/50 hover:border-amber-400 flex items-center justify-center text-white hover:bg-amber-400 hover:text-slate-950 transition-colors"
            title="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleNextSlide}
            className="w-10 h-10 rounded-full border border-slate-400/50 hover:border-amber-400 flex items-center justify-center text-white hover:bg-amber-400 hover:text-slate-950 transition-colors"
            title="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dash Progress Indicators */}
          <div className="flex items-center gap-2 ml-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === idx ? 'w-8 bg-amber-500' : 'w-5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default HeroSection;
