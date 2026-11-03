import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

/**
 * Build-time guard for public/admin/config.yml (Sveltia CMS).
 *
 * Sveltia refuses to start the whole admin panel ("There are errors in the
 * CMS configuration") if any field — including the single `field:` of a list
 * widget — lacks `name`. This script catches such mistakes before deploy.
 *
 * It also checks every content file (JSON data, Markdown front matter) against the
 * config: a key that exists in the data but is not declared in config.yml would be
 * silently DELETED the first time an editor saves that entry in the CMS.
 */
const CONFIG_PATH = 'public/admin/config.yml';
const errors = [];

let config;
try {
  config = yaml.load(fs.readFileSync(CONFIG_PATH, 'utf8'));
} catch (err) {
  console.error(`[validate-cms-config] ${CONFIG_PATH}: YAML parse error\n${err.message}`);
  process.exit(1);
}

function checkFields(fields, where) {
  if (!Array.isArray(fields)) {
    errors.push(`${where}: "fields" must be a list`);
    return;
  }
  const seen = new Set();
  fields.forEach((field, i) => checkField(field, `${where}[${i}]`, seen));
}

function checkField(field, where, seen) {
  if (!field || typeof field !== 'object') {
    errors.push(`${where}: field must be an object`);
    return;
  }
  const label = field.name ?? field.label ?? '?';
  const path = `${where} (${label})`;
  if (!field.name) errors.push(`${path}: missing required "name"`);
  if (seen && field.name) {
    if (seen.has(field.name)) errors.push(`${path}: duplicate name "${field.name}"`);
    seen.add(field.name);
  }
  if (field.widget === 'object' && !field.fields && !field.types) {
    errors.push(`${path}: object widget needs "fields" or "types"`);
  }
  if (field.widget === 'select' && !Array.isArray(field.options)) {
    errors.push(`${path}: select widget needs "options"`);
  }
  if (field.fields) checkFields(field.fields, `${path}.fields`);
  if (field.field) checkField(field.field, `${path}.field`);
  if (Array.isArray(field.types)) {
    field.types.forEach((type, i) => {
      if (!type?.name) errors.push(`${path}.types[${i}]: missing required "name"`);
      if (type?.fields) checkFields(type.fields, `${path}.types[${i}].fields`);
    });
  }
}

if (!config?.backend?.name) errors.push('backend.name is required');
if (!config?.media_folder) errors.push('media_folder is required');
if (!Array.isArray(config?.collections) || config.collections.length === 0) {
  errors.push('collections must be a non-empty list');
} else {
  const names = new Set();
  config.collections.forEach((col, ci) => {
    const where = `collections[${ci}] (${col?.name ?? '?'})`;
    if (!col?.name) errors.push(`${where}: missing "name"`);
    else if (names.has(col.name)) errors.push(`${where}: duplicate collection name`);
    names.add(col?.name);

    if (col?.folder) {
      checkFields(col.fields, `${where}.fields`);
    } else if (Array.isArray(col?.files)) {
      col.files.forEach((file, fi) => {
        const fwhere = `${where}.files[${fi}] (${file?.name ?? '?'})`;
        if (!file?.name) errors.push(`${fwhere}: missing "name"`);
        if (!file?.file) errors.push(`${fwhere}: missing "file"`);
        else if (!fs.existsSync(file.file)) errors.push(`${fwhere}: file "${file.file}" does not exist`);
        checkFields(file?.fields, `${fwhere}.fields`);
      });
    } else {
      errors.push(`${where}: needs either "folder" or "files"`);
    }
  });
}

// ---------------------------------------------------------------------------
// Data ↔ config consistency
// ---------------------------------------------------------------------------
function readEntry(file) {
  const raw = fs.readFileSync(file, 'utf8');
  if (file.endsWith('.json')) return JSON.parse(raw);
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { body: raw };
  return { ...(yaml.load(m[1]) || {}), body: m[2] };
}

const SCALAR_WIDGETS = new Set(['string', 'text', 'markdown', 'image', 'file', 'datetime', 'color', 'code', 'hidden', 'uuid', 'map', 'relation', 'compute', 'keyvalue']);

function checkData(fields, data, where) {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    errors.push(`${where}: expected an object`);
    return;
  }
  const declared = new Set(fields.map((f) => f.name));
  for (const key of Object.keys(data)) {
    if (!declared.has(key)) errors.push(`${where}: key "${key}" is not declared in config.yml (would be lost on save)`);
  }
  for (const field of fields) {
    const value = data[field.name];
    if (value === undefined || value === null) continue;
    const at = `${where}.${field.name}`;
    const widget = field.widget || 'string';
    if (widget === 'object' && field.fields) checkData(field.fields, value, at);
    else if (widget === 'list') {
      if (!Array.isArray(value)) { errors.push(`${at}: list widget but value is not an array`); continue; }
      value.forEach((item, i) => {
        if (field.fields) checkData(field.fields, item, `${at}[${i}]`);
        else if (field.field?.widget === 'object') checkData(field.field.fields || [], item, `${at}[${i}]`);
        else if (item !== null && typeof item === 'object') errors.push(`${at}[${i}]: expected a plain value`);
      });
    } else if (widget === 'number' && typeof value !== 'number') errors.push(`${at}: number widget but value is ${JSON.stringify(value)}`);
    else if (widget === 'boolean' && typeof value !== 'boolean') errors.push(`${at}: boolean widget but value is ${JSON.stringify(value)}`);
    else if (widget === 'select') {
      const options = (field.options || []).map((o) => (typeof o === 'object' ? o.value : o));
      const values = Array.isArray(value) ? value : [value];
      for (const v of values) if (!options.includes(v)) errors.push(`${at}: "${v}" is not one of the select options`);
    } else if (SCALAR_WIDGETS.has(widget) && typeof value === 'object') errors.push(`${at}: ${widget} widget but value is an object/array`);
  }
}

if (!errors.length) {
  for (const col of config.collections) {
    if (col.folder) {
      const ext = col.extension || (col.format === 'json' ? 'json' : 'md');
      if (!fs.existsSync(col.folder)) { errors.push(`collection ${col.name}: folder "${col.folder}" does not exist`); continue; }
      for (const name of fs.readdirSync(col.folder).filter((n) => n.endsWith(`.${ext}`)).sort()) {
        const file = path.join(col.folder, name);
        try { checkData(col.fields, readEntry(file), file); } catch (e) { errors.push(`${file}: ${e.message}`); }
      }
    } else {
      for (const f of col.files) {
        try { checkData(f.fields, readEntry(f.file), f.file); } catch (e) { errors.push(`${f.file}: ${e.message}`); }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Interface dictionary: every key used in src/ must exist in src/data/cms/ui/*.json
// (an editor deleting a string in the CMS must fail the build, not break the live site)
// ---------------------------------------------------------------------------
const UI_DIR = 'src/data/cms/ui';
if (fs.existsSync(UI_DIR)) {
  const uiKeys = new Set();
  for (const name of fs.readdirSync(UI_DIR).filter((n) => n.endsWith('.json'))) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(UI_DIR, name), 'utf8'));
      for (const s of data.strings || []) {
        if (!s.key || !s.ru) errors.push(`${UI_DIR}/${name}: entry ${JSON.stringify(s.key || s)} needs "key" and "ru"`);
        if (uiKeys.has(s.key)) errors.push(`${UI_DIR}/${name}: duplicate key "${s.key}"`);
        uiKeys.add(s.key);
      }
    } catch (e) {
      errors.push(`${UI_DIR}/${name}: ${e.message}`);
    }
  }
  const sourceFiles = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
      const p = path.join(dir, d.name);
      return d.isDirectory() ? sourceFiles(p) : /\.(astro|tsx?|jsx?)$/.test(d.name) ? [p] : [];
    });
  // t(lang, 'key' …) / t('ru', 'key' …) / tr('key' …) / <I18nText k="key" />
  const patterns = [/\btr?\(\s*(?:[\w.]+|'[a-z]{2}'),\s*(['"`])([a-zA-Z][\w-]*(?:\.[\w${}()+ -]+)+)\1/g, /\btr\(\s*(['"`])([a-zA-Z][\w-]*(?:\.[\w${}()+ -]+)+)\1/g, /\bk=(["'])([a-zA-Z][\w-]*(?:\.[\w-]+)+)\1/g];
  for (const file of sourceFiles('src')) {
    const code = fs
      .readFileSync(file, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '') // block / JSDoc comments
      .replace(/<!--[\s\S]*?-->/g, '') // HTML comments
      .replace(/^\s*\/\/.*$/gm, ''); // line comments
    for (const re of patterns) {
      for (const m of code.matchAll(re)) {
        const key = m[2];
        if (key.includes('${')) {
          const prefix = key.slice(0, key.indexOf('${'));
          if (![...uiKeys].some((k) => k.startsWith(prefix))) errors.push(`${file}: no UI strings match dynamic key "${key}"`);
        } else if (!uiKeys.has(key)) {
          errors.push(`${file}: UI string "${key}" is used in code but missing in ${UI_DIR}/*.json`);
        }
      }
    }
  }
}

if (errors.length) {
  console.error(`[validate-cms-config] ${CONFIG_PATH}: ${errors.length} error(s) — the admin panel would not load or would lose data:`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`[validate-cms-config] ${CONFIG_PATH}: OK`);
