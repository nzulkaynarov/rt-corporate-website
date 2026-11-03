import { isLang, DEFAULT_LANG, type Lang } from '../i18n';

/**
 * Page language for React islands.
 *
 * Every page is a separate static URL per language (/, /uz/, /en/), so the language
 * never changes while an island is mounted. Pages pass it as a prop:
 *   <CatalogFilterTable client:load lang={lang} … />
 * and the island calls useLang(props.lang). The <html lang> fallback only covers
 * islands rendered without the prop.
 */
export function useLang(lang?: Lang): Lang {
  if (lang && isLang(lang)) return lang;
  if (typeof document !== 'undefined') {
    const htmlLang = document.documentElement.lang;
    if (isLang(htmlLang)) return htmlLang;
  }
  return DEFAULT_LANG;
}

export default useLang;
