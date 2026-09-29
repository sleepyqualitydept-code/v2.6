import { 
  Brand, Category, WarrantyPolicy, Product, ProductionOrder, ProductionOrderAudit, 
  ProductionOrderStatus, Batch, BatchStatus, SerialNumber, SerialStatus, WarrantyCertificate, 
  QRCodeRecord, PrintJob, PrintQueueStatus, AuditLog, Customer, Model, Size, CustomDimension, 
  ProductFamily, Project, ProjectProduct, ProductTechnology, ProductLifecycleEvent, 
  ProductLifecycleStage, SerialAllocation, AllocationType, AllocationStatus, PackUnit, 
  PackType, PackStatus, Shipment, ShipmentDestinationType, ShipmentStatus, SalesRecord, 
  SalesStatus, QrRegistry, WarrantyClaimRecord, ProductReplacementRecord, BillOfMaterials, 
  BomMaterialLine, BomStatus, SystemUser, NetworkPrinter, PolicyMapping, EnterpriseSettings,
  PrintTemplate 
} from '../types/erp';
import { WarrantyProduct } from '../types/warranty';

// Official Brands
const SEED_BRANDS: Brand[] = [
  { id: 'SLP', name: 'Sleepee', serialPrefix: 'SLP', warrantyPrefix: 'WAR-SLP' },
  { id: 'SH', name: 'SH', serialPrefix: 'SH', warrantyPrefix: 'WAR-SH' },
  { id: 'CFT', name: 'Comfort', serialPrefix: 'CFT', warrantyPrefix: 'WAR-CFT' },
  { id: 'RH', name: 'Rich House', serialPrefix: 'RH', warrantyPrefix: 'WAR-RH' },
  { id: 'RM', name: 'Rebound Memory', serialPrefix: 'RM', warrantyPrefix: 'WAR-RM' }
];

// Product Family Master (6 Approved Industrial Families as per Governance Fix Pack)
const SEED_FAMILIES: ProductFamily[] = [
  { id: 'FAM-SPRING', code: 'SPRING', nameAr: 'مراتب سوست متصلة (بونيل)', nameEn: 'Spring Mattress', status: 'active', createdDate: '2026-01-10T10:00:00Z', updatedDate: '2026-01-10T10:00:00Z' },
  { id: 'FAM-POCKET', code: 'POCKET', nameAr: 'مراتب سوست منفصلة (بوكيت)', nameEn: 'Pocket Mattress', status: 'active', createdDate: '2026-01-10T10:00:00Z', updatedDate: '2026-01-10T10:00:00Z' },
  { id: 'FAM-MEMORY', code: 'MEMORY', nameAr: 'مراتب ميموري فوم', nameEn: 'Memory Foam Mattress', status: 'active', createdDate: '2026-01-10T10:00:00Z', updatedDate: '2026-01-10T10:00:00Z' },
  { id: 'FAM-REBOUND', code: 'REBOUND', nameAr: 'مراتب ريبوند (طبي مضغوط)', nameEn: 'Rebound Mattress', status: 'active', createdDate: '2026-01-10T10:00:00Z', updatedDate: '2026-01-10T10:00:00Z' },
  { id: 'FAM-HOTEL', code: 'HOTEL', nameAr: 'مراتب فندقية (مشاريع وضيافة)', nameEn: 'Hotel Mattress', status: 'active', createdDate: '2026-01-10T10:00:00Z', updatedDate: '2026-01-10T10:00:00Z' },
  { id: 'FAM-TENDER', code: 'TENDER', nameAr: 'مراتب تندر (مناقصات ومؤسسات)', nameEn: 'Tender Mattress', status: 'active', createdDate: '2026-01-10T10:00:00Z', updatedDate: '2026-01-10T10:00:00Z' }
];

// Approved Categories
const SEED_CATEGORIES: Category[] = [
  { id: 'MAT', name: 'مرتبة' },
  { id: 'PIL', name: 'مخدة' },
  { id: 'CUS', name: 'خدادية' },
  { id: 'PRO', name: 'واقي مرتبة' },
  { id: 'BED', name: 'سرير' },
  { id: 'ACC', name: 'إكسسوار' }
];

// Normalized Warranty Policies
const SEED_POLICIES: WarrantyPolicy[] = [
  { id: 'POL-10Y', name: '10 Years', warrantyYears: 10, description: 'ضمان كامل شامل لمدة عشرة أعوام' },
  { id: 'POL-7Y', name: '7 Years', warrantyYears: 7, description: 'ضمان كامل شامل لمدة سبعة أعوام' },
  { id: 'POL-5Y', name: '5 Years', warrantyYears: 5, description: 'ضمان كامل شامل لمدة خمسة أعوام' },
  { id: 'POL-DEC', name: 'Declining Warranty', warrantyYears: 10, description: 'ضمان متناقص يبدأ كامل الفعالية ويتناقص سنوياً' },
  { id: 'POL-HYB', name: 'Hybrid Warranty', warrantyYears: 12, description: 'ضمان هجين يجمع بين الاستبدال والصيانة المجانية' }
];

interface CatalogModelDef {
  id: string;
  name: string;
  brandId: string;
  familyId: string;
  height: number;
  sys: 'American' | 'German' | 'Other';
  pol: string;
  codePrefix: string;
}

const CATALOG_MODEL_DEFS: CatalogModelDef[] = [
  // SLEEPEE (SLP)
  { id: 'MOD-SLP-SILVER', name: 'Silver', brandId: 'SLP', familyId: 'FAM-SPRING', height: 25, sys: 'American', pol: 'POL-10Y', codePrefix: 'SLV' },
  { id: 'MOD-SLP-JUMBO', name: 'Jumbo', brandId: 'SLP', familyId: 'FAM-SPRING', height: 28, sys: 'American', pol: 'POL-10Y', codePrefix: 'JMB' },
  { id: 'MOD-SLP-GOLD', name: 'Gold', brandId: 'SLP', familyId: 'FAM-SPRING', height: 30, sys: 'American', pol: 'POL-10Y', codePrefix: 'GLD' },
  { id: 'MOD-SLP-COMFORT', name: 'Comfort', brandId: 'SLP', familyId: 'FAM-SPRING', height: 26, sys: 'German', pol: 'POL-10Y', codePrefix: 'CMF' },
  { id: 'MOD-SLP-FOURSEASONS', name: 'Four Season', brandId: 'SLP', familyId: 'FAM-SPRING', height: 28, sys: 'American', pol: 'POL-10Y', codePrefix: '4SS' },
  { id: 'MOD-SLP-INFINITY', name: 'Infinity', brandId: 'SLP', familyId: 'FAM-SPRING', height: 30, sys: 'German', pol: 'POL-10Y', codePrefix: 'INF' },
  { id: 'MOD-SLP-TOP', name: 'Sleepee Top', brandId: 'SLP', familyId: 'FAM-PILLOWTOP', height: 32, sys: 'American', pol: 'POL-10Y', codePrefix: 'STP' },
  { id: 'MOD-SLP-MERA', name: 'Mera', brandId: 'SLP', familyId: 'FAM-SPRING', height: 27, sys: 'German', pol: 'POL-10Y', codePrefix: 'MRA' },
  { id: 'MOD-SLP-REGESTY', name: 'Regesty', brandId: 'SLP', familyId: 'FAM-SPRING', height: 29, sys: 'American', pol: 'POL-10Y', codePrefix: 'RGS' },
  { id: 'MOD-SLP-MEMORY', name: 'Memory', brandId: 'SLP', familyId: 'FAM-MEMORY', height: 28, sys: 'German', pol: 'POL-10Y', codePrefix: 'MMR' },
  { id: 'MOD-SLP-LEXIS', name: 'Lexis', brandId: 'SLP', familyId: 'FAM-SPRING', height: 31, sys: 'American', pol: 'POL-10Y', codePrefix: 'LXS' },
  { id: 'MOD-SLP-CLASSIC', name: 'Classic', brandId: 'SLP', familyId: 'FAM-SPRING', height: 24, sys: 'American', pol: 'POL-10Y', codePrefix: 'CLS' },
  { id: 'MOD-SLP-NEWCLASSIC', name: 'New Classic', brandId: 'SLP', familyId: 'FAM-SPRING', height: 25, sys: 'American', pol: 'POL-10Y', codePrefix: 'NCL' },
  { id: 'MOD-SLP-RELAX', name: 'Relax', brandId: 'SLP', familyId: 'FAM-FOAM', height: 26, sys: 'German', pol: 'POL-10Y', codePrefix: 'RLX' },
  { id: 'MOD-SLP-ROMANCE', name: 'Romance', brandId: 'SLP', familyId: 'FAM-SPRING', height: 28, sys: 'German', pol: 'POL-10Y', codePrefix: 'RMC' },
  { id: 'MOD-SLP-MED18', name: 'Medical 18', brandId: 'SLP', familyId: 'FAM-MEDICAL', height: 18, sys: 'Other', pol: 'POL-10Y', codePrefix: 'M18' },
  { id: 'MOD-SLP-MED20', name: 'Medical 20', brandId: 'SLP', familyId: 'FAM-MEDICAL', height: 20, sys: 'Other', pol: 'POL-10Y', codePrefix: 'M20' },
  { id: 'MOD-SLP-MED22', name: 'Medical 22', brandId: 'SLP', familyId: 'FAM-MEDICAL', height: 22, sys: 'Other', pol: 'POL-10Y', codePrefix: 'M22' },
  { id: 'MOD-SLP-MED25', name: 'Medical 25', brandId: 'SLP', familyId: 'FAM-MEDICAL', height: 25, sys: 'Other', pol: 'POL-10Y', codePrefix: 'M25' },
  { id: 'MOD-SLP-MED30', name: 'Medical 30', brandId: 'SLP', familyId: 'FAM-MEDICAL', height: 30, sys: 'Other', pol: 'POL-10Y', codePrefix: 'M30' },
  { id: 'MOD-SLP-MED35', name: 'Medical 35', brandId: 'SLP', familyId: 'FAM-MEDICAL', height: 35, sys: 'Other', pol: 'POL-10Y', codePrefix: 'M35' },
  { id: 'MOD-SLP-NEWMED25', name: 'New Medical 25', brandId: 'SLP', familyId: 'FAM-MEDICAL', height: 25, sys: 'Other', pol: 'POL-10Y', codePrefix: 'NM25' },
  { id: 'MOD-SLP-NEWMED30', name: 'New Medical 30', brandId: 'SLP', familyId: 'FAM-MEDICAL', height: 30, sys: 'Other', pol: 'POL-10Y', codePrefix: 'NM30' },

  // RICH HOUSE (RH)
  { id: 'MOD-RH-MED20', name: 'Medical 20', brandId: 'RH', familyId: 'FAM-MEDICAL', height: 20, sys: 'Other', pol: 'POL-7Y', codePrefix: 'M20' },
  { id: 'MOD-RH-MED25', name: 'Medical 25', brandId: 'RH', familyId: 'FAM-MEDICAL', height: 25, sys: 'Other', pol: 'POL-7Y', codePrefix: 'M25' },
  { id: 'MOD-RH-MED30', name: 'Medical 30', brandId: 'RH', familyId: 'FAM-MEDICAL', height: 30, sys: 'Other', pol: 'POL-7Y', codePrefix: 'M30' },
  { id: 'MOD-RH-TULIP', name: 'Tulip', brandId: 'RH', familyId: 'FAM-SPRING', height: 26, sys: 'German', pol: 'POL-7Y', codePrefix: 'TLP' },
  { id: 'MOD-RH-GOLD', name: 'Gold', brandId: 'RH', familyId: 'FAM-SPRING', height: 28, sys: 'American', pol: 'POL-7Y', codePrefix: 'GLD' },
  { id: 'MOD-RH-SILVER', name: 'Silver', brandId: 'RH', familyId: 'FAM-SPRING', height: 24, sys: 'American', pol: 'POL-7Y', codePrefix: 'SLV' },

  // COMFORT (CFT)
  { id: 'MOD-CFT-FASCINATION', name: 'Fascination', brandId: 'CFT', familyId: 'FAM-SPRING', height: 28, sys: 'German', pol: 'POL-7Y', codePrefix: 'FSC' },
  { id: 'MOD-CFT-TRANQUILITY', name: 'Tranquility', brandId: 'CFT', familyId: 'FAM-SPRING', height: 30, sys: 'German', pol: 'POL-7Y', codePrefix: 'TRN' },
  { id: 'MOD-CFT-CUDDLE', name: 'Cuddle', brandId: 'CFT', familyId: 'FAM-SPRING', height: 26, sys: 'American', pol: 'POL-7Y', codePrefix: 'CDL' },
  { id: 'MOD-CFT-UNWIND', name: 'Unwind', brandId: 'CFT', familyId: 'FAM-SPRING', height: 27, sys: 'German', pol: 'POL-7Y', codePrefix: 'UNW' },
  { id: 'MOD-CFT-UNWINDLATEX', name: 'Unwind Natural Latex', brandId: 'CFT', familyId: 'FAM-LATEX', height: 29, sys: 'German', pol: 'POL-7Y', codePrefix: 'UNL' },

  // SH (SH)
  { id: 'MOD-SH-KIDSTRONG', name: 'Kidstrong', brandId: 'SH', familyId: 'FAM-SPRING', height: 20, sys: 'German', pol: 'POL-10Y', codePrefix: 'KDS' },
  { id: 'MOD-SH-TOTAL', name: 'Total Support', brandId: 'SH', familyId: 'FAM-SPRING', height: 27, sys: 'German', pol: 'POL-10Y', codePrefix: 'TSP' },
  { id: 'MOD-SH-SUPERSTRONG', name: 'Superstrong', brandId: 'SH', familyId: 'FAM-SPRING', height: 28, sys: 'American', pol: 'POL-10Y', codePrefix: 'SST' },
  { id: 'MOD-SH-RESTCALM', name: 'Restcalm', brandId: 'SH', familyId: 'FAM-SPRING', height: 26, sys: 'German', pol: 'POL-10Y', codePrefix: 'RST' },
  { id: 'MOD-SH-DURAFIRM', name: 'Durafirm', brandId: 'SH', familyId: 'FAM-SPRING', height: 25, sys: 'American', pol: 'POL-10Y', codePrefix: 'DFR' },
  { id: 'MOD-SH-ESSENTIAL', name: 'Essential', brandId: 'SH', familyId: 'FAM-SPRING', height: 24, sys: 'American', pol: 'POL-10Y', codePrefix: 'ESS' },
  { id: 'MOD-SH-SENSA', name: 'Sensa', brandId: 'SH', familyId: 'FAM-SPRING', height: 29, sys: 'German', pol: 'POL-10Y', codePrefix: 'SNS' },
  { id: 'MOD-SH-SMARTCOOL', name: 'Smartcool', brandId: 'SH', familyId: 'FAM-SPRING', height: 30, sys: 'German', pol: 'POL-10Y', codePrefix: 'SMC' },
  { id: 'MOD-SH-COOLTECH', name: 'Cooltech', brandId: 'SH', familyId: 'FAM-SPRING', height: 31, sys: 'German', pol: 'POL-10Y', codePrefix: 'CLT' },
  { id: 'MOD-SH-DELIGHT', name: 'Delight', brandId: 'SH', familyId: 'FAM-SPRING', height: 27, sys: 'American', pol: 'POL-10Y', codePrefix: 'DLG' },
  { id: 'MOD-SH-JOY', name: 'Joy', brandId: 'SH', familyId: 'FAM-SPRING', height: 25, sys: 'American', pol: 'POL-10Y', codePrefix: 'JOY' },

  // REBOUND MEMORY (RM)
  { id: 'MOD-RM-25', name: 'Rebound Memory 25', brandId: 'RM', familyId: 'FAM-REBOUND', height: 25, sys: 'Other', pol: 'POL-5Y', codePrefix: 'RM25' },
  { id: 'MOD-RM-30', name: 'Rebound Memory 30', brandId: 'RM', familyId: 'FAM-REBOUND', height: 30, sys: 'Other', pol: 'POL-5Y', codePrefix: 'RM30' }
];

const SEED_MODELS: Model[] = CATALOG_MODEL_DEFS.map(m => ({
  id: m.id,
  name: m.name,
  brandId: m.brandId,
  familyId: m.familyId,
  height: m.height,
  manufacturingSystem: m.sys,
  warrantyPolicyId: m.pol,
  status: 'active',
  createdDate: '2026-01-10T10:00:00Z',
  updatedDate: '2026-01-10T10:00:00Z'
}));

const STANDARD_WIDTHS = [80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];
const STANDARD_LENGTHS = [190, 195, 200];

const SEED_STANDARD_DIMENSIONS: Size[] = [];
STANDARD_LENGTHS.forEach(length => {
  STANDARD_WIDTHS.forEach(width => {
    SEED_STANDARD_DIMENSIONS.push({
      id: `DIM-${width}-${length}`,
      width,
      length,
      displayName: `${width}×${length}`,
      status: 'active'
    });
  });
});

const SEED_SIZES: Size[] = SEED_STANDARD_DIMENSIONS;
const SEED_PRODUCTS: Product[] = [];

// Selected standard dimensions per catalog model for catalog product specs
const CATALOG_SAMPLE_DIMENSIONS = [
  { width: 100, length: 195 },
  { width: 120, length: 195 },
  { width: 160, length: 195 },
  { width: 180, length: 195 }
];

CATALOG_MODEL_DEFS.forEach((modelDef) => {
  CATALOG_SAMPLE_DIMENSIONS.forEach((dim) => {
    const sizeId = `DIM-${dim.width}-${dim.length}`;
    const productId = `PROD-${modelDef.id.replace('MOD-', '')}-${dim.width}-${dim.length}`;
    const sapMaterialCode = `SAP-${modelDef.brandId}-${modelDef.codePrefix}-${dim.width}X${dim.length}`;
    const internalProductCode = `${modelDef.brandId}-MAT-${modelDef.codePrefix}${dim.width}X${dim.length}`;

    let defaultTechs: ('Bonnell Spring' | 'Pocket Spring' | 'Foam' | 'Rebound Foam' | 'Memory Foam' | 'HR Foam' | 'Latex' | 'Hybrid')[] = ['Bonnell Spring'];
    if (modelDef.name.includes('Memory')) {
      defaultTechs = ['Memory Foam', 'Foam'];
    } else if (modelDef.name.includes('Latex')) {
      defaultTechs = ['Latex', 'Pocket Spring'];
    } else if (modelDef.name.includes('Medical') || modelDef.brandId === 'RM') {
      defaultTechs = ['Rebound Foam', 'Foam'];
    } else if (modelDef.sys === 'German' || modelDef.name.includes('Infinity') || modelDef.name.includes('Top')) {
      defaultTechs = ['Pocket Spring', 'HR Foam'];
    }

    SEED_PRODUCTS.push({
      id: productId,
      productType: 'standard',
      brandId: modelDef.brandId,
      categoryId: 'MAT',
      modelId: modelDef.id,
      sizeId: sizeId,
      modelName: modelDef.name, // Pure model name (e.g. Jumbo, Silver)
      manufacturingSystem: modelDef.sys,
      technologies: defaultTechs,
      width: dim.width,
      length: dim.length,
      height: modelDef.height,
      warrantyPolicyId: modelDef.pol,
      sapMaterialCode,
      internalProductCode,
      status: 'active',
      createdDate: '2026-01-10T10:00:00Z',
      updatedDate: '2026-01-10T10:00:00Z',
      notes: 'منتج معتمد ضمن الكتالوج الرسمي 2026'
    });
  });
});

export class ErpDatabase {
  private static initPurge(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const purgeKey = 'sleepee_purge_phase_3d_done';
      if (!localStorage.getItem(purgeKey)) {
        const keysToClean = [
          'sleepee_products', 'products',
          'sleepee_models', 'models',
          'sleepee_families', 'families',
          'sleepee_sizes', 'sizes',
          'sleepee_projects', 'projects',
          'sleepee_project_products', 'projectProducts',
          'sleepee_production_orders', 'productionOrders',
          'sleepee_print_jobs', 'printQueue',
          'catalogData', 'masterData', 'seedData', 'demoData', 'mockData'
        ];
        keysToClean.forEach((k) => localStorage.removeItem(k));
        localStorage.setItem(purgeKey, 'true');
      }
    } catch {
      // Ignore storage errors
    }
  }

  private static getStorageItem<T>(key: string, defaultValue: T): T {
    this.initPurge();
    const val = localStorage.getItem(key);
    if (!val) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    try {
      return JSON.parse(val);
    } catch {
      return defaultValue;
    }
  }

  private static setStorageItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Collections accessors
  public static getBrands(): Brand[] {
    return this.getStorageItem<Brand[]>('sleepee_brands', SEED_BRANDS);
  }

  public static getCategories(): Category[] {
    return this.getStorageItem<Category[]>('sleepee_categories', SEED_CATEGORIES);
  }

  public static getFamilies(): ProductFamily[] {
    return this.getStorageItem<ProductFamily[]>('sleepee_families', SEED_FAMILIES);
  }

  public static saveFamilies(families: ProductFamily[]): void {
    this.setStorageItem('sleepee_families', families);
  }

  public static getProjects(): Project[] {
    return this.getStorageItem<Project[]>('sleepee_projects', []);
  }

  public static saveProjects(projects: Project[]): void {
    this.setStorageItem('sleepee_projects', projects);
  }

  public static getProjectProducts(): ProjectProduct[] {
    return this.getStorageItem<ProjectProduct[]>('sleepee_project_products', []);
  }

  public static saveProjectProducts(prods: ProjectProduct[]): void {
    this.setStorageItem('sleepee_project_products', prods);
  }

  public static getModels(): Model[] {
    return this.getStorageItem<Model[]>('sleepee_models', SEED_MODELS);
  }

  public static saveModels(models: Model[]): void {
    this.setStorageItem('sleepee_models', models);
  }

  public static getSizes(): Size[] {
    return this.getStorageItem<Size[]>('sleepee_sizes', SEED_SIZES);
  }

  public static saveSizes(sizes: Size[]): void {
    this.setStorageItem('sleepee_sizes', sizes);
  }

  public static getCustomDimensions(): CustomDimension[] {
    return this.getStorageItem<CustomDimension[]>('sleepee_custom_dimensions', []);
  }

  public static saveCustomDimensions(dims: CustomDimension[]): void {
    this.setStorageItem('sleepee_custom_dimensions', dims);
  }

  public static getWarrantyPolicies(): WarrantyPolicy[] {
    return this.getStorageItem<WarrantyPolicy[]>('sleepee_policies', SEED_POLICIES);
  }

  public static getProducts(): Product[] {
    return this.getStorageItem<Product[]>('sleepee_products', SEED_PRODUCTS);
  }

  public static saveProducts(products: Product[]): void {
    this.setStorageItem('sleepee_products', products);
  }

  public static addProduct(productData: Omit<Product, 'id' | 'createdDate' | 'updatedDate'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...productData,
      id: `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };
    products.unshift(newProduct);
    this.saveProducts(products);
    this.addAuditLog('Product Created', `تم تعريف منتج جديد: ${newProduct.modelName} (${newProduct.internalProductCode})`);
    return newProduct;
  }

  // ============================================================================
  // PART 6: MATERIAL BOM ACCESSORS
  // ============================================================================
  public static getBOMs(): BillOfMaterials[] {
    const defaultBOMs: BillOfMaterials[] = [
      {
        id: 'BOM-2026-000001',
        bomNumber: 'BOM-2026-000001',
        bomName: 'وصفة تصنيع مرتبة جامبو (Jumbo Standard Recipe)',
        brandId: 'SLP',
        familyId: 'FAM-SPRING',
        modelId: 'MOD-SLP-JUMBO',
        version: 'v1.0',
        status: 'Active',
        createdBy: 'مهندس تخطيط الإنتاج والجودة',
        createdDate: '2026-01-10T10:00:00Z',
        updatedDate: '2026-01-10T10:00:00Z',
        materials: [
          { id: 'MAT-1', materialCode: 'MAT-SP-BONNELL', materialName: 'شبكة شاسيه زنبرك بونيل (Bonnell Spring Core)', quantity: 1, unit: 'set', notes: 'سلك صلب 2.2 ملم معالج حرارياً' },
          { id: 'MAT-2', materialCode: 'MAT-FM-HIGH30', materialName: 'طبقة إسفنج عالي الكثافة (High Density Foam 30D)', quantity: 4.2, unit: 'm2', notes: 'طبقات دعم سفلية وعلوية' },
          { id: 'MAT-3', materialCode: 'MAT-FELT-1000', materialName: 'لباد قطني مضغوط عازل (Compressed Cotton Felt)', quantity: 2, unit: 'pcs', notes: 'عازل شاسيه الحماية' },
          { id: 'MAT-4', materialCode: 'MAT-FAB-JACQ', materialName: 'قماش فاخر منسوج جاكار (Jacquard Quilted Fabric)', quantity: 5.5, unit: 'm', notes: 'معالج ضد البكتيريا وحشرة الفراش' },
          { id: 'MAT-5', materialCode: 'MAT-BORDER-TAPE', materialName: 'شريط تطريز الحواف (Border Binding Tape)', quantity: 8.5, unit: 'm', notes: 'عرض 38 ملم' },
          { id: 'MAT-6', materialCode: 'MAT-VENT-CHR', materialName: 'فتحات تهوية كرومية (Chrome Air Vents)', quantity: 4, unit: 'pcs', notes: 'تجديد الهواء الذاتي' },
          { id: 'MAT-7', materialCode: 'MAT-HANDLE-EMB', materialName: 'مقابض حمل مطرزة (Embroidered Side Handles)', quantity: 4, unit: 'pcs', notes: 'تسهيل النقل والتدوير' },
          { id: 'MAT-8', materialCode: 'MAT-PKG-POLY', materialName: 'غلاف بولي إيثيلين سميك للحماية (Heavy Duty Poly Packaging)', quantity: 1, unit: 'roll', notes: 'مقاوم للرطوبة والغبار' }
        ]
      },
      {
        id: 'BOM-2026-000002',
        bomNumber: 'BOM-2026-000002',
        bomName: 'وصفة تصنيع مرتبة جولد (Gold Luxury Recipe)',
        brandId: 'SLP',
        familyId: 'FAM-SPRING',
        modelId: 'MOD-SLP-GOLD',
        version: 'v1.0',
        status: 'Active',
        createdBy: 'مهندس تخطيط الإنتاج والجودة',
        createdDate: '2026-01-10T10:00:00Z',
        updatedDate: '2026-01-10T10:00:00Z',
        materials: [
          { id: 'MAT-1', materialCode: 'MAT-SP-POCKET', materialName: 'شاسيه سوست منفصلة 7 مناطق (7-Zone Pocket Spring)', quantity: 1, unit: 'set', notes: 'عزل تام للحركة' },
          { id: 'MAT-2', materialCode: 'MAT-FM-MEM50', materialName: 'طبقة ميموري فوم ذكي (Visco Memory Foam 50D)', quantity: 3.5, unit: 'm2', notes: 'تخفيف نقاط الضغط' },
          { id: 'MAT-3', materialCode: 'MAT-FM-HR35', materialName: 'طبقة إسفنج عالي المرونة (HR Foam 35D)', quantity: 4.0, unit: 'm2', notes: 'طبقة ارتداد مريحة' },
          { id: 'MAT-4', materialCode: 'MAT-FAB-KNIT', materialName: 'قماش تريكو مستورد ناعم (Organic Knitted Fabric)', quantity: 6.0, unit: 'm', notes: 'ملمس ناعم فائق الجودة' },
          { id: 'MAT-5', materialCode: 'MAT-PKG-POLY', materialName: 'تغليف نايلون مضغوط مزدوج (Double Poly Wrap)', quantity: 1, unit: 'roll', notes: 'حماية كاملة أثناء الشحن' }
        ]
      },
      {
        id: 'BOM-2026-000003',
        bomNumber: 'BOM-2026-000003',
        bomName: 'وصفة تصنيع مرتبة كومفورت فاسينيشن (Comfort Fascination Recipe)',
        brandId: 'CFT',
        familyId: 'FAM-SPRING',
        modelId: 'MOD-CFT-FASCINATION',
        version: 'v1.0',
        status: 'Active',
        createdBy: 'رئيس قسم الهندسة الصناعية',
        createdDate: '2026-01-11T09:00:00Z',
        updatedDate: '2026-01-11T09:00:00Z',
        materials: [
          { id: 'MAT-1', materialCode: 'MAT-SP-POCKET', materialName: 'شاسيه سوست منفصلة ألماني (German Pocket Spring)', quantity: 1, unit: 'set', notes: 'نظام ألماني متطور' },
          { id: 'MAT-2', materialCode: 'MAT-LATEX-NAT', materialName: 'طبقة لاتكس طبيعي 100% (100% Natural Latex Layer)', quantity: 3.8, unit: 'm2', notes: 'مرونة طبيعية وتهوية فائقة' },
          { id: 'MAT-3', materialCode: 'MAT-FAB-COOL', materialName: 'قماش تقنية كول ماكس (CoolMax Thermo Fabric)', quantity: 5.8, unit: 'm', notes: 'تنظيم حرارة الجسم' }
        ]
      }
    ];
    return this.getStorageItem<BillOfMaterials[]>('sleepee_boms', defaultBOMs);
  }

  public static saveBOMs(boms: BillOfMaterials[]): void {
    this.setStorageItem('sleepee_boms', boms);
  }

  public static addBOM(bomData: Omit<BillOfMaterials, 'id' | 'bomNumber' | 'createdDate' | 'updatedDate'>): BillOfMaterials {
    const boms = this.getBOMs();
    const currentYear = new Date().getFullYear();
    const seq = boms.length + 1;
    const padSeq = (seq + "").padStart(6, '0');
    const bomNumber = `BOM-${currentYear}-${padSeq}`;
    
    // Enforce Rule: Only one Active version per Model
    let updatedBoms = [...boms];
    if (bomData.status === 'Active') {
      updatedBoms = updatedBoms.map(b => 
        b.modelId === bomData.modelId && b.status === 'Active'
          ? { ...b, status: 'Inactive' as BomStatus }
          : b
      );
    }

    const newBOM: BillOfMaterials = {
      ...bomData,
      id: bomNumber,
      bomNumber,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };

    updatedBoms.unshift(newBOM);
    this.saveBOMs(updatedBoms);
    this.addAuditLog('BOM Created', `تم إنشاء وصفة مواد جديدة ${bomNumber} للموديل (${bomData.modelId})`);
    return newBOM;
  }

  public static updateBOM(id: string, updates: Partial<BillOfMaterials>): void {
    let boms = this.getBOMs();
    const target = boms.find(b => b.id === id);
    if (!target) return;

    if (updates.status === 'Active') {
      // Inactivate other versions of the same model
      boms = boms.map(b => 
        b.modelId === (updates.modelId || target.modelId) && b.id !== id && b.status === 'Active'
          ? { ...b, status: 'Inactive' as BomStatus }
          : b
      );
    }

    const updatedBoms = boms.map(b => 
      b.id === id 
        ? { ...b, ...updates, updatedDate: new Date().toISOString() } 
        : b
    );
    this.saveBOMs(updatedBoms);
    this.addAuditLog('BOM Updated', `تم تحديث وصفة المواد ${target.bomNumber}`);
  }

  public static getActiveBOMForModel(modelId: string): BillOfMaterials | undefined {
    return this.getBOMs().find(b => b.modelId === modelId && b.status === 'Active');
  }

  public static getProductionOrders(): ProductionOrder[] {
    return this.getStorageItem<ProductionOrder[]>('sleepee_production_orders', []);
  }

  public static saveProductionOrders(orders: ProductionOrder[]): void {
    this.setStorageItem('sleepee_production_orders', orders);
  }

  public static addProductionOrder(orderData: Omit<ProductionOrder, 'id' | 'productionOrderNumber' | 'createdDate'>): ProductionOrder {
    const orders = this.getProductionOrders();
    const currentYear = new Date().getFullYear();
    const seq = orders.length + 1;
    const padSeq = (seq + "").padStart(6, '0');
    const orderNumber = `PO-${currentYear}-${padSeq}`;
    
    const newOrder: ProductionOrder = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      productionOrderNumber: orderNumber,
      createdDate: new Date().toISOString()
    };
    orders.unshift(newOrder);
    this.saveProductionOrders(orders);
    this.addAuditLog('Order Created', `تم إنشاء أمر إنتاج جديد: ${orderNumber}`);
    return newOrder;
  }

  public static getSerialNumbers(): SerialNumber[] {
    return this.getStorageItem<SerialNumber[]>('sleepee_serial_numbers', []);
  }

  public static saveSerialNumbers(serials: SerialNumber[]): void {
    this.setStorageItem('sleepee_serial_numbers', serials);
  }

  public static getWarrantyCertificates(): WarrantyCertificate[] {
    return this.getStorageItem<WarrantyCertificate[]>('sleepee_warranty_certificates', []);
  }

  public static saveWarrantyCertificates(certs: WarrantyCertificate[]): void {
    this.setStorageItem('sleepee_warranty_certificates', certs);
  }

  public static getQRCodeRegistry(): QRCodeRecord[] {
    return this.getStorageItem<QRCodeRecord[]>('sleepee_qr_registry', []);
  }

  public static saveQRCodeRegistry(records: QRCodeRecord[]): void {
    this.setStorageItem('sleepee_qr_registry', records);
  }

  public static getBatches(): Batch[] {
    return this.getStorageItem<Batch[]>('sleepee_batches', []);
  }

  public static saveBatches(batches: Batch[]): void {
    this.setStorageItem('sleepee_batches', batches);
  }

  public static getProductionOrderAudits(): ProductionOrderAudit[] {
    return this.getStorageItem<ProductionOrderAudit[]>('sleepee_po_audits', []);
  }

  public static saveProductionOrderAudits(audits: ProductionOrderAudit[]): void {
    this.setStorageItem('sleepee_po_audits', audits);
  }

  public static addProductionOrderAudit(audit: Omit<ProductionOrderAudit, 'id' | 'timestamp'>): void {
    const audits = this.getProductionOrderAudits();
    const newAudit: ProductionOrderAudit = {
      ...audit,
      id: `POAUD-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString()
    };
    audits.unshift(newAudit);
    this.saveProductionOrderAudits(audits);
  }

  public static getLifecycleEvents(): ProductLifecycleEvent[] {
    return this.getStorageItem<ProductLifecycleEvent[]>('sleepee_lifecycle_events', []);
  }

  public static saveLifecycleEvents(events: ProductLifecycleEvent[]): void {
    this.setStorageItem('sleepee_lifecycle_events', events);
  }

  public static addLifecycleEvent(event: Omit<ProductLifecycleEvent, 'id' | 'timestamp'>): void {
    const events = this.getLifecycleEvents();
    const newEvent: ProductLifecycleEvent = {
      ...event,
      id: `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString()
    };
    events.unshift(newEvent);
    this.saveLifecycleEvents(events);
  }

  public static getPrintJobs(): PrintJob[] {
    return this.getStorageItem<PrintJob[]>('sleepee_print_jobs', []);
  }

  public static savePrintJobs(jobs: PrintJob[]): void {
    this.setStorageItem('sleepee_print_jobs', jobs);
  }

  public static getPrintQueue(): PrintJob[] {
    return this.getPrintJobs();
  }

  public static savePrintQueue(queue: PrintJob[]): void {
    this.savePrintJobs(queue);
  }

  public static getAuditLogs(): AuditLog[] {
    return this.getStorageItem<AuditLog[]>('sleepee_audit_logs', []);
  }

  public static saveAuditLogs(logs: AuditLog[]): void {
    this.setStorageItem('sleepee_audit_logs', logs);
  }

  public static getCustomers(): Customer[] {
    return this.getStorageItem<Customer[]>('sleepee_customers', []);
  }

  public static saveCustomers(customers: Customer[]): void {
    this.setStorageItem('sleepee_customers', customers);
  }

  // Phase 04-A1: Distribution, Packing, Shipment, Sales & QR Accessors
  public static getAllocations(): SerialAllocation[] {
    return this.getStorageItem<SerialAllocation[]>('sleepee_allocations', []);
  }

  public static saveAllocations(allocations: SerialAllocation[]): void {
    this.setStorageItem('sleepee_allocations', allocations);
  }

  public static addAllocation(allocation: Omit<SerialAllocation, 'allocationId' | 'allocationDate'>): SerialAllocation {
    const allocations = this.getAllocations();
    const currentYear = new Date().getFullYear();
    const seq = allocations.length + 1;
    const padSeq = (seq + "").padStart(6, '0');
    const newAlloc: SerialAllocation = {
      ...allocation,
      allocationId: `ALLOC-${currentYear}-${padSeq}`,
      allocationDate: new Date().toISOString()
    };
    allocations.unshift(newAlloc);
    this.saveAllocations(allocations);
    return newAlloc;
  }

  public static getPacks(): PackUnit[] {
    return this.getStorageItem<PackUnit[]>('sleepee_packs', []);
  }

  public static savePacks(packs: PackUnit[]): void {
    this.setStorageItem('sleepee_packs', packs);
  }

  public static addPack(pack: Omit<PackUnit, 'packId' | 'createdDate'>): PackUnit {
    const packs = this.getPacks();
    const currentYear = new Date().getFullYear();
    const seq = packs.length + 1;
    const padSeq = (seq + "").padStart(6, '0');
    const newPack: PackUnit = {
      ...pack,
      packId: `PK-${currentYear}-${padSeq}`,
      createdDate: new Date().toISOString()
    };
    packs.unshift(newPack);
    this.savePacks(packs);
    return newPack;
  }

  public static getShipments(): Shipment[] {
    return this.getStorageItem<Shipment[]>('sleepee_shipments', []);
  }

  public static saveShipments(shipments: Shipment[]): void {
    this.setStorageItem('sleepee_shipments', shipments);
  }

  public static addShipment(shipment: Omit<Shipment, 'shipmentId' | 'shipmentDate'>): Shipment {
    const shipments = this.getShipments();
    const currentYear = new Date().getFullYear();
    const seq = shipments.length + 1;
    const padSeq = (seq + "").padStart(6, '0');
    const newShipment: Shipment = {
      ...shipment,
      shipmentId: `SHIP-${currentYear}-${padSeq}`,
      shipmentDate: new Date().toISOString()
    };
    shipments.unshift(newShipment);
    this.saveShipments(shipments);
    return newShipment;
  }

  public static getSalesRecords(): SalesRecord[] {
    return this.getStorageItem<SalesRecord[]>('sleepee_sales_records', []);
  }

  public static saveSalesRecords(sales: SalesRecord[]): void {
    this.setStorageItem('sleepee_sales_records', sales);
  }

  public static addSalesRecord(sale: Omit<SalesRecord, 'salesId' | 'createdDate'>): SalesRecord {
    const sales = this.getSalesRecords();
    const currentYear = new Date().getFullYear();
    const seq = sales.length + 1;
    const padSeq = (seq + "").padStart(6, '0');
    const newSale: SalesRecord = {
      ...sale,
      salesId: `SALE-${currentYear}-${padSeq}`,
      createdDate: new Date().toISOString()
    };
    sales.unshift(newSale);
    this.saveSalesRecords(sales);

    // Automatically transition Serial to Sold and log lifecycle event
    const serials = this.getSerialNumbers();
    const updatedSerials = serials.map(s => {
      if (s.serialNumber === sale.serialNumber) {
        return {
          ...s,
          status: 'Sold' as const,
          soldDate: new Date().toISOString()
        };
      }
      return s;
    });
    this.saveSerialNumbers(updatedSerials);

    this.addLifecycleEvent({
      serialNumber: sale.serialNumber,
      productId: serials.find(s => s.serialNumber === sale.serialNumber)?.productId || '',
      batchNumber: serials.find(s => s.serialNumber === sale.serialNumber)?.batchNumber || '',
      stage: 'Sold',
      operator: sale.dealerName || 'مسؤول نقطة البيع',
      location: `${sale.governorate} - ${sale.city}`,
      notes: `تم بيع المنتج بفاتورة رقم #${sale.invoiceNumber} للعميل: ${sale.customerName}`
    });

    return newSale;
  }

  public static getQrRegistries(): QrRegistry[] {
    return this.getStorageItem<QrRegistry[]>('sleepee_qr_registries', []);
  }

  public static saveQrRegistries(records: QrRegistry[]): void {
    this.setStorageItem('sleepee_qr_registries', records);
  }

  public static getWarrantyClaims(): WarrantyClaimRecord[] {
    return this.getStorageItem<WarrantyClaimRecord[]>('sleepee_warranty_claims', []);
  }

  public static saveWarrantyClaims(claims: WarrantyClaimRecord[]): void {
    this.setStorageItem('sleepee_warranty_claims', claims);
  }

  public static getProductReplacements(): ProductReplacementRecord[] {
    return this.getStorageItem<ProductReplacementRecord[]>('sleepee_replacements', []);
  }

  public static saveProductReplacements(replacements: ProductReplacementRecord[]): void {
    this.setStorageItem('sleepee_replacements', replacements);
  }

  public static addOrUpdateCustomer(custData: {
    name: string;
    mobileNumber: string;
    alternativeNumber?: string;
    governorate: string;
    city: string;
    address: string;
    nationalId?: string;
  }): Customer {
    const customers = this.getCustomers();
    const existing = customers.find(c => c.mobileNumber === custData.mobileNumber);
    if (existing) {
      const updated: Customer = {
        ...existing,
        name: custData.name,
        alternativeNumber: custData.alternativeNumber || existing.alternativeNumber,
        governorate: custData.governorate,
        city: custData.city,
        address: custData.address,
        nationalId: custData.nationalId || existing.nationalId,
      };
      const newCustomersList = customers.map(c => c.id === existing.id ? updated : c);
      this.saveCustomers(newCustomersList);
      return updated;
    } else {
      const randNum = Math.floor(10000 + Math.random() * 90000);
      const newCust: Customer = {
        id: `CUST-${randNum}`,
        name: custData.name,
        mobileNumber: custData.mobileNumber,
        alternativeNumber: custData.alternativeNumber,
        governorate: custData.governorate,
        city: custData.city,
        address: custData.address,
        nationalId: custData.nationalId,
        createdDate: new Date().toISOString(),
        status: 'active'
      };
      customers.push(newCust);
      this.saveCustomers(customers);
      return newCust;
    }
  }

  public static addAuditLog(action: string, details: string, operator: string = 'مدير النظام'): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      action,
      details,
      timestamp: new Date().toISOString(),
      operator
    };
    logs.unshift(newLog);
    this.saveAuditLogs(logs);
  }

  // Master Data Auditor (Module 01 & Module 10)
  public static runMasterDataAudit(): {
    duplicates: string[];
    invalidReferences: string[];
    missingRelationships: string[];
    orphanRecords: string[];
    healthPercentage: number;
  } {
    const brands = this.getBrands();
    const categories = this.getCategories();
    const policies = this.getWarrantyPolicies();
    const products = this.getProducts();
    const orders = this.getProductionOrders();
    const serials = this.getSerialNumbers();
    const certificates = this.getWarrantyCertificates();
    const families = this.getFamilies();
    const models = this.getModels();
    const sizes = this.getSizes();

    const duplicates: string[] = [];
    const invalidReferences: string[] = [];
    const missingRelationships: string[] = [];
    const orphanRecords: string[] = [];

    // Auditing duplicate model names
    const modelNames = new Set<string>();
    models.forEach(m => {
      const key = `${m.brandId}-${m.name.toLowerCase()}`;
      if (modelNames.has(key)) {
        duplicates.push(`اسم موديل مكرر للماركة: ${m.name}`);
      }
      modelNames.add(key);
    });

    // Auditing duplicate sizes in Standard Dimensions Master
    const sizeKeys = new Set<string>();
    sizes.forEach(s => {
      const key = `${s.width}x${s.length}`;
      if (sizeKeys.has(key)) {
        duplicates.push(`أبعاد قياسية مكررة بالماستر: ${s.displayName}`);
      }
      sizeKeys.add(key);
    });

    // Check Duplicate products (internal codes / SAP codes)
    const productCodes = new Set<string>();
    const sapCodes = new Set<string>();
    products.forEach(p => {
      if (productCodes.has(p.internalProductCode.toLowerCase())) {
        duplicates.push(`كود منتج مكرر بالمنظومة: ${p.internalProductCode}`);
      }
      productCodes.add(p.internalProductCode.toLowerCase());

      if (p.sapMaterialCode) {
        if (sapCodes.has(p.sapMaterialCode.toLowerCase())) {
          duplicates.push(`كود SAP مادي مكرر بالمنظومة: ${p.sapMaterialCode}`);
        }
        sapCodes.add(p.sapMaterialCode.toLowerCase());
      }

      // Invalid brand references
      if (!brands.some(b => b.id === p.brandId)) {
        invalidReferences.push(`المنتج ${p.modelName} يرتبط بماركة غير صحيحة أو غير معرفة: ${p.brandId}`);
      }
      // Invalid category references
      if (!categories.some(c => c.id === p.categoryId)) {
        invalidReferences.push(`المنتج ${p.modelName} يرتبط بفئة غير صحيحة أو غير معرفة: ${p.categoryId}`);
      }
      // Invalid policy reference
      if (!policies.some(pol => pol.id === p.warrantyPolicyId)) {
        invalidReferences.push(`المنتج ${p.modelName} يرتبط بسياسة ضمان مجهولة: ${p.warrantyPolicyId}`);
      }
      // Cascading Master Data reference checks
      if (p.modelId && !models.some(m => m.id === p.modelId)) {
        invalidReferences.push(`المنتج ${p.modelName} يرتبط بـ Model مفقود أو تالف: ${p.modelId}`);
      }
      if (p.sizeId && !sizes.some(s => s.id === p.sizeId)) {
        invalidReferences.push(`المنتج ${p.modelName} يرتبط بـ Size مفقود أو تالف: ${p.sizeId}`);
      }

      // Strict Cascading Match Auditing
      if (p.modelId && p.brandId) {
        const md = models.find(m => m.id === p.modelId);
        if (md && md.brandId !== p.brandId) {
          invalidReferences.push(`المنتج ${p.modelName} يحتوي على تعارض ماركة: الموديل يتبع ${md.brandId} والمنتج يتبع ${p.brandId}`);
        }
      }
    });

    // Check duplicate serials
    const serialSet = new Set<string>();
    const printJobs = this.getPrintJobs();

    serials.forEach(s => {
      if (serialSet.has(s.serialNumber.toLowerCase())) {
        duplicates.push(`رقم تسلسلي مكرر بنظام التشفير: ${s.serialNumber}`);
      }
      serialSet.add(s.serialNumber.toLowerCase());

      // Check orphans / invalid relationships
      if (!products.some(p => p.id === s.productId)) {
        orphanRecords.push(`السيريال اليتيم ${s.serialNumber}: لا يرتبط بأي منتج نشط.`);
      }
      if (!orders.some(o => o.id === s.productionOrderId)) {
        missingRelationships.push(`السيريال ${s.serialNumber}: يفتقر إلى كود تتبع لأمر إنتاج.`);
      }

      // Check Missing Print Records (DATA INTEGRITY AUDIT - Module 6)
      if (!printJobs.some(job => job.serialNumber === s.serialNumber)) {
        missingRelationships.push(`السيريال ${s.serialNumber}: يفتقر إلى تذكرة طباعة في طابور مركز ملصقات التغليف.`);
      }
    });

    // Check duplicate warranty numbers and orphan warranties
    const warSet = new Set<string>();
    certificates.forEach(c => {
      if (warSet.has(c.warrantyNumber.toLowerCase())) {
        duplicates.push(`شهادة ضمان مكررة بالمنظومة: ${c.warrantyNumber}`);
      }
      warSet.add(c.warrantyNumber.toLowerCase());

      if (!serials.some(s => s.serialNumber === c.serialNumber)) {
        orphanRecords.push(`شهادة ضمان يتيمة ${c.warrantyNumber}: لا ترتبط بأي رقم تسلسلي نشط.`);
      }
      if (!products.some(p => p.id === c.productId)) {
        orphanRecords.push(`شهادة ضمان يتيمة ${c.warrantyNumber}: لا ترتبط بأي منتج في الماستر داتا.`);
      }
    });

    models.forEach(m => {
      if (!brands.some(b => b.id === m.brandId)) {
        invalidReferences.push(`الموديل ${m.name} يرتبط ببراند مفقود: ${m.brandId}`);
      }
      if (m.familyId && !families.some(f => f.id === m.familyId)) {
        invalidReferences.push(`الموديل ${m.name} يرتبط بعائلة منتجات غير معرفة: ${m.familyId}`);
      }
    });

    // Auditing Projects & Project Products (PART 11 Master Data Audit)
    const projects = this.getProjects();
    const projectProducts = this.getProjectProducts();

    projectProducts.forEach(pp => {
      if (!projects.some(prj => prj.id === pp.projectId)) {
        orphanRecords.push(`منتج المشروع اليتيم ${pp.customModelName}: لا ينتمي إلى أي مشروع نشط.`);
      }
      if (!brands.some(b => b.id === pp.brandId)) {
        invalidReferences.push(`منتج المشروع ${pp.customModelName} يرتبط بماركة غير معرفة: ${pp.brandId}`);
      }
      if (pp.familyId && !families.some(f => f.id === pp.familyId)) {
        invalidReferences.push(`منتج المشروع ${pp.customModelName} يرتبط بعائلة منتجات مجهولة: ${pp.familyId}`);
      }
      // Check catalog pollution
      if (models.some(m => m.name.toLowerCase() === pp.customModelName.toLowerCase() && m.id !== 'CUSTOM')) {
        missingRelationships.push(`تنبيه تلوث الكتالوج: منتج مشروع خاص متواجد بجدول موديلات الكتالوج القياسي (${pp.customModelName})`);
      }
    });

    const totalIssues = duplicates.length + invalidReferences.length + missingRelationships.length + orphanRecords.length;
    const healthPercentage = totalIssues === 0 ? 100 : Math.max(0, 100 - totalIssues * 5);

    return {
      duplicates,
      invalidReferences,
      missingRelationships,
      orphanRecords,
      healthPercentage
    };
  }

  public static runProductMasterAudit(): {
    duplicates: string[];
    invalidReferences: string[];
    missingRelationships: string[];
    orphanRecords: string[];
    healthPercentage: number;
  } {
    return this.runMasterDataAudit();
  }

  public static runDimensionAudit(): {
    duplicateStandardDimensions: string[];
    duplicateCustomDimensions: string[];
    brokenReferences: string[];
    missingRelationships: string[];
    orphanDimensions: string[];
    productsWithoutDimensions: string[];
    invalidModelLinks: string[];
    catalogPollution: string[];
    totalStandardDimensions: number;
    totalCustomDimensions: number;
    totalModels: number;
    potentialSlots: number;
    assignedSlots: number;
    unusedSlots: number;
    healthPercentage: number;
  } {
    const stdDimensions = this.getSizes(); // 39 Standard Dimensions
    const customDimensions = this.getCustomDimensions();
    const products = this.getProducts();
    const models = this.getModels();

    const duplicateStandardDimensions: string[] = [];
    const duplicateCustomDimensions: string[] = [];
    const brokenReferences: string[] = [];
    const missingRelationships: string[] = [];
    const orphanDimensions: string[] = [];
    const productsWithoutDimensions: string[] = [];
    const invalidModelLinks: string[] = [];
    const catalogPollution: string[] = [];

    // Check duplicate standard dimensions
    const stdSet = new Set<string>();
    stdDimensions.forEach(d => {
      const key = `${d.width}x${d.length}`;
      if (stdSet.has(key)) {
        duplicateStandardDimensions.push(`بعد قياسي مكرر: ${d.width}×${d.length}`);
      }
      stdSet.add(key);
    });

    // Check duplicate custom dimensions
    const customSet = new Set<string>();
    customDimensions.forEach(cd => {
      const key = `${cd.projectId || 'N/A'}_${cd.width}x${cd.length}x${cd.height}`;
      if (customSet.has(key)) {
        duplicateCustomDimensions.push(`بعد خاص مكرر بالمشروع: ${cd.width}×${cd.length}×${cd.height}`);
      }
      customSet.add(key);
    });

    // Mathematical Slot-based Calculations
    const totalModels = models.length;
    const potentialSlots = totalModels * stdDimensions.length; // e.g. 47 models * 39 = 1,833 slots
    const assignedSlots = products.filter(p => p.productType !== 'custom').length; // Configured standard product specs
    const unusedSlots = potentialSlots - assignedSlots;

    // Check products for dimension links
    products.forEach(p => {
      if (p.productType === 'standard' || !p.productType) {
        if (!p.width || !p.length) {
          productsWithoutDimensions.push(`المنتج القياسي ${p.modelName} يفتقر للأبعاد.`);
        }
        if (p.sizeId && !stdDimensions.some(s => s.id === p.sizeId || `DIM-${p.width}-${p.length}` === p.sizeId)) {
          brokenReferences.push(`المنتج ${p.modelName} يرتبط ببعد قياسي مفقود: ${p.sizeId}`);
        }
      } else {
        if (!p.width || !p.length || !p.height) {
          productsWithoutDimensions.push(`المنتج الخاص ${p.modelName} يفتقر للأبعاد المخصصة.`);
        }
        if (models.some(m => m.name.toLowerCase() === p.modelName.toLowerCase() && m.id !== 'CUSTOM')) {
          catalogPollution.push(`تلوث بالكتالوج: اسم موديل المشروع الخاص (${p.modelName}) مسجل بجدول الموديلات القياسية.`);
        }
      }

      if (p.modelId && p.modelId !== 'CUSTOM' && !models.some(m => m.id === p.modelId)) {
        invalidModelLinks.push(`المنتج ${p.modelName} يرتبط بموديل مفقود: ${p.modelId}`);
      }
    });

    const totalIssues = 
      duplicateStandardDimensions.length +
      duplicateCustomDimensions.length +
      brokenReferences.length +
      missingRelationships.length +
      orphanDimensions.length +
      productsWithoutDimensions.length +
      invalidModelLinks.length +
      catalogPollution.length;

    const healthPercentage = totalIssues === 0 ? 100 : Math.max(0, 100 - (totalIssues * 5));

    return {
      duplicateStandardDimensions,
      duplicateCustomDimensions,
      brokenReferences,
      missingRelationships,
      orphanDimensions,
      productsWithoutDimensions,
      invalidModelLinks,
      catalogPollution,
      totalStandardDimensions: stdDimensions.length,
      totalCustomDimensions: customDimensions.length,
      totalModels,
      potentialSlots,
      assignedSlots,
      unusedSlots,
      healthPercentage
    };
  }

  // Enterprise Serialization Audit Engine (PROMPT-029 PART 4)
  public static runSerializationAudit(): {
    status: 'Healthy' | 'Warning' | 'Critical';
    totalSerials: number;
    duplicateSerials: string[];
    missingSequences: string[];
    invalidPrefixes: string[];
    unlinkedSerials: string[];
    cancelledSerials: string[];
    unprintedSerials: string[];
    orphanSerials: string[];
    healthScore: number;
  } {
    const serials = this.getSerialNumbers();
    const brands = this.getBrands();
    const batches = this.getBatches();
    const products = this.getProducts();
    const printJobs = this.getPrintJobs();
    const orders = this.getProductionOrders();

    const duplicateSerials: string[] = [];
    const missingSequences: string[] = [];
    const invalidPrefixes: string[] = [];
    const unlinkedSerials: string[] = [];
    const cancelledSerials: string[] = [];
    const unprintedSerials: string[] = [];
    const orphanSerials: string[] = [];

    const serialMap = new Set<string>();
    const brandPrefixes = brands.map(b => b.serialPrefix);

    // Group by prefix and year for sequence gap check
    const sequenceGroups: Record<string, number[]> = {};

    serials.forEach(s => {
      // Duplicate check
      const normalized = s.serialNumber.trim().toUpperCase();
      if (serialMap.has(normalized)) {
        duplicateSerials.push(`سيريال مكرر: ${s.serialNumber}`);
      }
      serialMap.add(normalized);

      // Prefix check
      const parts = s.serialNumber.split('-');
      const prefix = parts[0];
      if (!brandPrefixes.includes(prefix)) {
        invalidPrefixes.push(`بادئة سيريال غير مسجلة بالماركات: ${s.serialNumber}`);
      }

      // Group for sequence check if format is PREFIX-YYYY-NNNNNN
      if (parts.length >= 3) {
        const groupKey = `${parts[0]}-${parts[1]}`;
        const seqNum = parseInt(parts[2], 10);
        if (!isNaN(seqNum)) {
          if (!sequenceGroups[groupKey]) sequenceGroups[groupKey] = [];
          sequenceGroups[groupKey].push(seqNum);
        }
      }

      // Unlinked check (missing batch or product)
      const hasBatch = s.batchId ? batches.some(b => b.id === s.batchId || b.batchNumber === s.batchNumber) : false;
      const hasProduct = products.some(p => p.id === s.productId);
      if (!hasBatch || !hasProduct) {
        unlinkedSerials.push(`سيريال غير مرتبط بالكامل (Batch/Product): ${s.serialNumber}`);
      }

      // Orphan check (missing production order)
      if (s.productionOrderId && !orders.some(o => o.id === s.productionOrderId)) {
        orphanSerials.push(`سيريال يتيم بدون أمر إنتاج: ${s.serialNumber}`);
      }

      // Cancelled check
      if (s.status === 'Cancelled') {
        cancelledSerials.push(`سيريال ملغي: ${s.serialNumber}`);
      }

      // Unprinted check
      const isPrinted = printJobs.some(j => j.serialNumber === s.serialNumber && j.status === 'Printed');
      if (s.status === 'Generated' || !isPrinted) {
        unprintedSerials.push(`سيريال لم تتم طباعة ملصقه: ${s.serialNumber}`);
      }
    });

    // Sequence gaps analysis
    Object.keys(sequenceGroups).forEach(groupKey => {
      const numbers = sequenceGroups[groupKey].sort((a, b) => a - b);
      if (numbers.length > 1) {
        for (let i = 0; i < numbers.length - 1; i++) {
          const current = numbers[i];
          const next = numbers[i + 1];
          if (next - current > 1) {
            missingSequences.push(`فجوة تسلسلية في نطاق ${groupKey}: من #${current} إلى #${next}`);
          }
        }
      }
    });

    const criticalCount = duplicateSerials.length + invalidPrefixes.length + orphanSerials.length;
    const warningCount = missingSequences.length + unlinkedSerials.length + cancelledSerials.length;

    let status: 'Healthy' | 'Warning' | 'Critical' = 'Healthy';
    if (criticalCount > 0) {
      status = 'Critical';
    } else if (warningCount > 0) {
      status = 'Warning';
    }

    const totalIssues = criticalCount * 3 + warningCount;
    const healthScore = totalIssues === 0 ? 100 : Math.max(0, 100 - totalIssues * 5);

    return {
      status,
      totalSerials: serials.length,
      duplicateSerials,
      missingSequences,
      invalidPrefixes,
      unlinkedSerials,
      cancelledSerials,
      unprintedSerials,
      orphanSerials,
      healthScore
    };
  }

  // Database Production Integrity Audit (PROMPT-029 PART 10)
  public static runProductionIntegrityAudit(): {
    isConsistent: boolean;
    totalOrders: number;
    totalBatches: number;
    totalSerials: number;
    totalCertificates: number;
    totalPrintJobs: number;
    totalLifecycleEvents: number;
    duplicateBatchIds: string[];
    duplicateSerialNumbers: string[];
    duplicateCertificateNumbers: string[];
    missingRelationships: string[];
    orphanRecords: string[];
    invalidStatusTransitions: string[];
    missingLifecycleEvents: string[];
    errorsCount: number;
    healthPercentage: number;
  } {
    const orders = this.getProductionOrders();
    const batches = this.getBatches();
    const serials = this.getSerialNumbers();
    const certs = this.getWarrantyCertificates();
    const printJobs = this.getPrintJobs();
    const events = this.getLifecycleEvents();
    const products = this.getProducts();

    const duplicateBatchIds: string[] = [];
    const duplicateSerialNumbers: string[] = [];
    const duplicateCertificateNumbers: string[] = [];
    const missingRelationships: string[] = [];
    const orphanRecords: string[] = [];
    const invalidStatusTransitions: string[] = [];
    const missingLifecycleEvents: string[] = [];

    // Duplicate Batches
    const batchSet = new Set<string>();
    batches.forEach(b => {
      if (batchSet.has(b.batchNumber)) {
        duplicateBatchIds.push(`رقم تشغيلة مكرر: ${b.batchNumber}`);
      }
      batchSet.add(b.batchNumber);

      // Batch without Order
      if (!orders.some(o => o.id === b.productionOrderId)) {
        orphanRecords.push(`تشغيلة يتيمة بدون أمر إنتاج: ${b.batchNumber}`);
      }
    });

    // Duplicate Serials
    const serialSet = new Set<string>();
    serials.forEach(s => {
      if (serialSet.has(s.serialNumber)) {
        duplicateSerialNumbers.push(`سيريال مكرر: ${s.serialNumber}`);
      }
      serialSet.add(s.serialNumber);

      // Serial without Batch (if batches exist)
      if (s.batchId && !batches.some(b => b.id === s.batchId || b.batchNumber === s.batchNumber)) {
        missingRelationships.push(`السيريال ${s.serialNumber} لا يرتبط بتشغيلة معرفة.`);
      }

      // Serial without Order
      if (!orders.some(o => o.id === s.productionOrderId)) {
        orphanRecords.push(`السيريال ${s.serialNumber} يفتقر لأمر إنتاج نشط.`);
      }

      // Serial without Product
      if (!products.some(p => p.id === s.productId)) {
        orphanRecords.push(`السيريال ${s.serialNumber} يفتقر لمنتج معرف.`);
      }

      // Serial without Warranty Certificate
      if (!certs.some(c => c.serialNumber === s.serialNumber)) {
        missingRelationships.push(`السيريال ${s.serialNumber} يفتقر لشهادة ضمان.`);
      }

      // Serial without Print Queue
      if (!printJobs.some(pj => pj.serialNumber === s.serialNumber)) {
        missingRelationships.push(`السيريال ${s.serialNumber} يفتقر لتذكرة في طابور الطباعة.`);
      }

      // Serial without Lifecycle events
      if (!events.some(e => e.serialNumber === s.serialNumber)) {
        missingLifecycleEvents.push(`السيريال ${s.serialNumber} يفتقر لسجل دورة حياة وتتبع.`);
      }
    });

    // Duplicate Certificates
    const certSet = new Set<string>();
    certs.forEach(c => {
      if (certSet.has(c.warrantyNumber)) {
        duplicateCertificateNumbers.push(`رقم شهادة ضمان مكرر: ${c.warrantyNumber}`);
      }
      certSet.add(c.warrantyNumber);

      // Certificate without Serial
      if (!serials.some(s => s.serialNumber === c.serialNumber)) {
        orphanRecords.push(`شهادة ضمان يتيمة بدون سيريال: ${c.warrantyNumber}`);
      }
    });

    // Print Jobs without Serial
    printJobs.forEach(pj => {
      if (!serials.some(s => s.serialNumber === pj.serialNumber)) {
        orphanRecords.push(`تذكرة طباعة يتيمة بدون سيريال: ${pj.serialNumber}`);
      }
    });

    // Lifecycle Events without Serial
    events.forEach(ev => {
      if (!serials.some(s => s.serialNumber === ev.serialNumber)) {
        orphanRecords.push(`حدث دورة حياة لسيريال غير مسجل: ${ev.serialNumber}`);
      }
    });

    // Invalid Status Transitions Checks
    orders.forEach(o => {
      if (o.status === 'Draft') {
        const orderSerials = serials.filter(s => s.productionOrderId === o.id);
        if (orderSerials.length > 0) {
          invalidStatusTransitions.push(`أمر إنتاج مسودة (${o.productionOrderNumber}) يحتوي على سيريالات مولدة قبل الاعتماد.`);
        }
      }
    });

    const errorsCount = 
      duplicateBatchIds.length +
      duplicateSerialNumbers.length +
      duplicateCertificateNumbers.length +
      missingRelationships.length +
      orphanRecords.length +
      invalidStatusTransitions.length +
      missingLifecycleEvents.length;

    const isConsistent = errorsCount === 0;
    const healthPercentage = errorsCount === 0 ? 100 : Math.max(0, 100 - errorsCount * 5);

    return {
      isConsistent,
      totalOrders: orders.length,
      totalBatches: batches.length,
      totalSerials: serials.length,
      totalCertificates: certs.length,
      totalPrintJobs: printJobs.length,
      totalLifecycleEvents: events.length,
      duplicateBatchIds,
      duplicateSerialNumbers,
      duplicateCertificateNumbers,
      missingRelationships,
      orphanRecords,
      invalidStatusTransitions,
      missingLifecycleEvents,
      errorsCount,
      healthPercentage
    };
  }

  // Distribution, QR & Passport Audit Engine (PROMPT-030 PART 9)
  public static runDistributionAudit(): {
    status: 'Healthy' | 'Warning' | 'Critical';
    isConsistent: boolean;
    healthPercentage: number;
    errorsCount: number;
    warningsCount: number;
    duplicateAllocations: string[];
    duplicatePacks: string[];
    duplicateShipments: string[];
    duplicateSales: string[];
    duplicateQrs: string[];
    orphanShipments: string[];
    orphanPacks: string[];
    orphanAllocations: string[];
    brokenLinks: string[];
    invalidTransitions: string[];
    missingPassportData: string[];
    stats: {
      totalAllocatedSerials: number;
      warehouseInventory: number;
      dealerInventory: number;
      showroomInventory: number;
      projectInventory: number;
      totalPacks: number;
      totalShipments: number;
      pendingShipments: number;
      deliveredShipments: number;
      soldProducts: number;
      activatedProducts: number;
    };
  } {
    const allocations = this.getAllocations();
    const packs = this.getPacks();
    const shipments = this.getShipments();
    const sales = this.getSalesRecords();
    const qrs = this.getQrRegistries();
    const serials = this.getSerialNumbers();
    const products = this.getProducts();
    const certs = this.getWarrantyCertificates();

    const duplicateAllocations: string[] = [];
    const duplicatePacks: string[] = [];
    const duplicateShipments: string[] = [];
    const duplicateSales: string[] = [];
    const duplicateQrs: string[] = [];
    const orphanShipments: string[] = [];
    const orphanPacks: string[] = [];
    const orphanAllocations: string[] = [];
    const brokenLinks: string[] = [];
    const invalidTransitions: string[] = [];
    const missingPassportData: string[] = [];

    // Duplicate Allocations Check
    const allocMap = new Set<string>();
    allocations.forEach(a => {
      if (allocMap.has(a.allocationId)) {
        duplicateAllocations.push(`تخصيص مكرر: ${a.allocationId}`);
      }
      allocMap.add(a.allocationId);

      if (!serials.some(s => s.serialNumber === a.serialNumber)) {
        orphanAllocations.push(`تخصيص لسيريال غير موجود: ${a.allocationId} (Serial: ${a.serialNumber})`);
      }
    });

    // Duplicate Packs Check
    const packMap = new Set<string>();
    packs.forEach(p => {
      if (packMap.has(p.packId)) {
        duplicatePacks.push(`طرد تعبئة مكرر: ${p.packId}`);
      }
      packMap.add(p.packId);

      // Check serials inside pack
      const packSerialsSet = new Set<string>();
      p.serialNumbers.forEach(sn => {
        if (packSerialsSet.has(sn)) {
          duplicatePacks.push(`سيريال مكرر داخل نفس الطرد ${p.packId}: ${sn}`);
        }
        packSerialsSet.add(sn);

        if (!serials.some(s => s.serialNumber === sn)) {
          orphanPacks.push(`سيريال غير معرف داخل الطرد ${p.packId}: ${sn}`);
        }
      });
    });

    // Duplicate Shipments Check
    const shipMap = new Set<string>();
    shipments.forEach(sh => {
      if (shipMap.has(sh.shipmentId)) {
        duplicateShipments.push(`شحنة مكررة: ${sh.shipmentId}`);
      }
      shipMap.add(sh.shipmentId);

      sh.packIds.forEach(pid => {
        if (!packs.some(p => p.packId === pid)) {
          orphanShipments.push(`شحنة ${sh.shipmentId} تحتوي على طرد مفقود: ${pid}`);
        }
      });
    });

    // Duplicate Sales Records Check
    const salesMap = new Set<string>();
    const soldSerialsSet = new Set<string>();
    sales.forEach(sl => {
      if (salesMap.has(sl.salesId)) {
        duplicateSales.push(`سجل مبيعات مكرر: ${sl.salesId}`);
      }
      salesMap.add(sl.salesId);

      if (soldSerialsSet.has(sl.serialNumber)) {
        duplicateSales.push(`سيريال تم بيعه مرتين: ${sl.serialNumber}`);
      }
      soldSerialsSet.add(sl.serialNumber);

      if (!serials.some(s => s.serialNumber === sl.serialNumber)) {
        brokenLinks.push(`سجل بيع لسيريال مفقود: ${sl.salesId} (${sl.serialNumber})`);
      }
    });

    // Duplicate QR Records Check
    const qrMap = new Set<string>();
    const qrSerialMap = new Set<string>();
    qrs.forEach(q => {
      if (qrMap.has(q.qrId)) {
        duplicateQrs.push(`سجل QR مكرر: ${q.qrId}`);
      }
      qrMap.add(q.qrId);

      if (qrSerialMap.has(q.serialNumber)) {
        duplicateQrs.push(`أكثر من QR لنفس السيريال: ${q.serialNumber}`);
      }
      qrSerialMap.add(q.serialNumber);

      if (!serials.some(s => s.serialNumber === q.serialNumber)) {
        brokenLinks.push(`سجل QR لسيريال غير مسجل: ${q.qrId}`);
      }
    });

    // Verify passport completeness for serials
    serials.forEach(s => {
      const prod = products.find(p => p.id === s.productId);
      const cert = certs.find(c => c.serialNumber === s.serialNumber);
      if (!prod) {
        missingPassportData.push(`السيريال ${s.serialNumber} يفتقر لبيانات المنتج الأساسية.`);
      }
      if (!cert) {
        missingPassportData.push(`السيريال ${s.serialNumber} يفتقر لشهادة الضمان.`);
      }
    });

    // Compute distribution stats
    const totalAllocatedSerials = allocations.filter(a => a.status === 'Allocated' || a.status === 'Transferred').length;
    const warehouseInventory = allocations.filter(a => a.allocationType === 'Warehouse' && a.status === 'Allocated').length;
    const dealerInventory = allocations.filter(a => a.allocationType === 'Dealer' && a.status === 'Allocated').length;
    const showroomInventory = allocations.filter(a => a.allocationType === 'Showroom' && a.status === 'Allocated').length;
    const projectInventory = allocations.filter(a => a.allocationType === 'Project' && a.status === 'Allocated').length;
    const totalPacks = packs.length;
    const totalShipments = shipments.length;
    const pendingShipments = shipments.filter(sh => sh.status === 'Draft' || sh.status === 'Approved' || sh.status === 'InTransit').length;
    const deliveredShipments = shipments.filter(sh => sh.status === 'Delivered').length;
    const soldProducts = sales.length;
    const activatedProducts = certs.filter(c => c.status === 'active').length;

    const errorsCount = 
      duplicateAllocations.length +
      duplicatePacks.length +
      duplicateShipments.length +
      duplicateSales.length +
      duplicateQrs.length +
      orphanShipments.length +
      orphanPacks.length +
      orphanAllocations.length +
      brokenLinks.length +
      invalidTransitions.length +
      missingPassportData.length;

    const warningsCount = 0;
    const isConsistent = errorsCount === 0;
    const healthPercentage = errorsCount === 0 ? 100 : Math.max(0, 100 - errorsCount * 5);

    let status: 'Healthy' | 'Warning' | 'Critical' = 'Healthy';
    if (errorsCount > 0) {
      status = 'Critical';
    } else if (warningsCount > 0) {
      status = 'Warning';
    }

    return {
      status,
      isConsistent,
      healthPercentage,
      errorsCount,
      warningsCount,
      duplicateAllocations,
      duplicatePacks,
      duplicateShipments,
      duplicateSales,
      duplicateQrs,
      orphanShipments,
      orphanPacks,
      orphanAllocations,
      brokenLinks,
      invalidTransitions,
      missingPassportData,
      stats: {
        totalAllocatedSerials,
        warehouseInventory,
        dealerInventory,
        showroomInventory,
        projectInventory,
        totalPacks,
        totalShipments,
        pendingShipments,
        deliveredShipments,
        soldProducts,
        activatedProducts
      }
    };
  }

  // Central Coding Prefix Validator (Module 06 Validation)
  public static validateCodingFormat(
    brandId: string, 
    serial: string, 
    warranty: string
  ): { valid: boolean; reason?: string } {
    const brand = this.getBrands().find(b => b.id === brandId);
    if (!brand) return { valid: false, reason: 'الماركة المدخلة غير معرفة بمركز التكويد.' };

    if (!serial.startsWith(brand.serialPrefix)) {
      return { 
        valid: false, 
        reason: `تنسيق خاطئ للسيريال: يجب أن يبدأ بـ ${brand.serialPrefix} تماشياً مع الماركة.` 
      };
    }

    if (!warranty.startsWith(brand.warrantyPrefix)) {
      return { 
        valid: false, 
        reason: `تنسيق خاطئ للشهادة: يجب أن يبدأ بـ ${brand.warrantyPrefix}.` 
      };
    }

    return { valid: true };
  }

  // High-level generators
  public static generateQR(warrantyNumber: string, serialNumber: string, productCode: string): string {
    const verificationUrl = `${window.location.origin}/verify?warranty=${warrantyNumber}`;
    return `<svg viewBox="0 0 100 100" width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="white"/><rect x="10" y="10" width="20" height="20" fill="black"/><rect x="15" y="15" width="10" height="10" fill="white"/><rect x="70" y="10" width="20" height="20" fill="black"/><rect x="75" y="15" width="10" height="10" fill="white"/><rect x="10" y="70" width="20" height="20" fill="black"/><rect x="15" y="75" width="10" height="10" fill="white"/><rect x="40" y="40" width="20" height="20" fill="black"/><rect x="45" y="45" width="10" height="10" fill="white"/><rect x="70" y="70" width="10" height="10" fill="black"/><rect x="80" y="80" width="10" height="10" fill="black"/><rect x="60" y="60" width="10" height="10" fill="black"/><rect x="50" y="10" width="10" height="10" fill="black"/><rect x="10" y="50" width="10" height="10" fill="black"/><text x="50" y="95" font-size="6" font-family="monospace" text-anchor="middle" fill="black">SLEEPEE</text></svg>`;
  }

  public static getWarrantyProductsMapped(): WarrantyProduct[] {
    const certs = this.getWarrantyCertificates();
    const products = this.getProducts();
    const brands = this.getBrands();
    const policies = this.getWarrantyPolicies();

    return certs.map(c => {
      const p = products.find(prod => prod.id === c.productId);
      const brandName = brands.find(b => b.id === p?.brandId)?.name || 'Sleepee';
      const policy = policies.find(pol => pol.id === p?.warrantyPolicyId);
      const years = policy ? policy.warrantyYears : 10;

      return {
        serialNumber: c.serialNumber,
        productCode: p?.internalProductCode,
        qrCodeId: `QR-${c.serialNumber}`,
        modelName: p ? p.modelName : 'مرتبة سليبي الممتازة',
        brand: (brandName === 'Sleepee' ? 'Sleepee' : brandName) as any,
        dimensions: p ? `${p.width} × ${p.length} × ${p.height} سم` : '180 × 200 سم',
        productionDate: p ? new Date(p.createdDate).toLocaleDateString('ar-EG') : '10 - 01 - 2026',
        warrantyPeriod: `${years} سنوات`,
        warrantyNumber: c.warrantyNumber,
        warrantyStartDate: c.activationDate || undefined,
        warrantyEndDate: c.expiryDate,
        status: c.status as any,
        customerName: c.customerName,
        customerPhone: c.customerPhone,
        timeline: [
          { title: 'التصنيع', date: p ? new Date(p.createdDate).toLocaleDateString('ar-EG') : '10 - 01 - 2026', completed: true },
          { title: 'الجودة', date: p ? new Date(p.createdDate).toLocaleDateString('ar-EG') : '12 - 01 - 2026', completed: true },
          { title: 'التعبئة', date: p ? new Date(p.createdDate).toLocaleDateString('ar-EG') : '14 - 01 - 2026', completed: true },
          { title: 'الشحن', date: p ? new Date(p.createdDate).toLocaleDateString('ar-EG') : '16 - 01 - 2026', completed: true },
          { title: 'البيع', date: p ? new Date(p.createdDate).toLocaleDateString('ar-EG') : '18 - 01 - 2026', completed: true },
          { 
            title: 'تفعيل الضمان', 
            statusText: c.status === 'active' ? 'تم التفعيل' : 'لم يتم التفعيل', 
            completed: c.status === 'active', 
            isWarning: c.status !== 'active' 
          },
        ]
      };
    });
  }

  // ============================================================================
  // PROMPT-034: USERS, SETTINGS, PRINTERS & POLICY MAPPINGS
  // ============================================================================
  public static getUsers(): SystemUser[] {
    const defaultUsers: SystemUser[] = [
      {
        id: 'USR-001',
        name: 'م. أحمد الشناوي',
        email: 'sleepyqualitydept@gmail.com',
        role: 'SUPER_ADMIN',
        department: 'الإدارة',
        status: 'active',
        lastLogin: '2026-09-28T09:15:00Z'
      },
      {
        id: 'USR-002',
        name: 'م. محمود البدري',
        email: 'plant.manager@sleepee.com',
        role: 'PLANT_MANAGER',
        department: 'الإنتاج',
        status: 'active',
        lastLogin: '2026-09-28T08:45:00Z'
      },
      {
        id: 'USR-003',
        name: 'أ. طارق عبد الرحمن',
        email: 'logistics@sleepee.com',
        role: 'WAREHOUSE',
        department: 'المخازن',
        status: 'active',
        lastLogin: '2026-09-27T16:20:00Z'
      },
      {
        id: 'USR-004',
        name: 'أ. سارة مصطفى',
        email: 'support@sleepee.com',
        role: 'CUSTOMER_SERVICE',
        department: 'خدمة العملاء',
        status: 'active',
        lastLogin: '2026-09-28T10:05:00Z'
      }
    ];
    return this.getStorageItem<SystemUser[]>('sleepee_system_users', defaultUsers);
  }

  public static saveUsers(users: SystemUser[]): void {
    this.setStorageItem('sleepee_system_users', users);
  }

  public static addUser(userData: Omit<SystemUser, 'id' | 'lastLogin'>): SystemUser {
    const users = this.getUsers();
    const newUser: SystemUser = {
      ...userData,
      id: `USR-${(users.length + 1).toString().padStart(3, '0')}`,
      lastLogin: new Date().toISOString()
    };
    users.push(newUser);
    this.saveUsers(users);
    this.addAuditLog('User Added', `تمت إضافة مستخدم جديد: ${newUser.name} (${newUser.role})`);
    return newUser;
  }

  public static saveWarrantyPolicies(policies: WarrantyPolicy[]): void {
    this.setStorageItem('sleepee_policies', policies);
  }

  public static addWarrantyPolicy(policy: WarrantyPolicy): void {
    const policies = this.getWarrantyPolicies();
    policies.push(policy);
    this.saveWarrantyPolicies(policies);
    this.addAuditLog('Policy Added', `تمت إضافة سياسة ضمان جديدة: ${policy.name} (${policy.id})`);
  }

  public static getPolicyMappings(): PolicyMapping[] {
    const defaultMappings: PolicyMapping[] = [
      { id: 'MAP-1', level: 'Brand', targetId: 'SLP', targetName: 'Sleepee', policyId: 'POL-10Y', updatedDate: '2026-01-10T10:00:00Z' },
      { id: 'MAP-2', level: 'Brand', targetId: 'RH', targetName: 'Rich House', policyId: 'POL-7Y', updatedDate: '2026-01-10T10:00:00Z' },
      { id: 'MAP-3', level: 'Brand', targetId: 'CFT', targetName: 'Comfort', policyId: 'POL-10Y', updatedDate: '2026-01-10T10:00:00Z' },
      { id: 'MAP-4', level: 'Family', targetId: 'FAM-MEDICAL', targetName: 'مراتب طبية', policyId: 'POL-10Y', updatedDate: '2026-01-10T10:00:00Z' },
      { id: 'MAP-5', level: 'Model', targetId: 'MOD-SLP-TOP', targetName: 'Sleepee Top', policyId: 'POL-10Y', updatedDate: '2026-01-10T10:00:00Z' }
    ];
    return this.getStorageItem<PolicyMapping[]>('sleepee_policy_mappings', defaultMappings);
  }

  public static savePolicyMappings(mappings: PolicyMapping[]): void {
    this.setStorageItem('sleepee_policy_mappings', mappings);
  }

  public static getEnterpriseSettings(): EnterpriseSettings {
    const defaults: EnterpriseSettings = {
      companyNameAr: 'شركة سليبي للصناعات الإسفنجية والمراتب',
      companyNameEn: 'Sleepee Mattresses & Foam Industries Ltd.',
      email: 'info@sleepee.com.eg',
      phone: '+20 2 19876',
      website: 'https://sleepee.com.eg',
      defaultLanguage: 'ar',
      timezone: 'Africa/Cairo (UTC+02:00)',
      dateFormat: 'DD/MM/YYYY',
      userProfile: {
        fullName: 'المهندس أحمد الشناوي',
        title: 'مدير عام الجودة ورقابة الإنتاج'
      }
    };
    return this.getStorageItem<EnterpriseSettings>('sleepee_enterprise_settings', defaults);
  }

  public static saveEnterpriseSettings(settings: EnterpriseSettings): void {
    this.setStorageItem('sleepee_enterprise_settings', settings);
    this.addAuditLog('Settings Updated', 'تم تحديث الإعدادات العامة للمؤسسة');
  }

  public static getPrinters(): NetworkPrinter[] {
    // In accordance with PROMPT-034 PART 6:
    // If no real printer integration exists, default to empty list so UI shows "لا توجد طابعات معرفة"
    return this.getStorageItem<NetworkPrinter[]>('sleepee_network_printers', []);
  }

  public static savePrinters(printers: NetworkPrinter[]): void {
    this.setStorageItem('sleepee_network_printers', printers);
  }

  public static addPrinter(printer: NetworkPrinter): void {
    const list = this.getPrinters();
    list.push(printer);
    this.savePrinters(list);
    this.addAuditLog('Printer Added', `تم تسجيل طابعة جديدة: ${printer.name} (${printer.ipAddress})`);
  }

  // ============================================================================
  // PROMPT-033-R1 SECTION 8: PRINT TEMPLATE GOVERNANCE CENTER (LABEL DESIGNER)
  // ============================================================================
  public static getPrintTemplates(): PrintTemplate[] {
    const defaultTemplates: PrintTemplate[] = [
      {
        id: 'TPL-ZPL-100x150',
        name: 'ملصق السيريال والباركود القياسي للمراتب (100×150 مم)',
        code: 'LBL-MATT-STD-100150',
        widthMm: 100,
        heightMm: 150,
        dpi: 300,
        format: 'ZPL',
        approvalStatus: 'Approved',
        version: 'v2.4',
        zplCode: '^XA\n^FO50,50^A0N,45,45^FD{{BRAND_NAME}}^FS\n^FO50,110^A0N,30,30^FD{{MODEL_NAME}} - {{DIMENSIONS}}^FS\n^FO50,160^BY3,3,80^BCN,80,Y,N,N^FD{{SERIAL_NUMBER}}^FS\n^FO50,300^BQN,2,8^FDMA,{{QR_URL}}^FS\n^FO320,320^A0N,28,28^FDضمان رسمي: {{WARRANTY_YEARS}} سنوات^FS\n^FO320,360^A0N,22,22^FDرقم الشهادة: {{WARRANTY_NO}}^FS\n^XZ',
        qrConfig: {
          enabled: true,
          size: 8,
          correctionLevel: 'M',
          positionX: 50,
          positionY: 300,
          dataField: 'verificationUrl'
        },
        barcodeConfig: {
          enabled: true,
          type: 'Code128',
          height: 80,
          positionX: 50,
          positionY: 160,
          dataField: 'serialNumber'
        },
        versionHistory: [
          { version: 'v1.0', updatedDate: '2026-01-10T08:00:00Z', author: 'م. أحمد الشناوي', notes: 'الإصدار الأولي لقالب المراتب المعتمد' },
          { version: 'v2.0', updatedDate: '2026-04-15T11:30:00Z', author: 'م. محمود البدري', notes: 'إضافة باركود Code128 بجانب رمز الاستجابة السريعة QR' },
          { version: 'v2.4', updatedDate: '2026-08-20T14:10:00Z', author: 'إدارة الجودة', notes: 'اعتماد الدقة العالية 300 DPI وتعديل الهوامش الصناعية' }
        ],
        auditTrail: [
          { id: 'AUD-TPL-1', action: 'Approval', user: 'م. أحمد الشناوي', timestamp: '2026-08-20T14:15:00Z', details: 'اعتماد القالب للاستخدام في خط الإنتاج والتغليف' }
        ],
        createdDate: '2026-01-10T08:00:00Z',
        updatedDate: '2026-08-20T14:10:00Z',
        approvedBy: 'م. أحمد الشناوي (مدير الجودة)',
        approvedDate: '2026-08-20T14:15:00Z'
      },
      {
        id: 'TPL-ZPL-50x25',
        name: 'ملصق باركود جانبي مصغر للهيكل والشاسيه (50×25 مم)',
        code: 'LBL-SIDE-SPRING-5025',
        widthMm: 50,
        heightMm: 25,
        dpi: 300,
        format: 'ZPL',
        approvalStatus: 'Approved',
        version: 'v1.2',
        zplCode: '^XA\n^FO20,20^A0N,20,20^FD{{SERIAL_NUMBER}}^FS\n^FO20,50^BY2,2,40^BCN,40,N,N,N^FD{{SERIAL_NUMBER}}^FS\n^XZ',
        qrConfig: {
          enabled: false,
          size: 4,
          correctionLevel: 'M',
          positionX: 0,
          positionY: 0,
          dataField: 'serialNumber'
        },
        barcodeConfig: {
          enabled: true,
          type: 'Code128',
          height: 40,
          positionX: 20,
          positionY: 50,
          dataField: 'serialNumber'
        },
        versionHistory: [
          { version: 'v1.0', updatedDate: '2026-02-01T09:00:00Z', author: 'م. محمود البدري', notes: 'تصميم قالب التتبع الداخلي لشاسيه السوست' },
          { version: 'v1.2', updatedDate: '2026-05-12T10:00:00Z', author: 'إدارة الجودة', notes: 'تعديل ارتفاع الباركود للتوافق مع القارئ الضوئي اليدوي' }
        ],
        auditTrail: [
          { id: 'AUD-TPL-2', action: 'Approval', user: 'م. محمود البدري', timestamp: '2026-05-12T10:05:00Z', details: 'اعتماد الملصق الداخلي لخط التجميع' }
        ],
        createdDate: '2026-02-01T09:00:00Z',
        updatedDate: '2026-05-12T10:00:00Z',
        approvedBy: 'م. محمود البدري (مدير المصنع)',
        approvedDate: '2026-05-12T10:05:00Z'
      },
      {
        id: 'TPL-WARRANTY-CARD',
        name: 'قالب بطاقة شهادة الضمان الإلكتروني الرسمية (A5)',
        code: 'DOC-WAR-CERT-A5',
        widthMm: 148,
        heightMm: 210,
        dpi: 300,
        format: 'PDF',
        approvalStatus: 'Approved',
        version: 'v3.0',
        zplCode: '/* Vector Layout Template for Digital Passport */',
        qrConfig: {
          enabled: true,
          size: 10,
          correctionLevel: 'H',
          positionX: 40,
          positionY: 150,
          dataField: 'verificationUrl'
        },
        barcodeConfig: {
          enabled: true,
          type: 'Code128',
          height: 60,
          positionX: 40,
          positionY: 120,
          dataField: 'warrantyNumber'
        },
        versionHistory: [
          { version: 'v3.0', updatedDate: '2026-07-01T12:00:00Z', author: 'م. أحمد الشناوي', notes: 'تحديث التصميم الرسمي لجواز السفر الرقمي للمنتجات' }
        ],
        auditTrail: [
          { id: 'AUD-TPL-3', action: 'Approval', user: 'م. أحمد الشناوي', timestamp: '2026-07-01T12:15:00Z', details: 'اعتماد رسمي لشهادات الضمان المصاحبة للتسليم' }
        ],
        createdDate: '2026-01-15T10:00:00Z',
        updatedDate: '2026-07-01T12:00:00Z',
        approvedBy: 'م. أحمد الشناوي (مدير الجودة)',
        approvedDate: '2026-07-01T12:15:00Z'
      }
    ];
    return this.getStorageItem<PrintTemplate[]>('sleepee_print_templates', defaultTemplates);
  }

  public static savePrintTemplates(templates: PrintTemplate[]): void {
    this.setStorageItem('sleepee_print_templates', templates);
  }

  public static addPrintTemplate(template: PrintTemplate): void {
    const list = this.getPrintTemplates();
    list.unshift(template);
    this.savePrintTemplates(list);
    this.addAuditLog('Template Created', `تم إنشاء قالب طباعة جديد: ${template.name} (${template.code})`);
  }

  public static updatePrintTemplate(template: PrintTemplate): void {
    const list = this.getPrintTemplates();
    const index = list.findIndex(t => t.id === template.id);
    if (index !== -1) {
      list[index] = template;
      this.savePrintTemplates(list);
      this.addAuditLog('Template Updated', `تم تحديث قالب الطباعة: ${template.name} (الإصدار ${template.version})`);
    }
  }

  public static clonePrintTemplate(templateId: string, clonedByName: string = 'مدير النظام'): PrintTemplate | null {
    const list = this.getPrintTemplates();
    const src = list.find(t => t.id === templateId);
    if (!src) return null;

    const newVersion = `${src.version}-draft`;
    const cloned: PrintTemplate = {
      ...src,
      id: `TPL-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: `${src.name} (نسخة مسودة)`,
      code: `${src.code}-COPY`,
      version: newVersion,
      approvalStatus: 'Draft',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      approvedBy: undefined,
      approvedDate: undefined,
      versionHistory: [
        ...src.versionHistory,
        {
          version: newVersion,
          updatedDate: new Date().toISOString(),
          author: clonedByName,
          notes: `استنساخ من القالب الأصلي ${src.code} ${src.version}`
        }
      ],
      auditTrail: [
        {
          id: `AUD-${Date.now()}`,
          action: 'Cloned',
          user: clonedByName,
          timestamp: new Date().toISOString(),
          details: `تم استنساخ القالب من ${src.id}`
        }
      ]
    };

    list.unshift(cloned);
    this.savePrintTemplates(list);
    this.addAuditLog('Template Cloned', `تم استنساخ قالب الطباعة: ${src.name} إلى ${cloned.name}`);
    return cloned;
  }

  // ============================================================================
  // PHASE 5: MANUFACTURING OPERATION MASTERS & WORK CENTERS
  // ============================================================================
  private static SEED_OPERATION_MASTERS: any[] = [
    {
      operationCode: 'OP-CUT-01',
      operationNameAr: 'قص وتفصيل طبقات الإسفنج',
      operationNameEn: 'Foam Layer Cutting',
      department: 'قسم الإسفنج',
      workCenterCode: 'FOAM-CUT-01',
      category: 'Cutting',
      setupTimeMinutes: 10,
      runTimeMinutes: 15,
      laborCount: 2,
      machineRequired: 'Vertical CNC Cutter',
      machineHourRate: 45,
      laborHourRate: 25,
      qualityCheckRequired: true,
      activeStatus: true,
      notes: 'قص ومعايرة الأبعاد بدقة طبقاً لأبعاد الطلبية'
    },
    {
      operationCode: 'OP-SPRING-01',
      operationNameAr: 'تجهيز وتشكيل شاسيه السوست',
      operationNameEn: 'Pocket Spring Core Preparation',
      department: 'قسم السوست',
      workCenterCode: 'SPRING-ASSY-01',
      category: 'Spring Assembly',
      setupTimeMinutes: 15,
      runTimeMinutes: 20,
      laborCount: 2,
      machineRequired: 'Pocket Spring Coiler',
      machineHourRate: 60,
      laborHourRate: 25,
      qualityCheckRequired: true,
      activeStatus: true,
      notes: 'تأطير الشاسيه بالسلك الفولاذي وحساب الخانات'
    },
    {
      operationCode: 'OP-FELT-01',
      operationNameAr: 'تثبيت طبقة العازل واللباد التركي',
      operationNameEn: 'Turkish Felt Insulation Bonding',
      department: 'قسم التجميع',
      workCenterCode: 'GLUE-LINE-01',
      category: 'Assembly',
      setupTimeMinutes: 5,
      runTimeMinutes: 8,
      laborCount: 2,
      machineRequired: 'Hotmelt Spray Bench',
      machineHourRate: 30,
      laborHourRate: 20,
      qualityCheckRequired: true,
      activeStatus: true,
      notes: 'حماية الإسفنج من الاحتكاك بالسلك'
    },
    {
      operationCode: 'OP-ASSY-01',
      operationNameAr: 'تجميع طبقات الحشو والراحة الهيكلية',
      operationNameEn: 'Layer Assembly & Stack Alignment',
      department: 'قسم التجميع',
      workCenterCode: 'GLUE-LINE-01',
      category: 'Assembly',
      setupTimeMinutes: 10,
      runTimeMinutes: 12,
      laborCount: 3,
      machineRequired: 'Hotmelt Applicator System',
      machineHourRate: 35,
      laborHourRate: 22,
      qualityCheckRequired: true,
      activeStatus: true,
      notes: 'تطبيق الغراء الحراري والتأكد من استقامة الحواف'
    },
    {
      operationCode: 'OP-QUILT-01',
      operationNameAr: 'تنجيد وتطريز القماش العلوي (الكابيتونيه)',
      operationNameEn: 'Top Cover Quilting & Patterning',
      department: 'قسم التطريز',
      workCenterCode: 'QUILT-01',
      category: 'Quilting',
      setupTimeMinutes: 12,
      runTimeMinutes: 18,
      laborCount: 1,
      machineRequired: 'Multi-Needle Computerized Quilter',
      machineHourRate: 50,
      laborHourRate: 25,
      qualityCheckRequired: true,
      activeStatus: true,
      notes: 'تنجيد القماش مع الإسفنج والفيبر المزدوج'
    },
    {
      operationCode: 'OP-BORDER-01',
      operationNameAr: 'خياطة الشريط وتسكين الحواف والزوايا',
      operationNameEn: 'Tape Edge Border Closing',
      department: 'قسم الخياطة',
      workCenterCode: 'BORDER-01',
      category: 'Border Closing',
      setupTimeMinutes: 8,
      runTimeMinutes: 15,
      laborCount: 2,
      machineRequired: 'Automatic Tape Edge Machine',
      machineHourRate: 40,
      laborHourRate: 24,
      qualityCheckRequired: true,
      activeStatus: true,
      notes: 'إغلاق الشريط وتوزيع أركان المرتبة'
    },
    {
      operationCode: 'OP-COMP-01',
      operationNameAr: 'الضغط واللف الحلزوني بالفاكيوم',
      operationNameEn: 'Vacuum Roll Packaging & Compression',
      department: 'قسم التعبئة',
      workCenterCode: 'PACKING-01',
      category: 'Compression',
      setupTimeMinutes: 5,
      runTimeMinutes: 5,
      laborCount: 2,
      machineRequired: 'Heavy Roll-Pack Compression Press',
      machineHourRate: 55,
      laborHourRate: 22,
      qualityCheckRequired: true,
      activeStatus: true,
      notes: 'ضغط المنتجات القابلة للتكثيف اللوجستي'
    },
    {
      operationCode: 'OP-PACK-01',
      operationNameAr: 'التغليف النهائي والترميز بالباركود',
      operationNameEn: 'Final Protective Wrapping & Barcoding',
      department: 'قسم التعبئة',
      workCenterCode: 'PACKING-01',
      category: 'Packing',
      setupTimeMinutes: 5,
      runTimeMinutes: 6,
      laborCount: 2,
      machineRequired: 'Heat Shrink Wrapper',
      machineHourRate: 20,
      laborHourRate: 20,
      qualityCheckRequired: false,
      activeStatus: true,
      notes: 'تغليف بلاستيكي سميك وحماية الزوايا'
    },
    {
      operationCode: 'OP-QC-01',
      operationNameAr: 'الفحص الفني النهائي واختبارات الضمان',
      operationNameEn: 'Final Technical & Quality Gate Inspection',
      department: 'قسم الجودة',
      workCenterCode: 'QC-01',
      category: 'Inspection',
      setupTimeMinutes: 2,
      runTimeMinutes: 5,
      laborCount: 1,
      machineRequired: 'Digital Height & Sag Sensor Bench',
      machineHourRate: 15,
      laborHourRate: 30,
      qualityCheckRequired: true,
      activeStatus: true,
      notes: 'مطابقة الأبعاد والارتفاع وسلامة الغرز والملصق'
    }
  ];

  private static SEED_WORK_CENTERS: any[] = [
    {
      workCenterCode: 'FOAM-CUT-01',
      workCenterNameAr: 'مركز قص وتشكيل الإسفنج',
      workCenterNameEn: 'Foam Cutting & Shaping Station',
      department: 'قسم الإسفنج',
      capacityPerShift: 180,
      capacityPerHour: 22.5,
      machineCount: 3,
      laborCapacity: 6,
      efficiencyPercent: 92,
      activeStatus: true
    },
    {
      workCenterCode: 'SPRING-ASSY-01',
      workCenterNameAr: 'مركز تجميع وتشكيل السوست',
      workCenterNameEn: 'Spring Core Assembly Station',
      department: 'قسم السوست',
      capacityPerShift: 150,
      capacityPerHour: 18.75,
      machineCount: 2,
      laborCapacity: 4,
      efficiencyPercent: 90,
      activeStatus: true
    },
    {
      workCenterCode: 'GLUE-LINE-01',
      workCenterNameAr: 'خط التجميع والتصريج الغرائي',
      workCenterNameEn: 'Lamination & Bonding Glue Line',
      department: 'قسم التجميع',
      capacityPerShift: 200,
      capacityPerHour: 25,
      machineCount: 4,
      laborCapacity: 8,
      efficiencyPercent: 95,
      activeStatus: true
    },
    {
      workCenterCode: 'QUILT-01',
      workCenterNameAr: 'محطة التطريز والتنجيد الآلي',
      workCenterNameEn: 'Automatic Quilting Workstation',
      department: 'قسم التطريز',
      capacityPerShift: 160,
      capacityPerHour: 20,
      machineCount: 2,
      laborCapacity: 3,
      efficiencyPercent: 88,
      activeStatus: true
    },
    {
      workCenterCode: 'BORDER-01',
      workCenterNameAr: 'مركز خياطة وتسكين الشريط',
      workCenterNameEn: 'Tape Edge Border Station',
      department: 'قسم الخياطة',
      capacityPerShift: 140,
      capacityPerHour: 17.5,
      machineCount: 3,
      laborCapacity: 6,
      efficiencyPercent: 91,
      activeStatus: true
    },
    {
      workCenterCode: 'PACKING-01',
      workCenterNameAr: 'مركز التعبئة والضغط التغليفي',
      workCenterNameEn: 'Packaging & Vacuum Roll Line',
      department: 'قسم التعبئة',
      capacityPerShift: 250,
      capacityPerHour: 31.25,
      machineCount: 2,
      laborCapacity: 5,
      efficiencyPercent: 96,
      activeStatus: true
    },
    {
      workCenterCode: 'QC-01',
      workCenterNameAr: 'محطة الفحص والجودة النهائية',
      workCenterNameEn: 'Final Quality Gate Station',
      department: 'قسم الجودة',
      capacityPerShift: 300,
      capacityPerHour: 37.5,
      machineCount: 2,
      laborCapacity: 2,
      efficiencyPercent: 98,
      activeStatus: true
    }
  ];

  public static getOperationMasters(): any[] {
    const stored = localStorage.getItem('erp_operation_masters');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    localStorage.setItem('erp_operation_masters', JSON.stringify(this.SEED_OPERATION_MASTERS));
    return this.SEED_OPERATION_MASTERS;
  }

  public static getWorkCenters(): any[] {
    const stored = localStorage.getItem('erp_work_centers');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    localStorage.setItem('erp_work_centers', JSON.stringify(this.SEED_WORK_CENTERS));
    return this.SEED_WORK_CENTERS;
  }

  public static saveOperationMaster(op: any): void {
    const list = this.getOperationMasters();
    const idx = list.findIndex((o: any) => o.operationCode === op.operationCode);
    if (idx >= 0) {
      list[idx] = op;
    } else {
      list.unshift(op);
    }
    localStorage.setItem('erp_operation_masters', JSON.stringify(list));
    this.addAuditLog('Operation Master Updated', `تم حفظ وتحديث عملية التشغيل الماستر: ${op.operationCode} - ${op.operationNameAr}`);
  }

  public static saveWorkCenter(wc: any): void {
    const list = this.getWorkCenters();
    const idx = list.findIndex((w: any) => w.workCenterCode === wc.workCenterCode);
    if (idx >= 0) {
      list[idx] = wc;
    } else {
      list.unshift(wc);
    }
    localStorage.setItem('erp_work_centers', JSON.stringify(list));
    this.addAuditLog('Work Center Updated', `تم حفظ وتحديث مركز العمل: ${wc.workCenterCode} - ${wc.workCenterNameAr}`);
  }

  private static SEED_ROUTING_TEMPLATES: any[] = [
    {
      templateCode: 'TPL-FOAM-01',
      templateName: 'Foam Mattress (قالب مراتب الإسفنج)',
      productCategory: 'MAT',
      description: 'قالب التوجيه القياسي لمراتب الإسفنج الطبقي والمرن بدون سوست',
      activeStatus: true,
      defaultStepsCount: 6
    },
    {
      templateCode: 'TPL-SPRING-01',
      templateName: 'Pocket Spring Mattress (قالب سوست بوكت منفصلة)',
      productCategory: 'MAT',
      description: 'قالب التوجيه الشامل لمراتب السوست المنفصلة مع العازل والتبطين',
      activeStatus: true,
      defaultStepsCount: 9
    },
    {
      templateCode: 'TPL-MED-01',
      templateName: 'Medical Mattress (قالب مراتب طبية علاجية)',
      productCategory: 'MAT',
      description: 'قالب تشغيل خاص بالمراتب الطبية ذات الكثافات العالية والعزل المزدوج',
      activeStatus: true,
      defaultStepsCount: 7
    },
    {
      templateCode: 'TPL-HOTEL-01',
      templateName: 'Hotel Mattress (قالب مراتب الفنادق الفاخرة)',
      productCategory: 'MAT',
      description: 'قالب التوجيه لمراتب الفنادق ذات التبطين المزدوج والأكمام الشريطية المقواة',
      activeStatus: true,
      defaultStepsCount: 10
    },
    {
      templateCode: 'TPL-LATEX-01',
      templateName: 'Latex Mattress (قالب مراتب اللاتكس الطبيعي)',
      productCategory: 'MAT',
      description: 'قالب تشغيل معتمد لمراتب اللاتكس والخلايا النحلية المفرغة',
      activeStatus: true,
      defaultStepsCount: 8
    },
    {
      templateCode: 'TPL-ECO-01',
      templateName: 'Economic Mattress (قالب مراتب اقتصادية معيارية)',
      productCategory: 'MAT',
      description: 'قالب توجيه سريع وخفيف للمراتب السريعة الشحن والاقتصادية',
      activeStatus: true,
      defaultStepsCount: 5
    }
  ];

  public static getRoutingTemplates(): any[] {
    const stored = localStorage.getItem('erp_routing_templates');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    localStorage.setItem('erp_routing_templates', JSON.stringify(this.SEED_ROUTING_TEMPLATES));
    return this.SEED_ROUTING_TEMPLATES;
  }

  public static saveRoutingTemplate(tpl: any): void {
    const list = this.getRoutingTemplates();
    const idx = list.findIndex((t: any) => t.templateCode === tpl.templateCode);
    if (idx >= 0) {
      list[idx] = tpl;
    } else {
      list.unshift(tpl);
    }
    localStorage.setItem('erp_routing_templates', JSON.stringify(list));
    this.addAuditLog('Routing Template Updated', `تم حفظ وتحديث قالب التوجيه: ${tpl.templateCode} - ${tpl.templateName}`);
  }

  public static getRoutings(): any[] {
    const stored = localStorage.getItem('erp_routings');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return [];
  }

  public static saveRouting(routing: any): void {
    const list = this.getRoutings();
    const idx = list.findIndex(r => r.routingCode === routing.routingCode);
    if (idx >= 0) {
      list[idx] = routing;
    } else {
      list.unshift(routing);
    }
    localStorage.setItem('erp_routings', JSON.stringify(list));
    this.addAuditLog('Routing Updated', `تم حفظ وتحديث مسار التوجيه الصناعي ${routing.routingCode}`);
  }

  // ============================================================================
  // PROMPT-033-R1 SECTION 7: USER SECURITY RULES HELPER METHODS
  // ============================================================================
  public static canSuspendUser(userId: string): { allowed: boolean; reason?: string } {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return { allowed: false, reason: 'المستخدم غير موجود' };

    if (user.role === 'SUPER_ADMIN') {
      const activeSuperAdmins = users.filter(u => u.role === 'SUPER_ADMIN' && u.status === 'active');
      if (activeSuperAdmins.length <= 1) {
        return { 
          allowed: false, 
          reason: 'لا يمكن تعطيل المشرف العام الأخير للنظام (Security Rule: Last active Super Admin cannot be suspended)' 
        };
      }
    }
    return { allowed: true };
  }

  public static canLockUser(userId: string): { allowed: boolean; reason?: string } {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return { allowed: false, reason: 'المستخدم غير موجود' };

    if (user.role === 'SUPER_ADMIN') {
      const unlockedSuperAdmins = users.filter(u => u.role === 'SUPER_ADMIN' && !u.isLocked);
      if (unlockedSuperAdmins.length <= 1) {
        return { 
          allowed: false, 
          reason: 'لا يمكن قفل حساب المشرف العام الأخير للنظام (Security Rule: Last unlocked Super Admin cannot be locked)' 
        };
      }
    }
    return { allowed: true };
  }

  public static canDeleteUser(userId: string): { allowed: boolean; reason?: string } {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return { allowed: false, reason: 'المستخدم غير موجود' };

    if (user.role === 'SUPER_ADMIN') {
      return { 
        allowed: false, 
        reason: 'لا يجوز حذف حساب المشرف العام (Security Rule: Super Admin accounts cannot be deleted)' 
      };
    }
    return { allowed: true };
  }
}
