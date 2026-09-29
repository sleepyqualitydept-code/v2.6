import React from 'react';
import { 
  Box, Sparkles, Layers, ShieldCheck, Award, Ruler, 
  Activity, Tag, Globe, CheckCircle2, Sliders, ChevronDown, 
  DollarSign, RefreshCw, Eye, Factory, Building2
} from 'lucide-react';
import { Model, Brand, ProductFamily, BillOfMaterials } from '../../../types/erp';
import { CurrencyCode, CurrencyEngine, ManufacturingPlant } from '../../../services/currencyEngine';
import { ErpDatabase } from '../../../utils/erpDb';

interface ProductOverviewLayerProps {
  // Hierarchy
  selectedBrandId: string;
  setSelectedBrandId: (brandId: string) => void;
  selectedFamilyId: string;
  setSelectedFamilyId: (familyId: string) => void;
  selectedModelId: string;
  setSelectedModelId: (modelId: string) => void;
  selectedVersion: string;
  setSelectedVersion: (version: string) => void;
  
  // Plant & Currency
  selectedPlantId?: string;
  setSelectedPlantId?: (plantId: string) => void;
  activeCurrency: CurrencyCode;
  setActiveCurrency: (cur: CurrencyCode) => void;

  // Data records
  brands: Brand[];
  families: ProductFamily[];
  models: Model[];
  savedBoms: BillOfMaterials[];
  
  // Product Parameters
  designHeight: number;
  designComfortLevel: string;
  springSystem: string;
  productStatus: string;
}

export const ProductOverviewLayer: React.FC<ProductOverviewLayerProps> = ({
  selectedBrandId,
  setSelectedBrandId,
  selectedFamilyId,
  setSelectedFamilyId,
  selectedModelId,
  setSelectedModelId,
  selectedVersion,
  setSelectedVersion,
  selectedPlantId,
  setSelectedPlantId,
  activeCurrency,
  setActiveCurrency,
  brands,
  families,
  models,
  savedBoms,
  designHeight,
  designComfortLevel,
  springSystem,
  productStatus
}) => {
  const currentBrand = brands.find(b => b.id === selectedBrandId) || brands[0];
  const currentFamily = families.find(f => f.id === selectedFamilyId) || families[0];
  const currentModel = models.find(m => m.id === selectedModelId) || models[0];

  // PART 7: Warranty values MUST come strictly from the Warranty Policy Registry
  const policies = ErpDatabase.getWarrantyPolicies();
  const activePolicy = policies.find(p => p.id === currentModel?.warrantyPolicyId) || policies[0];
  const policyWarrantyYears = activePolicy?.warrantyYears || 10;

  // PART 6: Plant list for Brand
  const plants = CurrencyEngine.getPlantsForBrand(selectedBrandId);
  const currentPlant = plants.find(p => p.id === selectedPlantId) || plants[0];

  // Filtered lists for hierarchy
  const availableFamilies = families.filter(f => f.status === 'active');
  const availableModels = models.filter(m => {
    const matchBrand = !selectedBrandId || m.brandId === selectedBrandId;
    const matchFamily = !selectedFamilyId || m.familyId === selectedFamilyId;
    return matchBrand && matchFamily;
  });

  return (
    <div className="w-full bg-surface border border-border-main rounded-3xl p-5 shadow-sm space-y-4 animate-fade-in">
      {/* Top Header: Brand Hierarchy Controls & Brand Plant Currency Engine */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-main pb-4">
        {/* Brand & Hierarchy Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">العلامة التجارية:</span>
            <select
              value={selectedBrandId}
              onChange={(e) => {
                const newBrandId = e.target.value;
                setSelectedBrandId(newBrandId);
                const matchingModel = models.find(m => m.brandId === newBrandId);
                if (matchingModel) {
                  setSelectedModelId(matchingModel.id);
                  if (matchingModel.familyId) {
                    setSelectedFamilyId(matchingModel.familyId);
                  }
                }
                // Update currency according to Brand -> Plant -> Default Currency
                const plantCur = CurrencyEngine.getCurrencyForBrandAndPlant(newBrandId);
                setActiveCurrency(plantCur);
              }}
              className="h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl text-xs font-black text-[#0B2D5C] dark:text-blue-300 shadow-2xs outline-none cursor-pointer hover:border-blue-500 transition-colors"
            >
              {brands.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.serialPrefix})
                </option>
              ))}
            </select>
          </div>

          {/* Plant Source (Brand -> Plant -> Default Currency) */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">المصنع / المنشأة:</span>
            <select
              value={currentPlant?.id}
              onChange={(e) => {
                const plantId = e.target.value;
                if (setSelectedPlantId) setSelectedPlantId(plantId);
                CurrencyEngine.setActivePlant(plantId);
                const plantObj = plants.find(p => p.id === plantId);
                if (plantObj) {
                  setActiveCurrency(plantObj.defaultCurrency);
                }
              }}
              className="h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl text-xs font-black text-slate-800 dark:text-slate-200 shadow-2xs outline-none cursor-pointer hover:border-blue-500 transition-colors"
            >
              {plants.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nameAr} ({p.defaultCurrency})
                </option>
              ))}
            </select>
          </div>

          {/* Family */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">عائلة المنتج:</span>
            <select
              value={selectedFamilyId}
              onChange={(e) => {
                const newFamilyId = e.target.value;
                setSelectedFamilyId(newFamilyId);
                const matchingModel = models.find(m => m.brandId === selectedBrandId && m.familyId === newFamilyId);
                if (matchingModel) {
                  setSelectedModelId(matchingModel.id);
                }
              }}
              className="h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl text-xs font-black text-slate-700 dark:text-slate-200 shadow-2xs outline-none cursor-pointer hover:border-blue-500 transition-colors"
            >
              {availableFamilies.map(f => (
                <option key={f.id} value={f.id}>
                  {f.nameAr} ({f.nameEn})
                </option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">الموديل:</span>
            <select
              value={selectedModelId}
              onChange={(e) => {
                const modelId = e.target.value;
                setSelectedModelId(modelId);
                const modelObj = models.find(m => m.id === modelId);
                if (modelObj) {
                  setSelectedBrandId(modelObj.brandId);
                  if (modelObj.familyId) {
                    setSelectedFamilyId(modelObj.familyId);
                  }
                }
              }}
              className="h-9 px-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-black text-blue-700 dark:text-blue-300 shadow-2xs outline-none cursor-pointer hover:border-blue-500 transition-colors"
            >
              {availableModels.length > 0 ? (
                availableModels.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {m.height}cm ({m.manufacturingSystem})
                  </option>
                ))
              ) : (
                models.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({brands.find(b => b.id === m.brandId)?.name})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Version */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">الإصدار:</span>
            <select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              className="h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl text-xs font-mono font-bold text-purple-600 shadow-2xs outline-none cursor-pointer hover:border-purple-500 transition-colors"
            >
              <option value="v1.0">v1.0 (معياري)</option>
              <option value="v1.1">v1.1 (تحديث العزل)</option>
              <option value="v2.0">v2.0 (جودة فندقية)</option>
              <option value="v2.1-PRO">v2.1-PRO (طبي معتمد)</option>
            </select>
          </div>
        </div>

        {/* Currency Switcher & Exchange Rate */}
        <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900 px-3.5 py-1.5 rounded-2xl border border-border-main">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <DollarSign size={14} className="text-emerald-500" />
            <span>العملة المعتمدة:</span>
          </div>
          <div className="flex items-center gap-1">
            {CurrencyEngine.getAllCurrencies().map(c => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  CurrencyEngine.setActiveCurrency(c.code);
                  setActiveCurrency(c.code);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  activeCurrency === c.code 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {c.code} ({c.symbolAr})
              </button>
            ))}
          </div>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline border-r border-slate-200 dark:border-slate-700 pr-2">
            {CurrencyEngine.getExchangeRateDescription(activeCurrency)}
          </span>
        </div>
      </div>

      {/* 8 Clean Executive Product Overview Engineering Cards (No duplicated raw layer clutter) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {/* Card 1: Brand */}
        <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-border-main rounded-2xl p-2.5 flex flex-col justify-between hover:border-blue-300 transition-colors">
          <span className="text-[10px] font-bold text-slate-400">العلامة التجارية</span>
          <div className="font-black text-xs text-[#0B2D5C] dark:text-blue-300 truncate mt-1">
            {currentBrand?.name || 'Sleepee'}
          </div>
          <span className="text-[9px] font-mono text-slate-400">Code: {currentBrand?.id}</span>
        </div>

        {/* Card 2: Family */}
        <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-border-main rounded-2xl p-2.5 flex flex-col justify-between hover:border-blue-300 transition-colors">
          <span className="text-[10px] font-bold text-slate-400">عائلة المنتج</span>
          <div className="font-black text-xs text-slate-800 dark:text-slate-200 truncate mt-1">
            {currentFamily?.nameAr || 'مرتبة سوست'}
          </div>
          <span className="text-[9px] text-slate-400 truncate">{currentFamily?.nameEn}</span>
        </div>

        {/* Card 3: Model */}
        <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 rounded-2xl p-2.5 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">الموديل الهندسي</span>
          <div className="font-black text-xs text-blue-900 dark:text-blue-200 truncate mt-1">
            {currentModel?.name || 'Silver'}
          </div>
          <span className="text-[9px] font-mono text-blue-500">{currentModel?.manufacturingSystem || 'American'} System</span>
        </div>

        {/* Card 4: Version */}
        <div className="bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-900/60 rounded-2xl p-2.5 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">الإصدار المعتمد</span>
          <div className="font-mono font-black text-xs text-purple-800 dark:text-purple-300 mt-1">
            {selectedVersion}
          </div>
          <span className="text-[9px] text-purple-500">Released BOM</span>
        </div>

        {/* Card 5: Height */}
        <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 rounded-2xl p-2.5 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">الارتفاع الكلي</span>
          <div className="font-mono font-black text-sm text-amber-900 dark:text-amber-200 mt-1">
            {designHeight} سم
          </div>
          <span className="text-[9px] text-amber-600">± 1.0 سم تفاوت</span>
        </div>

        {/* Card 6: Comfort Level */}
        <div className="bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-900/60 rounded-2xl p-2.5 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">مستوى الراحة</span>
          <div className="font-black text-xs text-teal-900 dark:text-teal-200 truncate mt-1">
            {designComfortLevel}
          </div>
          <span className="text-[9px] text-teal-600">Ergonomic H2/H3</span>
        </div>

        {/* Card 7: Spring System */}
        <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 rounded-2xl p-2.5 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">نظام النوابض</span>
          <div className="font-black text-xs text-indigo-900 dark:text-indigo-200 truncate mt-1">
            {springSystem || 'Pocket Spring'}
          </div>
          <span className="text-[9px] font-mono text-indigo-500">High Carbon Wire</span>
        </div>

        {/* Card 8: Warranty Years (Strictly from Warranty Policy Registry) */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-2.5 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">الضمان المعتمد</span>
          <div className="font-black text-xs text-emerald-900 dark:text-emerald-200 mt-1">
            {policyWarrantyYears} سنوات
          </div>
          <span className="text-[9px] font-mono text-emerald-600 truncate">{activePolicy?.name || 'Standard'}</span>
        </div>
      </div>
    </div>
  );
};
