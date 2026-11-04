# Переезд на railtech.uz (production cutover)

Чек-лист перевода сайта с `https://nzulkaynarov.github.io/rt-corporate-website/` на **`https://railtech.uz`**.
Изменения в репозитории делаются через PR в `main`, прямой пуш в `main` запрещён. Мёрж PR публикует сайт.

## 1. Сборка под домен

`astro.config.mjs` переключается переменной окружения `CUSTOM_DOMAIN`: когда она задана, `site = https://railtech.uz`, `base = /`.
Добавьте её в шаг сборки `.github/workflows/deploy.yml` (отдельный PR):

```diff
       - name: Build static site with Astro (includes CMS schema check and dist audit)
         run: npm run build
+        env:
+          CUSTOM_DOMAIN: "1"
```

Ссылки, canonical, hreflang, sitemap, `robots.txt` и schema.org строятся из `site`/`base` и перестроятся сами.
Перед мёржем проверьте локально:

```bash
CUSTOM_DOMAIN=1 npm run build   # astro check, сборка и аудит dist/ под домен
```

- `dist/index.html`: `<link rel="canonical" href="https://railtech.uz/">`, `og:image` = `https://railtech.uz/og-cover.png`.
- `dist/sitemap-0.xml`: все адреса начинаются с `https://railtech.uz/`. Пока `ruOnly: true`, в sitemap только русские страницы.
- `dist/robots.txt` указывает на `https://railtech.uz/sitemap-index.xml`.

Тесты Playwright (`make e2e`) рассчитаны на базу `/rt-corporate-website/`, поэтому их запускают без `CUSTOM_DOMAIN`.

## 2. Домен в GitHub Pages и DNS

1. Репозиторий → Settings → Pages → Custom domain: `railtech.uz`, затем включить «Enforce HTTPS» после выпуска сертификата.
   Сайт публикуется через GitHub Actions, поэтому домен задаётся в настройках, файл `public/CNAME` не нужен.
2. DNS у регистратора:
   - `A @` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME www` → `nzulkaynarov.github.io.`
3. Дождитесь проверки домена в Settings → Pages и выпуска сертификата.

## 3. Форма заявки: CORS на платформе

Форма отправляет заявку в CRM (`company.json → leadEndpoint`, по умолчанию `https://crm.railtech.uz/api/v1/leads/web`).
CRM принимает запросы только с разрешённых адресов (ARCHITECTURE.md §5).

- В репозитории платформы `nzulkaynarov/RailTech_Platform`, файл `infra/compose/prod.yml`: добавить `https://railtech.uz`
  (и `https://www.railtech.uz`, если он открывается без переадресации) в `CABINET_ORIGIN`. Это отдельный PR в платформу.
- После выката проверить на railtech.uz: форма получает токен (`GET …/token`) и отправляет заявку (`202`), заявка появляется
  в очереди CRM с источником «сайт».
- Пока CORS не настроен, форма при ошибке сети показывает запасные каналы: Telegram, телефон, e-mail, `cabinet.newClientUrl`.

## 4. Telegram-бот

В `src/data/cms/company.json → telegramBot` сейчас стоит тестовый бот (`railtech_test_bot`). Замените его на имя рабочего
бота CRM (без `@`) по указанию владельца, PR через скил `edit-site-texts`. Проверьте ссылку `t.me/<бот>?start=web` на сайте.

## 5. Поисковые системы

1. Google Search Console и Яндекс Вебмастер: подтвердить `https://railtech.uz` и отправить `https://railtech.uz/sitemap-index.xml`.
2. Через 1–2 недели проверить индексацию русских страниц. Страницы UZ/EN до перевода закрыты `noindex`, это ожидаемо.

## 6. После перевода UZ/EN

Когда владелец примет русскую версию и проход перевода смёржен:

1. Владелец переключает `src/data/content-stage.json` → `"ruOnly": false` (PR).
   Страницы `/uz/…` и `/en/…` получают индексацию, hreflang ru/uz/en и попадают в sitemap. Появляется переключатель языка.
   С этого момента `check-content` считает непереведённые поля материалов ошибкой, а аудит `dist/` требует hreflang для всех языков.
2. Отправить sitemap повторно в Search Console и Вебмастер и проверить hreflang в отчётах.
