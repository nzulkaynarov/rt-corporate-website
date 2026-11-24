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
/** YYYY-MM-DD; the CMS writes it unquoted (`date: 2026-04-20`), which YAML reads as a Date — normalized to the string. */
const isoDate = z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.date().transform((d) => d.toISOString().slice(0, 10))]);
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
    /** news — новость; article — статья; project — проект. Articles about partners live in the `partners` collection. */
    type: z.enum(['news', 'article', 'project']),
    date: isoDate,
    /** Optional cover image (path under /public, e.g. /images/news/<slug>.jpg). Without it a neutral plate is shown. */
    cover: z.string().optional(),
    /** Partners (file names in src/content/partners) this material is about. */
    partners: z.array(z.string()).default([]),
    /** Services (file names in src/content/services) this material is about; links to /services/<slug>/ count too. */
    services: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    ...newsShape,
    uz: block(newsShape),
    en: block(newsShape),
  }),
});

const partnerShape = {
  /** Brand on the tile and in headings: «Siemens Mobility». */
  name: z.string(),
  /** Legal entity the status belongs to: «Siemens Mobility GmbH». */
  legalName: z.string(),
  ...newsShape,
  title: z.string().optional(),
  summary: z.string().optional(),
};

/**
 * Manufacturer-partner: one record = the tile on the home page + the article at /news/partner-<id>/ (file name = id).
 * The article appears (and the tile becomes a link) once title and text are written.
 */
const partners = defineCollection({
  type: 'content',
  schema: z.object({
    lang: locales,
    ...partnerShape,
    /** Group the company belongs to, if any: «Siemens AG». */
    group: z.string().optional(),
    /** Trade marks and product lines of the company (shown under the article heading). */
    brands: z.array(z.string()).default([]),
    /** Manufacturer's logo (path under /public, SVG or transparent PNG): shown on the tile and in the article card. */
    logo: z.string().optional(),
    /** ISO 3166-1 alpha-2; names come from the interface strings country.<code> (src/data/cms/ui/countries.json). */
    country: z.string().regex(/^[A-Z]{2}$/),
    /** dealer — only with the manufacturer's document; direct — direct supplies. The basis is never published. */
    status: z.enum(['dealer', 'direct']),
    order: z.number().default(99),
    date: isoDate.optional(),
    cover: z.string().optional(),
    uz: block(partnerShape),
    en: block(partnerShape),
  }),
});

export const collections = { services, news, partners };
