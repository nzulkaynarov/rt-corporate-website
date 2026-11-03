/**
 * RailTech i18n core.
 *
 * URL scheme (one language per HTML document — required for SEO/hreflang):
 *   ru (default) → /catalog/          (no prefix)
 *   uz           → /uz/catalog/
 *   en           → /en/catalog/
 *
 * The page language is resolved from the URL in `src/middleware.ts` and stored in
 * `Astro.locals.lang`. Astro components read it from there; React islands receive
 * it as a required `lang` prop. Nothing reads localStorage or `?lang=` any more
 * (legacy `?lang=` links are redirected client-side in BaseLayout).
 */

export type Lang = 'ru' | 'uz' | 'en';

export const LANGS: readonly Lang[] = ['ru', 'uz', 'en'] as const;
export const DEFAULT_LANG: Lang = 'ru';

export const LANG_META: Record<Lang, { short: string; name: string; hreflang: string; ogLocale: string }> = {
  ru: { short: 'RU', name: 'Русский', hreflang: 'ru', ogLocale: 'ru_RU' },
  uz: { short: 'UZ', name: "O'zbekcha", hreflang: 'uz', ogLocale: 'uz_UZ' },
  en: { short: 'EN', name: 'English', hreflang: 'en', ogLocale: 'en_US' },
};

export function isLang(value: unknown): value is Lang {
  return value === 'ru' || value === 'uz' || value === 'en';
}

/** BASE_URL without trailing slash ('' on the custom domain, '/rt-corporate-website' on GitHub Pages). */
export const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

const PASSTHROUGH = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\?)/i; // http:, https:, tel:, mailto:, data:, //cdn, #anchor, ?query

/** Removes BASE from a pathname: '/rt-corporate-website/uz/about/' → '/uz/about/'. */
function stripBase(pathname: string): string {
  if (BASE && (pathname === BASE || pathname.startsWith(`${BASE}/`))) {
    return pathname.slice(BASE.length) || '/';
  }
  return pathname || '/';
}

/** Language encoded in a URL pathname (with or without BASE). */
export function getLangFromPath(pathname: string): Lang {
  const seg = stripBase(pathname).split('/')[1];
  return isLang(seg) && seg !== DEFAULT_LANG ? seg : DEFAULT_LANG;
}

/** Language-neutral route of a pathname: '/rt-corporate-website/uz/about/' → '/about/'. */
export function getRouteFromPath(pathname: string): string {
  const path = stripBase(pathname);
  const seg = path.split('/')[1];
  if (isLang(seg) && seg !== DEFAULT_LANG) {
    return path.slice(seg.length + 1) || '/';
  }
  return path;
}

/** Adds a trailing slash to page routes (not to files like /og-cover.png, not before ?query/#hash). */
function withTrailingSlash(path: string): string {
  const match = path.match(/^([^?#]*)(.*)$/)!;
  let [, route, rest] = match;
  const last = route.split('/').pop() || '';
  if (!route.endsWith('/') && !last.includes('.')) route += '/';
  return route + rest;
}

/**
 * Localized, BASE-prefixed href for an internal page route.
 *   localeHref('/catalog/rt-rs-118', 'uz') → '/rt-corporate-website/uz/catalog/rt-rs-118/'
 * External URLs, anchors, tel:/mailto: are returned untouched.
 * Paths with a file extension (CMS links to PDFs etc.) get BASE only, without a language prefix.
 */
export function localeHref(path: string | undefined, lang: Lang): string {
  if (!path) return '';
  if (PASSTHROUGH.test(path)) return path;
  let route = path.startsWith('/') ? path : `/${path}`;
  route = getRouteFromPath(route); // tolerate already base-/lang-prefixed input
  // Files (PDF, images…) are language-neutral: BASE only, never /uz/ or /en/.
  if (/\.[a-z0-9]{2,5}$/i.test(route.split(/[?#]/)[0])) return `${BASE}${route}`;
  const prefix = lang === DEFAULT_LANG ? '' : `/${lang}`;
  const localized = withTrailingSlash(`${prefix}${route === '/' ? '/' : route}`);
  return `${BASE}${localized}`;
}

/** The same page in every language: { ru: '/about/', uz: '/uz/about/', en: '/en/about/' } (BASE-prefixed). */
export function alternateHrefs(pathname: string): Record<Lang, string> {
  const route = getRouteFromPath(pathname);
  return { ru: localeHref(route, 'ru'), uz: localeHref(route, 'uz'), en: localeHref(route, 'en') };
}

/** getStaticPaths() helper for `src/pages/[...lang]/` pages without other params. */
export function langStaticPaths() {
  return LANGS.map((lang) => ({ params: { lang: lang === DEFAULT_LANG ? undefined : lang } }));
}

/** getStaticPaths() helper: multiplies existing paths (e.g. one per content entry) by every language. */
export function expandLangs<P extends { params: Record<string, string | undefined>; props?: Record<string, unknown> }>(paths: P[]) {
  return LANGS.flatMap((lang) =>
    paths.map((p) => ({ ...p, params: { ...p.params, lang: lang === DEFAULT_LANG ? undefined : lang } })),
  );
}

/** Picks a translation with RU fallback (empty strings count as missing). */
export function pick<T = string>(lang: Lang, ru: T, uz?: T | null, en?: T | null): T {
  const isEmpty = (v: unknown) => v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);
  if (lang === 'uz' && !isEmpty(uz)) return uz as T;
  if (lang === 'en' && !isEmpty(en)) return en as T;
  return ru;
}

/** Localized CMS field with RU fallback: tField(entry, 'title', 'uz') → entry.title_uz || entry.title. */
export function tField<T extends Record<string, any>>(item: T | undefined | null, field: string, lang: Lang): any {
  if (!item) return '';
  return pick(lang, item[field] ?? '', item[`${field}_uz`], item[`${field}_en`]);
}

export { makeT, type UiFile, type UiString } from './dictionary';
