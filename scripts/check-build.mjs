import fs from 'node:fs';
import path from 'node:path';

/**
 * Post-build SEO / i18n audit of dist/ (runs automatically after `npm run build`).
 *
 * Errors (fail the build): wrong <html lang>, internal links to another language or to a missing page,
 * missing title / description / canonical / hreflang, canonical not pointing to the page itself,
 * not exactly one <h1>, <img> without alt, srcset pointing to a missing file, decorative «HUD telemetry»
 * strings, industry-specific positioning outside /news/ (docs/ARCHITECTURE.md §1), missing skip link /
 * <main id="main"> / «Войти в Кабинет» link, redirect pages (v1 URLs) pointing to a missing page.
 * Warnings: title > 60 / description outside 50–160 chars, duplicate titles, untranslated UZ/EN pages
 * (only counted while src/data/content-stage.json has "ruOnly": true — those pages are noindex then).
 */
const DIST = 'dist';
const LANGS = ['ru', 'uz', 'en'];
const SKIP = [/^admin\//, /^404\.html$/];
const STAGE = fs.existsSync('src/data/content-stage.json') ? JSON.parse(fs.readFileSync('src/data/content-stage.json', 'utf8')) : {};
const RU_ONLY = STAGE.ruOnly === true;
const HUD = /RT_CONSOLE|HUD_SCAN|OPTICAL_FEED|SYS\.ACTIVE|GATEWAYS|NODE:\s*TASHKENT|STATUS:\s*PRODUCTION|CAD\.UI/;
const POSITIONING = /UzTE16M|ТЭП70|3ЭС5К|\bВЛ[68]0|ЭР9Е|ТЭ10М|ЧМЭ3|ТЭМ2|локомотив|подвижн\S* состав|ж\/д электроник|rail electronics/i;
let untranslated = 0;
let redirects = 0;

const errors = [];
const warnings = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
  });
}

const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'));
  return m ? decode(m[1]) : null;
};

if (!fs.existsSync(DIST)) {
  console.error('[check-build] dist/ not found — run astro build first');
  process.exit(1);
}

// BASE path is derived from the home page canonical (works for GitHub Pages subpath and custom domain).
const homeHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const homeCanonical = attr(homeHtml.match(/<link[^>]+rel="canonical"[^>]*>/i)?.[0] || '', 'href');
if (!homeCanonical) {
  console.error('[check-build] dist/index.html has no canonical link');
  process.exit(1);
}
const BASE = new URL(homeCanonical).pathname.replace(/\/$/, '');

const titles = new Map();
const checkedSrcset = new Map();
const files = walk(DIST)
  .map((f) => path.relative(DIST, f).split(path.sep).join('/'))
  .filter((rel) => !SKIP.some((re) => re.test(rel)));

for (const rel of files) {
  const html = fs.readFileSync(path.join(DIST, rel), 'utf8');
  const route = `/${rel.replace(/index\.html$/, '')}`;
  const seg = route.split('/')[1];
  const lang = LANGS.includes(seg) && seg !== 'ru' ? seg : 'ru';
  const page = `${BASE}${route}`;
  const err = (msg) => errors.push(`${page}: ${msg}`);
  const warn = (msg) => warnings.push(`${page}: ${msg}`);

  const refresh = html.match(/<meta[^>]+http-equiv="refresh"[^>]+content="0;url=([^"]+)"/i);
  if (refresh) {
    redirects += 1;
    const target = refresh[1].slice(BASE.length).split(/[?#]/)[0] || '/';
    const file = path.join(DIST, decodeURI(target), target.endsWith('/') ? 'index.html' : '');
    if (!fs.existsSync(file) && !fs.existsSync(`${file}.html`)) err(`redirect target does not exist: ${refresh[1]}`);
    if (!/name="robots" content="noindex/.test(html)) err('redirect page must be noindex');
    continue;
  }
  const noindex = /<meta[^>]+name="robots"[^>]+content="noindex/i.test(html);
  if (HUD.test(html)) err(`decorative HUD/telemetry text: «${html.match(HUD)[0]}» (docs/DESIGN.md)`);
  if (lang === 'ru' && !route.startsWith('/news/')) {
    const visible = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ');
    const hit = visible.match(POSITIONING);
    if (hit) err(`industry-specific positioning «${hit[0]}» outside /news/ (docs/ARCHITECTURE.md §1)`);
  }
  if (!/<main\b[^>]*id="main"/.test(html)) err('missing <main id="main">');
  if (!/class="skip-link"/.test(html)) err('missing skip link');
  if (!/href="https:\/\/cabinet\.railtech\.uz\/login"/.test(html)) err('missing «Войти в Кабинет» link (company.json → cabinet.loginUrl)');

  const htmlLang = attr(html.match(/<html[^>]*>/i)?.[0] || '', 'lang');
  if (htmlLang !== lang) err(`<html lang="${htmlLang}"> but URL language is "${lang}"`);

  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '');
  if (!title) err('missing <title>');
  else {
    if (title.length > 60) warn(`title is ${title.length} chars (>60): "${title}"`);
    if (!noindex) {
      if (!titles.has(title)) titles.set(title, []);
      titles.get(title).push(page);
    }
  }

  const description = attr(html.match(/<meta[^>]+name="description"[^>]*>/i)?.[0] || '', 'content');
  if (!description) err('missing meta description');
  else if (description.length > 160 || description.length < 50) warn(`description is ${description.length} chars (50–160 recommended)`);

  if (!noindex) {
    const canonical = attr(html.match(/<link[^>]+rel="canonical"[^>]*>/i)?.[0] || '', 'href');
    if (!canonical) err('missing canonical');
    else if (new URL(canonical).pathname !== page) err(`canonical points to ${new URL(canonical).pathname}`);
    const hreflangs = [...html.matchAll(/<link[^>]+rel="alternate"[^>]+hreflang="([^"]+)"/gi)].map((m) => m[1]);
    for (const h of [...(RU_ONLY ? ['ru'] : LANGS), 'x-default']) if (!hreflangs.includes(h)) err(`missing hreflang="${h}"`);
  } else if (RU_ONLY && lang !== 'ru') {
    untranslated += 1;
  }

  const h1 = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1 !== 1) err(`${h1} <h1> elements (expected exactly 1)`);

  for (const img of html.match(/<img\b[^>]*>/gi) || []) {
    if (attr(img, 'alt') === null) err(`<img> without alt: ${img.slice(0, 120)}`);
    // Every responsive WebP variant must exist (scripts/optimize-images.mjs), otherwise the browser shows a broken image.
    for (const candidate of (attr(img, 'srcset') || '').split(',')) {
      const url = candidate.trim().split(/\s+/)[0];
      if (!url || !url.startsWith(`${BASE}/`)) continue;
      const file = path.join(DIST, decodeURI(url.slice(BASE.length)));
      if (!checkedSrcset.has(file)) checkedSrcset.set(file, fs.existsSync(file));
      if (!checkedSrcset.get(file)) err(`srcset file missing: ${url}`);
    }
  }

  // Internal page links must stay in the page language (the language switcher links carry hreflang).
  for (const a of html.match(/<a\b[^>]*>/gi) || []) {
    const href = attr(a, 'href');
    if (!href || attr(a, 'hreflang')) continue;
    if (BASE && href.startsWith('/') && !href.startsWith('//') && !href.startsWith(`${BASE}/`) && href !== BASE) {
      err(`internal link without the base path ${BASE}: ${href}`);
      continue;
    }
    if (!href.startsWith(`${BASE}/`) && href !== BASE) continue;
    const p = href.slice(BASE.length).split(/[?#]/)[0] || '/';
    if (/\.[a-z0-9]{2,5}$/i.test(p) || p.startsWith('/admin/') || p.startsWith('/_astro/')) continue; // files / CMS
    // The target page must exist in dist/ (catches links to removed or misspelled entries).
    const target = path.join(DIST, decodeURI(p), p.endsWith('/') ? 'index.html' : '');
    if (!fs.existsSync(target) && !fs.existsSync(`${target}.html`) && !fs.existsSync(path.join(target, 'index.html'))) {
      err(`broken internal link (no such page): ${href}`);
    }
    const linkSeg = p.split('/')[1];
    const linkLang = LANGS.includes(linkSeg) && linkSeg !== 'ru' ? linkSeg : 'ru';
    if (linkLang !== lang) err(`link to another language: ${href}`);
  }

  // Untranslated content heuristic: share of Cyrillic letters in visible text.
  if (lang !== 'ru') {
    const text = html
      .replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' ');
    const letters = text.match(/\p{L}/gu) || [];
    const cyr = text.match(/\p{Script=Cyrillic}/gu) || [];
    const share = letters.length ? cyr.length / letters.length : 0;
    if (share > 0.15 && !RU_ONLY) warn(`${Math.round(share * 100)}% of the text is Cyrillic — untranslated ${lang.toUpperCase()} content in the CMS?`);
  }
}

for (const [title, pages] of titles) {
  if (pages.length > 1) warnings.push(`duplicate <title> "${title}" on ${pages.length} pages: ${pages.join(', ')}`);
}

if (warnings.length) {
  console.warn(`[check-build] ${warnings.length} warning(s):`);
  for (const w of warnings) console.warn('  ! ' + w);
}
if (errors.length) {
  console.error(`[check-build] ${errors.length} error(s) in ${files.length} pages:`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
if (RU_ONLY) console.warn(`[check-build] RU-first stage: ${untranslated} UZ/EN page(s) are noindex until translated (src/data/content-stage.json)`);
console.log(`[check-build] ${files.length - redirects} pages + ${redirects} redirects OK (${LANGS.join('/')}), ${warnings.length} warning(s)`);
