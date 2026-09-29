export const ar = {
  // Brand & Platform Identity (PROMPT-033-R1 SECTION 1)
  platform: {
    name: 'منظومة إدارة وتشغيل الضمان الإلكتروني',
    tagline: 'منظومة توثيق واعتماد الضمان الرقمي',
    brand: 'سليبي'
  },
  platformName: 'منظومة إدارة وتشغيل الضمان الإلكتروني',
  brandName: 'سليبي',
  tagline: 'منظومة توثيق واعتماد الضمان الرقمي',

  // Modules / Main Navigation (SECTION 3)
  nav: {
    systemAdmin: 'إدارة النظام',
    production: 'الإنتاج',
    warehouse: 'المخازن',
    sales: 'المبيعات',
    customerService: 'خدمة العملاء',
    reports: 'التقارير'
  },

  // System Administration Subtabs (SECTION 5)
  systemAdmin: {
    title: 'إدارة النظام',
    auditMonitoring: 'المتابعة والتدقيق',
    usersRoles: 'المستخدمون والصلاحيات',
    generalSettings: 'الإعدادات العامة',
    warrantyPolicies: 'سياسات الضمان',
    printSettings: 'إعدادات الطباعة'
  },

  // Users & Roles Governance (SECTION 7)
  usersGovernance: {
    title: 'مركز حوكمة المستخدمين والصلاحيات',
    subtitle: 'إدارة حسابات المستخدمين، مصفوفة الأدوار والصلاحيات، وسجلات النشاط والأقسام التنظيمية.',
    usersTab: 'المستخدمون',
    rolesTab: 'الأدوار والصلاحيات',
    departmentsTab: 'الأقسام التنظيمية',
    addUser: 'إضافة مستخدم جديد',
    editUser: 'تعديل بيانات المستخدم',
    resetPassword: 'إعادة تعيين كلمة المرور',
    suspendUser: 'تعطيل الحساب',
    reactivateUser: 'إعادة تفعيل الحساب',
    unlockUser: 'فك قفل الحساب',
    activityHistory: 'سجل نشاط المستخدم',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    role: 'الدور الوظيفي',
    department: 'القسم التنظيمي',
    status: 'الحالة',
    lastLogin: 'آخر تسجيل دخول',
    actions: 'الإجراءات'
  },

  // Printing & Label Designer (SECTION 8)
  printingGovernance: {
    title: 'مركز تصميم وحوكمة قوالب الطباعة',
    subtitle: 'إدارة مكتبة القوالب، محرر ZPL، ومصمم الباركود ورمز الاستجابة السريعة QR والمعاينة الحية.',
    queueTitle: 'إدارة مهام الطباعة',
    printerStatus: 'حالة الطابعات',
    labelPreview: 'معاينة الملصق',
    systemSettings: 'معايير النظام',
    templates: 'قوالب الملصقات',
    printers: 'الطابعات الصناعية',
    newTemplate: 'قالب جديد',
    cloneTemplate: 'استنساخ القالب',
    testPrint: 'طباعة تجريبية',
    versionHistory: 'سجل الإصدارات',
    approvalWorkflow: 'اعتماد القالب',
    auditTrail: 'سجل تدقيق القالب'
  },

  // Production Tabs (SECTION 4 & 5)
  production: {
    title: 'الإنتاج',
    structure: 'هيكل المنتجات',
    orders: 'أوامر الإنتاج',
    serials: 'التكويد والتسلسل',
    print: 'الطباعة',
    bom: 'ألبومات المواد BOM',
    audit: 'التدقيق الموحد',
    bomTitle: 'مركز وصفات وهندسة المواد'
  },

  // Admin Search Center (SECTION 2)
  adminSearch: {
    title: 'مركز البحث المؤسسي الموحد',
    subtitle: 'بحث فوري متعدد الوحدات: المنتجات، الموديلات، السيريالات، الضمانات، العملاء، المستخدمين، أوامر الإنتاج، وصفات BOM، وسجلات التدقيق',
    placeholder: 'ابحث بالكود، الاسم، السيريال، رقم الضمان، البريد الإلكتروني، أو العميل...',
    results: 'نتائج البحث المؤسسي',
    noResults: 'لا توجد نتائج مطابقة لمصطلح البحث',
    openModule: 'الانتقال للوحدة',
    types: {
      product: 'منتج',
      model: 'موديل',
      brand: 'علامة تجارية',
      serial: 'سيريال',
      warranty: 'شهادة ضمان',
      customer: 'عميل',
      order: 'أمر إنتاج',
      bom: 'وصفة مواد (BOM)',
      user: 'مستخدم',
      audit: 'سجل تدقيق',
      template: 'قالب طباعة'
    }
  },

  // Product Structure (SECTION 8)
  productStructure: {
    title: 'هيكل المنتجات وإدارة الأبعاد',
    subtitle: 'إدارة التسلسل الهيكلي القياسي وحوكمة الأبعاد الـ 39 المعتمدة لكل موديل.',
    treeExplorer: 'مستكشف الهيكل',
    productGrid: 'جدول المنتجات',
    totalDimensions: 'إجمالي المقاسات القياسية',
    usedDimensions: 'المستخدمة',
    unusedDimensions: 'غير المستخدمة',
    coverage: 'نسبة التغطية',
    addProduct: 'إضافة منتج جديد',
    bulkGenerate: 'إنشاء منتجات متعددة',
    exportCsv: 'تصدير CSV',
    rapidMode: 'الوضع السريع للإدخال',
    searchPlaceholder: 'بحث بالاسم، الكود، SAP، أو المشروع...',
    allBrands: 'جميع العلامات التجارية',
    allCategories: 'جميع الفئات',
    allTypes: 'جميع الأنواع',
    allStatuses: 'جميع الحالات',
    standardCatalog: 'الكتالوج القياسي',
    customProjects: 'مشاريع خاصة ومناقصات'
  },

  // Audit & Monitoring (SECTION 6)
  auditMonitoring: {
    title: 'المتابعة والتدقيق',
    sectionA: 'مؤشرات النظام التشغيلية الرئيسية',
    sectionB: 'سجل التدقيق والمتابعة غير القابل للتعديل',
    totalProducts: 'إجمالي المنتجات',
    totalOrders: 'إجمالي أوامر الإنتاج',
    totalSerials: 'إجمالي التسلسلات',
    totalWarranties: 'إجمالي شهادات الضمان',
    totalUsers: 'إجمالي المستخدمين',
    totalPolicies: 'إجمالي سياسات الضمان',
    logId: 'Log ID',
    action: 'نوع العملية',
    operator: 'المستخدم',
    dateTime: 'التاريخ والوقت',
    details: 'التفاصيل',
    searchLogs: 'بحث في السجل والعمليات...',
    filterAction: 'تصفية حسب نوع العملية',
    filterUser: 'تصفية حسب المستخدم',
    allActions: 'جميع العمليات',
    allUsers: 'جميع المستخدمين',
    exportCsv: 'تصدير CSV',
    eventsCount: 'حدث'
  },

  // Common Actions
  actions: {
    save: 'حفظ',
    saveAndNew: 'حفظ وإضافة جديد',
    cancel: 'إلغاء',
    create: 'إنشاء',
    edit: 'تعديل',
    delete: 'حذف',
    view: 'عرض',
    duplicate: 'نسخ وتكرار',
    toggleActive: 'تعطيل / تفعيل',
    resetPassword: 'إعادة تعيين كلمة المرور',
    exportCsv: 'تصدير CSV',
    bulkGenerate: 'إنشاء منتجات متعددة',
    addNewProduct: 'إضافة منتج جديد',
    addNewUser: 'إضافة مستخدم جديد',
    addNewPolicy: 'إنشاء سياسة جديدة',
    addNewPrinter: 'إضافة طابعة جديدة',
    newOrder: 'أمر إنتاج جديد',
    newBom: 'وصفة مواد جديدة (BOM)',
    testPrint: 'طباعة تجريبية',
    back: 'رجوع',
    close: 'إغلاق',
    refresh: 'تحديث'
  },

  // Statuses
  status: {
    active: 'نشط',
    inactive: 'معطل',
    draft: 'مسودة',
    inProduction: 'قيد الإنتاج',
    completed: 'مكتمل',
    approved: 'معتمد',
    cancelled: 'ملغي'
  }
};
