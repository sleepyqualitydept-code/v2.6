import React, { useState } from 'react';
import { 
  Printer, Sliders, FileText, Plus, CheckCircle2, AlertCircle, 
  RefreshCw, Power, Terminal, Settings2, Copy, Eye, Play, 
  History, Check, X, Code, QrCode, ShieldCheck, Download, 
  Edit3, ZoomIn, ZoomOut, ArrowLeft, ArrowRight
} from 'lucide-react';
import { ErpDatabase } from '../../utils/erpDb';
import { NetworkPrinter, PrintTemplate, TemplateApprovalStatus } from '../../types/erp';
import { useTranslationService } from '../../i18n';

export const PrintSettingsView: React.FC = () => {
  const { isAr } = useTranslationService();
  const [subTab, setSubTab] = useState<'system' | 'designer' | 'printers'>('designer');
  const [printers, setPrinters] = useState<NetworkPrinter[]>(() => ErpDatabase.getPrinters());
  const [templates, setTemplates] = useState<PrintTemplate[]>(() => ErpDatabase.getPrintTemplates());
  const [selectedTemplate, setSelectedTemplate] = useState<PrintTemplate>(() => templates[0] || null);
  const [designerTab, setDesignerTab] = useState<'zpl' | 'qr' | 'barcode' | 'approval' | 'history'>('zpl');
  const [previewZoom, setPreviewZoom] = useState<number>(1);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Template edit state
  const [editName, setEditName] = useState(selectedTemplate?.name || '');
  const [editCode, setEditCode] = useState(selectedTemplate?.code || '');
  const [editWidth, setEditWidth] = useState(selectedTemplate?.widthMm || 100);
  const [editHeight, setEditHeight] = useState(selectedTemplate?.heightMm || 150);
  const [editZpl, setEditZpl] = useState(selectedTemplate?.zplCode || '');
  const [editQrEnabled, setEditQrEnabled] = useState(selectedTemplate?.qrConfig.enabled ?? true);
  const [editQrSize, setEditQrSize] = useState(selectedTemplate?.qrConfig.size || 8);
  const [editQrLevel, setEditQrLevel] = useState<'L' | 'M' | 'Q' | 'H'>(selectedTemplate?.qrConfig.correctionLevel || 'M');
  const [editQrX, setEditQrX] = useState(selectedTemplate?.qrConfig.positionX || 50);
  const [editQrY, setEditQrY] = useState(selectedTemplate?.qrConfig.positionY || 300);
  const [editBarcodeEnabled, setEditBarcodeEnabled] = useState(selectedTemplate?.barcodeConfig.enabled ?? true);
  const [editBarcodeHeight, setEditBarcodeHeight] = useState(selectedTemplate?.barcodeConfig.height || 80);
  const [editBarcodeX, setEditBarcodeX] = useState(selectedTemplate?.barcodeConfig.positionX || 50);
  const [editBarcodeY, setEditBarcodeY] = useState(selectedTemplate?.barcodeConfig.positionY || 160);

  // System settings state
  const [marginsMm, setMarginsMm] = useState<number>(2);
  const [dpi, setDpi] = useState<string>('300 DPI');
  const [autoSpool, setAutoSpool] = useState<boolean>(true);
  const [darkness, setDarkness] = useState<number>(15);

  // Add printer modal
  const [isAddPrinterOpen, setIsAddPrinterOpen] = useState(false);
  const [printerName, setPrinterName] = useState('');
  const [printerType, setPrinterType] = useState<'Thermal Label' | 'Laser Document' | 'Industrial Continuous'>('Thermal Label');
  const [printerIp, setPrinterIp] = useState('');
  const [printerPort, setPrinterPort] = useState<number>(9100);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSelectTemplate = (tpl: PrintTemplate) => {
    setSelectedTemplate(tpl);
    setEditName(tpl.name);
    setEditCode(tpl.code);
    setEditWidth(tpl.widthMm);
    setEditHeight(tpl.heightMm);
    setEditZpl(tpl.zplCode);
    setEditQrEnabled(tpl.qrConfig.enabled);
    setEditQrSize(tpl.qrConfig.size);
    setEditQrLevel(tpl.qrConfig.correctionLevel);
    setEditQrX(tpl.qrConfig.positionX);
    setEditQrY(tpl.qrConfig.positionY);
    setEditBarcodeEnabled(tpl.barcodeConfig.enabled);
    setEditBarcodeHeight(tpl.barcodeConfig.height);
    setEditBarcodeX(tpl.barcodeConfig.positionX);
    setEditBarcodeY(tpl.barcodeConfig.positionY);
  };

  const handleSaveTemplateChanges = () => {
    if (!selectedTemplate) return;
    const updated: PrintTemplate = {
      ...selectedTemplate,
      name: editName.trim(),
      code: editCode.trim(),
      widthMm: Number(editWidth),
      heightMm: Number(editHeight),
      zplCode: editZpl,
      qrConfig: {
        ...selectedTemplate.qrConfig,
        enabled: editQrEnabled,
        size: Number(editQrSize),
        correctionLevel: editQrLevel,
        positionX: Number(editQrX),
        positionY: Number(editQrY)
      },
      barcodeConfig: {
        ...selectedTemplate.barcodeConfig,
        enabled: editBarcodeEnabled,
        height: Number(editBarcodeHeight),
        positionX: Number(editBarcodeX),
        positionY: Number(editBarcodeY)
      },
      updatedDate: new Date().toISOString()
    };

    ErpDatabase.updatePrintTemplate(updated);
    setTemplates(ErpDatabase.getPrintTemplates());
    setSelectedTemplate(updated);
    showToast(isAr ? 'تم حفظ تعديلات القالب بنجاح' : 'Template updated successfully');
  };

  const handleCloneTemplate = (tpl: PrintTemplate) => {
    const cloned = ErpDatabase.clonePrintTemplate(tpl.id);
    if (cloned) {
      const refreshed = ErpDatabase.getPrintTemplates();
      setTemplates(refreshed);
      handleSelectTemplate(cloned);
      showToast(isAr ? `تم استنساخ القالب إلى مسودة جديدة (${cloned.version})` : `Cloned template to draft (${cloned.version})`);
    }
  };

  const handleUpdateApprovalStatus = (newStatus: TemplateApprovalStatus) => {
    if (!selectedTemplate) return;
    const author = 'م. أحمد الشناوي';
    const updated: PrintTemplate = {
      ...selectedTemplate,
      approvalStatus: newStatus,
      approvedBy: newStatus === 'Approved' ? author : undefined,
      approvedDate: newStatus === 'Approved' ? new Date().toISOString() : undefined,
      auditTrail: [
        {
          id: `AUD-${Date.now()}`,
          action: `Status Change: ${newStatus}`,
          user: author,
          timestamp: new Date().toISOString(),
          details: `تم تغيير حالة اعتماد القالب إلى: ${newStatus}`
        },
        ...selectedTemplate.auditTrail
      ]
    };

    ErpDatabase.updatePrintTemplate(updated);
    setTemplates(ErpDatabase.getPrintTemplates());
    setSelectedTemplate(updated);
    showToast(isAr ? `تم تحديث حالة اعتماد القالب إلى ${newStatus}` : `Updated approval status to ${newStatus}`);
  };

  const handleTestPrint = (tpl?: PrintTemplate) => {
    const targetName = tpl ? tpl.name : (selectedTemplate?.name || 'Standard Label');
    ErpDatabase.addAuditLog('Print Test', `طباعة تجريبية للقالب: ${targetName}`);
    showToast(isAr ? `تم إرسال أمر طباعة تجريبي ناجح للقالب (${targetName})` : `Test print command sent for (${targetName})`);
  };

  const handleTestPrinter = (p: NetworkPrinter) => {
    showToast(isAr ? `تم إرسال أمر طباعة تجريبي إلى الطابعة ${p.name}` : `Test print sent to ${p.name}`);
    ErpDatabase.addAuditLog('Print Test', `طباعة تجريبية على الطابعة: ${p.name}`);
  };

  const handleAddPrinter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!printerName.trim() || !printerIp.trim()) return;

    const newPrinter: NetworkPrinter = {
      id: `PRN-${Date.now()}`,
      name: printerName.trim(),
      type: printerType,
      ipAddress: printerIp.trim(),
      port: Number(printerPort),
      status: 'Online',
      lastTest: new Date().toISOString()
    };

    ErpDatabase.addPrinter(newPrinter);
    setPrinters(ErpDatabase.getPrinters());
    setIsAddPrinterOpen(false);
    setPrinterName('');
    setPrinterIp('');
    showToast(isAr ? `تم تسجيل الطابعة ${newPrinter.name} بنجاح` : `Printer ${newPrinter.name} added successfully`);
  };

  return (
    <div className="space-y-4 animate-fade-in text-start">
      {/* Toast */}
      {toast && (
        <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs border ${
          toast.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> : <AlertCircle size={16} className="text-rose-600 shrink-0" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header and Subtabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border-main pb-3">
        <div>
          <h3 className="font-extrabold text-sm text-[#0B2D5C] dark:text-blue-300 flex items-center gap-2">
            <Printer size={18} className="text-blue-600" />
            <span>{isAr ? 'مركز تصميم وحوكمة قوالب الطباعة (Label Designer Center)' : 'Label Designer & Print Template Governance Center'}</span>
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            {isAr 
              ? 'حوكمة قوالب الملصقات، محرر ZPL الصناعي، مصمم الباركود وQR، والمعاينة الحية المباشرة.' 
              : 'Template governance, industrial ZPL editor, Barcode & QR designer, and real-time visual preview.'}
          </p>
        </div>

        {/* Subtabs Buttons */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-border-main text-xs font-bold">
          <button
            type="button"
            onClick={() => setSubTab('designer')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'designer' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Edit3 size={14} />
            <span>{isAr ? `مصمم القوالب (${templates.length})` : `Label Designer (${templates.length})`}</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('system')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'system' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Sliders size={14} />
            <span>{isAr ? 'معايير النظام' : 'System Parameters'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('printers')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'printers' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Printer size={14} />
            <span>{isAr ? `الطابعات (${printers.length})` : `Printers (${printers.length})`}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUBTAB 1: LABEL DESIGNER & TEMPLATE GOVERNANCE CENTER (SECTION 8)     */}
      {/* ==================================================================== */}
      {subTab === 'designer' && (
        <div className="space-y-4">
          
          {/* Top Template Selector Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {templates.map((tpl) => {
              const isSelected = selectedTemplate?.id === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 relative shadow-2xs ${
                    isSelected
                      ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-600 shadow-sm'
                      : 'bg-surface border-border-main hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {tpl.name}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                      tpl.approvalStatus === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : tpl.approvalStatus === 'Under Review'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {tpl.approvalStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>{tpl.code} ({tpl.version})</span>
                    <span>{tpl.widthMm}×{tpl.heightMm} mm</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-border-main text-[11px]">
                    <span className="text-slate-400 font-mono text-[10px]">
                      {tpl.format} • {tpl.dpi} DPI
                    </span>
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleCloneTemplate(tpl)}
                        title={isAr ? 'استنساخ القالب' : 'Clone Template'}
                        className="p-1 hover:text-blue-600 rounded text-slate-400 cursor-pointer"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTestPrint(tpl)}
                        title={isAr ? 'طباعة تجريبية' : 'Test Print'}
                        className="p-1 hover:text-emerald-600 rounded text-slate-400 cursor-pointer"
                      >
                        <Play size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Designer Workspace: Split View (Editor on Left, Live Preview on Right) */}
          {selectedTemplate && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Left Column: Governance Controls & Editors (7 Cols) */}
              <div className="lg:col-span-7 bg-surface border border-border-main rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
                
                {/* Header of selected template */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border-main pb-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#0B2D5C] dark:text-blue-300 flex items-center gap-2">
                      <Code size={16} className="text-blue-600" />
                      <span>{selectedTemplate.name}</span>
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedTemplate.code} • {isAr ? 'الإصدار:' : 'Version:'} {selectedTemplate.version}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTestPrint(selectedTemplate)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Play size={13} />
                      <span>{isAr ? 'طباعة تجريبية' : 'Test Print'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveTemplateChanges}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      <Check size={14} />
                      <span>{isAr ? 'حفظ التعديلات' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>

                {/* Designer Sub-tabs */}
                <div className="flex border-b border-border-main gap-2 overflow-x-auto text-xs pb-1">
                  <button
                    type="button"
                    onClick={() => setDesignerTab('zpl')}
                    className={`pb-2 px-2.5 font-bold cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                      designerTab === 'zpl' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Code size={13} />
                    <span>{isAr ? 'محرر ZPL' : 'ZPL Editor'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDesignerTab('qr')}
                    className={`pb-2 px-2.5 font-bold cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                      designerTab === 'qr' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <QrCode size={13} />
                    <span>{isAr ? 'مصمم QR' : 'QR Designer'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDesignerTab('barcode')}
                    className={`pb-2 px-2.5 font-bold cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                      designerTab === 'barcode' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Sliders size={13} />
                    <span>{isAr ? 'مصمم الباركود' : 'Barcode Designer'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDesignerTab('approval')}
                    className={`pb-2 px-2.5 font-bold cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                      designerTab === 'approval' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <ShieldCheck size={13} />
                    <span>{isAr ? 'دورة الاعتماد' : 'Approval Workflow'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDesignerTab('history')}
                    className={`pb-2 px-2.5 font-bold cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                      designerTab === 'history' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <History size={13} />
                    <span>{isAr ? 'سجل الإصدارات والتدقيق' : 'Versions & Audit'}</span>
                  </button>
                </div>

                {/* TAB CONTENT: 1. ZPL EDITOR */}
                {designerTab === 'zpl' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold block">{isAr ? 'العرض (مم)' : 'Width (mm)'}</label>
                        <input
                          type="number"
                          value={editWidth}
                          onChange={(e) => setEditWidth(Number(e.target.value))}
                          className="w-full h-8 px-2.5 bg-surface border border-border-main rounded-lg font-mono outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold block">{isAr ? 'الارتفاع (مم)' : 'Height (mm)'}</label>
                        <input
                          type="number"
                          value={editHeight}
                          onChange={(e) => setEditHeight(Number(e.target.value))}
                          className="w-full h-8 px-2.5 bg-surface border border-border-main rounded-lg font-mono outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold block">{isAr ? 'الدقة' : 'DPI'}</label>
                        <span className="w-full h-8 px-2.5 bg-slate-100 dark:bg-slate-900 border border-border-main rounded-lg font-mono flex items-center text-slate-500">
                          {selectedTemplate.dpi} DPI
                        </span>
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold block">{isAr ? 'الصيغة' : 'Format'}</label>
                        <span className="w-full h-8 px-2.5 bg-slate-100 dark:bg-slate-900 border border-border-main rounded-lg font-mono flex items-center text-slate-500">
                          {selectedTemplate.format}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-bold text-slate-600 dark:text-slate-300">
                          {isAr ? 'شفرة ZPL البرمجية للطباعة الحرارية' : 'ZPL Thermal Code Script'}
                        </label>
                        <div className="flex items-center gap-1 text-[11px] text-blue-600">
                          <button
                            type="button"
                            onClick={() => setEditZpl(editZpl + '\n^FO50,200^A0N,25,25^FD{{DATE}}^FS')}
                            className="hover:underline cursor-pointer"
                          >
                            + إضافة حقل تاريخ
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={10}
                        value={editZpl}
                        onChange={(e) => setEditZpl(e.target.value)}
                        className="w-full p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800 outline-none leading-relaxed selection:bg-blue-600 selection:text-white"
                        spellCheck={false}
                      />
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: 2. QR DESIGNER */}
                {designerTab === 'qr' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer font-bold">
                        <input
                          type="checkbox"
                          checked={editQrEnabled}
                          onChange={(e) => setEditQrEnabled(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span>{isAr ? 'تضمين رمز الاستجابة السريعة (QR Code) على الملصق' : 'Include QR Code on Label'}</span>
                      </label>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border-main">
                        <div className="space-y-1">
                          <label className="text-slate-400 font-bold block">{isAr ? 'الموضع الأفقي X (dots)' : 'Position X'}</label>
                          <input
                            type="number"
                            value={editQrX}
                            onChange={(e) => setEditQrX(Number(e.target.value))}
                            className="w-full h-8 px-2 bg-surface border border-border-main rounded-lg font-mono outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 font-bold block">{isAr ? 'الموضع الرأسي Y (dots)' : 'Position Y'}</label>
                          <input
                            type="number"
                            value={editQrY}
                            onChange={(e) => setEditQrY(Number(e.target.value))}
                            className="w-full h-8 px-2 bg-surface border border-border-main rounded-lg font-mono outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 font-bold block">{isAr ? 'المقاس (Scale 1-10)' : 'Size'}</label>
                          <input
                            type="number"
                            min="2"
                            max="10"
                            value={editQrSize}
                            onChange={(e) => setEditQrSize(Number(e.target.value))}
                            className="w-full h-8 px-2 bg-surface border border-border-main rounded-lg font-mono outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 font-bold block">{isAr ? 'تصحيح الأخطاء' : 'ECC Level'}</label>
                          <select
                            value={editQrLevel}
                            onChange={(e) => setEditQrLevel(e.target.value as any)}
                            className="w-full h-8 px-2 bg-surface border border-border-main rounded-lg font-mono outline-none"
                          >
                            <option value="L">L (7% Recovery)</option>
                            <option value="M">M (15% Standard)</option>
                            <option value="Q">Q (25% High)</option>
                            <option value="H">H (30% Max)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: 3. BARCODE DESIGNER */}
                {designerTab === 'barcode' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer font-bold">
                        <input
                          type="checkbox"
                          checked={editBarcodeEnabled}
                          onChange={(e) => setEditBarcodeEnabled(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span>{isAr ? 'تضمين باركود أحادي الأبعاد (Code128 Barcode)' : 'Include 1D Barcode (Code128)'}</span>
                      </label>

                      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border-main">
                        <div className="space-y-1">
                          <label className="text-slate-400 font-bold block">{isAr ? 'الموضع الأفقي X (dots)' : 'Position X'}</label>
                          <input
                            type="number"
                            value={editBarcodeX}
                            onChange={(e) => setEditBarcodeX(Number(e.target.value))}
                            className="w-full h-8 px-2 bg-surface border border-border-main rounded-lg font-mono outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 font-bold block">{isAr ? 'الموضع الرأسي Y (dots)' : 'Position Y'}</label>
                          <input
                            type="number"
                            value={editBarcodeY}
                            onChange={(e) => setEditBarcodeY(Number(e.target.value))}
                            className="w-full h-8 px-2 bg-surface border border-border-main rounded-lg font-mono outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 font-bold block">{isAr ? 'ارتفاع الباركود (dots)' : 'Height'}</label>
                          <input
                            type="number"
                            value={editBarcodeHeight}
                            onChange={(e) => setEditBarcodeHeight(Number(e.target.value))}
                            className="w-full h-8 px-2 bg-surface border border-border-main rounded-lg font-mono outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: 4. APPROVAL WORKFLOW */}
                {designerTab === 'approval' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{isAr ? 'حالة الاعتماد الحالية:' : 'Current Approval Status:'}</span>
                        <span className="px-3 py-1 rounded-full font-bold font-mono bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                          {selectedTemplate.approvalStatus}
                        </span>
                      </div>

                      {selectedTemplate.approvedBy && (
                        <div className="text-slate-500 space-y-1 pt-2 border-t border-border-main">
                          <div>{isAr ? 'معتمد بواسطة:' : 'Approved By:'} <strong className="text-slate-800 dark:text-slate-200">{selectedTemplate.approvedBy}</strong></div>
                          <div>{isAr ? 'تاريخ الاعتماد:' : 'Approval Date:'} {new Date(selectedTemplate.approvedDate!).toLocaleString(isAr ? 'ar-EG' : 'en-US')}</div>
                        </div>
                      )}

                      <div className="pt-2 border-t border-border-main flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateApprovalStatus('Draft')}
                          className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-bold cursor-pointer hover:bg-slate-300"
                        >
                          {isAr ? 'تحويل لمسودة (Draft)' : 'Set as Draft'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateApprovalStatus('Under Review')}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold cursor-pointer shadow-xs"
                        >
                          {isAr ? 'طلب مراجعة واعتماد' : 'Submit for Review'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateApprovalStatus('Approved')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold cursor-pointer shadow-xs"
                        >
                          {isAr ? 'اعتماد القالب رسمياً' : 'Approve Template'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: 5. HISTORY & AUDIT TRAIL */}
                {designerTab === 'history' && (
                  <div className="space-y-3 text-xs">
                    <div className="space-y-2">
                      <h5 className="font-bold text-slate-600 dark:text-slate-300">{isAr ? 'سجل الإصدارات (Version History):' : 'Version History:'}</h5>
                      <div className="border border-border-main rounded-xl overflow-hidden divide-y divide-border-main bg-surface">
                        {selectedTemplate.versionHistory.map((vh, idx) => (
                          <div key={idx} className="p-2.5 flex items-center justify-between">
                            <div>
                              <span className="font-mono font-bold text-blue-600 mr-2">{vh.version}</span>
                              <span className="text-slate-700 dark:text-slate-300">{vh.notes}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {vh.author} • {new Date(vh.updatedDate).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <h5 className="font-bold text-slate-600 dark:text-slate-300">{isAr ? 'سجل التدقيق (Audit Trail):' : 'Audit Trail:'}</h5>
                      <div className="border border-border-main rounded-xl overflow-hidden divide-y divide-border-main bg-surface">
                        {selectedTemplate.auditTrail.map((at) => (
                          <div key={at.id} className="p-2.5 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-purple-600 mr-2">{at.action}</span>
                              <span className="text-slate-700 dark:text-slate-300">{at.details}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {at.user} • {new Date(at.timestamp).toLocaleTimeString(isAr ? 'ar-EG' : 'en-US')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Live Industrial Visual Preview (5 Cols) */}
              <div className="lg:col-span-5 bg-surface border border-border-main rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs flex flex-col">
                <div className="flex items-center justify-between border-b border-border-main pb-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <Eye size={16} className="text-blue-600" />
                    <span className="font-bold text-xs">{isAr ? 'المعاينة الحية للملصق (Live Preview)' : 'Live Label Preview'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewZoom(Math.max(0.7, previewZoom - 0.1))}
                      className="p-1 hover:bg-slate-100 rounded text-slate-500"
                    >
                      <ZoomOut size={13} />
                    </button>
                    <span className="font-mono text-[10px] text-slate-400">{Math.round(previewZoom * 100)}%</span>
                    <button
                      type="button"
                      onClick={() => setPreviewZoom(Math.min(1.4, previewZoom + 0.1))}
                      className="p-1 hover:bg-slate-100 rounded text-slate-500"
                    >
                      <ZoomIn size={13} />
                    </button>
                  </div>
                </div>

                {/* Visual Label Canvas Simulation */}
                <div className="flex-1 min-h-[360px] bg-slate-100 dark:bg-slate-900 rounded-xl border border-dashed border-border-main flex items-center justify-center p-4 overflow-hidden">
                  <div 
                    style={{ 
                      width: `${Math.min(300, editWidth * 2.6)}px`, 
                      minHeight: `${Math.min(420, editHeight * 2.6)}px`,
                      transform: `scale(${previewZoom})`
                    }}
                    className="bg-white text-slate-900 p-4 rounded shadow-md border border-slate-300 font-mono transition-transform duration-150 flex flex-col justify-between select-none"
                  >
                    {/* Header */}
                    <div className="border-b-2 border-slate-900 pb-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-sm tracking-wider">SLEEPEE</span>
                        <span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span>
                      </div>
                      <span className="text-[10px] font-bold uppercase">{selectedTemplate.format} LABEL</span>
                    </div>

                    {/* Model & Specs */}
                    <div className="py-2 space-y-0.5 text-start">
                      <div className="text-xs font-black">SILVER POCKET MATTRESS</div>
                      <div className="text-[10px] font-bold text-slate-700">160 × 200 × 32 cm • American System</div>
                      <div className="text-[9px] text-slate-500">SAP: MAT-SLP-SLV-160200</div>
                    </div>

                    {/* 1D Barcode Simulation */}
                    {editBarcodeEnabled && (
                      <div className="py-2 text-center border-y border-slate-200">
                        <div className="flex items-center justify-center gap-0.5 h-10 px-2">
                          {[3,1,2,1,4,1,2,3,1,2,4,1,2,1,3,2,1,4,2,1,3,1,2,4,1,2,3,1,2,4,1,2].map((w, i) => (
                            <span 
                              key={i} 
                              style={{ width: `${w}px` }} 
                              className="h-full bg-black inline-block"
                            />
                          ))}
                        </div>
                        <span className="text-[9px] font-bold tracking-widest block mt-0.5">SLP-2026-089412</span>
                      </div>
                    )}

                    {/* QR Code and Warranty Section */}
                    <div className="pt-2 flex items-center justify-between gap-2">
                      {editQrEnabled && (
                        <div className="w-16 h-16 bg-slate-950 p-1 rounded flex items-center justify-center shrink-0">
                          <QrCode size={56} className="text-white" />
                        </div>
                      )}
                      <div className="text-start space-y-0.5 flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-slate-800 block">WARRANTY CERTIFIED</span>
                        <span className="text-[8px] text-slate-500 block truncate">Scan to verify or activate warranty</span>
                        <span className="text-[8px] font-bold text-blue-700 block font-mono">10 Years Guarantee</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[8px] text-slate-400">
                      <span>QC APPROVED</span>
                      <span>BATCH #2026-B04</span>
                    </div>
                  </div>
                </div>

                {/* Print Action Bar */}
                <div className="pt-2 flex items-center justify-between shrink-0 text-xs">
                  <span className="text-[11px] text-slate-400">
                    {editWidth}×{editHeight} mm • 300 DPI
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTestPrint(selectedTemplate)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                  >
                    <Printer size={14} />
                    <span>{isAr ? 'طباعة الملصق الآن' : 'Print Test Label'}</span>
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* ==================================================================== */}
      {/* SUBTAB 2: SYSTEM PARAMETERS                                           */}
      {/* ==================================================================== */}
      {subTab === 'system' && (
        <div className="p-5 bg-surface border border-border-main rounded-2xl space-y-4 shadow-2xs text-xs">
          <h4 className="font-extrabold text-xs text-[#0B2D5C] dark:text-blue-300 border-b pb-2 flex items-center gap-1.5">
            <Sliders size={16} />
            <span>{isAr ? 'المعايير التشغيلية للطباعة الحرارية الصناعية' : 'Industrial Thermal Printing Operational Parameters'}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold block">{isAr ? 'دقة الطباعة المعتمدة (DPI)' : 'Standard Printhead Resolution (DPI)'}</label>
              <select
                value={dpi}
                onChange={(e) => setDpi(e.target.value)}
                className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl font-bold font-mono outline-none"
              >
                <option value="203 DPI">203 DPI (8 dots/mm - Standard Thermal)</option>
                <option value="300 DPI">300 DPI (12 dots/mm - High Quality Industrial)</option>
                <option value="600 DPI">600 DPI (24 dots/mm - Ultra High Density)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold block">{isAr ? 'هوامش الملصق (Margins mm)' : 'Label Margins (mm)'}</label>
              <input
                type="number"
                min="0"
                max="10"
                value={marginsMm}
                onChange={(e) => setMarginsMm(Number(e.target.value))}
                className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl font-bold font-mono outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold block">{isAr ? 'شدة حرارة الرأس (Printhead Darkness: 1-30)' : 'Printhead Darkness (1-30)'}</label>
              <input
                type="number"
                min="1"
                max="30"
                value={darkness}
                onChange={(e) => setDarkness(Number(e.target.value))}
                className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl font-bold font-mono outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold block">{isAr ? 'التوليد التلقائي لمهام الطباعة' : 'Automatic Spooling'}</label>
              <label className="flex items-center gap-2 h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSpool}
                  onChange={(e) => setAutoSpool(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="font-bold">{isAr ? 'توليد وإرسال مهام الطباعة تلقائياً عند اعتماد التشغيلة' : 'Auto spool print jobs on batch approval'}</span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => showToast(isAr ? 'تم حفظ معايير الطباعة بنجاح' : 'Printing parameters saved successfully')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer shadow-xs"
            >
              {isAr ? 'حفظ الإعدادات' : 'Save Parameters'}
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUBTAB 3: INDUSTRIAL PRINTERS                                         */}
      {/* ==================================================================== */}
      {subTab === 'printers' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-text-secondary">
              {isAr ? 'إدارة الطابعات الحرارية والشبكية المتصلة بخطوط الإنتاج ومستودعات التوزيع.' : 'Manage network and thermal printers connected to production lines and warehouses.'}
            </p>
            <button
              type="button"
              onClick={() => setIsAddPrinterOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus size={14} />
              <span>{isAr ? 'إضافة طابعة جديدة' : 'Add New Printer'}</span>
            </button>
          </div>

          {printers.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 border border-dashed border-border-main rounded-2xl space-y-3">
              <Printer size={32} className="mx-auto text-slate-400" />
              <div className="space-y-1">
                <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300">
                  {isAr ? 'لا توجد طابعات معرفة حالياً' : 'No Printers Configured'}
                </h5>
                <p className="text-[11px] text-slate-400">
                  {isAr ? 'يمكنك إضافة طابعة باركود حرارية عبر بروتوكول الشبكة TCP/IP أو المنفذ الصناعي.' : 'You can configure network thermal printers via IP and port.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddPrinterOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isAr ? 'إضافة طابعة الآن' : 'Add Printer Now'}
              </button>
            </div>
          ) : (
            <div className="border border-border-main rounded-2xl overflow-hidden bg-surface shadow-2xs">
              <table className="w-full text-start text-xs">
                <thead className="bg-slate-100/70 dark:bg-surface text-slate-600 font-bold border-b border-border-main">
                  <tr>
                    <th className="p-3.5">{isAr ? 'اسم الطابعة' : 'Printer Name'}</th>
                    <th className="p-3.5">{isAr ? 'النوع' : 'Type'}</th>
                    <th className="p-3.5">{isAr ? 'عنوان IP والمنفذ' : 'IP & Port'}</th>
                    <th className="p-3.5 text-center">{isAr ? 'الحالة' : 'Status'}</th>
                    <th className="p-3.5 text-center">{isAr ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main">
                  {printers.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 font-bold text-text-primary">{p.name}</td>
                      <td className="p-3.5 text-slate-500">{p.type}</td>
                      <td className="p-3.5 font-mono text-blue-600">{p.ipAddress}:{p.port}</td>
                      <td className="p-3.5 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleTestPrinter(p)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                        >
                          {isAr ? 'طباعة تجريبية' : 'Test Print'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ADD PRINTER MODAL */}
      {isAddPrinterOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fade-in text-start">
          <div className="bg-surface dark:bg-surface-secondary border border-border-main rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 z-[10000]">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-extrabold text-sm text-[#0B2D5C] dark:text-blue-300 flex items-center gap-2">
                <Printer size={16} />
                <span>{isAr ? 'إضافة طابعة صناعية جديدة' : 'Add New Industrial Printer'}</span>
              </h4>
              <button onClick={() => setIsAddPrinterOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">&times;</button>
            </div>

            <form onSubmit={handleAddPrinter} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold block">{isAr ? 'اسم الطابعة' : 'Printer Name'}</label>
                <input
                  type="text"
                  required
                  value={printerName}
                  onChange={(e) => setPrinterName(e.target.value)}
                  placeholder={isAr ? 'مثال: Zebra ZT411 - خط التغليف 1' : 'e.g. Zebra ZT411 Line 1'}
                  className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold block">{isAr ? 'نوع الطابعة' : 'Printer Type'}</label>
                <select
                  value={printerType}
                  onChange={(e) => setPrinterType(e.target.value as any)}
                  className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl font-bold outline-none"
                >
                  <option value="Thermal Label">Thermal Label (حراري مباشر / نقل حراري)</option>
                  <option value="Laser Document">Laser Document (ليزر وثائق A4/A5)</option>
                  <option value="Industrial Continuous">Industrial Continuous (صناعي مستمر)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold block">{isAr ? 'عنوان IP' : 'IP Address'}</label>
                  <input
                    type="text"
                    required
                    value={printerIp}
                    onChange={(e) => setPrinterIp(e.target.value)}
                    placeholder="192.168.1.150"
                    className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl font-mono outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold block">{isAr ? 'المنفذ (Port)' : 'Port'}</label>
                  <input
                    type="number"
                    required
                    value={printerPort}
                    onChange={(e) => setPrinterPort(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl font-mono outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPrinterOpen(false)}
                  className="px-4 py-2 border border-border-main rounded-xl font-bold cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  {isAr ? 'حفظ الطابعة' : 'Save Printer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
