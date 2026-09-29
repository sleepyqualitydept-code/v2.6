import React, { useState, useMemo } from 'react';
import { 
  Award, Plus, Search, Edit3, Copy, Power, Eye, CheckCircle2, 
  Layers, ChevronRight, Check, AlertCircle, ArrowLeft, Shield, Trash2, 
  Calendar, FileText, Info, Sparkles, Database, Archive, FolderTree, X, RefreshCw
} from 'lucide-react';
import { ErpDatabase } from '../../utils/erpDb';
import { WarrantyPolicy, Model, Brand } from '../../types/erp';
import { WarrantyRulesEngine } from '../../services/warrantyRulesEngine';

export const WarrantyPolicyManagementView: React.FC = () => {
  const [policies, setPolicies] = useState<any[]>(() => ErpDatabase.getWarrantyPolicies());
  const [toast, setToast] = useState<string | null>(null);

  // Search & Filter States
  const [policySearch, setPolicySearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('All');
  const [showArchived, setShowArchived] = useState<boolean>(false);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<WarrantyPolicy | null>(null);
  const [viewingPolicy, setViewingPolicy] = useState<WarrantyPolicy | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedPolicyForBulk, setSelectedPolicyForBulk] = useState<WarrantyPolicy | null>(null);

  // Form state for WarrantyPolicy (comprehensive governance fields)
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formYears, setFormYears] = useState<number>(10);
  const [formDesc, setFormDesc] = useState('');
  
  // Strict Policy Type option: 10 Years, 7 Years, 5 Years, Hybrid, Declining, Custom
  const [formPolicyType, setFormPolicyType] = useState<string>('10 Years'); 

  // Comprehensive Editor Fields
  const [formCoverageRules, setFormCoverageRules] = useState('');
  const [formExclusions, setFormExclusions] = useState('');
  const [formReplacementRules, setFormReplacementRules] = useState('');
  const [formMaintenanceRules, setFormMaintenanceRules] = useState('');
  const [formActivationRules, setFormActivationRules] = useState('');

  const [formStartDate, setFormStartDate] = useState('2026-01-01');
  const [formEndDate, setFormEndDate] = useState('2036-12-31');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive' | 'archived'>('active');
  const [formScope, setFormScope] = useState<string>('All Products'); // All Products | Brand | Product Category | Product Model

  // Associations lists for direct structural assignment (Phase 2)
  const [formBrandIds, setFormBrandIds] = useState<string[]>([]);
  const [formCategoryIds, setFormCategoryIds] = useState<string[]>([]);
  const [formModelIds, setFormModelIds] = useState<string[]>([]);
  const [formVersionIds, setFormVersionIds] = useState<string[]>([]);

  // Bulk Operations State
  const [bulkTargetType, setBulkTargetType] = useState<'brands' | 'categories' | 'models'>('models');
  const [bulkSelectedIds, setBulkSelectedIds] = useState<string[]>([]);

  // AI Assistant input states
  const [aiProductType, setAiProductType] = useState('Spring Mattress');
  const [aiDensity, setAiDensity] = useState<number>(35);
  const [aiSpringType, setAiSpringType] = useState('Pocket Spring');
  const [aiTargetMarket, setAiMarket] = useState('Hotel');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReasoning, setAiReasoning] = useState('');

  const brands = ErpDatabase.getBrands();
  const models = ErpDatabase.getModels();
  const categories = ErpDatabase.getCategories();
  const sampleVersions = ['VER-SLP-2026-A1', 'VER-SLP-2026-B2', 'VER-SLP-2026-C3'];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenCreate = () => {
    setEditingPolicy(null);
    setFormCode(`POL-${Date.now().toString().slice(-4)}`);
    setFormName('');
    setFormYears(10);
    setFormDesc('');
    setFormPolicyType('10 Years');
    setFormCoverageRules('تغطية تامة وشاملة لجميع العيوب المصنعية والهبوط في الارتفاع بحد أقصى 15%');
    setFormExclusions('سوء الاستخدام، تعرض المرتبة للبلل أو الحريق، التلف الناتج عن التخزين الخاطئ');
    setFormReplacementRules('استبدال مجاني كامل خلال أول عامين، ونسبة خصم متناقصة بنسبة 10% سنوياً للأعوام التالية.');
    setFormMaintenanceRules('يجب تدوير المرتبة 180 درجة كل 3 أشهر، وضعها على قاعدة سرير صلبة ومستوية تماماً.');
    setFormActivationRules('مسح رمز QR الفريد المطبوع على المرتبة وتفعيل الضمان خلال 14 يوماً من الشراء عبر المنصة.');
    setFormStartDate('2026-01-01');
    setFormEndDate('2036-12-31');
    setFormStatus('active');
    setFormScope('All Products');
    setFormBrandIds([]);
    setFormCategoryIds([]);
    setFormModelIds([]);
    setFormVersionIds([]);
    setAiReasoning('');
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (p: WarrantyPolicy) => {
    // Read additional stored rules inside coverageRules or descriptions
    setEditingPolicy(p);
    setFormCode(p.id);
    setFormName(p.name);
    setFormYears(p.warrantyYears);
    setFormDesc(p.description);
    setFormPolicyType(p.policyType || '10 Years');
    setFormCoverageRules(p.coverageRules || 'تغطية تامة وشاملة لجميع العيوب المصنعية والهبوط في الارتفاع بحد أقصى 15%');
    setFormExclusions(p.exclusions || 'سوء الاستخدام، تعرض المرتبة للبلل أو الحريق، التلف الناتج عن التخزين الخاطئ');
    
    // Parse simulated extra rules if stored in JSON or default them
    setFormReplacementRules(p.exclusions?.includes('ReplacementRules:') ? p.exclusions.split('ReplacementRules:')[1].split(';')[0] : 'استبدال مجاني كامل خلال أول عامين، ونسبة خصم متناقصة بنسبة 10% سنوياً للأعوام التالية.');
    setFormMaintenanceRules(p.exclusions?.includes('MaintenanceRules:') ? p.exclusions.split('MaintenanceRules:')[1].split(';')[0] : 'يجب تدوير المرتبة 180 درجة كل 3 أشهر، وضعها على قاعدة سرير صلبة ومستوية تماماً.');
    setFormActivationRules(p.exclusions?.includes('ActivationRules:') ? p.exclusions.split('ActivationRules:')[1].split(';')[0] : 'مسح رمز QR الفريد المطبوع على المرتبة وتفعيل الضمان خلال 14 يوماً من الشراء عبر المنصة.');
    
    setFormStartDate(p.startDate || '2026-01-01');
    setFormEndDate(p.endDate || '2036-12-31');
    setFormStatus((p.status as any) || 'active');
    setFormScope(p.scope || 'All Products');
    setFormBrandIds(p.brandIds || []);
    setFormModelIds(p.modelIds || []);
    setFormVersionIds(p.versionIds || []);
    setAiReasoning('');
    setIsCreateModalOpen(true);
  };

  const handleDuplicate = (p: WarrantyPolicy) => {
    const newPolicy: WarrantyPolicy = {
      ...p,
      id: `POL-${Date.now().toString().slice(-4)}-DUP`,
      name: `${p.name} (نسخة مكررة)`,
      brandIds: p.brandIds ? [...p.brandIds] : [],
      modelIds: p.modelIds ? [...p.modelIds] : [],
      projectIds: p.projectIds ? [...p.projectIds] : [],
      versionIds: p.versionIds ? [...p.versionIds] : []
    };
    ErpDatabase.addWarrantyPolicy(newPolicy);
    setPolicies(ErpDatabase.getWarrantyPolicies());
    showToast(`تم نسخ وتكرار سياسة الضمان: ${newPolicy.name}`);
  };

  const handleArchivePolicy = (policy: WarrantyPolicy) => {
    const updated = policies.map(p => 
      p.id === policy.id ? { ...p, status: 'archived' as any } : p
    );
    ErpDatabase.saveWarrantyPolicies(updated as any);
    setPolicies(updated);
    showToast(`تم أرشفة سياسة الضمان ${policy.name} وحفظها بالأرشيف الحاكم.`);
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) return;

    // Package simulated rules together cleanly
    const fullExclusions = `${formExclusions} ReplacementRules:${formReplacementRules}; MaintenanceRules:${formMaintenanceRules}; ActivationRules:${formActivationRules};`;

    const targetPolicy: WarrantyPolicy = {
      id: formCode.trim(),
      name: formName.trim(),
      warrantyYears: Number(formYears),
      description: formDesc.trim(),
      policyType: formPolicyType,
      coverageRules: formCoverageRules.trim(),
      exclusions: fullExclusions,
      startDate: formStartDate,
      endDate: formEndDate,
      status: formStatus as any,
      scope: formScope as any,
      brandIds: formBrandIds,
      modelIds: formModelIds,
      versionIds: formVersionIds
    };

    if (editingPolicy) {
      const updated = policies.map(p => p.id === editingPolicy.id ? targetPolicy : p);
      ErpDatabase.saveWarrantyPolicies(updated);
      setPolicies(updated);
      showToast(`تم تحديث بيانات سياسة الضمان: ${formName}`);
    } else {
      ErpDatabase.addWarrantyPolicy(targetPolicy);
      setPolicies(ErpDatabase.getWarrantyPolicies());
      showToast(`تم إنشاء سياسة ضمان جديدة: ${targetPolicy.name}`);
    }

    setIsCreateModalOpen(false);
  };

  // 🛡️ SLEEPEE INDUSTRIAL WARRANTY RULES ENGINE (Deterministic - $0 AI Cost)
  const handleSuggestWarrantyPolicy = () => {
    setIsAiLoading(true);
    setAiReasoning('');

    try {
      const result = WarrantyRulesEngine.calculatePolicy({
        productType: aiProductType,
        density: aiDensity,
        springType: aiSpringType,
        targetMarket: aiTargetMarket
      });

      setFormYears(result.duration);
      setFormPolicyType(result.recommendedPolicyType);
      setFormCoverageRules(result.coverageRules);
      setFormExclusions(result.exclusions);
      setFormReplacementRules(result.replacementRules);
      setFormMaintenanceRules(result.maintenanceRules);
      setFormActivationRules(result.activationRules);
      setAiReasoning(`[مستوى المخاطر الهندسي: ${result.riskLevel}] • ${result.reasoning}`);
      
      showToast('تم احتساب وتوليد سياسة الضمان بدقة وفق محرك القواعد الهندسية Sleepee!');
    } catch (err) {
      console.error('Warranty calculation error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // BULK OPERATIONS - ASSIGN POLICY TO MULTIPLE BRANDS/CATEGORIES/MODELS
  const handleOpenBulk = (policy: WarrantyPolicy) => {
    setSelectedPolicyForBulk(policy);
    setBulkSelectedIds(policy.modelIds || []);
    setBulkTargetType('models');
    setIsBulkModalOpen(true);
  };

  const handleSaveBulkAssignment = () => {
    if (!selectedPolicyForBulk) return;

    const updatedPolicies = policies.map(p => {
      if (p.id === selectedPolicyForBulk.id) {
        if (bulkTargetType === 'brands') {
          return { ...p, scope: 'Brand' as const, brandIds: bulkSelectedIds, modelIds: [] };
        } else if (bulkTargetType === 'categories') {
          return { ...p, scope: 'Product Category' as const, categoryIds: bulkSelectedIds, modelIds: [] };
        } else {
          return { ...p, scope: 'Product Model' as const, modelIds: bulkSelectedIds, brandIds: [] };
        }
      }
      return p;
    });

    // Relational Integrity: Save the policy binding directly to target models (Phase 2)
    if (bulkTargetType === 'models') {
      const allModels = ErpDatabase.getModels();
      const updatedModels = allModels.map(m => {
        if (bulkSelectedIds.includes(m.id)) {
          return { ...m, warrantyPolicyId: selectedPolicyForBulk.id };
        } else if (m.warrantyPolicyId === selectedPolicyForBulk.id) {
          return { ...m, warrantyPolicyId: undefined }; // unbind
        }
        return m;
      });
      ErpDatabase.saveModels(updatedModels);
    }

    ErpDatabase.saveWarrantyPolicies(updatedPolicies);
    setPolicies(updatedPolicies);
    setIsBulkModalOpen(false);
    showToast(`تم تعميم وحوكمة السياسة جماعياً على كافة الوحدات المحددة في النظام!`);
  };

  const toggleBulkSelected = (id: string) => {
    setBulkSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleBrandSelection = (id: string) => {
    setFormBrandIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleModelSelection = (id: string) => {
    setFormModelIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleVersionSelection = (id: string) => {
    setFormVersionIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Build the master relational grid data (Brand -> Model -> Category -> Policy -> Duration -> Status -> Effective Date)
  const policyMasterGrid = useMemo(() => {
    const list: {
      id: string;
      brandName: string;
      modelName: string;
      categoryName: string;
      policyName: string;
      duration: number;
      effectiveDate: string;
      status: 'active' | 'inactive' | 'archived';
      policyObj: WarrantyPolicy;
    }[] = [];

    policies.forEach(p => {
      // Respect archived display toggle
      if (p.status === 'archived' && !showArchived) return;

      if (p.scope === 'All Products' || !p.scope) {
        list.push({
          id: `${p.id}-all`,
          brandName: 'كافة العلامات التجارية',
          modelName: 'كافة الموديلات والطلبيات',
          categoryName: 'مراتب نوم وإسفنج',
          policyName: p.name,
          duration: p.warrantyYears,
          effectiveDate: p.startDate || '2026-01-01',
          status: (p.status as any) || 'active',
          policyObj: p
        });
      } else if (p.scope === 'Brand') {
        const brandNames = (p.brandIds || []).map((bId: string) => brands.find(b => b.id === bId)?.name || bId).join(', ') || 'كل البراندات';
        list.push({
          id: `${p.id}-brand`,
          brandName: brandNames,
          modelName: 'جميع موديلات الماركة',
          categoryName: 'مراتب وإكسسوارات',
          policyName: p.name,
          duration: p.warrantyYears,
          effectiveDate: p.startDate || '2026-01-01',
          status: (p.status as any) || 'active',
          policyObj: p
        });
      } else if (p.scope === 'Product Model') {
        (p.modelIds || []).forEach((mId: string) => {
          const modelObj = models.find(m => m.id === mId);
          const brandObj = brands.find(b => b.id === modelObj?.brandId);
          list.push({
            id: `${p.id}-${mId}`,
            brandName: brandObj?.name || modelObj?.brandId || 'سليبي',
            modelName: modelObj?.name || mId,
            categoryName: 'مرتبة نوم قياسية',
            policyName: p.name,
            duration: p.warrantyYears,
            effectiveDate: p.startDate || '2026-01-01',
            status: (p.status as any) || 'active',
            policyObj: p
          });
        });

        if ((p.modelIds || []).length === 0) {
          list.push({
            id: `${p.id}-empty-models`,
            brandName: 'غير محدد',
            modelName: 'موديلات متعددة (شاغرة)',
            categoryName: 'مرتبة',
            policyName: p.name,
            duration: p.warrantyYears,
            effectiveDate: p.startDate || '2026-01-01',
            status: (p.status as any) || 'active',
            policyObj: p
          });
        }
      } else {
        list.push({
          id: `${p.id}-other`,
          brandName: 'مخصص',
          modelName: 'إصدارات تجميع محددة',
          categoryName: 'مراتب خاصة',
          policyName: p.name,
          duration: p.warrantyYears,
          effectiveDate: p.startDate || '2026-01-01',
          status: (p.status as any) || 'active',
          policyObj: p
        });
      }
    });

    return list.filter(item => {
      const q = policySearch.toLowerCase();
      const matchesSearch = item.policyName.toLowerCase().includes(q) ||
                           item.brandName.toLowerCase().includes(q) ||
                           item.modelName.toLowerCase().includes(q);
      const matchesBrand = filterBrand === 'All' || item.brandName.toLowerCase().includes(filterBrand.toLowerCase());
      return matchesSearch && matchesBrand;
    });
  }, [policies, policySearch, filterBrand, showArchived, brands, models]);

  return (
    <div className="space-y-6 text-right font-sans antialiased text-slate-800 dark:text-slate-100">
      
      {/* Toast Alert */}
      {toast && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Governance Title Banner */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border border-border-main rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-[#0B2D5C] dark:text-blue-300 flex items-center gap-2">
            <Award size={22} className="text-blue-600" />
            <span>مركز الحوكمة الموحد وهندسة سياسات الضمان (Warranty Policies Center)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            منظومة متكاملة لربط سياسات الجودة والضمان بالهياكل الصناعية للمراتب مباشرة (البراند، الفئة، الموديل، والإصدار) والتعميم الجماعي الذكي.
          </p>
        </div>
      </div>

      {/* Main Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={policySearch}
              onChange={(e) => setPolicySearch(e.target.value)}
              placeholder="البحث برقم السياسة، الموديل، أو البراند..."
              className="w-full h-10 pr-9 pl-3 bg-white dark:bg-slate-950 border border-border-main rounded-xl text-xs outline-none"
            />
          </div>

          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="h-10 px-3 bg-white dark:bg-slate-950 border border-border-main rounded-xl text-xs font-bold outline-none cursor-pointer"
          >
            <option value="All">كل العلامات التجارية (Brand)</option>
            {brands.map(b => (
              <option key={b.id} value={b.name}>{b.name}</option>
            ))}
          </select>

          {/* Archived Toggle */}
          <button
            type="button"
            onClick={() => setShowArchived(!showArchived)}
            className={`h-10 px-4 rounded-xl font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              showArchived 
                ? 'bg-purple-50 border-purple-300 text-purple-700' 
                : 'bg-white border-border-main text-slate-600'
            }`}
          >
            <Archive size={14} />
            <span>عرض الأرشيف ({policies.filter(p => p.status === 'archived').length})</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black cursor-pointer transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
        >
          <Plus size={14} />
          <span>إنشاء سياسة ضمان جديدة</span>
        </button>
      </div>

      {/* Relational Table List (Phase 1 Center) */}
      <div className="border border-border-main rounded-2xl overflow-hidden overflow-x-auto bg-surface shadow-2xs">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-100/70 dark:bg-surface text-slate-500 font-bold border-b border-border-main">
            <tr>
              <th className="p-3.5">البراند (Brand)</th>
              <th className="p-3.5">الموديل (Model)</th>
              <th className="p-3.5">الفئة (Category)</th>
              <th className="p-3.5">سياسة الضمان (Warranty Policy)</th>
              <th className="p-3.5 text-center">المدة (Duration)</th>
              <th className="p-3.5">تاريخ السريان (Effective Date)</th>
              <th className="p-3.5 text-center">الحالة (Status)</th>
              <th className="p-3.5 text-center">الإجراءات والتعميم</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold text-text-primary">
            {policyMasterGrid.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-10 text-center text-slate-400 font-bold">
                  لا توجد سياسات ضمان مطابقة معايير الفلترة الحالية.
                </td>
              </tr>
            ) : (
              policyMasterGrid.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 text-purple-700 font-black">{item.brandName}</td>
                  <td className="p-3.5 text-slate-800 dark:text-slate-200">{item.modelName}</td>
                  <td className="p-3.5 text-slate-500 font-normal">{item.categoryName}</td>
                  <td className="p-3.5 font-black text-blue-900 dark:text-blue-300">{item.policyName}</td>
                  <td className="p-3.5 text-center font-mono font-black text-emerald-600">
                    {item.duration} سنوات
                  </td>
                  <td className="p-3.5 font-mono text-slate-500">{item.effectiveDate}</td>
                  <td className="p-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      item.status === 'inactive' ? 'bg-rose-100 text-rose-800' :
                      item.status === 'archived' ? 'bg-slate-100 text-slate-700' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.status === 'inactive' ? 'موقوف' :
                       item.status === 'archived' ? 'مؤرشف' : 'فعال'}
                    </span>
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setViewingPolicy(item.policyObj)}
                        className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-black cursor-pointer"
                      >
                        عرض
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item.policyObj)}
                        className="px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black cursor-pointer"
                      >
                        تعديل
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicate(item.policyObj)}
                        className="px-2 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-[10px] font-black cursor-pointer"
                      >
                        نسخ
                      </button>
                      <button
                        type="button"
                        onClick={() => handleArchivePolicy(item.policyObj)}
                        disabled={item.status === 'archived'}
                        className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[10px] font-black cursor-pointer disabled:opacity-40"
                      >
                        أرشفة
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenBulk(item.policyObj)}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black cursor-pointer shadow-3xs"
                        title="تخصيص وتطبيق جماعي فوري"
                      >
                        تعميم جماعي
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* POLICY EDITOR MODAL WITH AI SUGGESTER & STRUCTURE RELATION LINKS */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in text-right">
          <div className="bg-surface dark:bg-surface-secondary border border-border-main rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-4 z-[10000] overflow-y-auto max-h-[90vh]">
            
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-extrabold text-sm text-[#0B2D5C] dark:text-blue-300 flex items-center gap-2">
                <Award size={18} className="text-blue-600" />
                <span>{editingPolicy ? 'تعديل وثيقة سياسة الضمان' : 'إنشاء وحوكمة سياسة ضمان جديدة'}</span>
              </h4>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 text-lg cursor-pointer font-bold">&times;</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* FORM FIELDS PANEL */}
              <form onSubmit={handleSavePolicy} className="lg:col-span-8 space-y-4 text-xs font-bold">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">كود السياسة الفريد *</label>
                    <input
                      type="text"
                      required
                      disabled={!!editingPolicy}
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value)}
                      placeholder="مثال: POL-10Y"
                      className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl outline-none font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">اسم سياسة الضمان الرسمي *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="ضمان مراتب سليبي الذهبية"
                      className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">فئة ونوع السياسة *</label>
                    <select
                      value={formPolicyType}
                      onChange={(e) => setFormPolicyType(e.target.value)}
                      className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl cursor-pointer font-black text-blue-600"
                    >
                      <option value="10 Years">ضمان 10 سنوات (10 Years)</option>
                      <option value="7 Years">ضمان 7 سنوات (7 Years)</option>
                      <option value="5 Years">ضمان 5 سنوات (5 Years)</option>
                      <option value="Hybrid">ضمان هجين (Hybrid)</option>
                      <option value="Declining">ضمان متناقص (Declining)</option>
                      <option value="Custom">ضمان خاص ومشاريع (Custom)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">مدة الضمان الفعلي (سنة) *</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      required
                      value={formYears}
                      onChange={(e) => setFormYears(Number(e.target.value))}
                      className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-mono font-bold text-center"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">الحالة التشغيلية للسياسة</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold cursor-pointer"
                    >
                      <option value="active">نشطة ومفعلة للإنتاج</option>
                      <option value="inactive">موقوفة مؤقتاً</option>
                    </select>
                  </div>
                </div>

                {/* PHASE 2: DIRECT INTEGRATION SCOPE */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b pb-1.5">
                    <span className="font-black text-[#0B2D5C] dark:text-blue-300 block text-xs">
                      رابط وبنية الحوكمة المباشرة (Product Structure Placement)
                    </span>
                    <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-lg">إدماج تلقائي للمستقبل</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-500">نطاق تطبيق الضمان الفوري</label>
                      <select
                        value={formScope}
                        onChange={(e) => setFormScope(e.target.value)}
                        className="w-full h-9 px-2 bg-white dark:bg-slate-950 border border-border-main rounded-xl cursor-pointer font-extrabold text-purple-700"
                      >
                        <option value="All Products">تعميم على كافة المنتجات (All Products)</option>
                        <option value="Brand">ربط مباشر ببراند (Brand Direct)</option>
                        <option value="Product Category">ربط مباشر بفئة منتجات (Category Direct)</option>
                        <option value="Product Model">ربط مباشر بموديلات مصنعية (Model Direct)</option>
                        <option value="Production Version">ربط مباشر بإصدارات إنتاجية (Version Direct)</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      {formScope === 'Brand' && (
                        <div className="w-full space-y-1">
                          <label className="text-[10px] text-slate-400">اختر البراند المرتبط:</label>
                          <div className="flex flex-wrap gap-1">
                            {brands.map(b => {
                              const sel = formBrandIds.includes(b.id);
                              return (
                                <button
                                  type="button" key={b.id} onClick={() => toggleBrandSelection(b.id)}
                                  className={`px-2 py-1 rounded text-[10px] border ${sel ? 'bg-purple-600 text-white' : 'bg-white'}`}
                                >
                                  {b.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {formScope === 'Product Model' && (
                        <div className="w-full space-y-1">
                          <label className="text-[10px] text-slate-400">حدد الموديلات المعتمدة:</label>
                          <div className="max-h-24 overflow-y-auto p-1.5 bg-white dark:bg-slate-950 border rounded-lg space-y-1">
                            {models.map(m => {
                              const sel = formModelIds.includes(m.id);
                              return (
                                <label key={m.id} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
                                  <input
                                    type="checkbox" checked={sel} onChange={() => toggleModelSelection(m.id)}
                                    className="w-3.5 h-3.5 text-purple-600 rounded"
                                  />
                                  <span>{m.name}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {formScope === 'Production Version' && (
                        <div className="w-full space-y-1">
                          <label className="text-[10px] text-slate-400">الإصدارات الإنتاجية المربوطة:</label>
                          <div className="flex flex-wrap gap-1">
                            {sampleVersions.map(v => {
                              const sel = formVersionIds.includes(v);
                              return (
                                <button
                                  type="button" key={v} onClick={() => {
                                    setFormVersionIds(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
                                  }}
                                  className={`px-2 py-1 rounded text-[10px] border ${sel ? 'bg-purple-600 text-white' : 'bg-white'}`}
                                >
                                  {v}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {formScope === 'Product Category' && (
                        <div className="w-full space-y-1">
                          <label className="text-[10px] text-slate-400">اختر الفئة المرتبطة:</label>
                          <div className="flex flex-wrap gap-1">
                            {categories.map(c => {
                              const sel = formCategoryIds.includes(c.id);
                              return (
                                <button
                                  type="button" key={c.id} onClick={() => {
                                    setFormCategoryIds(prev => prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id]);
                                  }}
                                  className={`px-2 py-1 rounded text-[10px] border ${sel ? 'bg-purple-600 text-white' : 'bg-white'}`}
                                >
                                  {c.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">الوصف والشروط العامة للضمان *</label>
                  <textarea
                    rows={2} required value={formDesc} onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="شروط الضمان العامة للعملاء..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl outline-none resize-none font-bold"
                  />
                </div>

                {/* POLICY EDITOR: 6 DYNAMIC CRITICAL GOVERNANCE FIELDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t">
                  <div className="space-y-1">
                    <label className="font-bold text-blue-900 dark:text-blue-300 block flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-blue-600" />
                      <span>قواعد التغطية والتعويض (Coverage) *</span>
                    </label>
                    <textarea
                      rows={2.5} required value={formCoverageRules} onChange={(e) => setFormCoverageRules(e.target.value)}
                      placeholder="ما تغطيه شروط الضمان..."
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl outline-none resize-none font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-rose-700 block flex items-center gap-1">
                      <AlertCircle size={13} className="text-rose-600" />
                      <span>الاستثناءات وموانع الضمان (Exclusions) *</span>
                    </label>
                    <textarea
                      rows={2.5} required value={formExclusions} onChange={(e) => setFormExclusions(e.target.value)}
                      placeholder="ما يبطل الضمان..."
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl outline-none resize-none font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#0B2D5C] dark:text-blue-300 block flex items-center gap-1">
                      <Layers size={13} className="text-purple-600" />
                      <span>سياسات الاستبدال (Replacement Rules) *</span>
                    </label>
                    <textarea
                      rows={2.5} required value={formReplacementRules} onChange={(e) => setFormReplacementRules(e.target.value)}
                      placeholder="قواعد استبدال وهلاك المنتج..."
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl outline-none resize-none font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-teal-800 dark:text-teal-300 block flex items-center gap-1">
                      <Info size={13} className="text-teal-600" />
                      <span>تعليمات الصيانة والتدوير (Maintenance) *</span>
                    </label>
                    <textarea
                      rows={2.5} required value={formMaintenanceRules} onChange={(e) => setFormMaintenanceRules(e.target.value)}
                      placeholder="تعليمات التقليب والتدوير وقاعدة السرير..."
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl outline-none resize-none font-bold"
                    />
                  </div>

                  <div className="space-y-1 col-span-2">
                    <label className="font-bold text-amber-800 dark:text-amber-300 block flex items-center gap-1">
                      <Sparkles size={13} className="text-amber-600" />
                      <span>قواعد تفعيل وتوثيق الضمان (Activation Rules) *</span>
                    </label>
                    <textarea
                      rows={2} required value={formActivationRules} onChange={(e) => setFormActivationRules(e.target.value)}
                      placeholder="قواعد وشروط تسجيل الضمان بالفاتورة ورمز QR..."
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl outline-none resize-none font-bold"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t">
                  <button
                    type="button" onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 border border-border-main rounded-xl font-black hover:bg-slate-100 cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black shadow-md cursor-pointer"
                  >
                    {editingPolicy ? 'حفظ تعديلات السياسة ورابط الجودة' : 'اعتماد وحفظ سياسة الضمان الحاكمة'}
                  </button>
                </div>
              </form>

              {/* AI POLICY ASSISTANT PANEL */}
              <div className="lg:col-span-4 bg-gradient-to-br from-purple-500/5 to-blue-500/5 p-4 border border-purple-100 dark:border-purple-950 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-purple-100 pb-2">
                  <Sparkles size={18} className="text-purple-600 animate-pulse" />
                  <span className="font-black text-xs text-purple-900 dark:text-purple-300">مساعد تصميم السياسات الذكي</span>
                </div>

                <div className="space-y-3 text-[11px] font-bold">
                  <div>
                    <label className="text-slate-500 block mb-1">نوع وهيكل منتج المرتبة</label>
                    <select
                      value={aiProductType}
                      onChange={(e) => setAiProductType(e.target.value)}
                      className="w-full h-8 px-2 bg-white dark:bg-slate-950 border border-purple-100 rounded-lg outline-none"
                    >
                      <option value="Spring Mattress">مرتبة سوست جيبية (Spring Mattress)</option>
                      <option value="Bonnell Spring Mattress">مرتبة بونيل اقتصادية (Bonnell Spring)</option>
                      <option value="Foam Mattress">مرتبة إسفنجية بالكامل (Foam Mattress)</option>
                      <option value="Latex Medical Mattress">مرتبة لاتكس طبي علاجية (Latex Medical)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-500 block mb-1">الكثافة المقدرة (D)</label>
                      <input
                        type="number" value={aiDensity} onChange={(e) => setAiDensity(Number(e.target.value))}
                        className="w-full h-8 px-2 bg-white dark:bg-slate-950 border border-purple-100 rounded-lg outline-none text-center font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">شريحة الاستخدام</label>
                      <select
                        value={aiTargetMarket}
                        onChange={(e) => setAiMarket(e.target.value)}
                        className="w-full h-8 px-1 bg-white dark:bg-slate-950 border border-purple-100 rounded-lg outline-none"
                      >
                        <option value="Hotel">فندقي فاخر</option>
                        <option value="Medical">طبي علاجي</option>
                        <option value="Retail">منزلي أفراد</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button" onClick={handleSuggestWarrantyPolicy} disabled={isAiLoading}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-black shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    {isAiLoading ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        <span>جاري دراسة مخاطر الضمان...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} />
                        <span>اقتراح سياسة الضمان فورا ✨</span>
                      </>
                    )}
                  </button>

                  {aiReasoning && (
                    <div className="p-3 bg-purple-100/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 rounded-xl leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                      <span className="font-black text-purple-950 dark:text-purple-300 block mb-1 text-[10px]">تحليل الجودة والمطابقة:</span>
                      <p>{aiReasoning}</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* VIEW POLICY DETAILS MODAL */}
      {viewingPolicy && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in text-right">
          <div className="bg-surface dark:bg-surface-secondary border border-border-main rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 z-[10000] overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-extrabold text-sm text-[#0B2D5C] dark:text-blue-300 flex items-center gap-2">
                <Award size={18} className="text-blue-600" />
                <span>تفاصيل وثيقة الضمان الحاكمة 360°</span>
              </h4>
              <button onClick={() => setViewingPolicy(null)} className="text-slate-400 text-lg cursor-pointer font-bold">&times;</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-blue-50/50 dark:bg-blue-950/30 rounded-2xl border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="font-mono text-blue-700 dark:text-blue-300 font-bold text-xs block">{viewingPolicy.id}</span>
                  <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm mt-1">{viewingPolicy.name}</h4>
                  <span className="text-[10px] text-slate-400 block mt-1">النوع المعتمد: {viewingPolicy.policyType}</span>
                </div>
                <div className="text-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-xl border border-emerald-200 shrink-0">
                  <span className="text-[10px] font-bold block leading-none mb-1">مدة الضمان</span>
                  <span className="font-mono text-lg font-black">{viewingPolicy.warrantyYears} سنوات</span>
                </div>
              </div>

              {/* Connected details (Phase 2) */}
              {viewingPolicy.scope && viewingPolicy.scope !== 'All Products' && (
                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1.5">
                  <span className="font-bold text-purple-800 block">بنية الارتباط والتعميم:</span>
                  <div className="text-[11px] font-black text-slate-700">
                    {viewingPolicy.scope === 'Brand' && `العلامات التجارية المشمولة: ${viewingPolicy.brandIds?.join(', ') || 'كل البراندات'}`}
                    {viewingPolicy.scope === 'Product Model' && `الموديلات المشمولة بالماستر: ${viewingPolicy.modelIds?.map((mId: string) => models.find(m => m.id === mId)?.name || mId).join(', ') || 'كل الموديلات'}`}
                    {viewingPolicy.scope === 'Product Category' && `الفئات المشمولة: ${viewingPolicy.categoryIds?.map((cId: string) => categories.find(c => c.id === cId)?.name || cId).join(', ') || 'كل الفئات'}`}
                    {viewingPolicy.scope === 'Production Version' && `إصدارات الإنتاج: ${viewingPolicy.versionIds?.join(', ') || 'كل إصدارات خط التجميع'}`}
                  </div>
                </div>
              )}

              <div className="space-y-1.5 pt-2 border-t border-border-main">
                <span className="font-bold text-slate-400 block">الوصف والشروط العامة:</span>
                <p className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-700 dark:text-slate-300 leading-relaxed font-bold">
                  {viewingPolicy.description}
                </p>
              </div>

              {/* Dynamic 5 editor fields rendering */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="space-y-1.5">
                  <span className="font-bold text-blue-900 dark:text-blue-300 block flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-blue-600" />
                    <span>شروط التغطية والتعويض:</span>
                  </span>
                  <p className="p-3 bg-blue-50/20 dark:bg-slate-900 rounded-xl text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                    {viewingPolicy.coverageRules || 'تغطية تامة وشاملة لجميع العيوب المصنعية والهبوط في الارتفاع بحد أقصى 15%'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-rose-700 block flex items-center gap-1">
                    <AlertCircle size={13} className="text-rose-600" />
                    <span>الاستثناءات وموانع الضمان:</span>
                  </span>
                  <p className="p-3 bg-rose-50/20 dark:bg-slate-900 rounded-xl text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                    {viewingPolicy.exclusions?.split('ReplacementRules:')[0] || 'سوء الاستخدام، تعرض المرتبة للبلل أو الحريق، التلف الناتج عن سوء النقل...'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-[#0B2D5C] dark:text-blue-300 block flex items-center gap-1">
                    <Layers size={13} className="text-purple-600" />
                    <span>سياسات الاستبدال وتناقص الأثر:</span>
                  </span>
                  <p className="p-3 bg-purple-50/15 dark:bg-slate-900 rounded-xl text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                    {viewingPolicy.exclusions?.includes('ReplacementRules:') ? viewingPolicy.exclusions.split('ReplacementRules:')[1].split(';')[0] : 'استبدال مجاني كامل خلال أول عامين، ونسبة خصم متناقصة بنسبة 10% سنوياً للأعوام التالية.'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-teal-800 dark:text-teal-300 block flex items-center gap-1">
                    <Info size={13} className="text-teal-600" />
                    <span>تعليمات الصيانة والدوران:</span>
                  </span>
                  <p className="p-3 bg-teal-50/15 dark:bg-slate-900 rounded-xl text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                    {viewingPolicy.exclusions?.includes('MaintenanceRules:') ? viewingPolicy.exclusions.split('MaintenanceRules:')[1].split(';')[0] : 'يجب تدوير المرتبة 180 درجة كل 3 أشهر، وضعها على قاعدة سرير صلبة ومستوية تماماً.'}
                  </p>
                </div>

                <div className="space-y-1.5 col-span-2">
                  <span className="font-bold text-amber-800 dark:text-amber-300 block flex items-center gap-1">
                    <Sparkles size={13} className="text-amber-600" />
                    <span>شروط التفعيل والتوثيق الرقمي:</span>
                  </span>
                  <p className="p-3 bg-amber-50/15 dark:bg-slate-900 rounded-xl text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                    {viewingPolicy.exclusions?.includes('ActivationRules:') ? viewingPolicy.exclusions.split('ActivationRules:')[1].split(';')[0] : 'مسح رمز QR الفريد المطبوع على المرتبة وتفعيل الضمان خلال 14 يوماً من الشراء عبر المنصة.'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-border-main gap-2">
                <button
                  onClick={() => {
                    setViewingPolicy(null);
                    handleOpenEdit(viewingPolicy);
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  تعديل هذه السياسة
                </button>
                <button
                  onClick={() => setViewingPolicy(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 cursor-pointer"
                >
                  إغلاق النافذة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BULK ASSIGNMENT MODAL (BULK OPERATIONS) */}
      {isBulkModalOpen && selectedPolicyForBulk && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in text-right">
          <div className="bg-surface dark:bg-surface-secondary border border-border-main rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 z-[10000]">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-extrabold text-sm text-[#0B2D5C] dark:text-blue-300 flex items-center gap-1.5">
                <Layers size={18} className="text-emerald-600" />
                <span>التعميم والتخصيص الجماعي للسياسة [{selectedPolicyForBulk.name}]</span>
              </h4>
              <button onClick={() => setIsBulkModalOpen(false)} className="text-slate-400 text-lg cursor-pointer font-bold">&times;</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-slate-500">تعميم وتطبيق جماعي على مستوى:</span>
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl gap-1">
                  <button
                    type="button" onClick={() => { setBulkTargetType('models'); setBulkSelectedIds([]); }}
                    className={`px-2.5 py-1 text-[10px] rounded-lg font-bold cursor-pointer ${bulkTargetType === 'models' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500'}`}
                  >
                    الموديلات (Models)
                  </button>
                  <button
                    type="button" onClick={() => { setBulkTargetType('brands'); setBulkSelectedIds([]); }}
                    className={`px-2.5 py-1 text-[10px] rounded-lg font-bold cursor-pointer ${bulkTargetType === 'brands' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500'}`}
                  >
                    الماركات (Brands)
                  </button>
                  <button
                    type="button" onClick={() => { setBulkTargetType('categories'); setBulkSelectedIds([]); }}
                    className={`px-2.5 py-1 text-[10px] rounded-lg font-bold cursor-pointer ${bulkTargetType === 'categories' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500'}`}
                  >
                    الفئات (Categories)
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-100/50 rounded-xl border max-h-60 overflow-y-auto space-y-1.5">
                {bulkTargetType === 'models' && models.map(m => {
                  const sel = bulkSelectedIds.includes(m.id);
                  const bName = brands.find(b => b.id === m.brandId)?.name || m.brandId;
                  return (
                    <label key={m.id} className="flex items-center justify-between p-2 hover:bg-surface rounded-lg cursor-pointer transition-colors border border-transparent">
                      <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                        <input
                          type="checkbox" checked={sel} onChange={() => toggleBulkSelected(m.id)}
                          className="w-4 h-4 text-emerald-600 rounded"
                        />
                        <span>{m.name}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded-md font-mono">{bName}</span>
                      </div>
                    </label>
                  );
                })}

                {bulkTargetType === 'brands' && brands.map(b => {
                  const sel = bulkSelectedIds.includes(b.id);
                  return (
                    <label key={b.id} className="flex items-center justify-between p-2 hover:bg-surface rounded-lg cursor-pointer transition-colors border border-transparent">
                      <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                        <input
                          type="checkbox" checked={sel} onChange={() => toggleBulkSelected(b.id)}
                          className="w-4 h-4 text-emerald-600 rounded"
                        />
                        <span>{b.name}</span>
                      </div>
                    </label>
                  );
                })}

                {bulkTargetType === 'categories' && categories.map(c => {
                  const sel = bulkSelectedIds.includes(c.id);
                  return (
                    <label key={c.id} className="flex items-center justify-between p-2 hover:bg-surface rounded-lg cursor-pointer transition-colors border border-transparent">
                      <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                        <input
                          type="checkbox" checked={sel} onChange={() => toggleBulkSelected(c.id)}
                          className="w-4 h-4 text-emerald-600 rounded"
                        />
                        <span>{c.name}</span>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-main">
                <button
                  type="button" onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 border border-border-main rounded-xl font-bold cursor-pointer text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="button" onClick={handleSaveBulkAssignment}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black shadow-md cursor-pointer text-xs"
                >
                  حفظ وتطبيق الضمان جماعياً على ({bulkSelectedIds.length}) وحدة مفعّلة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
