import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Smartphone } from 'lucide-react';
import { TESTIMONIALS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const AppPromoAndTestimonials: React.FC = () => {
  const { addToast } = useApp();
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);

  const review = TESTIMONIALS[currentReviewIdx];

  const handlePrev = () => {
    setCurrentReviewIdx((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentReviewIdx((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const handleAppDownload = (store: 'App Store' | 'Google Play') => {
    addToast(`TasteHub for ${store} is coming soon! You can also install as a PWA.`, 'info');
  };

  return (
    <section className="bg-white py-12 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Card: Mobile App Promotion (Col 7) */}
          <div className="lg:col-span-7 bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-6 overflow-hidden relative">
            {/* Phone Mockup on Left */}
            <div className="w-44 sm:w-48 shrink-0 relative">
              <div className="w-full aspect-[9/18] rounded-[28px] border-4 border-neutral-800 bg-neutral-900 shadow-xl overflow-hidden p-1.5 flex flex-col justify-between">
                {/* Phone Speaker notch */}
                <div className="w-16 h-3 bg-neutral-800 rounded-full mx-auto mb-1.5 flex items-center justify-center">
                  <div className="w-2.5 h-1 bg-neutral-700 rounded-full" />
                </div>

                {/* Simulated TasteHub App Screen */}
                <div className="flex-1 bg-white rounded-[20px] p-2 flex flex-col justify-between text-neutral-800 overflow-hidden text-[9px]">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-1">
                    <span className="font-extrabold text-[#FF7518]">TasteHub</span>
                    <span className="text-[8px] bg-green-100 text-green-800 px-1 rounded">Fast 25m</span>
                  </div>

                  {/* Food Thumbnails */}
                  <div className="space-y-1.5 my-1">
                    <div className="bg-orange-50 p-1.5 rounded-lg border border-orange-100 flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-md bg-amber-600 flex items-center justify-center text-white text-[8px] font-bold">
                        🍗
                      </div>
                      <div className="flex-1 truncate">
                        <p className="font-bold text-[8px] truncate">Hyderabadi Biryani</p>
                        <p className="text-[#FF7518] font-bold text-[8px]">₹249</p>
                      </div>
                    </div>

                    <div className="bg-neutral-50 p-1.5 rounded-lg border border-neutral-100 flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-md bg-red-600 flex items-center justify-center text-white text-[8px] font-bold">
                        🍕
                      </div>
                      <div className="flex-1 truncate">
                        <p className="font-bold text-[8px] truncate">Margherita Pizza</p>
                        <p className="text-[#FF7518] font-bold text-[8px]">₹299</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Button in App */}
                  <div className="w-full bg-[#FF7518] text-white py-1 rounded-full text-center font-bold text-[8px]">
                    Track Order • Arriving
                  </div>
                </div>

                {/* Bottom Home Indicator */}
                <div className="w-12 h-1 bg-neutral-700 rounded-full mx-auto mt-1" />
              </div>
            </div>

            {/* Right Side Content */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#191919] tracking-tight leading-tight">
                Delicious Food <br />
                At Your Fingertips
              </h3>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Download our app and enjoy exclusive offers, faster ordering and more.
              </p>

              {/* App Store & Google Play Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-2">
                {/* App Store Button */}
                <button
                  type="button"
                  onClick={() => handleAppDownload('App Store')}
                  className="bg-black hover:bg-neutral-800 text-white px-3.5 py-1.5 rounded-xl flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.78 1.06-1.87.94-2.96-.91.04-2.02.61-2.67 1.39-.58.68-1.09 1.78-.96 2.84 1.02.08 2.06-.49 2.69-1.27z" />
                  </svg>
                  <div className="text-left leading-none">
                    <div className="text-[9px] text-neutral-400">Download on the</div>
                    <div className="text-xs font-bold">App Store</div>
                  </div>
                </button>

                {/* Google Play Button */}
                <button
                  type="button"
                  onClick={() => handleAppDownload('Google Play')}
                  className="bg-black hover:bg-neutral-800 text-white px-3.5 py-1.5 rounded-xl flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5.31 0 .61.1.86.28l13.5 8.5c.67.42.87 1.31.45 1.98-.11.18-.27.34-.45.45l-13.5 8.5c-.25.18-.55.28-.86.28-.83 0-1.5-.67-1.5-1.5z" />
                  </svg>
                  <div className="text-left leading-none">
                    <div className="text-[9px] text-neutral-400">GET IT ON</div>
                    <div className="text-xs font-bold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Card: What Our Customers Say (Col 5) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm flex flex-col justify-between">
            {/* Header with Carousel Controls */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#191919] tracking-tight">
                What Our Customers Say
              </h3>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  aria-label="Previous customer review"
                  className="w-7 h-7 rounded-full border border-neutral-200 hover:border-neutral-400 flex items-center justify-center text-neutral-600 transition-colors active:scale-90"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next customer review"
                  className="w-7 h-7 rounded-full border border-neutral-200 hover:border-neutral-400 flex items-center justify-center text-neutral-600 transition-colors active:scale-90"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Testimonial Details */}
            <div className="space-y-4 my-auto py-2">
              <div className="flex items-center gap-3.5">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-orange-100 shadow-sm"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#191919] flex items-center gap-1.5">
                    {review.name}
                    {review.isVerifiedPurchase && (
                      <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </h4>
                  {/* Star Rating */}
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-neutral-600 italic leading-relaxed">
                "{review.comment}"
              </p>

              {review.dishName && (
                <div className="text-[11px] text-neutral-400">
                  Ordered: <span className="font-semibold text-neutral-600">{review.dishName}</span>
                </div>
              )}
            </div>

            {/* Testimonial Page Indicator */}
            <div className="flex items-center gap-1.5 pt-2">
              {TESTIMONIALS.map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => setCurrentReviewIdx(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentReviewIdx === idx ? 'w-6 bg-[#FF7518]' : 'w-1.5 bg-neutral-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
