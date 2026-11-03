# System Architecture — RailTech B2B/B2G Portal

## 1. Architectural Overview

```mermaid
flowchart TD
    subgraph SSG_LAYER["Astro 4 SSG (Static Site Generation)"]
        HOME["/ (index.astro)"]
        CATALOG["/catalog/ (index.astro) & [slug].astro"]
        SERVICES["/services/ (index.astro) & [slug].astro"]
        PROJECTS["/projects/ (index.astro) & [slug].astro"]
        BLOG["/blog/ (index.astro) & [slug].astro"]
        ABOUT["/about.astro"]
        CONTACTS["/contacts.astro"]
        PRIVACY["/privacy.astro"]
        TERMS["/terms.astro"]
        ADMIN["/admin.astro (Sveltia CMS)"]
    end

    subgraph CONTENT_LAYER["Astro Content Collections & CMS Data (src/content/ & src/data/cms/)"]
        CAT_MD["src/content/catalog/*.md"]
        SRV_MD["src/content/services/*.md"]
        PRJ_MD["src/content/projects/*.md"]
        BLG_MD["src/content/blog/*.md"]
        CMS_JSON["src/data/cms/{global,home,about,contacts,pages,legal}.json"]
    end

    subgraph ISLANDS_LAYER["React 18 Interactive Islands (src/components/islands/)"]
        FILTER_ISLAND["CatalogFilterTable.tsx"]
        MEDIA_ISLAND["ProductMediaGallery.tsx"]
        SLIDER_ISLAND["HudMediaSlider.tsx"]
        IMAGE_ISLAND["HudSmartImage.tsx"]
        CONTACTS_ISLAND["ContactsLeadForm.tsx"]
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
    CONTACTS_ISLAND --> CF_WORKER --> TG_BOT
    SSG_LAYER --> GH_PAGES
```

## 2. Directory Layout

```
rt-corporate-website/
├── .github/workflows/deploy.yml   # GitHub Pages deployment pipeline
├── cloudflare-worker/             # Cloudflare worker for Telegram lead webhook
├── docs/                          # Architecture & domain documentation
├── public/
│   ├── admin/                     # Sveltia CMS config.yml and index.html
│   ├── images/                    # Product photos, factory blueprints, art assets
│   └── robots.txt, sitemap.xml    # SEO & domain routing
├── src/
│   ├── components/
│   │   ├── Header.astro           # Swiss CAD header with dynamic navigation from CMS
│   │   ├── Footer.astro           # Institutional legal dossier, GPS & logistics details from CMS
│   │   ├── I18nText.astro         # Trilingual CAD switcher component (RU / UZ / EN)
│   │   ├── hud/                   # Brutalist HUD frame components
│   │   └── islands/               # React 18 interactive client islands
│   ├── content/                   # Typed Markdown content collections (catalog, services, projects, blog)
│   ├── data/cms/                  # CMS JSON storage (global, home, about, contacts, pages, legal)
│   ├── layouts/BaseLayout.astro   # Root HTML document, meta tags, Schema.org rich graph
│   ├── pages/                     # Multi-page physical URLs + dynamic datasheets
│   └── styles/global.css          # Tailwind CSS & CAD utilities
├── AGENTS.md                      # AI agent primary instructions
└── astro.config.mjs               # Astro configuration (@astrojs/react, @astrojs/sitemap)
```

## 3. Client Hydration Strategy
* `client:load`: Used for components that need immediate event binding (`GlobalLeadManager`, `CatalogFilterTable`, `ProductMediaGallery`, `HudMediaSlider`).
* `client:visible`: Used for below-the-fold interactive components (`ContactsLeadForm`).
* Pure static Astro components: All static layout elements (`Header.astro`, `Footer.astro`, article bodies, passport tables, legal text) are rendered strictly to zero-JS HTML with full Markdown formatting for all 3 languages.
