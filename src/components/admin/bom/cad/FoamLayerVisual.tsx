import React from 'react';

interface Props {
  material: string;
  density: number;
}

export const FoamLayerVisual: React.FC<Props> = ({ material, density }) => {
  const norm = material.toLowerCase();
  const isMemory = norm.includes('memory') || norm.includes('visco');
  const isGel = norm.includes('gel');
  const isHR = norm.includes('hr') || norm.includes('resilience');
  const isRebonded = norm.includes('rebonded') || norm.includes('ريبوند');
  const isSoft = norm.includes('soft') || norm.includes('ناعم');
  const isHard = norm.includes('hard') || norm.includes('صلب') || norm.includes('base');

  let bgGradient = 'from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/30';
  let patternDotColor = '#F59E0B';

  if (isGel) {
    bgGradient = 'from-cyan-100 via-sky-50 to-blue-100 dark:from-cyan-950/60 dark:via-sky-950/40 dark:to-blue-900/50';
    patternDotColor = '#0EA5E9';
  } else if (isMemory) {
    bgGradient = 'from-purple-100 via-indigo-50 to-purple-100 dark:from-purple-950/50 dark:via-indigo-950/40 dark:to-purple-900/50';
    patternDotColor = '#8B5CF6';
  } else if (isHR) {
    bgGradient = 'from-emerald-100 via-teal-50 to-emerald-100 dark:from-emerald-950/50 dark:via-teal-950/40 dark:to-emerald-900/50';
    patternDotColor = '#10B981';
  } else if (isRebonded) {
    bgGradient = 'from-stone-200 via-amber-100 to-stone-300 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900';
    patternDotColor = '#78716C';
  } else if (isHard) {
    bgGradient = 'from-slate-200 to-slate-300 dark:from-slate-900 dark:to-slate-800';
    patternDotColor = '#64748B';
  } else if (isSoft) {
    bgGradient = 'from-yellow-50 via-orange-50 to-amber-100 dark:from-amber-950/30 dark:to-yellow-950/20';
    patternDotColor = '#EAB308';
  }

  return (
    <div className={`w-full h-full relative overflow-hidden bg-gradient-to-r ${bgGradient}`}>
      {/* Micro-porous Open Cell / Gel Bead Matrix */}
      <svg className="w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern 
            id={isRebonded ? "rebonded-mosaic-pattern" : (isGel ? "gel-beads-pattern" : "open-cell-pattern")} 
            width={isRebonded ? "36" : (isGel ? "24" : "16")} 
            height={isRebonded ? "28" : (isGel ? "24" : "16")} 
            patternUnits="userSpaceOnUse"
          >
            {isRebonded ? (
              <g stroke="#57534E" strokeWidth="0.8" fill="none">
                <polygon points="2,2 14,4 10,18 2,14" fill="#A8A29E" fillOpacity="0.4" />
                <polygon points="16,4 32,2 30,16 14,14" fill="#78716C" fillOpacity="0.3" />
                <polygon points="12,16 28,16 24,26 8,24" fill="#57534E" fillOpacity="0.4" />
                <circle cx="20" cy="10" r="1.5" fill="#44403C" />
              </g>
            ) : isGel ? (
              <g fill="#0284C7">
                <circle cx="6" cy="6" r="2.5" fill="#38BDF8" fillOpacity="0.8" />
                <circle cx="18" cy="18" r="3" fill="#0284C7" fillOpacity="0.7" />
                <circle cx="18" cy="6" r="1.5" fill="#7DD3FC" />
                <circle cx="6" cy="18" r="2" fill="#0369A1" />
              </g>
            ) : (
              <g fill={patternDotColor}>
                <circle cx="4" cy="4" r="1.2" fillOpacity="0.7" />
                <circle cx="12" cy="12" r="1.5" fillOpacity="0.5" />
                <circle cx="12" cy="4" r="0.8" fillOpacity="0.4" />
                <circle cx="4" cy="12" r="1.0" fillOpacity="0.6" />
              </g>
            )}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${isRebonded ? "rebonded-mosaic-pattern" : (isGel ? "gel-beads-pattern" : "open-cell-pattern")})`} />
      </svg>
    </div>
  );
};
