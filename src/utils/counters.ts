import { getCollection } from 'astro:content';
import globalData from '../data/cms/global.json';

/**
 * Site counters computed at build time from the catalog, so figures in texts never drift from the data.
 *
 *   items         — catalog entries (src/content/catalog)
 *   categories    — distinct catalog categories
 *   manufacturers — distinct `manufacturer` values in the catalog + names in global.json → manufacturers
 *   years, partners — not derivable from the catalog: global.json → metrics (editable in /admin)
 *
 * In any CMS text rendered through <I18nText> write a placeholder:
 *   {items}                                  → 313
 *   {items|позиция|позиции|позиций}          → 313 позиций   (RU: forms for 1 / 2–4 / 5+)
 *   {items|item|items}                       → 313 items      (EN: singular / plural)
 *   {manufacturers|производитель|производителя|производителей}
 */
export interface Counters {
  items: number;
  categories: number;
  manufacturers: number;
  years: string;
  partners: string;
}

let cache: Promise<Counters> | undefined;

export function getCounters(): Promise<Counters> {
  return (cache ??= compute());
}

async function compute(): Promise<Counters> {
  const entries = await getCollection('catalog');
  const makers = new Set<string>();
  for (const e of entries) if (e.data.manufacturer) makers.add(e.data.manufacturer.trim());
  for (const m of (globalData as any).manufacturers || []) if (m?.name) makers.add(String(m.name).trim());
  const categories = new Set(entries.map((e) => e.data.category || e.data.subsystem).filter(Boolean));
  const metrics = (globalData as any).metrics || {};
  return {
    items: entries.length,
    categories: categories.size,
    manufacturers: makers.size,
    years: metrics.years || '',
    partners: metrics.partners || '',
  };
}

function plural(n: number, forms: string[]): string {
  if (forms.length >= 3) {
    const n10 = n % 10;
    const n100 = n % 100;
    if (n10 === 1 && n100 !== 11) return forms[0];
    if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return forms[1];
    return forms[2];
  }
  if (forms.length === 2) return n === 1 ? forms[0] : forms[1];
  return forms[0] || '';
}

const PLACEHOLDER = /\{(items|categories|manufacturers|years|partners)((?:\|[^|{}]+)*)\}/g;

/** Replaces counter placeholders in a text; texts without placeholders are returned unchanged. */
export function fillCounters(text: string, c: Counters): string {
  if (!text || !text.includes('{')) return text;
  return text.replace(PLACEHOLDER, (_, key: keyof Counters, rest: string) => {
    const value = c[key];
    const forms = rest ? rest.slice(1).split('|') : [];
    if (!forms.length || typeof value !== 'number') return String(value);
    return `${value} ${plural(value, forms)}`;
  });
}
