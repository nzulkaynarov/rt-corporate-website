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

## 2. Multi-Page Architecture (Strictly NOT a Single-Page Landing)

Every business unit of ООО «RailTech» has its own distinct physical URL with full SEO metadata, OpenGraph, and Schema.org rich snippets:

1. `/` (`src/pages/index.astro`) — Institutional Swiss CAD Hub.
2. `/catalog/` (`src/pages/catalog/index.astro`) — Warehouse equipment catalog with `CatalogFilterTable.tsx` live filter island.
3. `/catalog/[slug]` (`src/pages/catalog/[slug].astro`) — Dynamic technical datasheet / passport pages with Schema.org `Product` JSON-LD and `ProductMediaGallery.tsx`.
4. `/contract` (`src/pages/contract.astro`) — Turnkey foreign trade (ВЭД) import under DDP Tashkent with `LandedCostCalculator.tsx` and `FaqAccordion.astro`.
5. `/digital` (`src/pages/digital.astro`) — RailTech Digital, platform `b2b.railtech.uz`, and interactive sandbox `SmartMatchAiTester.tsx`.
6. `/projects` (`src/pages/projects.astro`) — Technology transfer, UTY testing, and RailTech Art Lab.
7. `/blog` (`src/pages/blog/index.astro`) — Technical engineering blog and news archive with category filtering.
8. `/blog/[slug]` (`src/pages/blog/[slug].astro`) — Article reader with Schema.org `TechArticle` JSON-LD and direct RFQ form.
9. `/about` (`src/pages/about.astro`) — Official legal entity status, warehouse complex Index B2-2097, 12% VAT accreditation, and `FAQPage` JSON-LD.
10. `/contacts` (`src/pages/contacts.astro`) — Direct phone lines (`+998 90 118-90-00`), logistics directions with КПП №3, and `ContactsLeadForm.tsx`.
11. `/privacy` (`src/pages/privacy.astro`) — Privacy policy compliant with Republic of Uzbekistan Law № ЗРУ-547.
12. `/terms` (`src/pages/terms.astro`) — Terms of service, KYC verification levels («Гость» / «Клиент»), Landed Cost DDP formula.
13. `/admin` (`src/pages/admin.astro`) — Sveltia/Decap CMS content management panel (6 collections).

---

## 3. Technology Stack & Rules

* **Framework:** Astro 4.16.x (Static Site Generation / SSG).
* **Client Islands:** React 18 (`client:load` for critical interactive elements like calculators and lead modals, `client:visible` for below-the-fold components).
* **3D Graphics:** Three.js with `GLTFLoader`. Models are kept in `public/models/{modelType}.glb`. Product cards must use real photos and blueprints by default, with 3D as an optional tab.
* **Styling:** Tailwind CSS with custom fonts and CAD styling utilities.
* **Content Management:** Astro Content Collections (`src/content/config.ts`) + Decap CMS (`public/admin/config.yml`).
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
