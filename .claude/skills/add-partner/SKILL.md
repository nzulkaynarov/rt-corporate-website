---
name: add-partner
description: Add or update a RailTech manufacturer partner — a tile row in src/data/cms/partners.json plus its partner article (src/content/news, type partner) — tile in Russian, Uzbek and English, article in Russian only while news is in ruOnlySections, with correct dealer/direct status rules, then validate. Use when asked to add a manufacturer/partner, change a partner's status or rewrite a partner profile.
---

# Добавить или обновить партнёра

Бриф: $ARGUMENTS. Сначала прочитай `docs/ARCHITECTURE.md` §2–3, `docs/content/STYLE_GUIDE.md` (§2, §3, §5) и `docs/content/SEO.md`.

## Правила статуса
- `status: "dealer"` («Официальный дилер») ставится **только** при документе производителя (свидетельство, дилерский договор),
  который владелец подтвердил в брифе. Без документа ставится `status: "direct"` («Прямые поставки»).
- Основание статуса (номер, дата, срок документа) на сайте **не публикуется**: ни в плитке, ни в статье, ни в новостях.
  Его показывают клиенту по запросу. В PR укажи «документ видел владелец», а не сам номер.
- Новый партнёр появляется только по решению владельца. Наличие продукции у дистрибьютора само по себе не повод.

## Шаги
1. **Дубли.** `grep -n "\"id\"" src/data/cms/partners.json` и `ls src/content/news/partner-*`.
2. **Плитка.** Добавь объект в `src/data/cms/partners.json → partners`:
   `id` (латиница, дефисы; после публикации не меняется), `name`, `country`, `status`,
   `article` (`partner-<id>`), `order`. Сразу заполни `name_uz/_en` и `country_uz/_en` (по GLOSSARY.md):
   плитка вне новостей и пишется на трёх языках.
   Новых полей не добавляй: схема в `public/admin/config.yml` и ARCHITECTURE.md §3.
3. **Статья.** `docs/content/templates/partner-article.md` → `src/content/news/partner-<id>.md`:
   `type: partner`, `partners: [<id>]`, разделы «О компании», «Продукция и направления», «Где применяется»,
   «Что RailTech поставляет», «Источники». Факты бери с официального сайта производителя и пересказывай своими словами.
   Отрасль производителя в этой статье уместна. В плитке и общих текстах её нет.
4. **Связи.** `tests/data.test.ts` проверяет, что плитка ведёт на существующую статью с `type: partner`, в которой есть этот `id`.
   Новости о партнёре получают `partners: [<id>]` и ссылку на статью.
5. **Языки.** Статья лежит в `src/content/news`: пока `news` в `ruOnlySections` (`src/data/content-stage.json`), её
   `_uz`/`_en` и `body_uz`/`body_en` не добавляй. Плитка в `partners.json` — на RU, UZ и EN (шаг 2).
6. **Проверка.** `node scripts/check-content.mjs --files src/data/cms/partners.json src/content/news/partner-<id>.md`,
   затем `make check`. Дальше `content-qa` → `content-pr`.

Смена статуса (`direct` ↔ `dealer`) делается только по брифу владельца. Затем проверь, что тексты статьи и новостей
о партнёре соответствуют новому статусу.
