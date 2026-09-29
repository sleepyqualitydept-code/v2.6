import { ar } from '../locales/ar';
import { en } from '../locales/en';

export type SupportedLanguage = 'ar' | 'en';
export type TranslationTree = typeof ar;

const dictionaries = {
  ar,
  en,
};

let currentLang: SupportedLanguage = 'ar';

export const setI18nLanguage = (lang: SupportedLanguage) => {
  currentLang = lang;
};

export const getI18nLanguage = (): SupportedLanguage => {
  return currentLang;
};

export const useTranslationService = (lang?: SupportedLanguage) => {
  const activeLang = lang || currentLang;
  const dict = dictionaries[activeLang] || dictionaries.ar;
  return {
    t: dict,
    lang: activeLang,
    isAr: activeLang === 'ar',
  };
};

export { ar, en };
