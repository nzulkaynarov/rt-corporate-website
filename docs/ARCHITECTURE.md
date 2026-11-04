# Архитектура сайта railtech.uz (v2, ноябрь 2026)
Статус: действует · Обновлено: 2026-11-04 · Прежняя версия (HUD/CAD-портал с каталогом) — ветки `archive/legacy-v1-main`, `archive/legacy-v1-content`

Этот документ — единственная правда о том, **какие страницы есть, откуда берутся данные и как сайт связан с платформой**.
Агент или разработчик, который хочет добавить страницу, раздел, поле CMS или компонент, сначала правит этот документ
(в том же PR). Всё, чего здесь нет, на сайте не появляется.

## 1. Назначение

Сайт — визитка компании ООО «RailTech»: **о компании, о её возможностях и приглашение к работе через Кабинет**.
Сделки, каталог позиций, цены, документы и переписка живут не на сайте, а на платформе RailTech
(репозиторий `nzulkaynarov/RailTech_Platform`): CRM принимает заявки, Кабинет (`cabinet.railtech.uz`) — работа с
клиентами и партнёрами.

Позиционирование: RailTech поставляет оборудование и услуги **предприятиям и организациям** Узбекистана и представляет
интересы международных производителей в регионе. Сайт **не** привязан к одной отрасли: в общих текстах, шапке,
SEO и навигации нет «ж/д», серий локомотивов и отраслевых каталогов (проверяет `scripts/check-content.mjs`, правило
`positioning`). Отрасль партнёра или события упоминается только в фактах о нём (статья о партнёре, новость).

## 2. Карта страниц

Все страницы существуют на трёх языках: `/…` (ru, по умолчанию), `/uz/…`, `/en/…`. Файлы — в `src/pages/[...lang]/`.

| Маршрут | Файл | Что это | Источник данных |
|---|---|---|---|
| `/` | `index.astro` | Главная: первый экран, мост (барьеры), возможности, о компании, производители, Кабинет, новости, заявка | `data/cms/home.json`, `company.json`, `partners.json`, коллекции `services`, `news` |
| `/services/` | `services/index.astro` | Обзор услуг: «Заказчикам» и «Партнёрам» | `pages.json → services`, коллекция `services` |
| `/services/<slug>/` | `services/[slug].astro` | Услуга: `supply`, `engineering` (заказчикам), `representation`, `localization` (партнёрам) | коллекция `services` |
| `/news/` | `news/index.astro` | Лента: новости, статьи, проекты, партнёры (фильтр по типу) | коллекция `news`, `pages.json → news` |
| `/news/<slug>/` | `news/[slug].astro` | Материал; у статьи о партнёре — блок «Материалы о партнёре» | коллекция `news`, `partners.json` |
| `/contacts/` | `contacts.astro` | Контакты, реквизиты, форма заявки | `company.json`, `pages.json → contacts` |
| `/privacy/`, `/terms/`, `/cookies/` | `privacy.astro`, `terms.astro`, `cookies.astro` | Сервисные страницы (только в футере) | `data/cms/legal.json` |
| `/404` | `src/pages/404.astro` | Страница не найдена | `pages.json → notFound` |
| `/admin/` | `src/pages/admin.astro` | Sveltia CMS (версия зафиксирована) | `public/admin/config.yml` |
| старые адреса | `src/pages/[...lang]/{catalog,blog,projects,about}/…` | Перенаправления (meta refresh + canonical, `noindex`) | `src/data/legacy-redirects.json` |

Навигация (шапка): **Услуги · Новости · Контакты** + переключатель языка + кнопки **«Начать работу»** (форма заявки,
`/contacts/#request`) и **«Войти в Кабинет»** (`company.json → cabinet.loginUrl`). Футер: разделы, сервисные страницы,
контакты, ИНН. Меню одно — футер и мобильное меню строятся из `src/utils/nav.ts`.

## 3. Модель данных

Тексты не пишутся в коде (`.astro`, `.tsx`, `.ts`). Всё редактируется в `/admin`.

| Где | Что | Переводы |
|---|---|---|
| `src/data/cms/company.json` | Реквизиты, адреса, контакты, Telegram, ссылки Кабинета, адрес приёма заявок, цифры («5+ лет» и т. д. — правит владелец) | поля `_uz`/`_en` |
| `src/data/cms/home.json` | Тексты блоков главной (первый экран, мост, возможности, о компании, Кабинет, заявка) | `_uz`/`_en` |
| `src/data/cms/pages.json` | Заголовки и вводные тексты страниц «Услуги», «Новости», «Контакты», 404 | `_uz`/`_en` |
| `src/data/cms/partners.json` | Производители-партнёры: `id`, название, страна, статус (`dealer` / `direct`), слаг статьи о партнёре, порядок | `_uz`/`_en` у страны |
| `src/data/cms/legal.json` | Политика конфиденциальности, условия использования, cookies | `_uz`/`_en` |
| `src/data/cms/seo.json` | title/description страниц, значения по умолчанию | `_uz`/`_en` |
| `src/data/cms/ui/*.json` | Подписи интерфейса (кнопки, метки, формы) | `ru`/`uz`/`en` в одной записи |
| `src/content/services/*.md` | 4 услуги: аудитория, лид, коротко, шаги, что получает клиент/партнёр, требования, FAQ, тело | `_uz`/`_en`, `body_uz`/`body_en` |
| `src/content/news/*.md` | Материалы: `type` = `news` / `article` / `project` / `partner`, дата, обложка, `partners: [id]`, источники | `_uz`/`_en`, `body_uz`/`body_en` |

Схема коллекций — `src/content/config.ts`; схема CMS — `public/admin/config.yml`. Они должны совпадать (проверяет
`scripts/validate-cms-config.mjs` при сборке).

**Порядок перевода.** Сейчас этап RU-first: русские тексты одобряет владелец, потом переводятся UZ и EN одним проходом.
Пустое `_uz`/`_en` = показывается русский текст; `check-content --ru-only` считает такие поля, но не падает.

## 4. Компоненты

```
src/layouts/BaseLayout.astro        <head>: SEO, canonical, hreflang, JSON-LD, шрифты; Header + <main> + Footer
src/components/layout/              Header (меню, языки, кнопки), MobileMenu (<details>, без JS), Footer
src/components/ui/                  Button, Section, SectionHead, Breadcrumbs, Faq (<details>), PartnerTiles, NewsCard, Prose
src/components/home/                Hero, Bridge, Directions, About, CabinetBlock, LatestNews, Invite
src/components/islands/LeadForm.tsx единственный React-остров: форма заявки → CRM
src/styles/tokens.css, global.css   дизайн-токены и базовые стили (docs/DESIGN.md)
src/scripts/motion.ts               движение на всех страницах: плавная прокрутка колесом (Lenis), появление блоков
                                    при прокрутке, тень шапки; подключается в BaseLayout (DESIGN.md → «Движение»)
```

Правила: один компонент — одна задача; стили компонента — в его `<style>` через токены `var(--…)`, без литеральных цветов;
никакой декоративной «телеметрии» и псевдотерминальных подписей; иконки — inline SVG с `aria-hidden`.
Движение только прогрессивное: без JavaScript и при «уменьшить движение» в системе весь контент виден сразу и без анимаций.

## 5. Заявки и Кабинет (интеграция с платформой)

```
Посетитель ─ «Начать работу» ─► форма (LeadForm.tsx) ─► CRM: POST {leadEndpoint}        ─► лид «с сайта» в очереди
                                                          (токен: GET {leadEndpoint}/token)   менеджер связывается
                                                                                               и приглашает в Кабинет
Клиент/партнёр ─ «Войти в Кабинет» ─► cabinet.railtech.uz/login  (вход по коду из письма или Telegram, без пароля)
Telegram ─► t.me/<бот>?start=web  (бот CRM, источник «сайт»)
```

- Адреса берутся из `company.json`: `leadEndpoint` (по умолчанию `https://crm.railtech.uz/api/v1/leads/web`),
  `cabinet.loginUrl`, `cabinet.newClientUrl`, `telegramBot`.
- Контракт приёма (платформа, `packages/contracts/openapi/crm.yaml`): `GET …/token` → `{token, expires_at, min_fill_seconds}`;
  `POST …` JSON `{name, company?, phone?, email?, text, language, form_token, consent: true, website: ""}` → `202 {lead_id}`;
  ошибки `422 validation_failed` (`details.reason`), `429 rate_limited`. Поле `website` — ловушка для ботов, всегда пустое.
- CRM принимает запросы только с разрешённых адресов (CORS). Чтобы форма работала с railtech.uz, на платформе в
  `infra/compose/prod.yml` к `CABINET_ORIGIN` добавляется адрес сайта. Пока этого нет, форма при ошибке сети показывает
  запасные каналы: Telegram, телефон, e-mail и ссылку `cabinet.newClientUrl`.
- Регистрации в Кабинете «с улицы» нет — только по приглашению менеджера. Поэтому на сайте нет кнопки «Зарегистрироваться».
- Сайт не ставит cookie и не подключает аналитику; данные заявки уходят только в CRM RailTech.

## 6. Сборка и проверки

| Команда | Что делает |
|---|---|
| `make install` | `npm ci` |
| `make dev` | локальный сервер `http://localhost:4321/rt-corporate-website/` |
| `make test` | unit-тесты (Vitest): i18n, SEO, форма заявки, навигация |
| `make check` | схема CMS, правила контента (`--ru-only`), `astro check`, сборка, аудит `dist/` |
| `make e2e` | Playwright по собранному сайту: страницы открываются, нет ошибок консоли, кнопки ведут куда нужно, нет горизонтальной прокрутки на телефоне, форма показывает ошибки и успех |
| `make ci` | всё вместе, как в GitHub Actions |

GitHub Pages: база `/rt-corporate-website` (переменная `CUSTOM_DOMAIN` переключает на `railtech.uz`). `main` = прод,
пуш в `main` запрещён, только PR.

## 7. Что не делаем

Не возвращаем каталог позиций и цены на сайт (они в Кабинете). Не вводим вторую навигацию, модальные окна заявки,
слайдеры с автопрокруткой, HUD-декор. Не добавляем аналитику и cookie без обновления `/cookies/` и решения владельца.
Не пишем тексты в коде. Не указываем дилерский статус без документа производителя и не публикуем основание статуса
(показывается клиенту по запросу).
