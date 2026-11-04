import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const isCustomDomain = Boolean(process.env.CUSTOM_DOMAIN);
const base = isCustomDomain ? '/' : '/rt-corporate-website';

import legacy from './src/data/legacy-redirects.json' with { type: 'json' };
import stage from './src/data/content-stage.json' with { type: 'json' };

/** Not in the sitemap: CMS panel, v1 → v2 redirect pages (src/pages/[...legacy].astro), untranslated UZ/EN pages. */
const LEGACY = Object.keys(legacy.redirects);
const isExcluded = (pathname) => {
  const noBase = pathname.replace(/^\/rt-corporate-website/, '') || '/';
  const lang = (noBase.match(/^\/(uz|en)\//) || [])[1];
  const route = lang ? noBase.slice(lang.length + 1) : noBase;
  // RU-first stage: UZ/EN pages still show Russian text → kept out of the sitemap (and noindex in BaseLayout).
  return route === '/admin/' || LEGACY.includes(route) || (stage.ruOnly === true && Boolean(lang));
};

export default defineConfig({
  site: isCustomDomain ? 'https://railtech.uz' : 'https://nzulkaynarov.github.io',
  base,
  output: 'static',
  // The dev-server toolbar (black pill at the bottom) is off: owner reviews the site in dev mode.
  devToolbar: { enabled: false },
  vite: {
    plugins: [
      {
        // @fontsource ships `font-display: swap`: the first frame of every page is drawn with the fallback font and
        // the header menu jumps when Montserrat arrives. `optional` + preload (BaseLayout) uses the font from the first
        // frame; if it is not ready in ~100 ms the page keeps the fallback (no jump) and the next page has the font.
        name: 'railtech-font-display-optional',
        enforce: 'pre',
        transform(code, id) {
          if (id.includes('@fontsource') && id.endsWith('.css')) return code.replace(/font-display:\s*swap/g, 'font-display: optional');
        },
      },
    ],
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) => !isExcluded(new URL(page).pathname),
      // ru has no URL prefix; /uz/… and /en/… are linked as hreflang alternates
      i18n: {
        defaultLocale: 'ru',
        locales: { ru: 'ru', uz: 'uz', en: 'en' },
      },
    }),
  ],
});
