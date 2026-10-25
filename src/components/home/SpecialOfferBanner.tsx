import React, { useState } from 'react';
import { Copy, Check, ArrowRight, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SpecialOfferBanner: React.FC = () => {
  const { applyCoupon, setActivePage, addToast } = useApp();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('TASTE30');
    setCopied(true);
    applyCoupon('TASTE30');
    addToast('Coupon code "TASTE30" copied and applied!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#111111] text-white overflow-hidden shadow-xl border border-neutral-800">
          {/* Ambient decorative glow */}
          <div className="absolute top-0 right-1/3 w-80 h-80 bg-[#FF7518]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 z-10">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-[#FF7518]" />
                <span>Special Offer</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Flat 30% OFF
              </h2>

              <p className="text-neutral-400 text-sm sm:text-base font-medium">
                On Your First Order
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* Coupon Code Pill with Copy */}
                <div className="flex items-center bg-neutral-900 border border-neutral-700/80 rounded-full px-4 py-2 text-xs sm:text-sm text-neutral-200 shadow-inner">
                  <span className="text-neutral-400 mr-2">Use Code</span>
                  <span className="font-extrabold tracking-wider text-white mr-2">
                    TASTE30
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    aria-label="Copy coupon code"
                    className="p-1 hover:text-[#FF7518] text-neutral-400 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Order Now CTA Button */}
                <button
                  type="button"
                  onClick={() => setActivePage('menu')}
                  className="px-6 py-2.5 bg-[#FF7518] hover:bg-[#e0630d] text-white text-xs sm:text-sm font-bold rounded-full shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 group active:scale-95"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Right Visual: Sizzling Wok Dish & Handwritten Script */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Handwritten Script */}
              <div className="absolute -top-4 right-2 sm:right-6 z-20 pointer-events-none text-right">
                <div className="font-script text-3xl sm:text-4xl text-amber-100/90 leading-tight drop-shadow rotate-[-4deg]">
                  Good <br />
                  Food <br />
                  <span className="text-amber-300">Better</span> <br />
                  Days
                </div>
              </div>

              {/* Sizzling Noodles / Wok Dish Image */}
              <div className="relative w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1585032226651-759b368d7246?w=700&auto=format&fit=crop&q=80"
                  alt="Wok Tossed Noodles"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/aistudio/Modern_Food_Delivery_Website_UI_Design___TasteHub_0ea4e74c.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                {/* Steam effect */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-none opacity-50">
                  <div className="w-1 h-8 bg-white/40 rounded-full blur-[1px] animate-pulse" />
                  <div className="w-1.5 h-10 bg-amber-200/50 rounded-full blur-[2px] animate-pulse delay-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
