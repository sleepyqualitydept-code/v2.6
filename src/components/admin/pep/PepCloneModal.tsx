import React, { useState } from 'react';
import { 
  X, Copy, CheckSquare, Square, Layers, Sparkles, 
  Workflow, ShieldCheck, DollarSign, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { PepCloneOptions } from './PepTypes';
import { Model } from '../../../types/erp';

interface PepCloneModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: Model;
  currentTargetHeight: number;
  onConfirmClone: (options: PepCloneOptions) => void;
}

export const PepCloneModal: React.FC<PepCloneModalProps> = ({
  isOpen,
  onClose,
  currentModel,
  currentTargetHeight,
  onConfirmClone
}) => {
  if (!isOpen) return null;

  const [newModelName, setNewModelName] = useState<string>(`${currentModel.name} Plus (مطور)`);
  const [newModelCode, setNewModelCode] = useState<string>(`${currentModel.id}-PLUS`);
  const [newTargetHeight, setNewTargetHeight] = useState<number>(currentTargetHeight + 2);

  const [cloneMaterials, setCloneMaterials] = useState<boolean>(true);
  const [cloneAssemblies, setCloneAssemblies] = useState<boolean>(true);
  const [cloneRouting, setCloneRouting] = useState<boolean>(true);
  const [cloneWarranty, setCloneWarranty] = useState<boolean>(true);
  const [cloneCostStructure, setCloneCostStructure] = useState<boolean>(true);
  const [cloneComplianceSettings, setCloneComplianceSettings] = useState<boolean>(true);

  const handleExecute = () => {
    onConfirmClone({
      sourceModelId: currentModel.id,
      newModelName,
      newModelCode,
      newTargetHeight,
      cloneMaterials,
      cloneAssemblies,
      cloneRouting,
      cloneWarranty,
      cloneCostStructure,
      cloneComplianceSettings
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in text-right">
      <div className="bg-surface border border-border-main rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl space-y-0 text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0B2D5C] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
              <Copy size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black">استنساخ وإنشاء حزمة PEP جديدة من موديل قائم</h3>
              <p className="text-[11px] text-slate-300">Create New BOM/PEP From Existing Model</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Source Info Card */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border-main space-y-1">
            <span className="text-[10px] font-bold text-slate-400 block">الموديل الأصلي (المصدر):</span>
            <div className="flex items-center justify-between font-bold">
              <span className="text-sm text-slate-900 dark:text-white">{currentModel.name} ({currentModel.id})</span>
              <span className="font-mono text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-lg">
                ارتفاع: {currentTargetHeight} سم
              </span>
            </div>
          </div>

          {/* New Model Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">اسم الموديل الجديد:</label>
              <input
                type="text"
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-border-main rounded-xl font-bold text-xs outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">كود الموديل الجديد (Code):</label>
              <input
                type="text"
                value={newModelCode}
                onChange={(e) => setNewModelCode(e.target.value)}
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-border-main rounded-xl font-mono font-bold text-xs outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">الارتفاع المستهدف (سم):</label>
              <input
                type="number"
                value={newTargetHeight}
                onChange={(e) => setNewTargetHeight(Number(e.target.value))}
                className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-border-main rounded-xl font-mono font-bold text-xs outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">رقم الإصدار الأولي:</label>
              <input
                type="text"
                disabled
                value="PEP-v1.0 (مستنسخ)"
                className="w-full h-9 px-3 bg-slate-100 dark:bg-slate-900 border border-border-main rounded-xl font-mono font-bold text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Clone Options Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-border-main">
            <span className="text-xs font-black text-[#0B2D5C] dark:text-blue-300 block">
              عناصر الاستنساخ المطلوب نقلها إلى الحزمة الجديدة (Clone Options):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setCloneMaterials(!cloneMaterials)}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  cloneMaterials ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 text-blue-900 dark:text-blue-200' : 'bg-surface border-border-main text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers size={14} className="text-blue-500" />
                  <span className="font-bold">قوائم المواد (Materials & Layers)</span>
                </div>
                {cloneMaterials ? <CheckSquare size={16} className="text-blue-600" /> : <Square size={16} />}
              </button>

              <button
                type="button"
                onClick={() => setCloneAssemblies(!cloneAssemblies)}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  cloneAssemblies ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 text-blue-900 dark:text-blue-200' : 'bg-surface border-border-main text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers size={14} className="text-indigo-500" />
                  <span className="font-bold">هيكل التجميع (Assemblies Tree)</span>
                </div>
                {cloneAssemblies ? <CheckSquare size={16} className="text-blue-600" /> : <Square size={16} />}
              </button>

              <button
                type="button"
                onClick={() => setCloneRouting(!cloneRouting)}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  cloneRouting ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 text-blue-900 dark:text-blue-200' : 'bg-surface border-border-main text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Workflow size={14} className="text-purple-500" />
                  <span className="font-bold">مسارات التشغيل (Routing)</span>
                </div>
                {cloneRouting ? <CheckSquare size={16} className="text-blue-600" /> : <Square size={16} />}
              </button>

              <button
                type="button"
                onClick={() => setCloneWarranty(!cloneWarranty)}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  cloneWarranty ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 text-blue-900 dark:text-blue-200' : 'bg-surface border-border-main text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span className="font-bold">سياسات الضمان (Warranty Policy)</span>
                </div>
                {cloneWarranty ? <CheckSquare size={16} className="text-blue-600" /> : <Square size={16} />}
              </button>

              <button
                type="button"
                onClick={() => setCloneCostStructure(!cloneCostStructure)}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  cloneCostStructure ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 text-blue-900 dark:text-blue-200' : 'bg-surface border-border-main text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-amber-500" />
                  <span className="font-bold">هيكل التكاليف (Cost Structure)</span>
                </div>
                {cloneCostStructure ? <CheckSquare size={16} className="text-blue-600" /> : <Square size={16} />}
              </button>

              <button
                type="button"
                onClick={() => setCloneComplianceSettings(!cloneComplianceSettings)}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  cloneComplianceSettings ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 text-blue-900 dark:text-blue-200' : 'bg-surface border-border-main text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-teal-500" />
                  <span className="font-bold">معايير الامتثال (Compliance)</span>
                </div>
                {cloneComplianceSettings ? <CheckSquare size={16} className="text-blue-600" /> : <Square size={16} />}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            * سيتم إنشاء حزمة PEP جديدة كلياً وتثبيتها في قاعدة البيانات مع الحفاظ الكامل على سجل وتاريخ الموديل المصدر الأصلي.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-t border-border-main flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            إلغاء
          </button>

          <button
            type="button"
            onClick={handleExecute}
            className="px-5 py-2 bg-[#0B2D5C] hover:bg-[#14396b] text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Copy size={14} />
            <span>تنفيذ الاستنساخ وتوليد الحزمة</span>
          </button>
        </div>

      </div>
    </div>
  );
};
