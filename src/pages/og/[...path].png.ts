/**
 * Social preview images (1200×630 PNG), built once per page language: `/og/<lang>/news/<slug>.png` for every
 * material of «Новости» (partner articles too) and `/og/<lang>/services/<slug>.png` for the four services.
 * The page passes the path to BaseLayout (`image`) unless the material has its own cover. Card: src/utils/og.ts.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { LANGS, localize, tField, type Lang } from '../../i18n';
import { t } from '../../i18n/ui';
import { getFeed, getPartners } from '../../utils/feed';
import { formatDate } from '../../utils/format';
import { renderOgPng, type OgCard } from '../../utils/og';
import { entryContentLang } from '../../utils/stage';
import { company } from '../../utils/company';

export const getStaticPaths: GetStaticPaths = async () => {
  const feed = await getFeed();
  const partners = await getPartners();
  const services = await getCollection('services');
  const paths: { params: { path: string }; props: { card: Omit<OgCard, 'brand' | 'site'> } }[] = [];
  for (const lang of LANGS as readonly Lang[]) {
    for (const entry of feed) {
      // Same content language as the page: an untranslated material is shown (and previewed) in Russian.
      const cl = entryContentLang(lang, 'news', entry.data, entry.body);
      const d = localize(entry.data, cl) as Record<string, any>;
      // One manufacturer named → its logo on the card (a partner article names exactly its own partner).
      const ids: string[] = entry.data.partners || [];
      const logo = ids.length === 1 ? partners.find((p) => p.id === ids[0])?.data.logo : undefined;
      paths.push({
        params: { path: `${lang}/news/${entry.slug}` },
        props: {
          card: {
            eyebrow: t(lang, entry.type === 'partner' ? 'nav.partners' : `news.type.${entry.type}`),
            title: tField(d, 'title', cl) as string,
            meta: entry.type === 'partner' ? undefined : formatDate(String(entry.data.date), lang),
            logo,
          },
        },
      });
    }
    for (const s of services) {
      paths.push({
        params: { path: `${lang}/services/${s.slug}` },
        props: { card: { eyebrow: t(lang, 'nav.services'), title: tField(s.data, 'title', lang) as string, lead: tField(s.data, 'summary', lang) as string } },
      });
    }
  }
  return paths;
};

export const GET: APIRoute = async ({ props, site }) => {
  const png = await renderOgPng({ ...(props.card as OgCard), brand: company.brandName, site: site ? site.host : '' });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
