import React from 'react';
import { Copy, ArrowLeftRight, Database, CheckCircle2, Factory } from 'lucide-react';
import { BillOfMaterials, BomStatus } from '../../../types/erp';

interface BomReleaseCenterProps {
  handleCloneVersion: () => void;
  handleCompareVersions: () => void;
  handleSaveDesignBOM: () => void;
  activeBom: BillOfMaterials | null;
  savedBoms: BillOfMaterials[];
  selectedModelId: string;
  designStatus: BomStatus;
  setDesignStatus: (s: BomStatus) => void;
}

export const BomReleaseCenter: React.FC<BomReleaseCenterProps> = ({
  handleCloneVersion,
  handleCompareVersions,
  handleSaveDesignBOM,
  activeBom,
  savedBoms,
  selectedModelId,
  designStatus,
  setDesignStatus
}) => {
  return (
    <div className="bg-surface border border-border-main p-5 rounded-3xl space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-main pb-3">
        <div>
          <h3 className="font-black text-xs text-[#0B2D5C] dark:text-blue-300 flex items-center gap-1.5">
            <Factory size={16} className="text-emerald-600" />
            <span>مركز الاعتماد وإطلاق التصنيع (BOM Release & Action Center)</span>
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">
            اعتماد وحفظ بنية الـ BOM، استنساخ الإصدارات، والمقارنة الهندسية
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-bold">الحالة الإدارية:</span>
          <select
            value={designStatus}
            onChange={(e) => setDesignStatus(e.target.value as BomStatus)}
            className="h-8 px-2.5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl text-xs font-black outline-none cursor-pointer text-blue-600"
          >
            <option value="Active">نشط ومعتمد (Active)</option>
            <option value="Draft">مسودة للتطوير (Draft)</option>
            <option value="Inactive">ملغي / قديم (Inactive)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold">
        <button
          type="button"
          onClick={handleCloneVersion}
          disabled={!activeBom}
          className="py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl cursor-pointer transition-all border border-border-main flex items-center justify-center gap-2"
        >
          <Copy size={15} />
          <span>استنساخ الإصدار (Clone Version)</span>
        </button>

        <button
          type="button"
          onClick={handleCompareVersions}
          disabled={savedBoms.filter(b => b.modelId === selectedModelId).length <= 1}
          className="py-3 px-4 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-2xl cursor-pointer transition-all border border-purple-200 flex items-center justify-center gap-2"
        >
          <ArrowLeftRight size={15} />
          <span>مقارنة الإصدارات (Compare)</span>
        </button>

        <button
          type="button"
          onClick={handleSaveDesignBOM}
          className="py-3 px-4 bg-[#0B2D5C] hover:bg-[#13396a] text-white rounded-2xl text-xs font-black shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
        >
          <Database size={15} />
          <span>اعتماد وحفظ الـ BOM للإنتاج</span>
        </button>
      </div>
    </div>
  );
};
