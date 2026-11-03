---
name: add-product
description: Add or update a product (SKU) in the RailTech catalog in Russian, Uzbek and English — front matter, specs table, photos, documents, SEO — and validate it. Use for any request to publish, update or restock a catalog item, spare part or piece of equipment.
---

# Добавить / обновить товар каталога

Вход: бриф ($ARGUMENTS или issue) — наименование, модель, SKU (если есть), характеристики,
ГОСТ/ТН ВЭД, наличие, фото, документы. **Цены на сайте не публикуются** — поле `price` всегда пустое. Сначала прочитай
`docs/content/README.md`, `docs/content/STYLE_GUIDE.md` (§2 факты!) и `docs/content/GLOSSARY.md`.

## Шаги

1. **Проверь дубли:** `grep -ril "<модель>" src/content/catalog/`. Есть — обновляй существующий файл,
   не создавай второй. SKU и имя файла существующего товара не меняй.
2. **SKU:** если не задан — следующий свободный номер в группе
   (`ls src/content/catalog/ | grep rt-<группа>`): RS подвижной состав, SCB СЦБ, TRK путь,
   ELC энергетика, KIP КИП и диагностика. Новая группа — только по согласованию в брифе.
3. **Файл:** скопируй `docs/content/templates/product.md` → `src/content/catalog/<sku-lower>.md`,
   удали комментарии `#`, заполни. Категория — существующая (см. `grep -h "^category" src/content/catalog/*.md | sort -u`)
   с её точными переводами.
4. **Тексты RU:** `title` — официальное наименование + модель; `specs` — 1 строка ключевых параметров;
   `attributes` — 3–10 строк таблицы; body ≥ 150 знаков (лучше 400–800) по STYLE_GUIDE §5.
5. **Переводы:** все `_uz` / `_en`, включая `attributes[].label/value`, `documents[].title`, `body_uz`,
   `body_en`. Термины — только по GLOSSARY.
6. **Статус:** `status` ↔ `statusKey` строго в паре. Цену не указывать (политика сайта).
7. **Медиа:** фото → `public/images/catalog/<sku-lower>[-n].jpg` (≤ 1600 px, ≤ 400 КБ). PDF →
   `public/docs/<sku-lower>-<что>.pdf`. Нет реальных файлов — не ставь чужие, убери поля, отметь в PR.
8. **SEO:** проверь автозаголовок `<title> (<SKU>) | RailTech` ≤ 60 знаков; длиннее — заполни
   `seoTitle[_uz|_en]` (SEO.md §2).
9. **Проверка:** `node scripts/check-content.mjs --files src/content/catalog/<file>.md --strict`,
   затем скил `content-qa`. Публикация — скил `content-pr`.

## Пакетный режим (прайс / номенклатура)

Если пришёл прайс или список позиций: приведи его к колонкам `docs/content/templates/catalog-import.csv`
(разделитель `;`, характеристики `Параметр=Значение | …`), покажи человеку итоговую таблицу и список
категорий на согласование, затем заводи товары партиями по 10–20 — каждая партия отдельным PR.
Цены из прайса не переносить никуда. Позиции без названия модели или с неясными параметрами —
в «Открытые вопросы», а не на сайт.

Результат: файл товара, медиа, зелёные проверки, список открытых вопросов для PR.
