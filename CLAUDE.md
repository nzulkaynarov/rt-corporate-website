# CLAUDE.md: инструкции Claude Code для railtech.uz

Сайт ООО «RailTech» (Ташкент) рассказывает о компании и её возможностях и приглашает к работе через Кабинет
(`cabinet.railtech.uz`). Каталог, цены и сделки есть только в Кабинете.
Устройство сайта: **`docs/ARCHITECTURE.md`**. Читай его перед любым изменением. Дизайн описан в **`docs/DESIGN.md`**,
правила для агентов в **`AGENTS.md`**.

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

## Стиль «Мост» (подробно в docs/DESIGN.md)
- Белый фон, тёмно-синий текст `--c-ink`, бирюзовый `--c-brand`, оранжевый `--c-accent` (только для декора).
- Шрифты Montserrat (заголовки) и Golos Text (текст), self-hosted. Моноширинного шрифта нет.
- Скругления 6/8/999 px. Цвета только через `var(--…)`, литеральных цветов в компонентах нет.
- Нет HUD-декора, «телеметрии» и псевдотерминальных подписей. WCAG 2.2 AA, цели нажатия ≥ 44 px.

## Золотые правила
1. **Без привязки к отрасли.** RailTech работает с любыми предприятиями. В общих текстах нет «ж/д», серий
   локомотивов, отраслевых каталогов. Отрасль упоминается только в фактах статьи о партнёре или новости.
   Это проверяют `check-content` и `check-build`.
2. **Только русский (RU-first).** В `src/data/content-stage.json` стоит `ruOnly: true`. Не заполняй и не переводи
   `_uz`/`_en`/`body_uz`/`body_en`. Перевод начинается после того, как владелец одобрит RU и переключит `ruOnly`.
3. **Факты не выдумываются**: цены, клиенты, сертификаты, цифры. `dealer` ставится только по документу
   производителя. Основание статуса на сайте не публикуется.
4. **ARCHITECTURE.md первым.** Новое поле, страница или компонент сначала описываются там, в том же PR.
5. **Тексты не пишутся в коде.** Они лежат в `src/data/cms/**` и `src/content/**` (тест «no text in code»).
   Внутренние ссылки в текстах пишутся маршрутом без языка и домена (`/services/supply/`).
6. **Навигация одна:** `src/utils/nav.ts`.
7. **Git:** работа в ветке, PR в `main`. `main` = прод. Не пушь в `main`, не делай force-push.
   Коммиты заканчиваются строками атрибуции, как в истории (`git log -3`).

## Контент
- Регламент в `docs/content/README.md`, там же STYLE_GUIDE, GLOSSARY, SEO, CONTENT_PLAN и шаблоны в `templates/`.
- Скилы: `write-news`, `add-partner`, `add-service`, `edit-site-texts`, затем `content-qa` и `content-pr`.
  `translate-content` запускается только после одобрения RU.
- Субагенты: `content-writer` выполняет бриф целиком, `content-reviewer` проверяет, `content-translator` переводит после одобрения RU.
