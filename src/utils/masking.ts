// Utility functions for Warranty Verification & Audit Engine

export function maskPhoneNumber(phone?: string): string {
  if (!phone) return '010****5678';
  const clean = phone.trim().replace(/\s+/g, '');
  if (clean.length < 8) return clean;
  const prefix = clean.slice(0, 3);
  const suffix = clean.slice(-4);
  return `${prefix}****${suffix}`;
}

export function generateWarrantyNumber(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `WAR-2026-${randomNum}`;
}

export function generateCustomerId(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `CUS-2026-${randomNum}`;
}

export function getWarrantyNumber(product?: any): string {
  if (!product) return 'غير متوفر';
  const war =
    product.warrantyNumber ||
    product.warrantyCertificateNumber ||
    product.warNumber;
  if (war && typeof war === 'string' && war.trim() !== '') {
    return war;
  }
  return 'غير متوفر';
}
