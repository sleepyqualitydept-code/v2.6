import React from 'react';
import { ArrowDownUp, Layers } from 'lucide-react';
import { CadLayerItem } from './types';
import { BaseLayerRenderer } from './BaseLayerRenderer';

interface Props {
  layers: CadLayerItem[];
  selectedCadLayerId: string | null;
  setSelectedCadLayerId: (id: string | null) => void;
  totalThickness: number;
  totalMaterialsCost: number;
  zoom: number;
  displayMode: 'crossSection' | 'exploded' | 'finishedProduct' | 'manufacturing';
}

export const UnifiedCadMattressCrossSection: React.FC<Props> = ({
  layers,
  selectedCadLayerId,
  setSelectedCadLayerId,
  totalThickness,
  totalMaterialsCost,
  zoom,
  displayMode
}) => {
  if (layers.length === 0) {
    return (
      <div className="w-full h-80 flex flex-col items-center justify-center text-slate-400 text-xs font-bold space-y-2">
        <Layers size={32} className="text-slate-300 animate-pulse" />
        <span>لا توجد طبقات مضافة في هذا الهيكل. يرجى إضافة طبقات للبدء في الرسم الهندسي.</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col justify-between flex-1 gap-2 my-auto">
      {/* Top Surface Orientation Indicator */}
      <div className="w-full flex items-center justify-between bg-blue-600/10 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700/50 px-4 py-2 rounded-xl text-xs font-black text-blue-800 dark:text-blue-300 z-10 shrink-0">
        <span className="flex items-center gap-1.5">
          <ArrowDownUp size={14} />
          <span>السطح العلوي للتنجيد والكبتوني (Top Surface - Outer Quilt)</span>
        </span>
        <span className="text-[10px] font-mono bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded-md font-bold">
          الوجه الأساسي للنوم (Sleeping Side)
        </span>
      </div>

      {/* COMPRESSED FLUSH CAD LAYER STACK (Top to Bottom visual presentation) */}
      <div className="w-full flex flex-col gap-1.5 my-1">
        {layers.map((layer, idx) => (
          <BaseLayerRenderer
            key={layer.id}
            layer={layer}
            index={idx}
            totalLayers={layers.length}
            totalThickness={totalThickness}
            totalMaterialsCost={totalMaterialsCost}
            isSelected={selectedCadLayerId === layer.id}
            onSelect={setSelectedCadLayerId}
            displayMode={displayMode}
            zoom={zoom}
            isTopLayer={idx === 0}
            isBottomLayer={idx === layers.length - 1}
          />
        ))}
      </div>

      {/* Bottom Foundation Orientation Indicator */}
      <div className="w-full flex items-center justify-between bg-slate-800/10 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700/50 px-4 py-2 rounded-xl text-xs font-black text-slate-700 dark:text-slate-300 z-10 shrink-0">
        <span className="flex items-center gap-1.5">
          <ArrowDownUp size={14} />
          <span>الجهة السفلية الداعمة وقاعدة المرتبة (Bottom Side - Foundation Core)</span>
        </span>
        <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-md font-bold">
          جهة قاعدة السرير (Bed Frame Slat Base)
        </span>
      </div>
    </div>
  );
};
