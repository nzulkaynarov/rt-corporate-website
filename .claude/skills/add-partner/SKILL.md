---
name: add-partner
description: Add or update a RailTech manufacturer partner — one record in src/content/partners/<id>.md holding the home-page tile (brand, legal entity, country code, status) and the partner article shown at /news/partner-<id>/ — tile and article in Russian, Uzbek and English, with correct dealer/direct status rules, then validate. Use when asked to add a manufacturer/partner, change a partner's status or rewrite a partner profile.
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
1. **Дубли.** `ls src/content/partners/` и `grep -ril "<название>" src/content/partners src/content/news`.
2. **Запись.** `docs/content/templates/partner-article.md` → `src/content/partners/<id>.md` (одна запись = плитка + статья):
   `name` — бренд на плитке, `legalName` — юрлицо (к нему относится статус), `group` — группа, если есть
   (Siemens Mobility GmbH → `group: Siemens AG`), `brands` — торговые марки, если нужны; `country` — код из списка
   (`country.<код>` в `src/data/cms/ui/countries.json`; новой страны нет — добавь строку туда на трёх языках и вариант
   в `public/admin/config.yml`), `status`, `order`; `logo` — логотип с официального сайта производителя (SVG или PNG с
   прозрачным фоном, вариант для светлого фона) в `public/images/partners/<id>.svg|png`; не перерисовывай и не
   перекрашивай, нет официального файла — оставь без логотипа. Кириллические `name`/`legalName` сразу переводи в блоках
   `uz:` / `en:` по GLOSSARY.md: плитка видна на всех языках. Новых полей не добавляй (ARCHITECTURE.md §3).
3. **Статья** в той же записи: `date`, `title`, `summary` и текст с разделами «О компании», «Продукция и направления»,
   «Где применяется», «Что RailTech поставляет», «Источники» (одна ссылка на официальный сайт производителя; страницы,
   с которых взяты факты, перечисли в PR, а не в статье). Факты бери с официального сайта производителя и
   пересказывай своими словами. Отрасль производителя здесь уместна; в плитке и общих текстах её нет.
   Пока статьи нет (пустые `title` или текст), плитка показывается без ссылки — это допустимо.
4. **Связи считаются сами** (`src/utils/feed.ts`): новости о партнёре получают `partners: [<id>]` — и появляются в блоке
   «Материалы о партнёре»; ссылка в тексте на `/services/<услуга>/` выводит статью на странице услуги.
5. **Языки.** Плитка (`name`, `legalName`) — на RU, UZ и EN сразу (шаг 2). Статью тоже переведи в том же изменении
   (`title`, `summary`, текст — `body` в блоках `uz:` / `en:`): без перевода её страница UZ/EN покажет русский и будет
   закрыта от поиска.
6. **Проверка.** `node scripts/check-content.mjs --files src/content/partners/<id>.md`, затем `make check`.
   Дальше `content-qa` → `content-pr`.

Смена статуса (`direct` ↔ `dealer`) делается только по брифу владельца. Затем проверь, что тексты статьи и новостей
о партнёре соответствуют новому статусу.
