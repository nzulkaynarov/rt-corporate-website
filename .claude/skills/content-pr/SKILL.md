---
name: content-pr
description: Publish RailTech content changes for human review — content branch, conventional commit with the repository's attribution lines, push and a pull request filled from the repository template. Never pushes to main or force-pushes. Use when content is ready and checked (after content-qa).
---

# Отправить контент на проверку (PR)

1. **Ветка.** Если ты на `main`, выполни `git switch -c content/<тип>-<slug>` (тип: `news`, `partner`, `service`, `texts`,
   `translation`). Никогда не коммить в `main`, не используй `--force` и `git reset --hard`.
2. **Проверки зелёные.** Пройден скил `content-qa`: `make check` без ошибок (для кода ещё `make e2e`).
3. **Состав.** `git status`. В коммит идёт только контент: `src/content/**`, `src/data/cms/**`, `public/images/**`,
   `docs/content/**`. `dist/`, `test-results/`, `.env` не коммитятся. `src/data/content-stage.json` меняет только владелец.
4. **Коммит:** `content(<раздел>): <что> (RU)`, например `content(news): TSTU conference 2026 (RU)`.
   Сообщение заканчивается строками атрибуции в том же формате, что в истории репозитория (`git log -3`).
5. **Push:** `git push -u origin <ветка>`.
6. **PR** в `main` по `.github/pull_request_template.md`: что добавлено (URL), **источники фактов**, **открытые вопросы**
   (нет фото, нужно подтверждение цифр или разрешение клиента, термин глоссария на проверку), результаты `make check`.
   В конце описания стоят строки атрибуции для PR, если они заданы в сессии.
7. PR проверяет человек. Мёрж в `main` публикует сайт (GitHub Actions). Свой PR не мёржи.
