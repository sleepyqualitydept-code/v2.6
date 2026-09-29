import React, { useState } from 'react';
import { HandMetal, X, ChevronUp, ChevronDown, CheckCircle2, ShieldCheck, QrCode, PhoneCall, HelpCircle, Sparkles } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityProvider';
import { Language } from '../utils/i18n';

interface SignLanguageWidgetProps {
  language: Language;
}

export const SignLanguageWidget: React.FC<SignLanguageWidgetProps> = ({ language }) => {
  const { settings, setSignLanguageGuide } = useAccessibility();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeGuideIndex, setActiveGuideIndex] = useState<number>(0);

  if (!settings.signLanguageGuide) return null;

  const isAr = language === 'ar';

  const signGuides = [
    {
      title: isAr ? '١. إشارة: التحقق بالسيريال' : '1. Sign: Serial Verification',
      badge: isAr ? 'خطوة 1' : 'Step 1',
      icon: ShieldCheck,
      description: isAr
        ? 'التأشير بأصبع السبابة نحو ملصق الضمان المخيط بجانب المرتبة، ثم إدخال 12 رقماً في خانة البحث.'
        : 'Point index finger at the warranty tag stitched to mattress side, then enter 12 digits.',
      gestureDetail: isAr
        ? '🤟 حركة اليد: إشارة السبابة ثم كتابة أرقام في الهواء.'
        : '🤟 Hand Gesture: Index point followed by typing in air.',
    },
    {
      title: isAr ? '٢. إشارة: مسح كود QR' : '2. Sign: QR Code Scan',
      badge: isAr ? 'خطوة 2' : 'Step 2',
      icon: QrCode,
      description: isAr
        ? 'رفع الجوال وضبط الكاميرا أمام الشعار المطبوع لقرائته فورياً دون الحاجة للكتابة.'
        : 'Hold phone up to align camera with printed logo for instant scanning.',
      gestureDetail: isAr
        ? '🤟 حركة اليد: شكل مستطيل باليدين ثم التوجيه للأمام.'
        : '🤟 Hand Gesture: Form rectangle with hands then point forward.',
    },
    {
      title: isAr ? '٣. إشارة: مدة الضمان (10 سنوات)' : '3. Sign: 10-Year Warranty',
      badge: isAr ? 'خطوة 3' : 'Step 3',
      icon: CheckCircle2,
      description: isAr
        ? 'رفع الكف ومسح الأصابع للإشارة للتغطية الشاملة للعيوب المصنعية لمدة 10 سنوات.'
        : 'Raise open palm to indicate 10 full years of manufacturing defects coverage.',
      gestureDetail: isAr
        ? '🤟 حركة اليد: فتح اليد مرتين (5 + 5 = 10 سنوات).'
        : '🤟 Hand Gesture: Open hand twice (5 + 5 = 10 years).',
    },
    {
      title: isAr ? '٤. إشارة: الصيانة والدعم للصم' : '4. Sign: Maintenance Support',
      badge: isAr ? 'دعم صم' : 'Deaf Support',
      icon: PhoneCall,
      description: isAr
        ? 'ضم القابضتين والتأشير نحو الأذن للطلب الفوري لخدمة الصيانة والتواصل المرئي.'
        : 'Fist tap and ear gesture for instant video support and maintenance dispatch.',
      gestureDetail: isAr
        ? '🤟 حركة اليد: إشارة الهاتف باليد ثم ضمهما معاً.'
        : '🤟 Hand Gesture: Phone sign with thumb and pinky.',
    },
  ];

  return (
    <div
      className="fixed bottom-5 left-5 z-50 max-w-sm w-full sm:w-88 bg-slate-900/95 text-white rounded-3xl shadow-2xl border-2 border-emerald-500/80 backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-bottom-5"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Widget Header */}
      <div className="p-3.5 bg-gradient-to-r from-emerald-900/90 to-slate-900 rounded-t-3xl border-b border-emerald-500/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 font-bold shrink-0 shadow-lg shadow-emerald-500/30">
            <HandMetal className="animate-bounce" size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-ping"></span>
          </div>
          <div>
            <div className="font-black text-xs text-emerald-300 flex items-center gap-1.5">
              <span>{isAr ? 'مترجم لغة الإشارة المباشر' : 'Live Sign Language Assistant'}</span>
              <Sparkles size={12} className="text-amber-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-slate-300 font-medium">
              {isAr ? 'دليل الصم وضعاف السمع 🤟' : 'Deaf & Hard of Hearing Guide 🤟'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title={isExpanded ? (isAr ? 'تصغير' : 'Collapse') : (isAr ? 'توسيع' : 'Expand')}
          >
            {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
          <button
            type="button"
            onClick={() => setSignLanguageGuide(false)}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
            title={isAr ? 'إغلاق دليل لغة الإشارة' : 'Close sign language widget'}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 space-y-3.5">
          {/* Animated Gesture Display Screen */}
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-emerald-500/30 p-4 text-center overflow-hidden">
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
              {signGuides[activeGuideIndex].badge}
            </div>

            {/* Simulated Animated Sign Language Visual */}
            <div className="my-2 flex flex-col items-center justify-center gap-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-400/60 flex items-center justify-center text-emerald-400 shadow-inner">
                {React.createElement(signGuides[activeGuideIndex].icon, { size: 32, className: "animate-pulse" })}
              </div>
              <div className="text-xs font-black text-emerald-300">
                {signGuides[activeGuideIndex].title}
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-sans px-1">
              {signGuides[activeGuideIndex].description}
            </p>

            <div className="mt-2.5 p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-mono text-emerald-200 text-center">
              {signGuides[activeGuideIndex].gestureDetail}
            </div>
          </div>

          {/* Guide Selector Tabs */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {signGuides.map((guide, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveGuideIndex(idx)}
                className={`py-2 px-1 rounded-xl text-[10px] font-bold text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  activeGuideIndex === idx
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-300'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {React.createElement(guide.icon, { size: 14 })}
                <span>{isAr ? `إشارة ${idx + 1}` : `Sign ${idx + 1}`}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
