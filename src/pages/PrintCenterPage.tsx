import React, { useState, useMemo } from 'react';
import { 
  Printer, RefreshCw, CheckCircle, Search, Calendar, HardDrive, ShieldCheck, 
  HelpCircle, FileText, Download, AlertTriangle, XCircle, RotateCcw, Eye, Check,
  Activity, CheckCircle2, QrCode, Tag, Clock
} from 'lucide-react';
import { ErpDatabase } from '../utils/erpDb';
import { PrintJob, PrintQueueStatus, Product } from '../types/erp';

export const PrintCenterPage: React.FC = () => {
  // 5 Hardened Print Subtabs (PROMPT-032 PART 8)
  const [activeSubTab, setActiveSubTab] = useState<'printers' | 'queue' | 'preview' | 'reprint' | 'audit'>('queue');
  
  const [selectedPrinter, setSelectedPrinter] = useState('ZEBRA-INDUSTRIAL-01');
  const [reprintSerialInput, setReprintSerialInput] = useState('');
  const [reprintReason, setReprintReason] = useState('تلف في الملصق أثناء التغليف');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  
  // Load data from ERP database
  const [printJobs, setPrintJobs] = useState<PrintJob[]>(() => ErpDatabase.getPrintJobs());
  const products = ErpDatabase.getProducts();
  const serials = ErpDatabase.getSerialNumbers();

  // Selected label for the live preview layout
  const [selectedJobId, setSelectedJobId] = useState<string | null>(() => {
    const jobs = ErpDatabase.getPrintJobs();
    return jobs.length > 0 ? jobs[0].id : null;
  });

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const refreshJobs = () => {
    const updated = ErpDatabase.getPrintJobs();
    setPrintJobs(updated);
  };

  const getProductionContext = (job: PrintJob) => {
    const allSerials = ErpDatabase.getSerialNumbers();
    const serialObj = allSerials.find(s => s.serialNumber === job.serialNumber);
    const orderObj = ErpDatabase.getProductionOrders().find(o => o.id === serialObj?.productionOrderId);
    const productObj = products.find(p => p.id === job.productId);
    const orderSerials = allSerials.filter(s => s.productionOrderId === orderObj?.id);
    const firstSerial = orderSerials[orderSerials.length - 1]?.serialNumber || '—';
    const lastSerial = orderSerials[0]?.serialNumber || '—';
    
    return {
      orderNumber: orderObj?.productionOrderNumber || '—',
      productModel: productObj?.modelName || job.productName || '—',
      version: 'Version A1', // standard version
      dimension: job.sizeLabel || (productObj ? `${productObj.width}×${productObj.length}` : '—'),
      batch: job.batchNumber || orderObj?.batchNumber || '—',
      serialRange: `${firstSerial} ↔ ${lastSerial}`
    };
  };

  const filteredJobs = useMemo(() => {
    return printJobs.filter(job => {
      const matchesSearch = job.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.warrantyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.productName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'All' || job.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [printJobs, searchQuery, filterStatus]);

  const activeJob = useMemo(() => {
    return printJobs.find(j => j.id === selectedJobId) || printJobs[0] || null;
  }, [printJobs, selectedJobId]);

  const activeProduct = useMemo(() => {
    if (!activeJob) return null;
    return products.find(p => p.id === activeJob.productId) || null;
  }, [activeJob, products]);

  const getPolicyYears = (productId: string | undefined) => {
    if (!productId) return 10;
    const p = products.find(prod => prod.id === productId);
    if (!p) return 10;
    const policy = ErpDatabase.getWarrantyPolicies().find(pol => pol.id === p.warrantyPolicyId);
    return policy ? policy.warrantyYears : 10;
  };

  // Printing handlers
  const handlePrintSingle = (job: PrintJob) => {
    const updated = printJobs.map(j => {
      if (j.id === job.id) {
        return {
          ...j,
          status: 'Printed' as PrintQueueStatus,
          printTime: new Date().toISOString()
        };
      }
      return j;
    });

    ErpDatabase.savePrintJobs(updated);
    setPrintJobs(updated);

    // Update serial status to Printed
    const allSerials = ErpDatabase.getSerialNumbers();
    const updatedSerials = allSerials.map(s => {
      if (s.serialNumber === job.serialNumber && s.status === 'Generated') {
        return { ...s, status: 'Printed' as const, printedDate: new Date().toISOString() };
      }
      return s;
    });
    ErpDatabase.saveSerialNumbers(updatedSerials);

    ErpDatabase.addAuditLog('Printing', `طباعة ملصق السيريال ${job.serialNumber} بنجاح على ${selectedPrinter}`);
    showToast(`تمت طباعة ملصق السيريال ${job.serialNumber} بنجاح على طابعة ${selectedPrinter}`);
  };

  const handleMarkFailed = (job: PrintJob) => {
    const reason = 'انحشار شريط الطباعة الحراري';
    const updated = printJobs.map(j => {
      if (j.id === job.id) {
        return {
          ...j,
          status: 'Failed' as PrintQueueStatus,
          failedReason: reason
        };
      }
      return j;
    });

    ErpDatabase.savePrintJobs(updated);
    setPrintJobs(updated);
    ErpDatabase.addAuditLog('Print Failure', `تعثر طباعة السيريال ${job.serialNumber}: ${reason}`);
    showToast(`تم تسجيل تعثر طباعة الملصق للسيريال ${job.serialNumber}`, 'error');
    refreshJobs();
  };

  const handlePrintAllReady = () => {
    let count = 0;
    const updated = printJobs.map(j => {
      if (j.status === 'Ready' || j.status === 'Reprint Requested' || j.status === 'Failed') {
        count++;
        return {
          ...j,
          status: 'Printed' as PrintQueueStatus,
          printTime: new Date().toISOString()
        };
      }
      return j;
    });

    if (count === 0) {
      showToast('لا توجد تذاكر بانتظار الطباعة حالياً', 'info');
      return;
    }

    ErpDatabase.savePrintJobs(updated);
    setPrintJobs(updated);

    // Update serials to Printed
    const allSerials = ErpDatabase.getSerialNumbers();
    const updatedSerials = allSerials.map(s => {
      if (s.status === 'Generated') {
        return { ...s, status: 'Printed' as const, printedDate: new Date().toISOString() };
      }
      return s;
    });
    ErpDatabase.saveSerialNumbers(updatedSerials);

    ErpDatabase.addAuditLog('Printing', `طباعة دفعة كاملة لعدد ${count} ملصق على ${selectedPrinter}`);
    showToast(`تم إرسال ${count} ملصق لطابعات الباركود وطباعتها بنجاح!`);
  };

  const handleReprintRequest = (serialNum: string) => {
    const job = printJobs.find(j => j.serialNumber === serialNum);
    if (!job) {
      showToast(`السيريال ${serialNum} غير مسجل بطابور الطباعة`, 'error');
      return;
    }

    const updated = printJobs.map(j => {
      if (j.id === job.id) {
        return {
          ...j,
          status: 'Reprint Requested' as PrintQueueStatus,
          reprintCount: (j.reprintCount || 0) + 1,
          failedReason: undefined
        };
      }
      return j;
    });

    ErpDatabase.savePrintJobs(updated);
    setPrintJobs(updated);

    ErpDatabase.addAuditLog(
      'Reprinting',
      `طلب إعادة طباعة استثنائي للسيريال ${serialNum} - السبب: ${reprintReason}`
    );

    setReprintSerialInput('');
    showToast(`تمت الموافقة على إعادة طباعة السيريال ${serialNum} وإدراجه كأولوية بطابور الطباعة`);
  };

  return (
    <div className="space-y-5 text-right font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between shadow-md animate-fade-in ${
          toastMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
          toastMessage.type === 'error' ? 'bg-rose-50 text-rose-800 border-rose-200' :
          'bg-blue-50 text-blue-800 border-blue-200'
        }`}>
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' && <CheckCircle2 size={16} className="text-emerald-600" />}
            {toastMessage.type === 'error' && <AlertTriangle size={16} className="text-rose-600" />}
            {toastMessage.type === 'info' && <Activity size={16} className="text-blue-600" />}
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-xs opacity-70 hover:opacity-100">&times;</button>
        </div>
      )}

      {/* 5 Distinct Print Subtabs */}
      <div className="flex border-b border-border-main gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('printers')}
          className={`pb-2.5 px-3 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'printers'
              ? 'border-b-2 border-blue-600 text-[#0B2D5C] dark:text-blue-400'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <HardDrive size={14} />
          <span>1. حالة الطابعات (Printer Status)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('queue')}
          className={`pb-2.5 px-3 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'queue'
              ? 'border-b-2 border-blue-600 text-[#0B2D5C] dark:text-blue-400'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Printer size={14} />
          <span>2. طابور الطباعة (Print Queue)</span>
          <span className="px-1.5 py-0.2 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-full text-[10px] font-mono">
            {printJobs.filter(j => j.status === 'Ready' || j.status === 'Reprint Requested').length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('preview')}
          className={`pb-2.5 px-3 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'preview'
              ? 'border-b-2 border-blue-600 text-[#0B2D5C] dark:text-blue-400'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Eye size={14} />
          <span>3. معاينة الملصق (Label Preview)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reprint')}
          className={`pb-2.5 px-3 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'reprint'
              ? 'border-b-2 border-blue-600 text-[#0B2D5C] dark:text-blue-400'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <RotateCcw size={14} />
          <span>4. سجل إعادة الطباعة (Reprint History)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit')}
          className={`pb-2.5 px-3 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'audit'
              ? 'border-b-2 border-blue-600 text-[#0B2D5C] dark:text-blue-400'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <ShieldCheck size={14} />
          <span>5. تدقيق الطباعة (Print Audit)</span>
        </button>
      </div>

      {/* 1. PRINTER STATUS */}
      {activeSubTab === 'printers' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-border-main pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#0B2D5C] dark:text-text-primary flex items-center gap-1.5">
                <HardDrive size={16} className="text-blue-600" />
                <span>حالة وتوصيل طابعات الباركود الصناعية (Printer Status & Connectivity)</span>
              </h3>
              <p className="text-[11px] text-text-secondary">مراقبة الطابعات الحرارية المربوطة بشبكة مصنع سليبي وحالة استجابتها.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-border-main bg-surface p-4 rounded-2xl shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-extrabold text-[#0B2D5C] text-xs">ZEBRA ZT411 Industrial</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black flex items-center gap-1">
                  <CheckCircle2 size={10} />
                  <span>جاهزة ومربوطة (Online)</span>
                </span>
              </div>
              <div className="text-[11px] text-text-secondary space-y-1">
                <div>• النوع: <span className="font-bold text-text-primary">Thermal Transfer (300 DPI)</span></div>
                <div>• عنوان IP: <span className="font-bold font-mono text-blue-600">192.168.1.120:9100</span></div>
                <div>• الموقع: <span className="font-bold text-text-primary">خط الإنتاج الرئيسي - محطة التغليف 1</span></div>
                <div>• حالة الرول: <span className="text-emerald-600 font-bold">متبقي 82%</span></div>
              </div>
              <button
                onClick={() => showToast('تم إرسال أمر معايرة وطباعة صفحة الاختبار إلى ZEBRA ZT411 بنجاح')}
                className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
              >
                طباعة صفحة اختبار ومعايرة
              </button>
            </div>

            <div className="border border-border-main bg-surface p-4 rounded-2xl shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-extrabold text-[#0B2D5C] text-xs">ZEBRA ZT421 Packaging Line</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black flex items-center gap-1">
                  <CheckCircle2 size={10} />
                  <span>جاهزة ومربوطة (Online)</span>
                </span>
              </div>
              <div className="text-[11px] text-text-secondary space-y-1">
                <div>• النوع: <span className="font-bold text-text-primary">Direct Thermal (203 DPI)</span></div>
                <div>• عنوان IP: <span className="font-bold font-mono text-blue-600">192.168.1.121:9100</span></div>
                <div>• الموقع: <span className="font-bold text-text-primary">خط الإنتاج 2 - تجهيز المراتب الفاخرة</span></div>
                <div>• حالة الرول: <span className="text-emerald-600 font-bold">متبقي 95%</span></div>
              </div>
              <button
                onClick={() => showToast('تم إرسال أمر معايرة وطباعة صفحة الاختبار إلى ZEBRA ZT421 بنجاح')}
                className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
              >
                طباعة صفحة اختبار ومعايرة
              </button>
            </div>

            <div className="border border-border-main bg-surface p-4 rounded-2xl shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-extrabold text-[#0B2D5C] text-xs">TOSHIBA B-EX4T2 Final</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black flex items-center gap-1">
                  <CheckCircle2 size={10} />
                  <span>جاهزة ومربوطة (Online)</span>
                </span>
              </div>
              <div className="text-[11px] text-text-secondary space-y-1">
                <div>• النوع: <span className="font-bold text-text-primary">Near-Edge Head (600 DPI)</span></div>
                <div>• عنوان IP: <span className="font-bold font-mono text-blue-600">192.168.1.125:9100</span></div>
                <div>• الموقع: <span className="font-bold text-text-primary">مستودع التجهيز وتكويد الكراتين</span></div>
                <div>• حالة الرول: <span className="text-emerald-600 font-bold">متبقي 67%</span></div>
              </div>
              <button
                onClick={() => showToast('تم إرسال أمر معايرة وطباعة صفحة الاختبار إلى TOSHIBA B-EX4T2 بنجاح')}
                className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
              >
                طباعة صفحة اختبار ومعايرة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRINT QUEUE */}
      {activeSubTab === 'queue' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border-main pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#0B2D5C] dark:text-text-primary flex items-center gap-1.5">
                <Printer size={16} className="text-blue-600" />
                <span>طابور طباعة الملصقات الصناعية (Print Queue Management)</span>
              </h3>
              <p className="text-[11px] text-text-secondary">إدارة تذاكر طباعة ملصقات الباركود والـ QR Code لخطوط التغليف والتجهيز.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-secondary">الطابعة المستهدفة:</span>
              <select
                value={selectedPrinter}
                onChange={(e) => setSelectedPrinter(e.target.value)}
                className="h-9 px-2 bg-surface border border-border-main rounded-xl text-xs font-bold outline-none cursor-pointer"
              >
                <option value="ZEBRA-INDUSTRIAL-01">ZEBRA ZT411 Industrial (Online)</option>
                <option value="ZEBRA-PACK-02">ZEBRA ZT421 Packaging Line (Online)</option>
                <option value="TOSHIBA-DESK-01">TOSHIBA B-EX4T2 Warehouse (Online)</option>
              </select>

              <button
                onClick={handlePrintAllReady}
                className="px-4 py-2 bg-[#0B2D5C] hover:bg-[#133358] text-white text-xs font-bold rounded-xl active:scale-95 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Printer size={14} />
                <span>طباعة كل الجاهز</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-surface border border-border-main p-3 rounded-2xl">
            <div className="relative sm:col-span-2">
              <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث برقم السيريال، الضمان، أو التشغيلة..."
                className="w-full h-9 pr-9 pl-3 bg-surface border border-border-main rounded-xl text-xs outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full h-9 px-3 bg-surface border border-border-main rounded-xl text-xs font-bold outline-none cursor-pointer"
              >
                <option value="All">كل الحالات (Queue Status)</option>
                <option value="Ready">Ready (جاهز للطباعة)</option>
                <option value="Printing">Printing (قيد الإرسال)</option>
                <option value="Printed">Printed (مطبوع)</option>
                <option value="Failed">Failed (تعثرت الطباعة)</option>
                <option value="Reprint Requested">Reprint Requested (طلب إعادة طباعة)</option>
                <option value="Cancelled">Cancelled (ملغي)</option>
              </select>
            </div>
          </div>

          <div className="border border-border-main bg-surface rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-border-main">
                <tr>
                  <th className="p-3">السيريال Serial</th>
                  <th className="p-3">رقم الضمان WAR</th>
                  <th className="p-3">المنتج، التشغيلة والارتباط (Relational Context)</th>
                  <th className="p-3 text-center">الحالة</th>
                  <th className="p-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main font-semibold text-text-primary">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-400 font-bold">
                      لا توجد تذاكر بطابور الطباعة تطابق محددات البحث.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => {
                    const ctx = getProductionContext(job);
                    return (
                      <tr 
                        key={job.id} 
                        onClick={() => setSelectedJobId(job.id)}
                        className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all cursor-pointer ${
                          activeJob?.id === job.id ? 'bg-blue-50/60 dark:bg-blue-950/30' : ''
                        }`}
                      >
                        <td className="p-3 font-mono font-bold text-blue-700 dark:text-blue-400">{job.serialNumber}</td>
                        <td className="p-3 font-mono text-teal-600">{job.warrantyNumber}</td>
                        <td className="p-3">
                          <div className="font-black text-slate-800 dark:text-slate-200">{job.productName} ({ctx.dimension})</div>
                          <div className="flex items-center gap-2 text-[10px] mt-0.5">
                            <span className="px-1.5 py-0.2 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-black rounded-md">{ctx.orderNumber}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-purple-600 font-mono font-bold">{job.batchNumber}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-amber-600 font-mono font-bold">{ctx.version}</span>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            job.status === 'Ready' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            job.status === 'Printed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            job.status === 'Failed' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            job.status === 'Reprint Requested' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {job.status}
                          </span>
                          {job.reprintCount > 0 && (
                            <span className="block text-[9px] text-purple-600 font-mono mt-0.5">
                              إعادة #{job.reprintCount}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-1">
                            {job.status !== 'Printed' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePrintSingle(job);
                                }}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                              >
                                <Printer size={11} />
                                <span>طباعة</span>
                              </button>
                            )}

                            {job.status === 'Ready' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkFailed(job);
                                }}
                                title="تسجيل تعثر بالطباعة"
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer"
                              >
                                <AlertTriangle size={14} />
                              </button>
                            )}

                            {job.status === 'Printed' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePrintSingle(job);
                                }}
                                title="إعادة طباعة سريعة"
                                className="p-1 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-all cursor-pointer flex items-center gap-1 text-[10px]"
                              >
                                <RotateCcw size={13} />
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedJobId(job.id);
                                  setActiveSubTab('preview');
                              }}
                              title="معاينة الملصق"
                              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all cursor-pointer"
                            >
                              <Eye size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. LABEL PREVIEW */}
      {activeSubTab === 'preview' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-border-main pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#0B2D5C] dark:text-text-primary flex items-center gap-1.5">
                <Eye size={16} className="text-blue-600" />
                <span>معاينة الملصق المباشرة ومواصفات الباركود (Live Label Preview)</span>
              </h3>
              <p className="text-[11px] text-text-secondary">المطابقة البصرية لملصق التغليف، أبعاد الكود، ورمز الاستجابة السريعة QR قبل الإرسال.</p>
            </div>

            {activeJob && (
              <button
                onClick={() => handlePrintSingle(activeJob)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl active:scale-95 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Printer size={14} />
                <span>طباعة هذا الملصق الآن</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Label Card */}
            <div className="md:col-span-5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-2xl p-6 flex flex-col items-center">
              {activeJob ? (
                <div className="bg-white text-black p-6 border-2 border-dashed border-slate-300 rounded-2xl space-y-4 font-mono select-none shadow-md w-full max-w-[320px]">
                  <div className="text-center border-b pb-2.5 border-slate-200">
                    <span className="text-xl font-black tracking-widest text-[#0B2D5C] block">
                      SLEEPEE
                    </span>
                    <span className="text-[9px] text-slate-500 font-bold tracking-wider">OFFICIAL WARRANTY & QR SECURITY</span>
                  </div>

                  {/* Product Details */}
                  <div className="text-right text-xs space-y-1 font-sans">
                    <div>• الموديل: <span className="font-extrabold">{activeJob.productName}</span></div>
                    <div>• المقاس: <span className="font-bold font-mono text-blue-700">{activeJob.sizeLabel}</span></div>
                    <div>• التشغيلة: <span className="font-bold font-mono text-purple-700">{activeJob.batchNumber}</span></div>
                    <div>• الضمان: <span className="font-bold text-emerald-700">{getPolicyYears(activeJob.productId)} سنوات معتمدة</span></div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border text-center space-y-1">
                    <div className="text-[9px] text-slate-500 font-bold">SERIAL NUMBER</div>
                    <div className="text-sm font-black font-mono tracking-wider text-blue-900">{activeJob.serialNumber}</div>
                    <div className="text-[9px] text-slate-500 border-t pt-1 mt-1 font-bold">WARRANTY CERTIFICATE</div>
                    <div className="text-xs font-black text-teal-800 font-mono tracking-wider">{activeJob.warrantyNumber}</div>
                  </div>

                  <div className="flex items-center justify-around pt-2">
                    <div className="flex flex-col items-center">
                      <div className="flex gap-[1px] h-10 items-end">
                        <div className="w-[1px] bg-black h-full"></div>
                        <div className="w-[2px] bg-black h-full"></div>
                        <div className="w-[1px] bg-black h-full"></div>
                        <div className="w-[3px] bg-black h-full"></div>
                        <div className="w-[1px] bg-black h-full"></div>
                        <div className="w-[2px] bg-black h-full"></div>
                        <div className="w-[1px] bg-black h-full"></div>
                        <div className="w-[2px] bg-black h-full"></div>
                      </div>
                      <span className="text-[8px] text-slate-500 mt-1">*{activeJob.serialNumber}*</span>
                    </div>

                    <div className="w-16 h-16 border p-1 rounded-md bg-white">
                      <div dangerouslySetInnerHTML={{ __html: ErpDatabase.generateQR(activeJob.warrantyNumber, activeJob.serialNumber, activeProduct?.internalProductCode || '') }} />
                    </div>
                  </div>

                  <div className="text-center text-[8px] text-slate-400 font-bold border-t pt-2 border-slate-100">
                    Sleepee Industrial Quality Systems • Certified
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400 text-xs font-bold">
                  اختر تذكرة من طابور الطباعة لمعاينتها هنا.
                </div>
              )}
            </div>

            {/* Label Specification Details with PROMINENT Relational Production Context */}
            <div className="md:col-span-7 bg-surface border border-border-main rounded-2xl p-5 space-y-4 shadow-2xs">
              <h4 className="font-extrabold text-xs text-[#0B2D5C] dark:text-blue-300 border-b pb-2 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-blue-600" />
                <span>بيانات ومعلومات تتبع أمر التشغيل (Relational Production Context)</span>
              </h4>

              {activeJob ? (
                (() => {
                  const ctx = getProductionContext(activeJob);
                  return (
                    <div className="space-y-3.5 text-xs font-bold text-text-primary">
                      <div className="p-3 bg-blue-50/50 dark:bg-slate-900 border border-blue-100 rounded-xl flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-bold block">أمر التشغيل المرتبط (Production Order):</span>
                        <span className="font-mono text-sm text-blue-800 dark:text-blue-300 font-black">{ctx.orderNumber}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                          <span className="text-[10px] text-slate-400 block">موديل المنتج (Product Model):</span>
                          <span className="text-slate-800 dark:text-slate-200">{ctx.productModel}</span>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                          <span className="text-[10px] text-slate-400 block">الإصدار (Version):</span>
                          <span className="text-purple-600 font-mono">{ctx.version}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                          <span className="text-[10px] text-slate-400 block">المقاس والأبعاد (Dimension):</span>
                          <span className="font-mono text-slate-800 dark:text-slate-200">{ctx.dimension}</span>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                          <span className="text-[10px] text-slate-400 block">التشغيلة (Batch):</span>
                          <span className="text-amber-700 font-mono">{ctx.batch}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-50/40 dark:bg-slate-900 border border-emerald-100 rounded-xl">
                        <span className="text-[10px] text-emerald-800 block">نطاق الأرقام التسلسلية المشمول (Serial Range):</span>
                        <span className="font-mono text-emerald-700 dark:text-emerald-300 text-xs tracking-wider block mt-1">{ctx.serialRange}</span>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <p className="text-slate-400 text-xs">اختر ملصقاً من طابور الطباعة لعرض بيانات تتبع أمر التشغيل المرتبطة به.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. REPRINT HISTORY */}
      {activeSubTab === 'reprint' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-900">
            <h4 className="text-xs font-extrabold flex items-center gap-1.5 mb-1 text-amber-800">
              <HelpCircle size={14} />
              <span>إرشادات مركز وسجل إعادة الطباعة (Reprint Security Center)</span>
            </h4>
            <p className="text-[11px] leading-relaxed">
              إعادة طباعة أي ملصق منتهٍ أو معيب تتطلب توثيق العملية تلقائياً في سجلات الجودة والتدقيق وتوضيح السبب لمنع التكرار غير المعتمد.
            </p>
          </div>

          <div className="border border-border-main bg-surface rounded-2xl overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-border-main">
              <span className="text-xs font-bold text-text-primary">إعادة طباعة ملصق معتمد مع توثيق الأسباب</span>
            </div>
            <div className="p-6 space-y-4 max-w-xl text-xs">
              <div>
                <label className="block font-bold text-text-primary mb-1">الرقم التسلسلي المطلوب إعادة طباعته:</label>
                <input
                  type="text"
                  value={reprintSerialInput}
                  onChange={(e) => setReprintSerialInput(e.target.value)}
                  placeholder="مثال: SLP-2026-000001"
                  className="w-full h-10 px-3 bg-slate-50 border border-border-main rounded-xl text-xs font-mono tracking-wider outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-text-primary mb-1">سبب إعادة الطباعة المعتمد:</label>
                <select
                  value={reprintReason}
                  onChange={(e) => setReprintReason(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-border-main rounded-xl font-bold outline-none cursor-pointer"
                >
                  <option value="تلف في الملصق أثناء التغليف">تلف في الملصق أثناء التغليف</option>
                  <option value="بهتان في الحبر أو عدم وضوح الباركود">بهتان في الحبر أو عدم وضوح الباركود</option>
                  <option value="تمزق الملصق أثناء النقل والتحميل">تمزق الملصق أثناء النقل والتحميل</option>
                  <option value="فحص جودة استثنائي بطلب من إدارة الجودة">فحص جودة استثنائي بطلب من إدارة الجودة</option>
                </select>
              </div>

              <button
                onClick={() => {
                  if (reprintSerialInput.trim()) {
                    handleReprintRequest(reprintSerialInput.trim());
                  }
                }}
                disabled={!reprintSerialInput.trim()}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all cursor-pointer shadow-xs"
              >
                اعتماد طلب إعادة الطباعة وتوثيقه بسجل التدقيق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. PRINT AUDIT */}
      {activeSubTab === 'audit' && (
        <div className="space-y-4 animate-fade-in">
          <div className="border border-border-main bg-surface rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100/60 dark:bg-surface text-text-secondary font-bold border-b border-border-main">
                <tr>
                  <th className="p-3">رقم تذكرة التدقيق</th>
                  <th className="p-3">الإجراء</th>
                  <th className="p-3">المشغل</th>
                  <th className="p-3">الوقت والتاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-border-main font-semibold text-text-primary">
                {ErpDatabase.getAuditLogs()
                  .filter(l => l.action === 'Printing' || l.action === 'Reprinting' || l.action === 'Print Failure')
                  .map((log, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono text-slate-400">{log.id}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300">{log.details}</td>
                      <td className="p-3 font-bold">{log.operator}</td>
                      <td className="p-3 font-mono text-slate-500">
                        {new Date(log.timestamp).toLocaleString('ar-EG')}
                      </td>
                    </tr>
                  ))}
                {ErpDatabase.getAuditLogs().filter(l => l.action === 'Printing' || l.action === 'Reprinting' || l.action === 'Print Failure').length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 font-bold">
                      لا توجد عمليات طباعة مسجلة بسجل التدقيق حالياً.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
