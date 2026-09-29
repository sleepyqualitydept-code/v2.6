import React, { useState, useMemo } from 'react';
import { 
  FolderTree, ChevronDown, ChevronRight, Layers, Box, 
  Workflow, ArrowUpDown, Plus, Trash2, Split, Merge, 
  Sparkles, CheckCircle2, ShieldCheck, Scale, DollarSign, 
  CornerDownRight, RefreshCw, Sliders, Check, Search, Maximize2, Minimize2, Filter
} from 'lucide-react';
import { CurrencyCode, CurrencyEngine } from '../../../services/currencyEngine';

export type ProductStructureItemType = 
  | 'Finished Product'
  | 'Semi Finished'
  | 'Sub Assembly'
  | 'Raw Material'
  | 'Purchased Material'
  | 'Packaging Material'
  | 'Service Item';

export interface ProductStructureNode {
  id: string;
  itemCode: string;
  descriptionAr: string;
  descriptionEn: string;
  type: ProductStructureItemType;
  qty: number;
  uom: string;
  weightKg: number;
  cost: number;
  source: 'Internal Line' | 'Vendor Supply' | 'Packaging Cell' | 'Service Subcontract';
  status: 'Released' | 'Active' | 'Pending QC';
  assemblyId: 'top' | 'spring' | 'bottom' | 'border' | 'packaging';
}

interface PepStep2ProductStructureProps {
  layers: any[];
  activeCurrency: CurrencyCode;
  onCompleteStep: () => void;
  isDoubleSided: boolean;
  onSelectDrawerLayer?: (layer: any) => void;
}

export const PepStep2ProductStructure: React.FC<PepStep2ProductStructureProps> = ({
  layers,
  activeCurrency,
  onCompleteStep,
  isDoubleSided,
  onSelectDrawerLayer
}) => {
  const [treeSearchQuery, setTreeSearchQuery] = useState<string>('');
  const [treeTypeFilter, setTreeTypeFilter] = useState<string>('All');
  const [generationMode, setGenerationMode] = useState<'MODE_A' | 'MODE_B'>('MODE_A');

  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    root: true,
    top: true,
    spring: true,
    bottom: true,
    border: true,
    packaging: true
  });

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExpandAll = () => {
    setExpandedNodes({
      root: true,
      top: true,
      spring: true,
      bottom: true,
      border: true,
      packaging: true
    });
  };

  const handleCollapseAll = () => {
    setExpandedNodes({
      root: false,
      top: false,
      spring: false,
      bottom: false,
      border: false,
      packaging: false
    });
  };

  // Group layers into standard Level 1 Assemblies
  const springIndex = layers.findIndex(l => {
    const mat = (l.material || '').toLowerCase();
    const cat = (l.category || '').toLowerCase();
    return mat.includes('spring') || mat.includes('سوست') || cat.includes('spring') || mat.includes('شاسيه');
  });

  const topLayers: any[] = [];
  const springLayers: any[] = [];
  const bottomLayers: any[] = [];
  const borderLayers: any[] = [];

  if (springIndex !== -1) {
    layers.forEach((layer, idx) => {
      const mat = (layer.material || '').toLowerCase();
      const cat = (layer.category || '').toLowerCase();
      if (mat.includes('border') || mat.includes('شريط') || mat.includes('داير') || cat.includes('border') || cat.includes('edge')) {
        borderLayers.push(layer);
      } else if (idx < springIndex) {
        if (mat.includes('felt') || (mat.includes('لباد') && idx === springIndex - 1)) {
          springLayers.push(layer);
        } else {
          topLayers.push(layer);
        }
      } else if (idx === springIndex) {
        springLayers.push(layer);
      } else {
        if (mat.includes('felt') || (mat.includes('لباد') && idx === springIndex + 1)) {
          springLayers.push(layer);
        } else {
          bottomLayers.push(layer);
        }
      }
    });
  } else {
    const mid = Math.floor(layers.length / 2);
    layers.forEach((layer, idx) => {
      const mat = (layer.material || '').toLowerCase();
      if (mat.includes('border') || mat.includes('شريط') || mat.includes('داير')) {
        borderLayers.push(layer);
      } else if (idx < mid) {
        topLayers.push(layer);
      } else {
        bottomLayers.push(layer);
      }
    });
  }

  // Derive component classification for tree nodes
  const classifyItemType = (mat: string, cat: string): ProductStructureItemType => {
    const m = (mat || '').toLowerCase();
    const c = (cat || '').toLowerCase();
    if (m.includes('quilt') || m.includes('كبتنة') || m.includes('تطريز') || m.includes('face')) return 'Semi Finished';
    if (m.includes('spring') || m.includes('شاسيه') || m.includes('core')) return 'Sub Assembly';
    if (m.includes('foam') || m.includes('فوم') || m.includes('إسفنج') || c.includes('foam')) return 'Raw Material';
    if (m.includes('box') || m.includes('كرتون') || m.includes('نايلون') || m.includes('pack')) return 'Packaging Material';
    if (m.includes('testing') || m.includes('فحص') || m.includes('treatment')) return 'Service Item';
    return 'Purchased Material';
  };

  // Build standard Level 2 Nodes
  const buildNodes = (items: any[], assId: 'top' | 'spring' | 'bottom' | 'border'): ProductStructureNode[] => {
    return items.map((l, i) => {
      const type = classifyItemType(l.material, l.category);
      return {
        id: `${assId}-${l.id || i}`,
        itemCode: l.materialCode || `RAW-${assId.toUpperCase()}-${i + 1}`,
        descriptionAr: l.material,
        descriptionEn: l.materialEn || l.material,
        type,
        qty: Number(l.thickness) || Number(l.quantity) || 1,
        uom: l.uom || (type === 'Raw Material' ? 'cm' : 'pcs'),
        weightKg: Number(l.weight) || Math.round((Number(l.thickness) || 1) * 0.4 * 10) / 10,
        cost: Number(l.cost) || 30,
        source: type === 'Semi Finished' || type === 'Sub Assembly' ? 'Internal Line' : 'Vendor Supply',
        status: 'Released',
        assemblyId: assId
      };
    });
  };

  // Add Packaging Materials node (Requirement 5)
  const packagingNodes: ProductStructureNode[] = [
    {
      id: 'pkg-01',
      itemCode: 'PKG-POLY-BAG',
      descriptionAr: 'كيس بوليثيلين سميك عازل 150 ميكرون (Heavy-Duty Polybag)',
      descriptionEn: 'Protective Polyethylene Bag 150 Micron',
      type: 'Packaging Material',
      qty: 1,
      uom: 'pcs',
      weightKg: 0.8,
      cost: 15,
      source: 'Packaging Cell',
      status: 'Active',
      assemblyId: 'packaging'
    },
    {
      id: 'pkg-02',
      itemCode: 'PKG-CORNER-4',
      descriptionAr: 'طقم زوايا كرتونية مقواة لحماية الأركان (Cardboard Edge Protectors)',
      descriptionEn: 'Rigid Corner Edge Protectors (Set of 4)',
      type: 'Packaging Material',
      qty: 4,
      uom: 'set',
      weightKg: 0.6,
      cost: 10,
      source: 'Vendor Supply',
      status: 'Active',
      assemblyId: 'packaging'
    },
    {
      id: 'pkg-03',
      itemCode: 'SRV-SAN-QC',
      descriptionAr: 'خدمة التعقيم بالأشعة فوق البنفسجية UV والفحص النهائي',
      descriptionEn: 'UV Sterilization & Out-of-Box Verification',
      type: 'Service Item',
      qty: 1,
      uom: 'pcs',
      weightKg: 0,
      cost: 8,
      source: 'Service Subcontract',
      status: 'Released',
      assemblyId: 'packaging'
    }
  ];

  const level1Assemblies = useMemo(() => [
    {
      id: 'top' as const,
      nameAr: 'المجموعة العلوية (Top Assembly)',
      nameEn: 'Top Quilt & Comfort Assembly',
      routingStep: 'OP-QUILT-01 + OP-ASSY-01',
      nodes: buildNodes(topLayers, 'top')
    },
    {
      id: 'spring' as const,
      nameAr: 'مجموعة شاسيه السوست (Spring Assembly)',
      nameEn: 'Spring Core & Insulation Assembly',
      routingStep: 'OP-SPRING-01 + OP-FELT-01',
      nodes: buildNodes(springLayers, 'spring')
    },
    {
      id: 'bottom' as const,
      nameAr: 'المجموعة السفلية (Bottom Assembly)',
      nameEn: isDoubleSided ? 'Mirrored Symmetrical Bottom Assembly' : 'Base Support Assembly',
      routingStep: 'OP-BASE-01 + OP-CLOSE-01',
      nodes: buildNodes(bottomLayers, 'bottom')
    },
    {
      id: 'border' as const,
      nameAr: 'مجموعة الإطار والشريط الجانبي (Border Assembly)',
      nameEn: 'Border, Handles & Ventilation Assembly',
      routingStep: 'OP-BORDER-01 + OP-TAPE-01',
      nodes: buildNodes(borderLayers, 'border')
    },
    {
      id: 'packaging' as const,
      nameAr: 'مجموعة التغليف والخدمات الملحقة (Packaging & Services)',
      nameEn: 'Packaging Materials & Quality Verification',
      routingStep: 'OP-QC-PACK-01',
      nodes: packagingNodes
    }
  ], [topLayers, springLayers, bottomLayers, borderLayers, isDoubleSided]);

  // Aggregate metrics
  const allNodes = useMemo(() => {
    return level1Assemblies.flatMap(a => a.nodes);
  }, [level1Assemblies]);

  const totalCost = allNodes.reduce((sum, n) => sum + n.cost, 0);
  const totalWeight = allNodes.reduce((sum, n) => sum + n.weightKg, 0);
  const totalThickness = layers.reduce((sum, l) => sum + (Number(l.thickness) || 0), 0);

  // Filter and search
  const filteredAssemblies = useMemo(() => {
    return level1Assemblies.map(ass => {
      const matchingNodes = ass.nodes.filter(node => {
        const matchType = treeTypeFilter === 'All' || node.type === treeTypeFilter;
        const matchSearch = !treeSearchQuery ||
          node.itemCode.toLowerCase().includes(treeSearchQuery.toLowerCase()) ||
          node.descriptionAr.toLowerCase().includes(treeSearchQuery.toLowerCase()) ||
          node.source.toLowerCase().includes(treeSearchQuery.toLowerCase());
        return matchType && matchSearch;
      });
      return { ...ass, nodes: matchingNodes };
    });
  }, [level1Assemblies, treeTypeFilter, treeSearchQuery]);

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Banner & Generation Mode */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-border-main flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0B2D5C] text-white flex items-center justify-center font-bold">
            <FolderTree size={18} />
          </div>
          <div>
            <h3 className="font-black text-sm text-[#0B2D5C] dark:text-blue-300">
              محرك شجرة المنتج الصناعي (Product Structure Tree Engine)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              هيكلة متسلسلة للمنتج التام، مجموعات المستوى الأول (Level 1 Assemblies)، ومكونات المستوى الثاني (Level 2 Components).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-surface p-1 rounded-xl border border-border-main text-xs">
          <button
            type="button"
            onClick={() => setGenerationMode('MODE_A')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              generationMode === 'MODE_A'
                ? 'bg-[#0B2D5C] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>MODE A: توليد آلي من مسار التشغيل (Routing Driven)</span>
          </button>

          <button
            type="button"
            onClick={() => setGenerationMode('MODE_B')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              generationMode === 'MODE_B'
                ? 'bg-[#0B2D5C] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>MODE B: تخصيص هندسي يدوي (Manual Override)</span>
          </button>
        </div>
      </div>

      {/* Tree Search & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-3 rounded-2xl border border-border-main text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-border-main">
          <Search size={14} className="text-slate-400" />
          <input
            type="text"
            placeholder="بحث في شجرة المنتج بالكود أو الوصف أو المصدر..."
            value={treeSearchQuery}
            onChange={(e) => setTreeSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs font-bold outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Node Type Filtering */}
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-slate-400" />
            <span className="text-[11px] font-bold text-slate-400">تصفية نوع البند:</span>
            <select
              value={treeTypeFilter}
              onChange={(e) => setTreeTypeFilter(e.target.value)}
              className="h-8 px-2.5 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl font-bold text-xs outline-none cursor-pointer"
            >
              <option value="All">كافة المكونات ({allNodes.length})</option>
              <option value="Semi Finished">Semi Finished (نصف مصنع)</option>
              <option value="Sub Assembly">Sub Assembly (تجميع فرعي)</option>
              <option value="Raw Material">Raw Material (مادة خام)</option>
              <option value="Purchased Material">Purchased Material (مشتريات)</option>
              <option value="Packaging Material">Packaging Material (تغليف)</option>
              <option value="Service Item">Service Item (خدمة)</option>
            </select>
          </div>

          {/* Expand / Collapse All */}
          <button
            type="button"
            onClick={handleExpandAll}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
          >
            <Maximize2 size={12} />
            <span>توسيع الكل</span>
          </button>

          <button
            type="button"
            onClick={handleCollapseAll}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
          >
            <Minimize2 size={12} />
            <span>طي الكل</span>
          </button>
        </div>
      </div>

      {/* Industrial Tree Viewport */}
      <div className="bg-surface rounded-2xl border border-border-main p-5 space-y-4 shadow-xs">
        
        {/* Tree Root: Finished Product (Level 0) */}
        <div className="p-3.5 bg-[#0B2D5C] text-white rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toggleNode('root')}
              className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
            >
              {expandedNodes.root ? <ChevronDown size={15} /> : <ChevronRight size={15} className="rtl:rotate-180" />}
            </button>
            <Box size={18} className="text-emerald-400" />
            <div>
              <span className="font-mono text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                FINISHED PRODUCT (Level 0)
              </span>
              <h4 className="font-black text-sm text-white">
                المنتج النهائي المعتمد للتصنيع • Finished Mattress Unit
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono font-bold text-slate-200">
            <span>السمك الإجمالي: <strong className="text-white">{totalThickness} سم</strong></span>
            <span>الوزن الكلي: <strong className="text-white">{totalWeight.toFixed(1)} كجم</strong></span>
            <span className="text-emerald-300 font-black">
              التكلفة الإجمالية: {CurrencyEngine.formatAmount(totalCost, activeCurrency)}
            </span>
          </div>
        </div>

        {/* Tree Branches (Level 1: Assemblies) */}
        {expandedNodes.root && (
          <div className="pr-6 space-y-3 border-r-2 border-slate-200 dark:border-slate-800">
            {filteredAssemblies.map((assembly, aIdx) => {
              const isExpanded = expandedNodes[assembly.id];
              const assCost = assembly.nodes.reduce((sum, n) => sum + n.cost, 0);
              const assWeight = assembly.nodes.reduce((sum, n) => sum + n.weightKg, 0);

              return (
                <div key={assembly.id} className="space-y-2">
                  
                  {/* Assembly Header Node (Level 1) */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-border-main flex flex-wrap items-center justify-between gap-3 hover:border-[#0B2D5C] transition-all">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleNode(assembly.id)}
                        className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer"
                      >
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} className="rtl:rotate-180" />}
                      </button>

                      <div className="w-2.5 h-2.5 rounded-full bg-[#0B2D5C]" />

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded font-bold">
                            Level 1 • Assembly {aIdx + 1}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            مسار: {assembly.routingStep}
                          </span>
                        </div>
                        <span className="font-black text-xs text-slate-900 dark:text-white">
                          {assembly.nameAr}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-slate-500 font-bold">
                        {assembly.nodes.length} مكونات
                      </span>
                      <span className="text-slate-500 font-bold">
                        {assWeight.toFixed(1)} كجم
                      </span>
                      <span className="font-bold text-[#0B2D5C] dark:text-blue-300 bg-white dark:bg-slate-950 px-2 py-0.5 rounded-md border border-border-main">
                        {CurrencyEngine.formatAmount(assCost, activeCurrency)}
                      </span>
                    </div>
                  </div>

                  {/* Level 2: Components Nodes (Sub Assemblies, Raw, Purchased, Packaging, Services) */}
                  {isExpanded && (
                    <div className="pr-6 space-y-1.5 border-r border-dashed border-slate-300 dark:border-slate-700">
                      {assembly.nodes.length === 0 ? (
                        <div className="p-3 text-xs text-slate-400 text-center">
                          لا توجد مكونات تطابق معايير التصفية والبحث في هذه المجموعة.
                        </div>
                      ) : (
                        assembly.nodes.map((node) => (
                          <div
                            key={node.id}
                            onClick={() => onSelectDrawerLayer && onSelectDrawerLayer({ material: node.descriptionAr, materialCode: node.itemCode, cost: node.cost, thickness: node.qty, weight: node.weightKg })}
                            className="p-2.5 bg-surface rounded-xl border border-border-main flex items-center justify-between gap-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-all"
                          >
                            <div className="flex items-center gap-2.5">
                              <CornerDownRight size={13} className="text-slate-400 rtl:scale-x-[-1]" />
                              
                              {/* Item Type Badge */}
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                                node.type === 'Semi Finished'
                                  ? 'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300'
                                  : node.type === 'Sub Assembly'
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300'
                                  : node.type === 'Raw Material'
                                  ? 'bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-200'
                                  : node.type === 'Packaging Material'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : 'bg-zinc-100 text-zinc-800 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200'
                              }`}>
                                {node.type}
                              </span>

                              <div>
                                <span className="font-bold text-slate-900 dark:text-white">
                                  {node.descriptionAr}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono block">
                                  {node.itemCode} • الكمية: {node.qty} {node.uom} • الوزن: {node.weightKg} كجم • المصدر: {node.source}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 font-mono font-bold text-slate-600 dark:text-slate-300">
                              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                {node.status}
                              </span>
                              <span className="text-[#0B2D5C] dark:text-blue-300">
                                {CurrencyEngine.formatAmount(node.cost, activeCurrency)}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Step Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border-main">
        <span className="text-[11px] text-slate-400">
          تم توثيق شجرة المنتج والمجموعات والمكونات ونقاط الإمداد.
        </span>

        <button
          type="button"
          onClick={onCompleteStep}
          className="px-6 py-2.5 bg-[#0B2D5C] hover:bg-[#133763] text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center gap-2 transition-all"
        >
          <span>حفظ والتقدم إلى الخطوة 3: سجل المواد وBOM (Materials & BOM)</span>
          <ChevronRight size={15} className="rtl:rotate-180" />
        </button>
      </div>

    </div>
  );
};
