---
name: add-project
description: Add or update a RailTech case study / project in Russian, Uzbek and English (task → solution → verified results), with metrics, media and SEO, then validate. Use when asked to publish a completed project, case or portfolio item.
---

# Добавить / обновить проект (кейс)

Прочитай `docs/content/README.md`, `STYLE_GUIDE.md` (§2 — цифры и клиенты только подтверждённые),
`GLOSSARY.md`. Бриф: $ARGUMENTS.

1. Код `LAB NN` — следующий свободный (`grep -h "^code" src/content/projects/*.md`).
2. Скопируй `docs/content/templates/project.md` → `src/content/projects/<slug>.md`.
3. Структура body (≥ 300 знаков): задача заказчика → решение RailTech → результат → что можем
   повторить для других. Название клиента — только если в брифе есть разрешение; иначе
   «крупное предприятие отрасли».
4. `metrics` — 2–4 коротких факта из брифа; одинаковое число элементов в `metrics_uz` / `metrics_en`.
5. `tag` — CAD-тег ЗАГЛАВНЫМИ (`SUPPLY // TURNKEY`), переводится смыслово.
6. Фото → `public/images/projects/<slug>[-n].jpg`; документы (акты, отзывы) — только с разрешения.
7. Добавь в body ссылки на использованные услуги/товары (`/services/…`, `/catalog/…`).
8. `node scripts/check-content.mjs --files src/content/projects/<slug>.md --strict` → `content-qa` → `content-pr`.
