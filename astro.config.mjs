import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const isCustomDomain = Boolean(process.env.CUSTOM_DOMAIN);
const base = isCustomDomain ? '/' : '/rt-corporate-website';

/** Service pages that must not appear in the sitemap (CMS panel, legacy redirects). */
const SITEMAP_EXCLUDE = ['/admin/', '/contract/', '/digital/'];

export default defineConfig({
  site: isCustomDomain ? 'https://railtech.uz' : 'https://nzulkaynarov.github.io',
  base,
  output: 'static',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    sitemap({
      filter: (page) => !SITEMAP_EXCLUDE.some((path) => new URL(page).pathname.endsWith(path)),
      // ru has no URL prefix; /uz/… and /en/… are linked as hreflang alternates
      i18n: {
        defaultLocale: 'ru',
        locales: { ru: 'ru', uz: 'uz', en: 'en' },
      },
    }),
  ],
});
