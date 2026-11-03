/**
 * Server-side (Astro) access to ALL interface dictionaries in src/data/cms/ui/*.json.
 * React islands must NOT import this file (it would bundle every dictionary) —
 * they import only their own JSON and call makeT([thatJson]).
 */
import { makeT, type UiFile } from './dictionary';
import type { Lang } from './index';

const modules = import.meta.glob<{ default: UiFile }>('../data/cms/ui/*.json', { eager: true });

export const t = makeT(Object.values(modules).map((m) => m.default));

/** Convenience for Astro files: const tr = translator(lang); tr('catalog.sku') */
export function translator(lang: Lang) {
  return (key: string, vars?: Record<string, string | number>) => t(lang, key, vars);
}

export type { Lang } from './index';
export { LANGS, DEFAULT_LANG } from './index';
