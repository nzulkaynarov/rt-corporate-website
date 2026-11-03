---
name: translate-content
description: Fill in or fix Uzbek (Latin) and English translations of RailTech site content — catalog, services, projects, blog, CMS JSON and interface strings — using the project glossary. Use when content has missing/poor UZ or EN versions or check:content reports translation errors.
---

# Перевести / выправить UZ и EN

Прочитай `docs/content/GLOSSARY.md` и `docs/content/STYLE_GUIDE.md` §4. Область: $ARGUMENTS
(файл, коллекция или «всё, что падает в check:content»).

1. Найди проблемы: `npm run check:content 2>&1 | grep -E "missing (UZ|EN)|Cyrillic|identical|forbidden|apostrophe"`.
2. Для каждого поля `x` заполни `x_uz` и `x_en` (в списках — у каждого элемента; у `body` —
   `body_uz` / `body_en` целиком, с той же Markdown-структурой и ссылками).
3. Правила: смысловой перевод; числа, модели, ГОСТ, SKU, ссылки — без изменений; UZ — латиница с `'`;
   термины — строго по GLOSSARY; списки `metrics/tags` — тот же порядок и количество.
4. Не меняй русский текст (кроме явных опечаток — укажи в PR) и не трогай ключи (`key` в `ui/*.json`,
   имена полей).
5. Новый термин, которого нет в GLOSSARY, — добавь строку в таблицу в том же PR и отметь «на проверку
   носителю».
6. `npm run check:content -- --strict` должен пройти для затронутых файлов → `content-qa` → `content-pr`.
