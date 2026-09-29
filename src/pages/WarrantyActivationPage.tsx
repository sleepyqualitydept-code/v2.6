import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  User,
  Phone,
  MapPin,
  Receipt,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  History,
  ShieldAlert,
  FileText,
  ExternalLink,
  Printer,
} from 'lucide-react';
import { WarrantyProduct } from '../types/warranty';
import { maskPhoneNumber, generateWarrantyNumber, generateCustomerId, getWarrantyNumber } from '../utils/masking';
import { PrintableCertificate } from '../components/PrintableCertificate';
import { PrintCertificateModal } from '../components/PrintCertificateModal';
import { ProductJourney } from '../components/ProductJourney';
import { getProductLifecycleSteps } from '../utils/lifecycle';
import { WarrantyBottomSection } from '../components/WarrantyBottomSection';
import { Language, t } from '../utils/i18n';
import { useAccessibility } from '../context/AccessibilityProvider';
import { WarrantyEligibilityEngine } from '../utils/warrantyEligibility';

interface WarrantyActivationPageProps {
  product: WarrantyProduct;
  onNewSearch: () => void;
  onActivationSuccess: (updatedProduct: WarrantyProduct) => void;
  onViewExistingCertificate?: (product: WarrantyProduct) => void;
  onSearchSerial?: (serial: string) => void;
  language?: Language;
}

export const WarrantyActivationPage: React.FC<WarrantyActivationPageProps> = ({
  product,
  onNewSearch,
  onActivationSuccess,
  onViewExistingCertificate,
  language = 'ar',
}) => {
  const isAr = language === 'ar';
  const { announce } = useAccessibility();

  React.useEffect(() => {
    announce(
      isAr
        ? `صفحة تفعيل الضمان: يرجى استكمال بيانات المشتري والفاتورة للمنتج ${product.modelName}`
        : `Warranty Activation Page: Please enter customer and invoice details for ${product.modelName}`,
      false,
      language
    );
  }, [product.serialNumber]);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [alternativePhone, setAlternativePhone] = useState('');
  const [governorate, setGovernorate] = useState(isAr ? 'القاهرة' : 'Cairo');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('2026-01-18');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJourneyModalOpen, setIsJourneyModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isJourneyOpen, setIsJourneyOpen] = useState(false);

  const eligibility = React.useMemo(() => {
    return WarrantyEligibilityEngine.validateEligibility(product.serialNumber);
  }, [product.serialNumber]);

  const isAlreadyActivated = product.status === 'active' || !!product.warrantyNumber || eligibility.statusCode === 'ALREADY_ACTIVATED';
  const journeySteps = getProductLifecycleSteps(product);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAlreadyActivated) return;

    if (!eligibility.isEligible && eligibility.statusCode !== 'ALREADY_ACTIVATED') {
      alert(eligibility.message);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedWar = generateWarrantyNumber();
      const generatedCus = generateCustomerId();

      const updatedProduct: WarrantyProduct = {
        ...product,
        status: 'active',
        warrantyNumber: generatedWar,
        customerId: product.customerId || generatedCus,
        customerName: customerName.trim() || (isAr ? 'أحمد محمد علي' : 'Ahmed Mohamed Ali'),
        customerPhone: customerPhone.trim() || '01012345678',
        alternativePhone: alternativePhone.trim() || undefined,
        nationalId: nationalId.trim() || undefined,
        governorate: governorate || (isAr ? 'القاهرة' : 'Cairo'),
        city: city.trim() || (isAr ? 'مدينة نصر' : 'Nasr City'),
        address: address.trim() || (isAr ? 'شارع الطيران، مدينة نصر' : 'Tayaran St, Nasr City'),
        invoiceNumber: invoiceNumber.trim() || 'INV-2026-00125',
        purchaseDate: purchaseDate || '18 - 01 - 2026',
        warrantyStartDate: purchaseDate || '18 - 01 - 2026',
        warrantyEndDate: '18 - 01 - 2036',
        qrVerificationUrl: `https://sleepee.com/verify?w=${generatedWar}&s=${product.serialNumber}`,
        timeline: [
          { title: 'التصنيع', date: product.productionDate || '10 - 01 - 2026', completed: true },
          { title: 'فحص جودة', date: '12 - 01 - 2026', completed: true },
          { title: 'تعبئة وتغليف', date: '14 - 01 - 2026', completed: true },
          { title: 'شحن', date: '16 - 01 - 2026', completed: true },
          { title: 'بيع', date: purchaseDate || '18 - 01 - 2026', completed: true },
          { title: 'تفعيل ضمان', date: purchaseDate || '18 - 01 - 2026', completed: true },
        ],
        auditTrail: [
          ...(product.auditTrail || []),
          {
            id: `AUD-${Date.now()}`,
            dateTime: new Date().toLocaleString(isAr ? 'ar-EG' : 'en-US'),
            user: 'Self-Service Portal User',
            role: 'Customer',
            action: 'activated',
            source: 'Warranty Portal',
            details: 'Activated online via Customer Self-Service Portal with invoice verification.',
          },
        ],
      };

      setIsSubmitting(false);
      onActivationSuccess(updatedProduct);
    }, 600);
  };

  // IF ALREADY ACTIVATED
  if (isAlreadyActivated) {
    return (
      <div className={`w-full max-w-4xl mx-auto py-3 sm:py-5 px-3 sm:px-6 font-sans ${isAr ? 'text-right' : 'text-left'}`}>
        
        {/* Top Quick Bar */}
        <div className="flex items-center justify-between mb-3 no-print">
          <button
            onClick={onNewSearch}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface hover:bg-surface-secondary text-text-secondary dark:text-text-primary font-semibold rounded-xl border border-border-main text-xs shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            <ArrowRight size={14} className={isAr ? '' : 'rotate-180'} />
            <span>{t('newSearch', language)}</span>
          </button>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-text-secondary">{isAr ? 'السيريال:' : 'Serial:'}</span>
            <span className="font-mono font-bold text-text-primary bg-surface px-2 py-0.5 rounded-md border border-border-main">
              {product.serialNumber}
            </span>
          </div>
        </div>

        {/* DUPLICATE ACTIVATION BLOCKER CARD */}
        <div className="bg-surface dark:bg-surface-secondary rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 dark:shadow-none border border-border-main border-t-4 border-t-amber-500 space-y-6">
          
          {/* Top Banner Alert */}
          <div className="p-5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
              <ShieldAlert size={28} />
            </div>
            <div className={`space-y-1 ${isAr ? 'text-center sm:text-right' : 'text-center sm:text-left'}`}>
              <h2 className="text-lg sm:text-xl font-extrabold text-amber-950 dark:text-amber-100">
                {isAr ? 'هذا المنتج مسجل ومفعل بالفعل' : 'This Product is Already Registered & Active'}
              </h2>
              <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-300 leading-relaxed font-medium">
                {isAr
                  ? 'تم تفعيل ضمان هذا الرقم التسلسلي مسبقاً في النظام. يمنع تكرار تفعيل شهادات الضمان لنفس المنتج.'
                  : 'Warranty for this serial number is already activated. Duplicate activations are prohibited.'}
              </p>
            </div>
          </div>

          {/* Existing Activation Record Card */}
          <div className="bg-surface-secondary rounded-2xl p-5 border border-border-main space-y-4">
            <div className="flex items-center justify-between border-b border-border-main pb-3">
              <span className="text-xs font-bold text-[#0B2D5C] dark:text-blue-300 flex items-center gap-2">
                <FileText size={16} className="text-blue-600 dark:text-blue-400" />
                <span>{isAr ? 'تفاصيل شهادة الضمان المسجلة' : 'Registered Certificate Details'}</span>
              </span>
              <span className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                {t('statusActiveBadge', language)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="bg-surface p-3 rounded-xl border border-border-main shadow-2xs">
                <span className="text-[10px] text-text-secondary font-medium block">{isAr ? 'رقم وثيقة الضمان (WAR)' : 'Warranty Number (WAR)'}</span>
                <span className="font-mono font-black text-blue-700 dark:text-blue-400 text-sm block mt-1">
                  {getWarrantyNumber(product)}
                </span>
              </div>

              <div className="bg-surface p-3 rounded-xl border border-border-main shadow-2xs">
                <span className="text-[10px] text-text-secondary font-medium block">{isAr ? 'تاريخ التفعيل' : 'Activation Date'}</span>
                <span className="font-mono font-bold text-text-primary text-xs block mt-1">
                  {product.warrantyStartDate || '18 - 01 - 2026'}
                </span>
              </div>

              <div className="bg-surface p-3 rounded-xl border border-border-main shadow-2xs">
                <span className="text-[10px] text-text-secondary font-medium block">{t('customerName', language)}</span>
                <span className="font-bold text-text-primary text-xs block mt-1 truncate">
                  {product.customerName || (isAr ? 'أحمد محمد علي' : 'Ahmed Mohamed Ali')}
                </span>
              </div>

              <div className="bg-surface p-3 rounded-xl border border-border-main shadow-2xs">
                <span className="text-[10px] text-text-secondary font-medium block">{t('customerPhone', language)}</span>
                <span className="font-mono font-bold text-text-primary text-xs block mt-1">
                  {maskPhoneNumber(product.customerPhone || '01012345678')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {onViewExistingCertificate && (
              <button
                type="button"
                onClick={() => onViewExistingCertificate(product)}
                className="w-full sm:flex-1 h-12 bg-[#0066ff] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 active:scale-98 cursor-pointer"
              >
                <ExternalLink size={16} />
                <span>{isAr ? 'عرض شهادة الضمان الرسمية الحالية' : 'View Official Warranty Certificate'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="w-full sm:w-auto h-12 px-5 bg-surface-secondary hover:bg-surface text-text-secondary dark:text-text-primary font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-2 border border-border-main"
            >
              <Printer size={16} />
              <span>{t('printCertificate', language)}</span>
            </button>

            <button
              type="button"
              onClick={onNewSearch}
              className="w-full sm:w-auto h-12 px-6 bg-surface-secondary hover:bg-surface text-text-secondary dark:text-text-primary font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer border border-border-main"
            >
              {t('newSearch', language)}
            </button>
          </div>

        </div>

        {/* Printable Certificate View */}
        <PrintableCertificate product={product} />
      </div>
    );
  }

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
          <span className="text-text-secondary">{t('serialNumber', language)}:</span>
          <span className="font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-surface-secondary px-2.5 py-0.5 rounded-md border border-amber-200 dark:border-border-main">
            {product.serialNumber}
          </span>
        </div>
      </div>

      {/* Main Action Card */}
      <div className="bg-surface dark:bg-surface-secondary rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-200/60 dark:shadow-none border border-border-main border-t-4 border-t-amber-500">
        
        {/* COMPACT STATUS HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-border-main dark:border-slate-800 mb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900 flex items-center justify-center shrink-0 shadow-2xs">
              <AlertTriangle size={22} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-[#0B2D5C] dark:text-text-primary leading-tight">
                  {t('statusPendingTitle', language)}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  <Clock size={11} strokeWidth={2.5} />
                  {t('statusPendingBadge', language)}
                </span>
              </div>
              <p className="text-xs text-text-secondary dark:text-slate-400 font-medium mt-0.5">
                {isAr
                  ? 'منتج أصلي معتمد. يرجى استكمال بيانات العميل أدناه لبدء سريان فترة الضمان الرسمية'
                  : 'Certified genuine product. Complete customer details below to activate the official warranty'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsJourneyModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-main dark:border-slate-700 hover:border-slate-300 bg-surface-secondary dark:bg-slate-800 hover:bg-surface dark:hover:bg-slate-700 text-text-secondary dark:text-text-primary text-xs font-semibold self-start sm:self-center cursor-pointer transition-colors shadow-2xs"
          >
            <History size={13} className="text-text-secondary dark:text-slate-400" />
            <span>{isAr ? 'سجل المنتج' : 'Product History'}</span>
          </button>
        </div>

        {/* COLLAPSIBLE PRODUCT JOURNEY */}
        <div className="mb-3.5 border border-border-main dark:border-slate-700 rounded-xl overflow-hidden bg-surface dark:bg-slate-900/60">
          <button
            type="button"
            onClick={() => setIsJourneyOpen(!isJourneyOpen)}
            aria-expanded={isJourneyOpen}
            aria-controls="journey-activation-accordion"
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

          <div id="journey-activation-accordion">
            <ProductJourney product={product} isOpen={isJourneyOpen} variant="inline" language={language} />
          </div>
        </div>

        {/* PRODUCT IDENTIFICATION SECTION */}
        <div className="bg-surface-secondary rounded-xl p-3 sm:p-4 border border-border-main mb-4">
          <div className="flex items-center justify-between pb-2 border-b border-border-main mb-2.5">
            <div className="flex items-center gap-2 text-[#0B2D5C] dark:text-blue-300 font-bold text-xs sm:text-sm">
              <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-surface text-[#0066ff] dark:text-blue-400 flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="6" width="20" height="12" rx="3" />
                  <line x1="2" y1="12" x2="22" y2="12" strokeDasharray="2 2" />
                  <path d="M6 18v2M18 18v2" />
                </svg>
              </div>
              <span>{t('productSpecs', language)}</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              {isAr ? `ضمان لمدة ${product.warrantyPeriod || '10 سنوات'}` : `Warranty ${product.warrantyPeriod || '10 Years'}`}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-surface p-2 rounded-lg border border-border-main">
              <span className="text-[10px] text-text-secondary block font-medium">{t('modelName', language)}</span>
              <span className="font-semibold text-text-primary text-xs truncate block mt-0.5">
                {product.modelName}
              </span>
            </div>
            <div className="bg-surface p-2 rounded-lg border border-border-main">
              <span className="text-[10px] text-text-secondary block font-medium">{t('dimensions', language)}</span>
              <span className="font-bold text-text-primary text-xs font-mono block mt-0.5">
                {product.dimensions}
              </span>
            </div>
            <div className="bg-surface p-2 rounded-lg border border-border-main">
              <span className="text-[10px] text-text-secondary block font-medium">{t('productionDate', language)}</span>
              <span className="font-mono text-text-primary text-xs block mt-0.5">
                {product.productionDate}
              </span>
            </div>
            <div className="bg-surface p-2 rounded-lg border border-border-main">
              <span className="text-[10px] text-text-secondary block font-medium">{t('serialNumber', language)}</span>
              <span className="font-mono font-bold text-amber-700 dark:text-amber-400 text-xs block mt-0.5 truncate">
                {product.serialNumber}
              </span>
            </div>
          </div>
        </div>

        {/* PRIMARY CUSTOMER ACTION: WARRANTY ACTIVATION FORM */}
        <div className="bg-gradient-to-b from-blue-50/40 via-surface to-surface dark:from-slate-800/40 dark:via-surface-secondary dark:to-surface-secondary rounded-xl p-4 sm:p-5 border border-border-main shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border-main">
            <div className="w-6 h-6 rounded-lg bg-[#0066ff] text-white flex items-center justify-center shadow-2xs">
              <ShieldCheck size={15} />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-[#0B2D5C] dark:text-text-primary">
              {isAr ? 'استمارة تفعيل الضمان' : 'Warranty Activation Form'}
            </h2>
            <span className={`text-[11px] text-text-secondary font-medium ${isAr ? 'mr-auto' : 'ml-auto'}`}>
              {isAr ? '* حقول إلزامية لإصدار الشهادة' : '* Required fields for certificate issue'}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  {t('customerName', language)} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={isAr ? 'مثال: أحمد محمد علي' : 'e.g., Ahmed Mohamed Ali'}
                    className={`w-full h-10 ${isAr ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'} bg-input-bg border border-input-border focus:border-[#0066ff] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs sm:text-sm font-medium outline-none transition-all text-text-primary`}
                  />
                  <User size={15} className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  {t('customerPhone', language)} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder={isAr ? 'مثال: 01012345678' : 'e.g., 01012345678'}
                    className={`w-full h-10 ${isAr ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'} bg-input-bg border border-input-border focus:border-[#0066ff] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs sm:text-sm font-medium outline-none transition-all tabular-nums text-text-primary`}
                  />
                  <Phone size={15} className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  {isAr ? 'رقم هاتف بديل' : 'Alternative Phone'} <span className="text-slate-400 font-normal">({isAr ? 'اختياري' : 'Optional'})</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={alternativePhone}
                    onChange={(e) => setAlternativePhone(e.target.value)}
                    placeholder={isAr ? 'مثال: 01212345678' : 'e.g., 01212345678'}
                    className={`w-full h-10 ${isAr ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'} bg-input-bg border border-input-border focus:border-[#0066ff] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs sm:text-sm font-medium outline-none transition-all tabular-nums text-text-primary`}
                  />
                  <Phone size={15} className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  {isAr ? 'المحافظة' : 'Governorate'} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className={`w-full h-10 ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} bg-input-bg border border-input-border focus:border-[#0066ff] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs sm:text-sm font-medium outline-none transition-all text-text-primary cursor-pointer`}
                  >
                    <option value={isAr ? 'القاهرة' : 'Cairo'}>{isAr ? 'القاهرة' : 'Cairo'}</option>
                    <option value={isAr ? 'الجيزة' : 'Giza'}>{isAr ? 'الجيزة' : 'Giza'}</option>
                    <option value={isAr ? 'الإسكندرية' : 'Alexandria'}>{isAr ? 'الإسكندرية' : 'Alexandria'}</option>
                    <option value={isAr ? 'الدقهلية' : 'Dakahlia'}>{isAr ? 'الدقهلية' : 'Dakahlia'}</option>
                    <option value={isAr ? 'الشرقية' : 'Sharqia'}>{isAr ? 'الشرقية' : 'Sharqia'}</option>
                    <option value={isAr ? 'القليوبية' : 'Qalyubia'}>{isAr ? 'القليوبية' : 'Qalyubia'}</option>
                  </select>
                  <MapPin size={15} className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  {isAr ? 'المدينة / المنطقة' : 'City / District'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={isAr ? 'مثال: مدينة نصر / التجمع الخامس' : 'e.g., Nasr City'}
                  className="w-full h-10 px-3 bg-input-bg border border-input-border focus:border-[#0066ff] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs sm:text-sm font-medium outline-none transition-all text-text-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  {isAr ? 'العنوان بالتفصيل' : 'Detailed Address'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={isAr ? 'مثال: 12 شارع الطيران، الدور الرابع، شقة 8' : 'e.g., 12 Tayaran St, 4th Floor, Apt 8'}
                  className="w-full h-10 px-3 bg-input-bg border border-input-border focus:border-[#0066ff] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs sm:text-sm font-medium outline-none transition-all text-text-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  {isAr ? 'الرقم القومي (اختياري)' : 'National ID (Optional)'}
                </label>
                <input
                  type="text"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder="29001012345678"
                  maxLength={14}
                  className="w-full h-10 px-3 bg-input-bg border border-input-border focus:border-[#0066ff] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs sm:text-sm font-medium outline-none transition-all font-mono tracking-wider text-text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  {t('invoiceNumber', language)} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="INV-2026-00125"
                    className={`w-full h-10 ${isAr ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'} bg-input-bg border border-input-border focus:border-[#0066ff] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs sm:text-sm font-medium outline-none transition-all font-mono tabular-nums text-text-primary`}
                  />
                  <Receipt size={15} className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  {t('purchaseDate', language)} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className={`w-full h-10 ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} bg-input-bg border border-input-border focus:border-[#0066ff] focus:ring-2 focus:ring-blue-100 rounded-xl text-xs sm:text-sm font-medium outline-none transition-all font-mono tabular-nums text-text-primary`}
                  />
                  <Calendar size={15} className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`} />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-[#0066ff] to-[#0052cc] hover:from-[#0055dd] hover:to-[#0044aa] text-white font-bold text-sm sm:text-base rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/25 active:scale-[0.99] cursor-pointer"
              >
                <ShieldCheck size={18} />
                <span>
                  {isSubmitting
                    ? (isAr ? 'جاري توثيق وتفعيل الضمان...' : 'Activating & Registering...')
                    : (isAr ? 'تأكيد وتفعيل الضمان الآن' : 'Confirm & Activate Warranty Now')}
                </span>
              </button>
            </div>
          </form>

          {/* Unified Bottom Section */}
          <WarrantyBottomSection language={language} />
        </div>

      </div>

      {/* Shared Lifecycle Journey Modal */}
      <ProductJourney
        product={product}
        isOpen={isJourneyModalOpen}
        onClose={() => setIsJourneyModalOpen(false)}
        variant="modal"
        language={language}
      />

      {/* Dedicated Print Window Modal */}
      <PrintCertificateModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        product={product}
      />

    </div>
  );
};
