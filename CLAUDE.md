# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Сайт ООО «RailTech» (Ташкент) рассказывает о компании и её возможностях и приглашает к работе через Кабинет
(`cabinet.railtech.uz`). Каталог, цены и сделки есть только в Кабинете.
Устройство сайта: **`docs/ARCHITECTURE.md`**. Читай его перед любым изменением. Дизайн описан в **`docs/DESIGN.md`**,
правила для агентов в **`AGENTS.md`**.
**Начало сессии:** прочитай `docs/STATUS.md` — где мы сейчас, решения владельца, что ждём и что дальше.
В конце сессии обнови его.

## Стек
- Astro 4 (статическая сборка) + TypeScript. React используется в **одном** острове: `src/components/islands/LeadForm.tsx` (форма заявки → CRM).
- Tailwind нет. Стили компонентов лежат в `<style>` и берутся из токенов `src/styles/tokens.css`.
- Sveltia CMS (`/admin`, схема `public/admin/config.yml`), коллекции `services` и `news` (`src/content/config.ts`).
- Языки: `/…` ru, `/uz/…`, `/en/…`. Страницы лежат в `src/pages/[...lang]/`. Хостинг: GitHub Pages.

## Команды
- `make install`, затем `make dev` (`http://localhost:4321/rt-corporate-website/`)
- `make check`: схема CMS, правила контента, Vitest, `astro check`, сборка, аудит `dist/`. Обязательно после любого изменения.
- `make e2e`: Playwright по собранному сайту (компьютер и телефон). Обязательно после изменения кода.
- `node scripts/check-content.mjs --files <файлы>`: быстрая проверка отдельных файлов контента.
- Остальное: `make test`, `make content`, `make cms`, `make build`, `make ci`, `make help`.
- Один тест Vitest: `npx vitest run tests/lead.test.ts` или `npx vitest run -t "ids are unique"`.
- Один тест Playwright (сначала `make build`: тесты идут по `dist/` через `astro preview` на порту 4329):
  `npx playwright test -g "<название>" --project=phone` (проекты `desktop` и `phone`). CRM в тестах подменён (`page.route`).
  Локальный Chromium задаётся через `PW_CHROMIUM_PATH` (Makefile берёт `/opt/pw-browsers/chromium`, если он есть).
- `npm run build` = `validate-cms-config` (prebuild) → `astro check` → `astro build` → `check-build` (postbuild, аудит `dist/`).
- Хук `PostToolUse` (`.claude/settings.json`) после каждой правки `src/content/**/*.md` и `src/data/cms/**/*.json`
  запускает `check-content --files`. Ошибки о пропущенных UZ/EN, пока перевод не дописан, ожидаемы.

## Как устроен код (то, что не видно из одного файла)
- **Язык берётся из URL.** `src/middleware.ts` кладёт его в `Astro.locals.lang`; острову React язык передаётся пропом `lang`.
  Каждая страница в `src/pages/[...lang]/` экспортирует `getStaticPaths = langStaticPaths` (для `[slug]` — `expandLangs`)
  из `src/i18n/index.ts`.
- **Базовый путь.** Сборка идёт под `/rt-corporate-website`, а при `CUSTOM_DOMAIN` — под `/`. Ссылки и пути к файлам
  не склеиваются вручную: `localeHref(route, lang)` для внутренних ссылок, `withBase()` (`src/utils/url.ts`) для ассетов,
  `localizeHtml()` (`src/utils/markdown.ts`) для ссылок внутри Markdown.
- **Чтение текстов.** Поля контента: `tField(item, 'title', lang)` выбирает `title` / `title_uz` / `title_en`.
  Подписи интерфейса: `translator(lang)` из `src/i18n/ui.ts`, ключи лежат в `src/data/cms/ui/*.json`.
- **Этап перевода** читается из `content-stage.json` в четырёх местах, которые должны вести себя одинаково:
  `src/utils/stage.ts` (`contentLang`, `routeLangs` → noindex и hreflang в `BaseLayout`), фильтр sitemap в
  `astro.config.mjs`, `scripts/check-content.mjs`, `scripts/check-build.mjs`.
- **Две схемы контента** должны совпадать: `src/content/config.ts` (Zod) и `public/admin/config.yml` (CMS).
  Новое поле добавляется в обе, иначе `validate-cms-config` ломает сборку.
- **Заявка.** `LeadForm.tsx` только рисует форму; проверка, сборка запроса и разбор ответа CRM лежат в `src/utils/lead.ts`
  (покрыты `tests/lead.test.ts`). Адреса CRM, Кабинета и Telegram-бота берутся из `src/data/cms/company.json`, а не из env.
  Контракт описан в ARCHITECTURE.md §5.
- **Старые адреса v1** отдаёт `src/pages/[...legacy].astro` по `src/data/legacy-redirects.json` (meta refresh, `noindex`):
  серверных перенаправлений на GitHub Pages нет.
- **CI:** `pr-check.yml` выполняет `make check` и Playwright на каждый PR; `deploy.yml` публикует после мёржа в `main`.

## Стиль «Мост» (подробно в docs/DESIGN.md)
- Белый фон, тёмно-синий текст `--c-ink`, бирюзовый `--c-brand`, оранжевый `--c-accent` (только для декора).
- Шрифты Montserrat (заголовки) и Golos Text (текст), self-hosted. Моноширинного шрифта нет.
- Скругления 6/8/999 px. Цвета только через `var(--…)`, литеральных цветов в компонентах нет.
- Нет HUD-декора, «телеметрии» и псевдотерминальных подписей. WCAG 2.2 AA, цели нажатия ≥ 44 px.

## Золотые правила
1. **Без привязки к отрасли.** RailTech работает с любыми предприятиями. В общих текстах нет «ж/д», серий
   локомотивов, отраслевых каталогов. Отрасль упоминается только в фактах статьи о партнёре или новости.
   Это проверяют `check-content` и `check-build`.
2. **Три языка (кроме новостей).** RU одобрен, в `src/data/content-stage.json` стоят `ruOnly: false` и
   `ruOnlySections: ["news"]`. Новый или изменённый текст вне новостей пишется сразу на RU, UZ (латиница) и EN
   (`_uz`/`_en`, `body_uz`/`body_en`, `uz`/`en` в ui) по GLOSSARY.md; пропуски `check-content` считает ошибками.
   Новости (`src/content/news`) пока только по-русски: их `_uz`/`_en` не заполняй. `content-stage.json` меняет владелец.
3. **Факты не выдумываются**: цены, клиенты, сертификаты, цифры. `dealer` ставится только по документу
   производителя. Основание статуса на сайте не публикуется.
4. **ARCHITECTURE.md первым.** Новое поле, страница или компонент сначала описываются там, в том же PR.
5. **Тексты не пишутся в коде.** Они лежат в `src/data/cms/**` и `src/content/**` (тест «no text in code»).
   Внутренние ссылки в текстах пишутся маршрутом без языка и домена (`/services/supply/`).
6. **Навигация одна:** `src/utils/nav.ts`.
7. **Git:** работа в ветке, PR в `main`. `main` = прод. Не пушь в `main`, не делай force-push.
   Коммиты заканчиваются строками атрибуции, как в истории (`git log -3`).
   Сохранение в `/admin` коммитит прямо в `main`. Разрешения агента рассчитаны на ветки `content/*`.

## Контент
- Регламент в `docs/content/README.md`, там же STYLE_GUIDE, GLOSSARY, SEO, CONTENT_PLAN и шаблоны в `templates/`.
- Скилы: `write-news`, `add-partner`, `add-service`, `edit-site-texts`, затем `content-qa` и `content-pr`.
  `translate-content` переводит UZ/EN (не при `ruOnly: true`; разделы из `ruOnlySections` пропускает).
- Субагенты: `content-writer` выполняет бриф целиком, `content-reviewer` проверяет, `content-translator` переводит UZ/EN (кроме разделов из `ruOnlySections`).
