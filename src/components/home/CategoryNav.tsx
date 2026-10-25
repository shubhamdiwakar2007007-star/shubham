import React from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';

// Custom circular illustration badges for each category to match reference image faithfully
const CategoryCircle: React.FC<{ categoryId: string; isActive: boolean }> = ({ categoryId, isActive }) => {
  switch (categoryId) {
    case 'all':
      return (
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
          isActive
            ? 'border-2 border-[#FF7518] bg-orange-50 shadow-md shadow-orange-500/20 scale-105'
            : 'border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm'
        }`}>
          <div className="grid grid-cols-2 gap-1.5 p-2">
            <span className={`w-3 h-3 rounded-sm ${isActive ? 'bg-[#FF7518]' : 'border-2 border-[#FF7518]'}`} />
            <span className={`w-3 h-3 rounded-sm ${isActive ? 'bg-[#FF7518]' : 'border-2 border-[#FF7518]'}`} />
            <span className={`w-3 h-3 rounded-sm ${isActive ? 'bg-[#FF7518]' : 'border-2 border-[#FF7518]'}`} />
            <span className={`w-3 h-3 rounded-sm ${isActive ? 'bg-[#FF7518]' : 'border-2 border-[#FF7518]'}`} />
          </div>
        </div>
      );

    case 'indian':
      return (
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-300 overflow-hidden ${
          isActive ? 'ring-2 ring-[#FF7518] shadow-md shadow-orange-500/20 scale-105' : 'border border-neutral-200 hover:border-neutral-300'
        }`}>
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-500 flex items-center justify-center shadow-inner overflow-hidden">
            <svg viewBox="0 0 36 36" className="w-10 h-10 drop-shadow">
              <circle cx="18" cy="18" r="14" fill="#1C1917" />
              <circle cx="18" cy="18" r="10" fill="#D97706" />
              <circle cx="14" cy="15" r="2.5" fill="#DC2626" />
              <circle cx="22" cy="16" r="2.5" fill="#16A34A" />
              <circle cx="18" cy="22" r="3" fill="#FBBF24" />
            </svg>
          </div>
        </div>
      );

    case 'pizza':
      return (
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-300 overflow-hidden ${
          isActive ? 'ring-2 ring-[#FF7518] shadow-md shadow-orange-500/20 scale-105' : 'border border-neutral-200 hover:border-neutral-300'
        }`}>
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-orange-100 to-amber-100 flex items-center justify-center shadow-inner">
            <svg viewBox="0 0 36 36" className="w-12 h-12 drop-shadow">
              <path d="M7 10 C 14 7, 24 7, 30 10 L 18 31 Z" fill="#D97706" />
              <path d="M9 12 C 15 9, 23 9, 28 12 L 18 28 Z" fill="#EF4444" />
              <circle cx="15" cy="15" r="2" fill="#FEF08A" />
              <circle cx="21" cy="16" r="2.5" fill="#DC2626" />
              <circle cx="18" cy="22" r="1.8" fill="#FEF08A" />
              <circle cx="16" cy="19" r="1.2" fill="#16A34A" />
            </svg>
          </div>
        </div>
      );

    case 'burger':
      return (
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-300 overflow-hidden ${
          isActive ? 'ring-2 ring-[#FF7518] shadow-md shadow-orange-500/20 scale-105' : 'border border-neutral-200 hover:border-neutral-300'
        }`}>
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-50 to-orange-100 flex items-center justify-center shadow-inner">
            <svg viewBox="0 0 36 36" className="w-11 h-11 drop-shadow">
              <path d="M9 16 C 9 9, 27 9, 27 16 Z" fill="#F59E0B" />
              <rect x="7" y="17" width="22" height="2.5" rx="1.2" fill="#16A34A" />
              <rect x="8" y="20.5" width="20" height="3.5" rx="1.5" fill="#78350F" />
              <path d="M8 25 L 28 25 L 25 29 L 11 29 Z" fill="#D97706" />
              <circle cx="14" cy="13" r="1" fill="#FEF3C7" />
              <circle cx="19" cy="12" r="1" fill="#FEF3C7" />
              <circle cx="23" cy="13.5" r="1" fill="#FEF3C7" />
            </svg>
          </div>
        </div>
      );

    case 'chinese':
      return (
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-300 overflow-hidden ${
          isActive ? 'ring-2 ring-[#FF7518] shadow-md shadow-orange-500/20 scale-105' : 'border border-neutral-200 hover:border-neutral-300'
        }`}>
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-stone-100 to-amber-100 flex items-center justify-center shadow-inner">
            <svg viewBox="0 0 36 36" className="w-11 h-11 drop-shadow">
              <ellipse cx="18" cy="22" rx="12" ry="7" fill="#292524" />
              <ellipse cx="18" cy="21" rx="10" ry="5" fill="#D97706" />
              <path d="M12 20 Q18 16 24 20" stroke="#FEF08A" strokeWidth="2" fill="none" />
              <path d="M13 22 Q18 18 23 22" stroke="#FEF08A" strokeWidth="2" fill="none" />
              {/* chopsticks */}
              <line x1="8" y1="8" x2="26" y2="24" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="12" y1="6" x2="28" y2="22" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      );

    case 'south-indian':
      return (
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-300 overflow-hidden ${
          isActive ? 'ring-2 ring-[#FF7518] shadow-md shadow-orange-500/20 scale-105' : 'border border-neutral-200 hover:border-neutral-300'
        }`}>
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-50 to-yellow-100 flex items-center justify-center shadow-inner">
            <svg viewBox="0 0 36 36" className="w-11 h-11 drop-shadow">
              {/* Dosa roll */}
              <rect x="6" y="16" width="24" height="6" rx="3" transform="rotate(-15 18 19)" fill="#D97706" />
              <rect x="7" y="17" width="22" height="4" rx="2" transform="rotate(-15 18 19)" fill="#F59E0B" />
              {/* Chutney katoris */}
              <circle cx="12" cy="27" r="3.5" fill="#FFFFFF" stroke="#E5E7EB" />
              <circle cx="12" cy="27" r="2.5" fill="#F3F4F6" />
              <circle cx="24" cy="27" r="3.5" fill="#FFFFFF" stroke="#E5E7EB" />
              <circle cx="24" cy="27" r="2.5" fill="#EA580C" />
            </svg>
          </div>
        </div>
      );

    case 'desserts':
      return (
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-300 overflow-hidden ${
          isActive ? 'ring-2 ring-[#FF7518] shadow-md shadow-orange-500/20 scale-105' : 'border border-neutral-200 hover:border-neutral-300'
        }`}>
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-stone-100 to-amber-100 flex items-center justify-center shadow-inner">
            <svg viewBox="0 0 36 36" className="w-11 h-11 drop-shadow">
              {/* Cake slice */}
              <path d="M10 24 L 27 24 L 27 15 L 18 11 Z" fill="#451A03" />
              <path d="M10 24 L 18 11 L 27 15" stroke="#78350F" strokeWidth="1" fill="#78350F" />
              <line x1="10" y1="20" x2="27" y2="20" stroke="#FDE047" strokeWidth="1.5" />
              <circle cx="18" cy="9" r="2.5" fill="#DC2626" />
            </svg>
          </div>
        </div>
      );

    case 'beverages':
      return (
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-300 overflow-hidden ${
          isActive ? 'ring-2 ring-[#FF7518] shadow-md shadow-orange-500/20 scale-105' : 'border border-neutral-200 hover:border-neutral-300'
        }`}>
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-red-50 to-orange-100 flex items-center justify-center shadow-inner">
            <svg viewBox="0 0 36 36" className="w-11 h-11 drop-shadow">
              {/* Beverage glass with ice and straw */}
              <path d="M12 12 L 14 28 L 22 28 L 24 12 Z" fill="#EF4444" fillOpacity="0.8" />
              <path d="M12 10 L 24 10 L 22 28 L 14 28 Z" stroke="#374151" strokeWidth="1.5" fill="none" />
              <line x1="19" y1="6" x2="26" y2="2" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
              <line x1="17" y1="18" x2="19" y2="6" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      );

    case 'healthy':
      return (
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-300 overflow-hidden ${
          isActive ? 'ring-2 ring-[#FF7518] shadow-md shadow-orange-500/20 scale-105' : 'border border-neutral-200 hover:border-neutral-300'
        }`}>
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-emerald-50 to-green-100 flex items-center justify-center shadow-inner">
            <svg viewBox="0 0 36 36" className="w-11 h-11 drop-shadow">
              <ellipse cx="18" cy="22" rx="11" ry="6" fill="#F3F4F6" stroke="#D1D5DB" />
              <path d="M11 20 C 13 14, 23 14, 25 20 Z" fill="#16A34A" />
              <circle cx="15" cy="18" r="1.5" fill="#DC2626" />
              <circle cx="21" cy="17" r="1.5" fill="#DC2626" />
              <circle cx="18" cy="19" r="1.2" fill="#FBBF24" />
            </svg>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export const CategoryNav: React.FC = () => {
  const { selectedCategory, setSelectedCategory, setActivePage } = useApp();

  const handleSelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  return (
    <section className="bg-white py-8 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Horizontal scroll container with hidden scrollbar */}
        <div className="flex items-center justify-start sm:justify-center gap-6 sm:gap-8 overflow-x-auto pb-2 scrollbar-none px-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className="flex flex-col items-center gap-2 group shrink-0 focus:outline-none"
              >
                <CategoryCircle categoryId={cat.id} isActive={isActive} />
                <span
                  className={`text-xs sm:text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-[#FF7518]'
                      : 'text-neutral-600 group-hover:text-neutral-900'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
