---
name: content-pr
description: Publish RailTech content changes for human review — content branch, conventional commit, push and a pull request filled from the repository template. Never pushes to main. Use when content is ready and checked (after content-qa).
---

# Отправить контент на проверку (PR)

1. Ветка: если ты на `main` — `git switch -c content/<тип>-<slug>` (тип: product, service, project,
   blog, texts, translation). Никогда не коммить в `main` и не используй `--force`.
2. Убедись, что проверки зелёные: скил `content-qa` (минимум `npm run check:content -- --strict` и `npm run build`).
3. `git status` — в коммит только контент: `src/content/**`, `src/data/cms/**`, `public/images/**`,
   `public/docs/**`, `docs/content/GLOSSARY.md`. `dist/` не коммитится.
4. Коммит: `content(<коллекция>): <что> (RU/UZ/EN)`, например
   `content(catalog): add RT-RS-120 wheelset RU1Sh-957-G (RU/UZ/EN)`.
5. `git push -u origin <ветка>`.
6. PR в `main` по `.github/pull_request_template.md`: что добавлено (ссылки на будущие URL на трёх
   языках), **источники фактов**, **открытые вопросы** (нет фото, не подтверждена цена, новый термин
   в глоссарии на проверку носителем), результат проверок.
7. PR проверяет человек; мёрж в `main` = публикация на сайте (GitHub Actions). Сам свой PR не мёржи.
