import React, { useState } from 'react';

interface FoodImageProps {
  src: string;
  alt: string;
  category?: string;
  className?: string;
  containerClassName?: string;
}

export const FoodImage: React.FC<FoodImageProps> = ({
  src,
  alt,
  category = 'indian',
  className = 'w-full h-full object-cover',
  containerClassName = 'w-full h-full relative overflow-hidden bg-neutral-900'
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // High quality SVG culinary art fallback based on dish/category
  const renderFallbackIcon = () => {
    const cat = category.toLowerCase();
    if (cat.includes('biryani') || alt.toLowerCase().includes('biryani')) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-950 via-stone-900 to-black text-amber-500 p-4">
          <svg className="w-16 h-16 mb-2 drop-shadow-md" viewBox="0 0 64 64" fill="none">
            <ellipse cx="32" cy="42" rx="26" ry="14" fill="#B45309" />
            <ellipse cx="32" cy="40" rx="24" ry="11" fill="#D97706" />
            <path d="M16 38 Q32 20 48 38" fill="#F59E0B" />
            <circle cx="28" cy="30" r="3" fill="#78350F" />
            <circle cx="36" cy="28" r="4" fill="#92400E" />
            <circle cx="24" cy="34" r="2.5" fill="#15803D" />
            <circle cx="38" cy="35" r="2" fill="#DC2626" />
            {/* steam lines */}
            <path d="M26 18 Q28 12 25 8" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <path d="M33 16 Q36 10 32 6" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            <path d="M40 18 Q42 12 39 8" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          </svg>
          <span className="text-xs font-semibold text-amber-200 uppercase tracking-wider">{alt}</span>
        </div>
      );
    }
    if (cat.includes('pizza') || alt.toLowerCase().includes('pizza')) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-950 via-stone-900 to-black text-red-500 p-4">
          <svg className="w-16 h-16 mb-2 drop-shadow-md" viewBox="0 0 64 64" fill="none">
            <path d="M12 18 C 24 14, 40 14, 52 18 L 32 54 Z" fill="#D97706" />
            <path d="M16 20 C 26 17, 38 17, 48 20 L 32 50 Z" fill="#EF4444" />
            <circle cx="26" cy="26" r="3.5" fill="#FEF08A" />
            <circle cx="36" cy="27" r="4" fill="#DC2626" />
            <circle cx="31" cy="38" r="3" fill="#FEF08A" />
            <circle cx="33" cy="30" r="2" fill="#16A34A" />
            <circle cx="27" cy="34" r="2" fill="#16A34A" />
          </svg>
          <span className="text-xs font-semibold text-orange-200 uppercase tracking-wider">{alt}</span>
        </div>
      );
    }
    if (cat.includes('burger') || alt.toLowerCase().includes('burger')) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-950 via-stone-900 to-black text-amber-400 p-4">
          <svg className="w-16 h-16 mb-2 drop-shadow-md" viewBox="0 0 64 64" fill="none">
            <path d="M14 26 C 14 16, 50 16, 50 26 Z" fill="#F59E0B" />
            <rect x="12" y="27" width="40" height="4" rx="2" fill="#16A34A" />
            <rect x="13" y="32" width="38" height="6" rx="3" fill="#78350F" />
            <path d="M13 38 L 51 38 L 47 48 L 17 48 Z" fill="#D97706" />
            <circle cx="24" cy="21" r="1.5" fill="#FEF3C7" />
            <circle cx="34" cy="20" r="1.5" fill="#FEF3C7" />
            <circle cx="42" cy="22" r="1.5" fill="#FEF3C7" />
          </svg>
          <span className="text-xs font-semibold text-amber-200 uppercase tracking-wider">{alt}</span>
        </div>
      );
    }
    if (cat.includes('dessert') || alt.toLowerCase().includes('cake') || alt.toLowerCase().includes('lava')) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-stone-950 via-amber-950 to-black text-amber-600 p-4">
          <svg className="w-16 h-16 mb-2 drop-shadow-md" viewBox="0 0 64 64" fill="none">
            <path d="M18 48 L 22 26 L 42 26 L 46 48 Z" fill="#451A03" />
            <ellipse cx="32" cy="26" rx="10" ry="4" fill="#78350F" />
            <path d="M28 26 C 28 36, 36 36, 36 48 L 30 48 Z" fill="#991B1B" />
          </svg>
          <span className="text-xs font-semibold text-amber-200 uppercase tracking-wider">{alt}</span>
        </div>
      );
    }
    // Default gourmet plate
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-stone-900 via-neutral-900 to-black text-orange-500 p-4">
        <svg className="w-16 h-16 mb-2 drop-shadow-md" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="34" r="22" fill="#292524" stroke="#57534E" strokeWidth="2" />
          <circle cx="32" cy="34" r="15" fill="#EA580C" />
          <circle cx="32" cy="34" r="10" fill="#F97316" />
          <path d="M30 18 Q32 10 30 4" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M36 20 Q39 12 36 6" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </svg>
        <span className="text-xs font-semibold text-stone-200 uppercase tracking-wider">{alt}</span>
      </div>
    );
  };

  return (
    <div className={containerClassName}>
      {!hasError ? (
        <>
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
            className={`${className} transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {isLoading && (
            <div className="absolute inset-0 bg-neutral-800 animate-pulse flex items-center justify-center">
              <span className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            </div>
          )}
        </>
      ) : (
        renderFallbackIcon()
      )}
    </div>
  );
};
