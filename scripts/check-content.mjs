#!/usr/bin/env node
/**
 * Content quality gate for RailTech (used by AI content agents, the PR workflow and the
 * Claude Code hook). Checks Markdown entries in src/content/** and CMS JSON in src/data/cms/**
 * against docs/content/* rules.
 *
 *   npm run check:content                      # whole site
 *   node scripts/check-content.mjs --files a.md b.json   # only these files (hook / quick loop)
 *   node scripts/check-content.mjs --strict    # warnings fail too (use before opening a PR)
 *   node scripts/check-content.mjs --ru-only   # RU-first stage: missing UZ/EN are counted, not errors
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
/** RU-first stage (owner approves Russian texts, translation follows in one pass): missing UZ/EN are only counted. */
const STAGE_FILE = 'src/data/content-stage.json';
const STAGE = fs.existsSync(STAGE_FILE) ? JSON.parse(fs.readFileSync(STAGE_FILE, 'utf8')) : {};
/** RU-first stage: on with --ru-only or while src/data/content-stage.json has "ruOnly": true (one switch for CI, hook and make). */
const RU_ONLY = args.includes('--ru-only') || STAGE.ruOnly === true;
const pendingTranslation = new Map(); // file → number of missing UZ/EN values
const missingTr = (file, msg) => {
  if (RU_ONLY) pendingTranslation.set(file, (pendingTranslation.get(file) || 0) + 1);
  else err(file, msg);
};
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
    if (isEmpty(v)) { missingTr(file, `${where}_${l}: missing ${l.toUpperCase()} translation`); continue; }
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
    if (isEmpty(v)) missingTr(file, `body_${l}: missing ${l.toUpperCase()} translation of the article body`);
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

function readMd(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error('no front matter');
  return { data: yaml.load(m[1]) || {}, body: m[2] || '' };
}

// Positioning guard (docs/ARCHITECTURE.md §1): general texts must not narrow RailTech to one industry.
// Applies to services and CMS JSON; news / partner articles may state facts about a partner or an event.
const POSITIONING = [
  /UzTE16M/i, /ТЭП70/i, /3ЭС5К/i, /\bВЛ[68]0/i, /ЭР9Е/i, /ТЭ10М/i, /ЧМЭ3/i, /ТЭМ2/i, /O['`’]z-(Y|ELR)\b/i,
  /локомотив/i, /подвижн\S* состав/i, /\bж\/д\b/i, /железнодорожн/i, /\brail(way)? electronics\b/i,
];
function checkPositioning(file, where, value) {
  if (typeof value !== 'string') return;
  const hit = POSITIONING.find((re) => re.test(value));
  if (hit) err(file, `${where}: «${value.match(hit)[0]}» narrows the company to one industry — keep general texts industry-neutral (docs/ARCHITECTURE.md §1)`);
}
function walkStrings(node, where, fn) {
  if (typeof node === 'string') return fn(where, node);
  if (Array.isArray(node)) return node.forEach((v, i) => walkStrings(v, `${where}[${i}]`, fn));
  if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) walkStrings(v, where ? `${where}.${k}` : k, fn);
}

const PARTNERS_FILE = 'src/data/cms/partners.json';
const partnerIds = new Set(fs.existsSync(PARTNERS_FILE) ? (JSON.parse(fs.readFileSync(PARTNERS_FILE, 'utf8')).partners || []).map((p) => p.id) : []);
const NEWS_TYPES = ['news', 'article', 'project', 'partner'];

const RULES = {
  services(file, d, body) {
    if (!['customers', 'partners'].includes(d.audience)) err(file, 'audience must be "customers" or "partners"');
    ['title', 'summary', 'lead'].forEach((f) => trilingual(file, d, f));
    trilingualList(file, d.highlights, ['label', 'value'], 'highlights');
    trilingualList(file, d.steps, ['title', 'text'], 'steps');
    trilingualList(file, d.benefits, ['title', 'text'], 'benefits');
    trilingualList(file, d.requirements, ['title', 'text'], 'requirements');
    trilingualList(file, d.faq, ['q', 'a'], 'faq');
    if (!d.steps?.length) warn(file, 'no steps («Как работаем»)');
    if (body.trim()) checkBody(file, d, body, 0);
    walkStrings({ ...d, body }, '', (where, v) => !/_(uz|en)$/.test(where.split('.').pop()) && checkPositioning(file, where, v));
  },
  news(file, d, body) {
    if (!NEWS_TYPES.includes(d.type)) err(file, `type must be one of ${NEWS_TYPES.join(', ')}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(d.date || '')) || Number.isNaN(Date.parse(d.date))) err(file, `date "${d.date}" must be YYYY-MM-DD`);
    else if (Date.parse(d.date) > Date.now() + 864e5) warn(file, `date ${d.date} is in the future`);
    ['title', 'summary'].forEach((f) => trilingual(file, d, f));
    trilingual(file, d, 'coverAlt', 'coverAlt', { optional: true });
    (d.partners || []).forEach((id) => { if (!partnerIds.has(id)) err(file, `partners: unknown partner id "${id}" (see ${PARTNERS_FILE})`); });
    if (d.type === 'partner' && !(d.partners || []).length) err(file, 'a partner article must list its partner id in partners');
    if (d.summary && (d.summary.length < 70 || d.summary.length > 300)) warn(file, `summary is ${d.summary.length} chars (70–300; it is the meta description fallback)`);
    if (d.cover && d.cover.startsWith('/') && !publicPathExists(d.cover)) err(file, `cover: file public${d.cover} does not exist`);
    if (!d.cover) warn(file, 'no cover photo — a neutral plate is shown');
    checkBody(file, d, body, 600);
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
        for (const l of LANGS) if (isEmpty(node[`${k}_${l}`])) (RU_ONLY ? missingTr : warn)(file, `${at}_${l}: missing ${l.toUpperCase()} translation`);
      }
    } else walkJson(file, v, at);
  }
}
const CMS = 'src/data/cms';
for (const name of fs.readdirSync(CMS).filter((n) => n.endsWith('.json'))) {
  const file = path.join(CMS, name);
  let data;
  try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { err(file, e.message); continue; }
  walkJson(file, data, '');
  if (name !== 'legal.json') walkStrings(data, '', (where, v) => checkPositioning(file, where, v));
}
// Partner tiles must point to an existing partner article.
for (const p of fs.existsSync(PARTNERS_FILE) ? JSON.parse(fs.readFileSync(PARTNERS_FILE, 'utf8')).partners || [] : []) {
  if (!['dealer', 'direct'].includes(p.status)) err(PARTNERS_FILE, `${p.id}: status must be "dealer" or "direct"`);
  if (p.article && !fs.existsSync(`src/content/news/${p.article}.md`)) warn(PARTNERS_FILE, `${p.id}: article src/content/news/${p.article}.md does not exist yet — the tile is not clickable`);
}
const UI = path.join(CMS, 'ui');
for (const name of fs.existsSync(UI) ? fs.readdirSync(UI).filter((n) => n.endsWith('.json')) : []) {
  const file = path.join(UI, name);
  let data;
  try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { err(file, e.message); continue; }
  for (const s of data.strings || []) {
    const ruOnly = /^lead\.message\./.test(s.key); // internal Telegram/e-mail labels for the sales team
    checkText(file, s.key, s.ru, 'ru');
    checkPositioning(file, s.key, s.ru);
    for (const l of LANGS) {
      if (isEmpty(s[l])) { if (!ruOnly && CYR.test(s.ru || '')) (RU_ONLY ? missingTr : warn)(file, `${s.key}: missing ${l.toUpperCase()}`); }
      else checkText(file, `${s.key}.${l}`, s[l], l);
    }
  }
}

// ---------------------------------------------------------------------------
const pick = (list) => (ONLY ? list.filter((m) => ONLY.some((f) => m.startsWith(`${f}:`))) : list);
const outErrors = pick(errors);
const outWarnings = pick(warnings);
const failed = outErrors.length > 0 || (STRICT && outWarnings.length > 0);

const pendingFiles = [...pendingTranslation.keys()].filter((f) => !ONLY || ONLY.includes(f));
if (RU_ONLY && pendingFiles.length) {
  const total = pendingFiles.reduce((n, f) => n + pendingTranslation.get(f), 0);
  console.warn(`[check-content] --ru-only: ${total} UZ/EN value(s) await translation in ${pendingFiles.length} file(s) (not errors at this stage)`);
}
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
