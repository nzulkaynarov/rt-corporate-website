---
name: write-blog-post
description: Research and write a RailTech blog article (engineering, procurement, customs/DDP, standards, company news) in Russian, Uzbek and English, optimized for search, with internal links, then validate. Use for any request to write a post, article, news item or guide.
---

# Написать статью блога

Прочитай `docs/content/README.md`, `STYLE_GUIDE.md`, `GLOSSARY.md` и **обязательно** `SEO.md`.
Тема / бриф: $ARGUMENTS.

1. **Запрос и угол.** Сформулируй 1 главный поисковый запрос и 2–4 смежных на каждом языке
   (SEO.md §1). Проверь, что на сайте нет статьи на ту же тему (`grep -ril "<тема>" src/content/blog/`).
2. **Факты.** Нормативка (ГОСТ, Таможенный кодекс РУз, ставки) — только из официальных источников,
   ссылки на них перечисли в PR. Ставки и цифры, которые меняются, — с датой актуальности в тексте.
   Новости компании — только факты из брифа.
3. **Файл:** `docs/content/templates/blog-post.md` → `src/content/blog/<slug>.md`; `publishDate` —
   дата публикации (сегодня, если не указано), `category` — одна из опций CMS (см. шаблон).
4. **Текст RU** ≥ 1200 знаков (лучше 3000–6000): лид с ответом → разделы `###` → пример/таблица →
   вывод → призыв (запрос КП). 2–5 внутренних ссылок на товары/услуги/проекты.
5. **Переводы** `title/summary/category/tags/readTime` и полные `body_uz`, `body_en` — смысловые,
   по GLOSSARY; ключевые запросы — свои для каждого языка.
6. **Обложка** → `public/images/blog/<slug>.jpg` (1200×630 подходит и для соцсетей). Нет своей —
   оставь поле пустым и отметь в PR; не используй чужие фото без лицензии.
7. `node scripts/check-content.mjs --files src/content/blog/<slug>.md --strict` → `content-qa` → `content-pr`.
