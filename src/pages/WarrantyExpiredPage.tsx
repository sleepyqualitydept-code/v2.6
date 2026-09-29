import React, { useState } from 'react';
import {
  XCircle,
  Wrench,
  Printer,
  Download,
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
import { WarrantyBottomSection } from '../components/WarrantyBottomSection';
import { ProductJourney } from '../components/ProductJourney';
import { getProductLifecycleSteps } from '../utils/lifecycle';
import { Language, t } from '../utils/i18n';
import { useAccessibility } from '../context/AccessibilityProvider';

interface WarrantyExpiredPageProps {
  product: WarrantyProduct;
  onNewSearch: () => void;
  onRequestMaintenance: () => void;
  onSearchSerial?: (serial: string) => void;
  language?: Language;
}

export const WarrantyExpiredPage: React.FC<WarrantyExpiredPageProps> = ({
  product,
  onNewSearch,
  onRequestMaintenance,
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
        ? `صفحة تفاصيل الضمان المنتهي: المنتج ${product.modelName}، انتهت فترة صلاحية الضمان`
        : `Expired Warranty Details: ${product.modelName}, Warranty period has expired`,
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

  const journeySteps = getProductLifecycleSteps(product);

  return (
    <div className={`w-full max-w-[1360px] mx-auto py-3 sm:py-5 px-3 sm:px-6 font-sans ${isAr ? 'text-right' : 'text-left'}`}>
      
      {/* Top Quick Bar */}
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

      {/* Main Expired Certificate Card */}
      <div className="bg-surface dark:bg-surface-secondary rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-200/60 dark:shadow-none border border-border-main border-t-4 border-t-rose-500">
        
        {/* SECTION 1: EXPIRED STATUS SUMMARY */}
        <div className="border-b border-border-main dark:border-[#334155] pb-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900 flex items-center justify-center shrink-0 shadow-2xs">
                <XCircle size={26} className="text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-text-primary leading-tight">
                    {t('statusExpiredTitle', language)}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200">
                    <XCircle size={11} />
                    {t('statusExpiredBadge', language)}
                  </span>
                </div>
                <p className="text-xs text-text-secondary dark:text-[#CBD5E1] font-medium mt-0.5">
                  {isAr
                    ? 'انتهت فترة الضمان الرسمية لهذا المنتج مع الحفاظ على سجله التاريخي المعتمد'
                    : 'The official warranty period for this product has ended. Historical records preserved.'}
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
                className="h-8.5 px-3.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
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
                {product.purchaseDate || '18 - 01 - 2016'}
              </span>
            </div>
            <div className="bg-surface-secondary/80 dark:bg-[#1E293B] rounded-xl p-2.5 border border-border-main dark:border-[#334155] flex flex-col">
              <span className="text-[11px] text-text-secondary dark:text-[#CBD5E1] font-medium">{t('warrantyStartDate', language)}</span>
              <span className="font-mono font-bold text-text-secondary dark:text-[#CBD5E1] mt-0.5 text-xs">
                {product.warrantyStartDate || product.purchaseDate || '18 - 01 - 2016'}
              </span>
            </div>
            <div className="bg-surface-secondary/80 dark:bg-[#1E293B] rounded-xl p-2.5 border border-border-main dark:border-[#334155] flex flex-col">
              <span className="text-[11px] text-text-secondary dark:text-[#CBD5E1] font-medium">{t('warrantyEndDate', language)}</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400 mt-0.5 text-xs">
                {product.warrantyEndDate || '18 - 01 - 2026'}
              </span>
            </div>
            <div className="bg-surface-secondary/80 dark:bg-[#1E293B] rounded-xl p-2.5 border border-border-main dark:border-[#334155] flex flex-col col-span-2 sm:col-span-1">
              <span className="text-[11px] text-text-secondary dark:text-[#CBD5E1] font-medium">{t('warrantyPeriod', language)}</span>
              <span className="font-bold text-text-secondary dark:text-[#CBD5E1] mt-0.5 text-xs">
                {product.warrantyPeriod}
              </span>
            </div>
          </div>
        </div>

        {/* Maintenance CTA for Expired Products */}
        <div className="mb-3.5 p-3.5 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Wrench size={18} className="text-amber-700 dark:text-amber-400 shrink-0" />
            <span className="text-amber-900 dark:text-amber-200 font-semibold">
              {isAr
                ? 'يمكنك طلب صيانة أو تجديد لمرتبتك عبر مراكز الخدمة المعتمدة بأسعار خاصة.'
                : 'You can request certified maintenance or renewal for your mattress at special rates.'}
            </span>
          </div>
          <button
            type="button"
            onClick={onRequestMaintenance}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            {t('requestMaintenance', language)}
          </button>
        </div>

        {/* COLLAPSIBLE PRODUCT JOURNEY */}
        <div className="mb-3.5 border border-border-main dark:border-slate-700 rounded-xl overflow-hidden bg-surface dark:bg-slate-900/60">
          <button
            type="button"
            onClick={() => setIsJourneyOpen(!isJourneyOpen)}
            aria-expanded={isJourneyOpen}
            aria-controls="journey-expired-accordion"
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

          <div id="journey-expired-accordion">
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
                <span className="text-[10px] font-bold text-text-secondary dark:text-slate-400 bg-surface-secondary/70 dark:bg-slate-700/40 px-2 py-0.5 rounded border border-border-main dark:border-[#334155]">
                  {isAr ? 'سجل مؤرشف' : 'Archived Record'}
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
                  {product.invoiceNumber || 'INV-2016-00412'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-border-main/50 dark:border-slate-700/40">
                  <span className="text-text-secondary dark:text-[#CBD5E1]">{t('customerName', language)}:</span>
                  <span className="font-semibold text-text-primary dark:text-[#F8FAFC]">{product.customerName || (isAr ? 'محمود حسن إبراهيم' : 'Mahmoud Hassan')}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border-main/50 dark:border-slate-700/40">
                  <span className="text-text-secondary dark:text-[#CBD5E1]">{t('customerPhone', language)}:</span>
                  <span className="font-mono text-text-primary dark:text-[#F8FAFC] font-medium">{product.customerPhone || '01223344556'}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border-main/50 dark:border-slate-700/40">
                  <span className="text-text-secondary dark:text-[#CBD5E1]">{t('invoiceNumber', language)}:</span>
                  <span className="font-mono font-bold text-text-primary dark:text-[#F8FAFC]">{product.invoiceNumber || 'INV-2016-00412'}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-text-secondary dark:text-[#CBD5E1]">{t('purchaseDate', language)}:</span>
                  <span className="font-mono font-medium text-text-primary dark:text-[#F8FAFC]">{product.purchaseDate || '18 - 01 - 2016'}</span>
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
                <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                  {isAr ? 'منتهي وموثق' : 'Expired & Valid'}
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
                  className="w-22 h-22 object-contain grayscale"
                  crossOrigin="anonymous"
                />
                <span className="text-[11px] font-mono font-bold text-slate-800 mt-1">
                  {getWarrantyNumber(product)}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-text-secondary dark:text-[#CBD5E1] leading-tight">
              {isAr
                ? 'الرمز موثق في الأرشيف الرسمي لشهادات ضمان سليبي المنتهية'
                : 'Verified in Sleepee official archives for historical warranty certificates'}
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
