/**
 * Responsive WebP for raster images in public/ (incl. CMS uploads).
 *
 * scripts/optimize-images.mjs (prebuild) writes, next to every JPG/PNG under
 * public/images and public/uploads, WebP variants `<name>.w480.webp`, `.w800.webp`, `.w1200.webp`
 * (never upscaled). Components keep the original as `src` (fallback) and add a WebP `srcset`,
 * so the browser downloads a small WebP that fits the slot. Works in Astro and React islands.
 * In `astro dev` no srcset is emitted (originals only); scripts/check-build.mjs verifies in the
 * production build that every srcset file exists.
 *
 *   <img {...responsiveImage(photo, SIZES.card)} alt="…" />          (Astro: spread works as-is)
 *   <img src={r.src} srcSet={r.srcset} sizes={r.sizes} />            (React)
 */
import { withBase } from './url';

/** Keep in sync with WIDTHS in scripts/optimize-images.mjs */
export const IMAGE_WIDTHS = [480, 800, 1200] as const;

/** Typical `sizes` for the layouts of this site (Tailwind breakpoints sm 640, lg 1024, max-w-7xl ≈ 1280). */
export const SIZES = {
  /** full-width hero / article cover in the main column */
  wide: '(min-width: 1280px) 860px, (min-width: 1024px) 66vw, 100vw',
  /** half-width media (slider, product gallery main image) */
  half: '(min-width: 1280px) 620px, (min-width: 1024px) 50vw, 100vw',
  /** card in a 3–4 column grid */
  card: '(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw',
  /** small thumbnail / table row preview */
  thumb: '160px',
} as const;

const RASTER = /\.(jpe?g|png)$/i;

function localPath(src: string): string | null {
  if (!src || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(src)) return null; // http(s), data:, //cdn
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  let p = src.split(/[?#]/)[0];
  if (base && p.startsWith(`${base}/`)) p = p.slice(base.length);
  if (!p.startsWith('/')) p = `/${p}`;
  return /^\/(images|uploads)\//.test(p) && RASTER.test(p) ? p : null;
}

/** WebP srcset for a local raster image, or undefined (SVG, external URL, unknown folder). */
export function webpSrcSet(src?: string | null): string | undefined {
  // Dev server (`astro dev`): variants may not be generated yet — serve the originals.
  if (import.meta.env.DEV) return undefined;
  const p = src ? localPath(src) : null;
  if (!p) return undefined;
  const stem = p.replace(RASTER, '');
  return IMAGE_WIDTHS.map((w) => `${withBase(`${stem}.w${w}.webp`)} ${w}w`).join(', ');
}

/** `src` (original, BASE-prefixed) + WebP `srcset` + `sizes` for an <img>. */
export function responsiveImage(src: string | undefined | null, sizes: string = SIZES.card) {
  const srcset = webpSrcSet(src);
  return { src: withBase(src || ''), srcset, sizes: srcset ? sizes : undefined };
}
