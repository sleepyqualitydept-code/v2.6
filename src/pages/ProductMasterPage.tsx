import React, { useState, useMemo, useRef } from 'react';
import { 
  Plus, FileSpreadsheet, Search, Edit3, Copy, Power, CheckCircle2, XCircle, 
  ChevronDown, ChevronRight, FolderTree, Table, Maximize2, 
  Minimize2, Box, Layers, ShieldCheck, Ruler, Tag, Eye, Info, AlertCircle,
  Folder, FolderOpen, Activity, BarChart3, Database, Check, RefreshCw,
  Sparkles, Zap, ArrowRight, RotateCcw, CheckSquare, Square
} from 'lucide-react';
import { ErpDatabase } from '../utils/erpDb';
import { DimensionMasterRepository } from '../utils/dimensionRepository';
import { Product, ProductTechnology, Model, Size, CustomDimension } from '../types/erp';

export const ProductMasterPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => ErpDatabase.getProducts());
  // PROMPT-033 PART 6: Exactly 2 sub-tabs (Tree / Table)
  const [viewMode, setViewMode] = useState<'tree' | 'table'>('tree');

  const brands = ErpDatabase.getBrands();
  const categories = ErpDatabase.getCategories();
  const policies = ErpDatabase.getWarrantyPolicies();
  const families = ErpDatabase.getFamilies();
  const models = ErpDatabase.getModels();
  const allStandardDimensions = DimensionMasterRepository.getAllStandardDimensions(); // 39 Standard Dimensions
  const customDimensions = ErpDatabase.getCustomDimensions();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBrand, setFilterBrand] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');

  // Rapid Entry Mode State
  const [rapidEntryMode, setRapidEntryMode] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Tree Expansion State
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    ErpDatabase.getBrands().forEach(b => initial.add(`brand-${b.id}`));
    return initial;
  });

  // Modal / Quick View States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Bulk Product Generator State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkBrandId, setBulkBrandId] = useState<string>('SLP');
  const [bulkFamilyId, setBulkFamilyId] = useState<string>('');
  const [bulkModelId, setBulkModelId] = useState<string>('');
  const [selectedDimensionIds, setSelectedDimensionIds] = useState<Set<string>>(new Set());

  // Form Ref for auto-focusing on Dimension
  const dimensionSelectRef = useRef<HTMLSelectElement | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdDate' | 'updatedDate'>>({
    productType: 'standard',
    projectName: '',
    customerName: '',
    brandId: brands[0]?.id || 'SLP',
    categoryId: 'MAT',
    modelId: '',
    sizeId: '',
    modelName: '',
    manufacturingSystem: 'American',
    technologies: ['Bonnell Spring'],
    width: 0,
    length: 0,
    height: 0,
    warrantyPolicyId: '',
    sapMaterialCode: '',
    internalProductCode: '',
    status: 'active',
    notes: ''
  });

  const [formError, setFormError] = useState<string | null>(null);

  const availableTechnologies: { id: ProductTechnology; name: string }[] = [
    { id: 'Bonnell Spring', name: 'زنبرك بونيل (Bonnell Spring)' },
    { id: 'Pocket Spring', name: 'زنبرك منفصل (Pocket Spring)' },
    { id: 'Foam', name: 'إسفنج عالي الكثافة (Foam)' },
    { id: 'Rebound Foam', name: 'إسفنج ريبوند ضاغط (Rebound Foam)' },
    { id: 'Memory Foam', name: 'إسفنج ذكي (Memory Foam)' },
    { id: 'HR Foam', name: 'إسفنج عالي المرونة (HR Foam)' },
    { id: 'Latex', name: 'لاتكس طبيعي (Latex)' },
    { id: 'Hybrid', name: 'تقنية هجينة (Hybrid)' }
  ];

  // Dynamically resolve dimensions for selected model using DimensionMasterRepository
  const currentAvailableDimensions = useMemo(() => {
    return DimensionMasterRepository.getDimensionsForModel(formData.modelId, formData.brandId);
  }, [formData.modelId, formData.brandId]);

  const toggleTechnology = (tech: ProductTechnology) => {
    const current = formData.technologies || [];
    if (current.includes(tech)) {
      setFormData({ ...formData, technologies: current.filter(t => t !== tech) });
    } else {
      setFormData({ ...formData, technologies: [...current, tech] });
    }
  };

  const handleCascadeChange = (brandId: string, modelId?: string, sizeId?: string) => {
    const brandModels = models.filter(m => m.brandId === brandId);
    const selectedModel = modelId && brandModels.some(m => m.id === modelId)
      ? brandModels.find(m => m.id === modelId)!
      : brandModels[0];

    const modelDimensions = DimensionMasterRepository.getDimensionsForModel(selectedModel?.id, brandId);

    const selectedSize = sizeId && modelDimensions.some(s => s.id === sizeId)
      ? modelDimensions.find(s => s.id === sizeId)!
      : modelDimensions[0];

    // Model Specification Governance: Inherit height, mfg system, policy from Model Master
    const height = selectedModel?.height || 25;
    const mfgSys = selectedModel?.manufacturingSystem || 'American';
    const policyId = selectedModel?.warrantyPolicyId || 'POL-10Y';

    const composedName = selectedModel && selectedSize
      ? `${selectedModel.name} ${selectedSize.displayName}`
      : selectedModel ? selectedModel.name : '';

    setFormData(prev => ({
      ...prev,
      brandId,
      modelId: selectedModel?.id || '',
      sizeId: selectedSize?.id || '',
      modelName: composedName,
      manufacturingSystem: mfgSys,
      warrantyPolicyId: policyId,
      width: selectedSize ? selectedSize.width : 0,
      length: selectedSize ? selectedSize.length : 0,
      height
    }));
  };

  // Filtered Products for Table & Tree View
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.internalProductCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (p.projectName && p.projectName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           (p.customerName && p.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           (p.sapMaterialCode && p.sapMaterialCode.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesBrand = filterBrand === 'All' || p.brandId === filterBrand;
      const matchesCategory = filterCategory === 'All' || p.categoryId === filterCategory;
      const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
      const matchesType = filterType === 'All' || 
                         (filterType === 'standard' && p.productType !== 'custom') || 
                         (filterType === 'custom' && p.productType === 'custom');

      return matchesSearch && matchesBrand && matchesCategory && matchesStatus && matchesType;
    });
  }, [products, searchQuery, filterBrand, filterCategory, filterStatus, filterType]);

  // Tree Expansion Controls
  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  const expandAllNodes = () => {
    const all = new Set<string>();
    brands.forEach(b => {
      all.add(`brand-${b.id}`);
      families.forEach(f => {
        all.add(`brand-${b.id}-fam-${f.id}`);
        models.filter(m => m.brandId === b.id && (!m.familyId || m.familyId === f.id)).forEach(m => {
          all.add(`brand-${b.id}-fam-${f.id}-mod-${m.id}`);
          allStandardDimensions.forEach(d => {
            all.add(`brand-${b.id}-fam-${f.id}-mod-${m.id}-dim-${d.id}`);
          });
        });
      });
    });
    setExpandedNodes(all);
  };

  const collapseAllNodes = () => {
    setExpandedNodes(new Set());
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormError(null);

    const firstBrand = brands[0]?.id || 'SLP';
    const firstModel = models.find(m => m.brandId === firstBrand) || models[0];
    const modelDims = DimensionMasterRepository.getDimensionsForModel(firstModel?.id, firstBrand);
    const firstSize = modelDims[0];

    setIsModalOpen(true);
    setFormData({
      productType: 'standard',
      projectName: '',
      customerName: '',
      brandId: firstBrand,
      categoryId: 'MAT',
      modelId: firstModel?.id || '',
      sizeId: firstSize?.id || '',
      modelName: firstModel && firstSize ? `${firstModel.name} ${firstSize.displayName}` : firstModel?.name || '',
      manufacturingSystem: firstModel?.manufacturingSystem || 'American',
      technologies: ['Bonnell Spring'],
      width: firstSize ? firstSize.width : 0,
      length: firstSize ? firstSize.length : 0,
      height: firstModel?.height || 25,
      warrantyPolicyId: firstModel?.warrantyPolicyId || 'POL-10Y',
      internalProductCode: `PROD-${Date.now().toString().slice(-4)}`,
      sapMaterialCode: '',
      status: 'active',
      notes: ''
    });
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      productType: p.productType || 'standard',
      projectName: p.projectName || '',
      customerName: p.customerName || '',
      brandId: p.brandId,
      categoryId: p.categoryId || 'MAT',
      modelId: p.modelId || '',
      sizeId: p.sizeId || '',
      modelName: p.modelName,
      manufacturingSystem: p.manufacturingSystem,
      technologies: p.technologies || ['Bonnell Spring'],
      width: p.width,
      length: p.length,
      height: p.height,
      warrantyPolicyId: p.warrantyPolicyId,
      sapMaterialCode: p.sapMaterialCode || '',
      internalProductCode: p.internalProductCode,
      status: p.status,
      notes: p.notes || ''
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const executeSaveProduct = (andAddNew: boolean = false): boolean => {
    setFormError(null);

    if (formData.productType === 'standard') {
      if (!formData.brandId || !formData.modelId || !formData.sizeId || !formData.warrantyPolicyId) {
        setFormError('تحذير حوكمة البيانات القياسية: يمنع الحفظ دون تحديد (Brand -> Model -> Size -> Warranty Policy) من الكتالوج المعتمد.');
        return false;
      }
      if (!formData.modelName.trim()) {
        setFormError('يرجى التحقق من تحديد المقاس واسم الموديل.');
        return false;
      }

      // Check for duplicate (Brand + Model + Dimension)
      if (!editingProduct) {
        const duplicate = products.find(p => 
          p.brandId === formData.brandId && 
          p.modelId === formData.modelId && 
          p.width === formData.width && 
          p.length === formData.length
        );
        if (duplicate) {
          setFormError(`هذا المنتج معرف مسبقاً بنفس الأبعاد القياسية (${formData.modelName}). يرجى اختيار مقاس آخر أو تعديل المنتج الحالي.`);
          return false;
        }
      }
    } else {
      if (!formData.brandId || !formData.warrantyPolicyId) {
        setFormError('تحذير حوكمة المشاريع: يمنع حفظ منتج خاص دون تحديد البراند المعتمد وسياسة الضمان.');
        return false;
      }
      if (!formData.projectName?.trim()) {
        setFormError('يرجى كتابة اسم المشروع / المناقصة.');
        return false;
      }
      if (!formData.modelName.trim()) {
        setFormError('يرجى كتابة اسم الموديل الخاص بالمشروع.');
        return false;
      }
    }

    if (editingProduct) {
      const updatedList: Product[] = products.map(p => p.id === editingProduct.id ? {
        ...p,
        ...formData,
        status: formData.status as 'active' | 'inactive',
        updatedDate: new Date().toISOString()
      } : p);
      setProducts(updatedList);
      ErpDatabase.saveProducts(updatedList);
      ErpDatabase.addAuditLog('Product Update', `تحديث بيانات المنتج ${formData.modelName} (${formData.internalProductCode}) بنجاح.`);
      showToast(`تم تحديث المنتج ${formData.modelName} بنجاح`);
    } else {
      const newProduct: Product = {
        ...formData,
        status: formData.status as 'active' | 'inactive',
        id: `PROD-${Date.now()}`,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
      };
      const updatedList: Product[] = [newProduct, ...products];
      setProducts(updatedList);
      ErpDatabase.saveProducts(updatedList);
      ErpDatabase.addAuditLog('Product Creation', `تعريف منتج جديد بالمنظومة ${newProduct.modelName} (${newProduct.internalProductCode}) بنجاح.`);
      showToast(`تم إنشاء وتكويد المنتج ${newProduct.modelName} بنجاح`);
    }

    if (andAddNew || rapidEntryMode) {
      setFormData(prev => ({
        ...prev,
        sizeId: '',
        modelName: '',
        width: 0,
        length: 0,
        internalProductCode: `PROD-${Date.now().toString().slice(-4)}`,
        sapMaterialCode: '',
        notes: ''
      }));
      setEditingProduct(null);
      setTimeout(() => {
        if (dimensionSelectRef.current) {
          dimensionSelectRef.current.focus();
        }
      }, 50);
      return true;
    } else {
      setIsModalOpen(false);
      return true;
    }
  };

  const handleSaveOnly = (e: React.FormEvent) => {
    e.preventDefault();
    executeSaveProduct(false);
  };

  const handleSaveAndAddNew = (e: React.MouseEvent) => {
    e.preventDefault();
    executeSaveProduct(true);
  };

  const handleDuplicate = (p: Product) => {
    const duplicatedProduct: Product = {
      ...p,
      id: `PROD-${Date.now()}`,
      internalProductCode: `${p.internalProductCode}-COPY`,
      modelName: `${p.modelName} (نسخة)`,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };
    const updatedList: Product[] = [duplicatedProduct, ...products];
    setProducts(updatedList);
    ErpDatabase.saveProducts(updatedList);
    ErpDatabase.addAuditLog('Product Duplicate', `نسخ وتكرار المنتج ${p.modelName} إلى ${duplicatedProduct.modelName}.`);
    showToast(`تم إنشاء نسخة جديدة من ${p.modelName}`);
  };

  const handleToggleStatus = (p: Product) => {
    const updatedStatus: 'active' | 'inactive' = p.status === 'active' ? 'inactive' : 'active';
    const updatedList: Product[] = products.map(item => item.id === p.id ? { ...item, status: updatedStatus, updatedDate: new Date().toISOString() } : item);
    setProducts(updatedList);
    ErpDatabase.saveProducts(updatedList);
    ErpDatabase.addAuditLog('Product Status Change', `تغيير حالة المنتج ${p.modelName} إلى ${updatedStatus === 'active' ? 'نشط' : 'غير نشط'}.`);
    showToast(`تم تغيير حالة المنتج إلى ${updatedStatus === 'active' ? 'نشط' : 'غير نشط'}`);
  };

  // Bulk Generation Handlers
  const handleOpenBulkModal = () => {
    const firstBrand = brands[0]?.id || 'SLP';
    const firstFamily = families[0]?.id || '';
    const familyModels = models.filter(m => m.brandId === firstBrand && (!firstFamily || m.familyId === firstFamily));
    const firstModel = familyModels[0]?.id || models[0]?.id || '';

    setBulkBrandId(firstBrand);
    setBulkFamilyId(firstFamily);
    setBulkModelId(firstModel);

    const existingDims = new Set(
      products
        .filter(p => p.brandId === firstBrand && p.modelId === firstModel)
        .map(p => `DIM-${p.width}-${p.length}`)
    );
    const initialSelected = new Set<string>();
    allStandardDimensions.forEach(d => {
      if (!existingDims.has(d.id)) {
        initialSelected.add(d.id);
      }
    });
    setSelectedDimensionIds(initialSelected);
    setIsBulkModalOpen(true);
  };

  const handleBulkBrandChange = (brandId: string) => {
    setBulkBrandId(brandId);
    const firstFamily = families[0]?.id || '';
    setBulkFamilyId(firstFamily);
    const familyModels = models.filter(m => m.brandId === brandId && (!firstFamily || m.familyId === firstFamily));
    const firstModel = familyModels[0]?.id || '';
    setBulkModelId(firstModel);

    const existingDims = new Set(
      products
        .filter(p => p.brandId === brandId && p.modelId === firstModel)
        .map(p => `DIM-${p.width}-${p.length}`)
    );
    const nextSelected = new Set<string>();
    allStandardDimensions.forEach(d => {
      if (!existingDims.has(d.id)) nextSelected.add(d.id);
    });
    setSelectedDimensionIds(nextSelected);
  };

  const handleBulkModelChange = (modelId: string) => {
    setBulkModelId(modelId);
    const existingDims = new Set(
      products
        .filter(p => p.brandId === bulkBrandId && p.modelId === modelId)
        .map(p => `DIM-${p.width}-${p.length}`)
    );
    const nextSelected = new Set<string>();
    allStandardDimensions.forEach(d => {
      if (!existingDims.has(d.id)) nextSelected.add(d.id);
    });
    setSelectedDimensionIds(nextSelected);
  };

  const handleExecuteBulkGeneration = () => {
    if (!bulkBrandId || !bulkModelId) {
      showToast('يرجى اختيار الماركة والموديل أولاً', 'error');
      return;
    }

    const targetModel = models.find(m => m.id === bulkModelId);
    if (!targetModel) {
      showToast('الموديل المحدد غير موجود', 'error');
      return;
    }

    let createdCount = 0;
    let skippedCount = 0;
    const newProducts: Product[] = [];

    const existingKeySet = new Set(
      products
        .filter(p => p.brandId === bulkBrandId && p.modelId === bulkModelId)
        .map(p => `${p.brandId}-${p.modelId}-${p.width}-${p.length}`)
    );

    allStandardDimensions.forEach(dim => {
      if (selectedDimensionIds.has(dim.id)) {
        const key = `${bulkBrandId}-${bulkModelId}-${dim.width}-${dim.length}`;
        if (existingKeySet.has(key)) {
          skippedCount++;
        } else {
          createdCount++;
          const codeSuffix = `${targetModel.id.replace('MOD-', '')}${dim.width}X${dim.length}`;
          newProducts.push({
            id: `PROD-${Date.now()}-${createdCount}`,
            productType: 'standard',
            brandId: bulkBrandId,
            categoryId: 'MAT',
            modelId: targetModel.id,
            sizeId: dim.id,
            modelName: `${targetModel.name} ${dim.displayName}`,
            manufacturingSystem: targetModel.manufacturingSystem || 'American',
            technologies: ['Bonnell Spring'],
            width: dim.width,
            length: dim.length,
            height: targetModel.height || 25,
            warrantyPolicyId: targetModel.warrantyPolicyId || 'POL-10Y',
            internalProductCode: `${bulkBrandId}-MAT-${codeSuffix}`,
            status: 'active',
            createdDate: new Date().toISOString(),
            updatedDate: new Date().toISOString()
          });
        }
      }
    });

    if (createdCount === 0) {
      showToast(`لم يتم إنشاء منتجات جديدة (تم تخطي ${skippedCount} منتج مكرر بالفعل)`, 'info');
      setIsBulkModalOpen(false);
      return;
    }

    const updatedList = [...newProducts, ...products];
    setProducts(updatedList);
    ErpDatabase.saveProducts(updatedList);

    ErpDatabase.addAuditLog(
      'Bulk Product Generation',
      `توليد جماعي لمنتجات الموديل ${targetModel.name} (${targetModel.id}): تم إنشاء ${createdCount} منتج جديد، وتخطي ${skippedCount} منتج موجود مسبقاً.`
    );

    showToast(`تم بنجاح إنشاء ${createdCount} منتج وتخطي ${skippedCount} منتج مكرر للموديل ${targetModel.name}`);
    setIsBulkModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['Type', 'Brand', 'Model Name', 'Width', 'Length', 'Height', 'Technologies', 'Manufacturing System', 'Warranty Policy', 'SAP Code', 'Internal Code', 'Status'];
    const rows = filteredProducts.map(p => [
      p.productType || 'standard',
      brands.find(b => b.id === p.brandId)?.name || p.brandId,
      `"${p.modelName}"`,
      p.width,
      p.length,
      p.height,
      `"${(p.technologies || []).join('; ')}"`,
      p.manufacturingSystem,
      policies.find(pol => pol.id === p.warrantyPolicyId)?.name || p.warrantyPolicyId,
      p.sapMaterialCode || '',
      p.internalProductCode,
      p.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sleepee_product_structure_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    ErpDatabase.addAuditLog('Export', `تصدير بيانات مستكشف المنتجات إلى CSV.`);
    showToast('تم تصدير هيكل المنتجات إلى ملف CSV بنجاح');
  };

  // Dimension Metrics Calculation (PROMPT-034 PART 8: Embedded Dimension Governance)
  const governanceMetrics = useMemo(() => {
    const totalStd = allStandardDimensions.length || 39; // 39 Official Standard Dimensions
    const usedStandardDimIds = new Set(
      products.filter(p => p.productType !== 'custom' && p.status === 'active').map(p => p.sizeId)
    );
    const usedDimensionsCount = usedStandardDimIds.size;
    const unusedDimensionsCount = Math.max(0, totalStd - usedDimensionsCount);
    const coveragePercent = Math.round((usedDimensionsCount / totalStd) * 100);

    return {
      totalStd,
      usedDimensionsCount,
      unusedDimensionsCount,
      coveragePercent
    };
  }, [allStandardDimensions, products]);

  return (
    <div className="space-y-5 text-right font-sans">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between shadow-md animate-fade-in ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
          toast.type === 'error' ? 'bg-rose-50 text-rose-800 border-rose-200' :
          'bg-blue-50 text-blue-800 border-blue-200'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' && <CheckCircle2 size={16} className="text-emerald-600" />}
            {toast.type === 'error' && <AlertCircle size={16} className="text-rose-600" />}
            {toast.type === 'info' && <Activity size={16} className="text-blue-600" />}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-xs opacity-70 hover:opacity-100">&times;</button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* PROMPT-033 PART 6: SINGLE HEADER & SUBTABS                           */}
      {/* العنوان الرئيسي فقط: "هيكل المنتجات وإدارة الأبعاد"                      */}
      {/* التبويبات الفرعية مباشرة: مستكشف الهيكل | جدول المنتجات                 */}
      {/* PROMPT-033 PART 7: CONSOLIDATED TOOLBAR BUTTONS ONLY                 */}
      {/* [إضافة منتج جديد] [إنشاء منتجات متعددة] [تصدير CSV]                     */}
      {/* ==================================================================== */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border-main pb-4">
        <div>
          <h2 className="text-lg font-black text-[#0B2D5C] dark:text-text-primary flex items-center gap-2">
            <Layers size={22} className="text-blue-600" />
            <span>كتالوج المنتجات الصناعية (Industrial Product Catalog)</span>
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            التسلسل الهيكلي الصناعي المعتمد: العلامة التجارية (Brand) ← عائلة المنتج (Product Family) ← الموديل (Model) ← المتغير الصناعي (Product Variant).
          </p>
        </div>

        {/* PROMPT-033 PART 7: Consolidated Action Buttons (3 buttons only) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Button 1: Add New Product */}
          <button 
            id="btn-add-product-master"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-gradient-to-r from-[#0B2D5C] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#0B2D5C] text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus size={15} />
            <span>إضافة منتج جديد</span>
          </button>

          {/* Button 2: Bulk Product Generator */}
          <button 
            id="btn-bulk-product-master"
            onClick={handleOpenBulkModal}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            title="إنشاء منتجات متعددة لجميع المقاسات دفعة واحدة"
          >
            <Sparkles size={15} />
            <span>إنشاء منتجات متعددة</span>
          </button>
          
          {/* Button 3: Export CSV */}
          <button 
            id="btn-export-csv-master"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-surface border border-border-main hover:bg-slate-50 dark:hover:bg-slate-800 text-[#0B2D5C] dark:text-blue-400 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <FileSpreadsheet size={15} />
            <span>تصدير CSV</span>
          </button>
        </div>
      </div>

      {/* Subtabs directly under header: مستكشف الهيكل | جدول المنتجات */}
      <div className="flex items-center justify-between border-b border-border-main pb-2">
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-border-main">
          <button
            type="button"
            onClick={() => setViewMode('tree')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'tree'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FolderTree size={14} />
            <span>مستكشف الهيكل (Tree)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Table size={14} />
            <span>جدول المنتجات (Grid)</span>
          </button>
        </div>

        {/* Integrated Dimension Governance Metrics (PROMPT-034 PART 8: Total, Used, Unused, Coverage %) */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono">
          <div className="px-2.5 py-1 bg-slate-50 dark:bg-slate-900 rounded-lg border border-border-main text-slate-600 dark:text-slate-300">
            <span className="text-slate-400 font-bold ml-1">إجمالي المقاسات القياسية:</span>
            <span className="font-bold text-blue-600">{governanceMetrics.totalStd}</span>
          </div>
          <div className="px-2.5 py-1 bg-slate-50 dark:bg-slate-900 rounded-lg border border-border-main text-slate-600 dark:text-slate-300">
            <span className="text-slate-400 font-bold ml-1">المستخدمة:</span>
            <span className="font-bold text-emerald-600">{governanceMetrics.usedDimensionsCount}</span>
          </div>
          <div className="px-2.5 py-1 bg-slate-50 dark:bg-slate-900 rounded-lg border border-border-main text-slate-600 dark:text-slate-300">
            <span className="text-slate-400 font-bold ml-1">غير المستخدمة:</span>
            <span className="font-bold text-amber-600">{governanceMetrics.unusedDimensionsCount}</span>
          </div>
          <div className="px-2.5 py-1 bg-slate-50 dark:bg-slate-900 rounded-lg border border-border-main text-slate-600 dark:text-slate-300">
            <span className="text-slate-400 font-bold ml-1">نسبة التغطية:</span>
            <span className="font-bold text-indigo-600">{governanceMetrics.coveragePercent}%</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar (Visible in Tree and Grid Mode) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-slate-50 dark:bg-surface border border-border-main p-3.5 rounded-2xl">
        <div className="relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم، الكود، SAP، أو المشروع..."
            className="w-full h-9 pr-9 pl-3 bg-surface border border-border-main rounded-xl text-xs outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="w-full h-9 px-3 bg-surface border border-border-main rounded-xl text-xs font-bold outline-none cursor-pointer"
          >
            <option value="All">جميع العلامات التجارية (Brands)</option>
            {brands.map(b => (
              <option key={b.id} value={b.id}>{b.name} ({b.id})</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full h-9 px-3 bg-surface border border-border-main rounded-xl text-xs font-bold outline-none cursor-pointer"
          >
            <option value="All">جميع الفئات (Categories)</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full h-9 px-3 bg-surface border border-border-main rounded-xl text-xs font-bold outline-none cursor-pointer"
          >
            <option value="All">جميع الأنواع (قياسي / خاص)</option>
            <option value="standard">الكتالوج القياسي (Standard)</option>
            <option value="custom">مشاريع خاصة ومناقصات (Custom)</option>
          </select>
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full h-9 px-3 bg-surface border border-border-main rounded-xl text-xs font-bold outline-none cursor-pointer"
          >
            <option value="All">جميع الحالات (Active / Inactive)</option>
            <option value="active">نشط فقط (Active)</option>
            <option value="inactive">معطل فقط (Inactive)</option>
          </select>
        </div>
      </div>

      {/* MODE 1: TREE STRUCTURE EXPLORER */}
      {viewMode === 'tree' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between px-2">
            <div className="text-xs text-text-secondary font-bold flex items-center gap-2">
              <span>الهيكل الشجري: البراند ← العائلة ← الموديل ← الأبعاد الـ 39 القياسية ← المنتجات المعرفة</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={expandAllNodes}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <Maximize2 size={12} />
                <span>توسيع الكل</span>
              </button>
              <button
                onClick={collapseAllNodes}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <Minimize2 size={12} />
                <span>طي الكل</span>
              </button>
            </div>
          </div>

          {/* Hierarchical Tree Container */}
          <div className="border border-border-main bg-surface rounded-2xl p-4 space-y-3">
            {brands
              .filter(b => filterBrand === 'All' || b.id === filterBrand)
              .map(brand => {
                const brandNodeId = `brand-${brand.id}`;
                const isBrandExpanded = expandedNodes.has(brandNodeId);
                const brandFamilies = families;
                const brandProducts = products.filter(p => p.brandId === brand.id);

                return (
                  <div key={brand.id} className="border border-border-main rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/40">
                    {/* Level 1: Brand Node */}
                    <div 
                      onClick={() => toggleNode(brandNodeId)}
                      className="p-3 bg-slate-100/80 dark:bg-slate-800/60 flex items-center justify-between cursor-pointer hover:bg-slate-200/60 transition-all select-none"
                    >
                      <div className="flex items-center gap-2">
                        {isBrandExpanded ? <ChevronDown size={18} className="text-blue-600" /> : <ChevronRight size={18} className="text-slate-400 rtl:rotate-180" />}
                        <FolderOpen size={18} className="text-[#0B2D5C] dark:text-blue-400" />
                        <span className="font-extrabold text-sm text-[#0B2D5C] dark:text-blue-300">
                          {brand.name} ({brand.id})
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 rounded-full font-bold">
                          بادئة: {brand.serialPrefix}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-slate-500 font-bold">
                        {brandProducts.length} منتج مسجل
                      </div>
                    </div>

                    {/* Level 2: Families under Brand */}
                    {isBrandExpanded && (
                      <div className="p-3 space-y-3 border-t border-border-main">
                        {brandFamilies.map(fam => {
                          const famNodeId = `brand-${brand.id}-fam-${fam.id}`;
                          const isFamExpanded = expandedNodes.has(famNodeId);
                          const famModels = models.filter(m => m.brandId === brand.id && (!m.familyId || m.familyId === fam.id));
                          const famProducts = products.filter(p => p.brandId === brand.id && famModels.some(m => m.id === p.modelId));

                          return (
                            <div key={fam.id} className="border border-border-main rounded-xl overflow-hidden bg-surface">
                              {/* Family Header */}
                              <div 
                                onClick={() => toggleNode(famNodeId)}
                                className="p-2.5 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-all select-none"
                              >
                                <div className="flex items-center gap-2">
                                  {isFamExpanded ? <ChevronDown size={16} className="text-purple-600" /> : <ChevronRight size={16} className="text-slate-400 rtl:rotate-180" />}
                                  <Layers size={16} className="text-purple-600" />
                                  <span className="font-bold text-xs text-text-primary">
                                    عائلة: {fam.nameAr} ({fam.code})
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-normal">
                                    • {fam.nameEn}
                                  </span>
                                </div>
                                <span className="text-[11px] font-mono text-purple-600 font-bold">
                                  {famModels.length} موديل
                                </span>
                              </div>

                              {/* Level 3: Models under Family */}
                              {isFamExpanded && (
                                <div className="p-3 space-y-2.5 border-t border-border-main">
                                  {famModels.map(model => {
                                    const modelNodeId = `brand-${brand.id}-fam-${fam.id}-mod-${model.id}`;
                                    const isModelExpanded = expandedNodes.has(modelNodeId);
                                    const modelProducts = products.filter(p => p.brandId === brand.id && p.modelId === model.id);
                                    const modelDimensions = DimensionMasterRepository.getDimensionsForModel(model.id, brand.id);

                                    return (
                                      <div key={model.id} className="border border-border-main rounded-lg overflow-hidden bg-slate-50/40 dark:bg-slate-900/30">
                                        {/* Model Header */}
                                        <div 
                                          onClick={() => toggleNode(modelNodeId)}
                                          className="p-2 bg-slate-100/60 dark:bg-slate-800/30 flex items-center justify-between cursor-pointer hover:bg-slate-200/50 transition-all select-none"
                                        >
                                          <div className="flex items-center gap-2">
                                            {isModelExpanded ? <ChevronDown size={14} className="text-emerald-600" /> : <ChevronRight size={14} className="text-slate-400 rtl:rotate-180" />}
                                            <Box size={14} className="text-emerald-600" />
                                            <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                                              موديل: {model.name}
                                            </span>
                                            <span className="text-[10px] font-mono text-slate-500">
                                              ({model.id}) • ارتفاع {model.height} سم • {model.manufacturingSystem}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded font-mono font-bold">
                                              {modelProducts.length} / 39 بعد معرف
                                            </span>
                                          </div>
                                        </div>

                                        {/* Level 4: 39 Standard Dimensions under Model */}
                                        {isModelExpanded && (
                                          <div className="p-3 space-y-1.5 border-t border-border-main">
                                            <div className="text-[10px] font-bold text-slate-400 pb-1 flex items-center justify-between">
                                              <span>الأبعاد القياسية الـ 39 المعتمدة للموديل:</span>
                                              <span className="font-mono text-blue-600">Standard Widths: 80-200 | Lengths: 190, 195, 200</span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                              {modelDimensions.map(dim => {
                                                const assignedProd = modelProducts.find(p => p.width === dim.width && p.length === dim.length);
                                                const isAssigned = !!assignedProd;

                                                return (
                                                  <div 
                                                    key={dim.id}
                                                    className={`p-2 rounded-xl border text-xs flex items-center justify-between transition-all ${
                                                      isAssigned
                                                        ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 text-emerald-900 dark:text-emerald-200'
                                                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500'
                                                    }`}
                                                  >
                                                    <div className="flex items-center gap-1.5">
                                                      <Ruler size={13} className={isAssigned ? 'text-emerald-600' : 'text-slate-400'} />
                                                      <span className="font-mono font-bold">
                                                        {dim.displayName}
                                                      </span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5">
                                                      {isAssigned ? (
                                                        <>
                                                          <span className="px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 text-[9px] font-black">
                                                            ACTIVE
                                                          </span>
                                                          <button
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              setQuickViewProduct(assignedProd);
                                                            }}
                                                            title="عرض بطاقة المنتج"
                                                            className="p-1 hover:bg-emerald-200/50 rounded text-emerald-700 cursor-pointer"
                                                          >
                                                            <Eye size={12} />
                                                          </button>
                                                          <button
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              handleOpenEdit(assignedProd);
                                                            }}
                                                            title="تعديل المنتج"
                                                            className="p-1 hover:bg-emerald-200/50 rounded text-amber-700 cursor-pointer"
                                                          >
                                                            <Edit3 size={12} />
                                                          </button>
                                                        </>
                                                      ) : (
                                                        <>
                                                          <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 text-[9px] font-bold">
                                                            UNUSED
                                                          </span>
                                                          <button
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              handleCascadeChange(brand.id, model.id, dim.id);
                                                              setIsModalOpen(true);
                                                            }}
                                                            title="تكويد هذا المقاس الآن"
                                                            className="p-1 hover:bg-blue-100 text-blue-600 rounded cursor-pointer"
                                                          >
                                                            <Plus size={12} />
                                                          </button>
                                                        </>
                                                      )}
                                                    </div>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* MODE 2: TABLE GRID VIEW */}
      {viewMode === 'table' && (
        <div className="border border-border-main bg-surface rounded-2xl overflow-hidden overflow-x-auto shadow-2xs animate-fade-in">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100/70 dark:bg-surface text-text-secondary font-extrabold border-b border-border-main">
              <tr>
                <th className="p-3.5">النوع</th>
                <th className="p-3.5">البراند</th>
                <th className="p-3.5">اسم الموديل والمقاس</th>
                <th className="p-3.5 text-center">العرض</th>
                <th className="p-3.5 text-center">الطول</th>
                <th className="p-3.5 text-center">الارتفاع</th>
                <th className="p-3.5">التقنيات</th>
                <th className="p-3.5">نظام التصنيع</th>
                <th className="p-3.5 text-center">سياسة الضمان</th>
                <th className="p-3.5">كود SAP</th>
                <th className="p-3.5">الكود الداخلي</th>
                <th className="p-3.5 text-center">الحالة</th>
                <th className="p-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main font-semibold text-text-primary">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={13} className="p-10 text-center text-slate-400 font-bold">
                    لا توجد منتجات مسجلة تطابق محددات الفلترة الحالية.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => {
                  const modelObj = models.find(m => m.id === p.modelId);
                  const effectiveHeight = p.height || modelObj?.height || 25;
                  const effectiveMfgSys = p.manufacturingSystem || modelObj?.manufacturingSystem || 'American';
                  const effectivePolicyId = p.warrantyPolicyId || modelObj?.warrantyPolicyId || 'POL-10Y';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                      <td className="py-2 px-3.5 whitespace-nowrap">
                        {p.productType === 'custom' ? (
                          <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-black">
                            خاص / مشروع
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black">
                            قياسي
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3.5 whitespace-nowrap">
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono font-bold text-[#0B2D5C] dark:text-blue-300">
                          {brands.find(b => b.id === p.brandId)?.name || p.brandId}
                        </span>
                      </td>
                      <td className="py-2 px-3.5 min-w-[160px] font-extrabold text-text-primary">
                        <div>{p.modelName}</div>
                        {p.projectName && (
                          <div className="text-[10px] text-purple-600 font-normal mt-0.5">
                            مشروع: {p.projectName} {p.customerName ? `(${p.customerName})` : ''}
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-3.5 whitespace-nowrap text-center font-mono font-bold text-slate-700 dark:text-slate-200">
                        {p.width}
                      </td>
                      <td className="py-2 px-3.5 whitespace-nowrap text-center font-mono font-bold text-slate-700 dark:text-slate-200">
                        {p.length}
                      </td>
                      <td className="py-2 px-3.5 whitespace-nowrap text-center font-mono font-bold text-blue-600 dark:text-blue-400">
                        {effectiveHeight}
                      </td>
                      <td className="py-2 px-3.5 max-w-[160px]">
                        <div className="flex flex-wrap gap-1">
                          {(p.technologies && p.technologies.length > 0 ? p.technologies : ['Bonnell Spring']).map((tech, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-[9px] rounded font-mono text-slate-600 dark:text-slate-300">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2 px-3.5 whitespace-nowrap text-slate-500">
                        {effectiveMfgSys}
                      </td>
                      <td className="py-2 px-3.5 whitespace-nowrap text-center text-blue-600 dark:text-blue-400 font-bold">
                        {policies.find(pol => pol.id === effectivePolicyId)?.name || effectivePolicyId}
                      </td>
                      <td className="py-2 px-3.5 whitespace-nowrap font-mono text-slate-400">
                        {p.sapMaterialCode || '—'}
                      </td>
                      <td className="py-2 px-3.5 whitespace-nowrap font-mono">
                        {p.internalProductCode}
                      </td>
                      <td className="py-2 px-3.5 whitespace-nowrap text-center">
                        <div className="flex justify-center">
                          {p.status === 'active' ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black flex items-center gap-1">
                              <CheckCircle2 size={11} />
                              <span>نشط</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-black flex items-center gap-1">
                              <XCircle size={11} />
                              <span>معطل</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-3.5 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => handleOpenEdit(p)}
                            title="تعديل"
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-lg transition-all cursor-pointer"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button 
                            onClick={() => handleDuplicate(p)}
                            title="نسخ وتكرار"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg transition-all cursor-pointer"
                          >
                            <Copy size={15} />
                          </button>
                          <button 
                            onClick={() => handleToggleStatus(p)}
                            title={p.status === 'active' ? 'تعطيل' : 'تفعيل'}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                              p.status === 'active' 
                                ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20' 
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                            }`}
                          >
                            <Power size={15} />
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
      )}

      {/* QUICK VIEW DRAWER/MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs text-right animate-fade-in">
          <div className="bg-surface dark:bg-surface-secondary rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-border-main space-y-4 z-[10000]">
            <div className="flex items-center justify-between border-b border-border-main pb-3">
              <div className="flex items-center gap-2 text-[#0B2D5C] dark:text-blue-300 font-extrabold">
                <Info size={18} />
                <span>بطاقة مواصفات المنتج القياسية</span>
              </div>
              <button 
                onClick={() => setQuickViewProduct(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border-main space-y-1">
                <div className="text-slate-400 font-bold">اسم المنتج والموديل</div>
                <div className="text-sm font-black text-slate-900 dark:text-slate-100">{quickViewProduct.modelName}</div>
                <div className="font-mono text-blue-600 text-[11px]">{quickViewProduct.internalProductCode}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main">
                  <div className="text-slate-400 font-bold">البراند</div>
                  <div className="font-extrabold text-slate-800 dark:text-slate-200">
                    {brands.find(b => b.id === quickViewProduct.brandId)?.name || quickViewProduct.brandId}
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main">
                  <div className="text-slate-400 font-bold">الأبعاد المصنعية</div>
                  <div className="font-mono font-black text-slate-800 dark:text-slate-200">
                    {quickViewProduct.width} × {quickViewProduct.length} × {quickViewProduct.height} cm
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main">
                  <div className="text-slate-400 font-bold">نظام التصنيع</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{quickViewProduct.manufacturingSystem}</div>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main">
                  <div className="text-slate-400 font-bold">سياسة الضمان</div>
                  <div className="font-semibold text-blue-600">{policies.find(pol => pol.id === quickViewProduct.warrantyPolicyId)?.name || quickViewProduct.warrantyPolicyId}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-border-main">
              <button
                onClick={() => setQuickViewProduct(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-200 cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK PRODUCT GENERATOR MODAL */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs text-right animate-fade-in">
          <div className="bg-surface dark:bg-surface-secondary rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-border-main flex flex-col z-[10000]">
            
            <div className="flex items-center justify-between px-6 py-4 bg-purple-50/80 dark:bg-purple-950/40 border-b border-border-main">
              <div className="flex items-center gap-2 text-purple-900 dark:text-purple-300">
                <Sparkles size={18} className="text-purple-600" />
                <h3 className="font-extrabold text-sm">
                  المولد الجماعي للمنتجات القياسية (Bulk Product Generator)
                </h3>
              </div>
              <button 
                onClick={() => setIsBulkModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[75vh] space-y-5">
              {/* Step 1: Select Brand, Family, Model */}
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-border-main space-y-3">
                <div className="font-black text-xs text-[#0B2D5C] dark:text-blue-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                  <span>تحديد الماركة والعائلة والموديل المستهدف:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-bold mb-1">الماركة (Brand) *</label>
                    <select
                      value={bulkBrandId}
                      onChange={(e) => handleBulkBrandChange(e.target.value)}
                      className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl text-xs font-bold outline-none cursor-pointer"
                    >
                      {brands.map(b => (
                        <option key={b.id} value={b.id}>{b.name} ({b.id})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">العائلة (Family)</label>
                    <select
                      value={bulkFamilyId}
                      onChange={(e) => {
                        setBulkFamilyId(e.target.value);
                        const familyModels = models.filter(m => m.brandId === bulkBrandId && (!e.target.value || m.familyId === e.target.value));
                        handleBulkModelChange(familyModels[0]?.id || '');
                      }}
                      className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl text-xs font-bold outline-none cursor-pointer"
                    >
                      <option value="">جميع العائلات</option>
                      {families.map(f => (
                        <option key={f.id} value={f.id}>{f.nameAr} ({f.code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">الموديل (Model Master) *</label>
                    <select
                      value={bulkModelId}
                      onChange={(e) => handleBulkModelChange(e.target.value)}
                      className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl text-xs font-bold outline-none cursor-pointer"
                    >
                      {models
                        .filter(m => m.brandId === bulkBrandId && (!bulkFamilyId || m.familyId === bulkFamilyId))
                        .map(m => (
                          <option key={m.id} value={m.id}>{m.name} ({m.id})</option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Dimension Selector */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-main pb-2">
                  <div className="font-black text-xs text-[#0B2D5C] dark:text-blue-400 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
                    <span>اختيار المقاسات القياسية الـ 39 المراد توليدها:</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const all = new Set<string>();
                        allStandardDimensions.forEach(d => all.add(d.id));
                        setSelectedDimensionIds(all);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      تحديد الكل (39)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const existingDims = new Set(
                          products
                            .filter(p => p.brandId === bulkBrandId && p.modelId === bulkModelId)
                            .map(p => `DIM-${p.width}-${p.length}`)
                        );
                        const next = new Set<string>();
                        allStandardDimensions.forEach(d => {
                          if (!existingDims.has(d.id)) next.add(d.id);
                        });
                        setSelectedDimensionIds(next);
                      }}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      تحديد الشاغرة فقط
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDimensionIds(new Set())}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      إلغاء التحديد
                    </button>
                  </div>
                </div>

                {/* 39 Dimensions Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
                  {allStandardDimensions.map(dim => {
                    const alreadyExists = products.some(
                      p => p.brandId === bulkBrandId && p.modelId === bulkModelId && p.width === dim.width && p.length === dim.length
                    );
                    const isSelected = selectedDimensionIds.has(dim.id);

                    return (
                      <div
                        key={dim.id}
                        onClick={() => {
                          setSelectedDimensionIds(prev => {
                            const next = new Set(prev);
                            if (next.has(dim.id)) next.delete(dim.id);
                            else next.add(dim.id);
                            return next;
                          });
                        }}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all select-none ${
                          isSelected
                            ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-400 text-purple-900 dark:text-purple-200 font-bold'
                            : 'bg-surface border-border-main text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-mono">
                          {isSelected ? <CheckSquare size={14} className="text-purple-600" /> : <Square size={14} className="text-slate-300" />}
                          <span>{dim.displayName}</span>
                        </div>

                        {alreadyExists ? (
                          <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold">
                            موجود
                          </span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded">
                            متاح
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Safety & Summary */}
              <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-2xl text-xs space-y-1">
                <div className="font-extrabold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-blue-600" />
                  <span>ضمان حوكمة التوليد ومنع التكرار (Duplicate Safety Engine):</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  سيقوم النظام تلقائياً بتوليد المنتجات الشاغرة فقط وتخطي أي مقاس موجود مسبقاً لهذا الموديل لضمان عدم وجود سيريالات أو منتجات مكررة بالماستر داتا.
                </p>
                <div className="font-mono font-bold text-[#0B2D5C] dark:text-blue-200 pt-1">
                  • عدد المقاسات المختارة: {selectedDimensionIds.size} من 39 مقاس قياسي
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-main">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-all"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleExecuteBulkGeneration}
                  disabled={selectedDimensionIds.size === 0}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Sparkles size={14} />
                  <span>توليد المنتجات المختارة ({selectedDimensionIds.size})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/30 backdrop-blur-xs text-right animate-fade-in">
          <div className="bg-surface dark:bg-surface-secondary rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-border-main flex flex-col z-[10000]">
            
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-surface border-b border-border-main">
              <div className="flex items-center gap-3">
                <h3 className="font-extrabold text-[#0B2D5C] dark:text-text-primary text-sm sm:text-base">
                  {editingProduct ? 'تعديل بيانات المنتج' : 'تعريف منتج جديد بالمنظومة'}
                </h3>
                {!editingProduct && (
                  <button
                    type="button"
                    onClick={() => setRapidEntryMode(!rapidEntryMode)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                      rapidEntryMode 
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    <Zap size={11} className={rapidEntryMode ? 'text-amber-600 fill-amber-500' : 'text-slate-400'} />
                    <span>{rapidEntryMode ? 'الوضع السريع: مفعل' : 'الوضع السريع: معطل'}</span>
                  </button>
                )}
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveOnly} className="p-6 overflow-y-auto max-h-[70vh] space-y-5">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 animate-shake">
                  <XCircle size={14} className="shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Product Type Selector */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-border-main p-3.5 rounded-2xl space-y-2">
                <label className="block text-xs font-black text-[#0B2D5C] dark:text-blue-400">تصنيف المنتج (Product Classification) *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, productType: 'standard', modelId: '', sizeId: '', modelName: '' }))}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      formData.productType === 'standard'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-surface text-text-primary border-border-main hover:bg-slate-100'
                    }`}
                  >
                    <span>○ منتج قياسي (Standard Catalog)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, productType: 'custom', modelId: 'CUSTOM', sizeId: 'CUSTOM', modelName: '' }))}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      formData.productType === 'custom'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-surface text-text-primary border-border-main hover:bg-slate-100'
                    }`}
                  >
                    <span>○ منتج خاص / مناقصات (Custom Project)</span>
                  </button>
                </div>
              </div>

              {/* Conditional Form Fields */}
              {formData.productType === 'standard' ? (
                /* Standard Product Workflow */
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-blue-600 border-b border-blue-100 pb-1.5">بيانات الماستر داتا القياسية (Standard Catalog Master)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1">البراند (Brand) *</label>
                      <select
                        value={formData.brandId}
                        onChange={(e) => handleCascadeChange(e.target.value)}
                        className="w-full h-10 px-3 bg-slate-50 border border-border-main rounded-xl text-xs outline-none focus:border-blue-600 cursor-pointer text-text-primary"
                      >
                        <option value="">اختر البراند...</option>
                        {brands.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">الفئة (Category) *</label>
                      <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        className="w-full h-10 px-3 bg-slate-50 border border-border-main rounded-xl text-xs outline-none focus:border-blue-600 cursor-pointer text-text-primary"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1">الموديل (Model Master) *</label>
                      <select
                        value={formData.modelId || ''}
                        onChange={(e) => handleCascadeChange(formData.brandId, e.target.value)}
                        className="w-full h-10 px-3 bg-slate-50 border border-border-main rounded-xl text-xs outline-none focus:border-blue-600 cursor-pointer text-text-primary"
                      >
                        <option value="">اختر الموديل القياسي...</option>
                        {models.filter(m => m.brandId === formData.brandId).map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1">المقاس القياسي (Standard Dimension - 39 Dimensions) *</label>
                      <select
                        ref={dimensionSelectRef}
                        value={formData.sizeId || ''}
                        onChange={(e) => handleCascadeChange(formData.brandId, formData.modelId, e.target.value)}
                        className="w-full h-10 px-3 bg-slate-50 border border-border-main rounded-xl text-xs outline-none focus:border-blue-600 cursor-pointer text-text-primary font-mono font-bold"
                      >
                        {currentAvailableDimensions.length === 0 ? (
                          <option value="" disabled>خطأ في ربط المقاسات القياسية بالموديل</option>
                        ) : (
                          <>
                            <option value="">اختر المقاس المصنعي (39 بعد قياسي)...</option>
                            {currentAvailableDimensions.map(s => (
                              <option key={s.id} value={s.id}>{s.displayName} (عرض {s.width} × طول {s.length} سم)</option>
                            ))}
                          </>
                        )}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold mb-1">الاسم المركب القياسي (Catalog Name)</label>
                      <input
                        type="text"
                        disabled
                        value={formData.modelName}
                        placeholder="يتم تركيبه آلياً من الموديل والمقاس..."
                        className="w-full h-10 px-3 bg-slate-100 border border-border-main rounded-xl text-xs outline-none text-slate-600 font-bold"
                      />
                    </div>
                  </div>

                  {/* Standard Dimensions (Read-Only) */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold mb-1">العرض (cm)</label>
                      <input
                        type="number"
                        disabled
                        value={formData.width}
                        className="w-full h-10 px-3 bg-slate-100 border border-border-main rounded-xl text-xs outline-none text-slate-600 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">الطول (cm)</label>
                      <input
                        type="number"
                        disabled
                        value={formData.length}
                        className="w-full h-10 px-3 bg-slate-100 border border-border-main rounded-xl text-xs outline-none text-slate-600 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">الارتفاع (cm)</label>
                      <input
                        type="number"
                        disabled
                        value={formData.height}
                        className="w-full h-10 px-3 bg-slate-100 border border-border-main rounded-xl text-xs outline-none text-slate-600 font-mono"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Custom Product / Project Workflow */
                <div className="space-y-3 bg-purple-50/50 dark:bg-purple-950/10 border border-purple-200 p-4 rounded-2xl">
                  <h4 className="text-xs font-black text-purple-700 dark:text-purple-400 border-b border-purple-200 pb-1.5 flex items-center justify-between">
                    <span>مواصفات مشروع / مناقصة خاصة (Custom Project Workflow)</span>
                    <span className="text-[10px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-bold">معزول عن الكتالوج القياسي</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1">اسم المشروع / المناقصة *</label>
                      <input
                        type="text"
                        placeholder="مثال: مشروع فندق الماسة - القاهرة"
                        value={formData.projectName || ''}
                        onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                        className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl text-xs outline-none focus:border-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">اسم العميل / الجهة الطالبة</label>
                      <input
                        type="text"
                        placeholder="مثال: الهيئة القومية / شركة الإعمار"
                        value={formData.customerName || ''}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl text-xs outline-none focus:border-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1">العلامة التجارية المستهدفة *</label>
                      <select
                        value={formData.brandId}
                        onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                        className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl text-xs outline-none focus:border-purple-600 cursor-pointer"
                      >
                        <option value="">اختر البراند...</option>
                        {brands.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1">اسم الموديل الخاص *</label>
                      <input
                        type="text"
                        placeholder="مثال: Royal Suite Special 30"
                        value={formData.modelName}
                        onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                        className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl text-xs outline-none focus:border-purple-600 font-bold"
                      />
                    </div>

                    {/* Custom Dimensions */}
                    <div>
                      <label className="block text-xs font-bold mb-1">العرض الخاص (Width cm) *</label>
                      <input
                        type="number"
                        placeholder="مثال: 165"
                        value={formData.width || ''}
                        onChange={(e) => setFormData({ ...formData, width: Number(e.target.value) })}
                        className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl text-xs outline-none font-mono focus:border-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1">الطول الخاص (Length cm) *</label>
                      <input
                        type="number"
                        placeholder="مثال: 198"
                        value={formData.length || ''}
                        onChange={(e) => setFormData({ ...formData, length: Number(e.target.value) })}
                        className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl text-xs outline-none font-mono focus:border-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1">الارتفاع الخاص (Height cm) *</label>
                      <input
                        type="number"
                        placeholder="مثال: 32"
                        value={formData.height || ''}
                        onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                        className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl text-xs outline-none font-mono focus:border-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1">سياسة الضمان للمشروع *</label>
                      <select
                        value={formData.warrantyPolicyId}
                        onChange={(e) => setFormData({ ...formData, warrantyPolicyId: e.target.value })}
                        className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl text-xs outline-none focus:border-purple-600 cursor-pointer"
                      >
                        <option value="">اختر سياسة الضمان...</option>
                        {policies.map(pol => (
                          <option key={pol.id} value={pol.id}>{pol.name} ({pol.description})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Technologies Checkboxes */}
              <div>
                <label className="block text-xs font-bold mb-1.5">التقنيات المستخدمة (Product Technologies)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {availableTechnologies.map(tech => {
                    const isSelected = (formData.technologies || []).includes(tech.id);
                    return (
                      <button
                        type="button"
                        key={tech.id}
                        onClick={() => toggleTechnology(tech.id)}
                        className={`p-2 rounded-xl text-[10px] font-bold border text-right transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                            : 'bg-surface border-border-main text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {tech.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* System & Codes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">كود SAP للمادة (اختياري)</label>
                  <input
                    type="text"
                    placeholder="مثال: SAP-100293"
                    value={formData.sapMaterialCode || ''}
                    onChange={(e) => setFormData({ ...formData, sapMaterialCode: e.target.value })}
                    className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl text-xs outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">الكود الداخلي للمنتج *</label>
                  <input
                    type="text"
                    value={formData.internalProductCode}
                    onChange={(e) => setFormData({ ...formData, internalProductCode: e.target.value })}
                    className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl text-xs outline-none font-mono font-bold"
                  />
                </div>
              </div>

              {/* Action Buttons: [إلغاء] [حفظ وإضافة جديد] [حفظ] */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border-main">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-all"
                >
                  إلغاء
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {!editingProduct && (
                    <button
                      type="button"
                      onClick={handleSaveAndAddNew}
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      <Plus size={14} />
                      <span>حفظ وإضافة جديد</span>
                    </button>
                  )}

                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-[#0B2D5C] hover:bg-[#133358] text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 cursor-pointer transition-all"
                  >
                    {editingProduct ? 'حفظ التعديلات' : 'حفظ'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
