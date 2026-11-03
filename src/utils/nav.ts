import globalData from '../data/cms/global.json';
import { pick, type Lang } from '../i18n';

/**
 * Section label from the CMS main menu (global.json → navigation), so breadcrumbs,
 * page headers and schema.org BreadcrumbList always match the menu wording.
 *   navLabel('/catalog/', 'uz') → 'KATALOG'
 */
export function navLabel(path: string, lang: Lang): string {
  const norm = (p: string) => `/${p.replace(/^\/+|\/+$/g, '')}/`;
  const item = (globalData.navigation || []).find((n: any) => norm(n.path) === norm(path)) as any;
  if (!item) throw new Error(`[nav] No navigation item for "${path}" in src/data/cms/global.json`);
  return pick(lang, item.label, item.label_uz, item.label_en);
}

/** Same as navLabel but as an { ru, uz, en } object for components that take trilingual props. */
export function navLabels(path: string) {
  return { ru: navLabel(path, 'ru'), uz: navLabel(path, 'uz'), en: navLabel(path, 'en') };
}
