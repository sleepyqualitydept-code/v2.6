import React from 'react';
import { 
  X, Layers, Scale, DollarSign, ShieldCheck, Factory, 
  Award, Sparkles, CheckCircle2, AlertTriangle, FileText, 
  Activity, ArrowLeftRight, HelpCircle, Box
} from 'lucide-react';
import { AssemblyGroup } from './AssemblyStructureExplorer';
import { CurrencyCode, CurrencyEngine } from '../../../services/currencyEngine';
import { MaterialMasterIntelligenceEngine } from '../../../services/materialMasterIntelligenceEngine';

interface AssemblyEngineeringDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAssembly: AssemblyGroup | null;
  selectedLayer: any | null;
  activeCurrency: CurrencyCode;
}

export const AssemblyEngineeringDrawer: React.FC<AssemblyEngineeringDrawerProps> = ({
  isOpen,
  onClose,
  selectedAssembly,
  selectedLayer,
  activeCurrency
}) => {
  if (!isOpen || (!selectedAssembly && !selectedLayer)) {
    return null;
  }

  // Get material master knowledge if a layer is selected
  const activeLayer = selectedLayer || (selectedAssembly?.layers && selectedAssembly.layers[0]);
  const materialCode = activeLayer?.materialCode || activeLayer?.material || 'MAT-01';
  const masterInfo = MaterialMasterIntelligenceEngine.getMaterialByCode(materialCode)
    || MaterialMasterIntelligenceEngine.getMaterialByName(activeLayer?.material || '');

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-fade-in"
      onClick={onClose}
    >
      <div 
        style={{ width: '420px', maxWidth: '30vw', minWidth: '340px' }}
        className="fixed top-0 bottom-0 right-0 bg-surface border-l border-border-main h-full shadow-2xl flex flex-col justify-between animate-slide-in-right overflow-y-auto overflow-x-hidden text-right z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-border-main bg-[#0B2D5C] text-white flex items-center justify-between sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold">
              <Layers size={16} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-300 font-mono block">
                ENGINEERING SPECIFICATIONS DRAWER
              </span>
              <h3 className="font-black text-xs text-white truncate max-w-[260px]">
                {selectedLayer ? (activeLayer.material || activeLayer.materialEn) : (selectedAssembly?.nameAr || 'المجموعة الهندسية')}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-5 space-y-5 flex-1">
          {/* Summary Banner */}
          {selectedAssembly && (
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-800 dark:text-blue-300">
                  {selectedAssembly.nameAr}
                </span>
                <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
                  {CurrencyEngine.format(selectedAssembly.totalCost, activeCurrency)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono pt-2 border-t border-blue-200/60 dark:border-blue-800/60 text-slate-500">
                <div>
                  <span className="block text-slate-400">الارتفاع:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedAssembly.totalThickness} سم</span>
                </div>
                <div>
                  <span className="block text-slate-400">الوزن:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedAssembly.totalWeight} كجم</span>
                </div>
                <div>
                  <span className="block text-slate-400">المكونات:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedAssembly.layers.length} طبقات</span>
                </div>
              </div>
            </div>
          )}

          {/* Active Layer Detailed Specs */}
          {activeLayer && (
            <div className="space-y-4">
              <h4 className="font-black text-xs text-slate-800 dark:text-slate-200 border-r-4 border-purple-500 pr-2">
                بيانات المادة الهندسية (Material Engineering Parameters)
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {/* Material Code */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900/70 border border-border-main rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-bold">كود المادة (Material Code)</span>
                  <span className="font-mono font-black text-xs text-purple-600 dark:text-purple-400 mt-1 block">
                    {activeLayer.materialCode || masterInfo?.materialCode || 'MAT-STD-01'}
                  </span>
                </div>

                {/* Thickness */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900/70 border border-border-main rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-bold">السماكة (Thickness)</span>
                  <span className="font-mono font-black text-xs text-blue-600 dark:text-blue-400 mt-1 block">
                    {activeLayer.thickness} سم ({activeLayer.thickness * 10} مم)
                  </span>
                </div>

                {/* Density */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900/70 border border-border-main rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-bold">الكثافة (Density)</span>
                  <span className="font-mono font-black text-xs text-amber-600 dark:text-amber-400 mt-1 block">
                    {activeLayer.density || masterInfo?.density || 28} كجم/م³
                  </span>
                </div>

                {/* Weight */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900/70 border border-border-main rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-bold">الوزن التقديري (Weight)</span>
                  <span className="font-mono font-black text-xs text-slate-800 dark:text-slate-200 mt-1 block">
                    {activeLayer.weight || Math.round((activeLayer.thickness * (activeLayer.density || 25) * 0.035) * 100) / 100} كجم
                  </span>
                </div>

                {/* Cost Contribution */}
                <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 block font-bold">مساهمة التكلفة (Cost)</span>
                  <span className="font-mono font-black text-xs text-emerald-800 dark:text-emerald-200 mt-1 block">
                    {CurrencyEngine.format(activeLayer.cost || 25, activeCurrency)}
                  </span>
                </div>

                {/* Supplier */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900/70 border border-border-main rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-bold">المورد المعتمد (Supplier)</span>
                  <span className="font-black text-xs text-slate-800 dark:text-slate-200 mt-1 block truncate">
                    {activeLayer.supplier || masterInfo?.supplier || 'Sleepee Certified Supply Chain'}
                  </span>
                </div>
              </div>

              {/* Quality & Performance Ratings */}
              {masterInfo && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Award size={14} className="text-amber-500" />
                    <span>مؤشرات الجودة والاعتمادية الصناعية (Quality & Durability)</span>
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-xl">
                      <span className="text-slate-400 block">درجة التحمل:</span>
                      <span className="font-bold text-emerald-600">{masterInfo.durabilityRating}/100</span>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-xl">
                      <span className="text-slate-400 block">تصنيف الضغط:</span>
                      <span className="font-bold text-blue-600">{masterInfo.compressionRating}/100</span>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-xl">
                      <span className="text-slate-400 block">رتبة الجودة:</span>
                      <span className="font-bold text-purple-600">Grade {masterInfo.qualityGrade}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Engineering Notes */}
              <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 rounded-2xl space-y-1">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <FileText size={14} className="text-amber-600" />
                  <span>الملاحظات الهندسية ومحددات التشغيل (Engineering Notes)</span>
                </span>
                <p className="text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
                  {activeLayer.notes || masterInfo?.recommendedApplications || 'طبقة مطابقة للمعايير القياسية مع مقاومة عالية للهبوط والانضغاط المتكرر.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-border-main bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            العملة النشطة: <span className="font-bold text-slate-700 dark:text-slate-200">{CurrencyEngine.getCurrencyConfig(activeCurrency).nameAr}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            إغلاق الدرج
          </button>
        </div>
      </div>
    </div>
  );
};
