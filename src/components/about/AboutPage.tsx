import React from 'react';
import { ChefHat, ShieldCheck, Heart, Sparkles, Award, UtensilsCrossed } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AboutPage: React.FC = () => {
  const { setActivePage } = useApp();

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-24 pb-16">
      {/* Hero */}
      <div className="bg-[#111111] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-800 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF7518]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10 space-y-4">
          <span className="text-xs font-bold text-[#FF7518] uppercase tracking-widest">
            THE TASTEHUB STORY
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Crafting Happiness, <br />
            One Meal At A Time
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Founded with a passion for authentic culinary traditions and blazing fast doorstep delivery.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191919] tracking-tight">
              Rooted in Taste, Driven by Technology
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              TasteHub started with a simple belief: you shouldn't have to compromise on food quality just because you're eating at home. We partner exclusively with master chefs, artisanal bakers, and traditional kitchen houses who pour their heart into authentic recipes.
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              From hand-pounded spices for our slow-cooked Hyderabadi biryanis to 48-hour cold-fermented sourdough pizza crusts, we obsess over every single ingredient. Our proprietary thermal insulation delivery bags ensure food reaches you piping hot, just as the chef intended.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-3">
              <div className="border border-neutral-200 bg-white p-4 rounded-2xl text-center">
                <div className="text-2xl font-extrabold text-[#FF7518]">10+</div>
                <div className="text-[11px] font-bold text-neutral-500 mt-0.5">Cities Served</div>
              </div>
              <div className="border border-neutral-200 bg-white p-4 rounded-2xl text-center">
                <div className="text-2xl font-extrabold text-[#FF7518]">250+</div>
                <div className="text-[11px] font-bold text-neutral-500 mt-0.5">Partner Chefs</div>
              </div>
              <div className="border border-neutral-200 bg-white p-4 rounded-2xl text-center">
                <div className="text-2xl font-extrabold text-[#FF7518]">4.8★</div>
                <div className="text-[11px] font-bold text-neutral-500 mt-0.5">Average Rating</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] bg-neutral-900 border border-neutral-200">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80"
                alt="Chefs in TasteHub kitchen"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-sm font-bold">World-Class Hygiene & Food Standards</p>
                <p className="text-xs text-neutral-300">100% daily temperature-checked culinary staff</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200 shadow-sm space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-2xl font-extrabold text-[#191919]">Our Culinary Standards</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Every dish that leaves our kitchens meets four uncompromising criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-neutral-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF7518] flex items-center justify-center">
                <ChefHat className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900">Artisan Master Chefs</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Recipes perfected over decades by culinary veterans and specialized spice masters.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-neutral-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900">Zero Preservatives</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Fresh farm-sourced vegetables, pure desi ghee, and real dairy—never artificial thickeners.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-neutral-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900">Eco-Friendly Packaging</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                100% biodegradable and heat-retaining meal boxes that prevent spills and protect flavor.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-neutral-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900">Guaranteed Freshness</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Dishes prepared on-demand after order receipt, never pre-cooked or stored in warmers.
              </p>
            </div>
          </div>
        </div>

        {/* CTA to Menu */}
        <div className="bg-[#111111] text-white rounded-3xl p-8 sm:p-12 text-center border border-neutral-800 space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Taste the Difference?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
            Order your favorite dishes now with flat 30% discount on your first order.
          </p>
          <button
            onClick={() => setActivePage('menu')}
            className="px-8 py-3 bg-[#FF7518] hover:bg-[#e0630d] text-white font-bold text-xs sm:text-sm rounded-full shadow-lg transition-all"
          >
            Explore Full Menu →
          </button>
        </div>
      </div>
    </div>
  );
};
