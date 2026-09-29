import React, { useState } from 'react';
import {
  CheckCircle2,
  Printer,
  Download,
  Check,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  User,
  History,
  QrCode,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { WarrantyProduct } from '../types/warranty';
import { PrintableCertificate } from '../components/PrintableCertificate';
import { PrintCertificateModal } from '../components/PrintCertificateModal';
import { exportWarrantyCertificateToPDF } from '../utils/pdfExporter';
import { getWarrantyNumber } from '../utils/masking';
import { ProductJourney } from '../components/ProductJourney';
import { getProductLifecycleSteps } from '../utils/lifecycle';
import { WarrantyBottomSection } from '../components/WarrantyBottomSection';
import { Language, t } from '../utils/i18n';
import { useAccessibility } from '../context/AccessibilityProvider';

interface WarrantyActivePageProps {
  product: WarrantyProduct;
  onNewSearch: () => void;
  onSearchSerial?: (serial: string) => void;
  language?: Language;
}

export const WarrantyActivePage: React.FC<WarrantyActivePageProps> = ({
  product,
  onNewSearch,
  onSearchSerial,
  language = 'ar',
}) => {
  const [isJourneyOpen, setIsJourneyOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { announce } = useAccessibility();
  const isAr = language === 'ar';

  React.useEffect(() => {
    announce(
      isAr
        ? `صفحة تفاصيل الضمان الساري: المنتج ${product.modelName}، الضمان ساري ومفعل`
        : `Active Warranty Details: ${product.modelName}, Warranty is active and verified`,
      false,
      language
    );
  }, [product.serialNumber]);

  const handleExportPDF = async () => {
    setIsExporting(true);
    setErrorMessage(null);
    try {
      await exportWarrantyCertificateToPDF(product);
    } catch (err: any) {
      console.error('Export failed:', err);
      setErrorMessage(
        err?.message ||
          (isAr
            ? 'حدث خطأ أثناء تحميل أو طباعة الشهادة. يرجى المحاولة مرة أخرى.'
            : 'An error occurred while generating the certificate PDF. Please try again.')
      );
    } finally {
      setIsExporting(false);
    }
  };

  const isRevoked = product.status === 'revoked';
  const isBlacklisted = product.status === 'blacklisted';
  const isReplaced = product.status === 'replaced';
  const isMaintenance = product.status === 'maintenance';
  const isOwnershipTransferred = product.ownershipHistory && product.ownershipHistory.length > 0;

  let headerTitle = t('statusActiveTitle', language);
  let badgeText = t('statusActiveBadge', language);
  let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  let iconContainerClass = 'bg-emerald-50 text-emerald-600 border-emerald-200/80';
  let bannerMessage: string | null = null;
  let bannerTitle: string | null = null;
  let bannerClass = '';

  if (isRevoked) {
    headerTitle = t('statusRevokedTitle', language);
    badgeText = t('statusRevokedBadge', language);
    badgeClass = 'bg-rose-100 text-rose-800 border-rose-200';
    iconContainerClass = 'bg-rose-50 text-rose-600 border-rose-200/80';
    bannerTitle = t('revokedBannerTitle', language);
    bannerMessage = t('revokedBannerMessage', language);
    bannerClass = 'bg-rose-50 border-rose-200 text-rose-900';
  } else if (isBlacklisted) {
    headerTitle = t('statusBlacklistedTitle', language);
    badgeText = t('statusBlacklistedBadge', language);
    badgeClass = 'bg-slate-900 text-white border-slate-700';
    iconContainerClass = 'bg-slate-100 text-slate-900 border-slate-300';
    bannerTitle = t('blacklistedBannerTitle', language);
    bannerMessage = t('blacklistedBannerMessage', language);
    bannerClass = 'bg-slate-100 border-slate-300 text-slate-900';
  } else if (isReplaced) {
    headerTitle = t('statusReplacedTitle', language);
    badgeText = t('statusReplacedBadge', language);
    badgeClass = 'bg-blue-100 text-blue-800 border-blue-200';
    iconContainerClass = 'bg-blue-50 text-blue-600 border-blue-200/80';
  } else if (isMaintenance) {
    headerTitle = t('statusMaintenanceTitle', language);
    badgeText = t('statusMaintenanceBadge', language);
    badgeClass = 'bg-purple-100 text-purple-800 border-purple-200';
    iconContainerClass = 'bg-purple-50 text-purple-600 border-purple-200/80';
  } else if (isOwnershipTransferred) {
    headerTitle = t('statusTransferredTitle', language);
    badgeText = t('statusTransferredBadge', language);
    badgeClass = 'bg-teal-100 text-teal-800 border-teal-200';
    iconContainerClass = 'bg-teal-50 text-teal-600 border-teal-200/80';
  }

  const journeySteps = getProductLifecycleSteps(product);

  return (
    <div className={`w-full max-w-[1360px] mx-auto py-3 sm:py-5 px-3 sm:px-6 font-sans ${isAr ? 'text-right' : 'text-left'}`}>
      
      {/* Top Quick Bar (Compact) */}
      <div className="flex items-center justify-between mb-3 no-print">
        <button
          onClick={onNewSearch}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface dark:bg-surface-secondary hover:bg-surface-secondary dark:hover:bg-slate-700 text-text-secondary dark:text-text-primary font-semibold rounded-xl border border-border-main text-xs shadow-2xs transition-all cursor-pointer active:scale-95"
        >
          <ArrowRight size={14} className={isAr ? '' : 'rotate-180'} />
          <span>{t('newSearch', language)}</span>
        </button>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-text-secondary dark:text-[#CBD5E1]">{isAr ? 'شهادة رقم:' : 'Certificate No:'}</span>
          <span className="font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-surface-secondary px-2 py-0.5 rounded-md border border-blue-200 dark:border-border-main">
            {getWarrantyNumber(product)}
          </span>
          <span className="text-border-main dark:text-slate-700">|</span>
          <span className="text-text-secondary dark:text-text-secondary">{isAr ? 'السيريال:' : 'Serial:'}</span>
          <span className="font-mono font-bold text-text-primary bg-surface dark:bg-surface-secondary px-2 py-0.5 rounded-md border border-border-main">
            {product.serialNumber}
          </span>
        </div>
      </div>

      {/* Optional Error Alert */}
      {errorMessage && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700 font-bold px-1 text-xs cursor-pointer"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      )}

      {/* Main Certificate Card */}
      <div className="bg-surface dark:bg-surface-secondary rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-200/60 dark:shadow-none border border-border-main border-t-4 border-t-emerald-500">
        
        {/* Banner Alert for Revoked or Blacklisted */}
        {bannerMessage && (
          <div className={`mb-4 p-4 rounded-2xl border ${bannerClass} flex items-start gap-3`}>
            <AlertCircle size={22} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-sm">{bannerTitle}</p>
              <p className="text-xs mt-0.5 font-medium opacity-90">{bannerMessage}</p>
            </div>
          </div>
        )}

        {/* SECTION 1: STATUS SUMMARY */}
        <div className="border-b border-border-main dark:border-[#334155] pb-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-2xs ${iconContainerClass}`}>
                {isRevoked || isBlacklisted ? (
                  <AlertCircle size={24} />
                ) : (
                  <CheckCircle2 size={26} />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-extrabold text-[#0B2D5C] dark:text-text-primary leading-tight">
                    {headerTitle}
                  </h1>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeClass}`}>
                    <Check size={11} strokeWidth={3} />
                    {badgeText}
                  </span>
                </div>
                <p className="text-xs text-text-secondary dark:text-[#CBD5E1] font-medium mt-0.5">
                  {isAr
                    ? 'منتج أصلي معتمد ومسجل رسمياً في منصة ضمان سليبي (SLEEPEE)'
                    : 'Original certified product officially registered in Sleepee Warranty Platform'}
                </p>
              </div>
            </div>

            {/* Print & Download Actions */}
            <div className="flex items-center gap-2 no-print self-end sm:self-center">
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(true)}
                className="h-8.5 px-3 rounded-lg border border-border-main dark:border-[#334155] hover:border-slate-300 dark:hover:border-slate-600 bg-surface-secondary dark:bg-[#1E293B] hover:bg-surface dark:hover:bg-slate-700 text-text-primary dark:text-[#E2E8F0] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                title={t('printCertificate', language)}
              >
                <Printer size={14} />
                <span>{t('printCertificate', language)}</span>
              </button>
              <button
                type="button"
                onClick={handleExportPDF}
                disabled={isExporting}
                className="h-8.5 px-3.5 rounded-lg bg-[#0066ff] hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                title={t('downloadPDF', language)}
              >
                {isExporting ? <Loader2 size={14} className="animate-spin text-white" /> : <Download size={14} />}
                <span>{isExporting ? (isAr ? 'جاري التحميل...' : 'Downloading...') : t('downloadPDF', language)}</span>
              </button>
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-xs">
            <div className="bg-surface-secondary/80 dark:bg-[#1E293B] rounded-xl p-2.5 border border-border-main dark:border-[#334155] flex flex-col">
              <span className="text-[11px] text-text-secondary dark:text-[#CBD5E1] font-medium">{t('serialNumber', language)}</span>
              <span className="font-mono font-bold text-text-primary dark:text-[#F8FAFC] mt-0.5 text-xs truncate">
                {product.serialNumber}
              </span>
            </div>
            <div className="bg-surface-secondary/80 dark:bg-[#1E293B] rounded-xl p-2.5 border border-border-main dark:border-[#334155] flex flex-col">
              <span className="text-[11px] text-text-secondary dark:text-[#CBD5E1] font-medium">{t('purchaseDate', language)}</span>
              <span className="font-mono font-bold text-text-primary dark:text-[#F8FAFC] mt-0.5 text-xs">
                {product.purchaseDate || '18 - 01 - 2026'}
              </span>
            </div>
            <div className="bg-surface-secondary/80 dark:bg-[#1E293B] rounded-xl p-2.5 border border-border-main dark:border-[#334155] flex flex-col">
              <span className="text-[11px] text-text-secondary dark:text-[#CBD5E1] font-medium">{t('warrantyStartDate', language)}</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 text-xs">
                {product.warrantyStartDate || product.purchaseDate || '18 - 01 - 2026'}
              </span>
            </div>
            <div className="bg-surface-secondary/80 dark:bg-[#1E293B] rounded-xl p-2.5 border border-border-main dark:border-[#334155] flex flex-col">
              <span className="text-[11px] text-text-secondary dark:text-[#CBD5E1] font-medium">{t('warrantyEndDate', language)}</span>
              <span className="font-mono font-bold text-[#0B2D5C] dark:text-blue-300 mt-0.5 text-xs">
                {product.warrantyEndDate || '18 - 01 - 2036'}
              </span>
            </div>
            <div className="bg-surface-secondary/80 dark:bg-[#1E293B] rounded-xl p-2.5 border border-border-main dark:border-[#334155] flex flex-col col-span-2 sm:col-span-1">
              <span className="text-[11px] text-text-secondary dark:text-[#CBD5E1] font-medium">{t('warrantyPeriod', language)}</span>
              <span className="font-bold text-[#0066ff] dark:text-blue-400 mt-0.5 text-xs">
                {product.warrantyPeriod}
              </span>
            </div>
          </div>
        </div>

        {/* REPLACEMENT DETAILS CARD */}
        {product.replacementDetails && (
          <div className="mb-3.5 p-3.5 bg-blue-50/80 dark:bg-slate-800/80 border border-blue-200 dark:border-blue-900 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-blue-200 dark:border-blue-900 pb-2">
              <span className="font-extrabold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                {isAr ? 'تفاصيل استبدال المنتج' : 'Product Replacement Details'}
              </span>
              <span className="font-mono font-bold bg-surface dark:bg-slate-900 px-2.5 py-0.5 rounded text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-slate-700">
                {product.replacementDetails.replacementNumber}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-text-secondary dark:text-slate-300">
              <div>
                <span className="text-text-secondary opacity-70">{isAr ? 'السيريال الأصلي:' : 'Original Serial:'}</span>{' '}
                {product.replacementDetails.oldSerialNumber ? (
                  <button
                    type="button"
                    onClick={() => onSearchSerial?.(product.replacementDetails!.oldSerialNumber!)}
                    className="font-mono font-bold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                    title={isAr ? 'انقر لفتح سجل السيريال الأصلي' : 'Click to open original serial'}
                  >
                    {product.replacementDetails.oldSerialNumber}
                  </button>
                ) : 'N/A'}
              </div>
              <div>
                <span className="text-text-secondary opacity-70">{isAr ? 'السيريال البديل:' : 'Replacement Serial:'}</span>{' '}
                {product.replacementDetails.newSerialNumber ? (
                  <button
                    type="button"
                    onClick={() => onSearchSerial?.(product.replacementDetails!.newSerialNumber!)}
                    className="font-mono font-bold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                    title={isAr ? 'انقر لفتح سجل السيريال البديل' : 'Click to open replacement serial'}
                  >
                    {product.replacementDetails.newSerialNumber}
                  </button>
                ) : 'N/A'}
              </div>
              <div>
                <span className="text-text-secondary opacity-70">{isAr ? 'تاريخ الاستبدال:' : 'Replacement Date:'}</span>{' '}
                <span className="font-mono font-bold">{product.replacementDetails.replacementDate}</span>
              </div>
              <div className="sm:col-span-3">
                <span className="text-text-secondary opacity-70">{isAr ? 'سبب الاستبدال:' : 'Replacement Reason:'}</span>{' '}
                <span className="font-bold text-text-primary dark:text-slate-200">{product.replacementDetails.reason}</span>
              </div>
            </div>
          </div>
        )}

        {/* MAINTENANCE DETAILS CARD */}
        {product.maintenanceDetails && (
          <div className="mb-3.5 p-3.5 bg-purple-50/80 dark:bg-slate-800/80 border border-purple-200 dark:border-purple-900 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-purple-200 dark:border-purple-900 pb-2">
              <span className="font-extrabold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                {isAr ? 'تفاصيل حالة الصيانة الفنية' : 'Technical Maintenance Details'}
              </span>
              <span className="font-mono font-bold bg-surface dark:bg-slate-900 px-2.5 py-0.5 rounded text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-slate-700">
                {product.maintenanceDetails.maintenanceNumber}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-text-secondary dark:text-slate-300">
              <div>
                <span className="text-text-secondary opacity-70">{isAr ? 'حالة الطلب:' : 'Ticket Status:'}</span>{' '}
                <span className="font-bold text-purple-900 dark:text-purple-300">{product.maintenanceDetails.status}</span>
              </div>
              <div>
                <span className="text-text-secondary opacity-70">{isAr ? 'تاريخ الفتح:' : 'Open Date:'}</span>{' '}
                <span className="font-mono font-bold">{product.maintenanceDetails.openDate}</span>
              </div>
              <div>
                <span className="text-text-secondary opacity-70">{isAr ? 'مركز الصيانة:' : 'Service Center:'}</span>{' '}
                <span className="font-bold">{product.maintenanceDetails.serviceCenter}</span>
              </div>
            </div>
          </div>
        )}

        {/* OWNERSHIP TRANSFER HISTORY CARD */}
        {product.ownershipHistory && product.ownershipHistory.length > 0 && (
          <div className="mb-3.5 p-3.5 bg-teal-50/80 dark:bg-slate-800/80 border border-teal-200 dark:border-teal-900 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-teal-200 dark:border-teal-900 pb-2">
              <span className="font-extrabold text-teal-950 dark:text-teal-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                {isAr ? 'سجل نقل الملكية المعتمد' : 'Certified Ownership Transfer Record'}
              </span>
              <span className="font-mono font-bold bg-surface dark:bg-slate-900 px-2.5 py-0.5 rounded text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-slate-700">
                {product.ownershipHistory[0].transferNumber}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-text-secondary dark:text-slate-300">
              <div>
                <span className="text-text-secondary opacity-70">{isAr ? 'المالك السابق:' : 'Previous Owner:'}</span>{' '}
                <span className="font-bold text-text-primary dark:text-white">{product.ownershipHistory[0].previousOwner}</span>
              </div>
              <div>
                <span className="text-text-secondary opacity-70">{isAr ? 'المالك الحالي:' : 'Current Owner:'}</span>{' '}
                <span className="font-bold text-teal-950 dark:text-teal-300">{product.ownershipHistory[0].newOwner}</span>
              </div>
              <div>
                <span className="text-text-secondary opacity-70">{isAr ? 'تاريخ النقل:' : 'Transfer Date:'}</span>{' '}
                <span className="font-mono font-bold">{product.ownershipHistory[0].transferDate}</span>
              </div>
            </div>
          </div>
        )}

        {/* COLLAPSIBLE PRODUCT JOURNEY */}
        <div className="mb-3.5 border border-border-main dark:border-slate-700 rounded-xl overflow-hidden bg-surface dark:bg-slate-900/60">
          <button
            type="button"
            onClick={() => setIsJourneyOpen(!isJourneyOpen)}
            aria-expanded={isJourneyOpen}
            aria-controls="journey-accordion-content"
            className="w-full py-2 px-3.5 flex items-center justify-between text-xs font-semibold text-text-secondary dark:text-slate-300 hover:text-[#0066ff] dark:hover:text-blue-400 hover:bg-surface-secondary dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <History size={14} className="text-[#0066ff]" />
              <span>
                {isAr
                  ? `مسار دورة حياة المنتج المعتمدة (${journeySteps.length} مراحل)`
                  : `Certified Product Lifecycle (${journeySteps.length} stages)`}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-text-secondary opacity-50">
              <span>{isJourneyOpen ? (isAr ? 'إخفاء المسار' : 'Hide Journey') : (isAr ? 'عرض المراحل' : 'View Stages')}</span>
              {isJourneyOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </div>
          </button>

          <div id="journey-accordion-content">
            <ProductJourney product={product} isOpen={isJourneyOpen} variant="inline" language={language} />
          </div>
        </div>

        {/* THREE-COLUMN GRID: PRODUCT SPECS, CUSTOMER DATA, QR CODE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-3.5">
          
          {/* SECTION 2: PRODUCT IDENTITY CARD */}
          <div className="bg-surface-secondary/70 dark:bg-[#1E293B] rounded-xl p-3.5 sm:p-4 border border-border-main dark:border-[#334155] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-border-main dark:border-[#334155] mb-2.5">
                <div className="flex items-center gap-2 text-[#0B2D5C] dark:text-blue-300 font-bold text-xs sm:text-sm">
                  <span>{t('productSpecs', language)}</span>
                </div>
                <span className="text-[10px] font-bold text-[#0066ff] dark:text-blue-400 bg-blue-50 dark:bg-slate-700/40 px-2 py-0.5 rounded border border-blue-100 dark:border-[#334155]">
                  {isAr ? 'منتج أصلي' : 'Original Product'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-border-main/50 dark:border-slate-700/40">
                  <span className="text-text-secondary dark:text-[#CBD5E1]">{t('modelName', language)}:</span>
                  <span className="font-semibold text-text-primary dark:text-[#F8FAFC] truncate max-w-[200px]">{product.modelName}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border-main/50 dark:border-slate-700/40">
                  <span className="text-text-secondary dark:text-[#CBD5E1]">{t('dimensions', language)}:</span>
                  <span className="font-medium text-text-primary dark:text-[#F8FAFC] font-mono">{product.dimensions}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border-main/50 dark:border-slate-700/40">
                  <span className="text-text-secondary dark:text-[#CBD5E1]">{t('productionDate', language)}:</span>
                  <span className="font-mono text-text-primary dark:text-[#F8FAFC] font-medium">{product.productionDate}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-text-secondary dark:text-[#CBD5E1]">{t('serialNumber', language)}:</span>
                  <span className="font-mono font-bold text-text-primary dark:text-[#F8FAFC] text-[11px]">{product.serialNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: CUSTOMER INFORMATION CARD */}
          <div className="bg-surface-secondary/70 dark:bg-[#1E293B] rounded-xl p-3.5 sm:p-4 border border-border-main dark:border-[#334155] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-border-main dark:border-[#334155] mb-2.5">
                <div className="flex items-center gap-2 text-[#0B2D5C] dark:text-blue-300 font-bold text-xs sm:text-sm">
                  <User size={14} className="text-[#0066ff]" />
                  <span>{t('customerData', language)}</span>
                </div>
                <span className="text-[10px] text-text-secondary dark:text-[#CBD5E1] font-mono">
                  {product.invoiceNumber || 'INV-2026-00125'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-border-main/50 dark:border-slate-700/40">
                  <span className="text-text-secondary dark:text-[#CBD5E1]">{t('customerName', language)}:</span>
                  <span className="font-semibold text-text-primary dark:text-[#F8FAFC]">{product.customerName || (isAr ? 'أحمد محمد علي' : 'Ahmed Mohamed Ali')}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border-main/50 dark:border-slate-700/40">
                  <span className="text-text-secondary dark:text-[#CBD5E1]">{t('customerPhone', language)}:</span>
                  <span className="font-mono text-text-primary dark:text-[#F8FAFC] font-medium">{product.customerPhone || '01012345678'}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border-main/50 dark:border-slate-700/40">
                  <span className="text-text-secondary dark:text-[#CBD5E1]">{t('invoiceNumber', language)}:</span>
                  <span className="font-mono font-bold text-text-primary dark:text-[#F8FAFC]">{product.invoiceNumber || 'INV-2026-00125'}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-text-secondary dark:text-[#CBD5E1]">{t('purchaseDate', language)}:</span>
                  <span className="font-mono font-medium text-text-primary dark:text-[#F8FAFC]">{product.purchaseDate || '18 - 01 - 2026'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: QR CODE VERIFICATION CARD */}
          <div className="bg-surface-secondary/70 dark:bg-[#1E293B] rounded-xl p-3.5 sm:p-4 border border-border-main dark:border-[#334155] flex flex-col justify-between items-center text-center md:col-span-2 lg:col-span-1">
            <div className="w-full">
              <div className="flex items-center justify-between pb-2 border-b border-border-main dark:border-[#334155] mb-2">
                <div className="flex items-center gap-2 text-[#0B2D5C] dark:text-blue-300 font-bold text-xs sm:text-sm">
                  <QrCode size={14} className="text-[#0066ff]" />
                  <span>{isAr ? 'رمز التحقق (QR)' : 'Verification QR Code'}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  {isAr ? 'مشفر وموثق' : 'Encrypted & Valid'}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-border-main shadow-2xs my-2">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                    product.qrVerificationUrl ||
                    (getWarrantyNumber(product) !== 'غير متوفر'
                      ? `https://sleepee.com/verify?w=${getWarrantyNumber(product)}&s=${product.serialNumber}`
                      : `https://sleepee.com/verify?s=${product.serialNumber}`)
                  )}`}
                  alt="QR Verification"
                  className="w-22 h-22 object-contain"
                  crossOrigin="anonymous"
                />
                <span className="text-[11px] font-mono font-bold text-slate-800 mt-1">
                  {getWarrantyNumber(product)}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-text-secondary dark:text-[#CBD5E1] leading-tight">
              {isAr
                ? 'امسح الرمز بكاميرا الهاتف للتحقق المباشر من صحة وسريان شهادة الضمان من قاعدة بيانات سليبي'
                : 'Scan with smartphone camera to instantly verify certificate validity on Sleepee database'}
            </p>
          </div>

        </div>

        {/* UNIFIED BOTTOM SECTION */}
        <WarrantyBottomSection language={language} />

      </div>

      {/* Printable Certificate */}
      <PrintableCertificate product={product} />

      {/* Dedicated Print Window Modal */}
      <PrintCertificateModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        product={product}
      />

    </div>
  );
};
