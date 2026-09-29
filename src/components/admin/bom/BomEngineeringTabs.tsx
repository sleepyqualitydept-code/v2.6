import React from 'react';
import { 
  ShieldCheck, GitBranch, DollarSign, Truck, ShieldAlert, CheckCircle2, 
  AlertCircle, AlertTriangle, Settings, Box, Activity, Zap, Factory, FileCheck
} from 'lucide-react';
import { Brand } from '../../../types/erp';
import { DetailedEngineeringScores } from '../../../services/productEngineeringScoringEngine';
import { ManufacturingReadinessResult } from '../../../services/manufacturingReadinessEngine';
import { RoutingRecommendationResult } from '../../../services/routingRecommendationEngine';
import { EngineeringComplianceReport } from '../../../services/engineeringComplianceEngine';
import { EngineeringExecutiveIntelligence } from './EngineeringExecutiveIntelligence';
import { EngineeringCompliancePanel } from './EngineeringCompliancePanel';
import { RoutingRecommendationView } from './RoutingRecommendationView';

export type BomTabKey = 'executive' | 'compliance' | 'routing' | 'warranty' | 'lifecycle' | 'cost' | 'logistics' | 'validation';

interface BomEngineeringTabsProps {
  bomBottomTab: BomTabKey;
  setBomBottomTab: (tab: BomTabKey) => void;
  designBrand: string;
  setDesignBrand: (b: string) => void;
  brands: Brand[];
  designModel: string;
  setDesignModel: (m: string) => void;
  designCategory: string;
  setDesignCategory: (c: string) => void;
  designDimensions: string;
  setDesignDimensions: (d: string) => void;
  designTargetHeight: number;
  setDesignTargetHeight: (h: number) => void;
  designVersion: string;
  setDesignVersion: (v: string) => void;
  designComfortLevel: string;
  setDesignComfortLevel: (cl: string) => void;
  designPositioning: string;
  setDesignPositioning: (p: string) => void;
  selectedPolicyId: string;
  setSelectedPolicyId: (p: string) => void;
  coverageRules: string;
  setCoverageRules: (r: string) => void;
  warrantyExclusions: string;
  setWarrantyExclusions: (e: string) => void;
  replacementPolicy: string;
  setReplacementPolicy: (rp: string) => void;
  claimRiskClass: string;
  lifecycleStage: 'Draft' | 'Under Review' | 'Approved' | 'Released' | 'Obsolete';
  setLifecycleStage: (st: 'Draft' | 'Under Review' | 'Approved' | 'Released' | 'Obsolete') => void;
  createdBy: string;
  setCreatedBy: (cb: string) => void;
  createdDate: string;
  setCreatedDate: (cd: string) => void;
  revisionNotes: string;
  setRevisionNotes: (rn: string) => void;
  engineeringNotes: string;
  setEngineeringNotes: (en: string) => void;
  expandedCostAnalysis: any;
  laborCost: number;
  setLaborCost: (c: number) => void;
  packagingCost: number;
  setPackagingCost: (c: number) => void;
  transportCost: number;
  setTransportCost: (c: number) => void;
  targetMargin: number;
  setTargetMargin: (m: number) => void;
  logisticsEngine: {
    netWeightKg: number;
    grossWeightKg: number;
    compressedVolumeM3: number;
    shippingVolumeM3: number;
    logisticCategory: string;
  };
  validationWarnings: string[];
  detailedScores?: DetailedEngineeringScores;
  manufacturingReadiness?: ManufacturingReadinessResult;
  suggestedRouting?: RoutingRecommendationResult;
  complianceReport?: EngineeringComplianceReport;
}

export const BomEngineeringTabs: React.FC<BomEngineeringTabsProps> = ({
  bomBottomTab,
  setBomBottomTab,
  designBrand,
  setDesignBrand,
  brands,
  designModel,
  setDesignModel,
  designCategory,
  setDesignCategory,
  designDimensions,
  setDesignDimensions,
  designTargetHeight,
  setDesignTargetHeight,
  designVersion,
  setDesignVersion,
  designComfortLevel,
  setDesignComfortLevel,
  designPositioning,
  setDesignPositioning,
  selectedPolicyId,
  setSelectedPolicyId,
  coverageRules,
  setCoverageRules,
  warrantyExclusions,
  setWarrantyExclusions,
  replacementPolicy,
  setReplacementPolicy,
  claimRiskClass,
  lifecycleStage,
  setLifecycleStage,
  createdBy,
  setCreatedBy,
  createdDate,
  setCreatedDate,
  revisionNotes,
  setRevisionNotes,
  engineeringNotes,
  setEngineeringNotes,
  expandedCostAnalysis,
  laborCost,
  setLaborCost,
  packagingCost,
  setPackagingCost,
  transportCost,
  setTransportCost,
  targetMargin,
  setTargetMargin,
  logisticsEngine,
  validationWarnings,
  detailedScores,
  manufacturingReadiness,
  suggestedRouting,
  complianceReport
}) => {
  return (
    <div className="bg-surface border border-border-main p-5 rounded-3xl space-y-5 shadow-xs">
      
      {/* 8 ENGINEERING TABS NAVIGATION BAR */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border-main pb-3">
        
        {/* TAB 1: PRODUCT CLASSIFICATION */}
        <button
          type="button"
          onClick={() => setBomBottomTab('executive')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            bomBottomTab === 'executive'
              ? 'bg-blue-900 text-white shadow-xs ring-2 ring-blue-500/30'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Factory size={14} className="text-blue-300" />
          <span>1. تصنيف المنتج (Product Classification)</span>
        </button>

        {/* TAB 2: COMPLIANCE PANEL */}
        <button
          type="button"
          onClick={() => setBomBottomTab('compliance')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            bomBottomTab === 'compliance'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <FileCheck size={14} />
          <span>2. الامتثال الصناعي (Compliance)</span>
          {complianceReport && (
            <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded ${
              complianceReport.overallStatus === 'PASS' ? 'bg-emerald-400/20 text-emerald-300' : 'bg-rose-400/20 text-rose-300'
            }`}>
              {complianceReport.overallStatus}
            </span>
          )}
        </button>

        {/* TAB 3: ROUTING RECOMMENDATION */}
        <button
          type="button"
          onClick={() => setBomBottomTab('routing')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            bomBottomTab === 'routing'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Factory size={14} />
          <span>3. مسار التصنيع المقترح (Routing)</span>
        </button>

        {/* TAB 4: STRUCTURE & WARRANTY */}
        <button
          type="button"
          onClick={() => setBomBottomTab('warranty')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            bomBottomTab === 'warranty'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <ShieldCheck size={14} />
          <span>4. الضمان والهيكل (Warranty)</span>
        </button>

        {/* TAB 5: LIFECYCLE */}
        <button
          type="button"
          onClick={() => setBomBottomTab('lifecycle')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            bomBottomTab === 'lifecycle'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <GitBranch size={14} />
          <span>5. دورة الحياة (Lifecycle)</span>
        </button>

        {/* TAB 6: COST */}
        <button
          type="button"
          onClick={() => setBomBottomTab('cost')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            bomBottomTab === 'cost'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <DollarSign size={14} />
          <span>6. التكلفة (Cost Engine)</span>
        </button>

        {/* TAB 7: LOGISTICS */}
        <button
          type="button"
          onClick={() => setBomBottomTab('logistics')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            bomBottomTab === 'logistics'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Truck size={14} />
          <span>7. اللوجستيات (Logistics)</span>
        </button>

        {/* TAB 8: VALIDATION */}
        <button
          type="button"
          onClick={() => setBomBottomTab('validation')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            bomBottomTab === 'validation'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <ShieldAlert size={14} />
          <span>8. تدقيق المخاطر ({validationWarnings.length})</span>
        </button>
      </div>

      {/* RENDER ACTIVE TAB */}

      {/* TAB 1: PRODUCT CLASSIFICATION */}
      {bomBottomTab === 'executive' && (
        <div className="animate-fade-in">
          <EngineeringExecutiveIntelligence 
            marketSegment="فنادق 5 نجوم والتجزئة الفاخرة (5-Star Hospitality & Luxury Retail)"
            comfortLevel={designComfortLevel}
            springTechnology="نوابض جيبية منفصلة معزولة كربونياً (Pocket Spring Core)"
            warrantyPolicyId={selectedPolicyId}
            manufacturingCategory={`مرتبة ${designModel} — تصنيف قياسي معتمد`}
            readiness={manufacturingReadiness}
            targetHeight={designTargetHeight}
            totalCost={expandedCostAnalysis?.totalCost || 0}
            isDoubleSided={true}
          />
        </div>
      )}

      {/* TAB 2: COMPLIANCE PANEL */}
      {bomBottomTab === 'compliance' && complianceReport && (
        <div className="animate-fade-in">
          <EngineeringCompliancePanel compliance={complianceReport} />
        </div>
      )}

      {/* TAB 3: ROUTING RECOMMENDATION */}
      {bomBottomTab === 'routing' && suggestedRouting && (
        <div className="animate-fade-in">
          <RoutingRecommendationView routing={suggestedRouting} />
        </div>
      )}

      {/* TAB 4: PRODUCT STRUCTURE & WARRANTY */}
      {bomBottomTab === 'warranty' && (
        <div className="space-y-4 text-xs font-bold animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-400 text-[10px] mb-1">البراند (Brand)</label>
              <select
                value={designBrand}
                onChange={(e) => setDesignBrand(e.target.value)}
                className="w-full h-8 px-2 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-lg outline-none"
              >
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-[10px] mb-1">اسم الموديل (Model)</label>
              <input
                type="text"
                value={designModel}
                onChange={(e) => setDesignModel(e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-lg outline-none text-blue-600 font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[10px] mb-1">الأبعاد (Dimensions)</label>
              <input
                type="text"
                value={designDimensions}
                onChange={(e) => setDesignDimensions(e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-lg outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[10px] mb-1">سياسة الضمان المعتمدة</label>
              <select
                value={selectedPolicyId}
                onChange={(e) => setSelectedPolicyId(e.target.value)}
                className="w-full h-8 px-2 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-lg outline-none text-amber-600"
              >
                <option value="POL-10Y">ضمان شامل 10 سنوات (POL-10Y)</option>
                <option value="POL-7Y">ضمان شامل 7 سنوات (POL-7Y)</option>
                <option value="POL-5Y">ضمان شامل 5 سنوات (POL-5Y)</option>
                <option value="POL-DEC">ضمان تناقصي 10 سنوات (POL-DEC)</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-amber-500/5 border border-amber-200/60 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-amber-200/50 pb-2">
              <span className="text-amber-800 dark:text-amber-300 font-black flex items-center gap-1">
                <ShieldCheck size={16} />
                <span>شروط وتغطية الضمان وسياسة الاستبدال</span>
              </span>
              <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 rounded-full text-[10px]">
                {claimRiskClass}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-[10px] mb-1">شروط وتغطية الضمان (Coverage Rules):</label>
                <input
                  type="text"
                  value={coverageRules}
                  onChange={(e) => setCoverageRules(e.target.value)}
                  className="w-full h-8 px-2.5 bg-white dark:bg-slate-950 border border-border-main rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[10px] mb-1">الاستثناءات وموانع الضمان (Exclusions):</label>
                <input
                  type="text"
                  value={warrantyExclusions}
                  onChange={(e) => setWarrantyExclusions(e.target.value)}
                  className="w-full h-8 px-2.5 bg-white dark:bg-slate-950 border border-border-main rounded-lg outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-400 text-[10px] mb-1">سياسة الاستبدال الفوري (Replacement Rules):</label>
                <input
                  type="text"
                  value={replacementPolicy}
                  onChange={(e) => setReplacementPolicy(e.target.value)}
                  className="w-full h-8 px-2.5 bg-white dark:bg-slate-950 border border-border-main rounded-lg outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: LIFECYCLE & VERSION CONTROL */}
      {bomBottomTab === 'lifecycle' && (
        <div className="space-y-4 text-xs font-bold animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-400 text-[10px] mb-1">المرحلة الحالية (Stage)</label>
              <select
                value={lifecycleStage}
                onChange={(e) => setLifecycleStage(e.target.value as any)}
                className="w-full h-8 px-2 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-lg outline-none text-blue-600 font-bold"
              >
                <option value="Draft">مسودة (Draft)</option>
                <option value="Under Review">قيد المراجعة (Under Review)</option>
                <option value="Approved">معتمد (Approved)</option>
                <option value="Released">مطلق للإنتاج (Released)</option>
                <option value="Obsolete">ملغي / متقادم (Obsolete)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-[10px] mb-1">النسخة (Version)</label>
              <input
                type="text"
                value={designVersion}
                onChange={(e) => setDesignVersion(e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-lg outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[10px] mb-1">المصمم / المهندس المسؤول</label>
              <input
                type="text"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[10px] mb-1">تاريخ الاعتماد والتحديث</label>
              <input
                type="text"
                value={createdDate}
                onChange={(e) => setCreatedDate(e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-lg outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-[10px] mb-1">ملاحظات الإصدار والتغييرات (Revision Notes):</label>
              <textarea
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                rows={3}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-lg outline-none resize-none font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[10px] mb-1">الملاحظات الهندسية لخط الإنتاج (Shop Floor Notes):</label>
              <textarea
                value={engineeringNotes}
                onChange={(e) => setEngineeringNotes(e.target.value)}
                rows={3}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-lg outline-none resize-none font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: COST ANALYSIS */}
      {bomBottomTab === 'cost' && (
        <div className="space-y-4 text-xs font-bold animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <span className="text-slate-400 text-[10px]">كلفة المواد الخام (Direct Materials):</span>
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                {((expandedCostAnalysis?.foamCost || 0) + (expandedCostAnalysis?.springCost || 0) + (expandedCostAnalysis?.fabricCost || 0) + (expandedCostAnalysis?.comfortCost || 0)).toFixed(2)} ر.س
              </div>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <span className="text-slate-400 text-[10px]">كلفة العمالة والتشغيل:</span>
              <div className="text-base font-black text-blue-600 dark:text-blue-400 font-mono mt-0.5">
                {laborCost.toFixed(2)} ر.س
              </div>
            </div>
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <span className="text-slate-400 text-[10px]">التغليف والشحن الصناعي:</span>
              <div className="text-base font-black text-purple-600 dark:text-purple-400 font-mono mt-0.5">
                {(packagingCost + transportCost).toFixed(2)} ر.س
              </div>
            </div>
            <div className="p-3 bg-slate-900 text-white rounded-xl">
              <span className="text-slate-400 text-[10px]">إجمالي تكلفة الـ BOM:</span>
              <div className="text-base font-black text-amber-400 font-mono mt-0.5">
                {(expandedCostAnalysis?.totalCost || 0).toFixed(2)} ر.س
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-400 text-[10px] mb-1">أجور اليد العاملة (Labor Cost):</label>
              <input
                type="number"
                value={laborCost}
                onChange={(e) => setLaborCost(Number(e.target.value))}
                className="w-full h-8 px-2.5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-lg outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[10px] mb-1">كلفة التغليف والكرتون (Packaging):</label>
              <input
                type="number"
                value={packagingCost}
                onChange={(e) => setPackagingCost(Number(e.target.value))}
                className="w-full h-8 px-2.5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-lg outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[10px] mb-1">كلفة النقل والتسليم (Transport):</label>
              <input
                type="number"
                value={transportCost}
                onChange={(e) => setTransportCost(Number(e.target.value))}
                className="w-full h-8 px-2.5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-lg outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[10px] mb-1">هامش الربح المستهدف (% Margin):</label>
              <input
                type="number"
                value={targetMargin}
                onChange={(e) => setTargetMargin(Number(e.target.value))}
                className="w-full h-8 px-2.5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-lg outline-none font-mono text-emerald-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: LOGISTICS ENGINE */}
      {bomBottomTab === 'logistics' && (
        <div className="space-y-4 text-xs font-bold animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
              <span className="text-slate-400 text-[10px]">الوزن الصافي الإنشائي:</span>
              <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                {logisticsEngine.netWeightKg.toFixed(1)} <span className="text-xs font-sans">كجم</span>
              </div>
            </div>
            <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
              <span className="text-slate-400 text-[10px]">الوزن الإجمالي مع التغليف:</span>
              <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                {logisticsEngine.grossWeightKg.toFixed(1)} <span className="text-xs font-sans">كجم</span>
              </div>
            </div>
            <div className="p-3.5 bg-teal-500/10 border border-teal-500/20 rounded-2xl">
              <span className="text-slate-400 text-[10px]">الحجم المشحون (Volume):</span>
              <div className="text-xl font-black text-teal-600 dark:text-teal-400 font-mono mt-1">
                {logisticsEngine.shippingVolumeM3.toFixed(2)} <span className="text-xs font-sans">م³</span>
              </div>
            </div>
            <div className="p-3.5 bg-teal-500/10 border border-teal-500/20 rounded-2xl">
              <span className="text-slate-400 text-[10px]">التصنيف اللوجستي:</span>
              <div className="text-sm font-black text-teal-600 dark:text-teal-400 mt-1 truncate">
                {logisticsEngine.logisticCategory}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: VALIDATION & RISK ENGINE */}
      {bomBottomTab === 'validation' && (
        <div className="space-y-3 animate-fade-in">
          {validationWarnings.length === 0 ? (
            <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
              <span>لا توجد أي مخاطر هندسية أو تحذيرات هيكلية. التصميم متوافق 100% مع المعايير الصناعية Sleepee.</span>
            </div>
          ) : (
            <div className="space-y-2">
              {validationWarnings.map((warn, i) => (
                <div key={i} className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 font-medium">
                  <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
