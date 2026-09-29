export interface Brand {
  id: string; // 'SLP' | 'SH' | 'CFT' | 'RH'
  name: string;
  serialPrefix: string; // e.g., 'SLP' | 'SH' | 'CFT' | 'RH'
  warrantyPrefix: string; // e.g., 'WAR'
}

export interface Category {
  id: string;
  name: string;
}

export interface WarrantyPolicy {
  id: string; // e.g., 'POL-10Y', 'POL-7Y', 'POL-5Y', 'POL-DEC', 'POL-HYB'
  name: string; // e.g., '10 Years', 'Declining Warranty'
  warrantyYears: number;
  description: string;
  policyType?: string; // standard, custom, commercial, promotional
  coverageRules?: string;
  exclusions?: string;
  startDate?: string;
  endDate?: string;
  status?: 'active' | 'inactive';
  scope?: 'All Products' | 'Brand' | 'Product Category' | 'Product Model' | 'Project' | 'Production Version';
  brandIds?: string[];
  categoryIds?: string[];
  modelIds?: string[];
  projectIds?: string[];
  versionIds?: string[];
}

export type ProductTechnology = 
  | 'Bonnell Spring'
  | 'Pocket Spring'
  | 'Foam'
  | 'Rebound Foam'
  | 'Memory Foam'
  | 'HR Foam'
  | 'Latex'
  | 'Hybrid';

export interface ProductFamily {
  id: string; // e.g. FAM-SPRING
  code: string; // e.g. SPRING
  nameAr: string; // e.g. مرتبة سوست
  nameEn: string; // e.g. Spring Mattress
  status: 'active' | 'inactive';
  createdDate: string;
  updatedDate: string;
}

export interface EngineeringSpec {
  foamDensity?: string;
  reboundDensity?: string;
  memoryFoamThickness?: string;
  latexThickness?: string;
  fabricType?: string;
  borderType?: string;
  handleType?: string;
  ventilationType?: string;
  fireRetardant?: string | boolean;
  technicalNotes?: string;
  engineeringNotes?: string;
  internalManufacturingNotes?: string;
}

export interface Project {
  id: string; // e.g. PRJ-2026-001
  code: string; // e.g. PRJ-MASA
  projectName: string;
  customerName?: string;
  status: 'Draft' | 'Active' | 'Production' | 'Completed' | 'Cancelled';
  createdDate: string;
  updatedDate: string;
  productsCount: number;
  ordersCount: number;
  notes?: string;
}

export interface ProjectProduct {
  id: string; // e.g. PRJPROD-XXXX
  projectId: string;
  brandId: string;
  familyId: string;
  customModelName: string;
  width: number;
  length: number;
  height: number;
  technology: ProductTechnology;
  manufacturingSystem: 'American' | 'German' | 'Other';
  engineeringSpec?: EngineeringSpec;
  createdDate: string;
  updatedDate: string;
}

export interface Product {
  id: string;
  productType: 'standard' | 'custom'; // Standard vs Custom Project/Tender
  projectName?: string; // For Custom Projects/Tenders
  customerName?: string; // Client/Customer name for Project
  brandId: string;
  familyId?: string; // Linked Product Family
  categoryId: string;
  modelId: string;  // Reference to Model Master (or 'CUSTOM' for custom)
  sizeId: string;   // Reference to Size Master (or 'CUSTOM' for custom)
  modelName: string;
  manufacturingSystem: 'American' | 'German' | 'Other';
  technologies?: ProductTechnology[]; // Linked technologies
  width: number;
  length: number;
  height: number;
  warrantyPolicyId: string; // Linked to WarrantyPolicy
  sapMaterialCode?: string;
  internalProductCode: string;
  status: 'active' | 'inactive';
  createdDate: string;
  updatedDate: string;
  notes?: string;
  engineeringSpec?: EngineeringSpec;
}

export interface Model {
  id: string; // e.g. MOD-SLP-SILVER
  name: string; // e.g. Silver
  brandId: string;
  familyId?: string; // Product Family link
  height?: number; // Master specification height
  technology?: ProductTechnology; // Master technology
  manufacturingSystem?: 'American' | 'German' | 'Other';
  warrantyPolicyId?: string;
  status: 'active' | 'inactive';
  createdDate: string;
  updatedDate: string;
  notes?: string;
}

export interface Size {
  id: string; // e.g. DIM-100-195
  width: number;
  length: number;
  height?: number; // Optional specification
  displayName: string; // e.g. 100×195
  modelId?: string; // Optional
  status: 'active' | 'inactive';
}

export interface CustomDimension {
  id: string; // CustomDimensionID
  projectId?: string; // ProjectID
  customerId?: string; // CustomerID
  customerName?: string;
  projectName?: string;
  width: number;
  length: number;
  height: number;
  notes?: string;
  createdDate: string;
  createdBy?: string;
  status: 'active' | 'inactive';
}

export interface AlbumMaster {
  id: string; // e.g. ALB-2026-CATALOG
  code: string;
  titleAr: string;
  titleEn: string;
  albumType: 'marketing' | 'dealer' | 'warranty' | 'catalog';
  version: string;
  status: 'active' | 'draft' | 'archived';
  createdDate: string;
  updatedDate: string;
}

export interface AlbumCategory {
  id: string;
  nameAr: string;
  nameEn: string;
}

export interface AlbumPage {
  id: string;
  albumId: string;
  pageNumber: number;
  title: string;
  brandId?: string;
  modelIds?: string[];
  layout: 'single' | 'grid' | 'comparison' | 'feature';
}

export interface AlbumAsset {
  id: string;
  title: string;
  url: string;
  assetType: 'image' | 'pdf' | 'vector';
}

export interface AlbumVersion {
  id: string;
  albumId: string;
  versionNumber: string;
  createdDate: string;
  changelog: string;
}

// ============================================================================
// PART 6: MATERIAL BOM (BILL OF MATERIALS)
// ============================================================================
export type BomStatus = 'Active' | 'Draft' | 'Inactive';

export interface BomMaterialLine {
  id: string;
  materialCode: string;
  materialName: string;
  quantity: number;
  unit: 'm' | 'm2' | 'kg' | 'pcs' | 'roll' | 'set';
  notes?: string;
}

export interface BillOfMaterials {
  id: string; // e.g. BOM-2026-000001
  bomNumber: string; // e.g. BOM-2026-000001
  bomName: string;
  brandId: string;
  familyId: string;
  modelId: string;
  version: string; // e.g. 'v1.0'
  status: BomStatus;
  materials: BomMaterialLine[];
  createdBy: string;
  createdDate: string;
  updatedDate: string;
  notes?: string;
}

export type ProductionOrderStatus = 'Draft' | 'Approved' | 'In Production' | 'Completed' | 'Cancelled';

export interface ProductionOrderAudit {
  id: string;
  productionOrderId: string;
  fromStatus: ProductionOrderStatus;
  toStatus: ProductionOrderStatus;
  action: string;
  operator: string;
  timestamp: string;
  notes?: string;
}

export interface ProductionOrder {
  id: string;
  productionOrderNumber: string;
  productId: string;
  projectId?: string; // Optional link for Project Orders
  projectProductId?: string; // Optional link for Project Orders
  brandId?: string;
  quantity: number;
  productionDate: string;
  batchNumber: string;
  operator: string;
  notes?: string;
  createdDate: string;
  updatedDate?: string;
  status: ProductionOrderStatus;
  approvedDate?: string;
  completedDate?: string;
  cancelledDate?: string;
}

export type BatchStatus = 'Draft' | 'Approved' | 'In Production' | 'Completed' | 'Cancelled';

export interface Batch {
  id: string; // e.g. BATCH-2026-000001
  batchNumber: string; // e.g. BATCH-2026-000001
  productionOrderId: string;
  productId: string;
  brandId: string;
  familyId: string;
  modelId: string;
  dimensionId: string; // e.g. DIM-100-195
  quantity: number;
  productionDate: string;
  status: BatchStatus;
  createdBy: string;
  createdDate: string;
  notes?: string;
}

export type SerialStatus = 
  | 'Generated'
  | 'Printed'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Sold'
  | 'Activated'
  | 'Replaced'
  | 'Cancelled';

export interface SerialNumber {
  serialNumber: string; // e.g. SLP-2026-000001
  warrantyNumber: string; // e.g. WAR-SLP-2026-000001
  productId: string;
  productionOrderId: string;
  batchId: string;
  batchNumber: string;
  brandId?: string;
  createdDate: string;
  status: SerialStatus;
  printedDate?: string;
  packedDate?: string;
  shippedDate?: string;
  deliveredDate?: string;
  soldDate?: string;
  activatedDate?: string;
}

export interface WarrantyCertificate {
  warrantyNumber: string;
  serialNumber: string;
  productId: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  activationDate?: string;
  expiryDate: string;
  status: 'active' | 'unactivated' | 'expired' | 'replaced' | 'cancelled';
  createdDate: string;
}

export interface QRCodeRecord {
  id: string;
  warrantyNumber: string;
  serialNumber: string;
  verificationUrl: string;
  qrDataUrl: string; // base64 representation
}

export type ProductLifecycleStage = 
  | 'Manufactured'
  | 'Printed'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Sold'
  | 'Activated'
  | 'Warranty Claim'
  | 'Replacement';

export interface ProductLifecycleEvent {
  id: string;
  serialNumber: string;
  productId: string;
  batchNumber: string;
  stage: ProductLifecycleStage;
  timestamp: string;
  operator: string;
  location?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

export type PrintQueueStatus = 
  | 'Ready'
  | 'Printing'
  | 'Printed'
  | 'Failed'
  | 'Cancelled'
  | 'Reprint Requested';

export interface PrintJob {
  id: string; // Queue ID e.g. PQ-2026-000001
  serialNumber: string;
  warrantyNumber: string;
  batchNumber: string;
  productId: string;
  productName: string;
  sizeLabel: string;
  printTime?: string;
  operator: string;
  status: PrintQueueStatus;
  reprintCount: number;
  failedReason?: string;
  createdDate: string;
}

export interface AuditLog {
  id: string;
  action: string; // 'Product Creation' | 'Product Update' | 'Production Orders' | 'Serial Generation' | ...
  details: string;
  timestamp: string;
  operator: string;
}

export interface Customer {
  id: string; // e.g. CUST-XXXXX
  name: string;
  mobileNumber: string;
  alternativeNumber?: string;
  governorate: string;
  city: string;
  address: string;
  nationalId?: string;
  customerType?: string;
  createdDate: string;
  status: 'active' | 'inactive';
}

// ============================================================================
// PHASE 04-A1: DISTRIBUTION, QR & DIGITAL PASSPORT TYPES
// ============================================================================

export type AllocationType = 'Warehouse' | 'Distributor' | 'Dealer' | 'Showroom' | 'Project';
export type AllocationStatus = 'Allocated' | 'Transferred' | 'Sold' | 'Returned' | 'Cancelled';

export interface SerialAllocation {
  allocationId: string; // ALLOC-YYYY-000001
  serialNumber: string;
  batchNumber: string;
  productId: string;
  brandId: string;
  modelId: string;
  dimensionId: string;
  allocationType: AllocationType;
  allocationName: string;
  allocationDate: string;
  allocatedBy: string;
  status: AllocationStatus;
  notes?: string;
}

export type PackType = 'Carton' | 'Bundle' | 'Pallet' | 'Container';
export type PackStatus = 'Open' | 'Packed' | 'Shipped' | 'Closed';

export interface PackUnit {
  packId: string; // PK-YYYY-000001
  packType: PackType;
  batchId: string;
  serialCount: number;
  serialNumbers: string[];
  createdDate: string;
  createdBy: string;
  status: PackStatus;
  notes?: string;
}

export type ShipmentDestinationType = 'Warehouse' | 'Distributor' | 'Dealer' | 'Showroom' | 'Project';
export type ShipmentStatus = 'Draft' | 'Approved' | 'InTransit' | 'Delivered' | 'Cancelled';

export interface Shipment {
  shipmentId: string; // SHIP-YYYY-000001
  shipmentDate: string;
  destinationType: ShipmentDestinationType;
  destinationName: string;
  packIds: string[];
  serialCount: number;
  createdBy: string;
  status: ShipmentStatus;
  trackingNumber?: string;
  driverName?: string;
  vehiclePlate?: string;
  deliveryDate?: string;
  notes?: string;
}

export type SalesStatus = 'PendingActivation' | 'Activated' | 'Returned' | 'Cancelled';

export interface SalesRecord {
  salesId: string; // SALE-YYYY-000001
  invoiceNumber: string;
  invoiceDate: string;
  serialNumber: string;
  customerName: string;
  customerMobile: string;
  dealerName: string;
  city: string;
  governorate: string;
  status: SalesStatus;
  createdDate: string;
  price?: number;
  notes?: string;
}

export interface QrRegistry {
  qrId: string; // QR-YYYY-000001
  serialNumber: string;
  certificateNumber: string;
  generationDate: string;
  generatedBy: string;
  printCount: number;
  reprintCount: number;
  lastPrintedDate?: string;
  qrDataUrl: string;
  verificationUrl: string;
  status: 'Generated' | 'Printed' | 'Reprinted' | 'Cancelled';
}

export interface WarrantyClaimRecord {
  id: string;
  serialNumber: string;
  warrantyNumber: string;
  claimDate: string;
  claimType: 'Inspection' | 'Repair' | 'Replacement';
  description: string;
  status: 'Pending' | 'Approved' | 'Resolved' | 'Rejected';
  resolutionNotes?: string;
  handledBy?: string;
}

export interface ProductReplacementRecord {
  id: string;
  originalSerialNumber: string;
  newSerialNumber: string;
  warrantyNumber: string;
  replacementDate: string;
  reason: string;
  approvedBy: string;
}

// ============================================================================
// PROMPT-034: SYSTEM MANAGEMENT & GOVERNANCE TYPES
// ============================================================================
export type SystemRole = 
  | 'SUPER_ADMIN' 
  | 'PLANT_MANAGER' 
  | 'PRODUCTION' 
  | 'WAREHOUSE' 
  | 'SALES' 
  | 'CUSTOMER_SERVICE' 
  | 'READ_ONLY';

export type SystemDepartment = 
  | 'الإنتاج' 
  | 'المخازن' 
  | 'المبيعات' 
  | 'خدمة العملاء' 
  | 'الإدارة';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: SystemRole;
  department: SystemDepartment;
  status: 'active' | 'inactive';
  lastLogin: string;
  isLocked?: boolean;
  lockedReason?: string;
}

export type TemplateApprovalStatus = 'Draft' | 'Under Review' | 'Approved' | 'Archived';

export interface PrintTemplateVersion {
  version: string;
  updatedDate: string;
  author: string;
  notes: string;
}

export interface PrintTemplateAudit {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

export interface PrintTemplate {
  id: string; // e.g. TPL-ZPL-100x150
  name: string;
  code: string;
  widthMm: number;
  heightMm: number;
  dpi: number;
  format: 'ZPL' | 'EPL' | 'PDF';
  approvalStatus: TemplateApprovalStatus;
  version: string;
  zplCode: string;
  qrConfig: {
    enabled: boolean;
    size: number;
    correctionLevel: 'L' | 'M' | 'Q' | 'H';
    positionX: number;
    positionY: number;
    dataField: string;
  };
  barcodeConfig: {
    enabled: boolean;
    type: 'Code128' | 'EAN13' | 'QR';
    height: number;
    positionX: number;
    positionY: number;
    dataField: string;
  };
  versionHistory: PrintTemplateVersion[];
  auditTrail: PrintTemplateAudit[];
  createdDate: string;
  updatedDate: string;
  approvedBy?: string;
  approvedDate?: string;
}

// ============================================================================
// PROMPT-033-R1 SECTION 10: BOM GOVERNANCE ARCHITECTURAL PLACEHOLDERS
// (Preparation for PROMPT-034: Advanced BOM Governance, Approval & Cost Rollup)
// ============================================================================
export type BomApprovalStatus = 'Draft' | 'Under Review' | 'Approved' | 'Rejected' | 'Superseded';

export interface BomVersionRecord {
  version: string;
  effectiveDate: string;
  approvedBy?: string;
  changelog: string;
}

export interface BomMaterialValidationRule {
  materialCode: string;
  minQuantity: number;
  maxQuantity: number;
  allowSubstitution: boolean;
  substituteMaterials?: string[];
}

export interface BomCostRollup {
  bomId: string;
  totalMaterialCost: number;
  laborCostEstimate?: number;
  currency: string;
  lastCalculated: string;
}

export interface BomAuditTrailEntry {
  id: string;
  bomId: string;
  action: 'Created' | 'Version Bump' | 'Material Modified' | 'Approved' | 'Substitution';
  operator: string;
  timestamp: string;
  details: string;
}

export interface NetworkPrinter {
  id: string;
  name: string;
  type: 'Thermal Label' | 'Laser Document' | 'Industrial Continuous';
  ipAddress: string;
  port: number;
  status: 'Online' | 'Offline' | 'Busy';
  location?: string;
  lastTest?: string;
}

export interface PolicyMapping {
  id: string;
  level: 'Model' | 'Family' | 'Brand';
  targetId: string;
  targetName: string;
  policyId: string;
  updatedDate: string;
}

// ============================================================================
// PHASE 5: MANUFACTURING ENGINEERING & ROUTING INTELLIGENCE TYPES
// ============================================================================
export type OperationCategory = 
  | 'Cutting' 
  | 'Assembly' 
  | 'Gluing' 
  | 'Spring Assembly' 
  | 'Quilting' 
  | 'Border Closing' 
  | 'Packing' 
  | 'Compression' 
  | 'Inspection' 
  | 'Storage';

export interface OperationMaster {
  operationCode: string;
  operationNameAr: string;
  operationNameEn: string;
  department: string;
  workCenterCode: string;
  category: OperationCategory;
  setupTimeMinutes: number;
  runTimeMinutes: number;
  laborCount: number;
  machineRequired: string;
  machineHourRate: number;
  laborHourRate: number;
  qualityCheckRequired: boolean;
  activeStatus: boolean;
  notes?: string;
}

export interface WorkCenter {
  workCenterCode: string;
  workCenterNameAr: string;
  workCenterNameEn: string;
  department: string;
  capacityPerShift: number;
  capacityPerHour: number;
  machineCount: number;
  laborCapacity: number;
  efficiencyPercent: number;
  activeStatus: boolean;
}

export interface RoutingStep {
  sequenceNo: number;
  operationCode: string;
  operationNameAr: string;
  operationNameEn: string;
  workCenterCode: string;
  setupTime: number; // Minutes
  runTime: number; // Minutes
  laborCount: number;
  machineCount: number;
  qualityGate: boolean;
  mandatoryStep: boolean;
  estimatedCost: number;
}

export interface RoutingTemplate {
  templateCode: string;
  templateName: string;
  productCategory: string;
  description: string;
  defaultSteps: RoutingStep[];
  defaultStepsCount?: number;
  activeStatus: boolean;
}

export interface ManufacturingRouting {
  routingCode: string;
  productCode: string;
  modelId: string;
  version: string;
  templateCode?: string;
  steps: RoutingStep[];
  totalSetupTime: number;
  totalRunTime: number;
  totalLaborTime: number;
  totalMachineTime: number;
  laborCost: number;
  machineCost: number;
  energyCost: number;
  qualityCost: number;
  factoryOverhead: number;
  totalRoutingCost: number;
  createdDate: string;
  status: 'Draft' | 'Approved' | 'Obsolete';
}

export interface ManufacturingReadiness {
  score: number; // 0 - 100
  classification: 'Ready For Production' | 'Review Required' | 'Not Ready';
  routingCompleteness: boolean;
  bomCompleteness: boolean;
  qualityCompliance: boolean;
  warrantyCompliance: boolean;
  capacityAvailability: boolean;
  validationErrors: string[];
}

export interface EnterpriseSettings {
  companyNameAr: string;
  companyNameEn: string;
  logoUrl?: string;
  email: string;
  phone: string;
  website: string;
  defaultLanguage: 'ar' | 'en';
  timezone: string;
  dateFormat: string;
  userProfile: {
    fullName: string;
    title: string;
    avatarUrl?: string;
  };
}


