import React, { useState, useMemo } from 'react';
import { 
  Box, Eye, Layers, Maximize2, X, ZoomIn, ZoomOut, RotateCcw, 
  ArrowLeftRight, ShieldCheck, Scale, Sparkles, Sliders, Info, CheckCircle2, ChevronRight
} from 'lucide-react';
import { CurrencyCode } from '../../../services/currencyEngine';
import { RealisticProductCadView } from '../bom/RealisticProductCadView';

interface PepStep4EngineeringCadProps {
  layers: any[];
  designDimensions: string;
  designTargetHeight: number;
  designComfortLevel: string;
  designBrand: string;
  designModel: string;
  activeCurrency: CurrencyCode;
  isDoubleSided: boolean;
  onOpenDrawerLayer?: (layer: any) => void;
  onCompleteStep: () => void;
}

export const PepStep4EngineeringCad: React.FC<PepStep4EngineeringCadProps> = ({
  layers,
  designDimensions,
  designTargetHeight,
  designComfortLevel,
  designBrand,
  designModel,
  activeCurrency,
  isDoubleSided,
  onOpenDrawerLayer,
  onCompleteStep
}) => {
  const [activeCadTab, setActiveCadTab] = useState<'CAD_CROSS_SECTION' | 'REALISTIC_3D' | 'SPLIT_VIEW'>('SPLIT_VIEW');
  const [cadZoom, setCadZoom] = useState<number>(1);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const totalCalculatedHeight = layers.reduce((sum, l) => sum + (Number(l.thickness) || 0), 0);
  const totalBomCost = layers.reduce((sum, l) => sum + (Number(l.cost) || 0), 0) || 1;

  // Enrich layer metadata for CAD rendering
  const enrichedCadLayers = useMemo(() => {
    return layers.map((l, idx) => {
      const mat = (l.material || '').toLowerCase();
      let layerFunction = 'Comfort Cushioning';
      if (mat.includes('fabric') || mat.includes('قماش')) layerFunction = 'Top Quilted Fabric';
      else if (mat.includes('fiber') || mat.includes('فايبر')) layerFunction = 'Loft Fiber Layer';
      else if (mat.includes('memory') || mat.includes('ميموري')) layerFunction = 'Visco Memory Foam';
      else if (mat.includes('latex') || mat.includes('لاتكس')) layerFunction = 'Latex Ergonomic Core';
      else if (mat.includes('felt') || mat.includes('لباد')) layerFunction = 'Insulator Felt Pad';
      else if (mat.includes('spring') || mat.includes('سوست')) layerFunction = 'Pocket Spring Steel Core';
      else if (mat.includes('border') || mat.includes('شريط')) layerFunction = 'Perimeter Border';
      else if (idx === layers.length - 1) layerFunction = 'Base Foundation Foam';

      return {
        ...l,
        layerNumber: idx + 1,
        layerFunction
      };
    });
  }, [layers]);

  return (
    <div className="space-y-6 text-right font-sans">
      
      {/* Top Banner */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-border-main flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B2D5C] text-white flex items-center justify-center font-bold shadow-xs">
            <Box size={20} />
          </div>
          <div>
            <h3 className="font-black text-sm text-[#0B2D5C] dark:text-blue-300">
              الرسم الهندسي والمحاكاة الصناعية (Engineering CAD)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              واجهة هندسية موحدة تجمع بين المقطع العرضي CAD والمحاكاة ثلاثية الأبعاد الواقعية Realistic Preview في لوحة واحدة.
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-surface dark:bg-slate-800 p-1.5 rounded-xl border border-border-main">
          <button
            type="button"
            onClick={() => setActiveCadTab('SPLIT_VIEW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeCadTab === 'SPLIT_VIEW' 
                ? 'bg-[#0B2D5C] text-white shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            عرض موحد مدمج (Split View)
          </button>

          <button
            type="button"
            onClick={() => setActiveCadTab('CAD_CROSS_SECTION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeCadTab === 'CAD_CROSS_SECTION' 
                ? 'bg-[#0B2D5C] text-white shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            مقطع الطبقات (CAD View)
          </button>

          <button
            type="button"
            onClick={() => setActiveCadTab('REALISTIC_3D')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeCadTab === 'REALISTIC_3D' 
                ? 'bg-[#0B2D5C] text-white shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            المجسم الواقعي (Realistic 3D)
          </button>
        </div>
      </div>

      {/* Engineering Spec Indicators Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-surface rounded-xl border border-border-main">
          <span className="text-[10px] text-slate-400 font-bold block">الأبعاد المعتمدة:</span>
          <span className="font-mono text-xs font-black text-slate-800 dark:text-slate-200">{designDimensions}</span>
        </div>

        <div className="p-3 bg-surface rounded-xl border border-border-main">
          <span className="text-[10px] text-slate-400 font-bold block">الارتفاع الإجمالي للطبقات:</span>
          <span className="font-mono text-xs font-black text-blue-600">{totalCalculatedHeight.toFixed(1)} سم (هدف {designTargetHeight} سم)</span>
        </div>

        <div className="p-3 bg-surface rounded-xl border border-border-main">
          <span className="text-[10px] text-slate-400 font-bold block">إجمالي عدد الطبقات:</span>
          <span className="font-mono text-xs font-black text-emerald-600">{layers.length} طبقات هندسية</span>
        </div>

        <div className="p-3 bg-surface rounded-xl border border-border-main">
          <span className="text-[10px] text-slate-400 font-bold block">درجة الراحة والقساوة:</span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate block">{designComfortLevel}</span>
        </div>
      </div>

      {/* Main Unified Workbench View */}
      <div className={`grid gap-4 ${
        activeCadTab === 'SPLIT_VIEW' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
      }`}>

        {/* 1. CAD 2D Layer Cross-Section */}
        {(activeCadTab === 'SPLIT_VIEW' || activeCadTab === 'CAD_CROSS_SECTION') && (
          <div className="bg-surface rounded-2xl border border-border-main p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border-main pb-2">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-blue-600" />
                <h4 className="font-black text-xs text-[#0B2D5C] dark:text-blue-300">
                  المقطع العرضي للطبقات (CAD Cross-Section)
                </h4>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCadZoom(prev => Math.min(prev + 0.1, 1.4))}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 cursor-pointer"
                  title="تكبير"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setCadZoom(prev => Math.max(prev - 0.1, 0.7))}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 cursor-pointer"
                  title="تصغير"
                >
                  <ZoomOut size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setCadZoom(1)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 cursor-pointer"
                  title="إعادة تعيين"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* CAD Stack Container */}
            <div 
              style={{ transform: `scale(${cadZoom})`, transformOrigin: 'top center' }}
              className="space-y-1.5 p-3 bg-slate-900 rounded-xl transition-transform overflow-y-auto max-h-[380px] custom-scrollbar"
            >
              {enrichedCadLayers.map((l) => {
                const isSelected = selectedLayerId === l.id;
                let bgGradient = 'from-slate-700 to-slate-800 text-white';
                if (l.category === 'Fabric') bgGradient = 'from-indigo-600 to-indigo-800 text-white';
                else if (l.category === 'Fiber') bgGradient = 'from-sky-600 to-sky-700 text-white';
                else if (l.category === 'Foam' && l.material?.includes('Memory')) bgGradient = 'from-purple-600 to-purple-800 text-white';
                else if (l.category === 'Foam') bgGradient = 'from-amber-600 to-amber-700 text-white';
                else if (l.category === 'Spring') bgGradient = 'from-slate-600 to-slate-700 text-white border-2 border-dashed border-slate-400';
                else if (l.category === 'Felt') bgGradient = 'from-stone-600 to-stone-700 text-white';

                return (
                  <div
                    key={l.id}
                    onClick={() => {
                      setSelectedLayerId(l.id);
                      if (onOpenDrawerLayer) onOpenDrawerLayer(l);
                    }}
                    style={{ minHeight: `${Math.max(26, (Number(l.thickness) || 1) * 7)}px` }}
                    className={`bg-gradient-to-r ${bgGradient} px-3 py-1.5 rounded-lg flex items-center justify-between text-[11px] cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-yellow-400 shadow-md scale-[1.01]' : 'hover:opacity-95'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] bg-black/30 px-1.5 py-0.5 rounded font-bold">
                        #{l.layerNumber}
                      </span>
                      <span className="font-bold truncate max-w-[200px]">{l.material}</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span>{l.thickness} سم</span>
                      <span className="text-white/60">•</span>
                      <span>D{l.density || 0}</span>
                      <span className="text-white/60">•</span>
                      <span className="text-emerald-300 font-bold">{l.cost} {activeCurrency}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
              <span>* انقر على أي طبقة لفتح بطاقة المواصفات الفنية التفصيلية</span>
              <span>Total Thickness: {totalCalculatedHeight.toFixed(1)} cm</span>
            </div>
          </div>
        )}

        {/* 2. Realistic 3D Preview (RealisticProductCadView) */}
        {(activeCadTab === 'SPLIT_VIEW' || activeCadTab === 'REALISTIC_3D') && (
          <div className="bg-surface rounded-2xl border border-border-main p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border-main pb-2">
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-emerald-600" />
                <h4 className="font-black text-xs text-[#0B2D5C] dark:text-blue-300">
                  المجسم الواقعي ثلاثي الأبعاد (Realistic 3D Preview)
                </h4>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Live 3D Render
              </span>
            </div>

            <div className="rounded-xl overflow-hidden min-h-[350px] flex items-center justify-center bg-slate-900/5 dark:bg-slate-950/60 p-2">
              <RealisticProductCadView
                layers={layers}
                targetHeight={designTargetHeight}
                modelName={designModel}
                brandName={designBrand}
                isDoubleSided={isDoubleSided}
              />
            </div>
          </div>
        )}

      </div>

      {/* Step Actions: Next Step */}
      <div className="flex items-center justify-between pt-2 border-t border-border-main">
        <span className="text-[11px] text-slate-400">
          تمت محاكاة الهيكل والأبعاد بدون إدخال طبقات يدوي، ومطابقة مع بطاقة BOM الرسمية.
        </span>

        <button
          type="button"
          onClick={onCompleteStep}
          className="px-6 py-2.5 bg-[#0B2D5C] hover:bg-[#133763] text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center gap-2 transition-all"
        >
          <span>حفظ والتقدم إلى الخطوة 5: هندسة التكاليف وحزمة الامتثال (Cost & Compliance)</span>
          <ChevronRight size={15} className="rtl:rotate-180" />
        </button>
      </div>

    </div>
  );
};
