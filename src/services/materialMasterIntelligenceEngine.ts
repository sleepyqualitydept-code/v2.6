/**
 * SLEEPEE MATERIAL MASTER INTELLIGENCE ENGINE
 * ===========================================
 * Industrial Grade Material Knowledge Base & Engineering Intelligence.
 * 100% Internal Knowledge System - Zero External AI Cost ($0/month).
 */

export interface MaterialIntelligenceItem {
  materialCode: string;
  nameAr: string;
  nameEn: string;
  materialCategory: 
    | 'Pocket Spring'
    | 'Bonnell Spring'
    | 'Micro Pocket'
    | 'HR Foam'
    | 'Memory Foam'
    | 'Gel Memory'
    | 'Latex'
    | 'Rebonded Foam'
    | 'Felt'
    | 'Cotton Felt'
    | 'Fiber'
    | 'Fabric'
    | 'Edge Support Foam'
    | 'Adhesive'
    | 'Packaging';
  density: number; // kg/m³, 0 for springs/adhesives/packaging
  firmness: 'Ultra Soft' | 'Soft' | 'Medium Soft' | 'Medium' | 'Medium Firm' | 'Firm' | 'Extra Firm' | 'Rigid Core' | 'N/A';
  compressionRating: 'Roll-Pack Certified (100% Recovery)' | 'High Compression Safe' | 'Standard Compression' | 'Flat-Pack Only (No Roll-Pack)';
  thermalRating: 'High Heat Dissipation (Cooling)' | 'Neutral Breathable' | 'Thermal Insulator (Heat Retentive)' | 'N/A';
  durabilityRating: number; // 0 - 100 score
  warrantyRating: number; // Max safe warranty years supported (e.g. 5, 7, 10, 15)
  unitCostSar: number; // SAR per standard unit (m², kg, or roll)
  supplier: string;
  supplierCode: string;
  alternativeMaterials: string[]; // Material Codes of direct drop-in alternatives
  recommendedApplications: string[];
  restrictedApplications: string[];
  qualityGrade: 'A+ (Medical/Hospitality)' | 'A (Premium Commercial)' | 'B (Standard Commercial)' | 'C (Economic Grade)';
  specNotesAr: string;
}

export const SLEEPEE_MATERIAL_LIBRARY: Record<string, MaterialIntelligenceItem> = {
  'SP-PCK-200': {
    materialCode: 'SP-PCK-200',
    nameAr: 'شاسيه سوست جيبية منفصلة 2.0 مم',
    nameEn: 'Pocket Spring Core (2.0mm Wire - 260 coils/m²)',
    materialCategory: 'Pocket Spring',
    density: 0,
    firmness: 'Medium Firm',
    compressionRating: 'Roll-Pack Certified (100% Recovery)',
    thermalRating: 'Neutral Breathable',
    durabilityRating: 95,
    warrantyRating: 10,
    unitCostSar: 110,
    supplier: 'مصنع سليب إي للهندسة المعدنية (Sleepee Springs Division)',
    supplierCode: 'SUP-SLP-SP01',
    alternativeMaterials: ['SP-MIC-650', 'SP-DUAL-800'],
    recommendedApplications: ['مراتب الفنادق 5 نجوم', 'المراتب الزوجية الفاخرة', 'عزل الحركة التام', 'شحن التصدير المضغوط Roll-Pack'],
    restrictedApplications: ['الاستخدام المباشر دون لباد عازل', 'الأسرة الطبية المفصلية حادة الانحناء'],
    qualityGrade: 'A+ (Medical/Hospitality)',
    specNotesAr: 'شاسيه سوست جيبية معالجة كربونياً حرارياً ومغلفة بأقمشة غير منسوجة معزولة بالصوت وتمنع انتقال الاهتزاز.'
  },
  'SP-MIC-650': {
    materialCode: 'SP-MIC-650',
    nameAr: 'سوست مايكرو بوكيت الطبية فائقة الكثافة',
    nameEn: 'Medical Micro Pocket Core (1.3mm Wire - 650 coils/m²)',
    materialCategory: 'Micro Pocket',
    density: 0,
    firmness: 'Medium',
    compressionRating: 'Roll-Pack Certified (100% Recovery)',
    thermalRating: 'Neutral Breathable',
    durabilityRating: 98,
    warrantyRating: 15,
    unitCostSar: 145,
    supplier: 'الشريك الألماني للسوست الطبية (German Precision Springs)',
    supplierCode: 'SUP-GER-SP02',
    alternativeMaterials: ['SP-PCK-200'],
    recommendedApplications: ['مراتب التقويم الطبي', 'المراتب الفندقية الرئاسية', 'تخفيف ضغط الفقرات الدقيق'],
    restrictedApplications: ['المراتب الاقتصادية منخفضة الميزانية'],
    qualityGrade: 'A+ (Medical/Hospitality)',
    specNotesAr: 'أكثر من 650 سستة مستقلة بالمتر المربع تضمن التكيف الفوري مع أدق تفاصيل العمود الفقري.'
  },
  'SP-BON-220': {
    materialCode: 'SP-BON-220',
    nameAr: 'شاسيه سوست بونيل كلاسيكي 2.2 مم',
    nameEn: 'Continuous Bonnell Spring Core (2.2mm Carbon Steel)',
    materialCategory: 'Bonnell Spring',
    density: 0,
    firmness: 'Firm',
    compressionRating: 'Standard Compression',
    thermalRating: 'Neutral Breathable',
    durabilityRating: 75,
    warrantyRating: 5,
    unitCostSar: 65,
    supplier: 'المورد الوطني لشاسيهات السوست (National Steel Spring Co.)',
    supplierCode: 'SUP-NAT-SP04',
    alternativeMaterials: ['SP-PCK-200'],
    recommendedApplications: ['المراتب السكنية الاقتصادية', 'سكن العمال والطلاب', 'الشاسيهات فائقة التحمل للأوزان الثقيلة'],
    restrictedApplications: ['المراتب التي تتطلب عزل الحركة للشركاء', 'المراتب الطبية للمفاصل'],
    qualityGrade: 'B (Standard Commercial)',
    specNotesAr: 'سوست فولاذية متصلة توفر صلابة وقوة تحمل ميكانيكية استثنائية مع كلفة اقتصادية منافسة.'
  },
  'FM-HR-035': {
    materialCode: 'FM-HR-035',
    nameAr: 'إسفنج عالي المرونة والارتداد HR كـ35',
    nameEn: 'High Resilience Open-Cell Foam D35',
    materialCategory: 'HR Foam',
    density: 35,
    firmness: 'Medium Firm',
    compressionRating: 'Roll-Pack Certified (100% Recovery)',
    thermalRating: 'Neutral Breathable',
    durabilityRating: 92,
    warrantyRating: 10,
    unitCostSar: 35,
    supplier: 'مصنع رغوة سليب إي المتطورة (Sleepee Advanced Polymers)',
    supplierCode: 'SUP-SLP-FM01',
    alternativeMaterials: ['FM-LTX-075', 'FM-HRD-032'],
    recommendedApplications: ['طبقات الدعم المركزية', 'مراتب الفنادق', 'القلب الإسفنجي الداعم'],
    restrictedApplications: ['الملامسة المباشرة لأسلاك السوست دون لباد'],
    qualityGrade: 'A+ (Medical/Hospitality)',
    specNotesAr: 'بوليمر عالي الارتداد بخلايا مفتوحة يضمن عدم الهبوط واستعادة فورية للمرونة حتى بعد 100,000 دورة ضغط.'
  },
  'FM-MEM-050': {
    materialCode: 'FM-MEM-050',
    nameAr: 'إسفنج الذاكرة اللزج ميموري فوم كـ50',
    nameEn: 'Viscoelastic Memory Foam D50',
    materialCategory: 'Memory Foam',
    density: 50,
    firmness: 'Medium Soft',
    compressionRating: 'Roll-Pack Certified (100% Recovery)',
    thermalRating: 'Thermal Insulator (Heat Retentive)',
    durabilityRating: 88,
    warrantyRating: 8,
    unitCostSar: 55,
    supplier: 'مصنع رغوة سليب إي المتطورة (Sleepee Advanced Polymers)',
    supplierCode: 'SUP-SLP-FM02',
    alternativeMaterials: ['FM-GEL-055', 'FM-LTX-075'],
    recommendedApplications: ['طبقات التوبير الفاخرة', 'تخفيف الضغط العضلي', 'مراتب الراحة الفندقية'],
    restrictedApplications: ['الاستخدام كقاعدة سفلية وحيدة', 'البيئات الحارة بدون أقمشة تبريد'],
    qualityGrade: 'A (Premium Commercial)',
    specNotesAr: 'رغوة تتشكل مع حرارة وضغط الجسم وتلغي نقاط التوتر في الكتفين والورك.'
  },
  'FM-GEL-055': {
    materialCode: 'FM-GEL-055',
    nameAr: 'إسفنج ميموري فوم مبرد بحبيبات الجل كـ55',
    nameEn: 'Thermo-Regulating Cooling Gel Memory Foam D55',
    materialCategory: 'Gel Memory',
    density: 55,
    firmness: 'Medium Soft',
    compressionRating: 'Roll-Pack Certified (100% Recovery)',
    thermalRating: 'High Heat Dissipation (Cooling)',
    durabilityRating: 94,
    warrantyRating: 10,
    unitCostSar: 70,
    supplier: 'مصنع رغوة سليب إي المتطورة (Sleepee Advanced Polymers)',
    supplierCode: 'SUP-SLP-FM03',
    alternativeMaterials: ['FM-MEM-050', 'FM-LTX-075'],
    recommendedApplications: ['المراتب الفاخرة لأجواء الخليج الحارة', 'أجنحة الفنادق 5 نجوم', 'المراتب الطبية المقاومة للحرارة'],
    restrictedApplications: ['الطبقات الأساسية السفلية'],
    qualityGrade: 'A+ (Medical/Hospitality)',
    specNotesAr: 'حبيبات جل نانوية ماصة للحرارة الزائدة تحافظ على برودة السطح بدرجتين مئويتين تحت حرارة الغرفة.'
  },
  'FM-LTX-075': {
    materialCode: 'FM-LTX-075',
    nameAr: 'لاتكس طبيعي مرن معقم ومثقب كـ75',
    nameEn: '100% Natural Organic Ventilated Latex D75',
    materialCategory: 'Latex',
    density: 75,
    firmness: 'Medium',
    compressionRating: 'High Compression Safe',
    thermalRating: 'High Heat Dissipation (Cooling)',
    durabilityRating: 99,
    warrantyRating: 15,
    unitCostSar: 90,
    supplier: 'المستورد الماليزي للاتكس الطبيعي (Malaysian Natural Latex)',
    supplierCode: 'SUP-MAL-LT01',
    alternativeMaterials: ['FM-HR-035', 'FM-GEL-055'],
    recommendedApplications: ['المراتب العضوية الفاخرة', 'المراتب الطبية للحساسية', 'طبقات الراحة المستدامة'],
    restrictedApplications: ['التعرض لأشعة الشمس المباشرة أثناء الغسيل'],
    qualityGrade: 'A+ (Medical/Hospitality)',
    specNotesAr: 'مستخلص شجر المطاط الطبيعي بنسبة 100%، مضاد طبيعي لعث الغبار ومثقب بقنوات تهوية دائرية.'
  },
  'FM-REB-080': {
    materialCode: 'FM-REB-080',
    nameAr: 'إسفنج ريبوند طبي عالي الكثافة كـ80',
    nameEn: 'High-Density Medical Rebonded Foam D80',
    materialCategory: 'Rebonded Foam',
    density: 80,
    firmness: 'Rigid Core',
    compressionRating: 'High Compression Safe',
    thermalRating: 'Neutral Breathable',
    durabilityRating: 96,
    warrantyRating: 12,
    unitCostSar: 28,
    supplier: 'مصنع رغوة سليب إي المتطورة (Sleepee Advanced Polymers)',
    supplierCode: 'SUP-SLP-FM04',
    alternativeMaterials: ['FM-HRD-032', 'FM-HR-035'],
    recommendedApplications: ['المراتب الطبية الصلبة لعلاج الانزلاق الغضروفي', 'القواعد الإسفنجية الصلبة', 'الأوزان الثقيلة +120 كجم'],
    restrictedApplications: ['طبقات الملامسة المباشرة العلوية بدون توبير'],
    qualityGrade: 'A (Premium Commercial)',
    specNotesAr: 'إسفنج مضغوط هيدروليكياً يمنح أعلى درجات الدعم الإنشائي وثبات الاستقامة للعمود الفقري.'
  },
  'FM-HRD-032': {
    materialCode: 'FM-HRD-032',
    nameAr: 'إسفنج دعم صلب للقاعدة كـ32',
    nameEn: 'High-Density Base Support Hard Foam D32',
    materialCategory: 'Edge Support Foam',
    density: 32,
    firmness: 'Firm',
    compressionRating: 'Roll-Pack Certified (100% Recovery)',
    thermalRating: 'Neutral Breathable',
    durabilityRating: 85,
    warrantyRating: 8,
    unitCostSar: 22,
    supplier: 'مصنع رغوة سليب إي المتطورة (Sleepee Advanced Polymers)',
    supplierCode: 'SUP-SLP-FM05',
    alternativeMaterials: ['FM-HR-035', 'FM-REB-080'],
    recommendedApplications: ['طبقة الأساس السفلي للمرتبة', 'إطارات تدعيم الحواف (Edge Support Encasement)'],
    restrictedApplications: ['طبقات الراحة العلوية'],
    qualityGrade: 'A (Premium Commercial)',
    specNotesAr: 'طبقة حاجز سفلية وجانبية متينة تمنع هبوط الحواف عند الجلوس على طرف السرير.'
  },
  'FL-COT-900': {
    materialCode: 'FL-COT-900',
    nameAr: 'لباد قطني عازل معالج حرارياً 900 جم/م²',
    nameEn: 'Thermobonded Cotton Insulator Felt (900g/m²)',
    materialCategory: 'Cotton Felt',
    density: 900,
    firmness: 'Firm',
    compressionRating: 'Roll-Pack Certified (100% Recovery)',
    thermalRating: 'Neutral Breathable',
    durabilityRating: 95,
    warrantyRating: 10,
    unitCostSar: 12,
    supplier: 'شركة النسيج العازل الصناعي (Industrial Textile Felt Co.)',
    supplierCode: 'SUP-IND-FL01',
    alternativeMaterials: ['FL-POL-600'],
    recommendedApplications: ['العازل الإنشائي الأساسي بين السوست وطبقات الإسفنج', 'حماية الرغوة من الاحتكاك الميكانيكي'],
    restrictedApplications: ['الاستخدام بدون طبقات إسفنج راحة فوقه'],
    qualityGrade: 'A+ (Medical/Hospitality)',
    specNotesAr: 'لباد قطني مضغوط بالأفران الحرارية يوفر درعاً واقياً ضد بروز أسلاك السوست ويوزع الأحمال.'
  },
  'FL-POL-600': {
    materialCode: 'FL-POL-600',
    nameAr: 'لباد بوليستر إبرة صناعي 600 جم/م²',
    nameEn: 'Needle-Punched Synthetic Polyester Felt (600g/m²)',
    materialCategory: 'Felt',
    density: 600,
    firmness: 'Medium Firm',
    compressionRating: 'Standard Compression',
    thermalRating: 'Neutral Breathable',
    durabilityRating: 78,
    warrantyRating: 5,
    unitCostSar: 8,
    supplier: 'شركة النسيج العازل الصناعي (Industrial Textile Felt Co.)',
    supplierCode: 'SUP-IND-FL02',
    alternativeMaterials: ['FL-COT-900'],
    recommendedApplications: ['المراتب الاقتصادية', 'عوازل السوست المعيارية'],
    restrictedApplications: ['المراتب الفندقية 5 نجوم', 'الضمانات التي تتجاوز 7 سنوات'],
    qualityGrade: 'B (Standard Commercial)',
    specNotesAr: 'لباد صناعي اقتصادي خفيف لعزل السوست في المنتجات المعيارية والتنافسية.'
  },
  'FB-SIL-300': {
    materialCode: 'FB-SIL-300',
    nameAr: 'ألياف مايكروفايبر سيليكونية حرارية 300 جم/م²',
    nameEn: 'Hollow Siliconized Conjugated Microfiber (300g/m²)',
    materialCategory: 'Fiber',
    density: 300,
    firmness: 'Ultra Soft',
    compressionRating: 'Roll-Pack Certified (100% Recovery)',
    thermalRating: 'Neutral Breathable',
    durabilityRating: 88,
    warrantyRating: 10,
    unitCostSar: 10,
    supplier: 'مصنع الألياف الصناعية المتقدمة (Advanced Fiber Works)',
    supplierCode: 'SUP-ADV-FB01',
    alternativeMaterials: [],
    recommendedApplications: ['تنجيد الكبتوني العلوي', 'منح الملمس الفندقي المنتفخ السحابي'],
    restrictedApplications: ['الطبقات الحاملة للأوزان الثقيلة'],
    qualityGrade: 'A+ (Medical/Hospitality)',
    specNotesAr: 'ألياف مجوفة معالجة بالسيليكون تسمح بمرور الهواء وتمنح سطح المرتبة ملمساً قطنياً فخماً.'
  },
  'TX-KNT-350': {
    materialCode: 'TX-KNT-350',
    nameAr: 'قماش تريكو جاكار فاخر متمدد 350 جم/م²',
    nameEn: 'Premium 4-Way Stretch Knitted Jacquard (350g/m²)',
    materialCategory: 'Fabric',
    density: 350,
    firmness: 'Soft',
    compressionRating: 'Roll-Pack Certified (100% Recovery)',
    thermalRating: 'Neutral Breathable',
    durabilityRating: 92,
    warrantyRating: 10,
    unitCostSar: 24,
    supplier: 'مجمع نسيج سليبي المعتمد (Sleepee Master Textile)',
    supplierCode: 'SUP-TEX-KN01',
    alternativeMaterials: ['TX-TNC-360', 'TX-COL-400'],
    recommendedApplications: ['الغطاء الخارجي لمراتب التجزئة والفنادق', 'المراتب القابلة للضغط Roll-Pack'],
    restrictedApplications: ['البيئات الطبية التي تتطلب عزلاً تاماً للسوائل بدون معالجة'],
    qualityGrade: 'A+ (Medical/Hospitality)',
    specNotesAr: 'قماش تريكو دائري الحياكة معالج ضد الكهرباء الساكنة وعث الغبار مع مرونة تمدد كاملة.'
  },
  'TX-COL-400': {
    materialCode: 'TX-COL-400',
    nameAr: 'قماش التبريد الجليدي الذكي Ice-Silk 400 جم/م²',
    nameEn: 'Phase Change Ice-Silk Cooling Fabric (400g/m²)',
    materialCategory: 'Fabric',
    density: 400,
    firmness: 'Soft',
    compressionRating: 'Roll-Pack Certified (100% Recovery)',
    thermalRating: 'High Heat Dissipation (Cooling)',
    durabilityRating: 96,
    warrantyRating: 10,
    unitCostSar: 38,
    supplier: 'مجمع نسيج سليبي المعتمد (Sleepee Master Textile)',
    supplierCode: 'SUP-TEX-CL02',
    alternativeMaterials: ['TX-TNC-360', 'TX-KNT-350'],
    recommendedApplications: ['مراتب النخبة الفاخرة', 'المراتب الصيفية المبردة', 'الفنادق الفاخرة'],
    restrictedApplications: ['المنتجات الاقتصادية محدودة الميزانية'],
    qualityGrade: 'A+ (Medical/Hospitality)',
    specNotesAr: 'ألياف تبريد نشطة تمتص حرارة الجسم وتشتتها فوراً عبر مسامات النسيج لراحة حرارية مستمرة.'
  },
  'TX-ORG-320': {
    materialCode: 'TX-ORG-320',
    nameAr: 'قماش قطن عضوي معالج طبي Sanitized 320 جم/م²',
    nameEn: 'Sanitized 100% Organic Cotton Anti-Bacterial Fabric (320g/m²)',
    materialCategory: 'Fabric',
    density: 320,
    firmness: 'Soft',
    compressionRating: 'Roll-Pack Certified (100% Recovery)',
    thermalRating: 'Neutral Breathable',
    durabilityRating: 94,
    warrantyRating: 10,
    unitCostSar: 30,
    supplier: 'مجمع نسيج سليبي المعتمد (Sleepee Master Textile)',
    supplierCode: 'SUP-TEX-OR03',
    alternativeMaterials: ['TX-TNC-360', 'TX-KNT-350'],
    recommendedApplications: ['المراتب الطبية المعتمدة', 'مراتب الأطفال وحساسية الجلد', 'المستشفيات والمراكز العلاجية'],
    restrictedApplications: ['التنظيف بالأحماض الكاوية المركزة'],
    qualityGrade: 'A+ (Medical/Hospitality)',
    specNotesAr: 'قماش قطني نقي 100% خالي من الكيماويات ومطعم بأيونات الفضة المضادة للميكروبات والجراثيم.'
  },
  'TX-TNC-360': {
    materialCode: 'TX-TNC-360',
    nameAr: 'قماش التنسيل الطبيعي النباتي الفاخر 360 جم/م²',
    nameEn: 'Eco-Friendly Botanical Tencel Lyocell Fabric (360g/m²)',
    materialCategory: 'Fabric',
    density: 360,
    firmness: 'Soft',
    compressionRating: 'Roll-Pack Certified (100% Recovery)',
    thermalRating: 'High Heat Dissipation (Cooling)',
    durabilityRating: 95,
    warrantyRating: 10,
    unitCostSar: 32,
    supplier: 'مجمع نسيج سليبي المعتمد (Sleepee Master Textile)',
    supplierCode: 'SUP-TEX-TN04',
    alternativeMaterials: ['TX-COL-400', 'TX-KNT-350'],
    recommendedApplications: ['مراتب النوم الطبيعي المستدام', 'المراتب الفندقية البيئية', 'مقاومة الرطوبة الطبيعية'],
    restrictedApplications: [],
    qualityGrade: 'A+ (Medical/Hospitality)',
    specNotesAr: 'ألياف خشب الأوكالبتوس الطبيعية بنعومة الحرير وقدرة امتصاص رطوبة تفوق القطن بـ 50%.'
  },
  'ADH-HOT-010': {
    materialCode: 'ADH-HOT-010',
    nameAr: 'غراء تجميع الرغوة بالصهر الساخن الخالي من المذيبات',
    nameEn: 'Solvent-Free Eco Hot-Melt Adhesive Polymer',
    materialCategory: 'Adhesive',
    density: 0,
    firmness: 'N/A',
    compressionRating: 'Roll-Pack Certified (100% Recovery)',
    thermalRating: 'N/A',
    durabilityRating: 98,
    warrantyRating: 15,
    unitCostSar: 6,
    supplier: 'شركة الكيماويات الصناعية النظيفة (Eco Polymers Co.)',
    supplierCode: 'SUP-ECO-AD01',
    alternativeMaterials: [],
    recommendedApplications: ['تثبيت طبقات الإسفنج واللباد بالكامل', 'التصنيع الصديق للبيئة بدون روائح'],
    restrictedApplications: ['الرش اليدوي للمذيبات القابلة للاشتعال'],
    qualityGrade: 'A+ (Medical/Hospitality)',
    specNotesAr: 'غراء ساخن فائق الالتصاق عديم الرائحة وصديق للبيئة لا يسبب أي تفكك في الطبقات مدى الحياة.'
  },
  'PKG-EXP-001': {
    materialCode: 'PKG-EXP-001',
    nameAr: 'تغليف التصدير المضغوط ثلاثي الطبقات Roll-Pack Box',
    nameEn: 'Heavy Duty 3-Ply Vacuum Compression Roll-Pack Box',
    materialCategory: 'Packaging',
    density: 0,
    firmness: 'N/A',
    compressionRating: 'Roll-Pack Certified (100% Recovery)',
    thermalRating: 'N/A',
    durabilityRating: 100,
    warrantyRating: 10,
    unitCostSar: 18,
    supplier: 'الشركة المتحدة لحلول التغليف والتصدير (Global Pack Solutions)',
    supplierCode: 'SUP-GLO-PK01',
    alternativeMaterials: [],
    recommendedApplications: ['شحن التصدير الخارجي', 'مبيعات الأونلاين والتوصيل السريع بالكرتون'],
    restrictedApplications: ['مراتب السوست المتصلة البونيل غير القابلة للضغط'],
    qualityGrade: 'A+ (Medical/Hospitality)',
    specNotesAr: 'تغليف محكم الغلق بتفريغ الهواء مع كرتون مقوى مقاوم للصدمات والرطوبة أثناء الشحن البحري والجوي.'
  }
};

export class MaterialMasterIntelligenceEngine {
  public static getAllMaterials(): MaterialIntelligenceItem[] {
    return Object.values(SLEEPEE_MATERIAL_LIBRARY);
  }

  public static getMaterial(codeOrName: string): MaterialIntelligenceItem | null {
    if (!codeOrName) return null;
    const clean = codeOrName.trim().toLowerCase();

    // Check direct key match
    if (SLEEPEE_MATERIAL_LIBRARY[codeOrName]) {
      return SLEEPEE_MATERIAL_LIBRARY[codeOrName];
    }

    // Search by code or English / Arabic name or material type
    const found = Object.values(SLEEPEE_MATERIAL_LIBRARY).find(m => 
      m.materialCode.toLowerCase() === clean ||
      m.nameEn.toLowerCase().includes(clean) ||
      m.nameAr.toLowerCase().includes(clean) ||
      m.materialCategory.toLowerCase() === clean ||
      clean.includes(m.materialCategory.toLowerCase())
    );

    return found || null;
  }

  public static getMaterialByCode(code: string): MaterialIntelligenceItem | null {
    return this.getMaterial(code);
  }

  public static getMaterialByName(name: string): MaterialIntelligenceItem | null {
    return this.getMaterial(name);
  }

  public static findAlternatives(materialCode: string): MaterialIntelligenceItem[] {
    const item = this.getMaterial(materialCode);
    if (!item || !item.alternativeMaterials || item.alternativeMaterials.length === 0) {
      return [];
    }
    return item.alternativeMaterials
      .map(altCode => SLEEPEE_MATERIAL_LIBRARY[altCode])
      .filter(Boolean);
  }

  public static evaluateLayerCompatibility(layer: { material?: string; thickness?: number; density?: number }, market: string): {
    score: number;
    grade: string;
    warnings: string[];
    isRecommended: boolean;
  } {
    const mat = this.getMaterial(layer.material || '');
    if (!mat) {
      return {
        score: 70,
        grade: 'B (Standard Commercial)',
        warnings: ['مادة غير مسجلة في سجل المواد الذكي المعتمد'],
        isRecommended: true
      };
    }

    const warnings: string[] = [];
    let score = mat.durabilityRating;

    if (market === 'Medical' && mat.qualityGrade !== 'A+ (Medical/Hospitality)') {
      warnings.push(`المادة (${mat.nameAr}) ليست من فئة A+ المعتمدة طبياً.`);
      score -= 15;
    }

    if (market === 'Hotel' && mat.warrantyRating < 7) {
      warnings.push(`عمر الضمان الأقصى للمادة (${mat.warrantyRating} سنوات) أقل من معيار الفنادق (7-10 سنوات).`);
      score -= 10;
    }

    return {
      score: Math.max(0, score),
      grade: mat.qualityGrade,
      warnings,
      isRecommended: warnings.length === 0
    };
  }
}
