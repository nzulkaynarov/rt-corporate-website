import { defineCollection, z } from 'astro:content';

/**
 * Content collections of railtech.uz — see docs/ARCHITECTURE.md §3.
 * Every translatable field exists as `field` (RU, required), `field_uz`, `field_en` (optional: empty → RU is shown).
 * The CMS schema in public/admin/config.yml must declare the same fields (checked by scripts/validate-cms-config.mjs).
 */
/** Spreads `{ name, name_uz?, name_en? }` into an object schema. */
function i18n<N extends string>(name: N, required = true) {
  const s = z.string();
  return {
    [name]: required ? s : s.optional(),
    [`${name}_uz`]: s.optional(),
    [`${name}_en`]: s.optional(),
  } as unknown as Record<N | `${N}_uz` | `${N}_en`, z.ZodTypeAny>;
}

const seoFields = { ...i18n('seoTitle', false), ...i18n('seoDescription', false) };

const textItem = z.object({ ...i18n('title'), ...i18n('text') });
const faqItem = z.object({ ...i18n('q'), ...i18n('a') });

const services = defineCollection({
  type: 'content',
  schema: z.object({
    /** Who the service is for: customers (заказчикам) or partners (производителям и партнёрам). */
    audience: z.enum(['customers', 'partners']),
    order: z.number().default(1),
    ...i18n('title'),
    /** One sentence for cards and the meta description. */
    ...i18n('summary'),
    /** Lead paragraph under the H1. */
    ...i18n('lead'),
    /** «Коротко» box next to the lead: label → value. */
    highlights: z.array(z.object({ ...i18n('label'), ...i18n('value') })).default([]),
    /** «Как работаем» — a real sequence, shown numbered. */
    steps: z.array(textItem).default([]),
    /** «Что вы получаете» / «Что получает партнёр». */
    benefits: z.array(textItem).default([]),
    /** «Что нужно от партнёра» (requirements), optional. */
    requirements: z.array(textItem).default([]),
    faq: z.array(faqItem).default([]),
    body_uz: z.string().optional(),
    body_en: z.string().optional(),
    ...seoFields,
  }),
});

const news = defineCollection({
  type: 'content',
  schema: z.object({
    /** news — новость; article — статья; project — проект; partner — статья о партнёре (plitka on the home page links here). */
    type: z.enum(['news', 'article', 'project', 'partner']),
    /** ISO date YYYY-MM-DD. */
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    ...i18n('title'),
    ...i18n('summary'),
    /** Optional cover image (path under /public, e.g. /images/news/<slug>.jpg). Without it a neutral plate is shown. */
    cover: z.string().optional(),
    ...i18n('coverAlt', false),
    /** Partner ids from src/data/cms/partners.json this material is about. */
    partners: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    body_uz: z.string().optional(),
    body_en: z.string().optional(),
    ...seoFields,
  }),
});

export const collections = { services, news };
