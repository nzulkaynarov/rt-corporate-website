import { defineCollection, z } from 'astro:content';

/** Universal trilingual key → value pair (product characteristics, service facts). */
const attributeSchema = z.object({
  label: z.string(),
  label_uz: z.string().optional(),
  label_en: z.string().optional(),
  value: z.string(),
  value_uz: z.string().optional(),
  value_en: z.string().optional(),
});

const catalogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    sku: z.string(),
    title: z.string(),
    title_uz: z.string().optional(),
    title_en: z.string().optional(),
    /** Any product category managed from CMS (e.g. «Подвижной состав», «Электроника», «Спецтехника»). */
    category: z.string().optional(),
    category_uz: z.string().optional(),
    category_en: z.string().optional(),
    /** Legacy alias of category kept for existing entries. */
    subsystem: z.string().optional(),
    subsystem_uz: z.string().optional(),
    subsystem_en: z.string().optional(),
    gost: z.string().optional(),
    tnved: z.string().optional(),
    attributes: z.array(attributeSchema).optional(),
    price: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    warehouse: z.string().default('Ташкент, Index B2-2097'),
    warehouse_uz: z.string().optional(),
    warehouse_en: z.string().optional(),
    status: z.enum(['В наличии', 'Резерв', 'Под заказ']).default('В наличии'),
    status_uz: z.string().optional(),
    status_en: z.string().optional(),
    statusKey: z.enum(['in_stock', 'reserved', 'on_order']).default('in_stock'),
    specs: z.string().optional(),
    specs_uz: z.string().optional(),
    specs_en: z.string().optional(),
    dimensions: z.string().optional(),
    weight: z.string().optional(),
    material: z.string().optional(),
    warranty: z.string().optional().default('12 месяцев с момента ввода в эксплуатацию'),
    warranty_uz: z.string().optional(),
    warranty_en: z.string().optional(),
    priceNote: z.string().optional().default('Цена по запросу (с НДС 12%)'),
    priceNote_uz: z.string().optional(),
    priceNote_en: z.string().optional(),
    image: z.string().optional(),
    order: z.number().default(1),
    body_uz: z.string().optional(),
    body_en: z.string().optional(),
  }),
});


const servicesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    code: z.string(),
    title: z.string(),
    title_uz: z.string().optional(),
    title_en: z.string().optional(),
    category: z.string(),
    category_uz: z.string().optional(),
    category_en: z.string().optional(),
    summary: z.string(),
    summary_uz: z.string().optional(),
    summary_en: z.string().optional(),
    image: z.string().optional(),
    steps: z
      .array(
        z.object({
          title: z.string(),
          title_uz: z.string().optional(),
          title_en: z.string().optional(),
          text: z.string(),
          text_uz: z.string().optional(),
          text_en: z.string().optional(),
        })
      )
      .default([]),
    benefits: z.array(attributeSchema).default([]),
    ctaLabel: z.string().optional(),
    ctaLabel_uz: z.string().optional(),
    ctaLabel_en: z.string().optional(),
    order: z.number().default(1),
    body_uz: z.string().optional(),
    body_en: z.string().optional(),
  }),
});

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    code: z.string(),
    category: z.string().optional(),
    category_uz: z.string().optional(),
    category_en: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    year: z.string().optional(),
    tag: z.string(),
    tag_uz: z.string().optional(),
    tag_en: z.string().optional(),
    title: z.string(),
    title_uz: z.string().optional(),
    title_en: z.string().optional(),
    subtitle: z.string(),
    subtitle_uz: z.string().optional(),
    subtitle_en: z.string().optional(),
    client_uz: z.string().optional(),
    client_en: z.string().optional(),
    description_uz: z.string().optional(),
    description_en: z.string().optional(),
    metrics: z.array(z.string()),
    metrics_uz: z.array(z.string()).optional(),
    metrics_en: z.array(z.string()).optional(),
    image: z.string().optional(),
    order: z.number().default(1),
    body_uz: z.string().optional(),
    body_en: z.string().optional(),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    title_uz: z.string().optional(),
    title_en: z.string().optional(),
    publishDate: z.string(),
    category: z.string(),
    category_uz: z.string().optional(),
    category_en: z.string().optional(),
    summary: z.string(),
    summary_uz: z.string().optional(),
    summary_en: z.string().optional(),
    author: z.string().default('Инженерный отдел ООО «RailTech»'),
    readTime: z.string().default('4 мин'),
    readTime_uz: z.string().optional(),
    readTime_en: z.string().optional(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    tags_uz: z.array(z.string()).optional(),
    tags_en: z.array(z.string()).optional(),
    body_uz: z.string().optional(),
    body_en: z.string().optional(),
  }),
});

export const collections = {
  catalog: catalogCollection,
  services: servicesCollection,
  projects: projectsCollection,
  blog: blogCollection,
};
