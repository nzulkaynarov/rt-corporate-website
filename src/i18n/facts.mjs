// @ts-check
/**
 * Company facts in texts (docs/ARCHITECTURE.md §3): a text says `{phone}` instead of the number, and the site fills in
 * the value from src/data/cms/company.json in the page language. One fact lives in one place.
 *
 *   «Телефон: {phone}» → «Телефон: +998 90 118-90-00»
 *
 * Plain JavaScript: the site (src/i18n/index.ts) and scripts/check-content.mjs share the token list.
 */

/** Token → what it stands for (shown in CMS hints and check-content messages). */
export const FACT_TOKENS = {
  phone: 'телефон',
  email: 'e-mail',
  inn: 'ИНН',
  site: 'домен сайта',
  cabinet: 'адрес Кабинета без https://',
  foundedYear: 'год основания',
  officeAddress: 'адрес офиса',
  legalAddress: 'юридический адрес',
};

/** `{token}` in a text. */
export const TOKEN_RE = /\{([A-Za-z]+)\}/g;

/** @param {string} url */
const host = (url) => String(url || '').replace(/^https?:\/\//, '').replace(/\/.*$/, '');

/**
 * Token values in one language. `company` is company.json already localized to that language.
 * @param {Record<string, any>} company @returns {Record<string, string>}
 */
export function factsFrom(company) {
  return {
    phone: company.phone,
    email: company.email,
    inn: company.inn,
    site: company.siteDomain,
    cabinet: host(company.cabinet?.url),
    foundedYear: company.foundedYear,
    officeAddress: company.officeAddress,
    legalAddress: company.legalAddress,
  };
}

/**
 * Replaces known tokens in every string of a value (objects and lists included); unknown `{…}` stay as they are.
 * @template T @param {T} value @param {Record<string, string>} facts @returns {T}
 */
export function fillFacts(value, facts) {
  if (typeof value === 'string') {
    return /** @type {T} */ (value.replace(TOKEN_RE, (m, key) => (Object.hasOwn(facts, key) && facts[key] != null ? facts[key] : m)));
  }
  if (Array.isArray(value)) return /** @type {T} */ (value.map((v) => fillFacts(v, facts)));
  if (value && typeof value === 'object') {
    return /** @type {T} */ (Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fillFacts(v, facts)])));
  }
  return value;
}
