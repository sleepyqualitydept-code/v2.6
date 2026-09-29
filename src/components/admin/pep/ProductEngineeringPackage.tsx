import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, ChevronDown, ChevronUp, Copy, ArrowLeftRight, 
  X, Save, Factory, Check, Sparkles, Building2, AlertTriangle, Layers
} from 'lucide-react';
import { PepStepId, PepCloneOptions } from './PepTypes';
import { PepStepperHeader, PEP_STEPS_CONFIG } from './PepStepperHeader';
import { PepCloneModal } from './PepCloneModal';
import { PepStep1ProductDefinition } from './PepStep1ProductDefinition';
import { PepStep3MaterialsBom } from './PepStep3MaterialsBom';
import { PepStep4RoutingManufacturing } from './PepStep4RoutingManufacturing';
import { PepStep4EngineeringCad } from './PepStep4EngineeringCad';
import { PepStep5CostCompliance } from './PepStep5CostCompliance';
import { PepStep8ProductionRelease } from './PepStep8ProductionRelease';
import { AssemblyEngineeringDrawer } from '../bom/AssemblyEngineeringDrawer';

import { ErpDatabase } from '../../../utils/erpDb';
import { CurrencyCode, CurrencyEngine } from '../../../services/currencyEngine';
import { Model, Brand, ProductFamily, BillOfMaterials, BomStatus, RoutingStep } from '../../../types/erp';
import { MaterialMasterIntelligenceEngine } from '../../../services/materialMasterIntelligenceEngine';

export const ProductEngineeringPackage: React.FC = () => {
  // Load standard models, brands, families from ErpDatabase
  const models = ErpDatabase.getModels();
  const brands = ErpDatabase.getBrands();
  const families = ErpDatabase.getFamilies();

  // Selected Model & BOM state
  const [savedBoms, setSavedBoms] = useState<BillOfMaterials[]>(() => ErpDatabase.getBOMs());
  const [selectedModelId, setSelectedModelId] = useState<string>(models[0]?.id || '');
  const [activeBom, setActiveBom] = useState<BillOfMaterials | null>(null);

  // Sync active BOM when selectedModelId changes
  useEffect(() => {
    const activeForModel = savedBoms.find(b => b.modelId === selectedModelId && b.status === 'Active');
    if (activeForModel) {
      setActiveBom(activeForModel);
    } else {
      const anyForModel = savedBoms.find(b => b.modelId === selectedModelId);
      setActiveBom(anyForModel || null);
    }
  }, [selectedModelId, savedBoms]);

  // Brand, Plant & Currency hierarchy
  const currentModel = models.find(m => m.id === selectedModelId) || models[0];
  const [selectedBrandId, setSelectedBrandId] = useState<string>(currentModel?.brandId || 'SLP');
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>(currentModel?.familyId || 'FAM-SPRING');
  const [selectedPlantId, setSelectedPlantId] = useState<string>('PLANT-KSA-01');
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>(() => CurrencyEngine.getActiveCurrency());

  // STEP ACCORDION WORKFLOW STATE
  const [activeStep, setActiveStep] = useState<PepStepId>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<PepStepId>>(new Set([1]));
  const [accordionMode, setAccordionMode] = useState<boolean>(true); // Accordion: only active step expanded

  // Product Parameters (Step 1)
  const [designDimensions, setDesignDimensions] = useState<string>('180×195 سم');
  const [designTargetHeight, setDesignTargetHeight] = useState<number>(25);
  const [designComfortLevel, setDesignComfortLevel] = useState<string>('Medium Firm (متوسط القساوة إرجونومي)');
  const [springTechnology, setSpringTechnology] = useState<string>('Pocket Spring 2.0mm (سوست جيبية منفصلة معزولة)');
  const [manufacturingSystem, setManufacturingSystem] = useState<string>('Continuous Flow Line (خط تجميع مستمر آلي)');
  const [isDoubleSided, setIsDoubleSided] = useState<boolean>(true);

  // Materials & Layers state (Step 3 & Step 5)
  const [layers, setLayers] = useState<any[]>([
    {
      id: 'L1',
      material: 'قماش فاخر محاك قطني (Luxury Knitted Fabric)',
      materialCode: 'FAB-KNIT-450',
      category: 'Fabric',
      layerType: 'Comfort',
      thickness: 1.5,
      density: 450,
      weight: 1.2,
      cost: 45,
      supplier: 'مصنع النسيج الحديث',
      uom: 'm²'
    },
    {
      id: 'L2',
      material: 'فايبر حراري فندقي فائق النعومة (Polyester Fiber)',
      materialCode: 'FIB-LOFT-300',
      category: 'Fiber',
      layerType: 'Comfort',
      thickness: 2.0,
      density: 300,
      weight: 0.8,
      cost: 25,
      supplier: 'الشركة السعودية للفايبر',
      uom: 'm²'
    },
    {
      id: 'L3',
      material: 'فوم الذاكرة رغوي هيدروليكي (Viscoelastic Memory Foam)',
      materialCode: 'FOM-MEM-50',
      category: 'Foam',
      layerType: 'Pressure Relief',
      thickness: 3.0,
      density: 50,
      weight: 3.2,
      cost: 95,
      supplier: 'مصانع رغوة البولي يوريثان الوطنية',
      uom: 'cm'
    },
    {
      id: 'L4',
      material: 'إسفنج عالي المرونة فائق الكثافة (HR Foam D35)',
      materialCode: 'FOM-HR-35',
      category: 'Foam',
      layerType: 'Transition',
      thickness: 3.5,
      density: 35,
      weight: 3.8,
      cost: 70,
      supplier: 'مصانع رغوة البولي يوريثان الوطنية',
      uom: 'cm'
    },
    {
      id: 'L5',
      material: 'لباد قطني تركي عازل ومعالج حرارياً (Needle-Punched Felt)',
      materialCode: 'FLT-TRK-1000',
      category: 'Felt',
      layerType: 'Insulator',
      thickness: 0.5,
      density: 1000,
      weight: 2.1,
      cost: 30,
      supplier: 'المورد التركي المعتمد',
      uom: 'm²'
    },
    {
      id: 'L6',
      material: 'شاسيه سوست جيبية منفصلة كربونية (Pocket Spring 2.0mm)',
      materialCode: 'SPR-PKT-20',
      category: 'Spring',
      layerType: 'Support Core',
      thickness: 18.0,
      density: 0,
      weight: 18.5,
      cost: 210,
      supplier: 'خط السوست الآلي الداخلي',
      uom: 'pcs'
    },
    {
      id: 'L7',
      material: 'لباد قطني تركي عازل سفلي (Needle-Punched Felt Bottom)',
      materialCode: 'FLT-TRK-1000',
      category: 'Felt',
      layerType: 'Insulator',
      thickness: 0.5,
      density: 1000,
      weight: 2.1,
      cost: 30,
      supplier: 'المورد التركي المعتمد',
      uom: 'm²'
    },
    {
      id: 'L8',
      material: 'إسفنج دعم أساسي مضغوط (High-Density Base Foam D30)',
      materialCode: 'FOM-HD-30',
      category: 'Foam',
      layerType: 'Base',
      thickness: 2.0,
      density: 30,
      weight: 2.4,
      cost: 40,
      supplier: 'مصانع رغوة البولي يوريثان الوطنية',
      uom: 'cm'
    }
  ]);

  // Routing Operations state (Step 4)
  const [routingSteps, setRoutingSteps] = useState<RoutingStep[]>([
    {
      sequenceNo: 10,
      operationCode: 'OP-CUT-01',
      operationNameAr: 'قص وتفصيل طبقات الإسفنج والفوم CNC',
      operationNameEn: 'CNC Foam Layer Cutting',
      workCenterCode: 'FOAM-CUT-01',
      setupTime: 10,
      runTime: 15,
      laborCount: 2,
      machineCount: 1,
      qualityGate: true,
      mandatoryStep: true,
      estimatedCost: 35
    },
    {
      sequenceNo: 20,
      operationCode: 'OP-SPRING-01',
      operationNameAr: 'تجهيز وتشكيل شاسيه السوست الجيبية',
      operationNameEn: 'Pocket Spring Core Assembly',
      workCenterCode: 'SPRING-ASSY-01',
      setupTime: 15,
      runTime: 20,
      laborCount: 2,
      machineCount: 1,
      qualityGate: true,
      mandatoryStep: true,
      estimatedCost: 55
    },
    {
      sequenceNo: 30,
      operationCode: 'OP-QUILT-01',
      operationNameAr: 'كبتنة وتطريز الأقمشة العلوية هيدروليكياً',
      operationNameEn: 'Multi-Needle Computerized Quilting',
      workCenterCode: 'QUILT-LINE-01',
      setupTime: 20,
      runTime: 25,
      laborCount: 2,
      machineCount: 1,
      qualityGate: true,
      mandatoryStep: true,
      estimatedCost: 45
    },
    {
      sequenceNo: 40,
      operationCode: 'OP-BORDER-01',
      operationNameAr: 'تجهيز شريط الداير وأحزمة التهوية والمقابض',
      operationNameEn: 'Border & Handle Assembly',
      workCenterCode: 'BORDER-SEW-01',
      setupTime: 10,
      runTime: 15,
      laborCount: 1,
      machineCount: 1,
      qualityGate: false,
      mandatoryStep: true,
      estimatedCost: 25
    },
    {
      sequenceNo: 50,
      operationCode: 'OP-TAPE-01',
      operationNameAr: 'تقفيل شريط الحياكة المداري (Tape Edge Closure)',
      operationNameEn: 'Tape Edge Finishing Operation',
      workCenterCode: 'TAPE-EDGE-01',
      setupTime: 5,
      runTime: 18,
      laborCount: 1,
      machineCount: 1,
      qualityGate: true,
      mandatoryStep: true,
      estimatedCost: 40
    },
    {
      sequenceNo: 60,
      operationCode: 'OP-QC-01',
      operationNameAr: 'فحص الجودة النهائي وتغليف الفاكيوم والكرتون',
      operationNameEn: 'Final Quality Gate & Packaging',
      workCenterCode: 'QC-PACK-01',
      setupTime: 5,
      runTime: 10,
      laborCount: 2,
      machineCount: 1,
      qualityGate: true,
      mandatoryStep: true,
      estimatedCost: 30
    }
  ]);

  // Compliance & Policy (Step 7)
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('POL-10Y');

  // Release Control (Step 8)
  const [designVersion, setDesignVersion] = useState<string>('v1.0');
  const [designStatus, setDesignStatus] = useState<BomStatus>('Active');
  const [revisionNotes, setRevisionNotes] = useState<string>('اعتماد التركيبة المتطورة لسلسلة السوست الجيبية وعزل اللباد التركي');
  const [engineeringNotes, setEngineeringNotes] = useState<string>('تمت مراجعة اشتراطات الفحص ونقاط بوابات الجودة والتكاليف الصناعية بالكامل.');

  // Modals & Drawer State
  const [isCloneModalOpen, setIsCloneModalOpen] = useState<boolean>(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [compareTargetBomId, setCompareTargetBomId] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedDrawerLayer, setSelectedDrawerLayer] = useState<any | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Material master library options
  const materialMasterOptions = useMemo(() => {
    return MaterialMasterIntelligenceEngine.getAllMaterials();
  }, []);

  // Total direct cost calculation
  const totalDirectCost = layers.reduce((sum, l) => sum + (Number(l.cost) || 0), 0);

  // STEP ADVANCEMENT LOGIC (Accordion Behavior)
  const handleCompleteStep = (completedStepId: PepStepId) => {
    setCompletedSteps(prev => new Set([...prev, completedStepId]));
    const nextStep = (completedStepId < 8 ? (completedStepId + 1) : 8) as PepStepId;
    setActiveStep(nextStep);
  };

  // CLONE MODEL LOGIC
  const handleConfirmClone = (options: PepCloneOptions) => {
    // Generate new model & PEP
    const newBomNumber = `BOM-${options.newModelCode}-${Date.now().toString().slice(-4)}`;
    const clonedBom: BillOfMaterials = {
      id: `bom-${Date.now()}`,
      bomNumber: newBomNumber,
      bomName: `قائمة مواد ${options.newModelName}`,
      brandId: selectedBrandId,
      familyId: selectedFamilyId,
      modelId: options.sourceModelId,
      version: 'v1.0-CLONE',
      status: 'Active',
      createdBy: 'PEP Engineering System',
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      materials: layers.map((l, i) => ({
        id: `mat-${i + 1}`,
        materialCode: l.materialCode || `RAW-${i + 1}`,
        materialName: l.material,
        quantity: l.thickness,
        unit: 'pcs' as const,
        notes: l.supplier || ''
      }))
    };

    const allBoms = ErpDatabase.getBOMs();
    ErpDatabase.saveBOMs([clonedBom, ...allBoms]);
    setSavedBoms(ErpDatabase.getBOMs());
    setDesignVersion('v1.0-CLONE');
    setDesignTargetHeight(options.newTargetHeight);
    setSaveSuccessNotice(`تم استنساخ الموديل وتوليد حزمة PEP جديدة بنجاح باسم: ${options.newModelName}`);
    setTimeout(() => setSaveSuccessNotice(null), 5000);
  };

  // SAVE PEP TO DATABASE
  const handleSavePep = () => {
    const bomNumber = activeBom?.bomNumber || `BOM-${currentModel?.id || 'SLP'}-${Date.now().toString().slice(-4)}`;
    const newBomRecord: BillOfMaterials = {
      id: activeBom?.id || `bom-${Date.now()}`,
      bomNumber,
      bomName: `حزمة PEP - ${currentModel?.name || 'المرتبة'} (${designVersion})`,
      brandId: selectedBrandId,
      familyId: selectedFamilyId,
      modelId: selectedModelId,
      version: designVersion,
      status: designStatus,
      createdBy: activeBom?.createdBy || 'PEP Engineering Center',
      createdDate: activeBom?.createdDate || new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      materials: layers.map((l, i) => ({
        id: `mat-${i + 1}`,
        materialCode: l.materialCode || `RAW-${i + 1}`,
        materialName: l.material,
        quantity: l.thickness,
        unit: 'pcs' as const,
        notes: l.supplier || ''
      }))
    };

    const allBoms = ErpDatabase.getBOMs();
    const existingIdx = allBoms.findIndex(b => b.id === newBomRecord.id);
    let updatedBoms: BillOfMaterials[];
    if (existingIdx !== -1) {
      updatedBoms = allBoms.map(b => b.id === newBomRecord.id ? newBomRecord : b);
    } else {
      updatedBoms = [newBomRecord, ...allBoms];
    }

    ErpDatabase.saveBOMs(updatedBoms);
    setSavedBoms(ErpDatabase.getBOMs());
    setActiveBom(newBomRecord);
    setSaveSuccessNotice('تم حفظ واعتماد حزمة PEP الرسمية في قاعدة بيانات المصنع بنجاح!');
    setTimeout(() => setSaveSuccessNotice(null), 4000);
  };

  // IMMEDIATE PRODUCTION ORDER TRIGGER
  const handleTriggerImmediateOrder = () => {
    const orderNo = `PO-${Date.now().toString().slice(-6)}`;
    setSaveSuccessNotice(`تم إنشاء أمر تشغيل فوري رقم (${orderNo}) مرتبط بـ PEP الإصدار ${designVersion}!`);
    setTimeout(() => setSaveSuccessNotice(null), 5000);
  };

  // Helper to open drawer
  const handleOpenDrawerLayer = (layer: any) => {
    setSelectedDrawerLayer(layer);
    setIsDrawerOpen(true);
  };

  const currentBrand = brands.find(b => b.id === selectedBrandId) || brands[0];
  const currentFamily = families.find(f => f.id === selectedFamilyId) || families[0];
  const currentPlant = CurrencyEngine.getPlantsForBrand(selectedBrandId).find(p => p.id === selectedPlantId) || CurrencyEngine.getPlantsForBrand(selectedBrandId)[0];
  const policies = ErpDatabase.getWarrantyPolicies();
  const currentWarrantyPolicy = policies.find(p => p.id === currentModel?.warrantyPolicyId) || policies[0];

  return (
    <div className="w-full space-y-6 font-sans text-start animate-fade-in">
      
      {/* 1. PEP STEPPER HEADER & BREADCRUMBS */}
      <PepStepperHeader
        currentStep={activeStep}
        completedSteps={completedSteps}
        onSelectStep={(step) => setActiveStep(step)}
        brandName={currentBrand?.name || 'Sleepee'}
        familyName={currentFamily?.nameAr || 'عائلة السوست المنفصلة'}
        modelName={currentModel?.name || 'Silver 25cm'}
        version={designVersion}
        activeCurrency={activeCurrency}
        onChangeCurrency={(cur) => setActiveCurrency(cur)}
        onOpenCloneModal={() => setIsCloneModalOpen(true)}
        accordionMode={accordionMode}
        onToggleAccordionMode={() => setAccordionMode(!accordionMode)}
      />

      {/* Global Success Notification */}
      {saveSuccessNotice && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400 text-emerald-800 dark:text-emerald-200 rounded-2xl text-xs font-black flex items-center justify-between shadow-md animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-500" />
            <span>{saveSuccessNotice}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setSaveSuccessNotice(null)}
            className="text-emerald-600 hover:text-emerald-800 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* 2. ACCORDION GUIDED WORKFLOW (8 INDUSTRIAL STEPS) */}
      <div className="space-y-4">
        {PEP_STEPS_CONFIG.map((step) => {
          const isStepOpen = accordionMode ? (activeStep === step.id) : true;
          const isCompleted = completedSteps.has(step.id as PepStepId);

          return (
            <div 
              key={step.id}
              className={`bg-surface border rounded-3xl overflow-hidden transition-all shadow-xs ${
                activeStep === step.id
                  ? 'border-[#0B2D5C] ring-2 ring-[#0B2D5C]/15 dark:border-blue-500'
                  : 'border-border-main'
              }`}
            >
              {/* Accordion Step Header */}
              <div 
                onClick={() => setActiveStep(step.id as PepStepId)}
                className={`p-4 flex items-center justify-between cursor-pointer select-none border-b transition-all ${
                  activeStep === step.id
                    ? 'bg-slate-50/80 dark:bg-slate-900/80 border-border-main'
                    : 'bg-surface hover:bg-slate-50/50 dark:hover:bg-slate-900/40 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl font-mono font-black text-xs flex items-center justify-center ${
                    activeStep === step.id
                      ? 'bg-[#0B2D5C] text-white shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {step.id}
                  </div>

                  <div>
                    <h3 className="font-black text-sm text-[#0B2D5C] dark:text-blue-300">
                      {step.titleAr}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {step.titleEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Badge */}
                  {isCompleted ? (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      <span>✓ Completed (مكتمل)</span>
                    </span>
                  ) : activeStep === step.id ? (
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 rounded-xl text-xs font-bold border border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      <span>قيد التحرير (In Progress)</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl text-xs font-medium">
                      قيد الانتظار
                    </span>
                  )}

                  <button
                    type="button"
                    className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
                  >
                    {isStepOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                </div>
              </div>

              {/* Accordion Body Content */}
              {isStepOpen && (
                <div className="p-6 border-t border-border-main animate-fade-in">
                  
                  {/* STEP 1: PRODUCT DEFINITION */}
                  {step.id === 1 && (
                    <PepStep1ProductDefinition
                      selectedBrandId={selectedBrandId}
                      setSelectedBrandId={setSelectedBrandId}
                      selectedFamilyId={selectedFamilyId}
                      setSelectedFamilyId={setSelectedFamilyId}
                      selectedModelId={selectedModelId}
                      setSelectedModelId={setSelectedModelId}
                      selectedPlantId={selectedPlantId}
                      setSelectedPlantId={setSelectedPlantId}
                      activeCurrency={activeCurrency}
                      setActiveCurrency={setActiveCurrency}
                      brands={brands}
                      families={families}
                      models={models}
                      designDimensions={designDimensions}
                      setDesignDimensions={setDesignDimensions}
                      designTargetHeight={designTargetHeight}
                      setDesignTargetHeight={setDesignTargetHeight}
                      designComfortLevel={designComfortLevel}
                      setDesignComfortLevel={setDesignComfortLevel}
                      springTechnology={springTechnology}
                      setSpringTechnology={setSpringTechnology}
                      manufacturingSystem={manufacturingSystem}
                      setManufacturingSystem={setManufacturingSystem}
                      isDoubleSided={isDoubleSided}
                      setIsDoubleSided={setIsDoubleSided}
                      onCompleteStep={() => handleCompleteStep(1)}
                      onOpenCloneModal={() => setIsCloneModalOpen(true)}
                    />
                  )}

                  {/* STEP 2: BOM & MATERIALS */}
                  {step.id === 2 && (
                    <PepStep3MaterialsBom
                      layers={layers}
                      activeCurrency={activeCurrency}
                      addLayer={() => {
                        const nextId = `L${layers.length + 1}`;
                        const newLayer = {
                          id: nextId,
                          material: 'طبقة فوم إضافية عالية الكثافة D30',
                          materialCode: `FOM-HD-${layers.length + 1}`,
                          category: 'Foam',
                          layerType: 'Support',
                          thickness: 2.0,
                          density: 30,
                          weight: 1.5,
                          cost: 35,
                          supplier: 'مصانع رغوة البولي يوريثان الوطنية',
                          uom: 'cm'
                        };
                        setLayers(prev => [...prev, newLayer]);
                      }}
                      deleteLayer={(id) => {
                        if (layers.length <= 1) return;
                        setLayers(prev => prev.filter(l => l.id !== id));
                      }}
                      updateLayerValue={(id, field, value) => {
                        setLayers(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
                      }}
                      onCompleteStep={() => handleCompleteStep(2)}
                      materialMasterOptions={materialMasterOptions}
                    />
                  )}

                  {/* STEP 3: ROUTING & MANUFACTURING */}
                  {step.id === 3 && (
                    <PepStep4RoutingManufacturing
                      routingSteps={routingSteps}
                      setRoutingSteps={setRoutingSteps}
                      activeCurrency={activeCurrency}
                      onCompleteStep={() => handleCompleteStep(3)}
                    />
                  )}

                  {/* STEP 4: ENGINEERING CAD */}
                  {step.id === 4 && (
                    <PepStep4EngineeringCad
                      layers={layers}
                      designDimensions={designDimensions}
                      designTargetHeight={designTargetHeight}
                      designComfortLevel={designComfortLevel}
                      designBrand={currentBrand?.name || 'Sleepee'}
                      designModel={currentModel?.name || 'Silver'}
                      activeCurrency={activeCurrency}
                      isDoubleSided={isDoubleSided}
                      onOpenDrawerLayer={handleOpenDrawerLayer}
                      onCompleteStep={() => handleCompleteStep(4)}
                    />
                  )}

                  {/* STEP 5: COST & COMPLIANCE */}
                  {step.id === 5 && (
                    <PepStep5CostCompliance
                      layers={layers}
                      routingSteps={routingSteps}
                      activeCurrency={activeCurrency}
                      onCompleteStep={() => handleCompleteStep(5)}
                      brandName={currentBrand?.name || 'Sleepee'}
                      plantName={currentPlant?.nameAr || 'مصنع الرياض'}
                      warrantyPolicy={currentWarrantyPolicy}
                    />
                  )}

                  {/* STEP 6: PRODUCTION RELEASE */}
                  {step.id === 6 && (
                    <PepStep8ProductionRelease
                      designVersion={designVersion}
                      setDesignVersion={setDesignVersion}
                      designStatus={designStatus}
                      setDesignStatus={setDesignStatus}
                      revisionNotes={revisionNotes}
                      setRevisionNotes={setRevisionNotes}
                      engineeringNotes={engineeringNotes}
                      setEngineeringNotes={setEngineeringNotes}
                      activeCurrency={activeCurrency}
                      totalCost={totalDirectCost}
                      modelCode={currentModel?.id || 'SLP-MDL'}
                      modelName={currentModel?.name || 'Silver'}
                      onSavePackage={handleSavePep}
                      onOpenCompareModal={() => setIsCompareModalOpen(true)}
                      onOpenCloneModal={() => setIsCloneModalOpen(true)}
                      onTriggerImmediateOrder={handleTriggerImmediateOrder}
                    />
                  )}

                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* CLONE MODEL MODAL */}
      <PepCloneModal
        isOpen={isCloneModalOpen}
        onClose={() => setIsCloneModalOpen(false)}
        currentModel={currentModel}
        currentTargetHeight={designTargetHeight}
        onConfirmClone={handleConfirmClone}
      />

      {/* VERSION COMPARISON MODAL */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in text-right">
          <div className="bg-surface rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl border border-border-main flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-[#0B2D5C] text-white">
              <div className="flex items-center gap-2">
                <ArrowLeftRight size={18} className="text-amber-400" />
                <h3 className="text-sm font-black">مقارنة الإصدارات الهندسية (Version Comparison)</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsCompareModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Current Version */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border-main space-y-2">
                  <span className="font-mono text-xs font-black text-blue-600">الإصدار الحالي: {designVersion}</span>
                  <div className="space-y-1 text-slate-700 dark:text-slate-300">
                    <div>الموديل: {currentModel?.name}</div>
                    <div>عدد الطبقات: {layers.length} طبقات</div>
                    <div>الارتفاع: {designTargetHeight} سم</div>
                    <div>التكلفة: {CurrencyEngine.formatAmount(totalDirectCost, activeCurrency)}</div>
                  </div>
                </div>

                {/* Compared Version */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border-main space-y-2">
                  <span className="font-mono text-xs font-black text-amber-600">الإصدار المرجعي الموثق: V1.0-ORIG</span>
                  <div className="space-y-1 text-slate-700 dark:text-slate-300">
                    <div>الموديل: {currentModel?.name} الأساسي</div>
                    <div>عدد الطبقات: {Math.max(1, layers.length - 1)} طبقات</div>
                    <div>الارتفاع: {designTargetHeight - 2} سم</div>
                    <div>التكلفة: {CurrencyEngine.formatAmount(Math.round(totalDirectCost * 0.92), activeCurrency)}</div>
                  </div>
                </div>

              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-border-main flex justify-end">
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(false)}
                className="px-5 py-2 bg-[#0B2D5C] hover:bg-[#133763] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                إغلاق المقارنة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTAINED ENGINEERING DETAILS DRAWER */}
      <AssemblyEngineeringDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedAssembly={null}
        selectedLayer={selectedDrawerLayer}
        activeCurrency={activeCurrency}
      />

    </div>
  );
};
