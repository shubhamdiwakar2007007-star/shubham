import React, { useState } from 'react';
import { Search, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Hero: React.FC = () => {
  const {
    selectedCity,
    setIsLocationOpen,
    setSearchQuery,
    setSelectedCategory,
    setActivePage
  } = useApp();

  const [query, setQuery] = useState('');

  const popularChips = ['Biryani', 'Pizza', 'Burger', 'Pasta', 'Sushi'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query.trim());
      setActivePage('menu');
    }
  };

  const handleChipClick = (chip: string) => {
    setQuery(chip);
    setSearchQuery(chip);
    if (chip.toLowerCase() === 'biryani') setSelectedCategory('indian');
    else if (chip.toLowerCase() === 'pizza') setSelectedCategory('pizza');
    else if (chip.toLowerCase() === 'burger') setSelectedCategory('burger');
    else setSelectedCategory('all');

    // Smooth scroll down to featured dishes or navigate to menu
    const element = document.getElementById('featured-dishes');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActivePage('menu');
    }
  };

  return (
    <section className="relative bg-[#111111] text-white pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden border-b border-neutral-900">
      {/* Subtle radial ambient warmth */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FF7518]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 z-10 space-y-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest text-[#FF7518] uppercase">
              <span>DELICIOUS FOOD FOR A BETTER YOU</span>
            </div>

            {/* Main Title matching reference */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Good Food <br />
              Great <span className="text-[#FF7518]">Mood</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-neutral-400 text-base sm:text-lg max-w-lg leading-relaxed">
              Fresh ingredients. Delicious flavors. <br className="hidden sm:inline" />
              Delivered with love.
            </p>

            {/* Search and Discovery Bar (Pill) */}
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-full p-2 sm:p-2.5 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl text-neutral-800"
            >
              {/* Search input */}
              <div className="flex items-center gap-2.5 px-3 flex-1">
                <Search className="w-5 h-5 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for dishes, restaurants..."
                  className="w-full text-sm sm:text-base bg-transparent text-neutral-900 placeholder-neutral-400 focus:outline-none"
                />
              </div>

              {/* Vertical divider on desktop */}
              <div className="hidden sm:block w-[1px] h-7 bg-neutral-200" />

              {/* City selector inside search */}
              <button
                type="button"
                onClick={() => setIsLocationOpen(true)}
                className="flex items-center justify-between sm:justify-start gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors shrink-0"
              >
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#FF7518]" />
                  <span>{selectedCity}</span>
                </div>
                <span className="text-neutral-400 text-xs">⌄</span>
              </button>

              {/* Find Food CTA Button */}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 bg-[#FF7518] hover:bg-[#e0630d] text-white text-sm font-bold rounded-full transition-all shadow-md hover:shadow-orange-500/30 shrink-0 group active:scale-95"
              >
                <span>Find Food</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            {/* Popular Search Chips */}
            <div className="flex items-center flex-wrap gap-2 pt-2 text-xs text-neutral-400">
              <span className="font-semibold text-neutral-300">Popular:</span>
              {popularChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="px-3.5 py-1.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-[#FF7518] border border-neutral-800 hover:border-[#FF7518]/50 transition-all font-medium active:scale-95"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Visual with Biryani Bowl & Slogan */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Handwritten Slogan in Top-Right */}
            <div className="absolute -top-6 right-2 sm:right-6 z-20 text-right pointer-events-none">
              <div className="font-script text-3xl sm:text-4xl text-amber-100/90 leading-tight drop-shadow-lg rotate-[-6deg]">
                Good <br />
                Food <br />
                <span className="text-amber-300">Happier</span> <br />
                Mood
              </div>
            </div>

            {/* Main Dish Presentation in Dark Cinematic Setting */}
            <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center">
              {/* Backglow disc */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-amber-600/20 via-orange-600/20 to-transparent blur-2xl" />

              {/* Wooden Board & Rustic Table base effect */}
              <div className="relative w-full h-full rounded-3xl p-3 bg-gradient-to-b from-stone-900/90 via-[#181818] to-stone-950 border border-neutral-800/80 shadow-2xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900&auto=format&fit=crop&q=80"
                  alt="Royal Dum Biryani"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    // Fallback to local reference image if remote image fails
                    (e.target as HTMLImageElement).src = '/assets/aistudio/Modern_Food_Delivery_Website_UI_Design___TasteHub_0ea4e74c.jpg';
                  }}
                />

                {/* Gradient vignette scrim */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Animated Steam Elements */}
                <div className="absolute top-10 left-1/3 -translate-x-1/2 flex gap-4 pointer-events-none opacity-60">
                  <div className="w-1 h-12 bg-gradient-to-t from-white/40 to-transparent rounded-full blur-[1px] animate-pulse" />
                  <div className="w-1.5 h-16 bg-gradient-to-t from-amber-100/50 to-transparent rounded-full blur-[2px] animate-pulse delay-300" />
                  <div className="w-1 h-10 bg-gradient-to-t from-white/40 to-transparent rounded-full blur-[1px] animate-pulse delay-700" />
                </div>

                {/* Dish Badge on Bottom */}
                <div className="absolute bottom-4 left-4 right-4 bg-neutral-900/90 backdrop-blur-md border border-neutral-700/60 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <p className="text-xs font-bold text-white">Hyderabadi Dum Biryani</p>
                    </div>
                    <p className="text-[11px] text-neutral-400">Slow-cooked in royal brass handi</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-neutral-400 line-through mr-1">₹320</span>
                    <span className="text-sm font-extrabold text-[#FF7518]">₹249</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
