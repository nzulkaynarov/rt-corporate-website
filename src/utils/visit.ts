/**
 * Where a visit came from, for the lead form (docs/ARCHITECTURE.md §5): the first page of the visit, the site the
 * visitor came from (origin only) and the utm_* marks of the link. Kept in sessionStorage of the open tab only —
 * gone when the tab is closed; no cookies. Pure functions here (unit-tested); src/scripts/visit.ts records on every page.
 */
export interface Visit {
  /** Path of the first page of the visit, e.g. /rt-corporate-website/news/partner-grabba/ */
  landing: string;
  /** Origin of an external referrer (https://www.google.com), '' for direct visits and own pages. */
  referrer: string;
  /** utm_source, utm_medium, utm_campaign, utm_term, utm_content — as given in the link. */
  utm: Record<string, string>;
  /** Language of the first page (ru / uz / en). */
  lang: string;
}

export const VISIT_KEY = 'rt-visit';
const UTM = /^utm_(source|medium|campaign|term|content)$/;

/** The visit as seen on the first page: href of the page, document.referrer, <html lang>. */
export function visitFrom(href: string, referrer: string, htmlLang: string): Visit {
  const url = new URL(href);
  const utm: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    if (UTM.test(key) && value) utm[key] = value.slice(0, 255);
  });
  let ref = '';
  try {
    const r = new URL(referrer);
    if (r.host !== url.host && /^https?:$/.test(r.protocol)) ref = r.origin;
  } catch {
    /* no referrer */
  }
  return { landing: url.pathname.slice(0, 1024), referrer: ref, utm, lang: htmlLang.slice(0, 2).toLowerCase() };
}

type Store = Pick<Storage, 'getItem' | 'setItem'>;

/** Records the visit once per tab: later pages of the same visit do not overwrite it. */
export function recordVisit(store: Store, visit: Visit): void {
  if (!store.getItem(VISIT_KEY)) store.setItem(VISIT_KEY, JSON.stringify(visit));
}

export function readVisit(store: Store | undefined): Visit | null {
  try {
    const raw = store?.getItem(VISIT_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<Visit>;
    if (typeof v.landing !== 'string') return null;
    return { landing: v.landing, referrer: String(v.referrer || ''), utm: v.utm && typeof v.utm === 'object' ? v.utm : {}, lang: String(v.lang || '') };
  } catch {
    return null;
  }
}
