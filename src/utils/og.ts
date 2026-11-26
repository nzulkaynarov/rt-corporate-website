/**
 * Social preview images (Open Graph, 1200×630) drawn at build time for every material and service page:
 * src/pages/og/[...path].png.ts. satori lays out the card with the site fonts (text becomes paths),
 * sharp turns the SVG into a PNG. Colours are the design tokens of src/styles/tokens.css (docs/DESIGN.md).
 */
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import type { Lang } from '../i18n';

/** Path of the generated preview of a page: `/og/<lang>/<section>/<slug>.png` (asset path, without the base). */
export function ogImagePath(section: 'news' | 'services', slug: string, lang: Lang): string {
  return `/og/${lang}/${section}/${slug}.png`;
}

// Tokens (src/styles/tokens.css): satori draws outside the page, so the values are repeated here.
const C = { bg: '#ffffff', ink: '#2d3e50', muted: '#5a6876', brandInk: '#2a6f86', brandSoft: '#e3f0f4', brandMid: '#a7ced9', accent: '#e8833a' };

const FONT_DIR = path.join(process.cwd(), 'node_modules/@fontsource');
const font = (pkg: string, file: string) => fs.readFileSync(path.join(FONT_DIR, pkg, 'files', file));
const SUBSETS = ['latin', 'latin-ext', 'cyrillic'];
const DISPLAY = SUBSETS.map((sub) => `Montserrat-${sub}`).join(', ');
const BODY = SUBSETS.map((sub) => `Golos-${sub}`).join(', ');
let fonts: { name: string; data: Buffer; weight: 500 | 800; style: 'normal' }[] | undefined;
function loadFonts() {
  // Fontsource ships each script as its own file; satori keeps one file per family name, so every subset gets
  // its own name and the families are listed together (DISPLAY / BODY below).
  fonts ??= SUBSETS.flatMap((sub) => [
    { name: `Montserrat-${sub}`, data: font('montserrat', `montserrat-${sub}-800-normal.woff`), weight: 800 as const, style: 'normal' as const },
    { name: `Golos-${sub}`, data: font('golos-text', `golos-text-${sub}-500-normal.woff`), weight: 500 as const, style: 'normal' as const },
  ]);
  return fonts;
}

/**
 * A public image (`/brand/rt-mark.svg`, a partner logo) fitted into a box, as a PNG data URI. Everything is rasterised
 * by sharp first: some logos are SVGs with only a viewBox, which satori would draw at the wrong size.
 */
async function picture(publicPath: string, maxW: number, maxH: number) {
  const file = path.join(process.cwd(), 'public', publicPath);
  const png = await sharp(fs.readFileSync(file), { density: 400 })
    .resize({ width: maxW * 2, height: maxH * 2, fit: 'inside', withoutEnlargement: false })
    .png()
    .toBuffer();
  const meta = await sharp(png).metadata();
  const w = Math.round((meta.width || maxW * 2) / 2);
  const hgt = Math.round((meta.height || maxH * 2) / 2);
  return { src: `data:image/png;base64,${png.toString('base64')}`, width: w, height: hgt };
}

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (Node | string | null | false)[]): Node => ({
  type,
  props: { style, children: children.filter((c) => c !== null && c !== false) },
});

export interface OgCard {
  /** Brand name (company.json → brandName) and the site host shown at the bottom. */
  brand: string;
  site: string;
  /** Section label above the title («Новости», «Производители», «Услуги»). */
  eyebrow: string;
  title: string;
  /** A short line under the title (summary of a service), optional. */
  lead?: string;
  /** Bottom line on the right (date of a material), optional. */
  meta?: string;
  /** Partner logo, public path (`/images/partners/x.svg`), optional. */
  logo?: string;
}

export async function renderOgPng(card: OgCard): Promise<Buffer> {
  const mark = await picture('/brand/rt-mark.svg', 60, 60);
  const logo = card.logo ? await picture(card.logo, 240, 96) : undefined;
  const size = card.title.length <= 48 ? 66 : card.title.length <= 90 ? 56 : 46;

  // Fixed boxes (absolute positions) instead of paddings: satori adds paddings to an explicit width/height.
  const tree = h(
    'div',
    { width: 1200, height: 630, display: 'flex', position: 'relative', background: C.bg, fontFamily: BODY },
    h('div', { position: 'absolute', left: 0, top: 0, width: 1200, height: 12, background: C.accent }),
    // decoration: the outline of the brand diamond in the corner
    h('div', { position: 'absolute', right: -150, bottom: -210, width: 420, height: 420, border: `3px solid ${C.brandMid}`, transform: 'rotate(45deg)', opacity: 0.6 }),
    h(
      'div',
      { position: 'absolute', left: 72, top: 56, width: 1056, height: 522, display: 'flex', flexDirection: 'column' },
      h(
        'div',
        { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 104 },
        h(
          'div',
          { display: 'flex', alignItems: 'center' },
          { type: 'img', props: { src: mark.src, width: mark.width, height: mark.height, style: { marginRight: 18 } } },
          h('div', { fontFamily: DISPLAY, fontWeight: 800, fontSize: 38, color: C.ink }, card.brand),
        ),
        logo
          ? h('div', { display: 'flex', alignItems: 'center', justifyContent: 'center', width: logo.width + 40, height: logo.height + 24, border: `2px solid ${C.brandSoft}`, borderRadius: 12 }, { type: 'img', props: { src: logo.src, width: logo.width, height: logo.height } })
          : null,
      ),
      h(
        'div',
        { display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1, width: 940 },
        h('div', { fontSize: 24, letterSpacing: 3, textTransform: 'uppercase', color: C.brandInk, fontWeight: 500, marginBottom: 20 }, card.eyebrow),
        h('div', { fontFamily: DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 1.12, color: C.ink, display: 'flex' }, card.title),
        card.lead ? h('div', { fontSize: 30, lineHeight: 1.4, color: C.muted, marginTop: 22, display: 'flex' }, card.lead) : null,
      ),
      h(
        'div',
        { display: 'flex', alignItems: 'center', height: 40, fontSize: 26, color: C.muted },
        h('div', { display: 'flex' }, card.site),
        card.meta ? h('div', { display: 'flex', marginLeft: 28, paddingLeft: 28, borderLeft: `2px solid ${C.brandMid}` }, card.meta) : null,
      ),
    ),
  );

  const svg = await satori(tree as never, { width: 1200, height: 630, fonts: loadFonts() });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer();
}
