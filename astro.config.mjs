import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const isGHPages = Boolean(process.env.GITHUB_ACTIONS && !process.env.CUSTOM_DOMAIN);

export default defineConfig({
  site: isGHPages ? 'https://nzulkaynarov.github.io' : 'https://railtech.uz',
  base: isGHPages ? '/rt-corporate-website' : '/',
  output: 'static',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    sitemap(),
  ],
});
