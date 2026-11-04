# Контент RailTech: правила для ИИ-агентов и редакторов

Регламент наполнения сайта railtech.uz (v2 «Мост»). Обязателен для всех: людей и любых ИИ-агентов.
Какие страницы и поля существуют, определяет [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md). Здесь описано, как их заполнять.

| Документ | О чём |
|---|---|
| [STYLE_GUIDE.md](./STYLE_GUIDE.md) | голос, позиционирование, факты, форматы |
| [GLOSSARY.md](./GLOSSARY.md) | термины RU / UZ / EN и запрещённые варианты |
| [SEO.md](./SEO.md) | title, description, slug, внутренние ссылки, этап RU-first |
| [CONTENT_PLAN.md](./CONTENT_PLAN.md) | что делаем сейчас и что нужно от владельца |
| [templates/](./templates/) | `news.md`, `partner-article.md`, `service.md` |

## 1. Где что лежит

| Тип | Файл | URL | Скил |
|---|---|---|---|
| Новость, статья, проект | `src/content/news/<slug>.md`, `type: news / article / project` | `/news/<slug>/` | `write-news` |
| Статья о партнёре | `src/content/news/<slug>.md`, `type: partner`, `partners: [<id>]` | `/news/<slug>/` | `add-partner` |
| Плитка партнёра | `src/data/cms/partners.json` | главная | `add-partner` |
| Услуга (4: `supply`, `engineering`, `representation`, `localization`) | `src/content/services/<slug>.md` | `/services/<slug>/` | `add-service` |
| Реквизиты, контакты, ссылки Кабинета, цифры | `src/data/cms/company.json` | все страницы | `edit-site-texts` (только по указанию владельца) |
| Тексты главной | `src/data/cms/home.json` | `/` | `edit-site-texts` |
| Заголовки и вводные страниц «Услуги», «Новости», «Контакты», 404 | `src/data/cms/pages.json` | эти страницы | `edit-site-texts` |
| Политика, условия, cookies | `src/data/cms/legal.json` | `/privacy/`, `/terms/`, `/cookies/` | `edit-site-texts` |
| title и description страниц | `src/data/cms/seo.json` | все страницы | `edit-site-texts` |
| Кнопки и подписи | `src/data/cms/ui/*.json` (`{ key, ru, uz, en }`) | все страницы | `edit-site-texts` |
| Обложки | `public/images/news/<slug>.jpg` или загрузка через `/admin` (`public/images/uploads/`) | — | — |

Схема полей описана в `src/content/config.ts` (её принимает сайт) и `public/admin/config.yml` (её видит редактор в `/admin`).
Поле, которого нет в `config.yml`, **удаляется** при первом сохранении записи из админки. Новые поля добавляются
только через ARCHITECTURE.md и задачу разработки.

## 2. Языки: этап RU-first

- Каждое текстовое поле существует в трёх вариантах: `title` (русский, обязательный), `title_uz`, `title_en`. Тело материала:
  русский Markdown под front matter, `body_uz`/`body_en` в YAML.
- **Сейчас `src/data/content-stage.json` → `"ruOnly": true`.** Пишем и правим только русский. Поля `_uz`/`_en`
  не заполняем и не переводим, а при правке RU не удаляем уже существующие. Пустой перевод означает, что сайт покажет русский.
  `check-content` считает такие поля, но не падает. Страницы UZ/EN закрыты от индексации.
- Перевод выполняется одним проходом после того, как владелец примет русскую версию и сам переключит `ruOnly` на `false`.
  Только тогда используются скил `translate-content` и агент `content-translator`.

## 3. Процесс

1. **Бриф.** Issue «Новый контент для сайта» или сообщение. Выпиши, что публикуем, факты, источники и фото.
   Чего не хватает, спрашивай, а не придумывай (STYLE_GUIDE §3).
2. **ARCHITECTURE.md.** Если задача требует нового поля, страницы или раздела, сначала правится он. Обычный материал этого не требует.
3. **Ветка** `content/<тип>-<slug>` от свежего `main`. В `main` не коммитим.
4. **Черновик RU** по шаблону из `templates/` и скилу нужного типа.
5. **Проверка:** `node scripts/check-content.mjs --files <файлы>` во время работы, перед PR `make check`.
   Ошибок быть не должно. Предупреждения исправь или объясни в PR. Предупреждение «no cover photo» допустимо:
   обложка необязательна.
6. **PR** в `main` по `.github/pull_request_template.md`: что добавлено, источники фактов, открытые вопросы.
   Проверяет человек (и/или агент `content-reviewer`). Мёрж означает публикацию.

## 4. Что агенту нельзя

- Коммитить в `main`, делать `push --force`, мёржить свои PR.
- Менять код (`src/pages`, `src/components`, `src/layouts`, `src/utils`, `src/i18n`, `scripts`, конфиги) в контентной задаче.
- Заполнять `_uz`/`_en` или менять `content-stage.json` на этапе RU-first.
- Писать в общих текстах отрасль, «ж/д», серии локомотивов (STYLE_GUIDE §2).
- Придумывать цены, клиентов, сертификаты, цифры, сроки, отзывы. Публиковать основание дилерского статуса.
- Возвращать на сайт каталог, цены, SKU, наличие. Это Кабинет.
- Менять реквизиты в `company.json` без прямого указания владельца.
- Переименовывать или удалять опубликованные записи, ключи `ui/*.json`, `id` партнёров. Если без этого не обойтись,
  нужна прямая просьба и строка в `src/data/legacy-redirects.json`.
- Копировать тексты и фото производителей и других сайтов без права использования. Пересказываем своими словами,
  источник указываем в разделе «Источники».
