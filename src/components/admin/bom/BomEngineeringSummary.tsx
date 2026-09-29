import React from 'react';
import { Cpu, Layers, DollarSign, Scale, Activity } from 'lucide-react';
import { CurrencyCode, CurrencyEngine } from '../../../services/currencyEngine';

interface BomEngineeringSummaryProps {
  executiveSummary: {
    layerCount: number;
    totalFoamHeight: number;
    springHeight: number;
    totalWeight: number;
    manufacturingCost: number;
    warrantyClass: string;
    engineeringScore: number;
  };
  activeCurrency?: CurrencyCode;
}

export const BomEngineeringSummary: React.FC<BomEngineeringSummaryProps> = ({ 
  executiveSummary,
  activeCurrency = 'SAR'
}) => {
  const totalHeight = executiveSummary.totalFoamHeight + executiveSummary.springHeight;

  return (
    <div className="bg-gradient-to-r from-blue-950 via-[#0B2D5C] to-indigo-950 text-white p-4 rounded-3xl shadow-lg space-y-2">
      <div className="flex items-center justify-between border-b border-blue-800/60 pb-2">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-blue-300 animate-pulse" />
          <h3 className="font-extrabold text-xs text-blue-200">
            الملخص الهندسي الموحد (Engineering Summary Bar)
          </h3>
        </div>
        <span className="px-3 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-mono text-[10px] font-bold border border-emerald-500/30">
          Score: {executiveSummary.engineeringScore}/100
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-bold">
        <div className="p-2.5 bg-blue-900/40 rounded-xl border border-blue-800/50 text-center">
          <span className="text-[10px] text-blue-300 block mb-0.5">عدد الطبقات (Layers)</span>
          <span className="font-mono text-white font-black text-sm">{executiveSummary.layerCount} طبقات</span>
        </div>

        <div className="p-2.5 bg-blue-900/40 rounded-xl border border-blue-800/50 text-center">
          <span className="text-[10px] text-blue-300 block mb-0.5">الارتفاع الكلي (Height)</span>
          <span className="font-mono text-purple-300 font-black text-sm">{totalHeight} cm</span>
        </div>

        <div className="p-2.5 bg-blue-900/40 rounded-xl border border-blue-800/50 text-center">
          <span className="text-[10px] text-blue-300 block mb-0.5">الوزن التقديري (Weight)</span>
          <span className="font-mono text-cyan-300 font-black text-sm">{executiveSummary.totalWeight} kg</span>
        </div>

        <div className="p-2.5 bg-blue-900/40 rounded-xl border border-blue-800/50 text-center">
          <span className="text-[10px] text-blue-300 block mb-0.5">التكلفة الصناعية (Mfg Cost)</span>
          <span className="font-mono text-amber-300 font-black text-sm">
            {CurrencyEngine.format(executiveSummary.manufacturingCost, activeCurrency)}
          </span>
        </div>

        <div className="p-2.5 bg-blue-900/40 rounded-xl border border-blue-800/50 text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] text-blue-300 block mb-0.5">التقييم الهندسي (Score)</span>
          <span className="font-mono text-emerald-300 font-black text-sm">{executiveSummary.engineeringScore} / 100</span>
        </div>
      </div>
    </div>
  );
};
