import React from 'react';

interface Props {
  isCotton: boolean;
}

export const FeltLayerVisual: React.FC<Props> = ({ isCotton }) => {
  return (
    <div className={`w-full h-full relative overflow-hidden ${
      isCotton 
        ? 'bg-gradient-to-r from-stone-300 via-amber-200/60 to-stone-300 dark:from-stone-900 dark:via-amber-950/40 dark:to-stone-900' 
        : 'bg-gradient-to-r from-slate-300 via-gray-200 to-slate-300 dark:from-slate-900 dark:via-gray-800 dark:to-slate-900'
    } border-y-2 border-stone-500/40`}>
      {/* Needle-punched Crosshatch Interlocking Fibers SVG */}
      <svg className="w-full h-full opacity-45" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="felt-fibers-pattern" width="14" height="14" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="14" y2="14" stroke={isCotton ? "#78350F" : "#334155"} strokeWidth="1" strokeDasharray="3,2" />
            <line x1="14" y1="0" x2="0" y2="14" stroke={isCotton ? "#92400E" : "#475569"} strokeWidth="1" strokeDasharray="2,3" />
            <line x1="0" y1="7" x2="14" y2="7" stroke={isCotton ? "#B45309" : "#64748B"} strokeWidth="0.8" strokeDasharray="4,2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#felt-fibers-pattern)" />
      </svg>
      {/* Heavy-duty Insulator Border lines */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-stone-600/40" />
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-stone-600/40" />
    </div>
  );
};
