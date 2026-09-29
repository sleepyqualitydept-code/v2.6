import React from 'react';
import { ShieldCheck, Phone, Settings, Mail, MessageCircle, Facebook, Linkedin, Youtube } from 'lucide-react';
import { Language, t } from '../utils/i18n';

interface FooterProps {
  onPolicyClick?: () => void;
  onTermsClick?: () => void;
  onPrivacyClick?: () => void;
  onAdminClick?: () => void;
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({
  onPolicyClick,
  onTermsClick,
  onPrivacyClick,
  language,
}) => {
  const isAr = language === 'ar';

  return (
    <footer
      role="contentinfo"
      className="w-full bg-surface border-t border-border-main text-text-secondary py-5 select-none no-font-scale relative z-20 transition-colors"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-xs sm:text-[13px] font-bold">
          
          {/* RIGHT: Company Name & Customer Support Group */}
          <div className="flex flex-col md:flex-row items-center gap-6 order-1">
            <div className="text-text-primary text-center md:text-right">
              {isAr ? 'الشركة العربية لصناعة مراتب السوست والإسفنج' : 'The Arab Company for Spring and Foam Mattresses'}
            </div>

            <div className="flex items-center gap-4 border-s border-border-main px-6 min-h-[20px]">
              {/* Customer Support Group */}
              <a href="tel:19707" title={isAr ? 'الخط الساخن' : 'Hotline'} className="text-text-secondary hover:text-[#0F3B82] flex items-center gap-1.5">
                <Phone size={16} />
                <span className="font-bold">19707</span>
              </a>
              <a href="tel:01014967405" title={isAr ? 'هاتف' : 'Phone'} className="text-text-secondary hover:text-[#0F3B82]">
                <Phone size={16} />
              </a>
              <a href="mailto:Online@sleephigh.com" title={isAr ? 'بريد' : 'Email'} className="text-text-secondary hover:text-[#0F3B82]">
                <Mail size={16} />
              </a>
              <a href="https://wa.me/201014967405" target="_blank" rel="noopener noreferrer" title="WhatsApp" className="text-text-secondary hover:text-emerald-600">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* LEFT: Legal Links & Social Media Group */}
          <div className="flex flex-col md:flex-row items-center gap-6 order-2">
            <div className="flex items-center gap-4 text-text-secondary">
              <button onClick={onPolicyClick} className="hover:text-[#0F3B82] transition-colors cursor-pointer">
                {t('warrantyPolicy', language)}
              </button>
              <span className="opacity-20">|</span>
              <button onClick={onTermsClick} className="hover:text-[#0F3B82] transition-colors cursor-pointer">
                {t('termsOfUse', language)}
              </button>
              <span className="opacity-20">|</span>
              <button onClick={onPrivacyClick} className="hover:text-[#0F3B82] transition-colors cursor-pointer">
                {t('privacyPolicy', language)}
              </button>
            </div>

            <div className="flex items-center gap-4 border-s border-border-main px-6 min-h-[20px]">
              {/* Social Media Group */}
              <a href="https://www.facebook.com/SleepHighMEN" target="_blank" rel="noopener noreferrer" title="Facebook" className="text-text-secondary hover:text-blue-600">
                <Facebook size={16} />
              </a>
              <a href="https://www.linkedin.com/company/sleephighmena" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="text-text-secondary hover:text-blue-700">
                <Linkedin size={16} />
              </a>
              <a href="https://www.youtube.com/channel/UCT3e2C-YCv1lAdoZNHciAQw" target="_blank" rel="noopener noreferrer" title="YouTube" className="text-text-secondary hover:text-red-600">
                <Youtube size={16} />
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
