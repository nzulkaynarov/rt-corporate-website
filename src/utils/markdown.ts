/**
 * Markdown bodies of collection entries (RU body, body_uz, body_en) → HTML for the page language.
 *
 * Content authors write internal links as language-neutral routes (`/catalog/rt-saf-001/`,
 * docs/content/SEO.md §5) and images as public paths (`/images/...`). Here they become
 * BASE- and language-prefixed (localeHref / withBase), external links open in a new tab.
 */
import { marked } from 'marked';
import { localeHref, type Lang } from '../i18n';
import { withBase } from './url';

export function localizeHtml(html: string, lang: Lang): string {
  return html
    .replace(/<a\b([^>]*?)\bhref="([^"]*)"([^>]*)>/g, (_m, before: string, href: string, after: string) => {
      if (href.startsWith('/') && !href.startsWith('//')) return `<a${before}href="${localeHref(href, lang)}"${after}>`;
      if (/^https?:\/\//i.test(href) && !/\btarget=/.test(before + after)) {
        return `<a${before}href="${href}"${after} target="_blank" rel="noopener noreferrer">`;
      }
      return `<a${before}href="${href}"${after}>`;
    })
    .replace(/<img\b([^>]*?)\bsrc="(\/[^"/][^"]*)"/g, (_m, before: string, src: string) => `<img${before}src="${withBase(src)}"`);
}

export async function renderBody(markdown: string | undefined, lang: Lang): Promise<string> {
  if (!markdown?.trim()) return '';
  return localizeHtml(await marked.parse(markdown), lang);
}
