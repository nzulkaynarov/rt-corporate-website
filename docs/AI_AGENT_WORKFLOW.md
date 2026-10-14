# AI Agent Workflow — Operating Procedures for RailTech

This document details the standard operating procedures (SOPs) for autonomous and pair-programming AI agents operating in this repository.

---

## 1. How to Add a New Catalog Equipment Item

1. Create a new markdown file in `src/content/catalog/{slug}.md` (e.g. `src/content/catalog/rt-saut-01.md`).
2. Add the required frontmatter matching `src/content/config.ts`:
   ```yaml
   ---
   sku: "RT-SAUT-01"
   title: "Блок контроля бдительности машиниста КОН-01"
   subsystem: "СЦБ и автоматика"
   gost: "ТУ 32 ЦШ 2045-98"
   tnved: "8608 00 000 0"
   warehouse: "Ташкент, ТПК Index B2-2097"
   status: "В наличии"
   statusKey: "in_stock"
   specs: "Напряжение 24/50В, интервал бдительности 30-90 сек"
   warranty: "24 месяца"
   priceNote: "Цена по запросу (с НДС 12%)"
   modelType: "bogie"
   order: 11
   ---
   Detailed engineering description and operating parameters here.
   ```
3. Run `npm run build` to verify that Astro generates `/catalog/rt-saut-01/index.html` and adds it to `sitemap-index.xml`.

---

## 2. How to Modify Content via Decap CMS

1. Start dev server: `npx astro dev --port 4321`.
2. Open `http://localhost:4321/admin`.
3. Select collection (Catalog, Contract Stages, Digital Products, Projects).
4. Edit markdown fields and save. Decap CMS commits directly to `src/content/`.

---

## 3. Pre-Commit Verification Checklist for AI Agents

Before creating any commit or informing the user that a task is complete, an AI agent MUST verify:
- [ ] No TypeScript or syntax errors (`npm run build` exits with code 0).
- [ ] All 8 URLs respond with status 200:
  - `/`
  - `/catalog/`
  - `/catalog/[slug]`
  - `/contract`
  - `/digital`
  - `/projects`
  - `/about`
  - `/contacts`
- [ ] Visual invariants preserved (zero border-radius, 1px solid borders, #D4D8DC canvas, JetBrains Mono font for numbers and codes).
- [ ] No uncommitted scratch files or secrets leaked into Git.
