/**
 * SLEEPEE INDUSTRIAL PEP REGISTRIES
 * =================================
 * Single Source of Truth Registries for Product Families, Pocket Subtypes,
 * Manufacturing Operation Catalog, Compliance Packages, Quality Gates, and Plant Machines.
 */

export interface ProductFamilyDef {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  springType: 'Bonnell' | 'Pocket' | 'None' | 'Continuous';
  standardHeightRange: { min: number; max: number; default: number };
  defaultWarrantyYears: number;
}

export const ALLOWED_PRODUCT_FAMILIES: ProductFamilyDef[] = [
  {
    id: 'FAM-SPRING',
    code: 'SPRING',
    nameAr: 'مراتب سوست متصلة (بونيل)',
    nameEn: 'Spring Mattress',
    descriptionAr: 'شاسيه نوابض كربونية بونيل متصلة معالجة حرارياً ضد الهبوط والصدأ.',
    descriptionEn: 'Interconnected Bonnell coil spring system with perimeter steel border.',
    springType: 'Bonnell',
    standardHeightRange: { min: 20, max: 32, default: 25 },
    defaultWarrantyYears: 10
  },
  {
    id: 'FAM-POCKET',
    code: 'POCKET',
    nameAr: 'مراتب سوست منفصلة (بوكيت)',
    nameEn: 'Pocket Mattress',
    descriptionAr: 'شاسيه سوست جيبية معزولة في أكياس قماشية تمنع نقل الحركة وتعزز راحة العمود الفقري.',
    descriptionEn: 'Individually encased pocket spring coils for motion isolation and contouring support.',
    springType: 'Pocket',
    standardHeightRange: { min: 25, max: 36, default: 28 },
    defaultWarrantyYears: 10
  },
  {
    id: 'FAM-MEMORY',
    code: 'MEMORY',
    nameAr: 'مراتب ميموري فوم (رغوة الذاكرة)',
    nameEn: 'Memory Foam Mattress',
    descriptionAr: 'طبقات فوم ذكي لزج مرن عالي الكثافة يستجيب لحرارة الجسم ويوزع نقاط الضغط.',
    descriptionEn: 'High-density viscoelastic memory foam for pressure relief and ergonomic alignment.',
    springType: 'None',
    standardHeightRange: { min: 22, max: 32, default: 28 },
    defaultWarrantyYears: 10
  },
  {
    id: 'FAM-REBOUND',
    code: 'REBOUND',
    nameAr: 'مراتب ريبوند (طبي مضغوط)',
    nameEn: 'Rebound Mattress',
    descriptionAr: 'قلب إسفنجي مضغوط طبي فائق الكثافة (D80-D90) لدعم الظهر وتصحيح القوام.',
    descriptionEn: 'High-density compressed orthopaedic rebound foam core for firm spinal support.',
    springType: 'None',
    standardHeightRange: { min: 18, max: 30, default: 25 },
    defaultWarrantyYears: 7
  },
  {
    id: 'FAM-HOTEL',
    code: 'HOTEL',
    nameAr: 'مراتب فندقية (مشاريع وضيافة)',
    nameEn: 'Hotel Mattress',
    descriptionAr: 'مواصفات ضيافة عالمية معالجة ضد الاشتعال مع طبقات بيلو توب أو يورو توب فاخرة.',
    descriptionEn: 'Hospitality-grade mattress with flame-retardant treated fabrics and plush pillow top.',
    springType: 'Pocket',
    standardHeightRange: { min: 28, max: 38, default: 32 },
    defaultWarrantyYears: 10
  },
  {
    id: 'FAM-TENDER',
    code: 'TENDER',
    nameAr: 'مراتب تندر (مناقصات ومؤسسات)',
    nameEn: 'Tender Mattress',
    descriptionAr: 'مراتب معيارية مخصصة للمناقصات الحكومية والجامعات والقطاعات العسكرية والطبية.',
    descriptionEn: 'Institutional specification mattresses engineered for bulk institutional supply.',
    springType: 'Bonnell',
    standardHeightRange: { min: 18, max: 26, default: 22 },
    defaultWarrantyYears: 5
  }
];

export interface PocketSubtypeDef {
  id: string;
  nameAr: string;
  nameEn: string;
  wireGaugeMm: number;
  coilsPerM2: number;
  zones: number;
  firmnessRating: string;
  recommendedModels: string[];
}

export const POCKET_SUBTYPES: PocketSubtypeDef[] = [
  {
    id: 'SUB-ROMANCE',
    nameAr: 'رومانس (Romance)',
    nameEn: 'Romance Pocket',
    wireGaugeMm: 2.0,
    coilsPerM2: 260,
    zones: 5,
    firmnessRating: 'Medium Plush (H2)',
    recommendedModels: ['Romance', 'Mera', 'Delight']
  },
  {
    id: 'SUB-REGENCY',
    nameAr: 'ريجنسي (Regency)',
    nameEn: 'Regency Pocket',
    wireGaugeMm: 2.1,
    coilsPerM2: 275,
    zones: 7,
    firmnessRating: 'Medium Firm (H3)',
    recommendedModels: ['Regesty', 'Four Season', 'Lexis']
  },
  {
    id: 'SUB-ROYAL',
    nameAr: 'رويال بوكيت (Royal Pocket)',
    nameEn: 'Royal Pocket',
    wireGaugeMm: 2.2,
    coilsPerM2: 300,
    zones: 7,
    firmnessRating: 'Firm Luxury (H4)',
    recommendedModels: ['Gold', 'Infinity', 'Sleepee Top']
  },
  {
    id: 'SUB-ULTRA',
    nameAr: 'ألترا بوكيت (Ultra Pocket)',
    nameEn: 'Ultra Pocket',
    wireGaugeMm: 1.9,
    coilsPerM2: 330,
    zones: 9,
    firmnessRating: 'Adaptive Plush (H2)',
    recommendedModels: ['Tranquility', 'Sensational', 'Cooltech']
  },
  {
    id: 'SUB-EURO',
    nameAr: 'يورو بوكيت (Euro Pocket)',
    nameEn: 'Euro Pocket',
    wireGaugeMm: 2.0,
    coilsPerM2: 265,
    zones: 3,
    firmnessRating: 'Balanced Medium (H3)',
    recommendedModels: ['Comfort', 'Restcalm', 'Total Support']
  },
  {
    id: 'SUB-TWIN',
    nameAr: 'توين بوكيت (Twin Pocket)',
    nameEn: 'Twin Pocket (Dual Core)',
    wireGaugeMm: 2.1,
    coilsPerM2: 520,
    zones: 7,
    firmnessRating: 'Micro-Pocket Double Core',
    recommendedModels: ['Superstrong', 'Jumbo Plus']
  },
  {
    id: 'SUB-CONTINUOUS',
    nameAr: 'كونتينوس بوكيت (Continuous Pocket)',
    nameEn: 'Continuous Pocket',
    wireGaugeMm: 2.2,
    coilsPerM2: 280,
    zones: 1,
    firmnessRating: 'Heavy Duty Structural',
    recommendedModels: ['Kidstrong', 'Hotel Master']
  }
];

export interface ManufacturingOperationDef {
  operationCode: string;
  operationNameAr: string;
  operationNameEn: string;
  defaultMachineCode: string;
  defaultMachineNameAr: string;
  workCenterCode: string;
  setupTimeMin: number;
  runTimeMin: number;
  laborRequired: number;
  machineCount: number;
  qualityGateCode: string;
  qualityGateNameAr: string;
  standardCostPerUnit: number;
  category: 'Preparation' | 'Assembly' | 'Finishing' | 'Quality & Pack';
}

export const MANUFACTURING_OPERATION_CATALOG: ManufacturingOperationDef[] = [
  {
    operationCode: 'CUT-001',
    operationNameAr: 'قص القماش والتطريز',
    operationNameEn: 'Fabric Cutting & Quilting Prep',
    defaultMachineCode: 'CNC-TEX-01',
    defaultMachineNameAr: 'ماكينة قص الأقمشة الآلية CNC',
    workCenterCode: 'WC-CUT-FAB',
    setupTimeMin: 10,
    runTimeMin: 12,
    laborRequired: 1,
    machineCount: 1,
    qualityGateCode: 'QG-TEX-01',
    qualityGateNameAr: 'فحص استقامة الأنسجة ونقاء القماش',
    standardCostPerUnit: 25,
    category: 'Preparation'
  },
  {
    operationCode: 'FOAM-001',
    operationNameAr: 'قص الفوم والإسفنج CNC',
    operationNameEn: 'CNC Foam Block Profiling & Slicing',
    defaultMachineCode: 'CNC-CUT-01',
    defaultMachineNameAr: 'ماكينة قص الإسفنج الرأسي المحوسبة CNC',
    workCenterCode: 'WC-CUT-FOM',
    setupTimeMin: 10,
    runTimeMin: 15,
    laborRequired: 2,
    machineCount: 1,
    qualityGateCode: 'QG-DIM-01',
    qualityGateNameAr: 'فحص مطابقة الأبعاد والسمك والكثافة',
    standardCostPerUnit: 35,
    category: 'Preparation'
  },
  {
    operationCode: 'SPRING-001',
    operationNameAr: 'تجميع الشاسيه البونيل',
    operationNameEn: 'Bonnell Spring Core Interconnection',
    defaultMachineCode: 'SPR-BON-01',
    defaultMachineNameAr: 'ماكينة تجميع شاسيه السوست المتصلة البونيل',
    workCenterCode: 'WC-SPR-BON',
    setupTimeMin: 15,
    runTimeMin: 20,
    laborRequired: 2,
    machineCount: 1,
    qualityGateCode: 'QG-SPR-01',
    qualityGateNameAr: 'فحص ثبات النوابض واستقامة إطار الصلب المحيطي',
    standardCostPerUnit: 50,
    category: 'Assembly'
  },
  {
    operationCode: 'PKT-001',
    operationNameAr: 'تجميع البوكيت والسوست المنفصلة',
    operationNameEn: 'Pocket Spring Core Welding & Arraying',
    defaultMachineCode: 'SPR-01',
    defaultMachineNameAr: 'ماكينة لف وتجميع السوست الجيبية الآلية',
    workCenterCode: 'WC-SPR-PKT',
    setupTimeMin: 15,
    runTimeMin: 22,
    laborRequired: 2,
    machineCount: 1,
    qualityGateCode: 'QG-SPR-02',
    qualityGateNameAr: 'فحص قوة اللحام الحراري للجيوب وعزل الحركة',
    standardCostPerUnit: 60,
    category: 'Assembly'
  },
  {
    operationCode: 'FELT-001',
    operationNameAr: 'إضافة اللباد والعوازل الحرارية',
    operationNameEn: 'Felt Insulator Bonding & Fastening',
    defaultMachineCode: 'FELT-PNEU-01',
    defaultMachineNameAr: 'مكبس تدبيس وتثبيت اللباد الهوائي',
    workCenterCode: 'WC-ASSY-FLT',
    setupTimeMin: 5,
    runTimeMin: 10,
    laborRequired: 1,
    machineCount: 1,
    qualityGateCode: 'QG-FLT-01',
    qualityGateNameAr: 'فحص شد واستواء اللباد وتغطية أطراف الشاسيه',
    standardCostPerUnit: 20,
    category: 'Assembly'
  },
  {
    operationCode: 'QUILT-001',
    operationNameAr: 'التبطين والتطريز الفندقي',
    operationNameEn: 'Multi-Needle Pattern Quilting',
    defaultMachineCode: 'QUILT-01',
    defaultMachineNameAr: 'ماكينة تطريز وكبتنة هيدروليكية متعددة الإبر',
    workCenterCode: 'WC-QUILT',
    setupTimeMin: 20,
    runTimeMin: 25,
    laborRequired: 2,
    machineCount: 1,
    qualityGateCode: 'QG-QUILT-01',
    qualityGateNameAr: 'فحص تماثل الغرز وتناسق الفايبر والإسفنج المبطن',
    standardCostPerUnit: 45,
    category: 'Preparation'
  },
  {
    operationCode: 'SEW-001',
    operationNameAr: 'الخياطة وتجهيز شريط الداير',
    operationNameEn: 'Border Sewing & Vent Flange Attachment',
    defaultMachineCode: 'BORDER-01',
    defaultMachineNameAr: 'ماكينة حياكة وتجهيز الداير وأحزمة التهوية',
    workCenterCode: 'WC-SEW-BRD',
    setupTimeMin: 10,
    runTimeMin: 15,
    laborRequired: 1,
    machineCount: 1,
    qualityGateCode: 'QG-SEW-01',
    qualityGateNameAr: 'فحص متانة أشرطة الحمل ومخارج التهوية',
    standardCostPerUnit: 30,
    category: 'Finishing'
  },
  {
    operationCode: 'ASMB-001',
    operationNameAr: 'التقفيل النهائي (Tape Edge)',
    operationNameEn: 'Final Tape Edge Encasement Closing',
    defaultMachineCode: 'TAPE-01',
    defaultMachineNameAr: 'ماكينة تقفيل شريط الحياكة المداري Tape Edge',
    workCenterCode: 'WC-TAPE-EDG',
    setupTimeMin: 5,
    runTimeMin: 18,
    laborRequired: 1,
    machineCount: 1,
    qualityGateCode: 'QG-TAPE-03',
    qualityGateNameAr: 'فحص استقامة خط التقفيل وكثافة الغرز (4 غرز/سم)',
    standardCostPerUnit: 40,
    category: 'Finishing'
  },
  {
    operationCode: 'QC-001',
    operationNameAr: 'الفحص وضبط الجودة الشاملة',
    operationNameEn: 'Final QC & Dimension Certification',
    defaultMachineCode: 'QC-STATION-01',
    defaultMachineNameAr: 'منصة الفحص بالليزر والوزن الإلكتروني',
    workCenterCode: 'WC-QC-AUD',
    setupTimeMin: 5,
    runTimeMin: 8,
    laborRequired: 1,
    machineCount: 1,
    qualityGateCode: 'QG-FINAL-04',
    qualityGateNameAr: 'المطابقة الشاملة للوزن والأبعاد والأداء الإرجونومي',
    standardCostPerUnit: 15,
    category: 'Quality & Pack'
  },
  {
    operationCode: 'PACK-001',
    operationNameAr: 'التغليف وتثبيت ملصق الضمان الرقمي',
    operationNameEn: 'Vacuum Shrink Wrapping & Digital Passport Labeling',
    defaultMachineCode: 'QC-PACK-01',
    defaultMachineNameAr: 'محطة الفحص الآلي وضغط التغليف بالفاكيوم',
    workCenterCode: 'WC-PACK-FIN',
    setupTimeMin: 5,
    runTimeMin: 10,
    laborRequired: 2,
    machineCount: 1,
    qualityGateCode: 'QG-LBL-01',
    qualityGateNameAr: 'فحص سلامة باركود الضمان الرقمي وتغليف الحماية',
    standardCostPerUnit: 30,
    category: 'Quality & Pack'
  },
  {
    operationCode: 'LOAD-001',
    operationNameAr: 'التحميل والمناولة للمستودع',
    operationNameEn: 'Warehouse Staging & Dispatch Loading',
    defaultMachineCode: 'FORK-DISPATCH-01',
    defaultMachineNameAr: 'رافعة شوكية كهربائية ومنصة التحميل الآلي',
    workCenterCode: 'WC-LOAD-LOG',
    setupTimeMin: 5,
    runTimeMin: 5,
    laborRequired: 2,
    machineCount: 1,
    qualityGateCode: 'QG-LOG-01',
    qualityGateNameAr: 'فحص كود التخصيص وسلامة الشحنة قبل الإرسال',
    standardCostPerUnit: 15,
    category: 'Quality & Pack'
  }
];

export interface CompliancePackageDef {
  id: string;
  nameAr: string;
  nameEn: string;
  standardAuthority: string;
  flammabilityClass: string;
  sagToleranceLimitPct: number;
  hygieneStandard: string;
  mandatoryCertificates: string[];
  testProtocol: string;
  descriptionAr: string;
}

export const COMPLIANCE_PACKAGES: CompliancePackageDef[] = [
  {
    id: 'PKG-EGYPT-EOS',
    nameAr: 'المواصفة القياسية المصرية (Egypt Standard - EOS 1904)',
    nameEn: 'Egyptian Standard Specification (EOS 1904)',
    standardAuthority: 'الهيئة المصرية العامة للمواصفات والجودة (EOS)',
    flammabilityClass: 'EOS-FR Level 1 (مقاومة احتراق منزلي معتمدة)',
    sagToleranceLimitPct: 12,
    hygieneStandard: 'خلو تام من الألياف المعاد تدويرها مجهولة المصدر',
    mandatoryCertificates: ['EOS 1904:2023', 'ISO 9001:2015', 'OEKO-TEX Standard 100'],
    testProtocol: 'اختبار دحرجة أسطوانة كورنيل 25,000 دورة + اختبار الشد الميكانيكي للنوابض',
    descriptionAr: 'المطابقة الإلزامية للمواصفات القياسية المصرية لمراتب السوست والإسفنج للاستهلاك المحلي والمشروعات السكنية.'
  },
  {
    id: 'PKG-GCC-SASO',
    nameAr: 'المواصفة الخليجية والسعودية (GCC / SASO 2623)',
    nameEn: 'GCC / Saudi SASO Standard (SASO 2623)',
    standardAuthority: 'الهيئة السعودية للمواصفات والمقاييس والجودة (SASO)',
    flammabilityClass: 'SASO 2623 / 2624 Flammability Class B',
    sagToleranceLimitPct: 10,
    hygieneStandard: 'شهادة صابر SABER + خلو الرغوة من المركبات العضوية المتطايرة VOC',
    mandatoryCertificates: ['SASO 2623:2024', 'SASO 2624', 'CertiPUR-US®', 'ISO 9001:2015'],
    testProtocol: 'اختبار الهيدروليك الديناميكي 30,000 دورة مع قياس معامل الفقد في الارتفاع أقل من 8 مم',
    descriptionAr: 'الاعتماد الكامل لمنظومة سابر الخليجية واشتراطات الجودة الإلزامية لأسواق المملكة ودول مجلس التعاون.'
  },
  {
    id: 'PKG-EXPORT-EU',
    nameAr: 'معايير التصدير للاتحاد الأوروبي (Export EU - EN 1957 & CE)',
    nameEn: 'European Union Export Standard (EN 1957 & REACH)',
    standardAuthority: 'European Committee for Standardization (CEN)',
    flammabilityClass: 'BS EN 597-1 & 597-2 (Smouldering Cigarette & Match Flame)',
    sagToleranceLimitPct: 8,
    hygieneStandard: 'REACH Compliant (خلو تام من 233 مادة كيميائية مقيدة)',
    mandatoryCertificates: ['EN 1957:2012', 'OEKO-TEX Standard 100 Class 1', 'CE Mark', 'LGA Ergonomics'],
    testProtocol: 'اختبار المتانة السداسي الأوروبي Hexagonal Drum Test 30,000 دورة + تحليل الانبعاثات الحيوية',
    descriptionAr: 'حزمة التصدير المطابقة للاشتراطات البيئية والتنظيمية الصارمة للاتحاد الأوروبي ودول شنغن.'
  },
  {
    id: 'PKG-EXPORT-USA',
    nameAr: 'معايير 16 CFR 1633 الأمريكية (Export USA)',
    nameEn: 'US Federal Standard (16 CFR Part 1633 & TB 117)',
    standardAuthority: 'Consumer Product Safety Commission (CPSC)',
    flammabilityClass: '16 CFR Part 1633 Dual Flame Open Test (Peak Heat < 200 kW)',
    sagToleranceLimitPct: 10,
    hygieneStandard: 'CertiPUR-US® Certified Foam + Law Tag Registration',
    mandatoryCertificates: ['16 CFR 1633', '16 CFR 1632', 'California TB 117-2013', 'CertiPUR-US®'],
    testProtocol: 'اختبار الاحتراق الكامل بالمشاعل المزدوجة لمدة 30 دقيقة مع تسجيل انبعاث الطاقة الحرارية',
    descriptionAr: 'حزمة الامتثال الفيدرالية الأمريكية لمقاومة اللهب المباشر والتوريد لأسواق أمريكا الشمالية.'
  },
  {
    id: 'PKG-HOTEL-CRIB5',
    nameAr: 'حزمة الفنادق والضيافة المقاومة للحريق (Hotel Package - BS 7177 Crib 5)',
    nameEn: 'Hospitality Contract Package (BS 7177 Crib 5)',
    standardAuthority: 'British Standards Institution (BSI) & Hospitality Consortium',
    flammabilityClass: 'BS 7177 Medium Hazard (Crib 5 Wood Crib Test)',
    sagToleranceLimitPct: 8,
    hygieneStandard: 'معالجة نانوية مضادة للبكتيريا وحشرات الفراش وعث الغبار (Sanitized®)',
    mandatoryCertificates: ['BS 7177:2008 Crib 5', 'ISO 9001', 'OEKO-TEX Antimicrobial'],
    testProtocol: 'اختبار الهرم الخشبي المحترق المباشر + اختبار الاستدامة الفندقية الشاقة 45,000 دورة',
    descriptionAr: 'حزمة المشاريع الفندقية العالمية وسلاسل الضيافة 5 نجوم مع ضمان شامل مشدد ضد الحريق والتلف.'
  },
  {
    id: 'PKG-MEDICAL-HOSPITAL',
    nameAr: 'حزمة المستشفيات والتعقيم الطبي (Medical & Healthcare Package)',
    nameEn: 'Healthcare & Hospital Grade Package',
    standardAuthority: 'Healthcare Equipment & Medical Standards Agency',
    flammabilityClass: 'BS 7177 Medium Hazard + Fluid Resistant Wipeable Surface',
    sagToleranceLimitPct: 6,
    hygieneStandard: 'غطاء بولي يوريثان طبي غير منفذ للسوائل قابل للتعقيم الكيميائي ومضاد للتقرحات',
    mandatoryCertificates: ['ISO 13485 (Medical Quality)', 'Biocompatibility ISO 10993', 'BS 7177'],
    testProtocol: 'اختبار توزيع الضغط الهيدروستاتيكي لمنع قرح الفراش واختبار مقاومة المطهرات الكيميائية',
    descriptionAr: 'حزمة الرعاية الصحية والمستشفيات مع عزل هيدروستاتيكي وتوزيع متوازن لضغط الأنسجة.'
  },
  {
    id: 'PKG-CUSTOM-PROJECT',
    nameAr: 'حزمة مخصصة للمشاريع والمناقصات (Custom Project Package)',
    nameEn: 'Custom Tailored Project Engineering Package',
    standardAuthority: 'Client Engineering Consultant & Sleepee Technical Bureau',
    flammabilityClass: 'حسب كراسة الشروط والمواصفات الفنية للعميل',
    sagToleranceLimitPct: 10,
    hygieneStandard: 'معالجة مخصصة وفق المواصفات المعتمدة من الاستشاري الهندسي',
    mandatoryCertificates: ['ISO 9001:2015', 'Certificate of Origin', 'Factory Audit Sheet'],
    testProtocol: 'اختبارات عينات اعتماد ما قبل التوريد المعتمدة من المختبر الهندسي المستقل',
    descriptionAr: 'تصميم هندسي مرن يتوافق مع دفاتر الشروط والمواصفات الخاصة بالمطورين العقاريين والمناقصات.'
  }
];

export interface CertificationRegistryItem {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  authority: string;
  category: 'Safety' | 'Quality' | 'Flammability' | 'Ergonomics' | 'Environmental';
  standardDocument: string;
  renewalPeriodYears: number;
  descriptionAr: string;
  mandatoryForHospitality: boolean;
  mandatoryForRetail: boolean;
}

export const CERTIFICATION_REGISTRY: CertificationRegistryItem[] = [
  {
    id: 'CERT-EOS-1904',
    code: 'EOS 1904:2023',
    nameAr: 'المواصفة القياسية المصرية لمراتب النوابض',
    nameEn: 'Egyptian Standard for Spring Mattresses',
    authority: 'الهيئة المصرية العامة للمواصفات والجودة',
    category: 'Quality',
    standardDocument: 'EOS-STD-1904-REV2',
    renewalPeriodYears: 3,
    descriptionAr: 'اشتراطات جودة الصلب الكربوني وقوة الشد وخلو الإسفنج من الملوثات.',
    mandatoryForHospitality: true,
    mandatoryForRetail: true
  },
  {
    id: 'CERT-SASO-2623',
    code: 'SASO 2623:2024',
    nameAr: 'المواصفة القياسية السعودية لمراتب النوابض',
    nameEn: 'SASO Standard for Spring Mattresses',
    authority: 'الهيئة السعودية للمواصفات والمقاييس والجودة (SASO)',
    category: 'Quality',
    standardDocument: 'SASO-STD-2623-REV4',
    renewalPeriodYears: 3,
    descriptionAr: 'اشتراطات المتانة الهيدروليكية وثبات السوست ومقاومة التمزق والانضغاط المتكرر 30,000 دورة.',
    mandatoryForHospitality: true,
    mandatoryForRetail: true
  },
  {
    id: 'CERT-ISO-9001',
    code: 'ISO 9001:2015',
    nameAr: 'شهادة نظام إدارة الجودة الشاملة',
    nameEn: 'Quality Management Systems Standard',
    authority: 'International Organization for Standardization (ISO)',
    category: 'Quality',
    standardDocument: 'ISO-QMS-9001-KSA',
    renewalPeriodYears: 3,
    descriptionAr: 'حوكمة وتدقيق مسارات التشغيل وسلامة سلسلة التوريد والتتبع التسلسلي التام.',
    mandatoryForHospitality: true,
    mandatoryForRetail: true
  },
  {
    id: 'CERT-BS-7177',
    code: 'BS 7177 Crib 5',
    nameAr: 'معيار مقاومة الاشتعال البريطاني الفندقي',
    nameEn: 'British Fire Retardancy Medium Hazard Standard',
    authority: 'British Standards Institution (BSI)',
    category: 'Flammability',
    standardDocument: 'BSI-BS-7177-MED',
    renewalPeriodYears: 2,
    descriptionAr: 'معالجة نسيج مقاومة للحريق واللهب المباشر للمشاريع الفندقية والتوريد الحكومي.',
    mandatoryForHospitality: true,
    mandatoryForRetail: false
  },
  {
    id: 'CERT-CFR-1633',
    code: '16 CFR Part 1633',
    nameAr: 'المعيار الفيدرالي لمقاومة اللهب المفتوح',
    nameEn: 'US Federal Open Flame Ignition Resistance',
    authority: 'Consumer Product Safety Commission (CPSC)',
    category: 'Flammability',
    standardDocument: 'CPSC-16-CFR-1633',
    renewalPeriodYears: 2,
    descriptionAr: 'اختبار الاشتعال الكلي للشعلة المزدوجة واحتواء انبعاث الحرارة أقل من 200kW.',
    mandatoryForHospitality: true,
    mandatoryForRetail: false
  },
  {
    id: 'CERT-OEKO-100',
    code: 'OEKO-TEX Standard 100',
    nameAr: 'شهادة النسيج الآمن بيئياً وخلو المواد الضارة',
    nameEn: 'Confidence in Textiles - Harmful Substances Free',
    authority: 'OEKO-TEX Association',
    category: 'Environmental',
    standardDocument: 'OEKO-100-CLASS-1',
    renewalPeriodYears: 1,
    descriptionAr: 'خلو كافة الأقمشة والخيوط من الفورمالديهايد والمواد المسرطنة ومناسبتها للبشرة الحساسة.',
    mandatoryForHospitality: true,
    mandatoryForRetail: true
  },
  {
    id: 'CERT-CERTIPUR',
    code: 'CertiPUR-US®',
    nameAr: 'شهادة سلامة رغوة البولي يوريثان المعتمدة',
    nameEn: 'Certified Polyurethane Foam Safety',
    authority: 'Alliance for Flexible Polyurethane Foam',
    category: 'Safety',
    standardDocument: 'CERTIPUR-FOAM-SPEC',
    renewalPeriodYears: 2,
    descriptionAr: 'خلو الإسفنج من مثبطات اللهب الضارة والمعادن الثقيلة ومستويات منخفضة جداً من المركبات العضوية المتطايرة (VOC).',
    mandatoryForHospitality: true,
    mandatoryForRetail: true
  }
];

export interface PlantMachineItem {
  id: string;
  machineCode: string;
  machineNameAr: string;
  machineNameEn: string;
  plantId: string;
  lineCode: string;
  lineNameAr: string;
  machineGroup: 'Cutting' | 'Spring Core' | 'Quilting' | 'Border & Edging' | 'Assembly' | 'Packaging & QC';
  ratedSpeedUnitsPerHour: number;
  operatorRequired: number;
  maintenanceCycleDays: number;
  status: 'Operational' | 'Maintenance' | 'Standby';
}

export const PLANT_MACHINES_REGISTRY: PlantMachineItem[] = [
  {
    id: 'MCH-CNC-01',
    machineCode: 'CNC-CUT-01',
    machineNameAr: 'ماكينة قص الإسفنج الرأسي المحوسبة CNC',
    machineNameEn: 'Computerized CNC Vertical Foam Cutting Machine',
    plantId: 'PLANT-KSA-01',
    lineCode: 'LINE-01-FOAM',
    lineNameAr: 'خط تفصيل وقص الفوم (Line 01)',
    machineGroup: 'Cutting',
    ratedSpeedUnitsPerHour: 35,
    operatorRequired: 2,
    maintenanceCycleDays: 30,
    status: 'Operational'
  },
  {
    id: 'MCH-SPR-01',
    machineCode: 'SPR-01',
    machineNameAr: 'ماكينة لف وتجميع السوست الجيبية الآلية',
    machineNameEn: 'Automated Pocket Coil Spring Machine',
    plantId: 'PLANT-KSA-01',
    lineCode: 'LINE-02-SPRING',
    lineNameAr: 'خط تشكيل وتجميع شاسيه النوابض (Line 02)',
    machineGroup: 'Spring Core',
    ratedSpeedUnitsPerHour: 22,
    operatorRequired: 2,
    maintenanceCycleDays: 14,
    status: 'Operational'
  },
  {
    id: 'MCH-QUILT-01',
    machineCode: 'QUILT-01',
    machineNameAr: 'ماكينة تطريز وكبتنة هيدروليكية متعددة الإبر',
    machineNameEn: 'Multi-Needle Computerized Quilting Machine',
    plantId: 'PLANT-KSA-01',
    lineCode: 'LINE-03-QUILT',
    lineNameAr: 'خط الكبتنة والتطريز الفندقي (Line 03)',
    machineGroup: 'Quilting',
    ratedSpeedUnitsPerHour: 18,
    operatorRequired: 2,
    maintenanceCycleDays: 15,
    status: 'Operational'
  },
  {
    id: 'MCH-BORDER-01',
    machineCode: 'BORDER-01',
    machineNameAr: 'ماكينة حياكة وتجهيز الداير وأحزمة التهوية',
    machineNameEn: 'Automatic Mattress Border Sewing Machine',
    plantId: 'PLANT-KSA-01',
    lineCode: 'LINE-04-BORDER',
    lineNameAr: 'خط تجهيز وتشطيب الداير (Line 04)',
    machineGroup: 'Border & Edging',
    ratedSpeedUnitsPerHour: 28,
    operatorRequired: 1,
    maintenanceCycleDays: 30,
    status: 'Operational'
  },
  {
    id: 'MCH-TAPE-01',
    machineCode: 'TAPE-01',
    machineNameAr: 'ماكينة تقفيل شريط الحياكة المداري Tape Edge',
    machineNameEn: 'Automatic Heavy-Duty Tape Edge Machine',
    plantId: 'PLANT-KSA-01',
    lineCode: 'LINE-05-TAPE',
    lineNameAr: 'خط التجميع والتقفيل النهائي (Line 05)',
    machineGroup: 'Assembly',
    ratedSpeedUnitsPerHour: 20,
    operatorRequired: 1,
    maintenanceCycleDays: 7,
    status: 'Operational'
  },
  {
    id: 'MCH-PACK-01',
    machineCode: 'QC-PACK-01',
    machineNameAr: 'محطة الفحص الآلي وضغط التغليف بالفاكيوم',
    machineNameEn: 'Automated Inspection & Vacuum Compression Packaging Line',
    plantId: 'PLANT-KSA-01',
    lineCode: 'LINE-06-PACK',
    lineNameAr: 'خط الفحص النهائي والتعبئة (Line 06)',
    machineGroup: 'Packaging & QC',
    ratedSpeedUnitsPerHour: 40,
    operatorRequired: 2,
    maintenanceCycleDays: 30,
    status: 'Operational'
  }
];

export interface QualityGateRule {
  id: string;
  gateCode: string;
  nameAr: string;
  nameEn: string;
  checkpoint: string;
  toleranceThreshold: string;
  measurementTool: string;
  mandatoryPass: boolean;
  standardReference: string;
}

export const QUALITY_GATES_REGISTRY: QualityGateRule[] = [
  {
    id: 'QG-01',
    gateCode: 'QG-DIM-01',
    nameAr: 'فحص مطابقة الأبعاد والسمك المعياري',
    nameEn: 'Dimensional & Height Tolerance Gate',
    checkpoint: 'نقطة تفصيل الإسفنج بعد القص CNC',
    toleranceThreshold: 'تفاوت أقصى: ±0.5 سم في الطول/العرض، ±0.3 سم في الارتفاع',
    measurementTool: 'مسطرة ليزرية رقمية معتمدة',
    mandatoryPass: true,
    standardReference: 'SASO 2623 / EOS 1904'
  },
  {
    id: 'QG-02',
    gateCode: 'QG-SPR-02',
    nameAr: 'فحص ارتداد وعزل شاسيه النوابض',
    nameEn: 'Spring Core Resilience & Bond Gate',
    checkpoint: 'مخرج ماكينة تجميع النوابض SPR-01',
    toleranceThreshold: 'عدم وجود سوسة مائلة، شدة ربط حراري للجيوب > 18N',
    measurementTool: 'جهاز قياس قوة الشد الديناميكي',
    mandatoryPass: true,
    standardReference: 'ISO 9001 QCP-04'
  },
  {
    id: 'QG-03',
    gateCode: 'QG-TAPE-03',
    nameAr: 'فحص استقامة شريط الحياكة المداري Tape Edge',
    nameEn: 'Tape Edge Seam Integrity Gate',
    checkpoint: 'ماكينة التقفيل النهائي TAPE-01',
    toleranceThreshold: 'غرز منتظمة بكثافة 4 غرز/سم، خلو تام من التعرجات',
    measurementTool: 'فحص بصري مجهري ومعايرة شد الغرز',
    mandatoryPass: true,
    standardReference: 'SASO 2623 Clause 5.1'
  },
  {
    id: 'QG-04',
    gateCode: 'QG-FINAL-04',
    nameAr: 'الفحص النهائي والوزن وتطبيق ملصق الضمان الرقمي',
    nameEn: 'Final Out-of-Box & Serial Passport Gate',
    checkpoint: 'محطة التغليف QC-PACK-01',
    toleranceThreshold: 'تطابق الوزن الكلي ±2%، قراءة باركود وسيريال الضمان 100%',
    measurementTool: 'ميزان إلكتروني صناعي + قارئ باركود 2D',
    mandatoryPass: true,
    standardReference: 'Sleepee Warranty SOP-09'
  }
];

export class PepRegistries {
  public static getAllFamilies(): ProductFamilyDef[] {
    return ALLOWED_PRODUCT_FAMILIES;
  }

  public static getFamilyById(id: string): ProductFamilyDef | undefined {
    return ALLOWED_PRODUCT_FAMILIES.find(f => f.id === id || f.code === id);
  }

  public static getAllPocketSubtypes(): PocketSubtypeDef[] {
    return POCKET_SUBTYPES;
  }

  public static getAllOperations(): ManufacturingOperationDef[] {
    return MANUFACTURING_OPERATION_CATALOG;
  }

  public static getOperationByCode(code: string): ManufacturingOperationDef | undefined {
    return MANUFACTURING_OPERATION_CATALOG.find(op => op.operationCode === code);
  }

  public static getAllCompliancePackages(): CompliancePackageDef[] {
    return COMPLIANCE_PACKAGES;
  }

  public static getCompliancePackageById(id: string): CompliancePackageDef | undefined {
    return COMPLIANCE_PACKAGES.find(p => p.id === id);
  }

  public static getAllCertifications(): CertificationRegistryItem[] {
    return CERTIFICATION_REGISTRY;
  }

  public static getAllMachines(): PlantMachineItem[] {
    return PLANT_MACHINES_REGISTRY;
  }

  public static getMachinesForPlant(plantId: string): PlantMachineItem[] {
    return PLANT_MACHINES_REGISTRY.filter(m => m.plantId === plantId || plantId.includes('KSA'));
  }

  public static getAllQualityGates(): QualityGateRule[] {
    return QUALITY_GATES_REGISTRY;
  }
}
