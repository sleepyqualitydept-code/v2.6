import React from 'react';
import { 
  Package, CheckCircle2, Award, Sparkles, Layers, 
  ShieldCheck, Info, ChevronRight, Check
} from 'lucide-react';
import { MaterialMasterIntelligenceEngine } from '../../../services/materialMasterIntelligenceEngine';

interface MaterialSummaryViewProps {
  layers: any[];
  onSelectMaterial?: (materialCode: string) => void;
}

export const MaterialSummaryView: React.FC<MaterialSummaryViewProps> = ({
  layers,
  onSelectMaterial
}) => {
  // Extract unique materials from the active BOM layers
  const usedMaterialCodes = Array.from(new Set(layers.map(l => l.materialCode || l.material)));
  
  // Look up enriched details from MaterialMasterIntelligenceEngine
  const materialDetailsList = usedMaterialCodes.map(code => {
    const enriched = MaterialMasterIntelligenceEngine.getMaterialByCode(code as string) 
      || MaterialMasterIntelligenceEngine.getMaterialByName(code as string);
    
    // Find representative layer
    const layer = layers.find(l => (l.materialCode || l.material) === code);
    
    return {
      code: enriched?.materialCode || code,
      nameAr: enriched?.nameAr || layer?.material || code,
      nameEn: enriched?.nameEn || layer?.materialEn || code,
      category: enriched?.materialCategory || 'Foam',
      supplier: enriched?.supplier || 'Sleepee Certified Supply Chain',
      density: enriched?.density || layer?.density || 0,
      qualityGrade: enriched?.qualityGrade || 'A',
      durabilityRating: enriched?.durabilityRating || 90,
      warrantyRating: enriched?.warrantyRating || 10,
      isCore: enriched?.materialCategory === 'Pocket Spring' || enriched?.materialCategory === 'Bonnell Spring'
    };
  });

  return (
    <div className="w-full bg-surface border border-border-main rounded-3xl p-5 shadow-sm space-y-3.5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-main pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600/10 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600">
            <Package size={18} />
          </div>
          <div>
            <h3 className="font-black text-xs text-[#0B2D5C] dark:text-blue-300 flex items-center gap-2">
              <span>المواد والمكونات الأساسية المستخدمة (Main Materials Used)</span>
              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-[10px] font-mono rounded-full font-black">
                Executive Product View ({materialDetailsList.length} مواد معتمدة)
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              ملخص تنفيذي للمواد المسجلة في هيكل المواصفة القياسية دون الدخول في تسلسل الطبقات
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold">
          <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <Check size={13} /> خامات مطابقة لمعايير ISO
          </span>
        </div>
      </div>

      {/* Badges / Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {materialDetailsList.map((mat, idx) => (
          <div
            key={`${mat.code}-${idx}`}
            onClick={() => onSelectMaterial && onSelectMaterial(mat.code)}
            className="group relative bg-slate-50/80 dark:bg-slate-900/60 border border-border-main hover:border-purple-400 dark:hover:border-purple-600 rounded-2xl p-3 transition-all cursor-pointer shadow-2xs hover:shadow-md flex flex-col justify-between"
          >
            {/* Top row: Checkmark + Category Badge */}
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 size={13} />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md truncate max-w-[110px]">
                {mat.category}
              </span>
            </div>

            {/* Material Name & Code */}
            <div className="space-y-0.5">
              <h4 className="font-black text-xs text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                {mat.nameAr}
              </h4>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                {mat.nameEn}
              </p>
            </div>

            {/* Bottom: Code & Supplier */}
            <div className="mt-3 pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                {mat.code}
              </span>
              <span className="text-slate-400 truncate max-w-[90px]" title={mat.supplier}>
                {mat.supplier}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
