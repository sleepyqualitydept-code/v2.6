import React from 'react';
import { 
  Home, CheckCircle2, ChevronRight, Copy, Layers, 
  Settings, Sliders, Database, ArrowRight, ShieldCheck, 
  Maximize2, Minimize2, Sparkles, Building2, Factory, Globe
} from 'lucide-react';
import { PepStepId } from './PepTypes';
import { CurrencyCode, CurrencyEngine } from '../../../services/currencyEngine';

interface PepStepperHeaderProps {
  currentStep: PepStepId;
  completedSteps: Set<PepStepId>;
  onSelectStep: (step: PepStepId) => void;
  brandName: string;
  familyName: string;
  modelName: string;
  version: string;
  activeCurrency: CurrencyCode;
  onChangeCurrency: (cur: CurrencyCode) => void;
  onOpenCloneModal: () => void;
  accordionMode: boolean;
  onToggleAccordionMode: () => void;
}

export const PEP_STEPS_CONFIG = [
  { id: 1, code: 'DEF', titleAr: '1. تعريف المنتج والموديل', titleEn: 'Product Definition' },
  { id: 2, code: 'BOM', titleAr: '2. قائمة المواد والطبقات', titleEn: 'BOM & Materials' },
  { id: 3, code: 'RTG', titleAr: '3. مسار العمليات والتصنيع', titleEn: 'Routing & Manufacturing' },
  { id: 4, code: 'CAD', titleAr: '4. الرسم الهندسي والمحاكاة', titleEn: 'Engineering CAD' },
  { id: 5, code: 'CST', titleAr: '5. التكاليف وحزمة الامتثال', titleEn: 'Cost & Compliance' },
  { id: 6, code: 'REL', titleAr: '6. الاعتماد وتجميد الإصدار', titleEn: 'Production Release' },
];

export const PepStepperHeader: React.FC<PepStepperHeaderProps> = ({
  currentStep,
  completedSteps,
  onSelectStep,
  brandName,
  familyName,
  modelName,
  version,
  activeCurrency,
  onChangeCurrency,
  onOpenCloneModal,
  accordionMode,
  onToggleAccordionMode
}) => {
  const percentComplete = Math.min(100, Math.round((completedSteps.size / 6) * 100));

  return (
    <div className="w-full bg-[#0B2D5C] text-white rounded-3xl p-5 shadow-lg border border-slate-700/60 space-y-4 animate-fade-in">
      
      {/* Top Row: Data Hierarchy Breadcrumbs & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        
        {/* BREADCRUMB STANDARD: Home > Product Management / Brand > Family > Model > PEP v1.0 */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-white/10 rounded-lg text-slate-200 font-bold">
            <Home size={13} className="text-slate-300" />
            <span>Home</span>
          </div>

          <ChevronRight size={13} className="text-slate-400 rtl:rotate-180 shrink-0" />

          <div className="flex items-center gap-1 px-2.5 py-1 bg-white/10 rounded-lg text-slate-200 font-bold">
            <Building2 size={13} className="text-slate-300" />
            <span>{brandName || 'Sleepee'}</span>
          </div>

          <ChevronRight size={13} className="text-slate-400 rtl:rotate-180 shrink-0" />

          <div className="flex items-center gap-1 px-2.5 py-1 bg-white/10 rounded-lg text-slate-200 font-bold">
            <Layers size={13} className="text-slate-300" />
            <span>{familyName || 'Spring Mattress'}</span>
          </div>

          <ChevronRight size={13} className="text-slate-400 rtl:rotate-180 shrink-0" />

          <div className="flex items-center gap-1 px-2.5 py-1 bg-white/10 rounded-lg text-white font-extrabold">
            <span>{modelName || 'Silver'}</span>
          </div>

          <ChevronRight size={13} className="text-slate-400 rtl:rotate-180 shrink-0" />

          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 rounded-lg font-black text-emerald-300">
            <span>PEP</span>
            <span className="font-mono text-white text-[11px] bg-emerald-600/70 px-1.5 py-0.5 rounded">
              {version || 'v1.0'}
            </span>
          </div>
        </div>

        {/* Action Controls: Clone Model, Currency, Accordion Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Clone Model Button */}
          <button
            type="button"
            onClick={onOpenCloneModal}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20 cursor-pointer shadow-xs"
            title="استنساخ مواصفة كاملة لإنشاء موديل أو إصدار جديد"
          >
            <Copy size={13} className="text-amber-400" />
            <span>استنساخ الموديل (Clone)</span>
          </button>

          {/* Currency Switcher */}
          <div className="flex items-center gap-1 px-2.5 py-1 bg-white/10 border border-white/15 rounded-xl text-xs">
            <Globe size={13} className="text-slate-300" />
            <span className="text-slate-300 text-[11px] font-bold">العملة:</span>
            <select
              value={activeCurrency}
              onChange={(e) => {
                const cur = e.target.value as CurrencyCode;
                onChangeCurrency(cur);
                CurrencyEngine.setActiveCurrency(cur);
              }}
              className="bg-transparent text-white font-mono font-bold text-xs outline-none cursor-pointer"
            >
              <option value="SAR" className="text-slate-900">SAR (ريال)</option>
              <option value="EGP" className="text-slate-900">EGP (جنيه)</option>
              <option value="USD" className="text-slate-900">USD ($)</option>
              <option value="AED" className="text-slate-900">AED (درهم)</option>
            </select>
          </div>

          {/* Accordion Mode Switch */}
          <button
            type="button"
            onClick={onToggleAccordionMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              accordionMode 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                : 'bg-white/10 text-slate-300 border-white/10 hover:bg-white/15'
            }`}
            title={accordionMode ? 'نمط الأكورديون الذكي: خطوة واحدة مفتوحة' : 'عرض كافة المراحل في صفحة واحدة'}
          >
            {accordionMode ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            <span>{accordionMode ? 'أكورديون نشط' : 'عرض شامل'}</span>
          </button>
        </div>

      </div>

      {/* Progress Bar & Stage Title */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <div>
          <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
            <span>حزمة الهندسة والتصنيع المتكاملة للمنتج (PEP)</span>
            <span className="text-xs font-mono font-normal text-slate-300">
              Product Engineering Package
            </span>
          </h2>
          <p className="text-xs text-slate-300/80">
            مسار هندسي صناعي موحد يبدأ بتعريف الموديل، هيكلة التجميع، قائمة المواد، مسارات التشغيل، المحاكاة، التكلفة، وحتى إطلاق الإنتاج.
          </p>
        </div>

        <div className="text-left shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">اكتمال الحزمة:</span>
            <span className="text-sm font-mono font-black text-emerald-400">{percentComplete}%</span>
          </div>
          <div className="w-36 h-2 bg-white/20 rounded-full overflow-hidden mt-1">
            <div 
              className="h-full bg-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      </div>

      {/* 8-Step Interactive Horizontal Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
        {PEP_STEPS_CONFIG.map((step) => {
          const isCurrent = currentStep === step.id;
          const isDone = completedSteps.has(step.id as PepStepId);

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelectStep(step.id as PepStepId)}
              className={`p-2.5 rounded-2xl text-right transition-all cursor-pointer flex flex-col justify-between border ${
                isCurrent
                  ? 'bg-white text-slate-900 border-white shadow-md font-black transform scale-[1.02]'
                  : isDone
                  ? 'bg-emerald-950/40 text-emerald-200 border-emerald-500/40 hover:bg-emerald-900/40'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between gap-1 w-full mb-1">
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  isCurrent 
                    ? 'bg-slate-900 text-white' 
                    : isDone 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-white/10 text-slate-400'
                }`}>
                  STEP {step.id}
                </span>

                {isDone ? (
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-400">
                    <CheckCircle2 size={12} />
                    <span>مكتمل</span>
                  </span>
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ) : null}
              </div>

              <div>
                <span className="block text-xs font-bold truncate">
                  {step.titleAr.split('. ')[1]}
                </span>
                <span className="block text-[10px] text-slate-400 truncate font-mono">
                  {step.titleEn}
                </span>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
};
