/**
 * SLEEPEE INDUSTRIAL BRAND CURRENCY ENGINE & REGISTRY
 * ==================================================
 * Enterprise Multi-Currency Management for BOM Engineering & Manufacturing Costs.
 * Currency Source: Brand → Plant → Default Currency
 * Supported Currencies: EGP, SAR, USD, AED.
 * 100% Deterministic & Local - Zero External Dependencies.
 */

export type CurrencyCode = 'SAR' | 'EGP' | 'USD' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbolAr: string;
  symbolEn: string;
  nameAr: string;
  nameEn: string;
  exchangeRateToBase: number; // Relative to SAR (1 SAR = Base)
  decimals: number;
}

export interface ManufacturingPlant {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  country: string;
  defaultCurrency: CurrencyCode;
  brandIds: string[];
}

export const MANUFACTURING_PLANTS: ManufacturingPlant[] = [
  {
    id: 'PLANT-KSA-01',
    code: 'KSA-MAIN',
    nameAr: 'مجمع مصانع الرياض الرئيسي (السعودية)',
    nameEn: 'Riyadh Central Manufacturing Complex (KSA)',
    country: 'المملكة العربية السعودية',
    defaultCurrency: 'SAR',
    brandIds: ['SLP', 'SH', 'RM']
  },
  {
    id: 'PLANT-EGY-01',
    code: 'EGY-CAIRO',
    nameAr: 'مجمع مصانع القاهرة الصناعي (مصر)',
    nameEn: 'Cairo Industrial Manufacturing Facility (Egypt)',
    country: 'جمهورية مصر العربية',
    defaultCurrency: 'EGP',
    brandIds: ['RH', 'SLP']
  },
  {
    id: 'PLANT-UAE-01',
    code: 'UAE-DXB',
    nameAr: 'مجمع مصانع دبي الصناعية (الإمارات)',
    nameEn: 'Dubai Industrial Park Complex (UAE)',
    country: 'الإمارات العربية المتحدة',
    defaultCurrency: 'AED',
    brandIds: ['CFT', 'SLP']
  },
  {
    id: 'PLANT-EXP-01',
    code: 'EXP-GLOBAL',
    nameAr: 'وحدة عقود التصدير والتوريد الدولي (USD)',
    nameEn: 'Global Export & Marine Contracts Unit',
    country: 'منطقة التصدير الحرة',
    defaultCurrency: 'USD',
    brandIds: ['SLP', 'CFT', 'RH']
  }
];

export const BRAND_DEFAULT_PLANTS: Record<string, string> = {
  SLP: 'PLANT-KSA-01',
  SH: 'PLANT-KSA-01',
  RM: 'PLANT-KSA-01',
  RH: 'PLANT-EGY-01',
  CFT: 'PLANT-UAE-01'
};

export const CURRENCY_REGISTRY: Record<CurrencyCode, CurrencyConfig> = {
  SAR: {
    code: 'SAR',
    symbolAr: 'ر.س',
    symbolEn: 'SAR',
    nameAr: 'ريال سعودي',
    nameEn: 'Saudi Riyal',
    exchangeRateToBase: 1.0, // Base Currency
    decimals: 2
  },
  EGP: {
    code: 'EGP',
    symbolAr: 'ج.م',
    symbolEn: 'EGP',
    nameAr: 'جنيه مصري',
    nameEn: 'Egyptian Pound',
    exchangeRateToBase: 13.1, // 1 SAR ~ 13.10 EGP
    decimals: 2
  },
  USD: {
    code: 'USD',
    symbolAr: '$',
    symbolEn: 'USD',
    nameAr: 'دولار أمريكي',
    nameEn: 'US Dollar',
    exchangeRateToBase: 0.2667, // 1 SAR ~ 0.2667 USD (1 USD = 3.75 SAR)
    decimals: 2
  },
  AED: {
    code: 'AED',
    symbolAr: 'د.إ',
    symbolEn: 'AED',
    nameAr: 'درهم إماراتي',
    nameEn: 'UAE Dirham',
    exchangeRateToBase: 0.98, // 1 SAR ~ 0.98 AED
    decimals: 2
  }
};

const STORAGE_KEY = 'sleepee_active_currency';
const PLANT_STORAGE_KEY = 'sleepee_active_plant';

export class CurrencyEngine {
  private static activeCurrency: CurrencyCode = 'SAR';
  private static activePlantId: string = 'PLANT-KSA-01';

  static getActiveCurrency(): CurrencyCode {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && stored in CURRENCY_REGISTRY) {
        this.activeCurrency = stored as CurrencyCode;
      }
    } catch {
      // fallback to memory
    }
    return this.activeCurrency;
  }

  static setActiveCurrency(code: CurrencyCode): void {
    if (code in CURRENCY_REGISTRY) {
      this.activeCurrency = code;
      try {
        localStorage.setItem(STORAGE_KEY, code);
      } catch {
        // ignore storage errors
      }
    }
  }

  static getActivePlant(): ManufacturingPlant {
    try {
      const stored = localStorage.getItem(PLANT_STORAGE_KEY);
      if (stored) {
        const p = MANUFACTURING_PLANTS.find(item => item.id === stored);
        if (p) {
          this.activePlantId = p.id;
          return p;
        }
      }
    } catch {
      // fallback
    }
    return MANUFACTURING_PLANTS.find(p => p.id === this.activePlantId) || MANUFACTURING_PLANTS[0];
  }

  static setActivePlant(plantId: string): void {
    const plant = MANUFACTURING_PLANTS.find(p => p.id === plantId);
    if (plant) {
      this.activePlantId = plant.id;
      this.setActiveCurrency(plant.defaultCurrency);
      try {
        localStorage.setItem(PLANT_STORAGE_KEY, plant.id);
      } catch {
        // ignore storage errors
      }
    }
  }

  /**
   * Currency source: Brand → Plant → Default Currency
   */
  static getCurrencyForBrandAndPlant(brandId: string, plantId?: string): CurrencyCode {
    if (plantId) {
      const plant = MANUFACTURING_PLANTS.find(p => p.id === plantId);
      if (plant) return plant.defaultCurrency;
    }
    const defaultPlantId = BRAND_DEFAULT_PLANTS[brandId] || 'PLANT-KSA-01';
    const plant = MANUFACTURING_PLANTS.find(p => p.id === defaultPlantId);
    return plant?.defaultCurrency || 'SAR';
  }

  static getPlantsForBrand(brandId: string): ManufacturingPlant[] {
    return MANUFACTURING_PLANTS.filter(p => p.brandIds.includes(brandId) || brandId === 'SLP');
  }

  static getAllPlants(): ManufacturingPlant[] {
    return MANUFACTURING_PLANTS;
  }

  static getAllCurrencies(): CurrencyConfig[] {
    return Object.values(CURRENCY_REGISTRY);
  }

  static getCurrencyConfig(code?: CurrencyCode): CurrencyConfig {
    const targetCode = code || this.getActiveCurrency();
    return CURRENCY_REGISTRY[targetCode] || CURRENCY_REGISTRY.SAR;
  }

  /**
   * Convert an amount in SAR (base) to the target currency
   */
  static convertFromBase(amountInBase: number, targetCurrency?: CurrencyCode): number {
    const config = this.getCurrencyConfig(targetCurrency);
    return Math.round((amountInBase * config.exchangeRateToBase) * 100) / 100;
  }

  /**
   * Convert an amount between any two supported currencies
   */
  static convert(amount: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode): number {
    const fromConfig = CURRENCY_REGISTRY[fromCurrency] || CURRENCY_REGISTRY.SAR;
    const toConfig = CURRENCY_REGISTRY[toCurrency] || CURRENCY_REGISTRY.SAR;
    
    // Convert to base first
    const inBase = amount / fromConfig.exchangeRateToBase;
    // Convert base to target
    return Math.round((inBase * toConfig.exchangeRateToBase) * 100) / 100;
  }

  /**
   * Formats a cost amount with currency symbol
   */
  static format(amountInBase: number, targetCurrency?: CurrencyCode, lang: 'ar' | 'en' = 'ar'): string {
    const code = targetCurrency || this.getActiveCurrency();
    const config = this.getCurrencyConfig(code);
    const converted = this.convertFromBase(amountInBase, code);
    const symbol = lang === 'ar' ? config.symbolAr : config.symbolEn;
    
    return `${converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: config.decimals })} ${symbol}`;
  }

  /**
   * Alias for format
   */
  static formatAmount(amountInBase: number, targetCurrency?: CurrencyCode, lang: 'ar' | 'en' = 'ar'): string {
    return this.format(amountInBase, targetCurrency, lang);
  }

  /**
   * Formats short notation e.g. "1,250 SAR" or "16,375 EGP"
   */
  static formatShort(amountInBase: number, targetCurrency?: CurrencyCode): string {
    return this.format(amountInBase, targetCurrency, 'ar');
  }

  /**
   * Get exchange rate description
   */
  static getExchangeRateDescription(code?: CurrencyCode): string {
    const config = this.getCurrencyConfig(code);
    if (config.code === 'SAR') {
      return '1.00 ر.س (العملة الأساسية للمصنع)';
    }
    return `1 ر.س = ${config.exchangeRateToBase} ${config.symbolAr}`;
  }
}
