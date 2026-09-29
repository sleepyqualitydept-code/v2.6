import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck, Phone } from 'lucide-react';
import { Language, t } from '../utils/i18n';

interface WarrantyBottomSectionProps {
  language?: Language;
}

export const WarrantyBottomSection: React.FC<WarrantyBottomSectionProps> = ({
  language = 'ar',
}) => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const isAr = language === 'ar';

  return (
    <div className="mt-4 pt-4 border-t border-border-main space-y-3 no-print">
      {/* Collapsible Terms & Conditions Accordion */}
      <div className="border border-border-main rounded-xl overflow-hidden bg-surface dark:bg-surface-secondary">
        <button
          type="button"
          onClick={() => setIsTermsOpen(!isTermsOpen)}
          aria-expanded={isTermsOpen}
          aria-controls="warranty-terms-collapse-content"
          className="w-full py-2.5 px-3.5 flex items-center justify-between text-xs font-semibold text-text-secondary dark:text-text-primary hover:text-[#0066ff] dark:hover:text-blue-400 hover:bg-surface-secondary dark:hover:bg-surface transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-[#0066ff]" />
            <span>{t('bottomTermsTitle', language)}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>{isTermsOpen ? t('bottomHideDetails', language) : t('bottomShowDetails', language)}</span>
            {isTermsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </button>

        {isTermsOpen && (
          <div
            id="warranty-terms-collapse-content"
            className="p-3.5 bg-surface-secondary border-t border-border-main text-xs text-text-secondary space-y-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff] mt-1.5 shrink-0"></span>
                <span>{t('bottomTerm1', language)}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff] mt-1.5 shrink-0"></span>
                <span>{t('bottomTerm2', language)}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff] mt-1.5 shrink-0"></span>
                <span>{t('bottomTerm3', language)}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff] mt-1.5 shrink-0"></span>
                <span>{t('bottomTerm4', language)}</span>
              </div>
              <div className="flex items-start gap-1.5 sm:col-span-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff] mt-1.5 shrink-0"></span>
                <span>{t('bottomTerm5', language)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Electronic Accreditation & Data Integrity Statement */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{t('bottomAccreditation', language)}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 font-mono text-[11px]">
          <span className="flex items-center gap-1">
            <Phone size={12} className="text-[#0066ff]" />
            {t('hotline', language)}: 19707
          </span>
          <span>|</span>
          <span>{t('bottomSystemVersion', language)}</span>
        </div>
      </div>
    </div>
  );
};
