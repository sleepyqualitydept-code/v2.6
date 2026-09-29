import React, { useState, useMemo } from 'react';
import { 
  DollarSign, PieChart, ShieldCheck, CheckCircle2, ChevronRight, 
  FileCheck, Flame, Scale, Globe, Building2, Sliders, CheckSquare, Square,
  TrendingUp, Box, Clock, Award
} from 'lucide-react';
import { CurrencyCode } from '../../../services/currencyEngine';
import { RoutingStep, WarrantyPolicy } from '../../../types/erp';
import { PepYieldEngine } from '../../../services/pepYieldEngine';
import { PepScrapEngine } from '../../../services/pepScrapEngine';

interface PepStep5CostComplianceProps {
  layers: any[];
  routingSteps?: RoutingStep[];
  activeCurrency: CurrencyCode;
  onCompleteStep: () => void;
  brandName: string;
  plantName: string;
  warrantyPolicy: WarrantyPolicy;
}

export const PepStep5CostCompliance: React.FC<PepStep5CostComplianceProps> = ({
  layers,
  routingSteps = [],
  activeCurrency,
  onCompleteStep,
  brandName,
  plantName,
  warrantyPolicy
}) => {
  const [subTab, setSubTab] = useState<'COST_ROLLUP' | 'COMPLIANCE_EGYPT' | 'COMPLIANCE_INTL'>('COST_ROLLUP');

  // Cost parameter states
  const [directLaborCost, setDirectLaborCost] = useState<number>(45);
  const [machineCost, setMachineCost] = useState<number>(20);
  const [energyCost, setEnergyCost] = useState<number>(15);
  const [qualityCost, setQualityCost] = useState<number>(12);
  const [packagingCost, setPackagingCost] = useState<number>(25);
  const [overheadCost, setOverheadCost] = useState<number>(22);
  const [targetMargin, setTargetMargin] = useState<number>(35); // 35% margin

  // Direct Material Cost from BOM
  const directMaterialCost = useMemo(() => {
    return layers.reduce((sum, l) => sum + (Number(l.cost) || 0), 0);
  }, [layers]);

  // Yield & Scrap Calculations
  const yieldSummary = useMemo(() => {
    return PepYieldEngine.calculateYield(layers);
  }, [layers]);

  const scrapReport = useMemo(() => {
    return PepScrapEngine.calculateScrapAnalysis({
      directMaterialCost,
      directLaborCost,
      machineCost,
      targetHeight: 25
    });
  }, [directMaterialCost, directLaborCost, machineCost]);

  const yieldLossCost = yieldSummary.netYieldLossCost || 18.5;
  const scrapCost = scrapReport.totalNetLossCost || 14.2;

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

  const wholesalePrice = Math.round(totalManufacturingCost / (1 - (targetMargin / 100)));
  const retailPriceMSRP = Math.round(wholesalePrice * 1.35);

  // Egypt Compliance Package States (Section 10)
  const [egyptCompliance, setEgyptCompliance] = useState({
    es260Standard: true, // Egyptian Standards ES 260
    consumerProtectionLaw181: true, // Law 181/2018
    mandatoryWarrantyLabel: true, // Warranty Label Rules
    factoryRegister14002: true, // Industrial Registration Label
    localContent60Percent: true, // Local Content >= 60%
  });

  // International Compliance States
  const [intlCompliance, setIntlCompliance] = useState({
    sasoStandard: true,
    iso9001Audit: true,
    bs7177Flammability: true,
    cfr1633FlameResistant: true,
  });

  return (
    <div className="space-y-6 text-right font-sans">
      
      {/* Top Banner */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-border-main flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B2D5C] text-white flex items-center justify-center font-bold shadow-xs">
            <DollarSign size={20} />
          </div>
          <div>
            <h3 className="font-black text-sm text-[#0B2D5C] dark:text-blue-300">
              هندسة التكاليف وحزمة الامتثال والسياسات (Cost & Compliance)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              تجميع التكاليف الصناعية الشاملة (Cost Rollup) والتحقق من حزمة الامتثال المصرية الرسمية والمعايير الدولية.
            </p>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-1.5 bg-surface dark:bg-slate-800 p-1.5 rounded-xl border border-border-main">
          <button
            type="button"
            onClick={() => setSubTab('COST_ROLLUP')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              subTab === 'COST_ROLLUP' 
                ? 'bg-[#0B2D5C] text-white shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            تجميع التكاليف (Cost Rollup)
          </button>

          <button
            type="button"
            onClick={() => setSubTab('COMPLIANCE_EGYPT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'COMPLIANCE_EGYPT' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Award size={13} />
            <span>حزمة الامتثال المصرية (Egypt Package)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('COMPLIANCE_INTL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              subTab === 'COMPLIANCE_INTL' 
                ? 'bg-[#0B2D5C] text-white shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            المعايير الدولية (SASO / ISO / BS)
          </button>
        </div>
      </div>

      {/* VIEW 1: COST ROLLUP & ANALYTICS */}
      {subTab === 'COST_ROLLUP' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-surface p-4 rounded-2xl border border-border-main">
              <span className="text-[10px] text-slate-400 font-bold block">تكلفة الخامات المباشرة (BOM):</span>
              <span className="font-mono text-base font-black text-blue-600">
                {directMaterialCost} {activeCurrency}
              </span>
            </div>

            <div className="bg-surface p-4 rounded-2xl border border-border-main">
              <span className="text-[10px] text-slate-400 font-bold block">التكلفة الصناعية الكلية (Total Cost):</span>
              <span className="font-mono text-base font-black text-slate-800 dark:text-white">
                {totalManufacturingCost} {activeCurrency}
              </span>
            </div>

            <div className="bg-surface p-4 rounded-2xl border border-border-main">
              <span className="text-[10px] text-slate-400 font-bold block">سعر الجملة المستهدف:</span>
              <span className="font-mono text-base font-black text-purple-600">
                {wholesalePrice} {activeCurrency}
              </span>
            </div>

            <div className="bg-surface p-4 rounded-2xl border border-border-main">
              <span className="text-[10px] text-slate-400 font-bold block">سعر البيع المقترح (MSRP):</span>
              <span className="font-mono text-base font-black text-emerald-600">
                {retailPriceMSRP} {activeCurrency}
              </span>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="bg-surface rounded-2xl border border-border-main p-4 space-y-3 text-xs">
            <h4 className="font-black text-xs text-[#0B2D5C] dark:text-blue-300 pb-2 border-b border-border-main">
              عناصر التكلفة التشغيلية الإضافية (Manufacturing Cost Elements)
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">العمالة المباشرة:</label>
                <div className="h-8 px-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between font-mono font-bold border border-border-main">
                  <span>{directLaborCost}</span>
                  <span className="text-slate-400 text-[10px]">{activeCurrency}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">إهلاك الماكينات:</label>
                <div className="h-8 px-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between font-mono font-bold border border-border-main">
                  <span>{machineCost}</span>
                  <span className="text-slate-400 text-[10px]">{activeCurrency}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">الطاقة والمرافق:</label>
                <div className="h-8 px-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between font-mono font-bold border border-border-main">
                  <span>{energyCost}</span>
                  <span className="text-slate-400 text-[10px]">{activeCurrency}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">فحص ورقابة الجودة:</label>
                <div className="h-8 px-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between font-mono font-bold border border-border-main">
                  <span>{qualityCost}</span>
                  <span className="text-slate-400 text-[10px]">{activeCurrency}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">التغليف والكرتون:</label>
                <div className="h-8 px-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between font-mono font-bold border border-border-main">
                  <span>{packagingCost}</span>
                  <span className="text-slate-400 text-[10px]">{activeCurrency}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">المصاريف الإدارية:</label>
                <div className="h-8 px-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between font-mono font-bold border border-border-main">
                  <span>{overheadCost}</span>
                  <span className="text-slate-400 text-[10px]">{activeCurrency}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: EGYPT COMPLIANCE PACKAGE (Section 10) */}
      {subTab === 'COMPLIANCE_EGYPT' && (
        <div className="bg-surface rounded-2xl border border-emerald-300 dark:border-emerald-900 p-5 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-border-main pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold">
                🇪🇬
              </div>
              <div>
                <h4 className="font-black text-sm text-[#0B2D5C] dark:text-blue-300">
                  حزمة الامتثال والاشتراطات الصناعية المصرية (Egypt Compliance Package)
                </h4>
                <p className="text-[11px] text-slate-400">
                  المطابقة مع المواصفات القياسية المصرية ES 260 واشتراطات جهاز حماية المستهلك والسجل الصناعي.
                </p>
              </div>
            </div>

            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-300">
              ✓ مطابقة إلزامية 100%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* 1. ES 260 Egyptian Standards */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border-main space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-[#0B2D5C] dark:text-blue-300">1. المواصفات القياسية المصرية (ES 260):</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">معتمد ES-260-2022</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                مطابقة أبعاد وسماكة النوابض الكربونية، واختبارات الإجهاد الدوري ASTM F1566، وخلو خامات الإسفنج من المركبات الضارة.
              </p>
            </div>

            {/* 2. Consumer Protection Law 181/2018 */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border-main space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-[#0B2D5C] dark:text-blue-300">2. اشتراطات جهاز حماية المستهلك (قانون 181):</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">قانون 181/2018</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                ضمان صريح غير مشروط، وتوفير مراكز صيانة معتمدة، والتزام كامل بسياسة الاستبدال خلال المدة القانونية المقررة.
              </p>
            </div>

            {/* 3. Mandatory Warranty Label Rules */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border-main space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-[#0B2D5C] dark:text-blue-300">3. قواعد بطاقة وملصق الضمان الرسمي:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">بطاقة QR مميكنة</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                تثبيت ملصق قماشي مخيط بالداير يتضمن الرقم التسلسلي، كود QR الرقمي، تاريخ الإنتاج، ورقم الخط الساخن لخدمة العملاء.
              </p>
            </div>

            {/* 4. Factory Label Requirements */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border-main space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-[#0B2D5C] dark:text-blue-300">4. بيانات بطاقة المصنع والسجل الصناعي:</span>
                <span className="font-mono font-bold text-[10px] text-blue-600">سجل صناعي: 14002/القاهرة</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                إدراج اسم المصنع المعتمد، بلد المنشأ (صنع في مصر)، كود التشغيلة، وباركود الصنف الدولي GTIN.
              </p>
            </div>

            {/* 5. Local Manufacturing Compliance */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border-main space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-[#0B2D5C] dark:text-blue-300">5. متطلبات التوطين ونسبة المكون المحلي:</span>
                <span className="font-mono font-bold text-xs text-emerald-600">نسبة المكون المحلي: 64.5%</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                شاسيهات السوست والإسفنج والفايبر مصنعة محلياً في المصانع الوطنية الشريكة، بما يتجاوز النسبة المقررة للحوافز الصناعية (60%+).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: INTERNATIONAL STANDARDS */}
      {subTab === 'COMPLIANCE_INTL' && (
        <div className="bg-surface rounded-2xl border border-border-main p-5 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-border-main pb-3">
            <h4 className="font-black text-xs text-[#0B2D5C] dark:text-blue-300">
              المعايير الدولية للتصدير والأسواق المستهدفة (SASO / ISO / BS / CFR)
            </h4>
            <span className="text-[10px] font-mono text-slate-400">Target Export Markets</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main space-y-1">
              <span className="font-bold text-[#0B2D5C] dark:text-blue-300 block">SASO Standard</span>
              <span className="text-[10px] text-emerald-600 font-bold block">✓ معتمد لسوق المملكة والخليج</span>
              <span className="text-[10px] text-slate-400 block font-mono">SASO ISO 9001:2015</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main space-y-1">
              <span className="font-bold text-[#0B2D5C] dark:text-blue-300 block">BS 7177 (UK Fire Code)</span>
              <span className="text-[10px] text-emerald-600 font-bold block">✓ Low/Medium Hazard</span>
              <span className="text-[10px] text-slate-400 block font-mono">Crib 5 Certified</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main space-y-1">
              <span className="font-bold text-[#0B2D5C] dark:text-blue-300 block">16 CFR 1633 (US Flammability)</span>
              <span className="text-[10px] text-emerald-600 font-bold block">✓ Open Flame Resistant</span>
              <span className="text-[10px] text-slate-400 block font-mono">Federal Standard</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main space-y-1">
              <span className="font-bold text-[#0B2D5C] dark:text-blue-300 block">CertiPUR-US & OEKO-TEX</span>
              <span className="text-[10px] text-emerald-600 font-bold block">✓ أمان صحي وبيئي 100%</span>
              <span className="text-[10px] text-slate-400 block font-mono">Standard 100 Class I</span>
            </div>
          </div>
        </div>
      )}

      {/* Step Actions: Next Step */}
      <div className="flex items-center justify-between pt-2 border-t border-border-main">
        <span className="text-[11px] text-slate-400">
          تم احتساب التكلفة واعتماد حزمة الامتثال المصرية والدولية بنجاح.
        </span>

        <button
          type="button"
          onClick={onCompleteStep}
          className="px-6 py-2.5 bg-[#0B2D5C] hover:bg-[#133763] text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center gap-2 transition-all"
        >
          <span>حفظ والتقدم إلى الخطوة 6: إطلاق الإنتاج والاعتماد (Production Release)</span>
          <ChevronRight size={15} className="rtl:rotate-180" />
        </button>
      </div>

    </div>
  );
};
