import React from 'react';
import { UnifiedCadLayerProps, MaterialVisualCategory } from './types';
import { MaterialMasterIntelligenceEngine } from '../../../../services/materialMasterIntelligenceEngine';
import { SpringLayerVisual } from './SpringLayerVisual';
import { FoamLayerVisual } from './FoamLayerVisual';
import { LatexLayerVisual } from './LatexLayerVisual';
import { FeltLayerVisual } from './FeltLayerVisual';
import { FabricLayerVisual } from './FabricLayerVisual';
import { FiberLayerVisual } from './FiberLayerVisual';

export const BaseLayerRenderer: React.FC<UnifiedCadLayerProps> = ({
  layer,
  index,
  totalLayers,
  totalThickness,
  totalMaterialsCost,
  isSelected,
  onSelect,
  displayMode,
  zoom
}) => {
  const normMaterial = (layer.material || '').toLowerCase();
  const matInfo = MaterialMasterIntelligenceEngine.getMaterial(layer.material);

  // 1. Determine visual category
  let category: MaterialVisualCategory = 'foam';
  if (normMaterial.includes('pocket') || normMaterial.includes('bonnell') || normMaterial.includes('spring') || normMaterial.includes('سوست')) {
    category = 'spring';
  } else if (normMaterial.includes('latex') || normMaterial.includes('لاتكس')) {
    category = 'latex';
  } else if (normMaterial.includes('felt') || normMaterial.includes('لباد')) {
    category = 'felt';
  } else if (normMaterial.includes('fiber') || normMaterial.includes('فايبر')) {
    category = 'fiber';
  } else if (normMaterial.includes('fabric') || normMaterial.includes('knit') || normMaterial.includes('tencel') || normMaterial.includes('jacq') || normMaterial.includes('cool') || normMaterial.includes('قماش')) {
    category = 'fabric';
  }

  // 2. Proportional Height Calculation with automatic stack compression
  const safeTotalThickness = Math.max(1, totalThickness);
  const proportionalHeightPx = Math.max(
    category === 'spring' ? 110 : (category === 'felt' || category === 'fabric' || category === 'fiber' ? 48 : 58),
    ((layer.thickness || 1) / safeTotalThickness) * 620 * zoom
  );

  // 3. Bilingual labels & Material Master Codes
  const nameAr = matInfo?.nameAr || layer.material;
  const nameEn = matInfo?.nameEn || layer.material;
  const materialType = matInfo?.materialCategory || (layer as any).layerType || (layer as any).category || (
    category === 'spring' ? 'Pocket Spring Core' :
    category === 'latex' ? 'Natural Latex' :
    category === 'felt' ? 'Insulator Felt' :
    category === 'fiber' ? 'Quilting Fiber' :
    category === 'fabric' ? 'Knitted Fabric' : 'Comfort Foam'
  );

  // 4. Render specialized visual background with real material textures
  const renderVisualBackground = () => {
    switch (category) {
      case 'spring':
        return (
          <SpringLayerVisual 
            material={layer.material}
            isPocket={normMaterial.includes('pocket') && !normMaterial.includes('micro')}
            isBonnell={normMaterial.includes('bonnell')}
            isMicro={normMaterial.includes('micro')}
          />
        );
      case 'latex':
        return <LatexLayerVisual density={layer.density || 75} />;
      case 'felt':
        return <FeltLayerVisual isCotton={normMaterial.includes('cotton') || normMaterial.includes('قطن')} />;
      case 'fiber':
        return <FiberLayerVisual />;
      case 'fabric':
        return <FabricLayerVisual material={layer.material} />;
      case 'foam':
      default:
        return <FoamLayerVisual material={layer.material} density={layer.density || 30} />;
    }
  };

  return (
    <div
      onClick={() => onSelect(layer.id)}
      style={{ height: `${proportionalHeightPx}px` }}
      className={`w-full relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group shadow-xs ${
        isSelected 
          ? 'border-blue-500 ring-4 ring-blue-500/30 scale-[1.006] z-20 shadow-md' 
          : 'border-slate-300 dark:border-slate-700/80 hover:border-blue-400 hover:ring-2 hover:ring-blue-400/20'
      }`}
    >
      {/* Background Visual Layer with Real Material Texture */}
      <div className="absolute inset-0 z-0">
        {renderVisualBackground()}
      </div>

      {/* PHASE-XIII SIMPLIFIED METADATA OVERLAY (Display ONLY: Layer Name, Thickness, Material Type) */}
      <div className="relative z-10 w-full h-full flex items-center justify-between px-4 py-2 pointer-events-none">
        
        {/* Simplified Identifier Badge */}
        <div className="flex items-center gap-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm pointer-events-auto">
          <span className="w-6 h-6 rounded-lg bg-[#0B2D5C] text-white font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
            #{index + 1}
          </span>
          
          <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white font-mono font-black text-xs shrink-0">
            {layer.thickness} سم
          </span>

          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="font-black text-xs text-slate-950 dark:text-white leading-tight">
                {nameAr}
              </span>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                ({nameEn})
              </span>
            </div>
            <div className="text-[10px] text-purple-700 dark:text-purple-300 font-bold mt-0.5">
              نوع الخامة: {materialType}
            </div>
          </div>
        </div>

        {/* Clean subtle hint to open full engineering details drawer */}
        <div className="hidden md:flex items-center gap-1.5 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-200/80 dark:border-slate-800 text-[10px] font-bold text-slate-500 pointer-events-auto group-hover:border-blue-400 group-hover:text-blue-600 transition-colors">
          <span>انقر لعرض المواصفات والتكلفة &larr;</span>
        </div>

      </div>
    </div>
  );
};
