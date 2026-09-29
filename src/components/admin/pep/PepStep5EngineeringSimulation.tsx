import React, { useState, useMemo } from 'react';
import { 
  Box, Eye, Layers, Maximize2, X, ZoomIn, ZoomOut, RotateCcw, 
  ChevronRight, ArrowLeftRight, ShieldCheck, Scale, Sparkles, 
  HelpCircle, Sliders, Info, CheckCircle2, ChevronUp, ChevronDown, Search, Filter, FolderTree
} from 'lucide-react';
import { CurrencyCode, CurrencyEngine } from '../../../services/currencyEngine';
import { RealisticProductCadView } from '../bom/RealisticProductCadView';

interface PepStep5EngineeringSimulationProps {
  layers: any[];
  designDimensions: string;
  designTargetHeight: number;
  designComfortLevel: string;
  designBrand: string;
  designModel: string;
  activeCurrency: CurrencyCode;
  isDoubleSided: boolean;
  onOpenDrawerLayer: (layer: any) => void;
  onCompleteStep: () => void;
}

export const PepStep5EngineeringSimulation: React.FC<PepStep5EngineeringSimulationProps> = ({
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
  const [simulationView, setSimulationView] = useState<'VIEW_A_CAD' | 'VIEW_B_REALISTIC'>('VIEW_A_CAD');
  const [isFullscreenCadOpen, setIsFullscreenCadOpen] = useState<boolean>(false);
  const [cadZoom, setCadZoom] = useState<number>(1);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  
  // Layer details panel controls (Requirement 18: Searchable, Filterable, Collapsible)
  const [layerSearch, setLayerSearch] = useState<string>('');
  const [layerFunctionFilter, setLayerFunctionFilter] = useState<string>('All');
  const [isLayerPanelCollapsed, setIsLayerPanelCollapsed] = useState<boolean>(false);

  const totalCalculatedHeight = layers.reduce((sum, l) => sum + (Number(l.thickness) || 0), 0);
  const totalBomCost = layers.reduce((sum, l) => sum + (Number(l.cost) || 0), 0) || 1;

  // Derive standard Layer Function and Hardness from BOM data
  const enrichLayerForCad = (l: any, idx: number) => {
    const mat = (l.material || '').toLowerCase();
    const cat = (l.category || '').toLowerCase();

    let layerFunction = 'Comfort Layer';
    let hardness = 'Medium (H2)';

    if (mat.includes('fabric') || mat.includes('قماش') || cat.includes('fabric')) {
      layerFunction = 'Surface Quilting';
      hardness = 'Plush & Soft';
    } else if (mat.includes('fiber') || mat.includes('فايبر')) {
      layerFunction = 'Loft Cushioning';
      hardness = 'Extra Soft (H1)';
    } else if (mat.includes('memory') || mat.includes('ميموري')) {
      layerFunction = 'Pressure Relief';
      hardness = 'Visco Adaptive';
    } else if (mat.includes('latex') || mat.includes('لاتكس')) {
      layerFunction = 'Ergonomic Support';
      hardness = 'Medium Elastic';
    } else if (mat.includes('felt') || mat.includes('لباد')) {
      layerFunction = 'Thermal Insulator';
      hardness = 'High Density Barrier';
    } else if (mat.includes('spring') || mat.includes('سوست') || mat.includes('شاسيه')) {
      layerFunction = 'Spinal Support Core';
      hardness = 'Dynamic Pocket Tension';
    } else if (mat.includes('border') || mat.includes('شريط') || mat.includes('داير')) {
      layerFunction = 'Edge Encasement';
      hardness = 'Rigid Perimeter (D35)';
    } else if (idx === layers.length - 1) {
      layerFunction = 'Base Foundation';
      hardness = 'Firm (H4)';
    }

    return {
      ...l,
      layerNumber: idx + 1,
      layerFunction,
      hardness
    };
  };

  const enrichedCadLayers = useMemo(() => {
    return layers.map(enrichLayerForCad);
  }, [layers]);

  const filteredCadLayers = useMemo(() => {
    return enrichedCadLayers.filter(l => {
      const matchSearch = !layerSearch || 
        l.material?.toLowerCase().includes(layerSearch.toLowerCase()) ||
        l.materialCode?.toLowerCase().includes(layerSearch.toLowerCase()) ||
        l.supplier?.toLowerCase().includes(layerSearch.toLowerCase());
      const matchFunc = layerFunctionFilter === 'All' || l.layerFunction === layerFunctionFilter;
      return matchSearch && matchFunc;
    });
  }, [enrichedCadLayers, layerSearch, layerFunctionFilter]);

  // Real industrial texture patterns (Requirement 12: Fabric, Fiber, Memory, HR, Latex, Felt, Spring, Edge Support)
  const getRealisticTextureStyle = (materialName: string, category: string): { bgClass: string; style: React.CSSProperties } => {
    const mat = (materialName || '').toLowerCase();
    const cat = (category || '').toLowerCase();

    // 1. Spring Coils
    if (mat.includes('spring') || mat.includes('سوست') || mat.includes('شاسيه') || cat.includes('spring')) {
      return {
        bgClass: 'bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-amber-200 border-amber-600/50',
        style: {
          backgroundImage: `radial-gradient(#d97706 1.5px, transparent 1.5px), linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.1))`,
          backgroundSize: '18px 18px, 100% 100%'
        }
      };
    }
    // 2. Felt (Needle-punched thermal insulator)
    if (mat.includes('felt') || mat.includes('لباد') || cat.includes('felt')) {
      return {
        bgClass: 'bg-zinc-800 text-zinc-200 border-zinc-600',
        style: {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Crect width='1' height='1' x='1' y='2' fill='%2371717a' opacity='0.6'/%3E%3Crect width='1.5' height='1.5' x='4' y='5' fill='%23a1a1aa' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '8px 8px'
        }
      };
    }
    // 3. Fabric (Quilted damask / circular knit)
    if (mat.includes('fabric') || mat.includes('قماش') || mat.includes('تطريز') || cat.includes('fabric')) {
      return {
        bgClass: 'bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-200 dark:text-slate-950',
        style: {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath d='M0,8 L8,0 L16,8 L8,16 Z' fill='none' stroke='%2394a3b8' stroke-width='0.8' opacity='0.45'/%3E%3C/svg%3E")`,
          backgroundSize: '16px 16px'
        }
      };
    }
    // 4. Fiber (Polyester loft fiber)
    if (mat.includes('fiber') || mat.includes('فايبر') || mat.includes('قطن') || cat.includes('fiber')) {
      return {
        bgClass: 'bg-sky-50 text-sky-900 border-sky-300 dark:bg-sky-950/80 dark:text-sky-200',
        style: {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='14' viewBox='0 0 24 14'%3E%3Cpath d='M0,7 Q6,0 12,7 T24,7' fill='none' stroke='%2338bdf8' stroke-width='1' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '24px 14px'
        }
      };
    }
    // 5. Memory Foam
    if (mat.includes('memory')) {
      return {
        bgClass: 'bg-pink-950/40 text-pink-200 border-pink-700/50',
        style: {
          backgroundImage: `radial-gradient(#f472b6 1px, transparent 1px)`,
          backgroundSize: '10px 10px'
        }
      };
    }
    // 6. Latex
    if (mat.includes('latex')) {
      return {
        bgClass: 'bg-amber-950/40 text-amber-200 border-amber-600/50',
        style: {
          backgroundImage: `radial-gradient(#fbbf24 1.5px, transparent 1.5px)`,
          backgroundSize: '12px 12px'
        }
      };
    }
    // 7. Edge Support Foam
    if (mat.includes('border') || mat.includes('شريط') || mat.includes('edge')) {
      return {
        bgClass: 'bg-slate-800 text-slate-200 border-slate-600',
        style: {
          backgroundImage: `repeating-linear-gradient(45deg, #1e293b, #1e293b 10px, #334155 10px, #334155 20px)`,
          backgroundSize: '28px 28px'
        }
      };
    }
    // 8. HR Foam / Default
    return {
      bgClass: 'bg-blue-950/40 text-blue-200 border-blue-700/50',
      style: {
        backgroundImage: `radial-gradient(#60a5fa 1px, transparent 1px)`,
        backgroundSize: '10px 10px'
      }
    };
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Banner & View Switcher */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-border-main flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0B2D5C] text-white flex items-center justify-center font-bold">
            <Eye size={18} />
          </div>
          <div>
            <h3 className="font-black text-sm text-[#0B2D5C] dark:text-blue-300">
              محرك المحاكاة الهندسية والـ CAD (CAD Engine & Simulation)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              عرض هندسي دقيق بمقياس الرسم (65% CAD + 35% Layer Details) مع محاكاة الخامات الواقعية ومنطق التماثل.
            </p>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2 bg-surface p-1 rounded-xl border border-border-main text-xs">
          <button
            type="button"
            onClick={() => setSimulationView('VIEW_A_CAD')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              simulationView === 'VIEW_A_CAD'
                ? 'bg-[#0B2D5C] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Box size={13} />
            <span>المخطط الهندسي (CAD Split 65/35)</span>
          </button>

          <button
            type="button"
            onClick={() => setSimulationView('VIEW_B_REALISTIC')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              simulationView === 'VIEW_B_REALISTIC'
                ? 'bg-[#0B2D5C] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles size={13} className={simulationView === 'VIEW_B_REALISTIC' ? 'text-amber-400' : ''} />
            <span>التمثيل الواقعي (Realistic 3D Simulation)</span>
          </button>
        </div>
      </div>

      {/* VIEW A: CAD SPLIT LAYOUT (Requirement 11 & 18: 65% CAD Viewer + 35% Layer Details) */}
      {simulationView === 'VIEW_A_CAD' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Top CAD Control Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-surface rounded-2xl border border-border-main text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                المخطط الهندسي لطبقات الارتفاع:
              </span>
              <span className="font-mono text-[#0B2D5C] dark:text-blue-300 font-black">
                {totalCalculatedHeight} سم (المستهدف: {designTargetHeight} سم)
              </span>
              <span className="text-[10px] text-slate-400">
                ({enrichedCadLayers.length} طبقات هندسية مسجلة)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCadZoom(prev => Math.max(0.7, prev - 0.1))}
                className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 cursor-pointer"
                title="تصغير"
              >
                <ZoomOut size={13} />
              </button>
              <span className="font-mono text-[11px] w-12 text-center font-bold">
                {Math.round(cadZoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setCadZoom(prev => Math.min(1.6, prev + 0.1))}
                className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 cursor-pointer"
                title="تكبير"
              >
                <ZoomIn size={13} />
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreenCadOpen(true)}
                className="px-3 py-1 bg-[#0B2D5C] hover:bg-[#133763] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs mr-2"
              >
                <Maximize2 size={13} />
                <span>ملء الشاشة</span>
              </button>
            </div>
          </div>

          {/* 65% CAD Viewer + 35% Layer Details Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 items-start">
            
            {/* 35% LAYER DETAILS PANEL (Requirement 18: 35% Width, Searchable, Filterable, Collapsible) */}
            <div className={`space-y-3 transition-all ${isLayerPanelCollapsed ? 'lg:col-span-1' : 'lg:col-span-4'}`}>
              <div className="bg-surface rounded-2xl border border-border-main p-4 space-y-3 shadow-xs">
                
                {/* Panel Header & Collapse Toggle */}
                <div className="flex items-center justify-between border-b border-border-main pb-2">
                  <div className="flex items-center gap-2">
                    <Layers size={14} className="text-[#0B2D5C]" />
                    <span className="font-black text-xs text-[#0B2D5C] dark:text-blue-300">
                      لوحة تفاصيل الطبقات (35% Panel)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLayerPanelCollapsed(!isLayerPanelCollapsed)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer text-xs"
                    title={isLayerPanelCollapsed ? 'توسيع اللوحة' : 'طي اللوحة'}
                  >
                    {isLayerPanelCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {!isLayerPanelCollapsed && (
                  <>
                    {/* Search & Filter */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 rounded-xl border border-border-main text-xs">
                        <Search size={13} className="text-slate-400" />
                        <input
                          type="text"
                          placeholder="بحث بالكود أو الاسم..."
                          value={layerSearch}
                          onChange={(e) => setLayerSearch(e.target.value)}
                          className="w-full bg-transparent text-xs font-bold outline-none"
                        />
                      </div>

                      <select
                        value={layerFunctionFilter}
                        onChange={(e) => setLayerFunctionFilter(e.target.value)}
                        className="w-full h-8 px-2 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl text-xs font-bold outline-none cursor-pointer"
                      >
                        <option value="All">كافة الوظائف الهندسية</option>
                        <option value="Surface Quilting">Surface Quilting (تطريز الوجه)</option>
                        <option value="Loft Cushioning">Loft Cushioning (توسيد الفايبر)</option>
                        <option value="Pressure Relief">Pressure Relief (فوم الراحة)</option>
                        <option value="Ergonomic Support">Ergonomic Support (دعم إرجونومي)</option>
                        <option value="Thermal Insulator">Thermal Insulator (عزل اللباد)</option>
                        <option value="Spinal Support Core">Spinal Support Core (شاسيه النوابض)</option>
                        <option value="Edge Encasement">Edge Encasement (إطار الداير)</option>
                        <option value="Base Foundation">Base Foundation (قاعدة الأساس)</option>
                      </select>
                    </div>

                    {/* Layer Cards List (Requirement 11 fields) */}
                    <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                      {filteredCadLayers.map((layer) => {
                        const isSelected = selectedLayerId === layer.id;
                        return (
                          <div
                            key={layer.id}
                            onClick={() => {
                              setSelectedLayerId(layer.id);
                              onOpenDrawerLayer(layer);
                            }}
                            className={`p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                              isSelected
                                ? 'bg-blue-50/80 dark:bg-blue-950/40 border-[#0B2D5C] shadow-xs'
                                : 'bg-surface hover:bg-slate-50 dark:hover:bg-slate-900 border-border-main'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-md bg-[#0B2D5C] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                                  {layer.layerNumber}
                                </span>
                                <span className="font-mono text-[10px] font-bold text-slate-400">
                                  {layer.materialCode}
                                </span>
                              </div>
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                {layer.layerFunction}
                              </span>
                            </div>

                            <span className="font-bold text-slate-900 dark:text-white block truncate mb-1">
                              {layer.material}
                            </span>

                            {/* Requirement 11 Fields: Thickness, Density, Hardness, Weight, Cost, Supplier */}
                            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-slate-500 pt-1.5 border-t border-border-main">
                              <span>السمك: <strong className="text-slate-800 dark:text-slate-200">{layer.thickness} سم</strong></span>
                              <span>الكثافة: <strong className="text-slate-800 dark:text-slate-200">{layer.density ? `${layer.density}D` : 'شاسيه'}</strong></span>
                              <span>القساوة: <strong className="text-slate-800 dark:text-slate-200">{layer.hardness}</strong></span>
                              <span>الوزن: <strong className="text-slate-800 dark:text-slate-200">{layer.weight || (layer.thickness * 0.4).toFixed(1)} كجم</strong></span>
                              <span>المورد: <strong className="text-slate-800 dark:text-slate-200 truncate">{layer.supplier || 'المصنع'}</strong></span>
                              <span>التكلفة: <strong className="text-[#0B2D5C] dark:text-blue-400">{CurrencyEngine.formatAmount(layer.cost, activeCurrency)}</strong></span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

              </div>
            </div>

            {/* 65% CAD VIEWER (Requirement 11 & 18) */}
            <div className={`bg-slate-900 rounded-3xl p-6 border border-slate-700 shadow-xl flex flex-col justify-between min-h-[580px] text-white ${
              isLayerPanelCollapsed ? 'lg:col-span-9' : 'lg:col-span-6'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="font-mono text-xs text-blue-400 font-bold">
                  Scale CAD Visualizer (65% Hero Viewport • 1:{Math.round(cadZoom * 10)})
                </span>
                <span className="font-mono text-xs text-slate-400">
                  {designDimensions} • {designBrand} {designModel}
                </span>
              </div>

              {/* Stacked Cross Section */}
              <div className="flex-1 flex flex-col-reverse justify-center gap-1.5 py-4 overflow-y-auto">
                {enrichedCadLayers.map((layer) => {
                  const totalThick = totalCalculatedHeight || 1;
                  const displayHeight = Math.max(34, (layer.thickness / totalThick) * 440 * cadZoom);
                  const tex = getRealisticTextureStyle(layer.material, layer.category);
                  const isSelected = selectedLayerId === layer.id;

                  return (
                    <div
                      key={layer.id}
                      onClick={() => {
                        setSelectedLayerId(layer.id);
                        onOpenDrawerLayer(layer);
                      }}
                      style={{ height: `${displayHeight}px`, ...tex.style }}
                      className={`w-full rounded-xl ${tex.bgClass} border-2 flex items-center justify-between px-4 shadow-sm transition-all cursor-pointer ${
                        isSelected ? 'border-amber-400 ring-2 ring-amber-400/40' : 'hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs font-bold drop-shadow-sm">
                        <span className="w-5 h-5 rounded-md bg-black/60 text-white font-mono text-[10px] flex items-center justify-center">
                          {layer.thickness}
                        </span>
                        <span className="truncate max-w-[240px]">{layer.material}</span>
                        <span className="text-[10px] text-slate-300 font-mono">({layer.materialCode})</span>
                      </div>

                      <div className="flex items-center gap-3 text-[10px] font-mono font-bold bg-black/50 px-2 py-0.5 rounded-lg">
                        <span>{layer.hardness}</span>
                        <span className="text-emerald-300 font-black">
                          {CurrencyEngine.formatAmount(layer.cost, activeCurrency)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[10px] text-slate-400">
                <span>توزيع الارتفاع الإجمالي: {totalCalculatedHeight} سم</span>
                <span className="font-mono text-emerald-400">Tolerance SASO ±0.2cm</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW B: REALISTIC SIMULATION (Requirement 12) */}
      {simulationView === 'VIEW_B_REALISTIC' && (
        <div className="space-y-4 animate-fade-in">
          
          <div className="p-3 bg-surface rounded-2xl border border-border-main flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              الخامات الواقعية: Fabric, Fiber, Memory Foam, HR Foam, Latex, Felt, Pocket Spring, Edge Support
            </span>

            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 font-mono ${
              isDoubleSided 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300' 
                : 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800'
            }`}>
              <ArrowLeftRight size={11} />
              <span>{isDoubleSided ? 'Double-Sided Symmetry (بدون تكرار المخزون)' : 'Single-Sided'}</span>
            </span>
          </div>

          <RealisticProductCadView
            layers={layers}
            designModel={designModel}
            designBrand={designBrand}
            designDimensions={designDimensions}
            totalThickness={totalCalculatedHeight}
            isSymmetrical={isDoubleSided}
            activeCurrency={activeCurrency}
            onSelectAssembly={() => {}}
          />
        </div>
      )}

      {/* FULLSCREEN CAD MODAL */}
      {isFullscreenCadOpen && (
        <div className="fixed inset-0 z-[99999] flex flex-col bg-slate-950 text-white p-6 animate-fade-in text-right">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Box size={22} className="text-blue-400" />
              <div>
                <h3 className="font-black text-base text-white">
                  المخطط الهندسي عالي الدقة بملء الشاشة (Full-Screen CAD Workspace)
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {designBrand} {designModel} • {designDimensions} • الارتفاع: {totalCalculatedHeight} سم
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsFullscreenCadOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
            >
              <X size={15} />
              <span>إغلاق العرض</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-4xl space-y-2">
              <div className="flex flex-col-reverse justify-end gap-2">
                {enrichedCadLayers.map((layer) => {
                  const tex = getRealisticTextureStyle(layer.material, layer.category);
                  const displayHeight = Math.max(50, (layer.thickness / totalCalculatedHeight) * 520);

                  return (
                    <div
                      key={layer.id}
                      style={{ height: `${displayHeight}px`, ...tex.style }}
                      className={`w-full rounded-2xl ${tex.bgClass} border-2 border-slate-600 p-4 flex items-center justify-between shadow-xl`}
                    >
                      <div className="flex items-center gap-3 font-bold text-sm">
                        <span className="w-7 h-7 rounded-xl bg-black/60 text-white font-mono flex items-center justify-center">
                          {layer.thickness} سم
                        </span>
                        <span>{layer.material}</span>
                        <span className="text-xs text-slate-300 font-mono">({layer.materialCode})</span>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono font-bold bg-black/60 px-4 py-2 rounded-xl">
                        <span>الوظيفة: {layer.layerFunction}</span>
                        <span>القساوة: {layer.hardness}</span>
                        <span className="text-emerald-400 font-black">
                          {CurrencyEngine.formatAmount(layer.cost, activeCurrency)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border-main">
        <span className="text-[11px] text-slate-400">
          تم توثيق المحاكاة الهندسية ومقاييس الرسم والخامات الواقعية.
        </span>

        <button
          type="button"
          onClick={onCompleteStep}
          className="px-6 py-2.5 bg-[#0B2D5C] hover:bg-[#133763] text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center gap-2 transition-all"
        >
          <span>حفظ والتقدم إلى الخطوة 6: تحليلات التصنيع (Manufacturing Analysis)</span>
          <ChevronRight size={15} className="rtl:rotate-180" />
        </button>
      </div>

    </div>
  );
};
