import fs from 'node:fs';
import yaml from 'js-yaml';

/**
 * Build-time guard for public/admin/config.yml (Sveltia CMS).
 *
 * Sveltia refuses to start the whole admin panel ("There are errors in the
 * CMS configuration") if any field — including the single `field:` of a list
 * widget — lacks `name`. This script catches such mistakes before deploy.
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

if (errors.length) {
  console.error(`[validate-cms-config] ${CONFIG_PATH}: ${errors.length} error(s) — the admin panel would not load:`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`[validate-cms-config] ${CONFIG_PATH}: OK`);
