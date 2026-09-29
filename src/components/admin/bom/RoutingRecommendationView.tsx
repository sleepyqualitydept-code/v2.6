import React from 'react';
import { 
  GitBranch, Clock, Factory, CheckCircle2, 
  ArrowLeft, Info, Cpu, Layers, ShieldCheck, Play
} from 'lucide-react';
import { RoutingRecommendationResult } from '../../../services/routingRecommendationEngine';

interface Props {
  routing: RoutingRecommendationResult;
}

export const RoutingRecommendationView: React.FC<Props> = ({ routing }) => {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-surface border border-border-main p-6 rounded-3xl shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 font-bold text-xs rounded-lg flex items-center gap-1.5 border border-teal-200 dark:border-teal-800">
              <GitBranch size={14} />
              Routing Recommendation Engine
            </span>
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-lg border border-blue-200 dark:border-blue-800 font-mono">
              {routing.routingType}
            </span>
          </div>
          <h3 className="text-lg font-black text-text-main mt-2">
            المسار التوجيهي المقترح لخطوط الإنتاج ومحطات التشغيل
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            اقتراح هندسي مبني على محاكاة خطوات التجميع دون إنشاء أوامر إنتاجية فعلية (Simulation Only).
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 px-5 py-3 rounded-2xl border border-border-main shrink-0">
          <div className="text-center">
            <div className="text-[11px] text-slate-400 font-bold">زمن التشغيل الإجمالي</div>
            <div className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono mt-0.5">
              {routing.totalStandardTimeMinutes} <span className="text-xs text-slate-400 font-normal">دقيقة</span>
            </div>
          </div>
          <div className="w-px h-8 bg-border-main" />
          <div className="text-center">
            <div className="text-[11px] text-slate-400 font-bold">مراكز العمل</div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono mt-0.5">
              {routing.totalWorkCenters}
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Routing Sequence Steps */}
      <div className="bg-surface border border-border-main p-6 rounded-3xl shadow-2xs space-y-4">
        <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
          <Factory size={18} className="text-teal-600" />
          تسلسل خط التجميع الصناعي المقترح (Suggested Process Routing Flow)
        </h4>

        <div className="space-y-3">
          {routing.steps.map((step, idx) => (
            <div 
              key={step.stepNumber}
              className="p-4 bg-slate-50 dark:bg-slate-900/70 border border-border-main rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-teal-500/40"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {step.stepNumber}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-text-main">{step.operationNameAr}</span>
                    <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">
                      {step.operationCode}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {step.operationNameEn}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                    {step.keyInstructionsAr}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0 self-end md:self-center">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-bold">مركز التشغيل:</div>
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {step.workCenterNameAr}
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-xl text-xs font-mono font-bold text-teal-700 dark:text-teal-300 flex items-center gap-1">
                  <Clock size={13} />
                  {step.estimatedStandardTimeMinutes} د
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-2xl flex items-start gap-3 text-xs text-blue-800 dark:text-blue-200">
          <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">ملاحظة هندسية تنظيمية: </span>
            {routing.routingNotesAr}
          </div>
        </div>
      </div>
    </div>
  );
};
