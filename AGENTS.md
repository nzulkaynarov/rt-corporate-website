# AGENTS.md — инструкция для ИИ-агентов (railtech.uz, v2 «Мост»)

Для любого агента: Claude Code, Cursor, Copilot, Codex и др. Здесь правила работы с репозиторием.
Что есть на сайте и откуда берутся данные, описано в [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md),
как он выглядит — в [`docs/DESIGN.md`](./docs/DESIGN.md). **Сначала прочитай ARCHITECTURE.md.** Если этот файл
расходится с ним, верен ARCHITECTURE.md. Текущее состояние работ и решения владельца: [`docs/STATUS.md`](./docs/STATUS.md).

## 1. Что это за сайт

Сайт ООО «RailTech» (Ташкент): **о компании, о её возможностях и приглашение к работе через Кабинет**
(`cabinet.railtech.uz`). Каталог, цены, сделки, документы есть только в Кабинете, на сайте их нет.
Страницы: главная, услуги (4), новости (новости, статьи, проекты, статьи о партнёрах), контакты, privacy, terms, cookies, 404.
Прежний v1 (HUD/CAD-портал, каталог, блог, проекты, «О компании», Tailwind, Cloudflare Worker) удалён.
Он лежит в ветках `archive/legacy-v1-*`. Старые адреса перенаправляются через `src/data/legacy-redirects.json`.

## 2. Золотые правила

1. **Без привязки к отрасли.** RailTech работает с любыми предприятиями и организациями. В общих текстах
   (главная, услуги, страницы, SEO, подписи, меню) не упоминаются «ж/д», серии локомотивов, отраслевые каталоги.
   Отрасль партнёра или события называется только в фактах статьи о партнёре или новости. Это проверяют
   правило `positioning` в `scripts/check-content.mjs` и аудит `dist/` в `scripts/check-build.mjs`.
2. **Сейчас только русский (RU-first).** В `src/data/content-stage.json` стоит `"ruOnly": true`. Агенты пишут
   и правят только русские поля. Поля `_uz`/`_en` и `body_uz`/`body_en` **не заполняют и не переводят**.
   Перевод делается одним проходом, когда владелец примет русскую версию и сам поставит `ruOnly: false`.
   Страницы UZ/EN до этого закрыты от индексации (`noindex`), их нет в sitemap.
3. **Факты не выдумываются.** Цены, клиенты, сертификаты, цифры, сроки, наличие, отзывы берутся только из брифа
   или проверяемого источника, который указан в PR. Нет данных: не пиши и задай вопрос в PR.
   Дилерский статус (`status: dealer`) ставится только по документу производителя. Основание статуса
   (номер, дата, срок документа) на сайте не публикуется, клиенту его показывают по запросу.
4. **Без двойной работы.** Перед изменением прочитай ARCHITECTURE.md. Новое поле, страница, компонент или
   раздел сначала описываются в ARCHITECTURE.md, в том же PR. Чего там нет, на сайте не появляется.
5. **Тексты не пишутся в коде.** Все тексты лежат в `src/data/cms/**` и `src/content/**`.
   Тест `tests/data.test.ts` («no text in code») падает на кириллице в `.astro`/`.ts`/`.tsx`.
6. **Навигация одна:** `src/utils/nav.ts`. Вторую навигацию, модальные окна заявки, слайдеры не добавляем.
7. **После изменения запусти `make check`.** Если менялся код (`src/components`, `src/pages`, `src/layouts`,
   `src/utils`, стили), запусти ещё и `make e2e`.
8. **Git:** работа в ветке (не `main`), PR в `main`. `main` = прод: мёрж публикует сайт.
   Не пушь в `main`, не делай `push --force`, не мёржи свой PR.
   Коммиты заканчиваются строками атрибуции, как в истории репозитория (`git log -3`).

## 3. Карта репозитория

```
docs/ARCHITECTURE.md         страницы, модель данных, компоненты, Кабинет и CRM (единственная правда)
docs/DESIGN.md               стиль «Мост»: токены, шрифты, компоненты, телефон, доступность
docs/content/                правила контента: README, STYLE_GUIDE, GLOSSARY, SEO, CONTENT_PLAN, templates/
src/content/config.ts        схема коллекций services и news
src/content/services/*.md    4 услуги: supply, engineering (заказчикам), representation, localization (партнёрам)
src/content/news/*.md        материалы: type = news | article | project | partner
src/data/cms/*.json          company, home, pages, partners, legal, seo (тексты и настройки сайта)
src/data/cms/ui/*.json       подписи интерфейса { key, ru, uz, en }
src/data/content-stage.json  этап переводов (ruOnly)
src/data/legacy-redirects.json  старые адреса → новые страницы
src/pages/[...lang]/         страницы ru (/…), uz (/uz/…), en (/en/…)
src/components/              layout/, ui/, home/, islands/LeadForm.tsx (единственный React-остров)
src/styles/tokens.css        дизайн-токены (только через var(--…))
src/utils/nav.ts             единственное меню сайта
public/admin/config.yml      схема Sveltia CMS (/admin), должна совпадать с config.ts и JSON
scripts/                     check-content, check-build, validate-cms-config, hooks/check-content-file
tests/                       Vitest (data, i18n, lead, utils) и tests/e2e (Playwright)
.claude/                     скилы, субагенты и настройки Claude Code
```

## 4. Команды

| Команда | Что делает |
|---|---|
| `make install` | `npm ci` |
| `make dev` | локальный сервер `http://localhost:4321/rt-corporate-website/` |
| `make cms` | схема CMS против данных |
| `make content` | правила контента (этап, глоссарий, позиционирование, ссылки, медиа) |
| `node scripts/check-content.mjs --files <файлы>` | те же правила только для указанных файлов |
| `make test` | Vitest: данные, i18n, SEO, форма заявки, навигация |
| `make build` | `astro check`, сборка и аудит `dist/` |
| `make check` | cms + content + test + build: всё, кроме браузерных тестов |
| `make e2e` | сборка и Playwright (компьютер и телефон) |
| `make ci` | всё, как в GitHub Actions |

После любой правки файла в `src/content/**` или `src/data/cms/**` хук Claude Code сам запускает проверку
этого файла (`scripts/hooks/check-content-file.mjs`).

## 5. Типовые задачи

### Новость, статья или проект → скил `write-news`
1. Проверь дубли: `grep -ril "<тема>" src/content/news/`.
2. Скопируй `docs/content/templates/news.md` в `src/content/news/<slug>.md`. Slug: латиница, дефисы, не меняется после публикации.
3. Заполни `type` (`news` | `article` | `project`), `date`, `title`, `summary` (70–300 знаков), `partners` (id из `partners.json`, если материал о партнёре).
   `cover` необязателен: без него показывается плашка «Фото готовится».
4. Тело на русском, разделы с `###`. Внизу раздел `### Источники` со ссылками.
5. `node scripts/check-content.mjs --files src/content/news/<slug>.md`, потом `make check`.

### Партнёр → скил `add-partner`
1. Добавь строку в `src/data/cms/partners.json`: `id` (латиница, навсегда), `name`, `country`,
   `status` (`dealer` только при документе производителя, иначе `direct`), `article`, `order`.
2. Создай статью `src/content/news/<article>.md` с `type: partner` и `partners: [<id>]` по шаблону
   `docs/content/templates/partner-article.md`. Тест `tests/data.test.ts` проверяет, что плитка ведёт на эту статью.
3. Отрасль партнёра описывается здесь, в фактах о нём. В общих текстах её нет.

### Изменить услугу → скил `add-service`
Услуг ровно четыре (`supply`, `engineering`, `representation`, `localization`), тест это проверяет.
Новую услугу добавляем только после правки ARCHITECTURE.md владельцем. Правка идёт в `src/content/services/<slug>.md` по
`docs/content/templates/service.md`. Тексты должны быть без привязки к отрасли.

### Тексты страниц, подписи, SEO → скил `edit-site-texts`
Меняй только значения в `src/data/cms/{company,home,pages,legal,seo}.json` и `ui/*.json`. Ключи не переименовывай.
Новое поле добавляется сразу в ARCHITECTURE.md, `public/admin/config.yml` и код. Это задача разработки.
Реквизиты, цифры и адреса в `company.json` меняются только по прямому указанию владельца.

### Код
Сначала опиши изменение в ARCHITECTURE.md. Стили берутся только из токенов DESIGN.md. Тексты лежат в CMS JSON.
Проверка: `make check && make e2e`.

## 6. Чего не делать никогда

- Возвращать на сайт каталог, цены, SKU, корзину, наличие. Это Кабинет.
- Писать «ж/д», серии локомотивов и отрасль в общих текстах, SEO, меню, подписях.
- Заполнять или переводить `_uz`/`_en`, пока `ruOnly: true`. Менять `content-stage.json`: это решает владелец.
- Выдумывать факты, клиентов, цифры, сертификаты. Публиковать номер или дату дилерского документа.
- Писать тексты в `.astro`/`.ts`/`.tsx`. Добавлять вторую навигацию, модальное окно заявки, HUD-декор,
  псевдотерминальные подписи, аналитику и cookie (без решения владельца и правки `/cookies/`).
- Переименовывать опубликованные slug и `id` партнёров. Если пришлось, добавь строку в `legacy-redirects.json`.
- Пушить в `main`, делать `--force`, `git reset --hard`, мёржить свои PR. Коммитить `dist/`, `.env`.
- Ссылаться на удалённое: `global.json`, `catalog`, `blog`, `projects`, `about`, Tailwind, `rounded-none`.

## 7. Документы для контента

| Файл | О чём |
|---|---|
| `docs/content/README.md` | где что лежит, процесс, что агенту нельзя |
| `docs/content/STYLE_GUIDE.md` | голос, позиционирование, факты, форматы |
| `docs/content/GLOSSARY.md` | термины RU/UZ/EN; колонку «Запрещено» читает `check-content` |
| `docs/content/SEO.md` | title, description, slug, внутренние ссылки, RU-first |
| `docs/content/CONTENT_PLAN.md` | текущий план |
| `docs/content/templates/` | `news.md`, `partner-article.md`, `service.md` |

Claude Code: скилы `write-news`, `add-partner`, `add-service`, `edit-site-texts`, `translate-content`
(только после одобрения RU), `content-qa`, `content-pr`. Субагенты: `content-writer`, `content-reviewer`,
`content-translator` (тоже только после одобрения RU).
