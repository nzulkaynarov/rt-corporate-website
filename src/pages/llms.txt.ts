/**
 * /llms.txt (llmstxt.org): a short Markdown guide for AI assistants and AI search — who RailTech is, how to reach it
 * and the main pages with one line each. Built from the same data as the site (company.json, seo.json, services,
 * partners, news), so it never goes stale. Untranslated pages are not listed in UZ/EN (same rule as the sitemap).
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { localeHref, localize, tField, type Lang } from '../i18n';
import { t } from '../i18n/ui';
import { cabinet, company, telegramUrl } from '../utils/company';
import { getFeed, getPartners } from '../utils/feed';
import { siteSeo, absoluteUrl } from '../utils/seo';
import { entryLangs } from '../utils/stage';

export const GET: APIRoute = async ({ site }) => {
  const url = (route: string, lang: Lang) => absoluteUrl(localeHref(route, lang), site);
  const services = (await getCollection('services')).sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99));
  const partners = (await getPartners()).filter((p) => p.articleSlug);
  const news = (await getFeed()).filter((e) => e.type !== 'partner');
  const line = (title: string, href: string, note?: string) => `- [${title}](${href})${note ? `: ${note}` : ''}`;
  const clean = (s: unknown) => String(s ?? '').replace(/\s+/g, ' ').trim();

  const section = (lang: Lang) => {
    const items = (list: string[]) => list.join('\n');
    return [
      `## ${t(lang, 'nav.services')}`,
      items(services.map((s) => line(tField(s.data, 'title', lang) as string, url(`/services/${s.slug}/`, lang), clean(tField(s.data, 'summary', lang))))),
      '',
      `## ${t(lang, 'nav.partners')}`,
      line(t(lang, 'nav.partners'), url('/partners/', lang)),
      items(
        partners.map((p) => {
          const d = localize(p.data, lang) as Record<string, any>;
          return line(clean(d.name), url(`/news/${p.articleSlug}/`, lang), clean(tField(d, 'summary', lang)));
        }),
      ),
      '',
      `## ${t(lang, 'nav.news')}`,
      items(
        news
          .filter((e) => entryLangs('news', e.data, e.body).includes(lang))
          .map((e) => {
            const d = localize(e.data, lang) as Record<string, any>;
            return line(clean(tField(d, 'title', lang)), url(`/news/${e.slug}/`, lang), `${e.data.date}. ${clean(tField(d, 'summary', lang))}`);
          }),
      ),
      '',
      `## ${t(lang, 'nav.contacts')}`,
      line(t(lang, 'nav.contacts'), url('/contacts/', lang)),
    ].join('\n');
  };

  const seo = siteSeo('ru');
  const body = [
    `# ${company.brandName}`,
    '',
    `> ${clean(seo.organizationDescription)}`,
    '',
    `- ${tField(company, 'fullName', 'ru')}`,
    `- ${company.phone} · ${company.email}${company.telegramBot ? ` · ${telegramUrl()}` : ''}`,
    `- ${t('ru', 'nav.cabinet')}: ${cabinet.loginUrl}`,
    `- O'zbekcha: ${url('/', 'uz')} · English: ${url('/', 'en')}`,
    '',
    section('ru'),
    '',
    '# English',
    '',
    `> ${clean(siteSeo('en').organizationDescription)}`,
    '',
    section('en'),
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
