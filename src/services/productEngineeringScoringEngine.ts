/**
 * SLEEPEE PRODUCT ENGINEERING SCORING ENGINE
 * ==========================================
 * Multi-dimensional automatic engineering evaluation matrix for mattress designs.
 * 100% Rule-Based & Deterministic - $0 External AI Cost.
 */

import { MaterialMasterIntelligenceEngine } from './materialMasterIntelligenceEngine';

export interface ProductScoringInput {
  layers: Array<{
    layerType?: string;
    material?: string;
    thickness: number;
    density?: number;
    cost?: number;
  }>;
  targetHeight: number;
  targetComfort?: string;
  targetBudget?: string;
  targetMarket?: string;
}

export interface DetailedEngineeringScores {
  comfortScore: number;
  durabilityScore: number;
  warrantyScore: number;
  manufacturingScore: number;
  costEfficiencyScore: number;
  medicalSuitabilityScore: number;
  hotelSuitabilityScore: number;
  exportSuitabilityScore: number;
  luxuryPositioningScore: number;
  overallEngineeringScore: number;
  classification: 'Elite' | 'Premium' | 'Standard' | 'Basic' | 'Requires Review';
  classificationAr: string;
  estimatedLifetimeYears: number;
  comfortClassificationAr: string;
  qualityClassificationAr: string;
  suggestedMarketSegment: 'Hotel' | 'Medical' | 'Luxury Residential' | 'Retail Standard' | 'Export Roll-Pack' | 'Economic';
  strengthsAr: string[];
  recommendationsAr: string[];
}

export class ProductEngineeringScoringEngine {
  public static calculateScores(input: ProductScoringInput): DetailedEngineeringScores {
    const { layers, targetHeight } = input;
    const totalThickness = layers.reduce((acc, l) => acc + (Number(l.thickness) || 0), 0);
    const totalCost = layers.reduce((acc, l) => acc + (Number(l.cost) || 0), 0);

    // 1. Evaluate component materials
    let hasPocketSpring = false;
    let hasMicroPocket = false;
    let hasBonnell = false;
    let hasLatex = false;
    let hasMemoryFoam = false;
    let hasGel = false;
    let hasHRFoam = false;
    let hasRebonded = false;
    let hasFelt = false;
    let hasCoolingOrTencel = false;
    let hasOrganicFabric = false;
    let totalFoamDensitySum = 0;
    let foamLayerCount = 0;

    layers.forEach(l => {
      const mat = (l.material || '').toLowerCase();
      const density = Number(l.density) || 0;

      if (mat.includes('pocket') && mat.includes('micro')) hasMicroPocket = true;
      else if (mat.includes('pocket')) hasPocketSpring = true;
      else if (mat.includes('bonnell')) hasBonnell = true;

      if (mat.includes('latex')) hasLatex = true;
      if (mat.includes('gel')) hasGel = true;
      if (mat.includes('memory') || mat.includes('visco')) hasMemoryFoam = true;
      if (mat.includes('hr') || mat.includes('high resilience')) hasHRFoam = true;
      if (mat.includes('rebonded') || mat.includes('medical foam')) hasRebonded = true;
      if (mat.includes('felt') || mat.includes('لباد')) hasFelt = true;
      if (mat.includes('cooling') || mat.includes('tencel') || mat.includes('ice')) hasCoolingOrTencel = true;
      if (mat.includes('organic') || mat.includes('sanitized')) hasOrganicFabric = true;

      if (density > 0 && (mat.includes('foam') || mat.includes('latex') || mat.includes('إسفنج'))) {
        totalFoamDensitySum += density;
        foamLayerCount++;
      }
    });

    const avgFoamDensity = foamLayerCount > 0 ? totalFoamDensitySum / foamLayerCount : 30;

    // 2. Compute Individual Scores (0 - 100)

    // COMFORT SCORE: Driven by topper plushness, contouring (Latex/Memory/Gel), height, and pressure relief
    let comfortScore = 65;
    if (hasLatex) comfortScore += 15;
    if (hasGel || hasMemoryFoam) comfortScore += 12;
    if (hasPocketSpring || hasMicroPocket) comfortScore += 8;
    if (totalThickness >= 28) comfortScore += 5;
    if (hasBonnell && !hasLatex && !hasMemoryFoam) comfortScore -= 10;
    comfortScore = Math.min(100, Math.max(30, comfortScore));

    // DURABILITY SCORE: Driven by foam densities, spring quality, felt insulation, and structural foundation
    let durabilityScore = 70;
    if (avgFoamDensity >= 40) durabilityScore += 15;
    else if (avgFoamDensity >= 32) durabilityScore += 10;
    else if (avgFoamDensity < 25) durabilityScore -= 15;

    if (hasMicroPocket || hasPocketSpring) durabilityScore += 10;
    if (hasLatex || hasRebonded) durabilityScore += 8;
    if ((hasPocketSpring || hasBonnell) && !hasFelt) durabilityScore -= 25; // Critical puncture penalty
    durabilityScore = Math.min(100, Math.max(20, durabilityScore));

    // WARRANTY SCORE: Supported safe warranty length
    let warrantyScore = 65;
    if (durabilityScore >= 90) warrantyScore = 96;
    else if (durabilityScore >= 80) warrantyScore = 88;
    else if (durabilityScore >= 70) warrantyScore = 75;
    else warrantyScore = 55;

    // MANUFACTURING SCORE: Complexity, standard operations, material availability
    let manufacturingScore = 85;
    if (layers.length >= 3 && layers.length <= 7) manufacturingScore += 10;
    if (Math.abs(totalThickness - targetHeight) < 0.2) manufacturingScore += 5;
    else manufacturingScore -= 20;
    manufacturingScore = Math.min(100, Math.max(40, manufacturingScore));

    // COST EFFICIENCY SCORE: Ratio of performance to material cost
    let costEfficiencyScore = 75;
    if (totalCost > 0) {
      const valueRatio = (comfortScore + durabilityScore) / (totalCost / 2.5);
      costEfficiencyScore = Math.min(100, Math.max(40, Math.round(valueRatio * 35)));
    }

    // MEDICAL SUITABILITY SCORE: Spinal alignment, hypoallergenic, high density support
    let medicalSuitabilityScore = 50;
    if (hasRebonded || (hasHRFoam && avgFoamDensity >= 38)) medicalSuitabilityScore += 25;
    if (hasLatex) medicalSuitabilityScore += 15;
    if (hasMicroPocket) medicalSuitabilityScore += 12;
    if (hasOrganicFabric) medicalSuitabilityScore += 10;
    if (hasBonnell) medicalSuitabilityScore -= 20;
    medicalSuitabilityScore = Math.min(100, Math.max(20, medicalSuitabilityScore));

    // HOTEL SUITABILITY SCORE: Zero motion transfer, durable edges, luxury height, flame/tear resistant
    let hotelSuitabilityScore = 50;
    if (hasPocketSpring || hasMicroPocket) hotelSuitabilityScore += 25;
    if (hasHRFoam && avgFoamDensity >= 32) hotelSuitabilityScore += 12;
    if (totalThickness >= 28) hotelSuitabilityScore += 10;
    if (hasLatex || hasGel) hotelSuitabilityScore += 8;
    if (hasBonnell) hotelSuitabilityScore -= 15;
    hotelSuitabilityScore = Math.min(100, Math.max(20, hotelSuitabilityScore));

    // EXPORT SUITABILITY SCORE: Compression recovery, vacuum seal safety
    let exportSuitabilityScore = 70;
    if (hasBonnell) exportSuitabilityScore = 35; // Bonnell cannot roll-pack well
    else if (hasPocketSpring || (hasHRFoam && hasMemoryFoam)) exportSuitabilityScore = 95;
    if (hasLatex) exportSuitabilityScore = Math.min(exportSuitabilityScore, 90);

    // LUXURY POSITIONING SCORE: Premium fabrics, multi-tier foams, cooling
    let luxuryPositioningScore = 55;
    if (hasCoolingOrTencel) luxuryPositioningScore += 15;
    if (hasLatex && hasGel) luxuryPositioningScore += 20;
    else if (hasLatex || hasGel || hasMemoryFoam) luxuryPositioningScore += 12;
    if (hasMicroPocket || hasPocketSpring) luxuryPositioningScore += 10;
    if (totalThickness >= 30) luxuryPositioningScore += 8;
    luxuryPositioningScore = Math.min(100, Math.max(30, luxuryPositioningScore));

    // OVERALL ENGINEERING SCORE (Weighted composite)
    const overallEngineeringScore = Math.round(
      comfortScore * 0.20 +
      durabilityScore * 0.25 +
      warrantyScore * 0.15 +
      manufacturingScore * 0.15 +
      costEfficiencyScore * 0.10 +
      luxuryPositioningScore * 0.15
    );

    // Classification
    let classification: 'Elite' | 'Premium' | 'Standard' | 'Basic' | 'Requires Review' = 'Standard';
    let classificationAr = 'معياري (Standard)';
    if (overallEngineeringScore >= 90) {
      classification = 'Elite';
      classificationAr = 'نخبة هندسية (Elite)';
    } else if (overallEngineeringScore >= 80) {
      classification = 'Premium';
      classificationAr = 'فاخر متقدم (Premium)';
    } else if (overallEngineeringScore >= 70) {
      classification = 'Standard';
      classificationAr = 'صناعي معياري (Standard)';
    } else if (overallEngineeringScore >= 60) {
      classification = 'Basic';
      classificationAr = 'اقتصادي أساسي (Basic)';
    } else {
      classification = 'Requires Review';
      classificationAr = 'يتطلب مراجعة هندسية (Requires Review)';
    }

    // Estimated Lifetime
    let estimatedLifetimeYears = 7;
    if (overallEngineeringScore >= 90) estimatedLifetimeYears = 12;
    else if (overallEngineeringScore >= 80) estimatedLifetimeYears = 10;
    else if (overallEngineeringScore >= 70) estimatedLifetimeYears = 8;
    else if (overallEngineeringScore >= 60) estimatedLifetimeYears = 5;
    else estimatedLifetimeYears = 3;

    // Comfort Classification
    let comfortClassificationAr = 'متوسط الراحة والتجاوب (Medium Balance)';
    if (comfortScore >= 90) comfortClassificationAr = 'راحة ملكية سحابية فائقة (Ultra Plush Cloud)';
    else if (comfortScore >= 80) comfortClassificationAr = 'راحة فندقية مرنة متوازنة (Plush Luxury)';
    else if (comfortScore >= 70) comfortClassificationAr = 'دعم متوسط متزن (Medium Ergonomic)';
    else comfortClassificationAr = 'دعم صلب مباشر (Firm Support)';

    // Quality Classification
    let qualityClassificationAr = 'درجة صناعية أولى (Industrial Grade A)';
    if (durabilityScore >= 90) qualityClassificationAr = 'فئة المستشفيات والفنادق 5 نجوم (Grade A+ Hospitality)';
    else if (durabilityScore >= 80) qualityClassificationAr = 'فئة تجارية ممتازة (Grade A Commercial)';
    else if (durabilityScore >= 70) qualityClassificationAr = 'فئة تجزئة معيارية (Grade B Retail)';
    else qualityClassificationAr = 'فئة اقتصادية أساسية (Grade C Economy)';

    // Suggested Market Segment
    let suggestedMarketSegment: DetailedEngineeringScores['suggestedMarketSegment'] = 'Retail Standard';
    if (medicalSuitabilityScore >= 85) suggestedMarketSegment = 'Medical';
    else if (hotelSuitabilityScore >= 85) suggestedMarketSegment = 'Hotel';
    else if (luxuryPositioningScore >= 88) suggestedMarketSegment = 'Luxury Residential';
    else if (exportSuitabilityScore >= 90 && totalThickness <= 28) suggestedMarketSegment = 'Export Roll-Pack';
    else if (hasBonnell) suggestedMarketSegment = 'Economic';

    // Strengths and recommendations
    const strengthsAr: string[] = [];
    const recommendationsAr: string[] = [];

    if (hasPocketSpring) strengthsAr.push('عزل تام للاهتزاز والحركة للشركاء.');
    if (hasLatex) strengthsAr.push('مرونة طبيعية دائمة ومقاومة فائقة للبكتيريا والرطوبة.');
    if (hasGel) strengthsAr.push('تنظيم حراري وتبديد فعال لسخونة السطح.');
    if (hasFelt) strengthsAr.push('حماية ميكانيكية متكاملة لطبقات الإسفنج من أسلاك السوست.');
    if (durabilityScore >= 85) strengthsAr.push('عمر تشغيلي فائق يدعم ضمان 10+ سنوات بأمان مالي تام.');

    if (!hasFelt && (hasPocketSpring || hasBonnell)) {
      recommendationsAr.push('يجب إضافة طبقة لباد عازل (Cotton Felt) فوق شاسيه السوست لمنع اختراق الإسفنج.');
    }
    if (avgFoamDensity < 28 && totalThickness > 25) {
      recommendationsAr.push('يُنصح برفع كثافة إسفنج الدعم إلى 32+ كجم/م³ لتفادي الهبوط المبكر.');
    }
    if (hasBonnell && hotelSuitabilityScore > 60) {
      recommendationsAr.push('للمشاريع الفندقية، يفضل الترقية إلى سوست جيبية (Pocket Springs) لرفع درجة تقييم الضيافة.');
    }

    return {
      comfortScore,
      durabilityScore,
      warrantyScore,
      manufacturingScore,
      costEfficiencyScore,
      medicalSuitabilityScore,
      hotelSuitabilityScore,
      exportSuitabilityScore,
      luxuryPositioningScore,
      overallEngineeringScore,
      classification,
      classificationAr,
      estimatedLifetimeYears,
      comfortClassificationAr,
      qualityClassificationAr,
      suggestedMarketSegment,
      strengthsAr,
      recommendationsAr
    };
  }
}
