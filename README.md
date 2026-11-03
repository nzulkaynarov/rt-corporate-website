# RailTech — корпоративный B2B/B2G портал (railtech.uz)

Официальный сайт **ООО «RailTech»** (Ташкент, Республика Узбекистан): каталог железнодорожных
комплектующих и промышленного оборудования, услуги (импорт под ключ DDP, сорсинг, IT), проекты и блог.

* **Стек:** Astro 4 (статическая генерация) + React-острова + Tailwind CSS + TypeScript, хостинг GitHub Pages.
* **Три языка — три набора URL:** `/…` русский, `/uz/…` узбекский (латиница), `/en/…` английский;
  hreflang, canonical, sitemap и schema.org генерируются автоматически.
* **Без текста в коде:** весь контент и подписи интерфейса — в `src/content/` и `src/data/cms/`,
  редактируются в админке `/admin/` (Sveltia CMS) или ИИ-агентами через pull request.

## Команды

```bash
npm install
```

```bash
npx astro dev --port 4321
```

```bash
npm run build
```

`npm run build` — проверка схемы CMS → `astro check` → сборка → аудит SEO/i18n готовых страниц.
`npm run check:content` — проверка контента (переводы, глоссарий, медиа, заглушки).

## Как пополнять сайт

| Кто | Как |
|---|---|
| Редактор | `/admin/` → вход через GitHub → правка → «Save» (публикуется после сборки) |
| ИИ-агент | Бриф (issue «Новый контент») → правила [`docs/content/`](./docs/content/README.md) → PR на проверку |
| Разработчик | [`AGENTS.md`](./AGENTS.md) (архитектура, i18n, правила) и [`CLAUDE.md`](./CLAUDE.md) |

Для Claude Code в репозитории готовы скилы, субагенты и настройки (`.claude/`): например,
«добавь товар … по брифу» запускает скил `add-product`, проверку и подготовку PR.

## Документация

* [`docs/content/`](./docs/content/README.md) — регламент контента: стиль, глоссарий RU/UZ/EN, SEO, шаблоны.
* [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — устройство проекта.
* [`PRODUCTION_CUTOVER.md`](./PRODUCTION_CUTOVER.md) — переезд на домен railtech.uz.
