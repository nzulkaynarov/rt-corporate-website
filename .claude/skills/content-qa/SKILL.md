---
name: content-qa
description: Quality-check RailTech content changes before a PR — automated checks (check:content strict, CMS validation, build with SEO/i18n audit) plus an editorial review against the style guide, glossary, facts policy and SEO rules. Use after creating or editing any content, or to review someone else's content PR.
---

# Проверка контента перед PR

Объект проверки: $ARGUMENTS (по умолчанию — изменения ветки: `git diff --name-only origin/main...HEAD`).

## 1. Автоматика (всё должно быть зелёным)

```bash
npm run check:content -- --strict
npm run build
```
`build` включает валидацию схемы CMS (prebuild), `astro check` и аудит готовых страниц
(postbuild `check-build`: язык страниц, ссылки, title/description, H1, alt, непереведённые страницы).
Предупреждения `check-build` по затронутым страницам тоже исправить.

## 2. Редакторская проверка (вручную, по каждому изменённому файлу)

- [ ] **Факты** (STYLE_GUIDE §2): каждая цифра, цена, наличие, сертификат, клиент — из брифа или
      источника; источники перечислены для PR. Ничего не выдумано.
- [ ] **Перевод:** UZ/EN передают тот же смысл, не подстрочник; термины по GLOSSARY; числа/модели совпадают с RU.
- [ ] **Стиль:** без «лучший/уникальный/№1», без «!», без канцелярита; структура по STYLE_GUIDE §5.
- [ ] **SEO:** главный запрос в title и первом абзаце на каждом языке; title ≤ 60; description 70–160;
      2–5 внутренних ссылок в статьях; slug по правилам и не изменён у существующих записей.
- [ ] **Медиа:** реальные фото, файлы существуют, разумный размер (`du -h public/images/...`), нет чужих
      материалов без права использования.
- [ ] **Объём изменений:** только контент (`src/content`, `src/data/cms`, `public/images`, `public/docs`,
      `docs/content/GLOSSARY.md`). Код не тронут.

## 3. Визуальная проверка (по возможности)

`npx astro preview` после сборки и открыть страницы на трёх языках (`/…`, `/uz/…`, `/en/…`):
текст помещается, фото на месте, ссылки работают.

Итог: список «исправлено» / «открытые вопросы для человека». Ошибки исправь до PR.
