import React, { useMemo } from 'react';
import { 
  Building2, Layers, ShieldCheck, Factory, 
  ArrowLeftRight, CheckCircle2, ChevronRight, Sliders, Info, Copy, Plus, Sparkles, Tag, Ruler
} from 'lucide-react';
import { Brand, ProductFamily, Model } from '../../../types/erp';
import { CurrencyCode, CurrencyEngine } from '../../../services/currencyEngine';
import { ErpDatabase } from '../../../utils/erpDb';
import { ProductVariantService } from '../../../services/productVariantService';

interface PepStep1ProductDefinitionProps {
  // Selections
  selectedBrandId: string;
  setSelectedBrandId: (id: string) => void;
  selectedFamilyId: string;
  setSelectedFamilyId: (id: string) => void;
  selectedModelId: string;
  setSelectedModelId: (id: string) => void;
  selectedPlantId: string;
  setSelectedPlantId: (id: string) => void;
  activeCurrency: CurrencyCode;
  setActiveCurrency: (cur: CurrencyCode) => void;

  // Master lists
  brands: Brand[];
  families: ProductFamily[];
  models: Model[];
  
  // Product Parameters
  designDimensions: string;
  setDesignDimensions: (dims: string) => void;
  designTargetHeight: number;
  setDesignTargetHeight: (h: number) => void;
  designComfortLevel: string;
  setDesignComfortLevel: (c: string) => void;
  springTechnology: string;
  setSpringTechnology: (s: string) => void;
  manufacturingSystem: string;
  setManufacturingSystem: (m: string) => void;
  isDoubleSided: boolean;
  setIsDoubleSided: (val: boolean) => void;
  
  onCompleteStep: () => void;
  onOpenCloneModal?: () => void;
}

export const PepStep1ProductDefinition: React.FC<PepStep1ProductDefinitionProps> = ({
  selectedBrandId,
  selectedFamilyId,
  selectedModelId,
  selectedPlantId,
  setSelectedPlantId,
  activeCurrency,
  setActiveCurrency,
  brands,
  families,
  models,
  designDimensions,
  setDesignDimensions,
  designTargetHeight,
  setDesignTargetHeight,
  designComfortLevel,
  setDesignComfortLevel,
  springTechnology,
  setSpringTechnology,
  manufacturingSystem,
  setManufacturingSystem,
  isDoubleSided,
  setIsDoubleSided,
  onCompleteStep,
  onOpenCloneModal
}) => {
  const currentBrand = brands.find(b => b.id === selectedBrandId) || brands[0];
  const currentFamily = families.find(f => f.id === selectedFamilyId) || families[0];
  const currentModel = models.find(m => m.id === selectedModelId) || models[0];

  // Sourced strictly from Model Approved Specs (Section 6 & 9)
  const approvedDimensions = useMemo(() => {
    return ProductVariantService.getApprovedDimensionsForModel(
      currentModel?.id || 'MOD-SLP-SILVER',
      currentModel?.name || 'Silver',
      designTargetHeight
    );
  }, [currentModel, designTargetHeight]);

  const warrantyPolicyInfo = useMemo(() => {
    return ProductVariantService.getWarrantyPolicyForModel(
      currentModel?.id || 'MOD-SLP-SILVER',
      currentModel?.name || 'Silver'
    );
  }, [currentModel]);

  const policies = ErpDatabase.getWarrantyPolicies();
  const activePolicy = policies.find(p => p.id === warrantyPolicyInfo.policyId) || policies[0];

  // Active Variant Code: [Brand]-[Model]-[Width]-[Length]-H[Height] (Section 4)
  const activeVariantCode = useMemo(() => {
    // Parse dimensions (e.g. "180×195" or "100×195 سم")
    const match = designDimensions.match(/(\d+)\s*[×xX]\s*(\d+)/);
    const width = match ? Number(match[1]) : 180;
    const length = match ? Number(match[2]) : 195;
    return ProductVariantService.generateVariantCode(
      currentBrand?.serialPrefix || 'SLP',
      currentModel?.name || 'Silver',
      width,
      length,
      designTargetHeight || 25
    );
  }, [currentBrand, currentModel, designDimensions, designTargetHeight]);

  // Plant & Currency hierarchy
  const plants = CurrencyEngine.getPlantsForBrand(selectedBrandId);
  const currentPlant = plants.find(p => p.id === selectedPlantId) || plants[0];

  return (
    <div className="space-y-6 text-right font-sans">
      
      {/* Top Banner: Read-Only Model Identity & Actions (Section 5) */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-border-main flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B2D5C] text-white flex items-center justify-center font-bold shadow-xs">
            <Building2 size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm text-[#0B2D5C] dark:text-blue-300">
                تعريف مواصفات الموديل الحالي (Current Model Master Definition)
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">
                Read-Only (مقفل)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              يتم استعراض الموديل والـ Variant المعتمد حالياً. التغيير مصرح به فقط عبر استنساخ الموديل أو إنشاء موديل جديد.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenCloneModal && (
            <button
              type="button"
              onClick={onOpenCloneModal}
              className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-blue-200 dark:border-blue-800 cursor-pointer"
            >
              <Copy size={13} />
              <span>استنساخ الموديل (Clone Model)</span>
            </button>
          )}

          <div className="flex items-center gap-2 pr-2 border-r border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-400">حالة التماثل الهيكلي:</span>
            <button
              type="button"
              onClick={() => setIsDoubleSided(!isDoubleSided)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                isDoubleSided 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-500/40' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
              }`}
            >
              <ArrowLeftRight size={13} />
              <span>{isDoubleSided ? 'مرتبة بوجهين (Double-Sided)' : 'وجه نوم أحادي (Single-Sided)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Key Variant Identification Card (Section 4) */}
      <div className="p-4 bg-gradient-to-l from-blue-900/10 via-slate-50 to-emerald-900/10 dark:from-blue-950/40 dark:via-slate-900 dark:to-emerald-950/40 rounded-2xl border border-blue-300 dark:border-blue-900 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
            Product Variant Primary Key (المفتاح الرئيسي للمنتج والتصنيع والضمان):
          </span>
          <span className="font-mono text-base font-black text-[#0B2D5C] dark:text-blue-300">
            {activeVariantCode}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 border border-border-main font-mono">
            {currentBrand?.name} / {currentModel?.name}
          </span>
          <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-300 dark:border-emerald-800">
            {activePolicy?.warrantyYears} سنوات ضمان صريح
          </span>
        </div>
      </div>

      {/* Main 11 Standard Industrial Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        
        {/* 1. Brand (Read-Only) */}
        <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-400">1. العلامة التجارية (Brand):</label>
            <span className="font-mono text-[10px] text-slate-400">Product Master</span>
          </div>
          <div className="h-9 px-3 bg-slate-100/70 dark:bg-slate-900 rounded-xl font-bold flex items-center justify-between border border-border-main">
            <span className="text-slate-800 dark:text-slate-200">{currentBrand?.name}</span>
            <span className="font-mono text-[10px] text-slate-500">[{currentBrand?.serialPrefix}]</span>
          </div>
        </div>

        {/* 2. Product Family (Read-Only) */}
        <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-400">2. عائلة المنتج (Product Family):</label>
            <span className="font-mono text-[10px] text-slate-400">Family Registry</span>
          </div>
          <div className="h-9 px-3 bg-slate-100/70 dark:bg-slate-900 rounded-xl font-bold flex items-center justify-between border border-border-main">
            <span className="text-slate-800 dark:text-slate-200">{currentFamily?.nameAr}</span>
            <span className="font-mono text-[10px] text-slate-500">{currentFamily?.nameEn}</span>
          </div>
        </div>

        {/* 3. Model (Read-Only as per Section 5 - No Global Dropdown) */}
        <div className="p-3.5 bg-surface rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/20 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-[#0B2D5C] dark:text-blue-300">3. موديل المرتبة (Model):</label>
            <span className="font-mono text-[10px] text-blue-600 font-bold">{currentModel?.id}</span>
          </div>
          <div className="h-9 px-3 bg-white dark:bg-slate-800 rounded-xl font-black text-sm text-[#0B2D5C] dark:text-blue-200 flex items-center justify-between border border-blue-200 dark:border-blue-800">
            <span>{currentModel?.name}</span>
            <span className="text-[10px] font-bold text-slate-400 font-mono">Current Active Model</span>
          </div>
        </div>

        {/* 4. Model Approved Dimensions Only (Section 6) */}
        <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-400">4. الأبعاد المعتمدة للموديل (Model Approved Dimensions):</label>
            <span className="font-mono text-[10px] text-emerald-600 font-bold">Approved Specs</span>
          </div>
          <select
            value={designDimensions}
            onChange={(e) => setDesignDimensions(e.target.value)}
            className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-mono font-bold text-xs outline-none cursor-pointer focus:border-[#0B2D5C]"
          >
            {approvedDimensions.map(dim => {
              const val = `${dim.width}×${dim.length} سم`;
              return (
                <option key={`${dim.width}x${dim.length}`} value={val}>
                  {dim.labelAr}
                </option>
              );
            })}
          </select>
        </div>

        {/* 5. Target Height (Approved Range) */}
        <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400">5. الارتفاع الكلي المستهدف (Height):</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={designTargetHeight}
              onChange={(e) => setDesignTargetHeight(Number(e.target.value))}
              className="flex-1 h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-mono font-bold text-xs outline-none focus:border-[#0B2D5C]"
            />
            <span className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-slate-600 dark:text-slate-300 text-xs">
              سم
            </span>
          </div>
        </div>

        {/* 6. Comfort Level */}
        <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400">6. مستوى الراحة والقساوة (Comfort Level):</label>
          <select
            value={designComfortLevel}
            onChange={(e) => setDesignComfortLevel(e.target.value)}
            className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold text-xs outline-none cursor-pointer focus:border-[#0B2D5C]"
          >
            <option value="Plush (ناعم فندقي فاخر)">Plush (ناعم فندقي فاخر H1)</option>
            <option value="Medium Soft (متوسط النعومة)">Medium Soft (متوسط النعومة H2)</option>
            <option value="Medium Firm (متوسط القساوة إرجونومي)">Medium Firm (متوسط القساوة إرجونومي H3)</option>
            <option value="Firm (طبي متماسك)">Firm (طبي متماسك H4)</option>
            <option value="Extra Firm (صلب فائق لدعم العمود الفقري)">Extra Firm (صلب فائق لدعم العمود الفقري H5)</option>
          </select>
        </div>

        {/* 7. Spring Technology */}
        <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400">7. تقنية النوابض والشاسيه (Spring Technology):</label>
          <select
            value={springTechnology}
            onChange={(e) => setSpringTechnology(e.target.value)}
            className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold text-xs outline-none cursor-pointer focus:border-[#0B2D5C]"
          >
            <option value="Pocket Spring 2.0mm (سوست جيبية منفصلة معزولة)">Pocket Spring 2.0mm (سوست جيبية منفصلة معزولة)</option>
            <option value="Multi-Zone Pocket Spring (5-7 مناطق دعم)">Multi-Zone Pocket Spring (5-7 مناطق دعم)</option>
            <option value="Bonnell Spring 2.2mm (نوابض متصلة كربونية)">Bonnell Spring 2.2mm (نوابض متصلة كربونية)</option>
            <option value="Medical High-Resilience Core (إسفنج طبي عالي المرونة بدون سوست)">Medical High-Resilience Core (إسفنج طبي عالي المرونة بدون سوست)</option>
          </select>
        </div>

        {/* 8. Manufacturing System */}
        <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400">8. نظام التصنيع (Manufacturing System):</label>
          <select
            value={manufacturingSystem}
            onChange={(e) => setManufacturingSystem(e.target.value)}
            className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold text-xs outline-none cursor-pointer focus:border-[#0B2D5C]"
          >
            <option value="Continuous Flow Line (خط تجميع مستمر آلي)">Continuous Flow Line (خط تجميع مستمر آلي)</option>
            <option value="Cellular Batch Assembly (خلايا تشغيل مرنة على دفعات)">Cellular Batch Assembly (خلايا تشغيل مرنة على دفعات)</option>
            <option value="Semi-Automated Line (تجميع نصف آلي مع نقاط فحص)">Semi-Automated Line (تجميع نصف آلي مع نقاط فحص)</option>
            <option value="Craftsman Hand-Tufting (تصنيع يدوي فائق الحرفية)">Craftsman Hand-Tufting (تصنيع يدوي فائق الحرفية)</option>
          </select>
        </div>

        {/* 9. Warranty Policy (Read-Only Governance as per Section 8 & 9 - No Dropdown) */}
        <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-400">9. سياسة الضمان الملزمة للـ Variant:</label>
            <span className="font-mono text-[10px] text-emerald-600 font-bold">{activePolicy?.id}</span>
          </div>
          <div className="p-2 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-white">{activePolicy?.name}</span>
            <span className="font-mono text-emerald-600 font-black">{activePolicy?.warrantyYears} سنوات (مقفل)</span>
          </div>
        </div>

        {/* 10. Plant */}
        <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-400">10. مصنع الإنتاج (Manufacturing Plant):</label>
            <span className="font-mono text-[10px] text-slate-400">{currentPlant?.code}</span>
          </div>
          <select
            value={selectedPlantId}
            onChange={(e) => {
              const plantId = e.target.value;
              setSelectedPlantId(plantId);
              const p = plants.find(item => item.id === plantId);
              if (p) setActiveCurrency(p.defaultCurrency);
            }}
            className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold text-xs outline-none cursor-pointer focus:border-[#0B2D5C]"
          >
            {plants.map(p => (
              <option key={p.id} value={p.id}>{p.nameAr} - {p.country}</option>
            ))}
          </select>
        </div>

        {/* 11. Default Currency */}
        <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-400">11. العملة التشغيلية المعتمدة (Currency):</label>
            <span className="font-mono text-[10px] text-blue-600 font-bold">Brand → Plant</span>
          </div>
          <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-white">عملة مصنع {currentPlant?.nameAr || ''}</span>
            <span className="font-mono text-blue-600 font-black text-sm bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-lg border border-blue-200 dark:border-blue-900">
              {activeCurrency}
            </span>
          </div>
        </div>

      </div>

      {/* Step Actions: Next Step */}
      <div className="flex items-center justify-between pt-2 border-t border-border-main">
        <span className="text-[11px] text-slate-400">
          تم قفل المواصفات وربط الـ Variant {activeVariantCode} بنجاح.
        </span>

        <button
          type="button"
          onClick={onCompleteStep}
          className="px-6 py-2.5 bg-[#0B2D5C] hover:bg-[#133763] text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center gap-2 transition-all"
        >
          <span>حفظ والتقدم إلى الخطوة 2: قائمة المواد والطبقات (BOM & Materials)</span>
          <ChevronRight size={15} className="rtl:rotate-180" />
        </button>
      </div>

    </div>
  );
};
