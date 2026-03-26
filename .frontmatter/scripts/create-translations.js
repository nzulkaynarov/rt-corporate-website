// FrontMatter CMS custom script: create missing translation files
// Scans content for files that exist in one language but not others
const fs = require('fs');
const path = require('path');

const contentDir = path.join(process.cwd(), 'content');
const langs = ['ru', 'en', 'uz'];
const sections = ['blog', 'projects', 'services', 'platform'];

let created = 0;

for (const section of sections) {
  const allFiles = new Set();

  // Collect all filenames across languages
  for (const lang of langs) {
    const dir = path.join(contentDir, lang, section);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && f !== '_index.md');
    files.forEach(f => allFiles.add(f));
  }

  // Check for missing translations
  for (const file of allFiles) {
    for (const lang of langs) {
      const filePath = path.join(contentDir, lang, section, file);
      if (!fs.existsSync(filePath)) {
        // Find a source file to copy frontmatter from
        let source = null;
        for (const srcLang of langs) {
          const srcPath = path.join(contentDir, srcLang, section, file);
          if (fs.existsSync(srcPath)) {
            source = fs.readFileSync(srcPath, 'utf8');
            break;
          }
        }

        if (source) {
          // Extract frontmatter and create stub
          const match = source.match(/^---\n([\s\S]*?)\n---/);
          if (match) {
            const stub = `---\n${match[1]}\n---\n\n<!-- TODO: Translate this content to ${lang} -->\n`;
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, stub, 'utf8');
            created++;
            console.log(`Created: ${lang}/${section}/${file}`);
          }
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
