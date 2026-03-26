# RailTech Corporate Website

## Project Overview
- Hugo static site + **Blowfish v2** theme (via Hugo Modules)
- Trilingual: Russian (default), English, Uzbek
- Dark theme with orange (#f97316) accent — custom `railtech` color scheme
- Deployed to GitHub Pages via GitHub Actions

## Tech Stack
- **SSG**: Hugo 0.148.1+ (extended edition, Go templating)
- **Theme**: Blowfish v2 (`github.com/nunocoracao/blowfish/v2`) via Hugo Modules
- **CSS**: Blowfish built-in Tailwind — zero custom CSS (only color scheme override)
- **JS**: Blowfish built-in JS (search, appearance toggle, code copy, etc.)
- **Forms**: Web3Forms API (inline script in contact layout)
- **CMS**: FrontMatter CMS (VS Code extension, config in frontmatter.json)
- **Deploy**: GitHub Pages via GitHub Actions (peaceiris/actions-hugo@v3 + actions/setup-go@v5)

## Architecture
```
config/_default/       — Split TOML configuration (Blowfish pattern)
  hugo.toml            — Base config + module import
  params.toml          — Blowfish theme parameters + [extra] for RailTech
  markup.toml          — Goldmark + highlight settings
  languages.{ru,en,uz}.toml — Per-language config with author + social links
  menus.{ru,en,uz}.toml     — Navigation menus (use pageRef, not url)
go.mod                 — Hugo Module dependency (Blowfish v2)
content/{ru,en,uz}/    — Markdown content per language
data/                  — Hugo data files (company.yaml, advantages.yaml, social.yaml, stats.yaml)
layouts/               — Only 4 override files (everything else from Blowfish)
  partials/home/custom.html  — Corporate homepage (hero, stats, services, CTA)
  partials/extend-head.html  — Favicon + OG image meta
  partials/extend-footer.html — Ecosystem links + copyright
  contact/list.html          — Contact page with Web3Forms
assets/css/schemes/railtech.css — Custom Blowfish color scheme (orange primary, zinc neutral)
static/img/            — Images organized by type
i18n/{ru,en,uz}.yaml   — UI translations (uz includes Blowfish UI keys)
archetypes/            — Content templates
.github/workflows/     — CI/CD (hugo.yml) — includes Go setup for Hugo Modules
frontmatter.json       — FrontMatter CMS config (Blowfish shortcode snippets)
```

## Blowfish Configuration (config/_default/)

### params.toml — Key Settings
- `colorScheme = "railtech"` — Custom color scheme in `assets/css/schemes/`
- `defaultAppearance = "dark"` — Dark mode by default
- `homepage.layout = "custom"` — Uses `layouts/partials/home/custom.html`
- `[extra]` section — RailTech-specific params (phone, email, catalogURL, web3formsKey, stats)
- `article.sharingLinks` — Telegram, Facebook, LinkedIn
- `list.cardView = true` — Card layout for blog/projects listings

### Menus (menus.*.toml)
- Use `pageRef` (not `url`) for automatic multilingual URL resolution
- Main: About, Services, Projects, Platform, Blog, Contact
- Footer: Privacy, Terms

## Data Files (data/)
- `company.yaml` — Brand/legal names, founding year, address, partners list
- `advantages.yaml` — Advantages section data
- `social.yaml` — Social media URLs
- `stats.yaml` — Homepage stats

## Content Structure

### Current Content (per language, identical across ru/en/uz)
- Blog posts: 3
- Projects: 3
- Services: 4
- Platform features: 6
- Static pages: about, contact, privacy, terms

### Content Types & Frontmatter
Same as before — blog, project, service, platform content types with standard Hugo frontmatter.
Blowfish renders these automatically with built-in list/single templates.

## Homepage (layouts/partials/home/custom.html)
Sections in order:
1. Hero — chips, headline, CTA buttons (all from i18n)
2. Stats — counters from `[extra.stats]` in params.toml
3. Services preview — auto-generated from `/services/` section pages
4. CTA — contact + catalog links

## Custom Layouts (only 4 files)
| File | Purpose |
|------|---------|
| `partials/home/custom.html` | Corporate homepage |
| `partials/extend-head.html` | Favicon + OG meta |
| `partials/extend-footer.html` | Ecosystem links + copyright |
| `contact/list.html` | Contact form (Web3Forms) + info |

Everything else (header, footer, blog, projects, services, 404, search, etc.) comes from Blowfish.

## i18n System
- `i18n/{ru,en,uz}.yaml` — All UI strings
- Blowfish has built-in ru + en translations; uz.yaml includes Blowfish UI keys (article.*, error.*, footer.*, search.*, sharing.*)
- Custom keys: `hero_*`, `stats_*`, `srv_*`, `cta_*`, `form_*`, `footer_*`, `contact_*`, etc.

## Blowfish Color Scheme (assets/css/schemes/railtech.css)
- Primary: Orange (Tailwind orange scale, accent #f97316)
- Neutral: Zinc (dark corporate background)
- Secondary: Slate

## Common Tasks

### Add content
1. Create `content/{lang}/section/slug.md` (use archetypes)
2. Add image to `static/img/section/`
3. Create translations in all 3 languages
4. Run `npm run dev` to preview

### Modify homepage
- Edit `layouts/partials/home/custom.html`
- Stats: `config/_default/params.toml` → `[extra.stats]`
- i18n strings: `i18n/{lang}.yaml`

### Change colors
- Edit `assets/css/schemes/railtech.css` (Tailwind RGB color tokens)

### Update Blowfish theme
- `npm run mod:update` or `hugo mod get -u ./...`
- `npm run mod:tidy` to clean go.sum

## Build Commands
- `npm run dev` — Dev server with drafts
- `npm run build` — Production build
- `npm run build:preview` — Preview build with / baseURL
- `npm run mod:update` — Update Blowfish to latest
- `npm run mod:tidy` — Clean up go.sum

## Deployment
- **Workflow**: `.github/workflows/hugo.yml`
- **Steps**: Checkout → Setup Go → Setup Hugo → Cache modules → `hugo mod get` → Build → Deploy
- **Target**: Private source repo → public deployment repo via SSH deploy key

## Important Conventions
- All content in 3 languages with identical filenames
- Russian = default (no URL prefix); English = `/en/`; Uzbek = `/uz/`
- Menus use `pageRef` (Blowfish resolves URLs per language automatically)
- Only override Blowfish layouts via official extension points
- No custom CSS/JS — use Blowfish's built-in Tailwind classes and features

## Known Issues
- `web3formsKey` in params.toml is a placeholder — needs real API key
- `catalogURL` / `cabinetURL` point to external B2B platform URLs
