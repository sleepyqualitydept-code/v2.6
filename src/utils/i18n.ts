export type Language = 'ar' | 'en';

export interface Translations {
  [key: string]: {
    ar: string;
    en: string;
  };
}

export const translations: Translations = {
  // Brand & Platform
  platformTitle: {
    ar: 'سليبي',
    en: 'SLEEPEE',
  },
  platformSubtitle: {
    ar: 'منظومة توثيق واعتماد الضمان',
    en: 'Warranty Verification & Certification Platform',
  },
  companyName: {
    ar: 'الشركة العربية لصناعة مراتب السوست والإسفنج',
    en: 'The Arab Company for Spring and Foam Mattresses',
  },
  platformFooterBrand: {
    ar: 'Sleepee Warranty Management Platform',
    en: 'Sleepee Warranty Management Platform',
  },
  hotline: {
    ar: 'الخط الساخن',
    en: 'Hotline',
  },
  publicPortalVersion: {
    ar: 'Public Portal v1.0',
    en: 'Public Portal v1.0',
  },

  // Skip to content
  skipToContent: {
    ar: 'التخطي إلى المحتوى الرئيسي',
    en: 'Skip to main content',
  },

  // Header controls
  adminPanel: {
    ar: 'لوحة الإدارة',
    en: 'Admin Panel',
  },
  darkMode: {
    ar: 'الوضع الليلي',
    en: 'Dark Mode',
  },
  lightMode: {
    ar: 'الوضع النهاري',
    en: 'Light Mode',
  },
  highContrast: {
    ar: 'التباين العالي',
    en: 'High Contrast',
  },
  increaseFont: {
    ar: 'تكبير الخط',
    en: 'Increase Font',
  },
  decreaseFont: {
    ar: 'تصغير الخط',
    en: 'Decrease Font',
  },
  resetFont: {
    ar: 'إعادة ضبط الخط',
    en: 'Reset Font',
  },
  languageToggle: {
    ar: 'English',
    en: 'العربية',
  },

  // Hero Section
  heroMainTitle: {
    ar: 'راحة تدوم',
    en: 'Comfort That Lasts',
  },
  heroSubtitle: {
    ar: 'تحقق من أصالة المنتج وسريان الضمان في ثوانٍ',
    en: 'Verify authenticity and warranty coverage instantly',
  },
  heroPillBrand: {
    ar: 'سليبي · SLEEPEE',
    en: 'SLEEPEE · سليبي',
  },
  heroPillQuality: {
    ar: 'أصالة الجودة',
    en: 'Genuine Quality',
  },
  heroSloganWord1: {
    ar: 'راحة',
    en: 'Comfort',
  },
  heroSloganWord2: {
    ar: 'تدوم',
    en: 'Lasting',
  },
  heroStoryCaption: {
    ar: 'راحة مصممة لتدوم... وضمان يمكنك الوثوق به',
    en: 'Comfort crafted to last... and a warranty you can trust',
  },
  heroImageAlt: {
    ar: 'مرتبة سرير فندقية فاخرة من سليبي',
    en: 'Luxury hotel-grade mattress by Sleepee',
  },

  // Search Card
  searchTitle: {
    ar: 'التحقق من الضمان والمنتج',
    en: 'Warranty & Product Verification',
  },
  searchSubtitle: {
    ar: 'أدخل الرقم التسلسلي أو استخدم مسح QR للتحقق الفوري من سريان الضمان ومواصفات مرتبتك الأصلية',
    en: 'Enter serial number or scan QR code to instantly verify warranty status and original mattress specifications',
  },
  tabSerial: {
    ar: 'البحث بالسيريال',
    en: 'Search by Serial',
  },
  tabQR: {
    ar: 'البحث برقم QR',
    en: 'Search by QR Code',
  },
  tabCustomer: {
    ar: 'البحث ببيانات العميل',
    en: 'Search by Customer',
  },
  guidanceSerial: {
    ar: 'أدخل الرقم التسلسلي الموجود على ملصق المنتج.',
    en: 'Enter the serial number found on the product label.',
  },
  guidanceQR: {
    ar: 'امسح رمز QR الموجود على شهادة الضمان أو المنتج.',
    en: 'Scan the QR code printed on the warranty certificate or product.',
  },
  guidanceCustomer: {
    ar: 'ابحث باستخدام بيانات العميل أو رقم الفاتورة.',
    en: 'Search using registered customer information or invoice number.',
  },
  serialInputPlaceholder: {
    ar: 'أدخل الرقم التسلسلي للمنتج (مثال: SLP-2026-9081)',
    en: 'Enter product serial number (e.g., SLP-2026-9081)',
  },
  searchButton: {
    ar: 'استعلام الآن',
    en: 'Verify Now',
  },
  searchingButton: {
    ar: 'جاري التحقق...',
    en: 'Verifying...',
  },
  qrScanCamera: {
    ar: 'مسح كود QR بالكاميرا',
    en: 'Scan QR with Camera',
  },
  qrScanUpload: {
    ar: 'رفع صورة رمز QR',
    en: 'Upload QR Code Image',
  },
  qrCameraHint: {
    ar: 'يدعم كاميرات الهواتف الذكية وأجهزة الحاسوب واللوحيات بجودة عالية',
    en: 'Supports smartphone, laptop, and tablet cameras with high precision',
  },
  customerNamePlaceholder: {
    ar: 'اسم العميل المسجل',
    en: 'Registered customer name',
  },
  customerPhonePlaceholder: {
    ar: 'رقم الهاتف (مثال: 01012345678)',
    en: 'Phone number (e.g., 01012345678)',
  },
  customerSearchHint: {
    ar: 'يمكن البحث بالاسم الكامل أو رقم الهاتف المسجل في الفاتورة',
    en: 'You can search by customer full name or mobile phone number',
  },
  examplesAccordionTitle: {
    ar: 'أمثلة البحث وحالات الضمان المعتمدة',
    en: 'Search Examples & Warranty Statuses',
  },
  showExamples: {
    ar: 'عرض الأمثلة',
    en: 'Show Examples',
  },
  hideExamples: {
    ar: 'إخفاء',
    en: 'Hide',
  },
  examplesPrompt: {
    ar: 'أمثلة السيريالات للاستعلام السريع:',
    en: 'Sample serial numbers for quick testing:',
  },
  legendTitle: {
    ar: 'دليل مؤشرات حالات الضمان (Warranty Status Legend):',
    en: 'Warranty Status Indicator Legend:',
  },

  // Legend items
  legendActive: {
    ar: 'أخضر = ضمان ساري',
    en: 'Green = Active Warranty',
  },
  legendPending: {
    ar: 'برتقالي = انتظار التفعيل',
    en: 'Orange = Pending Activation',
  },
  legendMaintenance: {
    ar: 'بنفسجي = صيانة',
    en: 'Purple = Maintenance',
  },
  legendTransferred: {
    ar: 'أزرق = نقل ملكية',
    en: 'Teal = Ownership Transfer',
  },
  legendReplaced: {
    ar: 'أزرق فاتح = استبدال',
    en: 'Blue = Replaced',
  },
  legendRevoked: {
    ar: 'أحمر = ملغي',
    en: 'Red = Revoked',
  },
  legendBlacklisted: {
    ar: 'أسود = محظور',
    en: 'Black = Blacklisted',
  },
  legendExpired: {
    ar: 'أحمر داكن = منتهي',
    en: 'Dark Red = Expired',
  },

  // Warranty States
  statusActiveTitle: {
    ar: 'الضمان ساري ومفعل',
    en: 'Warranty Active & Valid',
  },
  statusActiveBadge: {
    ar: 'ساري المفعول',
    en: 'Valid & Active',
  },
  statusExpiredTitle: {
    ar: 'انتهت فترة الضمان',
    en: 'Warranty Period Expired',
  },
  statusExpiredBadge: {
    ar: 'منتهي الصلاحية',
    en: 'Expired',
  },
  statusPendingTitle: {
    ar: 'المنتج بانتظار تفعيل الضمان',
    en: 'Pending Warranty Activation',
  },
  statusPendingBadge: {
    ar: 'بانتظار التفعيل',
    en: 'Pending Activation',
  },
  statusMaintenanceTitle: {
    ar: 'المنتج قيد الصيانة الفنية',
    en: 'Product Under Technical Maintenance',
  },
  statusMaintenanceBadge: {
    ar: 'قيد الصيانة',
    en: 'In Maintenance',
  },
  statusReplacedTitle: {
    ar: 'تم استبدال المنتج',
    en: 'Product Has Been Replaced',
  },
  statusReplacedBadge: {
    ar: 'تم الاستبدال',
    en: 'Replaced',
  },
  statusTransferredTitle: {
    ar: 'تم نقل ملكية المنتج',
    en: 'Product Ownership Transferred',
  },
  statusTransferredBadge: {
    ar: 'منقول الملكية',
    en: 'Ownership Transferred',
  },
  statusRevokedTitle: {
    ar: 'تم إلغاء شهادة الضمان',
    en: 'Warranty Certificate Revoked',
  },
  statusRevokedBadge: {
    ar: 'ملغاة رسمياً',
    en: 'Revoked',
  },
  statusBlacklistedTitle: {
    ar: 'تم حظر هذا المنتج',
    en: 'Product Blacklisted',
  },
  statusBlacklistedBadge: {
    ar: 'محظور أمنياً',
    en: 'Blacklisted',
  },

  // Banners
  revokedBannerTitle: {
    ar: 'تم إلغاء شهادة الضمان',
    en: 'Warranty Certificate Revoked',
  },
  revokedBannerMessage: {
    ar: 'شهادة الضمان لم تعد صالحة للاستخدام وتم إيقاف اعتمادها رسمياً.',
    en: 'This warranty certificate is no longer valid and has been officially revoked.',
  },
  blacklistedBannerTitle: {
    ar: 'تم حظر هذا المنتج',
    en: 'Product Blacklisted',
  },
  blacklistedBannerMessage: {
    ar: 'تم إيقاف هذا المنتج أو الرقم التسلسلي بواسطة إدارة الجودة والأمان.',
    en: 'This product or serial number has been restricted by Quality & Security Administration.',
  },

  // Common Product Details
  productSpecs: {
    ar: 'مواصفات المنتج',
    en: 'Product Specifications',
  },
  modelName: {
    ar: 'الموديل',
    en: 'Model',
  },
  dimensions: {
    ar: 'المقاس والأبعاد',
    en: 'Dimensions',
  },
  serialNumber: {
    ar: 'الرقم التسلسلي (Serial No)',
    en: 'Serial Number',
  },
  warrantyCertificateNumber: {
    ar: 'رقم وثيقة الضمان (WAR No)',
    en: 'Warranty Certificate No (WAR)',
  },
  productionDate: {
    ar: 'تاريخ الإنتاج',
    en: 'Production Date',
  },
  warrantyPeriod: {
    ar: 'مدة الضمان',
    en: 'Warranty Period',
  },
  warrantyStartDate: {
    ar: 'تاريخ بدء الضمان',
    en: 'Warranty Start Date',
  },
  warrantyEndDate: {
    ar: 'تاريخ انتهاء الضمان',
    en: 'Warranty End Date',
  },
  customerData: {
    ar: 'بيانات العميل والفاتورة',
    en: 'Customer & Invoice Data',
  },
  customerName: {
    ar: 'اسم العميل',
    en: 'Customer Name',
  },
  customerPhone: {
    ar: 'رقم الهاتف',
    en: 'Phone Number',
  },
  invoiceNumber: {
    ar: 'رقم الفاتورة',
    en: 'Invoice Number',
  },
  purchaseDate: {
    ar: 'تاريخ الشراء',
    en: 'Purchase Date',
  },
  retailer: {
    ar: 'منفذ البيع / الموزع',
    en: 'Retailer / Distributor',
  },

  // Actions
  printCertificate: {
    ar: 'طباعة الشهادة',
    en: 'Print Certificate',
  },
  downloadPDF: {
    ar: 'تحميل PDF',
    en: 'Download PDF',
  },
  newSearch: {
    ar: 'استعلام جديد',
    en: 'New Search',
  },
  requestMaintenance: {
    ar: 'طلب صيانة أو دعم فني',
    en: 'Request Maintenance / Support',
  },
  contactCustomerService: {
    ar: 'التواصل مع خدمة العملاء',
    en: 'Contact Customer Service',
  },

  // Bottom Section
  bottomTermsTitle: {
    ar: 'شروط وأحكام الضمان الرسمية وملاحظات الاستخدام',
    en: 'Official Warranty Terms, Conditions & Usage Guidelines',
  },
  bottomShowDetails: {
    ar: 'عرض التفاصيل',
    en: 'Show Details',
  },
  bottomHideDetails: {
    ar: 'إخفاء',
    en: 'Hide',
  },
  bottomTerm1: {
    ar: 'يشمل الضمان عيوب الصناعة في السوست والشاسيه والهيكل الداخلي للمرتبة.',
    en: 'Warranty covers manufacturing defects in internal springs, chassis, and core frame.',
  },
  bottomTerm2: {
    ar: 'يبدأ سريان الضمان اعتباراً من تاريخ الشراء المدون بالفاتورة المعتمدة.',
    en: 'Warranty starts from the purchase date stated on the verified invoice.',
  },
  bottomTerm3: {
    ar: 'الضمان لا يغطي الأضرار الناتجة عن سوء الاستخدام أو البلل أو التمزق الخارجي.',
    en: 'Warranty does not cover damages caused by misuse, fluids, or external tears.',
  },
  bottomTerm4: {
    ar: 'يجب استخدام المرتبة على ملة خشبية مستوية ومتقاربة وفق التعليمات.',
    en: 'The mattress must be used on an even, closely-spaced bed base according to instructions.',
  },
  bottomTerm5: {
    ar: 'لطلب الدعم الفني أو الصيانة الرسمية، يرجى التواصل عبر الخط الساخن الموحد للشركة (19707).',
    en: 'For technical support or certified service, please contact the unified company hotline (19707).',
  },
  bottomAccreditation: {
    ar: 'الشهادة معتمدة إلكترونياً من الشركة العربية لصناعة مراتب السوست والإسفنج',
    en: 'Certificate electronically verified by The Arab Company for Spring and Foam Mattresses',
  },
  bottomSystemVersion: {
    ar: 'منظومة الضمان الذكية v2.6',
    en: 'Smart Warranty System v2.6',
  },

  // Footer Links
  warrantyPolicy: {
    ar: 'سياسة الضمان',
    en: 'Warranty Policy',
  },
  termsOfUse: {
    ar: 'شروط الاستخدام',
    en: 'Terms of Use',
  },
  privacyPolicy: {
    ar: 'سياسة الخصوصية',
    en: 'Privacy Policy',
  },
  accessibilityStatement: {
    ar: 'بيان إمكانية الوصول',
    en: 'Accessibility Statement',
  },

  // Lifecycle
  lifecycleTitle: {
    ar: 'مسار دورة حياة المنتج المعتمدة',
    en: 'Certified Product Lifecycle Journey',
  },
  stageProduction: {
    ar: 'تم الإنتاج',
    en: 'Produced',
  },
  stageProductionSub: {
    ar: 'مطابق للمواصفات المعملية',
    en: 'Meets laboratory specifications',
  },
  stageQuality: {
    ar: 'فحص الجودة',
    en: 'Quality Inspection',
  },
  stageQualitySub: {
    ar: 'اجتياز اختبار الفحص والتحقق',
    en: 'Passed inspection and verification',
  },
  stageSale: {
    ar: 'تم البيع',
    en: 'Sold',
  },
  stageSaleSub: {
    ar: 'فاتورة معتمدة',
    en: 'Certified invoice',
  },
  stageDelivery: {
    ar: 'تم التسليم',
    en: 'Delivered',
  },
  stageDeliverySub: {
    ar: 'تم التسليم الفعلي للعميل',
    en: 'Delivered to customer',
  },
  stageActivated: {
    ar: 'تم تفعيل الضمان',
    en: 'Warranty Activated',
  },
  stageActivatedSub: {
    ar: 'الضمان ساري ونشط رسمياً',
    en: 'Warranty active & officially registered',
  },
  stagePending: {
    ar: 'بانتظار تفعيل الضمان',
    en: 'Pending Warranty Activation',
  },
  stagePendingSub: {
    ar: 'بانتظار تسجيل بيانات العميل والفاتورة',
    en: 'Awaiting customer & invoice registration',
  },
  stageExpired: {
    ar: 'انتهاء الضمان',
    en: 'Warranty Expired',
  },
  stageExpiredSub: {
    ar: 'انتهت فترة الضمان الرسمية',
    en: 'Official warranty period has ended',
  },
  stageReplaced: {
    ar: 'تم الاستبدال',
    en: 'Product Replaced',
  },
  stageReplacedSub: {
    ar: 'طلب استبدال معتمد',
    en: 'Approved replacement request',
  },
  stageMaintenance: {
    ar: 'قيد الصيانة الفنية',
    en: 'Under Maintenance',
  },
  stageMaintenanceSub: {
    ar: 'طلب صيانة معتمد',
    en: 'Certified maintenance ticket',
  },
  stageOwnershipTransfer: {
    ar: 'تم نقل الملكية',
    en: 'Ownership Transferred',
  },
  stageOwnershipTransferSub: {
    ar: 'سجل نقل الملكية المعتمد',
    en: 'Verified ownership transfer record',
  },
  stageRevoked: {
    ar: 'تم إلغاء الشهادة',
    en: 'Certificate Revoked',
  },
  stageRevokedSub: {
    ar: 'مخالفة الشروط والأحكام المعتمدة',
    en: 'Violation of certified terms & conditions',
  },
  stageBlacklisted: {
    ar: 'تم حظر المنتج',
    en: 'Product Blacklisted',
  },
  stageBlacklistedSub: {
    ar: 'تحقيق أمني أو ملاحظة جودة معتمدة',
    en: 'Security audit or quality restriction',
  },

  // Not Found Page
  notFoundTitle: {
    ar: 'الرقم التسلسلي غير موجود في المنظومة',
    en: 'Serial Number Not Found in System',
  },
  notFoundSubtitle: {
    ar: 'لم يتم العثور على أي منتج مسجل بالرقم المستعلم عنه. يرجى التأكد من كتابة الرقم بشكل صحيح أو التواصل مع الدعم الفني.',
    en: 'No product was found matching the entered query. Please verify the serial number or contact customer support.',
  },
  notFoundTip1: {
    ar: 'تأكد من إدخال جميع الأحرف والأرقام كما هي مدونة على بطاقة الضمان أو ملصق المرتبة.',
    en: 'Ensure all characters and numbers are entered exactly as shown on the warranty card or mattress tag.',
  },
  notFoundTip2: {
    ar: 'يمكنك استخدام مسح رمز QR بدلاً من إدخال الرقم يدوياً لتجنب الأخطاء.',
    en: 'You can scan the QR code directly instead of typing to prevent errors.',
  },
  notFoundTip3: {
    ar: 'في حال الشراء الحديث، قد يستغرق تسجيل المنتج في المنظومة حتى 24 ساعة.',
    en: 'For recent purchases, product registration may take up to 24 hours to appear.',
  },
};

/**
 * Returns translated string for a given key in specified language.
 */
export function t(key: string, lang: Language): string {
  if (translations[key] && translations[key][lang]) {
    return translations[key][lang];
  }
  return key;
}
