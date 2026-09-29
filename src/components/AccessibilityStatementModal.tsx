import React, { useState } from 'react';
import {
  X,
  Eye,
  EyeOff,
  Volume2,
  Keyboard,
  Ear,
  EarOff,
  Brain,
  Lightbulb,
  Sun,
  Sliders,
  HandMetal,
  FileText,
  Accessibility as UniversalIcon,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../utils/i18n';
import { useAccessibility } from '../context/AccessibilityProvider';

interface AccessibilityStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AccessibilityStatementModal: React.FC<AccessibilityStatementModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'standards' | 'signLanguage'>('tools');
  const isAr = language === 'ar';

  const {
    screenReaderMode,
    highContrast,
    fontScale,
    reduceMotion,
    enhancedFocus,
    closedCaptions,
    signLanguageGuide,
    keyboardNavMode,
    cognitiveSupport,
    isAccessibilityActive,

    toggleScreenReader,
    toggleHighContrast,
    toggleReduceMotion,
    toggleEnhancedFocus,
    toggleClosedCaptions,
    toggleSignLanguageGuide,
    toggleKeyboardNavMode,
    toggleCognitiveSupport,
    toggleAccessibilityMode,

    increaseFont,
    decreaseFont,
    resetFont,
    announce,
  } = useAccessibility();

  if (!isOpen) return null;

  const fontPercentage = Math.round(fontScale * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-dialog-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs select-none"
    >
      <div
        className={`bg-surface rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-border-main animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] z-[10000] ${
          isAr ? 'text-right' : 'text-left'
        }`}
      >
        {/* Modal Header with Universal Accessibility Icon */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border-main bg-slate-50/90 dark:bg-surface-secondary/70 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-md ring-4 ring-blue-100 dark:ring-blue-900/40">
              <UniversalIcon size={24} strokeWidth={2.4} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="accessibility-dialog-title" className="text-base sm:text-lg font-black text-text-primary leading-tight">
                  {isAr ? 'مركز إمكانية الوصول العالمية' : 'Universal Accessibility Center'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  WCAG 2.1 AA
                </span>
              </div>
              <p className="text-xs font-semibold text-text-secondary mt-0.5">
                {isAr
                  ? 'منظومة التيسير الرقمي الشاملة لجميع الفئات وذوي الإعاقة'
                  : 'Smart Accessibility Suite for All Disabilities'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق' : 'Close'}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-secondary/60 dark:hover:bg-surface/60 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Navigation Tabs */}
        <div className="px-5 py-2.5 bg-surface-secondary/60 border-b border-border-main flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('tools')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'tools'
                ? 'bg-surface text-blue-600 dark:text-blue-300 shadow-2xs'
                : 'text-text-secondary hover:bg-white/50'
            }`}
          >
            <Sliders size={14} />
            <span>{isAr ? 'الأدوات الذكية المخصصة' : 'Accessibility Tools'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signLanguage')}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'signLanguage'
                ? 'bg-surface text-blue-600 dark:text-blue-300 shadow-2xs'
                : 'text-text-secondary hover:bg-white/50'
            }`}
          >
            <HandMetal size={14} />
            <span>{isAr ? 'لغة الإشارة' : 'Sign Language'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('standards')}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'standards'
                ? 'bg-surface text-blue-600 dark:text-blue-300 shadow-2xs'
                : 'text-text-secondary hover:bg-white/50'
            }`}
          >
            <FileText size={14} />
            <span>{isAr ? 'معايير WCAG' : 'Standards'}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm text-text-secondary">
          
          {activeTab === 'tools' && (
            <>
              {/* 1. لدعم المكفوفين وضعاف البصر 👁️ (Blind & Low Vision Support) */}
              <div className="space-y-3 bg-surface-secondary/30 p-4 rounded-2xl border border-border-main">
                <div className="flex items-center justify-between pb-2 border-b border-border-main">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-black text-xs uppercase tracking-wider">
                    <Eye size={16} />
                    <span>{isAr ? '1. لدعم المكفوفين وضعاف البصر 👁️' : '1. Blind & Low Vision Support 👁️'}</span>
                  </div>
                  <span className="text-[11px] font-bold text-text-secondary">Audio & Visual Tuning</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* أ. قارئ الشاشة وتحويل النصوص لصوت (Screen Reader & Audio TTS) */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = !screenReaderMode;
                      toggleScreenReader();
                      announce(
                        next
                          ? isAr ? 'تم تفعيل قارئ الشاشة والنطق الصوتي' : 'Screen reader and voice narration enabled'
                          : isAr ? 'تم إيقاف قارئ الشاشة والنطق الصوتي' : 'Screen reader disabled',
                        true,
                        language
                      );
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-right transition-all cursor-pointer ${
                      screenReaderMode
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200 ring-2 ring-blue-400/30'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        screenReaderMode ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {screenReaderMode ? <Volume2 size={16} /> : <EyeOff size={16} />}
                      </div>
                      <div>
                        <div className="font-black text-xs leading-tight">
                          {isAr ? 'قارئ الشاشة والنطق الصوتي' : 'Screen Reader & Audio'}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {isAr ? 'قراءة العناصر والنصوص صوتياً' : 'Text-to-speech audio readout'}
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                      screenReaderMode ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                    }`}>
                      {screenReaderMode ? (isAr ? 'مفعل' : 'ON') : (isAr ? 'معطل' : 'OFF')}
                    </span>
                  </button>

                  {/* ب. التباين الفائق (Contrast Mode) */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = !highContrast;
                      toggleHighContrast();
                      announce(
                        next
                          ? isAr ? 'تم تفعيل وضع التباين العالي' : 'High contrast mode enabled'
                          : isAr ? 'تم إيقاف وضع التباين العالي' : 'High contrast mode disabled',
                        true,
                        language
                      );
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-right transition-all cursor-pointer ${
                      highContrast
                        ? 'bg-yellow-50 dark:bg-yellow-950/60 border-yellow-400 text-yellow-900 dark:text-yellow-200 ring-2 ring-yellow-400/40'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        highContrast ? 'bg-yellow-400 text-black font-black' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        <Sun size={16} />
                      </div>
                      <div>
                        <div className="font-black text-xs leading-tight">
                          {isAr ? 'التباين العالي (Contrast)' : 'High Contrast Mode'}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {isAr ? 'ألوان واضحة ومتباينة' : 'Enhanced color distinction'}
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                      highContrast ? 'bg-yellow-400 text-black font-bold' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                    }`}>
                      {highContrast ? (isAr ? 'مفعل' : 'ON') : (isAr ? 'معطل' : 'OFF')}
                    </span>
                  </button>
                </div>

                {/* ج. تحكم حجم الخط (A+ / A-) */}
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center font-black text-xs shrink-0">
                      A±
                    </div>
                    <div>
                      <div className="font-black text-xs leading-tight">
                        {isAr ? 'تكبير وتصغير حجم الخط (A+ / A-)' : 'Font Sizing (A+ / A-)'}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {isAr ? `الحجم الحالي: ${fontPercentage}% دون كسر التصميم` : `Current scale: ${fontPercentage}%`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        decreaseFont();
                        announce(isAr ? 'تم تصغير حجم الخط' : 'Font size decreased', true, language);
                      }}
                      disabled={fontScale <= 0.8}
                      className="w-8 h-8 rounded-lg border border-border-main flex items-center justify-center font-bold text-xs hover:bg-surface-secondary disabled:opacity-40 cursor-pointer"
                    >
                      A-
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        resetFont();
                        announce(isAr ? 'تمت استعادة حجم الخط الافتراضي' : 'Font size reset', true, language);
                      }}
                      className="px-2 h-8 rounded-lg border border-border-main flex items-center justify-center font-bold text-[11px] hover:bg-surface-secondary cursor-pointer"
                    >
                      100%
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        increaseFont();
                        announce(isAr ? 'تم تكبير حجم الخط' : 'Font size increased', true, language);
                      }}
                      disabled={fontScale >= 1.3}
                      className="w-8 h-8 rounded-lg border border-border-main flex items-center justify-center font-bold text-xs hover:bg-surface-secondary disabled:opacity-40 cursor-pointer"
                    >
                      A+
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. لدعم الصم وضعاف السمع 🧏 (Deaf & Hard of Hearing Support) */}
              <div className="space-y-3 bg-surface-secondary/30 p-4 rounded-2xl border border-border-main">
                <div className="flex items-center justify-between pb-2 border-b border-border-main">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-black text-xs uppercase tracking-wider">
                    <Ear size={16} />
                    <span>{isAr ? '2. لدعم الصم وضعاف السمع 🧏' : '2. Deaf & Hard of Hearing Support 🧏'}</span>
                  </div>
                  <span className="text-[11px] font-bold text-text-secondary">Visual Captions & Sign</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* أ. النصوص التفسيرية (Closed Captions [CC]) */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = !closedCaptions;
                      toggleClosedCaptions();
                      announce(
                        next
                          ? isAr ? 'تم تفعيل النصوص التفسيرية البصرية' : 'Closed captions enabled'
                          : isAr ? 'تم إيقاف النصوص التفسيرية' : 'Closed captions disabled',
                        true,
                        language
                      );
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-right transition-all cursor-pointer ${
                      closedCaptions
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-400/30'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        closedCaptions ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        <EarOff size={16} />
                      </div>
                      <div>
                        <div className="font-black text-xs leading-tight">
                          {isAr ? 'النصوص التفسيرية [CC]' : 'Closed Captions [CC]'}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {isAr ? 'تسميات بصرية فورية لكافة التنبيهات' : 'Visual captions for all alerts'}
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                      closedCaptions ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                    }`}>
                      {closedCaptions ? (isAr ? 'مفعل' : 'ON') : (isAr ? 'معطل' : 'OFF')}
                    </span>
                  </button>

                  {/* ب. دليل لغة الإشارة (Sign Language Guide) */}
                  <button
                    type="button"
                    onClick={() => {
                      toggleSignLanguageGuide();
                      setActiveTab('signLanguage');
                      announce(isAr ? 'تم فتح دليل لغة الإشارة' : 'Sign language guide opened', true, language);
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-right transition-all cursor-pointer ${
                      signLanguageGuide
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-400/30'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        signLanguageGuide ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        <HandMetal size={16} />
                      </div>
                      <div>
                        <div className="font-black text-xs leading-tight">
                          {isAr ? 'دليل لغة الإشارة' : 'Sign Language Guide'}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {isAr ? 'إرشادات بصرية لمجتمع الصم' : 'Visual sign language guides'}
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                      signLanguageGuide ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                    }`}>
                      {signLanguageGuide ? (isAr ? 'مفعل' : 'ON') : (isAr ? 'معطل' : 'OFF')}
                    </span>
                  </button>
                </div>
              </div>

              {/* 3. لدعم الإعاقات الحركية والذهنية 🧠 (Motor & Cognitive Support) */}
              <div className="space-y-3 bg-surface-secondary/30 p-4 rounded-2xl border border-border-main">
                <div className="flex items-center justify-between pb-2 border-b border-border-main">
                  <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-black text-xs uppercase tracking-wider">
                    <Brain size={16} />
                    <span>{isAr ? '3. لدعم الإعاقات الحركية والذهنية 🧠' : '3. Motor & Cognitive Support 🧠'}</span>
                  </div>
                  <span className="text-[11px] font-bold text-text-secondary">Keyboard & Focus</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* أ. التنقل بلوحة المفاتيح فقط (Keyboard Navigation) */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = !keyboardNavMode;
                      toggleKeyboardNavMode();
                      announce(
                        next
                          ? isAr ? 'تم تفعيل ملاحة لوحة المفاتيح' : 'Keyboard navigation enabled'
                          : isAr ? 'تم إيقاف ملاحة لوحة المفاتيح' : 'Keyboard navigation disabled',
                        true,
                        language
                      );
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-right transition-all cursor-pointer ${
                      keyboardNavMode
                        ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-200 ring-2 ring-purple-400/30'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        keyboardNavMode ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        <Keyboard size={16} />
                      </div>
                      <div>
                        <div className="font-black text-xs leading-tight">
                          {isAr ? 'ملاحة لوحة المفاتيح (Tab)' : 'Keyboard Navigation'}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {isAr ? 'تصفح بالتبويب دون استخدام الماوس' : 'Navigate using Tab & Enter'}
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                      keyboardNavMode ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                    }`}>
                      {keyboardNavMode ? (isAr ? 'مفعل' : 'ON') : (isAr ? 'معطل' : 'OFF')}
                    </span>
                  </button>

                  {/* ب. الدعم الذهني وإيقاف الفلاشات (Cognitive Support & Anti-Epilepsy) */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = !cognitiveSupport;
                      toggleCognitiveSupport();
                      announce(
                        next
                          ? isAr ? 'تم تفعيل الدعم الذهني وإيقاف الحركات' : 'Cognitive support enabled'
                          : isAr ? 'تم إيقاف الدعم الذهني' : 'Cognitive support disabled',
                        true,
                        language
                      );
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-right transition-all cursor-pointer ${
                      cognitiveSupport
                        ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-200 ring-2 ring-purple-400/30'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        cognitiveSupport ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        <Lightbulb size={16} />
                      </div>
                      <div>
                        <div className="font-black text-xs leading-tight">
                          {isAr ? 'الدعم الذهني والتركيز' : 'Cognitive Support'}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {isAr ? 'إيقاف الحركات والمشتتات والوميض' : 'Stop animations & flashings'}
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                      cognitiveSupport ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                    }`}>
                      {cognitiveSupport ? (isAr ? 'مفعل' : 'ON') : (isAr ? 'معطل' : 'OFF')}
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: SIGN LANGUAGE GUIDE */}
          {activeTab === 'signLanguage' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                <HandMetal className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-sm">
                    {isAr ? 'دليل لغة الإشارة المعتمد لخدمات الضمان' : 'Official Warranty Sign Language Guide'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {isAr
                      ? 'يوفر هذا الدليل إرشادات مرئية بلغة الإشارة لمساعدة الصم وضعاف السمع في التحقق من أصالة وسريان الضمان.'
                      : 'Visual sign language reference for verifying mattress warranty and service.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80">
                  <div className="font-black text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                    {isAr ? '١. التحقق بالسيريال' : '1. Serial Verification'}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isAr
                      ? 'أدخل الرقم التسلسلي المطبوع على بطاقة الضمان، ثم اضغط زر "استعلام الآن" لتظهر حالة الضمان فورياً مع نص تفسيري كامل.'
                      : 'Enter the serial number from your warranty card and click verify to see instant active/expired status.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80">
                  <div className="font-black text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                    {isAr ? '٢. مسح كود QR' : '2. QR Code Scan'}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isAr
                      ? 'وجه كاميرا الهاتف نحو رمز الاستجابة السريعة QR الموجود على المرتبة لفتح بيانات الضمان مباشرة دون الحاجة للكتابة.'
                      : 'Scan the QR code on your mattress with camera for instant automatic verification.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WCAG STANDARDS */}
          {activeTab === 'standards' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                <h3 className="font-black text-slate-900 dark:text-white text-sm mb-1">
                  {isAr ? 'بيان التوافق مع معايير W3C / WCAG 2.1 AA' : 'WCAG 2.1 AA Compliance Statement'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isAr
                    ? 'تم تصميم وبناء منصة سليبي للتحقق من الضمان لتلبي أعلى المعايير الدولية للإتاحة الرقمية ومساعدة كافة المستخدمين باختلاف قدراتهم.'
                    : 'The Sleepee warranty platform is engineered to meet global accessibility guidelines for universal access.'}
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>{isAr ? 'دعم كامل لقارئات الشاشة (NVDA, JAWS, VoiceOver, TalkBack)' : 'Full screen reader support'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>{isAr ? 'تباين لوني فائق يتجاوز نسبة 4.5:1 للنصوص' : 'High color contrast ratio exceeding 4.5:1'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>{isAr ? 'ملاحة كاملة بلوحة المفاتيح بدون الحاجة لاستخدام الماوس' : '100% full keyboard navigation'}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-border-main bg-slate-50/80 dark:bg-surface-secondary/60 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={toggleAccessibilityMode}
            className={`px-4 py-2 rounded-xl font-black text-xs transition-all cursor-pointer ${
              isAccessibilityActive
                ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
            }`}
          >
            {isAccessibilityActive
              ? isAr ? 'إعادة ضبط كل الإعدادات' : 'Reset All Settings'
              : isAr ? 'تفعيل الوضع الشامل' : 'Enable Universal Mode'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-surface text-white dark:text-text-primary font-black text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            {isAr ? 'حفظ وإغلاق' : 'Save & Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
