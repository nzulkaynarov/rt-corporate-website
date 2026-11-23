// @ts-check
/**
 * Locale blocks of CMS data (Sveltia CMS i18n, structure `single_file_default_root`; docs/ARCHITECTURE.md §3).
 *
 * A Markdown entry or CMS JSON file keeps the Russian values at the root and the translations in `uz` / `en` blocks:
 *
 *   lang: [ru, uz, en]            ← locales enabled for this entry (maintained by the CMS)
 *   title: Поставки               ← RU (default locale)
 *   steps: [{ title: Заявка, … }]
 *   uz: { title: Yetkazib berish, steps: [{ title: Ariza, … }], body: "…UZ Markdown…" }
 *   en: { … }
 *
 * Plain JavaScript so that both the site (Astro/TS) and the Node check scripts import the same rules.
 */

/** @param {unknown} v */
export const isEmpty = (v) =>
  v === undefined || v === null || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);

/** @param {unknown} v @returns {v is Record<string, any>} */
const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/** Keys that describe the locales, not content. */
export const LOCALE_KEYS = ['lang', 'uz', 'en'];

/**
 * Overlays a translation onto the RU value: non-empty translated values win, objects merge field by field,
 * lists of objects merge item by item (the CMS keeps them paired), lists of strings are replaced as a whole.
 * @param {any} ru @param {any} tr @returns {any}
 */
function overlay(ru, tr) {
  if (isEmpty(tr)) return ru;
  if (Array.isArray(ru) && Array.isArray(tr)) {
    if (ru.some(isObject)) return ru.map((item, i) => overlay(item, tr[i]));
    return tr;
  }
  if (isObject(ru) && isObject(tr)) {
    /** @type {Record<string, any>} */
    const out = { ...ru };
    for (const [k, v] of Object.entries(tr)) out[k] = k in ru ? overlay(ru[k], v) : v;
    return out;
  }
  return tr;
}

/**
 * Data in one language with RU fallback, without the locale keys:
 *   localize({ title: 'Услуги', uz: { title: 'Xizmatlar' } }, 'uz') → { title: 'Xizmatlar' }
 * The RU body of a Markdown entry is the file body; a translated body comes back as `body`.
 * @template {Record<string, any>} T
 * @param {T} data @param {string} lang @returns {T}
 */
export function localize(data, lang) {
  if (!isObject(data)) return data;
  /** @type {Record<string, any>} */
  const root = {};
  for (const [k, v] of Object.entries(data)) if (!LOCALE_KEYS.includes(k)) root[k] = v;
  const block = lang === 'ru' ? undefined : data[lang];
  return /** @type {T} */ (isObject(block) ? overlay(root, block) : root);
}

/**
 * Legacy flat view for the content rules (scripts/check-content.mjs): every translated value is copied next to
 * its RU field with a `_uz` / `_en` suffix (`uz.steps[0].title` → `steps[0].title_uz`, `uz.body` → `body_uz`).
 * @param {Record<string, any>} data @returns {Record<string, any>}
 */
export function toSuffixed(data) {
  if (!isObject(data)) return data;
  /** @type {Record<string, any>} */
  const out = structuredClone(Object.fromEntries(Object.entries(data).filter(([k]) => !LOCALE_KEYS.includes(k))));
  for (const lang of ['uz', 'en']) {
    if (isObject(data[lang])) spread(out, data[lang], lang);
  }
  return out;
}

/** @param {Record<string, any>} target @param {Record<string, any>} block @param {string} lang */
function spread(target, block, lang) {
  for (const [k, v] of Object.entries(block)) {
    const ru = target[k];
    if (Array.isArray(v) && Array.isArray(ru) && ru.some(isObject)) {
      v.forEach((item, i) => { if (isObject(item) && isObject(ru[i])) spread(ru[i], item, lang); });
    } else if (isObject(v) && isObject(ru)) {
      spread(ru, v, lang);
    } else if (!isObject(v)) {
      // Plain values and lists of strings; duplicated values (ids, links, images) equal the RU ones and are skipped.
      if (JSON.stringify(v) !== JSON.stringify(ru) || typeof v === 'string') target[`${k}_${lang}`] = v;
    }
  }
}

/**
 * Locales a «Новости» material (news entry or partner article) is really translated into: RU always; UZ/EN when the
 * CMS has the locale enabled (`lang`) and its block has the title and, if the RU text has a body, the body too.
 * An untranslated locale shows the Russian text, is noindex and stays out of the sitemap (src/utils/stage.ts).
 * @param {Record<string, any>} data front matter @param {string} [ruBody] RU Markdown body @returns {string[]}
 */
export function translatedLocales(data, ruBody = '') {
  const enabled = Array.isArray(data?.lang) ? data.lang : [];
  const out = ['ru'];
  for (const l of ['uz', 'en']) {
    const block = data?.[l];
    if (!enabled.includes(l) || !isObject(block) || isEmpty(block.title)) continue;
    if (String(ruBody).trim() && isEmpty(block.body)) continue;
    out.push(l);
  }
  return out;
}
