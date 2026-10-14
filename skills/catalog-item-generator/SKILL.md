---
name: catalog-item-generator
description: Generates or updates technical railway equipment items in RailTech Content Collections with full technical passport, GOST/HS codes, and Schema.org compliance.
---

# Catalog Item Generator Skill

Use this skill whenever adding new equipment items (SKUs) to `src/content/catalog/`.

## Input Parameters Needed
* `sku`: e.g. `RT-SAUT-01`
* `title`: Full technical name (e.g. `Блок контроля бдительности машиниста КОН-01`)
* `subsystem`: One of `Подвижной состав`, `СЦБ и автоматика`, `Путевое хозяйство`, `КИП и диагностика`, `Энергетика`
* `gost`: Standard or TU designation
* `tnved`: 10-digit HS code in Uzbekistan format (`XXXX XX XXX X`)
* `status`: `В наличии`, `Резерв`, or `Под заказ`
* `specs`: Key dimensional and electrical parameters

## Execution Steps
1. Create `src/content/catalog/{slug}.md`.
2. Populate frontmatter conforming to `src/content/config.ts`.
3. Provide factory passport text in the markdown body.
4. Run `npm run build` to confirm static route generation.
