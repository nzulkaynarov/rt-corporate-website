import { defineCollection, z } from 'astro:content';

const catalogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    sku: z.string(),
    title: z.string(),
    subsystem: z.string(),
    gost: z.string(),
    tnved: z.string(),
    warehouse: z.string().default('Ташкент, Index B2-2097'),
    status: z.enum(['В наличии', 'Резерв', 'Под заказ']),
    statusKey: z.enum(['in_stock', 'reserved', 'on_order']),
    specs: z.string(),
    dimensions: z.string().optional(),
    weight: z.string().optional(),
    material: z.string().optional(),
    warranty: z.string().optional().default('12 месяцев с момента ввода в эксплуатацию'),
    priceNote: z.string().optional().default('Цена по запросу (с НДС 12%)'),
    image: z.string().optional(),
    modelType: z.enum(['bogie', 'container', 'network', 'hypercube']).optional().default('bogie'),
    order: z.number().default(1),
  }),
});

const contractCollection = defineCollection({
  type: 'content',
  schema: z.object({
    code: z.string(),
    tag: z.string(),
    title: z.string(),
    subtitle: z.string(),
    metrics: z.array(z.string()),
    order: z.number().default(1),
  }),
});

const digitalCollection = defineCollection({
  type: 'content',
  schema: z.object({
    code: z.string(),
    tag: z.string(),
    title: z.string(),
    subtitle: z.string(),
    metrics: z.array(z.string()),
    link: z.string().optional(),
    order: z.number().default(1),
  }),
});

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    code: z.string(),
    tag: z.string(),
    title: z.string(),
    subtitle: z.string(),
    metrics: z.array(z.string()),
    image: z.string().optional(),
    order: z.number().default(1),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishDate: z.string(),
    category: z.enum([
      'Поставки и Склад',
      'ВЭД и Таможня',
      'Digital & ПО',
      'Спецпроекты и Арт',
      'Новости компании',
    ]),
    summary: z.string(),
    author: z.string().default('Инженерный отдел ООО «RailTech»'),
    readTime: z.string().default('4 мин'),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  catalog: catalogCollection,
  contract: contractCollection,
  digital: digitalCollection,
  projects: projectsCollection,
  blog: blogCollection,
};

