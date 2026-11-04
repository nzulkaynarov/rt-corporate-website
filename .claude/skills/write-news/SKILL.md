---
name: write-news
description: Write or update a RailTech «Новости» item — news, article or project (src/content/news, type news/article/project) — in Russian only while news is in ruOnlySections, from a brief and verifiable sources, with internal links, then validate. Use for any request to write a news item, article, case/project or event report. For a manufacturer profile use add-partner.
---

# Новость, статья или проект

Бриф: $ARGUMENTS. Сначала прочитай `docs/ARCHITECTURE.md` §1–3, затем `docs/content/README.md`,
`docs/content/STYLE_GUIDE.md` (§2 позиционирование, §3 факты, §5 структура) и `docs/content/SEO.md`.

1. **Тип.** `news` для события, `article` для практической статьи, `project` для кейса «задача, решение, результат».
   Статья о производителе пишется скилом `add-partner`.
2. **Дубли.** `grep -ril "<тема>" src/content/news/`. Если материал на эту тему уже есть, дополни его, а не создавай второй.
3. **Факты.** Только из брифа или официальных источников. Каждый источник попадает в раздел `### Источники` и в PR.
   Должности и названия бери как в источнике. Роль RailTech пиши только подтверждённую. Цен нет. Номер и дату документа
   о дилерском статусе не публикуем. Если данных нет, вынеси вопрос в PR, а не пиши догадку.
4. **Файл.** `docs/content/templates/news.md` → `src/content/news/<slug>.md` (slug по SEO.md §4).
   Поля: `type`, `date` (`YYYY-MM-DD`), `title`, `summary` (70–300 знаков), `partners` (id из
   `src/data/cms/partners.json`, если материал о партнёре), `featured` (по умолчанию false).
   `cover` необязателен: это своё фото или фото с разрешения в `public/images/news/<slug>.jpg`, плюс `coverAlt`.
5. **Текст RU.** Тело ≥ 600 знаков, короткие предложения, разделы с `###`, структура по STYLE_GUIDE §5.
   Статья: 2–5 внутренних ссылок маршрутами (`/services/supply/`, `/news/<slug>/`). Отрасль упоминается только как факт
   события или партнёра, без обобщений о RailTech.
6. **Только RU.** Пока `news` стоит в `src/data/content-stage.json → ruOnlySections`, поля `_uz`, `_en`, `body_uz`, `body_en`
   не добавляй и не заполняй (на `/uz/` и `/en/` новость показывается на русском). Существующие не удаляй.
7. **Проверка.** `node scripts/check-content.mjs --files src/content/news/<slug>.md`, затем `make check`.
   Предупреждение «no cover photo» допустимо, укажи его в PR. Дальше скилы `content-qa` → `content-pr`.
