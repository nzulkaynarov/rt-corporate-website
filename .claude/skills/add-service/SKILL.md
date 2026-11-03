---
name: add-service
description: Add or update a RailTech service page (import/DDP, sourcing, IT, representation…) in Russian, Uzbek and English with steps, benefits, documents and SEO, then validate. Use when asked to publish or rewrite a service.
---

# Добавить / обновить услугу

Прочитай `docs/content/README.md`, `STYLE_GUIDE.md`, `GLOSSARY.md`, `SEO.md`. Бриф: $ARGUMENTS.

1. Дубли: `grep -ril "<ключевое слово>" src/content/services/`. Похожая услуга есть — расширь её,
   а не плоди почти одинаковые страницы (SEO.md §4).
2. Код `SRV.NN` — следующий свободный (`grep -h "^code" src/content/services/*.md`).
3. Скопируй `docs/content/templates/service.md` → `src/content/services/<slug>.md` (slug по SEO.md §3).
4. Заполни: `summary` 70–300 знаков (это и meta description), `steps` 3–5 этапов, `benefits`
   (срок, валюта, документы, налоги — только подтверждённые), body ≥ 300 знаков со списком «что входит»,
   1–3 внутренние ссылки на статьи/товары.
5. Переводы всех полей и `body_uz` / `body_en` по GLOSSARY. `category` — из существующих категорий услуг.
6. Фото → `public/images/services/<slug>.jpg`. `order` — место в списке услуг.
7. `node scripts/check-content.mjs --files src/content/services/<slug>.md --strict` → скил `content-qa` → `content-pr`.
