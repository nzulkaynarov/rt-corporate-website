# AGENTS.md — AI Engineering Guidelines for RailTech Portal

Welcome, AI Agent. This repository contains the official corporate B2B/B2G portal for **ООО «RailTech»** (`railtech.uz`, `b2b.railtech.uz`), registered in Tashkent, Republic of Uzbekistan.

---

## 1. Core Visual & Architectural Invariants (DO NOT VIOLATE)

* **Design Philosophy:** Brutalist CAD / Technical Wireframe UI (inspired by Swiss technical graphics, Teenage Engineering, McMaster-Carr, Siemens Mobility).
* **Color Palette:**
  * Canvas: Matte Titanium Grey `#D4D8DC` to `#C4C9CE` with 1px coordinate grid (`rgba(10, 10, 10, 0.06)`).
  * Ink & Borders: Deep Charcoal Black `#0A0A0A`, borders strictly `1px solid #0A0A0A` (or `border-2` for key frames).
  * Metadata & Labels: `#4A5056`.
  * Active & Selected States: Pure Color Inversion (`bg-[#0A0A0A] text-white`).
* **Geometry:** `border-radius: 0px` globally (no rounded bubbles, no pills, no soft shadows).
* **Typography:**
  * Headings & titles: `Plus Jakarta Sans` or `Inter` (bold, tight tracking).
  * Specifications, GOSTs, HS codes (ТН ВЭД), telemetry, prices, degrees: `JetBrains Mono` (`font-mono`).
* **Zero Fluff:** No emojis in buttons or headers, no playful neon gradients, no generic stock corporate illustration illustrations.

---

## 2. Multi-Page, Multi-Language Architecture (Strictly NOT a Single-Page Landing)

Every page exists once per language, each with its own URL, `<html lang>`, title/description, canonical and hreflang:
`/…` = Russian (default, no prefix), `/uz/…` = Uzbek (Latin), `/en/…` = English. All public pages live in
`src/pages/[...lang]/` and export `getStaticPaths` (`langStaticPaths` or `expandLangs(paths)` from `src/i18n`).

| Route | File | Notes |
|---|---|---|
| `/` | `[...lang]/index.astro` | Hub, `HudMediaSlider` island |
| `/catalog/` | `[...lang]/catalog/index.astro` | `CatalogFilterTable` island, CollectionPage JSON-LD |
| `/catalog/<slug>/` | `[...lang]/catalog/[slug].astro` | Datasheet, `Product` JSON-LD, `ProductMediaGallery` |
| `/services/`, `/services/<slug>/` | `[...lang]/services/…` | `Service` JSON-LD |
| `/projects/`, `/projects/<slug>/` | `[...lang]/projects/…` | Case studies |
| `/blog/`, `/blog/<slug>/` | `[...lang]/blog/…` | `BlogPosting` JSON-LD |
| `/about/` | `[...lang]/about.astro` | `FAQPage` JSON-LD |
| `/contacts/` | `[...lang]/contacts.astro` | `ContactsLeadForm` island |
| `/privacy/`, `/terms/` | `[...lang]/privacy.astro`, `terms.astro` | Texts in `legal.json` |
| `/404.html` | `404.astro` | Trilingual, noindex |
| `/admin/` | `admin.astro` | Sveltia CMS (version pinned) |
| `/contract/`, `/digital/` | legacy redirects | noindex, excluded from sitemap |

### i18n & content rules (enforced by `npm run build`)
* **Language comes from the URL.** `src/middleware.ts` sets `Astro.locals.lang`; React islands receive a required `lang` prop. Never use localStorage, `?lang=` or CSS-hidden translations.
* **No human-readable text in code.** Interface labels → `src/data/cms/ui/<area>.json` (`<I18nText k="area.key" />`, `t(lang, key)`; islands use `makeT([json])`). Business content → `src/data/cms/*.json` or `src/content/**` with the `field` / `field_uz` / `field_en` pattern (`<I18nText ru uz en />`, `tField`). Both are editable in `/admin`.
* **Links:** pages → `localeHref('/route/', lang)`; static files → `withBase()`.
* **SEO:** every page passes `title`/`description` from `pageSeo()` (texts in `src/data/cms/seo.json`) or `entrySeo()` (optional `seoTitle`/`seoDescription` fields on entries) to `BaseLayout`, plus `breadcrumbs` and page-specific `jsonLd`. BaseLayout renders canonical, hreflang, Open Graph, Organization/WebSite/BreadcrumbList JSON-LD.
* **CMS schema:** every field present in the data must be declared in `public/admin/config.yml`, and every field (incl. a list's single `field:`) must have a `name` — otherwise Sveltia refuses to load or silently drops data on save. `scripts/validate-cms-config.mjs` (prebuild) enforces both.
* **Build gate:** `scripts/check-build.mjs` (postbuild) fails on cross-language links, leftover `rt-lang` markup, wrong `<html lang>`, missing title/description/canonical/hreflang, ≠1 `<h1>`, `<img>` without alt; warns on long meta texts, duplicate titles and untranslated pages.

---

## 3. Technology Stack & Rules

* **Framework:** Astro 4.16.x (Static Site Generation / SSG).
* **Client Islands:** React 18 (`client:load` for critical interactive elements like calculators and lead modals, `client:visible` for below-the-fold components).
* **3D Graphics:** Three.js with `GLTFLoader`. Models are kept in `public/models/{modelType}.glb`. Product cards must use real photos and blueprints by default, with 3D as an optional tab.
* **Styling:** Tailwind CSS with custom fonts and CAD styling utilities.
* **Content Management:** Astro Content Collections (`src/content/config.ts`) + Sveltia CMS (`public/admin/config.yml`). Sveltia rejects the whole config if any field — including the single `field:` of a `list` widget — has no `name`; `scripts/validate-cms-config.mjs` (run in `prebuild`) enforces this.
* **Lead Capturing:** Cloudflare Worker webhook (`cloudflare-worker/telegram-webhook.js`) forwarding Base64 files and specs directly to Telegram.
* **CI/CD:** GitHub Actions (`.github/workflows/deploy.yml`) deploying static build to GitHub Pages upon push to `main`.

---

## 4. Operational Commands for Agents

* **Install dependencies:** `npm install`
* **Local development:** `npx astro dev --port 4321`
* **Static production build:** `npm run build` (MANDATORY: Must exit with 0 errors before committing).
* **Check Git status:** `git status`

---

## 5. Domain Knowledge Quick Reference

* **Legal Entity:** ООО «RailTech» (RailTech LLC), Tashkent, Uzbekistan.
* **Tax ID / INN:** `308912445` (12% VAT accredited).
* **Warehouse Hub:** Tashkent, Yangihayot district, Trade-Production Complex Index, Block B2, Section 2097.
* **Key Strategic Partners:** НПО САУТ (locomotive safety automation), Tashkent State Transport University (TGTU), GAJK «O'zbekiston temir yo'llari» (UTY).
* **Customs Delivery Terms:** DDP Tashkent (prices fixed in Uzbek Sums, 100% compliant tax invoice with 12% VAT).
