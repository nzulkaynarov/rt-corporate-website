/**
 * SEO helpers. All texts come from the CMS:
 *   - static pages → src/data/cms/seo.json  (pages.<key>.title / description; translations in the uz/en blocks)
 *   - collection entries → optional seoTitle / seoDescription fields (and their uz/en block values),
 *     falling back to the entry title + site suffix and its summary.
 */
import seoData from '../data/cms/seo.json';
import { localize, tField, type Lang } from '../i18n';
import { withBase } from './url';

export interface SeoMeta {
  title: string;
  description: string;
}

export type SeoPageKey = keyof typeof seoData.pages;

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;

/** Strips Markdown/HTML and collapses whitespace. */
export function plainText(value: unknown): string {
  return String(value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~]+/g, ' ') // «|» is kept: titles use it as a separator
    .replace(/\s+/g, ' ')
    .trim();
}

/** Cuts text at a word boundary to fit `max` characters (adds an ellipsis when cut). */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:—-]+$/, '')}…`;
}

/**
 * « | RailTech» is added by the site, never typed in the CMS: appended when the title does not name the brand
 * already and still fits 60 characters.
 */
function withSuffix(title: string, lang: Lang): string {
  const { siteName, titleSuffix } = siteSeo(lang);
  if (!title || (siteName && title.includes(siteName))) return title;
  return title.length + titleSuffix.length <= TITLE_MAX ? title + titleSuffix : title;
}

/** Meta for a static page from seo.json. */
export function pageSeo(key: SeoPageKey, lang: Lang): SeoMeta {
  const page = localize(seoData, lang).pages[key] as Record<string, string>;
  return { title: withSuffix(tField(page, 'title', lang), lang), description: tField(page, 'description', lang) };
}

/** Site-wide SEO settings (site name, organisation description, knowsAbout…) in the page language. */
export function siteSeo(lang: Lang) {
  const s = localize(seoData, lang) as Record<string, any>;
  return {
    siteName: tField(s, 'siteName', lang) as string,
    // CMS trims whitespace on save, so the separator space is added here
    titleSuffix: s.titleSuffix ? ` ${String(s.titleSuffix).trim()}` : '',
    defaultImage: (s.defaultImage as string) || '/og-cover.png',
    organizationDescription: tField(s, 'organizationDescription', lang) as string,
    knowsAbout: (s.knowsAbout || []) as string[],
  };
}

/**
 * Meta for a collection entry (services, news).
 * Explicit seoTitle/seoDescription win; otherwise title + site suffix (cut to 60) and the summary (cut to 160).
 */
export function entrySeo(data: Record<string, any>, lang: Lang, body?: string): SeoMeta {
  const { titleSuffix } = siteSeo(lang);
  let title = withSuffix(plainText(tField(data, 'seoTitle', lang)), lang);
  if (!title) {
    const base = plainText(tField(data, 'title', lang));
    title = base.length + titleSuffix.length <= TITLE_MAX ? base + titleSuffix : truncate(base, TITLE_MAX);
  }
  const description =
    plainText(tField(data, 'seoDescription', lang)) || plainText(tField(data, 'summary', lang)) || plainText(body);
  return { title, description: truncate(description, DESCRIPTION_MAX) };
}

/** Absolute URL on the production site (respects BASE_URL). Accepts routes, asset paths or full URLs. */
export function absoluteUrl(path: string, site: URL | string | undefined): string {
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(withBase(path), String(site)).href;
}
