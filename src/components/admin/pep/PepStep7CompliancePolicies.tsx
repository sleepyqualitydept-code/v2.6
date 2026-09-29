import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, ChevronRight, 
  FileCheck, Flame, Award, Sliders, CheckSquare, Square, Info 
} from 'lucide-react';
import { ErpDatabase } from '../../../utils/erpDb';

interface PepStep7CompliancePoliciesProps {
  selectedPolicyId: string;
  setSelectedPolicyId: (id: string) => void;
  onCompleteStep: () => void;
}

export const PepStep7CompliancePolicies: React.FC<PepStep7CompliancePoliciesProps> = ({
  selectedPolicyId,
  setSelectedPolicyId,
  onCompleteStep
}) => {
  const policies = ErpDatabase.getWarrantyPolicies();
  const currentPolicy = policies.find(p => p.id === selectedPolicyId) || policies[0];

  const [flammabilityStandard, setFlammabilityStandard] = useState<string>('BS 7177 Low Hazard (Domestic Standard)');
  const [foamCertification, setFoamCertification] = useState<string>('CertiPUR-US & OEKO-TEX Standard 100');
  const [sagToleranceThreshold, setSagToleranceThreshold] = useState<number>(15); // 15% structural sag
  const [orthopedicRating, setOrthopedicRating] = useState<string>('Class A - Medical Spinal Support (SASO ISO 9001)');

  const [gateChecks, setGateChecks] = useState<Record<string, boolean>>({
    gate_dimensions: true,
    gate_tape_edge: true,
    gate_spring_test: true,
    gate_foam_density: true,
    gate_cleanliness: true
  });

  const toggleGate = (key: string) => {
    setGateChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Banner */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-border-main flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0B2D5C] text-white flex items-center justify-center font-bold">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h3 className="font-black text-sm text-[#0B2D5C] dark:text-blue-300">
              الامتثال الصناعي وسياسات الضمان والجودة (Compliance & Policies)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              ربط مباشر مع سجل سياسات الضمان (Warranty Policy Registry) ومطابقة معايير الحريق والجودة SASO / ISO.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1.5 font-mono">
          <CheckCircle2 size={14} />
          <span>SASO / ISO 9001 Compliant</span>
        </span>
      </div>

      {/* 1. Official Warranty Policy Registry Linkage (No hardcoded values) */}
      <div className="bg-surface rounded-2xl border border-border-main p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-main pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            <h4 className="font-black text-xs text-[#0B2D5C] dark:text-blue-300">
              1. سياسة الضمان الرسمية المسجلة (Warranty Policy Registry):
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">اختر وثيقة السياسة:</span>
            <select
              value={selectedPolicyId}
              onChange={(e) => setSelectedPolicyId(e.target.value)}
              className="h-8 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold text-xs outline-none cursor-pointer"
            >
              {policies.map(p => (
                <option key={p.id} value={p.id}>{p.name} - {p.id} ({p.warrantyYears} سنوات)</option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Policy Details Card */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border-main space-y-3 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">كود السياسة المعتمد:</span>
              <span className="font-mono font-black text-sm text-[#0B2D5C] dark:text-blue-400">{currentPolicy?.id}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">مدة الضمان الرسمية:</span>
              <span className="font-mono font-black text-sm text-emerald-600">{currentPolicy?.warrantyYears} سنوات ضمان صريح</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">حد هبوط الهيكل المسموح (Sag Threshold):</span>
              <span className="font-mono font-black text-sm text-amber-600">{sagToleranceThreshold}% هبوط أقصى</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border-main space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block">شروط ونطاق التغطية (Coverage Scope):</span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {currentPolicy?.description || 'تغطية شاملة ضد عيوب الصناعة في شاسيه النوابض واللحام وتفكك الغرز وتلف طبقات الإسفنج غير الناتج عن سوء الاستخدام.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Standards & Certifications Compliance Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Flammability Standards */}
        <div className="p-4 bg-surface rounded-2xl border border-border-main space-y-3 text-xs">
          <div className="flex items-center gap-2 text-rose-600 font-bold">
            <Flame size={16} />
            <h4 className="text-[#0B2D5C] dark:text-blue-300 font-black">
              2. معيار مقاومة الاشتعال والحريق (Flammability Standard):
            </h4>
          </div>
          <select
            value={flammabilityStandard}
            onChange={(e) => setFlammabilityStandard(e.target.value)}
            className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold text-xs outline-none cursor-pointer"
          >
            <option value="BS 7177 Low Hazard (Domestic Standard)">BS 7177 Low Hazard (المعيار المنزلي القياسي البريطاني)</option>
            <option value="BS 7177 Medium Hazard (Crib 5 - فندقي فاخر)">BS 7177 Medium Hazard (Crib 5 - مقاومة عالية للمشاريع الفندقية)</option>
            <option value="16 CFR Part 1633 (Federal Flammability Standard)">16 CFR Part 1633 (المعيار الفيدرالي الأمريكي لاختبار اللهب المفتوح)</option>
            <option value="SASO 2623 / SASO 2624">SASO 2623 / SASO 2624 (المواصفات القياسية السعودية المعتمدة)</option>
          </select>
          <span className="text-[10px] text-slate-400 block">
            * تم إدراج المعالجة الكيميائية غير السامة في مواصفات أقمشة الوجه والشريط.
          </span>
        </div>

        {/* Orthopedic & Ergonomic Certification */}
        <div className="p-4 bg-surface rounded-2xl border border-border-main space-y-3 text-xs">
          <div className="flex items-center gap-2 text-blue-600 font-bold">
            <Award size={16} />
            <h4 className="text-[#0B2D5C] dark:text-blue-300 font-black">
              3. شهادة الدعم الطبي وتوزيع الضغط (Orthopedic Certification):
            </h4>
          </div>
          <input
            type="text"
            value={orthopedicRating}
            onChange={(e) => setOrthopedicRating(e.target.value)}
            className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold text-xs outline-none"
          />
          <span className="text-[10px] text-slate-400 block">
            * يدعم المنحنى الطبيعي للعمود الفقري ومصنف H3 إرجونومي معتمد.
          </span>
        </div>

      </div>

      {/* 3. Quality Inspection Checklist & Tolerance Gates */}
      <div className="bg-surface rounded-2xl border border-border-main p-5 space-y-3 text-xs">
        <h4 className="font-black text-xs text-[#0B2D5C] dark:text-blue-300">
          4. قائمة بوابات التفتيش ونسب التفاوت المسموح بها (Quality Tolerance Gates):
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          <div 
            onClick={() => toggleGate('gate_dimensions')}
            className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main flex items-center justify-between cursor-pointer"
          >
            <div>
              <span className="font-bold block">مطابقة الأبعاد (Dimensions Tolerance)</span>
              <span className="text-[10px] text-slate-400 font-mono">تفاوت أقصى: ±0.5 سم</span>
            </div>
            {gateChecks.gate_dimensions ? <CheckSquare size={16} className="text-emerald-600" /> : <Square size={16} />}
          </div>

          <div 
            onClick={() => toggleGate('gate_tape_edge')}
            className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main flex items-center justify-between cursor-pointer"
          >
            <div>
              <span className="font-bold block">فحص جودة شريط الحياكة (Tape Edge)</span>
              <span className="text-[10px] text-slate-400 font-mono">غرز منتظمة بدون انزلاق</span>
            </div>
            {gateChecks.gate_tape_edge ? <CheckSquare size={16} className="text-emerald-600" /> : <Square size={16} />}
          </div>

          <div 
            onClick={() => toggleGate('gate_spring_test')}
            className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main flex items-center justify-between cursor-pointer"
          >
            <div>
              <span className="font-bold block">اختبار ثبات شاسيه السوست</span>
              <span className="text-[10px] text-slate-400 font-mono">اختبار ارتداد هيدروليكي</span>
            </div>
            {gateChecks.gate_spring_test ? <CheckSquare size={16} className="text-emerald-600" /> : <Square size={16} />}
          </div>
        </div>
      </div>

      {/* Step Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border-main">
        <span className="text-[11px] text-slate-400">
          تم توثيق الامتثال وسياسات الضمان من السجل المعتمد.
        </span>

        <button
          type="button"
          onClick={onCompleteStep}
          className="px-6 py-2.5 bg-[#0B2D5C] hover:bg-[#133763] text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center gap-2 transition-all"
        >
          <span>حفظ والتقدم إلى الخطوة 8: إطلاق واعتماد الإنتاج (Production Release)</span>
          <ChevronRight size={15} className="rtl:rotate-180" />
        </button>
      </div>

    </div>
  );
};
