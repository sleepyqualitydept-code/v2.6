import React from 'react';

interface Props {
  material: string;
}

export const FabricLayerVisual: React.FC<Props> = ({ material }) => {
  const norm = material.toLowerCase();
  const isCooling = norm.includes('cool') || norm.includes('ice');
  const isOrganic = norm.includes('org') || norm.includes('cotton') || norm.includes('sanitized');
  const isTencel = norm.includes('tencel');
  const isJacquard = norm.includes('jacq') || norm.includes('damask');

  let bgGradient = 'from-blue-100 via-indigo-50 to-blue-100 dark:from-blue-950/60 dark:via-slate-900 dark:to-blue-950/60';
  let stitchColor = '#3B82F6';

  if (isCooling) {
    bgGradient = 'from-cyan-100 via-teal-50 to-cyan-200 dark:from-cyan-950/70 dark:via-teal-950/40 dark:to-cyan-900/60';
    stitchColor = '#06B6D4';
  } else if (isOrganic) {
    bgGradient = 'from-emerald-100 via-lime-50 to-emerald-100 dark:from-emerald-950/50 dark:via-slate-900 dark:to-emerald-950/50';
    stitchColor = '#10B981';
  } else if (isTencel) {
    bgGradient = 'from-teal-100 via-emerald-50 to-cyan-100 dark:from-teal-950/50 dark:via-slate-900 dark:to-cyan-950/50';
    stitchColor = '#14B8A6';
  } else if (isJacquard) {
    bgGradient = 'from-slate-200 via-stone-100 to-slate-200 dark:from-slate-900 dark:via-stone-900 dark:to-slate-900';
    stitchColor = '#64748B';
  }

  return (
    <div className={`w-full h-full relative overflow-hidden bg-gradient-to-r ${bgGradient} border-y border-blue-400/40`}>
      {/* 4-Way Stretch Jacquard Weave & Quilted Diamond Stitching SVG */}
      <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="fabric-diamond-quilt-pattern" width="28" height="28" patternUnits="userSpaceOnUse">
            {/* Diamond Quilting Stitch */}
            <path d="M 14,0 L 28,14 L 14,28 L 0,14 Z" fill="none" stroke={stitchColor} strokeWidth="1" strokeDasharray="3,2" />
            <circle cx="14" cy="14" r="1.5" fill={stitchColor} />
            {/* Micro Texture */}
            <line x1="0" y1="0" x2="28" y2="28" stroke={stitchColor} strokeWidth="0.4" strokeOpacity="0.3" />
            <line x1="28" y1="0" x2="0" y2="28" stroke={stitchColor} strokeWidth="0.4" strokeOpacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#fabric-diamond-quilt-pattern)" />
      </svg>
      {/* Top Silk Sheen */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20 pointer-events-none" />
    </div>
  );
};
