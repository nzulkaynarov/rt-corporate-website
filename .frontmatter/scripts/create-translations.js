// FrontMatter CMS custom script: create missing translation files
// Supports both Page Bundles (dir/index.md) and standalone .md files
// Run: node .frontmatter/scripts/create-translations.js
const fs = require('fs');
const path = require('path');

const contentDir = path.join(process.cwd(), 'content');
const langs = ['ru', 'en', 'uz'];
const sections = ['blog', 'projects', 'services', 'platform'];

let created = 0;

for (const section of sections) {
  const allEntries = new Set();

  // Collect all content entries across languages (Page Bundles + standalone)
  for (const lang of langs) {
    const dir = path.join(contentDir, lang, section);
    if (!fs.existsSync(dir)) continue;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === '_index.md') continue;

      if (entry.isDirectory()) {
        // Page Bundle: check if index.md exists inside
        const indexPath = path.join(dir, entry.name, 'index.md');
        if (fs.existsSync(indexPath)) {
          allEntries.add({ type: 'bundle', name: entry.name });
        }
      } else if (entry.name.endsWith('.md')) {
        // Standalone .md file
        allEntries.add({ type: 'standalone', name: entry.name });
      }
    }
  }

  // Check for missing translations
  for (const entry of allEntries) {
    for (const lang of langs) {
      let targetPath;
      let sourcePath = null;

      if (entry.type === 'bundle') {
        targetPath = path.join(contentDir, lang, section, entry.name, 'index.md');
      } else {
        targetPath = path.join(contentDir, lang, section, entry.name);
      }

      if (fs.existsSync(targetPath)) continue;

      // Find a source file to copy frontmatter from
      for (const srcLang of langs) {
        let srcPath;
        if (entry.type === 'bundle') {
          srcPath = path.join(contentDir, srcLang, section, entry.name, 'index.md');
        } else {
          srcPath = path.join(contentDir, srcLang, section, entry.name);
        }
        if (fs.existsSync(srcPath)) {
          sourcePath = srcPath;
          break;
        }
      }

      if (!sourcePath) continue;

      const source = fs.readFileSync(sourcePath, 'utf8');
      const match = source.match(/^---\n([\s\S]*?)\n---/);
      if (!match) continue;

      const langNames = { ru: 'Russian', en: 'English', uz: 'Uzbek' };
      const stub = `---\n${match[1]}\n---\n\n<!-- TODO: Translate this content to ${langNames[lang] || lang} -->\n`;
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, stub, 'utf8');
      created++;

      const relPath = path.relative(contentDir, targetPath);
      console.log(`Created: ${relPath}`);

      // Copy featured.jpg if source bundle has one
      if (entry.type === 'bundle') {
        const srcDir = path.dirname(sourcePath);
        const featuredSrc = path.join(srcDir, 'featured.jpg');
        if (fs.existsSync(featuredSrc)) {
          const featuredDst = path.join(path.dirname(targetPath), 'featured.jpg');
          fs.copyFileSync(featuredSrc, featuredDst);
          console.log(`  + Copied featured.jpg`);
        }
      }
    }
  }
}

if (created === 0) {
  console.log('All translations are in sync!');
} else {
  console.log(`\nCreated ${created} translation stub(s). Search for "TODO: Translate" to find them.`);
}
