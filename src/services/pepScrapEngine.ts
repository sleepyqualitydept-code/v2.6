/**
 * SLEEPEE INDUSTRIAL PEP SCRAP ENGINE
 * ===================================
 * Multi-level Scrap, Reject, and Rework Cost Analysis Engine.
 * 
 * Tracks waste across 4 industrial levels:
 * 1. Material Level (Raw material trimmings and cut-off loss)
 * 2. Operation Level (Machine processing faults and sewing errors)
 * 3. Assembly Level (Sub-assembly defect and structural rejects)
 * 4. Finished Product Level (Final inspection rejects and warranty quarantine)
 */

export interface ScrapLevelRecord {
  level: 'Material' | 'Operation' | 'Assembly' | 'Finished Product';
  levelAr: string;
  scrapPercentage: number;
  rejectPercentage: number;
  reworkPercentage: number;
  wasteCost: number;
  recoveryCost: number;
  netLossCost: number; // wasteCost - recoveryCost
  descriptionAr: string;
}

export interface ScrapEngineReport {
  totalWasteCost: number;
  totalRecoveryCost: number;
  totalNetLossCost: number;
  overallScrapImpactPercentage: number;
  levels: ScrapLevelRecord[];
}

export class PepScrapEngine {
  public static calculateScrapAnalysis(params: {
    directMaterialCost: number;
    directLaborCost: number;
    machineCost: number;
    targetHeight: number;
  }): ScrapEngineReport {
    const { directMaterialCost, directLaborCost, machineCost } = params;
    const baseMfg = directMaterialCost + directLaborCost + machineCost;

    // 1. Material Level Scrap (Cut-off foam trimmings, fabric selvage waste)
    const matWasteCost = Math.round(directMaterialCost * 0.045 * 100) / 100;
    const matRecovery = Math.round(matWasteCost * 0.35 * 100) / 100; // 35% recovered via rebond recycling
    const matNet = Math.round((matWasteCost - matRecovery) * 100) / 100;

    // 2. Operation Level Scrap (CNC cutting errors, sewing tension defects, coil jam)
    const opWasteCost = Math.round((directLaborCost + machineCost) * 0.035 * 100) / 100;
    const opRecovery = Math.round(opWasteCost * 0.15 * 100) / 100;
    const opNet = Math.round((opWasteCost - opRecovery) * 100) / 100;

    // 3. Assembly Level Scrap (Border tape-edge misalignment, quilt bonding defects)
    const assWasteCost = Math.round(baseMfg * 0.02 * 100) / 100;
    const assRecovery = Math.round(assWasteCost * 0.20 * 100) / 100;
    const assNet = Math.round((assWasteCost - assRecovery) * 100) / 100;

    // 4. Finished Product Level Scrap (Final QA dimensional defect, cosmetic rejection)
    const fpWasteCost = Math.round(baseMfg * 0.012 * 100) / 100;
    const fpRecovery = Math.round(fpWasteCost * 0.40 * 100) / 100; // Discounted B-grade outlet sale
    const fpNet = Math.round((fpWasteCost - fpRecovery) * 100) / 100;

    const levels: ScrapLevelRecord[] = [
      {
        level: 'Material',
        levelAr: 'مستوى الخامات المباشرة',
        scrapPercentage: 4.5,
        rejectPercentage: 1.2,
        reworkPercentage: 0.8,
        wasteCost: matWasteCost,
        recoveryCost: matRecovery,
        netLossCost: matNet,
        descriptionAr: 'زوائد قص وتفصيل الأقمشة وإسفنج الحواف - يعاد تدوير إسفنج الريبوند.'
      },
      {
        level: 'Operation',
        levelAr: 'مستوى عمليات التشغيل والماكينات',
        scrapPercentage: 3.5,
        rejectPercentage: 1.8,
        reworkPercentage: 2.5,
        wasteCost: opWasteCost,
        recoveryCost: opRecovery,
        netLossCost: opNet,
        descriptionAr: 'انقطاع خيوط التطريز وتعديل شد السوست الجيبية قبل التجميع.'
      },
      {
        level: 'Assembly',
        levelAr: 'مستوى المجموعات والتجميع الوسيط',
        scrapPercentage: 2.0,
        rejectPercentage: 1.0,
        reworkPercentage: 3.2,
        wasteCost: assWasteCost,
        recoveryCost: assRecovery,
        netLossCost: assNet,
        descriptionAr: 'إعادة حياكة شريط الداير Tape Edge وتثبيت اللباد المعزول.'
      },
      {
        level: 'Finished Product',
        levelAr: 'مستوى المنتج التام وفحص الجودة النهائي',
        scrapPercentage: 1.2,
        rejectPercentage: 0.5,
        reworkPercentage: 1.5,
        wasteCost: fpWasteCost,
        recoveryCost: fpRecovery,
        netLossCost: fpNet,
        descriptionAr: 'اختبارات الاستواء والوزن النهائي - فرز نخب ثاني (B-Grade).'
      }
    ];

    const totalWasteCost = Math.round((matWasteCost + opWasteCost + assWasteCost + fpWasteCost) * 100) / 100;
    const totalRecoveryCost = Math.round((matRecovery + opRecovery + assRecovery + fpRecovery) * 100) / 100;
    const totalNetLossCost = Math.round((totalWasteCost - totalRecoveryCost) * 100) / 100;
    const overallScrapImpactPercentage = baseMfg > 0 
      ? Math.round((totalNetLossCost / baseMfg) * 1000) / 10 
      : 2.8;

    return {
      totalWasteCost,
      totalRecoveryCost,
      totalNetLossCost,
      overallScrapImpactPercentage,
      levels
    };
  }
}
