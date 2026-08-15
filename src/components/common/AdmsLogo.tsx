import React from 'react';

interface AdmsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'full' | 'compact' | 'symbol';
  isDarkBg?: boolean;
}

export const AdmsLogo: React.FC<AdmsLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  variant = 'full',
  isDarkBg = false,
}) => {
  // Height sizing
  const heights = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20',
  };

  if (variant === 'symbol') {
    return (
      <div className={`inline-flex items-center shrink-0 ${heights[size]} ${className}`}>
        <div className="relative h-full aspect-square overflow-hidden rounded-xl bg-white p-1 flex items-center justify-center shadow-xs border border-slate-200/80">
          <img
            src="/adms-logo.png"
            alt="ADMS Emblem"
            className="h-[140%] max-w-none object-cover object-left scale-[1.7] translate-x-[22%]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center shrink-0 ${heights[size]} ${className}`}>
      <div
        className={`h-full flex items-center transition-all ${
          isDarkBg
            ? 'bg-white px-3 py-1.5 rounded-xl shadow-md border border-white/20'
            : ''
        }`}
      >
        <img
          src="/adms-logo.png"
          alt="ADMS - PT. Armada Digital Marketing Syariah"
          className="h-full w-auto object-contain max-h-full"
        />
      </div>
    </div>
  );
};

