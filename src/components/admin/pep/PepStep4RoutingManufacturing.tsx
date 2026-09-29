import React, { useState, useMemo } from 'react';
import { 
  Workflow, Plus, Trash2, Clock, Users, Wrench, ShieldCheck, 
  ChevronRight, ArrowUpDown, CheckCircle2, Factory, Sliders, Settings 
} from 'lucide-react';
import { RoutingStep } from '../../../types/erp';
import { CurrencyCode, CurrencyEngine } from '../../../services/currencyEngine';
import { ErpDatabase } from '../../../utils/erpDb';
import { PepRegistries, PlantMachineItem } from '../../../services/pepRegistries';

export interface EnhancedRoutingStep extends RoutingStep {
  plantCode?: string;
  productionLine?: string;
  machineGroup?: string;
  machineCode?: string;
  machineHours?: number;
  expectedYieldPct?: number;
  expectedScrapPct?: number;
}

interface PepStep4RoutingManufacturingProps {
  routingSteps: RoutingStep[];
  setRoutingSteps: React.Dispatch<React.SetStateAction<RoutingStep[]>>;
  activeCurrency: CurrencyCode;
  onCompleteStep: () => void;
}

export const PepStep4RoutingManufacturing: React.FC<PepStep4RoutingManufacturingProps> = ({
  routingSteps,
  setRoutingSteps,
  activeCurrency,
  onCompleteStep
}) => {
  const machines = useMemo(() => PepRegistries.getAllMachines(), []);
  const workCenters = useMemo(() => ErpDatabase.getWorkCenters(), []);

  // Enrich routing steps with real production equipment fields
  const enrichedSteps: EnhancedRoutingStep[] = useMemo(() => {
    return routingSteps.map(step => {
      const matchedMachine = machines.find(m => m.machineCode.includes(step.workCenterCode) || step.operationCode.includes(m.machineGroup.split(' ')[0]))
        || machines[0];

      const runMin = Number(step.runTime) || 15;
      const setupMin = Number(step.setupTime) || 10;
      const mchHours = Math.round(((runMin + setupMin) / 60) * 100) / 100;

      return {
        ...step,
        plantCode: 'KSA-MAIN',
        productionLine: matchedMachine?.lineNameAr || 'خط الإنتاج الرئيسي',
        machineGroup: matchedMachine?.machineGroup || 'Assembly',
        machineCode: matchedMachine?.machineCode || 'MCH-01',
        machineHours: mchHours,
        expectedYieldPct: 98,
        expectedScrapPct: 2
      };
    });
  }, [routingSteps, machines]);

  // Aggregate metrics
  const totalSetupTime = routingSteps.reduce((sum, s) => sum + (s.setupTime || 0), 0);
  const totalRunTime = routingSteps.reduce((sum, s) => sum + (s.runTime || 0), 0);
  const totalCycleTime = totalSetupTime + totalRunTime;
  const totalMachineHours = Math.round((totalCycleTime / 60) * 100) / 100;
  const maxLaborRequired = routingSteps.reduce((max, s) => Math.max(max, s.laborCount || 1), 0);
  const totalRoutingLaborCost = routingSteps.reduce((sum, s) => sum + (s.estimatedCost || 25), 0);

  const handleAddStep = () => {
    const nextSeq = (routingSteps.length + 1) * 10;
    const newStep: RoutingStep = {
      sequenceNo: nextSeq,
      operationCode: `OP-CUST-${nextSeq}`,
      operationNameAr: 'عملية فحص وتشطيب إضافية',
      operationNameEn: 'Custom Inspection & Assembly Step',
      workCenterCode: workCenters[0]?.code || 'WC-ASSY-01',
      setupTime: 5,
      runTime: 10,
      laborCount: 2,
      machineCount: 1,
      qualityGate: true,
      mandatoryStep: true,
      estimatedCost: 20
    };
    setRoutingSteps(prev => [...prev, newStep]);
  };

  const handleDeleteStep = (seqNo: number) => {
    if (routingSteps.length <= 1) return;
    setRoutingSteps(prev => prev.filter(s => s.sequenceNo !== seqNo));
  };

  const handleUpdateStep = (seqNo: number, field: keyof RoutingStep, val: any) => {
    setRoutingSteps(prev => prev.map(s => {
      if (s.sequenceNo === seqNo) {
        return { ...s, [field]: val };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Banner */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-border-main flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0B2D5C] text-white flex items-center justify-center font-bold">
            <Workflow size={18} />
          </div>
          <div>
            <h3 className="font-black text-sm text-[#0B2D5C] dark:text-blue-300">
              سجل مسارات التشغيل وربط الماكينات الصناعية (Routing Master Rebuild)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              ربط مباشر بخطوط الإنتاج الفعلية، مجموعات الآلات، رموز الماكينات (SPR-01, QUILT-01)، وساعات العمل ونقاط الجودة.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddStep}
            className="px-4 py-2 bg-[#0B2D5C] hover:bg-[#133763] text-white rounded-xl text-xs font-black shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <Plus size={14} />
            <span>إضافة خطوة تشغيل</span>
          </button>
        </div>
      </div>

      {/* Production KPIs Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Clock size={12} className="text-blue-600" />
            <span>إجمالي دورة التشغيل (Cycle Time):</span>
          </span>
          <div className="flex items-baseline justify-between font-mono">
            <span className="text-xl font-black text-slate-900 dark:text-white">{totalCycleTime} دقيقة</span>
            <span className="text-[10px] text-slate-400">({totalMachineHours} ساعة ماكينة)</span>
          </div>
        </div>

        <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Factory size={12} className="text-emerald-600" />
            <span>المصنع والخط الرئيسي:</span>
          </span>
          <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
            مجمع الرياض الرئيسي (KSA-MAIN)
          </div>
          <span className="text-[10px] font-mono text-emerald-600 block">6 خطوط إنتاج تخصصية</span>
        </div>

        <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Users size={12} className="text-amber-600" />
            <span>العمالة الفنية المطلوبة:</span>
          </span>
          <div className="flex items-baseline justify-between font-mono">
            <span className="text-xl font-black text-amber-600">{maxLaborRequired} فنيين</span>
            <span className="text-[10px] text-slate-400">للوردية الواحدة</span>
          </div>
        </div>

        <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <ShieldCheck size={12} className="text-[#0B2D5C]" />
            <span>بوابات فحص الجودة (Quality Gates):</span>
          </span>
          <div className="flex items-baseline justify-between font-mono">
            <span className="text-xl font-black text-[#0B2D5C] dark:text-blue-300">
              {routingSteps.filter(s => s.qualityGate).length} بوابات
            </span>
            <span className="text-[10px] text-emerald-600 font-bold">100% إلزامية</span>
          </div>
        </div>
      </div>

      {/* ENTERPRISE ROUTING MASTER TABLE (Requirement 9) */}
      <div className="bg-surface rounded-2xl border border-border-main overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-black border-b border-border-main text-[11px]">
                <th className="py-3 px-2">Seq</th>
                <th className="py-3 px-2">المصنع</th>
                <th className="py-3 px-2">خط الإنتاج</th>
                <th className="py-3 px-2">مجموعة الآلات</th>
                <th className="py-3 px-2">رمز الماكينة</th>
                <th className="py-3 px-2">مركز العمل</th>
                <th className="py-3 px-2">اسم وتوصيف العملية</th>
                <th className="py-3 px-2">الإعداد (د)</th>
                <th className="py-3 px-2">التشغيل (د)</th>
                <th className="py-3 px-2">ساعات الماكينة</th>
                <th className="py-3 px-2">العمالة</th>
                <th className="py-3 px-2 text-center">بوابة جودة</th>
                <th className="py-3 px-2">العائد المتوقع</th>
                <th className="py-3 px-2">الهالك المتوقع</th>
                <th className="py-3 px-2">زمن الدورة</th>
                <th className="py-3 px-2 text-center">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main font-medium">
              {enrichedSteps.map((step, idx) => {
                const totalCycle = (step.setupTime || 0) + (step.runTime || 0);

                return (
                  <tr key={step.sequenceNo || idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all">
                    
                    {/* Seq */}
                    <td className="py-2.5 px-2 font-mono font-bold text-slate-900 dark:text-white">
                      <span className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-black text-[11px]">
                        {step.sequenceNo}
                      </span>
                    </td>

                    {/* Plant */}
                    <td className="py-2.5 px-2 font-mono text-[10px] text-slate-500 font-bold">
                      {step.plantCode}
                    </td>

                    {/* Production Line */}
                    <td className="py-2.5 px-2 text-[10px] text-slate-700 dark:text-slate-300 font-bold truncate max-w-[130px]">
                      {step.productionLine}
                    </td>

                    {/* Machine Group */}
                    <td className="py-2.5 px-2 text-[10px]">
                      <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {step.machineGroup}
                      </span>
                    </td>

                    {/* Machine Code (e.g. SPR-01, QUILT-01) */}
                    <td className="py-2.5 px-2 font-mono font-black text-blue-700 dark:text-blue-300">
                      {step.machineCode}
                    </td>

                    {/* Work Center */}
                    <td className="py-2.5 px-2 font-mono text-[10px] text-slate-500">
                      {step.workCenterCode}
                    </td>

                    {/* Operation Name */}
                    <td className="py-2.5 px-2 font-bold text-slate-900 dark:text-white">
                      <input
                        type="text"
                        value={step.operationNameAr}
                        onChange={(e) => handleUpdateStep(step.sequenceNo, 'operationNameAr', e.target.value)}
                        className="w-44 px-1.5 py-0.5 bg-slate-50 dark:bg-slate-950 border border-border-main rounded text-xs font-bold outline-none"
                      />
                    </td>

                    {/* Setup Time */}
                    <td className="py-2.5 px-2 font-mono">
                      <input
                        type="number"
                        value={step.setupTime}
                        onChange={(e) => handleUpdateStep(step.sequenceNo, 'setupTime', Number(e.target.value))}
                        className="w-12 px-1 py-0.5 bg-slate-50 dark:bg-slate-950 border border-border-main rounded text-xs font-mono outline-none"
                      />
                    </td>

                    {/* Run Time */}
                    <td className="py-2.5 px-2 font-mono font-bold text-[#0B2D5C] dark:text-blue-400">
                      <input
                        type="number"
                        value={step.runTime}
                        onChange={(e) => handleUpdateStep(step.sequenceNo, 'runTime', Number(e.target.value))}
                        className="w-12 px-1 py-0.5 bg-slate-50 dark:bg-slate-950 border border-border-main rounded text-xs font-mono font-bold outline-none"
                      />
                    </td>

                    {/* Machine Hours */}
                    <td className="py-2.5 px-2 font-mono text-slate-500 font-bold">
                      {step.machineHours}h
                    </td>

                    {/* Labor */}
                    <td className="py-2.5 px-2 font-mono">
                      <input
                        type="number"
                        value={step.laborCount}
                        onChange={(e) => handleUpdateStep(step.sequenceNo, 'laborCount', Number(e.target.value))}
                        className="w-10 px-1 py-0.5 bg-slate-50 dark:bg-slate-950 border border-border-main rounded text-xs font-mono outline-none"
                      />
                    </td>

                    {/* Quality Gate */}
                    <td className="py-2.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleUpdateStep(step.sequenceNo, 'qualityGate', !step.qualityGate)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all border ${
                          step.qualityGate 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300' 
                            : 'bg-slate-100 text-slate-400 border-slate-300 dark:bg-slate-800'
                        }`}
                      >
                        {step.qualityGate ? '✓ إلزامي' : 'اختياري'}
                      </button>
                    </td>

                    {/* Expected Yield */}
                    <td className="py-2.5 px-2 font-mono text-emerald-600 font-bold">
                      {step.expectedYieldPct}%
                    </td>

                    {/* Expected Scrap */}
                    <td className="py-2.5 px-2 font-mono text-amber-600 font-bold">
                      {step.expectedScrapPct}%
                    </td>

                    {/* Cycle Time */}
                    <td className="py-2.5 px-2 font-mono font-black text-slate-800 dark:text-slate-200">
                      {totalCycle} د
                    </td>

                    {/* Delete */}
                    <td className="py-2.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteStep(step.sequenceNo)}
                        className="w-6 h-6 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center justify-center cursor-pointer transition-all mx-auto"
                        title="حذف المرحلة"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border-main">
        <span className="text-[11px] text-slate-400">
          تم توثيق مسار التشغيل والماكينات وساعات العمل ونقاط فحص الجودة.
        </span>

        <button
          type="button"
          onClick={onCompleteStep}
          className="px-6 py-2.5 bg-[#0B2D5C] hover:bg-[#133763] text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center gap-2 transition-all"
        >
          <span>حفظ والتقدم إلى الخطوة 5: المحاكاة وCAD (CAD Simulation)</span>
          <ChevronRight size={15} className="rtl:rotate-180" />
        </button>
      </div>

    </div>
  );
};
