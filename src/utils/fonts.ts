/**
 * Font files preloaded on every page (BaseLayout.astro). With `font-display: optional` (astro.config.mjs) a face that is
 * not ready by the first frame stays on the fallback for that page view, so every face used on screen is listed here:
 * Golos Text 400/500/600 and Montserrat 600/700/800, Cyrillic + Latin subsets (≈ 7–25 KB each).
 */
import golos400c from '@fontsource/golos-text/files/golos-text-cyrillic-400-normal.woff2?url';
import golos500c from '@fontsource/golos-text/files/golos-text-cyrillic-500-normal.woff2?url';
import golos600c from '@fontsource/golos-text/files/golos-text-cyrillic-600-normal.woff2?url';
import golos400l from '@fontsource/golos-text/files/golos-text-latin-400-normal.woff2?url';
import golos500l from '@fontsource/golos-text/files/golos-text-latin-500-normal.woff2?url';
import golos600l from '@fontsource/golos-text/files/golos-text-latin-600-normal.woff2?url';
import mont600c from '@fontsource/montserrat/files/montserrat-cyrillic-600-normal.woff2?url';
import mont700c from '@fontsource/montserrat/files/montserrat-cyrillic-700-normal.woff2?url';
import mont800c from '@fontsource/montserrat/files/montserrat-cyrillic-800-normal.woff2?url';
import mont600l from '@fontsource/montserrat/files/montserrat-latin-600-normal.woff2?url';
import mont700l from '@fontsource/montserrat/files/montserrat-latin-700-normal.woff2?url';
import mont800l from '@fontsource/montserrat/files/montserrat-latin-800-normal.woff2?url';

export const PRELOAD_FONTS: string[] = [
  golos400c, golos500c, golos600c, golos400l, golos500l, golos600l,
  mont600c, mont700c, mont800c, mont600l, mont700l, mont800l,
];
