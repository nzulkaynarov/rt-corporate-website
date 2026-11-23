import { defineCollection, z } from 'astro:content';

/**
 * Content collections of railtech.uz — see docs/ARCHITECTURE.md §3.
 * Russian values live at the root of the front matter; translations live in `uz` / `en` locale blocks with the same
 * field names (Sveltia CMS i18n, structure `single_file_default_root`; read with `localize()` / `tField()`).
 * `lang` lists the locales enabled for the entry and is maintained by the CMS.
 * The CMS schema in public/admin/config.yml must declare the same fields (checked by scripts/validate-cms-config.mjs).
 */
const seoFields = { seoTitle: z.string().optional(), seoDescription: z.string().optional() };

const textItem = z.object({ title: z.string(), text: z.string() });
const faqItem = z.object({ q: z.string(), a: z.string() });
const locales = z.array(z.enum(['ru', 'uz', 'en'])).optional();

/** A locale block: the same fields as the root, all optional (empty → the RU value is shown), plus the body. */
const block = <S extends z.ZodRawShape>(shape: S) => z.object(shape).partial().extend({ body: z.string().optional() }).optional();

const serviceShape = {
  title: z.string(),
  /** One sentence for cards and the meta description. */
  summary: z.string(),
  /** Lead paragraph under the H1. */
  lead: z.string(),
  /** «Коротко» box next to the lead: label → value. */
  highlights: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  /** «Как работаем» — a real sequence, shown numbered. */
  steps: z.array(textItem).default([]),
  /** «Что вы получаете» / «Что получает партнёр». */
  benefits: z.array(textItem).default([]),
  /** «Что нужно от партнёра» (requirements), optional. */
  requirements: z.array(textItem).default([]),
  faq: z.array(faqItem).default([]),
  ...seoFields,
};

const services = defineCollection({
  type: 'content',
  schema: z.object({
    lang: locales,
    /** Who the service is for: customers (заказчикам) or partners (производителям и партнёрам). */
    audience: z.enum(['customers', 'partners']),
    order: z.number().default(1),
    ...serviceShape,
    uz: block(serviceShape),
    en: block(serviceShape),
  }),
});

const galleryItem = z.object({ image: z.string(), alt: z.string().optional() });
const newsShape = {
  title: z.string(),
  summary: z.string(),
  ...seoFields,
  coverAlt: z.string().optional(),
  /** Photo gallery under the text (path under /public + description); opens full screen on click. */
  gallery: z.array(galleryItem).default([]),
};

const news = defineCollection({
  type: 'content',
  schema: z.object({
    lang: locales,
    /** news — новость; article — статья; project — проект; partner — статья о партнёре (plitka on the home page links here). */
    type: z.enum(['news', 'article', 'project', 'partner']),
    /**
     * ISO date YYYY-MM-DD. The CMS writes it unquoted (`date: 2026-04-20`), which YAML reads as a Date: both forms
     * are accepted and normalized to the string.
     */
    date: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.date().transform((d) => d.toISOString().slice(0, 10))]),
    /** Optional cover image (path under /public, e.g. /images/news/<slug>.jpg). Without it a neutral plate is shown. */
    cover: z.string().optional(),
    /** Partner ids from src/data/cms/partners.json this material is about. */
    partners: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    ...newsShape,
    uz: block(newsShape),
    en: block(newsShape),
  }),
});

export const collections = { services, news };
