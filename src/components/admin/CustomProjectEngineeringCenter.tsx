import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clipboard, Box, Plus, Trash2, Edit3, Save, Layers, Sparkles, Check, 
  CheckCircle2, History, AlertTriangle, RefreshCw, Eye, Ruler, Activity, 
  Wrench, Download, Sparkle, ShoppingBag, FolderTree, ArrowLeft, ArrowRight,
  ChevronDown, ChevronUp, Layers2, EyeOff, CheckSquare, Info
} from 'lucide-react';
import { ErpDatabase } from '../../utils/erpDb';
import { Product, ProductionOrder, BillOfMaterials, BomMaterialLine, Brand } from '../../types/erp';
import { EngineeringRecommendationEngine } from '../../services/engineeringRecommendationEngine';

// Define Interface for Layer Engineering Builder
interface FoamLayer {
  id: string;
  material: 'Memory Foam' | 'HR Foam' | 'Latex' | 'Soft Foam' | 'Hard Foam' | 'Gel Foam' | 'Rebonded Foam';
  thickness: number; // in cm
  density: number; // in kg/m³
}

interface CustomProjectProps {
  products: Product[];
  orders: ProductionOrder[];
  brands: Brand[];
  refreshDbState: () => void;
  setSelectedOrderId: (id: string | null) => void;
}

export const CustomProjectEngineeringCenter: React.FC<CustomProjectProps> = ({
  products,
  orders,
  brands,
  refreshDbState,
  setSelectedOrderId
}) => {
  // Navigation: 'list' | 'editor'
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // ====================================================================
  // SECTION 1 – PROJECT INFORMATION (STATE)
  // ====================================================================
  const [projectName, setProjectName] = useState('');
  const [customer, setCustomer] = useState('');
  const [projectType, setProjectType] = useState<'Hotel' | 'Hospital' | 'Government' | 'Distributor' | 'Retail' | 'Export'>('Hotel');
  const [requiredQuantity, setRequiredQuantity] = useState<number>(100);
  const [targetDeliveryDate, setTargetDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30); // 30 days from now
    return d.toISOString().split('T')[0];
  });
  const [brandId, setBrandId] = useState('SLP');

  // ====================================================================
  // SECTION 2 – PRODUCT DIMENSIONS (STATE)
  // ====================================================================
  const [isCustomDims, setIsCustomDims] = useState(false);
  const [selectedDimPreset, setSelectedDimPreset] = useState('180x200');
  const [customWidth, setCustomWidth] = useState(180);
  const [customLength, setCustomLength] = useState(200);
  const [targetHeight, setTargetHeight] = useState(30);

  // ====================================================================
  // SECTION 3 – SPRING SYSTEM (STATE)
  // ====================================================================
  const [springType, setSpringType] = useState<'Bonnell' | 'Pocket Spring' | 'Micro Pocket' | 'Dual Pocket' | 'No Springs'>('Pocket Spring');
  const [springHeight, setSpringHeight] = useState<number>(18);
  const [wireGauge, setWireGauge] = useState<string>('2.2');

  // ====================================================================
  // SECTION 4 – FOAM ENGINEERING (STATE)
  // ====================================================================
  const [layers, setLayers] = useState<FoamLayer[]>([
    { id: 'layer-1', material: 'Memory Foam', thickness: 4, density: 55 },
    { id: 'layer-2', material: 'HR Foam', thickness: 5, density: 40 },
    { id: 'layer-3', material: 'Hard Foam', thickness: 3, density: 35 }
  ]);

  // ====================================================================
  // SECTION 5 – COMFORT MATERIALS (STATE)
  // ====================================================================
  const [hasFiber, setHasFiber] = useState(true);
  const [fiberThickness, setFiberThickness] = useState(2); // cm
  const [hasFelt, setHasFelt] = useState(true);
  const [feltThickness, setFeltThickness] = useState(1); // cm
  const [hasCottonFelt, setHasCottonFelt] = useState(false);
  const [cottonFeltThickness, setCottonFeltThickness] = useState(1.5); // cm
  const [hasVisco, setHasVisco] = useState(true);
  const [viscoThickness, setViscoThickness] = useState(3); // cm
  const [hasGel, setHasGel] = useState(false);
  const [gelThickness, setGelThickness] = useState(2); // cm

  // ====================================================================
  // SECTION 6 – FABRIC SYSTEM (STATE)
  // ====================================================================
  const [fabricType, setFabricType] = useState('Premium Organic Cotton Knit');
  const [fabricCode, setFabricCode] = useState('FB-ORG-COT-350');
  const [fabricSupplier, setFabricSupplier] = useState('Belgian Textile Mills Ltd');
  const [fabricWeight, setFabricWeight] = useState(350); // g/m²

  // ====================================================================
  // SECTION 8 – AI ASSISTANT (STATE)
  // ====================================================================
  const [aiPrompt, setAiPrompt] = useState('يرجى تصميم مرتبة فندقية فاخرة بمستوى راحة متوسط الليونة، ذات قدرة عالية على تحمل الأوزان ودعم الفقرات، مع مراعاة ميزانية متوسطة لـ 200 غرفة.');
  const [aiTargetComfort, setAiTargetComfort] = useState('Medium Plush');
  const [aiTargetBudget, setAiTargetBudget] = useState('Premium');
  const [aiIsLoading, setAiIsLoading] = useState(false);
  const [aiResponseReasoning, setAiResponseReasoning] = useState<string | null>(null);
  const [aiLogMsg, setAiLogMsg] = useState('');

  // Success screen modal
  const [successData, setSuccessData] = useState<{
    productId: string;
    productCode: string;
    projectName: string;
    bomId: string;
    bomCode: string;
    productionOrderId: string;
    productionOrderCode: string;
    quantity: number;
  } | null>(null);

  // Calculated width and length based on preset vs custom
  const width = useMemo(() => {
    if (!isCustomDims) {
      const parts = selectedDimPreset.split('x');
      return Number(parts[0]) || 180;
    }
    return customWidth;
  }, [isCustomDims, selectedDimPreset, customWidth]);

  const length = useMemo(() => {
    if (!isCustomDims) {
      const parts = selectedDimPreset.split('x');
      return Number(parts[1]) || 200;
    }
    return customLength;
  }, [isCustomDims, selectedDimPreset, customLength]);

  // Calculated live height (sum of all structural elements)
  const calculatedHeight = useMemo(() => {
    let total = 0;
    
    // Top and bottom fabrics / quilts
    total += 3.0; // Fixed quilt allowance

    // Spring height if included
    if (springType !== 'No Springs') {
      total += springHeight;
    }

    // Unlimited foam layers
    layers.forEach(layer => {
      total += layer.thickness;
    });

    // Comfort materials
    if (hasFiber) total += fiberThickness;
    if (hasFelt) total += feltThickness;
    if (hasCottonFelt) total += cottonFeltThickness;
    if (hasVisco) total += viscoThickness;
    if (hasGel) total += gelThickness;

    return Number(total.toFixed(1));
  }, [springType, springHeight, layers, hasFiber, fiberThickness, hasFelt, feltThickness, hasCottonFelt, cottonFeltThickness, hasVisco, viscoThickness, hasGel, gelThickness]);

  // Est. raw material cost in SAR per m² calculated dynamically based on specs
  const estimatedCostPerM2 = useMemo(() => {
    let cost = 0;

    // Spring System
    if (springType === 'Bonnell') cost += 95;
    else if (springType === 'Pocket Spring') cost += 130;
    else if (springType === 'Micro Pocket') cost += 175;
    else if (springType === 'Dual Pocket') cost += 220;

    // Foam Layers
    layers.forEach(l => {
      let rate = 0;
      if (l.material === 'Memory Foam') rate = 14; // per cm thickness
      else if (l.material === 'HR Foam') rate = 11;
      else if (l.material === 'Latex') rate = 22;
      else if (l.material === 'Soft Foam') rate = 8;
      else if (l.material === 'Hard Foam') rate = 9;
      else if (l.material === 'Gel Foam') rate = 18;
      else if (l.material === 'Rebonded Foam') rate = 12;
      cost += rate * l.thickness;
    });

    // Comfort layers
    if (hasFiber) cost += 15;
    if (hasFelt) cost += 12;
    if (hasCottonFelt) cost += 18;
    if (hasVisco) cost += 35;
    if (hasGel) cost += 48;

    // Fabric System
    cost += (fabricWeight / 100) * 12; // Weight-based cost estimate

    return Math.round(cost);
  }, [springType, layers, hasFiber, hasFelt, hasCottonFelt, hasVisco, hasGel, fabricWeight]);

  const totalEstimatedProjectCost = useMemo(() => {
    const areaM2 = (width * length) / 10000;
    return Math.round(estimatedCostPerM2 * areaM2 * requiredQuantity);
  }, [estimatedCostPerM2, width, length, requiredQuantity]);

  // Open the workspace for a new project
  const handleOpenNewProject = () => {
    setSelectedProductId(null);
    setProjectName('');
    setCustomer('');
    setProjectType('Hotel');
    setRequiredQuantity(150);
    setBrandId('SLP');
    setIsCustomDims(false);
    setSelectedDimPreset('180x200');
    setTargetHeight(30);
    setSpringType('Pocket Spring');
    setSpringHeight(18);
    setWireGauge('2.2');
    setLayers([
      { id: 'layer-1', material: 'Memory Foam', thickness: 4, density: 50 },
      { id: 'layer-2', material: 'HR Foam', thickness: 5, density: 35 },
      { id: 'layer-3', material: 'Hard Foam', thickness: 3, density: 40 }
    ]);
    setHasFiber(true);
    setHasFelt(true);
    setHasCottonFelt(false);
    setHasVisco(false);
    setHasGel(false);
    setFabricType('Luxury Jacquard Quilted Fabric');
    setFabricCode('FB-JAC-400');
    setFabricSupplier('Elite Textiles Group');
    setFabricWeight(400);
    setAiResponseReasoning(null);
    setViewMode('editor');
  };

  // Open the workspace to edit an existing project
  const handleEditProject = (prod: Product) => {
    setSelectedProductId(prod.id);
    setProjectName(prod.projectName || '');
    setCustomer(prod.customerName || '');
    setBrandId(prod.brandId);
    setRequiredQuantity(prod.height || 50); // Fallback field helper
    
    // Attempt to parse metadata out of the notes if saved as JSON, or set defaults
    try {
      if (prod.notes && prod.notes.includes('{')) {
        const spec = JSON.parse(prod.notes);
        setProjectType(spec.projectType || 'Hotel');
        setSpringType(spec.springType || 'Pocket Spring');
        setSpringHeight(spec.springHeight || 18);
        setWireGauge(spec.wireGauge || '2.2');
        setLayers(spec.layers || []);
        setHasFiber(spec.hasFiber ?? true);
        setHasFelt(spec.hasFelt ?? true);
        setHasCottonFelt(spec.hasCottonFelt ?? false);
        setHasVisco(spec.hasVisco ?? false);
        setHasGel(spec.hasGel ?? false);
        setFabricType(spec.fabricType || 'Knitted');
        setFabricCode(spec.fabricCode || '');
        setFabricSupplier(spec.fabricSupplier || '');
        setFabricWeight(spec.fabricWeight || 300);
      } else {
        // Fallback for flat strings
        setSpringType(prod.notes?.includes('Pocket') ? 'Pocket Spring' : 'Bonnell');
        setLayers([
          { id: 'l1', material: 'Memory Foam', thickness: 4, density: 50 },
          { id: 'l2', material: 'HR Foam', thickness: 15, density: 35 }
        ]);
      }
    } catch {
      setSpringType('Pocket Spring');
    }

    setCustomWidth(prod.width);
    setCustomLength(prod.length);
    setIsCustomDims(true);
    setTargetHeight(prod.height);
    setViewMode('editor');
  };

  // Unlimited Layer Builder controls
  const handleAddLayer = () => {
    const newLayer: FoamLayer = {
      id: `layer-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      material: 'HR Foam',
      thickness: 3,
      density: 35
    };
    setLayers([...layers, newLayer]);
  };

  const handleRemoveLayer = (id: string) => {
    setLayers(layers.filter(l => l.id !== id));
  };

  const handleUpdateLayer = (id: string, field: keyof FoamLayer, value: any) => {
    setLayers(layers.map(l => {
      if (l.id === id) {
        return { ...l, [field]: value };
      }
      return l;
    }));
  };

  const handleMoveLayer = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === layers.length - 1) return;

    const newLayers = [...layers];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newLayers[index];
    newLayers[index] = newLayers[targetIndex];
    newLayers[targetIndex] = temp;
    setLayers(newLayers);
  };

  // ====================================================================
  // SECTION 8 – INDUSTRIAL ENGINEERING DESIGN (SLEEPEE R&D ENGINE)
  // ====================================================================
  const handleDesignWithAI = () => {
    setAiIsLoading(true);
    setAiLogMsg('جاري استدعاء محرك القواعد الهندسية Sleepee R&D...');
    
    try {
      const rec = EngineeringRecommendationEngine.generateRecommendation({
        targetHeight: calculatedHeight || 28,
        targetComfort: aiTargetComfort,
        targetBudget: aiTargetBudget,
        targetMarket: projectType === 'Hospital' ? 'Medical' : projectType
      });

      // Populate spring system based on suggestion
      const aiSpring = rec.recommendedSpringType || 'Pocket Spring';
      if (aiSpring.toLowerCase().includes('pocket') && aiSpring.toLowerCase().includes('micro')) {
        setSpringType('Micro Pocket');
      } else if (aiSpring.toLowerCase().includes('pocket') && aiSpring.toLowerCase().includes('dual')) {
        setSpringType('Dual Pocket');
      } else if (aiSpring.toLowerCase().includes('pocket')) {
        setSpringType('Pocket Spring');
      } else if (aiSpring.toLowerCase().includes('bonnell')) {
        setSpringType('Bonnell');
      } else if (aiSpring.toLowerCase().includes('none') || aiSpring.toLowerCase().includes('no ')) {
        setSpringType('No Springs');
      } else {
        setSpringType('Pocket Spring');
      }

      // Set foam layers from the results
      if (rec.layers && Array.isArray(rec.layers)) {
        const mappedLayers: FoamLayer[] = rec.layers
          .filter((l: any) => {
            const mat = l.material?.toLowerCase();
            return mat.includes('foam') || mat.includes('latex');
          })
          .map((l: any, index: number) => {
            let material: FoamLayer['material'] = 'HR Foam';
            const mat = l.material?.toLowerCase();
            if (mat.includes('memory') && mat.includes('gel')) material = 'Gel Foam';
            else if (mat.includes('memory')) material = 'Memory Foam';
            else if (mat.includes('hr')) material = 'HR Foam';
            else if (mat.includes('latex')) material = 'Latex';
            else if (mat.includes('soft')) material = 'Soft Foam';
            else if (mat.includes('hard') || mat.includes('support')) material = 'Hard Foam';
            else if (mat.includes('rebonded') || mat.includes('medical')) material = 'Rebonded Foam';
            
            return {
              id: `eng-layer-${index}-${Date.now()}`,
              material,
              thickness: l.thickness || 3,
              density: l.density || 35
            };
          });
        
        if (mappedLayers.length > 0) {
          setLayers(mappedLayers);
        }
      }

      // Check for specific comfort features in layers
      const aiLayersStr = JSON.stringify(rec.layers || {}).toLowerCase();
      setHasVisco(aiLayersStr.includes('visco') || aiLayersStr.includes('memory'));
      setHasGel(aiLayersStr.includes('gel'));
      setHasFiber(aiLayersStr.includes('fiber') || aiLayersStr.includes('quilt'));
      setHasFelt(aiLayersStr.includes('felt'));

      // Populate Fabric based on recommendation
      if (rec.recommendedFabric) {
        setFabricType(rec.recommendedFabric);
        if (rec.recommendedFabric.toLowerCase().includes('tencel')) {
          setFabricCode('FB-TNC-320');
          setFabricWeight(320);
        } else if (rec.recommendedFabric.toLowerCase().includes('organic')) {
          setFabricCode('FB-ORG-400');
          setFabricWeight(400);
        } else {
          setFabricCode('FB-KNIT-280');
          setFabricWeight(280);
        }
      }

      setAiResponseReasoning(rec.reasoning);
      setAiLogMsg('تم توليد الهيكل الإنشائي الميكانيكي بنجاح وفق معايير الجودة الصناعية!');
    } catch (err) {
      console.error(err);
      setAiLogMsg('حدث خطأ أثناء احتساب المواصفات الهندسية.');
    } finally {
      setAiIsLoading(false);
    }
  };

  // ====================================================================
  // SECTION 9 – PROJECT TO PRODUCTION (1-CLICK ACTIVATE)
  // ====================================================================
  const handleApproveAndLaunchProduction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !customer.trim()) {
      alert('يرجى التأكد من ملء الحقول الأساسية: اسم المشروع واسم العميل.');
      return;
    }

    // Save metadata structure in JSON form as notes to persist exact specs
    const engineeringNotesObj = {
      projectType,
      springType,
      springHeight,
      wireGauge,
      layers,
      hasFiber,
      fiberThickness,
      hasFelt,
      feltThickness,
      hasCottonFelt,
      cottonFeltThickness,
      hasVisco,
      viscoThickness,
      hasGel,
      gelThickness,
      fabricType,
      fabricCode,
      fabricSupplier,
      fabricWeight,
      calculatedHeight,
      estimatedCostPerM2,
      aiDesigned: !!aiResponseReasoning
    };

    const notesJson = JSON.stringify(engineeringNotesObj);

    // 1. Add Product to Database
    const newProduct = ErpDatabase.addProduct({
      productType: 'custom',
      projectName: projectName.trim(),
      customerName: customer.trim(),
      modelName: `${projectName.trim()} Spec`,
      categoryId: 'MAT',
      modelId: 'CUSTOM',
      sizeId: 'CUSTOM',
      brandId: brandId,
      manufacturingSystem: 'American',
      width,
      length,
      height: calculatedHeight,
      notes: notesJson,
      internalProductCode: `PRJ-${brandId}-${Date.now().toString().slice(-4)}`,
      warrantyPolicyId: 'POL-10Y',
      status: 'active'
    });

    // 2. Generate Project Bill of Materials (BOM)
    const bomMaterialsList: BomMaterialLine[] = [];
    const areaM2 = (width * length) / 10000;

    // Outer fabric
    bomMaterialsList.push({
      id: `BM-F-${Date.now()}`,
      materialCode: fabricCode,
      materialName: `قماش فاخر: ${fabricType}`,
      quantity: Number((areaM2 * 2.2).toFixed(2)),
      unit: 'm',
      notes: `تغطية علوية وسفلية للمشروع (${fabricSupplier})`
    });

    // Springs if included
    if (springType !== 'No Springs') {
      bomMaterialsList.push({
        id: `BM-S-${Date.now()}`,
        materialCode: `SP-${springType.slice(0, 3).toUpperCase()}`,
        materialName: `شاسيه سوست ${springType} ارتفاع ${springHeight}سم`,
        quantity: requiredQuantity,
        unit: 'set',
        notes: `شاسيه سوست معالج بالحرارة سمك السلك ${wireGauge}مم`
      });
    }

    // Foams from visual builder
    layers.forEach((l, idx) => {
      bomMaterialsList.push({
        id: `BM-FOAM-${idx}-${Date.now()}`,
        materialCode: `FM-${l.material.slice(0, 3).toUpperCase()}-${l.density}`,
        materialName: `إسفنج ${l.material} كثافة ${l.density} كجم/م³`,
        quantity: Number((areaM2 * (l.thickness / 100)).toFixed(3)),
        unit: 'm2',
        notes: `طبقة إسفنج بنيوية سمك ${l.thickness}سم`
      });
    });

    // Comfort Materials
    if (hasFiber) {
      bomMaterialsList.push({
        id: `BM-CM-FIB-${Date.now()}`,
        materialCode: 'MAT-FIB-01',
        materialName: 'فايبر رول معالج للوجه الخارجي',
        quantity: Number((areaM2 * 1.1).toFixed(2)),
        unit: 'm',
        notes: `حشو وجه الكابوتونيه سمك ${fiberThickness}سم`
      });
    }

    if (hasFelt) {
      bomMaterialsList.push({
        id: `BM-CM-FLT-${Date.now()}`,
        materialCode: 'MAT-FLT-01',
        materialName: 'لباد صناعي عازل صلب',
        quantity: Number((areaM2 * 2).toFixed(2)),
        unit: 'm2',
        notes: `عزل الشاسيه السوست من الأعلى والأسفل سمك ${feltThickness}سم`
      });
    }

    // Add BOM to DB
    const newBOM = ErpDatabase.addBOM({
      bomName: `شجرة مواد مشروع: ${projectName.trim()} (BOM)`,
      brandId: brandId,
      familyId: 'FAM-CUSTOM',
      modelId: 'CUSTOM',
      version: 'v1.0-PROJECT',
      status: 'Active',
      materials: bomMaterialsList,
      createdBy: 'مهندس جودة وتطوير الإنتاج',
      notes: `قائمة مواد معتمدة هندسياً لمناقصة/مشروع العميل: ${customer.trim()}`
    });

    // 3. Generate Production Order
    const currentYear = new Date().getFullYear();
    const batchId = `BATCH-${currentYear}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = ErpDatabase.addProductionOrder({
      productId: newProduct.id,
      quantity: requiredQuantity,
      productionDate: targetDeliveryDate,
      batchNumber: batchId,
      operator: 'مدير عمليات المشاريع الهندسية والإنتاج',
      notes: `أمر إنتاج لمشروع العميل: ${customer.trim()} (اسم المشروع: ${projectName.trim()}) - معتمد بالكامل وبانتظار بدء التجميع.`,
      status: 'Approved', // Approved in 1-click as requested!
      brandId: brandId
    });

    // Audit logs for compliance
    ErpDatabase.addProductionOrderAudit({
      productionOrderId: newOrder.id,
      fromStatus: 'Draft',
      toStatus: 'Approved',
      action: 'اعتماد التصميم وإصدار أمر تشغيل فوري',
      operator: 'رئيس قسم التطوير والهندسة الصناعية',
      notes: `تم اعتماد الـ BOM رقم ${newBOM.bomNumber} بنجاح، وتوليد نسخة المنتج v1.0 وإصدار أمر التشغيل رقم ${newOrder.productionOrderNumber}`
    });

    ErpDatabase.addAuditLog(
      'HIGHTECH_ENGINEERING_RELEASE',
      `تم اعتماد تصميم مرتبة مشروع "${projectName.trim()}"، وإنشاء قائمة المواد (BOM) رقم ${newBOM.bomNumber}، وتصدير أمر الإنتاج والتشغيل لخط التجميع الفوري برقم ${newOrder.productionOrderNumber}`
    );

    // Save details to show on success screen
    setSuccessData({
      productId: newProduct.id,
      productCode: newProduct.internalProductCode,
      projectName: projectName.trim(),
      bomId: newBOM.id,
      bomCode: newBOM.bomNumber,
      productionOrderId: newOrder.id,
      productionOrderCode: newOrder.productionOrderNumber,
      quantity: requiredQuantity
    });

    refreshDbState();
  };

  const currentProjectProducts = useMemo(() => {
    return products.filter(p => p.productType === 'custom');
  }, [products]);

  return (
    <div className="space-y-4">
      {/* SUCCESS MODAL RELEASE */}
      {successData && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in text-right">
          <div className="bg-surface rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-emerald-500/30 p-6 flex flex-col relative space-y-5">
            <div className="flex flex-col items-center text-center space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-500 animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="font-extrabold text-slate-800 dark:text-text-primary text-base">تم اعتماد التصميم والتحويل للإنتاج بنجاح!</h3>
              <p className="text-xs text-slate-400">تم تحويل المواصفات الهندسية لملفات إنتاج معتمدة في المصنع بلمسة واحدة</p>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">كود المنتج الفريد (Product PIN):</span>
                <span className="font-mono font-bold text-slate-800 dark:text-text-primary">{successData.productCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">اسم المشروع والجهة:</span>
                <span className="font-bold text-slate-800 dark:text-text-primary">{successData.projectName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-600 font-bold">قائمة المواد المتولدة (BOM):</span>
                <span className="font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-md">{successData.bomCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-600 font-bold">نسخة الإنتاج (Product Version):</span>
                <span className="font-mono font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-0.5 rounded-md">v1.0-PROJECT</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-bold">أمر تشغيل الإنتاج الفوري:</span>
                <span className="font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 rounded-md">{successData.productionOrderCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-indigo-600 font-bold">مسار التوجيه الصناعي (Routing):</span>
                <span className="font-mono font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-0.5 rounded-md">RT-2026-{successData.productCode.slice(-4)} (معتمد)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-teal-600 font-bold">توليد متطلبات المواد (Material Req.):</span>
                <span className="font-mono font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/50 px-2.5 py-0.5 rounded-md">MR-2026-{successData.productCode.slice(-4)} (محلل وصادر)</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-2.5 mt-1.5">
                <span className="text-slate-500 font-bold">الكمية المقررة للتصنيع:</span>
                <span className="font-mono font-extrabold text-sm text-slate-800 dark:text-text-primary">{successData.quantity} قطعة مرتبة</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedOrderId(successData.productionOrderId);
                  setSuccessData(null);
                  setViewMode('list');
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-lg cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                <Activity size={14} />
                <span>متابعة خط التجميع والأوردر</span>
              </button>
              <button
                onClick={() => {
                  setSuccessData(null);
                  setViewMode('list');
                }}
                className="px-5 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'list' ? (
        // ====================================================================
        // VIEW A: PROJECTS DASHBOARD & ARCHIVE
        // ====================================================================
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 border border-border-main rounded-2xl">
            <div>
              <h3 className="font-black text-[#0B2D5C] dark:text-text-primary text-sm flex items-center gap-2">
                <Wrench className="text-purple-600" size={18} />
                <span>مركز هندسة وتطوير المشاريع الخاصة والمناقصات (Engineering Request Center)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">سجل إدارة ومواءمة طلبات التصنيع المخصصة للفنادق والمستشفيات والجهات الحكومية والمصدرين.</p>
            </div>

            <button
              onClick={handleOpenNewProject}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Plus size={14} />
              <span>هندسة مشروع جديد مع AI</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 bg-purple-50/50 dark:bg-purple-950/10 border border-purple-200/50 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-700">
                <FolderTree size={20} />
              </div>
              <div>
                <div className="text-[10px] text-slate-400">إجمالي المشاريع المبتكرة</div>
                <div className="font-mono text-lg font-black text-purple-800 dark:text-purple-400">{currentProjectProducts.length} مشروع خاص</div>
              </div>
            </div>

            <div className="p-4 bg-blue-50/50 dark:bg-blue-950/10 border border-blue-200/50 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700">
                <ShoppingBag size={20} />
              </div>
              <div>
                <div className="text-[10px] text-slate-400">إجمالي كمية أوامر التشغيل</div>
                <div className="font-mono text-lg font-black text-blue-800 dark:text-blue-400">
                  {orders.filter(o => products.find(p => p.id === o.productId)?.productType === 'custom').reduce((sum, o) => sum + o.quantity, 0)} قطعة مرتبة
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-200/50 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="text-[10px] text-slate-400">شجرة المواد المعتمدة (BOM)</div>
                <div className="font-mono text-lg font-black text-emerald-800 dark:text-emerald-400">قوائم تجميع فورية</div>
              </div>
            </div>
          </div>

          <div className="border border-border-main rounded-2xl overflow-hidden bg-surface shadow-xs">
            <div className="p-4 bg-slate-50 dark:bg-surface border-b border-border-main flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-600 dark:text-text-primary">مصفوفة تتبع هندسة المشروعات والمناقصات</span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">نظام العمليات الحية</span>
            </div>
            
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-surface text-slate-500 font-bold border-b border-border-main">
                <tr>
                  <th className="p-3.5">اسم المشروع</th>
                  <th className="p-3.5">العميل والجهة المستلمة</th>
                  <th className="p-3.5">نوع المشروع</th>
                  <th className="p-3.5">الأبعاد والهيكل</th>
                  <th className="p-3.5">الكمية المقررة</th>
                  <th className="p-3.5 text-center">حالة الـ BOM والإنتاج</th>
                  <th className="p-3.5 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {currentProjectProducts.map(p => {
                  const linkedOrders = orders.filter(o => o.productId === p.id);
                  const orderQty = linkedOrders.reduce((sum, o) => sum + o.quantity, 0) || p.height || 50;

                  // Parse json metadata to extract specs info
                  let isAiConfigured = false;
                  let typeBadge = 'مخصص';
                  try {
                    if (p.notes && p.notes.includes('{')) {
                      const metadata = JSON.parse(p.notes);
                      isAiConfigured = !!metadata.aiDesigned;
                      typeBadge = metadata.projectType || 'مخصص';
                    }
                  } catch {
                    // Ignore parsing error
                  }

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 font-bold text-purple-700">
                        <div className="flex items-center gap-1.5">
                          <span>{p.projectName || 'مشروع مخصص'}</span>
                          {isAiConfigured && (
                            <span className="text-[9px] bg-purple-50 text-purple-600 border border-purple-200 px-1.5 py-0.2 rounded-md font-bold flex items-center gap-0.5">
                              <Sparkle size={8} /> AI Specs
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 font-bold text-slate-800 dark:text-text-primary">{p.customerName || '—'}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-[10px]">
                          {typeBadge === 'Hotel' ? '🏨 فندقي' :
                           typeBadge === 'Hospital' ? '🏥 طبي ومستشفيات' :
                           typeBadge === 'Government' ? '🏛️ حكومي ومناقصات' :
                           typeBadge === 'Distributor' ? '📦 موزع معتمد' :
                           typeBadge === 'Retail' ? '🛍️ بيع بالتجزئة' : '✈️ تصدير خارجي'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-blue-600">{p.width} × {p.length} × {p.height} سم</div>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-800 dark:text-text-primary">{orderQty} مرتبة</td>
                      <td className="p-3.5 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-black">
                            ✓ BOM متولد وتلقائي
                          </span>
                          <span className="text-[9px] text-slate-400">الإصدار v1.0-PROJECT</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleEditProject(p)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer"
                            title="تعديل المواصفات الهندسية"
                          >
                            <Edit3 size={13} />
                          </button>
                          
                          {linkedOrders.length > 0 ? (
                            <button
                              onClick={() => setSelectedOrderId(linkedOrders[0].id)}
                              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-black cursor-pointer shadow-xs"
                            >
                              متابعة الإنتاج ({linkedOrders[0].productionOrderNumber})
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                const currentYear = new Date().getFullYear();
                                const batchId = `BATCH-${currentYear}-${Math.floor(100000 + Math.random() * 900000)}`;
                                const o = ErpDatabase.addProductionOrder({
                                  productId: p.id,
                                  quantity: orderQty,
                                  productionDate: new Date().toISOString().split('T')[0],
                                  batchNumber: batchId,
                                  operator: 'مشرف تشغيل المشاريع',
                                  notes: `تشغيل خط إنتاج فوري للمشروع الخاص ${p.projectName}`,
                                  status: 'Draft',
                                  brandId: p.brandId
                                });
                                refreshDbState();
                                setSelectedOrderId(o.id);
                              }}
                              className="px-2.5 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-[10px] font-black cursor-pointer border border-purple-200"
                            >
                              إطلاق خط تصنيع فوري
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {currentProjectProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-400 font-bold space-y-2">
                      <Ruler className="mx-auto text-slate-300" size={32} />
                      <div>لا توجد مشاريع مخصصة مسجلة هندسياً حالياً.</div>
                      <div className="text-[11px] font-normal text-slate-400">اضغط على زر "هندسة مشروع جديد مع AI" للبدء في تجميع الطبقات فورياً.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // ====================================================================
        // VIEW B: PRODUCT ENGINEERING REQUEST WORKSPACE (SECTIONS 1 TO 9)
        // ====================================================================
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 border border-border-main rounded-2xl">
            <button
              onClick={() => setViewMode('list')}
              className="px-3.5 py-1.5 bg-surface hover:bg-slate-100 border border-border-main rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft size={14} />
              <span>العودة للوحة المشاريع والطلبيات</span>
            </button>

            <div className="text-right">
              <h3 className="font-black text-[#0B2D5C] dark:text-text-primary text-sm">
                {selectedProductId ? 'تعديل ومواءمة المواصفات الهندسية للمشروع' : 'منصة هندسة طبقات ومواد المشاريع الخاصة (Workspace)'}
              </h3>
              <p className="text-[10px] text-slate-400">إدارة البنية البنيوية للمرتبة وصياغة الـ BOM وتوليد خط تشغيل مصنعي متكامل.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* ====================================================================
                LEFT COLUMN: SECTION 7 – LIVE PRODUCT DRAWING
                ==================================================================== */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-4 h-fit">
              <div className="bg-[#0B2D5C] text-white rounded-3xl border border-blue-900 p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-blue-800 pb-3">
                  <span className="text-[10px] bg-blue-800/80 px-2 py-0.5 rounded-full font-mono text-blue-300">Section 7: Live Drawing</span>
                  <h4 className="text-xs font-black flex items-center gap-1.5">
                    <Activity size={14} className="text-emerald-400 animate-pulse" />
                    <span>الرسم الهندسي المباشر للقطاع العرضي (Cross-Section)</span>
                  </h4>
                </div>

                {/* VISUAL MATTRESS DRAWING STACK */}
                <div className="relative border-4 border-slate-700/80 rounded-2xl p-4 bg-slate-950 overflow-hidden min-h-[350px] flex flex-col justify-between">
                  
                  {/* Mattress Fabric Cover (Top Side) */}
                  <div className="h-6 rounded-t-lg bg-slate-100 text-slate-800 text-[10px] font-black flex items-center justify-between px-3 border border-slate-300 animate-pulse">
                    <span>🛏️ الوجه الخارجي: {fabricType.slice(0, 30)}...</span>
                    <span>{fabricWeight} g/m²</span>
                  </div>

                  {/* Dynamic Comfort & Foam layers stack */}
                  <div className="flex-1 flex flex-col justify-center py-2 space-y-1">
                    
                    {/* Fiber Quilt Layer */}
                    {hasFiber && (
                      <div className="bg-amber-100 text-amber-800 font-bold border border-amber-300 rounded-md text-[9px] flex items-center justify-between px-3 h-5" style={{ opacity: 0.9 }}>
                        <span>فايبر رول مدمج (Fiber Quilt)</span>
                        <span className="font-mono text-[9px]">{fiberThickness} سم</span>
                      </div>
                    )}

                    {/* Visco Comfort Topper */}
                    {hasVisco && (
                      <div className="bg-pink-100 text-pink-800 font-bold border border-pink-300 rounded-md text-[9px] flex items-center justify-between px-3 h-5" style={{ opacity: 0.9 }}>
                        <span>طبقة فيسكو رغوية (Visco Foam Topper)</span>
                        <span className="font-mono text-[9px]">{viscoThickness} سم</span>
                      </div>
                    )}

                    {/* Cold Gel layer */}
                    {hasGel && (
                      <div className="bg-cyan-100 text-cyan-800 font-bold border border-cyan-300 rounded-md text-[9px] flex items-center justify-between px-3 h-5" style={{ opacity: 0.9 }}>
                        <span>طبقة هلام جل بارد مبرد (Cool Gel)</span>
                        <span className="font-mono text-[9px]">{gelThickness} سم</span>
                      </div>
                    )}

                    {/* Unlimited custom foams */}
                    {layers.map((layer, index) => {
                      let bg = 'bg-blue-100 text-blue-800 border-blue-300';
                      if (layer.material === 'Memory Foam') bg = 'bg-purple-100 text-purple-800 border-purple-300';
                      else if (layer.material === 'Latex') bg = 'bg-yellow-100 text-yellow-800 border-yellow-300';
                      else if (layer.material === 'Hard Foam') bg = 'bg-slate-300 text-slate-800 border-slate-400';
                      else if (layer.material === 'Rebonded Foam') bg = 'bg-amber-200 text-amber-800 border-amber-400';
                      else if (layer.material === 'Soft Foam') bg = 'bg-sky-100 text-sky-800 border-sky-300';
                      else if (layer.material === 'Gel Foam') bg = 'bg-teal-100 text-teal-800 border-teal-300';

                      return (
                        <div key={layer.id} className={`${bg} font-black border rounded-md text-[10px] flex items-center justify-between px-3`} style={{ height: `${Math.max(16, layer.thickness * 4.5)}px` }}>
                          <span className="flex items-center gap-1">
                            <Layers2 size={10} />
                            <span>طبقة {index + 1}: إسفنج {layer.material} ({layer.density}kg)</span>
                          </span>
                          <span className="font-mono font-bold">{layer.thickness} سم</span>
                        </div>
                      );
                    })}

                    {/* Springs / Coil system core */}
                    {springType !== 'No Springs' ? (
                      <div className="bg-slate-900 border-y-2 border-dashed border-blue-400/50 p-2 flex flex-col justify-center rounded-lg space-y-1 relative" style={{ height: `${Math.max(60, springHeight * 3.5)}px` }}>
                        
                        {/* Dynamic decorative coils */}
                        <div className="flex justify-around items-center opacity-60 text-blue-300">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="w-5 h-full flex flex-col justify-between items-center py-1 border-2 border-slate-500 rounded-full animate-pulse">
                              <span className="text-[6px]">🌀</span>
                            </div>
                          ))}
                        </div>

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-slate-950/70 z-10 px-2 rounded-lg">
                          <span className="text-[10px] font-black text-blue-400 flex items-center gap-1">
                            <span>🌀 شاسيه سوست ({springType})</span>
                          </span>
                          <span className="text-[8px] text-slate-300 font-mono">ارتفاع: {springHeight} سم | سلك: {wireGauge} مم</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-900 text-slate-400 border border-dashed border-slate-700 py-3 rounded-lg text-center font-bold text-[10px] h-12 flex items-center justify-center">
                        🚫 لا يوجد شاسيه سوست داخلي (مرتبة إسفنجية بالكامل)
                      </div>
                    )}

                    {/* Felt insulator layers */}
                    {hasFelt && (
                      <div className="bg-slate-600 text-slate-200 font-bold border border-slate-500 rounded-md text-[9px] flex items-center justify-between px-3 h-4" style={{ opacity: 0.9 }}>
                        <span>لباد صلب عازل للوجهين (Hard Felt)</span>
                        <span className="font-mono text-[9px]">{feltThickness} سم</span>
                      </div>
                    )}

                    {/* Cotton felt comfort layer */}
                    {hasCottonFelt && (
                      <div className="bg-orange-100 text-orange-800 font-bold border border-orange-300 rounded-md text-[9px] flex items-center justify-between px-3 h-4" style={{ opacity: 0.9 }}>
                        <span>لباد قطني طبيعي (Cotton Felt)</span>
                        <span className="font-mono text-[9px]">{cottonFeltThickness} سم</span>
                      </div>
                    )}

                  </div>

                  {/* Bottom quilt fabric cover */}
                  <div className="h-5 rounded-b-lg bg-slate-200 text-slate-700 text-[9px] font-bold flex items-center justify-center border border-slate-300">
                    <span>قماش الغلق السفلي المعالج (Quilted Bottom Cover)</span>
                  </div>

                </div>

                {/* STATS MATRIX SUMMARY */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-blue-950/50 rounded-2xl border border-blue-900 flex flex-col">
                    <span className="text-slate-400 text-[10px]">الارتفاع البنيوي الكلي (BOM)</span>
                    <span className="text-lg font-black font-mono text-emerald-400 mt-1">{calculatedHeight} سم</span>
                    <span className="text-[9px] text-slate-400">الارتفاع المعتمد للتصنيع</span>
                  </div>

                  <div className="p-3 bg-blue-950/50 rounded-2xl border border-blue-900 flex flex-col">
                    <span className="text-slate-400 text-[10px]">الوزن الإرشادي التقديري</span>
                    <span className="text-lg font-black font-mono text-blue-300 mt-1">
                      {Math.round(((width * length) / 10000) * 11.5)} كجم
                    </span>
                    <span className="text-[9px] text-slate-400">بدون مفرش خارجي</span>
                  </div>
                </div>

                {/* COMMERCIAL PROJECTIONS AND COST */}
                <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold">التكلفة الإرشادية للمواد الخام / م²:</span>
                    <span className="font-mono font-black text-yellow-400">{estimatedCostPerM2} ريال سعودي</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-slate-800 pt-2">
                    <span className="text-slate-400 font-bold">إجمالي تكلفة مواد التشغيلة ({requiredQuantity} قطعة):</span>
                    <span className="font-mono font-black text-base text-yellow-500">{totalEstimatedProjectCost.toLocaleString('ar-EG')} ريال سعودي</span>
                  </div>
                </div>

              </div>
            </div>

            {/* ====================================================================
                RIGHT COLUMN: ENGINEERING CONTROLS SECTION 1-6 & 8-9
                ==================================================================== */}
            <div className="lg:col-span-7 space-y-4">
              
              <form onSubmit={handleApproveAndLaunchProduction} className="space-y-4">
                
                {/* ====================================================================
                    SECTION 1 – PROJECT INFORMATION
                    ==================================================================== */}
                <div className="p-5 bg-surface border border-border-main rounded-3xl space-y-4 shadow-2xs">
                  <h4 className="text-xs font-black text-slate-700 dark:text-text-primary border-b pb-2 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-lg bg-purple-50 text-purple-700 font-mono text-[10px] font-black flex items-center justify-center">1</span>
                    <span>معلومات العميل والجهة المستلمة للمشروع (Project Info)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-slate-500 font-bold text-[11px]">اسم المشروع أو المناقصة *</label>
                      <input
                        type="text"
                        required
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="مثال: فندق موفنبيك الرياض"
                        className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold outline-none text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-500 font-bold text-[11px]">العميل والمستلم المباشر *</label>
                      <input
                        type="text"
                        required
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                        placeholder="مثال: شركة الحكير للسياحة"
                        className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="block text-slate-500 font-bold text-[11px]">نوع طلب المشروع *</label>
                      <select
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value as any)}
                        className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold outline-none cursor-pointer text-xs"
                      >
                        <option value="Hotel">Hotel (فنادق وضيافة)</option>
                        <option value="Hospital">Hospital (مستشفيات وطبي)</option>
                        <option value="Government">Government (جهات حكومية ومناقصات)</option>
                        <option value="Distributor">Distributor (موزع وتجاري خاص)</option>
                        <option value="Retail">Retail (معارض ومبيعات مخصصة)</option>
                        <option value="Export">Export (تصدير دولي)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-500 font-bold text-[11px]">الكمية الإجمالية المطلوبة (قطع) *</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={requiredQuantity}
                        onChange={(e) => setRequiredQuantity(Number(e.target.value))}
                        className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold font-mono outline-none text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-500 font-bold text-[11px]">تاريخ التسليم والإنتاج المستهدف *</label>
                      <input
                        type="date"
                        required
                        value={targetDeliveryDate}
                        onChange={(e) => setTargetDeliveryDate(e.target.value)}
                        className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1">
                      <label className="block text-slate-500 font-bold text-[11px]">البراند المربوط للترميز واللوغو *</label>
                      <select
                        value={brandId}
                        onChange={(e) => setBrandId(e.target.value)}
                        className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold outline-none cursor-pointer text-xs"
                      >
                        {brands.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* ====================================================================
                    SECTION 2 – PRODUCT DIMENSIONS
                    ==================================================================== */}
                <div className="p-5 bg-surface border border-border-main rounded-3xl space-y-4 shadow-2xs">
                  <h4 className="text-xs font-black text-slate-700 dark:text-text-primary border-b pb-2 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-lg bg-purple-50 text-purple-700 font-mono text-[10px] font-black flex items-center justify-center">2</span>
                    <span>المقاسات والأبعاد البنيوية (Product Dimensions)</span>
                  </h4>

                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-border-main">
                    <input
                      type="checkbox"
                      id="custom_dims_chk"
                      checked={isCustomDims}
                      onChange={(e) => setIsCustomDims(e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                    />
                    <label htmlFor="custom_dims_chk" className="text-xs font-black text-slate-700 dark:text-slate-300 cursor-pointer">
                      تفعيل مقاسات وأبعاد هندسية غير نمطية / مخصصة للمشروع (Allow Custom Dimensions)
                    </label>
                  </div>

                  {!isCustomDims ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-slate-500 font-bold text-[11px]">مقاسات قياسية جاهزة *</label>
                        <select
                          value={selectedDimPreset}
                          onChange={(e) => setSelectedDimPreset(e.target.value)}
                          className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold outline-none cursor-pointer text-xs"
                        >
                          <option value="180x200">180 × 200 سم (جوزي كينج)</option>
                          <option value="200x200">200 × 200 سم (سوبر كينج)</option>
                          <option value="160x200">160 × 200 سم (كوين قياسي)</option>
                          <option value="150x200">150 × 200 سم (كوين صغير)</option>
                          <option value="120x200">120 × 200 سم (نفر ونصف)</option>
                          <option value="90x190">90 × 190 سم (مفرد قياسي)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-slate-500 font-bold text-[11px]">الارتفاع الإرشادي المستهدف (Target Height)</label>
                        <input
                          type="number"
                          value={targetHeight}
                          onChange={(e) => setTargetHeight(Number(e.target.value))}
                          placeholder="الارتفاع المستهدف في العقد"
                          className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold outline-none text-xs"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3 animate-fade-in">
                      <div className="space-y-1">
                        <label className="block text-slate-500 font-bold text-[11px]">العرض بالسم (Width) *</label>
                        <input
                          type="number"
                          required
                          value={customWidth}
                          onChange={(e) => setCustomWidth(Number(e.target.value))}
                          className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold font-mono outline-none text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-slate-500 font-bold text-[11px]">الطول بالسم (Length) *</label>
                        <input
                          type="number"
                          required
                          value={customLength}
                          onChange={(e) => setCustomLength(Number(e.target.value))}
                          className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold font-mono outline-none text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-slate-500 font-bold text-[11px]">الارتفاع بالسم (Height) *</label>
                        <input
                          type="number"
                          required
                          value={targetHeight}
                          onChange={(e) => setTargetHeight(Number(e.target.value))}
                          className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold font-mono outline-none text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* ====================================================================
                    SECTION 3 – SPRING SYSTEM
                    ==================================================================== */}
                <div className="p-5 bg-surface border border-border-main rounded-3xl space-y-4 shadow-2xs">
                  <h4 className="text-xs font-black text-slate-700 dark:text-text-primary border-b pb-2 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-lg bg-purple-50 text-purple-700 font-mono text-[10px] font-black flex items-center justify-center">3</span>
                    <span>نظام السوست وقدرة التحمل الميكانيكي (Spring System)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="block text-slate-500 font-bold text-[11px]">نوع الشاسيه (Spring Type) *</label>
                      <select
                        value={springType}
                        onChange={(e) => setSpringType(e.target.value as any)}
                        className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold outline-none cursor-pointer text-xs"
                      >
                        <option value="Pocket Spring">Pocket Spring (سوست مغلفة منفصلة)</option>
                        <option value="Bonnell">Bonnell Spring (سوست متصلة بونيل)</option>
                        <option value="Micro Pocket">Micro Pocket (سوست دقيقة مرنة جداً)</option>
                        <option value="Dual Pocket">Dual Pocket (سوست هجينة ثنائية الطبقة)</option>
                        <option value="No Springs">No Springs (بدون سوست - مرتبة إسفنجية)</option>
                      </select>
                    </div>

                    {springType !== 'No Springs' && (
                      <>
                        <div className="space-y-1 animate-fade-in">
                          <label className="block text-slate-500 font-bold text-[11px]">ارتفاع شاسيه السوست (سم) *</label>
                          <input
                            type="number"
                            required
                            min={5}
                            max={30}
                            value={springHeight}
                            onChange={(e) => setSpringHeight(Number(e.target.value))}
                            className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold font-mono outline-none text-xs"
                          />
                        </div>

                        <div className="space-y-1 animate-fade-in">
                          <label className="block text-slate-500 font-bold text-[11px]">سمك السلك الفولاذي (Wire Gauge) *</label>
                          <select
                            value={wireGauge}
                            onChange={(e) => setWireGauge(e.target.value)}
                            className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold outline-none cursor-pointer text-xs text-left font-mono"
                          >
                            <option value="2.4">2.4 mm (قاسي جداً)</option>
                            <option value="2.2">2.2 mm (متوسط قاسي)</option>
                            <option value="2.0">2.0 mm (متوسط الليونة)</option>
                            <option value="1.8">1.8 mm (ناعم مرن)</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* ====================================================================
                    SECTION 4 – FOAM ENGINEERING (UNLIMITED LAYERS)
                    ==================================================================== */}
                <div className="p-5 bg-surface border border-border-main rounded-3xl space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b pb-2">
                    <button
                      type="button"
                      onClick={handleAddLayer}
                      className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-[10px] font-black cursor-pointer flex items-center gap-1 border border-purple-200 transition-all"
                    >
                      <Plus size={12} />
                      <span>إضافة طبقة إسفنج جديدة</span>
                    </button>
                    
                    <h4 className="text-xs font-black text-slate-700 dark:text-text-primary flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-lg bg-purple-50 text-purple-700 font-mono text-[10px] font-black flex items-center justify-center">4</span>
                      <span>هندسة وبناء طبقات الإسفنج (Foam Layer Builder)</span>
                    </h4>
                  </div>

                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {layers.map((layer, index) => (
                      <div key={layer.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border-main flex flex-col sm:flex-row items-center gap-3 animate-fade-in">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-text-primary text-[10px] font-black flex items-center justify-center">
                            {index + 1}
                          </span>
                          
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveLayer(index, 'up')}
                              disabled={index === 0}
                              className="text-[9px] text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                              title="نقل لأعلى"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveLayer(index, 'down')}
                              disabled={index === layers.length - 1}
                              className="text-[9px] text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                              title="نقل لأسفل"
                            >
                              ▼
                            </button>
                          </div>
                        </div>

                        <div className="flex-1 grid grid-cols-3 gap-2">
                          <div className="space-y-0.5">
                            <label className="text-[9px] text-slate-400 font-bold block">مادة الرغوة/الإسفنج</label>
                            <select
                              value={layer.material}
                              onChange={(e) => handleUpdateLayer(layer.id, 'material', e.target.value)}
                              className="w-full h-8 px-2 bg-surface dark:bg-slate-800 border border-border-main rounded-lg text-[10px] outline-none font-bold"
                            >
                              <option value="Memory Foam">Memory Foam (إسفنج الذاكرة المريح)</option>
                              <option value="HR Foam">HR Foam (عالي الارتداد ودعم ميكانيكي)</option>
                              <option value="Latex">Latex (مطاط طبيعي صحي فاخر)</option>
                              <option value="Soft Foam">Soft Foam (إسفنج غيمة ناعم جداً)</option>
                              <option value="Hard Foam">Hard Foam (إسفنج صلب لتدعيم القاعدة)</option>
                              <option value="Gel Foam">Gel Foam (إسفنج رغوي هلامي مبرد)</option>
                              <option value="Rebonded Foam">Rebonded Foam (إسفنج طبي مضغوط شديد الصلابة)</option>
                            </select>
                          </div>

                          <div className="space-y-0.5">
                            <label className="text-[9px] text-slate-400 font-bold block">السمك (سم)</label>
                            <input
                              type="number"
                              required
                              min={1}
                              max={20}
                              value={layer.thickness}
                              onChange={(e) => handleUpdateLayer(layer.id, 'thickness', Number(e.target.value))}
                              className="w-full h-8 px-2 bg-surface dark:bg-slate-800 border border-border-main rounded-lg text-[10px] text-center font-mono font-bold"
                            />
                          </div>

                          <div className="space-y-0.5">
                            <label className="text-[9px] text-slate-400 font-bold block">الكثافة (كجم/م³)</label>
                            <input
                              type="number"
                              required
                              min={10}
                              max={120}
                              value={layer.density}
                              onChange={(e) => handleUpdateLayer(layer.id, 'density', Number(e.target.value))}
                              className="w-full h-8 px-2 bg-surface dark:bg-slate-800 border border-border-main rounded-lg text-[10px] text-center font-mono font-bold"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveLayer(layer.id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg cursor-pointer transition-all border border-red-200"
                          title="حذف هذه الطبقة"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    {layers.length === 0 && (
                      <div className="p-8 text-center text-slate-400 font-bold text-[11px] border border-dashed border-slate-200 rounded-2xl">
                        لا توجد طبقات إسفنج حالياً. اضغط "إضافة طبقة إسفنج جديدة" لبناء الهيكل.
                      </div>
                    )}
                  </div>
                </div>

                {/* ====================================================================
                    SECTION 5 – COMFORT MATERIALS
                    ==================================================================== */}
                <div className="p-5 bg-surface border border-border-main rounded-3xl space-y-4 shadow-2xs">
                  <h4 className="text-xs font-black text-slate-700 dark:text-text-primary border-b pb-2 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-lg bg-purple-50 text-purple-700 font-mono text-[10px] font-black flex items-center justify-center">5</span>
                    <span>مواد الدعم ومكونات الفخامة (Comfort Materials)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-[11px]">
                    
                    {/* Fiber */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border-main space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="chk_fiber"
                          checked={hasFiber}
                          onChange={(e) => setHasFiber(e.target.checked)}
                          className="w-3.5 h-3.5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                        />
                        <label htmlFor="chk_fiber" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                          حشو فايبر دبل فوليوم (Fiber Quilt)
                        </label>
                      </div>
                      {hasFiber && (
                        <div className="flex items-center gap-2 pl-6 animate-fade-in">
                          <span className="text-slate-400">سمك الفايبر (سم):</span>
                          <input
                            type="number"
                            value={fiberThickness}
                            onChange={(e) => setFiberThickness(Number(e.target.value))}
                            className="w-16 h-7 px-2 bg-surface dark:bg-slate-800 border border-border-main rounded-md font-mono text-center"
                          />
                        </div>
                      )}
                    </div>

                    {/* Felt */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border-main space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="chk_felt"
                          checked={hasFelt}
                          onChange={(e) => setHasFelt(e.target.checked)}
                          className="w-3.5 h-3.5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                        />
                        <label htmlFor="chk_felt" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                          طبقة لباد صناعي صلب واقٍ (Hard Felt)
                        </label>
                      </div>
                      {hasFelt && (
                        <div className="flex items-center gap-2 pl-6 animate-fade-in">
                          <span className="text-slate-400">سمك اللباد (سم):</span>
                          <input
                            type="number"
                            value={feltThickness}
                            onChange={(e) => setFeltThickness(Number(e.target.value))}
                            className="w-16 h-7 px-2 bg-surface dark:bg-slate-800 border border-border-main rounded-md font-mono text-center"
                          />
                        </div>
                      )}
                    </div>

                    {/* Cotton Felt */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border-main space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="chk_cotton"
                          checked={hasCottonFelt}
                          onChange={(e) => setHasCottonFelt(e.target.checked)}
                          className="w-3.5 h-3.5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                        />
                        <label htmlFor="chk_cotton" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                          لباد قطني طبيعي ممتاز (Cotton Felt)
                        </label>
                      </div>
                      {hasCottonFelt && (
                        <div className="flex items-center gap-2 pl-6 animate-fade-in">
                          <span className="text-slate-400">سمك القطن (سم):</span>
                          <input
                            type="number"
                            value={cottonFeltThickness}
                            onChange={(e) => setCottonFeltThickness(Number(e.target.value))}
                            className="w-16 h-7 px-2 bg-surface dark:bg-slate-800 border border-border-main rounded-md font-mono text-center"
                          />
                        </div>
                      )}
                    </div>

                    {/* Visco Layer */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border-main space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="chk_visco"
                          checked={hasVisco}
                          onChange={(e) => setHasVisco(e.target.checked)}
                          className="w-3.5 h-3.5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                        />
                        <label htmlFor="chk_visco" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                          حشوة الفيسكو رينوفا المطاطة (Visco Layer)
                        </label>
                      </div>
                      {hasVisco && (
                        <div className="flex items-center gap-2 pl-6 animate-fade-in">
                          <span className="text-slate-400">سمك الفيسكو (سم):</span>
                          <input
                            type="number"
                            value={viscoThickness}
                            onChange={(e) => setViscoThickness(Number(e.target.value))}
                            className="w-16 h-7 px-2 bg-surface dark:bg-slate-800 border border-border-main rounded-md font-mono text-center"
                          />
                        </div>
                      )}
                    </div>

                    {/* Gel Layer */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-border-main space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="chk_gel"
                          checked={hasGel}
                          onChange={(e) => setHasGel(e.target.checked)}
                          className="w-3.5 h-3.5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                        />
                        <label htmlFor="chk_gel" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                          كبسولات هلام الجل المبرد المطور (Gel Layer)
                        </label>
                      </div>
                      {hasGel && (
                        <div className="flex items-center gap-2 pl-6 animate-fade-in">
                          <span className="text-slate-400">سمك الجل (سم):</span>
                          <input
                            type="number"
                            value={gelThickness}
                            onChange={(e) => setGelThickness(Number(e.target.value))}
                            className="w-16 h-7 px-2 bg-surface dark:bg-slate-800 border border-border-main rounded-md font-mono text-center"
                          />
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* ====================================================================
                    SECTION 6 – FABRIC SYSTEM
                    ==================================================================== */}
                <div className="p-5 bg-surface border border-border-main rounded-3xl space-y-4 shadow-2xs">
                  <h4 className="text-xs font-black text-slate-700 dark:text-text-primary border-b pb-2 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-lg bg-purple-50 text-purple-700 font-mono text-[10px] font-black flex items-center justify-center">6</span>
                    <span>نظام النسيج والخيوط الخارجية والوزن (Fabric System)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-slate-500 font-bold text-[11px]">نوع الغلاف الخارجي وقماش المرتبة (Fabric Type) *</label>
                      <input
                        type="text"
                        required
                        value={fabricType}
                        onChange={(e) => setFabricType(e.target.value)}
                        placeholder="مثال: Premium Quilted Double-Knit Cotton"
                        className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold outline-none text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-500 font-bold text-[11px]">كود القماش ورمز المخزن (Fabric Code) *</label>
                      <input
                        type="text"
                        required
                        value={fabricCode}
                        onChange={(e) => setFabricCode(e.target.value)}
                        placeholder="مثال: FB-KNIT-AR-2026"
                        className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold font-mono outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-slate-500 font-bold text-[11px]">المورد المعتمد للنسيج (Fabric Supplier) *</label>
                      <input
                        type="text"
                        required
                        value={fabricSupplier}
                        onChange={(e) => setFabricSupplier(e.target.value)}
                        placeholder="مثال: Belgian Fabrics Corp"
                        className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold outline-none text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-500 font-bold text-[11px]">وزن القماش النوعي (جرام/متر مربع) *</label>
                      <input
                        type="number"
                        required
                        min={100}
                        max={800}
                        value={fabricWeight}
                        onChange={(e) => setFabricWeight(Number(e.target.value))}
                        className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold font-mono outline-none text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* ====================================================================
                    SECTION 8 – AI ENGINEERING ASSISTANT ( ✨ DESIGN WITH AI )
                    ==================================================================== */}
                <div className="p-5 bg-gradient-to-r from-purple-950/20 to-indigo-950/20 border border-purple-500/30 rounded-3xl space-y-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-2 left-2 pointer-events-none opacity-20">
                    <Sparkles size={110} className="text-purple-400" />
                  </div>

                  <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                    <span className="text-[10px] bg-purple-500/20 border border-purple-400/40 text-purple-300 px-2 py-0.5 rounded-full font-mono">Section 8: AI R&D Assistant</span>
                    <h4 className="text-xs font-black text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                      <Sparkles size={16} className="text-purple-500 animate-pulse" />
                      <span>مساعد التصميم البنيوي الذكي (✨ Design Project with AI)</span>
                    </h4>
                  </div>

                  <div className="space-y-3 relative z-10 text-xs">
                    <div className="space-y-1">
                      <label className="block text-slate-500 dark:text-slate-300 font-bold text-[11px]">صف احتياجات المشروع ومواصفات العميل المطلوبة:</label>
                      <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="اكتب طبيعة الراحة المطلوبة، الميزانية، أو العميل المستلم..."
                        className="w-full h-18 p-3 bg-surface dark:bg-slate-900 border border-border-main rounded-xl outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-slate-400 text-[10px]">مستوى الصلابة والراحة</span>
                        <select
                          value={aiTargetComfort}
                          onChange={(e) => setAiTargetComfort(e.target.value)}
                          className="w-full h-8 px-2.5 bg-surface dark:bg-slate-900 border border-border-main rounded-lg outline-none font-bold text-[11px]"
                        >
                          <option value="Soft Plush">Soft Plush (لين جداً كالريش)</option>
                          <option value="Medium Plush">Medium Plush (متوسط الليونة والراحة)</option>
                          <option value="Orthopedic Hard">Orthopedic Hard (طبي قاسي لدعم الظهر)</option>
                          <option value="Balanced Firm">Balanced Firm (متوازن مائل للصلابة)</option>
                        </select>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-slate-400 text-[10px]">مستوى تصنيف الميزانية</span>
                        <select
                          value={aiTargetBudget}
                          onChange={(e) => setAiTargetBudget(e.target.value)}
                          className="w-full h-8 px-2.5 bg-surface dark:bg-slate-900 border border-border-main rounded-lg outline-none font-bold text-[11px]"
                        >
                          <option value="Economy">Economy (اقتصادي منافس)</option>
                          <option value="Standard">Standard (قياسي معتمد)</option>
                          <option value="Premium">Premium (ممتاز للمشاريع الفاخرة)</option>
                          <option value="Luxury">Luxury (مشاريع قصور فئة 5 نجوم)</option>
                        </select>
                      </div>

                      <div className="col-span-2 sm:col-span-1 flex items-end">
                        <button
                          type="button"
                          onClick={handleDesignWithAI}
                          disabled={aiIsLoading}
                          className="w-full h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50 transition-all text-[11px]"
                        >
                          {aiIsLoading ? (
                            <>
                              <RefreshCw size={12} className="animate-spin" />
                              <span>جاري التصميم...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles size={12} />
                              <span>تصميم الهيكل بـ AI</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {aiIsLoading && (
                      <div className="p-3 bg-purple-950/40 border border-purple-500/20 rounded-xl space-y-1.5 animate-pulse">
                        <div className="flex items-center gap-2">
                          <Activity size={12} className="text-purple-400 animate-spin" />
                          <span className="text-purple-300 font-bold text-[10px]">مؤشر التفكير الهندسي لـ AI:</span>
                        </div>
                        <div className="text-[10px] text-slate-300 font-mono">{aiLogMsg}</div>
                      </div>
                    )}

                    {aiResponseReasoning && !aiIsLoading && (
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-1 text-[11px] animate-fade-in">
                        <div className="text-emerald-700 dark:text-emerald-400 font-black flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          <span>تحليل وتبرير R&D للتصميم البنيوي المقترح:</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{aiResponseReasoning}</p>
                      </div>
                    )}

                  </div>
                </div>

                {/* ====================================================================
                    SECTION 9 – PROJECT TO PRODUCTION (1-CLICK SUBMIT AND LAUNCH)
                    ==================================================================== */}
                <div className="p-4 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-md space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded-full font-mono text-slate-400">Section 9: Action Board</span>
                    <span className="text-xs font-black text-slate-300 flex items-center gap-1.5">
                      <Info size={14} className="text-amber-500" />
                      <span>الموافقة النهائية ومطابقة شجرة المواد والمصنع</span>
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-relaxed text-right">
                    بالنقر على اعتماد الإنتاج الفوري أدناه، سيقوم النظام تلقائياً بإنشاء رمز المنتج الفريد، وتوليد شجرة المواد (BOM) التفصيلية كاملة الطبقات، وإصدار أمر تشغيل وإنتاج فوري لخطوط المصنع في الحالة "معتمد (Approved)" لمطابقة المقاس والكمية المقررة.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                    <button
                      type="submit"
                      className="w-full sm:flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-lg cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Sparkles size={14} />
                      <span>⚡ اعتماد التصميم وتوليد الـ BOM وأمر الإنتاج الفوري</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      إلغاء والتراجع
                    </button>
                  </div>
                </div>

              </form>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
