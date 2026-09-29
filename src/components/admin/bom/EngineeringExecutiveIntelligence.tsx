import React from 'react';
import { 
  Building2, Activity, ShieldCheck, Factory, Tag, 
  Layers, CheckCircle2, Clock, Box, Sparkles
} from 'lucide-react';
import { ManufacturingReadinessResult } from '../../../services/manufacturingReadinessEngine';
import { ErpDatabase } from '../../../utils/erpDb';

interface ProductClassificationProps {
  marketSegment?: string;
  comfortLevel?: string;
  springTechnology?: string;
  warrantyPolicyId?: string;
  manufacturingCategory?: string;
  readiness?: ManufacturingReadinessResult;
  targetHeight?: number;
  totalCost?: number;
  isDoubleSided?: boolean;
}

export const EngineeringExecutiveIntelligence: React.FC<any> = ({
  marketSegment = 'فنادق 5 نجوم والتجزئة الفاخرة (5-Star Hospitality & Luxury Retail)',
  comfortLevel = 'متوسط القساوة إرجونومي (Medium Firm H2/H3)',
  springTechnology = 'نوابض جيبية منفصلة معزولة كربونياً (Pocket Spring 2.0mm)',
  warrantyPolicyId = 'POL-10Y',
  manufacturingCategory = 'مرتبة سوست جيبية وجهين (Double-Sided Pocket Spring)',
  readiness,
  targetHeight = 25,
  isDoubleSided = true
}) => {
  // Get warranty policy from Registry
  const policies = ErpDatabase.getWarrantyPolicies();
  const activePolicy = policies.find(p => p.id === warrantyPolicyId) || policies[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner: Real Manufacturing Product Classification */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0B2D5C] to-slate-950 text-white p-6 rounded-3xl border border-blue-900/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-mono font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5">
                <Factory size={14} className="text-blue-400" />
                Product Manufacturing Classification
              </span>
              <span className="px-3 py-1 rounded-lg text-xs bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                {isDoubleSided ? 'تصميم وجهين متماثلين' : 'وجه نوم أحادي'}
              </span>
            </div>
            
            <h3 className="text-2xl font-black text-white tracking-tight">
              التصنيف الصناعي والتسويقي للمنتج (Product Classification)
            </h3>
            
            <p className="text-sm text-blue-200/80 font-medium max-w-2xl">
              توصيف معتمد لخطوط الإنتاج والتسويق التجاري مبني على سياسات الضمان المسجلة، نظام النوابض، وفئة الاستخدام الفعلي.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center px-2">
              <div className="text-[11px] text-blue-200/70 font-semibold mb-1">فترة الضمان المعتمدة</div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {activePolicy?.warrantyYears || 10} سنوات
              </div>
              <div className="text-[10px] text-blue-200/80 font-mono">
                {activePolicy?.name || 'Standard Policy'}
              </div>
            </div>

            <div className="w-px h-10 bg-white/10" />

            <div className="text-center px-2">
              <div className="text-[11px] text-blue-200/70 font-semibold mb-1">حالة جاهزية المصنع</div>
              <div className="text-2xl font-black text-blue-300 font-mono">
                {readiness?.isReadyForProduction !== false ? 'جاهز للإنتاج' : 'قيد المراجعة'}
              </div>
              <div className="text-[10px] text-blue-200/80 font-mono">
                Production Approved
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Core Real Manufacturing Classification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* 1. Market Segment */}
        <div className="bg-surface border border-border-main p-4 rounded-2xl shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">1. القطاع السوقي المستهدف</span>
            <Building2 size={16} className="text-blue-500" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-text-main">
              {marketSegment}
            </h4>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-bold block">
              Market Segment
            </span>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-border-main/60 pt-2 font-medium">
            مخصص لسلاسل الفنادق الفاخرة وصالات العرض المعتمدة
          </div>
        </div>

        {/* 2. Comfort Level */}
        <div className="bg-surface border border-border-main p-4 rounded-2xl shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">2. مستوى الراحة والصلابة</span>
            <Activity size={16} className="text-purple-500" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-text-main">
              {comfortLevel}
            </h4>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono font-bold block">
              Ergonomic Firmness Scale
            </span>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-border-main/60 pt-2 font-medium">
            توزيع ضغط متوازن للعمود الفقري مع طبقات راحة علوية
          </div>
        </div>

        {/* 3. Spring Technology */}
        <div className="bg-surface border border-border-main p-4 rounded-2xl shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">3. تقنية نظام النوابض</span>
            <Layers size={16} className="text-amber-500" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-text-main">
              {springTechnology}
            </h4>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold block">
              Spring System Engineering
            </span>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-border-main/60 pt-2 font-medium">
            عزل تام للاهتزاز مع دعم فوري للحواف Encased Foam
          </div>
        </div>

        {/* 4. Warranty Policy */}
        <div className="bg-surface border border-border-main p-4 rounded-2xl shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">4. سياسة الضمان المعتمدة</span>
            <ShieldCheck size={16} className="text-emerald-500" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-text-main">
              {activePolicy?.name || 'ضمان 10 سنوات شامل'}
            </h4>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold block">
              Policy ID: {activePolicy?.id} ({activePolicy?.warrantyYears}Y)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-border-main/60 pt-2 font-medium truncate">
            {activePolicy?.description || 'ضمان مسجل في سجل سياسات الضمان الرسمي'}
          </div>
        </div>

        {/* 5. Manufacturing Category */}
        <div className="bg-surface border border-border-main p-4 rounded-2xl shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">5. الفئة الإنشائية الصناعية</span>
            <Tag size={16} className="text-teal-500" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-text-main">
              {manufacturingCategory}
            </h4>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono font-bold block">
              Mfg Structure Category
            </span>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-border-main/60 pt-2 font-medium">
            مطابقة لمعايير الإنتاج الشامل وخطوط التجميع الآلية
          </div>
        </div>

      </div>
    </div>
  );
};
