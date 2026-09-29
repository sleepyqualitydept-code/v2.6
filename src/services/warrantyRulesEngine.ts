/**
 * SLEEPEE WARRANTY RULES ENGINE
 * =============================
 * Deterministic, rule-based warranty risk and policy computation.
 * 100% Internal Knowledge System - Zero external API dependencies ($0 Cost).
 */

export interface WarrantyCalculationInput {
  productType: string;
  density?: number | string;
  springType?: string;
  targetMarket: string;
  height?: number;
  budget?: string;
}

export interface WarrantyCalculationOutput {
  duration: number;
  recommendedPolicyType: '10 Years' | '7 Years' | '5 Years' | 'Hybrid' | 'Declining' | 'Custom';
  coverageRules: string;
  exclusions: string;
  replacementRules: string;
  maintenanceRules: string;
  activationRules: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  reasoning: string;
}

export class WarrantyRulesEngine {
  public static calculatePolicy(input: WarrantyCalculationInput): WarrantyCalculationOutput {
    const market = (input.targetMarket || 'Hotel').toLowerCase();
    const spring = (input.springType || 'Pocket Spring').toLowerCase();
    const densityVal = typeof input.density === 'number' ? input.density : parseInt(String(input.density || '35'), 10) || 35;
    const isPocket = spring.includes('pocket');
    const isBonnell = spring.includes('bonnell');
    const isNoSprings = spring.includes('no') || spring.includes('none');

    let duration = 10;
    let recommendedPolicyType: '10 Years' | '7 Years' | '5 Years' | 'Hybrid' | 'Declining' | 'Custom' = '10 Years';
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    let coverageRules = '';
    let exclusions = '';
    let replacementRules = '';
    let maintenanceRules = '';
    let activationRules = '';
    let reasoning = '';

    if (market.includes('hotel') || market.includes('فندق')) {
      duration = isPocket ? 10 : 7;
      recommendedPolicyType = 'Hybrid';
      riskLevel = 'Low';
      coverageRules = 'تغطية تامة وشاملة لأي هبوط إنشائي يتجاوز 10%، وتفكك خياطة الحواف، وتلف أو كسر شاسيه السوست الجيبية الصامت، ومقاومة إجهاد الاستخدام اليومي.';
      exclusions = 'الحروق، البلل بالسوائل بدون استخدام الواقي الفندقي المعتمد، والتنظيف بالمواد الكيميائية المبيضة الكاوية، والتمزق الناتج عن النقل والتحميل الخشن.';
      replacementRules = 'استبدال فوري مجاني بالكامل داخل المنشأة الفندقية خلال أول 3 سنوات، ثم تغطية صيانة فنية وصيانة موقعية شاملة حتى نهاية مدة الضمان.';
      maintenanceRules = 'تلتزم إدارة الفندق بتدوير المرتبة بمعدل 180 درجة كل 60 يوماً، وتثبيتها على قواعد مسطحة صلبة معقمة.';
      activationRules = 'التفعيل الآلي عبر الرقم التسلسلي الرقمي QR المرفق بفاتورة التوريد المعتمدة لمجموعة الضيافة.';
      reasoning = 'المشروعات الفندقية تتطلب سياسة ضمان هجينة (Hybrid) طويلة الأمد لتقليل المخاطر التشغيلية. السوست الجيبية مع كثافة الإسفنج المحسوبة تخفض معدل المطالبات لأقل من 0.4%.';
    } else if (market.includes('medical') || market.includes('طبي')) {
      duration = 10;
      recommendedPolicyType = '10 Years';
      riskLevel = 'Low';
      coverageRules = 'تغطية طبية معتمدة كاملة لتشوهات إسفنج الريبوند الطبي أو اللاتكس، وضمان استقرار المرونة الارتدادية ودعم فقرات الظهر القطنية والعنقية.';
      exclusions = 'التعقيم بالسوائل الحارقة التي تخترق العوازل، الرطوبة المتراكمة بسبب تلف غطاء الحماية المقاوم للسوائل، أو ثني المرتبة بزوايا حادة خارج السرير الطبي.';
      replacementRules = 'استبدال فوري مجاني للمرتبة الطبية خلال أول 5 سنوات في حال حدوث أي هبوط ميكانيكي يتجاوز 1.5 سم، ثم استبدال بنسبة إهلاك متناقصة 10% سنوياً.';
      maintenanceRules = 'استخدام واقي السوائل الطبي العازل، وفحص استواء السرير الطبي كل 6 أشهر مع التهوية الدورية بدون تعريض مباشر للشمس.';
      activationRules = 'توثيق الرقم التسلسلي مع التقرير الطبي أو سجل المنشأة الطبية خلال 14 يوماً من الاستلام.';
      reasoning = 'المراتب الطبية ذات الكثافة العالية (D40 - D80) تتمتع بأعلى ثبات إنشائي وتخضع لمعايير خالية من المخاطر الإنشائية بنسبة تفوق 99.6%.';
    } else if (isBonnell || densityVal < 28) {
      duration = 5;
      recommendedPolicyType = '5 Years';
      riskLevel = 'Medium';
      coverageRules = 'تغطية كسر أسلاك السوست الكربونية، أو انهيار الإطار الفولاذي المحيط، أو هبوط سطح الإسفنج بما يزيد عن 2.5 سم.';
      exclusions = 'الوقوف أو القفز على سطح المرتبة، انسكاب السوائل، استخدام قواعد سريرية متباعدة الألواح بأكثر من 8 سم، والتلف الخارجي للأقمشة.';
      replacementRules = 'استبدال أو إصلاح شامل مجاني خلال العامين الأولين، ونظام استبدال متناقص نسبي للأعوام 3 إلى 5.';
      maintenanceRules = 'تدوير المرتبة رأساً وعقباً كل 90 يوماً، والتأكد من استواء ألواح خشب السرير الداعمة.';
      activationRules = 'مسح رمز الاستجابة السريعة (QR Code) وتسجيل الفاتورة الإلكترونية عبر بوابة Sleepee خلال 30 يوماً من الشراء.';
      reasoning = 'الهياكل الاقتصادية القائمة على سوست بونيل أو الكثافات المتوسطة تمنح توازناً اقتصادياً فعالاً مع مدة ضمان معيارية تبلغ 5 سنوات لتفادي مخاطر الإجهاد المعدني.';
    } else {
      // Premium / Retail Standard
      duration = densityVal >= 35 ? 10 : 7;
      recommendedPolicyType = densityVal >= 35 ? '10 Years' : '7 Years';
      riskLevel = 'Low';
      coverageRules = 'ضمان شامل يشمل استقامة الشاسيه، سلامة الإسفنج عالي الارتداد (HR)، وثبات طبقات الكبتوني والأقمشة ضد التلف المصنعي.';
      exclusions = 'التلف الناتج عن سوء الاستخدام، السوائل، الحروق، والكسر الناتج عن النقل الخاطئ أو قواعد السرير غير المستوية.';
      replacementRules = 'استبدال مجاني فوري خلال النصف الأول من فترة الضمان، وتغطية صيانة متخصصة أو استبدال جزئي للأعوام المتبقية.';
      maintenanceRules = 'تدوير المرتبة من الرأس للقدمين كل 3 أشهر، واستخدام عازل مرتبة مقاوم للسوائل والأتربة.';
      activationRules = 'تفعيل الضمان الإلكتروني عبر تطبيق Sleepee أو المنصة المركزية بإدخال السيريال نمبر.';
      reasoning = 'تركيبة الإسفنج عالي المرونة والسوست المعالجة حرارياً تحقق المعايير السعودية والعالمية SASO مع مؤشر موثوقية مرتفع يتيح منح ضمان 7-10 سنوات بثقة كاملة.';
    }

    return {
      duration,
      recommendedPolicyType,
      coverageRules,
      exclusions,
      replacementRules,
      maintenanceRules,
      activationRules,
      riskLevel,
      reasoning
    };
  }
}
