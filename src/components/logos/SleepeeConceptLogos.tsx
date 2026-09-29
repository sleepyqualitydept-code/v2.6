import React from 'react';

export type LogoConcept = 'official' | 'conceptA' | 'conceptB' | 'conceptC';
export type LogoVariant = 'full' | 'horizontal' | 'icon';

/**
 * OFFICIAL LOGO: The provided official Sleepee brand identity
 */
export const OfficialLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <img 
        src="/src/assets/images/official_sleepee_logo_raw.png" 
        alt="Sleepee Official Logo" 
        className="h-full w-auto object-contain"
        onError={(e) => {
          // Fallback to the other potential path if raw is missing
          e.currentTarget.src = "/src/assets/images/sleepee_logo_clean.png";
        }}
      />
    </div>
  );
};

/**
 * DIRECTION A: Master Corporate Wordmark (المخطوطة المؤسسية الرسمية)
 * خط عربي أصيل بنسب متزنة دون أي تشوه أو ضغط أفقي، مع النقطة الحمراء المميزة
 */
export const DirectionALogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center select-none leading-none ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-3xl sm:text-4xl md:text-[42px] font-bold tracking-tight font-['Alexandria',_sans-serif] leading-none select-none text-[#333333] dark:text-zinc-300">
          سليبي
        </span>
        <span className="w-2.5 h-2.5 rounded-full bg-[#E53935] shadow-sm mb-0.5 shrink-0"></span>
      </div>
    </div>
  );
};

/**
 * DIRECTION B: Heavy Modern Industrial Wordmark (المخطوطة الهندسية المعاصرة)
 * خط كتلوي عريض مستوحى من خط الإسكندرية (Alexandria Black) بوضوح تام
 */
export const DirectionBLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center select-none leading-none ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-3xl sm:text-4xl md:text-[42px] font-bold tracking-normal font-['Alexandria',_sans-serif] leading-none select-none text-[#333333] dark:text-zinc-300">
          سليبي
        </span>
        <span className="w-2.5 h-2.5 rounded-full bg-[#E53935] shadow-sm mb-0.5 shrink-0"></span>
      </div>
    </div>
  );
};

/**
 * DIRECTION C: Fluid Ergonomic Luxury Wordmark (المخطوطة الانسيابية الفاخرة)
 * خط بنسب انسيابية مريحة مستوحى من IBM Plex Sans Arabic Black
 */
export const DirectionCLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center select-none leading-none ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-3xl sm:text-4xl md:text-[42px] font-bold tracking-normal font-['IBM_Plex_Sans_Arabic',_sans-serif] leading-none select-none text-[#333333] dark:text-zinc-300">
          سليبي
        </span>
        <span className="w-2.5 h-2.5 rounded-full bg-[#E53935] shadow-sm mb-0.5 shrink-0"></span>
      </div>
    </div>
  );
};

/**
 * Universal Wordmark Concept Switcher
 */
export const SleepeeConceptLogo: React.FC<{
  concept?: LogoConcept;
  variant?: LogoVariant;
  className?: string;
}> = ({ concept = 'official', className = '' }) => {
  switch (concept) {
    case 'conceptA':
      return <DirectionALogo className={className} />;
    case 'conceptB':
      return <DirectionBLogo className={className} />;
    case 'conceptC':
      return <DirectionCLogo className={className} />;
    case 'official':
    default:
      return <OfficialLogo className={className} />;
  }
};
