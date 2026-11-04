# railtech.uz: сайт ООО «RailTech»

Сайт компании ООО «RailTech» (Ташкент). Он рассказывает о компании и её возможностях и приглашает к работе
через Кабинет [cabinet.railtech.uz](https://cabinet.railtech.uz). Каталог позиций, цены, сделки и документы
ведутся в Кабинете и CRM платформы RailTech, на сайте их нет.

- **Страницы:** главная, услуги (заказчикам и партнёрам, 4 услуги), новости (новости, статьи, проекты,
  статьи о партнёрах), контакты с формой заявки, сервисные страницы.
- **Стек:** Astro 4 (статическая сборка), TypeScript, один React-остров (форма заявки), Sveltia CMS в `/admin/`.
  Tailwind нет, стиль «Мост» построен на CSS-токенах.
- **Языки:** `/…` русский, `/uz/…` узбекский, `/en/…` английский. Сейчас идёт этап RU-first: страницы UZ/EN
  показывают русский текст и закрыты от индексации, пока владелец не одобрит русскую версию и не закажет перевод.

## Быстрый старт

```bash
make install   # npm ci
make dev       # http://localhost:4321/rt-corporate-website/
make check     # схема CMS, правила контента, unit-тесты, astro check, сборка, аудит dist/
make e2e       # браузерные тесты собранного сайта (компьютер и телефон)
```

`make help` показывает все цели. В CI на каждый PR запускается `make check` и Playwright.

## Структура

```
docs/ARCHITECTURE.md      страницы, данные, компоненты, связь с Кабинетом и CRM: главный документ
docs/DESIGN.md            стиль «Мост»: токены, шрифты, компоненты, телефон, доступность
docs/content/             правила контента (стиль, глоссарий, SEO, план, шаблоны)
src/content/              коллекции services и news (Markdown)
src/data/cms/             тексты и настройки сайта (JSON), редактируются в /admin
src/data/content-stage.json  этап переводов (ruOnly)
src/pages/[...lang]/      страницы для ru / uz / en
src/components/, src/styles/  компоненты и токены дизайна
public/admin/config.yml   схема CMS
scripts/                  проверки контента, сборки и схемы CMS
tests/                    Vitest и Playwright (tests/e2e)
```

## Как менять сайт

| Кто | Как |
|---|---|
| Редактор | `/admin/` → вход через GitHub → правка → «Save». Сохранение попадает в `main` и публикуется после сборки |
| ИИ-агент | [`AGENTS.md`](./AGENTS.md), правила [`docs/content/`](./docs/content/README.md), работа в ветке и PR на проверку |
| Разработчик | сначала [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md), потом код, `make check && make e2e`, PR |

Бриф на новый материал оформляется через issue «Новый контент для сайта».

## Публикация

GitHub Pages. Пуш в `main` (мёрж PR) запускает `.github/workflows/deploy.yml`: тесты, сборка, публикация.
Прямой пуш в `main` и force-push запрещены, изменения идут только через PR.

Пока сайт открывается по адресу `https://nzulkaynarov.github.io/rt-corporate-website/`. При заданной переменной
окружения `CUSTOM_DOMAIN` сборка идёт под `https://railtech.uz` с базой `/`.
Переезд на домен описан в [`PRODUCTION_CUTOVER.md`](./PRODUCTION_CUTOVER.md).

## Документация

- [`docs/STATUS.md`](./docs/STATUS.md): состояние работ, решения владельца, следующие шаги, живой запуск
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md): что есть на сайте и откуда данные
- [`docs/DESIGN.md`](./docs/DESIGN.md): как это выглядит
- [`docs/content/`](./docs/content/README.md): как писать и публиковать материалы
- [`AGENTS.md`](./AGENTS.md), [`CLAUDE.md`](./CLAUDE.md): правила для ИИ-агентов
- [`PRODUCTION_CUTOVER.md`](./PRODUCTION_CUTOVER.md): переезд на railtech.uz
