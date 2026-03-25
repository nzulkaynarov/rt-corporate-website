# RailTech Corporate Website

## Project Overview
- Hugo static site generator for RailTech LLC — industrial equipment supplier in Uzbekistan
- Trilingual: Russian (default), English, Uzbek
- Dark premium theme with orange (#f97316) accent
- Deployed to GitHub Pages

## Tech Stack
- **SSG**: Hugo (Go templating)
- **CSS**: Custom CSS with CSS variables (no Tailwind/framework)
- **JS**: Vanilla JS, 2 files (main.js + contact-form.js)
- **Forms**: Web3Forms API (serverless)
- **CMS**: FrontMatter CMS (VS Code extension)
- **Fonts**: Inter (Google Fonts)
- **Deploy**: GitHub Pages via GitHub Actions

## Architecture
```
content/{ru,en,uz}/    — Markdown content per language
layouts/               — Hugo templates
  _default/            — Base templates (baseof, list, single)
  partials/            — 18 reusable components
  {section}/           — Section-specific templates
assets/css/main.css    — Single CSS file (1266 lines), processed by Hugo Pipes
static/js/             — Client-side JavaScript
static/img/            — Images organized by type (brand, blog, projects, partners, hero, icons)
i18n/{ru,en,uz}.yaml   — UI translation strings
hugo.toml              — Main configuration (languages, menus, params)
```

## Key Configuration (hugo.toml)
- `baseURL`: Set by GitHub Actions at build time
- `defaultContentLanguage`: "ru" (Russian is default, no /ru/ prefix)
- English pages: /en/*, Uzbek pages: /uz/*
- `params.web3forms.accessKey`: Must be set (placeholder by default)
- Stats: years, partners, skus, countries — used in stats section
- Social links: telegram, facebook, instagram, linkedin

## Content Types & Frontmatter

### Blog Post (content/{lang}/blog/*.md)
```yaml
title: "Post Title"
description: "SEO description"
date: 2024-11-20
author: "RailTech"
image: /img/blog/image.jpg
tags: ["Tag1", "Tag2"]
categories: ["Category"]
```

### Project (content/{lang}/projects/*.md)
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

### Service (content/{lang}/services/*.md)
```yaml
title: "Service Name"
description: "Service description"
weight: 1
icon: "svg-icon-name"
features: ["Feature 1", "Feature 2"]
```

### Platform Feature (content/{lang}/platform/*.md)
```yaml
title: "Feature Name"
description: "Feature description"
weight: 1
tag: "Tag"
image: /img/platform/screenshot.jpg
highlights: ["Highlight 1", "Highlight 2"]
```

## i18n System
- Translation files: i18n/{ru,en,uz}.yaml
- Usage in templates: `{{ i18n "key_name" }}`
- Some keys have hardcoded Russian defaults in templates (hero chips, ticker)
- FAQ content is in frontmatter of content/{lang}/_index.md

## CSS Architecture
- Single file: assets/css/main.css
- CSS custom properties in :root (colors, spacing, typography, transitions)
- BEM-like naming (section-based: .hero-*, .stats-*, .blog-*, etc.)
- Responsive breakpoints: 1024px, 768px, 480px
- Print styles included
- Hugo Pipes: minify + fingerprint for cache busting

## JavaScript Patterns
- IIFE pattern, 'use strict'
- IntersectionObserver for scroll animations and counter animations
- Mobile menu: toggle class + aria attributes + Escape key
- Contact form: async fetch to Web3Forms API
- No dependencies, no build step

## Common Tasks

### Add a new blog post
1. Create content/{lang}/blog/post-slug.md with frontmatter
2. Add image to static/img/blog/
3. Create translations in other languages (same filename)
4. Run `npm run dev` to preview

### Add a new service
1. Create content/{lang}/services/service-slug.md
2. Set weight for ordering
3. Add translations

### Modify homepage sections
- Edit layouts/partials/{section}.html
- Homepage content order defined in layouts/index.html
- FAQ data in content/{lang}/_index.md frontmatter
- Stats in hugo.toml [params.stats]
- i18n strings in i18n/{lang}.yaml

### Change colors/theme
- Edit CSS custom properties in :root of assets/css/main.css
- Primary color: --color-primary (#f97316)
- Background: --color-bg (#0a0a0a)

## Build Commands
- `npm run dev` — Hugo dev server with drafts
- `npm run build` — Production build with minification
- `npm run build:preview` — Preview build with / as baseURL

## Known Issues
- body tag has Tailwind classes but Tailwind is not used (dead code in baseof.html)
- SearchAction in schema.org points to non-existent /search page
- Some i18n keys missing (hero_chip_*, tw_* — fallback to Russian defaults)
- $currentLang variable scope issue in header.html mobile menu
- Google Fonts not self-hosted (GDPR/performance concern)
- Web3Forms API key is placeholder
