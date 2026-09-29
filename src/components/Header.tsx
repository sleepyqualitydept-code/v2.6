import React from 'react';
import { 
  Moon, Sun, Globe, Settings, Home, Search
} from 'lucide-react';
import { LogoConcept } from './logos/SleepeeConceptLogos';
import { Language, t } from '../utils/i18n';
import { useAccessibility } from '../context/AccessibilityProvider';
import { useTranslationService } from '../i18n';

interface HeaderProps {
  onAccessibilityClick?: () => void;
  onAdminClick?: (section?: string, tab?: string) => void;
  onHomeClick?: () => void;
  onGlobalSearchClick?: () => void;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  language: Language;
  onToggleLanguage: () => void;
  logoConcept?: LogoConcept;
  activeSection?: string;
  onSelectSection?: (section: string, tab?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onAccessibilityClick,
  onAdminClick,
  onHomeClick,
  onGlobalSearchClick,
  darkMode,
  setDarkMode,
  language,
  onToggleLanguage,
}) => {
  const isAr = language === 'ar';
  const { isAccessibilityActive } = useAccessibility();
  const { t: dict } = useTranslationService(language);

  return (
    <header
      role="banner"
      className="w-full backdrop-blur-md border-b border-border-main sticky top-0 z-100 select-none no-font-scale transition-colors bg-surface/95 shadow-xs dark:shadow-none"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-4">
        
        {/* ================================================================= */}
        {/* PLATFORM IDENTITY RESTORATION (PROMPT-UI-RESTORATION-R1)          */}
        {/* ================================================================= */}
        <div className="flex items-center gap-4 shrink-0">
          {/* 1. Official Logo */}
          <button 
            type="button"
            onClick={onHomeClick}
            className="flex items-center gap-2 cursor-pointer group" 
            aria-label="Sleepee Official Portal"
          >
            <span className="text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase font-['Alexandria',_sans-serif] text-[#333333] dark:text-zinc-200 leading-none select-none group-hover:text-blue-600 transition-colors">
              SLEEPEE
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#E53935] shadow-2xs shrink-0"></span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* HEADER UTILITIES (RESTORED ORIGINAL ORDER & STYLES)              */}
        {/* ================================================================= */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          
          {/* 1. System Management / Account Button (Restore First) */}
          <button
            type="button"
            onClick={() => {
              if (onAdminClick) onAdminClick('admin_system', 'audit_monitoring');
            }}
            title={isAr ? 'إدارة النظام والحساب الحالي' : 'System Management & Current Account'}
            className="h-9 px-3 bg-[#0B2D5C] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 shrink-0 flex items-center gap-1.5 shadow-2xs"
          >
            <Settings size={16} />
            <span className="hidden sm:inline">{isAr ? 'إدارة النظام' : 'System Admin'}</span>
          </button>

          {/* 2. Dark Mode Toggle */}
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? (isAr ? 'الوضع النهاري' : t('lightMode', language)) : (isAr ? 'الوضع الليلي' : t('darkMode', language))}
            className="p-2 text-text-secondary hover:text-text-primary transition-all cursor-pointer active:scale-95 shrink-0 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* 3. Language Toggle (Simplified - No Capsule Container) */}
          <button
            type="button"
            onClick={onToggleLanguage}
            title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
            className="p-2 text-text-secondary hover:text-blue-600 transition-all cursor-pointer active:scale-95 shrink-0 flex items-center gap-1.5 font-bold text-xs"
          >
            <Globe size={18} />
            <span>{isAr ? 'EN' : 'عربي'}</span>
          </button>

          {/* 4. Accessibility Center (Simplified - Restore Order Last) */}
          <button
            type="button"
            onClick={onAccessibilityClick}
            title={isAr ? 'مركز إمكانية الوصول' : 'Accessibility Center'}
            className={`p-2 transition-all cursor-pointer active:scale-95 shrink-0 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 ${
              isAccessibilityActive ? 'text-[#0F3B82] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <svg 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M9 10h6" />
              <path d="m9 16 3-4 3 4" />
            </svg>
          </button>

        </div>

      </div>
    </header>
  );
};
