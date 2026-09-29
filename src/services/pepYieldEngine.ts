/**
 * SLEEPEE INDUSTRIAL PEP YIELD ENGINE
 * ===================================
 * Deterministic manufacturing yield calculation engine for mattress BOM components.
 * 
 * Formula:
 * Actual Consumption = Theoretical Consumption / (Yield % / 100)
 * Loss % = 100 - Yield %
 * Yield Loss Cost = (Actual Consumption - Theoretical Consumption) * Unit Cost
 */

export interface MaterialYieldRecord {
  materialCode: string;
  materialName: string;
  category: string;
  theoreticalConsumption: number;
  uom: string;
  yieldPercentage: number; // e.g. 92 for 92%
  actualConsumption: number; // calculated: theoretical / (yield / 100)
  lossPercentage: number; // 100 - yieldPercentage
  recoveryPercentage: number; // portion of scrap recoverable (e.g. rebond foam crumb)
  unitCost: number;
  theoreticalCost: number;
  actualCost: number;
  yieldLossCost: number; // actualCost - theoreticalCost
}

export interface ProductYieldSummary {
  overallYieldPercentage: number;
  totalTheoreticalCost: number;
  totalActualCost: number;
  totalYieldLossCost: number;
  recoverableScrapValue: number;
  netYieldLossCost: number;
  records: MaterialYieldRecord[];
}

export class PepYieldEngine {
  /**
   * Default industrial standard yield percentages by material category
   */
  public static getDefaultYield(category: string): { yieldPct: number; recoveryPct: number } {
    const cat = (category || '').toLowerCase();
    if (cat.includes('fabric') || cat.includes('قماش') || cat.includes('textile')) {
      return { yieldPct: 92, recoveryPct: 2 }; // Fabric cutting losses ~8%
    }
    if (cat.includes('fiber') || cat.includes('فايبر')) {
      return { yieldPct: 94, recoveryPct: 3 };
    }
    if (cat.includes('foam') || cat.includes('فوم') || cat.includes('إسفنج')) {
      return { yieldPct: 95, recoveryPct: 60 }; // Foam scrap can be converted into rebond
    }
    if (cat.includes('felt') || cat.includes('لباد')) {
      return { yieldPct: 96, recoveryPct: 5 };
    }
    if (cat.includes('spring') || cat.includes('سوست') || cat.includes('شاسيه')) {
      return { yieldPct: 99, recoveryPct: 80 }; // Wire coil rejects recycled
    }
    if (cat.includes('border') || cat.includes('شريط') || cat.includes('tape')) {
      return { yieldPct: 94, recoveryPct: 0 };
    }
    return { yieldPct: 95, recoveryPct: 10 };
  }

  /**
   * Compute comprehensive yield analysis for a list of BOM layers
   */
  public static calculateYield(layers: any[]): ProductYieldSummary {
    let totalTheoreticalCost = 0;
    let totalActualCost = 0;
    let totalYieldLossCost = 0;
    let totalRecoverableValue = 0;

    const records: MaterialYieldRecord[] = layers.map((layer, idx) => {
      const cat = layer.category || layer.layerType || 'Foam';
      const defaults = this.getDefaultYield(cat);
      const yieldPct = layer.yieldPercentage !== undefined ? Number(layer.yieldPercentage) : defaults.yieldPct;
      const recoveryPct = layer.recoveryPercentage !== undefined ? Number(layer.recoveryPercentage) : defaults.recoveryPct;

      const theoretical = Number(layer.thickness) || Number(layer.quantity) || 1;
      const yieldRatio = Math.max(0.1, yieldPct / 100);
      const actual = Math.round((theoretical / yieldRatio) * 100) / 100;
      const lossPct = Math.round((100 - yieldPct) * 10) / 10;

      const unitCost = Number(layer.cost) / (theoretical || 1);
      const theoreticalCost = Math.round(Number(layer.cost) * 100) / 100;
      const actualCost = Math.round((actual * unitCost) * 100) / 100;
      const yieldLoss = Math.round((actualCost - theoreticalCost) * 100) / 100;

      const recoverable = Math.round((yieldLoss * (recoveryPct / 100)) * 100) / 100;

      totalTheoreticalCost += theoreticalCost;
      totalActualCost += actualCost;
      totalYieldLossCost += yieldLoss;
      totalRecoverableValue += recoverable;

      return {
        materialCode: layer.materialCode || `RAW-${idx + 101}`,
        materialName: layer.material || `Material ${idx + 1}`,
        category: cat,
        theoreticalConsumption: theoretical,
        uom: layer.uom || (cat.toLowerCase().includes('fabric') ? 'm²' : 'cm'),
        yieldPercentage: yieldPct,
        actualConsumption: actual,
        lossPercentage: lossPct,
        recoveryPercentage: recoveryPct,
        unitCost: Math.round(unitCost * 100) / 100,
        theoreticalCost,
        actualCost,
        yieldLossCost: yieldLoss
      };
    });

    const overallYieldPercentage = totalActualCost > 0 
      ? Math.round((totalTheoreticalCost / totalActualCost) * 1000) / 10
      : 95;

    const netYieldLossCost = Math.round((totalYieldLossCost - totalRecoverableValue) * 100) / 100;

    return {
      overallYieldPercentage,
      totalTheoreticalCost: Math.round(totalTheoreticalCost * 100) / 100,
      totalActualCost: Math.round(totalActualCost * 100) / 100,
      totalYieldLossCost: Math.round(totalYieldLossCost * 100) / 100,
      recoverableScrapValue: Math.round(totalRecoverableValue * 100) / 100,
      netYieldLossCost,
      records
    };
  }
}
