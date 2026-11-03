import type { Lang } from './index';

/**
 * Interface strings (buttons, labels, breadcrumbs…) live in CMS-editable JSON files
 * `src/data/cms/ui/<area>.json` with the shape:
 *   { "strings": [ { "key": "catalog.sku", "ru": "Артикул", "uz": "Artikul", "en": "Part No." } ] }
 * Editors change the texts in /admin → «Интерфейс»; developers add new keys in code + JSON.
 */
export interface UiString {
  key: string;
  ru: string;
  uz?: string;
  en?: string;
}
export interface UiFile {
  strings: UiString[];
}

/**
 * Builds a translator over one or more UI files. A missing key throws, so a typo
 * fails the build instead of silently printing the key on the live site.
 * Values may contain {placeholders}: t('lead.subject.sku', { sku: 'RT-1' }).
 */
export function makeT(files: UiFile[]) {
  const map = new Map<string, UiString>();
  for (const file of files) {
    for (const s of file?.strings || []) map.set(s.key, s);
  }
  return function t(lang: Lang, key: string, vars?: Record<string, string | number>): string {
    const entry = map.get(key);
    if (!entry) throw new Error(`[i18n] Missing UI string "${key}" (add it to src/data/cms/ui/*.json)`);
    let value = (lang === 'uz' && entry.uz) || (lang === 'en' && entry.en) || entry.ru;
    if (vars) value = value.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? String(vars[name]) : m));
    return value;
  };
}
