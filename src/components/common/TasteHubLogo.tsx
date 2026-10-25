import React from 'react';

interface TasteHubLogoProps {
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const TasteHubLogo: React.FC<TasteHubLogoProps> = ({
  theme = 'dark',
  size = 'md',
  onClick
}) => {
  const isDark = theme === 'dark';

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 font-bold tracking-tight select-none cursor-pointer group ${textSizes[size]}`}
    >
      {/* Chef Hat vector icon */}
      <div className="relative">
        <svg
          className={`${iconSizes[size]} text-[#FF7518] transition-transform duration-300 group-hover:scale-110`}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hat base */}
          <path
            d="M8 24H28V28C28 29.1046 27.1046 30 26 30H10C8.89543 30 8 29.1046 8 28V24Z"
            fill="#FF7518"
          />
          {/* Hat rim detail */}
          <rect x="11" y="26" width="14" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.4" />
          {/* Hat puffs */}
          <path
            d="M9 24C6.5 24 5 21.5 5 18.5C5 15.5 7.5 13.5 10 14C10.5 10 14 7 18 7C22 7 25.5 10 26 14C28.5 13.5 31 15.5 31 18.5C31 21.5 29.5 24 27 24H9Z"
            fill="#FF7518"
          />
          {/* Subtle inner chef fold highlight */}
          <path
            d="M13 19C13 16 15 13 18 13C21 13 23 16 23 19"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.5"
          />
        </svg>
      </div>

      {/* Brand wordmark */}
      <span className="flex items-center">
        <span className={isDark ? 'text-white' : 'text-[#191919]'}>Taste</span>
        <span className="text-[#FF7518]">Hub</span>
      </span>
    </div>
  );
};
