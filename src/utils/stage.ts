/**
 * Translation stage (src/data/content-stage.json, docs/ARCHITECTURE.md §3).
 * - `ruOnly: true` — the whole site is RU-first: UZ/EN pages show Russian, are noindex and out of the sitemap.
 * - `ruOnlySections: ["news"]` — those sections are still Russian on /uz/ and /en/: their content is rendered in RU
 *   (stale or partial translations are never shown), the pages are noindex and announce only the RU version.
 */
import stage from '../data/content-stage.json';
import { DEFAULT_LANG, LANGS, type Lang } from '../i18n';

export const RU_ONLY = stage.ruOnly === true;
const SECTIONS: readonly string[] = (stage as { ruOnlySections?: string[] }).ruOnlySections ?? [];

/** Section of a route: '/news/x/' → 'news', '/' → ''. */
const sectionOf = (route: string) => route.split('/')[1] || '';

export function isRuOnlySection(section: string): boolean {
  return RU_ONLY || SECTIONS.includes(section);
}

/** Languages in which a route really exists (for hreflang, noindex and the sitemap). */
export function routeLangs(route: string): readonly Lang[] {
  return isRuOnlySection(sectionOf(route)) ? [DEFAULT_LANG] : LANGS;
}

/** Language to read a section's content in: the page language, or RU while the section is not translated. */
export function contentLang(lang: Lang, section: string): Lang {
  return isRuOnlySection(section) ? DEFAULT_LANG : lang;
}
