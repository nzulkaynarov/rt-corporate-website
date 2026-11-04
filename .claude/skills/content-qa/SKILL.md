---
name: content-qa
description: Quality-check RailTech content changes before a PR — automated checks (make check, check-content on the changed files) plus an editorial review against the style guide (voice, industry-neutral positioning, one promise one place), facts policy, RU-first stage, glossary and SEO rules. Use after creating or editing any content, or to review someone else's content PR.
---

# Проверка контента перед PR

Объект проверки: $ARGUMENTS (по умолчанию изменения ветки: `git diff --name-only origin/main...HEAD`).

## 1. Автоматика (всё должно быть зелёным)

```bash
node scripts/check-content.mjs --files <изменённые файлы>
make check
```
`make check` включает схему CMS, правила контента (этап RU-first, глоссарий, позиционирование, ссылки, медиа),
Vitest (связи данных, «no text in code»), `astro check`, сборку и аудит `dist/` (язык страниц, ссылки, title и description,
H1, alt, отраслевые слова вне `/news/`). Ошибки исправь. Предупреждения по своим файлам исправь или объясни в PR.
«no cover photo» допустимо. Если менялся код, запусти ещё `make e2e`.

## 2. Редакторская проверка (по каждому изменённому файлу)

- [ ] **Факты** (STYLE_GUIDE §3): каждая цифра, дата, имя, должность, статус взяты из брифа или источника, источники указаны.
      Цен нет. Основания дилерского статуса (номер, дата документа) нет. `dealer` стоит только при документе.
- [ ] **Позиционирование** (STYLE_GUIDE §2): в общих текстах нет отрасли. В новостях и статьях о партнёрах отрасль дана только как факт.
- [ ] **Голос:** короткие предложения, нет эпитетов, «!», канцелярита, псевдотерминальных подписей. Одно обещание живёт в одном месте.
      Подписи действий: «Начать работу», «Отправить заявку», «Войти в Кабинет».
- [ ] **RU-first:** пока `ruOnly: true`, нет новых `_uz`/`_en`, `content-stage.json` не тронут.
- [ ] **SEO** (SEO.md): title ≤ 60, description 70–160 (или поля пусты), `summary` 70–300, slug не изменён,
      внутренние ссылки являются маршрутами и ведут на существующие страницы.
- [ ] **Медиа:** своё фото или фото с разрешения, файл существует, разумный размер, `coverAlt` есть.
- [ ] **Объём:** изменены только `src/content/**`, `src/data/cms/**`, `public/images/**`, `docs/content/**`.
      Если тронут код или структура, ARCHITECTURE.md обновлён в том же PR.

## 3. Визуально (по возможности)

`make e2e` или `npx astro preview` после `make build`. Открой изменённые страницы на компьютере и телефоне (≤ 760 px):
текст помещается, ссылки работают, нет горизонтальной прокрутки.

Итог: список «исправлено» и «открытые вопросы для владельца». Ошибки исправь до PR.
