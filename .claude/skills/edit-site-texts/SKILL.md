---
name: edit-site-texts
description: Change RailTech site texts stored in src/data/cms/*.json (company, home, pages, partners, legal, seo) and interface labels in src/data/cms/ui/*.json — in Russian, Uzbek and English, industry-neutral, keeping keys and the CMS schema intact. Use for edits to home page blocks, section intros, contacts, legal pages, buttons, labels or page meta tags.
---

# Изменить тексты страниц, подписи или SEO

Задача: $ARGUMENTS. Прочитай `docs/ARCHITECTURE.md` §3, `docs/content/README.md` §1 и `docs/content/STYLE_GUIDE.md`.

| Что меняем | Файл |
|---|---|
| Реквизиты, контакты, Telegram, ссылки Кабинета, адрес приёма заявок, цифры компании | `src/data/cms/company.json`, **только по прямому указанию владельца** |
| Блоки главной: первый экран, мост, возможности, о компании, Кабинет, заявка | `src/data/cms/home.json` |
| Заголовки и вводные «Услуги», «Новости», «Контакты», 404 | `src/data/cms/pages.json` |
| Плитки партнёров | `src/data/cms/partners.json` (скил `add-partner`) |
| Политика, условия, cookies | `src/data/cms/legal.json` |
| title и description страниц | `src/data/cms/seo.json → pages.<key>` (title ≤ 60, description 70–160) |
| Кнопки, подписи, сообщения формы | `src/data/cms/ui/<область>.json` → `{ "key", "ru", "uz", "en" }` |

Правила:
1. Меняй только значения. **Не переименовывай и не удаляй** ключи и поля: код ссылается на них.
   Новое поле добавляется через ARCHITECTURE.md, `public/admin/config.yml` и код. Это задача разработки, не текстов.
2. **Три языка:** RU одобрен (`src/data/content-stage.json → ruOnly: false`). Каждое новое или изменённое значение
   правь в том же изменении на RU, UZ (латиница) и EN: `field` + `field_uz`/`field_en`, в `ui/*.json` — `ru`, `uz`, `en`,
   по GLOSSARY.md. Пропущенный перевод `check-content` считает ошибкой.
3. **Позиционирование:** без отрасли, «ж/д», серий техники. `check-content` (правило `positioning`) это ловит.
   Каталога и цен на сайте нет. Подписи действий одни и те же: «Начать работу», «Отправить заявку», «Войти в Кабинет».
4. Одно обещание живёт в одном месте (STYLE_GUIDE §1). Нет псевдотерминальных подписей и КАПСА ради декора.
5. Пробелов в начале и конце значений быть не должно: админка их обрезает.
6. Ссылки в данных пишутся маршрутами (`/services/`, `/contacts/#request`). Тест проверяет, что ссылки главной ведут на существующие страницы.
7. Проверка: `node scripts/check-content.mjs --files <изменённые файлы>`, затем `make check`. Дальше `content-pr`.
