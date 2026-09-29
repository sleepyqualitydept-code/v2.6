/**
 * Bilingual Master Data Utility
 * PROMPT-034A SECTION 2: Master Data Bilingual Model
 * Resolves localized name and description based on active language ('ar' | 'en')
 */

export interface BilingualEntity {
  nameAr?: string;
  nameEn?: string;
  Name_AR?: string;
  Name_EN?: string;
  name?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  Description_AR?: string;
  Description_EN?: string;
  description?: string;
}

export const getLocalizedName = (entity: BilingualEntity | null | undefined, lang: 'ar' | 'en'): string => {
  if (!entity) return '';
  if (lang === 'ar') {
    return entity.Name_AR || entity.nameAr || entity.name || entity.Name_EN || entity.nameEn || '';
  }
  return entity.Name_EN || entity.nameEn || entity.name || entity.Name_AR || entity.nameAr || '';
};

export const getLocalizedDescription = (entity: BilingualEntity | null | undefined, lang: 'ar' | 'en'): string => {
  if (!entity) return '';
  if (lang === 'ar') {
    return entity.Description_AR || entity.descriptionAr || entity.description || entity.Description_EN || entity.descriptionEn || '';
  }
  return entity.Description_EN || entity.descriptionEn || entity.description || entity.Description_AR || entity.descriptionAr || '';
};
