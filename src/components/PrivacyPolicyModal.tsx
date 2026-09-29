import React from 'react';
import { X, Lock, ShieldCheck, Database, Eye, CheckCircle2, UserCheck, Key, Cookie, Clock, Mail } from 'lucide-react';
import { Language, t } from '../utils/i18n';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  language = 'ar',
}) => {
  if (!isOpen) return null;

  const isAr = language === 'ar';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-policy-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
    >
      <div
        className={`bg-surface rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-border-main animate-in fade-in zoom-in-95 duration-200 z-[10000] ${
          isAr ? 'text-right' : 'text-left'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b border-border-main bg-slate-50 dark:bg-surface-secondary/60 ${
            isAr ? 'flex-row' : 'flex-row-reverse'
          }`}
        >
          <div className={`flex items-center gap-2.5 ${isAr ? 'flex-row' : 'flex-row-reverse text-left'}`}>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 shadow-2xs">
              <Lock size={18} />
            </div>
            <div>
              <h2 id="privacy-policy-title" className="text-base font-black text-text-primary">
                {isAr ? 'سياسة الخصوصية وسرية البيانات' : 'Data Privacy & Protection Policy'}
              </h2>
              <p className="text-xs font-semibold text-text-secondary mt-0.5">
                {t('companyName', language)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق نافذة سياسة الخصوصية' : 'Close Privacy Policy Dialog'}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-secondary dark:hover:bg-surface transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs sm:text-sm text-text-secondary leading-relaxed">
          
          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 flex items-start gap-3">
            <ShieldCheck size={22} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-text-primary text-sm">
                {isAr ? 'حماية خصوصيتك وسرية معلوماتك أولوية مطلقة' : 'Your Privacy & Data Security is Our Top Priority'}
              </h3>
              <p className="text-xs text-text-secondary mt-1 leading-normal">
                {isAr
                  ? 'تلتزم الشركة العربية لصناعة مراتب السوست والإسفنج بأعلى معايير حماية البيانات والخصوصية الرقمية وفق المعايير واللوائح المنظمة لأمن وسرية المعلومات.'
                  : 'The Arab Company for Spring and Foam Mattresses adheres to the highest information security and privacy compliance standards for all platform users.'}
              </p>
            </div>
          </div>

          {/* Section 1: البيانات التي يتم جمعها */}
          <div className="space-y-2">
            <h4 className="font-bold text-text-primary flex items-center gap-2">
              <Database size={16} className="text-emerald-600" />
              <span>{isAr ? '1. البيانات التي نقوم بجمعها' : '1. Types of Data We Collect'}</span>
            </h4>
            <ul className="space-y-1.5 pr-5 list-disc text-text-secondary text-xs">
              <li>
                <strong>{isAr ? 'بيانات التوثيق والاستعلام:' : 'Verification Data:'}</strong>{' '}
                {isAr
                  ? 'الرقم التسلسلي، كود QR، طراز المرتبة، المقاسات، وتاريخ التصنيع والشراء.'
                  : 'Serial number, QR code payload, mattress model, dimensions, and production timestamp.'}
              </li>
              <li>
                <strong>{isAr ? 'بيانات العميل الشخصية عند التفعيل:' : 'Customer Data on Activation:'}</strong>{' '}
                {isAr
                  ? 'الاسم الثلاثي، رقم الهاتف المحمول، المحافظة/العنوان، ورقم الفاتورة أو اسم المعرض.'
                  : 'Full customer name, mobile phone number, address/region, and invoice/retailer details.'}
              </li>
            </ul>
          </div>

          {/* Section 2: سجلات التصفح والتخزين المحلي */}
          <div className="space-y-2">
            <h4 className="font-bold text-text-primary flex items-center gap-2">
              <Cookie size={16} className="text-emerald-600" />
              <span>{isAr ? '2. سجلات الخادم والتخزين المحلي (LocalStorage & Cookies)' : '2. Server Logs & Local Storage'}</span>
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              {isAr
                ? 'نستخدم التخزين المحلي في متصفحك (LocalStorage) حصراً لتذكر تفضيلات الواجهة (مثل: تفضيل اللغة، الوضع الليلي، وإعدادات إمكانية الوصول لذوي الإعاقة). لا نستخدم ملفات تتبع إعلانية لأطراف ثالثة أو برمجيات تجسس.'
                : 'We use browser LocalStorage strictly to persist your interface preferences (language, dark mode, accessibility tools). We never deploy third-party advertising trackers or invasive telemetry.'}
            </p>
          </div>

          {/* Section 3: الغرض من معالجة البيانات */}
          <div className="space-y-2">
            <h4 className="font-bold text-text-primary flex items-center gap-2">
              <Eye size={16} className="text-emerald-600" />
              <span>{isAr ? '3. الغرض من معالجة واستخدام البيانات' : '3. Purpose of Data Processing'}</span>
            </h4>
            <ul className="space-y-1.5 pr-5 list-disc text-text-secondary text-xs">
              <li>{isAr ? 'توثيق واحتساب مدة سريان شهادة الضمان للمنتج بشكل رسمي ومؤتمت.' : 'Documenting and computing active warranty duration automatically.'}</li>
              <li>{isAr ? 'التواصل مع العميل لتنسيق زيارات المعاينة الفنية أو الصيانة في حال طلبها.' : 'Contacting customers to schedule quality engineer inspections or service requests.'}</li>
              <li>{isAr ? 'منع تزوير السيريالات واكتشاف المنتجات المقلدة لحماية حقوق المستهلك.' : 'Preventing counterfeiting and detecting blacklisted serial tags.'}</li>
            </ul>
          </div>

          {/* Section 4: أمان البيانات والتشفير وتعتيم الهوية */}
          <div className="space-y-2">
            <h4 className="font-bold text-text-primary flex items-center gap-2">
              <Key size={16} className="text-emerald-600" />
              <span>{isAr ? '4. أمان البيانات وتعتيم الهوية (Data Masking)' : '4. Data Security & Data Masking'}</span>
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              {isAr
                ? 'تُطبّق المنصة تقنيات تشفير قوية لنقل البيانات عبر بروتوكولات HTTPS/TLS المشفرة. كما نعتمد سياسة تعتيم وحجب الأرقام والأسماء في الواجهة العامة (Data Masking) لضمان عدم كشف هوية العميل أو رقم هاتفه لأي مستعلم غير مصرح له.'
                : 'All transmissions are secured via HTTPS/TLS. The public portal enforces strict Data Masking on customer names and phone numbers to safeguard privacy.'}
            </p>
          </div>

          {/* Section 5: عدم مشاركة أو بيع البيانات */}
          <div className="space-y-2">
            <h4 className="font-bold text-text-primary flex items-center gap-2">
              <UserCheck size={16} className="text-emerald-600" />
              <span>{isAr ? '5. عدم مشاركة أو بيع البيانات' : '5. Strict No-Sharing & No-Selling Policy'}</span>
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              {isAr
                ? 'تتعهد الشركة بعدم بيع أو تأجير أو مشاركة أي من بيانات العملاء أو السجلات المسجلة مع أي شركات تسويق أو جهات خارجية. تقتصر صلاحية الاطلاع حصراً على موظفي خدمة العملاء والدعم الفني المعتمدين.'
                : 'The company pledges never to sell, rent, or trade customer information with external marketing brokers. Access is restricted to authorized customer care personnel.'}
            </p>
          </div>

          {/* Section 6: مدة الاحتفاظ بالبيانات وحقوق العميل */}
          <div className="space-y-2">
            <h4 className="font-bold text-text-primary flex items-center gap-2">
              <Clock size={16} className="text-emerald-600" />
              <span>{isAr ? '6. مدة الاحتفاظ بالبيانات وحقوق المستخدم' : '6. Data Retention & Customer Rights'}</span>
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              {isAr
                ? 'يتم الاحتفاظ بسجلات الضمان طوال مدة سريانه (10 سنوات). يحق للعميل طلب الاطلاع على بياناته المسجلة، أو تصحيح بيانات الاتصال، أو طلب حذف بياناته الشخصية بعد انتهاء سريان الضمان.'
                : 'Warranty records are retained for the active coverage term (10 years). Users have the right to access, rectify, or request deletion of personal records.'}
            </p>
          </div>

          {/* Section 7: مسؤول الخصوصية وقنوات التواصل */}
          <div className="space-y-2">
            <h4 className="font-bold text-text-primary flex items-center gap-2">
              <Mail size={16} className="text-emerald-600" />
              <span>{isAr ? '7. مسؤول حماية الخصوصية والتواصل' : '7. Privacy Inquiries & Contact'}</span>
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              {isAr
                ? 'لأي استفسارات تتعلق بسياسة الخصوصية وحماية البيانات، يرجى التواصل مع فريق حماية البيانات عبر البريد الإلكتروني: privacy@sleepee.com أو عبر الخط الساخن 19707.'
                : 'For privacy requests, contact our Data Protection Team at privacy@sleepee.com or call Hotline 19707.'}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-border-main bg-slate-50 dark:bg-surface-secondary/60 flex items-center justify-between">
          <span className="text-xs text-text-secondary">
            {isAr ? 'بريد الخصوصية: privacy@sleepee.com' : 'Privacy email: privacy@sleepee.com'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0B2D5C] hover:bg-[#133358] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs active:scale-95"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
