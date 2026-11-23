// @ts-check
/**
 * Build-time (Node) view of translateLocales() for every «Новости» route, read straight from the content files:
 * used by the sitemap filter (astro.config.mjs) and the dist audit (scripts/check-build.mjs), which run outside Astro.
 *   untranslatedRoutes() → Map { '/news/partner-gersys/' → ['ru'] , … } (only routes missing some locale)
 */
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { translatedLocales } from './blocks.mjs';

/** @param {string} file */
function readEntry(file) {
  const m = fs.readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  return m ? { data: /** @type {Record<string, any>} */ (yaml.load(m[1], { schema: yaml.CORE_SCHEMA }) || {}), body: m[2] } : { data: {}, body: '' };
}

/** @param {string} [root] repository root @returns {Map<string, string[]>} route → locales it is translated into */
export function newsRouteLocales(root = process.cwd()) {
  /** @type {Map<string, string[]>} */
  const out = new Map();
  /** @param {string} dir */
  const md = (dir) => (fs.existsSync(path.join(root, dir)) ? fs.readdirSync(path.join(root, dir)).filter((n) => n.endsWith('.md')) : []);
  for (const name of md('src/content/news')) {
    const { data, body } = readEntry(path.join(root, 'src/content/news', name));
    out.set(`/news/${name.replace(/\.md$/, '')}/`, translatedLocales(data, body));
  }
  for (const name of md('src/content/partners')) {
    const { data, body } = readEntry(path.join(root, 'src/content/partners', name));
    if (!body.trim() || !data.title) continue; // no article yet → no page
    out.set(`/news/partner-${name.replace(/\.md$/, '')}/`, translatedLocales(data, body));
  }
  return out;
}
