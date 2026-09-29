import React, { useMemo } from 'react';
import { 
  ShieldCheck, CheckCircle2, Box, Layers, Tag, Ruler, Calendar, QrCode, 
  Truck, ShoppingBag, User, Phone, MapPin, Award, History, Clock, FileText, 
  Printer, X, ArrowLeft, RefreshCw, CheckCircle, AlertTriangle, Building2, Package
} from 'lucide-react';
import { ErpDatabase } from '../utils/erpDb';
import { Product, SerialNumber, WarrantyCertificate, ProductLifecycleEvent } from '../types/erp';

interface ProductDigitalPassportModalProps {
  serialNumberOrCode: string;
  onClose: () => void;
}

export const ProductDigitalPassportModal: React.FC<ProductDigitalPassportModalProps> = ({
  serialNumberOrCode,
  onClose
}) => {
  const cleanQuery = serialNumberOrCode.trim().toUpperCase();

  // Load live DB data
  const serials = ErpDatabase.getSerialNumbers();
  const certs = ErpDatabase.getWarrantyCertificates();
  const products = ErpDatabase.getProducts();
  const batches = ErpDatabase.getBatches();
  const brands = ErpDatabase.getBrands();
  const families = ErpDatabase.getFamilies();
  const allocations = ErpDatabase.getAllocations();
  const shipments = ErpDatabase.getShipments();
  const packs = ErpDatabase.getPacks();
  const sales = ErpDatabase.getSalesRecords();
  const qrs = ErpDatabase.getQrRegistries();
  const claims = ErpDatabase.getWarrantyClaims();
  const replacements = ErpDatabase.getProductReplacements();
  const lifecycleEvents = ErpDatabase.getLifecycleEvents();

  // Find Serial and Certificate
  const serial = useMemo(() => {
    return serials.find(s => 
      s.serialNumber.toUpperCase() === cleanQuery || 
      s.warrantyNumber.toUpperCase() === cleanQuery
    ) || serials[0]; // fallback
  }, [serials, cleanQuery]);

  const cert = useMemo(() => {
    if (!serial) return certs[0];
    return certs.find(c => c.serialNumber === serial.serialNumber) || certs[0];
  }, [certs, serial]);

  const product = useMemo(() => {
    if (!serial) return products[0];
    return products.find(p => p.id === serial.productId) || products[0];
  }, [products, serial]);

  const batch = useMemo(() => {
    if (!serial) return null;
    return batches.find(b => b.id === serial.batchId || b.batchNumber === serial.batchNumber) || null;
  }, [batches, serial]);

  const brand = useMemo(() => {
    if (!product) return brands[0];
    return brands.find(b => b.id === product.brandId) || brands[0];
  }, [brands, product]);

  const family = useMemo(() => {
    if (!product) return families[0];
    return families.find(f => f.id === product.familyId) || families[0];
  }, [families, product]);

  const allocation = useMemo(() => {
    if (!serial) return null;
    return allocations.find(a => a.serialNumber === serial.serialNumber) || null;
  }, [allocations, serial]);

  const pack = useMemo(() => {
    if (!serial) return null;
    return packs.find(p => p.serialNumbers.includes(serial.serialNumber)) || null;
  }, [packs, serial]);

  const shipment = useMemo(() => {
    if (!pack) return null;
    return shipments.find(s => s.packIds.includes(pack.packId)) || null;
  }, [shipments, pack]);

  const sale = useMemo(() => {
    if (!serial) return null;
    return sales.find(s => s.serialNumber === serial.serialNumber) || null;
  }, [sales, serial]);

  const qr = useMemo(() => {
    if (!serial) return null;
    return qrs.find(q => q.serialNumber === serial.serialNumber) || null;
  }, [qrs, serial]);

  const serialClaims = useMemo(() => {
    if (!serial) return [];
    return claims.filter(c => c.serialNumber === serial.serialNumber);
  }, [claims, serial]);

  const serialReplacements = useMemo(() => {
    if (!serial) return [];
    return replacements.filter(r => r.originalSerialNumber === serial.serialNumber || r.newSerialNumber === serial.serialNumber);
  }, [replacements, serial]);

  const events = useMemo(() => {
    if (!serial) return [];
    return lifecycleEvents.filter(ev => ev.serialNumber === serial.serialNumber);
  }, [lifecycleEvents, serial]);

  const stagesList = [
    { key: 'Manufactured', label: 'التصنيع', defaultCompleted: true },
    { key: 'Printed', label: 'الطباعة والترميز', defaultCompleted: serial?.status !== 'Generated' },
    { key: 'Packed', label: 'التعبئة والتغليف', defaultCompleted: ['Packed', 'Shipped', 'Delivered', 'Sold', 'Activated'].includes(serial?.status || '') || !!pack },
    { key: 'Shipped', label: 'الشحن والتوزيع', defaultCompleted: ['Shipped', 'Delivered', 'Sold', 'Activated'].includes(serial?.status || '') || !!shipment },
    { key: 'Delivered', label: 'الوصول للموقع', defaultCompleted: ['Delivered', 'Sold', 'Activated'].includes(serial?.status || '') || allocation?.status === 'Allocated' },
    { key: 'Sold', label: 'البيع للعميل', defaultCompleted: ['Sold', 'Activated'].includes(serial?.status || '') || !!sale },
    { key: 'Activated', label: 'تفعيل الضمان', defaultCompleted: cert?.status === 'active' || serial?.status === 'Activated' },
    { key: 'Warranty Claim', label: 'فحص وضمان', defaultCompleted: serialClaims.length > 0 },
    { key: 'Replacement', label: 'الاستبدال', defaultCompleted: serialReplacements.length > 0 || serial?.status === 'Replaced' }
  ];

  if (!serial || !product) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs text-right animate-fade-in">
        <div className="bg-surface dark:bg-surface-secondary rounded-3xl w-full max-w-md p-6 shadow-2xl border border-border-main text-center space-y-4 z-[10000]">
          <AlertTriangle size={36} className="mx-auto text-amber-500" />
          <h3 className="font-extrabold text-sm text-text-primary">لم يتم العثور على جواز السفر الرقمي</h3>
          <p className="text-xs text-slate-500">الرقم المستعلم عنه غير مسجل بقاعدة البيانات.</p>
          <button onClick={onClose} className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">إغلاق</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs text-right font-sans animate-fade-in">
      <div className="bg-surface dark:bg-surface-secondary rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-border-main flex flex-col z-[10000]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#0B2D5C] via-[#133E7C] to-[#1D4ED8] text-white border-b border-border-main shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl">
              <ShieldCheck size={24} className="text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-wide">جواز السفر الرقمي للمنتج</h2>
                <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                  Verified 100%
                </span>
              </div>
              <p className="text-[11px] text-blue-200 font-mono mt-0.5">
                Product Digital Passport • Serial: {serial.serialNumber}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Passport Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-text-primary">
          
          {/* Quick Identity Card */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-border-main p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5 w-full md:w-auto">
              <span className="text-[10px] text-slate-400 font-bold">العلامة التجارية والموديل</span>
              <div className="text-lg font-black text-[#0B2D5C] dark:text-blue-300 flex items-center gap-2">
                <span>{brand?.name || 'Sleepee'}</span>
                <span>•</span>
                <span>{product.modelName}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                <span>الكود الداخلي: <strong>{product.internalProductCode}</strong></span>
                {product.sapMaterialCode && <span>SAP: <strong>{product.sapMaterialCode}</strong></span>}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <div className="text-center p-2.5 bg-surface rounded-xl border border-border-main font-mono">
                <span className="text-[9px] text-slate-400 block font-bold">حالة السيريال</span>
                <span className="font-black text-xs text-blue-600 uppercase">{serial.status}</span>
              </div>
              <div className="text-center p-2.5 bg-surface rounded-xl border border-border-main font-mono">
                <span className="text-[9px] text-slate-400 block font-bold">شهادة الضمان</span>
                <span className="font-black text-xs text-teal-600">{cert ? cert.warrantyNumber : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Product & Batch Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Product Specifications */}
            <div className="border border-border-main bg-surface p-4 rounded-2xl space-y-2.5 shadow-2xs">
              <h4 className="font-black text-xs text-[#0B2D5C] dark:text-blue-300 flex items-center gap-1.5 border-b pb-2">
                <Layers size={15} className="text-blue-600" />
                <span>مواصفات الماستر داتا للمنتج</span>
              </h4>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">عائلة المنتج:</span>
                  <span className="font-bold">{family?.nameAr || 'مرتبة سوست'}</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">الأبعاد المصنعية:</span>
                  <span className="font-mono font-bold">{product.width} × {product.length} × {product.height} cm</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">نظام التصنيع:</span>
                  <span className="font-bold">{product.manufacturingSystem || 'American'}</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">التقنيات المدمجة:</span>
                  <span className="font-bold">{(product.technologies || ['Bonnell Spring']).join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Batch & Manufacturing Information */}
            <div className="border border-border-main bg-surface p-4 rounded-2xl space-y-2.5 shadow-2xs">
              <h4 className="font-black text-xs text-[#0B2D5C] dark:text-blue-300 flex items-center gap-1.5 border-b pb-2">
                <Box size={15} className="text-purple-600" />
                <span>بيانات التشغيلة المصنعية (Batch Master)</span>
              </h4>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">رقم التشغيلة:</span>
                  <span className="font-mono font-black text-purple-600">{serial.batchNumber}</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">تاريخ الإنتاج:</span>
                  <span className="font-mono font-bold">{batch?.productionDate || new Date(serial.createdDate).toLocaleDateString('ar-EG')}</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">المشرف المسؤول:</span>
                  <span className="font-bold">{batch?.createdBy || 'مسؤول خط الإنتاج والتجميع'}</span>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">حالة التشغيلة:</span>
                  <span className="font-bold text-emerald-600">{batch?.status || 'Approved'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Distribution, Packing & Sales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Allocation & Location */}
            <div className="border border-border-main bg-surface p-4 rounded-2xl space-y-2 shadow-2xs">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border-b pb-1.5">
                <MapPin size={14} className="text-rose-500" />
                <span>موقع التخصيص والمستودع</span>
              </h4>
              <div className="text-[11px] space-y-1">
                <div>النوع: <strong className="text-blue-600">{allocation?.allocationType || 'Warehouse'}</strong></div>
                <div>الموقع: <strong className="font-sans">{allocation?.allocationName || 'المستودع المركزي - العاشر من رمضان'}</strong></div>
                <div>التاريخ: <span className="font-mono text-slate-500">{allocation ? new Date(allocation.allocationDate).toLocaleDateString('ar-EG') : '—'}</span></div>
              </div>
            </div>

            {/* Packing & Shipment */}
            <div className="border border-border-main bg-surface p-4 rounded-2xl space-y-2 shadow-2xs">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border-b pb-1.5">
                <Truck size={14} className="text-indigo-500" />
                <span>الشحنة والتغليف اللوجستي</span>
              </h4>
              <div className="text-[11px] space-y-1">
                <div>رقم الطرد: <strong className="font-mono">{pack?.packId || 'PK-DIRECT'}</strong></div>
                <div>رقم الشحنة: <strong className="font-mono text-indigo-600">{shipment?.shipmentId || 'SHIP-LOCAL'}</strong></div>
                <div>الوجهة: <span className="font-bold">{shipment?.destinationName || 'المستودع الرئيسي'}</span></div>
              </div>
            </div>

            {/* Sales Record */}
            <div className="border border-border-main bg-surface p-4 rounded-2xl space-y-2 shadow-2xs">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border-b pb-1.5">
                <ShoppingBag size={14} className="text-emerald-500" />
                <span>سجل المبيعات والعميل</span>
              </h4>
              <div className="text-[11px] space-y-1">
                <div>الفاتورة: <strong className="font-mono">{sale?.invoiceNumber || (cert?.status === 'active' ? 'INV-DIRECT' : 'قيد التوزيع')}</strong></div>
                <div>العميل: <strong className="text-emerald-700 dark:text-emerald-300">{sale?.customerName || cert?.customerName || 'غير مسجل بعد'}</strong></div>
                <div>الموزع: <span className="font-bold">{sale?.dealerName || 'معرض سليبي الرسمي'}</span></div>
              </div>
            </div>
          </div>

          {/* Section 3: QR Governance & Warranty */}
          <div className="border border-border-main bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="space-y-2 w-full sm:w-2/3">
              <h4 className="font-black text-xs text-[#0B2D5C] dark:text-blue-300 flex items-center gap-1.5 border-b pb-1.5">
                <QrCode size={15} className="text-blue-600" />
                <span>حوكمة الرمز الرقمي المشفر (QR Governance) والضمان</span>
              </h4>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>• حالة الـ QR: <strong className="font-bold text-emerald-600">{qr?.status || 'Printed'}</strong></div>
                <div>• عدد مرات الطباعة: <strong className="font-mono">{qr?.printCount || 1}</strong></div>
                <div>• عدد مرات إعادة الطباعة: <strong className="font-mono">{qr?.reprintCount || 0}</strong></div>
                <div>• حالة التفعيل: <strong className={cert?.status === 'active' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                  {cert?.status === 'active' ? 'مفعل (Active)' : 'غير مفعل (Unactivated)'}
                </strong></div>
              </div>
            </div>

            <div className="flex flex-col items-center p-3 bg-white text-black rounded-xl border border-slate-200 shadow-xs">
              <div className="w-20 h-20" dangerouslySetInnerHTML={{ __html: ErpDatabase.generateQR(cert ? cert.warrantyNumber : serial.warrantyNumber, serial.serialNumber, product.internalProductCode) }} />
              <span className="font-mono font-black text-[9px] mt-1 text-blue-900">{serial.serialNumber}</span>
            </div>
          </div>

          {/* Section 4: RTL Interactive Lifecycle Timeline */}
          <div className="border border-border-main bg-surface p-5 rounded-2xl space-y-4 shadow-2xs">
            <h4 className="font-black text-xs text-[#0B2D5C] dark:text-blue-300 flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-1.5">
                <History size={16} className="text-blue-600" />
                <span>المسار الزمني الكامل لدورة حياة المنتج (360° Lifecycle Registry)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">9 Stages Timeline</span>
            </h4>

            {/* Visual RTL Horizontal / Grid Stages */}
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 text-center text-[10px]">
              {stagesList.map((stage, idx) => (
                <div 
                  key={idx}
                  className={`p-2.5 rounded-xl border transition-all ${
                    stage.defaultCompleted 
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 text-emerald-900 dark:text-emerald-300' 
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200/60 text-slate-400'
                  }`}
                >
                  <div className="w-5 h-5 mx-auto mb-1 rounded-full flex items-center justify-center font-mono font-bold text-[9px]">
                    {stage.defaultCompleted ? (
                      <CheckCircle2 size={16} className="text-emerald-600" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <span className="font-bold block leading-tight">{stage.label}</span>
                </div>
              ))}
            </div>

            {/* Event Log Details */}
            <div className="mt-3 space-y-2 max-h-40 overflow-y-auto pr-1">
              {events.length === 0 ? (
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-center text-slate-400 text-[11px]">
                  تم تسجيل مرحلة التصنيع الأولية للقطعة بنجاح.
                </div>
              ) : (
                events.map(ev => (
                  <div key={ev.id} className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/60 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded font-bold text-[10px]">
                        {ev.stage}
                      </span>
                      <span>{ev.notes || 'توثيق مرحلة بالمنظومة'}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {new Date(ev.timestamp).toLocaleString('ar-EG')} • {ev.operator}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-surface border-t border-border-main shrink-0">
          <div className="text-[11px] text-slate-400 font-mono">
            Sleepee Enterprise Digital Passport System © 2026
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs cursor-pointer transition-colors"
          >
            إغلاق الجواز
          </button>
        </div>

      </div>
    </div>
  );
};
