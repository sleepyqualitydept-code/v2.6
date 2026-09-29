import { ErpDatabase } from './erpDb';
import { SerialNumber, WarrantyCertificate, Product, SalesRecord } from '../types/erp';

export interface EligibilityResult {
  isEligible: boolean;
  statusCode: 
    | 'ELIGIBLE' 
    | 'SERIAL_NOT_FOUND' 
    | 'CERT_NOT_FOUND' 
    | 'ALREADY_ACTIVATED' 
    | 'REPLACED' 
    | 'CANCELLED' 
    | 'BLACKLISTED' 
    | 'NOT_SOLD';
  message: string;
  serial?: SerialNumber;
  certificate?: WarrantyCertificate;
  product?: Product;
  salesRecord?: SalesRecord;
}

/**
 * Single source of truth for warranty activation eligibility.
 * Validates against the complete enterprise pipeline before allowing activation.
 */
export class WarrantyEligibilityEngine {
  private static blacklistedSerials: Set<string> = new Set([
    'SLP-BLACK-000000',
    'SH-BLACK-000000'
  ]);

  /**
   * Validate if a serial number / warranty number is eligible for customer activation.
   */
  public static validateEligibility(serialNumberOrWarranty: string): EligibilityResult {
    const cleanInput = serialNumberOrWarranty.trim().toUpperCase();
    const serials = ErpDatabase.getSerialNumbers();
    const certs = ErpDatabase.getWarrantyCertificates();
    const products = ErpDatabase.getProducts();
    const salesRecords = ErpDatabase.getSalesRecords();
    const replacements = ErpDatabase.getProductReplacements();

    // 1. Resolve Serial and Certificate
    let serial = serials.find(s => s.serialNumber.toUpperCase() === cleanInput);
    let cert = certs.find(c => c.warrantyNumber.toUpperCase() === cleanInput);

    if (!serial && cert) {
      serial = serials.find(s => s.serialNumber === cert!.serialNumber);
    }
    if (!cert && serial) {
      cert = certs.find(c => c.serialNumber === serial!.serialNumber);
    }

    // Rule 1: Serial Exists
    if (!serial) {
      return {
        isEligible: false,
        statusCode: 'SERIAL_NOT_FOUND',
        message: 'الرقم التسلسلي غير مسجل في قاعدة البيانات المعتمدة لشركة سليبي.'
      };
    }

    // Rule 2: Certificate Exists
    if (!cert) {
      return {
        isEligible: false,
        statusCode: 'CERT_NOT_FOUND',
        message: 'شهادة الضمان غير مطابقة أو مفقودة في سجلات الضمان المصنعية.'
      };
    }

    const product = products.find(p => p.id === serial!.productId);
    const salesRecord = salesRecords.find(s => s.serialNumber === serial!.serialNumber);

    // Rule 3: Blacklisted Check
    if (this.blacklistedSerials.has(serial.serialNumber)) {
      return {
        isEligible: false,
        statusCode: 'BLACKLISTED',
        message: 'هذا الرقم التسلسلي محظور أمنياً وتم إيقافه من قِبل إدارة الجودة والرقابة.',
        serial,
        certificate: cert,
        product,
        salesRecord
      };
    }

    // Rule 4: Replaced Check
    const isReplaced = replacements.some(r => r.originalSerialNumber === serial!.serialNumber) || serial.status === 'Replaced' || cert.status === 'replaced';
    if (isReplaced) {
      return {
        isEligible: false,
        statusCode: 'REPLACED',
        message: 'تم استبدال هذا المنتج مسبقاً وصدر له رقم تسلسلي بديل.',
        serial,
        certificate: cert,
        product,
        salesRecord
      };
    }

    // Rule 5: Cancelled Check
    if (serial.status === 'Cancelled' || cert.status === 'cancelled') {
      return {
        isEligible: false,
        statusCode: 'CANCELLED',
        message: 'تم إلغاء هذا السيريال / الشهادة لعدم مطابقته لمعايير الجودة والتوزيع.',
        serial,
        certificate: cert,
        product,
        salesRecord
      };
    }

    // Rule 6: Already Activated Check
    if (cert.status === 'active' || serial.status === 'Activated') {
      return {
        isEligible: false,
        statusCode: 'ALREADY_ACTIVATED',
        message: `الضمان مفعل مسبقاً بتاريخ ${cert.activationDate || 'سابق'} باسم العميل: ${cert.customerName || 'مسجل'}.`,
        serial,
        certificate: cert,
        product,
        salesRecord
      };
    }

    // Success: Eligible for activation
    return {
      isEligible: true,
      statusCode: 'ELIGIBLE',
      message: 'المنتج صالح ومؤهل تماماً لتفعيل الضمان الإلكتروني المعتمد.',
      serial,
      certificate: cert,
      product,
      salesRecord
    };
  }

  /**
   * Add a serial to blacklist (security/compliance).
   */
  public static blacklistSerial(serialNumber: string): void {
    this.blacklistedSerials.add(serialNumber.trim().toUpperCase());
  }
}
