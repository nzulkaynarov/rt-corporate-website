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
- **Multi-page strictly**: 8 separate URLs (`/`, `/catalog/`, `/catalog/[slug]`, `/contract`, `/digital`, `/projects`, `/about`, `/contacts`).
- **Product Media**: Real photos and blueprints take precedence over 3D models.
- **Content Collections**: Stored in `src/content/` (`catalog`, `contract`, `digital`, `projects`). Schema is typed in `src/content/config.ts`.
- **Global Leads**: Triggered via `data-lead-modal data-lead-subject="..."` or `window.dispatchEvent(new CustomEvent('open-lead-modal', { detail: { subject } }))`.
