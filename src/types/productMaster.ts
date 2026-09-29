export type Brand = 'Sleepee' | 'SH' | 'Rich House' | 'Comfort';

export type ManufacturingSystem = 'American' | 'German' | 'Other';

export type WarrantyPolicy = '10 Years' | '7 Years' | '5 Years' | 'Declining Warranty' | 'Hybrid Warranty';

export type ProductStatus = 'active' | 'inactive';

export interface ProductMaster {
  id: string;
  brand: Brand;
  model: string;
  productName: string;
  width: number;
  length: number;
  height: number;
  manufacturingSystem: ManufacturingSystem;
  warrantyPolicy: WarrantyPolicy;
  sapMaterialCode?: string;
  status: ProductStatus;
  createdAt: string;
}
