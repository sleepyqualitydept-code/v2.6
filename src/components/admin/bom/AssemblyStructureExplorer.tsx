import React, { useState } from 'react';
import { 
  Layers, ChevronDown, ChevronRight, CheckCircle2, 
  Sparkles, Info, Scale, ArrowLeftRight, Box, ShieldCheck, 
  FileText, CornerDownRight, Zap, RefreshCw, Eye
} from 'lucide-react';
import { CurrencyCode, CurrencyEngine } from '../../../services/currencyEngine';

export interface AssemblyGroup {
  id: 'top' | 'spring' | 'bottom' | 'border';
  nameAr: string;
  nameEn: string;
  colorClass: string;
  badgeBg: string;
  layers: any[];
  totalThickness: number;
  totalCost: number;
  totalWeight: number;
  descriptionAr: string;
}

interface AssemblyStructureExplorerProps {
  layers: any[];
  activeCurrency: CurrencyCode;
  onSelectAssembly: (assembly: AssemblyGroup) => void;
  onSelectLayer: (layer: any) => void;
  selectedAssemblyId: string | null;
  selectedLayerId: string | null;
  isSymmetricalForced?: boolean;
  setIsSymmetricalForced?: (val: boolean) => void;
}

export const AssemblyStructureExplorer: React.FC<AssemblyStructureExplorerProps> = ({
  layers,
  activeCurrency,
  onSelectAssembly,
  onSelectLayer,
  selectedAssemblyId,
  selectedLayerId,
  isSymmetricalForced,
  setIsSymmetricalForced
}) => {
  // Default collapsed to keep presentation executive and simplified
  const [expandedAssemblies, setExpandedAssemblies] = useState<Record<string, boolean>>({
    top: false,
    spring: false,
    bottom: false,
    border: false
  });

  const toggleAssembly = (id: string) => {
    setExpandedAssemblies(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Classify layers into the 4 standard assemblies
  const springIndex = layers.findIndex(l => {
    const mat = (l.material || '').toLowerCase();
    const cat = (l.category || '').toLowerCase();
    return mat.includes('spring') || mat.includes('سوست') || cat.includes('spring') || mat.includes('شاسيه');
  });

  const topLayers: any[] = [];
  const springLayers: any[] = [];
  const bottomLayers: any[] = [];
  const borderLayers: any[] = [];

  if (springIndex !== -1) {
    layers.forEach((layer, idx) => {
      const mat = (layer.material || '').toLowerCase();
      const cat = (layer.category || '').toLowerCase();
      
      if (mat.includes('border') || mat.includes('شريط') || mat.includes('داير') || cat.includes('edge') || cat.includes('border')) {
        borderLayers.push(layer);
      } else if (idx < springIndex) {
        if (mat.includes('felt') || mat.includes('لباد') && idx === springIndex - 1) {
          springLayers.push(layer);
        } else {
          topLayers.push(layer);
        }
      } else if (idx === springIndex) {
        springLayers.push(layer);
      } else {
        if (mat.includes('felt') || mat.includes('لباد') && idx === springIndex + 1) {
          springLayers.push(layer);
        } else {
          bottomLayers.push(layer);
        }
      }
    });
  } else {
    const midPoint = Math.floor(layers.length / 2);
    layers.forEach((layer, idx) => {
      const mat = (layer.material || '').toLowerCase();
      if (mat.includes('border') || mat.includes('شريط') || mat.includes('داير')) {
        borderLayers.push(layer);
      } else if (idx < midPoint) {
        topLayers.push(layer);
      } else if (idx === midPoint && layers.length % 2 !== 0) {
        springLayers.push(layer);
      } else {
        bottomLayers.push(layer);
      }
    });
  }

  // Virtual standard border spec if not present
  if (borderLayers.length === 0) {
    borderLayers.push({
      id: 'virtual-border-1',
      material: 'قماش الداير عالي التحمل + فوم تبطين',
      materialEn: 'Heavy Duty Border Fabric & Foam Quilting',
      materialCode: 'FAB-BRD-01',
      thickness: 1.5,
      density: 22,
      cost: 32,
      weight: 1.8,
      supplier: 'Sleepee Textiles Division',
      notes: 'شريط تطريز جانبي متين مع حزام تهوية 3D ومقابض قماشية'
    });
  }

  // PART 8: Symmetrical Construction Check
  const isAutoSymmetrical = topLayers.length > 0 && bottomLayers.length > 0 && (
    topLayers.length === bottomLayers.length ||
    topLayers.map(l => l.materialCode || l.material).sort().join(',') === bottomLayers.map(l => l.materialCode || l.material).sort().join(',')
  );

  const isSymmetrical = isSymmetricalForced !== undefined ? isSymmetricalForced : isAutoSymmetrical;

  // Calculate unique physical layers without duplicating mirrored layers
  const physicalUniqueLayersCount = isSymmetrical
    ? topLayers.length + springLayers.length + borderLayers.length
    : layers.length;

  const buildAssemblyGroup = (
    id: 'top' | 'spring' | 'bottom' | 'border', 
    nameAr: string, 
    nameEn: string, 
    colorClass: string,
    badgeBg: string,
    descriptionAr: string,
    layerList: any[]
  ): AssemblyGroup => {
    const totalThickness = layerList.reduce((sum, l) => sum + Number(l.thickness || 0), 0);
    const totalCost = layerList.reduce((sum, l) => sum + Number(l.cost || 0), 0);
    const totalWeight = layerList.reduce((sum, l) => sum + Number(l.weight || (l.thickness * (l.density || 25) * 0.035)), 0);

    return {
      id,
      nameAr,
      nameEn,
      colorClass,
      badgeBg,
      descriptionAr,
      layers: layerList,
      totalThickness: Math.round(totalThickness * 10) / 10,
      totalCost: Math.round(totalCost * 10) / 10,
      totalWeight: Math.round(totalWeight * 100) / 100
    };
  };

  const assemblies: AssemblyGroup[] = [
    buildAssemblyGroup('top', '1. المجموعة العلوية (Top Assembly)', 'Top Comfort & Quilting Assembly', 'border-blue-300 dark:border-blue-800', 'bg-blue-500', 'طبقات القماش، الفايبر، وفوم الراحة والنعومة', topLayers),
    buildAssemblyGroup('spring', '2. مجموعة شاسيه السوست (Spring Assembly)', 'Spring Core & Reinforcement Assembly', 'border-amber-300 dark:border-amber-800', 'bg-amber-500', 'شاسيه النوابض الكربونية واللباد التركي العازل', springLayers),
    buildAssemblyGroup('bottom', '3. المجموعة السفلية (Bottom Assembly)', 'Bottom Base & Support Assembly', 'border-emerald-300 dark:border-emerald-800', 'bg-emerald-500', isSymmetrical ? 'هيكل متناظر متطابق مع الوجه العلوي (Mirrored)' : 'طبقة تثبيت سفلية وقاعدة فوم داعمة', bottomLayers),
    buildAssemblyGroup('border', '4. مجموعة الإطار والشريط (Border Assembly)', 'Perimeter Border & Encasement Assembly', 'border-purple-300 dark:border-purple-800', 'bg-purple-500', 'شريط الداير الجانبي وأحزمة التهوية والمقابض', borderLayers)
  ];

  return (
    <div className="w-full bg-surface border border-border-main rounded-3xl p-5 shadow-sm space-y-4 animate-fade-in">
      {/* Header with Symmetry & Physical Layers status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-main pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600/10 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600">
            <Layers size={18} />
          </div>
          <div>
            <h3 className="font-black text-xs text-[#0B2D5C] dark:text-blue-300 flex items-center gap-2">
              <span>الهيكل التجميعي للمصنع (Assembly Structure)</span>
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-[10px] font-mono rounded-full font-black">
                4 مجموعات تصنيعية رئيسية
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {isSymmetrical 
                ? `بناء متماثل الوجهين • الطبقات الفعلية المستقلة: ${physicalUniqueLayersCount} طبقات (Mirrored Construction)`
                : `بناء أحادي الوجه • إجمالي الطبقات: ${layers.length} طبقات`}
            </p>
          </div>
        </div>

        {/* Symmetrical Construction Indicator */}
        <div className="flex items-center gap-2">
          {isSymmetrical ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-black shadow-2xs">
              <ArrowLeftRight size={14} className="text-emerald-500" />
              <span>مرتبة وجهين (Double-Sided Mirrored)</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-200 dark:bg-emerald-800 rounded text-emerald-900 dark:text-emerald-100">
                Symmetric
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-900 border border-border-main text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black">
              <span>وجه نوم أحادي (Single Sided)</span>
            </div>
          )}

          {setIsSymmetricalForced && (
            <button
              type="button"
              onClick={() => setIsSymmetricalForced(!isSymmetrical)}
              className="px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors cursor-pointer border border-blue-200 dark:border-blue-800"
            >
              تبديل التماثل
            </button>
          )}
        </div>
      </div>

      {/* 4 Clean Assembly Structure Cards (Collapsed mode hides raw materials list) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {assemblies.map((assembly) => {
          const isExpanded = expandedAssemblies[assembly.id];
          const isSelected = selectedAssemblyId === assembly.id;

          return (
            <div
              key={assembly.id}
              className={`border rounded-2xl transition-all overflow-hidden bg-slate-50/50 dark:bg-slate-900/40 shadow-2xs flex flex-col justify-between ${
                isSelected 
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md' 
                  : 'border-border-main hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Assembly Header Summary (Always Visible) */}
              <div
                onClick={() => {
                  onSelectAssembly(assembly);
                  toggleAssembly(assembly.id);
                }}
                className="p-4 bg-white dark:bg-slate-900/90 border-b border-border-main flex flex-col justify-between gap-3 cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex-1"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${assembly.badgeBg} shrink-0`} />
                    <div>
                      <h4 className="font-black text-xs text-slate-900 dark:text-slate-100">
                        {assembly.nameAr}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {assembly.totalThickness} سم • {assembly.layers.length} مكونات
                      </span>
                    </div>
                  </div>

                  {isExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                </div>

                {/* Function Description in Collapsed Mode */}
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {assembly.descriptionAr}
                </p>

                {/* Collapsed Mode Footer: Quick Action */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">
                    {isExpanded ? 'طي القائمة' : 'توسيع المكونات &darr;'}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {assembly.id === 'bottom' && isSymmetrical ? 'هيكل متناظر' : 'مجموعة قياسية'}
                  </span>
                </div>
              </div>

              {/* Expanded Mode: Materials Breakdown */}
              {isExpanded && (
                <div className="p-3 space-y-2 bg-slate-100/50 dark:bg-slate-950/60 border-t border-border-main animate-fade-in">
                  {assembly.layers.length > 0 ? (
                    assembly.layers.map((layer, idx) => {
                      const isLayerSelected = selectedLayerId === layer.id;
                      return (
                        <div
                          key={layer.id || idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectLayer(layer);
                            onSelectAssembly(assembly);
                          }}
                          className={`flex items-center justify-between gap-2 p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isLayerSelected
                              ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-400 text-blue-900 dark:text-blue-100 shadow-2xs'
                              : 'bg-white dark:bg-slate-900 border border-border-main/60 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <CornerDownRight size={13} className="text-slate-400 shrink-0" />
                            <div className="min-w-0">
                              <span className="line-clamp-1 text-xs">
                                {layer.material || layer.materialEn}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {layer.thickness} سم • {layer.materialCode || 'MAT-01'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-[11px] text-slate-400 text-center py-2">لا توجد طبقات مسجلة</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
