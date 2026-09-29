import React from 'react';
import { X, FileText, ShieldCheck, CheckCircle2, AlertCircle, Wrench, RefreshCw, Receipt } from 'lucide-react';
import { Language, t } from '../utils/i18n';

interface WarrantyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
}

export const WarrantyPolicyModal: React.FC<WarrantyPolicyModalProps> = ({
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
      aria-labelledby="warranty-policy-title"
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
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 shadow-2xs">
              <FileText size={18} />
            </div>
            <div>
              <h2 id="warranty-policy-title" className="text-base font-black text-text-primary">
                {isAr ? 'سياسة وضوابط الضمان المعتمد' : 'Official Warranty Policy & Guarantee Terms'}
              </h2>
              <p className="text-xs font-semibold text-text-secondary mt-0.5">
                {t('companyName', language)} - {isAr ? 'مراتب سليبي' : 'Sleepee Mattresses'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق نافذة سياسة الضمان' : 'Close Warranty Policy Dialog'}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-secondary dark:hover:bg-surface transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs sm:text-sm text-text-secondary leading-relaxed">
          
          {/* Summary Banner */}
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-start gap-3">
            <ShieldCheck size={22} className="text-[#0066ff] dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-text-primary text-sm">
                {isAr ? 'شهادة ضمان رسمية معتمدة حتى 10 سنوات' : 'Official Certified Warranty up to 10 Years'}
              </h3>
              <p className="text-xs text-text-secondary mt-1 leading-normal">
                {isAr
                  ? 'تضمن الشركة العربية لصناعة مراتب السوست والإسفنج خلو جميع منتجات مراتب «سليبي» الأصلية من أي عيوب صناعية أو خلل في نوابض السوست وهيكل الفوم الداخلي.'
                  : 'The Arab Company for Spring and Foam Mattresses guarantees all genuine Sleepee mattresses against manufacturing and material defects.'}
              </p>
            </div>
          </div>

          {/* Section 1: شروط تفعيل ومدة الضمان */}
          <div className="space-y-2">
            <h4 className="font-bold text-text-primary flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#0066ff]" />
              <span>{isAr ? '1. شروط تفعيل الضمان ومدة السريان' : '1. Warranty Activation & Duration'}</span>
            </h4>
            <ul className="space-y-1.5 pr-5 list-disc text-text-secondary text-xs">
              <li>
                <strong>{isAr ? 'مدة الضمان:' : 'Warranty Period:'}</strong>{' '}
                {isAr
                  ? 'تمتد فترة الضمان الأساسية حتى 10 سنوات (أو المدة المحددة على بطاقة المنتج) تبدأ من تاريخ الشراء المثبت بالفاتورة الضريبية.'
                  : 'Valid for up to 10 years (or model-specified period) from invoice date.'}
              </li>
              <li>
                <strong>{isAr ? 'شرط التفعيل:' : 'Activation Requirement:'}</strong>{' '}
                {isAr
                  ? 'يجب تسجيل وتفعيل شهادة الضمان خلال 30 يوماً من تاريخ الشراء عبر مسح كود QR أو إدخال الرقم التسلسلي في هذه البوابة.'
                  : 'Must be activated within 30 days of purchase via QR code scan or serial registration.'}
              </li>
            </ul>
          </div>

          {/* Section 2: نطاق التغطية (المنتجات والأجزاء المشمولة) */}
          <div className="space-y-2">
            <h4 className="font-bold text-text-primary flex items-center gap-2">
              <Wrench size={16} className="text-[#0066ff]" />
              <span>{isAr ? '2. نطاق تغطية الضمان (ما يشمله الضمان)' : '2. Scope of Warranty Coverage'}</span>
            </h4>
            <ul className="space-y-1.5 pr-5 list-disc text-text-secondary text-xs">
              <li>{isAr ? 'انكسار، أو ارتخاء، أو تفكك نوابض السوست الداخلية (البوكيت سبرينج أو شبكة البونيل).' : 'Coil breakage, detachment, or permanent deformation of internal pocket/Bonnell springs.'}</li>
              <li>{isAr ? 'هبوط أو انخساف غير طبيعي في سطح المرتبة يتجاوز 3 سم دون وجود تلف بالهيكل الخشبي للسرير.' : 'Abnormal mattress body impressions or sagging exceeding 3 cm.'}</li>
              <li>{isAr ? 'انفصال طبقات الحشو الداخلية (اللاتكس، الميموري فوم، أو عوازل اللباد) نتيجة عيب مصنعي.' : 'Core foam, latex, or insulating felt delamination due to manufacturing flaws.'}</li>
              <li>{isAr ? 'تلف أو تفكك خياطة الكادر المحيطي الناتج عن خلل في الحياكة والتجميع.' : 'Premature seam or border stitching failure.'}</li>
            </ul>
          </div>

          {/* Section 3: استثناءات وحالات سقوط الضمان */}
          <div className="space-y-2">
            <h4 className="font-bold text-text-primary flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-600" />
              <span>{isAr ? '3. استثناءات وحالات سقوط الضمان' : '3. Exclusions & Void Conditions'}</span>
            </h4>
            <p className="text-xs text-text-secondary">
              {isAr ? 'يسقط الضمان ولا يشمل الحالات التالية:' : 'Warranty is voided in the following circumstances:'}
            </p>
            <ul className="space-y-1.5 pr-5 list-disc text-text-secondary text-xs">
              <li>{isAr ? 'إزالة أو طمس ملصق الرقم التسلسلي (Serial Tag) أو كود QR المثبت على جانب المرتبة.' : 'Removal, mutilation, or tampering with the serial number label or QR tag.'}</li>
              <li>{isAr ? 'استخدام المرتبة على ملة خشبية متباعدة الفواصل بأكثر من 5 سم أو سرير غير مستوٍ.' : 'Using the mattress on an improper foundation or bed slats spaced wider than 5 cm.'}</li>
              <li>{isAr ? 'تعرض المرتبة للسوائل، الحروق، البقع، الرطوبة العالية، أو الحشرات.' : 'Liquid penetration, burns, stains, extreme humidity, or soiling.'}</li>
              <li>{isAr ? 'ثني أو طي المرتبة أثناء النقل أو التخزين بطريقة غير مطابقة للتعليمات.' : 'Improper folding, bending, or harsh storage during relocation.'}</li>
              <li>{isAr ? 'محاولة إجراء أي تعديل أو إصلاح خارجي لدى ورش غير معتمدة من الشركة.' : 'Unauthorized repairs or modifications performed outside authorized company centers.'}</li>
            </ul>
          </div>

          {/* Section 4: آلية تقديم المطالبة والإصلاح أو الاستبدال */}
          <div className="space-y-2">
            <h4 className="font-bold text-text-primary flex items-center gap-2">
              <RefreshCw size={16} className="text-[#0066ff]" />
              <span>{isAr ? '4. آلية تقديم المطالبة والإصلاح / الاستبدال' : '4. Claim Filing, Repair & Replacement'}</span>
            </h4>
            <ul className="space-y-1.5 pr-5 list-disc text-text-secondary text-xs">
              <li>{isAr ? 'يتم تقديم طلب الفحص الفني عبر الاتصال بالخط الساخن 19707 أو عبر بوابة خدمة العملاء.' : 'File a claim by calling Hotline 19707 or submitting a request via the support portal.'}</li>
              <li>{isAr ? 'يقوم فني الجودة المعتمد بإجراء معاينة فنية للمرتبة بمقر العميل خلال 72 ساعة عمل.' : 'A certified quality engineer inspects the product on-site within 72 business hours.'}</li>
              <li>{isAr ? 'في حال ثبوت العيب المصنعي: تتكفل الشركة بالإصلاح الفوري أو استبدال المرتبة بمنتج جديد مماثل مجاناً.' : 'If verified, the company repairs or replaces the mattress with a matching brand new model free of charge.'}</li>
            </ul>
          </div>

          {/* Section 5: متطلبات إثبات الشراء وحدود المسؤولية */}
          <div className="space-y-2">
            <h4 className="font-bold text-text-primary flex items-center gap-2">
              <Receipt size={16} className="text-[#0066ff]" />
              <span>{isAr ? '5. إثبات الشراء وحدود مسؤولية الشركة' : '5. Proof of Purchase & Liability Limitations'}</span>
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              {isAr
                ? 'يشترط لتقديم المطالبة إبراز أصل أو صورة الفاتورة الضريبية أو شهادة الضمان الرقمية المسجلة. تقتصر مسؤولية الشركة القصوى على إصلاح أو استبدال المنتج المعيب، ولا تتحمل أي تعويضات عن أضرار تبعية أو غير مباشرة.'
                : 'Valid purchase invoice or active digital certificate is required. Company liability is strictly limited to repairing or replacing the defective product.'}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-border-main bg-slate-50 dark:bg-surface-secondary/60 flex items-center justify-between">
          <span className="text-xs text-text-secondary">
            {isAr ? 'للإبلاغ عن عيب مصنعي: الخط الساخن 19707' : 'To report manufacturing defects: Hotline 19707'}
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
