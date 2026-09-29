/**
 * PRODUCT VARIANT ARCHITECTURE & GOVERNANCE SERVICE (v2.0)
 * ========================================================
 * Primary Key Architecture: [Brand]-[Model]-[Width]-[Length]-H[Height]
 * Sourced strictly from Model Approved Variants.
 * No standalone dimension or height registries outside the product variant.
 */

import { ErpDatabase } from '../utils/erpDb';
import { Model, Brand, ProductFamily, ProductTechnology } from '../types/erp';

export interface ProductVariant {
  id: string; // e.g. SLP-SILVER-100-195-H25
  variantCode: string; // SLP-SILVER-100-195-H25
  brandId: string;
  brandName: string;
  familyId: string;
  familyNameAr: string;
  modelId: string;
  modelName: string;
  width: number;
  length: number;
  height: number;
  dimensionString: string; // "100×195"
  warrantyPolicyId: string; // e.g. "POL-10Y"
  warrantyYears: number;
  technology: ProductTechnology;
  manufacturingSystem: 'American' | 'German' | 'Other';
  status: 'active' | 'inactive';
}

// Model-Approved Dimensions & Heights Governance (Section 6 & 9)
export interface ModelApprovedDimensionSpec {
  width: number;
  length: number;
  heights: number[];
  labelAr: string;
}

export const MODEL_APPROVED_SPECS: Record<string, {
  approvedDimensions: ModelApprovedDimensionSpec[];
  warrantyPolicyId: string;
  warrantyYears: number;
  technology: ProductTechnology;
  system: 'American' | 'German' | 'Other';
}> = {
  // Silver: 100x195, 120x195, 160x195, 180x195 (Heights: 25, 30) -> POL-10Y (10 Years)
  'MOD-SLP-SILVER': {
    approvedDimensions: [
      { width: 100, length: 195, heights: [25, 30], labelAr: '100 × 195 سم (فردي - Single)' },
      { width: 120, length: 195, heights: [25, 30], labelAr: '120 × 195 سم (فردي ونصف - Super Single)' },
      { width: 160, length: 195, heights: [25, 30], labelAr: '160 × 195 سم (كوين - Queen)' },
      { width: 180, length: 195, heights: [25, 30], labelAr: '180 × 195 سم (كينج قياسي - King)' }
    ],
    warrantyPolicyId: 'POL-10Y',
    warrantyYears: 10,
    technology: 'Pocket Spring',
    system: 'American'
  },
  // Gold: 160x200, 180x200 (Heights: 30, 35) -> POL-12Y (12 Years)
  'MOD-SLP-GOLD': {
    approvedDimensions: [
      { width: 160, length: 200, heights: [30, 35], labelAr: '160 × 200 سم (كوين فندقي - Queen)' },
      { width: 180, length: 200, heights: [30, 35], labelAr: '180 × 200 سم (كينج فندقي - King)' }
    ],
    warrantyPolicyId: 'POL-HYB', // 12 Years hybrid
    warrantyYears: 12,
    technology: 'Pocket Spring',
    system: 'American'
  },
  // Infinity: 180x200, 200x200 (Height: 35) -> POL-10Y
  'MOD-SLP-INFINITY': {
    approvedDimensions: [
      { width: 180, length: 200, heights: [35], labelAr: '180 × 200 سم (كينج - King)' },
      { width: 200, length: 200, heights: [35], labelAr: '200 × 200 سم (سوبر كينج - Super King)' }
    ],
    warrantyPolicyId: 'POL-10Y',
    warrantyYears: 10,
    technology: 'Pocket Spring',
    system: 'German'
  },
  // Classic: 100x195, 120x195, 160x195, 180x195 (Height: 24) -> POL-7Y (7 Years)
  'MOD-SLP-CLASSIC': {
    approvedDimensions: [
      { width: 100, length: 195, heights: [24], labelAr: '100 × 195 سم (فردي - Single)' },
      { width: 120, length: 195, heights: [24], labelAr: '120 × 195 سم (فردي ونصف - Super Single)' },
      { width: 160, length: 195, heights: [24], labelAr: '160 × 195 سم (كوين - Queen)' },
      { width: 180, length: 195, heights: [24], labelAr: '180 × 195 سم (كينج - King)' }
    ],
    warrantyPolicyId: 'POL-7Y',
    warrantyYears: 7,
    technology: 'Bonnell Spring',
    system: 'American'
  }
};

export class ProductVariantService {
  /**
   * Generates standard Variant Code: [Brand]-[Model]-[Width]-[Length]-H[Height]
   * e.g. SLP-SILVER-100-195-H25
   */
  public static generateVariantCode(
    brandPrefix: string,
    modelName: string,
    width: number,
    length: number,
    height: number
  ): string {
    const cleanBrand = (brandPrefix || 'SLP').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const cleanModel = (modelName || 'MODEL').toUpperCase().replace(/\s+/g, '').replace(/[^A-Z0-9]/g, '');
    return `${cleanBrand}-${cleanModel}-${width}-${length}-H${height}`;
  }

  /**
   * Returns Model Approved Dimension specifications (Section 6)
   */
  public static getApprovedDimensionsForModel(modelId: string, modelName: string, defaultHeight = 25): ModelApprovedDimensionSpec[] {
    const found = MODEL_APPROVED_SPECS[modelId];
    if (found) return found.approvedDimensions;

    // Standard catalog default if specific spec not listed
    return [
      { width: 100, length: 195, heights: [defaultHeight], labelAr: '100 × 195 سم (فردي - Single)' },
      { width: 120, length: 195, heights: [defaultHeight], labelAr: '120 × 195 سم (فردي ونصف - Super Single)' },
      { width: 160, length: 195, heights: [defaultHeight], labelAr: '160 × 195 سم (كوين - Queen)' },
      { width: 180, length: 195, heights: [defaultHeight], labelAr: '180 × 195 سم (كينج - King)' }
    ];
  }

  /**
   * Returns Model Approved Warranty Policy (Section 9: Read-Only, no manual selection)
   */
  public static getWarrantyPolicyForModel(modelId: string, modelName: string): { policyId: string; years: number } {
    const found = MODEL_APPROVED_SPECS[modelId];
    if (found) return { policyId: found.warrantyPolicyId, years: found.warrantyYears };

    const name = (modelName || '').toLowerCase();
    if (name.includes('gold') || name.includes('hybrid') || name.includes('infinity')) {
      return { policyId: 'POL-HYB', years: 12 };
    }
    if (name.includes('classic') || name.includes('tulip') || name.includes('cuddle')) {
      return { policyId: 'POL-7Y', years: 7 };
    }
    if (name.includes('med') || name.includes('rm')) {
      return { policyId: 'POL-5Y', years: 5 };
    }
    return { policyId: 'POL-10Y', years: 10 };
  }

  /**
   * Generates or fetches all discrete ProductVariants across all models in catalog
   */
  public static getAllProductVariants(): ProductVariant[] {
    const models = ErpDatabase.getModels();
    const brands = ErpDatabase.getBrands();
    const families = ErpDatabase.getFamilies();
    const variants: ProductVariant[] = [];

    models.forEach(model => {
      const brand = brands.find(b => b.id === model.brandId) || brands[0];
      const family = families.find(f => f.id === model.familyId) || families[0];
      const specs = this.getApprovedDimensionsForModel(model.id, model.name, model.height || 25);
      const policyInfo = this.getWarrantyPolicyForModel(model.id, model.name);

      specs.forEach(dimSpec => {
        dimSpec.heights.forEach(h => {
          const code = this.generateVariantCode(brand.serialPrefix, model.name, dimSpec.width, dimSpec.length, h);
          variants.push({
            id: code,
            variantCode: code,
            brandId: brand.id,
            brandName: brand.name,
            familyId: family.id,
            familyNameAr: family.nameAr,
            modelId: model.id,
            modelName: model.name,
            width: dimSpec.width,
            length: dimSpec.length,
            height: h,
            dimensionString: `${dimSpec.width}×${dimSpec.length}`,
            warrantyPolicyId: policyInfo.policyId,
            warrantyYears: policyInfo.years,
            technology: (model.technology as ProductTechnology) || 'Pocket Spring',
            manufacturingSystem: model.manufacturingSystem || 'American',
            status: 'active'
          });
        });
      });
    });

    return variants;
  }
}
