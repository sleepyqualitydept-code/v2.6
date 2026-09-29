import React from 'react';
import { Sparkles, Layers, Box } from 'lucide-react';
import { Model, Brand } from '../../../types/erp';

interface BomHeaderProps {
  designModel: string;
  designCategory: string;
  designVersion: string;
  designTargetHeight: number;
  designComfortLevel: string;
  designPositioning: string;
  designDimensions: string;
  engineeringScore: number;
  models: Model[];
  brands: Brand[];
  selectedModelId: string;
  setSelectedModelId: (id: string) => void;
}

export const BomHeader: React.FC<BomHeaderProps> = ({
  designModel,
  designCategory,
  designVersion,
  designTargetHeight,
  designComfortLevel,
  designPositioning,
  designDimensions,
  engineeringScore,
  models,
  brands,
  selectedModelId,
  setSelectedModelId
}) => {
  return (
    <div className="bg-surface border border-border-main p-3.5 rounded-2xl max-h-[110px] flex flex-wrap items-center justify-between gap-3 text-xs font-bold shadow-2xs">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 shrink-0">
          <Box size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-black text-sm text-[#0B2D5C] dark:text-blue-300">
              {designModel || 'مرتبة قياسية'}
            </h2>
            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-[10px] font-mono rounded-md">
              {designVersion}
            </span>
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] rounded-md font-mono">
              {designDimensions}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
            {designCategory === 'MAT' ? 'مرتبة إسفنج وسوست (Mattress)' : 'سرير وهيكل نوم (Bed)'} • الفئة: {designPositioning} • الراحة: {designComfortLevel}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-border-main">
          <span className="text-[10px] text-slate-400">الارتفاع المستهدف:</span>
          <span className="font-mono text-purple-600 font-black text-xs">{designTargetHeight} cm</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-border-main">
          <span className="text-[10px] text-slate-400">الدرجة الهندسية:</span>
          <span className="font-mono text-emerald-600 font-black text-xs">{engineeringScore}/100</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[10px]">الموديل:</span>
          <select
            value={selectedModelId}
            onChange={(e) => setSelectedModelId(e.target.value)}
            className="h-8 px-2.5 bg-white dark:bg-slate-950 border border-border-main rounded-xl text-xs font-black shadow-2xs outline-none cursor-pointer text-blue-600"
          >
            {models.map(m => (
              <option key={m.id} value={m.id}>{m.name} ({brands.find(b => b.id === m.brandId)?.name})</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
