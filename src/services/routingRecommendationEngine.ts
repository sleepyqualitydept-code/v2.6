/**
 * SLEEPEE ROUTING RECOMMENDATION ENGINE
 * =====================================
 * Generates optimal suggested manufacturing routing steps based on mattress structure.
 * SUGGESTION ONLY - NO PRODUCTION ORDER CREATION - NO EXECUTION.
 * 100% Deterministic Rule Engine - $0 External AI Cost.
 */

export interface SuggestedRoutingStep {
  stepNumber: number;
  operationCode: string;
  operationNameAr: string;
  operationNameEn: string;
  workCenterCode: string;
  workCenterNameAr: string;
  estimatedStandardTimeMinutes: number;
  keyInstructionsAr: string;
  requiredQualityCheckAr: string;
}

export interface RoutingRecommendationResult {
  routingType: 'Pocket Spring Hybrid Route' | 'Bonnell Spring Route' | 'Full Foam Medical Route' | 'Luxury Double Topper Route';
  totalStandardTimeMinutes: number;
  totalWorkCenters: number;
  steps: SuggestedRoutingStep[];
  routingNotesAr: string;
}

export class RoutingRecommendationEngine {
  public static generateSuggestedRouting(layers: Array<{ material?: string; thickness?: number; layerType?: string }>): RoutingRecommendationResult {
    let hasPocketSpring = false;
    let hasBonnellSpring = false;
    let hasLatexOrGel = false;
    let hasMemory = false;

    layers.forEach(l => {
      const mat = (l.material || '').toLowerCase();
      if (mat.includes('pocket')) hasPocketSpring = true;
      if (mat.includes('bonnell')) hasBonnellSpring = true;
      if (mat.includes('latex') || mat.includes('gel')) hasLatexOrGel = true;
      if (mat.includes('memory') || mat.includes('visco')) hasMemory = true;
    });

    const isSpringProduct = hasPocketSpring || hasBonnellSpring;
    const isLuxuryHybrid = hasPocketSpring && (hasLatexOrGel || hasMemory);
    const steps: SuggestedRoutingStep[] = [];
    let stepNum = 1;

    // STEP 1: Springs Core Assembly (If spring product)
    if (isSpringProduct) {
      steps.push({
        stepNumber: stepNum++,
        operationCode: hasPocketSpring ? 'OP-SP-PCK-01' : 'OP-SP-BON-01',
        operationNameAr: hasPocketSpring ? 'تجميع ورص شاسيه السوست الجيبية' : 'تجميع وتربيط شاسيه سوست بونيل',
        operationNameEn: hasPocketSpring ? 'Pocket Spring Ultrasonic Encasing' : 'Bonnell Spring Wire Assembly',
        workCenterCode: 'WC-SPRINGS-01',
        workCenterNameAr: 'مركز تجميع الشاسيهات والسوست المعدنية',
        estimatedStandardTimeMinutes: hasPocketSpring ? 18 : 12,
        keyInstructionsAr: 'معايرة ماكينة اللحام بالموجات فوق الصوتية، والتحقق من شدة أسلاك الكاربون وعدد الصفوف.',
        requiredQualityCheckAr: 'فحص استواء الأبعاد وقياس التردد الارتدادي للشاسيه.'
      });
    }

    // STEP 2: Foam CNC Cutting & Profiling
    steps.push({
      stepNumber: stepNum++,
      operationCode: 'OP-FM-CUT-02',
      operationNameAr: 'قص وتشكيل طبقات الإسفنج CNC',
      operationNameEn: 'Automated Foam CNC Contour & Block Cutting',
      workCenterCode: 'WC-FOAM-CNC-02',
      workCenterNameAr: 'مركز قص الإسفنج المحوسب CNC',
      estimatedStandardTimeMinutes: 10,
      keyInstructionsAr: 'قص الرغوة بالأبعاد المحددة في أمر الـ BOM مع مراعاة نسبة التسامح ±2 مم.',
      requiredQualityCheckAr: 'قياس الكثافة بالباروميتر ومطابقة سماكة الطبقات مع بطاقة الـ BOM.'
    });

    // STEP 3: Layer Assembly & Insulator Placement
    steps.push({
      stepNumber: stepNum++,
      operationCode: 'OP-LAY-ASM-03',
      operationNameAr: 'تجميع وتثبيت الطبقات الإنشائية واللباد العازل',
      operationNameEn: 'Layer Stacking & Insulator Pad Placement',
      workCenterCode: 'WC-ASSEMBLY-03',
      workCenterNameAr: 'مركز رص وتجميع الطبقات المركزية',
      estimatedStandardTimeMinutes: 14,
      keyInstructionsAr: 'رص طبقات الإسفنج واللباد بالترتيب التسلسلي الدقيق من القاعدة حتى السطح العلوي.',
      requiredQualityCheckAr: 'التحقق البصري من عدم وجود أي تجاعيد في اللباد وتوسيط الطبقات.'
    });

    // STEP 4: Eco Adhesive Station
    steps.push({
      stepNumber: stepNum++,
      operationCode: 'OP-ADH-BOND-04',
      operationNameAr: 'رش وتثبيت الغراء بالصهر الساخن الخالي من الروائح',
      operationNameEn: 'Hot-Melt Eco Adhesive Laminating',
      workCenterCode: 'WC-ADHESIVE-04',
      workCenterNameAr: 'محطة الغراء واللصق الحراري الآلي',
      estimatedStandardTimeMinutes: 8,
      keyInstructionsAr: 'تطبيق الغراء الحراري بنمط رش شبكي متساوي بمعدل 40 جم/م² مع ضغط هيدروليكي خفيف.',
      requiredQualityCheckAr: 'فحص قوة الالتصاق والتحقق من انعدام أي انبعاثات مذيبات كيميائية.'
    });

    // STEP 5: Quilting & Outer Fabric Ticking
    steps.push({
      stepNumber: stepNum++,
      operationCode: 'OP-QUILT-05',
      operationNameAr: 'حياكة وكبتونية القماش الخارجي مع الفايبر',
      operationNameEn: 'Multi-Needle Fabric Quilting & Embroidery',
      workCenterCode: 'WC-QUILTING-05',
      workCenterNameAr: 'مركز الكبتونية وحياكة الأقمشة الفاخرة',
      estimatedStandardTimeMinutes: 16,
      keyInstructionsAr: 'حياكة النمط الهندسي المعتمد للوجه العلوي والجوانب بخيوط بوليستر عالية المتانة.',
      requiredQualityCheckAr: 'فحص انتظام الغرز وخلو السطح من أي خيوط مفكوكة أو عيوب نسيجية.'
    });

    // STEP 6: Tape Edge Border Closing
    steps.push({
      stepNumber: stepNum++,
      operationCode: 'OP-TAPE-EDGE-06',
      operationNameAr: 'خياطة وتطريز حواف المرتبة Tape Edge',
      operationNameEn: 'Heavy-Duty Tape Edge Perimeter Closing',
      workCenterCode: 'WC-TAPE-EDGE-06',
      workCenterNameAr: 'مركز تقفيل وخياطة الحواف المحيطية',
      estimatedStandardTimeMinutes: 15,
      keyInstructionsAr: 'إحكام غلق المرتبة بشريط حواف مقوى بزوايا دائرية منتظمة وتثبيت مقابض الحمل.',
      requiredQualityCheckAr: 'فحص استقامة خط الحافة وتماسك الأركان الأربعة.'
    });

    // STEP 7: Comprehensive Final Inspection & Quality Gate
    steps.push({
      stepNumber: stepNum++,
      operationCode: 'OP-QC-FINAL-07',
      operationNameAr: 'الفحص الهندسي النهائي ومراقبة الجودة SASO',
      operationNameEn: 'Final Quality Audit & SASO Load Deflection Test',
      workCenterCode: 'WC-QUALITY-GATE-07',
      workCenterNameAr: 'بوابة مراقبة الجودة والاعتماد الهندسي',
      estimatedStandardTimeMinutes: 6,
      keyInstructionsAr: 'فحص قياس الأبعاد بالكامل، اختبار استجابة السوست، فحص النظافة التامة، وتثبيت باركود الضمان الرقمي QR.',
      requiredQualityCheckAr: 'مطابقة 100% مع بطاقة المواصفات الفنية وتوقيع ختم الاعتماد.'
    });

    // STEP 8: Packaging & Dispatch Preparation
    steps.push({
      stepNumber: stepNum++,
      operationCode: 'OP-PKG-DISPATCH-08',
      operationNameAr: 'التغليف الآلي وتجهيز الشحن (تغليف حراري / Roll-Pack)',
      operationNameEn: 'Automated Shrink-Wrap & Protective Box Packaging',
      workCenterCode: 'WC-PACKAGING-08',
      workCenterNameAr: 'مركز التغليف الصناعي وتجهيز الشحن',
      estimatedStandardTimeMinutes: 8,
      keyInstructionsAr: 'تغليف المرتبة بطبقة نايلون بولي إيثيلين سميكة 100 ميكرون مع زوايا كرتونية واقية.',
      requiredQualityCheckAr: 'التحقق من إحكام الغلق الحراري وسلامة ملصق الباركود الخارجي.'
    });

    const totalStandardTimeMinutes = steps.reduce((acc, s) => acc + s.estimatedStandardTimeMinutes, 0);

    let routingType: RoutingRecommendationResult['routingType'] = 'Pocket Spring Hybrid Route';
    if (!isSpringProduct) routingType = 'Full Foam Medical Route';
    else if (isLuxuryHybrid) routingType = 'Luxury Double Topper Route';
    else if (hasBonnellSpring) routingType = 'Bonnell Spring Route';

    const routingNotesAr = `مسار تصنيعي مقترح مكون من ${steps.length} عمليات صناعية موزعة على ${steps.length} مراكز تشغيل قياسية، بزمن تصنيعي إجمالي مقدر بـ ${totalStandardTimeMinutes} دقيقة للوحدة. هذا المسار معتمد هندسياً لتقليل الفاقد وتأكيد استقرار الجودة.`;

    return {
      routingType,
      totalStandardTimeMinutes,
      totalWorkCenters: steps.length,
      steps,
      routingNotesAr
    };
  }
}
