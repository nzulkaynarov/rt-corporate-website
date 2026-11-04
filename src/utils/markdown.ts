/**
 * Markdown bodies of collection entries (RU body, body_uz, body_en) → HTML for the page language.
 *
 * Content authors write internal links as language-neutral routes (`/catalog/rt-saf-001/`,
 * docs/content/SEO.md §5) and images as public paths (`/images/...`). Here they become
 * BASE- and language-prefixed (localeHref / withBase), external links open in a new tab.
 *
 * What editors can use in a body (docs/content/README.md → «Оформление текста»):
 * - quote `> …`, lists, tables, subheadings `###`;
 * - image `![описание](/images/uploads/x.jpg "подпись")` → <figure> with a caption (the title);
 * - several images in one paragraph (one after another) → a small gallery grid;
 * - footnote `текст[^1]` + `[^1]: пояснение` → numbered notes at the end of the text.
 */
import { Marked } from 'marked';
import markedFootnote from 'marked-footnote';
import { localeHref, type Lang } from '../i18n';
import { t } from '../i18n/ui';
import { withBase } from './url';

const parsers = new Map<Lang, Marked>();
function parser(lang: Lang): Marked {
  let m = parsers.get(lang);
  if (!m) {
    m = new Marked().use(
      markedFootnote({
        description: t(lang, 'prose.footnotes'),
        backRefLabel: t(lang, 'prose.footnoteBack', { n: '{0}' }),
        headingClass: 'visually-hidden',
        prefixId: 'note-',
      }),
    );
    parsers.set(lang, m);
  }
  return m;
}

const IMG = /<img\b[^>]*>/g;
/** `<p>` holding only images: one → <figure> with the title as caption; several → gallery grid. */
function figures(html: string): string {
  return html.replace(/<p>((?:\s*<img\b[^>]*>\s*)+)<\/p>/g, (_m, inner: string) => {
    const imgs = inner.match(IMG) || [];
    const figure = (img: string) => {
      const title = img.match(/\btitle="([^"]*)"/)?.[1];
      const clean = img.replace(/\s*\btitle="[^"]*"/, '').replace(/<img\b/, '<img loading="lazy" decoding="async"');
      return `<figure class="fig">${clean}${title ? `<figcaption>${title}</figcaption>` : ''}</figure>`;
    };
    const html = imgs.map(figure).join('');
    return imgs.length > 1 ? `<div class="fig-grid">${html}</div>` : html;
  });
}

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
  return localizeHtml(figures(await parser(lang).parse(markdown)), lang);
}
