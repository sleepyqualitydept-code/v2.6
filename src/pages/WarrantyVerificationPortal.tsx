import React from 'react';
import { SearchCard } from '../components/SearchCard';
import mattressHeroImg from '../assets/images/premium_bedroom_mattress_hero_1790516093279.jpg';
import { Language } from '../utils/i18n';

interface WarrantyVerificationPortalProps {
  onSearchSerial: (serial: string) => void;
  onSearchCustomer: (name: string, phone: string) => void;
  onOpenQRScanner: (mode: 'camera' | 'upload') => void;
  onActivateWarrantyClick: () => void;
  onContactSupportClick: () => void;
  onViewPolicyClick: () => void;
  isLoading?: boolean;
  language: Language;
}

export const WarrantyVerificationPortal: React.FC<WarrantyVerificationPortalProps> = ({
  onSearchSerial,
  onSearchCustomer,
  onOpenQRScanner,
  onActivateWarrantyClick,
  onContactSupportClick,
  onViewPolicyClick,
  isLoading = false,
  language,
}) => {
  const isAr = language === 'ar';

  return (
    <section
      aria-label={isAr ? 'منظومة التحقق من الضمان' : 'Warranty Verification Portal'}
      className="relative flex-1 flex flex-col justify-center items-center overflow-hidden bg-surface"
    >
      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0">
        <img
          src={mattressHeroImg}
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Layer Overlay Responsive 65% */}
        <div className="absolute inset-0 bg-surface/65 backdrop-blur-[1px] transition-colors" />
      </div>

      {/* CONTENT LAYER */}
      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-4 flex flex-col items-center justify-center h-full py-4 sm:py-8">
        
        {/* Hero Block (Max height 520px) */}
        <div className="w-full flex flex-col items-center text-center max-h-[520px] mb-4 sm:mb-8">
          
          {/* Overline Title */}
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <span className="text-[#0F3B82] dark:text-blue-400 text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-widest font-['Alexandria',_sans-serif] mb-3 text-center transition-colors uppercase">
              {isAr ? 'التحقق من الضمان' : 'Warranty Verification'}
            </span>
          </div>

          {/* Short Subtitle */}
          <p className="text-text-secondary text-lg sm:text-xl font-medium max-w-2xl transition-colors mb-6">
            {isAr ? 'الاستعلام الفوري برقم السيريال أو بيانات العميل وحالة التفعيل' : 'Instant query by serial number or customer details'}
          </p>
        </div>

        {/* Search Card (Max width 780px, Max height 380px) */}
        <div className="w-full max-w-[780px] mx-auto animate-slide-up">
          <SearchCard
            onSearchSerial={onSearchSerial}
            onSearchCustomer={onSearchCustomer}
            onOpenQRScanner={onOpenQRScanner}
            isLoading={isLoading}
            language={language}
          />
        </div>
      </div>
    </section>
  );
};
