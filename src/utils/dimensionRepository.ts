import { ErpDatabase } from './erpDb';
import { Size, Product, Model } from '../types/erp';

/**
 * Single source of truth repository for factory standard dimensions and model-dimension relationships.
 * Enforces unified dimension resolution across Product Master, Production Center, Coding Center, and Print Center.
 */
export class DimensionMasterRepository {
  /**
   * Retrieves all 39 standard factory dimensions from Standard Dimension Master.
   */
  public static getAllStandardDimensions(): Size[] {
    return ErpDatabase.getSizes();
  }

  /**
   * Retrieves all valid standard dimensions for a selected Brand and Model.
   * Every model inherits complete visibility to all 39 standard dimensions.
   */
  public static getDimensionsForModel(modelId?: string, brandId?: string): Size[] {
    return ErpDatabase.getSizes();
  }

  /**
   * Finds a dimension record by ID or key string (e.g. 'DIM-100-195').
   */
  public static getDimensionById(sizeId: string): Size | undefined {
    const sizes = ErpDatabase.getSizes();
    return sizes.find(s => s.id === sizeId || `DIM-${s.width}-${s.length}` === sizeId);
  }

  /**
   * Finds a dimension record by width and length values.
   */
  public static getDimensionByWidthLength(width: number, length: number): Size | undefined {
    return ErpDatabase.getSizes().find(s => s.width === width && s.length === length);
  }

  /**
   * Validates if width and length match official factory dimensions.
   */
  public static isValidFactoryDimension(width: number, length: number): boolean {
    const validWidths = [80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];
    const validLengths = [190, 195, 200];
    return validWidths.includes(width) && validLengths.includes(length);
  }
}
