---
name: translate-content
description: Translate RailTech site content (services, news, partners, CMS JSON and interface strings) from Russian into Uzbek (Latin) and English using the project glossary. Must NOT run while src/data/content-stage.json has "ruOnly": true; sections listed in ruOnlySections (now news) are skipped unless the owner asked to translate them. Use for the translation pass or to fix UZ/EN errors reported by check-content.
---

# Перевести на UZ и EN (только после одобрения RU)

## 0. Можно ли начинать

```bash
cat src/data/content-stage.json
```
Если там `"ruOnly": true`, **остановись**. Идёт этап RU-first: переводы не делаются, пока владелец не примет
русскую версию и **сам** не переключит `ruOnly` на `false`. Сам флаг не меняй. Сообщи, что задача ждёт одобрения RU.

При `"ruOnly": false` переводи. Разделы из `ruOnlySections` (сейчас `news`, то есть `src/content/news`, включая статьи
о партнёрах) **пропускай**, если владелец прямо не поручил их перевести: они пока остаются русскими. Список не меняй —
раздел из него убирает владелец, когда новости переведены.

Перевод можно начинать, только когда `ruOnly: false` уже стоит в `main` (или владелец явно поручил переключить его в этом PR).

## 1. Перевод

Прочитай `docs/content/GLOSSARY.md` и `docs/content/STYLE_GUIDE.md` §6. Область: $ARGUMENTS (файл, раздел или «всё»).

1. Найди пробелы: `make content 2>&1 | grep -E "missing (UZ|EN)|Cyrillic|identical|forbidden|apostrophe"`.
   Пропуски в разделах из `ruOnlySections` не ошибки, а счётчик «await translation»: их не трогай (см. §0).
2. Для каждого поля `x` заполни `x_uz` и `x_en`. В списках это делается у каждого элемента, у тела материала целиком
   (`body_uz` / `body_en`) с той же Markdown-структурой и ссылками. В `ui/*.json` заполняются `uz` и `en`.
3. Перевод смысловой. Числа, обозначения изделий, ГОСТ, ссылки-маршруты не меняются. UZ пишется латиницей с `'`.
   Термины берутся строго по GLOSSARY. Строки «проверить» переводи по глоссарию и вынеси в PR на проверку носителю.
4. Русский текст не меняй (опечатки перечисли в PR). Ключи и имена полей не трогай.
5. Нового термина нет в GLOSSARY: добавь строку в таблицу (5 колонок, форма таблицы та же) и отметь «на проверку носителю».
6. Позиционирование действует и в переводах: в общих текстах UZ/EN нет отрасли.
7. Проверка: `node scripts/check-content.mjs --files <файлы> --strict` для затронутых файлов, затем `make check`.
   Дальше `content-qa` → `content-pr`. Переводы разбиваются на PR по разделам (тексты сайта, услуги, партнёры; новости — когда владелец поручит).
