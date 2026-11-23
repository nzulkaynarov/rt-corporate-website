/**
 * «Новости» feed and recommendations (docs/ARCHITECTURE.md §2–3).
 *
 * The feed joins two collections: `news` (news, articles, projects) and `partners` — a partner is one record with
 * its tile and its article; the article appears in the feed as type `partner` at /news/partner-<id>/ once its text
 * is written. Recommendations are computed, nobody links materials by hand:
 *   - a partner page lists the materials that name the partner (`partners` field of a news entry);
 *   - a service page lists the materials about the service — chosen in the CMS (`services`) or linked from the text;
 *   - a material recommends others with the same partners first, then the same services, then the newest.
 */
import { getCollection } from 'astro:content';

export type FeedType = 'news' | 'article' | 'project' | 'partner';

export interface FeedItem {
  /** Route slug under /news/: the news file name, or `partner-<id>` for a partner article. */
  slug: string;
  type: FeedType;
  /** Entry data as stored (RU at the root, uz/en blocks), with `type` and `partners` filled for partner articles. */
  data: Record<string, any>;
  /** RU Markdown body. */
  body: string;
  /** Partner id when the item is a partner article. */
  partnerId?: string;
}

export interface Partner {
  id: string;
  data: Record<string, any>;
  body: string;
  /** Route slug of the partner article under /news/, when its text is written. */
  articleSlug?: string;
}

export const partnerSlug = (id: string) => `partner-${id}`;

const hasArticle = (data: Record<string, any>, body: string) => Boolean(body.trim() && data.title);

/** Partners in tile order. */
export async function getPartners(): Promise<Partner[]> {
  return (await getCollection('partners'))
    .map((e) => ({ id: e.slug, data: e.data as Record<string, any>, body: e.body, articleSlug: hasArticle(e.data, e.body) ? partnerSlug(e.slug) : undefined }))
    .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99) || a.id.localeCompare(b.id));
}

/** All materials of «Новости», newest first (same date → by slug, so the order is stable). */
export async function getFeed(): Promise<FeedItem[]> {
  const news: FeedItem[] = (await getCollection('news')).map((e) => ({ slug: e.slug, type: e.data.type, data: e.data as Record<string, any>, body: e.body }));
  const partners: FeedItem[] = (await getPartners())
    .filter((p) => p.articleSlug)
    .map((p) => ({ slug: p.articleSlug!, type: 'partner', data: { ...p.data, type: 'partner', partners: [p.id] }, body: p.body, partnerId: p.id }));
  return [...news, ...partners].sort((a, b) => String(b.data.date).localeCompare(String(a.data.date)) || a.slug.localeCompare(b.slug));
}

const SERVICE_LINK = /\]\(\/services\/([a-z0-9-]+)\/?(?:#[^)]*)?\)/g;

/** Services a material is about: chosen in the CMS (`services`) or linked from its text as /services/<slug>/. */
export function servicesOf(item: FeedItem): string[] {
  const text = [item.body, item.data.uz?.body, item.data.en?.body].filter(Boolean).join('\n');
  const linked = [...text.matchAll(SERVICE_LINK)].map((m) => m[1]);
  return [...new Set([...(item.data.services || []), ...linked])];
}

/** Materials that name a partner (for the partner page), newest first. */
export function materialsOfPartner(id: string, feed: FeedItem[], limit = 3): FeedItem[] {
  return feed.filter((o) => o.partnerId !== id && (o.data.partners || []).includes(id)).slice(0, limit);
}

/** Materials about a service (for the service page), newest first. */
export function materialsOfService(slug: string, feed: FeedItem[], limit = 3): FeedItem[] {
  return feed.filter((o) => servicesOf(o).includes(slug)).slice(0, limit);
}

/** Recommendations under a material: shared partners weigh most, then shared services, then recency. */
export function relatedTo(item: FeedItem, feed: FeedItem[], limit = 3): FeedItem[] {
  const partners = new Set<string>(item.data.partners || []);
  const services = new Set(servicesOf(item));
  return feed
    .filter((o) => o.slug !== item.slug)
    .map((o, i) => ({
      o,
      i,
      score: 3 * (o.data.partners || []).filter((p: string) => partners.has(p)).length + 2 * servicesOf(o).filter((s) => services.has(s)).length,
    }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, limit)
    .map((x) => x.o);
}
