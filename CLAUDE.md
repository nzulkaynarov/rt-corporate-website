# RailTech Corporate Website

## Project Overview
- Hugo static site + **Blowfish v2** theme (git submodule in `themes/blowfish/`)
- Trilingual: Russian (default), English, Uzbek
- Dark theme with orange (#f97316) accent — custom `railtech` color scheme
- Homepage uses Blowfish's native `hero` layout with shortcode-based content
- Deployed to GitHub Pages via GitHub Actions

## Tech Stack
- **SSG**: Hugo 0.158.0+ extended (local installation via Homebrew)
- **Theme**: Blowfish v2 (git submodule: `themes/blowfish/`)
- **CSS**: Blowfish built-in Tailwind — custom color scheme only (`assets/css/schemes/railtech.css`)
- **JS**: Blowfish built-in JS (search, appearance toggle, code copy, etc.)
- **Forms**: Web3Forms API (inline script in contact layout)
- **CMS**: FrontMatter CMS (VS Code extension, config in frontmatter.json)
- **Deploy**: GitHub Pages via GitHub Actions (peaceiris/actions-hugo@v3)

## Architecture
```
hugo.toml              — Main Hugo config (theme, languages, menus, params)
.gitmodules            — Git submodule config (themes/blowfish)
themes/blowfish/       — Blowfish v2 theme (git submodule)
content/{ru,en,uz}/    — Markdown content per language (homepage uses Blowfish shortcodes)
data/                  — Hugo data files (company.yaml, social.yaml, seo.yaml)
layouts/               — Minimal overrides via Blowfish extension points
  partials/extend-head.html       — Inter font import + SEO verification meta
  partials/extend-head-uncached.html — Schema.org structured data inclusion
  partials/extend-footer.html     — Ecosystem links + copyright
  partials/schema-org.html        — JSON-LD structured data
  partials/favicons.html          — Custom SVG favicon
  contact/list.html               — Contact page with Web3Forms
assets/css/schemes/railtech.css   — Custom Blowfish color scheme (orange primary, zinc neutral)
assets/css/custom.css             — Empty (all styling via Blowfish natively)
static/img/            — Images organized by type
i18n/{ru,en,uz}.yaml   — UI translations (contact, form, footer keys only)
archetypes/            — Content templates
.github/workflows/     — CI/CD (hugo.yml) with GitHub Pages deployment
frontmatter.json       — FrontMatter CMS config (Blowfish shortcode snippets)
```

## Hugo Configuration (hugo.toml)

### Key Settings
- `theme = "blowfish"` — Points to `themes/blowfish/` (git submodule)
- `colorScheme = "railtech"` — Custom color scheme in `assets/css/schemes/railtech.css`
- `defaultAppearance = "dark"` — Dark mode by default
- `homepage.layout = "hero"` — Uses Blowfish's native hero layout
- `[params.author]` — Company branding (name, image, headline, social links) for hero layout
- `[params.extra]` — RailTech-specific: phone, email, catalogURL, cabinetURL, web3formsKey
- `article.sharingLinks = ["telegram", "facebook", "linkedin"]` — Social sharing
- `list.cardView = true` — Card layout for blog/projects

### Homepage
- Uses Blowfish `hero` layout with `[params.author]` for company branding
- Per-language headlines via `[languages.XX.params.author]`
- Content in `content/{lang}/_index.md` using Blowfish shortcodes:
  - `{{< lead >}}` for subtitle
  - `{{< button >}}` for CTAs
  - `{{< list >}}` for service cards
  - `{{< accordion >}}` for advantages and FAQ sections
- Shows 6 recent items with card view

### Languages & Menus
- **Languages**: Russian (default, no prefix), English (`/en/`), Uzbek (`/uz/`)
- **Menus**: Defined inline in hugo.toml per language using `pageRef` (Blowfish auto-resolves URLs)
- **Main menu**: About, Services, Projects, Platform, Blog, Contact
- **Service submenu**: Engineering, Consulting, Supplies (Russian only)
- **Platform submenu**: Catalog, Deals, Admin (Russian only)

## Data Files (data/)
- `company.yaml` — Brand/legal names, founding year, address, partners list (used by contact + schema-org)
- `social.yaml` — Social media URLs (used by footer + schema-org)
- `seo.yaml` — SEO verification codes + robots/sitemap settings (used by extend-head)

## Content Structure

### Current Content (per language, identical across ru/en/uz)
- Blog posts: 3
- Projects: 3
- Services: 4
- Platform features: 6
- Static pages: about, contact, privacy, terms

### Content Types & Frontmatter
Blog, project, service, platform content types with standard Hugo frontmatter.
Blowfish renders these automatically with built-in list/single templates.

## Custom Layouts (6 files — all via Blowfish extension points)
| File | Purpose |
|------|---------|
| `partials/extend-head.html` | Inter font + SEO verification meta |
| `partials/extend-head-uncached.html` | Schema.org inclusion per page |
| `partials/extend-footer.html` | Ecosystem links + social icons + copyright |
| `partials/schema-org.html` | JSON-LD structured data |
| `partials/favicons.html` | Custom SVG favicon |
| `contact/list.html` | Contact form (Web3Forms) + company info |

Everything else (header, footer, blog, projects, services, 404, search, hero homepage) comes from Blowfish.

## i18n System
- `i18n/{ru,en,uz}.yaml` — UI strings for custom layouts only
- Custom keys: `form_*`, `contact_*`, `footer_*`, `btn_*`, `err_*`, `nav_*`, `link_new_tab`
- Blowfish has built-in ru + en translations; uz.yaml additionally includes Blowfish UI keys (article.*, error.*, footer.*, search.*, sharing.*)

## Blowfish Color Scheme (assets/css/schemes/railtech.css)
- Primary: Orange (Tailwind orange scale, accent #f97316)
- Neutral: Zinc (dark corporate background)
- Secondary: Slate

## Common Tasks

### Add content
1. Create `content/{lang}/section/slug.md` (use archetypes)
2. Add image to `static/img/section/`
3. Create translations in all 3 languages
4. Run `hugo server -D` to preview

### Modify homepage
- Edit `content/{lang}/_index.md` (uses Blowfish shortcodes)
- Author/headline: `hugo.toml` → `[params.author]` and `[languages.XX.params.author]`
- Recent items count: `hugo.toml` → `[params.homepage]` → `showRecentItems`

### Change colors
- Edit `assets/css/schemes/railtech.css` (Tailwind RGB color tokens)

### Update Blowfish theme
```bash
cd themes/blowfish && git pull origin main && cd ../..
# or manually: git submodule update --remote themes/blowfish
```

## Build Commands
- `hugo server -D` — Dev server (http://localhost:1313/ with live reload)
  - RU: http://localhost:1313/
  - EN: http://localhost:1313/en/
  - UZ: http://localhost:1313/uz/
- `hugo` — Production build (generates `public/`)
- `hugo --minify` — Production build with minification

## Deployment
- **Workflow**: `.github/workflows/hugo.yml`
- **Required GitHub Variables**: `SITE_URL`, `DEPLOY_REPO`, `CNAME_DOMAIN` (optional)
- **Required GitHub Secrets**: `DEPLOY_KEY` (SSH private key)
- **Steps**: Checkout → Setup Hugo → Build → Deploy to public repo
- **Target**: Private source repo (main branch) → public deployment repo (gh-pages branch)

## Important Conventions
- All content in 3 languages with identical filenames
- Russian = default (no URL prefix); English = `/en/`; Uzbek = `/uz/`
- Menus use `pageRef` (Blowfish resolves URLs per language automatically)
- Only override Blowfish layouts via official extension points
- No custom CSS/JS — use Blowfish's built-in Tailwind classes only
- Homepage content managed via Blowfish shortcodes in _index.md, not custom templates
- Theme installed as git submodule — always run `git submodule update --init --recursive` after clone

## Configuration Notes
- **Hugo version**: 0.158.0+ extended (verified locally)
- **Blowfish theme version**: Latest from main branch (git submodule)
- **Color scheme**: Custom railtech scheme in `assets/css/schemes/railtech.css`
- **Web3Forms**: `web3formsKey` in `hugo.toml` needs real API key for contact form
- **B2B URLs**: `catalogURL` and `cabinetURL` in `hugo.toml` point to external platform

## Setup (Fresh Clone)
```bash
git clone <repo>
cd rt-corporate-website
git submodule update --init --recursive
hugo server -D  # Start dev server with live reload
```
