export type WarrantyStatus =
  | 'active'
  | 'expired'
  | 'unactivated'
  | 'suspended'
  | 'cancelled'
  | 'replaced'
  | 'revoked'
  | 'archived'
  | 'blacklisted'
  | 'lost'
  | 'void'
  | 'maintenance'
  | 'not_found';

export type CertificateStatus = 'valid' | 'revoked' | 'archived';

export type SerialLifecycleState =
  | 'generated'
  | 'printed'
  | 'allocated'
  | 'sold'
  | 'activated'
  | 'lost'
  | 'void'
  | 'cancelled'
  | 'replaced'
  | 'blacklisted';

export type BrandType = 'Sleepee' | 'SH' | 'Rich House' | 'Comfort SH';

export type ActivationChannel =
  | 'qr'
  | 'website'
  | 'customer_service'
  | 'dealer'
  | 'admin'
  | 'mobile_app';

export type AuthenticityStatus =
  | 'authentic'
  | 'verified'
  | 'genuine'
  | 'unverified'
  | 'suspicious'
  | 'blacklisted'
  | 'counterfeit_investigation';

export type BlacklistReason =
  | 'fraud_investigation'
  | 'duplicate_label'
  | 'quality_hold'
  | 'counterfeit_detection'
  | 'administrative';

export interface BlacklistRecord {
  id: string;
  serialNumber: string;
  reason: BlacklistReason;
  reasonText: string;
  blacklistedAt: string;
  blacklistedBy: string;
  active: boolean;
}

export interface DuplicateAlert {
  id: string;
  serialNumber: string;
  warNumber?: string;
  type: 'multiple_activations' | 'multiple_certificates' | 'duplicate_serial_assignment' | 'duplicate_ownership';
  detectedAt: string;
  details: string;
  status: 'new' | 'under_review' | 'resolved';
}

export interface RevocationRecord {
  id: string;
  warNumber: string;
  serialNumber: string;
  reason: string;
  revokedAt: string;
  revokedBy: string;
  status: CertificateStatus;
}

export type RecordState = 'active' | 'inactive' | 'archived' | 'cancelled';

export interface TimelineStep {
  title: string;
  date?: string;
  completed: boolean;
  statusText?: string;
  isWarning?: boolean;
  isError?: boolean;
}

export interface WarrantyPolicySnapshot {
  policyVersion: string;
  policyName: string;
  warrantyYears: number;
  coverageRules: string[];
  activationRules: string[];
  effectiveDate: string;
  termsSummary: string;
}

export interface CertificateVersionRecord {
  version: number;
  generatedDate: string;
  generatedBy: string;
  pdfUrl?: string;
  reason?: string;
  hash?: string;
}

export interface ProductLifecycleEvent {
  id: string;
  type:
    | 'production'
    | 'packaging'
    | 'allocation'
    | 'sale'
    | 'warranty_activation'
    | 'complaint'
    | 'service_request'
    | 'repair'
    | 'replacement'
    | 'closure';
  title: string;
  description?: string;
  timestamp: string;
  date: string;
  actor?: string;
  source?: string;
  completed: boolean;
}

export interface ReplacementRecord {
  replacementNumber: string;
  oldSerialNumber?: string;
  newSerialNumber?: string;
  oldWarrantyNumber?: string;
  newWarrantyNumber?: string;
  replacementDate?: string;
  reason?: string;
  approvedBy?: string;
}

export interface MaintenanceRecord {
  maintenanceNumber: string;
  openDate: string;
  status: string;
  serviceCenter: string;
  lastUpdate?: string;
}

export interface OwnershipTransferRecord {
  transferNumber: string;
  transferDate: string;
  previousOwner: string;
  newOwner: string;
  reason: string;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  approvedBy?: string;
}

export interface ClaimRecord {
  claimNumber: string;
  claimType: string;
  claimStatus: 'submitted' | 'under_review' | 'approved' | 'in_repair' | 'rejected' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  resolution?: string;
  slaDueDate?: string;
  createdDate: string;
}

export interface ServiceRequestRecord {
  serviceRequestNumber: string;
  status: 'scheduled' | 'dispatched' | 'in_progress' | 'completed' | 'cancelled';
  assignedTeam: string;
  visitDate?: string;
  completionDate?: string;
  notes?: string;
}

export interface RepairRecord {
  repairNumber: string;
  repairStatus: 'diagnosing' | 'in_repair' | 'parts_pending' | 'completed' | 'failed';
  repairResult?: string;
  technician: string;
  completionDate?: string;
  partsReplaced?: string[];
}

export interface AppointmentRecord {
  appointmentNumber: string;
  customerId: string;
  location: string;
  date: string;
  time: string;
  status: 'confirmed' | 'rescheduled' | 'completed' | 'cancelled';
  purpose?: string;
}

export interface AttachmentRecord {
  id: string;
  fileName: string;
  fileType:
    | 'invoice'
    | 'warranty_doc'
    | 'claim_doc'
    | 'repair_report'
    | 'photo'
    | 'video'
    | 'customer_attachment';
  uploadDate: string;
  uploadedBy: string;
  relatedEntity: string;
  size?: string;
  url?: string;
}

export interface CommunicationRecord {
  id: string;
  date: string;
  user: string;
  interactionType: 'phone_call' | 'whatsapp' | 'email' | 'visit' | 'system_note';
  notes: string;
  outcome?: string;
}

export interface DealerInfo {
  dealerId: string;
  dealerName: string;
  branch: string;
  region: string;
}

export interface AuditLogEntry {
  id: string;
  dateTime: string;
  user: string;
  role: string;
  action: 'created' | 'updated' | 'activated' | 'cancelled' | 'suspended' | 'transferred' | 'replaced' | 'exported';
  source: string;
  details?: string;
}

export interface SLARecord {
  createdDate: string;
  targetDate: string;
  actualCompletionDate?: string;
  isOverdue: boolean;
}

export interface GeographicHierarchy {
  country: string;
  governorate: string;
  city: string;
  region: string;
  dealerRegion: string;
}

export interface WarrantyProduct {
  // 1. Product Identity (Generated in Production)
  serialNumber: string;
  productCode?: string;
  qrCodeId: string;
  modelName: string;
  brand: BrandType;
  dimensions: string;
  productionDate: string;
  warrantyPeriod: string;
  serialState?: SerialLifecycleState;

  // 2. Warranty Identity (Generated upon Activation)
  warrantyNumber?: string; // WAR-2026-XXXXXX
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  status: WarrantyStatus;
  certificateStatus?: CertificateStatus;
  createdBy?: string;
  lastUpdated?: string;

  // 3. Customer Identity (Permanent ID)
  customerId?: string; // CUS-2026-XXXXXX
  customerName?: string;
  customerPhone?: string;
  alternativePhone?: string;
  nationalId?: string;
  customerEmail?: string;
  governorate?: string;
  city?: string;
  address?: string;

  // 4. Sales & Invoice
  invoiceNumber?: string;
  purchaseDate?: string;
  dealer?: DealerInfo;
  activationChannel?: ActivationChannel;

  // 5. Policy Snapshot at Activation
  policySnapshot?: WarrantyPolicySnapshot;

  // 6. Certificate Versioning & Verification
  certificateVersion?: number;
  certificateHistory?: CertificateVersionRecord[];
  qrVerificationUrl?: string;

  // 7. Traceability, Lifecycle & Auditing
  timeline: TimelineStep[];
  lifecycleEvents?: ProductLifecycleEvent[];
  auditTrail?: AuditLogEntry[];
  authenticityStatus?: AuthenticityStatus;
  recordState?: RecordState;

  // 8. Governance, Blacklist & Revocation
  blacklistDetails?: BlacklistRecord;
  revocationDetails?: RevocationRecord;
  duplicateAlerts?: DuplicateAlert[];

  // 8. Future Operations Readiness (Customer 360)
  replacementDetails?: ReplacementRecord;
  maintenanceDetails?: MaintenanceRecord;
  ownershipHistory?: OwnershipTransferRecord[];
  claims?: ClaimRecord[];
  serviceRequests?: ServiceRequestRecord[];
  repairs?: RepairRecord[];
  appointments?: AppointmentRecord[];
  attachments?: AttachmentRecord[];
  communications?: CommunicationRecord[];
  sla?: SLARecord;
  geographic?: GeographicHierarchy;

  image?: string;
}

export type SearchTab = 'serial' | 'qr' | 'customer';
