import React from 'react';
import { Check, X, RefreshCw, History, Clock, ShieldAlert } from 'lucide-react';
import { WarrantyProduct } from '../types/warranty';
import { getProductLifecycleSteps, LifecycleStep } from '../utils/lifecycle';
import { Language, t } from '../utils/i18n';

interface ProductJourneyProps {
  product: WarrantyProduct | null | undefined;
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  variant?: 'inline' | 'modal';
  language?: Language;
}

export const ProductJourney: React.FC<ProductJourneyProps> = ({
  product,
  isOpen = true,
  onClose,
  title,
  variant = 'inline',
  language = 'ar',
}) => {
  const steps = getProductLifecycleSteps(product);
  const isAr = language === 'ar';
  const defaultTitle = isAr ? 'مسار دورة حياة المنتج المعتمدة' : 'Certified Product Lifecycle Journey';
  const displayTitle = title || defaultTitle;

  if (!isOpen) return null;

  const getStepColorClasses = (step: LifecycleStep, isContainer = false) => {
    if (step.isBlacklisted) {
      return isContainer
        ? 'bg-slate-900/10 dark:bg-slate-800 border-slate-900 dark:border-slate-700 text-slate-950 dark:text-white'
        : 'bg-slate-900 text-white';
    }
    if (step.isRevoked) {
      return isContainer
        ? 'bg-rose-100/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
        : 'bg-rose-700 text-white';
    }
    if (step.isExpired) {
      return isContainer
        ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-300'
        : 'bg-rose-500 text-white';
    }
    if (step.isReplaced) {
      return isContainer
        ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200'
        : 'bg-blue-600 text-white';
    }
    if (step.isPending) {
      return isContainer
        ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200'
        : 'bg-amber-500 text-white';
    }
    return isContainer
      ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900 text-slate-800 dark:text-emerald-200'
      : 'bg-emerald-500 text-white';
  };

  const getStepIcon = (step: LifecycleStep) => {
    if (step.isBlacklisted) return <ShieldAlert size={14} strokeWidth={3} />;
    if (step.isRevoked || step.isExpired) return <X size={14} strokeWidth={3} />;
    if (step.isReplaced) return <RefreshCw size={14} strokeWidth={3} />;
    if (step.isPending) return <Clock size={14} strokeWidth={3} />;
    return <Check size={14} strokeWidth={3} />;
  };

  const getStepTitle = (step: LifecycleStep) => {
    return isAr ? step.title : step.titleEn || step.title;
  };

  const getStepSubtitle = (step: LifecycleStep) => {
    return isAr ? step.subtitle : step.subtitleEn || step.subtitle;
  };

  if (variant === 'modal') {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs font-sans"
      >
        <div className="bg-surface rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-border-main z-[10000]">
          <div className="flex items-center justify-between pb-3 border-b border-border-main mb-4">
            <div className="flex items-center gap-2 font-bold text-[#0B2D5C] dark:text-blue-300 text-sm">
              <History size={18} className="text-[#0066ff]" />
              <span>{displayTitle}</span>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label={isAr ? 'إغلاق' : 'Close'}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {steps.length === 0 ? (
            <div className="p-6 text-center text-xs font-bold text-text-secondary bg-surface-secondary rounded-2xl border border-border-main">
              {isAr ? 'لا تتوفر بيانات دورة الحياة لهذا المنتج' : 'No lifecycle data available for this product'}
            </div>
          ) : (
            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-2xl border ${getStepColorClasses(
                    step,
                    true
                  )}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getStepColorClasses(
                        step,
                        false
                      )}`}
                    >
                      {getStepIcon(step)}
                    </div>
                    <div>
                      <span className="font-extrabold text-xs block leading-tight">{getStepTitle(step)}</span>
                      {getStepSubtitle(step) && (
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 block">{getStepSubtitle(step)}</span>
                      )}
                    </div>
                  </div>
                  {step.date && (
                    <span className="text-[11px] font-mono font-bold text-text-primary bg-surface/90 px-2.5 py-0.5 rounded border border-border-main">
                      {step.date}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {onClose && (
            <div className="mt-5 pt-3 border-t border-border-main flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-surface-secondary hover:bg-surface text-text-secondary dark:text-text-primary text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Inline Timeline Bar
  return (
    <div className="p-3 bg-surface-secondary border-t border-border-main">
      {steps.length === 0 ? (
        <div className="text-center py-3 text-xs font-bold text-slate-500">
          {isAr ? 'لا تتوفر بيانات دورة الحياة لهذا المنتج' : 'No lifecycle data available'}
        </div>
      ) : (
        <div className="w-full flex items-center justify-between relative overflow-x-auto py-1 px-2 gap-2">
          <div className="absolute top-3 left-6 right-6 h-0.5 bg-border-main -z-0"></div>
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center relative z-10 px-1 min-w-[70px]">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-2xs border-2 border-surface ${getStepColorClasses(
                  step,
                  false
                )}`}
              >
                {getStepIcon(step)}
              </div>
              <span
                className={`text-[11px] font-bold mt-1 leading-tight whitespace-nowrap ${
                  step.isBlacklisted
                    ? 'text-slate-950 dark:text-white font-black'
                    : step.isRevoked || step.isExpired
                    ? 'text-rose-700 dark:text-rose-400'
                    : step.isReplaced
                    ? 'text-blue-700 dark:text-blue-400'
                    : step.isPending
                    ? 'text-amber-800 dark:text-amber-400'
                    : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                {getStepTitle(step)}
              </span>
              {step.date && (
                <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono hidden sm:inline-block">
                  {step.date}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
