import React, { useState, useMemo } from 'react';
import { 
  Workflow, Plus, Search, Filter, Edit3, CheckCircle2, AlertCircle, 
  Trash2, ShieldCheck, Clock, DollarSign, Activity, Cpu, Wrench, 
  Sliders, Layers, RefreshCw, X, Check, FileText, ChevronRight
} from 'lucide-react';
import { ErpDatabase } from '../../utils/erpDb';
import { OperationMaster, WorkCenter, RoutingTemplate, OperationCategory } from '../../types/erp';

export const RoutingEngineeringCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'operations' | 'work_centers' | 'templates' | 'routings'>('operations');

  // Live Database States
  const [operations, setOperations] = useState<OperationMaster[]>(() => ErpDatabase.getOperationMasters());
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>(() => ErpDatabase.getWorkCenters());
  const [templates, setTemplates] = useState<RoutingTemplate[]>(() => ErpDatabase.getRoutingTemplates());
  const [routings, setRoutings] = useState<any[]>(() => ErpDatabase.getRoutings());

  const refreshData = () => {
    setOperations(ErpDatabase.getOperationMasters());
    setWorkCenters(ErpDatabase.getWorkCenters());
    setTemplates(ErpDatabase.getRoutingTemplates());
    setRoutings(ErpDatabase.getRoutings());
  };

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Operation Modal State
  const [isOpModalOpen, setIsOpModalOpen] = useState(false);
  const [editingOp, setEditingOp] = useState<OperationMaster | null>(null);
  const [opFormCode, setOpFormCode] = useState('');
  const [opFormNameAr, setOpFormNameAr] = useState('');
  const [opFormNameEn, setOpFormNameEn] = useState('');
  const [opFormDept, setOpFormDept] = useState('قسم التجميع');
  const [opFormWcCode, setOpFormCodeWcCode] = useState('GLUE-LINE-01');
  const [opFormCat, setOpFormCat] = useState<OperationCategory>('Assembly');
  const [opFormSetupTime, setOpFormSetupTime] = useState(10);
  const [opFormRunTime, setOpFormRunTime] = useState(15);
  const [opFormLaborCount, setOpFormLaborCount] = useState(2);
  const [opFormMachineReq, setOpFormMachineReq] = useState('آلة تجميع وتثبيت');
  const [opFormMachineRate, setOpFormMachineRate] = useState(40);
  const [opFormLaborRate, setOpFormLaborRate] = useState(25);
  const [opFormQcReq, setOpFormQcReq] = useState(true);
  const [opFormActive, setOpFormActive] = useState(true);
  const [opFormNotes, setOpFormNotes] = useState('');

  // Work Center Modal State
  const [isWcModalOpen, setIsWcModalOpen] = useState(false);
  const [editingWc, setEditingWc] = useState<WorkCenter | null>(null);
  const [wcFormCode, setWcFormCode] = useState('');
  const [wcFormNameAr, setWcFormNameAr] = useState('');
  const [wcFormNameEn, setWcFormNameEn] = useState('');
  const [wcFormDept, setWcFormDept] = useState('قسم الإنتاج الرئيسي');
  const [wcFormCapShift, setWcFormCapShift] = useState(180);
  const [wcFormCapHour, setWcFormCapHour] = useState(22.5);
  const [wcFormMachCount, setWcFormMachCount] = useState(3);
  const [wcFormLaborCap, setWcFormLaborCap] = useState(6);
  const [wcFormEffPercent, setWcFormEffPercent] = useState(90);
  const [wcFormActive, setWcFormActive] = useState(true);

  // Template Modal State
  const [isTplModalOpen, setIsTplModalOpen] = useState(false);
  const [editingTpl, setEditingTpl] = useState<RoutingTemplate | null>(null);
  const [tplFormCode, setTplFormCode] = useState('');
  const [tplFormName, setTplFormName] = useState('');
  const [tplFormCategory, setTplFormCategory] = useState('MAT');
  const [tplFormDesc, setTplFormDesc] = useState('');
  const [tplFormActive, setTplFormActive] = useState(true);

  // Filtered Lists
  const filteredOperations = useMemo(() => {
    return operations.filter(op => {
      const matchSearch = op.operationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          op.operationNameAr.includes(searchQuery) ||
                          op.operationNameEn.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === 'All' || op.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [operations, searchQuery, categoryFilter]);

  const filteredWorkCenters = useMemo(() => {
    return workCenters.filter(wc => 
      wc.workCenterCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wc.workCenterNameAr.includes(searchQuery) ||
      wc.workCenterNameEn.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [workCenters, searchQuery]);

  const filteredTemplates = useMemo(() => {
    return templates.filter(t =>
      t.templateCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.templateName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [templates, searchQuery]);

  // Handle Operations Form Submit
  const handleSaveOp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opFormCode.trim() || !opFormNameAr.trim()) {
      alert('يرجى كتابة كود واسم العملية باللغة العربية.');
      return;
    }

    const opData: OperationMaster = {
      operationCode: opFormCode.trim().toUpperCase(),
      operationNameAr: opFormNameAr.trim(),
      operationNameEn: opFormNameEn.trim() || opFormNameAr.trim(),
      department: opFormDept,
      workCenterCode: opFormWcCode,
      category: opFormCat,
      setupTimeMinutes: Number(opFormSetupTime),
      runTimeMinutes: Number(opFormRunTime),
      laborCount: Number(opFormLaborCount),
      machineRequired: opFormMachineReq.trim(),
      machineHourRate: Number(opFormMachineRate),
      laborHourRate: Number(opFormLaborRate),
      qualityCheckRequired: opFormQcReq,
      activeStatus: opFormActive,
      notes: opFormNotes.trim()
    };

    ErpDatabase.saveOperationMaster(opData);
    setIsOpModalOpen(false);
    refreshData();
    alert(`تم حفظ العملية الماستر ${opData.operationCode} بنجاح!`);
  };

  const handleOpenNewOp = () => {
    setEditingOp(null);
    setOpFormCode(`OP-NEW-${Date.now().toString().slice(-4)}`);
    setOpFormNameAr('');
    setOpFormNameEn('');
    setOpFormDept('قسم الإنتاج والتجميع');
    setOpFormCodeWcCode(workCenters[0]?.workCenterCode || 'GLUE-LINE-01');
    setOpFormCat('Assembly');
    setOpFormSetupTime(10);
    setOpFormRunTime(15);
    setOpFormLaborCount(2);
    setOpFormMachineReq('معدة تجميع قياسية');
    setOpFormMachineRate(35);
    setOpFormLaborRate(25);
    setOpFormQcReq(true);
    setOpFormActive(true);
    setOpFormNotes('');
    setIsOpModalOpen(true);
  };

  const handleOpenEditOp = (op: OperationMaster) => {
    setEditingOp(op);
    setOpFormCode(op.operationCode);
    setOpFormNameAr(op.operationNameAr);
    setOpFormNameEn(op.operationNameEn);
    setOpFormDept(op.department);
    setOpFormCodeWcCode(op.workCenterCode);
    setOpFormCat(op.category);
    setOpFormSetupTime(op.setupTimeMinutes);
    setOpFormRunTime(op.runTimeMinutes);
    setOpFormLaborCount(op.laborCount);
    setOpFormMachineReq(op.machineRequired);
    setOpFormMachineRate(op.machineHourRate);
    setOpFormLaborRate(op.laborHourRate);
    setOpFormQcReq(op.qualityCheckRequired);
    setOpFormActive(op.activeStatus);
    setOpFormNotes(op.notes || '');
    setIsOpModalOpen(true);
  };

  // Handle Work Center Form Submit
  const handleSaveWc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wcFormCode.trim() || !wcFormNameAr.trim()) {
      alert('يرجى إدخال كود واسم مركز العمل باللغة العربية.');
      return;
    }

    const wcData: WorkCenter = {
      workCenterCode: wcFormCode.trim().toUpperCase(),
      workCenterNameAr: wcFormNameAr.trim(),
      workCenterNameEn: wcFormNameEn.trim() || wcFormNameAr.trim(),
      department: wcFormDept,
      capacityPerShift: Number(wcFormCapShift),
      capacityPerHour: Number(wcFormCapHour),
      machineCount: Number(wcFormMachCount),
      laborCapacity: Number(wcFormLaborCap),
      efficiencyPercent: Number(wcFormEffPercent),
      activeStatus: wcFormActive
    };

    ErpDatabase.saveWorkCenter(wcData);
    setIsWcModalOpen(false);
    refreshData();
    alert(`تم حفظ مركز العمل ${wcData.workCenterCode} بنجاح!`);
  };

  const handleOpenNewWc = () => {
    setEditingWc(null);
    setWcFormCode(`WC-NEW-${Date.now().toString().slice(-4)}`);
    setWcFormNameAr('');
    setWcFormNameEn('');
    setWcFormDept('قسم التجميع الرئيسي');
    setWcFormCapShift(160);
    setWcFormCapHour(20);
    setWcFormMachCount(2);
    setWcFormLaborCap(4);
    setWcFormEffPercent(90);
    setWcFormActive(true);
    setIsWcModalOpen(true);
  };

  const handleOpenEditWc = (wc: WorkCenter) => {
    setEditingWc(wc);
    setWcFormCode(wc.workCenterCode);
    setWcFormNameAr(wc.workCenterNameAr);
    setWcFormNameEn(wc.workCenterNameEn);
    setWcFormDept(wc.department);
    setWcFormCapShift(wc.capacityPerShift);
    setWcFormCapHour(wc.capacityPerHour);
    setWcFormMachCount(wc.machineCount);
    setWcFormLaborCap(wc.laborCapacity);
    setWcFormEffPercent(wc.efficiencyPercent);
    setWcFormActive(wc.activeStatus);
    setIsWcModalOpen(true);
  };

  // Handle Template Form Submit
  const handleSaveTpl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tplFormCode.trim() || !tplFormName.trim()) {
      alert('يرجى إدخال كود واسم القالب.');
      return;
    }

    const tplData: RoutingTemplate = {
      templateCode: tplFormCode.trim().toUpperCase(),
      templateName: tplFormName.trim(),
      productCategory: tplFormCategory,
      description: tplFormDesc.trim(),
      defaultSteps: [],
      activeStatus: tplFormActive
    };

    ErpDatabase.saveRoutingTemplate(tplData);
    setIsTplModalOpen(false);
    refreshData();
    alert(`تم حفظ قالب التوجيه ${tplData.templateCode} بنجاح!`);
  };

  const handleOpenNewTpl = () => {
    setEditingTpl(null);
    setTplFormCode(`TPL-NEW-${Date.now().toString().slice(-4)}`);
    setTplFormName('');
    setTplFormCategory('MAT');
    setTplFormDesc('');
    setTplFormActive(true);
    setIsTplModalOpen(true);
  };

  return (
    <div className="space-y-6 text-right font-sans antialiased text-slate-800 dark:text-slate-100">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#0B2D5C] via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-800/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shadow-inner font-bold">
              <Workflow size={26} />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>مركز هندسة التوجيه ومسارات التشغيل (Routing Engineering Center)</span>
                <span className="px-3 py-0.5 bg-purple-500/30 text-purple-200 text-[10px] font-mono rounded-full border border-purple-400/30">
                  ERP Master Governance
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                إدارة دليل العمليات الماستر، مراكز العمل والخطوط، وقوالب المسارات القياسية بمعزل عن واجهة الـ BOM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <div className="p-2.5 bg-indigo-900/40 rounded-2xl border border-indigo-800/50 text-center">
              <span className="text-[10px] text-indigo-300 block">عدد العمليات الماستر</span>
              <span className="font-mono text-white text-sm font-black">{operations.length} عملية</span>
            </div>
            <div className="p-2.5 bg-indigo-900/40 rounded-2xl border border-indigo-800/50 text-center">
              <span className="text-[10px] text-indigo-300 block">مراكز العمل الفعالة</span>
              <span className="font-mono text-purple-300 text-sm font-black">{workCenters.length} محطة</span>
            </div>
          </div>
        </div>

        {/* STANDALONE SUB-WORKSPACE NAVIGATION TABS */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setActiveTab('operations')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'operations' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <Sliders size={15} />
            <span>1. دليل العمليات الماستر ({operations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('work_centers')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'work_centers' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <Cpu size={15} />
            <span>2. مراكز العمل والخطوط ({workCenters.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'templates' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <Layers size={15} />
            <span>3. مكتبة قوالب المسارات ({templates.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('routings')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'routings' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <CheckCircle2 size={15} />
            <span>4. المسارات المعتمدة للمنتجات ({routings.length})</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="bg-surface border border-border-main p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pr-9 pl-4 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl text-xs outline-none font-bold"
            placeholder="بحث بالكود، الاسم بالعربية، الاسم بالإنجليزية..."
          />
        </div>

        {activeTab === 'operations' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 shrink-0">فئة العملية:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl text-xs font-bold outline-none cursor-pointer text-purple-600"
            >
              <option value="All">جميع الفئات</option>
              <option value="Cutting">Cutting (القص والتقطيع)</option>
              <option value="Assembly">Assembly (التجميع والتطابق)</option>
              <option value="Gluing">Gluing (اللاصق الحراري)</option>
              <option value="Spring Assembly">Spring Assembly (شاسيه السوست)</option>
              <option value="Quilting">Quilting (التطريز والتنجيد)</option>
              <option value="Border Closing">Border Closing (الشريط والحواف)</option>
              <option value="Packing">Packing (التغليف والباركود)</option>
              <option value="Compression">Compression (الفاكيوم والضغط)</option>
              <option value="Inspection">Inspection (الفحص والجودة)</option>
            </select>
          </div>
        )}

        {/* ACTION BUTTON */}
        <div>
          {activeTab === 'operations' && (
            <button
              type="button"
              onClick={handleOpenNewOp}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Plus size={15} />
              <span>إضافة عملية ماستر جديدة</span>
            </button>
          )}

          {activeTab === 'work_centers' && (
            <button
              type="button"
              onClick={handleOpenNewWc}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Plus size={15} />
              <span>إضافة مركز عمل جديد</span>
            </button>
          )}

          {activeTab === 'templates' && (
            <button
              type="button"
              onClick={handleOpenNewTpl}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Plus size={15} />
              <span>إنشاء قالب توجيه جديد</span>
            </button>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: OPERATIONS MASTER CATALOG */}
      {/* ==================================================================== */}
      {activeTab === 'operations' && (
        <div className="bg-surface border border-border-main p-5 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-extrabold text-xs text-[#0B2D5C] dark:text-purple-300 flex items-center gap-1.5">
              <Sliders size={16} className="text-purple-600" />
              <span>دليل العمليات القياسية الموحد (Operation Master Catalog)</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              عرض {filteredOperations.length} من أصل {operations.length} عملية
            </span>
          </div>

          <div className="overflow-x-auto border border-border-main rounded-2xl shadow-2xs">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-black border-b border-border-main">
                <tr>
                  <th className="p-3">كود العملية</th>
                  <th className="p-3">اسم العملية (عربي / English)</th>
                  <th className="p-3">القسم</th>
                  <th className="p-3">مركز العمل</th>
                  <th className="p-3 text-center">زمن المعايرة</th>
                  <th className="p-3 text-center">زمن التشغيل</th>
                  <th className="p-3 text-center">العمالة</th>
                  <th className="p-3 text-center">بوابة جودة</th>
                  <th className="p-3 text-center">الحالة</th>
                  <th className="p-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main font-medium">
                {filteredOperations.map((op) => (
                  <tr key={op.operationCode} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-all">
                    <td className="p-3 font-mono font-bold text-purple-600">{op.operationCode}</td>
                    <td className="p-3">
                      <span className="font-black text-slate-900 dark:text-white block">{op.operationNameAr}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">{op.operationNameEn}</span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{op.department}</td>
                    <td className="p-3 font-mono text-blue-600 font-bold">{op.workCenterCode}</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">{op.setupTimeMinutes} دقيقة</td>
                    <td className="p-3 text-center font-mono font-bold text-purple-600">{op.runTimeMinutes} دقيقة</td>
                    <td className="p-3 text-center font-mono font-bold">{op.laborCount} عمال</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${op.qualityCheckRequired ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                        {op.qualityCheckRequired ? 'نعم ✓' : 'لا'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${op.activeStatus ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {op.activeStatus ? 'نشط' : 'معطل'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEditOp(op)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-black cursor-pointer transition-all"
                      >
                        تعديل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: WORK CENTERS REGISTRY */}
      {/* ==================================================================== */}
      {activeTab === 'work_centers' && (
        <div className="bg-surface border border-border-main p-5 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-extrabold text-xs text-[#0B2D5C] dark:text-purple-300 flex items-center gap-1.5">
              <Cpu size={16} className="text-purple-600" />
              <span>سجل مراكز العمل والخطوط الصناعية (Work Center Registry)</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              إجمالي المراكز: {workCenters.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkCenters.map((wc) => (
              <div key={wc.workCenterCode} className="p-4 bg-slate-50/70 dark:bg-slate-900/60 border border-border-main rounded-2xl space-y-3 relative hover:border-purple-300 transition-all">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-mono font-black text-xs text-purple-600 bg-purple-50 dark:bg-purple-950 px-2.5 py-0.5 rounded-lg border border-purple-200">
                    {wc.workCenterCode}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${wc.activeStatus ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {wc.activeStatus ? 'نشط ومعتمد' : 'متوقف'}
                  </span>
                </div>

                <div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">{wc.workCenterNameAr}</h4>
                  <p className="text-[10px] font-mono text-slate-400">{wc.workCenterNameEn} • {wc.department}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-1">
                  <div className="p-2 bg-white dark:bg-slate-950 rounded-xl border">
                    <span className="text-[9px] text-slate-400 block">السعة لكل وردية</span>
                    <span className="font-mono text-blue-600 font-bold">{wc.capacityPerShift} قطعة</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-950 rounded-xl border">
                    <span className="text-[9px] text-slate-400 block">السعة لكل ساعة</span>
                    <span className="font-mono text-purple-600 font-bold">{wc.capacityPerHour} قطعة/ساعة</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-950 rounded-xl border">
                    <span className="text-[9px] text-slate-400 block">عدد الماكينات والعمالة</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{wc.machineCount} M • {wc.laborCapacity} L</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-950 rounded-xl border">
                    <span className="text-[9px] text-slate-400 block">كفاءة التشغيل %</span>
                    <span className="font-mono text-emerald-600 font-black">{wc.efficiencyPercent}%</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenEditWc(wc)}
                  className="w-full py-2 bg-white dark:bg-slate-950 hover:bg-slate-100 border border-border-main rounded-xl text-xs font-black text-slate-700 dark:text-slate-200 cursor-pointer transition-all"
                >
                  تعديل بيانات مركز العمل
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: ROUTING TEMPLATE LIBRARY */}
      {/* ==================================================================== */}
      {activeTab === 'templates' && (
        <div className="bg-surface border border-border-main p-5 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-extrabold text-xs text-[#0B2D5C] dark:text-purple-300 flex items-center gap-1.5">
              <Layers size={16} className="text-purple-600" />
              <span>مكتبة قوالب التوجيه الإنسيابية (Routing Template Library)</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              إجمالي القوالب: {templates.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((tpl) => (
              <div key={tpl.templateCode} className="p-4 bg-slate-50/70 dark:bg-slate-900/60 border border-border-main rounded-2xl space-y-3 relative hover:border-purple-300 transition-all">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-mono font-black text-xs text-purple-600 bg-purple-50 dark:bg-purple-950 px-2.5 py-0.5 rounded-lg border border-purple-200">
                    {tpl.templateCode}
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                    نشط ومعتمد
                  </span>
                </div>

                <div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">{tpl.templateName}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tpl.description}</p>
                </div>

                <div className="p-2.5 bg-white dark:bg-slate-950 rounded-xl border flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400">عدد الخطوات الضمنية:</span>
                  <span className="font-mono text-purple-600 font-black">{tpl.defaultStepsCount || 8} خطوات</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: APPROVED ROUTINGS REGISTRY */}
      {/* ==================================================================== */}
      {activeTab === 'routings' && (
        <div className="bg-surface border border-border-main p-5 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-extrabold text-xs text-[#0B2D5C] dark:text-purple-300 flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>سجل المسارات التشغيلية المعتمدة للمنتجات (Manufacturing Routings Registry)</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              إجمالي المسارات الموثقة: {routings.length}
            </span>
          </div>

          {routings.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed text-slate-400 space-y-2">
              <Workflow size={32} className="mx-auto text-purple-400 animate-pulse" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">لا توجد مسارات تشغيلية مسجلة حتى الآن.</p>
              <p className="text-[11px] text-slate-400">يمكنك إنشاء وتوليد التوجيه الصناعي عند اعتماد المنتجات داخل الـ AI BOM Design Center.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {routings.map((rtg: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-2xl space-y-2">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-mono font-black text-xs text-purple-600">{rtg.routingCode}</span>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">Approved & Released</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                    <span>كود المنتج: {rtg.productCode}</span>
                    <span>إجمالي الزمن: {rtg.totalSetupTime + rtg.totalRunTime} دقيقة</span>
                    <span>تكلفة التوجيه: {rtg.totalRoutingCost} SAR</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* OPERATION MODAL */}
      {isOpModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in text-right">
          <div className="bg-surface rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-purple-500/30 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Sliders size={18} className="text-purple-600" />
                <span>{editingOp ? 'تعديل بيانات عملية تشغيل ماستر' : 'إضافة عملية تشغيل ماستر جديدة'}</span>
              </h3>
              <button onClick={() => setIsOpModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveOp} className="space-y-3 text-xs font-bold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">كود العملية (Operation Code)</label>
                  <input
                    type="text"
                    value={opFormCode}
                    onChange={(e) => setOpFormCode(e.target.value)}
                    className="w-full h-8 px-2.5 bg-slate-50 dark:bg-slate-900 border rounded-lg outline-none font-mono font-bold text-purple-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">فئة العملية (Category)</label>
                  <select
                    value={opFormCat}
                    onChange={(e) => setOpFormCat(e.target.value as OperationCategory)}
                    className="w-full h-8 px-2 bg-slate-50 dark:bg-slate-900 border rounded-lg outline-none cursor-pointer"
                  >
                    <option value="Cutting">Cutting (القص)</option>
                    <option value="Assembly">Assembly (التجميع)</option>
                    <option value="Gluing">Gluing (الرش واللصق)</option>
                    <option value="Spring Assembly">Spring Assembly (السوست)</option>
                    <option value="Quilting">Quilting (التنجيد)</option>
                    <option value="Border Closing">Border Closing (الشريط)</option>
                    <option value="Packing">Packing (التغليف)</option>
                    <option value="Compression">Compression (الفاكيوم)</option>
                    <option value="Inspection">Inspection (الفحص والجودة)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] mb-1">اسم العملية بالعربية</label>
                <input
                  type="text"
                  value={opFormNameAr}
                  onChange={(e) => setOpFormNameAr(e.target.value)}
                  className="w-full h-8 px-2.5 bg-slate-50 dark:bg-slate-900 border rounded-lg outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] mb-1">اسم العملية بالإنجليزية</label>
                <input
                  type="text"
                  value={opFormNameEn}
                  onChange={(e) => setOpFormNameEn(e.target.value)}
                  className="w-full h-8 px-2.5 bg-slate-50 dark:bg-slate-900 border rounded-lg outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">القسم الداخلي</label>
                  <input
                    type="text"
                    value={opFormDept}
                    onChange={(e) => setOpFormDept(e.target.value)}
                    className="w-full h-8 px-2.5 bg-slate-50 dark:bg-slate-900 border rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">مركز العمل المعتمد</label>
                  <select
                    value={opFormWcCode}
                    onChange={(e) => setOpFormCodeWcCode(e.target.value)}
                    className="w-full h-8 px-2 bg-slate-50 dark:bg-slate-900 border rounded-lg outline-none cursor-pointer"
                  >
                    {workCenters.map(wc => (
                      <option key={wc.workCenterCode} value={wc.workCenterCode}>
                        {wc.workCenterCode} - {wc.workCenterNameAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">زمن المعايرة (دقيقة)</label>
                  <input
                    type="number"
                    value={opFormSetupTime}
                    onChange={(e) => setOpFormSetupTime(Number(e.target.value))}
                    className="w-full h-8 px-2 text-center bg-slate-50 dark:bg-slate-900 border rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">زمن التشغيل (دقيقة)</label>
                  <input
                    type="number"
                    value={opFormRunTime}
                    onChange={(e) => setOpFormRunTime(Number(e.target.value))}
                    className="w-full h-8 px-2 text-center bg-slate-50 dark:bg-slate-900 border rounded-lg font-mono font-bold text-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">عدد العمالة</label>
                  <input
                    type="number"
                    value={opFormLaborCount}
                    onChange={(e) => setOpFormLaborCount(Number(e.target.value))}
                    className="w-full h-8 px-2 text-center bg-slate-50 dark:bg-slate-900 border rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black shadow-md cursor-pointer"
                >
                  حفظ البيانات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WORK CENTER MODAL */}
      {isWcModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in text-right">
          <div className="bg-surface rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-purple-500/30 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Cpu size={18} className="text-purple-600" />
                <span>{editingWc ? 'تعديل مركز العمل' : 'إضافة مركز عمل جديد'}</span>
              </h3>
              <button onClick={() => setIsWcModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveWc} className="space-y-3 text-xs font-bold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">كود مركز العمل</label>
                  <input
                    type="text"
                    value={wcFormCode}
                    onChange={(e) => setWcFormCode(e.target.value)}
                    className="w-full h-8 px-2.5 bg-slate-50 dark:bg-slate-900 border rounded-lg font-mono font-bold text-purple-600 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">القسم الفني</label>
                  <input
                    type="text"
                    value={wcFormDept}
                    onChange={(e) => setWcFormDept(e.target.value)}
                    className="w-full h-8 px-2.5 bg-slate-50 dark:bg-slate-900 border rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] mb-1">اسم مركز العمل بالعربية</label>
                <input
                  type="text"
                  value={wcFormNameAr}
                  onChange={(e) => setWcFormNameAr(e.target.value)}
                  className="w-full h-8 px-2.5 bg-slate-50 dark:bg-slate-900 border rounded-lg outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">السعة للوردية (قطعة)</label>
                  <input
                    type="number"
                    value={wcFormCapShift}
                    onChange={(e) => setWcFormCapShift(Number(e.target.value))}
                    className="w-full h-8 px-2 text-center bg-slate-50 dark:bg-slate-900 border rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">كفاءة التشغيل %</label>
                  <input
                    type="number"
                    value={wcFormEffPercent}
                    onChange={(e) => setWcFormEffPercent(Number(e.target.value))}
                    className="w-full h-8 px-2 text-center bg-slate-50 dark:bg-slate-900 border rounded-lg font-mono font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWcModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black shadow-md cursor-pointer"
                >
                  حفظ البيانات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEMPLATE MODAL */}
      {isTplModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in text-right">
          <div className="bg-surface rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-purple-500/30 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Layers size={18} className="text-purple-600" />
                <span>{editingTpl ? 'تعديل قالب التوجيه' : 'إنشاء قالب توجيه جديد'}</span>
              </h3>
              <button onClick={() => setIsTplModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTpl} className="space-y-3 text-xs font-bold">
              <div>
                <label className="block text-slate-400 text-[10px] mb-1">كود القالب (Template Code)</label>
                <input
                  type="text"
                  value={tplFormCode}
                  onChange={(e) => setTplFormCode(e.target.value)}
                  className="w-full h-8 px-2.5 bg-slate-50 dark:bg-slate-900 border rounded-lg font-mono font-bold text-purple-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] mb-1">اسم القالب والوصف</label>
                <input
                  type="text"
                  value={tplFormName}
                  onChange={(e) => setTplFormName(e.target.value)}
                  className="w-full h-8 px-2.5 bg-slate-50 dark:bg-slate-900 border rounded-lg outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] mb-1">وصف القالب والاستخدام</label>
                <textarea
                  value={tplFormDesc}
                  onChange={(e) => setTplFormDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-lg outline-none h-20"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTplModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black shadow-md cursor-pointer"
                >
                  حفظ القالب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
