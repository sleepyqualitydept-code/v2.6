import React, { useState } from 'react';
import { 
  Box, Maximize2, ArrowDownUp, Plus, Trash2, ChevronUp, ChevronDown, 
  Sparkles, RefreshCw, ZoomIn, ZoomOut, RotateCcw, Edit3, Settings,
  Layers, CheckCircle2, ShieldCheck, Scale, Cpu, Factory, Eye, LayoutGrid
} from 'lucide-react';
import { UnifiedCadMattressCrossSection } from './cad/UnifiedCadMattressCrossSection';
import { BaseLayerRenderer } from './cad/BaseLayerRenderer';
import { RealisticProductCadView } from './RealisticProductCadView';
import { MaterialMasterIntelligenceEngine } from '../../../services/materialMasterIntelligenceEngine';
import { CurrencyCode, CurrencyEngine } from '../../../services/currencyEngine';

interface BomCadWorkbenchProps {
  layers: any[];
  cadDisplayMode: 'crossSection' | 'exploded' | 'finishedProduct' | 'manufacturing';
  setCadDisplayMode: (mode: 'crossSection' | 'exploded' | 'finishedProduct' | 'manufacturing') => void;
  cadZoom: number;
  setCadZoom: React.Dispatch<React.SetStateAction<number>>;
  setIsCadModalOpen: (open: boolean) => void;
  selectedCadLayerId: string | null;
  setSelectedCadLayerId: (id: string | null) => void;
  designDimensions: string;
  designTargetHeight: number;
  designComfortLevel: string;
  designBrand: string;
  designModel: string;
  MATERIAL_DICTIONARY: Record<string, { nameAr: string; nameEn: string; defaultDensity: number; defaultCost: number; pattern: string }>;
  getMaterialVisualPattern: (materialName: string) => { bgClass: string; style: React.CSSProperties };
  formatBilingualMaterialName: (name: string) => string;
  addLayer: () => void;
  deleteLayer: (id: string) => void;
  moveLayer: (index: number, direction: 'up' | 'down') => void;
  updateLayerValue: (id: string, field: string, value: any) => void;
  editingLayerId: string | null;
  setEditingLayerId: (id: string | null) => void;
  materialMasterOptions: Record<string, string[]>;
  handleGenerateAiBOM: () => void;
  isAiLoading: boolean;
  aiHeight: number;
  setAiHeight: (h: number) => void;
  aiComfort: string;
  setAiComfort: (c: string) => void;
  aiBudget: string;
  setAiBudget: (b: string) => void;
  aiMarket: string;
  setAiMarket: (m: string) => void;
  aiReasoning: string;
  activeCurrency?: CurrencyCode;
  onSelectAssembly?: (assemblyType: 'top' | 'spring' | 'bottom' | 'border') => void;
}

export const BomCadWorkbench: React.FC<BomCadWorkbenchProps> = ({
  layers,
  cadDisplayMode,
  setCadDisplayMode,
  cadZoom,
  setCadZoom,
  setIsCadModalOpen,
  selectedCadLayerId,
  setSelectedCadLayerId,
  designDimensions,
  designTargetHeight,
  designComfortLevel,
  designBrand,
  designModel,
  MATERIAL_DICTIONARY,
  getMaterialVisualPattern,
  formatBilingualMaterialName,
  addLayer,
  deleteLayer,
  moveLayer,
  updateLayerValue,
  editingLayerId,
  setEditingLayerId,
  materialMasterOptions,
  handleGenerateAiBOM,
  isAiLoading,
  aiHeight,
  setAiHeight,
  aiComfort,
  setAiComfort,
  aiBudget,
  setAiBudget,
  aiMarket,
  setAiMarket,
  aiReasoning,
  activeCurrency = 'SAR',
  onSelectAssembly
}) => {
  const [showAiPanel, setShowAiPanel] = useState(false);
  // PART 5: Primary toggle between Product View (realistic assemblies) and Engineering View (detailed CAD cross-section)
  const [viewMode, setViewMode] = useState<'product' | 'engineering'>('product');

  const totalThick = layers.reduce((sum, l) => sum + Number(l.thickness || 0), 0) || 1;
  const totalMaterialsCost = layers.reduce((sum, l) => sum + Number(l.cost || 0), 0) || 1;

  const isSymmetrical = layers.length > 2 && (
    layers[0]?.material === layers[layers.length - 1]?.material ||
    layers[1]?.material === layers[layers.length - 2]?.material
  );

  return (
    <div className="w-full min-h-[950px] flex flex-col lg:flex-row gap-5 items-stretch animate-fade-in">
      
      {/* ========================================================================= */}
      {/* LEFT SIDE (75%): UNIFIED CAD DRAWING HERO SECTION                         */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-[75%] min-h-[950px] bg-surface border-2 border-blue-300/80 dark:border-blue-900 rounded-3xl p-5 shadow-md flex flex-col justify-between">
        
        {/* CAD Toolbar & Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-main pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Box size={20} />
            </div>
            <div>
              <h3 className="font-black text-xs text-[#0B2D5C] dark:text-blue-300 flex items-center gap-2">
                <span>بيئة المحاكي الهندسي CAD (Engineering & CAD Workbench)</span>
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-[10px] font-mono rounded-full font-black">
                  75% Hero View
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">
                القطاع الهندسي المعتمد • الأبعاد: {designDimensions} • الارتفاع الفعلي: {totalThick} سم • {CurrencyEngine.getCurrencyConfig(activeCurrency).symbolAr}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* PART 5: PRIMARY TOGGLE [ Product View ] / [ Engineering View ] */}
            <div className="bg-slate-200/80 dark:bg-slate-900 p-1 rounded-2xl flex items-center gap-1 text-xs font-black border border-border-main">
              <button
                type="button"
                onClick={() => setViewMode('product')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'product'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
                }`}
              >
                <Eye size={14} />
                <span>عرض المنتج (Product View)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('engineering')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'engineering'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
                }`}
              >
                <LayoutGrid size={14} />
                <span>عرض القطاع الهندسي (Engineering View)</span>
              </button>
            </div>

            {/* Sub-modes if Engineering View is selected */}
            {viewMode === 'engineering' && (
              <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex items-center gap-1 text-[11px] font-bold border border-border-main">
                <button
                  type="button"
                  onClick={() => setCadDisplayMode('crossSection')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${cadDisplayMode === 'crossSection' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-2xs font-black' : 'text-slate-500'}`}
                >
                  قطاع CAD
                </button>
                <button
                  type="button"
                  onClick={() => setCadDisplayMode('exploded')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${cadDisplayMode === 'exploded' ? 'bg-white dark:bg-slate-800 text-purple-600 shadow-2xs font-black' : 'text-slate-500'}`}
                >
                  تفكيك
                </button>
                <button
                  type="button"
                  onClick={() => setCadDisplayMode('finishedProduct')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${cadDisplayMode === 'finishedProduct' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-2xs font-black' : 'text-slate-500'}`}
                >
                  الأبعاد
                </button>
                <button
                  type="button"
                  onClick={() => setCadDisplayMode('manufacturing')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${cadDisplayMode === 'manufacturing' ? 'bg-white dark:bg-slate-800 text-amber-600 shadow-2xs font-black' : 'text-slate-500'}`}
                >
                  جدول المواد
                </button>
              </div>
            )}

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-border-main">
              <button
                type="button"
                onClick={() => setCadZoom(prev => Math.min(1.4, prev + 0.1))}
                className="p-1 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded cursor-pointer"
                title="تكبير"
              >
                <ZoomIn size={14} />
              </button>
              <button
                type="button"
                onClick={() => setCadZoom(prev => Math.max(0.7, prev - 0.1))}
                className="p-1 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded cursor-pointer"
                title="تصغير"
              >
                <ZoomOut size={14} />
              </button>
              <button
                type="button"
                onClick={() => setCadZoom(1)}
                className="p-1 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded cursor-pointer"
                title="إعادة ضبط"
              >
                <RotateCcw size={14} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsCadModalOpen(true)}
              className="p-2 bg-[#0B2D5C] hover:bg-[#13396a] text-white rounded-xl cursor-pointer shadow-2xs transition-all"
              title="تكبير للشاشة الكاملة"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        </div>

        {/* CAD VIEWPORT */}
        <div id="cad-drawing-viewport" className="my-3 flex-1 border-2 border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-950/5 dark:bg-slate-950 p-4 min-h-[760px] flex flex-col justify-between">
          
          {/* PRODUCT VIEW: REALISTIC 4-ASSEMBLY CUTAWAY */}
          {viewMode === 'product' && (
            <RealisticProductCadView
              layers={layers}
              designModel={designModel}
              designBrand={designBrand}
              designDimensions={designDimensions}
              totalThickness={totalThick}
              isSymmetrical={isSymmetrical}
              activeCurrency={activeCurrency}
              onSelectAssembly={onSelectAssembly}
            />
          )}

          {/* ENGINEERING VIEW: DETAILED TECHNICAL CAD CROSS SECTION */}
          {viewMode === 'engineering' && cadDisplayMode === 'crossSection' && (
            <UnifiedCadMattressCrossSection
              layers={layers}
              selectedCadLayerId={selectedCadLayerId}
              setSelectedCadLayerId={setSelectedCadLayerId}
              totalThickness={totalThick}
              totalMaterialsCost={totalMaterialsCost}
              zoom={cadZoom}
              displayMode={cadDisplayMode}
            />
          )}

          {/* EXPLODED VIEW */}
          {viewMode === 'engineering' && cadDisplayMode === 'exploded' && (
            <div className="w-full my-auto space-y-2.5 py-2 flex-1 flex flex-col justify-center">
              {layers.map((layer, idx) => (
                <BaseLayerRenderer
                  key={layer.id}
                  layer={layer}
                  index={idx}
                  totalLayers={layers.length}
                  totalThickness={totalThick}
                  totalMaterialsCost={totalMaterialsCost}
                  isSelected={selectedCadLayerId === layer.id}
                  onSelect={setSelectedCadLayerId}
                  displayMode="exploded"
                  zoom={cadZoom}
                />
              ))}
            </div>
          )}

          {/* FINISHED PRODUCT DIMENSIONS */}
          {viewMode === 'engineering' && cadDisplayMode === 'finishedProduct' && (
            <div className="w-full my-auto py-8 text-center space-y-6 flex-1 flex flex-col justify-center items-center">
              <div className="w-full max-w-xl bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-4 border-slate-300 dark:border-slate-700 rounded-3xl p-8 shadow-2xl space-y-5">
                <div className="w-20 h-20 mx-auto rounded-full bg-white/80 dark:bg-slate-800/80 border-2 border-blue-400 flex items-center justify-center text-blue-600 shadow-inner">
                  <Box size={40} />
                </div>
                <h4 className="font-black text-base text-slate-900 dark:text-white">المظهر النهائي لمرتبة {designModel}</h4>
                <div className="grid grid-cols-3 gap-3 text-xs font-bold pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="p-3 bg-white/80 dark:bg-slate-950 rounded-xl border">
                    <span className="text-[10px] text-slate-400 block">الأبعاد</span>
                    <span className="font-mono text-blue-600">{designDimensions}</span>
                  </div>
                  <div className="p-3 bg-white/80 dark:bg-slate-950 rounded-xl border">
                    <span className="text-[10px] text-slate-400 block">الارتفاع</span>
                    <span className="font-mono text-purple-600">{totalThick} سم</span>
                  </div>
                  <div className="p-3 bg-white/80 dark:bg-slate-950 rounded-xl border">
                    <span className="text-[10px] text-slate-400 block">الراحة</span>
                    <span className="text-emerald-600">{designComfortLevel}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MANUFACTURING BOM TABLE */}
          {viewMode === 'engineering' && cadDisplayMode === 'manufacturing' && (
            <div className="w-full my-auto overflow-x-auto space-y-3 flex-1 flex flex-col justify-center">
              <div className="bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black border-b">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">المادة الخام بالماستر</th>
                      <th className="p-3">الكود القياسي</th>
                      <th className="p-3 text-center">السمك</th>
                      <th className="p-3 text-center">الكثافة</th>
                      <th className="p-3">المورد المعتمد</th>
                      <th className="p-3 text-center">التكلفة ({CurrencyEngine.getCurrencyConfig(activeCurrency).symbolAr})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-medium text-slate-800 dark:text-slate-200">
                    {layers.map((layer, idx) => {
                      const matInfo = MaterialMasterIntelligenceEngine.getMaterial(layer.material);
                      const nameAr = matInfo?.nameAr || layer.material;
                      const nameEn = matInfo?.nameEn || layer.material;
                      const code = matInfo?.materialCode || `MAT-${layer.material.toUpperCase().slice(0, 8)}`;

                      return (
                        <tr key={layer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-3 font-mono font-bold text-slate-400">{idx + 1}</td>
                          <td className="p-3 font-black text-blue-600">{nameAr} ({nameEn})</td>
                          <td className="p-3 font-mono text-[10px] text-purple-700 dark:text-purple-300 font-bold">{code}</td>
                          <td className="p-3 text-center font-mono font-bold text-purple-600">{layer.thickness} سم</td>
                          <td className="p-3 text-center font-mono">{layer.density > 0 ? `${layer.density} kg/m³` : 'شاسيه سوست'}</td>
                          <td className="p-3 text-slate-500">{layer.supplier || matInfo?.supplier}</td>
                          <td className="p-3 text-center font-mono font-bold text-emerald-600">
                            {CurrencyEngine.format(layer.cost, activeCurrency)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Height Scale / Cumulative Ruler Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold bg-slate-50 dark:bg-slate-900 p-3.5 rounded-2xl border border-border-main shrink-0">
          <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-950 rounded-xl border">
            <span className="text-slate-400 text-[11px]">الارتفاع التراكمي الفعلي:</span>
            <span className="font-mono text-purple-600 font-black text-sm">{totalThick} سم</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-950 rounded-xl border">
            <span className="text-slate-400 text-[11px]">الارتفاع الإنشائي المطلوب:</span>
            <span className="font-mono text-slate-800 dark:text-slate-200 font-black text-sm">{designTargetHeight} سم</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-950 rounded-xl border">
            <span className="text-slate-400 text-[11px]">الفارق الإنشائي:</span>
            {(() => {
              const diff = totalThick - designTargetHeight;
              if (Math.abs(diff) < 0.1) {
                return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-black">0 سم (مطابق تماماً ✓)</span>;
              }
              return <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${diff > 0 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>{diff > 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`} سم</span>;
            })()}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* RIGHT SIDE (25%): UNIFIED LAYER DESIGNER PANEL (Full Properties Card)      */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-[25%] min-h-[950px] max-h-[950px] bg-surface border border-border-main rounded-3xl p-4 flex flex-col justify-between shadow-xs space-y-3">
        
        {/* Layer Designer Header & Actions */}
        <div className="flex items-center justify-between border-b pb-2.5 shrink-0">
          <div>
            <h3 className="font-black text-xs text-[#0B2D5C] dark:text-blue-300 flex items-center gap-1.5">
              <Layers size={15} />
              <span>مهندس الطبقات ({layers.length})</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Unified Layer Designer</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowAiPanel(!showAiPanel)}
              className="p-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-[10px] font-black cursor-pointer transition-all border border-purple-200 flex items-center gap-1"
              title="توليد مواصفات هندسية"
            >
              <Sparkles size={13} />
              <span>R&D</span>
            </button>
            <button
              type="button"
              onClick={addLayer}
              className="p-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-[10px] font-black cursor-pointer transition-all shadow-2xs flex items-center gap-1"
            >
              <Plus size={13} />
              <span>إضافة</span>
            </button>
          </div>
        </div>

        {/* AI Mini Drawer if toggled */}
        {showAiPanel && (
          <div className="p-3 bg-purple-500/10 border border-purple-200 dark:border-purple-900 rounded-2xl space-y-2 text-xs shrink-0 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="font-black text-[11px] text-purple-950 dark:text-purple-300 flex items-center gap-1">
                <Sparkles size={13} />
                توليد مواصفات ذكية
              </span>
              <button onClick={() => setShowAiPanel(false)} className="text-slate-400 text-xs cursor-pointer">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <label className="block text-slate-500 mb-0.5">الارتفاع (cm):</label>
                <input
                  type="number"
                  value={aiHeight}
                  onChange={(e) => setAiHeight(Number(e.target.value))}
                  className="w-full h-7 px-1.5 bg-white dark:bg-slate-950 border rounded-lg text-center font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-0.5">المستوى:</label>
                <select
                  value={aiComfort}
                  onChange={(e) => setAiComfort(e.target.value)}
                  className="w-full h-7 px-1 bg-white dark:bg-slate-950 border rounded-lg font-bold"
                >
                  <option value="Medium Firm">قاسي متوسط</option>
                  <option value="Soft">لين مريح</option>
                  <option value="Firm">طبي قاسي</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGenerateAiBOM}
              disabled={isAiLoading}
              className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-black flex items-center justify-center gap-1 cursor-pointer"
            >
              {isAiLoading ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
              <span>تطبيق التوصية</span>
            </button>
          </div>
        )}

        {/* UNIFIED SCROLLABLE LAYER CARDS WITH COMPLETE METADATA */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {layers.map((layer, idx) => {
            const isEditing = editingLayerId === layer.id;
            const matInfo = MaterialMasterIntelligenceEngine.getMaterial(layer.material);
            const nameAr = matInfo?.nameAr || layer.material;
            const nameEn = matInfo?.nameEn || layer.material;
            const code = matInfo?.materialCode || `MAT-${layer.material.toUpperCase().slice(0, 8)}`;
            
            const thM = (Number(layer.thickness) || 1) / 100;
            const densityVal = Number(layer.density) || matInfo?.density || 0;
            const layerWeightKg = densityVal > 0 
              ? (thM * 3.51 * densityVal) 
              : (layer.material.toLowerCase().includes('pocket') ? 18 : 20);

            return (
              <div 
                key={layer.id} 
                className={`p-3 bg-slate-50/90 dark:bg-slate-900/80 border rounded-2xl transition-all ${
                  selectedCadLayerId === layer.id ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/20' : (isEditing ? 'border-purple-500 ring-1 ring-purple-500/20' : 'border-border-main hover:border-slate-300')
                }`}
                onClick={() => setSelectedCadLayerId(layer.id)}
              >
                {/* UNIFIED COMPACT CARD HEADER */}
                <div className="flex items-start justify-between gap-1 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-white font-black bg-[#0B2D5C] px-1.5 py-0.5 rounded-md text-[10px]">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="font-black text-slate-900 dark:text-white text-xs block leading-tight">
                          {nameAr}
                        </span>
                        <span className="text-[9px] font-mono text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-1 py-0.2 rounded border border-blue-200">
                          {code}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium mt-0.5">
                        {nameEn}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); moveLayer(idx, 'up'); }}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                    >
                      <ChevronUp size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); moveLayer(idx, 'down'); }}
                      disabled={idx === layers.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                    >
                      <ChevronDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setEditingLayerId(isEditing ? null : layer.id); }}
                      className="p-1 text-slate-500 hover:bg-slate-200 rounded cursor-pointer"
                      title="تعديل"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* 7 STANDARD SPECIFICATION BADGES */}
                <div className="grid grid-cols-4 gap-1 text-[9px] font-mono font-bold mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 p-1 rounded text-center">
                    {layer.thickness} cm
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 p-1 rounded text-center">
                    {densityVal > 0 ? `${densityVal}D` : 'Spring'}
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 p-1 rounded text-center">
                    {layerWeightKg.toFixed(1)}kg
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 p-1 rounded text-center">
                    {CurrencyEngine.format(layer.cost, activeCurrency)}
                  </div>
                </div>

                {/* Engineering Notes & Supplier */}
                <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center justify-between">
                  <span className="truncate max-w-[140px]">{layer.notes || matInfo?.specNotesAr || 'طبقة قياسية'}</span>
                  <span className="font-mono text-slate-400">{layer.supplier || 'Sleepee'}</span>
                </div>

                {/* EXPANDED INLINE EDIT FORM */}
                {isEditing && (
                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2 text-[10px] font-bold animate-fade-in" onClick={(e) => e.stopPropagation()}>
                    <div>
                      <label className="block text-slate-400 mb-0.5">المادة الخام:</label>
                      <select
                        value={layer.material}
                        onChange={(e) => updateLayerValue(layer.id, 'material', e.target.value)}
                        className="w-full h-7 px-1.5 bg-white dark:bg-slate-950 border rounded-lg font-bold text-blue-600"
                      >
                        {Object.entries(materialMasterOptions).map(([cat, opts]) => (
                          <optgroup key={cat} label={cat}>
                            {opts.map(o => <option key={o} value={o}>{o}</option>)}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-1">
                      <div>
                        <label className="block text-slate-400 mb-0.5">السمك (cm):</label>
                        <input
                          type="number"
                          value={layer.thickness}
                          onChange={(e) => updateLayerValue(layer.id, 'thickness', Number(e.target.value))}
                          className="w-full h-6 px-1 text-center font-bold bg-white dark:bg-slate-950 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-0.5">الكثافة (D):</label>
                        <input
                          type="number"
                          value={layer.density}
                          onChange={(e) => updateLayerValue(layer.id, 'density', Number(e.target.value))}
                          className="w-full h-6 px-1 text-center font-bold bg-white dark:bg-slate-950 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-0.5">التكلفة ({CurrencyEngine.getCurrencyConfig(activeCurrency).symbolAr}):</label>
                        <input
                          type="number"
                          value={layer.cost}
                          onChange={(e) => updateLayerValue(layer.id, 'cost', Number(e.target.value))}
                          className="w-full h-6 px-1 text-center font-bold bg-white dark:bg-slate-950 border rounded text-emerald-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-0.5">الملاحظات والمواصفة الهندسية:</label>
                      <input
                        type="text"
                        value={layer.notes || ''}
                        onChange={(e) => updateLayerValue(layer.id, 'notes', e.target.value)}
                        className="w-full h-6 px-1.5 bg-white dark:bg-slate-950 border rounded"
                        placeholder="خصائص الطبقة..."
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info in Layer Panel */}
        <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl border text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between shrink-0">
          <span>إجمالي الطبقات: <span className="font-mono text-blue-600 font-black">{layers.length}</span></span>
          <span className="text-emerald-600 font-mono font-black">{CurrencyEngine.format(totalMaterialsCost, activeCurrency)}</span>
        </div>

      </div>

    </div>
  );
};
