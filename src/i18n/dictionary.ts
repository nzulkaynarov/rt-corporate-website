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
 * Builds a translator over one or more UI files. A missing key throws during the build
 * (SSR); in the browser it logs and returns ''. scripts/validate-cms-config.mjs also checks
 * at build time that every key used in src/ exists, so a string deleted in the CMS
 * fails the deploy instead of breaking an event handler on the live site.
 * Values may contain {placeholders}: t('lead.subject.sku', { sku: 'RT-1' }).
 */
export function makeT(files: UiFile[]) {
  const map = new Map<string, UiString>();
  for (const file of files) {
    for (const s of file?.strings || []) map.set(s.key, s);
  }
  return function t(lang: Lang, key: string, vars?: Record<string, string | number>): string {
    const entry = map.get(key);
    if (!entry) {
      const message = `[i18n] Missing UI string "${key}" (add it to src/data/cms/ui/*.json)`;
      // Build/SSR: fail loudly. In the browser (hydrated islands, event handlers) never break the UI.
      if (import.meta.env.SSR) throw new Error(message);
      console.error(message);
      return '';
    }
    let value = (lang === 'uz' && entry.uz) || (lang === 'en' && entry.en) || entry.ru;
    if (vars) value = value.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? String(vars[name]) : m));
    return value;
  };
}
