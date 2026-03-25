# RailTech Corporate Website

## Project Overview
- Hugo static site generator for RailTech LLC — industrial equipment supplier in Uzbekistan
- Trilingual: Russian (default), English, Uzbek
- Dark premium theme with orange (#f97316) accent
- Deployed to GitHub Pages via GitHub Actions

## Tech Stack
- **SSG**: Hugo 0.145.0 (Go templating, extended edition)
- **CSS**: Custom CSS with CSS variables (no Tailwind/framework)
- **JS**: Vanilla JS, 2 files (main.js + contact-form.js)
- **Forms**: Web3Forms API (serverless)
- **CMS**: FrontMatter CMS (VS Code extension, config in frontmatter.json)
- **Fonts**: Inter (self-hosted woff2 in static/fonts/inter/)
- **Deploy**: GitHub Pages via GitHub Actions (peaceiris/actions-hugo@v3)

## Architecture
```
content/{ru,en,uz}/    — Markdown content per language
layouts/               — Hugo templates
  _default/            — Base templates (baseof, list, single)
  partials/            — 19 reusable components
  {section}/           — Section-specific templates (blog, projects, services, platform, contact)
assets/css/main.css    — Single CSS file (~1575 lines), processed by Hugo Pipes
static/js/             — Client-side JavaScript (main.js, contact-form.js)
static/img/            — Images organized by type (brand, blog, projects, partners, hero, icons, platform)
static/fonts/inter/    — Self-hosted Inter font files (woff2)
i18n/{ru,en,uz}.yaml   — UI translation strings
hugo.toml              — Main configuration (languages, menus, params)
archetypes/            — Content templates (blog.md, projects.md, default.md)
docs/                  — Documentation (CONTENT-GUIDE.md, GITHUB-PAGES-DEPLOY.md)
.github/workflows/     — CI/CD (hugo.yml)
frontmatter.json       — FrontMatter CMS configuration
```

## Key Configuration (hugo.toml)
- `baseURL`: Set by GitHub Actions at build time (`actions/configure-pages` output)
- `defaultContentLanguage`: "ru" (Russian is default, no /ru/ prefix)
- English pages: /en/*, Uzbek pages: /uz/*
- `params.web3forms.accessKey`: Must be set (placeholder by default)
- Stats: years, partners, skus, countries — used in stats section
- Social links: telegram, facebook, instagram, linkedin
- Pagination: 9 items per page
- Outputs: HTML, RSS, JSON (home); HTML, RSS (sections)

## Content Structure

### Current Content Count (per language, identical across ru/en/uz)
- Blog posts: 3 (b2b-platform-launch, import-customs-guide, railway-safety-uzbekistan)
- Projects: 3 (b2b-platform, diagnostic-equipment, uty-safety-systems)
- Services: 4 (equipment-supply, localization, representation, technical-expertise)
- Platform features: 6 (admin, cabinet, calculator, catalog, deals, smart-import)
- Static pages: about, contact, privacy, terms (per language)

### Content Types & Frontmatter

#### Blog Post (content/{lang}/blog/*.md)
```yaml
title: "Post Title"
description: "SEO description"
date: 2024-11-20
author: "RailTech"
image: /img/blog/image.jpg
tags: ["Tag1", "Tag2"]
categories: ["Category"]
```

#### Project (content/{lang}/projects/*.md)
```yaml
title: "Project Name"
description: "Project description"
image: /img/projects/image.jpg
client: "Client Name"
year: "2024"
scope: "Scope description"
status: "completed" | "in_progress"
category: "Category"
```

#### Service (content/{lang}/services/*.md)
```yaml
title: "Service Name"
description: "Service description"
weight: 1
icon: "svg-icon-name"
features: ["Feature 1", "Feature 2"]
```

#### Platform Feature (content/{lang}/platform/*.md)
```yaml
title: "Feature Name"
description: "Feature description"
weight: 1
tag: "Tag"
image: /img/platform/screenshot.jpg
highlights: ["Highlight 1", "Highlight 2"]
```

## Homepage Sections (in order)
Defined in `layouts/index.html`, each is a partial:
1. `hero.html` — Hero banner with animated chips
2. `stats.html` — Counter animation (years, partners, SKUs, countries)
3. `advantages.html` — Company advantages grid
4. `services-preview.html` — Services overview cards
5. `platform-preview.html` — B2B platform showcase
6. `partners.html` — Partner logos ticker
7. `faq.html` — Accordion FAQ (data from content/{lang}/_index.md frontmatter)
8. `cta.html` — Call-to-action section

## Partials Reference (layouts/partials/)
- **Layout**: head.html, header.html, footer.html, scripts.html, breadcrumbs.html
- **Homepage**: hero.html, stats.html, advantages.html, services-preview.html, platform-preview.html, partners.html, faq.html, cta.html
- **Utilities**: schema.html (structured data), svg-sprite.html, share-buttons.html, theme-toggle.html
- **Reusable**: contact-form.html, page-hero.html

## i18n System
- Translation files: `i18n/{ru,en,uz}.yaml`
- Usage in templates: `{{ i18n "key_name" }}`
- Key prefixes: `nav_*` (navigation), `hero_*` (hero section), `tw_*` (ticker widget items), `theme_*` (theme toggle), `footer_*`, `contact_*`, `blog_*`, `services_*`, `projects_*`
- FAQ content is in frontmatter of `content/{lang}/_index.md`
- All keys are present and localized for all 3 languages

## CSS Architecture
- Single file: `assets/css/main.css` (~1575 lines)
- CSS custom properties in `:root` (colors, spacing, typography, transitions)
- BEM-like naming (section-based: `.hero-*`, `.stats-*`, `.blog-*`, etc.)
- Responsive breakpoints: 1024px, 768px, 480px
- Print styles included
- Hugo Pipes: minify + fingerprint for cache busting

## JavaScript Patterns
- `static/js/main.js` (286 lines): IIFE pattern, 'use strict'
  - IntersectionObserver for scroll animations and counter animations
  - Mobile menu: toggle class + aria attributes + Escape key
  - Theme toggle (light/dark)
- `static/js/contact-form.js` (61 lines): async fetch to Web3Forms API
- No dependencies, no build step

## Common Tasks

### Add a new blog post
1. Create `content/{lang}/blog/post-slug.md` with frontmatter (use `archetypes/blog.md` as template)
2. Add image to `static/img/blog/`
3. Create translations in other languages (same filename in each lang directory)
4. Run `npm run dev` to preview

### Add a new project
1. Create `content/{lang}/projects/project-slug.md` (use `archetypes/projects.md`)
2. Add image to `static/img/projects/`
3. Create translations in all 3 languages
4. Set `status` to "completed" or "in_progress"

### Add a new service
1. Create `content/{lang}/services/service-slug.md`
2. Set `weight` for ordering
3. Add translations in all 3 languages

### Add a new platform feature
1. Create `content/{lang}/platform/feature-slug.md`
2. Add screenshot to `static/img/platform/`
3. Set `weight` for ordering
4. Add translations

### Modify homepage sections
- Edit `layouts/partials/{section}.html`
- Homepage section order defined in `layouts/index.html`
- FAQ data in `content/{lang}/_index.md` frontmatter
- Stats in `hugo.toml` → `[params.stats]`
- i18n strings in `i18n/{lang}.yaml`

### Change colors/theme
- Edit CSS custom properties in `:root` of `assets/css/main.css`
- Primary color: `--color-primary` (#f97316)
- Background: `--color-bg` (#0a0a0a)

## Build Commands
- `npm run dev` — Hugo dev server with drafts (`hugo server -D --navigateToChanged`)
- `npm run build` — Production build with minification (`hugo --minify`)
- `npm run build:preview` — Preview build with / as baseURL (`hugo --minify --baseURL '/' -D`)

## Deployment
- **Workflow**: `.github/workflows/hugo.yml`
- **Trigger**: Push to `main` branch or manual dispatch
- **Process**: Checkout → Setup Hugo 0.145.0 (extended) → Build with dynamic baseURL → Upload artifact → Deploy to GitHub Pages
- **Timezone**: Asia/Tashkent
- **Concurrency**: Single deployment at a time (cancel-in-progress: false)

## Important Conventions
- All content must exist in all 3 languages (ru, en, uz) with identical filenames
- Russian content has no URL prefix; English uses `/en/`, Uzbek uses `/uz/`
- Images are organized by content type in `static/img/`
- Menu structure supports nested items (services and platform have dropdowns in Russian nav)
- Schema.org structured data in `layouts/partials/schema.html` (Organization, WebSite, LocalBusiness, BreadcrumbList, Article)

## Known Issues
- Web3Forms API key is a placeholder — needs real key for contact form to work
- `catalogURL` and `cabinetURL` params point to external B2B platform URLs (b2b.railtech.uz, cabinet.railtech.uz)
