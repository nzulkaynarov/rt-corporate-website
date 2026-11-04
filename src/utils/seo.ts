/**
 * SEO helpers. All texts come from the CMS:
 *   - static pages → src/data/cms/seo.json  (pages.<key>.title / description [+ _uz/_en])
 *   - collection entries → optional seoTitle / seoDescription [+ _uz/_en] fields,
 *     falling back to the entry title + site suffix and its summary.
 */
import seoData from '../data/cms/seo.json';
import { pick, tField, type Lang } from '../i18n';
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

/** Meta for a static page from seo.json. */
export function pageSeo(key: SeoPageKey, lang: Lang): SeoMeta {
  const page = seoData.pages[key] as Record<string, string>;
  return { title: tField(page, 'title', lang), description: tField(page, 'description', lang) };
}

/** Site-wide SEO settings (site name, organisation description, knowsAbout…) in the page language. */
export function siteSeo(lang: Lang) {
  const s = seoData as Record<string, any>;
  return {
    siteName: tField(s, 'siteName', lang) as string,
    // CMS trims whitespace on save, so the separator space is added here
    titleSuffix: s.titleSuffix ? ` ${String(s.titleSuffix).trim()}` : '',
    defaultImage: (s.defaultImage as string) || '/og-cover.png',
    organizationDescription: tField(s, 'organizationDescription', lang) as string,
    knowsAbout: pick<string[]>(lang, s.knowsAbout || [], s.knowsAbout_uz, s.knowsAbout_en),
  };
}

/**
 * Meta for a collection entry (services, news).
 * Explicit seoTitle/seoDescription win; otherwise title + site suffix (cut to 60) and the summary (cut to 160).
 */
export function entrySeo(data: Record<string, any>, lang: Lang, body?: string): SeoMeta {
  const { titleSuffix } = siteSeo(lang);
  let title = plainText(tField(data, 'seoTitle', lang));
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
