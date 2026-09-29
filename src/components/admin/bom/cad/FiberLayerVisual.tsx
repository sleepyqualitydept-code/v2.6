import React from 'react';

export const FiberLayerVisual: React.FC = () => {
  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-r from-sky-50 via-white to-sky-50 dark:from-sky-950/40 dark:via-slate-900 dark:to-sky-950/40">
      {/* Cloud-like Microfiber Tufts SVG */}
      <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="fiber-cloud-pattern" width="30" height="20" patternUnits="userSpaceOnUse">
            <path d="M 5,12 Q 10,5 15,12 Q 20,5 25,12 Q 20,18 15,14 Q 10,18 5,12" fill="#BAE6FD" fillOpacity="0.5" stroke="#38BDF8" strokeWidth="0.8" />
            <circle cx="15" cy="10" r="1.5" fill="#0284C7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#fiber-cloud-pattern)" />
      </svg>
      {/* Soft Loft Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-sky-200/20 pointer-events-none" />
    </div>
  );
};
