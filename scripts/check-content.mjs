#!/usr/bin/env node
/**
 * Content quality gate for RailTech (used by AI content agents, the PR workflow and the
 * Claude Code hook). Checks Markdown entries in src/content/** and CMS JSON in src/data/cms/**
 * against docs/content/* rules.
 *
 *   npm run check:content                      # whole site
 *   node scripts/check-content.mjs --files a.md b.json   # only these files (hook / quick loop)
 *   node scripts/check-content.mjs --strict    # warnings fail too (use before opening a PR)
 *
 * ERRORS (exit 1): missing UZ/EN translation of a translatable field, Cyrillic in an UZ/EN
 * field, UZ/EN identical to RU, forbidden glossary variants, broken local image/file paths,
 * placeholders (TODO, lorem…), bad slug/SKU, status ↔ statusKey mismatch, invalid dates.
 * WARNINGS: SEO length limits, short texts, placeholder document links, future dates,
 * untranslated strings in CMS JSON.
 */
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const args = process.argv.slice(2);
const STRICT = args.includes('--strict');
const onlyIdx = args.indexOf('--files');
const ONLY = onlyIdx >= 0 ? args.slice(onlyIdx + 1).filter((a) => !a.startsWith('--')).map((f) => path.relative(process.cwd(), path.resolve(f))) : null;

const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

const CYR = /[А-Яа-яЁё]/;
const PLACEHOLDER = /\b(TODO|TBD|FIXME|lorem ipsum|XXX)\b|\?\?\?/i;
const LANGS = ['uz', 'en'];

// ---------------------------------------------------------------------------
// Glossary: forbidden variants come from docs/content/GLOSSARY.md (single source of truth).
// Table rows: | RU | UZ | EN | Запрещено (UZ/EN) | … — 4th column: comma-separated forbidden variants.
// ---------------------------------------------------------------------------
const forbidden = [];
const GLOSSARY = 'docs/content/GLOSSARY.md';
if (fs.existsSync(GLOSSARY)) {
  for (const line of fs.readFileSync(GLOSSARY, 'utf8').split('\n')) {
    const cells = line.split('|').map((c) => c.trim());
    if (cells.length < 6 || /^-+$/.test(cells[1]) || cells[1] === 'RU') continue;
    for (const variant of (cells[4] || '').split(',').map((v) => v.replace(/`/g, '').trim()).filter((v) => v && v !== '—')) {
      forbidden.push({ variant, use: `${cells[2]} / ${cells[3]}`, re: new RegExp(`(^|[^\\p{L}])${variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=$|[^\\p{L}])`, 'iu') });
    }
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const isEmpty = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);
const publicPathExists = (p) => fs.existsSync(path.join('public', decodeURI(p.split(/[?#]/)[0])));

function checkText(file, where, value, lang) {
  if (typeof value !== 'string') return;
  if (PLACEHOLDER.test(value)) err(file, `${where}: placeholder text (${value.match(PLACEHOLDER)[0]})`);
  if (lang && lang !== 'ru') {
    // Product / organisation designations stay in the original: upper-case Cyrillic codes
    // (ДПС-01, БС-ДПС, СГМА.468179.001-01, САУТ-ЦМ/НСП) and «НПО САУТ»-style names are allowed.
    // Lower-case Cyrillic words mean untranslated text.
    const rest = value.replace(/«[^»]*»/g, (m) => (/[а-яё]/.test(m) ? m : ' ')).replace(/[А-ЯЁ0-9][А-ЯЁ0-9.\-\/]*/g, ' ');
    if (/[а-яё]/.test(rest)) err(file, `${where}: Cyrillic words in a ${lang.toUpperCase()} field ("${value.slice(0, 60)}…") — translate them (upper-case designations like ДПС-01 are allowed)`);
    for (const f of forbidden) if (f.re.test(value)) err(file, `${where}: forbidden term "${f.variant}" — use the glossary term (${f.use})`);
    if (lang === 'uz' && /[ʻʼ’‘]/.test(value)) warn(file, `${where}: use the plain apostrophe ' in Uzbek (o', g', ma'lumot), not ʻ ’ ‘`);
  }
}

/** A translatable field: RU present → UZ and EN must exist, be real translations, pass text checks. */
function trilingual(file, obj, field, where = field, { optional = false } = {}) {
  const ru = obj?.[field];
  if (isEmpty(ru)) {
    if (!optional) err(file, `${where}: RU value is required`);
    for (const l of LANGS) if (!isEmpty(obj?.[`${field}_${l}`])) warn(file, `${where}_${l} is set but RU ${field} is empty`);
    return;
  }
  checkText(file, where, Array.isArray(ru) ? ru.join(' ') : ru, 'ru');
  for (const l of LANGS) {
    const v = obj?.[`${field}_${l}`];
    if (isEmpty(v)) { err(file, `${where}_${l}: missing ${l.toUpperCase()} translation`); continue; }
    if (Array.isArray(ru)) {
      if (!Array.isArray(v)) { err(file, `${where}_${l}: must be a list like ${field}`); continue; }
      if (v.length !== ru.length) err(file, `${where}_${l}: ${v.length} items, RU has ${ru.length}`);
      v.forEach((item, i) => checkText(file, `${where}_${l}[${i}]`, item, l));
      continue;
    }
    if (/[а-яё]/.test(String(ru).replace(/«[^»]*»/g, ' ')) && String(v).trim() === String(ru).trim()) err(file, `${where}_${l}: identical to RU (not translated)`);
    checkText(file, `${where}_${l}`, v, l);
  }
}

/** Trilingual fields inside list items (attributes, steps, documents…). */
function trilingualList(file, list, fields, where) {
  (list || []).forEach((item, i) => fields.forEach((f) => trilingual(file, item, f, `${where}[${i}].${f}`)));
}

function checkSeo(file, d) {
  const title = (v) => v && v.length > 60 && warn(file, `seoTitle is ${v.length} chars (≤ 60)`);
  const desc = (v) => v && (v.length > 160 || v.length < 70) && warn(file, `seoDescription is ${v.length} chars (70–160)`);
  if (!isEmpty(d.seoTitle)) { trilingual(file, d, 'seoTitle'); ['', '_uz', '_en'].forEach((s) => title(d[`seoTitle${s}`])); }
  if (!isEmpty(d.seoDescription)) { trilingual(file, d, 'seoDescription'); ['', '_uz', '_en'].forEach((s) => desc(d[`seoDescription${s}`])); }
}

function checkMedia(file, d) {
  for (const key of ['image']) {
    const p = d[key];
    if (p && p.startsWith('/') && !publicPathExists(p)) err(file, `${key}: file public${p} does not exist`);
  }
  for (const key of ['images', 'gallery']) {
    (d[key] || []).forEach((p, i) => { if (p && p.startsWith('/') && !publicPathExists(p)) err(file, `${key}[${i}]: file public${p} does not exist`); });
  }
  (d.documents || []).forEach((doc, i) => {
    if (!doc.file) return err(file, `documents[${i}].file is required`);
    if (doc.file.startsWith('/') && !publicPathExists(doc.file)) err(file, `documents[${i}].file: public${doc.file} does not exist`);
    if (/^https?:\/\/(www\.)?railtech\.uz\/?$/i.test(doc.file)) warn(file, `documents[${i}].file is a placeholder link (${doc.file}) — attach the real PDF or remove the document`);
  });
}

function checkBody(file, d, body, minRu) {
  const ruLen = body.trim().length;
  if (!ruLen) err(file, 'Markdown body (RU) is empty');
  else if (ruLen < minRu) warn(file, `RU body is only ${ruLen} chars (≥ ${minRu} recommended)`);
  checkText(file, 'body', body, 'ru');
  for (const l of LANGS) {
    const v = d[`body_${l}`];
    if (isEmpty(v)) err(file, `body_${l}: missing ${l.toUpperCase()} translation of the article body`);
    else {
      checkText(file, `body_${l}`, v, l);
      if (ruLen && v.trim().length < ruLen * 0.5) warn(file, `body_${l} is much shorter than the RU body (${v.trim().length} vs ${ruLen} chars) — partial translation?`);
    }
  }
}

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STATUS_TO_KEY = { 'в наличии': 'in_stock', 'резерв': 'reserved', 'под заказ': 'on_order' }; // mirrors src/utils/stock.ts

function readMd(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error('no front matter');
  return { data: yaml.load(m[1]) || {}, body: m[2] || '' };
}

const seen = { sku: new Map(), code: new Map() };

const RULES = {
  catalog(file, d, body) {
    const slug = path.basename(file, '.md');
    if (!d.sku) err(file, 'sku is required');
    else {
      if (!/^RT-[A-Z]+-\d{3}$/.test(d.sku)) warn(file, `sku "${d.sku}" does not match RT-<GROUP>-<NNN>`);
      if (slug !== d.sku.toLowerCase()) err(file, `file name must be ${d.sku.toLowerCase()}.md (sku in lower case)`);
      if (seen.sku.has(d.sku)) err(file, `duplicate sku ${d.sku} (also in ${seen.sku.get(d.sku)})`);
      seen.sku.set(d.sku, file);
    }
    trilingual(file, d, 'title');
    trilingual(file, d, d.category ? 'category' : 'subsystem', 'category');
    trilingual(file, d, 'specs');
    for (const f of ['warehouse', 'warranty', 'priceNote']) trilingual(file, d, f, f, { optional: true });
    if (!isEmpty(d.price)) err(file, 'price must stay empty — prices are not published on the site (docs/content/STYLE_GUIDE.md §2)');
    trilingualList(file, d.attributes, ['label', 'value'], 'attributes');
    trilingualList(file, d.documents, ['title'], 'documents');
    if (d.status) {
      const key = STATUS_TO_KEY[String(d.status).trim().toLowerCase()];
      if (!key) err(file, `status "${d.status}" must be one of: В наличии, Резерв, Под заказ`);
      else if (d.statusKey && d.statusKey !== key) err(file, `statusKey "${d.statusKey}" contradicts status "${d.status}" (expected ${key})`);
    }
    if (!d.image) warn(file, 'no main photo (image) — the catalog shows a generic placeholder');
    checkBody(file, d, body, 150);
  },
  services(file, d, body) {
    if (!d.code) err(file, 'code is required (e.g. SRV.05)');
    else if (seen.code.has(`s:${d.code}`)) err(file, `duplicate code ${d.code}`);
    seen.code.set(`s:${d.code}`, file);
    ['title', 'category', 'summary'].forEach((f) => trilingual(file, d, f));
    trilingual(file, d, 'ctaLabel', 'ctaLabel', { optional: true });
    trilingualList(file, d.steps, ['title', 'text'], 'steps');
    trilingualList(file, d.benefits, ['label', 'value'], 'benefits');
    trilingualList(file, d.documents, ['title'], 'documents');
    checkBody(file, d, body, 300);
  },
  projects(file, d, body) {
    if (!d.code) err(file, 'code is required (e.g. LAB 06)');
    else if (seen.code.has(`p:${d.code}`)) err(file, `duplicate code ${d.code}`);
    seen.code.set(`p:${d.code}`, file);
    ['tag', 'title', 'subtitle', 'metrics'].forEach((f) => trilingual(file, d, f));
    trilingual(file, d, 'category', 'category', { optional: true });
    trilingualList(file, d.documents, ['title'], 'documents');
    if (d.year && !/^\d{4}$/.test(String(d.year))) err(file, `year "${d.year}" must be YYYY`);
    checkBody(file, d, body, 300);
  },
  blog(file, d, body) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(d.publishDate || '')) || Number.isNaN(Date.parse(d.publishDate))) err(file, `publishDate "${d.publishDate}" must be YYYY-MM-DD`);
    else if (Date.parse(d.publishDate) > Date.now() + 864e5) warn(file, `publishDate ${d.publishDate} is in the future`);
    ['title', 'category', 'summary'].forEach((f) => trilingual(file, d, f));
    trilingual(file, d, 'readTime', 'readTime', { optional: true });
    trilingual(file, d, 'tags', 'tags', { optional: true });
    if (d.summary && (d.summary.length < 70 || d.summary.length > 300)) warn(file, `summary is ${d.summary.length} chars (70–300; it is the meta description fallback)`);
    checkBody(file, d, body, 1200);
  },
};

const CONTENT = 'src/content';
for (const col of Object.keys(RULES)) {
  const dir = path.join(CONTENT, col);
  if (!fs.existsSync(dir)) continue;
  for (const name of fs.readdirSync(dir).filter((n) => n.endsWith('.md')).sort()) {
    const file = path.join(dir, name);
    const slug = name.replace(/\.md$/, '');
    let entry;
    try { entry = readMd(file); } catch (e) { err(file, `cannot parse: ${e.message}`); continue; }
    // Duplicates (sku/code) need the full set, so every file is parsed; only reported files are filtered below.
    if (!SLUG.test(slug)) err(file, `file name "${name}" must be lower-case latin, digits and hyphens (it becomes the URL)`);
    if (typeof entry.data.order !== 'undefined' && typeof entry.data.order !== 'number') err(file, 'order must be a number');
    RULES[col](file, entry.data, entry.body);
    checkSeo(file, entry.data);
    checkMedia(file, entry.data);
  }
}

// ---------------------------------------------------------------------------
// CMS JSON (site texts) — translations should exist; UZ/EN must never contain Cyrillic.
// ---------------------------------------------------------------------------
function walkJson(file, node, where) {
  if (Array.isArray(node)) return node.forEach((v, i) => walkJson(file, v, `${where}[${i}]`));
  if (!node || typeof node !== 'object') return;
  for (const [k, v] of Object.entries(node)) {
    const at = where ? `${where}.${k}` : k;
    if (typeof v === 'string') {
      const lang = k.match(/_(uz|en)$/)?.[1];
      if (lang) checkText(file, at, v, lang);
      else if (CYR.test(v)) {
        checkText(file, at, v, 'ru');
        for (const l of LANGS) if (isEmpty(node[`${k}_${l}`])) warn(file, `${at}_${l}: missing ${l.toUpperCase()} translation`);
      }
    } else walkJson(file, v, at);
  }
}
const CMS = 'src/data/cms';
for (const name of fs.readdirSync(CMS).filter((n) => n.endsWith('.json'))) {
  const file = path.join(CMS, name);
  try { walkJson(file, JSON.parse(fs.readFileSync(file, 'utf8')), ''); } catch (e) { err(file, e.message); }
}
const UI = path.join(CMS, 'ui');
for (const name of fs.existsSync(UI) ? fs.readdirSync(UI).filter((n) => n.endsWith('.json')) : []) {
  const file = path.join(UI, name);
  let data;
  try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { err(file, e.message); continue; }
  for (const s of data.strings || []) {
    const ruOnly = /^lead\.message\./.test(s.key); // internal Telegram/e-mail labels for the sales team
    checkText(file, s.key, s.ru, 'ru');
    for (const l of LANGS) {
      if (isEmpty(s[l])) { if (!ruOnly && CYR.test(s.ru || '')) warn(file, `${s.key}: missing ${l.toUpperCase()}`); }
      else checkText(file, `${s.key}.${l}`, s[l], l);
    }
  }
}

// ---------------------------------------------------------------------------
const pick = (list) => (ONLY ? list.filter((m) => ONLY.some((f) => m.startsWith(`${f}:`))) : list);
const outErrors = pick(errors);
const outWarnings = pick(warnings);
const failed = outErrors.length > 0 || (STRICT && outWarnings.length > 0);

if (outWarnings.length) {
  console.warn(`[check-content] ${outWarnings.length} warning(s):`);
  outWarnings.forEach((w) => console.warn(`  ! ${w}`));
}
if (outErrors.length) {
  console.error(`[check-content] ${outErrors.length} error(s):`);
  outErrors.forEach((e) => console.error(`  - ${e}`));
}
if (failed) {
  console.error(`[check-content] FAILED${STRICT && !outErrors.length ? ' (--strict: warnings count as errors)' : ''}. Rules: docs/content/README.md`);
  process.exit(1);
}
console.log(`[check-content] OK — ${outErrors.length} errors, ${outWarnings.length} warnings${ONLY ? ` (in ${ONLY.length} file(s))` : ''}`);
