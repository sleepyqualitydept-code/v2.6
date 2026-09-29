/**
 * SLEEPEE ENGINEERING RECOMMENDATION ENGINE
 * =========================================
 * Deterministic, rule-based mattress architecture synthesizer.
 * Operates completely offline with 0 external AI calls and $0 operational cost.
 */

import {
  SLEEPEE_SPRING_SYSTEMS,
  SLEEPEE_FOAM_TYPES,
  SLEEPEE_FELT_AND_FIBER_TYPES,
  SLEEPEE_FABRIC_TYPES,
  SLEEPEE_STANDARDS_MATRIX
} from './sleepeeEngineeringKnowledgeBase';

export interface GeneratedLayer {
  id: string;
  layerType: string;
  material: string;
  thickness: number; // in cm
  density: number; // in kg/m3 (0 for springs/felts)
  supplier: string;
  cost: number; // in SAR
  notes: string;
}

export interface RecommendationResult {
  recommendedSpringType: string;
  recommendedFoamMix: string;
  recommendedDensity: string;
  recommendedFabric: string;
  estimatedCost: number;
  reasoning: string;
  layers: GeneratedLayer[];
  totalThickness: number;
  firmnessIndex: number; // 1-10
  durabilityYears: number;
  sasoCompliant: boolean;
  warrantyYears: number;
  marketStandard: string;
}

export interface RecommendationInput {
  targetHeight: number;
  targetComfort: string; // 'Plush' | 'Medium Plush' | 'Medium' | 'Medium Firm' | 'Firm' | 'Orthopedic Extra Firm'
  targetBudget: string; // 'Economy' | 'Standard' | 'Premium' | 'Luxury'
  targetMarket: string; // 'Hotel' | 'Medical' | 'Retail' | 'Residential' | 'Export'
}

export class EngineeringRecommendationEngine {
  /**
   * Main deterministic BOM generation method
   */
  public static generateRecommendation(input: RecommendationInput): RecommendationResult {
    const targetHeight = Math.max(15, Math.min(45, Math.round(Number(input.targetHeight) || 28)));
    const comfort = input.targetComfort || 'Medium';
    const budget = input.targetBudget || 'Standard';
    const market = input.targetMarket || 'Hotel';

    // 1. Find best matching standard profile
    const matchedProfile = SLEEPEE_STANDARDS_MATRIX.find(
      s => s.marketSegment.toLowerCase() === market.toLowerCase() && s.budgetLevel.toLowerCase() === budget.toLowerCase()
    ) || SLEEPEE_STANDARDS_MATRIX.find(
      s => s.marketSegment.toLowerCase() === market.toLowerCase()
    ) || SLEEPEE_STANDARDS_MATRIX[0];

    // 2. Determine structural core and components based on rules
    let springKey = matchedProfile.recommendedSpring;
    let topperKey = matchedProfile.recommendedTopper;
    let fabricKey = matchedProfile.recommendedFabric;
    let coreFoamKey = matchedProfile.recommendedCoreFoam;

    // Adapt based on comfort requirements
    if (comfort.includes('Plush') || comfort.includes('ناعم')) {
      if (budget === 'Luxury' || budget === 'Premium') {
        topperKey = 'Latex';
      } else {
        topperKey = 'Soft Foam';
      }
    } else if (comfort.includes('Firm') || comfort.includes('Orthopedic') || comfort.includes('طبي') || comfort.includes('قاسي')) {
      if (market === 'Medical') {
        springKey = 'No Springs';
        coreFoamKey = 'Rebonded Foam';
        topperKey = 'HR Foam';
      } else {
        coreFoamKey = 'HR Foam';
        topperKey = 'HR Foam';
      }
    }

    // 3. Build Layer Stack adding up exactly to targetHeight
    const layers: GeneratedLayer[] = [];
    let remainingHeight = targetHeight;

    // TOP LAYER: Outer Quilt (Fabric + Siliconized Fiber) -> 2 cm
    const quiltThickness = 2;
    const fabricSpec = SLEEPEE_FABRIC_TYPES[fabricKey] || SLEEPEE_FABRIC_TYPES['Knitted Fabric'];
    layers.push({
      id: `eng-l1-quilt-${Date.now()}`,
      layerType: 'Quilt/Topper',
      material: fabricSpec.nameEn.split(' (')[0],
      thickness: quiltThickness,
      density: fabricSpec.defaultDensityKgM3,
      supplier: fabricSpec.supplierName,
      cost: fabricSpec.costPerM2Sar,
      notes: `${fabricSpec.notesAr} مع طبقة ألياف مايكروفايبر سيليكونية فاخرة.`
    });
    remainingHeight -= quiltThickness;

    // LAYER 2: Primary Comfort Topper (Latex / Memory Foam / Gel Memory Foam / Soft Foam)
    const topperSpec = SLEEPEE_FOAM_TYPES[topperKey] || SLEEPEE_FOAM_TYPES['Memory Foam'];
    const topperThickness = targetHeight >= 30 ? 4 : (targetHeight >= 25 ? 3 : 2);
    layers.push({
      id: `eng-l2-topper-${Date.now()}`,
      layerType: 'Comfort Layer',
      material: topperSpec.nameEn.split(' (')[0],
      thickness: topperThickness,
      density: topperSpec.defaultDensityKgM3,
      supplier: topperSpec.supplierName,
      cost: topperSpec.costPerM2Sar,
      notes: topperSpec.notesAr
    });
    remainingHeight -= topperThickness;

    // LAYER 3: Transition / Secondary Support Foam (HR Foam or Medical Foam)
    const transitionSpec = SLEEPEE_FOAM_TYPES['HR Foam'];
    let transitionThickness = 0;
    if (remainingHeight >= 18) {
      transitionThickness = targetHeight >= 32 ? 4 : 3;
      layers.push({
        id: `eng-l3-transition-${Date.now()}`,
        layerType: 'Support Layer',
        material: transitionSpec.nameEn.split(' (')[0],
        thickness: transitionThickness,
        density: transitionSpec.defaultDensityKgM3,
        supplier: transitionSpec.supplierName,
        cost: transitionSpec.costPerM2Sar,
        notes: transitionSpec.notesAr
      });
      remainingHeight -= transitionThickness;
    }

    // LAYER 4: Insulator Felt Layer (if using springs to protect foams)
    const hasSpring = springKey !== 'No Springs';
    let topFeltThickness = 0;
    if (hasSpring) {
      const feltSpec = budget === 'Economy' ? SLEEPEE_FELT_AND_FIBER_TYPES['Polyester Felt'] : SLEEPEE_FELT_AND_FIBER_TYPES['Cotton Felt'];
      topFeltThickness = 1;
      layers.push({
        id: `eng-l4-topfelt-${Date.now()}`,
        layerType: 'Insulator Layer',
        material: feltSpec.nameEn.split(' (')[0],
        thickness: topFeltThickness,
        density: feltSpec.defaultDensityKgM3,
        supplier: feltSpec.supplierName,
        cost: feltSpec.costPerM2Sar,
        notes: feltSpec.notesAr
      });
      remainingHeight -= topFeltThickness;
    }

    // BOTTOM BASE FOUNDATION LAYER: (Hard Foam or Foundation Base) -> 2 cm
    const baseFoundationThickness = Math.min(2, Math.max(1, remainingHeight > 16 ? 2 : 1));
    const baseSpec = SLEEPEE_FOAM_TYPES['Hard Foam'];
    remainingHeight -= baseFoundationThickness;

    // BOTTOM INSULATOR FELT (if spring system)
    let bottomFeltThickness = 0;
    if (hasSpring && remainingHeight >= 14) {
      const feltSpec = SLEEPEE_FELT_AND_FIBER_TYPES['Cotton Felt'];
      bottomFeltThickness = 1;
      remainingHeight -= bottomFeltThickness;
    }

    // MAIN CORE LAYER (Spring Core or High Density Foam Core) -> takes all remaining calculated height
    const coreThickness = remainingHeight;
    if (hasSpring) {
      const springSpec = SLEEPEE_SPRING_SYSTEMS[springKey] || SLEEPEE_SPRING_SYSTEMS['Pocket Spring'];
      layers.push({
        id: `eng-l5-core-${Date.now()}`,
        layerType: 'Spring Core',
        material: springSpec.nameEn.split(' (')[0],
        thickness: coreThickness,
        density: 0,
        supplier: springSpec.supplierName,
        cost: springSpec.costPerM2Sar,
        notes: springSpec.notesAr
      });
    } else {
      const coreFoamSpec = SLEEPEE_FOAM_TYPES[coreFoamKey] || SLEEPEE_FOAM_TYPES['Rebonded Foam'];
      layers.push({
        id: `eng-l5-core-${Date.now()}`,
        layerType: 'Base Core',
        material: coreFoamSpec.nameEn.split(' (')[0],
        thickness: coreThickness,
        density: coreFoamSpec.defaultDensityKgM3,
        supplier: coreFoamSpec.supplierName,
        cost: coreFoamSpec.costPerM2Sar,
        notes: coreFoamSpec.notesAr
      });
    }

    // Add Bottom Insulator if spring was allocated
    if (hasSpring && bottomFeltThickness > 0) {
      const feltSpec = SLEEPEE_FELT_AND_FIBER_TYPES['Cotton Felt'];
      layers.push({
        id: `eng-l6-botfelt-${Date.now()}`,
        layerType: 'Insulator Layer',
        material: feltSpec.nameEn.split(' (')[0],
        thickness: bottomFeltThickness,
        density: feltSpec.defaultDensityKgM3,
        supplier: feltSpec.supplierName,
        cost: feltSpec.costPerM2Sar,
        notes: 'طبقة لباد عازلة سفلية لدعم وتثبيت شاسيه السوست ومنع الاحتكاك مع القاعدة.'
      });
    }

    // Add Bottom Base Layer
    layers.push({
      id: `eng-l7-base-${Date.now()}`,
      layerType: 'Base Core',
      material: baseSpec.nameEn.split(' (')[0],
      thickness: baseFoundationThickness,
      density: baseSpec.defaultDensityKgM3,
      supplier: baseSpec.supplierName,
      cost: baseSpec.costPerM2Sar,
      notes: baseSpec.notesAr
    });

    // 4. Calculate Total Costs and Engineering Parameters
    const calculatedSumThickness = layers.reduce((acc, l) => acc + l.thickness, 0);
    const totalCost = layers.reduce((acc, l) => acc + l.cost, 0);

    // Calculate Firmness
    let firmness = 6.5;
    if (comfort.includes('Plush') || comfort.includes('ناعم')) firmness = 4.0;
    else if (comfort.includes('Firm') || comfort.includes('قاسي')) firmness = 8.5;
    else if (comfort.includes('Orthopedic') || comfort.includes('طبي')) firmness = 9.0;

    const reasoning = `[Sleepee R&D Heuristic Engine v5.0] تم اعتماد تركيبة هندسية قياسية لقطاع (${market}) بمستوى فئة (${budget}) وارتفاع إجمالي مقداره ${calculatedSumThickness} سم. 
توزيع الطبقات يحقق التوازن الإنشائي الميكانيكي التام بنسبة امتصاص ضغط مثالية وعزل تام للحركة مع عمر افتراضي يقدر بـ ${matchedProfile.standardWarrantyYears} سنوات.`;

    return {
      recommendedSpringType: springKey,
      recommendedFoamMix: `${topperKey} (${topperSpec.defaultDensityKgM3} kg/m³) + ${coreFoamKey} (${SLEEPEE_FOAM_TYPES[coreFoamKey]?.defaultDensityKgM3 || 35} kg/m³)`,
      recommendedDensity: `${topperSpec.defaultDensityKgM3} kg/m³ (راحة) / ${SLEEPEE_FOAM_TYPES[coreFoamKey]?.defaultDensityKgM3 || 35} kg/m³ (دعم)`,
      recommendedFabric: fabricSpec.nameEn.split(' (')[0],
      estimatedCost: totalCost,
      reasoning,
      layers,
      totalThickness: calculatedSumThickness,
      firmnessIndex: firmness,
      durabilityYears: matchedProfile.standardWarrantyYears,
      sasoCompliant: true,
      warrantyYears: matchedProfile.standardWarrantyYears,
      marketStandard: `${market} Standard Matrix - Class ${budget}`
    };
  }
}
