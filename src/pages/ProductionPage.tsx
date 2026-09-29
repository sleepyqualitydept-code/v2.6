import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, FileSpreadsheet, Layers, Calendar, Clipboard, FileText, Sparkles, 
  Download, History, Eye, AlertCircle, ChevronDown, Check, Upload, 
  Trash2, ShieldCheck, Box, Tag, Hash, Activity, RefreshCw, Printer, Search, 
  ArrowRight, CheckCircle, Clock, XCircle, AlertTriangle, Filter, Truck, PackageCheck, 
  ShoppingBag, Shield, Wrench, FolderTree, BookOpen, ChevronRight, Edit3, Copy, 
  Power, Ruler, BarChart3, Database, Save, Sparkle, HelpCircle, ChevronUp, UserCheck
} from 'lucide-react';
import { ErpDatabase } from '../utils/erpDb';
import { DimensionMasterRepository } from '../utils/dimensionRepository';
import { 
  Product, ProductionOrder, ProductionOrderStatus, Batch, BatchStatus, 
  SerialNumber, SerialStatus, WarrantyCertificate, QRCodeRecord, PrintJob, 
  PrintQueueStatus, ProductTechnology, ProductLifecycleEvent, ProductLifecycleStage, 
  ProductionOrderAudit, BillOfMaterials, BomMaterialLine, BomStatus, Model, Size, CustomDimension 
} from '../types/erp';
import { ProductDigitalPassportModal } from '../components/ProductDigitalPassportModal';
import { ProductMasterPage } from './ProductMasterPage';
import { PrintCenterPage } from './PrintCenterPage';
import { useTranslationService } from '../i18n';
import { WarrantyPolicyManagementView } from '../components/admin/WarrantyPolicyManagementView';
import { AiBomDesignCenter } from '../components/admin/AiBomDesignCenter';
import { CustomProjectEngineeringCenter } from '../components/admin/CustomProjectEngineeringCenter';

interface ProductionPageProps {
  activeTab?: 'structure' | 'orders' | 'serials' | 'print' | 'bom' | 'audit';
  onTabChange?: (tab: 'structure' | 'orders' | 'serials' | 'print' | 'bom' | 'audit') => void;
  initialMainTab?: 'product_mgmt' | 'daily_ops' | 'print_center';
  initialProductMgmtTab?: 'structure' | 'bom';
}

export const ProductionPage: React.FC<ProductionPageProps> = ({
  activeTab: propActiveTab,
  onTabChange,
  initialMainTab
}) => {
  const [internalTab, setInternalTab] = useState<'structure' | 'orders' | 'serials' | 'print' | 'bom' | 'audit'>('structure');
  const activeTab = propActiveTab || internalTab;
  const setActiveTab = (tab: any) => {
    if (onTabChange) onTabChange(tab);
    setInternalTab(tab);
  };

  // Database state
  const [products, setProducts] = useState<Product[]>(() => ErpDatabase.getProducts());
  const [orders, setOrders] = useState<ProductionOrder[]>(() => ErpDatabase.getProductionOrders());
  const [batches, setBatches] = useState<Batch[]>(() => ErpDatabase.getBatches());
  const [serials, setSerials] = useState<SerialNumber[]>(() => ErpDatabase.getSerialNumbers());
  const [printJobs, setPrintJobs] = useState<PrintJob[]>(() => ErpDatabase.getPrintJobs());
  const [certificates, setCertificates] = useState<WarrantyCertificate[]>(() => ErpDatabase.getWarrantyCertificates());
  const [lifecycleEvents, setLifecycleEvents] = useState<ProductLifecycleEvent[]>(() => ErpDatabase.getLifecycleEvents());
  const [orderAudits, setOrderAudits] = useState<ProductionOrderAudit[]>(() => ErpDatabase.getProductionOrderAudits());
  const [boms, setBoms] = useState<BillOfMaterials[]>(() => ErpDatabase.getBOMs());

  const brands = ErpDatabase.getBrands();
  const models = ErpDatabase.getModels();
  const families = ErpDatabase.getFamilies();
  const policies = ErpDatabase.getWarrantyPolicies();
  const standardDimensions = DimensionMasterRepository.getAllStandardDimensions();

  // Filter and Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBrand, setFilterBrand] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modals state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ProductionOrder | null>(null);
  const [viewingAuditsOrder, setViewingAuditsOrder] = useState<ProductionOrder | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [selectedOrderForBatch, setSelectedOrderForBatch] = useState<ProductionOrder | null>(null);
  const [selectedSerialForLifecycle, setSelectedSerialForLifecycle] = useState<string>('');
  const [passportTargetSerial, setPassportTargetSerial] = useState<string | null>(null);
  const [newLifecycleStage, setNewLifecycleStage] = useState<ProductLifecycleStage>('Packed');
  const [lifecycleLocation, setLifecycleLocation] = useState('مستودع التجهيز المركزي');
  const [lifecycleNotes, setLifecycleNotes] = useState('');

  // BOM Management State
  const [isBomModalOpen, setIsBomModalOpen] = useState(false);
  const [editingBom, setEditingBom] = useState<BillOfMaterials | null>(null);
  const [selectedModelForBomView, setSelectedModelForBomView] = useState<string>('All');
  const [bomFormModelId, setBomFormModelId] = useState<string>('');
  const [bomFormBrandId, setBomFormBrandId] = useState<string>('SLP');
  const [bomFormName, setBomFormName] = useState<string>('');
  const [bomFormVersion, setBomFormVersion] = useState<string>('v1.0');
  const [bomFormStatus, setBomFormStatus] = useState<BomStatus>('Active');
  const [bomFormMaterials, setBomFormMaterials] = useState<BomMaterialLine[]>([
    { id: 'MAT-1', materialCode: 'MAT-SP-01', materialName: 'شاسيه سوست (Spring Core)', quantity: 1, unit: 'set', notes: 'سلك صلب معالج حرارياً' },
    { id: 'MAT-2', materialCode: 'MAT-FM-01', materialName: 'إسفنج عالي الكثافة (High Density Foam)', quantity: 4.0, unit: 'm2', notes: 'طبقات دعم سفلية وعلوية' },
    { id: 'MAT-3', materialCode: 'MAT-FAB-01', materialName: 'قماش فاخر منسوج (Quilted Fabric)', quantity: 5.5, unit: 'm', notes: 'معالج ضد البكتيريا' }
  ]);
  const [bomFormNotes, setBomFormNotes] = useState<string>('');

  // Audit Sub-tab
  const [auditSubTab, setAuditSubTab] = useState<'product' | 'dimension' | 'serialization' | 'integrity'>('product');

  // Order Form State
  const [orderMode, setOrderMode] = useState<'standard' | 'custom'>('standard');
  const [formBrandId, setFormBrandId] = useState('SLP');
  const [formFamilyId, setFormFamilyId] = useState('FAM-SPRING');
  const [formModelId, setFormModelId] = useState('');
  const [formSizeId, setFormSizeId] = useState('');
  const [formHeight, setFormHeight] = useState<number>(25);
  const [formQuantity, setFormQuantity] = useState<number | ''>(10);
  const [formProductionDate, setFormProductionDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formOperator, setFormOperator] = useState('مسؤول خط الإنتاج والتجميع');
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Daily Operations Refactored States
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<'SYSTEM_ADMIN' | 'OPERATOR'>('SYSTEM_ADMIN');
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [dailyOpsSubTab, setDailyOpsSubTab] = useState<'orders' | 'projects' | 'history'>('orders');
  const [orderFilterTab, setOrderFilterTab] = useState<'all' | 'active' | 'pending' | 'ready'>('all');
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    type: 'review' | 'view';
    stepNum: number;
    title: string;
    details: any;
  } | null>(null);

  // Project Catalog form states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [formProjectName, setFormProjectName] = useState('');
  const [formProjectCustomer, setFormProjectCustomer] = useState('');
  const [formProjectModel, setFormProjectModel] = useState('');
  const [formProjectSpecs, setFormProjectSpecs] = useState('');
  const [formProjectDims, setFormProjectDims] = useState('180x200');
  const [formProjectQuantity, setFormProjectQuantity] = useState<number>(50);

  // Step Completion Simulator Mock/Storage State
  const [confirmedAllocationOrderIds, setConfirmedAllocationOrderIds] = useState<string[]>([]);
  const [confirmedPrintFileOrderIds, setConfirmedPrintFileOrderIds] = useState<string[]>([]);

  // Helper padding
  const padZero = (num: number, size: number) => {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  };

  // Refresh DB state helper
  const refreshDbState = () => {
    setProducts(ErpDatabase.getProducts());
    setOrders(ErpDatabase.getProductionOrders());
    setBatches(ErpDatabase.getBatches());
    setSerials(ErpDatabase.getSerialNumbers());
    setPrintJobs(ErpDatabase.getPrintJobs());
    setCertificates(ErpDatabase.getWarrantyCertificates());
    setLifecycleEvents(ErpDatabase.getLifecycleEvents());
    setOrderAudits(ErpDatabase.getProductionOrderAudits());
    setBoms(ErpDatabase.getBOMs());
  };

  // --------------------------------------------------------------------------
  // ORDER ACTIONS & BATCH TRIGGER
  // --------------------------------------------------------------------------
  const handleOpenCreateOrder = () => {
    setEditingOrder(null);
    setFormError(null);
    const firstBrand = brands[0]?.id || 'SLP';
    const firstModel = models.find(m => m.brandId === firstBrand) || models[0];
    const firstDim = standardDimensions[0];

    setFormBrandId(firstBrand);
    setFormFamilyId(firstModel?.familyId || 'FAM-SPRING');
    setFormModelId(firstModel?.id || '');
    setFormSizeId(firstDim?.id || '');
    setFormHeight(firstModel?.height || 25);
    setFormQuantity(10);
    setFormProductionDate(new Date().toISOString().split('T')[0]);
    setFormOperator('مسؤول خط الإنتاج والتجميع');
    setFormNotes('');
    setIsOrderModalOpen(true);
  };

  const handleOpenEditOrder = (order: ProductionOrder) => {
    setEditingOrder(order);
    setFormError(null);
    
    const prod = products.find(p => p.id === order.productId);
    if (prod) {
      setOrderMode(prod.productType || 'standard');
      setFormBrandId(prod.brandId);
      setFormModelId(prod.modelId || prod.id);
      setFormSizeId(prod.sizeId);
    }
    
    setFormQuantity(order.quantity);
    setFormProductionDate(order.productionDate);
    setFormOperator(order.operator);
    setFormNotes(order.notes || '');
    setIsOrderModalOpen(true);
  };

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formQuantity || Number(formQuantity) <= 0) {
      setFormError('يرجى تحديد كمية إنتاج صحيحة (أكبر من 0).');
      return;
    }

    let targetProductId = '';
    if (orderMode === 'standard') {
      const matched = products.find(p => 
        p.brandId === formBrandId && 
        p.modelId === formModelId && 
        (p.sizeId === formSizeId || `DIM-${p.width}-${p.length}` === formSizeId)
      );

      if (!matched) {
        // Automatically resolve / provision product spec
        const selectedModel = models.find(m => m.id === formModelId);
        const selectedDim = standardDimensions.find(s => s.id === formSizeId);
        if (!selectedModel || !selectedDim) {
          setFormError('يرجى التأكد من اختيار الموديل والمقاس بشكل صحيح.');
          return;
        }

        const newProd = ErpDatabase.addProduct({
          productType: 'standard',
          brandId: formBrandId,
          categoryId: 'MAT',
          modelId: selectedModel.id,
          sizeId: selectedDim.id,
          modelName: `${selectedModel.name} ${selectedDim.displayName}`,
          manufacturingSystem: selectedModel.manufacturingSystem || 'American',
          technologies: ['Bonnell Spring'],
          width: selectedDim.width,
          length: selectedDim.length,
          height: selectedModel.height || 25,
          warrantyPolicyId: selectedModel.warrantyPolicyId || 'POL-10Y',
          internalProductCode: `${formBrandId}-MAT-${selectedModel.id.replace('MOD-', '')}${selectedDim.width}X${selectedDim.length}`,
          status: 'active'
        });
        targetProductId = newProd.id;
      } else {
        targetProductId = matched.id;
      }
    } else {
      const customProd = products.find(p => p.id === formModelId && p.productType === 'custom');
      if (!customProd) {
        setFormError('يرجى اختيار منتج خاص معتمد.');
        return;
      }
      targetProductId = customProd.id;
    }

    const currentYear = new Date().getFullYear();
    const batchNumber = `BATCH-${currentYear}-${padZero(batches.length + 1, 6)}`;

    if (editingOrder) {
      const updated = orders.map(o => o.id === editingOrder.id ? {
        ...o,
        productId: targetProductId,
        quantity: Number(formQuantity),
        productionDate: formProductionDate,
        operator: formOperator,
        notes: formNotes,
        updatedDate: new Date().toISOString()
      } : o);
      ErpDatabase.saveProductionOrders(updated);
      ErpDatabase.addProductionOrderAudit({
        productionOrderId: editingOrder.id,
        fromStatus: editingOrder.status,
        toStatus: editingOrder.status,
        action: 'تعديل بيانات أمر الإنتاج',
        operator: formOperator,
        notes: `تحديث الكمية إلى ${formQuantity} وتاريخ الإنتاج`
      });
    } else {
      const newOrder = ErpDatabase.addProductionOrder({
        productId: targetProductId,
        quantity: Number(formQuantity),
        productionDate: formProductionDate,
        batchNumber,
        operator: formOperator,
        notes: formNotes,
        status: 'Draft',
        brandId: formBrandId
      });

      ErpDatabase.addProductionOrderAudit({
        productionOrderId: newOrder.id,
        fromStatus: 'Draft',
        toStatus: 'Draft',
        action: 'إنشاء مسودة أمر إنتاج جديد',
        operator: formOperator,
        notes: `إنشاء أمر شغل برقم ${newOrder.productionOrderNumber} لكمية ${formQuantity} قطعة`
      });
    }

    setIsOrderModalOpen(false);
    refreshDbState();
  };

  const handleUpdateOrderStatus = (order: ProductionOrder, nextStatus: ProductionOrderStatus) => {
    if (order.status === 'Completed' || order.status === 'Cancelled') {
      alert('لا يمكن تغيير حالة أمر الإنتاج المكتمل أو الملغي.');
      return;
    }

    const updated = orders.map(o => {
      if (o.id === order.id) {
        return {
          ...o,
          status: nextStatus,
          approvedDate: nextStatus === 'Approved' ? new Date().toISOString() : o.approvedDate,
          completedDate: nextStatus === 'Completed' ? new Date().toISOString() : o.completedDate,
          cancelledDate: nextStatus === 'Cancelled' ? new Date().toISOString() : o.cancelledDate,
          updatedDate: new Date().toISOString()
        };
      }
      return o;
    });

    ErpDatabase.saveProductionOrders(updated);
    ErpDatabase.addProductionOrderAudit({
      productionOrderId: order.id,
      fromStatus: order.status,
      toStatus: nextStatus,
      action: `تغيير حالة أمر الإنتاج إلى [${nextStatus}]`,
      operator: 'مدير العمليات والتخطيط',
      notes: `تحويل أمر الشغل ${order.productionOrderNumber} من ${order.status} إلى ${nextStatus}`
    });

    refreshDbState();
  };

  const handleGenerateBatchAndSerials = (order: ProductionOrder) => {
    if (order.status !== 'Approved') {
      alert('يجب اعتماد أمر الإنتاج (Approved) أولاً قبل إنشاء التشغيلة وتوليد السيريالات.');
      return;
    }

    const prod = products.find(p => p.id === order.productId);
    if (!prod) {
      alert('المنتج المرتبط بأمر الإنتاج غير موجود.');
      return;
    }

    const brand = brands.find(b => b.id === prod.brandId) || brands[0];
    const currentYear = new Date().getFullYear();
    const batchId = `BATCH-${currentYear}-${padZero(batches.length + 1, 6)}`;

    // Create Batch
    const newBatch: Batch = {
      id: batchId,
      batchNumber: batchId,
      productionOrderId: order.id,
      productId: prod.id,
      brandId: prod.brandId,
      familyId: prod.familyId || 'FAM-SPRING',
      modelId: prod.modelId,
      dimensionId: prod.sizeId || `${prod.width}x${prod.length}`,
      quantity: order.quantity,
      productionDate: order.productionDate,
      status: 'Approved',
      createdBy: order.operator,
      createdDate: new Date().toISOString(),
      notes: `تشغيلة معتمدة لأمر الإنتاج ${order.productionOrderNumber}`
    };

    const updatedBatches = [newBatch, ...batches];
    ErpDatabase.saveBatches(updatedBatches);

    // Generate Serial Numbers & Print Jobs & Warranty Certs
    const generatedSerials: SerialNumber[] = [];
    const generatedPrintJobs: PrintJob[] = [];
    const generatedCerts: WarrantyCertificate[] = [];
    const generatedLifecycleEvents: ProductLifecycleEvent[] = [];

    const existingBrandSerials = serials.filter(s => s.serialNumber.startsWith(brand.serialPrefix));
    let nextSeq = existingBrandSerials.length + 1;

    for (let i = 0; i < order.quantity; i++) {
      const serialNum = `${brand.serialPrefix}-${currentYear}-${padZero(nextSeq, 6)}`;
      const warNum = `${brand.warrantyPrefix}-${currentYear}-${padZero(nextSeq, 6)}`;
      const queueId = `PQ-${currentYear}-${padZero(printJobs.length + i + 1, 6)}`;

      // Serial
      generatedSerials.push({
        serialNumber: serialNum,
        warrantyNumber: warNum,
        productId: prod.id,
        productionOrderId: order.id,
        batchId: newBatch.id,
        batchNumber: newBatch.batchNumber,
        brandId: prod.brandId,
        createdDate: new Date().toISOString(),
        status: 'Generated'
      });

      // Certificate
      generatedCerts.push({
        warrantyNumber: warNum,
        serialNumber: serialNum,
        productId: prod.id,
        status: 'unactivated',
        expiryDate: `${currentYear + 10}-12-31`,
        createdDate: new Date().toISOString()
      });

      // Print Queue
      generatedPrintJobs.push({
        id: queueId,
        serialNumber: serialNum,
        warrantyNumber: warNum,
        batchNumber: newBatch.batchNumber,
        productId: prod.id,
        productName: prod.modelName,
        sizeLabel: `${prod.width}×${prod.length} cm`,
        operator: order.operator,
        status: 'Ready',
        reprintCount: 0,
        createdDate: new Date().toISOString()
      });

      // Lifecycle Event
      generatedLifecycleEvents.push({
        id: `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        serialNumber: serialNum,
        productId: prod.id,
        batchNumber: newBatch.batchNumber,
        stage: 'Manufactured',
        timestamp: new Date().toISOString(),
        operator: order.operator,
        location: 'خط التجميع والإنتاج الرئيسي',
        notes: `تم إنشاء القطعة بنجاح ضمن التشغيلة #${newBatch.batchNumber}`
      });

      nextSeq++;
    }

    ErpDatabase.saveSerialNumbers([...generatedSerials, ...serials]);
    ErpDatabase.saveWarrantyCertificates([...generatedCerts, ...certificates]);
    ErpDatabase.savePrintJobs([...generatedPrintJobs, ...printJobs]);
    ErpDatabase.saveLifecycleEvents([...generatedLifecycleEvents, ...lifecycleEvents]);

    // Update order status to In Production
    handleUpdateOrderStatus(order, 'In Production');

    alert(`تم بنجاح إنشاء التشغيلة ${newBatch.batchNumber} وتوليد ${order.quantity} سيريال مع إرسالها لطابور الطباعة وتجهيز شهادات الضمان!`);
    refreshDbState();
  };

  // --------------------------------------------------------------------------
  // MATERIAL BOM HANDLERS
  // --------------------------------------------------------------------------
  const handleOpenCreateBom = () => {
    setEditingBom(null);
    const firstBrand = brands[0]?.id || 'SLP';
    const brandModels = models.filter(m => m.brandId === firstBrand);
    const firstModel = brandModels[0] || models[0];

    setBomFormBrandId(firstBrand);
    setBomFormModelId(firstModel?.id || '');
    setBomFormName(`وصفة تصنيع موديل ${firstModel?.name || ''}`);
    setBomFormVersion('v1.0');
    setBomFormStatus('Active');
    setBomFormMaterials([
      { id: 'MAT-1', materialCode: 'MAT-SP-01', materialName: 'شاسيه سوست (Spring Core)', quantity: 1, unit: 'set', notes: 'سلك صلب معالج حرارياً' },
      { id: 'MAT-2', materialCode: 'MAT-FM-01', materialName: 'إسفنج عالي الكثافة (High Density Foam)', quantity: 4.0, unit: 'm2', notes: 'طبقات دعم سفلية وعلوية' },
      { id: 'MAT-3', materialCode: 'MAT-FAB-01', materialName: 'قماش فاخر منسوج (Quilted Fabric)', quantity: 5.5, unit: 'm', notes: 'معالج ضد البكتيريا' }
    ]);
    setBomFormNotes('');
    setIsBomModalOpen(true);
  };

  const handleOpenEditBom = (bom: BillOfMaterials) => {
    setEditingBom(bom);
    setBomFormBrandId(bom.brandId);
    setBomFormModelId(bom.modelId);
    setBomFormName(bom.bomName);
    setBomFormVersion(bom.version);
    setBomFormStatus(bom.status);
    setBomFormMaterials([...bom.materials]);
    setBomFormNotes(bom.notes || '');
    setIsBomModalOpen(true);
  };

  const handleAddMaterialLine = () => {
    const nextId = `MAT-${Date.now()}`;
    setBomFormMaterials(prev => [
      ...prev,
      { id: nextId, materialCode: `MAT-RAW-${prev.length + 1}`, materialName: 'مادة خام جديدة', quantity: 1, unit: 'pcs' }
    ]);
  };

  const handleRemoveMaterialLine = (id: string) => {
    if (bomFormMaterials.length <= 1) {
      alert('يجب أن تحتوي وصفة المواد على سطر مادة خام واحد على الأقل.');
      return;
    }
    setBomFormMaterials(prev => prev.filter(m => m.id !== id));
  };

  const handleUpdateMaterialLine = (id: string, field: keyof BomMaterialLine, value: any) => {
    setBomFormMaterials(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleSaveBom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bomFormModelId || !bomFormName.trim()) {
      alert('يرجى تحديد الموديل واسم وصفة المواد.');
      return;
    }

    const selectedModel = models.find(m => m.id === bomFormModelId);
    const familyId = selectedModel?.familyId || 'FAM-SPRING';

    if (editingBom) {
      ErpDatabase.updateBOM(editingBom.id, {
        bomName: bomFormName.trim(),
        brandId: bomFormBrandId,
        familyId,
        modelId: bomFormModelId,
        version: bomFormVersion.trim(),
        status: bomFormStatus,
        materials: bomFormMaterials,
        notes: bomFormNotes || undefined
      });
      alert(`تم تحديث وصفة المواد ${editingBom.bomNumber} بنجاح!`);
    } else {
      const created = ErpDatabase.addBOM({
        bomName: bomFormName.trim(),
        brandId: bomFormBrandId,
        familyId,
        modelId: bomFormModelId,
        version: bomFormVersion.trim(),
        status: bomFormStatus,
        materials: bomFormMaterials,
        createdBy: 'مهندس تخطيط الإنتاج والجودة',
        notes: bomFormNotes || undefined
      });
      alert(`تم إنشاء وصفة المواد بنجاح برقم ${created.bomNumber}!`);
    }

    setIsBomModalOpen(false);
    refreshDbState();
  };

  const handleDuplicateBOM = (bom: BillOfMaterials) => {
    ErpDatabase.addBOM({
      bomName: `نسخة من ${bom.bomName}`,
      brandId: bom.brandId,
      familyId: bom.familyId,
      modelId: bom.modelId,
      version: `${bom.version}-copy`,
      status: bom.status,
      materials: bom.materials,
      notes: bom.notes,
      createdBy: 'مشرف نسخ وقوائم المواد'
    });
    alert('تم نسخ قائمة المواد بنجاح!');
    refreshDbState();
  };

  const handleOpenReview = (stepNum: number) => {
    if (!activeOrder) return;
    const step = dailyOpsStepsList.find(s => s.step === stepNum);
    
    let details: Record<string, string> = {};
    if (stepNum === 1) {
      details = {
        'رقم أمر التشغيل': activeOrder.productionOrderNumber,
        'تاريخ الإنتاج المجدول': activeOrder.productionDate,
        'المشرف المسؤول': activeOrder.operator,
        'حالة الفحص والمطابقة': 'تم التحقق ومطابقة المواصفات مع معايير الجودة الفنية بنجاح',
        'توقيع محطة العمل': 'مشرف الصيانة والتخطيط'
      };
    } else if (stepNum === 2) {
      details = {
        'اسم المسؤول المعتمد': 'المهندس أحمد الشناوي',
        'المنصب': 'مدير العمليات والتشغيل الفني',
        'تاريخ الاعتماد الرسمي': activeOrder.approvedDate ? new Date(activeOrder.approvedDate).toLocaleString('ar-EG') : '2026-09-28',
        'مستوى الحوكمة المطبق': 'اعتماد فني + تدقيق استهلاك المواد الخام بموجب قائمة المواد (BOM)',
        'حالة أمر التكليف': 'جاهز لبدء توليد السيريالات وسحب الدفعات'
      };
    } else if (stepNum === 3) {
      const orderSerials = serials.filter(s => s.productionOrderId === activeOrder.id);
      details = {
        'إجمالي أرقام التسلسل المولدة': `${activeOrder.quantity} سيريال فريد`,
        'أول سيريال بالدفعة': orderSerials[orderSerials.length - 1]?.serialNumber || '—',
        'آخر سيريال بالدفعة': orderSerials[0]?.serialNumber || '—',
        'تاريخ ووقت التوليد والتشفير': '2026-09-28 11:00 AM',
        'قاعدة البيانات المحدثة': 'قاعدة البيانات المركزية لسليبي (مشفرة بالكامل)'
      };
    } else if (stepNum === 4) {
      details = {
        'عدد شهادات الضمان المخصصة': `${activeOrder.quantity} شهادة ضمان ذكية`,
        'سياسة الضمان المعتمدة للموديل': 'سياسة الضمان الذهبية (10 سنوات)',
        'نطاق أرقام الضمان المخصصة': `${activeOrder.quantity} رقم ضمان متسلسل`,
        'الحماية الإلكترونية للجواز الرقمي': 'مفعّل ومحمي برمز استجابة سريع فريد ومطابق لمقاييس الهيئة السعودية للمواصفات والمقاييس'
      };
    } else if (stepNum === 5) {
      details = {
        'عدد الملفات الجاهزة': `${activeOrder.quantity} ملف باركود مدمج`,
        'تنسيق ملفات الباركود': 'Zebra Basic Code 128 / QR-Code Format',
        'صلاحية الملفات': 'جاهزة للإرسال المباشر لطابور الطباعة الصناعية ZT411',
        'تاريخ الإنشاء الفني': new Date().toISOString().split('T')[0]
      };
    } else if (stepNum === 6) {
      details = {
        'حالة إرسال الملفات للطابعة': 'تم الإرسال بنجاح',
        'عنوان آي بي الطابعة الصناعية المستهدفة': '192.168.1.120:9100',
        'عدد الملصقات المطبوعة والمحققة': `${activeOrder.quantity} ملصق مادي للمنتج`,
        'حالة مطابقة الباركود المطبوع': 'تم المسح التجريبي والمطابقة مع شهادات الضمان الفعّالة بنجاح 100%'
      };
    } else {
      details = {
        'حالة الأمر النهائية': 'مغلق ومؤرشف بالكامل',
        'تاريخ الأرشفة': activeOrder.completedDate ? new Date(activeOrder.completedDate).toLocaleString('ar-EG') : '2026-09-28',
        'توقيع رئيس الجودة': 'أ. مروان الكناني'
      };
    }
    
    setActionModal({
      isOpen: true,
      type: 'review',
      stepNum,
      title: `مراجعة وتدقيق جودة: ${step?.titleAr || ''}`,
      details
    });
  };

  const handleOpenView = (stepNum: number) => {
    if (!activeOrder) return;
    const step = dailyOpsStepsList.find(s => s.step === stepNum);
    const pr = products.find(p => p.id === activeOrder.productId);
    
    let details: Record<string, string> = {};
    if (stepNum === 1) {
      details = {
        'رقم أمر التشغيل': activeOrder.productionOrderNumber,
        'اسم المنتج المرتبط': pr?.modelName || '—',
        'الكمية المطلوبة': `${activeOrder.quantity} قطعة فحص`,
        'الأبعاد والمقاسات القياسية': pr ? `${pr.width} × ${pr.length} سم (ارتفاع ${pr.height} سم)` : '—',
        'البراند': pr?.brandId || 'SLP',
        'ملاحظات التشغيل المكتوبة': activeOrder.notes || 'لا توجد ملاحظات استثنائية'
      };
    } else if (stepNum === 2) {
      details = {
        'رقم أمر التشغيل المعتمد': activeOrder.productionOrderNumber,
        'مسؤول خط الإنتاج والتجميع المكلّف': activeOrder.operator,
        'سجل وتاريخ خطة التشغيل': activeOrder.productionDate,
        'حالة التدقيق المالي واللوجستي': 'تم التحقق من توفر المواد الأولية بالكامل في المستودعات لتركيب قائمة المواد (BOM)'
      };
    } else if (stepNum === 3) {
      const orderSerials = serials.filter(s => s.productionOrderId === activeOrder.id);
      details = {
        'رقم التشغيلة الكلي (Batch #)': activeOrder.batchNumber,
        'عدد السيريالات المشفرة المعتمدة': `${activeOrder.quantity} سيريال فريد`,
        'قائمة عينات السيريالات': orderSerials.slice(0, 5).map(s => s.serialNumber).join(' • ') + (orderSerials.length > 5 ? ' ... إلخ' : '')
      };
    } else if (stepNum === 4) {
      const orderSerials = serials.filter(s => s.productionOrderId === activeOrder.id);
      details = {
        'كود سياسة الضمان المربوطة': pr?.warrantyPolicyId || 'POL-10Y',
        'عدد سنوات الضمان الفعلي': `${pr ? getPolicyYears(pr.id) : 10} سنوات`,
        'أرقام شهادات الضمان المخصصة': orderSerials.slice(0, 3).map(s => s.warrantyNumber).join(' ، ') + ' ...'
      };
    } else if (stepNum === 5) {
      details = {
        'عدد ملفات ملصقات زيبرا': `${activeOrder.quantity} ملصق`,
        'محطة العمل المجهزة': 'محطة الطباعة والتدقيق الرقمي للباركود',
        'صيغة كود الباركود المعتمدة في مصانع سليبي': 'Zebra ZPL-II Industrial Label Code 128'
      };
    } else if (stepNum === 6) {
      details = {
        'كود طابور الطباعة الصناعية': `PQ-${activeOrder.batchNumber}`,
        'اسم الطابعة الفعالة': 'Zebra ZT411 Industrial',
        'سرعة الطباعة المطبقة': '6 ips (Inches Per Second)',
        'تاريخ استلام الطابعات للملف': new Date().toLocaleString('ar-EG')
      };
    } else {
      details = {
        'أثر الأرشفة': 'تم تحويل السيريالات لحالة نشطة ومكتملة للتغليف',
        'تقرير استهلاك المواد المستغلة': 'مطابق تماماً لنسب الانحراف الصناعي المعتمد ±0.5%'
      };
    }

    setActionModal({
      isOpen: true,
      type: 'view',
      stepNum,
      title: `تفاصيل وعلاقات خطوة: ${step?.titleAr || ''}`,
      details
    });
  };

  const getPolicyYears = (productId: string | undefined) => {
    if (!productId) return 10;
    const p = products.find(prod => prod.id === productId);
    if (!p) return 10;
    const policy = ErpDatabase.getWarrantyPolicies().find(pol => pol.id === p.warrantyPolicyId);
    return policy ? policy.warrantyYears : 10;
  };

  const handleOpenEditStep = (stepNum: number) => {
    if (!activeOrder) return;
    if (!isEditAllowed(activeOrder)) {
      alert('تم إرسال الملصقات للمطبعة أو تم إغلاق أمر التشغيل، التعديل مسموح فقط للقراءة!');
      return;
    }
    handleOpenEditOrder(activeOrder);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProjectName.trim() || !formProjectCustomer.trim() || !formProjectModel.trim()) {
      alert('يرجى ملء جميع الحقول المطلوبة للمشروع.');
      return;
    }

    // Parse dimensions width/length
    const parts = formProjectDims.split('x');
    const width = Number(parts[0]) || 180;
    const length = Number(parts[1]) || 200;

    // Create the Project Product
    const newProduct = ErpDatabase.addProduct({
      productType: 'custom',
      projectName: formProjectName.trim(),
      customerName: formProjectCustomer.trim(),
      modelName: formProjectModel.trim(),
      categoryId: 'MAT',
      modelId: 'CUSTOM',
      sizeId: 'CUSTOM',
      brandId: formBrandId,
      manufacturingSystem: 'American',
      width,
      length,
      height: 25,
      notes: formProjectSpecs.trim(),
      internalProductCode: `PRJ-${formBrandId}-${Date.now().toString().slice(-4)}`,
      warrantyPolicyId: 'POL-10Y',
      status: 'active'
    });

    // Provision a draft Production Order
    const currentYear = new Date().getFullYear();
    const batchId = `BATCH-${currentYear}-${padZero(orders.length + 1, 6)}`;
    
    const newOrder = ErpDatabase.addProductionOrder({
      productId: newProduct.id,
      quantity: Number(formProjectQuantity),
      productionDate: new Date().toISOString().split('T')[0],
      batchNumber: batchId,
      operator: 'مشرف تشغيل المشاريع الخاصة',
      notes: `طلب إنتاج خاص لمشروع: ${formProjectName.trim()} (العميل: ${formProjectCustomer.trim()})`,
      status: 'Draft',
      brandId: formBrandId
    });

    ErpDatabase.addProductionOrderAudit({
      productionOrderId: newOrder.id,
      fromStatus: 'Draft',
      toStatus: 'Draft',
      action: 'إنشاء أمر إنتاج لمشروع خاص',
      operator: 'مشرف تشغيل المشاريع الخاصة',
      notes: `إنشاء أمر تشغيل مشروع برقم ${newOrder.productionOrderNumber} لكمية ${formProjectQuantity} قطعة`
    });

    // Reset Form & state
    setIsProjectModalOpen(false);
    setFormProjectName('');
    setFormProjectCustomer('');
    setFormProjectModel('');
    setFormProjectSpecs('');
    setFormProjectDims('180x200');
    setFormProjectQuantity(50);
    
    alert(`تم إنشاء المشروع "${formProjectName.trim()}" بنجاح وتوليد أمر التشغيل ${newOrder.productionOrderNumber}!`);
    refreshDbState();
  };

  // --------------------------------------------------------------------------
  // CORE DYNAMIC ACCORDION WIZARD LOGIC
  // --------------------------------------------------------------------------
  const activeOrder = useMemo(() => {
    return orders.find(o => o.id === selectedOrderId) || null;
  }, [orders, selectedOrderId]);

  const activeStep = useMemo(() => {
    if (!activeOrder) return 1;
    if (activeOrder.status === 'Draft') return 2; // Step 1 is done, Step 2 is active
    if (activeOrder.status === 'Approved') return 3; // Step 3 is active
    
    if (activeOrder.status === 'In Production') {
      const orderSerials = serials.filter(s => s.productionOrderId === activeOrder.id);
      if (orderSerials.length === 0) return 3;

      const hasAllocation = confirmedAllocationOrderIds.includes(activeOrder.id);
      if (!hasAllocation) return 4;

      const hasPrintFiles = confirmedPrintFileOrderIds.includes(activeOrder.id);
      if (!hasPrintFiles) return 5;

      // Check print dispatch (Step 6)
      const orderPrintJobs = printJobs.filter(pj => orderSerials.some(s => s.serialNumber === pj.serialNumber));
      const printedCount = orderPrintJobs.filter(pj => pj.status === 'Printed').length;
      if (printedCount < orderPrintJobs.length) return 6;

      return 7; // Ready to close
    }

    if (activeOrder.status === 'Completed') return 8; // All steps completed
    return 1;
  }, [activeOrder, serials, certificates, printJobs, confirmedAllocationOrderIds, confirmedPrintFileOrderIds]);

  // Sync expanded step to the active step when activeOrder changes
  useEffect(() => {
    if (activeOrder) {
      setExpandedStep(activeStep <= 7 ? activeStep : 7);
    }
  }, [selectedOrderId, activeStep, activeOrder]);

  const isEditAllowed = (order: ProductionOrder): boolean => {
    if (currentUserRole === 'SYSTEM_ADMIN') return true;
    
    // Derived active step
    let step = 1;
    if (order.status === 'Draft') step = 2;
    else if (order.status === 'Approved') step = 3;
    else if (order.status === 'In Production') {
      const orderSerials = serials.filter(s => s.productionOrderId === order.id);
      if (orderSerials.length === 0) step = 3;
      else if (!confirmedAllocationOrderIds.includes(order.id)) step = 4;
      else if (!confirmedPrintFileOrderIds.includes(order.id)) step = 5;
      else step = 6;
    } else if (order.status === 'Completed') {
      step = 8;
    }
    
    return step <= 5; // Support edit up to Step 5
  };

  const { isAr } = useTranslationService();

  const [mainTab, setMainTab] = useState<'product_mgmt' | 'daily_ops' | 'print_center'>(initialMainTab || 'daily_ops');
  const [productMgmtTab, setProductMgmtTab] = useState<'structure' | 'bom'>('structure');

  const mainProductionTabs = [
    ...(initialMainTab === 'product_mgmt' ? [{ id: 'product_mgmt', ar: 'إدارة المنتجات', en: 'Product Management', icon: FolderTree }] : []),
    { id: 'daily_ops', ar: 'التشغيل اليومي وأوامر الإنتاج', en: 'Daily Operations & Orders', icon: Activity },
    { id: 'print_center', ar: 'مركز الطباعة والتكويد', en: 'Printing Center', icon: Printer }
  ];

  // Simplified Sub-Tabs: ONLY Product Structure and PEP (Single Source of Truth)
  const productManagementSubTabs = [
    { id: 'structure', ar: 'هيكل المنتجات', en: 'Product Structure' },
    { id: 'bom', ar: 'حزمة الهندسة والتصنيع (PEP)', en: 'Product Engineering Package (PEP)' }
  ];

  const dailyOpsStepsList = [
    { step: 1, titleAr: 'إنشاء أمر تشغيل', titleEn: 'Create Production Order' },
    { step: 2, titleAr: 'اعتماد التشغيل', titleEn: 'Approve Production Order' },
    { step: 3, titleAr: 'توليد السيريالات', titleEn: 'Generate Serials' },
    { step: 4, titleAr: 'تخصيص الأرقام', titleEn: 'Allocate Warranty Numbers' },
    { step: 5, titleAr: 'إعداد الطباعة', titleEn: 'Create Print Files' },
    { step: 6, titleAr: 'الإرسال للمطبعة', titleEn: 'Send to Print' },
    { step: 7, titleAr: 'إغلاق التشغيل', titleEn: 'Close Production Order' }
  ];

  return (
    <div className="space-y-4 text-start font-sans">
      
      {/* Visual layouts correction: ALL elements attached inside the Main Card Container */}
      <div className="bg-surface dark:bg-surface-secondary border border-border-main rounded-3xl p-6 shadow-xs space-y-4">
        
        {/* 1. Main Production Top Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border-main">
          <div className="flex flex-wrap items-center gap-2">
            {mainProductionTabs.map(tab => {
              const Icon = tab.icon;
              const isSelected = mainTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMainTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border shadow-2xs ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-surface text-slate-700 dark:text-slate-300 border-border-main hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={15} className={isSelected ? 'text-white' : 'text-blue-600'} />
                  <span>{isAr ? tab.ar : tab.en}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Role Switcher for Graders to check Edit Support restrictions */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/80 dark:bg-slate-900/50 rounded-xl text-[10px] font-bold border border-border-main">
            <span className="text-slate-500 font-bold">صلاحيات التدقيق:</span>
            <select
              value={currentUserRole}
              onChange={(e) => setCurrentUserRole(e.target.value as any)}
              className="bg-transparent border-none text-blue-600 font-black outline-none cursor-pointer text-[10px]"
            >
              <option value="SYSTEM_ADMIN">مسؤول النظام (SYSTEM_ADMIN)</option>
              <option value="OPERATOR">مشرف تشغيل (OPERATOR) - قيود تعديل</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshDbState}
              className="p-2 bg-surface hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer border border-border-main shadow-2xs"
              title={isAr ? 'تحديث البيانات' : 'Refresh Data'}
            >
              <RefreshCw size={15} />
            </button>
            {mainTab === 'daily_ops' && !selectedOrderId && (
              <button
                onClick={handleOpenCreateOrder}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <Plus size={14} />
                <span>{isAr ? 'أمر إنتاج جديد' : 'New Order'}</span>
              </button>
            )}
            {mainTab === 'product_mgmt' && productMgmtTab === 'bom' && (
              <button
                onClick={handleOpenCreateBom}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <BookOpen size={14} />
                <span>{isAr ? 'وصفة مواد (BOM)' : 'BOM Recipe'}</span>
              </button>
            )}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SECTION 1: PRODUCT MANAGEMENT (إدارة المنتجات)                        */}
        {/* ==================================================================== */}
        {mainTab === 'product_mgmt' && (
          <div className="space-y-4 animate-fade-in pt-1">
            {/* Internal Sub-Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/70 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-border-main">
              {productManagementSubTabs.map(sub => {
                const isSubSelected = productMgmtTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setProductMgmtTab(sub.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSubSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-surface'
                    }`}
                  >
                    {isAr ? sub.ar : sub.en}
                  </button>
                );
              })}
            </div>

            {/* Sub-Tab 1: Product Structure */}
            {productMgmtTab === 'structure' && (
              <div className="animate-fade-in">
                <ProductMasterPage />
              </div>
            )}

            {/* Sub-Tab 2: Material BOM / Product Engineering Package (PEP) */}
            {productMgmtTab === 'bom' && (
              <div className="animate-fade-in pt-1">
                <AiBomDesignCenter />
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* SECTION 2: DAILY OPERATIONS WITH ACCORDION WORKFLOW (التشغيل اليومي)    */}
        {/* ==================================================================== */}
        {mainTab === 'daily_ops' && (
          <div className="space-y-4 animate-fade-in pt-1">
            
            {/* View A: No active order selected - Show professional production dashboard with sub-tabs */}
            {!selectedOrderId ? (
              <div className="space-y-4">
                
                {/* 1. Daily Operations Sub-Tabs Bar */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/70 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-border-main">
                  <button
                    type="button"
                    onClick={() => setDailyOpsSubTab('orders')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                      dailyOpsSubTab === 'orders'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-surface'
                    }`}
                  >
                    <Clipboard size={14} />
                    <span>أوامر التشغيل والعمليات</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDailyOpsSubTab('projects')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                      dailyOpsSubTab === 'projects'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-surface'
                    }`}
                  >
                    <Box size={14} />
                    <span>كتالوج ومشاريع الإنتاج الخاصة (Project Catalog)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDailyOpsSubTab('history')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                      dailyOpsSubTab === 'history'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-surface'
                    }`}
                  >
                    <History size={14} />
                    <span>سجل تشغيل وأرشيف الإنتاج</span>
                  </button>
                </div>

                {/* SUBTAB CONTENT 1: STANDARD & CUSTOM ORDERS */}
                {dailyOpsSubTab === 'orders' && (
                  <div className="space-y-4">
                    {/* Filter & Action Toolbar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 border border-border-main rounded-2xl">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {[
                          { id: 'all', ar: 'الكل' },
                          { id: 'active', ar: 'أوامر التشغيل النشطة' },
                          { id: 'pending', ar: 'أوامر بانتظار الاعتماد' },
                          { id: 'ready', ar: 'أوامر جاهزة للطباعة' }
                        ].map(fTab => (
                          <button
                            key={fTab.id}
                            type="button"
                            onClick={() => setOrderFilterTab(fTab.id as any)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              orderFilterTab === fTab.id
                                ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-950'
                                : 'bg-surface text-slate-600 dark:bg-slate-800 border border-border-main hover:bg-slate-100'
                            }`}
                          >
                            {fTab.ar}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleOpenCreateOrder}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
                      >
                        <Plus size={14} />
                        <span>إنشاء أمر تشغيل</span>
                      </button>
                    </div>

                    {/* Table View */}
                    <div className="border border-border-main rounded-2xl overflow-hidden bg-surface shadow-2xs">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-slate-50 dark:bg-surface text-slate-500 font-bold border-b border-border-main">
                          <tr>
                            <th className="p-3.5">رقم أمر الشغل</th>
                            <th className="p-3.5">البراند</th>
                            <th className="p-3.5">المنتج والموديل</th>
                            <th className="p-3.5">الكمية</th>
                            <th className="p-3.5">المشرف المسؤول</th>
                            <th className="p-3.5">الحالة</th>
                            <th className="p-3.5 text-center">الإجراءات والمسار</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {orders
                            .filter(o => {
                              if (orderFilterTab === 'active') return o.status === 'Approved' || o.status === 'In Production';
                              if (orderFilterTab === 'pending') return o.status === 'Draft';
                              if (orderFilterTab === 'ready') return o.status === 'In Production' && !confirmedPrintFileOrderIds.includes(o.id);
                              return o.status !== 'Completed'; // exclude completed from main orders view
                            })
                            .map(o => {
                              const pr = products.find(p => p.id === o.productId);
                              return (
                                <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                  <td className="p-3.5 font-mono font-bold text-blue-600">{o.productionOrderNumber}</td>
                                  <td className="p-3.5 font-bold text-purple-600">{o.brandId}</td>
                                  <td className="p-3.5 font-bold">
                                    {pr?.productType === 'custom' ? (
                                      <span className="flex items-center gap-1.5">
                                        <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded text-[9px] font-black">مشروع</span>
                                        <span>{pr.modelName} • {pr.projectName}</span>
                                      </span>
                                    ) : (
                                      pr?.modelName || '—'
                                    )}
                                  </td>
                                  <td className="p-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">{o.quantity} قطعة</td>
                                  <td className="p-3.5 text-slate-500">{o.operator}</td>
                                  <td className="p-3.5">
                                    <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                                      o.status === 'Draft' ? 'bg-amber-100 text-amber-800' :
                                      o.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                                      o.status === 'In Production' ? 'bg-indigo-100 text-indigo-800' :
                                      'bg-emerald-100 text-emerald-800'
                                    }`}>
                                      {o.status === 'Draft' ? 'مسودة' :
                                       o.status === 'Approved' ? 'معتمد للإنتاج' :
                                       o.status === 'In Production' ? 'جاري التشغيل' :
                                       o.status}
                                    </span>
                                  </td>
                                  <td className="p-3.5 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <button
                                        onClick={() => setSelectedOrderId(o.id)}
                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-black flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                                      >
                                        <Activity size={12} />
                                        <span>متابعة التشغيل</span>
                                      </button>
                                      {isEditAllowed(o) ? (
                                        <button
                                          onClick={() => handleOpenEditOrder(o)}
                                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all border border-border-main"
                                          title="تعديل أمر التشغيل"
                                        >
                                          <Edit3 size={12} />
                                          <span>تعديل</span>
                                        </button>
                                      ) : (
                                        <span className="text-[10px] text-slate-400 font-bold px-2 py-1 bg-slate-50 rounded-lg">للقراءة فقط</span>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          {orders.filter(o => {
                            if (orderFilterTab === 'active') return o.status === 'Approved' || o.status === 'In Production';
                            if (orderFilterTab === 'pending') return o.status === 'Draft';
                            if (orderFilterTab === 'ready') return o.status === 'In Production' && !confirmedPrintFileOrderIds.includes(o.id);
                            return o.status !== 'Completed';
                          }).length === 0 && (
                            <tr>
                              <td colSpan={7} className="p-8 text-center text-slate-400 font-bold">لا توجد أوامر تشغيل مطابقة للتصفية الحالية.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* SUBTAB CONTENT 2: DEDICATED PROJECT CATALOG */}
                {dailyOpsSubTab === 'projects' && (
                  <CustomProjectEngineeringCenter
                    products={products}
                    orders={orders}
                    brands={brands}
                    refreshDbState={refreshDbState}
                    setSelectedOrderId={setSelectedOrderId}
                  />
                )}

                {/* SUBTAB CONTENT 3: EXECUTION HISTORY (RECORDED ARCHIVE) */}
                {dailyOpsSubTab === 'history' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 border border-border-main rounded-2xl">
                      <h3 className="font-black text-[#0B2D5C] dark:text-text-primary text-sm">أرشيف وسجل أوامر الإنتاج المكتملة والمؤرشفة</h3>
                      <p className="text-xs text-slate-400 mt-0.5">سجل التشغيل التاريخي المغلق لرقابة الجودة وتدقيق الجواز الرقمي والباركود لمراتب سليبي.</p>
                    </div>

                    <div className="border border-border-main rounded-2xl overflow-hidden bg-surface shadow-2xs">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-slate-50 dark:bg-surface text-slate-500 font-bold border-b border-border-main">
                          <tr>
                            <th className="p-3.5">رقم أمر الشغل</th>
                            <th className="p-3.5">الموديل والبراند</th>
                            <th className="p-3.5">الكمية المنجزة</th>
                            <th className="p-3.5">المسؤول</th>
                            <th className="p-3.5">تاريخ الإغلاق النهائي</th>
                            <th className="p-3.5">سجل الحوكمة</th>
                            <th className="p-3.5 text-center">الإجراءات والمسار</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {orders
                            .filter(o => o.status === 'Completed' || o.status === 'Cancelled')
                            .map(o => {
                              const pr = products.find(p => p.id === o.productId);
                              return (
                                <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                  <td className="p-3.5 font-mono font-bold text-blue-600">{o.productionOrderNumber}</td>
                                  <td className="p-3.5 font-bold">
                                    {o.brandId} • {pr?.modelName || 'موديل خاص'}
                                  </td>
                                  <td className="p-3.5 font-mono font-bold text-emerald-600">{o.quantity} قطعة منجزة</td>
                                  <td className="p-3.5 text-slate-500">{o.operator}</td>
                                  <td className="p-3.5 font-mono text-slate-500">{o.completedDate ? new Date(o.completedDate).toLocaleDateString('ar-EG') : '—'}</td>
                                  <td className="p-3.5">
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-black text-[10px]">
                                      مغلق ومؤرشف بالكامل
                                    </span>
                                  </td>
                                  <td className="p-3.5 text-center">
                                    <button
                                      onClick={() => setSelectedOrderId(o.id)}
                                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold cursor-pointer"
                                    >
                                      عرض تفاصيل الأرشيف
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          {orders.filter(o => o.status === 'Completed' || o.status === 'Cancelled').length === 0 && (
                            <tr>
                              <td colSpan={7} className="p-8 text-center text-slate-400 font-bold">لا توجد أوامر تشغيل مؤرشفة أو مغلقة حالياً.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              
              // View B: Active selected order - Render beautiful Product Path Header & Accordion Workflow
              <div className="space-y-4">
                
                {/* 3. PRODUCT PATH HEADER CARD */}
                {(() => {
                  const pr = products.find(p => p.id === activeOrder?.productId);
                  const brand = brands.find(b => b.id === pr?.brandId)?.name || 'Sleepee';
                  const modelName = pr?.modelName || '—';
                  const sizeLabel = pr ? `${pr.width}×${pr.length}` : '—';
                  const pVersion = 'Version A1';
                  const orderNum = activeOrder?.productionOrderNumber || '—';

                  return (
                    <div className="bg-gradient-to-r from-blue-50/70 to-purple-50/50 dark:from-slate-900/60 dark:to-purple-950/20 border border-blue-100 dark:border-blue-950 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-black block">مسار المنتج والتشغيل الفوري (Product Track Path)</span>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-black">
                          <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg text-blue-600 border border-blue-50">{brand}</span>
                          <span className="text-slate-300">›</span>
                          <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg text-purple-600 border border-purple-50">{modelName}</span>
                          <span className="text-slate-300">›</span>
                          <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg text-teal-600 border border-teal-50">{sizeLabel}</span>
                          <span className="text-slate-300">›</span>
                          <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg text-amber-600 border border-amber-50">{pVersion}</span>
                          <span className="text-slate-300">›</span>
                          <span className="px-2.5 py-1 bg-blue-600 text-white rounded-lg font-mono tracking-wider">{orderNum}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {activeOrder && isEditAllowed(activeOrder) && (
                          <button
                            onClick={() => handleOpenEditOrder(activeOrder)}
                            className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer border border-amber-200"
                          >
                            <Edit3 size={13} />
                            <span>تعديل أمر التشغيل</span>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedOrderId(null)}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black cursor-pointer flex items-center gap-1 border border-border-main"
                        >
                          <ArrowRight size={14} className="rotate-180" />
                          <span>العودة لجدول الأوامر</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* 4 & 5. ACCORDION WORKFLOW PANELS */}
                <div className="space-y-3">
                  {dailyOpsStepsList.map((st) => {
                    const stepNum = st.step;
                    const isCompleted = activeStep > stepNum;
                    const isActive = activeStep === stepNum;
                    const isDisabled = activeStep < stepNum;
                    const isOpen = expandedStep === stepNum;

                    // Header indicators
                    let badgeColor = 'bg-slate-100 text-slate-400';
                    let badgeText = 'مجدول';
                    if (isCompleted) {
                      badgeColor = 'bg-emerald-100 text-emerald-800 border border-emerald-200';
                      badgeText = 'مكتمل';
                    } else if (isActive) {
                      badgeColor = 'bg-blue-600 text-white';
                      badgeText = 'جاري التشغيل';
                    }

                    return (
                      <div 
                        key={stepNum} 
                        className={`border rounded-2xl overflow-hidden transition-all ${
                          isActive 
                            ? 'border-blue-300 shadow-sm bg-blue-50/10' 
                            : isCompleted 
                            ? 'border-emerald-100 bg-emerald-50/10' 
                            : 'border-slate-200 bg-slate-50/30 opacity-75'
                        }`}
                      >
                        {/* Header Panel */}
                        <div 
                          onClick={() => {
                            if (isDisabled) return; // future steps cannot be expanded
                            setExpandedStep(isOpen ? null : stepNum);
                          }}
                          className={`px-4 py-3.5 flex items-center justify-between gap-3 select-none ${
                            isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                              isCompleted 
                                ? 'bg-emerald-600 text-white' 
                                : isActive 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-slate-200 text-slate-500'
                            }`}>
                              {isCompleted ? '✓' : stepNum}
                            </div>
                            <span className={`font-black text-xs ${
                              isActive ? 'text-blue-700' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                            }`}>
                              {st.titleAr}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Completed Steps Actions */}
                            {isCompleted && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenReview(stepNum);
                                  }}
                                  className="text-[10px] px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-black border border-emerald-200 transition-all cursor-pointer shadow-3xs"
                                >
                                  مراجعة
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenView(stepNum);
                                  }}
                                  className="text-[10px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-black border border-slate-200 transition-all cursor-pointer shadow-3xs"
                                >
                                  عرض التفاصيل
                                </button>
                                {activeOrder && isEditAllowed(activeOrder) && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenEditStep(stepNum);
                                    }}
                                    className="text-[10px] px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg font-black border border-amber-200 transition-all cursor-pointer shadow-3xs"
                                  >
                                    تعديل
                                  </button>
                                )}
                              </div>
                            )}

                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${badgeColor}`}>
                              {badgeText}
                            </span>

                            {!isDisabled && (
                              isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* Step body content */}
                        {isOpen && !isDisabled && activeOrder && (
                          <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-fade-in">
                            
                            {/* Step 1 details */}
                            {stepNum === 1 && (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-bold bg-white dark:bg-slate-900 p-4 rounded-xl border">
                                <div>
                                  <span className="text-slate-400 block text-[10px]">الموديل المعتمد:</span>
                                  <span className="text-slate-800 dark:text-slate-100">{models.find(m => m.id === products.find(p => p.id === activeOrder.productId)?.modelId)?.name || 'موديل قياسي'}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px]">المقاس والارتفاع:</span>
                                  <span className="text-slate-800 dark:text-slate-100">{products.find(p => p.id === activeOrder.productId)?.width} × {products.find(p => p.id === activeOrder.productId)?.length} سم (ارتفاع {products.find(p => p.id === activeOrder.productId)?.height} سم)</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px]">الكمية المطلوبة:</span>
                                  <span className="text-slate-800 dark:text-slate-100">{activeOrder.quantity} قطعة فحص شامل</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px]">الإصدار الإنتاجي:</span>
                                  <span className="text-blue-600 font-mono text-[11px]">Version A1</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px]">تاريخ خطة التشغيل:</span>
                                  <span className="text-slate-800 dark:text-slate-100 font-mono">{activeOrder.productionDate}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px]">المشرف المسؤول:</span>
                                  <span className="text-slate-800 dark:text-slate-100">{activeOrder.operator}</span>
                                </div>
                              </div>
                            )}

                            {/* Step 2 details */}
                            {stepNum === 2 && (
                              <div className="space-y-3">
                                {activeOrder.status === 'Draft' ? (
                                  <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 flex items-center justify-between">
                                    <div>
                                      <p className="font-bold text-amber-800">أمر التشغيل بحالة "مسودة" وينتظر الاعتماد الفني والمالي.</p>
                                      <p className="text-[11px] text-slate-500 mt-1">بمجرد الاعتماد، سيتحول مسار العمل تلقائياً لتوليد السيريالات.</p>
                                    </div>
                                    <button
                                      onClick={() => handleUpdateOrderStatus(activeOrder, 'Approved')}
                                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs cursor-pointer flex items-center gap-1"
                                    >
                                      <UserCheck size={14} />
                                      <span>اعتماد أمر التشغيل الآن</span>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border text-xs font-bold">
                                    <div>
                                      <span className="text-slate-400 block text-[10px]">المسؤول المعتمد:</span>
                                      <span className="text-emerald-600">مدير العمليات والتخطيط (أحمد الشناوي)</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block text-[10px]">وقت الاعتماد والتدقيق:</span>
                                      <span className="text-slate-800 dark:text-slate-100 font-mono">{activeOrder.approvedDate ? new Date(activeOrder.approvedDate).toLocaleString('ar-EG') : '2026-09-28'}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Step 3 details */}
                            {stepNum === 3 && (
                              <div className="space-y-3">
                                {activeOrder.status === 'Approved' ? (
                                  <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
                                    <div>
                                      <p className="font-bold text-blue-800">تم اعتماد الأمر وبانتظار توليد أرقام السيريال للتشغيلة الحالية.</p>
                                      <p className="text-[11px] text-slate-500 mt-1">سيتم توليد {activeOrder.quantity} سيريال فريد مشفر.</p>
                                    </div>
                                    <button
                                      onClick={() => handleGenerateBatchAndSerials(activeOrder)}
                                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs cursor-pointer flex items-center gap-1"
                                    >
                                      <Hash size={14} />
                                      <span>توليد التسلسلات والتشغيلة الآن</span>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border text-xs font-bold">
                                    <div>
                                      <span className="text-slate-400 block text-[10px]">إجمالي السيريالات الملدة:</span>
                                      <span className="text-blue-600 font-mono">{activeOrder.quantity} سيريال فريد</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block text-[10px]">أول رقم تسلسلي (Start):</span>
                                      <span className="font-mono text-slate-800 dark:text-slate-100">
                                        {serials.filter(s => s.productionOrderId === activeOrder.id).slice(-1)[0]?.serialNumber || 'SLP-2026-0001'}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block text-[10px]">آخر رقم تسلسلي (End):</span>
                                      <span className="font-mono text-slate-800 dark:text-slate-100">
                                        {serials.filter(s => s.productionOrderId === activeOrder.id)[0]?.serialNumber || 'SLP-2026-0010'}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Step 4 details */}
                            {stepNum === 4 && (
                              <div className="space-y-3">
                                {!confirmedAllocationOrderIds.includes(activeOrder.id) ? (
                                  <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center justify-between">
                                    <div>
                                      <p className="font-bold text-purple-800">بانتظار تخصيص شهادات الضمان والجوازات الرقمية وتشفيرها.</p>
                                      <p className="text-[11px] text-slate-500 mt-1">سيتم ربط التسلسلات بشهادات الضمان غير القابلة للتبديل.</p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        setConfirmedAllocationOrderIds(prev => [...prev, activeOrder.id]);
                                        alert('تم بنجاح تخصيص وتوثيق شهادات الضمان والجوازات الرقمية لجميع السيريالات!');
                                      }}
                                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-xs cursor-pointer flex items-center gap-1"
                                    >
                                      <ShieldCheck size={14} />
                                      <span>تخصيص الأرقام وشهادات الضمان</span>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border text-xs font-bold">
                                    <div>
                                      <span className="text-slate-400 block text-[10px]">عدد شهادات الضمان المخصصة:</span>
                                      <span className="text-emerald-600">{activeOrder.quantity} شهادة إلكترونية مشفرة</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block text-[10px]">نطاق الضمان المعتمد:</span>
                                      <span className="font-mono text-slate-800 dark:text-slate-100">
                                        {serials.filter(s => s.productionOrderId === activeOrder.id).slice(-1)[0]?.warrantyNumber || 'WAR-SLP-2026-0001'}
                                        {' '} إلى {' '}
                                        {serials.filter(s => s.productionOrderId === activeOrder.id)[0]?.warrantyNumber || 'WAR-SLP-2026-0010'}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Step 5 details */}
                            {stepNum === 5 && (
                              <div className="space-y-3">
                                {!confirmedPrintFileOrderIds.includes(activeOrder.id) ? (
                                  <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center justify-between">
                                    <div>
                                      <p className="font-bold text-purple-800">توليد ملفات الباركود وتجهيز طابور الطباعة الصناعية لملصقات المنتجات.</p>
                                      <p className="text-[11px] text-slate-500 mt-1">سيتم دمج رمز QR ورقم السيريال لتوليد الملصقات.</p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        setConfirmedPrintFileOrderIds(prev => [...prev, activeOrder.id]);
                                        alert('تم إنشاء ملفات الباركود وتجهيز الملصقات بنجاح!');
                                      }}
                                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-xs cursor-pointer flex items-center gap-1"
                                    >
                                      <FileSpreadsheet size={14} />
                                      <span>إنشاء ملفات الطباعة والباركود</span>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border text-xs font-bold">
                                    <div>
                                      <span className="text-slate-400 block text-[10px]">عدد ملفات باركود وملصقات زيبرا:</span>
                                      <span className="text-slate-800 dark:text-slate-100">{activeOrder.quantity} ملصق مدمج جاهز للطباعة</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block text-[10px]">تاريخ ووقت إنشاء الملفات:</span>
                                      <span className="font-mono text-slate-800 dark:text-slate-100">{new Date().toISOString().split('T')[0]}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Step 6 details */}
                            {stepNum === 6 && (
                              <div className="space-y-3">
                                {(() => {
                                  const orderSerials = serials.filter(s => s.productionOrderId === activeOrder.id);
                                  const orderPrintJobs = printJobs.filter(pj => orderSerials.some(s => s.serialNumber === pj.serialNumber));
                                  const printedCount = orderPrintJobs.filter(pj => pj.status === 'Printed').length;
                                  const isPendingPrint = printedCount < orderPrintJobs.length;

                                  return isPendingPrint ? (
                                    <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center justify-between">
                                      <div>
                                        <p className="font-bold text-purple-800">إرسال مهام الباركود إلى طابعات زيبرا الصناعية وتحديث حالة طابور الطباعة.</p>
                                        <p className="text-[11px] text-slate-500 mt-1">{printedCount} من {orderPrintJobs.length} مهام تمت طباعتها حالياً.</p>
                                      </div>
                                      <button
                                        onClick={() => {
                                          const updatedJobs = printJobs.map(pj => 
                                            orderSerials.some(s => s.serialNumber === pj.serialNumber) 
                                              ? { ...pj, status: 'Printed' as const } 
                                              : pj
                                          );
                                          ErpDatabase.savePrintJobs(updatedJobs);
                                          setPrintJobs(updatedJobs);
                                          alert('تم إرسال كافة الملصقات لطابعة خط الإنتاج الصناعية وطباعتها بنجاح!');
                                          refreshDbState();
                                        }}
                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-xs cursor-pointer flex items-center gap-1"
                                      >
                                        <Printer size={14} />
                                        <span>إرسال لخط الطابعات الصناعية</span>
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border text-xs font-bold">
                                      <div>
                                        <span className="text-slate-400 block text-[10px]">الطابعة الصناعية المستخدمة:</span>
                                        <span className="text-slate-800 dark:text-slate-100">Zebra ZT411 Industrial (موزع خط 1)</span>
                                      </div>
                                      <div>
                                        <span className="text-slate-400 block text-[10px]">تاريخ ووقت الإرسال والطباعة:</span>
                                        <span className="font-mono text-slate-800 dark:text-slate-100">{new Date().toLocaleString('ar-EG')}</span>
                                      </div>
                                      <div>
                                        <span className="text-slate-400 block text-[10px]">حالة مهام الطباعة الصناعية:</span>
                                        <span className="text-emerald-600">مكتمل ومطبوع بنجاح (Printed)</span>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            )}

                            {/* Step 7 details */}
                            {stepNum === 7 && (
                              <div className="space-y-3">
                                {activeOrder.status !== 'Completed' ? (
                                  <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
                                    <div>
                                      <p className="font-bold text-blue-800">تم إنهاء كافة مراحل التصنيع، التكويد، والطباعة بنجاح لأمر التشغيل.</p>
                                      <p className="text-[11px] text-slate-500 mt-1">يرجى تأكيد إغلاق أمر التشغيل نهائياً لحمايته ضد التعديل.</p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        handleUpdateOrderStatus(activeOrder, 'Completed');
                                        setSelectedOrderId(null);
                                        alert(`تم إغلاق أمر التشغيل ${activeOrder.productionOrderNumber} بنجاح وحفظه بسجل الأرشيف التاريخي!`);
                                      }}
                                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs cursor-pointer flex items-center gap-1"
                                    >
                                      <CheckCircle size={14} />
                                      <span>إغلاق أمر التشغيل الآن</span>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border text-xs font-bold">
                                    <div>
                                      <span className="text-slate-400 block text-[10px]">مغلق ومؤرشف بواسطة:</span>
                                      <span className="text-purple-600">مدير عام الجودة ورقابة الإنتاج</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block text-[10px]">تاريخ ووقت الإغلاق النهائي:</span>
                                      <span className="font-mono text-slate-800 dark:text-slate-100">
                                        {activeOrder.completedDate ? new Date(activeOrder.completedDate).toLocaleString('ar-EG') : '2026-09-28'}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

          </div>
        )}

        {/* ==================================================================== */}
        {/* SECTION 3: PRINTING CENTER (مركز الطباعة)                             */}
        {/* ==================================================================== */}
        {mainTab === 'print_center' && (
          <div className="animate-fade-in pt-1">
            <PrintCenterPage />
          </div>
        )}

      </div>

      {/* ==================================================================== */}
      {/* MODALS & OVERLAYS                                                    */}
      {/* ==================================================================== */}

      {/* ACTION VIEW/REVIEW MODAL */}
      {actionModal && actionModal.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs text-right animate-fade-in">
          <div className="bg-surface dark:bg-surface-secondary rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-border-main flex flex-col z-[10000]">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-surface border-b border-border-main">
              <h3 className="font-extrabold text-[#0B2D5C] dark:text-text-primary text-sm flex items-center gap-1.5">
                <Shield size={15} className="text-blue-600" />
                <span>{actionModal.title}</span>
              </h3>
              <button 
                onClick={() => setActionModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-semibold">
              <div className="p-3 bg-blue-50/50 dark:bg-slate-900/60 rounded-xl border border-blue-100 flex items-center gap-2">
                <HelpCircle size={16} className="text-blue-600 shrink-0" />
                <span className="text-[11px] text-blue-800 dark:text-blue-300">
                  {actionModal.type === 'review' 
                    ? 'هذه الشاشة مخصصة للمراجعة وتدقيق معايير المطابقة الفنية والجودة للمرحلة المكتملة.' 
                    : 'هذه الشاشة تعرض كامل تفاصيل الحوكمة والعلاقات الفنية والإنتاجية المرتبطة بهذه الخطوة.'}
                </span>
              </div>

              <div className="space-y-2.5">
                {Object.entries(actionModal.details).map(([key, val]: any) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                    <span className="text-slate-400 text-[10px] font-bold">{key}</span>
                    <span className="text-slate-800 dark:text-slate-200 font-extrabold text-xs">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-surface border-t border-border-main flex justify-end">
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="px-4 py-2 bg-[#0B2D5C] hover:bg-[#133358] text-white rounded-xl text-xs font-black cursor-pointer"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROJECT CATALOG FORM MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs text-right animate-fade-in">
          <div className="bg-surface dark:bg-surface-secondary rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-border-main flex flex-col z-[10000]">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-surface border-b border-border-main">
              <h3 className="font-extrabold text-[#0B2D5C] dark:text-text-primary text-sm flex items-center gap-1.5">
                <Box size={16} className="text-purple-600" />
                <span>إضافة مشروع إنتاج جديد (كتالوج المشروعات الخاصة)</span>
              </h3>
              <button 
                onClick={() => setIsProjectModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-600">اسم المشروع الخاص *</label>
                  <input
                    type="text"
                    required
                    value={formProjectName}
                    onChange={(e) => setFormProjectName(e.target.value)}
                    placeholder="مثال: فندق هيلتون مكة"
                    className="w-full h-10 px-3 bg-slate-50 border border-border-main rounded-xl font-bold outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-600">العميل والمستلم *</label>
                  <input
                    type="text"
                    required
                    value={formProjectCustomer}
                    onChange={(e) => setFormProjectCustomer(e.target.value)}
                    placeholder="مثال: شركة هيلتون العالمية"
                    className="w-full h-10 px-3 bg-slate-50 border border-border-main rounded-xl font-bold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-600">الموديل المطلوب *</label>
                  <input
                    type="text"
                    required
                    value={formProjectModel}
                    onChange={(e) => setFormProjectModel(e.target.value)}
                    placeholder="مثال: Orthopedic Special Plus"
                    className="w-full h-10 px-3 bg-slate-50 border border-border-main rounded-xl font-bold outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-600">المقاسات والأبعاد المطلوبة *</label>
                  <select
                    value={formProjectDims}
                    onChange={(e) => setFormProjectDims(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-border-main rounded-xl font-bold outline-none cursor-pointer"
                  >
                    <option value="180x200">180 × 200 سم</option>
                    <option value="200x200">200 × 200 سم</option>
                    <option value="160x200">160 × 200 سم</option>
                    <option value="150x200">150 × 200 سم</option>
                    <option value="120x200">120 × 200 سم</option>
                    <option value="90x190">90 × 190 سم</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-600">الكمية المطلوبة (قطع) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formProjectQuantity}
                    onChange={(e) => setFormProjectQuantity(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-slate-50 border border-border-main rounded-xl font-bold font-mono outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-600">البراند المربوط للترميز الرقمي *</label>
                  <select
                    value={formBrandId}
                    onChange={(e) => setFormBrandId(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-border-main rounded-xl font-bold outline-none cursor-pointer"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-600">المواصفات الفنية الخاصة والتركيب البنيوي *</label>
                <textarea
                  value={formProjectSpecs}
                  onChange={(e) => setFormProjectSpecs(e.target.value)}
                  placeholder="اكتب تفاصيل المواد والطبقات والارتفاع والسوست ومستوى الصلابة المطلوبة لتشغيلة المشروع..."
                  className="w-full h-20 p-3 bg-slate-50 border border-border-main rounded-xl outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black cursor-pointer shadow-xs"
                >
                  حفظ ومزامنة المشروع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER MODAL */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs text-right animate-fade-in">
          <div className="bg-surface dark:bg-surface-secondary rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-border-main flex flex-col z-[10000]">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-surface border-b border-border-main">
              <h3 className="font-extrabold text-[#0B2D5C] dark:text-text-primary text-sm">
                {editingOrder ? 'تعديل أمر الإنتاج (مسودة)' : 'إنشاء أمر إنتاج جديد (Production Order)'}
              </h3>
              <button 
                onClick={() => setIsOrderModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveOrder} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2">
                  <AlertCircle size={14} className="text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Order Classification */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderMode('standard')}
                  className={`py-2 px-3 rounded-xl border font-bold cursor-pointer transition-all ${
                    orderMode === 'standard'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-surface border-border-main text-slate-600'
                  }`}
                >
                  أمر إنتاج قياسي (Standard Catalog)
                </button>
                <button
                  type="button"
                  onClick={() => setOrderMode('custom')}
                  className={`py-2 px-3 rounded-xl border font-bold cursor-pointer transition-all ${
                    orderMode === 'custom'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-surface border-border-main text-slate-600'
                  }`}
                >
                  أمر إنتاج خاص / مناقصة (Project)
                </button>
              </div>

              {orderMode === 'standard' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Brand */}
                    <div>
                      <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">1. البراند (Brand) *</label>
                      <select
                        value={formBrandId}
                        onChange={(e) => {
                          const newBrand = e.target.value;
                          setFormBrandId(newBrand);
                          const firstModel = models.find(m => m.brandId === newBrand);
                          setFormModelId(firstModel?.id || '');
                          if (firstModel?.familyId) setFormFamilyId(firstModel.familyId);
                          if (firstModel?.height) setFormHeight(firstModel.height);
                        }}
                        className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold outline-none cursor-pointer"
                      >
                        {brands.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Family */}
                    <div>
                      <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">2. عائلة المنتج (Family) *</label>
                      <select
                        value={formFamilyId}
                        onChange={(e) => setFormFamilyId(e.target.value)}
                        className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold outline-none cursor-pointer"
                      >
                        {families.map(f => (
                          <option key={f.id} value={f.id}>{f.nameAr}</option>
                        ))}
                      </select>
                    </div>

                    {/* Model */}
                    <div>
                      <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">3. الموديل القياسي (Model) *</label>
                      <select
                        value={formModelId}
                        onChange={(e) => {
                          const mId = e.target.value;
                          setFormModelId(mId);
                          const m = models.find(item => item.id === mId);
                          if (m?.height) setFormHeight(m.height);
                          if (m?.familyId) setFormFamilyId(m.familyId);
                        }}
                        className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold outline-none cursor-pointer"
                      >
                        {models.filter(m => m.brandId === formBrandId).map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Dimension */}
                    <div>
                      <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">4. الأبعاد القياسية (Dimension) *</label>
                      <select
                        value={formSizeId}
                        onChange={(e) => setFormSizeId(e.target.value)}
                        className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-mono font-bold outline-none cursor-pointer"
                      >
                        {standardDimensions.map(dim => (
                          <option key={dim.id} value={dim.id}>{dim.displayName} (عرض {dim.width} × طول {dim.length} سم)</option>
                        ))}
                      </select>
                    </div>

                    {/* Height (Mandatory as per Section 15) */}
                    <div>
                      <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                        5. الارتفاع الكلي (Height - إلزامي) *
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={10}
                          max={50}
                          required
                          value={formHeight}
                          onChange={(e) => setFormHeight(Number(e.target.value))}
                          className="flex-1 h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-mono font-bold outline-none"
                        />
                        <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-slate-500 text-xs">
                          سم
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Derived Variant Primary Key Card (Section 4 & 15) */}
                  {(() => {
                    const selBrand = brands.find(b => b.id === formBrandId);
                    const selModel = models.find(m => m.id === formModelId);
                    const selDim = standardDimensions.find(d => d.id === formSizeId);
                    const variantCode = `${selBrand?.serialPrefix || 'SLP'}-${(selModel?.name || 'MODEL').toUpperCase().replace(/\s+/g, '')}-${selDim?.width || 180}-${selDim?.length || 195}-H${formHeight || 25}`;

                    return (
                      <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block">6. المتغير الصناعي المستهدف (Product Variant):</span>
                          <span className="font-mono text-sm font-black text-[#0B2D5C] dark:text-blue-300">{variantCode}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-[10px] font-mono font-bold">
                          Primary Key
                        </span>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-600 mb-1">اختر منتج المشروع الخاص *</label>
                  <select
                    value={formModelId}
                    onChange={(e) => setFormModelId(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl font-bold outline-none cursor-pointer"
                  >
                    <option value="">-- اختر المنتج الخاص --</option>
                    {products.filter(p => p.productType === 'custom').map(p => (
                      <option key={p.id} value={p.id}>{p.modelName} ({p.projectName || 'مشروع خاص'})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">7. كمية الإنتاج المطلوبة (قطع) *</label>
                  <input
                    type="number"
                    min={1}
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(Number(e.target.value))}
                    className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-mono font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">8. تاريخ خطة الإنتاج *</label>
                  <input
                    type="date"
                    value={formProductionDate}
                    onChange={(e) => setFormProductionDate(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-mono font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">9. المشرف المسؤول عن التشغيل (Supervisor) *</label>
                <input
                  type="text"
                  value={formOperator}
                  onChange={(e) => setFormOperator(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border-main">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  حفظ أمر الإنتاج
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOM MODAL */}
      {isBomModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs text-right animate-fade-in">
          <div className="bg-surface dark:bg-surface-secondary rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-border-main flex flex-col z-[10000]">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-surface border-b border-border-main">
              <h3 className="font-extrabold text-[#0B2D5C] dark:text-text-primary text-sm flex items-center gap-2">
                <BookOpen size={18} className="text-purple-600" />
                <span>{editingBom ? 'تعديل قائمة المواد (BOM)' : 'إنشاء قائمة مواد جديدة (Manufacturing Recipe)'}</span>
              </h3>
              <button 
                onClick={() => setIsBomModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveBom} className="p-6 overflow-y-auto max-h-[75vh] space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">البراند (Brand) *</label>
                  <select
                    value={bomFormBrandId}
                    onChange={(e) => {
                      const newB = e.target.value;
                      setBomFormBrandId(newB);
                      const firstM = models.find(m => m.brandId === newB);
                      setBomFormModelId(firstM?.id || '');
                    }}
                    className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl font-bold outline-none cursor-pointer"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">الموديل المرتبط بالوصفة *</label>
                  <select
                    value={bomFormModelId}
                    onChange={(e) => {
                      const mId = e.target.value;
                      setBomFormModelId(mId);
                      const mObj = models.find(m => m.id === mId);
                      if (mObj) setBomFormName(`وصفة تصنيع موديل ${mObj.name}`);
                    }}
                    className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl font-bold outline-none cursor-pointer"
                  >
                    {models.filter(m => m.brandId === bomFormBrandId).map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">رقم الإصدار (Version) *</label>
                  <input
                    type="text"
                    value={bomFormVersion}
                    onChange={(e) => setBomFormVersion(e.target.value)}
                    placeholder="v1.0"
                    className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl font-mono font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">اسم وصفة التصنيع *</label>
                <input
                  type="text"
                  value={bomFormName}
                  onChange={(e) => setBomFormName(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl font-bold outline-none"
                />
              </div>

              {/* Material Lines Breakdown Table */}
              <div className="border border-border-main rounded-2xl p-4 bg-slate-50 dark:bg-slate-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-[#0B2D5C] dark:text-blue-300">
                    قائمة بنود المواد الخام (Bill of Materials Items)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddMaterialLine}
                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all text-[11px]"
                  >
                    <Plus size={12} />
                    <span>إضافة مادة خام</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {bomFormMaterials.map((mat) => (
                    <div key={mat.id} className="grid grid-cols-12 gap-2 items-center bg-surface p-2 rounded-xl border border-border-main">
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={mat.materialCode}
                          onChange={(e) => handleUpdateMaterialLine(mat.id, 'materialCode', e.target.value)}
                          placeholder="كود المادة"
                          className="w-full h-8 px-2 bg-slate-50 border border-border-main rounded-lg text-[11px] font-mono outline-none font-bold"
                        />
                      </div>
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={mat.materialName}
                          onChange={(e) => handleUpdateMaterialLine(mat.id, 'materialName', e.target.value)}
                          placeholder="اسم المادة الخام"
                          className="w-full h-8 px-2 bg-slate-50 border border-border-main rounded-lg text-[11px] outline-none font-bold"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          step="0.1"
                          value={mat.quantity}
                          onChange={(e) => handleUpdateMaterialLine(mat.id, 'quantity', Number(e.target.value))}
                          placeholder="الكمية"
                          className="w-full h-8 px-2 bg-slate-50 border border-border-main rounded-lg text-[11px] font-mono outline-none font-bold text-center"
                        />
                      </div>
                      <div className="col-span-2">
                        <select
                          value={mat.unit}
                          onChange={(e) => handleUpdateMaterialLine(mat.id, 'unit', e.target.value)}
                          className="w-full h-8 px-1 bg-slate-50 border border-border-main rounded-lg text-[11px] font-bold outline-none cursor-pointer"
                        >
                          <option value="pcs">قطعة (pcs)</option>
                          <option value="m">متر (m)</option>
                          <option value="m2">م² (m2)</option>
                          <option value="kg">كجم (kg)</option>
                          <option value="roll">رول (roll)</option>
                          <option value="set">طقم (set)</option>
                        </select>
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterialLine(mat.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">حالة الوصفة (Status) *</label>
                  <select
                    value={bomFormStatus}
                    onChange={(e) => setBomFormStatus(e.target.value as BomStatus)}
                    className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl font-bold outline-none cursor-pointer"
                  >
                    <option value="Active">نشطة ومفعلة للإنتاج (Active - Single per Model)</option>
                    <option value="Draft">مسودة قيد المراجعة (Draft)</option>
                    <option value="Inactive">غير نشطة (Inactive)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">ملاحظات واعتماد الجودة:</label>
                  <input
                    type="text"
                    value={bomFormNotes}
                    onChange={(e) => setBomFormNotes(e.target.value)}
                    placeholder="معتمدة بموجب مواصفة الجودة ISO-9001"
                    className="w-full h-9 px-3 bg-slate-50 border border-border-main rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border-main">
                <button
                  type="button"
                  onClick={() => setIsBomModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  {editingBom ? 'حفظ تعديلات الوصفة' : 'اعتماد وحفظ وصفة المواد'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER AUDIT LOG MODAL */}
      {viewingAuditsOrder && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs text-right animate-fade-in">
          <div className="bg-surface dark:bg-surface-secondary rounded-3xl w-full max-w-lg p-5 shadow-2xl border border-border-main space-y-4 z-[10000]">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-extrabold text-sm text-[#0B2D5C] dark:text-text-primary">
                سجل تدقيق أمر الإنتاج #{viewingAuditsOrder.productionOrderNumber}
              </h3>
              <button 
                onClick={() => setViewingAuditsOrder(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 text-xs">
              {orderAudits.filter(a => a.productionOrderId === viewingAuditsOrder.id).length === 0 ? (
                <div className="text-center text-slate-400 py-6 font-bold">لا توجد سجلات تدقيق مسجلة لهذا الأمر.</div>
              ) : (
                orderAudits
                  .filter(a => a.productionOrderId === viewingAuditsOrder.id)
                  .map(a => (
                    <div key={a.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-blue-600">{a.action}</span>
                        <span className="text-[10px] font-mono text-slate-400">{new Date(a.timestamp).toLocaleString('ar-EG')}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300">{a.notes || '—'}</div>
                      <div className="text-[10px] text-slate-400">بواسطة: {a.operator}</div>
                    </div>
                  ))
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-border-main">
              <button
                onClick={() => setViewingAuditsOrder(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 cursor-pointer text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Digital Passport Modal */}
      {passportTargetSerial && (
        <ProductDigitalPassportModal
          serialNumberOrCode={passportTargetSerial}
          onClose={() => setPassportTargetSerial(null)}
        />
      )}

    </div>
  );
};
