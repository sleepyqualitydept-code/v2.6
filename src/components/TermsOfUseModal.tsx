import React from 'react';
import { X, Scale, CheckCircle2, AlertTriangle, ShieldCheck, FileCheck, Terminal, Cpu } from 'lucide-react';
import { Language, t } from '../utils/i18n';

interface TermsOfUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
}

export const TermsOfUseModal: React.FC<TermsOfUseModalProps> = ({
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
      aria-labelledby="terms-of-use-title"
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
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0 shadow-2xs">
              <Scale size={18} />
            </div>
            <div>
              <h2 id="terms-of-use-title" className="text-base font-black text-text-primary">
                {isAr ? 'شروط وأحكام استخدام المنصة الرقمية' : 'Platform Terms of Use & Legal Conditions'}
              </h2>
              <p className="text-xs font-semibold text-text-secondary mt-0.5">
                {t('companyName', language)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق نافذة شروط الاستخدام' : 'Close Terms of Use Dialog'}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-secondary dark:hover:bg-surface transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs sm:text-sm text-text-secondary leading-relaxed">
          
          {/* Summary Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-3">
            <ShieldCheck size={22} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-text-primary text-sm">
                {isAr ? 'اتفاقية الاستخدام القانوني لمنظومة سليبي' : 'Legal Agreement for Sleepee Digital Platform'}
              </h3>
              <p className="text-xs text-text-secondary mt-1 leading-normal">
                {isAr
                  ? 'يخضع الدخول إلى منصة التحقق من الضمان وتوثيق المنتجات لشروط الاستخدام التالية. يعد استخدامك للبوابة بمثابة موافقة قانونية صريحة على الالتزام الكامل بهذه الضوابط.'
                  : 'Accessing and using the Sleepee Warranty Verification Platform is subject to these Terms. Using this portal constitutes express agreement to abide by all platform operational policies.'}
              </p>
            </div>
          </div>

          {/* Section 1: نطاق والغرض من المنصة الرقمية */}
          <div className="space-y-2">
            <h4 className="font-bold text-text-primary flex items-center gap-2">
              <FileCheck size={16} className="text-indigo-600" />
              <span>{isAr ? '1. الغرض من المنصة والترخيص الممنوح' : '1. Purpose of Portal & Grant of License'}</span>
            </h4>
            <p className="text-xs text-text-secondary">
              {isAr
                ? 'توفر الشركة هذه المنصة كخدمة مجانية لمقتني مراتب «سليبي» ومنافذ التوزيع المعتمدة للتحقق الفوري من أصالة المنتجات وسريان شهادات الضمان المعتمدة. يُمنح المستخدم ترخيصاً شخصياً ومحدوداً للاستعلام الفردي فقط.'
                : 'The platform is provided free of charge for consumers and authorized dealers to verify product authenticity and active warranty records. Users are granted a limited personal license solely for individual lookups.'}
            </p>
          </div>

          {/* Section 2: صحة ومسؤولية البيانات المدخلة */}
          <div className="space-y-2">
            <h4 className="font-bold text-text-primary flex items-center gap-2">
              <CheckCircle2 size={16} className="text-indigo-600" />
              <span>{isAr ? '2. مسؤولية المستخدم عن صحة البيانات المدخلة' : '2. Accuracy of User-Provided Information'}</span>
            </h4>
            <ul className="space-y-1.5 pr-5 list-disc text-text-secondary text-xs">
              <li>
                {isAr
                  ? 'يلتزم المستخدم بإدخال الأرقام التسلسية الصحيحة وبيانات الاتصال الحقيقية عند تفعيل الضمان أو طلب الخدمة.'
                  : 'Users are strictly responsible for providing valid serial numbers, true contact details, and authentic invoice data.'}
              </li>
              <li>
                {isAr
                  ? 'يتحمل المستخدم المسؤولية الكاملة عن أي تأخير أو تعذر لتقديم خدمات الضمان ناتج عن تقديم بيانات اتصال خاطئة أو غير دقيقة.'
                  : 'The company assumes no liability for delayed warranty service resulting from inaccurate or fabricated contact records.'}
              </li>
            </ul>
          </div>

          {/* Section 3: الاستخدام المحظور وحماية النظام من الاختراق والزحف */}
          <div className="space-y-2">
            <h4 className="font-bold text-text-primary flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-600" />
              <span>{isAr ? '3. الاستخدامات المحظورة وحماية النظام' : '3. Prohibited Uses & System Safeguards'}</span>
            </h4>
            <p className="text-xs text-text-secondary">
              {isAr ? 'يحظر على المستخدمين بشكل قاطع ارتكاب أي من الأفعال التالية:' : 'Users are strictly prohibited from engaging in:'}
            </p>
            <ul className="space-y-1.5 pr-5 list-disc text-text-secondary text-xs">
              <li>{isAr ? 'استخدام برمجيات الزحف الآلي (Web Scraping أو Bots) أو محاولات تخمين الأرقام التسلسية بالقوة الغاشمة (Brute Force).' : 'Automated scraping, crawling, or brute-force serial guessing attempts.'}</li>
              <li>{isAr ? 'محاولة اختراق قواعد البيانات أو تعطيل خوادم المنصة أو إثقالها بطلبات وهمية (DoS/DDoS).' : 'Attempting to breach databases, circumvent authentication, or overwhelm server infrastructure.'}</li>
              <li>{isAr ? 'تزوير أو تزييف شهادات الضمان الرقمية أو استخدام أرقام تسلسلية مخصصة لمنتجات أخرى.' : 'Counterfeiting, forging, or re-assigning digital certificates to unauthorized units.'}</li>
              <li>{isAr ? 'إعادة بيع بيانات المنصة أو استغلالها لأغراض تجارية غير مصرح بها.' : 'Commercial resale or unauthorized exploitation of warranty database records.'}</li>
            </ul>
          </div>

          {/* Section 4: حقوق الملكية الفكرية والعلامات التجارية */}
          <div className="space-y-2">
            <h4 className="font-bold text-text-primary flex items-center gap-2">
              <Cpu size={16} className="text-indigo-600" />
              <span>{isAr ? '4. حقوق الملكية الفكرية' : '4. Intellectual Property & Brand Rights'}</span>
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              {isAr
                ? 'كافة العلامات التجارية، وشعار «سليبي»، والتصميمات الهندسية، وبرمجيات النظام، ونصوص وسياسات المنصة هي ملكية حصرية للشركة العربية لصناعة مراتب السوست والإسفنج، ومحمية بموجب قوانين حماية الملكية الفكرية وحقوق النشر الدولية والمحلية.'
                : 'All trademarks, the Sleepee logo, brand assets, system software, and documentation are the exclusive property of The Arab Company for Spring and Foam Mattresses and are protected by applicable intellectual property laws.'}
            </p>
          </div>

          {/* Section 5: حدود المسؤولية التقنية وإتاحة الخدمة */}
          <div className="space-y-2">
            <h4 className="font-bold text-text-primary flex items-center gap-2">
              <Terminal size={16} className="text-indigo-600" />
              <span>{isAr ? '5. إتاحة الخدمة وحدود المسؤولية التقنية' : '5. Service Availability & Technical Disclaimers'}</span>
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              {isAr
                ? 'تبذل الشركة أقصى جهد لضمان استمرارية عمل المنصة بنسبة 99.9% على مدار الساعة. ومع ذلك، لا تتحمل الشركة المسؤولية عن أي انقطاع مؤقت ناجم عن أعمال الصيانة الدورية أو أعطال شبكات الاتصال والإنترنت الخارجة عن إرادتها.'
                : 'While we strive for 99.9% portal uptime, the company is not liable for temporary service interruptions due to scheduled maintenance or external network issues.'}
            </p>
          </div>

          {/* Section 6: القانون الحاكم وفض النزاعات */}
          <div className="space-y-2">
            <h4 className="font-bold text-text-primary flex items-center gap-2">
              <Scale size={16} className="text-indigo-600" />
              <span>{isAr ? '6. القانون الحاكم وتسوية النزاعات' : '6. Governing Law & Jurisdiction'}</span>
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              {isAr
                ? 'تخضع شروط الاستخدام هذه وتُفسر وفقاً للقوانين والتشريعات السارية في جمهورية مصر العربية، وتختص المحاكم المختصة بالقاهرة بالفصل في أي نزاع قد ينشأ عن استخدام المنصة.'
                : 'These Terms of Use shall be governed by and construed in accordance with the laws of the Arab Republic of Egypt.'}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-border-main bg-slate-50 dark:bg-surface-secondary/60 flex items-center justify-between">
          <span className="text-xs text-text-secondary">
            {isAr ? 'للاستفسارات القانونية: 19707' : 'For legal inquiries: Call 19707'}
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
