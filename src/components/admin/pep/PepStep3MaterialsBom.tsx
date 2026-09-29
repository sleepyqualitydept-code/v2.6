import React, { useState, useMemo } from 'react';
import { 
  Package, Plus, Trash2, Edit3, CheckCircle2, ChevronRight, 
  Search, Sliders, DollarSign, Layers, ArrowUpDown, Filter, Sparkles, TrendingDown, RefreshCw, X
} from 'lucide-react';
import { CurrencyCode, CurrencyEngine } from '../../../services/currencyEngine';
import { MaterialMasterIntelligenceEngine } from '../../../services/materialMasterIntelligenceEngine';
import { PepYieldEngine } from '../../../services/pepYieldEngine';
import { PepScrapEngine } from '../../../services/pepScrapEngine';

interface PepStep3MaterialsBomProps {
  layers: any[];
  activeCurrency: CurrencyCode;
  addLayer: () => void;
  deleteLayer: (id: string) => void;
  updateLayerValue: (id: string, field: string, value: any) => void;
  onCompleteStep: () => void;
  materialMasterOptions: any[];
}

export const PepStep3MaterialsBom: React.FC<PepStep3MaterialsBomProps> = ({
  layers,
  activeCurrency,
  addLayer,
  deleteLayer,
  updateLayerValue,
  onCompleteStep,
  materialMasterOptions
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddPickerOpen, setIsAddPickerOpen] = useState<boolean>(false);
  const [pickerSearch, setPickerSearch] = useState<string>('');

  // Compute Yield Analysis via PepYieldEngine
  const yieldSummary = useMemo(() => {
    return PepYieldEngine.calculateYield(layers);
  }, [layers]);

  // Compute total BOM extended cost
  const totalBomCost = useMemo(() => {
    return layers.reduce((sum, l) => sum + (Number(l.cost) || 0), 0) || 1;
  }, [layers]);

  // Compute Scrap Analysis via PepScrapEngine
  const scrapReport = useMemo(() => {
    return PepScrapEngine.calculateScrapAnalysis({
      directMaterialCost: totalBomCost,
      directLaborCost: 45,
      machineCost: 20,
      targetHeight: 25
    });
  }, [totalBomCost]);

  // DYNAMIC CATEGORY SUMMARY (Foam, Fabric, Fiber, Felt, Spring, Accessories, Packaging, etc.)
  const dynamicCategoriesSummary = useMemo(() => {
    const defaultCategories = ['Foam', 'Fabric', 'Fiber', 'Felt', 'Spring', 'Accessories', 'Packaging'];
    const summaryMap: Record<string, { count: number; cost: number; items: string[] }> = {};

    defaultCategories.forEach(cat => {
      summaryMap[cat] = { count: 0, cost: 0, items: [] };
    });

    layers.forEach(layer => {
      let rawCat = layer.category || layer.layerType || 'Foam';
      const cleanCat = defaultCategories.find(c => c.toLowerCase() === rawCat.toLowerCase()) || rawCat;
      if (!summaryMap[cleanCat]) {
        summaryMap[cleanCat] = { count: 0, cost: 0, items: [] };
      }
      summaryMap[cleanCat].count += 1;
      summaryMap[cleanCat].cost += Number(layer.cost) || 0;
      if (!summaryMap[cleanCat].items.includes(layer.material)) {
        summaryMap[cleanCat].items.push(layer.material);
      }
    });

    return summaryMap;
  }, [layers]);

  // Dynamic list of active categories
  const activeCategoryKeys = Object.keys(dynamicCategoriesSummary).filter(
    k => dynamicCategoriesSummary[k].count > 0 || ['Foam', 'Fabric', 'Fiber', 'Felt', 'Spring'].includes(k)
  );

  // Assign Assembly Link dynamically based on position / name
  const getAssemblyLink = (layer: any, idx: number): string => {
    const mat = (layer.material || '').toLowerCase();
    const cat = (layer.category || '').toLowerCase();
    if (mat.includes('border') || mat.includes('شريط') || mat.includes('داير') || cat.includes('border')) return 'Border Assembly';
    if (mat.includes('spring') || mat.includes('سوست') || mat.includes('شاسيه') || mat.includes('felt') || mat.includes('لباد')) return 'Spring Assembly';
    if (idx < Math.floor(layers.length / 2)) return 'Top Assembly';
    return 'Bottom Assembly';
  };

  const filteredLayers = layers.filter((layer) => {
    const matchCat = filterCategory === 'All' || layer.category === filterCategory || layer.layerType === filterCategory;
    const matchSearch = !searchQuery || 
      layer.material?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      layer.materialCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      layer.supplier?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredMasterOptions = materialMasterOptions.filter(m => {
    if (!pickerSearch) return true;
    return m.nameAr?.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      m.nameEn?.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      m.code?.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      m.category?.toLowerCase().includes(pickerSearch.toLowerCase());
  });

  const handleSelectMasterMaterial = (mat: any) => {
    const nextId = `L${layers.length + 1}`;
    const newLayer = {
      id: nextId,
      material: mat.nameAr || mat.name,
      materialEn: mat.nameEn || mat.name,
      materialCode: mat.code,
      category: mat.category || 'Foam',
      layerType: mat.category || 'Comfort',
      thickness: mat.density ? 2.5 : 1,
      density: mat.density || 0,
      weight: 1.2,
      cost: mat.manufacturingCost || mat.purchaseCost || 45,
      supplier: mat.supplier || 'المورد المعتمد',
      uom: mat.category?.toLowerCase().includes('fabric') ? 'm²' : 'cm',
      yieldPercentage: mat.category?.toLowerCase().includes('fabric') ? 92 : 96,
      scrapPercentage: mat.category?.toLowerCase().includes('fabric') ? 4.5 : 2.5,
      status: 'Active'
    };
    updateLayerValue(newLayer.id, 'new', newLayer);
    addLayer();
    setIsAddPickerOpen(false);
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Banner & Main Actions */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-border-main flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0B2D5C] text-white flex items-center justify-center font-bold">
            <Package size={18} />
          </div>
          <div>
            <h3 className="font-black text-sm text-[#0B2D5C] dark:text-blue-300">
              سجل قوائم المواد والمدخلات الرئيسي (BOM Master Rebuild)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              المصدر المركزي الوحيد للخامات (Single Source of Truth) مشتق مباشرة من Material Master Registry مع محركات العائد والهالك (Yield & Scrap).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsAddPickerOpen(true)}
            className="px-4 py-2 bg-[#0B2D5C] hover:bg-[#133763] text-white rounded-xl text-xs font-black shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <Plus size={14} />
            <span>إضافة من مكتبة الخامات (Material Master)</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC CATEGORY SUMMARY (Requirement 6: Foam, Fabric, Fiber, Felt, Spring, Accessories, Packaging) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-[#0B2D5C] dark:text-blue-300">
            ملخص فئات الخامات الديناميكي (Dynamic Category Summary):
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {layers.length} بنود مسجلة • إجمالي التكلفة: {CurrencyEngine.formatAmount(totalBomCost, activeCurrency)}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {activeCategoryKeys.map((catKey) => {
            const grp = dynamicCategoriesSummary[catKey] || { count: 0, cost: 0 };
            const pct = Math.round((grp.cost / totalBomCost) * 100);
            const isSelected = filterCategory === catKey;

            return (
              <div 
                key={catKey}
                onClick={() => setFilterCategory(isSelected ? 'All' : catKey)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B2D5C] text-white border-[#0B2D5C] shadow-md font-bold'
                    : 'bg-surface hover:bg-slate-50 dark:hover:bg-slate-900 border-border-main text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-black truncate">{catKey}</span>
                  <span className={`px-1.5 py-0.2 rounded font-mono text-[10px] ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {grp.count}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span>{CurrencyEngine.formatAmount(grp.cost, activeCurrency)}</span>
                  <span className={isSelected ? 'text-emerald-300 font-bold' : 'text-emerald-600 font-bold'}>
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* YIELD & SCRAP SUMMARY STRIP (Requirement 7 & 8) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Yield Engine Metric Card */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border-main space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-border-main pb-2">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-emerald-600" />
              <span className="font-black text-[#0B2D5C] dark:text-blue-300">
                محرك كفاءة الاستهلاك (Yield Engine Analysis):
              </span>
            </div>
            <span className="font-mono text-emerald-600 font-black">
              معدل العائد العام: {yieldSummary.overallYieldPercentage}%
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">التكلفة النظرية:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {CurrencyEngine.formatAmount(yieldSummary.totalTheoreticalCost, activeCurrency)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">التكلفة الفعلية (+الهدر):</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {CurrencyEngine.formatAmount(yieldSummary.totalActualCost, activeCurrency)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">فروق الاستهلاك (Loss):</span>
              <span className="font-bold text-rose-600">
                {CurrencyEngine.formatAmount(yieldSummary.netYieldLossCost, activeCurrency)}
              </span>
            </div>
          </div>
        </div>

        {/* Scrap Engine Metric Card */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border-main space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-border-main pb-2">
            <div className="flex items-center gap-2">
              <TrendingDown size={14} className="text-amber-600" />
              <span className="font-black text-[#0B2D5C] dark:text-blue-300">
                محرك الهالك الصناعي (Scrap & Reject Engine):
              </span>
            </div>
            <span className="font-mono text-amber-600 font-black">
              أثر الهالك الكلي: {scrapReport.overallScrapImpactPercentage}%
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">تكلفة الهالك الإجمالي:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {CurrencyEngine.formatAmount(scrapReport.totalWasteCost, activeCurrency)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">قيمة التدوير المسترد:</span>
              <span className="font-bold text-emerald-600">
                {CurrencyEngine.formatAmount(scrapReport.totalRecoveryCost, activeCurrency)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">صافي خسارة الهالك:</span>
              <span className="font-bold text-amber-600">
                {CurrencyEngine.formatAmount(scrapReport.totalNetLossCost, activeCurrency)}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-3 rounded-2xl border border-border-main text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-sm bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-border-main">
          <Search size={14} className="text-slate-400" />
          <input
            type="text"
            placeholder="بحث بالكود، اسم المادة، أو المورد..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs font-bold outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400">تصفية الفئة:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-8 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold text-xs outline-none cursor-pointer"
          >
            <option value="All">كافة الفئات ({layers.length})</option>
            {activeCategoryKeys.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* SINGLE SOURCE OF TRUTH: Enterprise BOM Master Table (Requirement 6) */}
      <div className="bg-surface rounded-2xl border border-border-main overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-black border-b border-border-main text-[11px]">
                <th className="py-3 px-2">#</th>
                <th className="py-3 px-2">كود المادة</th>
                <th className="py-3 px-2">اسم وتوصيف المادة</th>
                <th className="py-3 px-2">الفئة</th>
                <th className="py-3 px-2">المجموعة</th>
                <th className="py-3 px-2">المورد</th>
                <th className="py-3 px-2">الوحدة</th>
                <th className="py-3 px-2">الاستهلاك النظري</th>
                <th className="py-3 px-2">العائد %</th>
                <th className="py-3 px-2">الاستهلاك الفعلي</th>
                <th className="py-3 px-2">سعر الوحدة</th>
                <th className="py-3 px-2">إجمالي التكلفة</th>
                <th className="py-3 px-2">الهالك %</th>
                <th className="py-3 px-2">% المساهمة</th>
                <th className="py-3 px-2 text-center">الحالة</th>
                <th className="py-3 px-2 text-center">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main font-medium">
              {filteredLayers.map((layer, idx) => {
                const layerCost = Number(layer.cost) || 0;
                const costContribution = Math.round((layerCost / totalBomCost) * 100);
                const assLink = getAssemblyLink(layer, idx);

                // Yield calculations
                const theoretical = Number(layer.thickness) || 1;
                const yieldPct = layer.yieldPercentage || (layer.category?.toLowerCase().includes('fabric') ? 92 : 96);
                const actual = Math.round((theoretical / (yieldPct / 100)) * 100) / 100;
                const unitCost = layerCost / (theoretical || 1);
                const scrapPct = layer.scrapPercentage || 3.0;

                return (
                  <tr key={layer.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all">
                    
                    {/* Index */}
                    <td className="py-2.5 px-2 font-mono font-bold text-slate-400">
                      {idx + 1}
                    </td>

                    {/* Material Code */}
                    <td className="py-2.5 px-2 font-mono font-bold text-slate-900 dark:text-white">
                      <input
                        type="text"
                        value={layer.materialCode || `RAW-${idx + 101}`}
                        onChange={(e) => updateLayerValue(layer.id, 'materialCode', e.target.value)}
                        className="w-24 px-1.5 py-0.5 bg-slate-50 dark:bg-slate-950 border border-border-main rounded text-xs font-mono font-bold outline-none"
                      />
                    </td>

                    {/* Description */}
                    <td className="py-2.5 px-2 font-bold text-slate-900 dark:text-white">
                      <input
                        type="text"
                        value={layer.material}
                        onChange={(e) => updateLayerValue(layer.id, 'material', e.target.value)}
                        className="w-44 px-2 py-0.5 bg-slate-50 dark:bg-slate-950 border border-border-main rounded text-xs font-bold outline-none"
                      />
                    </td>

                    {/* Category */}
                    <td className="py-2.5 px-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {layer.category || layer.layerType || 'Foam'}
                      </span>
                    </td>

                    {/* Assembly Link */}
                    <td className="py-2.5 px-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                        {assLink}
                      </span>
                    </td>

                    {/* Supplier */}
                    <td className="py-2.5 px-2 text-slate-500 truncate max-w-[110px]">
                      <input
                        type="text"
                        value={layer.supplier || 'المورد المعتمد'}
                        onChange={(e) => updateLayerValue(layer.id, 'supplier', e.target.value)}
                        className="w-24 px-1 py-0.5 bg-slate-50 dark:bg-slate-950 border border-border-main rounded text-xs outline-none"
                      />
                    </td>

                    {/* UOM */}
                    <td className="py-2.5 px-2 font-mono text-slate-500">
                      {layer.uom || (layer.category?.toLowerCase().includes('fabric') ? 'm²' : 'cm')}
                    </td>

                    {/* Theoretical Consumption */}
                    <td className="py-2.5 px-2 font-mono">
                      <input
                        type="number"
                        value={layer.thickness}
                        onChange={(e) => updateLayerValue(layer.id, 'thickness', Number(e.target.value))}
                        className="w-14 px-1 py-0.5 bg-slate-50 dark:bg-slate-950 border border-border-main rounded text-xs font-mono font-bold outline-none"
                      />
                    </td>

                    {/* Yield % (Requirement 7) */}
                    <td className="py-2.5 px-2 font-mono">
                      <div className="flex items-center gap-0.5">
                        <input
                          type="number"
                          value={yieldPct}
                          onChange={(e) => updateLayerValue(layer.id, 'yieldPercentage', Number(e.target.value))}
                          className="w-12 px-1 py-0.5 bg-slate-50 dark:bg-slate-950 border border-border-main rounded text-xs font-mono font-bold text-emerald-600 outline-none"
                        />
                        <span className="text-[10px] text-slate-400">%</span>
                      </div>
                    </td>

                    {/* Actual Consumption (Formula: Theoretical / Yield %) */}
                    <td className="py-2.5 px-2 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {actual}
                    </td>

                    {/* Unit Cost */}
                    <td className="py-2.5 px-2 font-mono text-slate-600 dark:text-slate-300">
                      {CurrencyEngine.formatAmount(unitCost, activeCurrency)}
                    </td>

                    {/* Extended Cost */}
                    <td className="py-2.5 px-2 font-mono font-black text-[#0B2D5C] dark:text-blue-300">
                      <input
                        type="number"
                        value={layer.cost}
                        onChange={(e) => updateLayerValue(layer.id, 'cost', Number(e.target.value))}
                        className="w-18 px-1.5 py-0.5 bg-slate-50 dark:bg-slate-950 border border-border-main rounded text-xs font-mono font-black outline-none"
                      />
                    </td>

                    {/* Scrap % (Requirement 8) */}
                    <td className="py-2.5 px-2 font-mono">
                      <div className="flex items-center gap-0.5">
                        <input
                          type="number"
                          value={scrapPct}
                          onChange={(e) => updateLayerValue(layer.id, 'scrapPercentage', Number(e.target.value))}
                          className="w-12 px-1 py-0.5 bg-slate-50 dark:bg-slate-950 border border-border-main rounded text-xs font-mono text-amber-600 outline-none"
                        />
                        <span className="text-[10px] text-slate-400">%</span>
                      </div>
                    </td>

                    {/* Contribution % */}
                    <td className="py-2.5 px-2 font-mono font-bold text-emerald-600">
                      {costContribution}%
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-2 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300">
                        Active
                      </span>
                    </td>

                    {/* Delete */}
                    <td className="py-2.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => deleteLayer(layer.id)}
                        className="w-6 h-6 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center justify-center cursor-pointer transition-all mx-auto"
                        title="حذف البند"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 dark:bg-slate-900/90 font-black border-t-2 border-border-main text-xs">
                <td colSpan={7} className="py-3 px-3 text-left font-black text-slate-900 dark:text-white">
                  إجمالي تكلفة الخامات المباشرة (Direct BOM Cost):
                </td>
                <td className="py-3 px-2 font-mono font-bold">
                  {layers.reduce((sum, l) => sum + (Number(l.thickness) || 0), 0)} سم
                </td>
                <td colSpan={3} className="py-3 px-2 text-[10px] text-slate-400">
                  شامل فروق الاستهلاك الفعلي
                </td>
                <td className="py-3 px-2 font-mono font-black text-emerald-600 text-sm">
                  {CurrencyEngine.formatAmount(totalBomCost, activeCurrency)}
                </td>
                <td className="py-3 px-2 text-[10px] text-amber-600 font-mono">
                  +{CurrencyEngine.formatAmount(scrapReport.totalNetLossCost, activeCurrency)} هالك
                </td>
                <td className="py-3 px-2 font-mono font-bold">100%</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* MATERIAL MASTER SELECTION MODAL */}
      {isAddPickerOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in text-right">
          <div className="bg-surface border border-border-main rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between px-6 py-4 bg-[#0B2D5C] text-white">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-amber-400" />
                <h3 className="text-sm font-black">مكتبة سجل الخامات المعتمدة (Material Master Registry)</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAddPickerOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-border-main">
              <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-xl border border-border-main text-xs">
                <Search size={14} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="بحث في سجل الخامات بالكود، الاسم، أو الفئة..."
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  className="w-full bg-transparent font-bold outline-none"
                />
              </div>
            </div>

            <div className="p-4 overflow-y-auto space-y-2 flex-1 text-xs">
              {filteredMasterOptions.slice(0, 15).map((mat) => (
                <div
                  key={mat.code}
                  onClick={() => handleSelectMasterMaterial(mat)}
                  className="p-3 bg-surface hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl border border-border-main flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {mat.code}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {mat.nameAr}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {mat.nameEn} • {mat.category} • المورد: {mat.supplier}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-emerald-600">
                      {CurrencyEngine.formatAmount(mat.manufacturingCost || mat.purchaseCost || 45, activeCurrency)}
                    </span>
                    <button
                      type="button"
                      className="px-3 py-1 bg-[#0B2D5C] text-white rounded-lg text-xs font-bold"
                    >
                      إدراج
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900 border-t border-border-main flex justify-end">
              <button
                type="button"
                onClick={() => setIsAddPickerOpen(false)}
                className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border-main">
        <span className="text-[11px] text-slate-400">
          تم تحديث سجل BOM ومحركات العائد والهالك بدقة صناعية متكاملة.
        </span>

        <button
          type="button"
          onClick={onCompleteStep}
          className="px-6 py-2.5 bg-[#0B2D5C] hover:bg-[#133763] text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center gap-2 transition-all"
        >
          <span>حفظ والتقدم إلى الخطوة 4: مسار العمليات والماكينات (Routing Master)</span>
          <ChevronRight size={15} className="rtl:rotate-180" />
        </button>
      </div>

    </div>
  );
};
