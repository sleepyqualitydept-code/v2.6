import React, { useState, useMemo } from 'react';
import { 
  DollarSign, PieChart, TrendingUp, Sliders, ChevronRight, 
  ArrowLeftRight, ShieldCheck, Factory, Box, Scale, CheckCircle2, Globe, 
  Clock, Users, Wrench, AlertTriangle, Activity, Sparkles, TrendingDown
} from 'lucide-react';
import { CurrencyCode, CurrencyEngine } from '../../../services/currencyEngine';
import { RoutingStep } from '../../../types/erp';
import { PepYieldEngine } from '../../../services/pepYieldEngine';
import { PepScrapEngine } from '../../../services/pepScrapEngine';
import { PepCapacityEngine } from '../../../services/pepCapacityEngine';

interface PepStep6CostAnalyticsProps {
  layers: any[];
  routingSteps?: RoutingStep[];
  activeCurrency: CurrencyCode;
  onCompleteStep: () => void;
  brandName: string;
  plantName: string;
}

export const PepStep6CostAnalytics: React.FC<PepStep6CostAnalyticsProps> = ({
  layers,
  routingSteps = [],
  activeCurrency,
  onCompleteStep,
  brandName,
  plantName
}) => {
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'COST' | 'CAPACITY' | 'YIELD' | 'SCRAP'>('COST');

  // Cost parameter states
  const [directLaborCost, setDirectLaborCost] = useState<number>(45);
  const [machineCost, setMachineCost] = useState<number>(20);
  const [energyCost, setEnergyCost] = useState<number>(15);
  const [qualityCost, setQualityCost] = useState<number>(12);
  const [packagingCost, setPackagingCost] = useState<number>(25);
  const [overheadCost, setOverheadCost] = useState<number>(22);
  const [targetMargin, setTargetMargin] = useState<number>(35); // 35% margin

  // Capacity simulation parameters
  const [shiftHours, setShiftHours] = useState<number>(8);
  const [shiftsPerDay, setShiftsPerDay] = useState<number>(2);

  // Direct Material Cost from BOM
  const directMaterialCost = useMemo(() => {
    return layers.reduce((sum, l) => sum + (Number(l.cost) || 0), 0);
  }, [layers]);

  // Yield Analysis (Requirement 7)
  const yieldSummary = useMemo(() => {
    return PepYieldEngine.calculateYield(layers);
  }, [layers]);

  // Scrap Analysis (Requirement 8)
  const scrapReport = useMemo(() => {
    return PepScrapEngine.calculateScrapAnalysis({
      directMaterialCost,
      directLaborCost,
      machineCost,
      targetHeight: 25
    });
  }, [directMaterialCost, directLaborCost, machineCost]);

  // Yield loss cost & scrap cost
  const yieldLossCost = yieldSummary.netYieldLossCost || 18.5;
  const scrapCost = scrapReport.totalNetLossCost || 14.2;

  // Requirement 13 TOTAL MANUFACTURING COST:
  // Direct Material + Direct Labor + Machine + Energy + Quality + Packaging + Overhead + Yield Loss + Scrap
  const totalManufacturingCost = useMemo(() => {
    return Math.round((
      directMaterialCost +
      directLaborCost +
      machineCost +
      energyCost +
      qualityCost +
      packagingCost +
      overheadCost +
      yieldLossCost +
      scrapCost
    ) * 100) / 100;
  }, [directMaterialCost, directLaborCost, machineCost, energyCost, qualityCost, packagingCost, overheadCost, yieldLossCost, scrapCost]);

  // Pricing calculations
  const wholesalePrice = Math.round(totalManufacturingCost / (1 - (targetMargin / 100)));
  const retailPriceMSRP = Math.round(wholesalePrice * 1.35);

  // Capacity Analysis (Requirement 10)
  const capacityReport = useMemo(() => {
    const steps: RoutingStep[] = routingSteps.length > 0 ? routingSteps : [
      { sequenceNo: 10, operationCode: 'OP-CUT-01', operationNameAr: 'قص وتفصيل الإسفنج', operationNameEn: 'Foam Cutting', workCenterCode: 'FOAM-CUT-01', setupTime: 10, runTime: 15, laborCount: 2, machineCount: 1, qualityGate: true, mandatoryStep: true, estimatedCost: 35 },
      { sequenceNo: 20, operationCode: 'OP-SPRING-01', operationNameAr: 'تجميع شاسيه السوست الجيبية', operationNameEn: 'Pocket Spring Assembly', workCenterCode: 'SPRING-ASSY-01', setupTime: 15, runTime: 20, laborCount: 2, machineCount: 1, qualityGate: true, mandatoryStep: true, estimatedCost: 55 },
      { sequenceNo: 30, operationCode: 'OP-QUILT-01', operationNameAr: 'كبتنة وتطريز الوجه الفندقي', operationNameEn: 'Quilting', workCenterCode: 'QUILT-LINE-01', setupTime: 20, runTime: 25, laborCount: 2, machineCount: 1, qualityGate: true, mandatoryStep: true, estimatedCost: 45 },
      { sequenceNo: 40, operationCode: 'OP-BORDER-01', operationNameAr: 'تجهيز وحياكة شريط الداير', operationNameEn: 'Border Stitching', workCenterCode: 'BORDER-SEW-01', setupTime: 10, runTime: 15, laborCount: 1, machineCount: 1, qualityGate: false, mandatoryStep: true, estimatedCost: 25 },
      { sequenceNo: 50, operationCode: 'OP-TAPE-01', operationNameAr: 'تقفيل الحياكة المدارية Tape Edge', operationNameEn: 'Tape Edge Closing', workCenterCode: 'TAPE-EDGE-01', setupTime: 5, runTime: 18, laborCount: 1, machineCount: 1, qualityGate: true, mandatoryStep: true, estimatedCost: 40 },
      { sequenceNo: 60, operationCode: 'OP-QC-01', operationNameAr: 'الفحص الآلي والتغليف بالفاكيوم', operationNameEn: 'QC & Packaging', workCenterCode: 'QC-PACK-01', setupTime: 5, runTime: 10, laborCount: 2, machineCount: 1, qualityGate: true, mandatoryStep: true, estimatedCost: 30 }
    ];
    return PepCapacityEngine.calculateCapacity({
      routingSteps: steps,
      shiftHours,
      shiftsPerDay
    });
  }, [routingSteps, shiftHours, shiftsPerDay]);

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Banner & Sub-Module Switcher */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-border-main flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0B2D5C] text-white flex items-center justify-center font-bold">
            <DollarSign size={18} />
          </div>
          <div>
            <h3 className="font-black text-sm text-[#0B2D5C] dark:text-blue-300">
              تحليلات التصنيع والتكاليف الصناعية (Manufacturing Analysis & Cost Engine)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              حسابات التكلفة التفصيلية (10 عناصر)، الطاقة الإنتاجية (Capacity Engine)، فواقد الاستهلاك (Yield)، ومستويات الهالك (Scrap).
            </p>
          </div>
        </div>

        {/* Sub-Engine Navigation Buttons */}
        <div className="flex items-center gap-1.5 bg-surface p-1 rounded-xl border border-border-main text-xs">
          <button
            type="button"
            onClick={() => setActiveAnalysisTab('COST')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeAnalysisTab === 'COST'
                ? 'bg-[#0B2D5C] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <DollarSign size={13} />
            <span>1. التكاليف (Cost Engine)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAnalysisTab('CAPACITY')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeAnalysisTab === 'CAPACITY'
                ? 'bg-[#0B2D5C] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Activity size={13} />
            <span>2. الطاقة الإنتاجية (Capacity Engine)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAnalysisTab('YIELD')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeAnalysisTab === 'YIELD'
                ? 'bg-[#0B2D5C] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles size={13} />
            <span>3. فواقد الاستهلاك (Yield)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAnalysisTab('SCRAP')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeAnalysisTab === 'SCRAP'
                ? 'bg-[#0B2D5C] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <TrendingDown size={13} />
            <span>4. الهالك الموزع (Scrap)</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: COST ENGINE (Requirement 13) */}
      {activeAnalysisTab === 'COST' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Currency Header Notice */}
          <div className="flex items-center justify-between p-3 bg-surface rounded-2xl border border-border-main text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              تسعير المصنع المشغل: {plantName} • {brandName}
            </span>
            <span className="font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-lg">
              العملة الرسمية المعتمدة: {activeCurrency} (Brand → Plant → Currency)
            </span>
          </div>

          {/* 10 Cost Elements Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
            
            {/* 1. Direct Material */}
            <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1">
              <span className="text-[10px] font-bold text-slate-400">1. خامات مباشرة (Material):</span>
              <div className="text-lg font-black font-mono text-slate-900 dark:text-white">
                {CurrencyEngine.formatAmount(directMaterialCost, activeCurrency)}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{layers.length} بنود BOM</span>
            </div>

            {/* 2. Direct Labor */}
            <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1">
              <span className="text-[10px] font-bold text-slate-400">2. أجور العمالة (Labor):</span>
              <input
                type="number"
                value={directLaborCost}
                onChange={(e) => setDirectLaborCost(Number(e.target.value))}
                className="w-full h-8 px-2 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-lg font-mono font-bold text-xs outline-none"
              />
              <span className="text-[10px] text-slate-400 font-mono">ساعات فنيي الخط</span>
            </div>

            {/* 3. Machine Cost */}
            <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1">
              <span className="text-[10px] font-bold text-slate-400">3. تشغيل الماكينات (Machine):</span>
              <input
                type="number"
                value={machineCost}
                onChange={(e) => setMachineCost(Number(e.target.value))}
                className="w-full h-8 px-2 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-lg font-mono font-bold text-xs outline-none"
              />
              <span className="text-[10px] text-slate-400 font-mono">إهلاك ومعدات</span>
            </div>

            {/* 4. Energy Cost */}
            <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1">
              <span className="text-[10px] font-bold text-slate-400">4. الطاقة والمحروقات (Energy):</span>
              <input
                type="number"
                value={energyCost}
                onChange={(e) => setEnergyCost(Number(e.target.value))}
                className="w-full h-8 px-2 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-lg font-mono font-bold text-xs outline-none"
              />
              <span className="text-[10px] text-slate-400 font-mono">كهرباء وهواء مضغوط</span>
            </div>

            {/* 5. Quality Cost */}
            <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1">
              <span className="text-[10px] font-bold text-slate-400">5. الجودة والرقابة (Quality):</span>
              <input
                type="number"
                value={qualityCost}
                onChange={(e) => setQualityCost(Number(e.target.value))}
                className="w-full h-8 px-2 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-lg font-mono font-bold text-xs outline-none"
              />
              <span className="text-[10px] text-slate-400 font-mono">بوابات التفتيش</span>
            </div>

            {/* 6. Packaging Cost */}
            <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1">
              <span className="text-[10px] font-bold text-slate-400">6. التغليف والحماية (Packaging):</span>
              <input
                type="number"
                value={packagingCost}
                onChange={(e) => setPackagingCost(Number(e.target.value))}
                className="w-full h-8 px-2 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-lg font-mono font-bold text-xs outline-none"
              />
              <span className="text-[10px] text-slate-400 font-mono">بوليثيلين وزوايا كرتون</span>
            </div>

            {/* 7. Overhead Cost */}
            <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1">
              <span className="text-[10px] font-bold text-slate-400">7. مصاريف عامة (Overhead):</span>
              <input
                type="number"
                value={overheadCost}
                onChange={(e) => setOverheadCost(Number(e.target.value))}
                className="w-full h-8 px-2 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-lg font-mono font-bold text-xs outline-none"
              />
              <span className="text-[10px] text-slate-400 font-mono">إدارة ومصنع غير مباشر</span>
            </div>

            {/* 8. Yield Loss Cost */}
            <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1">
              <span className="text-[10px] font-bold text-slate-400">8. فروق العائد (Yield Loss):</span>
              <div className="text-lg font-black font-mono text-rose-600">
                {CurrencyEngine.formatAmount(yieldLossCost, activeCurrency)}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">فاقد قص الخامات</span>
            </div>

            {/* 9. Scrap Cost */}
            <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1">
              <span className="text-[10px] font-bold text-slate-400">9. صافي الهالك (Scrap Cost):</span>
              <div className="text-lg font-black font-mono text-amber-600">
                {CurrencyEngine.formatAmount(scrapCost, activeCurrency)}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">عيوب وتعديل تشغيل</span>
            </div>

            {/* 10. Total Manufacturing Cost */}
            <div className="p-3.5 bg-[#0B2D5C] text-white rounded-2xl border border-slate-700 space-y-1 shadow-md">
              <span className="text-[10px] font-bold text-slate-300">10. إجمالي تكلفة التصنيع:</span>
              <div className="text-lg font-black font-mono text-emerald-400">
                {CurrencyEngine.formatAmount(totalManufacturingCost, activeCurrency)}
              </div>
              <span className="text-[10px] text-slate-300 font-mono">شامل كافة التكاليف</span>
            </div>

          </div>

          {/* Pricing Controls & Margin */}
          <div className="p-5 bg-surface rounded-2xl border border-border-main space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-main pb-3">
              <div>
                <h4 className="font-black text-xs text-[#0B2D5C] dark:text-blue-300">
                  هامش الربحية والتسعير التجاري المعتمد (Margin & Pricing Output):
                </h4>
                <p className="text-[11px] text-slate-400">
                  حساب سعر بيع الجملة وسعر التجزئة المقترح للمستهلك بناء على هامش الربح الصناعي.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">هامش الربح المستهدف:</span>
                <span className="text-lg font-mono font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-0.5 rounded-xl border border-emerald-300">
                  {targetMargin}%
                </span>
              </div>
            </div>

            <input
              type="range"
              min="15"
              max="60"
              step="1"
              value={targetMargin}
              onChange={(e) => setTargetMargin(Number(e.target.value))}
              className="w-full accent-[#0B2D5C] cursor-pointer"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border-main flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">سعر الجملة المقترح للموزعين (Wholesale Price):</span>
                  <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                    {CurrencyEngine.formatAmount(wholesalePrice, activeCurrency)}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">
                  صافي ربح المصنع: {CurrencyEngine.formatAmount(wholesalePrice - totalManufacturingCost, activeCurrency)}
                </span>
              </div>

              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block">
                    سعر التجزئة المقترح للمستهلك (MSRP Retail Price):
                  </span>
                  <span className="text-xl font-black font-mono text-emerald-700 dark:text-emerald-300">
                    {CurrencyEngine.formatAmount(retailPriceMSRP, activeCurrency)}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600">
                  شامل هامش المعرض والتوزيع
                </span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUB-VIEW 2: CAPACITY ENGINE (Requirement 10) */}
      {activeAnalysisTab === 'CAPACITY' && (
        <div className="space-y-4 animate-fade-in text-xs">
          
          {/* Capacity Parameters & Bottleneck Alert Banner */}
          <div className="p-4 bg-[#0B2D5C] text-white rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-md">
            <div>
              <span className="font-mono text-[10px] bg-amber-400 text-slate-900 px-2 py-0.5 rounded font-bold">
                BOTTLENECK DETECTED
              </span>
              <h4 className="font-black text-sm text-white mt-1">
                عملية الاختناق الحرجة: {capacityReport.bottleneckOperation}
              </h4>
              <p className="text-[11px] text-slate-300">
                الماكينة الحاكمة: {capacityReport.bottleneckMachine} • {capacityReport.bottleneckLine}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
                <span className="text-slate-300 font-bold">ساعات الوردية:</span>
                <select
                  value={shiftHours}
                  onChange={(e) => setShiftHours(Number(e.target.value))}
                  className="bg-transparent font-mono font-bold text-white outline-none cursor-pointer"
                >
                  <option value={8} className="text-slate-900">8 ساعات</option>
                  <option value={10} className="text-slate-900">10 ساعات</option>
                  <option value={12} className="text-slate-900">12 ساعة</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
                <span className="text-slate-300 font-bold">عدد الورديات/يوم:</span>
                <select
                  value={shiftsPerDay}
                  onChange={(e) => setShiftsPerDay(Number(e.target.value))}
                  className="bg-transparent font-mono font-bold text-white outline-none cursor-pointer"
                >
                  <option value={1} className="text-slate-900">وردية واحدة (1)</option>
                  <option value={2} className="text-slate-900">ورديتان (2)</option>
                  <option value={3} className="text-slate-900">ثلاث ورديات (3)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Capacity Outputs Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1">
              <span className="text-[10px] font-bold text-slate-400">الطاقة الإنتاجية اليومية:</span>
              <div className="text-2xl font-black font-mono text-[#0B2D5C] dark:text-blue-300">
                {capacityReport.dailyCapacityUnits} مرتبة
              </div>
              <span className="text-[10px] text-slate-400 font-mono">في اليوم الواحد</span>
            </div>

            <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1">
              <span className="text-[10px] font-bold text-slate-400">الطاقة الأسبوعية:</span>
              <div className="text-2xl font-black font-mono text-emerald-600">
                {capacityReport.weeklyCapacityUnits} مرتبة
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{capacityReport.workingDaysPerWeek} أيام عمل</span>
            </div>

            <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1">
              <span className="text-[10px] font-bold text-slate-400">الطاقة الشهرية القصوى:</span>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {capacityReport.monthlyCapacityUnits} مرتبة
              </div>
              <span className="text-[10px] text-slate-400 font-mono">بمعدل كفاءة 88% OEE</span>
            </div>

            <div className="p-3.5 bg-surface rounded-2xl border border-border-main space-y-1">
              <span className="text-[10px] font-bold text-slate-400">معدل استغلال الماكينات:</span>
              <div className="text-2xl font-black font-mono text-amber-600">
                {capacityReport.overallMachineUtilization}%
              </div>
              <span className="text-[10px] text-slate-400 font-mono">استغلال العمالة: {capacityReport.overallLaborUtilization}%</span>
            </div>
          </div>

          {/* Machine Workload & Utilization Table */}
          <div className="bg-surface rounded-2xl border border-border-main overflow-hidden shadow-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-border-main font-bold text-xs flex justify-between items-center">
              <span>تحليل استغلال الماكينات ونسب التحميل (Machine Utilization Breakdown):</span>
              <span className="font-mono text-[10px] text-slate-400">Available Time / Cycle Time</span>
            </div>
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 font-black border-b border-border-main text-[11px]">
                  <th className="py-2.5 px-3">الماكينة</th>
                  <th className="py-2.5 px-3">خط الإنتاج</th>
                  <th className="py-2.5 px-3">العملية الصناعية</th>
                  <th className="py-2.5 px-3 font-mono">زمن الدورة</th>
                  <th className="py-2.5 px-3">نسبة الاستغلال</th>
                  <th className="py-2.5 px-3 text-center">حالة الاختناق</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {capacityReport.machineWorkloads.map((m) => (
                  <tr key={m.machineCode} className={`hover:bg-slate-50 dark:hover:bg-slate-900/50 ${m.isBottleneck ? 'bg-amber-50/40 dark:bg-amber-950/20 font-bold' : ''}`}>
                    <td className="py-2.5 px-3 font-bold">{m.machineNameAr}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{m.lineCode}</td>
                    <td className="py-2.5 px-3">{m.operationNameAr}</td>
                    <td className="py-2.5 px-3 font-mono font-bold">{m.cycleTimeMinutes} دقيقة</td>
                    <td className="py-2.5 px-3 font-mono">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${m.isBottleneck ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${m.utilizationPercentage}%` }}
                          />
                        </div>
                        <span className="font-bold">{m.utilizationPercentage}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {m.isBottleneck ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          نقطة عنق الزجاجة (Bottleneck)
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">طاقة كافية</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* SUB-VIEW 3: YIELD ENGINE (Requirement 7) */}
      {activeAnalysisTab === 'YIELD' && (
        <div className="space-y-4 animate-fade-in text-xs">
          
          <div className="p-3 bg-surface rounded-2xl border border-border-main flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              معادلة العائد: الاستهلاك الفعلي = الاستهلاك النظري ÷ (نسبة العائد ÷ 100)
            </span>
            <span className="font-mono text-emerald-600 font-bold">
              إجمالي فاقد العائد المسترد: {CurrencyEngine.formatAmount(yieldSummary.recoverableScrapValue, activeCurrency)}
            </span>
          </div>

          <div className="bg-surface rounded-2xl border border-border-main overflow-hidden shadow-xs">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-black border-b border-border-main text-[11px]">
                  <th className="py-3 px-3">كود المادة</th>
                  <th className="py-3 px-3">اسم المادة</th>
                  <th className="py-3 px-3">الفئة</th>
                  <th className="py-3 px-3">الاستهلاك النظري</th>
                  <th className="py-3 px-3">العائد %</th>
                  <th className="py-3 px-3">الاستهلاك الفعلي</th>
                  <th className="py-3 px-3">الفاقد %</th>
                  <th className="py-3 px-3">تكلفة الفاقد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {yieldSummary.records.map((r) => (
                  <tr key={r.materialCode} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700 dark:text-blue-400">{r.materialCode}</td>
                    <td className="py-2.5 px-3 font-bold">{r.materialName}</td>
                    <td className="py-2.5 px-3">{r.category}</td>
                    <td className="py-2.5 px-3 font-mono">{r.theoreticalConsumption} {r.uom}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-600">{r.yieldPercentage}%</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{r.actualConsumption} {r.uom}</td>
                    <td className="py-2.5 px-3 font-mono text-rose-600">{r.lossPercentage}%</td>
                    <td className="py-2.5 px-3 font-mono font-black text-rose-600">
                      {CurrencyEngine.formatAmount(r.yieldLossCost, activeCurrency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* SUB-VIEW 4: SCRAP ENGINE (Requirement 8) */}
      {activeAnalysisTab === 'SCRAP' && (
        <div className="space-y-4 animate-fade-in text-xs">
          
          <div className="p-3 bg-surface rounded-2xl border border-border-main flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              توزيع نسب الهالك وإعادة التشغيل عبر المستويات الصناعية الأربعة
            </span>
            <span className="font-mono text-amber-600 font-bold">
              صافي خسارة الهالك النهائي: {CurrencyEngine.formatAmount(scrapReport.totalNetLossCost, activeCurrency)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scrapReport.levels.map((lvl) => (
              <div key={lvl.level} className="p-4 bg-surface rounded-2xl border border-border-main space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-border-main pb-2">
                  <span className="font-black text-xs text-[#0B2D5C] dark:text-blue-300">
                    {lvl.levelAr} ({lvl.level})
                  </span>
                  <span className="font-mono text-amber-600 font-bold text-[11px]">
                    Scrap: {lvl.scrapPercentage}%
                  </span>
                </div>

                <p className="text-slate-500 text-[11px]">
                  {lvl.descriptionAr}
                </p>

                <div className="grid grid-cols-3 gap-2 font-mono text-[11px] pt-1 border-t border-border-main">
                  <div>
                    <span className="text-slate-400 block text-[10px]">الهالك المالي:</span>
                    <span className="font-bold text-rose-600">{CurrencyEngine.formatAmount(lvl.wasteCost, activeCurrency)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">قيمة الاسترداد:</span>
                    <span className="font-bold text-emerald-600">{CurrencyEngine.formatAmount(lvl.recoveryCost, activeCurrency)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">الخسارة الصافية:</span>
                    <span className="font-black text-amber-600">{CurrencyEngine.formatAmount(lvl.netLossCost, activeCurrency)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Step Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border-main">
        <span className="text-[11px] text-slate-400">
          تم احتساب تكاليف التصنيع ومحركات الطاقة الإنتاجية والعائد والهالك بنجاح.
        </span>

        <button
          type="button"
          onClick={onCompleteStep}
          className="px-6 py-2.5 bg-[#0B2D5C] hover:bg-[#133763] text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center gap-2 transition-all"
        >
          <span>حفظ والتقدم إلى الخطوة 7: سجل الامتثال والسياسات (Compliance & Policies)</span>
          <ChevronRight size={15} className="rtl:rotate-180" />
        </button>
      </div>

    </div>
  );
};
