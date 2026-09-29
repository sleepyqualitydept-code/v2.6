/**
 * SLEEPEE ENGINEERING VALIDATION & RISK ENGINE
 * ============================================
 * Internal physical compliance and quality assurance checker for mattress BOMs.
 */

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  code: string;
  messageAr: string;
  messageEn: string;
  field?: string;
}

export interface ValidationResult {
  isValid: boolean;
  score: number; // 0 - 100
  issues: ValidationIssue[];
  totalThickness: number;
  totalCost: number;
  punctureRisk: 'Safe' | 'Warning' | 'High Risk';
  durabilityRating: string;
}

export class EngineeringValidationEngine {
  public static validateBOM(layers: Array<{ layerType?: string; material?: string; thickness: number; density?: number; cost?: number }>, targetHeight: number): ValidationResult {
    const issues: ValidationIssue[] = [];
    const totalThickness = layers.reduce((acc, l) => acc + (Number(l.thickness) || 0), 0);
    const totalCost = layers.reduce((acc, l) => acc + (Number(l.cost) || 0), 0);

    // 1. Thickness check
    const diff = Math.abs(totalThickness - targetHeight);
    if (diff > 0.5) {
      issues.push({
        type: 'error',
        code: 'ERR_THICKNESS_MISMATCH',
        messageAr: `مجموع سمك الطبقات (${totalThickness} سم) لا يطابق الارتفاع المستهدف (${targetHeight} سم). الفارق: ${diff.toFixed(1)} سم.`,
        messageEn: `Layer total thickness (${totalThickness} cm) does not match target height (${targetHeight} cm). Difference: ${diff.toFixed(1)} cm.`
      });
    }

    // 2. Spring and Felt Insulator Puncture Check
    let hasSpring = false;
    let springIndex = -1;
    let hasFelt = false;

    layers.forEach((l, idx) => {
      const mat = (l.material || '').toLowerCase();
      const type = (l.layerType || '').toLowerCase();
      if (mat.includes('spring') || mat.includes('pocket') || mat.includes('bonnell') || type.includes('spring')) {
        hasSpring = true;
        springIndex = idx;
      }
      if (mat.includes('felt') || mat.includes('لباد') || type.includes('insulator')) {
        hasFelt = true;
      }
    });

    let punctureRisk: 'Safe' | 'Warning' | 'High Risk' = 'Safe';
    if (hasSpring && !hasFelt) {
      punctureRisk = 'High Risk';
      issues.push({
        type: 'error',
        code: 'ERR_PUNCTURE_RISK',
        messageAr: 'تحذير إنشائي حرج: شاسيه السوست غير محمي بطبقة لباد عازل (Insulator Felt)، مما يعرض الإسفنج لخطر الاختراق والتلف السريع.',
        messageEn: 'Critical structural risk: Spring core is missing an insulator felt layer, risking foam puncture.'
      });
    }

    // 3. Density check for top comfort
    const foamLayers = layers.filter(l => {
      const mat = (l.material || '').toLowerCase();
      return mat.includes('foam') || mat.includes('latex') || mat.includes('إسفنج');
    });

    foamLayers.forEach(fl => {
      const density = Number(fl.density) || 0;
      if (density > 0 && density < 20) {
        issues.push({
          type: 'warning',
          code: 'WARN_LOW_DENSITY',
          messageAr: `كثافة المادة (${fl.material}) منخفضة جداً (${density} كجم/م³)، مما قد يسبب هبوطاً مبكراً.`,
          messageEn: `Density for (${fl.material}) is too low (${density} kg/m³), potentially causing premature sag.`
        });
      }
    });

    // 4. Base Foundation Check
    const lastLayer = layers[layers.length - 1];
    if (lastLayer) {
      const lastMat = (lastLayer.material || '').toLowerCase();
      const lastType = (lastLayer.layerType || '').toLowerCase();
      if (lastMat.includes('spring') || lastType.includes('spring')) {
        issues.push({
          type: 'warning',
          code: 'WARN_NO_BASE_FOUNDATION',
          messageAr: 'السوست تقع مباشرة في أسفل الهيكل بدون طبقة قاعدة إسفنجية مانعة للاحتكاك مع ألواح السرير.',
          messageEn: 'Spring core located directly at bottom without non-slip base foam layer.'
        });
      }
    }

    // Calculate score
    let score = 100;
    issues.forEach(i => {
      if (i.type === 'error') score -= 25;
      if (i.type === 'warning') score -= 10;
    });
    score = Math.max(0, Math.min(100, score));

    return {
      isValid: !issues.some(i => i.type === 'error'),
      score,
      issues,
      totalThickness,
      totalCost,
      punctureRisk,
      durabilityRating: score >= 90 ? 'Grade A+ (10+ Years)' : (score >= 75 ? 'Grade A (7-10 Years)' : 'Grade B (5-7 Years)')
    };
  }
}
