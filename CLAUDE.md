# CLAUDE.md — Operating Instructions for Claude Code in RailTech

## Project Overview
Official B2B/B2G industrial portal for ООО «RailTech» (Tashkent, Uzbekistan, railtech.uz).
Architecture: Astro 4 (SSG) + React 18 + Three.js + Tailwind CSS + TypeScript.

## Build & Test Commands
- Install: `npm install`
- Dev server: `npx astro dev --port 4321`
- Production build: `npm run build`
- Type checking: Built-in to `npm run build` via `astro check`

## Style & Architecture Guidelines
- **Brutalist CAD UI**: Zero border radius (`rounded-none`), `#D4D8DC` canvas, `#0A0A0A` ink & borders, `#4A5056` labels.
- **Active State Inversion**: `bg-[#0A0A0A] text-white`.
- **Typography Pair**: Plus Jakarta Sans (headings) + JetBrains Mono (technical codes, GOST, prices).
- **Multi-page, multi-language strictly**: every page exists at `/…` (ru), `/uz/…`, `/en/…` — pages live in `src/pages/[...lang]/`, language from `Astro.locals.lang`. See AGENTS.md §2 for the routes and i18n rules.
- **No hardcoded text**: UI labels in `src/data/cms/ui/*.json`, content in `src/data/cms/*.json` / `src/content/`; internal links via `localeHref()`; SEO via `pageSeo()`/`entrySeo()`. `npm run build` validates the CMS schema (prebuild) and audits dist/ for SEO/i18n errors (postbuild).
- **Product Media**: Real photos and blueprints take precedence over 3D models.
- **Content Collections**: Stored in `src/content/` (`catalog`, `services`, `projects`, `blog`). Schema is typed in `src/content/config.ts`; CMS schema in `public/admin/config.yml` must match it.
- **Global Leads**: Triggered via `data-lead-modal data-lead-subject="..."` or `window.dispatchEvent(new CustomEvent('open-lead-modal', { detail: { subject } }))`.

## Content Work (products, services, projects, blog, page texts)
- Rules: `docs/content/README.md` (workflow), `STYLE_GUIDE.md` (facts policy — never invent prices, stock, certificates, clients, numbers), `GLOSSARY.md` (RU/UZ/EN terms), `SEO.md`.
- Use the project skills: `add-product`, `add-service`, `add-project`, `write-blog-post`, `translate-content`, `edit-site-texts`, then `content-qa` and `content-pr`. For a whole brief, delegate to the `content-writer` subagent; review with `content-reviewer`.
- Every text field in RU + `_uz` (Latin) + `_en`; `npm run check:content -- --strict` and `npm run build` must pass before a PR.
- Content branches `content/<type>-<slug>`, PR into `main`; never push to `main` directly (merge = deploy).

