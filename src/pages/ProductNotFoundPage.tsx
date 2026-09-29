import React, { useEffect } from 'react';
import {
  XCircle,
  Search,
  Headset,
  Lightbulb,
} from 'lucide-react';
import { Language, t } from '../utils/i18n';
import { useAccessibility } from '../context/AccessibilityProvider';

interface ProductNotFoundPageProps {
  searchedQuery: string;
  onNewSearch: () => void;
  onContactSupport: () => void;
  restrictedReason?: string;
  language?: Language;
}

export const ProductNotFoundPage: React.FC<ProductNotFoundPageProps> = ({
  searchedQuery,
  onNewSearch,
  onContactSupport,
  restrictedReason,
  language = 'ar',
}) => {
  const isRestricted = !!restrictedReason;
  const isAr = language === 'ar';
  const { announce } = useAccessibility();

  useEffect(() => {
    announce(
      isRestricted
        ? (isAr ? 'تم تقييد هذا الرقم التسلسلي بواسطة إدارة الجودة' : 'Serial number restricted')
        : (isAr ? 'صفحة نتيجة البحث: لم يتم العثور على نتائج للرقم المدخل' : 'Search Result: No matching product found'),
      false,
      language
    );
  }, [searchedQuery]);

  return (
    <section
      role="region"
      aria-label={isAr ? 'نتيجة البحث: المنتج غير موجود' : 'Search Result: Product Not Found'}
      className={`w-full max-w-4xl mx-auto py-8 px-4 font-sans ${isAr ? 'text-right' : 'text-left'}`}
    >
      {/* Main Container Card */}
      <div className="bg-surface dark:bg-surface-secondary backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl shadow-slate-200/40 dark:shadow-none border border-border-main space-y-6">
        {/* Top Warning Box */}
        <div className={`p-6 sm:p-8 rounded-2xl border-2 text-center space-y-3 ${
          isRestricted
            ? 'border-amber-300 dark:border-amber-900 bg-amber-50/80 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100'
            : 'border-red-200 dark:border-red-900 bg-red-50/40 dark:bg-red-950/30 text-red-950 dark:text-red-100'
        }`}>
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto shadow-md ${
            isRestricted ? 'bg-amber-600 text-white shadow-amber-500/20' : 'bg-red-600 text-white shadow-red-500/20'
          }`}>
            <XCircle size={32} />
          </div>

          <h2 className={`text-2xl sm:text-3xl font-extrabold leading-normal ${
            isRestricted ? 'text-amber-900 dark:text-amber-300' : 'text-red-600 dark:text-red-400'
          }`}>
            {isRestricted
              ? (isAr ? 'تم تقييد هذا الرقم التسلسلي بواسطة إدارة الجودة' : 'This serial number has been restricted by Quality Administration')
              : t('notFoundTitle', language)}
          </h2>

          <div className="text-xs sm:text-sm text-text-secondary max-w-lg mx-auto leading-relaxed font-semibold">
            {isAr ? 'الرقم المدخل:' : 'Entered Query:'}{' '}
            <span className="font-mono tabular-nums font-bold text-text-primary bg-surface dark:bg-surface-secondary px-2.5 py-1 rounded-md border border-border-main inline-block my-1 shadow-2xs">
              {searchedQuery || (isAr ? 'غير محدد' : 'Unspecified')}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400 max-w-md mx-auto leading-relaxed font-medium">
            {restrictedReason || t('notFoundSubtitle', language)}
          </p>
        </div>

        {/* Central Graphic */}
        <div className="py-4 flex justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <div className="absolute inset-0 bg-red-50 dark:bg-red-950/30 rounded-full blur-xl"></div>
            
            <div className="relative w-28 h-32 bg-surface dark:bg-surface-secondary rounded-xl shadow-lg border border-border-main p-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-2 w-12 bg-blue-100 dark:bg-slate-700 rounded-full"></div>
                <div className="h-1.5 w-16 bg-surface-secondary dark:bg-slate-700 rounded-full"></div>
                <div className="h-1.5 w-14 bg-surface-secondary dark:bg-slate-700 rounded-full"></div>
                <div className="h-1.5 w-18 bg-surface-secondary dark:bg-slate-700 rounded-full"></div>
              </div>
              <div className="h-2 w-10 bg-surface-secondary dark:bg-slate-700 rounded-full"></div>

              <div className="absolute -bottom-2 -left-2 w-14 h-14 rounded-full bg-surface dark:bg-surface-secondary shadow-md border border-border-main flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center">
                  <XCircle size={22} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Tips Card */}
        <div className="p-5 sm:p-6 bg-blue-50/60 dark:bg-slate-800/50 rounded-2xl border border-blue-100/80 dark:border-slate-700 space-y-3">
          <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-semibold text-sm">
            <Lightbulb size={20} className="text-blue-600 dark:text-blue-400" />
            <span>{isAr ? 'نصائح هامة:' : 'Important Tips:'}</span>
          </div>

          <ul className={`space-y-2 ${isAr ? 'pr-6' : 'pl-6'} text-xs sm:text-sm text-text-secondary dark:text-slate-300 font-normal leading-relaxed`}>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
              <span>{t('notFoundTip1', language)}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
              <span>{t('notFoundTip2', language)}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
              <span>{t('notFoundTip3', language)}</span>
            </li>
          </ul>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            onClick={onNewSearch}
            className="w-full sm:w-auto px-8 h-12 bg-[#0066ff] hover:bg-blue-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            <Search size={18} />
            <span>{t('newSearch', language)}</span>
          </button>

          <button
            onClick={onContactSupport}
            className="w-full sm:w-auto px-6 h-12 bg-surface dark:bg-surface-secondary hover:bg-surface-secondary dark:hover:bg-slate-700 text-text-primary border-2 border-border-main hover:border-border-main font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Headset size={18} className="text-text-secondary dark:text-slate-400" />
            <span>{t('contactCustomerService', language)}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
