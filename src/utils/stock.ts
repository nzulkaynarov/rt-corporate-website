import type { Lang } from '../i18n';

/**
 * Stock status of a catalog item — ONE implementation for the product page, the catalog
 * table, the gallery badge, the home page and schema.org availability.
 *
 * Source of truth: the RU `status` select editors see in /admin (values mirror the enum in
 * src/content/config.ts). `statusKey` is only used when `status` is empty, so the two CMS
 * fields can no longer contradict each other on different pages.
 * Label: per-item `status_uz` / `status_en` override, otherwise the dictionary label
 * `catalog.status.<key>` (src/data/cms/ui/catalog.json).
 */
export const STOCK_KEYS = ['in_stock', 'reserved', 'on_order'] as const;
export type StockKey = (typeof STOCK_KEYS)[number];

const STATUS_TO_KEY: Record<string, StockKey> = {
  'в наличии': 'in_stock',
  'резерв': 'reserved',
  'под заказ': 'on_order',
};

export interface StockFields {
  status?: string;
  status_uz?: string;
  status_en?: string;
  statusKey?: string;
}

export function stockKey(item: StockFields): StockKey {
  const fromStatus = item.status ? STATUS_TO_KEY[item.status.trim().toLowerCase()] : undefined;
  if (fromStatus) return fromStatus;
  return (STOCK_KEYS as readonly string[]).includes(item.statusKey || '') ? (item.statusKey as StockKey) : 'in_stock';
}

export function stockLabel(item: StockFields, lang: Lang, t: (lang: Lang, key: string) => string): string {
  const override = lang === 'uz' ? item.status_uz : lang === 'en' ? item.status_en : undefined;
  return override || t(lang, `catalog.status.${stockKey(item)}`);
}

/** schema.org Offer availability for the stock key. */
export const STOCK_SCHEMA: Record<StockKey, string> = {
  in_stock: 'https://schema.org/InStock',
  reserved: 'https://schema.org/LimitedAvailability',
  on_order: 'https://schema.org/PreOrder',
};
