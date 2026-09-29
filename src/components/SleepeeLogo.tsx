import React from 'react';
import logoImage from '../assets/images/sleepee_logo_clean.png';
import { LogoConcept } from './logos/SleepeeConceptLogos';

interface SleepeeLogoProps {
  className?: string;
  concept?: LogoConcept;
}

/**
 * Renders the official "Sleepee" branding logo directly on the header surface.
 * Free of any white box, container background, borders, or shadows.
 */
export const SleepeeLogo: React.FC<SleepeeLogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src={logoImage}
        alt="Sleepee Official Logo"
        className="h-[56px] sm:h-[64px] md:h-[72px] w-auto object-contain select-none"
      />
    </div>
  );
};
