import React from 'react';

interface Props {
  density: number;
}

export const LatexLayerVisual: React.FC<Props> = () => {
  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-r from-yellow-100/90 via-amber-50 to-yellow-100/90 dark:from-yellow-950/40 dark:via-amber-950/30 dark:to-yellow-900/40">
      {/* Pin-Core Ventilation Cylinders SVG */}
      <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="latex-pincore-pattern" width="22" height="22" patternUnits="userSpaceOnUse">
            {/* Ventilation Hole */}
            <circle cx="11" cy="11" r="4.5" fill="#D97706" fillOpacity="0.25" stroke="#B45309" strokeWidth="1" />
            <circle cx="11" cy="11" r="2" fill="#78350F" fillOpacity="0.4" />
            {/* Organic Micro Texture */}
            <circle cx="2" cy="2" r="0.8" fill="#F59E0B" fillOpacity="0.4" />
            <circle cx="20" cy="2" r="0.8" fill="#F59E0B" fillOpacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#latex-pincore-pattern)" />
      </svg>
      {/* Soft Latex Sheen */}
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-200/10 via-transparent to-amber-600/10 pointer-events-none" />
    </div>
  );
};
