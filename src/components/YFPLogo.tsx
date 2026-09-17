import React from 'react';

interface YFPLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  lightText?: boolean;
}

export const YFPLogo: React.FC<YFPLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  lightText = true
}) => {
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const badgeClass = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Official Circular Logo Badge */}
      <div className={`relative ${badgeClass} rounded-full bg-white shadow-md overflow-hidden flex-shrink-0 border border-[#E5C77A] p-0.5 hover:scale-105 transition-transform duration-300`}>
        <img
          src="/logo.png"
          alt="YFP Pastries & Cakes Official Logo"
          className="w-full h-full object-contain rounded-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/logo.svg';
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-serif font-bold tracking-wider uppercase leading-none ${
              size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
            } ${lightText ? 'text-[#FAF7F2]' : 'text-[#1D1815]'}`}
          >
            YFP Pastries
          </span>
          <span
            className={`font-sans tracking-[0.22em] font-semibold mt-0.5 ${
              size === 'sm' ? 'text-[9px]' : 'text-[10px] sm:text-[11px]'
            } ${lightText ? 'text-[#DEB346]' : 'text-[#A68322]'}`}
          >
            YATEX'S FOOD PLUG
          </span>
        </div>
      )}
    </div>
  );
};
