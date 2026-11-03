---
name: edit-site-texts
description: Change texts of RailTech static pages, menus, footer, company details, SEO titles/descriptions or interface labels stored in src/data/cms/*.json and src/data/cms/ui/*.json, in all three languages, keeping the CMS schema valid. Use for edits to home/about/contacts/legal page copy, buttons, labels or page meta tags.
---

# Изменить тексты страниц, меню, SEO или подписи интерфейса

Задача: $ARGUMENTS. Прочитай `docs/content/README.md` §1 и `STYLE_GUIDE.md`.

| Что меняем | Файл |
|---|---|
| Реквизиты, телефон, адрес, меню, шапка, подвал | `src/data/cms/global.json` (реквизиты — только по прямому указанию человека) |
| Главная / О компании / Контакты / Юр. страницы | `home.json` / `about.json` / `contacts.json` / `legal.json` |
| Заголовки разделов, модальное окно заявки, умолчания каталога и блога | `pages.json` |
| Title и description статических страниц, шаблон описания товара | `seo.json` (лимиты SEO.md §2) |
| Кнопки, подписи, сообщения форм | `ui/<область>.json` → `{ "key", "ru", "uz", "en" }` |

Правила:
1. Меняй только значения. Все три языка: `field`, `field_uz`, `field_en` (в `ui/*.json` — `ru/uz/en`).
2. **Не переименовывай и не удаляй** ключи и поля: код ссылается на них, сборка упадёт
   (`validate-cms-config` проверяет ключи `ui/*.json`, которые использует код).
3. Новое поле в JSON без описания в `public/admin/config.yml` будет удалено админкой при сохранении —
   новые поля добавляй только вместе с правкой `config.yml` и кода (это уже задача разработки, не контента).
4. Пробелы в начале/конце значений не используй — админка их обрезает.
5. Проверка: `npm run check:cms && npm run check:content -- --strict` → `npm run build` → `content-pr`.
