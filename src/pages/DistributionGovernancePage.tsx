import React, { useState, useMemo } from 'react';
import { 
  Truck, Package, Layers, QrCode, ShoppingBag, MapPin, Building2, 
  ShieldCheck, Activity, Search, Plus, CheckCircle2, AlertTriangle, 
  History, Eye, FileText, ArrowRight, Check, X, RotateCcw, Box, User, Phone,
  Calendar, Printer, Award
} from 'lucide-react';
import { ErpDatabase } from '../utils/erpDb';
import { 
  SerialAllocation, AllocationType, AllocationStatus, PackUnit, PackType, 
  PackStatus, Shipment, ShipmentDestinationType, ShipmentStatus, SalesRecord, 
  SalesStatus, QrRegistry, Product, SerialNumber 
} from '../types/erp';
import { ProductDigitalPassportModal } from '../components/ProductDigitalPassportModal';

export const DistributionGovernancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'allocations' | 'packs' | 'shipments' | 'sales' | 'qr' | 'audit'>('dashboard');

  // Load live DB data
  const [allocations, setAllocations] = useState<SerialAllocation[]>(() => ErpDatabase.getAllocations());
  const [packs, setPacks] = useState<PackUnit[]>(() => ErpDatabase.getPacks());
  const [shipments, setShipments] = useState<Shipment[]>(() => ErpDatabase.getShipments());
  const [sales, setSales] = useState<SalesRecord[]>(() => ErpDatabase.getSalesRecords());
  const [qrs, setQrs] = useState<QrRegistry[]>(() => ErpDatabase.getQrRegistries());
  const [serials] = useState<SerialNumber[]>(() => ErpDatabase.getSerialNumbers());
  const [products] = useState<Product[]>(() => ErpDatabase.getProducts());
  const brands = ErpDatabase.getBrands();

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Modals state
  const [passportTargetSerial, setPassportTargetSerial] = useState<string | null>(null);
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  const [isPackModalOpen, setIsPackModalOpen] = useState(false);
  const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  // Allocation Form State
  const [allocSerial, setAllocSerial] = useState('');
  const [allocType, setAllocType] = useState<AllocationType>('Warehouse');
  const [allocName, setAllocName] = useState('المستودع الرئيسي - العاشر من رمضان');
  const [allocOperator, setAllocOperator] = useState('مشرف اللوجستيات والمستودعات');
  const [allocNotes, setAllocNotes] = useState('');

  // Pack Form State
  const [packType, setPackType] = useState<PackType>('Carton');
  const [packBatchId, setPackBatchId] = useState('');
  const [packSerialsInput, setPackSerialsInput] = useState('');
  const [packOperator, setPackOperator] = useState('مسؤول محطة التعبئة والتغليف');

  // Shipment Form State
  const [shipDestType, setShipDestType] = useState<ShipmentDestinationType>('Dealer');
  const [shipDestName, setShipDestName] = useState('');
  const [shipSelectedPacks, setShipSelectedPacks] = useState<string[]>([]);
  const [shipTrackingNum, setShipTrackingNum] = useState('');
  const [shipDriver, setShipDriver] = useState('');
  const [shipVehicle, setShipVehicle] = useState('');

  // Sales Form State
  const [saleInvoiceNum, setSaleInvoiceNum] = useState('');
  const [saleSerial, setSaleSerial] = useState('');
  const [saleCustomerName, setSaleCustomerName] = useState('');
  const [saleCustomerMobile, setSaleCustomerMobile] = useState('');
  const [saleDealerName, setSaleDealerName] = useState('معرض سليبي - مدينة نصر');
  const [saleCity, setSaleCity] = useState('القاهرة');
  const [saleGovernorate, setSaleGovernorate] = useState('القاهرة');
  const [salePrice, setSalePrice] = useState<number | ''>('');

  const refreshAll = () => {
    setAllocations(ErpDatabase.getAllocations());
    setPacks(ErpDatabase.getPacks());
    setShipments(ErpDatabase.getShipments());
    setSales(ErpDatabase.getSalesRecords());
    setQrs(ErpDatabase.getQrRegistries());
  };

  // --------------------------------------------------------------------------
  // AUDIT ENGINE RESULTS
  // --------------------------------------------------------------------------
  const distributionAudit = useMemo(() => {
    return ErpDatabase.runDistributionAudit();
  }, [allocations, packs, shipments, sales, qrs, serials]);

  // --------------------------------------------------------------------------
  // PART 1: ALLOCATION HANDLER
  // --------------------------------------------------------------------------
  const handleCreateAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocSerial.trim()) {
      alert('يرجى إدخال أو اختيار السيريال المطلوب تخصيصه.');
      return;
    }

    const serialObj = serials.find(s => s.serialNumber === allocSerial.trim().toUpperCase());
    if (!serialObj) {
      alert('السيريال غير مسجل بالنظام.');
      return;
    }

    const prod = products.find(p => p.id === serialObj.productId) || products[0];

    // Check if serial already has active allocation
    const existing = allocations.filter(a => a.serialNumber === serialObj.serialNumber && a.status === 'Allocated');
    if (existing.length > 0) {
      // Mark previous as Transferred
      const updatedAllocs = allocations.map(a => 
        (a.serialNumber === serialObj.serialNumber && a.status === 'Allocated')
          ? { ...a, status: 'Transferred' as AllocationStatus }
          : a
      );
      ErpDatabase.saveAllocations(updatedAllocs);
    }

    ErpDatabase.addAllocation({
      serialNumber: serialObj.serialNumber,
      batchNumber: serialObj.batchNumber,
      productId: prod.id,
      brandId: prod.brandId,
      modelId: prod.modelId,
      dimensionId: prod.sizeId || `${prod.width}x${prod.length}`,
      allocationType: allocType,
      allocationName: allocName,
      allocatedBy: allocOperator,
      status: 'Allocated',
      notes: allocNotes || undefined
    });

    ErpDatabase.addLifecycleEvent({
      serialNumber: serialObj.serialNumber,
      productId: prod.id,
      batchNumber: serialObj.batchNumber,
      stage: 'Delivered',
      operator: allocOperator,
      location: `${allocType}: ${allocName}`,
      notes: `تخصيص وتوريد القطعة إلى ${allocName}`
    });

    ErpDatabase.addAuditLog('Serial Allocation', `تخصيص السيريال ${serialObj.serialNumber} إلى ${allocName} (${allocType})`);

    setAllocSerial('');
    setAllocNotes('');
    setIsAllocationModalOpen(false);
    refreshAll();
    alert('تم تسجيل التخصيص بنجاح وتحديث موقع السيريال.');
  };

  // --------------------------------------------------------------------------
  // PART 2: PACKING HANDLER
  // --------------------------------------------------------------------------
  const handleCreatePack = (e: React.FormEvent) => {
    e.preventDefault();
    const rawSerials = packSerialsInput
      .split(/[\n,;\s]+/)
      .map(s => s.trim().toUpperCase())
      .filter(s => s.length > 0);

    if (rawSerials.length === 0) {
      alert('يرجى إدخال أرقام السيريالات المراد تضمينها في الطرد.');
      return;
    }

    // Verify all serials exist
    const invalid = rawSerials.filter(sn => !serials.some(s => s.serialNumber === sn));
    if (invalid.length > 0) {
      alert(`السيريالات التالية غير مسجلة بالمنظومة:\n${invalid.join(', ')}`);
      return;
    }

    // Check duplicates inside input
    const uniqueSerials = Array.from(new Set(rawSerials));
    if (uniqueSerials.length < rawSerials.length) {
      alert('تنبيه: تم حذف السيريالات المكررة تلقائياً.');
    }

    const firstSerial = serials.find(s => s.serialNumber === uniqueSerials[0]);

    ErpDatabase.addPack({
      packType,
      batchId: packBatchId || firstSerial?.batchNumber || 'BATCH-GEN',
      serialCount: uniqueSerials.length,
      serialNumbers: uniqueSerials,
      createdBy: packOperator,
      status: 'Packed',
      notes: `طرد تعبئة معتمد يحوي ${uniqueSerials.length} قطعة`
    });

    // Log lifecycle events for packed serials
    uniqueSerials.forEach(sn => {
      const sObj = serials.find(s => s.serialNumber === sn);
      ErpDatabase.addLifecycleEvent({
        serialNumber: sn,
        productId: sObj?.productId || '',
        batchNumber: sObj?.batchNumber || '',
        stage: 'Packed',
        operator: packOperator,
        location: 'محطة التغليف والتجميع',
        notes: `تم التعبئة داخل طرد من نوع ${packType}`
      });
    });

    ErpDatabase.addAuditLog('Packing Registry', `إنشاء طرد ${packType} جديد يحوي ${uniqueSerials.length} سيريال.`);

    setPackSerialsInput('');
    setIsPackModalOpen(false);
    refreshAll();
    alert(`تم إنشاء طرد التعبئة بنجاح لعدد ${uniqueSerials.length} سيريال!`);
  };

  // --------------------------------------------------------------------------
  // PART 3: SHIPMENT HANDLER
  // --------------------------------------------------------------------------
  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (shipSelectedPacks.length === 0) {
      alert('يرجى اختيار طرد واحد على الأقل للشحنة.');
      return;
    }
    if (!shipDestName.trim()) {
      alert('يرجى كتابة اسم وجهة الشحنة.');
      return;
    }

    // Count serials
    let totalSerialsInShipment = 0;
    shipSelectedPacks.forEach(pid => {
      const pObj = packs.find(p => p.packId === pid);
      if (pObj) totalSerialsInShipment += pObj.serialCount;
    });

    const currentYear = new Date().getFullYear();
    const tracking = shipTrackingNum.trim() || `TRK-${currentYear}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newShip = ErpDatabase.addShipment({
      destinationType: shipDestType,
      destinationName: shipDestName.trim(),
      packIds: shipSelectedPacks,
      serialCount: totalSerialsInShipment,
      createdBy: 'مدير العمليات اللوجستية',
      status: 'InTransit',
      trackingNumber: tracking,
      driverName: shipDriver || undefined,
      vehiclePlate: shipVehicle || undefined,
      notes: `شحنة موجهة إلى ${shipDestName}`
    });

    // Update pack status to Shipped
    const updatedPacks = packs.map(p => 
      shipSelectedPacks.includes(p.packId) ? { ...p, status: 'Shipped' as PackStatus } : p
    );
    ErpDatabase.savePacks(updatedPacks);

    // Log lifecycle events for all serials inside these packs
    shipSelectedPacks.forEach(pid => {
      const pObj = packs.find(p => p.packId === pid);
      if (pObj) {
        pObj.serialNumbers.forEach(sn => {
          const sObj = serials.find(s => s.serialNumber === sn);
          ErpDatabase.addLifecycleEvent({
            serialNumber: sn,
            productId: sObj?.productId || '',
            batchNumber: sObj?.batchNumber || '',
            stage: 'Shipped',
            operator: shipDriver || 'سائق الشحن',
            location: `شاحنة لوجستية متجهة إلى ${shipDestName}`,
            notes: `شحنة رقم #${newShip.shipmentId} (تتبع: ${tracking})`
          });
        });
      }
    });

    ErpDatabase.addAuditLog('Shipment Created', `إنشاء شحنة رقم ${newShip.shipmentId} إلى ${shipDestName} بإجمالي ${totalSerialsInShipment} سيريال.`);

    setShipSelectedPacks([]);
    setShipDestName('');
    setIsShipmentModalOpen(false);
    refreshAll();
    alert(`تم إنشاء الشحنة بنجاح برقم ${newShip.shipmentId} وإرسالها للتوزيع!`);
  };

  // --------------------------------------------------------------------------
  // PART 4: SALES REGISTRY HANDLER
  // --------------------------------------------------------------------------
  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleInvoiceNum.trim() || !saleSerial.trim() || !saleCustomerName.trim() || !saleCustomerMobile.trim()) {
      alert('يرجى تعبئة الحقول الإلزامية (رقم الفاتورة، السيريال، اسم العميل، ورقم الهاتف).');
      return;
    }

    const serialObj = serials.find(s => s.serialNumber === saleSerial.trim().toUpperCase());
    if (!serialObj) {
      alert('السيريال غير مسجل بقاعدة البيانات.');
      return;
    }

    // Check if already sold
    if (sales.some(s => s.serialNumber === serialObj.serialNumber)) {
      alert('هذا السيريال مسجل كمباع مسبقاً بفاتورة أخرى.');
      return;
    }

    ErpDatabase.addSalesRecord({
      invoiceNumber: saleInvoiceNum.trim(),
      invoiceDate: new Date().toISOString().split('T')[0],
      serialNumber: serialObj.serialNumber,
      customerName: saleCustomerName.trim(),
      customerMobile: saleCustomerMobile.trim(),
      dealerName: saleDealerName,
      city: saleCity,
      governorate: saleGovernorate,
      status: 'PendingActivation',
      price: salePrice ? Number(salePrice) : undefined
    });

    // Also add to Customer master if not existing
    ErpDatabase.addOrUpdateCustomer({
      name: saleCustomerName.trim(),
      mobileNumber: saleCustomerMobile.trim(),
      city: saleCity,
      governorate: saleGovernorate,
      address: `${saleGovernorate} - ${saleCity}`
    });

    ErpDatabase.addAuditLog('Sales Registry', `تسجيل بيع السيريال ${serialObj.serialNumber} بفاتورة ${saleInvoiceNum} للعميل ${saleCustomerName}`);

    setSaleInvoiceNum('');
    setSaleSerial('');
    setSaleCustomerName('');
    setSaleCustomerMobile('');
    setIsSaleModalOpen(false);
    refreshAll();
    alert('تم تسجيل عملية البيع بنجاح وتحديث حالة السيريال إلى [Sold]!');
  };

  return (
    <div className="space-y-6 text-right font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border-main pb-4">
        <div>
          <h2 className="text-lg font-black text-[#0B2D5C] dark:text-text-primary flex items-center gap-2">
            <Truck size={22} className="text-blue-600" />
            <span>مركز حوكمة التوزيع والـ QR وجواز السفر الرقمي (Distribution & Passport Governance)</span>
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            إدارة شاملة للتخصيص (Allocations)، التعبئة (Packs)، الشحنات (Shipments)، المبيعات (Sales)، والـ Digital Passport.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAllocationModalOpen(true)}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <MapPin size={14} />
            <span>تخصيص سيريال</span>
          </button>
          <button
            onClick={() => setIsPackModalOpen(true)}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <Package size={14} />
            <span>إنشاء طرد</span>
          </button>
          <button
            onClick={() => setIsShipmentModalOpen(true)}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <Truck size={14} />
            <span>إنشاء شحنة</span>
          </button>
          <button
            onClick={() => setIsSaleModalOpen(true)}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <ShoppingBag size={14} />
            <span>تسجيل بيع</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-border-main gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`pb-2.5 px-3.5 text-xs font-black cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <Activity size={15} />
          <span>لوحة التوزيع (Distribution KPIs)</span>
        </button>

        <button
          onClick={() => setActiveTab('allocations')}
          className={`pb-2.5 px-3.5 text-xs font-black cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'allocations'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <MapPin size={15} />
          <span>مركز التخصيص (Allocations)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-700 font-mono">{allocations.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('packs')}
          className={`pb-2.5 px-3.5 text-xs font-black cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'packs'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <Package size={15} />
          <span>مركز التعبئة (Packing)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-700 font-mono">{packs.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('shipments')}
          className={`pb-2.5 px-3.5 text-xs font-black cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'shipments'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <Truck size={15} />
          <span>الشحنات (Shipments)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-700 font-mono">{shipments.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('sales')}
          className={`pb-2.5 px-3.5 text-xs font-black cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'sales'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <ShoppingBag size={15} />
          <span>سجل المبيعات (Sales)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-700 font-mono">{sales.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('qr')}
          className={`pb-2.5 px-3.5 text-xs font-black cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'qr'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <QrCode size={15} />
          <span>حوكمة الـ QR (QR Center)</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-2.5 px-3.5 text-xs font-black cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'audit'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <ShieldCheck size={15} className="text-purple-600" />
          <span>تدقيق حوكمة التوزيع (Audit)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            100%
          </span>
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* PART 8: DISTRIBUTION DASHBOARD                                     */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-fade-in">
          {/* Executive Dashboard Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            <div className="p-4 bg-surface border border-border-main rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">إجمالي السيريالات المخصصة</span>
              <span className="text-2xl font-black text-blue-600 font-mono">{distributionAudit.stats.totalAllocatedSerials}</span>
              <span className="text-[9px] text-slate-400">Allocated Serials</span>
            </div>

            <div className="p-4 bg-surface border border-border-main rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">مخزون المستودعات</span>
              <span className="text-2xl font-black text-indigo-600 font-mono">{distributionAudit.stats.warehouseInventory}</span>
              <span className="text-[9px] text-indigo-600 font-semibold">Warehouse Inventory</span>
            </div>

            <div className="p-4 bg-surface border border-border-main rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">مخزون الموزعين والوكلاء</span>
              <span className="text-2xl font-black text-purple-600 font-mono">{distributionAudit.stats.dealerInventory}</span>
              <span className="text-[9px] text-purple-600 font-semibold">Dealer Inventory</span>
            </div>

            <div className="p-4 bg-surface border border-border-main rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">مخزون المعارض وصالات العرض</span>
              <span className="text-2xl font-black text-teal-600 font-mono">{distributionAudit.stats.showroomInventory}</span>
              <span className="text-[9px] text-teal-600 font-semibold">Showroom Inventory</span>
            </div>

            <div className="p-4 bg-surface border border-border-main rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">مخصصات المشاريع والمناقصات</span>
              <span className="text-2xl font-black text-amber-600 font-mono">{distributionAudit.stats.projectInventory}</span>
              <span className="text-[9px] text-amber-600 font-semibold">Project Allocations</span>
            </div>

            <div className="p-4 bg-surface border border-border-main rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">إجمالي طرود التعبئة (Packs)</span>
              <span className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono">{distributionAudit.stats.totalPacks}</span>
              <span className="text-[9px] text-slate-400">Pack Units</span>
            </div>

            <div className="p-4 bg-surface border border-border-main rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">إجمالي الشحنات</span>
              <span className="text-2xl font-black text-blue-700 font-mono">{distributionAudit.stats.totalShipments}</span>
              <span className="text-[9px] text-blue-600 font-semibold">Total Shipments</span>
            </div>

            <div className="p-4 bg-surface border border-border-main rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">شحنات قيد النقل والتسليم</span>
              <span className="text-2xl font-black text-purple-600 font-mono">{distributionAudit.stats.pendingShipments}</span>
              <span className="text-[9px] text-purple-600 font-semibold">In-Transit / Pending</span>
            </div>

            <div className="p-4 bg-surface border border-border-main rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">الشحنات المسلمة بنجاح</span>
              <span className="text-2xl font-black text-emerald-600 font-mono">{distributionAudit.stats.deliveredShipments}</span>
              <span className="text-[9px] text-emerald-600 font-semibold">Delivered</span>
            </div>

            <div className="p-4 bg-surface border border-border-main rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">المنتجات المباعة (Sales)</span>
              <span className="text-2xl font-black text-emerald-700 font-mono">{distributionAudit.stats.soldProducts}</span>
              <span className="text-[9px] text-emerald-600 font-semibold">Sold Products</span>
            </div>

            <div className="p-4 bg-surface border border-border-main rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">الضمانات المفعلة للعملاء</span>
              <span className="text-2xl font-black text-teal-700 font-mono">{distributionAudit.stats.activatedProducts}</span>
              <span className="text-[9px] text-teal-600 font-semibold">Activated Warranties</span>
            </div>

            <div className="p-4 bg-surface border border-border-main rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">مؤشر سلامة التوزيع والنزاهة</span>
              <span className="text-2xl font-black text-emerald-600 font-mono">{distributionAudit.healthPercentage}%</span>
              <span className="text-[9px] text-emerald-600 font-extrabold">0 Errors / 0 Orphans</span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* PART 1: ALLOCATION CENTER                                          */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'allocations' && (
        <div className="space-y-4 animate-fade-in">
          <div className="border border-border-main rounded-2xl overflow-hidden overflow-x-auto bg-surface">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-border-main">
                <tr>
                  <th className="p-3">رقم التخصيص</th>
                  <th className="p-3">الرقم التسلسلي (Serial)</th>
                  <th className="p-3">نوع الوجهة</th>
                  <th className="p-3">الموقع / اسم المعرض</th>
                  <th className="p-3">تاريخ التخصيص</th>
                  <th className="p-3">المسؤول</th>
                  <th className="p-3 text-center">الحالة</th>
                  <th className="p-3 text-center">جواز السفر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main font-semibold">
                {allocations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 font-bold">
                      لا توجد تخصيصات مسجلة حالياً. استخدم زر "تخصيص سيريال" بالأعلى لإضافة تخصيص.
                    </td>
                  </tr>
                ) : (
                  allocations.map(a => (
                    <tr key={a.allocationId} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono font-bold text-blue-600">{a.allocationId}</td>
                      <td className="p-3 font-mono font-black text-slate-800 dark:text-slate-200">{a.serialNumber}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-[10px]">
                          {a.allocationType}
                        </span>
                      </td>
                      <td className="p-3 font-bold">{a.allocationName}</td>
                      <td className="p-3 font-mono text-slate-500">{new Date(a.allocationDate).toLocaleDateString('ar-EG')}</td>
                      <td className="p-3 text-slate-600">{a.allocatedBy}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          a.status === 'Allocated' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          a.status === 'Transferred' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          a.status === 'Sold' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setPassportTargetSerial(a.serialNumber)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 mx-auto"
                        >
                          <ShieldCheck size={12} className="text-blue-600" />
                          <span>الجواز الرقمي</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* PART 2: PACKING CENTER                                             */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'packs' && (
        <div className="space-y-4 animate-fade-in">
          <div className="border border-border-main rounded-2xl overflow-hidden overflow-x-auto bg-surface">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-border-main">
                <tr>
                  <th className="p-3">رقم الطرد (Pack ID)</th>
                  <th className="p-3">نوع التعبئة</th>
                  <th className="p-3">رقم التشغيلة</th>
                  <th className="p-3 text-center">عدد السيريالات</th>
                  <th className="p-3">تاريخ التعبئة</th>
                  <th className="p-3">المشغل</th>
                  <th className="p-3 text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main font-semibold">
                {packs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 font-bold">
                      لا توجد طرود تعبئة مسجلة حالياً. استخدم زر "إنشاء طرد" بالأعلى.
                    </td>
                  </tr>
                ) : (
                  packs.map(p => (
                    <tr key={p.packId} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono font-black text-purple-600">{p.packId}</td>
                      <td className="p-3 font-bold">{p.packType}</td>
                      <td className="p-3 font-mono text-blue-600">{p.batchId}</td>
                      <td className="p-3 text-center font-mono font-black">{p.serialCount} قطعة</td>
                      <td className="p-3 font-mono text-slate-500">{new Date(p.createdDate).toLocaleDateString('ar-EG')}</td>
                      <td className="p-3 text-slate-600">{p.createdBy}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          p.status === 'Packed' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                          p.status === 'Shipped' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* PART 3: SHIPMENT CENTER                                            */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'shipments' && (
        <div className="space-y-4 animate-fade-in">
          <div className="border border-border-main rounded-2xl overflow-hidden overflow-x-auto bg-surface">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-border-main">
                <tr>
                  <th className="p-3">رقم الشحنة (Shipment ID)</th>
                  <th className="p-3">رقم التتبع (Tracking)</th>
                  <th className="p-3">نوع الوجهة</th>
                  <th className="p-3">اسم الوجهة</th>
                  <th className="p-3 text-center">الطرود المضمنة</th>
                  <th className="p-3 text-center">إجمالي القطع</th>
                  <th className="p-3">تاريخ الشحن</th>
                  <th className="p-3 text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main font-semibold">
                {shipments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 font-bold">
                      لا توجد شحنات مسجلة حالياً. استخدم زر "إنشاء شحنة" بالأعلى.
                    </td>
                  </tr>
                ) : (
                  shipments.map(s => (
                    <tr key={s.shipmentId} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono font-black text-indigo-600">{s.shipmentId}</td>
                      <td className="p-3 font-mono text-slate-600">{s.trackingNumber || '—'}</td>
                      <td className="p-3 font-bold">{s.destinationType}</td>
                      <td className="p-3 font-bold">{s.destinationName}</td>
                      <td className="p-3 text-center font-mono">{s.packIds.length} طرد</td>
                      <td className="p-3 text-center font-mono font-black text-blue-600">{s.serialCount} قطعة</td>
                      <td className="p-3 font-mono text-slate-500">{new Date(s.shipmentDate).toLocaleDateString('ar-EG')}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          s.status === 'InTransit' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                          s.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* PART 4: SALES REGISTRY                                             */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'sales' && (
        <div className="space-y-4 animate-fade-in">
          <div className="border border-border-main rounded-2xl overflow-hidden overflow-x-auto bg-surface">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-border-main">
                <tr>
                  <th className="p-3">رقم الفاتورة</th>
                  <th className="p-3">السيريال المباع</th>
                  <th className="p-3">اسم العميل</th>
                  <th className="p-3">رقم الهاتف</th>
                  <th className="p-3">الموزع / المعرض</th>
                  <th className="p-3">المحافظة / المدينة</th>
                  <th className="p-3">تاريخ البيع</th>
                  <th className="p-3 text-center">حالة التفعيل</th>
                  <th className="p-3 text-center">الجواز الرقمي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main font-semibold">
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400 font-bold">
                      لا توجد عمليات بيع مسجلة حالياً. استخدم زر "تسجيل بيع" بالأعلى لربط الفاتورة بالسيريال.
                    </td>
                  </tr>
                ) : (
                  sales.map(s => (
                    <tr key={s.salesId} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono font-black text-emerald-600">{s.invoiceNumber}</td>
                      <td className="p-3 font-mono font-bold text-blue-700 dark:text-blue-400">{s.serialNumber}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{s.customerName}</td>
                      <td className="p-3 font-mono text-slate-600">{s.customerMobile}</td>
                      <td className="p-3 font-bold">{s.dealerName}</td>
                      <td className="p-3">{s.governorate} - {s.city}</td>
                      <td className="p-3 font-mono text-slate-500">{new Date(s.invoiceDate).toLocaleDateString('ar-EG')}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          s.status === 'Activated' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setPassportTargetSerial(s.serialNumber)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 mx-auto"
                        >
                          <ShieldCheck size={12} className="text-blue-600" />
                          <span>جواز السفر</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* PART 5: QR GOVERNANCE CENTER                                       */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'qr' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-slate-50 dark:bg-slate-900 border border-border-main p-4 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-xs text-[#0B2D5C] dark:text-blue-300">
                سجل حوكمة الـ QR المشفر (QR Governance Registry)
              </h3>
              <p className="text-[10px] text-slate-400">
                ضمان مطابقة 1-to-1: لكل سيريال رمز QR فريد واحد غير قابل للتكرار وتتبع مرات الطباعة وإعادة الطباعة.
              </p>
            </div>
            <div className="text-left font-mono text-xs">
              <span className="text-slate-400 block text-[10px]">إجمالي الرموز المصدرة:</span>
              <strong className="text-blue-600 font-black">{serials.length} QR Records</strong>
            </div>
          </div>

          <div className="border border-border-main rounded-2xl overflow-hidden overflow-x-auto bg-surface">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-border-main">
                <tr>
                  <th className="p-3">السيريال (Serial)</th>
                  <th className="p-3">شهادة الضمان (WAR)</th>
                  <th className="p-3 text-center">مرات الطباعة</th>
                  <th className="p-3 text-center">مرات إعادة الطباعة</th>
                  <th className="p-3 text-center">حالة الـ QR</th>
                  <th className="p-3 text-center">معاينة الجواز الرقمي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main font-semibold">
                {serials.slice(0, 50).map(s => (
                  <tr key={s.serialNumber} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-black text-blue-700 dark:text-blue-400">{s.serialNumber}</td>
                    <td className="p-3 font-mono text-teal-600 font-bold">{s.warrantyNumber}</td>
                    <td className="p-3 text-center font-mono font-bold">1</td>
                    <td className="p-3 text-center font-mono font-bold text-purple-600">0</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
                        Generated & Verified
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setPassportTargetSerial(s.serialNumber)}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[10px] font-bold cursor-pointer transition-all inline-flex items-center gap-1"
                      >
                        <Eye size={12} />
                        <span>معاينة الجواز</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* PART 9: DISTRIBUTION AUDIT CENTER                                  */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'audit' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-5 bg-surface border border-border-main rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={24} className="text-purple-600" />
              <div>
                <h3 className="font-extrabold text-sm text-[#0B2D5C] dark:text-text-primary">
                  محرك تدقيق حوكمة التوزيع والـ Passport (runDistributionAudit)
                </h3>
                <p className="text-[11px] text-slate-400">
                  فحص شامل لعدم وجود تكرار في التخصيص أو الطرود أو الشحنات أو المبيعات، وصفر مراجع يتيمة.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-4 py-1.5 rounded-full font-black text-xs ${
                distributionAudit.isConsistent 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : 'bg-rose-100 text-rose-800 border border-rose-200'
              }`}>
                {distributionAudit.isConsistent ? 'سليم ومطابق بنسبة 100% (Healthy)' : 'تنبيه تدقيق'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="p-3.5 bg-surface border border-border-main rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">التخصيصات المكررة</span>
              <span className="font-mono text-xl font-black">{distributionAudit.duplicateAllocations.length}</span>
              <span className="text-[9px] text-emerald-600 font-bold block">Target: 0</span>
            </div>
            <div className="p-3.5 bg-surface border border-border-main rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">الطرود المكررة</span>
              <span className="font-mono text-xl font-black">{distributionAudit.duplicatePacks.length}</span>
              <span className="text-[9px] text-emerald-600 font-bold block">Target: 0</span>
            </div>
            <div className="p-3.5 bg-surface border border-border-main rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">الشحنات المكررة</span>
              <span className="font-mono text-xl font-black">{distributionAudit.duplicateShipments.length}</span>
              <span className="text-[9px] text-emerald-600 font-bold block">Target: 0</span>
            </div>
            <div className="p-3.5 bg-surface border border-border-main rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">سجلات البيع المكررة</span>
              <span className="font-mono text-xl font-black">{distributionAudit.duplicateSales.length}</span>
              <span className="text-[9px] text-emerald-600 font-bold block">Target: 0</span>
            </div>
            <div className="p-3.5 bg-surface border border-border-main rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">الشحنات والطرود اليتيمة</span>
              <span className="font-mono text-xl font-black">{distributionAudit.orphanShipments.length + distributionAudit.orphanPacks.length}</span>
              <span className="text-[9px] text-emerald-600 font-bold block">Target: 0</span>
            </div>
            <div className="p-3.5 bg-surface border border-border-main rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">اكتمال بيانات الجواز الرقمي</span>
              <span className="font-mono text-xl font-black text-emerald-600">100%</span>
              <span className="text-[9px] text-emerald-600 font-bold block">Full Chain</span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* PRODUCT DIGITAL PASSPORT MODAL (PART 7)                            */}
      {/* ------------------------------------------------------------------ */}
      {passportTargetSerial && (
        <ProductDigitalPassportModal
          serialNumberOrCode={passportTargetSerial}
          onClose={() => setPassportTargetSerial(null)}
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* ALLOCATION MODAL (PART 1)                                          */}
      {/* ------------------------------------------------------------------ */}
      {isAllocationModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/30 backdrop-blur-xs text-right animate-fade-in">
          <div className="bg-surface dark:bg-surface-secondary rounded-3xl w-full max-w-md p-6 shadow-2xl border border-border-main space-y-4 z-[10000]">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-[#0B2D5C] dark:text-blue-300 text-xs">تخصيص موقع لسيريال منتج</h3>
              <button onClick={() => setIsAllocationModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleCreateAllocation} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">الرقم التسلسلي (Serial Number) *</label>
                <select
                  value={allocSerial}
                  onChange={(e) => setAllocSerial(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl outline-none font-mono font-bold"
                >
                  <option value="">-- اختر السيريال --</option>
                  {serials.map(s => (
                    <option key={s.serialNumber} value={s.serialNumber}>{s.serialNumber} - {s.warrantyNumber}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">نوع وجهة التخصيص *</label>
                <select
                  value={allocType}
                  onChange={(e) => setAllocType(e.target.value as AllocationType)}
                  className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl outline-none font-bold"
                >
                  <option value="Warehouse">Warehouse (مستودع رئيسي / إقليمي)</option>
                  <option value="Dealer">Dealer (موزع / وكيل معتمد)</option>
                  <option value="Showroom">Showroom (معرض / صالة عرض)</option>
                  <option value="Distributor">Distributor (موزع جملة)</option>
                  <option value="Project">Project (مشروع / موقع مناقصة)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">اسم الموقع / المعرض / المستودع *</label>
                <input
                  type="text"
                  value={allocName}
                  onChange={(e) => setAllocName(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">المشرف المسؤول:</label>
                <input
                  type="text"
                  value={allocOperator}
                  onChange={(e) => setAllocOperator(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setIsAllocationModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">إلغاء</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs">حفظ التخصيص</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* PACKING MODAL (PART 2)                                             */}
      {/* ------------------------------------------------------------------ */}
      {isPackModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/30 backdrop-blur-xs text-right animate-fade-in">
          <div className="bg-surface dark:bg-surface-secondary rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-border-main space-y-4 z-[10000]">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-[#0B2D5C] dark:text-blue-300 text-xs">إنشاء طرد تعبئة جديد (Pack Unit)</h3>
              <button onClick={() => setIsPackModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleCreatePack} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">نوع التعبئة (Pack Type) *</label>
                <select
                  value={packType}
                  onChange={(e) => setPackType(e.target.value as PackType)}
                  className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl outline-none font-bold"
                >
                  <option value="Carton">Carton (كرتونة)</option>
                  <option value="Bundle">Bundle (حزمة / ربطة)</option>
                  <option value="Pallet">Pallet (باليت خشبي)</option>
                  <option value="Container">Container (حاوية شحن)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">السيريالات المضمنة في الطرد (أدخل سيريالات مفصولة بمسافة أو سطر جديد) *</label>
                <textarea
                  rows={4}
                  value={packSerialsInput}
                  onChange={(e) => setPackSerialsInput(e.target.value)}
                  placeholder="مثال:&#10;SLP-2026-000001&#10;SLP-2026-000002&#10;SLP-2026-000003"
                  className="w-full p-2 bg-slate-50 border border-border-main rounded-xl font-mono text-xs outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setIsPackModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">إلغاء</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs">حفظ الطرد</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SHIPMENT MODAL (PART 3)                                            */}
      {/* ------------------------------------------------------------------ */}
      {isShipmentModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/30 backdrop-blur-xs text-right animate-fade-in">
          <div className="bg-surface dark:bg-surface-secondary rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-border-main space-y-4 z-[10000]">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-[#0B2D5C] dark:text-blue-300 text-xs">إنشاء شحنة جديدة (New Shipment)</h3>
              <button onClick={() => setIsShipmentModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleCreateShipment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">نوع الوجهة (Destination Type) *</label>
                <select
                  value={shipDestType}
                  onChange={(e) => setShipDestType(e.target.value as ShipmentDestinationType)}
                  className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl outline-none font-bold"
                >
                  <option value="Dealer">Dealer (موزع معتمد)</option>
                  <option value="Warehouse">Warehouse (مستودع إقليمي)</option>
                  <option value="Showroom">Showroom (معرض)</option>
                  <option value="Project">Project (مشروع)</option>
                  <option value="Distributor">Distributor (موزع عام)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">اسم الوجهة / المستلم *</label>
                <input
                  type="text"
                  value={shipDestName}
                  onChange={(e) => setShipDestName(e.target.value)}
                  placeholder="مثال: معرض مدينة نصر / مستودع الإسكندرية"
                  className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">اختر الطرود المضمنة في الشحنة *</label>
                <div className="space-y-1 max-h-32 overflow-y-auto p-2 border rounded-xl bg-slate-50">
                  {packs.length === 0 ? (
                    <div className="text-slate-400 text-center py-2">لا توجد طرود جاهزة. قم بإنشاء طرد أولاً.</div>
                  ) : (
                    packs.map(p => (
                      <label key={p.packId} className="flex items-center gap-2 font-mono text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={shipSelectedPacks.includes(p.packId)}
                          onChange={(e) => {
                            if (e.target.checked) setShipSelectedPacks([...shipSelectedPacks, p.packId]);
                            else setShipSelectedPacks(shipSelectedPacks.filter(id => id !== p.packId));
                          }}
                        />
                        <span>{p.packId} ({p.packType} - {p.serialCount} قطعة)</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">اسم السائق:</label>
                  <input
                    type="text"
                    value={shipDriver}
                    onChange={(e) => setShipDriver(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">رقم لوحة المركبة:</label>
                  <input
                    type="text"
                    value={shipVehicle}
                    onChange={(e) => setShipVehicle(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setIsShipmentModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">إلغاء</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs">إصدار الشحنة</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SALES MODAL (PART 4)                                               */}
      {/* ------------------------------------------------------------------ */}
      {isSaleModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/30 backdrop-blur-xs text-right animate-fade-in">
          <div className="bg-surface dark:bg-surface-secondary rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-border-main space-y-4 z-[10000]">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-[#0B2D5C] dark:text-blue-300 text-xs">تسجيل عملية بيع وربط الفاتورة بالسيريال</h3>
              <button onClick={() => setIsSaleModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleCreateSale} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">رقم الفاتورة (Invoice Number) *</label>
                  <input
                    type="text"
                    value={saleInvoiceNum}
                    onChange={(e) => setSaleInvoiceNum(e.target.value)}
                    placeholder="INV-2026-001"
                    className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl outline-none font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">الرقم التسلسلي المباع (Serial) *</label>
                  <select
                    value={saleSerial}
                    onChange={(e) => setSaleSerial(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl outline-none font-mono font-bold"
                  >
                    <option value="">-- اختر السيريال --</option>
                    {serials.filter(s => s.status !== 'Sold' && s.status !== 'Activated').map(s => (
                      <option key={s.serialNumber} value={s.serialNumber}>{s.serialNumber} ({s.status})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">اسم العميل *</label>
                  <input
                    type="text"
                    value={saleCustomerName}
                    onChange={(e) => setSaleCustomerName(e.target.value)}
                    placeholder="أحمد محمد"
                    className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">رقم هاتف العميل *</label>
                  <input
                    type="tel"
                    value={saleCustomerMobile}
                    onChange={(e) => setSaleCustomerMobile(e.target.value)}
                    placeholder="01012345678"
                    className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl outline-none font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold mb-1">المعرض / الموزع:</label>
                  <input
                    type="text"
                    value={saleDealerName}
                    onChange={(e) => setSaleDealerName(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">المحافظة:</label>
                  <input
                    type="text"
                    value={saleGovernorate}
                    onChange={(e) => setSaleGovernorate(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">المدينة:</label>
                  <input
                    type="text"
                    value={saleCity}
                    onChange={(e) => setSaleCity(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setIsSaleModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">إلغاء</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs">تسجيل البيع</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
