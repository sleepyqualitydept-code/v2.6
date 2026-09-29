import React, { useState } from 'react';
import { 
  Factory, CheckCircle2, ShieldCheck, Download, Save, 
  RefreshCw, Copy, ArrowLeftRight, FileText, Check, AlertCircle, 
  Barcode, QrCode, Lock, Send, Layers
} from 'lucide-react';
import { BomStatus, BillOfMaterials } from '../../../types/erp';
import { CurrencyCode, CurrencyEngine } from '../../../services/currencyEngine';

interface PepStep8ProductionReleaseProps {
  designVersion: string;
  setDesignVersion: (v: string) => void;
  designStatus: BomStatus;
  setDesignStatus: (s: BomStatus) => void;
  revisionNotes: string;
  setRevisionNotes: (n: string) => void;
  engineeringNotes: string;
  setEngineeringNotes: (n: string) => void;
  activeCurrency: CurrencyCode;
  totalCost: number;
  modelCode: string;
  modelName: string;
  onSavePackage: () => void;
  onOpenCompareModal: () => void;
  onOpenCloneModal: () => void;
  onTriggerImmediateOrder: () => void;
  isSavedSuccess?: boolean;
}

export const PepStep8ProductionRelease: React.FC<PepStep8ProductionReleaseProps> = ({
  designVersion,
  setDesignVersion,
  designStatus,
  setDesignStatus,
  revisionNotes,
  setRevisionNotes,
  engineeringNotes,
  setEngineeringNotes,
  activeCurrency,
  totalCost,
  modelCode,
  modelName,
  onSavePackage,
  onOpenCompareModal,
  onOpenCloneModal,
  onTriggerImmediateOrder,
  isSavedSuccess
}) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExportJson = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportNotice('تم تصدير حزمة PEP بنجاح بصيغة JSON الموحدة لربط أنظمة الـ ERP.');
      setTimeout(() => setExportNotice(null), 4000);
    }, 600);
  };

  const handleExportPdf = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportNotice('تم توليد وثيقة المواصفات الفنية للإنتاج (PEP Engineering Data Sheet - PDF).');
      setTimeout(() => setExportNotice(null), 4000);
    }, 800);
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Banner */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-border-main flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0B2D5C] text-white flex items-center justify-center font-bold">
            <Factory size={18} />
          </div>
          <div>
            <h3 className="font-black text-sm text-[#0B2D5C] dark:text-blue-300">
              اعتماد وإطلاق حزمة الإنتاج (Production Release & Approval Center)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              تجميد الإصدار (Freeze)، أوامر التغيير الهندسي (ECO)، وتوليد أوامر التشغيل الفورية وسيريالات الضمان.
            </p>
          </div>
        </div>

        {/* Readiness Badge */}
        <span className="px-3.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-xl text-xs font-black flex items-center gap-1.5 font-mono">
          <CheckCircle2 size={15} />
          <span>PRODUCTION READY 100%</span>
        </span>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Release Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left Card: Version Freeze & Approval Workflow */}
        <div className="bg-surface rounded-2xl border border-border-main p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-border-main pb-2">
            <h4 className="font-black text-xs text-[#0B2D5C] dark:text-blue-300 flex items-center gap-1.5">
              <Lock size={14} />
              <span>تجميد الإصدار ودورة الاعتماد (Approval Workflow):</span>
            </h4>
            <span className="font-mono text-[10px] text-slate-400">Version Control</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">رقم إصدار الحزمة (Version Code):</label>
              <input
                type="text"
                value={designVersion}
                onChange={(e) => setDesignVersion(e.target.value)}
                className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-mono font-black text-xs outline-none focus:border-[#0B2D5C]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">حالة دورة الحياة (Lifecycle Stage):</label>
              <select
                value={designStatus}
                onChange={(e) => setDesignStatus(e.target.value as BomStatus)}
                className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold text-xs outline-none cursor-pointer focus:border-[#0B2D5C]"
              >
                <option value="Active">معتمد ونشط للإنتاج (Active Production)</option>
                <option value="Under Review">قيد المراجعة الهندسية (Under Review)</option>
                <option value="Draft">مسودة R&D أولية (Draft)</option>
                <option value="Obsolete">ملغى أو مؤرشف (Obsolete)</option>
              </select>
            </div>
          </div>

          {/* ECO Notes */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500">سجل أمر التغيير الهندسي (ECO Change Notes):</label>
            <textarea
              rows={2}
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl text-xs font-medium outline-none resize-none"
              placeholder="اكتب مبررات التعديل في الخامات أو الطبقات أو مسار التشغيل..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500">ملاحظات توجيه خطوط الإنتاج (Engineering Shop-Floor Notes):</label>
            <textarea
              rows={2}
              value={engineeringNotes}
              onChange={(e) => setEngineeringNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl text-xs font-medium outline-none resize-none"
              placeholder="تعليمات الجودة الخاصة بالتقفيل والفحص النهائي..."
            />
          </div>
        </div>

        {/* Right Card: Manufacturing Readiness & Barcode / Serial Generation */}
        <div className="bg-surface rounded-2xl border border-border-main p-5 space-y-4 text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border-main pb-2 mb-3">
              <h4 className="font-black text-xs text-[#0B2D5C] dark:text-blue-300 flex items-center gap-1.5">
                <Barcode size={16} />
                <span>جاهزية السيريالات والباركود وتكامل الـ ERP:</span>
              </h4>
              <span className="font-mono text-[10px] text-emerald-600 font-bold">Online</span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode size={16} className="text-blue-600" />
                  <span className="font-bold">توليد شهادات الضمان الرقمي (Digital Passport):</span>
                </div>
                <span className="font-mono text-emerald-600 font-bold text-[11px]">مفعل وجاهز</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Barcode size={16} className="text-emerald-600" />
                  <span className="font-bold">توليد باركود ملصقات الكرتون والغلاف:</span>
                </div>
                <span className="font-mono text-emerald-600 font-bold text-[11px]">GS1-128 Ready</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-amber-600" />
                  <span className="font-bold">الربط الآلي مع سياسة الضمان الإلكتروني:</span>
                </div>
                <span className="font-mono text-emerald-600 font-bold text-[11px]">100% متطابق</span>
              </div>
            </div>
          </div>

          {/* Quick Actions inside Right Card */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenCompareModal}
              className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-border-main"
            >
              <ArrowLeftRight size={13} />
              <span>مقارنة مع إصدار قديم</span>
            </button>

            <button
              type="button"
              onClick={onOpenCloneModal}
              className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-border-main"
            >
              <Copy size={13} className="text-amber-500" />
              <span>استنساخ الموديل (Clone)</span>
            </button>
          </div>
        </div>

      </div>

      {/* Main Release Action Center Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-[#0B2D5C] to-slate-900 text-white rounded-3xl border border-slate-700 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-md text-[10px] font-mono font-bold">
              FINAL RELEASE EXECUTION
            </span>
            <span className="text-xs text-slate-300 font-mono">
              PEP Code: PEP-{modelCode}-{designVersion}
            </span>
          </div>
          <h3 className="text-base font-black">
            تأكيد إطلاق حزمة التصنيع وتحديث أوامر التشغيل
          </h3>
          <p className="text-xs text-slate-300/80">
            سيتم حفظ الحزمة بجميع مكوناتها (BOM + Routing + CAD + Cost + Warranty) وتفعيلها في قاعدة البيانات.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleExportPdf}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20 cursor-pointer"
          >
            <Download size={14} />
            <span>تصدير PDF</span>
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20 cursor-pointer"
          >
            <FileText size={14} />
            <span>تصدير JSON</span>
          </button>

          <button
            type="button"
            onClick={onTriggerImmediateOrder}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Factory size={15} />
            <span>إنشاء أمر تصنيع فوري</span>
          </button>

          <button
            type="button"
            onClick={onSavePackage}
            className="px-6 py-2.5 bg-white text-[#0B2D5C] hover:bg-slate-100 rounded-xl text-xs font-black shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save size={15} />
            <span>حفظ الحزمة الهندسية بالكامل (Save PEP)</span>
          </button>
        </div>
      </div>

    </div>
  );
};
