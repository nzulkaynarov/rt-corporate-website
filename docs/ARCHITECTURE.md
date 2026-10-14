# System Architecture — RailTech B2B/B2G Portal

## 1. Architectural Overview

```mermaid
flowchart TD
    subgraph SSG_LAYER["Astro 4 SSG (Static Site Generation)"]
        HOME["/ (index.astro)"]
        CATALOG["/catalog/ (index.astro)"]
        PRODUCT["/catalog/[slug].astro"]
        CONTRACT["/contract.astro"]
        DIGITAL["/digital.astro"]
        PROJECTS["/projects.astro"]
        ABOUT["/about.astro"]
        CONTACTS["/contacts.astro"]
        ADMIN["/admin.astro (Decap CMS)"]
    end

    subgraph CONTENT_LAYER["Astro Content Collections (src/content/)"]
        CAT_MD["catalog/*.md"]
        CON_MD["contract/*.md"]
        DIG_MD["digital/*.md"]
        PRJ_MD["projects/*.md"]
    end

    subgraph ISLANDS_LAYER["React 18 Interactive Islands (src/components/islands/)"]
        FILTER_ISLAND["CatalogFilterTable.tsx"]
        MEDIA_ISLAND["ProductMediaGallery.tsx"]
        CALC_ISLAND["LandedCostCalculator.tsx"]
        AI_ISLAND["SmartMatchAiTester.tsx"]
        CAD_ISLAND["CadInspector.tsx / WireframeViewport.tsx"]
        LEAD_ISLAND["GlobalLeadManager.tsx / LeadModal.tsx"]
    end

    subgraph EXTERNAL_INTEGRATIONS["External Services & CI/CD"]
        CF_WORKER["Cloudflare Worker (telegram-webhook.js)"]
        TG_BOT["Telegram Operational Group (@railtech_uz)"]
        GH_PAGES["GitHub Actions CI/CD (.github/workflows/deploy.yml)"]
    end

    CONTENT_LAYER --> SSG_LAYER
    SSG_LAYER --> ISLANDS_LAYER
    LEAD_ISLAND --> CF_WORKER --> TG_BOT
    SSG_LAYER --> GH_PAGES
```

## 2. Directory Layout

```
railtech-v2/
├── .github/workflows/deploy.yml   # GitHub Pages deployment pipeline
├── cloudflare-worker/             # Cloudflare worker for Telegram lead webhook
├── docs/                          # Architecture & domain documentation
├── public/
│   ├── admin/                     # Decap CMS config.yml and index.html
│   ├── images/                    # Product photos, factory blueprints, art assets
│   ├── models/                    # 3D .glb models (bogie.glb, container.glb)
│   └── robots.txt, CNAME          # SEO & domain routing
├── skills/                        # AI Agent specialized skills
├── src/
│   ├── components/
│   │   ├── Header.astro           # Swiss CAD header with active state highlighting
│   │   ├── Footer.astro           # Institutional legal dossier & logistics details
│   │   └── islands/               # React 18 interactive client islands
│   ├── content/                   # Typed Markdown content collections
│   ├── layouts/BaseLayout.astro   # Root HTML document, meta tags, Schema.org
│   ├── pages/                     # 8 physical URLs + dynamic product datasheets
│   └── styles/global.css          # Tailwind CSS & CAD utilities
├── AGENTS.md                      # AI agent primary instructions
├── CLAUDE.md                      # Claude Code instructions
├── .cursorrules                   # Cursor / Windsurf IDE rules
└── astro.config.mjs               # Astro configuration (@astrojs/react, @astrojs/sitemap)
```

## 3. Client Hydration Strategy
* `client:load`: Used for components that need immediate event binding (`GlobalLeadManager`, `CatalogFilterTable`, `ProductMediaGallery`).
* `client:visible`: Used for below-the-fold interactive components (`LandedCostCalculator`, `SmartMatchAiTester`, `CadInspector`).
* Pure static Astro components: All static layout elements (`Header.astro`, `Footer.astro`, article bodies, passport tables) are rendered strictly to zero-JS HTML.
