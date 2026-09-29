import { WarrantyProduct } from '../types/warranty';

export interface LifecycleStep {
  title: string;
  subtitle?: string;
  titleEn?: string;
  subtitleEn?: string;
  date?: string;
  completed: boolean;
  statusText?: string;
  isCurrent?: boolean;
  isExpired?: boolean;
  isReplaced?: boolean;
  isRevoked?: boolean;
  isBlacklisted?: boolean;
  isPending?: boolean;
}

/**
 * Returns the standardized product lifecycle steps for a given WarrantyProduct.
 * Single Source Of Truth for Timeline Bar and Journey Modal across all warranty pages.
 */
export function getProductLifecycleSteps(product: WarrantyProduct | null | undefined): LifecycleStep[] {
  if (!product || !product.serialNumber) {
    return [];
  }

  const status = product.status || 'active';
  const serialState = product.serialState;
  const prodDate = product.productionDate || '10 - 01 - 2026';
  const purchaseDate = product.purchaseDate || '18 - 01 - 2026';
  const startDate = product.warrantyStartDate || purchaseDate;
  const endDate = product.warrantyEndDate || '18 - 01 - 2036';

  // 1. Blacklisted state check
  if (status === 'blacklisted' || serialState === 'blacklisted') {
    const blacklistReason = product.blacklistDetails?.reasonText || 'تحقيق أمني أو ملاحظة جودة معتمدة';
    return [
      {
        title: 'تم الإنتاج',
        subtitle: 'مطابق للمواصفات المعملية',
        titleEn: 'Produced',
        subtitleEn: 'Meets laboratory specs',
        date: prodDate,
        completed: true,
      },
      {
        title: 'فحص الجودة',
        subtitle: 'فحص التعبئة الآمنة',
        titleEn: 'Quality Inspection',
        subtitleEn: 'Safe packaging inspected',
        date: prodDate,
        completed: true,
      },
      {
        title: 'تم البيع',
        subtitle: 'فاتورة معتمدة',
        titleEn: 'Sold',
        subtitleEn: 'Certified invoice',
        date: purchaseDate,
        completed: true,
      },
      {
        title: 'تم التسليم',
        subtitle: 'تم التسليم للعميل/الموزع',
        titleEn: 'Delivered',
        subtitleEn: 'Delivered to customer',
        date: purchaseDate,
        completed: true,
      },
      {
        title: 'تم حظر المنتج',
        subtitle: `سبب الحظر: ${blacklistReason}`,
        titleEn: 'Product Blacklisted',
        subtitleEn: `Reason: ${blacklistReason}`,
        date: product.blacklistDetails?.blacklistedAt || startDate,
        completed: true,
        isBlacklisted: true,
      },
    ];
  }

  // Common initial 4 stages requested: تم الإنتاج -> فحص الجودة -> تم البيع -> تم التسليم
  const baseFourStages: LifecycleStep[] = [
    {
      title: 'تم الإنتاج',
      subtitle: 'مطابق للمواصفات المعملية',
      titleEn: 'Produced',
      subtitleEn: 'Meets laboratory specs',
      date: prodDate,
      completed: true,
    },
    {
      title: 'فحص الجودة',
      subtitle: 'اجتياز اختبار الفحص والتحقق',
      titleEn: 'Quality Inspection',
      subtitleEn: 'Passed inspection & test',
      date: prodDate,
      completed: true,
    },
    {
      title: 'تم البيع',
      subtitle: 'فاتورة معتمدة',
      titleEn: 'Sold',
      subtitleEn: 'Certified invoice',
      date: purchaseDate,
      completed: true,
    },
    {
      title: 'تم التسليم',
      subtitle: 'تم التسليم الفعلي للعميل',
      titleEn: 'Delivered',
      subtitleEn: 'Delivered to customer',
      date: purchaseDate,
      completed: true,
    },
  ];

  // 1. Pending Activation (بانتظار التفعيل)
  if (status === 'unactivated') {
    return [
      ...baseFourStages,
      {
        title: 'بانتظار تفعيل الضمان',
        subtitle: 'بانتظار تسجيل بيانات العميل والفاتورة',
        titleEn: 'Pending Activation',
        subtitleEn: 'Awaiting customer registration',
        date: 'بانتظار التفعيل',
        completed: false,
        isPending: true,
      },
    ];
  }

  // 2. Active Warranty (ضمان ساري ومفعل)
  if (status === 'active') {
    return [
      ...baseFourStages,
      {
        title: 'تم تفعيل الضمان',
        subtitle: 'الضمان ساري ونشط رسمياً',
        titleEn: 'Warranty Activated',
        subtitleEn: 'Warranty is officially active',
        date: startDate,
        completed: true,
      },
    ];
  }

  // 3. Expired Warranty (ضمان منتهي)
  if (status === 'expired') {
    return [
      ...baseFourStages,
      {
        title: 'تم تفعيل الضمان',
        subtitle: 'الضمان ساري ونشط سابقاً',
        titleEn: 'Warranty Activated',
        subtitleEn: 'Previously active warranty',
        date: startDate,
        completed: true,
      },
      {
        title: 'انتهاء الضمان',
        subtitle: 'انتهت فترة الضمان الرسمية',
        titleEn: 'Warranty Expired',
        subtitleEn: 'Warranty period has ended',
        date: endDate,
        completed: true,
        isExpired: true,
      },
    ];
  }

  // 4. Replaced Product (منتج مستبدل)
  if (status === 'replaced') {
    const repNum = product.replacementDetails?.replacementNumber || 'REP-2026-001';
    const repDate = product.replacementDetails?.replacementDate || startDate;
    return [
      ...baseFourStages,
      {
        title: 'تم تفعيل الضمان',
        subtitle: 'الضمان ساري ونشط سابقاً',
        titleEn: 'Warranty Activated',
        subtitleEn: 'Previously active warranty',
        date: startDate,
        completed: true,
      },
      {
        title: 'تم الاستبدال',
        subtitle: `طلب استبدال رقم: ${repNum}`,
        titleEn: 'Product Replaced',
        subtitleEn: `Replacement No: ${repNum}`,
        date: repDate,
        completed: true,
        isReplaced: true,
      },
    ];
  }

  // Maintenance State (حالة الصيانة)
  if (status === 'maintenance') {
    const mntNum = product.maintenanceDetails?.maintenanceNumber || 'MNT-2026-0001';
    const mntDate = product.maintenanceDetails?.openDate || startDate;
    return [
      ...baseFourStages,
      {
        title: 'تم تفعيل الضمان',
        subtitle: 'الضمان ساري ونشط',
        titleEn: 'Warranty Activated',
        subtitleEn: 'Warranty active',
        date: startDate,
        completed: true,
      },
      {
        title: 'قيد الصيانة الفنية',
        subtitle: `رقم طلب الصيانة: ${mntNum}`,
        titleEn: 'Under Maintenance',
        subtitleEn: `Ticket No: ${mntNum}`,
        date: mntDate,
        completed: true,
        isReplaced: true,
      },
    ];
  }

  // Ownership Transfer State (حالة نقل الملكية)
  if (product.ownershipHistory && product.ownershipHistory.length > 0) {
    const trf = product.ownershipHistory[0];
    return [
      ...baseFourStages,
      {
        title: 'تم تفعيل الضمان',
        subtitle: 'الضمان ساري ونشط',
        titleEn: 'Warranty Activated',
        subtitleEn: 'Warranty active',
        date: startDate,
        completed: true,
      },
      {
        title: 'تم نقل الملكية',
        subtitle: `المالك الحالي: ${trf.newOwner}`,
        titleEn: 'Ownership Transferred',
        subtitleEn: `Current Owner: ${trf.newOwner}`,
        date: trf.transferDate,
        completed: true,
        isReplaced: true,
      },
    ];
  }

  // 5. Revoked Warranty (ضمان ملغى)
  if (status === 'revoked' || status === 'cancelled' || status === 'void') {
    const revokeReason = product.revocationDetails?.reason || 'مخالفة الشروط والأحكام المعتمدة';
    return [
      ...baseFourStages,
      {
        title: 'تم تفعيل الضمان',
        subtitle: 'الضمان ساري سابقاً',
        titleEn: 'Warranty Activated',
        subtitleEn: 'Previously active warranty',
        date: startDate,
        completed: true,
      },
      {
        title: 'تم إلغاء الشهادة',
        subtitle: `سبب الإلغاء: ${revokeReason}`,
        titleEn: 'Certificate Revoked',
        subtitleEn: `Reason: ${revokeReason}`,
        date: product.revocationDetails?.revokedAt || endDate,
        completed: true,
        isRevoked: true,
      },
    ];
  }

  // Default fallback for active
  return [
    ...baseFourStages,
    {
      title: 'تم تفعيل الضمان',
      subtitle: 'الضمان ساري ونشط رسمياً',
      titleEn: 'Warranty Activated',
      subtitleEn: 'Warranty is officially active',
      date: startDate,
      completed: true,
    },
  ];
}
