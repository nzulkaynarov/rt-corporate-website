import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const isCustomDomain = Boolean(process.env.CUSTOM_DOMAIN);

export default defineConfig({
  site: isCustomDomain ? 'https://railtech.uz' : 'https://nzulkaynarov.github.io',
  base: isCustomDomain ? '/' : '/rt-corporate-website',
  output: 'static',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    sitemap(),
  ],
});
