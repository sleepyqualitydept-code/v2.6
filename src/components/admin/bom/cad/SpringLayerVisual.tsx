import React from 'react';

interface Props {
  material: string;
  isPocket: boolean;
  isBonnell: boolean;
  isMicro: boolean;
}

export const SpringLayerVisual: React.FC<Props> = ({ isPocket, isBonnell, isMicro }) => {
  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-r from-slate-900 via-[#0B2D5C] to-slate-900 border-y border-blue-500/30">
      {/* SVG Coil Repetition */}
      <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern 
            id={isMicro ? "micro-spring-pattern" : (isBonnell ? "bonnell-spring-pattern" : "pocket-spring-pattern")} 
            width={isMicro ? "18" : (isBonnell ? "45" : "32")} 
            height="100%" 
            patternUnits="userSpaceOnUse"
          >
            {isPocket && (
              <g stroke="#60A5FA" strokeWidth="1.5" fill="none">
                {/* Barrel Shape Pocket Coil Outline */}
                <rect x="2" y="2" width="28" height="96%" rx="6" stroke="#3B82F6" strokeWidth="1" fill="#1E3A8A" fillOpacity="0.2" />
                {/* Internal Wire Helix */}
                <path d="M 4,10 Q 16,16 28,10 Q 16,4 4,10" />
                <path d="M 4,25 Q 16,31 28,25 Q 16,19 4,25" />
                <path d="M 4,40 Q 16,46 28,40 Q 16,34 4,40" />
                <path d="M 4,55 Q 16,61 28,55 Q 16,49 4,55" />
                <path d="M 4,70 Q 16,76 28,70 Q 16,64 4,70" />
                <line x1="16" y1="2" x2="16" y2="98%" stroke="#93C5FD" strokeDasharray="2,3" strokeWidth="0.8" />
              </g>
            )}

            {isBonnell && (
              <g stroke="#94A3B8" strokeWidth="2" fill="none">
                {/* Hourglass Bonnell Shape */}
                <path d="M 4,4 L 40,4 L 28,35 L 40,65 L 4,65 L 16,35 Z" stroke="#CBD5E1" />
                <path d="M 4,4 C 22,25 22,45 4,65" stroke="#E2E8F0" strokeWidth="1.5" />
                <path d="M 40,4 C 22,25 22,45 40,65" stroke="#E2E8F0" strokeWidth="1.5" />
                {/* Cross Border Connecting Wire */}
                <line x1="0" y1="35" x2="45" y2="35" stroke="#F59E0B" strokeWidth="1.5" />
              </g>
            )}

            {isMicro && (
              <g stroke="#38BDF8" strokeWidth="1" fill="none">
                <rect x="1" y="2" width="16" height="96%" rx="3" fill="#0284C7" fillOpacity="0.3" stroke="#0EA5E9" />
                <circle cx="9" cy="20%" r="4" stroke="#7DD3FC" />
                <circle cx="9" cy="50%" r="4" stroke="#7DD3FC" />
                <circle cx="9" cy="80%" r="4" stroke="#7DD3FC" />
              </g>
            )}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${isMicro ? "micro-spring-pattern" : (isBonnell ? "bonnell-spring-pattern" : "pocket-spring-pattern")})`} />
      </svg>

      {/* Center Metallic Reflection */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-400/5 via-transparent to-black/40 pointer-events-none" />
    </div>
  );
};
